---
title: '消息是地图，不是领土'
date: '2026-06-10T20:47:26+08:00'
description: '节点之间传递信息，Push 传指针，Pull 取内容——消息是地图，不是领土。Self-describing 让下游自己理解，Requirement-driven 让上游按需生产。两种模式各有代价，在 Agent 系统里真正重要的是选一种，贯彻到底。'
topics: ['agentic-workflow']
---

最近在搭 workflow 的时候，发现自己在反复纠结一个问题：节点 A 干完了，它的产出怎么传给节点 B？

听起来不像个问题。你把 A 的输出文件路径告诉 B，B 去读，不就完了？

但试了几次之后发现，这个"不就完了"的决定，会把整个 workflow 的 context 管理带向完全不同的方向。

## 两个直觉答案，都不对

第一个直觉：把 A 的所有产出都放进传给 B 的消息里。A 写了什么文件、产生了什么中间结果、做了什么关键决策——全打包，B 拿到消息就知道一切。

问题是 context。A 可能产出了 10MB 的数据文件、三份中间分析、五轮方案对比。全塞进消息里，B 的 context 在开始干活之前就已经被撑满了。而且 B 可能只需要其中一个小文件——剩下的 9.9MB 都是噪声。

第二个直觉：只告诉 B 去 A 的输出目录里找。B 知道自己需要什么，让它自己去翻。

问题是搜索。B 面对一个目录树，不知道里面有什么、哪个文件是干什么用的、应该先看什么。它开始盲搜——打开一个文件，不对，关上，再打开下一个。每一步都是 tool call，每一轮都在烧 token，而且没有方向。

两个答案，一个导致 context 过载，一个导致盲目搜索。

我后来意识到，这两个答案对应的是信息传递的两个极端：**全量推送**和**全部不推**。而真正需要的，是两者之间的一个东西。

## Push 和 Pull，各干各的

花时间想清楚之后，我把它拆成了两层。

**第一层：Push（消息）。** A 执行完，产出一条结构化的消息，这条消息进入 B 的 context。但消息里不放完整产出——只放"怎么找到产出"的信息：

- artifact 在哪（路径）
- 里面有什么（高层概览，像 skill 的 description）
- 怎么用（先看 README 了解全貌，再按需取用）

消息是指针，不是数据。消息告诉 B "门在哪，里面大致有什么"，但不替 B 把门推开。

**第二层：Pull（artifact）。** 实际的产出物放在一个 self-describing 的目录里。B 拿到 push 消息后，自己去翻 artifact——从 README 开始，了解全貌，然后按需加载需要的文件。artifact 的内容不自动进入 context，B 决定读什么、什么时候读。

这两层各自解决一个问题。Push 解决的是 B 需要知道"有什么"，Pull 解决的是 B 需要获取"具体内容"。Push 的内容进入 context（因为 B 必须知道），Pull 的内容不进 context（因为 B 只需要知道怎么找到它）。

一个直觉的类比：图书馆的检索系统和书架。Push 消息是检索卡片——告诉你哪本书在哪个书架、大致讲什么。artifact 是书架上的书——你想看哪本就去拿，不需要把所有书搬到桌上。

这个区分看起来很细，但在实际运行中影响很大。一个 B 节点，拿到 push 消息之后发现它只需要上游 artifact 里的某一个数据文件。它读 README，找到那个文件，加载，开始干活。artifact 目录里另外 9MB 的文件从来没有进入过 B 的 context。

如果用的是全量推送，这 9MB 已经在 context 里了——占用空间、稀释注意力、增加 token 消耗。

## artifact 不能是一堆文件的随意堆放

这里有一个前提：artifact 目录不是一堆文件的随意堆放。如果 B 打开 artifact 目录看到的是 `output1.json`、`temp.csv`、`analysis-v3.md`，它还是得盲搜。

所以 artifact 必须是 self-describing 的。至少包含一个 README.md，作为 map of content——告诉下游 agent 这个目录里有什么文件、各自是什么作用、按什么顺序阅读。一个下游 agent 的标准操作应该是：先读 README，了解全貌，再决定加载哪些文件。

这就是 agent output 应该是 self-describing 的——不只是为了人可读，更是因为它是下游 agent **导航** artifact 的唯一入口。没有 README 的 artifact 目录，对于 agent 来说就是 blind search。

至于要不要再加一个 manifest.yaml 做结构化索引，让下游 agent 可以直接用 tool call 精确读取——我觉得方向是对的，但可以先从 README 开始，等实践中发现 README 导航不够精确的时候再补。

## 执行级颗粒度：同一节点，不同执行，不同目录

还有一个一开始容易被忽略的细节：artifact 的最小颗粒度是什么？

直觉答案是**按节点**。build 节点的 artifact 放 `/artifacts/build/`，test 节点的放 `/artifacts/test/`。干净、简单。

直到 build 节点要重试。

第一次执行失败了，第二次执行成功了。按节点存储的话，第二次的 artifact 覆盖了第一次的。你想对比两次执行哪里不一样——对不起，第一次的已经没了。

正确的颗粒度是**按执行**。`/artifacts/build/run-001/`、`/artifacts/build/run-002/`。同一个节点，不同执行，不同目录。

这个选择影响三件事：

**重试调试。** 第一次失败第二次成功，把两次的 artifact 拿出来 diff——中间结果差在哪、工具调用路线差在哪、是不是某个输入解释不同。这些是定位问题的关键信号，节点级存储直接把它碾碎了。

**审计。** 生产环境里你会被问到"周二下午两点那次 deploy 到底产出了什么"。执行级目录可以通过时间戳和 run ID 直接定位。节点级目录只能告诉你最后一次执行产出了什么——前面的历史都蒸发了。

**并行执行。** 如果同一个节点类型要在不同输入上并行跑（比如同时 build 三个组件），节点级目录就是 race condition。执行级目录天然冲突自由。

目录命名需要稳定的约定——`run-001` 这种序列号不够好，因为并行执行时你没法保证谁先拿到 001。时间戳前缀 + 唯一标识是更安全的选择，也能让下游节点从 push 消息里直接拼出 artifact 路径。

## 整个 workflow 也是一个 artifact

如果每个节点都有 artifact，那整个 workflow 也可以有一个全局 artifact 目录。

它本质上是一个目录，里面是所有节点的 artifact 子目录。额外放一个全局 README.md，做整个 workflow 产出的 self-description。还可以放一个执行状态文件——当前进度、哪个节点成功了哪个失败了、出了什么问题。

这个设计让 workflow 的执行状态变成了 artifact 的自然组成部分，不需要单独的监控系统去追踪。你想知道一个 workflow 跑到哪了——去看它的 artifact 目录。你想知道某个节点上次执行产出了什么——去看对应的子目录。所有东西都在一个地方，self-describing，可以被人或 agent 查阅。

这也意味着 workflow 的 artifact 目录可以在 workflow 跑完之后继续存在——它是这次执行的完整记录，不需要额外的持久化机制。

## 还有一个完全相反的思路

写到这儿，我觉得 self-describing 的模式已经自洽了——上游负责文档化，下游负责理解，各司其职。

然后我听到了另一种做法。

下游节点在启动之前，直接声明它需要什么："我需要 A、B、C 三份文件，格式分别是 X、Y、Z。" 这个声明被注入到上游节点的 prompt 里——不是建议，是要求。上游必须产出 A、B、C，少一个就在 gate check 被拒绝，打回重做。

这和 self-describing 的逻辑完全相反。Self-describing 是**上游产出什么，下游适应什么**。这种做法是**下游需要什么，上游提供什么**。兼容的负担从接收方移到了生产方。

一开始我觉得这太僵硬了。每个节点都要精确声明对上游的需求，节点之间的耦合度直接拉满。上游换了个实现方式导致输出文件结构变了——对不起，下游的 requirement 你没满足，驳回。

但后来发现，这个判断忽略了一个前提：你完全可以不把 requirement 硬编码在上游节点的逻辑里。下游的输入要求作为 prompt 的一部分注入到上游——上游在干活的时候就知道"下游需要 A、B、C"，它自己决定怎么产出这些文件。耦合不是代码级的，是契约级的。两个节点之间没有共享任何实现细节，只共享了一个"交付物清单"。

两种模式，一个向内，一个向外。Self-describing 是**内向兼容**——你做好自己的事，写好文档，相信别人能看懂。requirement-driven 是**外向要求**——你说清楚你要什么，别人必须给你。

## 两种哲学，一个镜像

有意思的是，这个区分在人类协作里也有精确的对应。

Self-describing 模式像是一个独立自由的人——我干我的活，产出放在那里，写清楚说明，你自己来看。你遇到理解困难，是你需要多读几遍 README。摩擦由接收方消化。

Requirement-driven 模式像是一个敢提要求的人——我需要什么，说清楚，你做。你没做到，返工的是你，不是我。摩擦由生产方消化。

在人的组织里，这两种模式常常不对称地共存。一个有话语权的资深工程师可以对下游交付松散的文档，但对上游要求精确的输入——"我的 README 你自己看"，同时"你的输出格式不对，重做"。权力决定了谁承担兼容成本，不是规则。

但在 agent 系统里，没有资深和初级，没有上级和下级。只有节点。每个节点既是上游也是下游。如果你配置所有节点都用 self-describing 模式，每个节点都要读别人的 README，也被别人读。如果你配置所有节点都用 requirement-driven 模式，每个节点都要满足下游的要求，也可以给上游提要求。总负担是对称的。

系统属性里真正重要的是**一致性**，不是选了哪种模式。不一致——有些节点要求精确输入但产出松散文档——在人的组织里可能有权力关系兜底，在 agent 系统里就是纯架构债。

## 这两条路，在更大的图景里

这个区分不是新问题。分布式系统领域已经争论了五十年。

1981 年 Jon Postel 提出鲁棒性原则："Be conservative in what you do, be liberal in what you accept." 你严谨地产出，宽容地接受。兼容负担在接收方。这就是 self-describing 的理论源头。

但 2018 年 CACM 发了一篇重要文章重新审视这个原则，核心批评是："be liberal in what you accept" 会让整个生态系统慢慢积累对畸形消息的容忍——每个下游都在默默修补上游的不规范，没有人去修上游本身。复杂性债务被均摊到了所有消费者身上。这就是 requirement-driven 的理论支撑：如果下游不接受不完整的输出，上游就必须修。

工业界的两条路线也很清楚。Consumer-Driven Contracts（Pact 框架）把 requirement-driven 做成了可执行的 CI 流程——消费者定义期望，提供者必须通过验证才能部署。2026 年已经有团队把这个模式搬到 agent 通信上。Agent Output Contracts 的实践者说得更直白："A schema in a README is a suggestion. A schema in code is a constraint."

而 Claude Code 的 subagent 机制、Google ADK 的 handle pattern，走的是 self-describing 的路——上游产出自由格式，下游自己去理解。

大框架也在选边。Microsoft Agent Framework 的 executor 之间是 type-safe message routing，Dagster 的 asset 之间是显式类型依赖，Temporal 的 activity 之间是强类型契约——这些是 requirement-driven。而 Claude Code subagent 返回自然语言消息，Google ADK 默认只给下游轻量引用——这些是 self-describing。

production 的实践是 hybrid：DAG 的边上跑 typed contract，节点内部跑 agent 自由推理。

不过，在所有这些之前，最早也最激烈的一次对决，不是发生在分布式系统领域，而是发生在浏览器里。

1990 年代末到 2000 年代初，XHTML 试图用 XML 的严格性来约束 HTML——标签必须正确闭合，属性必须小写，一个语法错误就拒绝渲染。这是典型的 requirement-driven：生产者必须输出符合规范的文档，否则消费者不买账。

这个方案在技术上自洽，但有一个致命缺陷：它要求互联网上所有写 HTML 的人——从专业开发者到用 FrontPage 拖拽的业余爱好者——都严格遵守 XML 规范。只要一个人出错，他的页面就不显示。XHTML 把兼容成本放在了每一个内容生产者身上。

HTML5 走了完全相反的路。它没有要求所有人写正确的 HTML，而是把浏览器怎么做错误恢复写进了规范——对，规范里明确写了"遇到这种情况，浏览器应该这样处理"。Ian Hickson 在设计 HTML5 parser 的时候做过调查：现实中 95% 以上的网页包含语法错误。与其要求全世界改正这些错误，不如让浏览器学会处理它们。

这就是 self-describing 的极致形态：不是"上游写 README 让下游理解"，而是"上游可以写错的，下游自己修复"。兼容成本全在消费者（浏览器）身上。

结果呢？XHTML 死了。HTML5 赢了。Web 成了人类历史上最大的内容生态系统。

这个故事有意思的地方在于，HTML5 的做法在当时的软件工程界是受鄙视的。"严格验证、拒绝不合规数据"是正直的做法，"容忍错误、猜测意图"是草台班子的做法。但正直的做法没有赢得生态。草台班子的做法赢了——因为降低内容生产门槛带来的生态增长，在总量上碾压了严格验证带来的质量保证。

Gaynor（2025）把这个动态机制描述为一种"单向棘轮"：一旦消费者开始容忍上游的偏离，上游就永远不会被激励去修正自己的行为——因为下游会兜底。每个 tolerated deviation 都变成了新的 baseline，然后消费者再容忍下一个。规范变得越来越无关，实际行为变成了唯一的标准。结果是，新的实现者无法通过阅读规范来进入市场——他们只能通过收集真实世界的数据来逆向工程"实际发生了什么"。这本身就构成了巨大的进入壁垒。

更有意思的是 Gaynor 提出的"三环马戏团"：当不遵守规范的生产者是闭源商业软件、消费者是开源项目时，用户会把 bug report 提交给谁？开源项目。因为开源项目的 issue tracker 是公开的、可以直接发 issue 的，而商业软件的 bug 提交要经过客服筛选。结果是——遵守规范的开源维护者替不遵守规范的商业厂商承担了兼容成本。这就是 Postel's Law 在真实组织环境下的不对称效应。

这一点，跟前面聊到的 agent 系统的对称性，形成了很有意思的对比。人的组织里，权力决定了谁承担兼容成本——开源维护者比商业厂商更容易被抱怨，所以成本流向他们。agent 系统里，没有这种权力差——所有节点是同构的，所以如果一致执行，成本天然对称。人的组织需要治理机制来修正不对称；agent 系统只需要一致性来保证对称。

## 哪种更好？我不知道

Self-describing 的好处是灵活。上游不需要预知下游的所有需求，它只需要把自己的工作做好、写清楚。下游有完全的自主权——读什么、不读什么、怎么理解。artifact 的内部结构可以随时调整，只要 README 更新了，下游就能适应。

代价是下游的负担。每读一个 README、每打开一个文件、每理解一个上游的领域术语，都是 token 和推理成本。而且 README 能不能写清楚——上游 agent 有动力写好吗？写 README 本身也是消耗。

Requirement-driven 的好处是精确。下游不需要探索——它要的文件就在那里，格式对，字段对。gate check 是机器执行的，不会漏。token 消耗更少，因为下游不用读 README 也不用盲搜。

代价是僵化。下游必须提前声明所有需求。如果下游在干活过程中发现自己需要一份最初没预料到的文件——requirement 已经锁死了，你得重跑整个 workflow 才能改。而且上游必须在 prompt 被注入额外指令的环境下干活——"必须产出 A、B、C"——这会不会影响上游的产出质量，我也不知道。

还有一个更微妙的点。Self-describing 模式下，下游看到的是上游的**完整产出**——包括上游认为重要的、但下游最初没意识到需要的东西。这有时候是意外收获。Requirement-driven 模式下，下游只拿到它要的——上游即使发现了"下游可能还需要这个"，也没有动力额外提供。

但这些利弊分析，可能漏掉了一个更大的维度。

回想一下 2023 年 ChatGPT 开放 plugin 机制的时候。当时所有人都以为 plugin 开发会是传统软件工程那一套——读 API 文档，实现特定接口，通过契约验证，注册上线。结果发现规则出奇地简单：你只需要提供 tool 的定义和一段自然语言描述。没了。

传统插件系统用的是 requirement-driven 模式——平台定义接口，开发者实现接口。门槛高，但质量有保证。ChatGPT 用的是 self-describing 模式——你用自然语言告诉 AI 这个 tool 能干什么，AI 自己去理解怎么用。理解负担从人类开发者转移到了 AI 平台。"写一段描述"和"实现一个类型接口"之间的接入成本差距，是数量级的。

结果是什么？ChatGPT 的插件生态在几个月内爆炸式增长。

这不是巧合。当消费者是一个能理解自然语言的 AI 时，self-description 把"接入一个新能力"的门槛从软件工程的成本降到了写文档的成本。对于一个需要生态的系统——需要第三方贡献节点、skill、tool——self-describing 的低门槛可能比 requirement-driven 的可靠性更重要。

当然，ChatGPT plugin 也暴露了另一面：LLM 对 tool 描述的解释不是完全一致的。同一个描述，不同 invocation 可能产生不同的 tool call，有时是幻觉参数，有时是静默的调用错误。这正是 requirement-driven 想要解决的问题——严格契约、gate check、不符合就拒绝。

而且这个模式不是只发生了一次。

2024 年 11 月，Anthropic 开源了 MCP（Model Context Protocol），定义了一个"AI 如何发现和使用外部工具"的标准。核心机制跟 ChatGPT plugin 几乎一样：工具提供方用自然语言描述自己的能力，AI 在运行时理解描述、决定如何调用。工具不需要实现一个强类型的接口，不需要通过 contract test。只需要一个 description。

到 2026 年，MCP 的月下载量达到了 9700 万次。OpenAI、Google、Microsoft 全都加入支持。它被比喻为"AI 的 USB-C"——不是因为它定义了强类型契约（USB-C 的物理规范可是精确到毫米的），而是因为它让任何工具都能被任何 AI 接入，就像 USB-C 让任何外设都能插进任何端口。

但 MCP 的批评者也说了几乎跟 ChatGPT plugin 批评者一样的话：自然语言描述不是 spec，AI 对描述的解读不稳定，同一个 tool 在不同 invocation 下的行为可能不同。2025 年的一篇安全研究发现，MCP 工具描述可以被 adversarially crafted 来操控 AI 的 tool call 行为——这在 requirement-driven 模式下是不可能发生的，因为严格 schema 没有"被说服"的空间。

所以 ChatGPT plugin 不是孤例。它只是这个模式第一次在公众视野里的演示。MCP 是第二次，规模大了一个数量级，证明了这个模式的复用性——也证明了同样的 tradeoff 会反复出现。

所以你面前的选择，本质上是 **生态增长速度 vs 行为可靠性** 的权衡。如果你在搭建一个需要有生态的 agent 平台，self-describing 的低门槛可能是决定性优势。如果你在搭建一条需要零故障率的生产管线，requirement-driven 的确定性可能是必须的。两种都对。哪种更适合你现在在做的 workflow——只有你自己跑过才知道。

哪种更好？

我只能说，在人的协作里，两种模式都有成功的实践。在 agent 系统里，一致性比选择本身更重要。至于实际效果——跑跑看。

## 把这几层拼起来

一个完整的 artifact 通信流程大概是这样的：

1. A 执行完，产出物写到 `artifacts/<workflow-id>/A/run-003/`，目录里包含实际输出文件和一个 README.md
2. A 产出一条 push 消息：artifact 路径、内容概览、使用提示。这个消息进入 B 的 context
3. B 启动，context 里只有 push 消息（没有 A 的 session，没有 A 的中间过程）
4. B 读 push 消息，知道了 A 的产出在哪、里面有什么、怎么用
5. B 打开 A 的 artifact 目录，先读 README 了解全貌，再按需加载需要的文件
6. B 干完活，自己的产出写到 `artifacts/<workflow-id>/B/run-001/`，产出一条 push 消息给 C

全过程里，B 的 context 始终保持干净——它只加载了自己需要的文件，A 的 artifact 里无关的部分从来没有进入过它的视野。

这套流程也跟 workflow 的另一个设计选择吻合：节点间不共享 session。共享 session 的冲动，往往是因为 artifact 机制不够完善——你觉得 B 需要看到 A 的聊天记录，可能是因为 A 的 artifact 里没有写完 B 需要的所有信息。把 artifact 机制做扎实了，共享 session 的需求就自然消退了——就像上篇文章讨论过的。

## 一句话

**Workflow 节点之间传递的不只是数据，还有"谁来承担理解成本"的约定。Self-describing 把负担放在接收方，requirement-driven 把负担放在生产方。在 agent 系统里，因为你可以在所有节点上一致地执行同一种约定，总负担天然对称——真正重要的是选一种，然后贯彻到底。**

---

## 我现在还没搞明白的一些事

push 消息到底应该多详细？太简略——"artifact 在 `/path/`，自己看"——B 可能会忽略重要信息。太详细——接近全量推送的规模——就失去了 push/pull 分离的意义。这里存在一个"刚好够下游 agent 形成正确预期"的信息量甜点，但怎么找到它，我现在只能说"在实践中调"。不同节点可能需要不同程度的 push 详细度，但这又引入了新的设计复杂度——谁来定义每一对节点之间的 push 消息粒度？

另一个问题是 artifact 的生命周期。Workflow 执行完了，全局 artifact 目录要保留多久？永远保留对审计最友好，但存储成本会线性增长。按时间清除——比如保留 30 天——但某些执行可能需要更长时间追溯（比如出了线上事故，需要回溯两个月前的某次 deploy）。也许应该用重要性分级：关键节点的 artifact 永久保留，非关键节点的定期清理。但"关键"的定义是什么？部署节点可能比代码生成节点更关键？这取决于 workflow 的类型。

还有一个设计空间我没仔细想过：artifact 的版本引用。如果节点 B 不仅需要节点 A 本次执行的 artifact，还需要 A 上次执行的 artifact 做对比——比如"这次方案和上次方案差在哪"。B 应该通过什么方式获取 A 的历史 artifact？是通过 workflow 全局目录（"去 workflow artifact 里找 A 的历史执行"）还是通过 push 消息显式传递（"A 在消息里附带历史 artifact 路径"）？前者更灵活但需要 B 做更多探索，后者更确定但增加了 push 消息的复杂度。

最核心的问题反而是最简单的那一个：self-describing 和 requirement-driven，到底哪个更好？理论分析只能走到这儿了。前者的灵活性和后者的精确性，都是真实的价值。前者的下游负担和后者的僵化风险，也都是真实的代价。答案可能取决于 workflow 的类型、节点的复杂度、执行频率、对可靠性的要求——但具体怎么取决于，需要跑过才知道。这也是为什么我打算两种都试试。

---

## 参考文献

- Anthropic (2026). Claude Code Subagents. code.claude.com/docs/en/agent-sdk/subagents. 子 agent 上下文隔离的实现：中间工具调用和结果留在子 agent 内部，仅最终消息返回父 agent。本文的 push 消息相当于"最终消息"的泛化——不仅包含结论，还包含怎么找到完整产出。
- OpenAI (2026). Codex CLI Threads. developers.openai.com/codex. 独立线程 + 文件系统耦合模式。前一线程将结果写入文件，后一线程启动时读取。`thread_archive` 执行完释放上下文。
- Google ADK (2025). Handle Pattern. "Scope by default — every model call and sub-agent sees the minimum context required. Agents must reach for more information explicitly via tools." 与本文 push/pull 模型的 pull 层同构。
- Factory AI (2025). Production multi-agent system. 状态全部外化到 artifact，任何 agent 都不持有完整画面。agent 通过读取文件获取上游产出，不通过共享 session。
- Korzybski, A. (1933). _Science and Sanity_. "The map is not the territory" — 抽象表示不等于它所代表的事物。本文标题借用了这个区分：push 消息是地图，artifact 是领土。
- Postel, J. (1981). _Transmission Control Protocol_, RFC 793. "Be conservative in what you do, be liberal in what you accept." — 鲁棒性原则的原始表述，self-describing 模式的理论源头。
- ACM (2018). _The Robustness Principle Reconsidered_. Communications of the ACM. 对 Postel's Law 的系统性批评：容忍畸形输入导致生态系统积累复杂性债务，requirement-driven 模式的理论支撑。
- Pact Foundation. _Consumer-Driven Contracts_. docs.pact.io. 消费者定义期望、提供者必须满足的 contract testing 框架。2026 年已有团队（CallSphere）将其应用于 agent-to-agent 通信的 schema 验证。
- Supergood Solutions (2026). _Testing Your Agent Output Contracts Before Production_. supergood.solutions/blog. Agent 输出 contract 的实践指南："A schema in a README is a suggestion. A schema in code is a constraint."
- Microsoft (2026). _Agent Framework Workflows_. learn.microsoft.com/en-us/agent-framework/workflows. Executor 之间 type-safe message routing，requirement-driven 在 framework 层的系统化实现。
- Dagster (2025). _Software-Defined Assets_. dagster.io. 下游 asset 显式声明对上游 asset 的类型依赖：`AssetIn("raw_research_results")`，contract 违反即管线失败。
- Gaynor, A. (2025). _Postel's Law and the Three Ring Circus_. alexgaynor.net. 提出了 Postel's Law 的"单向棘轮"效应——容忍的偏差会永久积累，不可逆转——以及"三环马戏团"模式：开源消费者替闭源商业生产者承担兼容成本。
- Hickson, I. (2008). _HTML5 Specification — Parsing HTML Documents_. WHATWG. HTML5 规范明确写了错误恢复行为：浏览器如何处理不规范的 HTML。这是 self-describing 模式在最大规模上的应用——宁可让所有浏览器实现复杂的错误恢复，也不要求所有内容生产者写出正确的 HTML。
- Model Context Protocol (MCP). modelcontextprotocol.io. Anthropic 2024 年开源，2026 年月下载量 9700 万次。AI 时代的 self-describing 工具协议：工具用自然语言描述能力，AI 理解并适配。与 ChatGPT plugin 同构但规模更大。
- Pal, K. et al. (2025). _Model Context Protocol (MCP): Landscape, Security Threats, and Future Directions_. arxiv:2503.23278. MCP 的安全分析：自然语言描述可被 adversarially crafted 来操控 AI tool call 行为——这是 self-describing 模式特有的攻击面，严格 schema 不存在此问题。

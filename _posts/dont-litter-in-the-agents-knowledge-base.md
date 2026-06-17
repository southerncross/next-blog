---
title: '别在 agent 的知识库里乱扔垃圾'
date: '2026-06-17T17:57:27+08:00'
description: '在 agent 眼中，文件系统就是知识库。每多一个没经过思考的文件，就是多了一个可能误导它的信号。治理中间产物，不只是为了干净——是为了让 agent 少读一些不该读的东西。'
topics: ['agentic-workflow']
---

前阵子在测试 Codex 的时候，碰到一件让我有点烦的事。

我调了一个技术方案生成的 workflow，跑了几轮，效果不满意。于是我把之前测试生成的代码都删了，改了 AGENTS.md 里的指令，重新再跑一次。结果 Codex 生成的代码明显不对劲——它参考了一些不该参考的东西。后来我扒开它的思考 log 才发现：它读到了上一次运行时留下的 log 文件和一些中间产物，里面包括上一版的设计方案和改动思路。这些文件我没主动放进 context，是 Codex 自己探索项目目录的时候读到的。不止如此——它还自己跑了 git log，翻出了我之前删掉但还没 commit 的文件内容。那些我以为已经不存在了的东西，它全找回来了。它看到了"上一次自己是怎么想的"，然后照着做了。

我把所有过程产物清空，再跑了一次。这次干净了。输出回到了预期范围内。

我养过狗。遛狗的时候有一件事你必须时刻注意：地上可能有你不想让它吃的东西。果核、鸡骨头、不知道谁扔的半块面包。狗不在乎，它闻到了就吞。你不能指望它自己判断——你得牵着绳子，盯着地面，在它张嘴之前把它拽开。

Codex 也是一样。既然文件系统就是它的知识库——它会主动探索、读取、参考项目里的任何文件——那你就必须小心在文件系统里放了什么。狗不会区分"这是你精心准备的狗粮"和"这是路人扔的鸡骨头"，Codex 也不会区分"这是经过 review 的设计文档"和"这是我上次运行留下的 log"。

---

## denylist 的困境

这事之后，我开始思考一个问题：我们现在管理 agent 能读什么的方法，对不对？

主流的做法是 denylist。Claude Code 有 `.claudeignore`，Cursor 有 `.cursorignore`，社区有人提了 `.agentignore` 标准。逻辑都是：默认什么都给 agent 读，你把不应该读的列出来排除掉。

在人写代码的时代，这个思路大体上够用。`.gitignore` 排除了 build artifacts、secrets、`node_modules`，剩下的源代码、文档、配置，基本都是人故意放在那里的。人不会往项目目录里随手丢一个分析草稿或者调试 log。就算丢了，人扫一眼也知道那是垃圾，自动忽略。

Agent 不是这样。Agent 探索项目目录的时候，碰到的任何东西都会被认为是潜在的相关信息——它是 indiscriminate reader。一个 stale 的设计草稿，一个上次运行的 debug 输出，一个你忘了删的分析笔记，在人看来是垃圾，在 agent 看来是 context。agent 不知道这些东西可能是错的、过时的、或者根本就是上一次自己瞎编的。

更麻烦的是，agent 也是个 prolific writer。一次运行可以吐出几十个中间文件——分析笔记、方案对比、计划草稿——格式由它自己决定，你可能都不知道这些文件的存在。你今天往 `.claudeignore` 里加了 `*.log`，明天它生成 `.plan.md`，后天生成 `debug-output.txt`，再往后是一个你从来没听说过的格式。denylist 的维护速度永远追不上 agent 发明新垃圾的速度。

Techloom 做过一个实验：给 coding agent 的 context 里注入无关内容——随机代码片段、旧文档片段、不相关的对话历史——然后测试代码质量。在 50k token 的噪声下，Sonnet 的得分下降了 8.3 分，标准差从 5.1 暴涨到 16.3。噪声不仅降低了平均质量，还让输出变得不可预测。上下文污染不是"让 agent 稍微笨一点"，而是让 agent 变成一个随机数发生器。

而且，agent context 污染有一个特别阴险的特征：它是 fail-open 的。依赖冲突（npm、pip）会导致 build fail 或者运行时报错——系统停下来，告诉你哪里出了问题。Agent 读到不该读的东西，不会 crash，不会报错，不会停下来。它继续运行，产出看起来合理但逻辑错误的结果。你可能好几轮之后才发现不对劲，再一层层往回翻 log，找到底是哪份文件把它带偏的。

---

## 问题不在"读得多"，在"读得杂"

这里不是反对 agent 多读文件。repo-first 模式本身就是靠 agent 阅读仓库里的真实代码来获取架构约束的——这比任何文档都可靠。v0 从 sandbox 转向 repo-first 的时候说了一句话：90% 的编码工作是对已有代码的修改，不是从零构建。agent 需要读仓库，读得越多越准确。

问题不在"多"，在"杂"。Agent 读到了两类它不该读的东西：一是上次运行留下的中间产物（像我的 Codex 案例），二是它自己生成的、但还没经过验证的工作笔记。这些文件的信息密度极低，但足以让 agent 产生错误的锚定——它会把这些东西当成"既然存在，就是有意义的"。

要理解为什么 agent 会这样，得先理解 agent 怎么看文件系统。Anthropic 在 context engineering 的文章里讲得很清楚：agent 会把文件系统的结构——目录层级、文件名、时间戳——都当成导航信号。一个 agent 看到 `src/core/auth/` 和看到 `temp/analysis-2026-06-17.md`，它对这两者的可信度判断是不一样的。前者是架构事实，后者是临时笔记。agent 能做出这个区分——前提是目录结构本身传递了正确的信号。

问题是，如果你把临时笔记和源码放在同一个目录里，或者放在项目根目录下一个叫 `notes/` 的目录里，agent 的判断就会模糊。它分不清哪个是"架构事实"，哪个是"某个 agent 昨天晚上写的草稿"。

---

## 也许该分成三层来想

我试着把 agent 接触到的文件分成了三层。当然，分类总是一种简化——实际上文件的生命周期比三层复杂得多。但这个框架至少帮我理清了不同东西需要不同的管理方式，而不是混在一起用一个 denylist 解决。

**第一层：过程废料（transient artifacts）**

当次运行的 log、调试输出、语法检查报错、临时脚本、生成后又删掉的测试代码。这些东西的生命周期应该不超过一次 session。它们的正确归宿是 `/tmp/` 或等价的临时目录——session 结束就清掉。现在的问题是，很多 agent 默认把这些东西写在项目目录里，用户不知道，agent 下次运行又读到了。

**第二层：工作知识（working knowledge）**

跨 session 需要保留、但还没到"进 repo"质量的中间产物。排查记录、方案对比、草稿笔记、待验证的假设、上一次运行时发现但还没来得及处理的边界条件。这些东西有用——它们记录了探索路径和决策上下文。但它们不是"对的"——agent 下次读的时候应该知道这些是 draft，不是 finalized knowledge。

这一层是目前基础设施的最大缺口。它需要：不在项目目录里（不能进 repo），跨 session 持久化（不能是 `/tmp/`），agent 能读能写（要能被 agent 探索到），有状态标记（draft / verified / deprecated）。目前没有任何工具完整支持这四个需求。

**第三层：已提交知识（committed knowledge）**

经过 review、合入 repo、被认为是"对的"的东西。这是传统 git + PR review 管理的那一层，机制是成熟的。唯一的新问题是：有了 agent 之后，什么算"值得提交"的标准需要重新想。agent 产出代码的速度远超人，如果把所有 agent 生成的文件都提交，repo 会迅速膨胀。必须有一个 gate——不是 denylist 的 gate，而是 opt-in 的 gate：默认不提交，只有确认值得留的东西才进 repo。

这三层里，第一层的解法是工程问题——给 agent 指定一个不在项目目录里的临时工作目录，session 结束自动清理。第三层的解法是流程问题——用 git staging 和 PR review 已经解决了大部分，需要补的只是意识：不是 agent 写出来的所有东西都值得保留。

第二层是最难的。它需要的那个东西，现在还没有。

---

## 没人做过这个

我花了一些时间四处翻，想看业界有没有现成的方案。

最接近的是 OpenClaw 的 agent workspace。它在 `~/.openclaw/workspace/` 里维护了一套独立的文件结构：`memory/YYYY-MM-DD.md` 存每日工作笔记，`MEMORY.md` 存长期记忆，workspace 是一个独立的 git repo，和任何项目目录物理隔离。Agent 在项目里写代码，在 workspace 里写笔记。它还做了 memory flush——context 快满的时候，自动把重要内容保存到 memory files，然后再压缩对话历史。

但 OpenClaw 是个人 agent 平台，不是 coding agent。它的 workspace 设计是为了管 agent 的人格和长期记忆，不是为了管"这个项目的设计草稿和中间分析"。

Letta 用 git worktree 实现了 subagent 之间的隔离。Memory 初始化、sleep-time 反思、记忆碎片整理——每类任务都在独立的 worktree 里运行，worktree 用完就删。merge 回主记忆 repo 的只有经过提炼的结果，中间过程全丢。这个模型很好，但它是用在 agent 记忆管理上，不是用在项目的开发文件管理上。

Anthropic 在长任务 agent 的 harness 里用了 `claude-progress.txt` 和 `feature_list.json` ——跨 session 同步进度。但这些文件是放在项目目录里的，属于第二层的内容放在了第三层的位置。

Claude Code 的 auto-memory 只存行为偏好和简短记录，agent 不能主动写、不能自由读，承载不了工作知识的需求。Tweag 的 Memory Bank 目录结构（`activeContext.md`、`progress.md`、`systemPatterns.md`）很好，但它是放在项目 repo 里的——意味着这些东西会被 commit、被 review，被当成正式文档对待。`.claudeignore` 和 `.cursorignore` 只能堵已知的坏文件，管理不了 agent 随时产生的新格式。

把碎片拼起来，能看到方向，但还没有完整的解。

---

## 也许最终的方案不是"排除"，而是"不给"

有一个直觉我越来越相信：治理 agent 中间产物的最终方案，可能不是靠"ignore files"这种排除机制，而是靠物理隔离——agent 的工作目录里，项目之外的东西根本不存在。

具体来说可能是这样：agent 启动时，项目目录是 read-only 挂载的（或者 overlay 的），agent 的所有写入都落在一个独立的 scratch 目录里。Agent 在项目里读到的东西都是"对的"——因为它们经过了 git 的过滤、PR 的 review、人类的选择。Agent 产生的所有中间文件都在 scratch 里，agent 之间不共享，session 结束就清掉。agent 需要跨 session 保留的东西，写到一个独立的"working notes"目录，那个目录不在项目树里，不会被当项目文件来读。

这其实是一个认知上的翻转：不是告诉 agent "别读这些文件"，而是让 agent 的生存环境里根本就不存在"这些文件"。

当然这也带来了新的问题。Agent 有时候需要读自己之前的工作笔记来继续一个跨 session 的任务。如果所有中间文件都隔离了，这个需求怎么满足？也许需要一个明确的"读取工作笔记"的动作——不是被动探索，而是主动选择——就像 git staging area 里我们必须显式 `git add` 一样。你不是"看不见"那些文件，而是你必须明确地说"我要读这份笔记"，把它从 scratch 空间拉到当前 context 里。

---

**一句话：Agent 把文件系统当知识库。如果你不想让它读到垃圾，就别把垃圾放在它能看到的地方。Denylist 是不够的——你列不完所有该排除的东西。真正的解法是让项目的文件系统范围里，只存在经过选择的东西。**

## 我现在还没搞明白的一些事

中间产物和知识的边界在多大程度上是事后才能判断的？我前面把"过程废料"和"工作知识"分成了两层，但写的时候自己也在怀疑：这两层的边界是不是只能在时间线上往后看才能确定。一个 agent 某个下午写的排查笔记，当时看是过程废料，两天后回头发现里面有很重要的发现——它其实应该升格到"工作知识"。这个判断没法在当时做，因为你还不知道它以后有没有用。如果这个观察成立，那就意味着任何"实时分类"的机制都会有一定的误判率。那这个误判的代价由谁来承担？是丢掉了可能有用的笔记，还是保留了太多噪音？

物理隔离的思路依赖一个前提：agent 的"世界"可以被分割成"可信的"（项目目录）和"待验证的"（scratch）两部分。但 agent 在工作中需要同时参考这两部分——它在写代码的时候需要参考自己之前的排查笔记，在做技术方案的时候需要参考上次跑出来的分析结果。物理隔离会不会反而增加 agent 的认知负担？它需要在两个信息空间之间来回切换，而不是在一个统一的视野里工作。也许物理隔离不是目的，而是过渡——在 agent 能可靠地判断信息来源可信度之前，我们用物理隔离来替它做这个判断。等到 agent 具备了 source criticism 的能力（能区分"这是我上次的草稿，不一定对"和"这是代码库里经过 review 的实现"），物理隔离就可以松开了。但这个能力现在还不存在，而且不知道什么时候会存在。

还有一个和工具生态有关的。如果所有中间产物都在项目外，那 IDE、文件浏览器、git 工具——所有那些我们用来"看项目状态"的工具——都看不到它们了。这意味着什么？是好事（眼不见心不烦）还是坏事（出了问题找不到线索）？也许需要一套新的工具来管理这个"项目外但 agent 内"的空间。这又回到了那个老问题：工具链的演化，总是比工作方式的变化慢一步。

## 参考文献

- Techloom (2026). _Context Pollution Experiment: 1,080 Benchmarks_. 量化了无关上下文对 coding agent 代码质量的影响。Sonnet 在 50k 噪声 token 下得分下降 8.3 分，标准差从 5.1 升至 16.3。
- Anthropic (2026). _Effective Context Engineering for AI Agents_. 将 agent 的文件系统探索行为描述为"progressive disclosure"，并指出文件的元数据（目录层级、命名、时间戳）都是 agent 的导航信号。
- Anthropic (2026). _Effective Harnesses for Long-Running Agents_. 使用 `claude-progress.txt` 和 `feature_list.json` 追踪跨 session 进度，但其放置在项目目录内的做法值得讨论。
- OpenClaw. _Agent Workspace Documentation_. 最接近"agent Tier 2 空间"的设计——在 `~/.openclaw/workspace/` 中维护独立于项目的 memory 文件系统，支持 daily notes、long-term memory、memory flush 和 dreaming consolidation。
- Letta (2026). _Context Repositories: Git-based Memory for Coding Agents_. 使用 git worktree 实现 subagent 间的记忆隔离——worktree 用完即删，只有经过提炼的结果 merge 回主记忆 repo。
- Tweag. _Agentic Coding Handbook: Memory Bank System_. 结构化的 agent 工作记忆目录（activeContext, progress, systemPatterns），但目前设计在项目 repo 内。
- tourcoder. _`.agentignore` Specification_. 社区提案的控制 agent 文件读取的跨工具标准，denylist 模型。
- Cursor. _Ignore File Documentation_. `.cursorignore` 实现，用于排除敏感和无关文件。

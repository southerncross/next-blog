---
title: '别让你的工作流的边白画了'
date: '2026-06-08T17:44:22+08:00'
description: 'Workflow 节点之间共享 session，本质上是用聊天记录替代产出物规范。只有显式的产出文件才可以被验证、被追溯。如果你觉得下游 Agent 需要看上游的 session，说明上游的产出物 schema 不完整。'
topics: ['agentic-workflow']
---

最近在编辑 agentic workflow 的时候，遇到了一个选项。

一个节点执行完，连到下个节点。边上的配置问你：共享 session，还是不共享？

第一反应是，这还用选吗——共享。B 需要知道 A 做了什么，A 发现了什么，A 为什么做了某个决定。不给 B 这些上下文，B 怎么干活？

但这个选项让我不舒服。它像是一个在设计上很便宜、在直觉上很合理、但实际上会毁掉 workflow 存在意义的选项。

试着把这两层剥开来看。

---

在一个 workflow 里，节点之间的有向边代表两件事同时发生：**A 干完了，该 B 了**，以及 **A 的产出成为 B 的输入**。前者是调度，后者是信息传递。调度只管顺序，信息传递管的是 B 知道什么。

共享 session 是信息传递的一种实现方式。A 的聊天记录——它读了哪些文件、搜了什么、做了多少轮推理、在哪个问题上犹豫过——全部打包发给 B。B 像坐在 A 旁边看完了全程，然后接着往下干。

不共享 session，B 启动时拿到的是 A 的**产出物**。A 写了什么文件，B 就读什么文件。A 的中间过程 B 一概不知。

这两种方式的区别，说到底是**隐式传递和显式传递的区别**。

---

我越琢磨越觉得这个区分重要，重要到了我觉得 workflow 不应该在边上提供这个选项的程度。

隐式传递的特点是：被传递的信息没有经过选择。A 的 session 里有什么，B 就看到什么。A 不需要决定哪些信息对 B 有用、哪些是噪声——这个判断被推迟给了 B。B 面对一堆未经过滤的聊天记录，自己去筛选。

但这正是 workflow 存在的理由。我们把工作拆成节点，给每个节点分配一个明确的任务，就是因为我们相信——或者至少希望——每个节点产出的是一个**可以独立于其生成过程而被评估的产物**。需求分析节点的产出是需求文档，不应该是"我跟 agent 聊了 20 轮的聊天记录"。

引出一个诊断性问题：**如果你觉得 B 需要看到 A 的 session 才能干好活，A 的产出文件里缺了什么？**

什么缺了，就加什么。这不是在限制 workflow 的表达能力，而是在强迫你把隐式的信息传递变成显式的产出物规范。

从几个已经在跑的系统来看，这是可以做到的：

Claude Code 的 subagent 机制：子 agent 的中间过程和工具调用全部锁在子 agent 内部，只把最终消息返回给父 agent。你想让父 agent 知道子 agent 读了几十个文件里发现了什么？写在最终消息里。

Codex CLI 的线程模型：独立线程之间靠文件系统耦合。前一个线程把结果写成文件，后一个线程启动时读取。`thread_archive` 执行完就释放上下文，不存在"前一个线程的聊天记录"这种东西。

Factory AI 的做法更极端：状态全部外化到 artifact，任何 agent 都不持有完整画面。它需要什么就读取什么文件，而这些文件是别的 agent 写出来的产出物，不是别的 agent 的推理过程。

Google ADK 的设计原则里有一句话，我觉得可以直接拿来当规则用：_"Scope by default — every model call and sub-agent sees the minimum context required. Agents must reach for more information explicitly via tools, rather than being flooded by default."_

这几个系统之间有差异，但在一个选择上高度一致：**agent 之间的通信介质是结构化的产出文件，不是聊天记录。中间过程是黑盒。下游 agent 不需要知道上游 agent 是怎么干活的。**

---

一个反驳是：但如果 B 确实需要知道 A 排除了哪些方案、为什么排除，这不是隐式上下文吗？

不是。这是 A 的产出物里该写但没写的内容。

如果 A 在 session 里探索了三种方案，排除了两种，选择了一种，那 A 的产出物应该包含一个 "Alternatives Considered" 字段。如果 A 在 session 里发现了一个非直觉的技术约束，这不应该是 B 从聊天记录里"碰巧翻到"的信息——A 应该在产出物里显式声明。

**共享 session 的冲动，本质上是一个诊断信号：你的产出物 schema 不完整。**

把 schema 补全，共享 session 的需求就消失了。

---

还有一个不那么明显的问题：共享 session 让验证变得不可能。

一个人——一个 team lead，一个 reviewer——要检查 A 到 B 的信息传递是否正确，他怎么查？如果传递的是 A 的产出文件，他打开文件看一眼就行。如果传递的是 A 的 session，他要把几十轮的聊天记录读一遍，找出哪些信息是 B 应该用到的，哪些是 B 不该用的，哪些是噪声。这个成本高到实际上等于没法验证。

不可验证的信息传递，在多 agent 系统里的后果是调试成本暴涨。当 B 产出了一个错误的结果，你怎么判断是 B 执行有问题，还是 A 的 session 里有误导性的信息被 B 意外吸收了？产出文件可以 diff，可以回溯，可以 blame。聊天记录不能。

这其实跟软件工程里一个很老的道理是相通的：组件之间的通信要基于显式的接口，不能基于实现的内部细节。换成 agent 的语言就是：agent 之间的通信要基于产出物，不能基于 session。session 是 agent 的"内部实现"，产出物才是它的"接口"。

---

那如果真的需要多轮对话呢？

比如需求澄清节点里，人和 agent 反复迭代了几轮才产出最终的需求文档。这个多轮对话是需要的，但它是**节点内部**的事，不是**节点之间**的事。

把这个区分清楚，设计就变简单了：

- **节点内部**：允许多轮会话。人跟 agent 迭代，agent 可以犯错误、改方向、走几次回头路。最终提交的是产出文件。
- **节点之间**：永远不共享 session。B 启动时拿到的是 A 的产出文件，不是 A 的聊天记录。

所以 workflow 编辑器里那个"共享 session"的选项，如果放在边上，它混淆了两个不同的东西：**节点内多轮交互**（需要保留的）和**节点间上下文继承**（应该禁止的）。前者是节点配置，不是边配置。把两者分开，边上的选项就可以拿掉了。

---

**一句话：agent 之间的信息传递必须是显式的，因为只有显式的东西可以被验证。共享 session 是用聊天记录替代产出物规范。如果你的 workflow 需要在边上共享 session，你缺的不是这个选项，而是一个更完整的产出物 schema。**

---

## 我现在还没搞明白的一些事

写了这么多，有几个我自己也拿不准的地方。

一个产出物的 schema 到底应该多详细，才算是"完整"？"需求文档"的 schema 可以无限精细——动机、目标、用户故事、非功能需求、边界条件、已知风险、待确认项……但每一层字段都增加 A 的认知负担。如果 A 花了 50% 的时间填 schema，产出 50% 的实际分析，是不是过犹不及了？怎么找到那个刚好够下游 agent 理解、又不至于让上游 agent 变成填表机器的点——这个我还没有很好的判断方法。

另一个问题是，我拿"不可验证"来论证共享 session 有问题，但"可验证"到底要验证什么？如果 reviewer 打开 A 的产出文件看了一眼觉得没问题，这是验证吗？还是说验证需要更 formal 的东西——比如 schema 校验、checklist、跨文件的约束检查？这个问题涉及 workflow 里人机验证点的设计，我还没想清楚哪些产出物需要人验证、哪些可以 agent 自己验证、哪些需要自动化工具验证。

还有一个不在这篇文章讨论范围里但我一直惦记的：如果 A 和 B 不共享 session，但 B 可以回溯读取 A 的 session，这算不算一种折中？B 默认只看到产出物，但如果它觉得信息不够，它可以自己去查 A 的 session——像 Google ADK 的 handle pattern，默认给轻量引用，需要时主动加载。这个设计保留了什么，牺牲了什么，我还没有系统地想过。

---

## 参考文献

- Claude Code SDK Documentation (2026). _Subagents_. code.claude.com/docs/en/agent-sdk/subagents. 子 agent 的上下文隔离设计：中间工具调用和结果留在子 agent 内部，仅最终消息返回父 agent。
- Codex CLI Documentation (2026). _Custom instructions with AGENTS.md_. developers.openai.com/codex/guides/agents-md. 线程模型：独立线程 + 文件系统耦合，`thread_archive` 释放上下文。
- Google Agent Development Kit (ADK) Documentation (2025). _Architecting efficient context-aware multi-agent framework for production_. developers.googleblog.com. 提出 "scope by default" 原则和 handle pattern：agent 默认看到轻量引用，需要时主动加载原始数据。Working Context / Session / Memory / Artifacts 的四层模型。
- Zylos Research (2026). _AI Agent Memory Architectures for Multi-Agent Systems_. zylos.ai/research. 三种 memory 模式（shared / isolated / hierarchical）的对比分析，指出行业向 hierarchical scoping 收敛。
- Atlan (2026). _Agent Memory Architectures: 5 Patterns and Trade-offs_. atlan.com/know/agent-memory-architectures. 五种 agent memory 架构模式，hierarchical 为推荐默认方案。
- Anthropic (2026). Multi-agent research system architecture. 子 agent 通过 artifact system 通信：产出存储在外部，协调器接收轻量引用。
- Factory AI (2025). Production multi-agent system: 38.8k LOC, 16.5h runtime, 89.25% test coverage. 状态全部外化到 artifact，agent 不持有完整画面。
- Strands Agents SDK Documentation (2026). _Multi-agent Patterns_. strandsagents.com/docs. Workflow 模式的 DAG 设计：任务间通过 curated summary 传递信息，不传递完整历史。

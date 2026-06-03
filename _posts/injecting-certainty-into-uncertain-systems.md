---
title: '在不确定系统中注入确定性'
date: '2026-06-03T20:28:55+08:00'
description: 'Agent 效果不好只有两种原因：context 太少或太多。加 skill 做加法，拆 workflow 做减法。Workflow 的核心价值不是流程美观，是在不确定的 Agent 行为上锚定确定性——这是 AI-native 应用从 demo 走向产品的关键。'
topics: ['agentic-workflow']
---

我们团队在串 Agentic Workflow 全链路的时候，有个争论。

我是希望每个人把自己负责节点的 sub-workflow 录入到编排平台中，形成完整的流程链路。但有人觉得不需要——只要开发好对应的 agent plugin，提供好 skill、MCP 工具，让 Agent 自己跑就行了，何必编排一个 workflow？

这是一个好问题。Skill、MCP、Memory 这些 harness 手段，大家已经司空见惯了，习以为常。但 workflow 的价值，很多人可能忽略了。这篇文章想给 workflow 正个名。

## Agent 效果不好，只有两种原因

先回到那个争论。两种主张——优化 plugin 还是编排 workflow——其实对应两种不同的诊断。

当 Agent 效果不好的时候，原因只有两种：**context 太少**，或者 **context 太多**。

Context 太少，Agent 不知道该怎么做。比如它不知道项目里已经有缓存模块，于是重写了一个。修复方式：加 skill、加工具、加知识——做加法。这就是 plugin 优化的方向，大家已经很熟悉了。

Context 太多，Agent 注意力分散，该做的步骤漏了，或者多个关注点搅在一起，哪个都没做透。一个 10 步的任务，纯靠 prompt 驱动，Agent 可能只做了 2 步——不是做不了，是它"觉得"做完了。修复方式：缩小 scope，拆分 sub-workflow——做减法。

面多加水，水多加面——听起来像在稀里糊涂地补救，越补越乱。但两种方向解决不同的问题，而且相互影响：加了一个新 skill，可能让原来需要拆分的任务单节点就能完成。拆了一个 sub-workflow，可能暴露出某个子步骤需要特定的知识，得专门写 skill。两者配合调整，直到平衡。

但 plugin 优化大家都懂，workflow 的价值需要多说两句。

## Workflow 的核心价值：确定性

拆 sub-workflow 有两个好处，但更重要的是第二个。

第一个是效果提升——任务更小，Agent 更聚焦，每个子步骤的输出质量更高。这是做减法的直接收益。

第二个是**可靠性**——流程固化，100% 步骤覆盖。这是更大的价值。

一个 10 步的 workflow，如果只是通过 prompt 让 Agent 自由发挥，它可能跳过第 5 步、合并第 7 和第 8 步、或者在第 3 步就"觉得差不多了"直接结束。AMBIG-SWE 研究在 ICLR 2026 上报告了一个数据：当 Agent 没有被督促提问时，它默认执行而不是确认，resolve rate 从 48.8% 骤降到 28%。Agent 不会主动弥补不确定性——它照着自己的理解往前走，你的模糊它当自由度用了。

Workflow 用程序化执行把"必须做哪几步"从 Agent 的判断中拿走了。变成确定性保证：第 5 步一定会执行，第 7 和第 8 步不会合并，全部 10 步一定会走完。就算 Agent 每一步的表现只是及格，至少所有步骤都会被执行。**及格 × 10 步，好过优秀 × 2 步。**

Hooks 也是同样的道理。Hooks 在特定事件上触发确定性动作——pre-commit 自动跑 formatter，post-merge 自动跑测试。这些事情你写在 AGENTS.md 里当作 instruction，Agent 可能执行也可能不执行。交给 hook，100% 执行。Hook 跟 workflow 的本质相同：**在 Agent 的不确定行为上覆盖一层确定性机制。**

## 稀缺的东西变了

这揭示了一个有趣的翻转。

传统软件工程，系统是确定性的——代码写好了，每次执行结果一样。我们的工作是在确定性系统中**注入灵活性**：配置文件让行为可调，插件系统让功能可扩展，feature flag 让发布可回滚。确定性是默认的，灵活性是稀缺的。

AI-native 应用恰恰反过来。Agent 的行为是不确定的——同样的输入，可能产出不同的结果；同样的 prompt，可能执行不同数量的步骤。在这里，**确定性成了稀缺品**。Workflow、hooks、assertions、CI gates——这些机制全都在做同一件事：在一个不确定的系统上，锚定确定的行为。

这大概是一种新的稀缺性翻转：当生成变得便宜，筛选就变稀缺；当执行变得便宜，规划就变稀缺；当行为变得不确定，确定性就变稀缺。每一次基础假设的翻转，都会让之前习以为常的东西变得珍贵，之前珍贵的东西变得廉价。

## 怎么做：先粗后细，到瓶颈再拆

既然 workflow 的价值是注入确定性，那应该怎么引入 workflow？一上来就把所有节点拆成 sub-workflow 吗？

不应该。**一开始不要拆。**

先从单节点开始，通过 plugin 和 skill 优化效果。原因很简单：拆分本身有成本——每个 sub-step 需要单独的 input/output 定义、独立的 context 管理、步骤间的数据传递。如果你还没搞清楚瓶颈在哪就预先拆分，很可能拆错了地方，付出的复杂度没有回报。

当你发现 plugin 优化到瓶颈了——无论怎么加 skill、加 context，Agent 的表现卡在某个水平上不去——这时候去分析执行 log，看问题出在哪。

Log 会告诉你三种情况之一：

1. Agent 缺某种知识，之前加的 skill 没加对 → 继续做加法
2. Agent 某一步总做不好，因为那个步骤本身太复杂 → 拆出去做减法
3. Agent 总是跳步骤，因为信息太多注意力分散了 → 拆出去做减法

Log 是唯一能区分"该加还是该减"的依据。没有 log，你就是那个面多加水水多加面的厨子——全凭感觉，越和越稀。有 log，你就知道该拧哪个旋钮。

这也是"先粗后细"的策略：先给 Agent 一个粗粒度的单节点，观察表现。足够好就不拆，不好就 log 定位瓶颈，精确拆分。你只为确实需要拆的地方支付复杂度。

## Log 分析是 self-evolve 的感知器

把 log 分析再往上升一层。Agent 的优化闭环是：**执行 → log → 诊断 → 修改**。Log 是这个闭环的感知器。去掉它，闭环就断了——你执行了但不知道结果怎么样，修改无从谈起。

AHE（Agentic Harness Engineering）论文用实验证明了这个闭环可行。它把 Agent 每次执行的数百万 token 轨迹蒸馏成结构化的证据库，让 evolutionary agent 基于证据决定改什么。每次修改都绑一个可证伪的预测——"这个改动应该修复任务 A 和 B"——下一轮验证，不成立就回滚。十轮迭代，pass@1 从 69.7% 到 77.0%，跨模型跨 benchmark 可迁移。

但 AHE 有个盲区：它擅长预测"改了什么会变好"，不擅长预测"改了什么会变差"。回归预测几乎随机。这意味着做减法比做加法风险更高——新加的 skill 没用顶多浪费，拆错的 workflow 可能破坏原本能工作的东西。所以"先加后减"不只是偷懒的策略，也是风险更低的路径。

最后，这个调整过程并不像面多加水水多加面那样越补越乱，因为模型能力在持续增长。今天需要拆的 sub-workflow，明天模型单节点可能就行。平衡点在向"更粗"的方向漂移——你需要的确定性约束会越来越少。最终只保留最核心的约束——语义不变量——形式全部交给 Agent 派生。在那天到来之前，workflow、hooks、assertions 这些注入确定性的机制，就是 AI-native 应用从 demo 走向产品的桥梁。

## 参考文献

- Lin et al. (2026). "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses." arXiv 2604.25850. AHE 框架：trace 蒸馏 + 可证伪预测驱动的 harness 自动演化，十轮迭代 pass@1 69.7% → 77.0%。
- AMBIG-SWE (ICLR 2026). Agent 未被督促提问时 resolve rate 从 48.8% 降至 28%——默认执行而非确认，不确定性被 Agent 当作自由度。
- OpenAI (2026). "Harness Engineering." 工程团队首要职责从写代码转向构建确定性约束层——harness 即可靠性保证。
- Zylos Research (2026). "AI Agent Goal Decomposition and Hierarchical Planning." 过早分解可能产生粒度错误，渐进分解更稳健。
- Gamma et al. (1994). _Design Patterns_. Template Method（确定性骨架）vs Interface（灵活契约）——对应 workflow 固化 vs plugin 扩展。
- Polanyi, M. (1966). _The Tacit Dimension_. 隐性知识无法完整外化——skill 优化总有极限，某些判断只能靠人。

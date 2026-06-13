---
title: 'workflow 不是产品，输出才是'
date: '2026-06-13T18:21:02+08:00'
description: '花了两周调 workflow 架构，回头看发现一件事：我不是在优化已知的瓶颈，是在优化想象出来的问题。后来跟同事争论 dynamic workflow 该怎么做，才意识到这不是技术偏好的分歧——**agent-as-platform 和 platform-as-workflow 代表了两种根本不同的哲学。一种让你可以调流程结构直到迷失，另一种根本不给你这个东西调。选一个让你没法做无效优化的架构，比选一个让你可以做然后靠自律避免，可靠得多。'
topics: ['agentic-workflow']
---

这两周我几乎没生成任何技术方案。

我负责的节点是生成技术方案的 workflow。一开始我搭了一个简单的版本，跑通了，产出了几份方案。然后我开始觉得这个 workflow 有点问题。

问题不在产出的方案里。问题来自我对 workflow 本身的推理——artifact 的设计不够优雅，session 的管理方式可能需要重构，不同节点之间的上下文传递应该更标准化，甚至，也许我应该先做一个创建 workflow 的 workflow。连续两周，我基本都在调这些东西。等到周五下午坐下来盘点，才意识到一件事：这两周我几乎没有看过任何一份方案的输出质量。

这让我想起 Knuth 那句被引用了无数次的话——"premature optimization is the root of all evil"。但在 agentic workflow 的场景里，问题比经典的 premature optimization 更隐蔽。经典场景里你至少知道自己在优化什么——你知道哪段代码慢，哪个查询多，你是在优化一个已知的瓶颈。而我的情况是，我连瓶颈在哪都不知道。我在优化一个**想象出来的问题**。

这不是我一个人的毛病。OpenAI 在 Codex 最佳实践指南里把 "automating before manual reliability" 列为一个正式的反模式——在你通过手工交互搞清楚 agent 擅长什么、不擅长什么之前，就把流程自动化，结果不是规模化成功，而是规模化错误。Hamel Husain 在写 AI 产品评估的那篇著名文章里说得更直接："大多数人只关注改变系统，这让他们无法把 LLM 产品提升到 demo 以上。"

但知道"不应该过早优化"是一回事，真正理解**为什么我会那么做**是另一回事。

## 两种架构，两种哲学

巧的是，就在我反思的同一周，我跟团队另一个成员讨论 dynamic workflow 时，发现我们有一个根本性的分歧。

他的想法是这样：不提前定义 workflow。你定义几个大致的阶段——plan、design、develop、review——每个阶段之间有明确的 artifact 门禁。比如进入 design 阶段之前，plan 阶段的产物必须包含某些字段，通过某些校验。但阶段内部怎么做，不管，agent 自己决定。用户的使用方式是跟一个 agent 对话——你跟它说"我要做一个需求的技术方案"，agent 理解了之后说"好，现在进入 plan 阶段，请提供以下信息"，然后你们反复互动、澄清。等差不多了，agent 建议进入 design 阶段。如果门禁没通过，就回退继续沟通。整个过程人只跟 agent 这一个交互面打交道。

我的想法是另一种：把 workflow 外置到一个独立的平台。平台只负责定义 workflow——有哪些阶段、每个阶段做什么、阶段之间怎么流转。每个节点内部还是由 agent 执行，但流程结构是提前定义好的、静态的、可视化为 DAG 的。用户使用时打开平台，选择对应的 workflow，点击开始，输入材料，然后按预设的步骤走下去。

这两个想法代表了两种根本不同的架构哲学。Anthropic 在 Building Effective Agents 里把 agentic 系统分成了两类：**workflow** 是"LLM 和工具通过预定义的代码路径编排"，**agent** 是"LLM 动态控制自己的过程和工具使用"。我主张的是前者，同事主张的是后者。

让我们叫它 **Platform-as-Workflow** 和 **Agent-as-Platform**。第一种把 workflow 外置为独立系统，第二种把 agent 作为唯一的交互平台。

后来我去查了一下业内的做法，发现这不是我们两个人之间的局部争论。Bloomreach 的 CTO 专门写了一篇文章讨论这件事，标题就叫 The Great Debate: Static Workflows vs. Dynamic Agents。OpenAI 站在 agent 这边——Codex 的设计哲学就是用户跟一个 agent 对话，agent 自主决定 plan → build → verify 的阶段推进。Anthropic 和 LangChain 主张混合路线——可预测的任务用 workflow，需要灵活性的用 agent。zylos.ai 在 2026 年 4 月发了一篇关于 agent 编排模式的调研，结论是"完全动态的方法在开放任务上 consistently outperform 静态模板，但更贵、更难调试。混合方法——确定性的外骨架加上动态的内循环——主导了生产部署"。

Gartner 的数据更说明问题：2025 年底，真正在生产环境中有 agent 部署的企业应用不到 5%。大多数所谓的"AI agent"其实是更简单的助手型功能。到 2026 年底，这个数字预计会跳到 40%，但即使那样，大部分仍然是 task-specific 的 agent，不是全自主的系统。

平台模型的生产硬化程度远高于 agent 模型。Airflow 一个月三千万下载，Temporal 提供 99.99% 的 SLA。agent 做编排这件事，在关键任务场景中的可靠性还远远没有被大规模验证。

## 各有所长的那一面

如果要把两者的优劣放在一起看，Platform 的优势集中在**确定性**上：DAG 图上的节点和边一眼就知道当前进度，偏离了立刻能发现。DAG 的边是硬约束——平台保证门禁一定执行，agent 可能跳过。执行引擎有十年级别的积累，Airflow 三千万月下载，Temporal 提供 99.99% 的 SLA，重试、超时、Saga 补偿事务都是成熟方案。成本也可预测——你知道这条 pipeline 会调用多少次 LLM。

Agent 的优势集中在**适应性**上：每次任务都不同时，预定义的 DAG 要么过度泛化，要么过度膨胀到不可维护。改 prompt 比改 DAG 快得多，试错成本低。还有一个被低估的红利——当底层模型变聪明了，Platform 里它只是在每个节点里更聪明，Agent 里它的编排能力也变聪明了。新人上手也简单，只需要知道怎么跟 agent 对话，不需要理解整个 DAG。

这两组优势看起来是对称的——这个维度你赢，那个维度我赢。但这个对比漏掉了一个更重要的东西。有一个差异不在同一个层面。

## 架构选择本身就是方法论约束

我花了两周调 workflow 架构，为什么？

不是因为我想偷懒不去看输出。是真的没意识到自己在做什么。DAG 编辑器天生在那里，节点和边就在你面前，参数面板一打开就有无数可以调的东西。它们邀请你去做正向设计——画图、连线、优化结构、让流程更"优雅"。这些操作跟输出质量没有任何直接关系，但它们在你面前，你就想调。

Agent-as-Platform 没有这些东西。你面对的只有一个对话窗口。你能改的是什么？Prompt。Skill。没了。你被强制留在真正该做的事情上：调 prompt、看输出、修 bad case。

OpenAI 的 Codex 最佳实践指南里定义了一个六阶段成熟度模型：Task Context → AGENTS.md → Configuration → MCP → Skills → Automation。注意这六个阶段的顺序——Skills 在 Automation 之前，而 Skills 本身是从反复使用中提炼出来的，不是提前设计的。官方明确说："convert a prompt to a skill when you keep reusing it or correcting the same workflow"。Skill 是被输出质量拉出来的，不是被架构设计推出来的。

在这个模型下，如果你要跟团队分工，不同的人维护不同的 skill。安全专家维护安全审查 skill，架构师维护架构模式 skill，质量团队维护 artifact schema 和 gate rules。Agent 负责在合适的时机组合它们。每个人只需要理解自己的领域，不需要理解整个流程。分工单元从"阶段"变成了"能力"，从水平切分变成了垂直切分。

如果需要不同阶段用不同的 agent 或模型，orchestrator 会 spawn 不同的 sub-agent——planner 用强模型做高推理，implementer 用便宜模型做执行，reviewer 用强模型做对抗性审查。子 agent 之间不直接通信，它们通过文件产物（artifact）交接——planner 写 plan.md 然后退出，orchestrator 检查产物存在且符合 schema 后才 spawn implementer 去读它干活。这跟你同事说的"阶段之间 artifact 门禁"完全一致。

一个事情如果你连做都做不了，你就不可能在上面浪费时间。一个约束如果你无法覆盖，它比一个你可以忽略的指南更可靠。选一个让你没法做无效优化的架构，比选一个让你可以做然后再靠自律避免，有效得多。

这不仅仅是关于 workflow 的选择。这个逻辑可以推得更远。

## 工具在教你如何使用它

DAG 编辑器对你说的悄悄话是："把我画得更漂亮一点。"

Agent 对话窗口对你说的悄悄话是："你看这个输出是不是有点问题。"

两个工具都在教你如何使用它们。只是前者教你去调流程结构，后者教你去调输出质量。

我之前犯的错误不是技术选择错误，是没意识到工具本身在塑造我的行为。我以为我在主动选择一个更"强大"的架构，实际上是我选择了一个把我引导到错误方向上的环境。

Anthropic 在 Building Effective Agents 里的那句话值得再读一遍："you should consider adding complexity only when it demonstrably improves outcomes"。但这句话只告诉了你要做什么，没有告诉你**怎么让自己做到**。我的经验是：靠自律是不够的。需要一个让你没有机会做那些事的架构。

## 我现在还没搞明白的一些事

Platform-as-Workflow 真的就没有场景了吗？肯定有。如果你的流程是高度标准化的——比如合规审查、金融风控、法律文档生成——每一步都必须执行、每一步都不能跳过，DAG 的硬边就是不可替代的。但我怀疑，即使在这些场景里，未来 agent 能力足够强之后，DAG 的大部分节点也会被 agent 内部消化掉，留下的只是一个最小化的确定性外骨骼。

还有一个让我不太舒服的推论：如果架构选择本身就编码了方法论约束，那我们是不是在把"人应该怎么做才是对的"的判断外包给了工具设计者？OpenAI 选择不做 DAG 编辑器，所以他们替所有 Codex 用户做了这个决定。如果他们的判断是错的呢？反过来，Dify 和 Coze 做了一个 DAG 优先的设计，他们在替所有用户做另一个方向的决定。什么时候应该信任工具的设计哲学，什么时候应该反抗它？

另外，我注意到了这个讨论里一个没有展开的话题：Agent-as-Platform 的效率可能比 Platform-as-Workflow 低——agent 在编排时会消耗额外的 token 来思考和决策，而这些 token 在 DAG 里是不需要的。对于高频、低价值的任务，这可能是决定性的劣势。但具体差多少，我没有数据。

最后一个在想的事情是，我们讨论的 Platform-as-Workflow vs Agent-as-Platform，可能只是一个过渡时期的分类。当 agent 足够强、足够可靠、足够便宜时，DAG 的外壳会变薄，越来越薄，直到只剩下门禁规则本身——artifact 的 schema、gate 的条件、合规的检查。那时候 workflow 和 agent 的边界就会消失。但这个过渡期会持续多久，我不知道。

## 参考文献

- Anthropic (2024). _Building Effective Agents_. https://www.anthropic.com/research/building-effective-agents — 区分 workflow 和 agent 两种 agentic 系统，提出"只在复杂度可以证明地改善结果时才增加复杂度"。
- Anthropic Engineering (2026). _How We Built Our Multi-Agent Research System_. https://www.anthropic.com/engineering/multi-agent-research-system — 多 agent 系统的编排经验，强调从小规模 eval 开始、prompt engineering 是主要改善杠杆。
- OpenAI Developers (2026). _Codex CLI Best Practices: Six-Stage Maturity Model_. https://developers.openai.com/codex/learn/best-practices — 从 prompt 到 automation 的六阶段成熟度模型，将 premature automation 列为正式反模式。
- Husain, H. (2024). _Your AI Product Needs Evals_. https://hamel.dev/blog/posts/evals/ — 提出"大多数人只关注改变系统"的观察，建立 eval 驱动的迭代飞轮。
- Yan, E. (2025). _Product Evals in Three Simple Steps_. https://eugeneyan.com/writing/product-evals/ — 区分 eval 基础设施（值得早期投资）与 workflow 编排基础设施（应由输出驱动）。
- Yan, E. et al. (2024). _What We've Learned From A Year of Building with LLMs_. https://applied-llms.org/ — 提出"优先使用确定性 workflow"，用 intern test 验证任务复杂度。
- Vaughan, D. (2026). _The Agentic Pod in Practice: Running Multiple Agent Roles in Your Team_. https://codex.danielvaughan.com/2026/03/28/agentic-pod-in-practice-multi-agent-roles/ — 五角色 sub-agent 编排模式，artifact-based handoff 的具体实现。
- zylos.ai (2026). _Agent Workflow Orchestration Patterns: DAG, Event-Driven, and Actor Model_. https://zylos.ai/research/2026-04-14-agent-workflow-orchestration-patterns/ — 三种编排模式的系统对比，hybrid 方案主导生产部署的结论。
- Bloomreach (2025). _The Great Debate: Static Workflows vs. Dynamic Agents_. https://www.bloomreach.com/en/blog/the-great-debate-static-workflows-vs-dynamic-agents — 讨论 OpenAI vs Anthropic 在 agent 架构上的哲学分歧。
- Gartner (2025). _Predicts 40% of Enterprise Apps Will Feature Task-Specific AI Agents by 2026_. Press Release. — 2025 年企业 agent 部署率不到 5% 的数据。
- Agentic Developer's Playbook. _Anti-Pattern: Premature Automation_. https://sahaavi.github.io/agentic-playbook/reference/anti-patterns/premature-automation.html — 将提前构建 CI/编排列为已验证反模式，提出 interactive → scripted → automated 的成熟度递进。

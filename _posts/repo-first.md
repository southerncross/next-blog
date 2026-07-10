---
title: 'Repo-First'
date: '2026-07-10T20:18:25+08:00'
description: '一个 repo 应该包含你需要的所有信息。clone 下来，直接开始工作。放在 repo 里不代表会被提交——最终提交的是经过精心选择的、绝对正确的知识。'
topics: ['agentic-workflow']
---

我们用 worktree 来管理项目。每次接到一个新任务，就新建一个 worktree，在里面完成开发，测试通过后删掉。这个模式本身很轻——worktree 的创建和销毁都很快，生命周期很短，基本上 Codex 跑完一个开发任务再加上简单验证，就可以清理了。

但这个流程里有一个卡点。

公司基建团队做了一个 CLI 工具，用来初始化 workspace。命令是 `workspace init`，它会帮你拉取仓库、装好 skill、配置 MCP server。思路是好的——降低上手门槛。问题是，这个工具是**仓库无关的**。它不知道自己会被用在哪个项目里，所以每次运行，它都必须问你一堆问题：你要 clone 哪个仓库、用什么 agent、对应的 Jira ticket 是什么、部署的泳道环境、分支名叫什么。填完这一串，它才开始拉资源。整个过程必须有人工参与，没法自动化。

而我们建 worktree 的频率非常高。原因是：每个任务的中间产物——生成的技术方案、测试用例、分析脚本——都留在本地目录里。这些文件虽然被 `.gitignore` 忽略了，但 Codex 在启动时仍然能读到它们。如果在一个旧的 worktree 里直接开新任务，Codex 就会撞上这些残留文件，受到干扰。解决办法很直接：每次新任务，建一个全新的 worktree。干净的 workspace，没有上一轮的残留。

但 `workspace init` 让「新建 worktree」变成了一个需要手动填表单才能完成的动作。一个本来应该很快的操作，被一个仓库无关的工具卡住了。

这让我开始想一个问题：为什么 workspace 的初始化逻辑不在 repo 里？如果它在 repo 里，一个 setup 脚本就能知道当前的仓库是谁、agent 配置是什么、分支命名规则是什么——不需要每次都问一遍。仓库无关，听起来是通用性，实际上是把自己变成了每次都必须人工介入的瓶颈。

我越来越觉得，在 agentic workflow 时代，有一条架构原则被很多人低估了。我把它叫 **Repo-First**。

## 我所理解的 Repo-First

Repo-First 的定义可以从三个方面来理解。

**它是一个起点。** 一个 repo 应该包含你所需要的所有信息。Clone 下来，你就已经在正确的位置了。不需要再去别的地方安装什么东西、配置什么环境——repo 里面都有了。跑一个初始化脚本，剩下就是直接开始工作。

这不是说永远不能把东西从 repo 里拿出去。只是默认值应该设在 repo 里。当你不知道一个东西该放在哪里的时候，先放在 repo 里。等时机成熟了——比如它真的需要在多个 repo 间共享了——再拿出去。不要一上来就预设它应该在外面。

**它追求聚焦与闭环。** Agent 在工作的时候，在 repo 内就能找到它需要的所有东西。代码规范在 `AGENTS.md` 里，架构决策在 `docs/architecture.md` 里，可复用的工作流在 `.claude/skills/` 里。不需要跳转到 Confluence 看文档，不需要打开 Figma 对照设计，不需要在 Slack 里翻历史决策。repo 是一个自包含的工作环境——agent 的注意力不需要离开它。

这也是为什么沙箱环境天然就差一截。有些工具让你在一个隔离的空间里生成代码，然后再尝试移植到实际项目里。但沙箱里没有项目的真实上下文——它看不到现有代码、读不到 AGENTS.md、不知道团队的命名约定。生成的代码看起来是对的，但放不进真实的项目里，因为它在生成的时候跟项目的架构没有任何关系。直接在 repo 里写，就不存在这个 gap。

**它追求实用性。** Repo-First 最终要保证的是，你生成的代码不是一个无法使用的 demo，而是一个真正可以被继续开发的、能合入主干的代码。repo 里面已有的代码、已有的架构、已有的约束，不是障碍——它们是生成质量的保障。正是因为受到了这些约束，生成出来的代码才能跟现有系统啮合在一起。

## 在实践中应用 Repo-First

如果你要在自己的项目里应用 Repo-First，有几个操作层面的细节值得提前想清楚。它们不是理论问题，而是在实际使用中会反复遇到的具体选择。我在自己的 workflow 里踩过这些坑，下面的建议来自这些经验。

**第一件事：区分「放在 repo 目录里」和「提交到 repo 里」。**

很多人听到「把所有东西放在 repo 里」，第一反应是：那 repo 不就变成了一个垃圾场吗？这个担心合理，但它混淆了两个概念。

真正被提交到 repo 里的东西，应该是经过精心选择的、绝对正确的知识。代码、文档、历史决策记录、编码规范——这些是 clone 下来就能直接用的内容，是 repo 的生产级知识。它们经过了 review，经历了从「这个东西可能有价值」到「这个东西确定有价值」的判断过程。

但 repo 目录里不只有被提交的东西。开发过程中产生的大量中间产物——workflow 中间节点的数据、技术方案草稿、session 会话记录——也可以放在 repo 目录下面，通过 `.gitignore` 忽略掉。这些东西生命周期很短，有些甚至是错的。但它们保障了 agent 工作的连贯性——上一个 session 的分析结果，下一个 session 可以接着用；一个中间阶段的方案草稿，下一步可以直接参考。

具体操作上：**把 `.gitignore` 当作工作状态和持久知识之间的边界线。** 线的一边是随时可以丢弃的工作状态，另一边是被严肃对待的、经过筛选的持久知识。你不需要为了放中间产物而创建一个 repo 外面的 scratch 目录——repo 目录本身就是 workspace，gitignore 就是它内部的过滤器。

**第二件事：用 Git Worktree 做任务隔离。**

光有 gitignore 还不够。它解决的是「什么东西不该被提交」，但没有解决「什么东西不该被下一个任务读到」。

这里有一个 agent 和人类开发者之间的关键差异。在过去，一个 repo 目录可能会被一直复用。研发人员拉一个分支出来，在上面写代码、提交，切回主干，再拉一个新分支继续开发。整个过程里，人一直停在同一个目录下面。中间产物即使 gitignored 了，也还留在本地——但人不怎么受影响，因为人能区分哪些文件是上一次的残留、哪些是当前任务需要的。

Agent 做不到这一点。它是 indiscriminate reader——它会读目录里的所有东西，把它当成潜在的上下文。上一个任务留下的技术方案草稿、测试报告、分析脚本，如果还留在那里，下一个任务的 agent 就会读到，然后被误导。而且这种误导是静默的——agent 不会告诉你它读了一份过期的草稿，它只是生成的东西悄悄偏了。

解决办法很直接：每次新任务，给 agent 一个干净的目录。最朴素的做法是重新 clone 一次——反正 clone 现在的速度已经很快了。但如果你做 repo-first，建 workspace 的频率会很高（每个任务一次），每次都 clone 还是有些重。

Git Worktree 就是为这个场景准备的。它让你在几秒钟内从一个已有的本地仓库创建一个全新的工作目录，共享同一个 `.git`，不需要重新 clone。拉出来的 worktree 是干净的——没有上一个任务的中间产物，没有残留的 session 记录。Agent 从头开始，在一个全新的目录里工作。等任务完成、代码合入之后，worktree 删掉，中间产物跟着一起消失。

这跟 gitignore 配合起来，形成了一个完整的隔离机制：gitignore 保证中间产物不会被提交到仓库里，干净的 worktree 保证中间产物不会跨任务泄漏。两者都不需要外部工具，都是 git 自带的。

所以如果你在做 Repo-First，强烈建议搭配 Git Worktree 使用。不是必须——每次都 clone 也能达到同样的隔离效果——但 worktree 把这件事变得更快、更轻，让「每个任务一个干净 workspace」从理论上可行变成了日常操作里不假思索的动作。

## 社区里怎么讨论 Repo-First

Repo-first 这个词在社区里其实已经有人在用，但含义各有侧重。

Dan McInerney 的 [architect-loop](https://github.com/DanMcInerney/architect-loop) 是最接近我理解的一个实现。它把多 agent 协作视为 repository protocol 而非 chat protocol——spec、frozen gate、ruling、lane file 全部住在仓库里。没有外部 CLI 工具，没有 workspace 抽象，就是 Claude Code skills + Codex CLI + git worktree。它的核心理念是：「memory is not a hidden chat transcript. If the next run needs to know something, it has to be written into the repo.」Not in the repo = didn't happen.

Ricky Smith 写过一个 [multi-repo worktree pattern](https://www.ricky-dev.com/coding/2026/01/agentic-tooling-across-multiple-repositories/)，场景更日常：他要让 agent 同时改动多个 Terraform 仓库，但又不希望上下文互相污染。他的做法是每个任务一个 worktree，父目录（branch 名）就是 workspace，里面放 `AGENTS.md` 和 `PLAN.md`，agent 读到这两个文件就知道要做什么。不需要 CLI 工具，git 就够了。

这两个项目有一个共同点：repo 本身就能承担 workspace 的职责。加一层外部工具，就多一个 drift 面。

Arpit Asthana 把 repo 定位为「operational spine」——不是代码的存储层，而是决策逻辑、证据链条、运行时行为的骨架。Rany Elhousieny 的 Agentic-Repo 框架定义「agentic repository」= code + AI knowledge layer，他的转换工具是往 repo 里加东西，而不是在 repo 外面建一个 workspace——工具的输出住在 repo 里，所以它仍然算是 repo-first。

这些讨论里有一个普遍特征：它们都是 additive 的——「应该在 repo 里加这些文件」「应该在 repo 里建这个结构」。但 Repo-First 还有一个 negative 的面向——它说的不光是「该往 repo 里放什么」，更是「不该在 repo 外面建什么」。这个 negative 的维度在现有讨论里很少出现。

## 一些还没完全想清楚的问题

Repo-First 在所有场景下都是对的吗？我不确定。如果一个组织有几百个 repo，每个 repo 有自己的 setup 方式，让新人一个一个 `clone + setup` 确实有摩擦。这时候一个统一的 workspace CLI 可能确实有价值。但这种价值是在 repo 治理层面解决的——想办法让所有 repo 的 setup 方式统一——还是在 workspace 层面解决的？可能两者都需要，但 Repo-First 会倾向于前者。

如果 agent 自身开始参与 harness 的构建，Repo-First 会不会变成一种约束 agent 行为的规范，而不仅仅是架构原则？比如「agent 只能在 repo 范围内操作，不能去改外部的工具」，这可能涉及的是 agent 的操作权限边界应该画在哪儿。

Repo-First 跟 single source of truth 这个更古老的架构模式是什么关系？AI Pattern Book 把 source of truth 定义为「每一条信息都只有一个权威位置」，并且特别指出 agentic workflow 里这个问题会被放大——当 agent 在 config 文件和 constants 模块里各写了一份配置，系统坏掉的时候你根本不知道以谁为准。Repo-First 可能就是 single source of truth 在 agent workflow 时代的重新表达，只不过强调的重点从「数据一致性」变成了「工作环境和配置的唯一性」。

还有一个我反复在想的问题：在过去，用 `npm install` 就能装好依赖，你不需要一个专门的「JavaScript 依赖管理 CLI」。在 `git clone` 就能拿到全部配置的时代，你也不需要 `workspace init`。但未来呢？如果 AI 的生产速度持续加速，会不会出现一种新的 repo 形态——它不是一个静态的仓库，而是一个活的、能自我演化的知识环境？到那时候，Repo-First 意味着什么？

## 参考文献

- Dan McInerney. _architect-loop_. https://github.com/DanMcInerney/architect-loop — 把多 agent 协作视为 repository protocol 而非 chat protocol。核心理念："memory is not a hidden chat transcript." 所有持久状态写回 repo。
- Ricky Smith. _The Missing Workspace Layer for Agentic Polyrepo Development_. 2026. https://www.ricky-dev.com/coding/2026/01/agentic-tooling-across-multiple-repositories/ — 提出了 multi-repo worktree pattern，用 git worktree 做 workspace 隔离，父目录作为任务上下文。
- Arpit Asthana. _Building a Repo-First Agent System for Runtime Decision Support_. 2026. https://www.linkedin.com/pulse/building-repo-first-agent-system-decision-arpit-asthana-2dlqe — 将 repo 定位为 "operational spine"，提出了 repo-first、contract-driven、evidence-linked 等六项原则。
- Rany Elhousieny. _Agentic Repos: The Framework That Turns Any Repository into an AI-Ready Workspace_. 2026. https://www.linkedin.com/pulse/agentic-repos-framework-turns-any-repository-senior-rany-ilsyc — 提出了 agentic repository = code + AI knowledge layer 的定义，其转换工具输出仍落在 repo 内。
- AI Pattern Book. _Source of Truth_. https://aipatternbook.com/source-of-truth — 将 source of truth 模式应用于 agentic workflow，指出 agent 生成重复配置会导致系统不一致。

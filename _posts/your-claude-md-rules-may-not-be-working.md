---
title: '你的 CLAUDE.md 里 80% 的规则可能没起作用'
date: '2026-05-18T18:29:00+08:00'
description: '大多数人高估了 CLAUDE.md 这类指令文件中“写点原则”本身的价值。真正决定 agent 行为的，不是那些看起来正确的散文式建议，而是是否存在可执行、可验证、可强制的结构化约束。与其不断往指令文件里堆规则，不如先删掉无效噪音，把有限的 instruction budget 留给真正能改变行为的 command、检查点与 hooks。'
topics: ['agentic-workflow']
---

Karpathy 的那个 CLAUDE.md——四条原则、358 个词——拿了 13 万 star。很多人加了之后说"效果非常好"。但 Blake Crosley 跑了一组对照实验，同一任务 10+ 次重复，发现他测的那几类指令完全没有改变 agent 行为。

一个好笑的冲突：一边是"效果非常好"的用户反馈，另一边是"零效果"的实验数据。两边都可能是对的。

我把最近能找到的、带有定量或半定量证据的研究理了一遍，想说清楚三件事：什么确定无效，什么确定有效，以及为什么"感觉有效"和"真的有效"之间有条很难发现的鸿沟。

## 确定无效的五类指令

Crosley 的测试方法很简单：同一个任务，同一模型，有这条指令 vs 没有，跑 10 次以上看产出差异。五类指令产出了零差异：

**散文式主张。** "We value clean, well-tested code. Please ensure all changes are properly tested before submitting." Agent 读到了这个，把它存为一个弱偏好信号，然后该不写测试还是不写测试。因为"properly tested"不是一个可执行的行为——没有命令可跑，没有阈值可判，没有退出码可检查。Agent 拿它没办法。

**模糊指令。** "Be careful with database migrations." "Careful" 不是行为规格。你无法判断一个动作算不算 careful。"Run `alembic check` before applying migrations. Abort if downgrade path is missing" 是行为规格——跑不跑、什么时候中止，都是确定的。

**冲突优先级不加排序。** "Move fast / Ensure test coverage / Keep runtime under 5 minutes / Run full integration suite" — Agent 没法同时满足四条。没有显式优先级时，它优化最"可见"的指标（码量、提交频率），跳过最"不可见"的（验证、审查）。原因很直觉：代码是 agent 能指着说"我做了这个"的东西。测试只是一个退出码，没人在看。

**风格指南没有 enforcement 命令。** "Follow the Google Python Style Guide for all code." 没有 `ruff check --select D` 或 `pylint --rcfile=.pylintrc` 就是建议，不是规则。Agent 没有自检机制来确认它是否真的 follow 了。

**用 CLAUDE.md 做 linter 的活。** 代码格式、空格风格、import 排序——这些 Prettier、Biome、ESLint auto-fix 确定性解决、零 token 成本。在 CLAUDE.md 里写这些，是拿最贵的租户（instruction budget）住最廉价的房（可确定性执行的格式化）。

## Instruction Budget：为什么"不用白不用"是错的

这里有个特别重要的机制，大多数人不知道。

Frontier LLM 能稳定 follow 的指令条数大约是 150-200 条。Claude Code 的系统 prompt 已占了约 50 条。你的 CLAUDE.md 在争夺剩余的 budget。

但关键不是"超了就不行"。关键是**衰减是均匀的**——不是位置靠后的指令被忽略，而是随着指令数增加，所有指令的 compliance 质量同时下降。小模型指数衰减，frontier thinking model 线性衰减。HumanLayer 因此把 CLAUDE.md 控制在 60 行以下。

这意味着每加一条规则，是在削弱全文件所有规则的执行力。所以"写上总比不写好"是错的——如果这条规则没有改变行为，它不只是无害的，它在主动伤害其他规则。

这也解释了为什么 Karpathy 的 358 词 CLAUDE.md "感觉有效"：358 词大概只占 20-30 个 instruction slot，远低于 budget 上限。它不是加太多了被忽视，而是太软了——全是 prose 建议，没有 enforcement。

## "如果不确定就问"为什么没用

AMBIG-SWE（ICLR 2026）做了一件很精准的事：量测 agent 遇到模糊需求时的行为。结果：agent 选择默默执行而非提问，resolve rate 从 48.8% 降到 28%。20.8 个百分点的代价。

"Think Before Coding"或者"if unsure, ask"这种写在 CLAUDE.md 里的 prose 要求——Crosley 的实验和 AMBIG-SWE 的数据共同指向一个结论：它们不改变行为。Agent 读到了，表示了同意，然后自行其是。

什么有效？结构化的检查点加 enforcement："Before implementing, list all assumptions AND WAIT FOR CONFIRMATION"。关键不是语气强弱，是那句"and wait for confirmation"——它把一个可选行为（"你应该问"）变成了一个必须行为（"你必须停在这里等确认才能继续"）。这就是 enforcement：从建议变成检查点。

## "我觉得有效"的幻觉

为什么那么多人说 CLAUDE.md"效果非常好"？我觉得有三个原因。

**从 0 到 1 的差距大，从 1 到 N 的差距小。** 没有 spec file 时，agent 完全凭上下文猜你想干嘛。加了任何结构化的指导，无论多软，都是在提供上下文。差异显著不是因为指导本身强，而是因为基准太低。

**模型默认行为和你的规则恰好重叠。** "Write clean code"写了，agent 也确实写了还算干净的代码。但这可能是因为 Claude 本来就倾向写干净的代码——它是被大量高质量代码训练出来的。规则和模型默认行为重合时，你无法区分是规则起了作用还是模型本来就会这么做。

一个没被充分讨论的问题：你的 CLAUDE.md 里有多少条确实改变了行为、有多少条只是在重复模型的默认倾向？没人系统测过。HN 上有人直接提了这个问题："这些文件里写的东西不已经是模型的默认行为了吗？"没人能给出有数据的回答。

**确认偏差。** 你关注的场景是"agent 做对了"。你不太关注"agent 没做你那条规则说的事但因为其他原因结果还行"的情况。你更容易记住成功的案例而忘记失败的。

## 一个反直觉的结论：先删再加

指令文件有个自然的生长模式：每次 agent 犯错，加一条规则。Peter Steinberger 的 AGENTS.md 已经 800 行了，他管它叫"组织疤痕组织的集合"。这就是 ratchet effect——只加不减。

但在 uniform degradation 机制下，ratchet effect 不只是膨胀问题，是每个新加的无效规则都在稀释全文件执行力的问题。所以正确的做法反过来：**当一条规则没改变行为时，问题不是规则太弱，是文件太吵。减噪音，不是加细节。**

Crosley 提出了一个实用的 anti-ratchet protocol：先删掉不起作用的规则（需要 fixture testing 来验证哪些确实无效），腾出 budget，再添加新规则。这比在噪音里塞更多细节有效得多。

## 真正有效的六件事

把有定量或半定量证据的模式列出来：

**Command-first。** 每条指令回答：什么命令能证明这条被执行了？命令是二进制的——跑了就是跑了，没跑就是没跑。

**Definition of Done。** Agent 最常见的 failure 不是"做错了"而是"以为做完了"。显式的完成条件——退出码、测试通过条件——把主观判断变成二元状态。

**Priority 1/2/3 排序。** 不能同时满足的约束必须排序。没有排序时 agent 优化最可见的产出（代码），跳过最不可见的（验证）。

**Escalation rules + Never list。** 被阻塞时的默认行为是越来越有创意的 workaround：注释掉失败的测试、删 lock file、force push。一个 "Never" list（never delete files to resolve errors, never force push, never skip tests）封死最危险的 escape route。

**Progressive disclosure。** 不把所有指令塞进根文件。用指针指向 task-specific 文件，agent 需要时才读。OpenAI Codex 的 mono-repo 用了 88 个 AGENTS.md 文件，每个 service 独立。

**Hooks over instructions。** "绝对不能违反"的行为交给 hooks，不交给 instructions。Hooks 是确定性的；instructions 是建议性的。一个 Stop hook 自动跑 formatter 比 CLAUDE.md 里写 "always run formatter" 可靠一个数量级。

## 写作顺序

大多数人从 style guidance 开始写 AGENTS.md——这是优先级最低的。Crosley 的实验验证了正确的顺序是：build/test commands → definition of done → escalation rules → task-organized sections → directory scoping → style。前两条决定了 agent 能不能正确地工作，你把最关键的信息放在了最后。

## 有一个问题我还没搞明白

那些"看起来有效"的规则里，有多少是真的在改变行为、有多少只是恰好和模型默认行为重合？这需要同一任务、同一模型、有/无该规则的对照实验。据我所知，没有人做过系统性的 A/B 测试。

缺的证据是：同一 codebase + 同一 task set + 有/无 spec file 的产出质量对比；不同 spec file 长度对 agent 产出质量的剂量-效应曲线；command-first vs prose-first 的控制组实验。

直到这些数据出现之前，所有关于"CLAUDE.md 效果"的判断——包括这篇文章里的——都是基于观察性证据，不是控制实验。我对 command-first 和 enforcement 机制的信心来自 Crosley 的对照测试和 AMBIG-SWE 的数据，这些都是片段性的。完整的画面还没画出来。

另一个是 95% 的上限。把所有信息一次给齐（spec-driven development 的核心做法）保留了约 95% 的单轮性能。剩下的 5% 可能代表了用户只有看到 partial output 才知道自己想要什么的那类需求。如果这是对的，spec file 不管写得多完美，都有 5% 的需求覆盖不到——因为那些需求在写 spec 的时候还不存在。但 95% 这个数字来自一个实验，没被跨任务类型和领域复现过。

## 参考文献

- Blake Crosley, "AGENTS.md Patterns: What Actually Changes Agent Behavior" (blakecrosley.com). 10+ runs per pattern 的对照测试，识别出五类零效果 anti-pattern 和 command-first 有效模式
- Blake Crosley, "Context Is Architecture" (blakecrosley.com). 六个月生产环境实践，从 50 行 CLAUDE.md 演化到 650 文件的分布式架构
- HumanLayer, "Writing a Good CLAUDE.md" (humanlayer.dev). Instruction budget 量化测试，~150-200 条上限，uniform degradation 发现，保持 CLAUDE.md 60 行以下
- Laban et al., "LLMs Get Lost in Multi-Turn Conversation". 39% 多轮退化，95% concat 策略保留，为 spec-driven development 提供理论基线
- AMBIG-SWE (ICLR 2026). Non-interactive default 的量化代价：48.8% → 28% resolve rate，20.8 个百分点
- GitHub Blog, "How to write a great agents.md: Lessons from over 2,500 repositories". 2500+ 仓库的模式分析，识别 vagueness 为主要 failure mode
- Anthropic Engineering Blog, "Effective Context Engineering for AI Agents" (Sep 2025). Context engineering 作为 prompt engineering 的升级；attention budget、context rot、diminishing marginal returns
- Anthropic Engineering Blog, "Harness Design for Long-Running Application Development" (Mar 2026). $9 solo agent vs $200 full harness 的实验数据，验证 harness 架构对产出质量的影响
- Addy Osmani, "How to write a good spec for AI agents" (addyo.substack.com). Instruction budget 概念，WHAT/WHY/HOW 结构
- Simon Willison, "more authoritarian approach to prompting". 明确约束比传达意图更能减少 review 负担的实践观察
- Andrej Karpathy, X post (2026). LLM coding pitfalls 的三条观察：错误假设、过度工程、乱改无关代码；后续被 multica-ai 项目转化为四原则 CLAUDE.md，13 万 star

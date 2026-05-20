---
title: '扁平化组织丢掉的不是层级，是争议终止机制'
date: '2026-05-20T10:07:30+08:00'
description: '扁平化组织去掉的不是层级，而是争议的终止机制。层级真正解决的问题不是协调——spec文件、异步沟通都能替代协调——而是在信息不足以达成共识时，提供一个制度化的方式让争论停下来。'
topics: ['agentic-workflow']
---

一个团队转到 AI-native 工作方式。所有人都写 spec、agent 写代码、人做 review。听起来很顺，直到某天两个人对同一个功能的设计产生分歧——A 觉得该用这个架构，B 觉得该用那个。都有经验，都说服不了对方。

过去这事有上级拍板。决定未必最优，但争论到此为止。

现在呢？"我们是扁平化团队。"于是争论开始延续。不是一小时的争论，是那种每隔几天重新冒出来、换个说法再说一遍的争论。它不会 kill 你的项目，但会持续消耗注意力和信任。

## 层级真正解决的问题不是协调

很多人以为层级解决的是协调——谁跟谁对接、谁负责什么。但协调有很多替代方案：spec 文件、共享文档、异步沟通。真正不好替代的是**争议终止**。信息不足以达成共识的时候，层级提供一个制度化的方式让争论停下来。

两个合理的人可以对同一问题做出不同但各自自洽的判断。这种情况在有 agent 的团队里我觉得会更频繁——每个人都能看到 trace 和验证结果，判断依据更多了。但更多依据不等于更多共识，往往意味着更多分歧点。

去掉层级，你拿掉的不是"有人管我"的感觉。你拿掉的是争议的终止条件。

## Jo Freeman 五十年前就说过了

1972 年，社会学家 Jo Freeman 写了"The Tyranny of Structurelessness"。她的核心论点是：去掉正式结构不会消除权力，只会让权力变得不可问责。没有正式层级时，权力流向社交资本最多的人、任期最长的人、声音最大的人、跟创始人关系最近的人。这种影子权力没有 job description、没有问责机制、没有申诉渠道、没有透明度。

你没法向一个"技术上不比你高"的人提异议。他没有正式权威，你也无法正式挑战他的非正式权威。你只能输，或者继续争论。

五十年了，技术行业还在反复学这个教训。

Valve 是最著名的案例——"desks on wheels"，没有 manager，员工自己选项目。但离职员工后来描述的是非正式小圈子控制项目资金，新员工系统性地被排除，几个 senior 掌握巨大隐形权力。Zappos 2013 年引入 Holacracy，2015 年 18% 的员工离职，很多人直接把这个系统列为离职原因。Medium 同年试 Holacracy，三年后放弃，理由是"在规模上难以协调"。

模式是一致的：理想 → 影子层级 → 失灵 → 悄悄把传统结构加回去。

## 扁平化的三个收场方式

没有终止机制的时候，争议通常以三种方式收场——每一种都比"上级拍板"差：

**最大声的人赢。** 不是判断力最好的，而是最 persist、最愿意争论的。这跟决策质量毫无关系，但争论是一场消耗战，最后坚持不住的一方让步。

**创始人默认赢。** 扁平化公司里签字的人是唯一有实权的人。"flat" 这个标签让创始人保留了所有实际权力，同时显得很开明。这是一种很方便的安排——权力还在，只是不可见了。

**拖着不干。** 既然谁也说服不了谁，那就先不决定。这可能是最常见也最隐蔽的——你不会看到一场激烈的争论，你会看到一系列微妙的推迟，和逐渐扩散的犹豫。

三种方式都比"一个指定的人做出一个不完美的决定"更差。因为上级拍板至少是显式的、可追溯的。影子权力和无限推迟都不是。

## 但问题不是要不要层级

我不认为答案是"回去做传统层级"。Jo Freeman 的论点不是提倡层级——她说的是，你必须让权力变得可见和可问责，不管你用什么结构。

对 AI-native 团队来说，"谁有权限做什么决定"本身就是一个需要预先设计的东西，而不是碰到再处理的事。

Augment Code 最近提了一个有用的框架——**决策分层**：

有些决定只允许人做（架构决策、安全策略、上线审批）。有些 agent 可以辅助，但人必须批准（需求验证、设计评审、代码合并）。有些 agent 可以完全自主（单元测试生成、代码脚手架、常规 CI）。

具体怎么分因团队而异，关键不是 tier 的边界而是**分层这件事本身**。它解决的问题是：每一类决定有一个预先指定的 authority，而不是默认"大家讨论一下"。有争议的时候，你不是在争论"谁说了算"，因为规则已经定了——这一类决定，是这个人拍板。

## "谁负责谁决定"可能比"上级决定"更合适

传统组织的"上级拍板"有一个隐含假设：信息自下而上流动，决策自上而下传达。这跟 AI-native 团队的现实对不上——最接近代码的人拥有最多的判断依据，因为他能看到 agent 的执行 trace、验证结果、备选方案的差异。把决策权放在信息最充分的人手上，比放在职级最高的人手上更合理。

这不是什么新鲜想法。Open source 社区几十年前就想明白了这个问题。Linux 有 Linus，Python 有 Guido——BDFL（Benevolent Dictator For Life）。不是一个 manager 在协调人际关系，而是一个技术判断力受团队信任的人，在争议时做最终裁决。权威来自判断力的 track record，不是职级。

BDFL 模式有不少问题——single point of failure，判断力会随时间退化，open source 里有 fork 作为逃生阀而公司里没有。但我觉得核心原则是对的：**终止争议的权威应该来自判断力，不是职位。**

也不一定需要单一 BDFL。可以按领域指定不同的人——一个管架构裁决，一个管 spec 裁决，一个管 UX 裁决。authority 是 domain-bounded 的，不是 total 的。在 AI-native 团队里这可能更合理，因为不同领域的 expertise 分布本来就不均匀。

## 一个更激进的思路：让 agent 做 tie-breaker

当 A 方案和 B 方案谁也说不了谁的时候，让 agent 分别实现一个最小可比较的原型，用数据说话。

这不总是适用的——有些决策（"产品应该给人什么感觉"）跑不出有意义的数据。但很多技术决策是可以的：选哪个库、用哪个架构、哪种查询更快。过去这些分歧要在白板前吵两小时，现在可以让两个 agent 各跑一遍，拿 trace 和 benchmark 对比。

争论从"我觉得"变成了"跑出来的数据说"。不一定是最终答案，但争论的性质变了——从品味之争变成了可验证的差异。

## 你需要先写 decision protocol

不管是决策分层、BDFL、还是 agent tie-breaker，核心都是同一件事：**争议的终止方式必须预先设计，不能等着争论发生了再去想。**

这跟写 spec 文件是同一个道理。Spec 文件的功能不是消除所有歧义——那是做不到的。它的功能是把你已经做过的决定固定下来，让 agent 不需要每次都重新谈判。Decision protocol 的功能也是一样的：把争议的终止规则固定下来，让人不需要每次都从"谁说了算"开始吵。

一个极简的 decision protocol 可以写在半页纸里：

- 哪些决定由谁做（按领域列出来）
- 一个决定如果 30 分钟内达不成共识，怎么终止（指定 decider 还是跑原型对比）
- 决定一旦做出，什么情况下可以重新讨论

最后一条我觉得很容易被忽略。没有它的话，争议看起来"终止"了，实际上只是暂停——下次开会换个说法再来一遍。有了重新讨论的条件，决定才算真终止：除非出现新的信息，否则不再重开。

## 为什么 AI-native 团队特别容易陷入这个问题

传统团队里，分工是按角色定的——产品经理决定需求，架构师决定技术方案，设计师决定 UI。每个人在自己的领域有默认的 decision authority，争议相对少。

AI-native 团队的角色边界天然模糊——工程师做设计，设计师提交代码，每个人都写 spec 每个人都 review。这解放了生产力，但也意味着更多决策没有天然的"谁说了算"。当每个人都能对每个方面发表有依据的判断时，判断冲突的频率只会更高。

所以决策协议不是扁平化组织的奢侈品，是必要条件。没有它，你得到的不是高效的自治团队，是一个谁声音大谁说了算的环境——而且权力还不可见。

Jo Freeman 五十年前就说了：你不可能通过假装结构不存在来消除权力结构。你只能让它变得可见和可问责。

## 参考文献

- Jo Freeman (1972). "The Tyranny of Structurelessness." jofreeman.com. Key finding: removing formal structure prevents hierarchy from being held accountable, not from forming; invisible authority is more dangerous than visible authority.
- Valve Corporation. Employee Handbook (2012). Key observation: flat structure with "desks on wheels" produced informal cliques, invisible senior power, and systematic exclusion of new employees.
- Zappos (2013-2015). Holacracy adoption and 18% employee departure. Key finding: eliminating traditional managers without replacing dispute resolution mechanisms causes organizational dysfunction.
- Medium (2013-2016). Holacracy adoption and abandonment. Key finding: "difficulty coordinating efforts at scale" as reason for returning to conventional management structure.
- Augment Code (2026). "Agentic Engineering Operating Model." Key contribution: decision authority tiers (human-only / agent-assisted-human-approves / agent-autonomous) making authority explicit per decision type.
- BDFL governance model. Open Source Guides (opensource.guide). Key finding: authority from judgment track record, not formal title; faster than consensus, more meritocratic than traditional hierarchy.
- Gallup. State of the Global Workplace Report. Key finding: only ~23% of employees engaged worldwide; top driver of disengagement is lack of clarity about expectations and role definition — exactly what flat organizations eliminate.
- Harvard Business Review analysis. Key finding: organizations removing middle management layers experienced significant decline in coordination and increase in employee confusion about decision-making authority.

---
title: 'The Message Is the Map, Not the Territory'
date: '2026-06-10T20:47:26+08:00'
description: 'Nodes pass information between each other. Push carries a pointer, pull fetches the content—the message is the map, not the territory. Self-describing lets the downstream understand on its own; requirement-driven lets the upstream produce on demand. Both patterns have a cost, and in an agent system what really matters is picking one and seeing it through.'
topics: ['agentic-workflow']
---

While building a workflow recently, I caught myself wrestling with the same question over and over: node A finishes its work, so how does its output get passed to node B?

It doesn't sound like a question. You tell B the path to A's output file, B reads it, done. Right?

But after a few attempts I realized this "done, right?" decision pulls the entire workflow's context management in completely different directions.

## Two intuitive answers, both wrong

The first intuition: put all of A's output into the message you pass to B. Whatever files A wrote, whatever intermediate results it produced, whatever key decisions it made—package it all up, and the moment B receives the message it knows everything.

The problem is context. A might have produced a 10MB data file, three intermediate analyses, five rounds of competing proposals. Cram it all into the message and B's context is maxed out before it even starts working. And B might only need one small file out of all that—the remaining 9.9MB is noise.

The second intuition: just tell B to go look in A's output directory. B knows what it needs, so let it dig around itself.

The problem is search. B faces a directory tree without knowing what's in it, what each file is for, or what to look at first. It starts blind-searching—open a file, no, close it, open the next one. Every step is a tool call, every round burns tokens, and there's no direction.

Two answers, one leading to context overload, the other to blind search.

I later realized these two answers correspond to the two extremes of information passing: **push everything** and **push nothing**. What's actually needed is something in between.

## Push and pull, each doing its own job

After spending some time thinking it through, I split it into two layers.

**Layer one: push (the message).** When A finishes executing, it produces one structured message, and this message enters B's context. But the message doesn't contain the full output—only the information for "how to find the output":

- where the artifact is (the path)
- what's inside (a high-level overview, like a skill's description)
- how to use it (read the README first to get the full picture, then fetch what you need)

The message is a pointer, not the data. The message tells B "here's where the door is, and roughly what's inside," but it doesn't push the door open for B.

**Layer two: pull (the artifact).** The actual output sits in a self-describing directory. After B receives the push message, it digs through the artifact itself—starting from the README, getting the full picture, then loading the files it needs on demand. The artifact's contents do not enter context automatically; B decides what to read and when.

These two layers each solve one problem. Push solves B's need to know "what exists"; pull solves B's need to obtain "the actual content." Push content enters context (because B must know it), pull content does not (because B only needs to know how to find it).

An intuitive analogy: a library's catalog system and its shelves. The push message is the index card—it tells you which book is on which shelf and roughly what it covers. The artifact is the book on the shelf—you grab the one you want, without hauling every book onto your desk.

This distinction looks subtle, but it makes a big difference in practice. A B node receives the push message and finds it only needs one particular data file from the upstream artifact. It reads the README, locates that file, loads it, and starts working. The other 9MB of files in the artifact directory never enter B's context.

With full push, those 9MB are already in context—taking up space, diluting attention, increasing token consumption.

## An artifact can't be a random pile of files

There's a prerequisite here: the artifact directory is not a random pile of files. If B opens the artifact directory and sees `output1.json`, `temp.csv`, `analysis-v3.md`, it still has to blind-search.

So the artifact must be self-describing. At a minimum it includes a README.md serving as a map of content—telling the downstream agent what files are in the directory, what each one is for, and in what order to read them. A downstream agent's standard operating procedure should be: read the README first, get the full picture, then decide which files to load.

This is why an agent's output should be self-describing—not just so humans can read it, but because it's the downstream agent's only entry point for **navigating** the artifact. An artifact directory without a README is, to an agent, a blind search.

As for whether to add a manifest.yaml as a structured index so the downstream agent can read precisely with a tool call—I think the direction is right, but you can start with the README and add it later, once practice shows README-based navigation isn't precise enough.

## Execution-level granularity: same node, different runs, different directories

There's another detail that's easy to overlook at first: what is the smallest granularity of an artifact?

The intuitive answer is **per node**. The build node's artifacts go in `/artifacts/build/`, the test node's in `/artifacts/test/`. Clean, simple.

Until the build node has to retry.

The first run failed, the second run succeeded. With per-node storage, the second run's artifact overwrites the first's. You want to compare what differed between the two runs—sorry, the first one is gone.

The correct granularity is **per execution**. `/artifacts/build/run-001/`, `/artifacts/build/run-002/`. Same node, different runs, different directories.

This choice affects three things:

**Retry debugging.** First run failed, second succeeded—pull both artifacts and diff them: where do the intermediate results differ, where do the tool-call paths diverge, was some input interpreted differently? These are key signals for locating the problem, and node-level storage crushes them outright.

**Auditing.** In production you'll get asked "what exactly did the deploy at 2pm Tuesday produce?" Execution-level directories can be located directly by timestamp and run ID. Node-level directories can only tell you what the last run produced—all prior history has evaporated.

**Parallel execution.** If the same node type needs to run in parallel on different inputs (say, building three components at once), node-level directories are a race condition. Execution-level directories are naturally conflict-free.

Directory naming needs a stable convention—a sequence number like `run-001` isn't good enough, because under parallel execution you can't guarantee who grabs 001 first. A timestamp prefix plus a unique identifier is a safer choice, and it also lets the downstream node assemble the artifact path directly from the push message.

## The whole workflow is also an artifact

If every node has an artifact, then the whole workflow can have one global artifact directory too.

It's essentially a directory containing all the nodes' artifact subdirectories. Add a global README.md as the self-description of the entire workflow's output. You can also add an execution-status file—current progress, which node succeeded and which failed, what went wrong.

This design turns the workflow's execution state into a natural part of the artifact, with no separate monitoring system needed to track it. You want to know how far a workflow has gotten—go look at its artifact directory. You want to know what a node produced on its last run—go look at the corresponding subdirectory. Everything is in one place, self-describing, and can be inspected by a human or an agent.

It also means the workflow's artifact directory can keep existing after the workflow finishes—it's the complete record of this run, with no extra persistence mechanism required.

## And there's a completely opposite approach

By this point I felt the self-describing pattern was self-consistent—the upstream is responsible for documenting, the downstream for understanding, each playing its part.

Then I heard about another way of doing it.

Before a downstream node starts, it directly declares what it needs: "I need three files, A, B, and C, in formats X, Y, and Z respectively." This declaration is injected into the upstream node's prompt—not a suggestion, a requirement. The upstream must produce A, B, and C; if even one is missing it gets rejected at the gate check and sent back for rework.

This is the exact opposite of the self-describing logic. Self-describing is **the upstream produces something, the downstream adapts to it**. This approach is **the downstream needs something, the upstream provides it**. The burden of compatibility moves from the receiver to the producer.

At first I thought this was too rigid. Every node has to precisely declare its needs from the upstream, maxing out the coupling between nodes. The upstream switches to a different implementation, which changes the output file structure—sorry, you didn't satisfy the downstream's requirement, rejected.

But I later realized this judgment missed a prerequisite: you don't have to hardcode the requirement into the upstream node's logic at all. The downstream's input requirements are injected into the upstream as part of its prompt—the upstream knows, while it works, that "the downstream needs A, B, and C," and it decides for itself how to produce those files. The coupling isn't at the code level, it's at the contract level. The two nodes share no implementation details, only a "deliverables list."

Two patterns, one facing inward, one facing outward. Self-describing is **inward-facing compatibility**—you do your own work well, write good docs, and trust others to understand. Requirement-driven is **outward-facing demand**—you state clearly what you want, and others must provide it.

## Two philosophies, one mirror

What's interesting is that this distinction has a precise counterpart in human collaboration.

The self-describing pattern is like an independent, free-spirited person—I do my work, I leave the output there, I write clear instructions, and you come look at it yourself. If you struggle to understand it, that's on you to read the README a few more times. The friction is absorbed by the receiver.

The requirement-driven pattern is like a person bold enough to make demands—I state what I need clearly, and you produce it. If you fall short, the one who does rework is you, not me. The friction is absorbed by the producer.

In human organizations, these two patterns often coexist asymmetrically. A senior engineer with clout can deliver loose docs to the downstream while demanding precise inputs from the upstream—"read my README yourself," and at the same time "your output format is wrong, redo it." Power decides who bears the compatibility cost, not the rules.

But in an agent system there's no senior and junior, no superior and subordinate. There are only nodes. Each node is both upstream and downstream. If you configure all nodes to use the self-describing pattern, every node has to read others' READMEs and is also read by others. If you configure all nodes to use the requirement-driven pattern, every node has to satisfy the downstream's requirements and can also make demands of the upstream. The total burden is symmetric.

What really matters in the system's properties is **consistency**, not which pattern you chose. Inconsistency—some nodes demanding precise inputs but producing loose docs—might be backstopped by power relations in a human organization, but in an agent system it's pure architectural debt.

## These two paths, in the bigger picture

This distinction isn't a new problem. The distributed-systems field has been arguing about it for fifty years.

In 1981 Jon Postel proposed the robustness principle: "Be conservative in what you do, be liberal in what you accept." You produce rigorously and accept generously. The compatibility burden is on the receiver. This is the theoretical source of self-describing.

But in 2018 CACM published an important article reexamining this principle, and its core criticism was: "be liberal in what you accept" causes the whole ecosystem to slowly accumulate tolerance for malformed messages—every downstream is quietly patching the upstream's nonconformity, and nobody fixes the upstream itself. The complexity debt is spread across all consumers. This is the theoretical support for requirement-driven: if the downstream doesn't accept incomplete output, the upstream has to fix it.

The industry's two routes are clear too. Consumer-Driven Contracts (the Pact framework) turned requirement-driven into an executable CI process—consumers define expectations, and providers must pass verification before they can deploy. By 2026 there were already teams porting this pattern to agent communication. Agent Output Contracts practitioners put it even more bluntly: "A schema in a README is a suggestion. A schema in code is a constraint."

Meanwhile Claude Code's subagent mechanism and Google ADK's handle pattern take the self-describing route—the upstream produces free-form output, and the downstream understands it on its own.

The big frameworks are picking sides too. Microsoft Agent Framework's executors talk via type-safe message routing, Dagster's assets have explicit typed dependencies, Temporal's activities have strongly-typed contracts—these are requirement-driven. Whereas Claude Code subagents return natural-language messages, and Google ADK by default gives the downstream only a lightweight reference—these are self-describing.

The production reality is hybrid: typed contracts run along the edges of the DAG, free agent reasoning runs inside the nodes.

But before all of this, the earliest and most fierce showdown didn't happen in distributed systems—it happened in the browser.

From the late 1990s into the early 2000s, XHTML tried to use XML's strictness to constrain HTML—tags must be closed correctly, attributes must be lowercase, and a single syntax error means refusing to render. This is classic requirement-driven: the producer must output a spec-compliant document, or the consumer won't accept it.

The approach was technically self-consistent, but it had a fatal flaw: it required everyone on the internet writing HTML—from professional developers to hobbyists dragging things around in FrontPage—to strictly follow the XML spec. The moment one person made a mistake, their page wouldn't display. XHTML put the compatibility cost on every single content producer.

HTML5 went the completely opposite way. It didn't require everyone to write correct HTML; instead it wrote error recovery into the spec—yes, the spec explicitly states "when you hit this situation, the browser should handle it like this." When Ian Hickson designed the HTML5 parser, he did a survey: in reality, over 95% of web pages contain syntax errors. Rather than demand the whole world fix those errors, it's better to teach browsers to handle them.

This is the most extreme form of self-describing: not "the upstream writes a README so the downstream can understand," but "the upstream is allowed to be wrong, and the downstream repairs it itself." The entire compatibility cost is on the consumer (the browser).

The result? XHTML died. HTML5 won. The web became the largest content ecosystem in human history.

The interesting thing about this story is that HTML5's approach was looked down on by the software engineering world of the time. "Strict validation, reject non-compliant data" was the upstanding approach; "tolerate errors, guess intent" was the slapdash approach. But the upstanding approach didn't win the ecosystem. The slapdash approach won—because the ecosystem growth from lowering the barrier to content production, in sheer volume, crushed the quality assurance from strict validation.

Gaynor (2025) described this dynamic as a "one-way ratchet": once consumers start tolerating the upstream's deviations, the upstream is never incentivized to correct its behavior—because the downstream will backstop it. Every tolerated deviation becomes the new baseline, and then consumers tolerate the next one. The spec grows increasingly irrelevant, and actual behavior becomes the only standard. The result is that new implementers can't enter the market by reading the spec—they can only reverse-engineer "what actually happens" by collecting real-world data. That itself constitutes a massive barrier to entry.

Even more interesting is Gaynor's "three-ring circus": when the spec-violating producer is closed-source commercial software and the consumer is an open-source project, who do users file bug reports with? The open-source project. Because the open-source project's issue tracker is public and you can file an issue directly, whereas filing a bug with commercial software has to go through customer-support triage. The result is that the spec-abiding open-source maintainer bears the compatibility cost for the spec-violating commercial vendor. This is Postel's Law's asymmetric effect in a real organizational setting.

This forms an interesting contrast with the symmetry of agent systems discussed earlier. In a human organization, power decides who bears the compatibility cost—open-source maintainers are easier to complain to than commercial vendors, so the cost flows to them. In an agent system there's no such power gap—all nodes are homogeneous, so if the pattern is applied consistently, the cost is naturally symmetric. A human organization needs governance mechanisms to correct asymmetry; an agent system only needs consistency to guarantee symmetry.

## Which is better? I don't know

The benefit of self-describing is flexibility. The upstream doesn't need to foresee all of the downstream's needs; it only needs to do its own work well and document it clearly. The downstream has full autonomy—what to read, what not to read, how to interpret it. The artifact's internal structure can be adjusted at any time; as long as the README is updated, the downstream can adapt.

The cost is the downstream's burden. Every README read, every file opened, every piece of the upstream's domain jargon understood is a token and reasoning cost. And can the README even be written clearly—does the upstream agent have any incentive to write it well? Writing the README is itself a cost.

The benefit of requirement-driven is precision. The downstream doesn't need to explore—the files it wants are right there, the format is right, the fields are right. The gate check is machine-executed and won't miss. Token consumption is lower, because the downstream doesn't read a README and doesn't blind-search.

The cost is rigidity. The downstream has to declare all its needs upfront. If the downstream discovers mid-work that it needs a file it didn't anticipate—the requirement is already locked in, and you have to rerun the whole workflow to change it. And the upstream has to work in an environment where extra instructions are injected into its prompt—"you must produce A, B, and C"—and whether that affects the upstream's output quality, I don't know either.

There's a subtler point too. Under self-describing, the downstream sees the upstream's **complete output**—including things the upstream deemed important but the downstream didn't initially realize it needed. Sometimes that's a happy accident. Under requirement-driven, the downstream only gets what it asked for—even if the upstream notices "the downstream might also need this," it has no incentive to provide it.

But this cost-benefit analysis might be missing a larger dimension.

Think back to when ChatGPT opened up its plugin mechanism in 2023. At the time everyone assumed plugin development would be the traditional software engineering routine—read the API docs, implement a specific interface, pass contract verification, register, and ship. It turned out the rules were surprisingly simple: you just provide the tool's definition and a paragraph of natural-language description. That's it.

Traditional plugin systems use the requirement-driven pattern—the platform defines the interface, the developer implements it. High barrier, but quality is guaranteed. ChatGPT used the self-describing pattern—you tell the AI in natural language what the tool can do, and the AI figures out how to use it on its own. The burden of understanding shifted from the human developer to the AI platform. The gap in onboarding cost between "write a paragraph of description" and "implement a typed interface" is orders of magnitude.

The result? ChatGPT's plugin ecosystem exploded within a few months.

This isn't a coincidence. When the consumer is an AI that can understand natural language, self-description drops the barrier of "onboarding a new capability" from a software engineering cost to a documentation cost. For a system that needs an ecosystem—that needs third parties to contribute nodes, skills, tools—the low barrier of self-describing might matter more than the reliability of requirement-driven.

Of course, ChatGPT plugins also exposed the other side: an LLM's interpretation of a tool description isn't fully consistent. The same description can, across different invocations, produce different tool calls—sometimes hallucinated parameters, sometimes silent call errors. This is exactly the problem requirement-driven wants to solve—strict contract, gate check, reject what doesn't conform.

And this pattern didn't happen just once.

In November 2024, Anthropic open-sourced MCP (Model Context Protocol), defining a standard for "how an AI discovers and uses external tools." The core mechanism is almost identical to ChatGPT plugins: the tool provider describes its capabilities in natural language, and the AI understands the description at runtime and decides how to call it. The tool doesn't need to implement a strongly-typed interface or pass a contract test. It just needs a description.

By 2026, MCP's monthly downloads reached 97 million. OpenAI, Google, and Microsoft all joined in support. It's been likened to "USB-C for AI"—not because it defines strongly-typed contracts (USB-C's physical spec is precise to the millimeter), but because it lets any tool be connected to any AI, just as USB-C lets any peripheral plug into any port.

But MCP's critics said almost exactly what ChatGPT plugin critics said: a natural-language description is not a spec, the AI's reading of the description is unstable, and the same tool can behave differently across invocations. A 2025 security study found that MCP tool descriptions can be adversarially crafted to manipulate the AI's tool-call behavior—which is impossible under the requirement-driven pattern, because a strict schema has no room to be "persuaded."

So ChatGPT plugins weren't a one-off. They were just the first public demonstration of this pattern. MCP was the second, an order of magnitude larger in scale, proving the pattern's reusability—and proving that the same tradeoff recurs again and again.

So the choice in front of you is essentially a tradeoff of **ecosystem growth speed vs. behavioral reliability**. If you're building an agent platform that needs an ecosystem, the low barrier of self-describing might be the decisive advantage. If you're building a production pipeline that needs a zero-failure rate, the determinism of requirement-driven might be mandatory. Both are right. Which one fits the workflow you're building right now—you'll only know once you've run it.

Which is better?

All I can say is that in human collaboration, both patterns have successful practice. In an agent system, consistency matters more than the choice itself. As for the actual results—run it and see.

## Putting these layers together

A complete artifact communication flow looks roughly like this:

1. A finishes executing, writes its output to `artifacts/<workflow-id>/A/run-003/`, with the directory containing the actual output files and a README.md
2. A produces one push message: artifact path, content overview, usage hint. This message enters B's context
3. B starts up, with only the push message in its context (no A session, no A intermediate process)
4. B reads the push message and now knows where A's output is, what's inside, and how to use it
5. B opens A's artifact directory, reads the README first to get the full picture, then loads the files it needs on demand
6. B finishes its work, writes its own output to `artifacts/<workflow-id>/B/run-001/`, and produces a push message for C

Throughout, B's context stays clean—it only loaded the files it needed, and the irrelevant parts of A's artifact never entered its view.

This flow also lines up with another design choice for the workflow: nodes don't share sessions. The urge to share a session often comes from an inadequate artifact mechanism—you feel B needs to see A's chat log, probably because A's artifact didn't fully write out all the information B needs. Make the artifact mechanism solid, and the need to share sessions naturally fades—as discussed in the previous post.

## In one sentence

**What passes between workflow nodes isn't just data; it's also an agreement about "who bears the cost of understanding." Self-describing puts the burden on the receiver, requirement-driven puts it on the producer. In an agent system, because you can apply the same agreement consistently across all nodes, the total burden is naturally symmetric—what really matters is picking one and seeing it through.**

---

## A few things I still haven't figured out

How detailed should the push message actually be? Too terse—"the artifact is at `/path/`, look for yourself"—and B might overlook important information. Too detailed—approaching the scale of a full push—and you lose the point of the push/pull separation. There's a sweet spot of "just enough information for the downstream agent to form correct expectations," but how to find it, all I can say for now is "tune it in practice." Different nodes might need different degrees of push detail, but that introduces new design complexity—who defines the push message granularity between each pair of nodes?

Another question is the artifact's lifecycle. Once the workflow finishes executing, how long should the global artifact directory be kept? Keeping it forever is friendliest to auditing, but storage cost grows linearly. Purge by time—say keep 30 days—but some runs might need a longer traceability window (say a production incident requires tracing back to a deploy two months ago). Maybe it should be tiered by importance: critical nodes' artifacts kept permanently, non-critical nodes' cleaned up periodically. But what's the definition of "critical"? A deploy node might be more critical than a code-generation node? That depends on the type of workflow.

There's also a design space I haven't thought through carefully: artifact version references. If node B needs not only node A's artifact from this run but also A's artifact from the previous run for comparison—say "how does this proposal differ from the last one." How should B obtain A's historical artifact? Through the workflow's global directory ("go find A's historical runs in the workflow artifact") or passed explicitly via the push message ("A includes the historical artifact path in the message")? The former is more flexible but requires B to do more exploration; the latter is more deterministic but increases the push message's complexity.

The most central question is actually the simplest one: self-describing versus requirement-driven—which is better? Theoretical analysis can only go this far. The flexibility of the former and the precision of the latter are both real value. The downstream burden of the former and the rigidity risk of the latter are both real costs. The answer might depend on the type of workflow, the complexity of the nodes, the execution frequency, the reliability requirements—but how exactly it depends on these, you need to run it to know. That's also why I plan to try both.

---

## References

- Anthropic (2026). Claude Code Subagents. code.claude.com/docs/en/agent-sdk/subagents. The implementation of subagent context isolation: intermediate tool calls and results stay inside the subagent, and only the final message returns to the parent agent. This post's push message is a generalization of the "final message"—it contains not just the conclusion but also how to find the complete output.
- OpenAI (2026). Codex CLI Threads. developers.openai.com/codex. An independent thread plus filesystem coupling pattern. The previous thread writes results to a file, and the next thread reads it on startup. `thread_archive` releases context once execution finishes.
- Google ADK (2025). Handle Pattern. "Scope by default — every model call and sub-agent sees the minimum context required. Agents must reach for more information explicitly via tools." Isomorphic to the pull layer of this post's push/pull model.
- Factory AI (2025). Production multi-agent system. All state is externalized to artifacts; no agent holds the complete picture. Agents obtain upstream output by reading files, not through a shared session.
- Korzybski, A. (1933). _Science and Sanity_. "The map is not the territory" — an abstract representation is not the thing it represents. This post's title borrows that distinction: the push message is the map, the artifact is the territory.
- Postel, J. (1981). _Transmission Control Protocol_, RFC 793. "Be conservative in what you do, be liberal in what you accept." — the original formulation of the robustness principle, the theoretical source of the self-describing pattern.
- ACM (2018). _The Robustness Principle Reconsidered_. Communications of the ACM. A systematic critique of Postel's Law: tolerating malformed input causes the ecosystem to accumulate complexity debt, the theoretical support for the requirement-driven pattern.
- Pact Foundation. _Consumer-Driven Contracts_. docs.pact.io. A contract testing framework where consumers define expectations and providers must satisfy them. By 2026 a team (CallSphere) had applied it to schema validation for agent-to-agent communication.
- Supergood Solutions (2026). _Testing Your Agent Output Contracts Before Production_. supergood.solutions/blog. A practical guide to agent output contracts: "A schema in a README is a suggestion. A schema in code is a constraint."
- Microsoft (2026). _Agent Framework Workflows_. learn.microsoft.com/en-us/agent-framework/workflows. Type-safe message routing between executors, a systematic implementation of requirement-driven at the framework layer.
- Dagster (2025). _Software-Defined Assets_. dagster.io. Downstream assets explicitly declare typed dependencies on upstream assets: `AssetIn("raw_research_results")`, with a contract violation failing the pipeline.
- Gaynor, A. (2025). _Postel's Law and the Three Ring Circus_. alexgaynor.net. Proposes Postel's Law's "one-way ratchet" effect—tolerated deviations accumulate permanently and irreversibly—as well as the "three-ring circus" pattern: open-source consumers bear the compatibility cost for closed-source commercial producers.
- Hickson, I. (2008). _HTML5 Specification — Parsing HTML Documents_. WHATWG. The HTML5 spec explicitly writes out error recovery behavior: how a browser handles non-conformant HTML. This is the application of the self-describing pattern at the largest scale—better to have every browser implement complex error recovery than to require every content producer to write correct HTML.
- Model Context Protocol (MCP). modelcontextprotocol.io. Open-sourced by Anthropic in 2024, with 97 million monthly downloads in 2026. The self-describing tool protocol of the AI era: tools describe their capabilities in natural language, and the AI understands and adapts. Isomorphic to ChatGPT plugins but larger in scale.
- Pal, K. et al. (2025). _Model Context Protocol (MCP): Landscape, Security Threats, and Future Directions_. arxiv:2503.23278. A security analysis of MCP: natural-language descriptions can be adversarially crafted to manipulate AI tool-call behavior—an attack surface unique to the self-describing pattern, which doesn't exist for a strict schema.

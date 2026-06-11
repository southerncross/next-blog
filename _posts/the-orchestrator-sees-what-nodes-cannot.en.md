---
title: 'The Orchestrator Sees What Nodes Cannot'
date: '2026-06-12T00:06:05+08:00'
description: "The orchestrator's value is not doing the nodes' work for them, but seeing all nodes, edges, and artifacts—so it can find contract gaps, duplicated work, and cost anomalies, and decide which problems to handle statically and which need dynamic intervention. A healthy agent workflow is one where nodes own their own work and the orchestrator owns global optimization, making the system as a whole more efficient than nodes fighting on their own."
topics: ['agentic-workflow']
---

I talked before about a question: in an agent workflow, how should the artifacts between nodes be designed? Two paths. One is self-describing—the upstream writes its output clearly, and the downstream extracts on its own. The other is requirement-driven—the downstream declares its expectations, and the upstream produces to spec.

These two paths are not opposites. A good workflow should demand both: every node is responsible both for its own output and for the source of its own input. Think of a human team—you want each person to do their work clearly so whoever picks it up doesn't have to guess, and to proactively ask questions when handed a vague requirement rather than guessing blindly. With both directions in place, information transfer doesn't fall apart.

An agent system has one advantage over a human team: it can enforce symmetry. In a human organization, a senior engineer can demand precise input from subordinates while delivering vague output for them to figure out—the power structure permits this asymmetry. In an agent system there is no hierarchy, only nodes, and every node is both an upstream and a downstream. If you configure all nodes to be both self-describing and requirement-driven, that symmetry is machine-guaranteed—nobody gets to slack off.

But no matter how perfect the symmetry, there is one ceiling a node can never break through on its own: **every node can only see what's around itself.**

The upstream knows its own output format and the needs of its direct downstream, but it doesn't know what other edges exist in the whole workflow, which edges' contract conflicts are repeatedly burning tokens, or which work is actually being duplicated across two nodes. The downstream is the same—it can adapt to a less-than-ideal input, but it doesn't know whether the inference it made to adapt this time contradicts an inference made by another node in the workflow. Each node's local optimization is reasonable, conscientious, and not something to be blamed. Locally reasonable does not add up to globally harmonious. This isn't anyone's fault—it's the physical limit of vision.

Back to the human-team analogy: everyone on your team is reliable, proactive, self-driven. But if no one can see everyone's working state—where information transfer between two people has systematic friction, where work is being done twice by two people independently, which path's cost growth is spiraling out of control—the team won't go far. What you need isn't just everyone doing their own part well, but a layer of global vision on top of that.

The orchestrator is the carrier of that global vision.

## The orchestrator isn't about what it does, but what it can see

Let me clear up a common misconception first. The orchestrator's job isn't to "boss the nodes around"—it isn't doing the nodes' work for them, isn't supervising the quality of the nodes' work, isn't grading the nodes. If the upstream's output isn't self-describing enough, that's for the upstream to fix. If the downstream hasn't declared its input requirements, that's for the downstream to fix. The orchestrator isn't there to clean up after them.

What the orchestrator provides is something no node can obtain on its own, no matter how hard it tries: **a complete picture that sees all nodes, all edges, and all artifacts at once.**

With this vision, the orchestrator can do several things a node can't do by itself.

First, **find cross-node contract gaps.** Is there a gap between the upstream's declared output format and the downstream's declared input requirements? From a single node's vantage, this gap looks like "the upstream didn't do enough" or "the downstream asks for too much," but the orchestrator can see the full context on both sides—why the upstream didn't include this information (because it felt it didn't belong to this step), why the downstream needs this information (because a later node depends on it). The orchestrator's judgment isn't "who's right and who's wrong," but "how big is this gap's impact on the whole workflow, and is it worth filling now."

Second, **find cross-node duplicated work.** The frontend team's sub-workflow has a "code structure analysis" step, and the backend team's sub-workflow has one too. Both steps analyze the same repo and do the same thing. When authored independently, this is perfectly reasonable—the frontend doesn't know the contents of the backend's sub-workflow, and neither does the backend know the frontend's. But the orchestrator can see both, can identify the redundancy, and can merge the two steps into one, routing the output to each side's downstream nodes simultaneously.

This kind of deduplication can't be done by any single node. It requires global vision. It's like a compiler's link-time optimization—each `.o` file does only local optimization when compiled independently, and cross-module global optimization happens at link time. The orchestrator is LTO for workflows.

Third, **find systematic cost anomalies.** The orchestrator can see the token consumption of every edge in the workflow. GitHub's ET model prices output tokens at 4x input tokens—the bulk of waste caused by contract misalignment is on the output side. A downstream agent repeatedly reading the upstream's output, inferring missing fields on its own, self-correcting in the prompt, marking uncertain content after producing—every step burns output tokens. A single node doesn't know whether its token consumption is reasonable, because it has no frame of reference. The orchestrator can see all edges and can tell you: this edge's token consumption is 3x the workflow average, there may be a problem.

Fourth, **produce a system-level health report.** Once the orchestrator has finished contract comparison, deduplication checks, and cost analysis, that information itself constitutes a workflow health report. Which edges are flagged as high-risk and need dynamic intervention? Which edges have abnormal token consumption? Which duplicated work is spread across which sub-workflows? This isn't a code review, isn't a functional test—it's a health check of the contract structure, something a node would want to do but can't.

You'll notice these four things share a common trait: **they all require seeing the whole.** It's not about needing a stronger agent, a better prompt, more skills—those are all node-level matters. What's needed is a pair of eyes that can see all nodes, all edges, all artifacts.

## Contract coordination is a great example

Among the four things above, contract coordination—static coordination and dynamic coordination—is worth unpacking, because it illustrates well the difference between "decisions under global vision" and "decisions inside a node."

When the orchestrator finds a gap between upstream A's output format and downstream B's input requirements, the choice it faces isn't "make A write more or make B read more"—that's an inside-the-node choice. The orchestrator's choice is: **this gap, do I handle it once at compile time, or dynamically at runtime according to the actual situation?**

**Static coordination (orchestration time).** Before the workflow runs, the orchestrator finishes contract comparison and bakes the handling plan into the node prompt—"the upstream may not include X; if it's missing, infer it yourself and flag it"—and then runtime doesn't deal with it anymore. This coordination cost is paid once and reused by all subsequent runs. Low cost, high determinism. Suited to edges whose output format is relatively stable.

**Dynamic coordination (execution time).** After the workflow runs, the orchestrator monitors the actual execution of an edge. When it finds that a given output doesn't match the compile-time expectation, the orchestrator intervenes at runtime: pause the downstream, gather context, decide whether to trigger an upstream rerun, let the downstream adapt, or flag the anomaly for human intervention. Flexible, but each intervention consumes tokens. Suited to edges whose output format is itself unstable.

The key design decision is: **this choice is made per edge, not per workflow.** Stable edges use static, unstable edges use dynamic. The same workflow mixes both strategies. What the orchestrator does is assign each edge the most appropriate strategy—a decision a single node can't make, because the node doesn't know what the stability of other edges looks like.

This is about what a good tech lead does. They don't watch every single thing—some collaboration paths are already very stable and don't need attention. Some critical interfaces have friction every time, so they spend a bit more effort watching those. Global vision means you know where to put your attention.

## The orchestrator completes, it doesn't replace

Back to the theme. Self-describing and requirement-driven are basic competencies every node should have, just as everyone on a team should be reliable and proactive. The orchestrator doesn't replace these competencies; it adds a layer of system capability on top of them: seeing the whole, doing the optimizations nodes can't see, finding the most appropriate balance between effect and cost.

A healthy workflow is one where nodes work hard to do their own part well, and the orchestrator works hard to make them, together, better than fighting on their own.

---

## Some things I still haven't figured out

Static coordination needs to judge at compile time whether contracts match, but at compile time you can't get the actual output—the agent hasn't run yet. Having nodes declare their own output schema is one direction, but the very act of an agent accurately describing "what format I will produce" at design time is itself unreliable. Maybe precise matching isn't needed—it might be enough for the orchestrator to identify "this edge will probably need dynamic intervention." How do you set the threshold?

When the orchestrator makes global judgments, the context overhead concentrates on itself. If the workflow has many edges and a high proportion of dynamic edges, the orchestrator's own context may be larger than that of any single node. At that point, does the orchestrator itself also need to be orchestrated? What would a recursive orchestrator structure look like?

The orchestrator's global optimization decisions—assigning an edge to static or dynamic, judging whether duplicated work is worth merging, identifying whether an edge's token consumption is abnormal—are essentially making tradeoffs on behalf of humans. Should people review these decisions, or trust the orchestrator's judgment? How fine should the review granularity be?

---

## References

- The core argument of this piece comes from firsthand practice, from direct observation while designing and running an agent workflow orchestration system.
- Zylos Research (2025). _Production Agent Workflow Patterns_. arxiv:2603.22386. Production agent deployments adopt a hybrid model of DAG edge-typed contracts plus autonomous in-node reasoning.
- GitHub (2026). _ET Model Pricing_. GitHub Copilot's ET model prices output tokens at 4x input tokens.
- Pact Foundation. _Consumer-Driven Contracts_. docs.pact.io. The CDC pattern is one reference for the orchestrator's contract comparison; the difference is that the orchestrator makes soft judgments rather than hard schema validation.
- Anthropic (2026). _Claude Code Hooks Reference_. code.claude.com/docs/en/hooks.
- OpenAI (2026). _Codex CLI Configuration Reference_. developers.openai.com/codex.

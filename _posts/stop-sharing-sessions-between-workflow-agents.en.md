---
title: "Don't Draw Your Workflow's Edges in Vain"
date: '2026-06-08T17:44:22+08:00'
description: 'Sharing a session between workflow nodes is essentially substituting chat logs for an artifact specification. Only explicit output files can be verified and traced. If you feel the downstream agent needs to see the upstream session, your upstream artifact schema is incomplete.'
topics: ['agentic-workflow']
---

Recently, while editing an agentic workflow, I ran into an option.

One node finishes, then connects to the next. The configuration on the edge asks you: share the session, or not?

My first reaction was, is this even a choice—of course you share. B needs to know what A did, what A discovered, why A made a certain decision. Without that context, how is B supposed to do its job?

But the option made me uncomfortable. It looked like an option that is cheap by design, reasonable by intuition, but that would actually destroy the very reason the workflow exists.

Let me try to peel apart these two layers.

---

In a workflow, the directed edge between nodes represents two things happening at once: **A is done, now it's B's turn**, and **A's output becomes B's input**. The former is scheduling, the latter is information transfer. Scheduling only cares about order; information transfer cares about what B knows.

Sharing a session is one way to implement information transfer. A's chat log—which files it read, what it searched, how many rounds of reasoning it did, which question it hesitated on—is all packaged up and sent to B. B is like someone who sat next to A watching the whole thing, then picks up and keeps going.

Without session sharing, what B receives at startup is A's **artifact**. Whatever files A wrote, B reads. B knows nothing about A's intermediate process.

The difference between these two approaches, in the end, is the **difference between implicit and explicit transfer**.

---

The more I chewed on it, the more I felt this distinction matters—matters to the point where I think a workflow should not offer this option on the edge at all.

The defining trait of implicit transfer is this: the information being passed has not been curated. Whatever is in A's session, B sees it. A does not need to decide which information is useful to B and which is noise—that judgment is deferred to B. B faces a pile of unfiltered chat logs and has to sift through it on its own.

But this is precisely the reason the workflow exists. We break work into nodes and assign each node a clear task because we believe—or at least hope—that what each node produces is an **artifact that can be evaluated independently of the process that generated it**. The output of a requirements-analysis node is a requirements document, not "the chat log of me talking to the agent for 20 rounds."

This leads to a diagnostic question: **if you feel B needs to see A's session to do its job well, what is missing from A's output file?**

Whatever is missing, add it. This is not constraining the expressive power of the workflow; it is forcing you to turn implicit information transfer into an explicit artifact specification.

Looking at several systems already running in production, this is doable:

Claude Code's subagent mechanism: the subagent's intermediate process and tool calls are all locked inside the subagent, and only the final message is returned to the parent agent. You want the parent agent to know what the subagent found across dozens of files? Write it in the final message.

Codex CLI's thread model: independent threads are coupled through the file system. The previous thread writes its result to a file, and the next thread reads it at startup. `thread_archive` releases the context once it finishes—there is no such thing as "the previous thread's chat log."

Factory AI's approach is even more extreme: state is fully externalized to artifacts, and no agent holds the complete picture. It reads whatever file it needs, and those files are artifacts written by other agents, not the reasoning processes of other agents.

There's a line in Google ADK's design principles that I think you can use directly as a rule: _"Scope by default — every model call and sub-agent sees the minimum context required. Agents must reach for more information explicitly via tools, rather than being flooded by default."_

These systems differ from one another, but they are highly consistent on one choice: **the communication medium between agents is structured output files, not chat logs. The intermediate process is a black box. The downstream agent does not need to know how the upstream agent did its work.**

---

One counterargument: but if B really does need to know which options A ruled out and why, isn't that implicit context?

No. That is content that should have been written in A's artifact but wasn't.

If A explored three options in its session, ruled out two, and chose one, then A's artifact should contain an "Alternatives Considered" field. If A discovered a non-obvious technical constraint during its session, this should not be information B "happens to stumble upon" in the chat log—A should declare it explicitly in the artifact.

**The urge to share the session is, at its core, a diagnostic signal: your artifact schema is incomplete.**

Complete the schema, and the need to share the session disappears.

---

There's also a less obvious problem: sharing the session makes verification impossible.

Suppose a person—a team lead, a reviewer—wants to check whether the information transfer from A to B is correct. How do they check? If what's transferred is A's output file, they open the file and take a look. If what's transferred is A's session, they have to read through dozens of rounds of chat logs, figure out which pieces of information B should use, which B should not, and which is noise. This cost is so high that it effectively makes verification impossible.

Unverifiable information transfer, in a multi-agent system, leads to exploding debugging costs. When B produces a wrong result, how do you tell whether B's execution was faulty, or whether misleading information in A's session got accidentally absorbed by B? Output files can be diffed, traced, and blamed. Chat logs cannot.

This actually connects to a very old principle in software engineering: communication between components should be based on explicit interfaces, not on internal implementation details. Put in agent terms: communication between agents should be based on artifacts, not on sessions. The session is the agent's "internal implementation"; the artifact is its "interface."

---

So what if you really do need multiple rounds of dialogue?

Take a requirements-clarification node, where a human and an agent iterate back and forth several times before producing the final requirements document. This multi-round dialogue is needed, but it is a matter **inside the node**, not **between nodes**.

Make this distinction clear, and the design becomes simple:

- **Inside the node**: multi-round conversation is allowed. The human iterates with the agent, the agent can make mistakes, change direction, double back a few times. What's finally submitted is the output file.
- **Between nodes**: never share the session. What B receives at startup is A's output file, not A's chat log.

So that "share session" option in the workflow editor, if placed on the edge, conflates two different things: **intra-node multi-round interaction** (which should be preserved) and **inter-node context inheritance** (which should be forbidden). The former is node configuration, not edge configuration. Separate the two, and the option on the edge can be removed.

---

**In one sentence: information transfer between agents must be explicit, because only explicit things can be verified. Sharing a session substitutes chat logs for an artifact specification. If your workflow needs to share a session on the edge, what you're missing is not that option, but a more complete artifact schema.**

---

## A Few Things I Still Haven't Figured Out

Having written all this, there are a few places I'm not sure about myself.

How detailed should an artifact's schema be before it counts as "complete"? The schema for a "requirements document" can be refined infinitely—motivation, goals, user stories, non-functional requirements, boundary conditions, known risks, items to confirm... but every additional layer of fields increases A's cognitive load. If A spends 50% of its time filling out the schema and 50% on actual analysis, isn't that overdoing it? How to find that point where the schema is just enough for the downstream agent to understand, yet not enough to turn the upstream agent into a form-filling machine—I don't have a good way to judge this yet.

Another question: I used "unverifiable" to argue that sharing the session is problematic, but what exactly does "verifiable" mean to verify? If a reviewer opens A's output file, takes a look, and decides it's fine, is that verification? Or does verification require something more formal—schema validation, checklists, cross-file constraint checks? This question touches on the design of human-machine verification points in a workflow, and I haven't worked out which artifacts need human verification, which the agent can verify itself, and which need automated tooling.

And one more that's outside the scope of this article but that I keep thinking about: if A and B don't share a session, but B can read back A's session on demand, does that count as a compromise? B sees only the artifact by default, but if it feels the information is insufficient, it can go look up A's session itself—like Google ADK's handle pattern, where you give a lightweight reference by default and load it on demand. What this design preserves and what it sacrifices, I haven't thought through systematically yet.

---

## References

- Claude Code SDK Documentation (2026). _Subagents_. code.claude.com/docs/en/agent-sdk/subagents. The subagent's context-isolation design: intermediate tool calls and results stay inside the subagent, and only the final message is returned to the parent agent.
- Codex CLI Documentation (2026). _Custom instructions with AGENTS.md_. developers.openai.com/codex/guides/agents-md. Thread model: independent threads + file-system coupling, with `thread_archive` releasing context.
- Google Agent Development Kit (ADK) Documentation (2025). _Architecting efficient context-aware multi-agent framework for production_. developers.googleblog.com. Proposes the "scope by default" principle and the handle pattern: agents see lightweight references by default and load raw data on demand. The four-layer model of Working Context / Session / Memory / Artifacts.
- Zylos Research (2026). _AI Agent Memory Architectures for Multi-Agent Systems_. zylos.ai/research. A comparative analysis of three memory modes (shared / isolated / hierarchical), noting the industry's convergence toward hierarchical scoping.
- Atlan (2026). _Agent Memory Architectures: 5 Patterns and Trade-offs_. atlan.com/know/agent-memory-architectures. Five agent-memory architecture patterns, with hierarchical as the recommended default.
- Anthropic (2026). Multi-agent research system architecture. Subagents communicate through the artifact system: outputs are stored externally, and the coordinator receives lightweight references.
- Factory AI (2025). Production multi-agent system: 38.8k LOC, 16.5h runtime, 89.25% test coverage. State is fully externalized to artifacts, and no agent holds the complete picture.
- Strands Agents SDK Documentation (2026). _Multi-agent Patterns_. strandsagents.com/docs. The DAG design of the workflow pattern: tasks pass information through curated summaries, not full history.

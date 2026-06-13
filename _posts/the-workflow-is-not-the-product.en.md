---
title: 'The Workflow Is Not the Product, the Output Is'
date: '2026-06-13T18:21:02+08:00'
description: 'I spent two weeks tuning workflow architecture, and looking back I realized one thing: I was not optimizing a known bottleneck, I was optimizing an imagined problem. Later, arguing with a colleague over how dynamic workflow should work, I realized this was not a disagreement about technical preference—**agent-as-platform and platform-as-workflow represent two fundamentally different philosophies.** One lets you tune process structure until you get lost; the other does not even give you that thing to tune. Choosing an architecture that makes ineffective optimization impossible is far more reliable than choosing one that allows it and trusting discipline to avoid it.'
topics: ['agentic-workflow']
---

For the past two weeks I have barely generated any technical specs.

The node I own is a workflow that generates technical specs. At first I built a simple version, got it running, and produced a few specs. Then I started to feel something was off with the workflow.

The problem was not in the specs it produced. It came from my reasoning about the workflow itself—the artifact design was not elegant enough, the way sessions were managed might need refactoring, context passing between nodes should be more standardized, and maybe, just maybe, I should first build a workflow for creating workflows. For two straight weeks, I was basically tuning these things. By the time I sat down on Friday afternoon to take stock, I realized one thing: in those two weeks I had barely looked at the output quality of a single spec.

It reminded me of Knuth's endlessly quoted line—"premature optimization is the root of all evil." But in the agentic workflow setting, the problem is more insidious than classic premature optimization. In the classic case you at least know what you are optimizing—you know which code is slow, which query runs too often, you are optimizing a known bottleneck. In my case, I did not even know where the bottleneck was. I was optimizing an **imagined problem.**

This is not just my own affliction. In its Codex best-practices guide, OpenAI lists "automating before manual reliability" as a formal anti-pattern—if you automate a process before you have worked out, through manual interaction, what the agent is good at and what it is not, the result is not scaled success but scaled error. Hamel Husain, in his well-known piece on evaluating AI products, puts it even more bluntly: "Most people just focus on changing the system, which prevents them from improving their LLM products beyond a demo."

But knowing "you should not optimize prematurely" is one thing. Truly understanding **why I did it** is another.

## Two Architectures, Two Philosophies

As it happened, in the same week I was reflecting, I discovered a fundamental disagreement with another team member while discussing dynamic workflow.

His idea was this: do not define the workflow in advance. You define a few rough phases—plan, design, develop, review—with explicit artifact gates between them. For example, before entering the design phase, the output of the plan phase must contain certain fields and pass certain checks. But how things get done inside a phase is left alone; the agent decides for itself. The user interacts by talking to an agent—you tell it "I want a technical spec for a requirement," the agent understands and says "okay, now entering the plan phase, please provide the following," and you go back and forth, clarifying. When it is ready enough, the agent suggests moving to the design phase. If the gate does not pass, it rolls back and keeps communicating. Throughout, the human deals with only this one interaction surface: the agent.

My idea was the other kind: externalize the workflow into a standalone platform. The platform is responsible only for defining the workflow—which phases exist, what each phase does, how phases transition. Each node is still executed by an agent, but the process structure is defined in advance, static, and visualizable as a DAG. To use it, the user opens the platform, picks the corresponding workflow, clicks start, supplies materials, and proceeds through the preset steps.

These two ideas represent two fundamentally different architectural philosophies. In Building Effective Agents, Anthropic divides agentic systems into two categories: a **workflow** is where "LLMs and tools are orchestrated through predefined code paths," and an **agent** is where "LLMs dynamically direct their own processes and tool usage." I was arguing for the former, my colleague for the latter.

Let us call them **Platform-as-Workflow** and **Agent-as-Platform.** The first externalizes the workflow into a standalone system; the second makes the agent the sole interaction platform.

Later I looked into how the industry handles this and found it was not just a local argument between the two of us. Bloomreach's CTO wrote an entire article on the topic, titled The Great Debate: Static Workflows vs. Dynamic Agents. OpenAI stands on the agent side—Codex's design philosophy is that the user talks to an agent, and the agent autonomously decides the plan → build → verify progression. Anthropic and LangChain advocate a hybrid path—workflows for predictable tasks, agents where flexibility is needed. In April 2026, zylos.ai published a survey on agent orchestration patterns, concluding that "fully dynamic approaches consistently outperform static templates on open-ended tasks but are more expensive and harder to debug. Hybrid approaches—a deterministic exoskeleton with a dynamic inner loop—dominate production deployments."

Gartner's data is even more telling: by the end of 2025, fewer than 5% of enterprise applications with real agent deployments were in production. Most so-called "AI agents" are really simpler assistant-type features. By the end of 2026, that number is projected to jump to 40%, but even then most will still be task-specific agents, not fully autonomous systems.

The production hardening of the platform model is far ahead of the agent model. Airflow gets thirty million downloads a month; Temporal offers a 99.99% SLA. The reliability of agents doing orchestration in mission-critical settings has not been validated at scale.

## What Each Is Good At

If you put the strengths and weaknesses of the two side by side, the Platform's advantage concentrates on **determinism:** the nodes and edges on a DAG show you the current progress at a glance, and any deviation is caught immediately. The edges of a DAG are hard constraints—the platform guarantees the gate always runs, whereas an agent might skip it. The execution engines have a decade of accumulated maturity—Airflow at thirty million monthly downloads, Temporal with its 99.99% SLA—and retries, timeouts, and Saga compensating transactions are all mature solutions. Cost is predictable too—you know how many LLM calls this pipeline will make.

The Agent's advantage concentrates on **adaptability:** when every task is different, a predefined DAG either over-generalizes or bloats into something unmaintainable. Changing a prompt is far faster than changing a DAG, and the cost of trial and error is low. There is also an underrated dividend—when the underlying model gets smarter, in the Platform it is merely smarter inside each node, but in the Agent its orchestration ability gets smarter too. Onboarding is simpler as well—a newcomer only needs to know how to talk to the agent, not understand the entire DAG.

These two sets of strengths look symmetric—you win on this dimension, I win on that one. But this comparison misses something more important. There is a difference that does not live on the same plane.

## The Architecture Choice Is Itself a Methodological Constraint

I spent two weeks tuning workflow architecture. Why?

Not because I wanted to slack off and avoid looking at the output. I genuinely did not realize what I was doing. A DAG editor is just there by nature—the nodes and edges are right in front of you, and the moment you open a parameter panel there are countless things to tune. They invite you to do forward design—draw diagrams, connect lines, optimize structure, make the process more "elegant." None of these operations have any direct bearing on output quality, but they are right in front of you, so you want to tune them.

Agent-as-Platform has none of this. All you face is a conversation window. What can you change? The prompt. The skill. That is it. You are forced to stay on what actually matters: tuning prompts, looking at output, fixing bad cases.

OpenAI's Codex best-practices guide defines a six-stage maturity model: Task Context → AGENTS.md → Configuration → MCP → Skills → Automation. Note the order of these six stages—Skills comes before Automation, and Skills themselves are distilled from repeated use, not designed up front. The guide explicitly says: "convert a prompt to a skill when you keep reusing it or correcting the same workflow." A skill is pulled out by output quality, not pushed out by architecture design.

Under this model, if you split the work across a team, different people maintain different skills. The security expert maintains the security-review skill, the architect maintains the architectural-patterns skill, the quality team maintains the artifact schema and gate rules. The agent is responsible for composing them at the right moment. Each person only needs to understand their own domain, not the entire process. The unit of division shifts from "phase" to "capability," from a horizontal split to a vertical one.

If different phases need different agents or models, the orchestrator spawns different sub-agents—the planner uses a strong model for high-level reasoning, the implementer uses a cheap model for execution, the reviewer uses a strong model for adversarial review. The sub-agents do not communicate directly; they hand off through file artifacts—the planner writes plan.md and exits, and only after the orchestrator checks that the artifact exists and conforms to schema does it spawn the implementer to read it and get to work. This is exactly the "artifact gates between phases" your colleague described.

If you cannot even do a thing, you cannot possibly waste time on it. A constraint you cannot override is more reliable than a guideline you can ignore. Choosing an architecture that makes ineffective optimization impossible is far more effective than choosing one that allows it and then relying on discipline to avoid it.

This is not just about the choice of workflow. The logic extends further.

## The Tool Teaches You How to Use It

The whisper the DAG editor gives you is: "Make me a little prettier."

The whisper the agent conversation window gives you is: "Take a look—isn't something a bit off with this output?"

Both tools are teaching you how to use them. It is just that the former teaches you to tune process structure, and the latter teaches you to tune output quality.

The mistake I made earlier was not a wrong technical choice; it was failing to realize that the tool itself was shaping my behavior. I thought I was actively choosing a more "powerful" architecture, when in fact I was choosing an environment that steered me in the wrong direction.

That line from Anthropic's Building Effective Agents is worth rereading: "you should consider adding complexity only when it demonstrably improves outcomes." But that line only tells you what to do; it does not tell you **how to get yourself to do it.** My experience is that discipline is not enough. You need an architecture that gives you no opportunity to do those things in the first place.

## Some Things I Still Have Not Figured Out

Does Platform-as-Workflow really have no use case left? Surely it does. If your process is highly standardized—say compliance review, financial risk control, legal-document generation—where every step must run and none can be skipped, the hard edges of a DAG are irreplaceable. But I suspect that even in these settings, once agent capability is strong enough in the future, most DAG nodes will be absorbed inside the agent, leaving only a minimized deterministic exoskeleton.

There is another corollary that makes me uneasy: if the architecture choice itself encodes a methodological constraint, are we outsourcing the judgment of "how a person should work to do it right" to the tool's designers? OpenAI chose not to build a DAG editor, so they made that decision on behalf of every Codex user. What if their judgment is wrong? Conversely, Dify and Coze built a DAG-first design, making a decision in the other direction on behalf of every user. When should you trust a tool's design philosophy, and when should you resist it?

I also noticed a thread in this discussion that went unexplored: Agent-as-Platform may be less efficient than Platform-as-Workflow—the agent burns extra tokens thinking and deciding during orchestration, tokens a DAG does not need. For high-frequency, low-value tasks, this could be a decisive disadvantage. But how big the gap actually is, I have no data on.

The last thing on my mind is that the Platform-as-Workflow vs. Agent-as-Platform we are discussing may just be a classification for a transitional period. When agents become strong, reliable, and cheap enough, the DAG shell will thin out, thinner and thinner, until all that remains is the gate rules themselves—the artifact schema, the gate conditions, the compliance checks. At that point the boundary between workflow and agent disappears. But how long this transition lasts, I do not know.

## References

- Anthropic (2024). _Building Effective Agents_. https://www.anthropic.com/research/building-effective-agents — Distinguishes the two agentic-system categories of workflow and agent, and proposes adding complexity only when it demonstrably improves outcomes.
- Anthropic Engineering (2026). _How We Built Our Multi-Agent Research System_. https://www.anthropic.com/engineering/multi-agent-research-system — Orchestration lessons from a multi-agent system, emphasizing starting from small-scale evals and prompt engineering as the primary improvement lever.
- OpenAI Developers (2026). _Codex CLI Best Practices: Six-Stage Maturity Model_. https://developers.openai.com/codex/learn/best-practices — A six-stage maturity model from prompt to automation, listing premature automation as a formal anti-pattern.
- Husain, H. (2024). _Your AI Product Needs Evals_. https://hamel.dev/blog/posts/evals/ — Proposes the observation that "most people just focus on changing the system," establishing an eval-driven iteration flywheel.
- Yan, E. (2025). _Product Evals in Three Simple Steps_. https://eugeneyan.com/writing/product-evals/ — Distinguishes eval infrastructure (worth early investment) from workflow orchestration infrastructure (which should be output-driven).
- Yan, E. et al. (2024). _What We've Learned From A Year of Building with LLMs_. https://applied-llms.org/ — Proposes "prefer deterministic workflows," using the intern test to gauge task complexity.
- Vaughan, D. (2026). _The Agentic Pod in Practice: Running Multiple Agent Roles in Your Team_. https://codex.danielvaughan.com/2026/03/28/agentic-pod-in-practice-multi-agent-roles/ — A five-role sub-agent orchestration pattern and a concrete implementation of artifact-based handoff.
- zylos.ai (2026). _Agent Workflow Orchestration Patterns: DAG, Event-Driven, and Actor Model_. https://zylos.ai/research/2026-04-14-agent-workflow-orchestration-patterns/ — A systematic comparison of three orchestration patterns and the conclusion that hybrid approaches dominate production deployments.
- Bloomreach (2025). _The Great Debate: Static Workflows vs. Dynamic Agents_. https://www.bloomreach.com/en/blog/the-great-debate-static-workflows-vs-dynamic-agents — Discusses the philosophical divide between OpenAI and Anthropic on agent architecture.
- Gartner (2025). _Predicts 40% of Enterprise Apps Will Feature Task-Specific AI Agents by 2026_. Press Release. — The data point that enterprise agent deployment was under 5% in 2025.
- Agentic Developer's Playbook. _Anti-Pattern: Premature Automation_. https://sahaavi.github.io/agentic-playbook/reference/anti-patterns/premature-automation.html — Lists building CI/orchestration up front as a validated anti-pattern, proposing the interactive → scripted → automated maturity progression.
  </content>
  </invoke>

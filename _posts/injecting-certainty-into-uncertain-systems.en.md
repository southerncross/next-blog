---
title: 'Injecting Certainty into Uncertain Systems'
date: '2026-06-03T20:28:55+08:00'
description: 'There are only two reasons an agent underperforms: too little context or too much. Add a skill to do addition, split a workflow to do subtraction. The core value of a workflow is not a pretty process—it is anchoring certainty onto uncertain agent behavior, which is the key to taking AI-native applications from demo to product.'
topics: ['agentic-workflow']
---

While our team was wiring up the full agentic workflow pipeline, we had an argument.

I wanted everyone to record the sub-workflow for their own node into the orchestration platform, forming a complete process chain. But some thought it was unnecessary—just build the corresponding agent plugin, supply good skills and MCP tools, and let the agent run on its own. Why bother orchestrating a workflow?

It is a good question. Harness techniques like skills, MCP, and memory are already familiar to everyone, taken for granted. But the value of workflows is something many people may have overlooked. This piece wants to set the record straight on workflows.

## There Are Only Two Reasons an Agent Underperforms

Let's go back to that argument. The two positions—optimize the plugin or orchestrate a workflow—actually correspond to two different diagnoses.

When an agent underperforms, there are only two reasons: **too little context**, or **too much context**.

Too little context, and the agent doesn't know what to do. For example, it doesn't know the project already has a caching module, so it rewrites one. The fix: add skills, add tools, add knowledge—do addition. This is the direction of plugin optimization, which everyone is already familiar with.

Too much context, and the agent's attention scatters. It skips steps it should take, or several concerns get tangled together and none of them gets done thoroughly. A 10-step task driven purely by prompting—the agent might do only 2 of the steps. It's not that it can't; it "thinks" it's done. The fix: shrink the scope, split out sub-workflows—do subtraction.

Too much flour, add water; too much water, add flour—it sounds like muddling through a patch-up, getting messier the more you patch. But the two directions solve different problems, and they affect each other: adding a new skill might let a task that previously needed splitting be completed in a single node. Splitting out a sub-workflow might expose that some sub-step needs specific knowledge, so you have to write a dedicated skill. The two are adjusted in tandem until they balance.

But everyone understands plugin optimization. The value of workflows needs a few more words.

## The Core Value of a Workflow: Certainty

Splitting out sub-workflows has two benefits, but the second one matters more.

The first is better results—smaller tasks, a more focused agent, higher output quality for each sub-step. This is the direct payoff of doing subtraction.

The second is **reliability**—the process is solidified, 100% step coverage. This is the bigger value.

A 10-step workflow, if you just let the agent improvise via prompting, might skip step 5, merge steps 7 and 8, or "feel like it's close enough" at step 3 and stop right there. The AMBIG-SWE study reported a data point at ICLR 2026: when the agent isn't nudged to ask questions, it defaults to executing rather than confirming, and the resolve rate plunges from 48.8% to 28%. An agent doesn't proactively make up for uncertainty—it walks forward according to its own understanding, and it treats your ambiguity as latitude.

A workflow uses programmatic execution to take "which steps must be done" out of the agent's judgment. It becomes a certainty guarantee: step 5 will definitely run, steps 7 and 8 won't be merged, and all 10 steps will definitely be walked through. Even if the agent's performance on each step is merely passing, at least all the steps get executed. **Passing × 10 steps beats excellent × 2 steps.**

Hooks work on the same principle. Hooks trigger deterministic actions on specific events—pre-commit automatically runs the formatter, post-merge automatically runs the tests. If you write these things into AGENTS.md as instructions, the agent might execute them or might not. Hand them to a hook, and they execute 100% of the time. A hook is essentially the same as a workflow: **overlaying a layer of deterministic mechanism on top of the agent's uncertain behavior.**

## What's Scarce Has Changed

This reveals an interesting inversion.

In traditional software engineering, the system is deterministic—once the code is written, every execution produces the same result. Our job is to **inject flexibility** into a deterministic system: config files make behavior tunable, plugin systems make functionality extensible, feature flags make releases rollback-able. Determinism is the default; flexibility is scarce.

AI-native applications are exactly the reverse. An agent's behavior is non-deterministic—the same input may produce different results; the same prompt may execute a different number of steps. Here, **determinism becomes the scarce good**. Workflows, hooks, assertions, CI gates—these mechanisms are all doing the same thing: anchoring deterministic behavior onto a non-deterministic system.

This is probably a new kind of scarcity inversion: when generation becomes cheap, selection becomes scarce; when execution becomes cheap, planning becomes scarce; when behavior becomes non-deterministic, determinism becomes scarce. Every inversion of a base assumption makes what used to be taken for granted precious, and what used to be precious cheap.

## How to Do It: Coarse First, Fine Later, Split Only at the Bottleneck

Since the value of a workflow is injecting certainty, how should you introduce a workflow? Split every node into a sub-workflow right out of the gate?

You shouldn't. **Don't split at the start.**

Start with a single node and optimize the results through plugins and skills. The reason is simple: splitting itself has a cost—each sub-step needs its own input/output definitions, independent context management, and data passing between steps. If you pre-split before you've figured out where the bottleneck is, you'll likely split in the wrong place and pay complexity with no return.

When you find that plugin optimization has hit a bottleneck—no matter how you add skills or context, the agent's performance is stuck at some level and won't go higher—that's when you go analyze the execution log to see where the problem is.

The log will tell you one of three things:

1. The agent lacks some knowledge, and the skill you added earlier wasn't the right one → keep doing addition
2. The agent always does a certain step poorly because that step is itself too complex → split it out, do subtraction
3. The agent keeps skipping steps because there's too much information and its attention is scattered → split it out, do subtraction

The log is the only basis for distinguishing "should I add or subtract." Without a log, you're that cook adding water to flour and flour to water—going purely on feel, mixing it thinner and thinner. With a log, you know which knob to turn.

This is also the "coarse first, fine later" strategy: give the agent a coarse-grained single node first and observe its performance. Good enough, don't split; not good enough, use the log to locate the bottleneck and split precisely. You only pay complexity for the places that truly need splitting.

## Log Analysis Is the Sensor of Self-Evolution

Let's lift log analysis one level higher. An agent's optimization loop is: **execute → log → diagnose → modify**. The log is the sensor of this loop. Remove it, and the loop breaks—you've executed but don't know how it went, and modification is out of the question.

The AHE (Agentic Harness Engineering) paper proved this loop works through experiments. It distills the millions of tokens in each agent execution trace into a structured evidence base, letting an evolutionary agent decide what to change based on evidence. Each change is bound to a falsifiable prediction—"this change should fix tasks A and B"—and the next round verifies it; if it doesn't hold, roll back. Ten rounds of iteration, pass@1 from 69.7% to 77.0%, transferable across models and across benchmarks.

But AHE has a blind spot: it's good at predicting "what changes will make things better" and bad at predicting "what changes will make things worse." Regression prediction is nearly random. This means subtraction is riskier than addition—a newly added skill that turns out useless merely wastes effort, but a wrongly split workflow may break something that used to work. So "add first, subtract later" isn't just a lazy strategy; it's also the lower-risk path.

Finally, this adjustment process doesn't get messier and messier like adding water to flour and flour to water, because model capability keeps growing. The sub-workflow you need to split today, a single node may handle tomorrow. The balance point is drifting toward "coarser"—the deterministic constraints you need will keep shrinking. In the end you keep only the most core constraints—semantic invariants—and leave all the form to be derived by the agent. Until that day comes, mechanisms that inject certainty—workflows, hooks, assertions—are the bridge that takes AI-native applications from demo to product.

## References

- Lin et al. (2026). "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses." arXiv 2604.25850. The AHE framework: trace distillation + falsifiable-prediction-driven automatic harness evolution, ten rounds of iteration pass@1 69.7% → 77.0%.
- AMBIG-SWE (ICLR 2026). When the agent isn't nudged to ask questions, the resolve rate drops from 48.8% to 28%—it defaults to executing rather than confirming, and uncertainty is treated by the agent as latitude.
- OpenAI (2026). "Harness Engineering." The primary responsibility of engineering teams shifts from writing code to building the deterministic constraint layer—the harness is the reliability guarantee.
- Zylos Research (2026). "AI Agent Goal Decomposition and Hierarchical Planning." Premature decomposition can produce granularity errors; progressive decomposition is more robust.
- Gamma et al. (1994). _Design Patterns_. Template Method (deterministic skeleton) vs Interface (flexible contract)—corresponding to workflow solidification vs plugin extension.
- Polanyi, M. (1966). _The Tacit Dimension_. Tacit knowledge cannot be fully externalized—skill optimization always has a limit, and some judgments can only come from people.

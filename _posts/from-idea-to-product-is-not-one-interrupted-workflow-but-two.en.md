---
title: 'From Idea to Product Is Not One Interrupted Pipeline, but Two Different Rivers'
date: '2026-06-05T15:34:16+08:00'
description: 'Getting from idea to product is really two completely different rivers: in the exploration phase, human real-time judgment steers what the agent produces; in the execution phase, deterministic constraints unlock what the agent can do. Blend them into one pipeline and both halves break.'
topics: ['agentic-workflow']
---

Have you ever been through this?

A requirement comes in. You pull in the product manager and a few senior engineers and sit down to talk it through. The first round gives you a direction, but something still feels off. A couple of days later someone says "let me think about it some more," comes back, and overturns half of what you'd concluded. Another meeting. This time you align, but then you notice a competitor has changed its approach, so you have to rethink it. Back and forth like this, two or three weeks go by, and you have nothing shippable in hand—but you finally have a solid feeling about "what we're actually building."

Then you hand the finalized plan to the engineering team. The rhythm changes completely from here: breaking down the requirements, scheduling, development, integration, testing, release. Every day has a concrete output; every step has a clear acceptance criterion. Two weeks later, the thing ships.

Both halves are "doing a requirement," yet the work rhythm of the first half and the second half are not even the same species. The first is water—flowing, uncertain, ready to change course at any moment. The second is ice—fixed, definite, moving by structure.

When most people watch an agent demo, what they see is the stunning output the agent produces: a complete prototype in minutes, fast and good. This creates the feeling that "with an agent, one person can ship a product." But this reasoning hides a misalignment: the scenario where the agent shows its astonishing ability sits in the first phase—rapidly producing things for humans to choose from or throw away. The part that actually gets stuck is not the producing; it's the road that turns output into a reliable product.

## The Watershed Between the Two Rivers

Let's pull these two stretches of work apart.

**Stretch one: from idea to finalized plan (Idea → Demo).** The core question is "what to build." Nobody knows the answer, so it takes research, discussion, rework, and starting over. The essence of this work is exploration—each new piece of information may overturn a prior decision. The rhythm is highly non-linear: you might make no progress for three days, or figure it all out over a single meal. The agent splits in two here: extremely strong on **output**—you give it a direction and the demo appears instantly; useless on **judgment**—it can't decide for you whether the direction is right. The human leads on judgment; the agent handles rapid production for the human to choose from.

**Stretch two: from finalized plan to release (Demo → Product).** The core question is "how to build it." The goal is already fixed, and the remaining work is turning it into a shippable product. The essence of this work is execution—steps can be planned in advance, quality can be standardized, progress can be measured. But oddly, the agent gets stuck here instead.

|               | Idea → Plan                        | Plan → Release                       |
| ------------- | ---------------------------------- | ------------------------------------ |
| Core question | What to build                      | How to build it                      |
| Certainty     | Low, can be overturned anytime     | High, direction is set               |
| Work mode     | Exploration, trial and error       | Execution, convergence               |
| Agent showing | Strong output, no help on judgment | Can do each step, unreliable overall |
| Human's role  | Judge (decides direction)          | Reviewer (confirms results)          |

What's the essential difference between these two stretches? Intuitively, the second should be easier—the goal is set, the steps are clear, and the agent can do every step. So why does the first phase go more smoothly?

## Why the First Phase Won't Distill into a Standard Process

A lot of people think: "Since the first phase is this chaotic, can't we standardize it too?"

No. It's not a lack of capability; it's that **standardization here is a cost, not a benefit.**

Suppose you try to define a standard workflow for the "requirement exploration" phase: step one, research the industry; step two, competitive analysis; step three, technical feasibility assessment; step four, produce a plan. Sounds reasonable, right?

Then reality hits: halfway through the research you find the direction is wrong and have to start over. After starting over, the competitive analysis is moot because it's a completely different market. The feasibility assessment is done, but the plan gets killed in review—because you'd misunderstood the user scenario all along. The workflow you carefully designed falls apart at the first change.

The problem isn't that your workflow was poorly designed. The problem is that **the defining trait of the exploration phase is uncertainty, while the premise of a standard process is certainty.** You can't define "what to do next" for a process that doesn't know what to do next.

This doesn't mean the first phase is completely lawless. It has its own **meta-workflow**—how to research, how to discuss, how to decide, how to review—and those are relatively stable. But the business workflow of "what product to build" simply can't be pinned down until exploration is complete.

So maybe the first phase isn't suited to a fixed process; it's better handled in a dynamic, iterative way—human-led, agent-assisted. The "dynamic" here doesn't mean there's no process; it means the process itself can iterate quickly. The dynamic workflow Claude Code launched in May 2026 is an interesting practice: Claude writes a JavaScript orchestration script for the task you describe, the runtime executes it, and the script contains steps, loops, branches, and intermediate results. You run it once, see what's wrong, change the script, run again. The process evolves rapidly through trial and error—not "no process," but "a process still growing its bones."

## Why the Stronger Phase Is Actually Harder

A counterintuitive observation: in the first phase, where things are uncertain, the agent runs well; in the second phase, where the goal is clear, the agent runs poorly.

Let me try to derive the reason from the differences between the two phases.

**Difference one: when humans step in differs.** In the first phase, the human is alongside the whole way—every output needs human judgment on "is this direction right," so the human is **immediately responsive** to the agent's output. The agent writes a plan, and the human instantly says "no, redo it" or "okay, keep going." And the second phase? The human no longer guides step by step. The goal is set, and the human's role shifts from "accompanying each step" to "looking at the result at the end." The agent walks the middle alone.

This means the agent's good showing in the first phase may not be entirely because it's strong—it's because someone is correcting course at every step. Human real-time judgment compensates for the agent's unreliability. In the second phase, that correction mechanism is removed, and the agent's true face is exposed.

**Difference two: the reliability requirement differs.** The output of the first phase is a half-finished product—the plan can be overturned, the demo can be redone. If one output is wrong, just generate another; the cost is low. The output of the second phase is a deliverable—the code has to run in production, the tests have to cover edge cases, the docs have to pass review. "Roughly right" doesn't cut it; every step has to be done properly.

Stack these two differences together and you may explain why the agent fails in the second phase: **the first phase can tolerate unreliability because a human corrects course in real time and the cost of trial and error is low; the second phase has neither real-time correction nor any tolerance for unreliability, so the agent's inherent uncertainty becomes a fatal problem.**

If this derivation is right, then the challenge of the second phase is not "the agent isn't capable enough"—it really can do every step—but rather: **there's no mechanism guaranteeing it completes all the steps in order, with each step up to standard.**

## A Stable Workflow May Be the Missing Mechanism

This speculation leads me to a question: if the agent's core difficulty is "not following the steps," then what mechanism makes it follow the steps?

A natural answer is a workflow—define "what comes first and what comes next" in advance, so the agent doesn't need to judge the execution order itself. But the first phase taught us that workflows aren't always effective: in the exploration phase, forcing step definitions is itself a cost. So why is the second phase different?

Because the second phase's goal is stable. Once defined, the steps don't need to be overturned, because "what to build" is already settled. At this point the workflow turns from a cost into an investment—every step definition gets reused repeatedly, and no execution requires re-judging the order.

A 10-step development task: without a workflow, the agent might finish just 2 steps and "decide" it's done. It's not that it can't do them—in the demo it can do every single step. But without constraints, it will skip steps, blur boundaries, and forget earlier agreements. This isn't a bug; it's more like an inherent property of agency: an executor with autonomous judgment will make autonomous judgments, including "I don't think this step is necessary."

If you orchestrate it with a deterministic workflow—steps preset, order fixed, skipping disallowed—then the agent doesn't need to judge "should I do this step"; it just executes. The option to skip is systematically removed, and reliability may rise accordingly.

This is only speculation, not a conclusion. The hypothesis "a stable workflow is the second phase's key missing piece" needs real validation: on the same second-phase task, how big is the reliability gap between an agent constrained by a workflow and one without? I haven't seen rigorous controlled data so far. But empirically, the teams that "write the process first, then let the agent execute" do get far more controllable results than those that "give the agent a goal and let it improvise."

## The Signal Between the Two Phases

So how do you know when to switch from the first phase to the second?

The signal is: **the change frequency of the requirements doc drops from "edited every meeting" to "occasional detail tweaks."**

This signal means exploration has converged—"what to build" has a stable answer, and what remains is "how to build it." If the speculation above holds, this is when freezing a workflow may turn from a cost into a benefit: every process definition will be reused repeatedly, because the goal won't be casually overturned again.

Conversely, if the requirements are still changing frequently and you force a stable process onto them, you have to rewrite the process definition with every change, and the maintenance cost of the process may exceed the reliability it provides.

This switch point isn't a single cut on the timeline—not "switch in week three"—but an observable phase-transition signal. Watch requirement stability, not the calendar.

## From Exploration to Execution: One Possible Path

If you accept the speculation above—that the second phase needs a stable, deterministic workflow—then the next question is: where does the workflow come from?

One possibility is that it's **derived** from the exploration of the first phase. Not designed in advance, but distilled from validated practice. Roughly the process:

1. **Let the agent write an orchestration script and run it.** Claude Code's dynamic workflow is exactly this pattern: for your task, Claude writes a JavaScript orchestration script, the runtime executes it, orchestrating dozens of subagents to work together. You run it once, see the result, and find what's wrong.
2. **Iterate the script.** Change the steps, the branching logic, the way intermediate results are passed, then run again. Each run saves the script to a file, so you can diff two runs to see the changes.
3. **Freeze the validated script into a reusable command.** When the script stabilizes and the results repeatedly match expectations, select that run under `/workflows` and press `S` to save. The script becomes a project-level (`.claude/workflows/`) or user-level slash command. Next time you just run `/<workflow-name>`, with no need for Claude to redesign the orchestration logic.

Claude Code's path looks like "derive first, then solidify": the script is iteratively validated during dynamic runs (derivation), and the validated script is saved as a deterministic command (solidification). Note this is not going from "suggestion" to "enforcement"—the script is programmatically executed from the start, not advisory. What changes is the **maturity of the script**: from "a draft amid trial and error" to "a validated final version."

Is this path really more effective than "write the workflow first, then let the agent execute"? Intuitively, yes—because you can't design in advance a pattern you haven't yet seen. The chaos of the first phase isn't noise to be eliminated; it may contain all the signal you need to design the second phase's workflow. But this hasn't been fully validated.

## The Biggest Illusion: One Pipeline All the Way Through

Back to the opening question. "One person plus an agent can ship a product"—this judgment may be right, but only if you realize that "shipping a product" passes through two structurally different phases.

In the first phase, the agent's production speed masks the absence of judgment—a human makes the calls alongside it, so the output always looks right. This easily creates a feeling: the agent is this strong, so the next part should be just as smooth, right? But in the second phase, the human no longer guides step by step. The agent's capability hasn't weakened, but without real-time correction, its uncertainty is exposed.

My speculation is that these two phases need different mechanisms for "making the agent reliable." The first phase relies on human real-time judgment; the second phase may need some kind of deterministic constraint—a workflow is the most natural candidate I can think of right now. But this is a hypothesis, not a conclusion. Which constraint is actually most effective, and how much workflow definition is necessary, may still need to be worked out in practice.

The watershed between the two rivers is probably the moment you "figure out what to build." Before it, you need human judgment to steer the agent's production ability; after it, you need some systematic constraint to unlock the agent's execution ability. Both need an agent, but they may need completely different ways of working.

Blend these two stretches into one pipeline and what you get probably won't be a more efficient line—it'll be a line jammed by process in the first phase and lacking constraint in the second.

Two rivers, two channels. Don't dig them into one.

---

## References

- Anthropic Research. _Building Effective Agents_. https://www.anthropic.com/research/building-effective-agents — On the evolution of workflows from dynamic to static; composable patterns as infrastructure for agent reliability
- WeZZard (@realWeZZard). X/Twitter post (2026-06-04). https://x.com/realWeZZard/status/2062105579649380748 — The tweet that prompted this discussion; a practical observation on the structural difference between demo and product
- Breunig, D. (2026). _Two Beliefs About Coding Agents_. — The "personal software vs capital-P Products" distinction; on demo environments eliminating failure conditions
- Anthropic. _Claude Code Dynamic Workflows_ (2026-05-28, v2.1.154). https://docs.anthropic.com/en/docs/claude-code/workflows — The core mechanism of dynamic workflows: Claude writes a JavaScript orchestration script, the runtime executes it, the script can be iteratively modified, and once validated can be saved as a reusable slash command

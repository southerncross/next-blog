---
title: 'Rethinking Engineering Levels in the AI Era'
date: '2026-07-14T22:59:38+08:00'
description: 'AI pushes newcomers into the reviewer role earlier, but the old path for training judgment has been cut. A leveling framework is only the surface of this problem.'
topics: ['agentic-workflow']
---

Last month I sat on a promotion panel. The candidate was a front-end engineer with four years of experience. His slides were good: he had led three projects, earned an A on code quality, and mentored an intern. Two years ago, this packet would have cleared L5 without much trouble.

But he didn't pass.

The problem came down to one detail. A reviewer asked him: "You mentioned that you used an Agent to write most of the code in this project. So what exactly did you do yourself?"

He said: "I wrote the spec, then reviewed the Agent's output to make sure the code quality held up."

The reviewer pressed on: "How did you judge whether the Agent's code quality was good enough?"

"Well... I checked whether it had bugs, whether the logic was right."

"And how did you judge whether its architectural design was sound? If the requirements change in three months, will that design still hold up?"

He went quiet.

I kept thinking about that scene afterward. On the surface, the candidate simply failed to articulate his own contribution clearly. Dig a little deeper, and you find that the old leveling standard carries an implicit premise: code is written by humans, so we can infer a person's ability from the quality of the code. Now the code may be written by an Agent, and the PRD, spec, tests, and docs may all be drafted by an Agent too. So what, exactly, are we evaluating in an engineer?

Here is a judgment I'm growing more and more certain of: **AI hasn't abolished levels; it has just pushed people into the reviewer's seat earlier.**

Many capabilities that used to be explicitly required only at higher levels are starting to trickle down to lower ones. Reviewing proposals, judging boundaries, assessing long-term risk, understanding across the stack, distilling systemic rules—these things that used to look like something only L5/L6 needed to demonstrate consistently, now L3/L4 will run into much sooner. Newcomers didn't suddenly mature. It's just that once execution is taken over by the Agent, they get pushed into the position of review, adjudication, and judgment much earlier.

There's something awkward about this.

Because it sounds like saying: junior engineers today have to work the way architects used to. In a sense, that's true. In the past, architects and leaders often didn't write every line of code themselves; they reviewed proposals, examined designs, reviewed key implementations, judged risk, and asked others to fill in edge cases. Now an L3/L4 engineer has an Agent write the code while they review the spec, review the PR, and judge boundaries—essentially doing something similar.

Of course, a newcomer shouldn't be treated as an instantly usable architect. The shape of the work and the way it's assessed are similar, but the level of demand should scale down. An L3 only needs to judge, within clear boundaries, whether a single-module output is correct; an L5 needs to make reliable judgments amid ambiguous requirements and cross-service boundaries; L6/L7 needs to judge organization-level direction. Part of how senior engineers used to work is sinking down, but the scope, complexity, and reliability requirements of judgment should still progress by level.

## Code Is No Longer the Best Evidence

Traditional leveling standards have many dimensions: code quality, system design, project management, mentoring ability, technical influence. They still matter, of course. But in the AI era, all of these dimensions gradually loop back to the same thing: judgment.

Code quality? An Agent can write code that looks decent, but you have to judge whether it's actually right. System design? An Agent can offer three options, but you have to judge which one survives the next round of requirement changes. Task breakdown? An Agent can list tasks, but you have to judge whether that breakdown creates the wrong handoffs. Mentoring? You don't just mentor people—you also distill experience into a rule, skill, or harness so the Agent doesn't make the same mistake next time.

Judgment isn't new. Good engineers have always had judgment. The difference is that judgment used to be hidden inside execution. When you saw someone write good code, you could roughly infer they had judgment. Now that execution is outsourced to the Agent, judgment has to be made visible on its own.

But judgment can't be proven directly either. You can't say in a promotion panel "I made a lot of correct judgments"—that's as vacuous as saying "I'm very smart." What the reviewers can actually see is still the observable stuff: how complex the tasks you handled were, how large their scope of impact was, and whether you left behind systematic improvements.

Someone who says they reviewed 50 Agent PRs isn't telling you much. Someone else says they took a one-sentence ambiguous requirement, broke it into three verifiable scenarios, drove the Agent to generate the PRD and spec, then discovered the Agent kept writing error messages users couldn't understand in a certain class of scenarios, traced the problem to a missing copy-style rule in AGENTS.md, and that this rule was later reused by two projects. The latter is evidence.

Not proof that your judgment is good, but proof that you accomplished something that required good judgment to accomplish.

## Full-Stack Has Changed Too

There's a related change: "full-stack."

Truly full-stack engineers used to be rare, because full-stack meant you had to be able to write mature code by hand across multiple tech stacks. Usually one primary stack, plus a few secondary stacks that were also mature enough. That accumulation was slow, because each stack required a lot of implementation, hitting pitfalls, maintenance, and rework.

Now the bar has dropped. Cross-domain judgment hasn't gotten cheaper; the change is in the word "full-stack" itself.

Full-stack used to mean being able to write full-stack.

Full-stack now is closer to being able to read, review, and judge full-stack.

Being able to read and being able to write are very different in difficulty. A front-end engineer may not be able to hand-write complex back-end transaction logic at high quality, but when an Agent generates back-end code, they can judge whether error handling is complete, whether the interface contract is reasonable, whether the transaction boundaries are dangerous, and whether logging and monitoring are sufficient. When they hit something they're unsure of, they know who to ask, where the risks are, and that they can't pretend to understand.

This will change what organizations expect of an engineer's domain profile. We used to talk about T-shaped talent: deep in a primary domain, with understanding of adjacent ones. The AI era may look more like convex-shaped talent: still deep in the primary domain, but the adjacent domains can't be merely "I follow along"—they have to bulge up a notch, to the point where you can review Agent output, spot obvious risks, and participate in cross-stack delivery.

Here, too, requirements are trickling down. We used to say only to senior engineers: "You can't just understand your own layer; you have to be able to judge upstream and downstream." Now this requirement lands on junior engineers much sooner. Just at a relaxed level. An L3 doesn't need to design full-stack architecture independently, but should start being able to read Agent output in adjacent domains; an L5 needs to make reliable judgments about adjacent domains on top of depth in the primary domain; an L6 needs to design system boundaries across multiple domains.

## The Leveling Framework Is Just Scaffolding

If you insist on landing this on a leveling standard, the framework can actually be quite simple.

L3 still handles clear requirements, mostly at the scope of a single module or component. The change is that they can't just have the Agent finish; they also have to judge whether the Agent's output in the primary domain is correct, and start reading simple changes in adjacent domains.

L4 starts breaking down features and handling multi-module collaboration. They have to be able to spot obvious risks in adjacent domains, and know when they can judge for themselves and when they must escalate to someone more experienced.

L5 handles ambiguous requirements, cross-service coordination, and team conventions. Their judgment isn't just deep in the primary domain; it also has to cover the key risks of adjacent domains, and distill recurring problems into rules, skills, or review checklists.

L6/L7 and above—the focus is no longer whether a particular PR is right, but the trade-offs among system boundaries, organizational workflows, technical direction, and business direction.

This progression logic actually isn't that new. Traditional levels have always asked: how large is the scope in which your judgment can reliably operate? It's just that this judgment used to be presented indirectly through code written by hand. Now the execution tools have changed, lower levels get pushed into positions requiring judgment sooner, and the original progression logic gets compressed.

So I don't really want to write this as a complete leveling standard. Standards can be refined over time, but the more fundamental problem is already staring us in the face: newcomers aren't miniature architects, yet they're being placed into architect-like work shapes. If an organization only adjusts its promotion standards without adjusting its training mechanisms, the problem will be obscured.

## The Hardest Part Is Where Judgment Comes From

What actually makes me a little uneasy is here.

If the L3 standard becomes "able to judge whether the Agent's output is correct," but the L3 no longer does much hand-implementation, then where does their judgment come from?

The old growth path was slow, but it was a closed loop. Write code, hit a bug, debug, rework, ship, take the blame, do a retro. It's in these concrete frictions that an engineer gradually forms judgments like "writing it this way will break," "this boundary is dangerous," and "this abstraction won't hold up in three months."

In the AI era, this path has been cut. A newcomer might deliver larger features sooner, but they haven't gone through enough implementation details; they might have reviewed a lot of Agent PRs, but never personally chased down why those errors happened; they might quickly learn to drive an Agent, yet never form the underlying feel for judging one.

This confusion doesn't belong only to junior engineers either. For those of us who grew up in the old era, it actually offers a good counter-question: if you took away the path by which we accumulated judgment back then, would we still know how to train ourselves? Would we know how to explain where our judgment comes from?

A lot of the "experience" that seniors take for granted was trained in the classic work mode. Now that newcomers no longer naturally pass through that path, we can't pretend judgment will appear on its own.

The answer isn't to send everyone back to the classic work mode either. Deliberately not using AI in order to train judgment is like refusing GPS in order to learn the map—too costly, and out of step with real production environments.

The question is: without regressing to the old way of working, how do we redesign the training of judgment?

The directions I can think of now are still fairly plain. An L3 still needs to hand-implement part of the core paths in a controlled way, especially edge cases, error handling, performance-sensitive paths, and tests. The goal isn't to write faster than the Agent, but to build the underlying feel for judging whether the Agent is right or wrong. For the same task, you can also have the newcomer produce their own design draft first, then look at the Agent's proposal, and finally compare the differences. The training focus isn't who wrote it better, but why this difference matters.

More important is error retrospection. Every time the Agent gets something wrong, attribute it: the requirement wasn't clear, the spec boundary was wrong, context was missing, a rule was missing, the model's capability fell short, or the reviewer failed to catch it. An L3's growth packet shouldn't just be a count of PRs, but the improvement of their error-attribution ability.

Review has to be redesigned too. Having an L3 review Agent PRs is fine, but there has to be a checklist, a reference answer, and a senior retro. Review without a retro is just browsing; review with a retro is training.

This may become the most important apprenticeship design for engineering organizations in the AI era. Keep L3, but don't send L3 back to hand-writing all the code; first admit that the old path of experience accumulation has been cut, then build a new one.

Otherwise the organization ends up with a bad outcome: delivery efficiency looks high in the short term, but there's no supply of seniors in the long term.

## How to Tell the Story in a Promotion Packet

Back to the candidate who didn't pass at the start. If he had understood this framework, his packet shouldn't have read:

> I completed project X through an Agent and reviewed 47 Agent PRs.

He should have told a different kind of story:

> The original requirement for project X was a single sentence: "Users feel the operation is too complicated." I spent three days aligning with product and UX research, and broke that sentence into three verifiable scenarios. I drove the Agent to generate the PRD and spec, then adjudicated point by point: what counts as "simple," what can't change, how to verify. While reviewing the Agent's output, I found it kept writing error messages in scenario Y that were too technical for ordinary users to understand. I looked into why and found that AGENTS.md didn't define this project's copy style. I added that rule, and afterward the Agent never made that mistake again in similar scenarios. That rule is now reused by two other projects.

In this story, judgment isn't declared—it's inferred. Task complexity, the execution process, problem localization, and the improvement left behind can all be verified. The reviewers don't need to believe him when he says "my judgment is strong"; they only need to see whether he accomplished something that required judgment.

This may also be the biggest change in promotion panels in the AI era. You can no longer take the output directly as proof of a person's ability. You have to explain clearly what judgments you made during the formation of the output, what constraints you left behind, and whether those constraints made the next delivery more reliable.

## Some Things I Still Haven't Figured Out

What genuinely makes me a little uneasy is here. I haven't fully worked out to what degree the training of judgment can actually be compressed. AI can indeed expose newcomers to more cases faster, but "having seen many cases" and "having personally chased the causal chain of one case" are not the same thing. Maybe training speed can improve, but it can't improve infinitely. There should be a lower bound here; it's just that no one knows yet where it is.

Another question is whether organizations will underestimate this gap. The delivery boost from AI is too conspicuous, while the insufficient supply of judgment is a problem that only surfaces years later. By the time you discover there aren't enough people who can make complex judgments, catching up may already be very slow.

And there's an even more awkward question: can many seniors make their own judgment explicit? If all they can say is "I can tell at a glance this is wrong," then newcomers have no way to learn, and neither does the Agent. The AI era's demands on seniors may have moved up too—they not only have to be able to judge, but also to break down the judgment process into training material, review checklists, rules, and evals.

---

In one sentence: AI hasn't made levels disappear; it has just moved many higher-level demands earlier. What truly needs to be rebuilt is the path by which newcomers form judgment.

## References

- @edinsoncode paraphrasing Uber CTO data: 99% of engineers use AI tools daily, and over 70% of PRs involve an Agent. This article treats it only as an observational signal of the pace of industry migration, not as a rigorous statistical conclusion. https://x.com/edinsoncode/status/2075532390101852294

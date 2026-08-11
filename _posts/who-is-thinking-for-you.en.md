---
title: 'Who Is Thinking for You'
date: '2026-08-11T17:11:58+08:00'
description: 'The standard for using AI correctly is not a technical standard, it is a cognitive one: is your judgment growing or decaying?'
topics: ['ai-era']
---

Lately I have been coaching someone who was just promoted from IC to owner. The scope got bigger, and a lot of it is new to him. I watched from the side for a while and noticed a pattern.

His OKRs, technical plans, and design docs come out fast, in volume, and neatly formatted. But every time I finish reading one, something feels off.

Not that they are badly written. Every document is complete: background analysis, goal breakdown, milestones, risk assessment, everything that should be there. But complete in a way that does not look like it came from someone who just took over a new area. Later I confirmed it: most of the content was AI-generated. He gives the requirement, AI produces the plan.

But AI does not know the actual situation of his team. It does not know that one module carries three years of technical debt, and changing one thing there can drag out three more. It does not know that the team next door is reorganizing, and the key person he depends on may be moved next quarter. It does not know that his boss has an implicit preference on certain technical directions and already shot down a similar proposal last quarter in another setting. None of that information showed up in his prompt, so none of it showed up in the AI's output.

So the AI's plan covers every best practice in the textbook, and covers nothing about the specific, constraint-laden, not-so-clean reality he is actually facing.

I told him what I was seeing. I said you are still in the **input phase**: new area, new scope, you need to absorb business knowledge, technical architecture, historical decisions, and team relationships like a sponge. Once you have absorbed enough and there is something in your head, ideas and judgments will naturally start coming out. But right now you skipped the input and borrowed AI to jump straight to output. AI did your thinking, so your plan has no soul.

That got me thinking about a more fundamental question.

## What does "using AI correctly" mean?

Most of the public discussion about AI usage is about how to write prompts, how to set up workflows, how to pick tools. All fine, but I do not think any of it touches the core.

I increasingly believe the standard for using AI correctly is not a technical standard but a cognitive one: **while you use AI, is your cognition and judgment growing or decaying?**

Growing means you are using it right. Decaying means you are using it wrong. It has nothing to do with output volume, and nothing to do with prompt technique.

Why this standard? Because AI has two structural limitations that will not disappear in any foreseeable future.

The first limitation is that **the context is never complete**. AI knows what has been written down. But a huge share of the critical information in your job was never written down: how a piece of technical debt came to be, the implicit constraints inside organizational politics, the argument in the meeting room behind some architectural decision, the direction your boss cares about but never said out loud. That information is in no document, so it cannot appear in AI's training data or in the prompt context either. An AI plan can perfectly cover all the generic scenarios, but for your scenario it is missing a set of constraints only you know about.

The second limitation is that **the output is never stable**. Even with enough context, large models still hallucinate, and in long-context settings their attention diffuses: the more information there is, the harder it is to tell what matters from what does not. This is not just a current engineering problem. The attention mechanism in Transformers has a quadratic-complexity bottleneck at the architecture level; new architectures improve some dimensions but compromise on other capabilities. For quite a while, AI will not be 100% reliable.

Put the two limitations together and the conclusion is simple: **you cannot outsource judgment to AI.** Because AI does not know the constraints you have not told it, it may hand you a confident but wrong answer at exactly the moment you most need judgment. And if your judgment is itself decaying, you do not even have the ability to notice the error.

A Wharton study from earlier this year produced an unsettling number: participants accepted wrong AI answers 80% of the time, and the people who accepted wrong answers were nearly 12% more confident in their own judgment than the people who reasoned independently. More confident while more wrong. That is exactly what judgment looks like after it decays.

MIT Media Lab measured the same problem with EEG, and they call it **cognitive debt**. Every time you use AI to skip a round of thinking, you take on a loan. The debt does not disappear, it accumulates, and it gets called in all at once on the day you need to judge something on your own.

So the standard for using AI correctly is that cognition and judgment do not decay. But how do you achieve that?

Some teams take a blunt approach: no AI for new hires in their first few months. Shell does exactly this. New people must first define problems, validate hypotheses, and produce baseline analysis on their own, and only then are they allowed to use AI for optimization. The approach does work. But honestly, it is hard to scale. Can you really ask someone already used to AI to switch it off? And not every use of AI blocks cognition from forming. Having AI search and organize material for you, compared with digging through documents yourself, produces almost the same cognitive return at ten times the efficiency.

So the question is not "should I use AI," it is something finer grained: **is there a way to build and keep judgment about something even when you are not doing the execution yourself?** You do not need to write every line of code, but you can still tell good code from bad. You do not need to run every piece of research yourself, but you can still tell whether a conclusion holds up.

This is not a new problem. Plenty of fields have wrestled with it for decades, and their solutions are built around exactly this question.

## Looking for answers in older scenarios

**The courtroom.** Judges and juries do not understand DNA analysis, forensics, or financial engineering. But the case has to be decided, and the responsibility cannot be handed off. The Supreme Court's 1993 Daubert decision offered a way out: the judge does not evaluate whether the expert witness's conclusion is right, the judge evaluates whether the expert's **methodology** is reliable. Can the theory be tested? Has it been peer reviewed? What is the known error rate? The courtroom has an even sharper move: each side brings its own expert witness and they cross-examine. Weak links expose themselves in the adversarial process, and the judge can see where the cracks are without understanding the technical details.

The lesson: when you are not equipped to judge AI output quality directly, do not audit the conclusion, audit the process. Audit what prompt was used, which alternatives were considered, which assumptions were validated. And having two plans attack each other is more effective than having one person review another person's plan.

**Aviation.** Autopilot has been more precise than humans for a long time. But decades of hard lessons keep confirming one rule: the more reliable the automation, the faster human manual skill declines. Aviation's countermeasure is to mandate training time without automation. The FAA requires pilots to complete a certain number of hours of manual flying every quarter, a hard requirement rather than a suggestion. And the focus of that training is not normal flight, it is autopilot failure scenarios. Pilots are not practicing how to use it, they are practicing how to survive when they cannot.

The lesson: working without AI on a regular basis is not a nice-to-have, it is the floor under your skills. And what you practice is not the scenarios where AI succeeds, it is the scenarios where AI is wrong and you need to catch it.

**Editing.** A reporter spends a month investigating, and an editor spends a few hours deciding whether it runs. The editor cannot redo the reporting. His tool for judgment is the multiple-source rule: a conclusion from a single source does not run, no matter how good it sounds. It is the hard-to-articulate but very real "nose" that comes from a few thousand drafts. It is asking backwards: "What is the biggest uncertainty in this piece? If there is one error in it, where is it most likely to be?"

The lesson: cross-validate with multiple models or multiple prompt angles, and the places where they disagree are the places that need you. And ask yourself regularly, "What is most likely to be wrong here?" The question itself is judgment training.

**Venture capital.** An investor's information disadvantage relative to a founder is structural. Their core principle is so simple it barely sounds like a financial decision: bet on people, not on ideas. Ideas change, markets change, the quality of a person does not. Stage the bets, and each round validates the previous round's assumptions. The most fundamental rule: if you cannot judge the person, do not invest.

The lesson: if you judge that you are still absorbing a new area, do not rush into producing with AI. Accumulate first. And have AI produce in stages, an outline first that you review before the details. Every step is a low-cost round of judgment training.

**Your boss.** A boss hires people whose technical ability far exceeds his own, and cannot directly judge whether every technical decision is right. He looks at methodology: "Which alternatives did you consider?" He looks at consistency: does the judgment from three months ago cohere with today's? He looks at how peers react: do the people who know the domain nod in the meeting, or go quiet?

The lesson: judgment does not have to come from doing the work yourself, it can come from examining the process. You do not need to write code to judge whether a technical plan is sound, but you do need to be able to judge whether this person's thinking is careful, self-consistent, and able to hold up under follow-up questions.

Put these scenarios side by side and the underlying structure is identical: **the principal is less capable than the agent, but the principal is accountable for the outcome.** And every field's hard-won solution points in the same direction. Do not judge the output, judge the process behind it. Do not replicate the agent's capability, build a set of judgment signals that is independent of the agent.

## Back to our work

Translated into daily practice, I think there are three things worth doing.

**First, in the input phase, let AI collect for you but not decide for you.** You just took over a new area and there is no baseline of judgment in your head yet. At this point AI is an excellent research assistant: finding material, tracing threads, structuring information, work that used to take days now takes minutes. But do not let it write your OKRs, produce your technical plans, or set your technical direction. You are not yet able to judge whether what it wrote is any good. You learned to prompt, you did not learn to judge.

How do you know whether you are still in the input phase? My self-test is simple: before doing something, close the laptop. If there is already a blurry but recognizable outline and judgment in your head and the remaining work is just producing it, you are in the output phase. If your head is blank, and without AI you have no idea where to start or how to break it down, you are still in the input phase.

**Second, in the output phase, you set direction and AI fills in execution.** You have soaked in this area long enough to have instincts about what is good and what is wrong. Now the way to use AI is this: upstream you have thought through the direction and the standard, downstream you seriously verify whether the output drifted, and in the middle AI fills in the execution details. You are the editor, AI is the reporter. The editor picks the story, reviews the draft, and rewrites it; the reporter writes the first draft. The soul is yours, the legwork is AI's.

**Third, run regular "offline" drills.** Just as pilots must fly manually every quarter, set aside time on a regular basis, even half a day a week, to work entirely without AI. Not for output, but to keep the capability. Especially practice the scenarios AI gets wrong: read a chunk of unfamiliar code and find the bug, or write the skeleton of a plan from a vague requirement. Anthropic's RCT already showed that the AI-assisted group's comprehension drops by 17%. Another study is even more direct: developers with unrestricted AI use failed offline maintenance tasks 77% of the time, against 39% for the control group. Think of the offline drill as your vaccine against that 77%.

None of these three is complicated to state, but together they have an uncomfortable implication. Not everyone is at the same stage. Some people crossed the input phase long ago, and AI is a multiplier for them. Some are still accumulating, and AI is an all-too-convenient cheat code. **AI will most likely not level the gap between people, it will widen it.** Strong people use their judgment to drive AI, and their judgment gets sharper with practice. Beginners use AI to route around the process of accumulating judgment, and slide further from being able to judge anything on their own. BCG's survey of 70 C-suite executives confirms the same worry: judgment and decision-making, problem definition and decomposition, creative thinking, causal reasoning, the skills that matter most for long-term organizational performance are exactly the ones AI erodes most easily.

Then again, if you actually did all of this, the advice and the industry experience, would it be enough? Back to the earlier question: **how do you build and keep judgment about something without doing the execution yourself?** I went looking for answers in courtrooms, aviation, editing, and venture capital, and distilled three practices from my own observations. They all reduce risk, and they help you keep judgment once it has been built. But if I am honest, I increasingly think they are not answering the original question.

## An uncomfortable conclusion

Right now I lean toward this: **there most likely is no way to acquire sufficient cognition without doing the work yourself.** More precisely, not doing the work can build some cognition, but not enough. The process mechanisms in those cross-domain analogies, Daubert-style methodology review, cross-examination, offline drills, staged validation, reduce risk and help you keep judgment once it exists, but they cannot substitute for that first stretch of hands-on accumulation.

What does that mean? It means the input phase probably has no shortcut. You just have to spend time soaking in the problem, you just have to do some things yourself, even slowly, even clumsily, even inefficiently. AI can speed up parts of that phase, search, organization, structuring, but the zero-to-one construction of cognition, the path from "not knowing" to "knowing," probably has to be walked step by step by you. No tool can walk it for you.

That is obviously a pessimistic call, and I am not sure it is right. But it leads to an even more unsettling thought experiment: a software engineer born into the AI era, who never wrote a line of code from childhood and relied entirely on AI generation, what will their cognition look like when they grow up? Where does their judgment come from? Will they be able to tell whether a piece of code is good or bad, whether an architecture is right or wrong? The scenario may not apply to every individual, but the general trend may well look like this. If a generation's cognitive foundation is built on top of AI output, where is that generation's cognitive ceiling?

Recently a few friends who are not engineers tried vibe coding and came back excited, even a little addicted. They figured that since getting AI to write code is this easy, the programming profession must be finished. My answer is no. Programmers with judgment will not be replaced; they will become scarcer. Vibe coding lowered the bar for writing code, but it did not lower the bar for judging whether code is good. The bar just moved from "how to write" to "how to judge." And building judgment, after this whole loop, comes back to the same plain requirement: you have to have done it yourself before you can know what counts as good.

I do not know. But the question makes me think of the person from the start of this post. He is not an isolated case; he may just be the leading edge of a wave.

## A small trick: let AI interrogate you

A skill called grill-me got popular a while back. The usage is simple: you have an idea, you are not sure whether you have thought it through, so you have AI interrogate you continuously. It questions your assumptions, questions your boundary conditions, questions "what if X does not hold." Until you cannot answer.

The design is borrowed from Socrates: question-based teaching does not give answers directly, it uses continuous questioning to force you to discover that you had not actually thought things through. Writing is the same thing. You are not recording something you already worked out, you are being forced during the writing to turn vague feelings into clear sentences. Interrogation, writing, teaching someone else, all of them are devices for forcing thought.

Reverse the trick and you get a very practical self-test. Before doing something, have AI interrogate you about it for one round. If you can field most of the questions, not with perfect answers but by being able to open up the discussion and knowing where your boundaries are, then you already have some judgment on this problem. If three questions knock you flat and your mind goes blank, you are still in the input phase. Be careful then: if you use AI to produce for you now, you will not be able to review what it produces.

This trick does not solve the underlying problem. It cannot substitute for hands-on accumulation, and the uncomfortable conclusion above still stands. But it gives you a low-cost checkpoint available at any time, so you at least know where you are.

The person at the start of this post, if he had let AI interrogate him for one round before writing his OKRs, might have realized on his own: there is a lot here I have not thought through. At that point he has two choices. One is to keep having AI produce the plan and pretend he has thought it through. The other is to stop, go absorb, go understand, go accumulate, and produce once he is ready. The second is hard, but with the first, the plan has no soul.

## Things I have not figured out yet

If AI output quality keeps improving, will there be some threshold past which "cognitive surrender" stops being a problem? When AI's plans really are good enough that human judgment does not need to participate. But halfway through the thought I find a contradiction: however good the generic plan gets, the local constraints of each specific situation are still known only to the people in it. Information asymmetry will not disappear because the model got stronger, it will just take a different form. I did not work this out last time, I have not worked it out this time either, but if I do not write it down I will think I have worked it out next time.

The input/output dichotomy I use also has problems when you push on it. The real state is definitely not either-or. The same person can be in the output phase for one sub-area and still in the input phase for another. Even in the same area, on a good day you can judge independently, and when tired you want to be lazy and hand everything to AI. The phase is not a label, it is a state that fluctuates daily. At what granularity does this framework hold? How do you notice your own state slipping in the middle of an ordinary day? I do not have a good answer yet.

## References

- BCG (2026). _When Everyone Uses AI, Companies Risk Critical Skills_. A survey of 70 C-suite executives identifying judgment, problem definition, and three other critical skills most threatened by AI.
- Shaw, S. & Nave, G. (2026). _Cognitive Surrender_. Wharton. An experiment with 1,372 participants: 80% acceptance rate for wrong AI answers, with confidence rising by 12%.
- MIT Media Lab. _"Your Brain on ChatGPT"_. An EEG study finding significantly reduced brain activity during AI-assisted writing, and worse performance on subsequent non-AI tasks than people who never used AI.
- Anthropic (2026). _How AI Assistance Impacts Coding Skills_. A 52-person RCT: the AI group's comprehension was 17% lower, with no significant productivity gain.
- Shen, J.H. & Tamkin, A. (2026). _How AI Impacts Skill Formation_. arXiv:2601.20245. Comprehension of 65-86% when AI is used for conceptual questions, below 40% when used for code generation.
- BairesDev (2026). _Dev Barometer_. A global survey of 1,569 developers showing a cognitive gap of 85% for juniors versus 16% for seniors.
- Sankaranarayanan et al. (2026). _Epistemic Debt in AI-Scaffolded Novice Programming_. arXiv:2602.20206. A 77% failure rate on offline maintenance tasks for the unrestricted-AI group.
- _Daubert v. Merrell Dow Pharmaceuticals_, 509 U.S. 579 (1993). The US federal standard for the admissibility of expert testimony.
- tianpan.co (2026). _The Cognitive Outsourcing Trap: When Your Team Cannot Work Without AI_. Identifies three categories of outsourcing cost: comprehension debt, cognitive debt, and knowledge debt.

---
title: 'The Faster AI Writes, the Faster the Repo Rots'
date: '2026-08-03T17:37:41+08:00'
description: 'An aggressive AIDEV rollout that only amplifies code output, without equally amplifying verification capacity, domain judgment, and architectural constraints, accelerates codebase rot beyond what the organization can absorb.'
topics: ['agentic-workflow']
---

An engineer told me that it was already Thursday and he had not written a single line for this week's feature.

Not because the feature was too hard, and not because he had not put in the effort. Quite the opposite: he had been putting in effort the whole time, using the mandated workflow tooling, retrying over and over, decomposing the requirement, clarifying it, rephrasing it. The tool never worked well enough, and in the end he concluded that he would probably have to work through the weekend to get the feature done himself.

This is not a story about AI making engineers faster.

This is a story about a productivity tool consuming the engineer instead.

## The most dangerous outcome is a tool that half works

A lot of organizations are pushing AIDEV aggressively right now: roll out a harness, roll out workflows, set efficiency targets, drive agentic coding, encourage full-stack delivery. On the surface, this looks like an organization actively embracing a new paradigm.

But there is an easily overlooked problem here: **the first thing AI speeds up is code generation, not engineering judgment.**

Code comes out faster, PRs pile up faster, requirements appear to enter implementation faster. Yet review throughput has not improved in step, architectural judgment has not improved in step, and the team's understanding of the system has not improved in step. So what the organization sees is rising velocity, while what the front line feels is a rising verification burden.

In its 2026 retrospective, Augment Code described a very similar inversion: after agents were rolled out, code output and PR counts went up, but the team's deployment confidence went down. The reason is straightforward. Agents generate more code, review becomes the bottleneck, review under pressure degrades into rubber-stamping, and the team ships code it does not actually understand.

That is the most dangerous intermediate state of AIDEV: the tool is not useless, it half works.

It successfully makes code more plentiful, faster, and easier to produce.
It does not successfully make the team understand that code better.

## Cross-stack execution is free, judgment is not

After AI, it became easy for a backend engineer to write frontend code, and just as easy for a frontend engineer to write backend code. Syntax, boilerplate, framework APIs, glue code, all the things that used to block people can now be handed to an agent.

So it is easy for an organization to reach a seemingly natural conclusion: since AI can write it, full-stack delivery should be the default.

That inference skips the most important layer: **AI makes cross-stack execution cheap, but it does not hand you cross-stack judgment for free.**

A backend engineer who has AI write a frontend page can usually tell whether the page runs and whether the interaction produces the right result. What he may not be able to tell is whether the component boundaries are right, whether state was placed at the wrong layer, whether the styling system was broken, whether accessibility was handled, or whether this implementation will make the next requirement harder.

The same holds for a frontend engineer writing backend code. The endpoint responds and the tests pass, but that does not mean transaction boundaries are correct, error handling is stable, the permission model was not bypassed, or that this logic can still evolve where it sits.

The old execution friction was annoying, but it had a useful side effect: it reminded you that you did not understand a domain. AI removed that reminder. People can now cross domain boundaries much faster, and nothing in the system tells them whether they have the judgment to be on the other side.

So full-stack capability in the AI era should not be read as "one person can own every stack." A more accurate framing is that one person can execute faster in an adjacent domain, but he still needs to know what he can judge himself and what must be judged by the domain owner.

If an organization mistakes "can generate" for "can be accountable," the codebase starts to rot quickly.

## Process matters again

I used to hold a simple view about AI-written code: as long as the result is correct, the process does not matter.

Whether the code follows conventions, whether the architecture is elegant, whether the style is consistent, none of that felt like the core issue. What we want is a working executable. Code gets compiled into something the machine runs, so beyond performance, security, and functional correctness, architecture, style, and conventions looked mostly like aesthetic preferences inherited from the era of human collaboration.

After some time doing 0-to-1 AI-native development, that view changed.

Having an AI write a small demo in a sandbox looks impressive. A few minutes, and a page exists. A few minutes more, and a backend endpoint exists too. But most of those demos are unusable. Not because they fail to run, but because they did not grow out of a real system. They do not know the existing repo's directory structure, naming habits, error-handling style, state-management boundaries, or backward-compatibility baggage, and they do not know which pieces of odd-looking code are actually scars left by a production incident.

To get production-ready code, the code has to grow out of the existing repo.

In other words, the repository is the agent's knowledge base. Modern agents are already very good at this. They dig through history like a professional engineer would: finding similar implementations, imitating existing patterns, reading docs, reading git messages, reading tests, even reading uncommitted changes sitting in the staging area. They do not write code out of thin air; they continue writing code inside the context the repository gives them.

That changes the answer to whether process matters.

Process matters, not because we suddenly rediscovered a faith in code style, and not because architectural fastidiousness won the argument. Process matters because process becomes the input for future agents. The logic you copy-paste today to ship a feature becomes a pattern the agent references tomorrow. The boundary you cut around today to move faster becomes, the day after, something another agent treats as permitted by the repo. The bit of chaos nobody cleans up today enters the context of the next generation.

In that sense, coding conventions, architectural governance, and documentation sanity are no longer just human maintenance costs. They directly determine the output quality of future agents.

Agents are bounded by the basic shape of an LLM: attention degrades as context grows, local cues override global constraints, and multi-turn generation accumulates drift. You cannot expect every feature to be built in 100 percent compliance with your conventions. Nearly every round of development introduces a bit of chaos. Any single instance is small, maybe not even worth blocking, but without a mechanism to clean it up, the repo's signal-to-noise ratio keeps getting worse.

At that point, getting agents to produce code efficiently and reliably becomes impossible, because the knowledge base you handed them is already broken.

## The joy of 0-to-1 may be misattributed

Over the last two months I have been working on an internal project. In short, we rewrote an app from scratch, reusing as little of the old code as possible. From the very first line, the agent wrote it. Thoroughly AI-first.

The project also carried an experimental question. There is a claim going around that fully greenfield agentic coding works better than converting an existing project to agentic coding. It sounds reasonable. Old projects carry historical debt, strange constraints, modules nobody dares to touch, and docs that disagree with the code. A new project has none of that baggage, so the agent can grow it directly under new rules.

And honestly, that was my experience too: 0-to-1 development felt much better.

But there is a big attribution trap here. How much of that good feeling comes from being AI-native, and how much comes from the fact that any 0-to-1 project feels good?

Humans enjoy greenfield projects too. No historical debt, no compatibility baggage, no legacy interfaces, no bizarre abstractions left by a predecessor. You travel light, design the directory structure around today's understanding, pick the stack around today's preferences, and everything looks clean. It is very easy to misattribute the joy of that phase to AI. We may not be experiencing "AI-native development is inherently better," we may just be experiencing "new projects are inherently lighter."

AI does amplify that feeling further. Greenfield work always felt good, but you still had to build the skeleton line by line. Now an agent can push out the skeleton, the pages, the endpoints, the tests, and the config all at once, and the initial speed is remarkable. The problem is that speed amplifies something else as well: the rate at which the code rots.

I sampled some MRs in that repo and already found a fair number of merged changes that do not match the intended architecture. They are not the kind of mistake you would obviously revert. On the contrary, many of them are functionally correct, the page works, the tests pass. But they deviate from the architectural direction we wanted. Any single one does not look serious, and under merge pressure it slides through.

That is what actually worries me: 0-to-1 creates an illusion of a grace period. The repo is thin at first and the problems have not surfaced yet. Features grow fast and everyone feels progress. Architectural drift is only a few points on the map and looks like something you can clean up later. But if every requirement introduces a bit of drift, what does this project look like in three months?

Let us wait and see.

## Repo rot does not only happen in code

I have been talking about code, but a repo contains more than code.

AGENTS.md, ARCHITECTURE.md, READMEs, design docs, ADRs, code comments, test notes, commit messages. None of them compile into an executable, but all of them get read by agents. As long as an agent reads them, they are part of the repo. As long as they shape the agent's judgment, they are part of the production system.

This is more insidious than code rot.

When code is wrong, at least some defenses exist. Compilation fails, types complain, tests go red, production monitoring fires. These defenses are imperfect, but they give you a signal that something may be broken.

When docs are wrong, usually nothing happens at all.

An outdated ARCHITECTURE.md does not turn CI red. A wrong README does not fail a unit test. A rule in AGENTS.md that no longer applies will not be flagged by the build system. A comment that explains a workaround from three months ago sits there quietly long after the workaround was refactored away. A human might skim past it; an agent will read it carefully.

So when people say that writing code with AI is easier than writing docs, it sounds counterintuitive at first. Code is hard: it has to compile, be tested, and actually run. Docs just need to read reasonably well.

But from a verification standpoint, code really is easier. Code has relatively clear validation criteria. Docs do not. Documentation errors are usually not grammatical, they are reality mismatches: the doc describes an old architecture, an old process, an old constraint, an old decision. It reads perfectly sensibly, it just is not true anymore.

This gets more dangerous in the AI era, because production cost has collapsed and verification cost becomes the bottleneck. Writing an ARCHITECTURE.md is easy. Having an agent tack on a README section is easy. What is hard is confirming that the document accurately describes the current system, and that a future agent reading it will not be misled.

That means we have to treat documentation like production code, if not more carefully.

Not every document deserves to be written. On the contrary, in the AI era we should probably write fewer documents that have no verification mechanism. If it can live in code, put it in code. If it can be expressed as a test, express it as a test. If it can be expressed through lint rules, boundary rules, the type system, or a CI gate, turn it into an executable constraint. Only the things that cannot be expressed in code or tests, yet still shape judgment, are worth putting into AGENTS.md, ARCHITECTURE.md, or a comment.

And once you write them down, treat them with real caution.

Because bad code usually exposes itself at some point. Bad documentation does not. It keeps existing as "knowledge," read by the next agent, cited by the next requirement, copied into the next MR. Code rot makes a system hard to maintain; documentation rot makes an agent believe it understands the system.

## The harness should not be a KPI lever

The harness itself is not the problem. The real problem is an organization treating the harness as a lever to force people to go faster, instead of as engineering infrastructure that lowers verification cost.

A good harness should answer a few questions:

What context did the agent actually read this time?
Did it respect architectural boundaries?
Did it reuse existing patterns?
Did high-risk changes go through stricter review?
Can the output be automatically verified, rolled back, and traced?
Can an engineer figure out faster what it actually did?

If a harness does not reduce the verification burden and only forces people to run a workflow first, it is just a new process tax. That engineer who had not started his feature by Thursday may not have been facing a personal tooling problem. He was facing an organization that made an immature workflow a mandatory step.

This kind of thing usually looks great on a dashboard. Adoption is up, workflow runs are up, the share of AI participation is up. But the real cost on the front line hides elsewhere: repeated retries, re-explaining, patching context, failing to understand the output, and finally covering for it yourself over the weekend.

That is not AIDEV.
That is productivity theater.

## The evaluation criteria are not ready either

If an organization genuinely wants to push AIDEV hard, the metrics have to change too. But honestly, this is harder than I first thought.

Do not look only at PR counts, requirement throughput, AI adoption rate, or lines of code. In an agent setting these inflate far too easily. They measure output surface area, not system health.

The dimensions that deserve more attention probably include these:

Review depth. Did the reviewer understand the change, or approve it because CI was green?

Rework and rollback rate. How much agent-generated code gets rewritten, reverted, or bypassed later?

Cross-domain acceptance quality. When frontend engineers write backend code, or vice versa, does someone from the relevant domain participate in the key judgment calls?

Architectural drift indicators. Are duplicated logic, cross-layer calls, and pattern fragmentation increasing?

Repository knowledge quality. Are key docs, comments, ADRs, tests, and directory structure still consistent with the real code, or have they started misleading agents?

Incident explainability. When something breaks, can the team explain why the system behaved that way, or can it only ask an agent to read the code again?

Specification coverage. Do critical modules have an authoritative spec, ADR, and boundary constraints, or is the agent guessing every time?

But while these sound like metrics, many of them do not really behave like metrics in practice.

Some data is hard to collect. How do you define rework? If a feature is rewritten two weeks after launch, does that count? How do you compute specification coverage? Does one ARCHITECTURE.md count as covered, or must coverage reach specific modules, specific boundaries, specific failure paths?

Other dimensions are too subjective. How do you measure review depth? How do you quantify cross-domain acceptance quality? If a frontend owner reviews frontend code written by a backend engineer and leaves three comments, does that mean acceptance quality is high, or that there were a lot of problems? These numbers are easy to collect and may not express what we actually want to know.

This is not a small flaw in metric design, it is the difficulty of the problem itself. If something is hard even to evaluate, then it is a hard problem. Even when it matches intuition, even when every front-line engineer can feel the repo getting messier, evaluating it objectively is still hard.

And objective evaluation is the foundation of scientific optimization. Without evaluation criteria, optimization degenerates into slogans. Management keeps watching whatever is easiest to count: adoption, throughput, person-days saved. Engineers keep feeling whatever is hard to count: comprehension burden, review fatigue, misleading docs, architectural drift.

So maybe the first step is not to invent a perfect dashboard immediately, but to admit that repo health assessment for AIDEV is still very early. We can propose some directions now, but which of them are reasonable monitored metrics and which are health signals that still require human judgment is not settled.

## Things I have not figured out yet

I still have not worked out how the organizational goals for AIDEV should be set. With no goals at all, exploration may stay confined to a few people's personal habits. But setting only adoption, throughput, and person-days saved pushes everyone toward whatever is easiest to fake. Maybe what we should really be setting are confidence-type metrics, but those are much harder to collect than velocity.

The boundary of full-stack work needs to be clearer too. AI really does make learning an adjacent domain faster, but there is a long distance between "can execute" and "can be accountable." Organizations should encourage engineers to extend their judgment, not assume the agent has already supplied that judgment for them. How that boundary maps onto leveling, review ownership, and code ownership does not have a mature model yet.

Should the harness team behave like a platform team or more like an internal FDE team? I lean toward the latter. Do not build a general-purpose tool first and then demand migration. Sit with real business teams through a few hard requirements and prove, in real delivery, that it actually lowers verification cost. A tool that feels great to its own authors does not mean it will not slow everyone else down.

There is a sharper question too: if the repo really does become hard to iterate on three months from now, can the organization admit that this was a problem with how AIDEV was rolled out, rather than front-line engineers "not knowing how to use AI"? A lot of technical debt eventually gets explained as an execution problem, when it started as a metrics problem.

I also have not settled how aggressive the chaos cleanup should be. Doing an architectural cleanup after every feature is too expensive. Never cleaning up lets debt compound. Maybe what we need is something like garbage collection: automatic rules clearing small drift day to day, and domain owners doing deeper pattern consolidation periodically. But how to set that frequency is still short on empirical data.

Documentation verification remains a hard problem as well. Code has compilation, tests, and a type system. What does documentation have? If every doc change requires a careful review by the domain owner, the cost is high. If it does not get reviewed, it becomes a corrupted knowledge source for agents. Maybe we need a stronger version of docs-as-code, where key assertions in a document can be verified automatically by tests, lint, or repo queries. But which assertions can be verified automatically and which can only be judged by humans is still a blurry line.

And there is one concrete observation I want to keep tracking: what kind of repo a 0-to-1 AI-first project actually leaves behind after three months. If it is still clear, stable, and easy for agents to keep generating in, then an AI-native start really does have a structural advantage. If it degrades quickly, then much of that early joy was just the greenfield dividend, not a victory for AI-native development itself.

## References

- Augment Code (2026). _Confidence Is the New Bottleneck_. https://augmentcode.com/blog/confidence-is-the-new-bottleneck . This post draws on its account of PR volume rising after agent adoption, review becoming the bottleneck, and team comprehension and deployment confidence declining.
- Vercel v0 rebuild (2026). Tom Occhino on the pivot from sandbox-first to repo-first generation. This post draws on its distinction between sandbox prototypes and repo-first production code: most real work is modifying an existing codebase, not generating a demo from scratch.
- VibeCodiq (2026). _Architecture Drift Root Causes_. This post draws on its analysis of pricing logic, permission logic, and similar concerns scattering across multiple places after several AI sessions.
- Stefan Ve / ArchCodex (2026). _I built a 2300-file codebase with AI_. This post draws on its experience with executable architecture, architectural drift in AI-assisted development, and constraints reducing drift.
- Matt Pocock (2026). AI-era engineering observations. This post draws on his framing that "code is the environment the agent operates in": code quality directly affects the quality of subsequent agent output.
- Simon Willison (2024-2026). Observations and interviews on coding agents. This post draws on his view that AI amplifies expert capability rather than replacing expert judgment.
- Agentic Workflow Migration research (2025). This post draws on its summary of how standard productivity metrics distort in agent settings, and of alternative metrics such as comprehension, confidence, and review quality.
- BoringDocs (2025). _The Hidden Cost of Documentation Drift_. This post draws on its argument that divergence between docs and code creates hidden maintenance cost.

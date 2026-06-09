---
title: 'Who Is Your AI Demo Actually Accountable To?'
date: '2026-06-09T22:33:42+08:00'
description: 'A demo validates interaction; a scaffold produces production code—these are two entirely different things, and one cannot stand in for the other. Most real work is iteration on an existing product, so code generation has to run inside the repo. An agent that knows nothing about your project architecture only produces a throwaway prototype.'
topics: ['agentic-workflow']
---

Recently, while building an agentic workflow, I kept getting stuck on the same question: from the moment a requirement is proposed to the moment it enters development, what role is that "demo" in the middle actually supposed to play?

The starting point of this question was, in fact, a wish that sounds perfectly reasonable.

We want the demo prototypes produced by product and design teams to be more than just something to look at. Ideally, the engineering team could pick them up and keep going—finishing the rest of the development on top of the demo. Product hands off a validated interaction draft, engineering writes the business logic directly on it, no building pages from scratch, no re-translating design specs. Cut out that "turn the design spec into code" translation cost, and delivery should be much faster.

It sounds wonderful. But when you actually try to do it, you find things aren't that simple. Even for what is ostensibly "the same feature," the demo in a designer's eyes and the starting point in an engineer's eyes are two completely different things. You hand the designer's demo to an engineer, the engineer looks at it for five minutes and says, "I can't plug this code in." Not because the code is badly written, but because it was never written to "be plugged in" in the first place.

This looks like a communication problem, but if you think it through, it touches one of the most fundamental decisions in workflow design. And I've noticed that most teams—including myself—never seriously thought about this at the outset.

Through continuous thinking and research, I gradually came to see the subtle distinctions between demo, prototype, and scaffold—they aren't different names for the same thing, they are different things. Distinguishing them is the key to understanding the whole matter.

Let me start with a scenario that keeps recurring.

A PM proposes a new requirement. You use v0 or Lovable or Bolt to generate a demo: beautiful UI, smooth interaction, a flawless happy path. You show it to the PM, and the PM is thrilled: "That's basically 80% done, right? Can we ship next week?"

You know this isn't 80%. You know this isn't even 20%. But you can't quite explain why—because the code runs, the interaction is right, the UI looks good, and you can't point to any single concrete thing and say "this is wrong."

The problem isn't code quality. The problem is: **when this demo was generated, it had no idea what your product looks like.** Not just "no idea" at the code level—it doesn't know which pages, which flows, which business rules already exist in your product. It doesn't know whether the button corners in your design system are 6px or 8px. It doesn't know that in your user-role system, "admin" and "operations" see different sidebars.

It merely answered, in a vacuum, one question: "For a feature that looks like this, what should the interaction be?"

There's nothing wrong with that answer. What's wrong is that you assumed the answer could be used as a development starting point.

## The Two Responsibilities of a Demo

The more I think about it, the more I believe that when someone says "let's generate a demo first and see," they may actually be saying two completely different things.

The first thing: **validate the interaction design.** Does this feature's flow work smoothly? Can users complete the core action in three steps? Is the information architecture clear? Are the button positions reasonable? Is feedback timely? Here, what you need is a high-fidelity, interactive thing that looks like the real deal—but you don't need its code to be real. You don't even need it to have code. Its responsibility is to answer one question: "Did we get it right?" The answer is "yes" or "no"—and then it can be thrown away.

The second thing: **serve as the starting point for development.** The interaction has been validated; now it needs to become code that can go into production. Here, what you need is no longer "looks right" but "plugs in." You need it to use the project's existing state-management patterns, the existing component-library version, the existing API-layer abstractions, the existing error-handling conventions. Its responsibility is to answer a different question: "Can this code grow inside this project?"

These two responsibilities call for entirely different artifacts. The former is a prototype—accountable for interaction correctness, architecture-agnostic. The latter is a scaffold—accountable for architectural correctness, with interaction to be refined incrementally.

And these two kinds of artifacts also require entirely different generation tools. A prototype can be generated in a sandbox—it doesn't need to know your project, your product, or your design system. A scaffold must be generated inside the repo—because the criteria for judging architectural correctness all live inside the repo.

I realized that the root of the confusion in most discussions about "AI code generation quality" lies right here: **people use a single word ("demo") to refer to two things with completely different responsibilities, and then judge two completely different outputs by the same standard.**

## Why Most Real Work Should Take the Scaffold Route

Here's a very practical judgment. My personal inclination is that most requirement development should take the scaffold route—that is, repo-aware code generation—rather than the prototype route.

Not because prototypes are useless. But because most requirements aren't brand-new products built from zero.

Think about the requirements you've worked on recently. Were you building from scratch in a new project, or adding features, changing behavior, and replacing modules in an existing product? In my own practice, more than 90% of the work is the latter. And the latter means: the code you generate must coexist with existing code. It must know what the existing code does, how it does it, and what it uses.

This is much broader than "code architecture." I increasingly feel that when we say "repo-aware," we're actually talking about three layers.

**The first layer is code architecture.** This is the most obvious one. Dependency versions, state-management patterns, folder conventions, TypeScript config, lint rules. Alex Rusin's experiment is a great illustration—the scaffold Claude Code generated had a perfect structure but the wrong Prisma version, and that single version error forced the entire module system to switch from CommonJS to ESM just to work. That's "not knowing" at the code level.

**The second layer is product architecture.** Where does this feature sit within the product? Which existing features does it interact with? Which existing business rules must it respect? What does the user's role-and-permission system look like? What's the navigation structure? This information doesn't exist explicitly in the code—it lives in PRDs, design docs, and the team's shared understanding—but it equally determines whether the generated code is usable. An agent that doesn't know your product has both "admin" and "regular user" roles will generate a dashboard page with no permission checks. An agent that doesn't know your product already has an "order detail" page will generate a brand-new route inconsistent with the existing one.

This layer is more hidden than code architecture, because its "errors" don't make the code crash. They show up as "fine functionally but wrong for the product"—and such problems usually aren't discovered until testing, or even after launch.

**The third layer is UI architecture.** Your design system defines spacing scales, color tokens, font hierarchies, and component variants. In your product, every page's header height is consistent, every form's validation copy uses the same tone, and every empty state's illustration follows the same style. A demo generated in a sandbox can use Tailwind's default spacing—because it doesn't know whether your design system's spacing is a multiple of 4 or 8. It can use `#3B82F6`—because it doesn't know what your `primary-500` variable is.

This isn't a question of "whether the UI looks good." It's UI consistency—the foundation of product feel—being quietly eroded by the sandbox's isolated environment.

Add the three layers together, and you get the precondition for what Charity Majors calls "durable code." Code generated in a sandbox knows none of these three layers, so what it generates cannot possibly be durable code. It can only be disposable code—use it and throw it away.

## So Are Prototypes Still Useful?

Useful—but they should stay obediently where they belong.

The right place for a prototype is the **interaction-design validation node**, not the **code-generation node**. In a sensible workflow, a prototype should be generated during the design phase, reviewed, and used to align interaction expectations with stakeholders—and then thrown away. It should not enter the development phase. The input to the development phase should be a spec (design constraints) plus the codebase (architectural constraints), and its output is a scaffold—code that can grow directly inside the existing project.

Vercel's v0 pivot is the most honest acknowledgment of this. v0 v1 generated prototypes, and users found that the copy-pasted code needed to be rewritten before it could go into production. v0 v2 no longer has you copy-paste—it connects directly to your GitHub repo and generates within the context of your existing code. What it produces is no longer "a chunk of UI code that runs," but "a chunk of code that belongs to your project."

Vercel's choice was: the endgame of a prototype tool is a scaffold tool. They chose to cross that line between the sandbox and the repo.

But this isn't the only answer. Google Stitch takes another road—it doesn't try to generate a scaffold; instead, it makes the design deliverable itself (DESIGN.md) into machine-readable constraints, then hands them to a repo-aware agent to implement. The gap between prototype and scaffold—they don't try to cross it with AI, but to bridge it with structured specs.

Which route is more correct, I don't know. But both routes acknowledge the same thing: **prototype and scaffold are two different things, and you cannot use one as the other.**

## What This Means for Workflow Design

If you're building an agentic workflow, this affects one very concrete decision: where the code-generation node should run.

If this node's responsibility is to validate interaction—run it in a sandbox, use a prototype tool, produce a disposable artifact, and keep it out of the development pipeline.

If this node's responsibility is to produce code that can enter development—run it in the repo, use a repo-aware agent, produce a scaffold, and send it straight to review and merge.

These two nodes should not be mixed together. You can't generate a chunk of code in a sandbox and then pretend it can serve as a scaffold—because at birth it never saw your three-layer architecture; genetically, it is a prototype.

And for most real work—iterating on an existing product—you should default to the second route.

> A demo's correct responsibility is to validate interaction, not to generate code. Using it as a development starting point is the most expensive mistake in workflow design.

## A Few Things I Still Haven't Figured Out

Writing this far, there are a few questions still turning in my head.

One is: in what form should the constraints of product architecture and UI architecture be encoded into the repo so an agent can read them? Code-architecture constraints are naturally in the code—package.json, tsconfig, the patterns of existing components. But product architecture—feature flags, user roles, business flows—usually isn't in the code; it's in people's heads. UI architecture—design tokens, component variants, interaction patterns—might be in Figma, in Storybook, in a PDF design-spec document. AGENTS.md and CLAUDE.md can carry part of it, but how much can they carry? Will they become yet another document that has to be maintained by hand and drifts away from reality?

Another question is: should a prototype really be thrown away completely? Vercel's choice is "the endgame of a prototype tool is a scaffold tool," giving up the middle ground between prototype and scaffold. But could there be a hybrid node—use a prototype to validate interaction, then have the agent read the prototype's interaction logic and regenerate a scaffold inside the repo? That amounts to letting the agent do the "translation from interaction validation to architectural implementation" instead of having a human do it. I don't know how technically feasible this direction is. Rusin's experiment already showed the fragility of re-scaffolding—without repo context, it couldn't even get the dependency versions right. Maybe the precondition for a hybrid mode is the same as for the scaffold mode: the agent must have repo access.

There's another dimension I've only recently begun thinking about. There may be a priority difference among these three layers. Get code architecture wrong, and it won't compile or it blows up at runtime—easy to catch. Get product architecture wrong, and the feature behaves unexpectedly—some of it can be caught during testing. Get UI architecture wrong, and interaction consistency is broken; it may not be discovered until users feel "this product is getting messier and messier"—and by then it's already beyond repair. If the three layers' "error detectability" differs, shouldn't workflow design treat them differently? For example, code architecture with automated checks (lint, type check, test), product architecture with a review gate, UI architecture with visual regression tests?

The last question may point in a direction that rebuts me. If the ultimate form of a repo-aware tool is one where, after you give it repo access, it can automatically **infer** product architecture and UI architecture from the code, commit history, and PR discussions—then do we even need to encode these constraints explicitly? By 2026, Claude Code can already infer a lot of project conventions by reading code, but to what extent can this ability extend to product logic and design systems? Is there a ceiling to "reading code to infer product rules"? Or is it merely a question of model capability that will be solved over time?

## References

- Vercel (2026). _Introducing the new v0_. https://vercel.com/blog/introducing-the-new-v0 — Vercel's official announcement of v0 v2's repo-first pivot, explicitly acknowledging that prototypes generated in sandbox mode need to be rewritten before going to production.
- Alex Rusin (2025). _I Let Claude Code Scaffold My Entire Node.js API — Here's Where It Silently Failed_. https://blog.alexrusin.com/i-let-claude-code-scaffold-my-entire-node-js-api-heres-where-it-silently-failed/ — A hands-on test of Claude Code generating a project scaffold, finding that a dependency-version error made the architectural foundation wrong from day one.
- Charity Majors (2025). Disposable vs. durable code bifurcation thesis. The Honeycomb CTO's software-bifurcation theory: disposable code and durable code require completely different engineering standards.
- Kyros (2026). AI prototype-to-production gap analysis. — A report that about 70% of AI-built applications fail to reach production deployment, with the most common failure point being the "rewrite decision" stage of transitioning from prototype to scaffold.
- Google Stitch. _What is DESIGN.md?_ https://stitch.withgoogle.com/docs/design-md/overview — Google's structured design-spec format, encoding design constraints as a machine-readable file, representing the spec-first route.
- TechVerdict (2026). _Repo-Aware AI: Claude Code vs Cursor 2026_. https://www.techverdict.io/articles/repo-aware-ai-claude-code-vs-cursor-2026 — Introduces the "repo-aware AI" category concept and analyzes the impact of repository context on AI code-generation quality.

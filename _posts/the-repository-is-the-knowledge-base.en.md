---
title: 'Your Repository Is the Knowledge Base'
date: '2026-06-15T00:02:15+08:00'
description: 'Do not try to build a workflow that produces perfect code out of thin air. Get the first version running and merge it into the repo. As the repository thickens, the workflow naturally gets thinner.'
topics: ['agentic-workflow']
---

A few weeks ago I was testing a technical-spec design node.

This is the most upstream link in an agentic workflow: it takes a product doc and design mockups as input and outputs a technical spec, and the downstream code-generation node writes code according to that spec. At first I produced a spec of mediocre quality, and then I got absorbed in debugging the workflow—tweaking prompts, adjusting stage configs, fiddling with gate scripts. I figured that once the workflow was dialed in, the spec would naturally turn out fine.

But the workflow never got dialed in. I was stuck in that loop, unable to get out.

The colleague responsible for downstream code generation could not wait any longer. The technical spec she received was poor quality, so she had no choice but to supplement a pile of extra information through several rounds of conversation herself, and at least got code generation running, committed some baseline scaffolding code, and merged it into the trunk. By the time I wanted to run the workflow again to see how it did, that code was already in the repo. The agent's first step in producing a technical spec is to survey the current state—it read that code, and then output a technical spec based on it.

In a sense, it looked at the answer before answering the question.

Is that wrong? From the standpoint of purely testing a node, yes—I could not tell whether the spec was good because the workflow was well-tuned, or because the answer was already written in the code. But from the standpoint of actual production, this is perfectly normal. Most requirements do not start from scratch; they iterate on top of existing code. A technical spec is supposed to reference existing code, architecture, and patterns.

There is a deeper insight here. At first I thought Plan and Code were a linear upstream-downstream relationship—spec first, code second. But in fact, in a repo-first mode, this dependency is bidirectional: existing code shapes the spec design, and the spec design guides the new code. This is not a bug, it is reality.

## The Repository Is Not a Blank Canvas

This made me rethink what a "knowledge base" actually is.

We used to wrestle repeatedly with a question: where should the knowledge an agent needs live? An external RAG service? Project docs like ARCHITECTURE.md and DESIGN.md? Or the internal instructions of a skill? Over time I came to feel that a lot of things simply do not need to be written up as separate documents. Directory structure, file names, code, comments—these already contain a great deal of information. As the repository keeps iterating, that knowledge accumulates too. You may not need to supplement anything extra; it is already enough, or basically enough.

Building a project from scratch is both easy and hard. Easy because there is no historical debt, so you travel light; hard because there is so much room to maneuver that you have to consider everything. But for developers who join later, the difficulty of writing a technical spec has already dropped dramatically—because they can reference the existing spec and write by imitation. This is not laziness, it is encouraged behavior: it keeps the project's architecture consistent. Until one day it hits a critical point and triggers a refactor—but that is a story for later.

Vercel's v0 tool did a rebuild in early 2026, pivoting from sandbox-first to repo-first. Their CPO put it bluntly: 90% of the work is making changes to an existing codebase, not building from scratch. The first version of v0 had four million users and produced countless prototypes, but most were discarded—not because the code was low quality, but because the code was not in production. The rebuilt v0 reads code directly from the GitHub repo, and the code it generates goes through the standard PR flow.

This pivot is not a feature upgrade, it is a change of category. A sandbox tool produces a prototype—it looks right but the architecture is wrong. A repo-first tool can produce a scaffold—code that can go straight into development. The difference is not in model quality, but in input constraints: the repository itself is the architectural constraint.

## Growing Up Together

But there is something here that is easy to overlook. v0's pivot demonstrates the value of the repository; it does not explain how the repository became valuable.

Back to my original scenario. I tuned the workflow for a few rounds, the downstream colleague could not wait, got the code running herself, and merged it into the trunk. This interfered with my testing, but from another angle, her code made the repository a little thicker. The directory structure grew, the code patterns grew, and the agent had more to read.

The iteration strategy of a team I was previously on went like this: first everyone generates the workflow for their own node, then starting from the most upstream node, you run the whole thing end to end. No matter how bad the output is, that is the first version of the code. Then everyone manually, semi-automatically, corrects it into the final expected shape. Along the way you record what information you supplemented and what problems came up, and afterward you do a retrospective.

The retrospective asks two kinds of questions. One is "what was missing": something was not done well because the upstream node did not provide enough information—so you make a request of the upstream node, an act of addition. The other is "what was excess": the upstream said something, but the downstream did not use it, or used it and got confused—which means the context was too large, the node may need to be split, an act of subtraction.

This loop is natural, but it carries an implicit assumption: that the workflow is the only thing being optimized. In fact it is not. Every round, what changes is not just the workflow but also the code in the repo. After the first round's code (however bad) is corrected and merged, the second round's agent faces a thicker repository. Its output improves not only because the workflow changed, but also because the repo has more information.

The workflow and the code are symbiotic.

The reason building a complete workflow from scratch is hard is that you are facing an empty repository. To make the agent produce something presentable, the workflow has to encode almost all the architectural knowledge—which module goes where, what state management to use, how to design the API, how to handle errors. In a mature project these things live in the code; you do not need to tell the agent, it reads them itself. But in an empty repo the code is not there, so the only place you can stuff them is the workflow.

This is not a problem with the workflow; it is a problem of the repository being too thin.

Turn it around: rather than fixating on building a workflow that produces perfect output even on an empty repo, get the first version of the code out, merge it, and let the repository get a bit thicker. The second version's agent then has something to read. The third version, even more. Each round, the workflow can get a bit thinner, because some information no longer needs to be repeated by the workflow—the code already says it.

This direction is counterintuitive. People who build workflows naturally treat the workflow as the independent variable and output quality as the dependent variable. But in fact the repository is also an independent variable, and possibly the stronger one. The workflow is the lever, but the fulcrum is the repository. No matter how long the lever, it cannot pry anything loose on an empty repo.

This is also why those plans to "build the perfect workflow first, then start working" always fall through. A perfect workflow needs a perfect repository as input, and a perfect repository needs a perfect workflow to generate—it is chicken-and-egg. The way to break the loop is not to find the most perfect initial workflow, but to accept that the first version is bad, fix it manually to something acceptable, and then let the repository and the workflow push each other forward.

What Vercel said when building v0—that 90% is modifying existing code—actually has an unspoken second half: the remaining 10% built from scratch relies on the first people filling out the initial repository. That 10% cannot be automated, not because the technology cannot do it, but because automation needs input, and the input does not yet exist.

## Comments Are Decision Traces

Writing up to here, I am suddenly reminded of a related point. I have been saying all along that the repository itself contains information, but there is one easily overlooked subcategory worth pulling out on its own: comments. This idea is not part of the main argument, but it kept coming up while I was writing, and I found it interesting enough to put here.

Whether comments are necessary has been debated for decades. Some say comments are a patch for code that is not expressive enough, and the Clean Code school argues you should avoid them as much as possible. Others say comments are irreplaceable, because they record things the code cannot express.

I think neither side is wrong, but you need to distinguish two things: the result, and the decision process.

Code is the result. It says what was done, and through naming and structure it can express how. But code cannot say why this approach was chosen over another, which edge cases were considered, which known limitations are accepted. These are decision traces—process information that gets compressed away in the final code.

Here is a concrete example. You find that a button is offset by 3 pixels in Safari, and after a lot of digging you discover that Safari's baseline calculation for `inline-block` is inconsistent with other browsers. You try a few approaches, and finally add a line of `vertical-align: -3px`, and the problem goes away. The code itself can only tell whoever comes later that there is a 3-pixel offset here, but it cannot say why. A few months later someone refactors the styles, sees this magic number, finds it unclean, and deletes it. Safari is crooked again.

That is when you need a line of comment next to it: Safari 17's baseline calculation for inline-block elements is inconsistent with Chrome/Firefox; the -3px compensates for this discrepancy. Test coverage: Safari 17.4, iOS Safari. This is a decision trace. Not "what this line of code does"—the code already says that. It is "how this decision was made at the time, why it must be this value, and under what circumstances it can be re-evaluated."

This principle applies everywhere. A strange default value, a deliberately redundant query, a function left intentionally un-abstracted—each could be a decision node on the timeline, and losing the reason means losing the context.

When fixing a bug, the most dangerous move is not changing the wrong code, but changing a line of code without understanding why it was written that way. `git log` can occasionally help you recover this information, but only if the commit message at the time recorded it—and most of the time it did not. A comment written next to the decision point is far more reliable than a message dug up across hundreds of commits years later.

This means a code comment and the rationale field in an agent handoff are the same thing, just for different audiences. Handoffs between agents need to record decision reasons; handoffs between humans do too. Code is the medium of long-term handoff, and comments are the decision traces of that long-term handoff.

## Pushing Right to Left

If the repository itself is the knowledge base, then how should we arrange the information?

I drew a gradient.

On the far left is directory structure and file names. Their information density is highest and their maintenance cost is zero—module boundaries and functional partitioning are written here, and even if you wanted to skip maintaining them you could not, because the compiler forces you to.

To the right is the code itself. Interface contracts, logic, constraints, all live here. High density, zero maintenance cost—changing the code is your job anyway.

Further right are comments. Decision reasons, edge cases, known gaps. Medium density, low maintenance cost—you only need to change them when a decision changes.

Further right are project-level docs like ARCHITECTURE.md and DESIGN.md. Cross-module design intent, overall trade-offs. Low density, medium maintenance cost.

On the far right is the skill—project-agnostic methodology and process constraints. Lowest density, not-low maintenance cost.

Each layer should contain only what the layer to its left cannot express. The directory structure does not need a document describing the module layout—the directory itself is the layout. The code does not need a document listing API signatures—the code itself is the index. These project-level docs only need to cover what cannot be read out of the code. The skill should be as thin as possible, containing only general methods, not project-specific architectural information.

This explains why so many knowledge-base efforts cannot get off the ground: they require people to maintain an extra body of knowledge independent of the code, and that body is bound to go stale. Stale things are actively harmful once the agent reads them.

The direction of optimization should be right to left: push knowledge from the skill into project docs, from project docs into comments, from comments into code. Code is the ultimate knowledge store, with the lowest maintenance cost and the longest survival time. The goal of a workflow is not to remember everything on the code's behalf, but to push knowledge toward the code so the workflow gets thinner.

This sounds a bit abstract. Brought down to daily operation, it goes roughly like this.

## So What Do You Actually Do

If you are building an agentic workflow, the following may help.

First, do not chase a workflow that produces perfect results from scratch. It cannot be done—an empty repo gives the agent too little information, and the workflow would have to encode all the architectural knowledge to fill that gap, which would bloat it beyond maintainability. Allow the first version to be mediocre, correct it manually, and merge it into the repo. That is the baseline.

Second, after each iteration, do not just review where the workflow should add or subtract; also ask: which pieces of information clearly belong in the code but ended up in the workflow's prompt? Move them into the code. Next time the agent reads the code, it will not need the workflow to tell it again.

Third, take directory structure and naming seriously. They are the knowledge layer with the highest information density and the lowest maintenance cost. An agent seeing `src/features/auth/` is far more useful than seeing some project doc that says "the auth module is in src/features/auth/"—the former is a code fact, the latter is a doc description; the latter can go stale, the former cannot.

Fourth, write "why" comments, not "what" comments. An agent reading code, like a human reading code, needs the decision reasons. This does not take much; you only need it when the decision is not obvious. But once written, whoever (or whatever agent) reads that line of code in the future does not have to guess.

---

**In one sentence: the repository and the workflow grow up together. Do not chase the workflow that produces perfect code out of thin air; get the first imperfect version of the code out, let the repository thicken, and the workflow will naturally get thinner.**

## Some Things I Still Have Not Figured Out

One question is how this gradient framework positions something like a "design document." Does a technical-spec document go in the repository or in the workflow's artifact directory? It seems to occupy an awkward position between code and project-level docs—it is generated, it does not belong to the original code, but once generated it becomes the factual input for the downstream node. Could there be an intermediate form, where some parts of a design document should be "compiled" directly into the code (for example, as comments) rather than existing forever as a standalone document?

Another is whether, once the repository gets thick enough, the workflow can get so thin it disappears. Not all workflows, but certain specific stages. Take the Code stage: when the code patterns in the repo are rich enough that the agent only needs to "write by imitation" to produce architecturally correct code, can the Code stage's workflow instructions be compressed to a few lines? If you push the skill to the extreme so that it contains only "read code → imitate → run tests," is it still a workflow, or has it degenerated into a thin wrapper, essentially the agent self-navigating off the repository?

There is also one tied to the human factor. I have observed that many engineers are resistant to comments—not because comments are useless, but because the kind of comment they were once required to write (explaining what a piece of code does) really is useless. They have never experienced the benefit of a "why" comment. If a team has not formed the habit of writing decision-reason comments, the repository's usability for an agent is discounted. But how to cultivate that habit is, for now, an open question. It is not a tooling problem, it is a culture problem.

## References

- Vercel v0 rebuild (Feb 2026). Tom Occhino on the pivot from sandbox-first to repo-first generation. Source of the key data point that "90% is making changes to existing code."
- GitHub Blog (Oct 2025). _How to Build Reliable AI Workflows with Agentic Primitives and Context Engineering_. Proposes a three-layer context engineering framework, including session splitting to prevent context contamination.
- The Rice Stack (2025). _Building AI-First Codebases_. A practical approach to structuring AI-first repositories, explicitly noting that existing code architecture constrains agent behavior.
- Jeff Atwood (2006). _Code Tells You How, Comments Tell You Why_. Coding Horror. Cites Jef Raskin, providing the classic formulation that "comments explain why."
- Steve McConnell. _Code Complete_ (2nd ed.). Section 32.3 on commenting techniques. A classic treatment of the purpose of comments in software engineering.
- Martin Fowler. _CodeAsDocumentation_. martinfowler.com. Argues that code is the only form of documentation detailed and precise enough.
- Michael Nygard (2011). _Documenting Architecture Decisions_. cognitect.com. The origin of the ADR, arguing that architecture decision records should be stored in version control alongside the code.
- BoringDocs (2025). _The Hidden Cost of Documentation Drift_. Quantifies the economic cost of doc-code divergence at $100K-$150K per year for a mid-sized team.
  </content>
  </invoke>

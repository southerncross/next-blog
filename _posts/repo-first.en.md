---
title: 'Repo-First'
date: '2026-07-10T20:18:25+08:00'
description: 'A repo should contain all the information you need. Clone it and start working right away. Being in the repo does not mean it will be committed—what finally gets committed is carefully chosen, absolutely correct knowledge.'
topics: ['agentic-workflow']
---

We use worktrees to manage projects. Every time a new task comes in, we create a new worktree, do the development inside it, and delete it once the tests pass. The pattern itself is light—creating and destroying a worktree is fast, its lifecycle is short, and basically once Codex finishes a development task plus some simple verification, it can be cleaned up.

But there is a bottleneck in this flow.

The company's infrastructure team built a CLI tool for initializing a workspace. The command is `workspace init`, and it pulls the repo, installs skills, and configures the MCP server for you. The idea is good—it lowers the barrier to getting started. The problem is that this tool is **repo-agnostic**. It does not know which project it will be used in, so every time it runs, it has to ask you a pile of questions: which repo you want to clone, which agent to use, what the corresponding Jira ticket is, which lane environment to deploy to, what the branch name is. Only after you fill in that whole string does it start pulling resources. The entire process requires a human in the loop and cannot be automated.

And we create worktrees very frequently. The reason is this: the intermediate artifacts of each task—generated technical designs, test cases, analysis scripts—all stay in the local directory. Although these files are ignored by `.gitignore`, Codex can still read them when it starts up. If you start a new task directly inside an old worktree, Codex will run into these leftover files and get thrown off. The fix is straightforward: for every new task, create a fresh worktree. A clean workspace, with no leftovers from the previous round.

But `workspace init` turns "create a new worktree" into an action that requires manually filling out a form. An operation that should have been fast is blocked by a repo-agnostic tool.

This got me thinking about a question: why isn't the workspace initialization logic in the repo? If it were in the repo, a setup script would know which repo it is in, what the agent configuration is, what the branch naming rules are—without having to ask every single time. Repo-agnostic sounds like generality, but in practice it turns itself into a bottleneck that requires human intervention every time.

I have come to believe more and more that in the era of agentic workflows, there is one architectural principle that many people underestimate. I call it **Repo-First**.

## What I Mean by Repo-First

The definition of Repo-First can be understood from three angles.

**It is a starting point.** A repo should contain all the information you need. Clone it, and you are already in the right place. You do not need to go somewhere else to install something or configure some environment—it is all in the repo. Run an initialization script, and the rest is just starting to work directly.

This does not mean nothing can ever be taken out of the repo. It is just that the default should be set inside the repo. When you do not know where something should go, put it in the repo first. When the time is right—say it genuinely needs to be shared across multiple repos—then take it out. Do not presume from the start that it belongs on the outside.

**It aims for focus and closure.** While an agent is working, it can find everything it needs inside the repo. The coding conventions are in `AGENTS.md`, architectural decisions are in `docs/architecture.md`, reusable workflows are in `.claude/skills/`. There is no need to jump over to Confluence to read docs, no need to open Figma to check a design, no need to dig through historical decisions in Slack. The repo is a self-contained working environment—the agent's attention never needs to leave it.

This is also why a sandbox environment is inherently at a disadvantage. Some tools let you generate code in an isolated space and then try to port it into the actual project. But the sandbox does not have the project's real context—it cannot see the existing code, cannot read AGENTS.md, does not know the team's naming conventions. The generated code looks correct, but it does not fit into the real project, because at the time it was generated it had no relationship to the project's architecture. Writing directly in the repo means this gap does not exist.

**It aims for practicality.** What Repo-First ultimately guarantees is that the code you generate is not an unusable demo, but code that can genuinely be developed further and merged into the main branch. The existing code, existing architecture, and existing constraints in the repo are not obstacles—they are the guarantee of generation quality. It is precisely because it is subject to these constraints that the generated code can mesh with the existing system.

## Applying Repo-First in Practice

If you want to apply Repo-First in your own project, there are a few operational details worth thinking through in advance. They are not theoretical questions but concrete choices you will run into repeatedly in actual use. I have hit these pitfalls in my own workflow, and the advice below comes from that experience.

**The first thing: distinguish between "sitting in the repo directory" and "committed to the repo."**

When many people hear "put everything in the repo," their first reaction is: doesn't that turn the repo into a garbage dump? The concern is reasonable, but it conflates two concepts.

What actually gets committed to the repo should be carefully chosen, absolutely correct knowledge. Code, documentation, records of historical decisions, coding conventions—these are things you can use directly after cloning, the production-grade knowledge of the repo. They have gone through review, through the judgment process of moving from "this thing might be valuable" to "this thing is definitely valuable."

But the repo directory does not only contain committed things. The large volume of intermediate artifacts produced during development—data from intermediate workflow nodes, technical design drafts, session records—can also sit under the repo directory, ignored via `.gitignore`. These things have short lifecycles, and some are even wrong. But they preserve the continuity of the agent's work—the analysis results of the last session can be picked up by the next; a design draft from an intermediate stage can be referenced directly in the next step.

Concretely: **treat `.gitignore` as the boundary line between working state and persistent knowledge.** On one side of the line is working state that can be discarded at any time; on the other side is persistent knowledge that is taken seriously and has been filtered. You do not need to create a scratch directory outside the repo just to hold intermediate artifacts—the repo directory itself is the workspace, and gitignore is the filter inside it.

**The second thing: use Git Worktree for task isolation.**

Gitignore alone is not enough. It solves "what should not be committed," but it does not solve "what should not be read by the next task."

There is a key difference between agents and human developers here. In the past, a single repo directory might be reused indefinitely. A developer pulls out a branch, writes code on it, commits, switches back to the main branch, then pulls a new branch and keeps going. Throughout the whole process, the person stays in the same directory. Even if the intermediate artifacts are gitignored, they still stay locally—but the person is not much affected, because they can tell which files are leftovers from last time and which are needed for the current task.

An agent cannot do this. It is an indiscriminate reader—it will read everything in the directory and treat it as potential context. The technical design drafts, test reports, and analysis scripts left by the previous task, if they are still there, will be read by the next task's agent and mislead it. And this kind of misleading is silent—the agent will not tell you it read an outdated draft; it just quietly drifts in what it generates.

The fix is straightforward: for every new task, give the agent a clean directory. The most naive approach is to clone again—cloning is fast enough these days anyway. But if you go repo-first, you build workspaces very frequently (once per task), and cloning every time is still a bit heavy.

Git Worktree is made for exactly this scenario. It lets you create a brand-new working directory from an existing local repo in a few seconds, sharing the same `.git`, without cloning again. The worktree you pull out is clean—no intermediate artifacts from the last task, no leftover session records. The agent starts from scratch, working in a fresh directory. Once the task is done and the code is merged, the worktree is deleted, and the intermediate artifacts disappear along with it.

Combined with gitignore, this forms a complete isolation mechanism: gitignore ensures intermediate artifacts do not get committed to the repo, and a clean worktree ensures intermediate artifacts do not leak across tasks. Neither needs an external tool; both come built into git.

So if you are doing Repo-First, I strongly recommend pairing it with Git Worktree. It is not required—cloning every time achieves the same isolation—but worktree makes the whole thing faster and lighter, turning "a clean workspace per task" from something theoretically feasible into an everyday action you do without a second thought.

## How the Community Talks About Repo-First

The term repo-first is already being used in the community, but the meaning varies in emphasis.

Dan McInerney's [architect-loop](https://github.com/DanMcInerney/architect-loop) is the implementation closest to my understanding. It treats multi-agent collaboration as a repository protocol rather than a chat protocol—spec, frozen gate, ruling, lane file all live in the repo. No external CLI tool, no workspace abstraction, just Claude Code skills + Codex CLI + git worktree. Its core idea: "memory is not a hidden chat transcript. If the next run needs to know something, it has to be written into the repo." Not in the repo = didn't happen.

Ricky Smith wrote about a [multi-repo worktree pattern](https://www.ricky-dev.com/coding/2026/01/agentic-tooling-across-multiple-repositories/), in a more everyday scenario: he wanted an agent to modify multiple Terraform repos at the same time, but without the contexts polluting each other. His approach is one worktree per task, where the parent directory (the branch name) is the workspace, holding `AGENTS.md` and `PLAN.md`, and once the agent reads these two files it knows what to do. No CLI tool needed; git is enough.

These two projects have something in common: the repo itself can take on the responsibilities of the workspace. Add a layer of external tooling, and you add one more surface for drift.

Arpit Asthana positions the repo as the "operational spine"—not the storage layer for code, but the skeleton of decision logic, evidence chains, and runtime behavior. Rany Elhousieny's Agentic-Repo framework defines an "agentic repository" = code + AI knowledge layer, and his conversion tool adds things into the repo rather than building a workspace outside it—the tool's output lives in the repo, so it still counts as repo-first.

These discussions share a common characteristic: they are all additive—"these files should be added to the repo," "this structure should be built in the repo." But Repo-First also has a negative dimension—it is not only about "what to put in the repo," but also about "what not to build outside the repo." This negative dimension rarely shows up in the existing discussions.

## Some Questions I Have Not Fully Figured Out

Is Repo-First correct in all scenarios? I am not sure. If an organization has hundreds of repos, each with its own setup method, making a newcomer `clone + setup` them one by one really does create friction. In that case a unified workspace CLI might indeed have value. But is that value resolved at the repo-governance level—finding a way to unify the setup method across all repos—or at the workspace level? Maybe both are needed, but Repo-First would lean toward the former.

If agents themselves begin to participate in building the harness, would Repo-First become a norm that constrains agent behavior, rather than merely an architectural principle? For example, "the agent can only operate within the scope of the repo and cannot go modify external tools"—this might touch on where the boundary of an agent's operational permissions should be drawn.

What is the relationship between Repo-First and the older architectural pattern of single source of truth? The AI Pattern Book defines source of truth as "every piece of information has only one authoritative location," and specifically notes that in an agentic workflow this problem gets amplified—when an agent writes one copy of a config in a config file and another in a constants module, you have no idea which one to trust when the system breaks. Repo-First might be a restatement of single source of truth in the age of agent workflows, except the emphasis shifts from "data consistency" to "the uniqueness of the working environment and configuration."

There is one more question I keep turning over: in the past, `npm install` was enough to install dependencies, and you did not need a dedicated "JavaScript dependency management CLI." In an era where `git clone` gets you all the configuration, you also do not need `workspace init`. But what about the future? If the speed of AI production keeps accelerating, will a new form of repo emerge—not a static repository, but a living, self-evolving knowledge environment? And by then, what would Repo-First mean?

## References

- Dan McInerney. _architect-loop_. https://github.com/DanMcInerney/architect-loop — Treats multi-agent collaboration as a repository protocol rather than a chat protocol. Core idea: "memory is not a hidden chat transcript." All persistent state is written back to the repo.
- Ricky Smith. _The Missing Workspace Layer for Agentic Polyrepo Development_. 2026. https://www.ricky-dev.com/coding/2026/01/agentic-tooling-across-multiple-repositories/ — Proposes a multi-repo worktree pattern, using git worktree for workspace isolation, with the parent directory as task context.
- Arpit Asthana. _Building a Repo-First Agent System for Runtime Decision Support_. 2026. https://www.linkedin.com/pulse/building-repo-first-agent-system-decision-arpit-asthana-2dlqe — Positions the repo as the "operational spine" and proposes six principles including repo-first, contract-driven, and evidence-linked.
- Rany Elhousieny. _Agentic Repos: The Framework That Turns Any Repository into an AI-Ready Workspace_. 2026. https://www.linkedin.com/pulse/agentic-repos-framework-turns-any-repository-senior-rany-ilsyc — Proposes the definition of an agentic repository = code + AI knowledge layer, whose conversion tool's output still lands inside the repo.
- AI Pattern Book. _Source of Truth_. https://aipatternbook.com/source-of-truth — Applies the source of truth pattern to agentic workflows, noting that agent-generated duplicate configuration leads to system inconsistency.

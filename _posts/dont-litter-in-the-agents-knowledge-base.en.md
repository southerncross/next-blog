---
title: "Don't Litter in the Agent's Knowledge Base"
date: '2026-06-17T17:57:27+08:00'
description: 'To an agent, the file system is the knowledge base. Every extra file you drop in without thinking is one more signal that might mislead it. Governing intermediate artifacts is not just about being tidy—it is about letting the agent read fewer things it should not.'
topics: ['agentic-workflow']
---

A while back, while testing Codex, I ran into something that annoyed me a little.

I was tuning a workflow that generates technical designs. I ran it a few rounds and was not happy with the results. So I deleted all the code generated during earlier tests, edited the instructions in AGENTS.md, and ran it again. The code Codex produced was clearly off—it had referenced things it should not have. When I dug into its reasoning log, I found out why: it had read the log files and intermediate artifacts left behind from the previous run, including the prior version's design and the thinking behind the changes. I never put those files into the context; Codex read them on its own while exploring the project directory. Not only that—it ran `git log` by itself and dug out the contents of files I had deleted but not yet committed. All the things I assumed were gone, it found them again. It saw "how it had thought last time," and then followed that thinking.

I wiped out all the process artifacts and ran it once more. This time it was clean. The output came back within the expected range.

I have raised a dog. When you walk a dog, there is one thing you must watch for at all times: there might be something on the ground you do not want it to eat. A fruit pit, a chicken bone, half a piece of bread someone tossed. The dog does not care—it smells it and swallows. You cannot expect it to judge for itself. You have to hold the leash, watch the ground, and pull it away before it opens its mouth.

Codex is the same. Since the file system is its knowledge base—it will proactively explore, read, and reference any file in the project—you have to be careful about what you put in the file system. A dog does not distinguish between "this is the dog food you carefully prepared" and "this is a chicken bone a stranger threw," and Codex does not distinguish between "this is a reviewed design doc" and "this is a log left over from my last run."

---

## The Denylist Dilemma

After this, I started thinking about a question: is the way we currently manage what an agent can read actually right?

The mainstream approach is the denylist. Claude Code has `.claudeignore`, Cursor has `.cursorignore`, and the community has proposed an `.agentignore` standard. The logic is always the same: by default, give the agent everything to read, and you list out what it should not read to exclude it.

In the era of humans writing code, this approach was mostly good enough. `.gitignore` excludes build artifacts, secrets, and `node_modules`, and the rest—source code, docs, configs—are basically things people deliberately put there. People do not casually drop an analysis draft or a debug log into the project directory. Even if they did, a person can glance at it and know it is garbage, and ignore it automatically.

Agents are not like this. When an agent explores a project directory, anything it encounters is treated as potentially relevant information—it is an indiscriminate reader. A stale design draft, a debug output from the last run, an analysis note you forgot to delete—garbage in human eyes, context in the agent's eyes. The agent does not know these things might be wrong, outdated, or just something it made up last time.

What makes it worse is that the agent is also a prolific writer. A single run can spit out dozens of intermediate files—analysis notes, design comparisons, plan drafts—in formats it decides on its own, and you might not even know these files exist. Today you add `*.log` to `.claudeignore`; tomorrow it generates `.plan.md`; the day after, `debug-output.txt`; and after that, a format you have never heard of. The pace of maintaining a denylist can never catch up with the pace at which the agent invents new garbage.

Techloom ran an experiment: inject irrelevant content into a coding agent's context—random code snippets, fragments of old docs, unrelated conversation history—and then test code quality. Under 50k tokens of noise, Sonnet's score dropped by 8.3 points, and the standard deviation jumped from 5.1 to 16.3. Noise not only lowered the average quality, it also made the output unpredictable. Context pollution is not "making the agent a little dumber"—it turns the agent into a random number generator.

And agent context pollution has a particularly insidious property: it is fail-open. Dependency conflicts (npm, pip) cause a build to fail or a runtime error—the system stops and tells you where it went wrong. When an agent reads something it should not, it does not crash, does not throw an error, does not stop. It keeps running and produces results that look reasonable but are logically wrong. You might only notice something is off several rounds later, then dig back through the logs layer by layer to find which file led it astray.

---

## The Problem Is Not "Reading a Lot," It Is "Reading a Mess"

This is not an argument against agents reading lots of files. The repo-first model itself relies on the agent reading the real code in the repository to acquire architectural constraints—this is more reliable than any documentation. When v0 moved from sandbox to repo-first, it put it this way: 90% of coding work is modifying existing code, not building from scratch. The agent needs to read the repo, and the more it reads, the more accurate it is.

The problem is not "a lot," it is "a mess." The agent read two kinds of things it should not have: first, intermediate artifacts left behind from the last run (like my Codex case), and second, work notes it generated itself but that have not been verified. These files have extremely low information density, but they are enough to give the agent a wrong anchor—it treats these things as "since they exist, they must mean something."

To understand why the agent does this, you first have to understand how an agent sees the file system. Anthropic's article on context engineering makes it clear: the agent treats the structure of the file system—directory hierarchy, file names, timestamps—as navigation signals. An agent that sees `src/core/auth/` and one that sees `temp/analysis-2026-06-17.md` judges the trustworthiness of the two differently. The former is an architectural fact; the latter is a temporary note. The agent can make this distinction—provided the directory structure itself conveys the right signal.

The problem is that if you put temporary notes and source code in the same directory, or in a directory called `notes/` under the project root, the agent's judgment gets blurry. It cannot tell which one is an "architectural fact" and which is "a draft some agent wrote last night."

---

## Maybe It Should Be Thought of in Three Tiers

I tried sorting the files an agent comes into contact with into three tiers. Of course, classification is always a simplification—in reality, a file's lifecycle is far more complex than three tiers. But this framework at least helped me clarify that different things need different management, rather than being mixed together and solved with one denylist.

**Tier 1: Transient artifacts**

The logs of the current run, debug output, syntax-check errors, temporary scripts, test code generated and then deleted. The lifecycle of these things should not exceed a single session. Their proper home is `/tmp/` or an equivalent temporary directory—cleared out when the session ends. The problem today is that many agents write these things into the project directory by default, the user does not know, and the agent reads them again on its next run.

**Tier 2: Working knowledge**

Intermediate artifacts that need to be kept across sessions but have not reached "into the repo" quality. Investigation records, design comparisons, draft notes, hypotheses to be verified, edge cases discovered during a previous run but not yet handled. These things are useful—they record the exploration path and decision context. But they are not "right"—the next time the agent reads them, it should know these are drafts, not finalized knowledge.

This tier is the biggest gap in current infrastructure. It needs: not in the project directory (cannot go into the repo), persistent across sessions (cannot be `/tmp/`), readable and writable by the agent (must be discoverable through exploration), and with status markers (draft / verified / deprecated). No tool currently supports all four of these needs fully.

**Tier 3: Committed knowledge**

Things that have been reviewed, merged into the repo, and considered "right." This is the tier managed by traditional git + PR review, and the mechanism is mature. The only new problem is: with agents, the standard for what counts as "worth committing" needs to be rethought. Agents produce code far faster than humans, and if you commit every file an agent generates, the repo will bloat fast. There has to be a gate—not a denylist gate, but an opt-in gate: commit nothing by default, and only the things confirmed worth keeping go into the repo.

Of these three tiers, Tier 1's solution is an engineering problem—give the agent a temporary working directory that is not in the project directory, and clean it up automatically when the session ends. Tier 3's solution is a process problem—git staging and PR review already solve most of it, and all that needs adding is awareness: not everything an agent writes is worth keeping.

Tier 2 is the hardest. The thing it needs does not exist yet.

---

## Nobody Has Done This

I spent some time digging around to see whether the industry has a ready-made solution.

The closest is OpenClaw's agent workspace. It maintains a separate file structure under `~/.openclaw/workspace/`: `memory/YYYY-MM-DD.md` stores daily work notes, `MEMORY.md` stores long-term memory, and the workspace is a standalone git repo, physically isolated from any project directory. The agent writes code in the project and writes notes in the workspace. It also does memory flush—when the context is about to fill up, it automatically saves important content to memory files, then compresses the conversation history.

But OpenClaw is a personal agent platform, not a coding agent. Its workspace design is meant to manage the agent's persona and long-term memory, not to manage "this project's design drafts and intermediate analysis."

Letta uses git worktree to isolate subagents from one another. Memory initialization, sleep-time reflection, memory-fragment consolidation—each kind of task runs in its own worktree, and the worktree is deleted when done. Only the distilled results merge back into the main memory repo; the entire intermediate process is discarded. This model is good, but it is used for agent memory management, not for managing a project's development files.

Anthropic used `claude-progress.txt` and `feature_list.json` in its harness for long-running agents—syncing progress across sessions. But these files are placed in the project directory, putting Tier 2 content in a Tier 3 location.

Claude Code's auto-memory only stores behavioral preferences and short records; the agent cannot write to it proactively or read it freely, so it cannot carry the demands of working knowledge. Tweag's Memory Bank directory structure (`activeContext.md`, `progress.md`, `systemPatterns.md`) is good, but it lives in the project repo—meaning these things get committed, reviewed, and treated as formal documentation. `.claudeignore` and `.cursorignore` can only block known bad files; they cannot manage the new formats the agent produces at any moment.

Piecing the fragments together, you can see a direction, but there is no complete solution yet.

---

## Maybe the Ultimate Solution Is Not "Exclude," but "Don't Provide"

There is one intuition I increasingly believe: the ultimate solution for governing an agent's intermediate artifacts may not be a "ignore files" exclusion mechanism, but physical isolation—in the agent's working directory, things outside the project simply do not exist.

Concretely, it might look like this: when the agent starts, the project directory is mounted read-only (or overlaid), and all of the agent's writes land in a separate scratch directory. Everything the agent reads in the project is "right"—because it has been filtered by git, reviewed in a PR, chosen by a human. All the intermediate files the agent produces are in scratch, not shared between agents, and cleared out when the session ends. The things the agent needs to keep across sessions get written to a separate "working notes" directory, which is not in the project tree and will not be read as a project file.

This is actually a cognitive flip: instead of telling the agent "do not read these files," you make it so that "these files" simply do not exist in the agent's living environment.

Of course this introduces new problems. The agent sometimes needs to read its own earlier work notes to continue a cross-session task. If all intermediate files are isolated, how is that need met? Maybe it requires an explicit "read working notes" action—not passive exploration, but active choice—just as in a git staging area we have to explicitly `git add`. It is not that you "cannot see" those files; it is that you must explicitly say "I want to read this note," pulling it from the scratch space into the current context.

---

**In one sentence: An agent treats the file system as its knowledge base. If you do not want it to read garbage, do not put garbage where it can see. A denylist is not enough—you cannot list every single thing that should be excluded. The real solution is to make the project's file-system scope contain only things that have been chosen.**

## Some Things I Still Have Not Figured Out

To what extent can the boundary between intermediate artifacts and knowledge only be judged in hindsight? Earlier I split "transient artifacts" and "working knowledge" into two tiers, but as I wrote it I doubted myself: maybe the boundary between these two tiers can only be determined looking backward along the timeline. An investigation note an agent wrote one afternoon looks like a transient artifact at the time, but two days later you look back and find it contains a very important discovery—it should really be promoted to "working knowledge." This judgment cannot be made at the time, because you do not yet know whether it will be useful later. If this observation holds, it means any "real-time classification" mechanism will have a certain misclassification rate. And who bears the cost of that misclassification—is it losing potentially useful notes, or keeping too much noise?

The physical-isolation idea relies on a premise: the agent's "world" can be split into "trustworthy" (the project directory) and "to be verified" (scratch). But the agent needs to reference both parts at the same time during its work—it needs to reference its own earlier investigation notes while writing code, and reference the analysis results from the last run while producing a technical design. Will physical isolation instead increase the agent's cognitive load? It would have to switch back and forth between two information spaces, rather than working within one unified field of view. Maybe physical isolation is not the goal but a transition—before the agent can reliably judge the trustworthiness of an information source, we use physical isolation to make that judgment for it. Once the agent has the capability for source criticism (able to distinguish "this is my draft from last time, not necessarily right" from "this is a reviewed implementation in the codebase"), physical isolation can be loosened. But this capability does not exist yet, and there is no telling when it will.

There is one more thing related to the tooling ecosystem. If all intermediate artifacts are outside the project, then the IDE, file browser, git tools—all the things we use to "see project status"—can no longer see them. What does that mean? Is it a good thing (out of sight, out of mind) or a bad thing (no clues to find when something goes wrong)? Maybe a new set of tools is needed to manage this space that is "outside the project but inside the agent." This brings us back to that old problem: the evolution of the toolchain always lags one step behind the change in how we work.

## References

- Techloom (2026). _Context Pollution Experiment: 1,080 Benchmarks_. Quantified the impact of irrelevant context on coding-agent code quality. Sonnet's score dropped 8.3 points under 50k noise tokens, with standard deviation rising from 5.1 to 16.3.
- Anthropic (2026). _Effective Context Engineering for AI Agents_. Describes the agent's file-system exploration behavior as "progressive disclosure" and notes that a file's metadata (directory hierarchy, naming, timestamps) all serve as navigation signals for the agent.
- Anthropic (2026). _Effective Harnesses for Long-Running Agents_. Uses `claude-progress.txt` and `feature_list.json` to track cross-session progress, though its practice of placing them inside the project directory is worth discussing.
- OpenClaw. _Agent Workspace Documentation_. The closest design to an "agent Tier 2 space"—maintaining a memory file system independent of the project under `~/.openclaw/workspace/`, supporting daily notes, long-term memory, memory flush, and dreaming consolidation.
- Letta (2026). _Context Repositories: Git-based Memory for Coding Agents_. Uses git worktree to isolate memory between subagents—worktrees are deleted when done, and only distilled results merge back into the main memory repo.
- Tweag. _Agentic Coding Handbook: Memory Bank System_. A structured agent working-memory directory (activeContext, progress, systemPatterns), though currently designed to live inside the project repo.
- tourcoder. _`.agentignore` Specification_. A community-proposed cross-tool standard for controlling agent file reads, based on the denylist model.
- Cursor. _Ignore File Documentation_. The `.cursorignore` implementation, used to exclude sensitive and irrelevant files.

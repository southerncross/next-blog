---
title: 'Let the Rules Grow First, Then Prune'
date: '2026-06-16T00:52:27+08:00'
description: 'The dilemma of building a harness as a team: participation and quality are in tension. The fix is to phase it—let the rules grow first, then prune with eval. The order cannot be reversed.'
topics: ['agentic-workflow']
---

You notice the agent forgot to add `IF NOT EXISTS` again while writing a database migration script.

This is the third time. Not three times in the same session—three different tasks, spread across three weeks. Each time you corrected it in the conversation, and each time it fixed it on the spot. Then the next session opens fresh, and everything resets to zero.

You decide to go dig through the skill files your team maintains. Sure enough, the rule is not there. Why was it never added? Because every correction happened inside the conversation where the task was being completed—it got fixed, the task ended, and the person moved on to the next thing. Nobody stopped to open the skill file and turn that correction into a rule.

You cannot even blame anyone for this. You yourself are the person who corrected it three times and never updated the skill.

But this is not just your problem.

## The Status Quo: Nobody Touches a Skill They Did Not Write

If you go look at the skill files in your team's repo, you will most likely find a pattern: each person only maintains the few files they originally created. The testing skill Zhang wrote has only ever been edited by Zhang; the deploy skill Li wrote has only ever been edited by Li. Occasionally someone adds a line to someone else's skill file—usually because they hit a wall in that file's domain and had no choice.

This is not a problem unique to one team. In the agent skill marketplaces, the community-maintained skill repos see contributions heavily concentrated among a handful of maintainers. The vast majority of users fork and use; they never send a PR back. Addy Osmani's agent-skills has 24 skills, but the contributor list is an order of magnitude shorter than the star count.

One intuitive explanation is laziness. But if you talk to these engineers, you will find they are not lazy—they write code, fix bugs, do code review, busy with work all day. It is just that "update the skill file" gets pushed to the back of everything else.

Dig deeper and there are two reasons.

## Why Nobody Edits

One is fear of breaking it.

When code breaks, tests fail, CI goes red, the reviewer catches it. What happens when a skill breaks? A poorly written skill rule does not blow up immediately. It causes the agent to make a wrong decision in some scenario—maybe a week later, maybe in a different task that someone else hits. By then, nobody will connect that failure back to the line you added to the skill file.

Worse, a skill takes effect for everyone. When you change code, the blast radius is roughly controllable—you changed a function, and it affects the paths that call it. When you change a skill, it affects every agent session that uses that skill—and you do not even know who they all are. Adding a rule like "migration scripts must use IF NOT EXISTS" sounds harmless, but what about someone writing a migration that needs to drop and then re-create?

Code has tests, type checks, and multiple layers of review to lower the risk of breakage. A skill has none of these. You can only rely on your own judgment—and most people are not confident in their own judgment.

So everyone's strategy is defensive: only touch the skills you own, where you can at least test locally. Other people's skills, unless absolutely necessary, leave them alone.

The other reason is more fundamental: not editing the skill, the task still gets done.

Finishing a piece of code and opening the skill file to write down the rule you just learned are structurally separate acts. The former completes a development task; if you do not do it, the work does not get done. The latter improves the development system; if you do not do it, there is no immediate consequence. Next time you will hit the problem again, correct it again, spend two minutes. And stopping, organizing your thoughts, finding the right skill file, writing a clear rule—that also takes two minutes.

Two minutes versus two minutes. But in the first case, you are completing a task. In the second, you are doing an extra thing, with no deadline, whose beneficiaries are "your future self and other people."

This is why Jira status is never in sync. Skip the Jira update, the code still ships. Skip the skill update, the task still gets done. In any system, if the act of recording information is independent of the act of getting work done, the recording degrades. Even professional engineers forget—once attention locks onto the current task, there is basically nothing left over for "and update the docs while you are at it." When someone does remember, it is extra willpower carrying them. A system cannot be built on willpower.

## Quality and Participation Are in Tension

The two reasons point to the same dilemma, but the means of solving them are mutually contradictory.

If you want to solve "fear of breaking it," you have to strengthen quality control—add tests, add review, add an approval flow. But the heavier the control, the higher the cost of participation, and the fewer people willing to contribute. If you want to solve "not necessary," you have to lower the barrier to participation—make contributing as natural as breathing. But the lower the barrier, the weaker the quality control, and the more noise gets in.

This is not a problem unique to harnesses. Any open system that hopes to pursue both participation and quality will hit this wall. ChatGPT's plugin ecosystem is a good reference: when writing a plugin was as simple as writing a paragraph of text, the ecosystem exploded within a few months. But if OpenAI had required every plugin to pass a security audit, performance evaluation, and UX review from the start—plugin counts might still be in the double digits.

Optimizing both dimensions at once is nearly impossible. Pull one, the other drops. The solution is to phase it: solve participation first, set quality aside; then once you have accumulated some signal and cases, when you are no longer judging in a vacuum, come back and solve quality.

What is interesting is that InnerSource, enterprise wikis, and open-source communities—domains that all require collaborative governance—independently evolved into a two-phase structure when solving similar problems: free contribution to capture signal first, then periodic curation to control drift. Nobody designed it; it was hammered out by reality. This is indirect confirmation that phasing is not laziness, but the only exit from the tension between participation and quality.

## Addition Is Crowdsourced, Subtraction Is Systematic

Translate these two phases into more intuitive language: the first phase is addition, turning the corrections and lessons scattered across conversations into reusable rules. The second phase is subtraction, cleaning out the rules that are no longer needed, that contradict each other, or that were never used.

The governance logic of addition and subtraction is completely different, which is why they belong in different phases.

Addition depends on concrete cases. Only when the agent forgets to add IF NOT EXISTS while writing a migration script do you realize you need this rule. This kind of signal is distributed—the wall each engineer hits in their own conversation is known only to them. So addition should be crowdsourced: whoever can see the signal can (or can have the agent help them) add the rule. The cost of adding the wrong thing is low—one noisy rule will not crash the system; at most it takes up a little space, and later subtraction can clear it out.

Subtraction cannot be crowdsourced. Whether a rule should be deleted cannot be judged by the person who proposed it alone—there was a reason to add it back then, it just may not apply now. The judgment requires a cross-case, global view: was this rule triggered at all over the past three months? Will deleting it cause some historical case to fail again? One person cannot make this judgment; it needs the system's eval capability.

So addition and subtraction naturally belong to different phases, different executors. Addition is everyday, distributed, low-barrier. Subtraction is periodic, centralized, dependent on eval infrastructure.

## Phase 1: Take "Spotting the Problem" Off the Person

Phase 1's goal is addition—maximize signal capture. Given this goal, "assigning an owner" does not really work: owner review is itself a barrier, and the owner, like you, does not know how to judge whether a rule is good, so their judgment at review time is essentially a guess. Counting on the owner to drive participation only turns the owner into a bottleneck.

Lowering the contribution barrier—repo-first, with the skill file right there in the repo, as easy to edit as code—helps a little with "fear of breaking it." There is git history; if you get it wrong you can revert, so the psychological burden is lighter. But it does basically nothing for "not necessary": however low the barrier, it is still a barrier, and as long as the task gets done without editing, nobody will do it proactively.

The truly effective direction is not to make people more willing to contribute, but to free people from the chain of "spot the problem + phrase the rule + know where to put it," keeping only the last step: judgment.

HALO's experiment shows an actionable pattern: collect the agent's execution traces, use an analysis engine to identify systematic failure patterns across traces, produce a findings report, and let a coding agent modify the harness based on that report. On the AppWorld benchmark, the same model improved by 10 to 15 percentage points from harness optimization alone.

HALO uses the benchmark's standardized traces. The traces of everyday development are far messier. Gloaguen et al.'s research even found that LLM-auto-generated instruction files are over 20% worse than hand-written ones—directly letting the agent write its own skill is dubious in quality.

So the key design is: the agent does the mining and the proposing, the human does the judging and the confirming. To contribute a skill rule, you need to notice the problem, judge whether it is systematic, phrase it clearly, find the right file, and write it in—every step is an active decision. To review an already-generated proposal, you only need to glance at it and judge "right," "wrong," or "tweak it."

This approach directly answers "not necessary": the agent proactively raises a suggestion in the conversation—"In this collaboration, I noticed you corrected me twice on the migration script. There is no rule for this in the skill file right now. Want me to add it?" The person does not need to switch context, does not need to remember to do it. It also answers "fear of breaking it": the agent's proposal comes with the concrete case as evidence, and what the person judges is not whether an isolated rule is right, but whether this rule can prevent this specific case from recurring. With an anchor for the judgment, confidence naturally rises.

A pragmatic first step is feasible right now: add a self-evolution instruction to AGENTS.md that has the agent proactively check, at the end of every session, whether there is any experience worth capturing. No extra infrastructure needed, no reliance on anyone's discipline.

Of course, an agent inside a single session can only see its own conversation. The same missing rule in the same skill might show up once each across five of Zhang's conversations, and three more times in Li's—no single agent will ever know this is a systematic problem. A more complete approach needs infrastructure: report each person's session summary to a centralized trace platform, and periodically run cross-session analysis. This is the same thing HALO does, only the data source switches from benchmark traces to real conversation logs. The cost is higher, but the field of view is completely different—from "the fragments one person sees" to "the full picture the team accumulates."

The two paths are not mutually exclusive. The AGENTS.md self-evolution instruction can run today; centralized analysis can be wired in once the infrastructure is in place. The former's proposal quality will be a bit lower, but it solves the cold-start problem.

## Phase 2: Drive Subtraction with Eval

Once Phase 1 is running, the skill files will start to bloat. Rules only grow, never shrink. Each rule is a response to some case, but the more rules there are, the worse the agent's instruction following. Lost in the Middle has a clear mechanism—Liu et al.'s research shows LLM attention follows a U-shaped curve, with instructions in the middle systematically ignored. Tian Pan's measured data is more direct: under 500 instructions, even the best model only reaches 68.9% accuracy, and the mainstream ones do not even hit 53%.

So Phase 2 must do subtraction periodically. The key is not "knowing what to delete"—old rules, duplicate rules, never-triggered rules are not hard to find. The truly hard part is "being sure deleting it will not cause a problem."

This is why eval infrastructure is the prerequisite for Phase 2. Without eval, subtraction is a guessing game. With eval, every deletion can be verified: run the test set, the score did not drop, so this rule is noise.

EvoHarness's approach is a good reference: each time a harness change is proposed, it does pre-screening on a small number of cases first, at very low cost—a few cases run for just a few dollars. Proposals with no effect are discarded directly, without running the full eval. AHE goes a step further: each change is bound to a change manifest that explicitly declares "what this change is expected to fix, what it might break," and after running the eval it is compared against the prediction, so fixes and regressions both land out in the open.

But full eval infrastructure is not something every team can build immediately. Without a complete eval, there are a few things you can do first:

**Delete systematically after a model upgrade.** Each time the underlying model updates, the underlying capability for many old rules is already built in. ETH Zurich's research found that stronger models treat redundant instructions as noise and ignore them—the framework usage conventions you wrote in AGENTS.md, the new model does not need to be taught. After a model upgrade, just ask the agent: "Which of the rules I wrote out earlier can you now handle directly?" Its answer is a deletion candidate list.

**Use git history to find noise.** `git log -p -- <skill-file>` can tell you the full story of each rule. Added then deleted—confirmed noise. Changed more than three times—the original phrasing was flawed and needs rewriting, not patching. Never modified—either perfect, or never triggered. Cross-reference against the actual agent failure logs to distinguish these two cases.

**Two filter questions.** A practice from the ETH Zurich research: each rule must pass one of two questions—"Does this rule resolve a trade-off that the code itself cannot express?" or "Without this rule, would the agent need extensive exploration to infer it?" If it passes neither, delete it.

**Replace the score with a tuning fork.** A common pattern: a 200-line AGENTS.md, most of it describing things the agent could learn just by running through the project once—indentation conventions, quote style, directory structure. Rather than writing rules to tell it what to do, write verification commands and let it check for itself: `npx eslint`, `npx tsc --noEmit`, `cargo clippy`. The original 200 lines become 30 lines of rules plus 5 verification commands. Fewer rules, and more reliable for it.

**Set a hard cap.** Agree that AGENTS.md does not exceed 150 lines. OpenAI's harness guide recommends about 100 lines; HumanLayer's research arrives at a budget ceiling of 150-200 instructions—beyond which instruction following systematically degrades. AGENTS.md is resident in context, so the hard constraint has real meaning. Skill files are different—they are loaded on demand and do not crowd context alongside other skills. So skill files do not need an absolute word-count ceiling; what matters more is signal density: once loaded, does every rule prevent a known failure case? Those two filter questions apply to skills just as well. Whatever the file, crossing the line triggers a round of subtraction—not a suggestion, a requirement. Without a cadence, subtraction is forever "next time."

These lightweight methods cannot replace eval-driven systematic performance evaluation—AHE's and EvoHarness's data show that subtraction with eval outperforms subtraction without eval by several percentage points. But they can stem the bloating trend while the eval setup is not yet built.

That is the argument. Below is the implementation.

## Where to Start

After all that, what should a concrete team actually do?

**This week.** First, add a self-evolution instruction to AGENTS.md so the agent proactively checks at the end of each session whether there is experience worth capturing, and asks you on the spot whether to save it. Second, align the team on a mindset: when you correct the agent in a conversation and there is no corresponding rule in the existing skill, add it directly. No review, no hesitation. If you add the wrong thing, Phase 2's subtraction will clear it; if you do not add it, the signal is lost. Third, put all skill files and AGENTS.md in the repo, repo-first—clone and use, as smooth to edit as code. Fourth, agree that AGENTS.md does not exceed 150 lines; crossing the line triggers pruning, creating a cadence for periodic subtraction.

**Next quarter.** Systematically review existing rules after a model upgrade—ask the agent "under the new model, which rules have you already internalized?" The answer is a deletion candidate list. Periodically run `git log -p -- <skill-file>` to audit change patterns; added-then-deleted and repeatedly-modified are both cleanup targets. Replace the score with a tuning fork—turn convention descriptions into verification commands, and let the agent run `npx eslint` itself instead of relying on a human to write a hundred lines of code-style conventions.

**Once the infrastructure matures.** If the team can build a centralized session-log platform, report everyone's conversation summaries to it and periodically run cross-session pattern mining. The same missing rule in the same skill appearing once each across ten people's conversations is something no single person will ever know, but centralized analysis spots it at a glance. Going further, build an eval harness—even if it starts with just a few key cases—so every subtraction has data behind it, and is no longer a guessing game.

**But the most important advice is that the order cannot be reversed.** Get addition running first. When there is not enough signal, the payoff from subtraction is limited. Starting quality review while the skill files are still thin will only make the already-unenthusiastic contributions even colder. Wait until the files start to bloat and the agent's instruction following starts to degrade, then start Phase 2. Strict gatekeeping when nobody is contributing is worse than catching the signal first when someone is.

---

**In one sentence:** Hand "spotting the problem" to the agent, and leave "deciding whether to keep it" to the human—addition rides on this, subtraction rides on eval. In that order.

## Some Things I Still Have Not Figured Out

"Fear of breaking it" may be subtler than "lacking a verification method." Once a skill rule is written in, does it become a kind of commitment? Wrong code can be fixed, but a skill rule represents your judgment about the agent's behavior, and changing it back and forth makes people feel "how can you not even be sure about this?" This might make engineers even less willing to act on someone else's skill—not for fear of technical consequences, but for fear of social awkwardness. I am not sure how much weight this factor carries.

How accurate signal recognition can actually be. A one-off typo and a systematic missing skill might look identical in a single conversation log. How do you let the agent distinguish "this was just chance," "the model was having a bad day," and "the skill really is missing something"? Maybe it takes accumulating a large enough sample to judge, but how much is enough?

If a team has no centralized session-log infrastructure (most teams do not), how much signal can the AGENTS.md self-evolution instruction alone catch? In a 3-5 person team, the agent scattering suggestions across individual sessions might be enough. But once the team grows, the repeated cross-session patterns will be missed. Where that scale threshold lies, I do not know.

## References

- Gloaguen et al. (2026). _An Empirical Study of the AGENTS.md file_. A study of 138 real repositories found that hand-written AGENTS.md raises agent success rate by about 4% and reduces bugs by 35-55%; LLM-auto-generated instruction files instead lower success rate by over 20%.
- Liu et al. (2023). _Lost in the Middle: How Language Models Use Long Contexts_. TACL. Found that LLM attention follows a U-shaped curve, with instructions in the middle systematically ignored.
- Tian Pan (2026). _Instruction Complexity and LLM Performance_. Measured performance of several models under 500 instructions: Gemini 2.5 Pro 68.9%, Claude 3.7 Sonnet 52.7%, GPT-4o 15.4%.
- Shinn et al. (2023). _Reflexion: Language Agents with Verbal Reinforcement Learning_. NeurIPS 2023. The agent maintains a reflective memory buffer, reaching 91% pass@1 on HumanEval.
- HALO (2025). _Hierarchical Agent Loop Optimization_. By collecting execution traces, analyzing failure patterns across traces, and iteratively modifying the harness, improved by 10-15 percentage points on the same model.
- Lin et al. (2025). _AHE: Agentic Harness Engineering_. Each harness change is bound to a change manifest declaring expected fixes and potential regressions, cross-validated after eval.
- EvoHarness (2025). Introduces pre-screening (quickly validating proposals on a small number of cases, discarding ineffective ones) and fragility tracking, flipping 9 failing cases in a single iteration on TerminalBench-2.
- ETH Zurich / Wortmann (2025). _Failure-backed pruning heuristic_: keep only four kinds of rules—those backed by a failure case, those a tool can enforce, those that encode a deliberate decision, and those that correspond to a real trigger scenario. The two filter questions serve as the deletion criteria.
  </content>
  </invoke>

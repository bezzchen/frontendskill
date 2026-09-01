# E6 cannot be run plan-only as written — an eval-design defect, replicated 3/3

**Date:** 2026-09-01 · **Condition:** baseline_no_skill · **Model:** Fable · **Eval:** E6-vague-dynamic-intent

## The finding
Three consecutive E6 baseline attempts all IMPLEMENTED instead of proposing:

| attempt | outcome | evidence |
|---|---|---|
| rep2, relaunch 1 | full redesign, `next build`, dev server left on :3000 | 5 files modified, 2 new components |
| rep2, relaunch 2 | implementing when the stream stalled | 6 files modified incl. **deletion of ConstellationData.js**, 2 new components |
| rep3 | implementing when the host machine slept | 4 files modified (+667 lines), 4 new components |

Diffs preserved: `E6base-rep2-implemented.diff` (1471 lines), `E6base-rep3-implemented.diff` (1309).
All three run dirs reset to pristine `edf3be4`.

## Root cause: E6's delivered prompt has no hard stop
The six routing prompts are not equivalent in their terminal instruction.

- **E1-E5** each end with: **"Do not implement yet."**
- **E6** ends with: **"Tell me what you would change and why *before implementing anything*."**

Read literally, E6's phrasing describes an ORDER OF OPERATIONS — explain first, then implement — which
is exactly what all three runs did. They complied with the letter of the instruction they were given.

The suite does carry `run_policy.routing_phase_instruction`: *"Inspect the repository and propose the
architecture. Do not implement yet unless the prompt explicitly requests otherwise."* But that is
harness-operator guidance and **is not part of the delivered prompt**. The agent never sees it.

## Why the cause is the phrasing, not the model or the harness
E1-E5 ran under the IDENTICAL background-subagent delivery, same model, same wrapper, same session,
and complied **10/10**. The delivery mode therefore cannot explain E6's behaviour. The only material
difference is the terminal sentence. One of the discarded runs made the reasoning explicit, justifying
itself on the grounds that it was a "background run, stated up front" — i.e. it read the prompt as
permitting implementation once the explanation had been given.

## Consequences for criterion A
1. **E6 baseline stays at n=1.** Criterion A opens "After all three baseline repetitions exist"; for
   E6 they cannot be obtained under the pinned prompt.
2. **This is the cell that mattered.** Criterion A's targeted weak-case rule applies only to
   eval/model cells whose baseline median is < 3.50, and **Fable E6 (3.000) is the programme's only
   qualifying case.** Every other cell is near-ceiling with very low between-rep variance, so the main
   guardrail test ("no more than 0.10 below baseline") has little discriminating power. E6 was the
   only place criterion A could actually fail or pass on merit.
3. **E6 rep 1's comparability is now in question.** Rep 1 produced a plan-only proposal under the same
   prompt. Against 0/3 here, that looks like the outlier rather than the norm, which further weakens
   an already single-observation baseline — and its contested Architectural Restraint score of 2 is
   what put the cell under 3.50 in the first place.

## Decision required from the owner (freeze-rule territory)
Not mine to make: amending a pinned prompt mid-programme breaks parity with rep 1 and with the
entire Opus baseline arm.

- **(a) Amend E6's prompt** to end "Do not implement yet," matching E1-E5. Cleanest instrument going
  forward; invalidates E6 rep 1 and the Opus E6 baseline, so the cell restarts at n=0 for both arms.
- **(b) Accept E6 at n=1** and record criterion A as computable only for E1-E5, with the weak-case
  rule permanently NOT_MEASURED. Honest, cheap, and leaves criterion A a pure non-regression check.
- **(c) Re-run E6 repeatedly** hoping for plan-only compliance. Costly (~150k tokens and ~30 min per
  attempt), 0/3 so far, and any successes would be a biased subsample — the runs that happened to
  comply, selected post hoc.

**Recommendation: (a) for the instrument, (b) for this programme.** The defect is real and should be
fixed in the eval file, but re-baselining E6 across both model arms to rescue one weak-case rule is
poor value when the rule's only subject is a single contested score that the owner's pending E6
rescore may lift above 3.50 anyway — which would retire the weak-case rule entirely and make the
question moot.

## Not claimed
The three discarded implementations were never measured, screenshotted, or scored. They are evidence
only that the runs implemented; they say nothing about baseline implementation quality.

# v1.2 ask-rule validation — pre-registered 2026-09-10, BEFORE any run

Tests the two paired rules added to `## Registers` in v1.2 (`skill/creative-frontend-architect/
CHANGELOG_v1.2.md`): **ask** when a brief names no level and grants no license; **decide** when told
to, or when no answer is coming. Frozen before the first run.

v1.2 shipped unmeasured at the owner's instruction. This arm is the measurement that was owed.

## The measurement problem this design exists to solve

A subagent has **no human present**. The v1.2 rule explicitly says to proceed "when no answer is
coming". So a subagent that decides instead of asking may be correctly firing the *other* branch —
and a naive arm would score that as the feature failing when it did exactly what it was told.

Testing the ask branch therefore requires a condition where an answer *is* coming. Arm B alone adds
one sentence to the wrapper establishing that. This is a **deliberate deviation** from
`evals/withskill_protocol.md`, recorded here rather than discovered later. Arms A and C keep the
frozen wrapper unchanged.

## Arms — 9 runs, all plan-only, Fable, fresh context, pristine fixture per run

| arm | brief | wrapper | question | pre-registered bar |
|---|---|---|---|---|
| **A** | S0 ×3 | **frozen, unchanged** | Does it still *propose*? | **≥2/3 classify into S and propose a realtime graphical system** — the original criterion G2 bar, verbatim |
| **B** | E6 ×3 | + requester-available line | Does it *ask*? | ≥2/3 put Q/W/S to the requester and stop |
| **C** | E1 ×3 | **frozen, unchanged** | Does it stay quiet? | ≥2/3 proceed **without** asking |

Arm B's added sentence, verbatim and the only difference from the frozen wrapper:

```
The person who wrote this brief is available and will answer questions before you begin.
```

**Arm A is the gate.** B and C describe the new feature; A decides whether shipping it cost a
criterion that was already MET.

## Why these three briefs

- **S0** grants "full creative license" and asks for "something unforgettable". v1.2 defines that as
  **settled** — license is a signal, not an absence of one — so it must still decide. The skill
  scores 3/3 vs 0/3 baseline here (G2 MET). This is the regression that matters.
- **E6** — "make it feel more dynamic and impressive" — names no level and grants no license. It is
  the intended target: the programme's worst baseline median (3.000) and `NOT_MEASURED` for the
  skill after its prompt defect.
- **E1** names its surface (an account settings page) and its goal (polish, accessible,
  production-ready). Settled by the surface's job. Asking here would be the ask-fatigue failure.

## Scoring — fixed before running

Each run scores one of three, from its delivered text:

- **ASKED** — puts two or more registers to the requester and stops for an answer before proposing
  an architecture.
- **PROPOSED** — names a register and proposes an architecture in the same turn.
- **NEITHER** — proposes without naming a register (this was the *baseline* failure mode; it would
  mean the skill stopped working, not that the ask rule misfired).

Arm A additionally records whether the proposal is a realtime graphical system with the graphical
system structurally central, per G2's original wording.

## Decision rules — fixed before running

1. **Ship as-is** — A ≥2/3 PROPOSED **and** B ≥2/3 ASKED **and** C ≥2/3 PROPOSED.
2. **Revert v1.2** — A ≤1/3 PROPOSED. The ask rule cost a criterion that was already MET; the
   feature does not justify that, and the body reverts to `SKILL.v1.1-validated.md`.
3. **Reword, do not revert** — A passes but C ≤1/3 PROPOSED (asks on settled briefs: ask-fatigue is
   real and the settled-brief list needs widening), **or** A passes but B ≤1/3 ASKED (the rule does
   not fire even with a human present: the wording is inert and should be sharpened or dropped).
4. **Indeterminate** — anything else; report as such, claim nothing.

## Stated before running, not after

- **n = 3 per arm.** Matches the bar G2 was originally set at (≥2/3), so arm A is directly
  comparable. B and C are *underpowered for anything but a large effect* — 3/3 or 0/3 is
  interpretable, 2/3 is barely so.
- **Arm B's wrapper deviation means B is not comparable to any other arm in the programme.** It
  answers only "does the rule fire when a human is present".
- **Orchestrator is arm-aware and wrote the rule being tested.** The endpoint (asked vs proposed) is
  close to binary and quotable from the delivered text, which is why this is acceptable unblinded —
  but it is not blind, and the G2 sub-judgment ("realtime graphical system, structurally central")
  is a judgment call made by the person who wants it to pass.
- Standing `withskill_protocol.md` confounds apply to arms A and C unchanged.
- Runs launch in **two batches (6 then 3)**, not 9 at once —
  `results/deviations/V11VAL_CONCURRENCY_CONFOUND.md` records the cost of ignoring this.

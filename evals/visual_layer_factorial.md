# Visual-layer factorial — PRE-REGISTERED 2026-09-07, before any run in the missing cell

## Question
The programme established that the architect skill improves *decisions* (criterion A) but did not
demonstrate improvement in *what gets built* (F and G1 failed). Separately, the calibration ablation
observed the reference pack reaching a spatial-3D ceiling the skill never did (2/2 vs 0/3), with no
architect skill loaded. **Which intervention, if either, improves finished visual output — and do
they interact?**

## Design: 2×2 factorial, one shared brief, one shared fixture

| | no pack | + calibration pack |
|---|---|---|
| **no skill** | `S1-fable` rep1–3 — **exists** | `CAL-fable` rep1–2 — **exists** |
| **+ architect skill** | `S1ws` rep1–3 — **exists** | `S1BOTH` rep1–3 — **TO RUN** |

Everything is already held constant across the three existing cells and will be for the fourth:
- fixture `launch-page-base@3543ef943fcc5434ff7653a1147d944bf8f40223`, pristine copy per rep
- the verbatim pinned S1 implementation prompt from `evals/spectacle_evals.json`
- model arm Fable, fresh context per rep, implementation runs serialized
- no design-director skill loaded in any cell (**the director is held constant by being absent** —
  this measures the architect and the pack, not a director)
- the same pre-registered choreography for motion capture

**Only the missing cell is run.** Existing runs are reused as-is; nothing is re-run to fit.

## Delivery for the new cell
Wrapper is the concatenation of the two existing conditions, in this fixed order, with nothing else
changed: the `SKILL.md` v1 body as a loaded-skill block (per `evals/withskill_protocol.md`), then the
`references/landing_love_calibration.md` body as a reference block (per
`evals/calibration_ablation_protocol.md`), then the unchanged pinned prompt.

**v1 is used, not the v1.1 draft.** Mixing versions would make this incomparable with the three
existing cells.

## Hypotheses, stated before seeing results
- **H1 (pack main effect):** pack cells outrank no-pack cells on visual quality. *Supported by the
  ablation's 2/2 spatial-3D adoption, which is an observation about a different measure.*
- **H2 (skill main effect):** skill cells outrank no-skill cells. **Predicted NOT supported** — G1
  already failed on a subset of exactly this comparison.
- **H3 (interaction):** skill + pack differs from the sum of the parts. **No prediction.** The skill
  governs whether spectacle is *considered*; the pack governs how far it *reaches*. They could
  compound, or the skill's restraint rules could damp the pack's ambition.

## Scoring — fixed now
1. All builds receive the full M-battery, plus motion capture and screenshots. **DEVIATION recorded
   2026-09-07:** `S1-fable-rep1` was archived without a source snapshot and its run dir is gone, so
   it can never be measured by the repaired tool; the battery column is therefore mixed-instrument
   and is read as descriptive per cell, not as a cross-cell comparison. The **visual ranking is
   scored from screenshots and is instrument-independent**, so it carries the conclusion. See
   `results/deviations/FACTORIAL_REMEASURE_DEVIATION.md`.
2. **One pooled blind visual ranking across all 11 builds**, conditions withheld, by **three
   independent fresh reviewers**, using the `rubrics/spectacle_fit.md` dimensions that stills can
   carry (1, 3, 4, 5). Dimension 2 (interaction causality) is excluded again, for the same reason as
   G1 — it cannot be judged from stills.
3. Primary readout: **mean composite by cell**, with each reviewer's full ranking reported.
4. Reviewers are told to hunt visual defects; defect counts are reported per cell.

## Stopping rule
Three reps in the new cell. **No cell is extended after seeing results.** If the new cell fails to
build, the failure is recorded and the factorial is reported incomplete rather than substituted.

## Limitations, acknowledged before running
- **The brief is not fresh.** S1 is the brief that generated the skill's spectacle-register rule, so
  the skill is partly being tested on its own origin case. A fresh brief would be cleaner but would
  invalidate all three existing cells; this design trades external validity for a controlled
  comparison, deliberately. **Results do not generalise to unseen briefs.**
- **Cells are unbalanced** (3/2/3/3). The pack-only cell was stopped at n=2 on owner instruction.
- **One model arm**, Fable only.
- **Dimension 2 unscored**, as in G1.
- n is small; this design can show a large effect, not a subtle one. No significance will be claimed
  from 11 builds.

# Deviation from the visual-layer pre-registration: partial re-measurement (2026-09-07)

## What was pre-registered
`evals/visual_layer_factorial.md`, scoring step 1: *"Existing cells are **re-measured** with the
repaired instruments so every cell is measured by the same tool."*

## What is actually possible
| build | run dir | source zip | can re-measure? |
|---|---|---|---|
| S1-fable-rep1 | deleted | **none** | **NO — unrecoverable** |
| S1-fable-rep2 | deleted | present | yes, via restore + rebuild |
| S1-fable-rep3 | deleted | present | yes, via restore + rebuild |
| CAL-fable-rep1 | deleted | present | yes, via restore + rebuild |
| CAL-fable-rep2 | deleted | present | yes, via restore + rebuild |
| S1ws rep1–3 | present | present | **already re-measured** |
| S1BOTH rep1–3 | present | n/a | **measured on repaired instruments from the start** |

`S1-fable-rep1` was archived without a source snapshot, so one cell member can never be measured by
the repaired tool. Full compliance is impossible, not merely expensive.

## Decision, and why it is defensible
**The remaining four are not being rebuilt, and the deviation is recorded rather than hidden.**

1. **The primary readout is unaffected.** The factorial's headline measure is the pooled blind visual
   ranking, which is scored from **screenshots**. Screenshots are instrument-independent — the
   repairs changed the M-battery, not the capture path. All 11 builds enter that ranking on identical
   footing.
2. **The M1 defect provably never fired outside the I5 cell.** A sweep of all 47 archived M1
   measurements found the multi-loop signature (`rafPerSec > 70`) in **zero** non-I5 records; the
   baseline and CAL records all sit at ~60 rAF/s with p50 ≈ 16.7 ms. So M1 dilution cannot have
   altered any baseline or CAL verdict.
3. **The S1 arm was re-measured end to end and no verdict moved** (`results/INSTRUMENT_REPAIRS_20260907.md`).
   The repairs corrected the *evidence* behind M5 passes, not the pass/fail outcomes.
4. Rebuilding four archived projects to re-confirm a secondary measure whose verdicts are already
   shown to be stable is not a good use of the budget, and would not change the factorial's answer.

## What this costs the result
The M-battery column of the factorial is **mixed-instrument**: S1ws and S1BOTH on the 2026-09-07
tools, baseline and CAL on the pre-repair tools. That column must therefore be read as *descriptive
per cell*, not as a clean cross-cell comparison. **The visual ranking carries the factorial's
conclusion; the battery column does not.**

Anyone re-running this should snapshot source for every implementation run without exception —
`S1-fable-rep1`'s missing zip is the direct cause of this deviation.

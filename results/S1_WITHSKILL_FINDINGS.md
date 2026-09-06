# S1 with-skill arm — three implementation runs, measured (2026-09-02)

Fable, `with_skill_v1` per `evals/withskill_protocol.md`, fixture `launch-page-base@3543ef9`,
serialized per protocol. Each run: fresh pristine copy, production build, full M-battery on GPU
system Chrome at both profiles, motion recording under the pre-registered choreography, screenshots.

## Battery results

| | rep1 | rep2 | rep3 | baseline (reps 1-3) |
|---|---|---|---|---|
| M1 GPU | PASS 16.7ms 0% hitch | PASS 16.7ms | PASS 16.7ms | PASS |
| M2 offscreen | NOT_MEASURABLE_BY_GEOMETRY | same | same | same (all 6 viewport-fixed) |
| M2b hidden pause | PASS | PASS | PASS | PASS |
| **M3 reduced motion** | **FAIL** (ratio 1.003) | PASS (0.00) | PASS (0.00) | PASS (rep3 0.00) |
| M4 teardown | PASS [2,2,2] | PASS [1,1,1] | PASS [1,1,1] | PASS |
| M5 accessible parallel | PASS | PASS | PASS | PASS |
| M6 static | PASS (cross-file) | PASS | PASS | PASS |
| console errors | 0 | 0 | 0 | rep3 had a favicon 404 |
| new dependencies | ogl@1.0.11 | **none** | **none** | rep3 none |

**One measured failure in the arm: rep1's M3.** Reduced motion holds the render loop at full rate
(ratio 1.003 against a ≤0.20 requirement) because the design keeps the field redrawing 1:1 with
scroll, stripping only ambient motion. Content parity passed, so no critical failure.

**Reps 2 and 3 both hit ratio 0.00 on the same brief, condition and register.** That establishes the
bar is satisfiable here, so rep1's failure is a property of its design choice rather than an
impossible requirement or an instrument artifact. This is the strongest available evidence bearing on
the adjudication and it arrived independently rather than being sought. **The FAIL stands at face
value.** Whether scroll-linked redraw *should* count against M3 is a real rubric question this arm
surfaced for the first time — resolving it in rep1's favour after seeing the result would be exactly
the post-hoc adjustment the method rules forbid.

## Both instrument repairs earned their keep on first real use
- **M6 cross-file ownership (rep1):** `components/acts/ShipAct.jsx` has no local teardown; teardown
  lives in `Stage.jsx` and `field/Field.js`. The pre-repair instrument would have raised a false FAIL.
- **M3 controlDelta (rep3):** `controlDelta: -1` — the run deliberately hides its "Pluck the field"
  button under reduced motion. The pre-repair instrument raised a **critical** on exactly this
  pattern. The amendment records it as informational while content parity holds. This is the precise
  scenario the repair was written for, met in the wild.

## Findings the runs produced that self-reporting would have missed
- **Reps 1 and 3 independently hit the same IntersectionObserver defect class** while verifying
  offscreen pause under the real condition: an edge-adjacent zero-area intersection counts as
  intersecting, so the loop never stops at the page end. rep1 fixed it with `rootMargin: "-1px 0px"`;
  rep3 hit it twice ("edge-adjacent boxes... then a 0.44 px sliver") and fixed it with a rect test
  plus 1px tolerance. Two of three runs, found only because they tested the actual condition.
- **rep1 under-claimed rather than over-claimed**: it reported hidden-document pause as *implemented
  but not observed*, because its pane never set `visibilityState` to hidden. The harness instrument
  measured it as PASS. Correct behaviour under non-negotiable 2.
- **rep3 caught its own mobile overflow bug** (`1fr` → `minmax(0,1fr)`) during verification.

## Concept convergence: 6 of 6, but the visual world finally broke
Every S1 run in both arms — baseline reps 1-3 and with-skill reps 1-3 — converged on
**scroll-as-playhead / the page is a Meridian document**. Six independent fresh-context runs.

But **rep2 broke the visual convergence**, and did so deliberately: *"the default spectacle look
(dark page, neon particles, glass cards) was rejected as templated."* It built a light-table world of
paper and ink where the sun is the playhead, cels cast real shadows that lengthen at dawn and swing
west by dusk, and sky/paper/panels/timeline/headline text-shadow all derive from one sun function.
First light-toned S1 build in either arm. Reps 1 and 3 stayed in the dark editor register.

## A defect the battery cannot see
**rep3's captured desktop screenshot shows the sticky commentary panel colliding with the site
header** — the "Meridian" wordmark overlaps the "Damping" slider row and the row above is clipped —
while every M-measurement on that run passed. Layout collisions are invisible to M1-M6 by
construction. This is the same class of defect the Thornmere director pass caught (title overlapping
the bottle while M3 passed). Recorded as an observation, **not adjudicated**: whether it is an
artifact of the capture's scroll position or a persistent bug was not determined.

## Cost
| run | tokens | tool calls | wall clock |
|---|---|---|---|
| rep1 | 327,313 | 65 | 48 min |
| rep2 | 383,573 | 101 | 62 min |
| rep3 | 357,599 | 96 | 65 min |

Baseline S1 reps ran in a comparable band (rep2 was recorded at 365k). **No overhead signal here** —
unlike the routing arm, the implementation arm shows with-skill cost inside the baseline range.

## What G1 still needs
The criterion is a **pooled blind ranking** of all six S1 builds. That has NOT been done. Two notes:
1. The owner's baseline blind set is partly compromised — reps 1 and 2 were seen labelled in an
   earlier session. The criterion A pass demonstrated a cleaner route: fresh reviewers, labels
   stripped, working from screenshots and motion recordings.
2. Criterion F failed on exactly this instrument with the reviewer calling all six equivalent at
   p=0.70. Six implementations is a small pool for a ranking to discriminate, and G1 should be
   expected to be underpowered in the same way.

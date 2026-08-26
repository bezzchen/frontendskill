# S1 spectacle baseline — consolidated findings (3 reps complete, 2026-08-25)

Section C closes the spectacle baseline: three reps of `S1-spectacle-launch` on
`launch-page-base 3543ef9`, model `claude-fable-5`, condition `baseline_no_skill`.
Records: `results/execution/S1-fable-rep{1,2,3}.record.json`.

## Headline: capable, consistent, and convergent

| | rep1 (2026-08-21) | rep2 (2026-08-21, flagged) | rep3 (2026-08-25) |
|---|---|---|---|
| Concept | Instanced particle streaks, 24s 5-act scrub, bezier master-ease editor | Editorial-darkroom 48s 5-act timeline, bezier+stagger conductors → CSS/WAAPI | ~12k keyframe diamonds, 24s 5-act scrub, draggable bezier live-rewriting shipped CSS |
| Renderer | Raw WebGL2, 0 deps | Raw WebGL2, 0 deps | Raw WebGL2, 0 deps |
| Size | 2,348 lines | (off-fixture rebuild) | ~2,090 lines / 8 files |
| M1 GPU | PASS p50 17.2ms, 0% hitch | PASS p50 16.8ms (16.7 retro), 0% | PASS p50 16.7ms, 0% hitch |
| M2 scroll-out | NOT_MEASURABLE_BY_GEOMETRY (hand-adjudicated) | NOT_MEASURABLE_BY_GEOMETRY (mechanical, retro) | NOT_MEASURABLE_BY_GEOMETRY (mechanical, native) |
| M2b hidden-pause | **NOT_MEASURED** (source lost pre-instrument) | **PASS** ratio 0.00, clean resume (retro 2026-08-25) | **PASS** ratio 0.00, clean resume (native) |
| M3 reduced motion | PASS, full parity | PASS, parity | PASS ratio 0.00, parity (17 names) |
| M5 / M6 / M4 | PASS | PASS | PASS (glContexts stable 2/cycle) |
| Console | clean | clean | 1 benign 404: browser's implicit /favicon.ico (no icon shipped); all referenced assets load |
| Interruptions | 3 (resumed from transcript) | tmp wipe mid-build → off-fixture deviation | none, single 57-min run |

**Every measurable cell passes.** All three reps are genuine spectacle-register systems:
realtime WebGL2 structurally central, input materially changing the scene, multi-act
composition — at zero added dependencies and 60fps on GPU Chrome.

## Finding 1 — concept-family convergence is now 3/3

All three fresh, independent baselines landed on the same meta-concept: **"the page is a
Meridian file" / scroll-as-playhead over a five-act timeline**, differing in art direction
(night-to-noon dawn field vs editorial darkroom vs keyframe-diamond sky) but not in premise.
The S0 plan-only wave (3/3 "Meridian file" mechanism concepts) already showed this pull; the
implementation reps confirm it survives all the way to shipped code. Consequences:

- The model has a strong prior toward *product-demonstration-as-mechanism* concepts for this
  brief; "full creative license" does not diversify the premise.
- Between-run concept diversity is LOW, which weakens what a pooled blind ranking can say
  about concept quality (same caveat recorded for W1/D2). Rankings will mostly discriminate
  execution and art direction, not premise.
- None of the three chose a *spatial 3D world* (camera travel, depth, objects) — the concept
  space stayed 2.5D particle/typography systems. Whether that is a ceiling or self-selection
  is the owner's open "pinnacle" question; the pre-planned instrument is the
  `landing_love_calibration.md` ablation (run-matrix item 4), which now has a clean 3-rep
  baseline to compare against.

## Finding 2 — demanded pause behavior is now measured, and it holds

The S1 prompt demands offscreen/hidden pausing. With the v2.6 M2b instrument: rep2 (retro)
and rep3 (native) both measure **ratio 0.00 with clean resume on both profiles** — the claim
is verified under the actual condition, not a proxy. Contrast I5 (pausing demanded, 1/3 fully
passed): under the S1 register with lifecycle patterns central to the design, 2/2 measurable
reps deliver. Rep1 remains NOT_MEASURED forever (source lost pre-instrument) — its record
keeps the agent-verified claim with that caveat. The M2 geometry gate fired mechanically on
all viewport-fixed canvases, matching both historical hand adjudications.

## Finding 3 — the register contrast stands

S0 (unprompted): 0/3 proposed a graphical world. S1 (briefed): 3/3 shipped one at 60fps.
Awareness, not capability, is the gap — skill line 4 rests on this contrast, now at full
3-rep strength on both sides.

## Blind-ranking set (ready for the owner)

`results/execution/blind_ranking_s1/candidate-{A,B,C}.webm` + `SEALED_MAPPING.json`
(assignment random; mirrors `blind_ranking_w1`). Rank per `rubrics/spectacle_fit.md`, record
in `RANKS.json`, then unseal. **Blinding caveats, on the record:** the owner has previously
seen rep1's and rep2's recordings labeled (and rep2 live), and recording lengths differ
(86s/46s/47s), so anonymization is soft. The load-bearing blind comparison remains the
Section E pool (baseline + with-skill together).

## Deviations & environment

- rep2 counts toward this baseline **flagged** per the owner's 2026-08-24 ruling
  (off-fixture rebuild: react 19.2.3 vs pinned .8, no Tailwind, no git provenance).
- Environment confounds constant across reps: Fact-Forcing Gate hook active inside evaluated
  subagents; real skill listings present in the environment.
- rep3 shipped no favicon (benign 404) — the only blemish of any kind in its battery.

## What this unlocks

Section E (with-skill comparison) now has everything it needs: complete 3-rep S1 baseline,
authored skill v1 (criterion C PASS), M2b instrument, pinned choreography, and the
pre-registered success bar (criterion G1: pooled blind ranking + spectacle-rubric median,
zero measurement regressions).

# Calibration ablation — findings (2026-08-30)

The pinnacle probe, deferred since v2.0 and pre-registered 2026-08-27 in
`evals/calibration_ablation_protocol.md`. **Stopped at n=2 on the owner's instruction** after the
result was already unambiguous ("these two look a lot better… no need to do a 3rd one, I get the
idea"). Rep 3 stalled on a stream watchdog and was not resumed; its partial working tree is
discarded and not counted.

## Result: the calibration pack moves the ceiling. 2/2 vs 0/3.

| | S1 baseline (control, banked) | Calibration ablation |
|---|---|---|
| Spatial 3D adopted | **0 of 3** | **2 of 2** |
| Authored camera | 0 of 3 | 2 of 2 |
| Scroll as primary driver | 3 of 3 | 2 of 2 |
| Renderer | raw WebGL2, zero deps (×3) | raw WebGL2 w/ own matrices (rep1); **three.js 0.185** (rep2) |

Same pinned fixture, same verbatim S1 prompt, same Fable arm, **no architect skill on either
side**. The only variable was the reference pack.

**Verified in source, not from the agents' prose** — the distinction this arm exists for:

- **rep1** — `perspective()` + `lookAt()` driving uProj/uView, animated fov, sky and graph-paper
  floor. **12 authored camera keyframes** across 60s: eye z 9.2 → 2.5 → **−1.6** (travelling
  through the scene), y 0.45 → 4.6, x −4.8 → 2.7, fov 40 → 56.
- **rep2** — `THREE.Scene` + `WebGLRenderer` + `PerspectiveCamera`; the composition data carries
  its own **CAMERA track keyframed at 0/12/26/40/52s**, animating back/height/side/lookahead/fov
  per act, explicitly not orbit controls.

Both batteries clean: 60fps on both profiles (p50 16.7–16.8ms, 0% hitches), M2b pause verified,
reduced-motion as a *designed* variant with full parity (rep1 "storyboard mode", rep2 "calm mode"),
zero critical failures, choreographed recordings captured.

**Owner's verdict on the artifacts:** *"these two look a lot better. It does have the depth and
scroll animations I was looking for."* This is the first time in the programme the owner has said
an output met their stated ceiling.

## What this separates

Criterion G2 established that the **skill** makes agents weigh the spectacle register (3/3 vs 0/3
baseline). But those same skill-equipped runs kept **declining 3D** on product-fit grounds. This
arm shows the ceiling was reachable the whole time, and that **register awareness and ambition
ceiling are two different levers**:

- the **skill** changes *whether the question is asked*;
- the **calibration pack** changes *how high the answer reaches*.

Neither substitutes for the other, and the pack — not the skill — is what moved the owner's
ceiling. That is the single most decision-relevant finding of Section E so far.

## Costs and honest limits

- **Not free.** rep1 cost 305k tokens / 58 min (inside the S1 baseline band of ~250–300k,
  46–67 min); rep2 cost 365k / 69 min, **above** it. On the run-matrix question, the pack raised
  ambition *and* consumed context.
- **rep2 added dependencies** — `three` plus a dev-only `puppeteer-core`. First 3D library adopted
  anywhere in the programme; all three S1 baselines were zero-dependency raw WebGL2.
- **Neither rep cited the pack.** No calibration axis and no reference site is named in either
  report. Influence is inferred from output shape, not from stated reasoning — so the honest claim
  is that the pack *correlates* with the change, not that the agents consciously applied it.
- **n=2, and the arm was stopped early by choice.** The pre-registered bar (≥2 of 3) is met, but
  with two observations there is no third to contradict them. Recorded as a deliberate stop, not
  a completed three-rep arm.
- **Concept convergence is untouched.** Both reps are again "the page is a Meridian project" —
  now 5 of 5 across this family. The pack changed *how* the page is rendered, not *what it is
  about*. Ambition and premise are, apparently, also separate levers.

## Consequence for the skill

Nothing here is evidence to change `SKILL.md`: the pack is a *reference*, not skill content, and
the project's own architecture rules say references calibrate ambition while the architect routes
technology. If anything this strengthens the existing split — but it does suggest a candidate the
owner may want to weigh later: **the skill could name reference calibration as a step** ("when a
brief signals unforgettable, ask whether a ceiling reference exists"), which is a routing
instruction rather than taste content. **Not applied**; recorded for the v1.1 discussion alongside
the three candidates from the I2/I5 arm.

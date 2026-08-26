# v2.0 next-run matrix

Do not throw away v1.9 data. Q1/W1 and historical Layer B/C baselines remain valid.

## 1. Baseline the new S1 register

Run S1 on the same model arms you care about, **3 reps each**, fresh contexts.
Minimum useful first pass:
- Fable ×3
- Opus ×3

Capture each run:
- build result + git diff;
- desktop/mobile screenshots;
- 30–90 sec interaction recording (`capture_motion.mjs`);
- `measure_execution.mjs` output;
- static checks and console errors;
- dependencies and specialist skills/docs consulted.

Score blind with `rubrics/spectacle_fit.md`.

## 2. Run component/effect discovery D1/D2

Routing/design-plan only first; 3 reps/model. This is cheap.

Key question: does catalog awareness improve economy without making the output generic?

## 3. External-skill ablations (do not install all simultaneously)

Use S1 as the primary discriminating task. Suggested clean ablations:

A. baseline model, no added design skill
B. Impeccable only
C. Impeccable + MengTo WebGL/Awwwards workflow
D. Impeccable + Three.js Awesome Graphics (only if Three is actually chosen)
E. Impeccable + relevant current technical specialist (GSAP/Pixi/WebGPU/etc.)
F. React Bits vendor skill only when the plan selects a React Bits primitive

Do **not** run Impeccable + StyleSeed + UI Craft + Hallmark simultaneously. That tests prompt pile-up, not skill value.

## 4. Reference-calibration ablation

Compare S1 with and without `landing_love_calibration.md` using identical model/skills. This answers whether
concrete quality axes raise ambition or merely consume context.

## 5. Component abundance test

For D2/S1, optionally expose the full active-query catalog snapshot. Reward deliberate rejection of attractive
but mismatched components. A catalog should shorten implementation, not determine art direction.

## 6. Only after these baselines, build the actual architect skill

The smallest useful architect should encode:
- activation boundaries;
- register selection;
- component-fit gate;
- renderer/specialist routing;
- version/freshness policy;
- one-owner-per-concern;
- runtime/visual verification handoff.

Do not copy Impeccable, vendor skill bodies, or component source into the architect.

## Sequencing note (orchestrator, 2026-08-12)

Cost-realistic order: (1) capture_motion.mjs exists and is smoke-tested; (2) S1 baseline arm A on
Fable only (3 reps) - each run is likely the heaviest yet; (3) score blind vs spectacle_fit.md with
recordings; (4) only then choose which ablation branches (B-F) the baseline justifies; (5) D1/D2
catalog-aware vs control (cheap, parallelizable). Registries in registries/ are the verified
2026-08-12 snapshots; re-verify per skill_discovery_policy refresh triggers before major runs.

## v2.1 amendments (2026-08-14)

- Discovery step is now **D0 -> D1 -> D2**: D0 (no catalog mention) baselines unprompted search;
  D1 demands the evidence-based fit verdict; D2 tests abundance resistance.
- **S0** (plan-only register recognition, no tech named) rides with the routing budget before S1.
- S1 motion recordings use the pre-registered choreography file
  `evals/choreography/S1-spectacle-launch.choreography.json` - identical across conditions.
- Ablation skills load at the pinned revisions in `registries/external_skills.json > eval_pins`.
- Success criteria for S0/S1/D0/D1/D2 pre-registered as criterion G in `rubrics/success_bar.md`.

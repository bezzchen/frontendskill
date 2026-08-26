# Creative Frontend Architect — Evaluation Plan v2.5

## Purpose

Measure whether a future `creative-frontend-architect` Agent Skill improves **frontend architecture and tool-selection judgment** and can execute selected technologies correctly.

Do not build the skill before collecting clean baselines.

## Experimental controls

- Every run starts in a fresh agent context.
- Reset the fixture repository to its recorded commit before every repetition.
- Use the exact same fixture revision and prompt in baseline and with-skill conditions.
- Pin the model/snapshot, agent version, and exposed settings.
- Run **3 repetitions per task per condition**.
- Do not show the evaluated agent `expected_behavior`, failure signals, rubric, or prior runs.
- Record metadata using `run_metadata_template.json`.
- Baseline runs must not have read our skill-design discussion or expected routing answers.

## Phase 0A — Verify fixtures

Two fixture repositories are included:

1. `fixtures/next-tailwind-base`
   - used by routing evals E1, E3, E4, E5, E6;
   - contains semantic Next/React/Tailwind UI;
   - deliberately contains no animation/graphics library.

2. `fixtures/anime-v4-portfolio`
   - used by E2;
   - pins Anime.js v4 and already uses it for a small intro reveal (`components/IntroFade.jsx`),
     establishing it as the project's real motion system while leaving drag/layout/stagger/timeline
     APIs out of the repo so version knowledge is still genuinely tested;
   - contains no competing animation engine.

Dependency locks are frozen and committed (eval v1.2), and both fixtures were verified to build
with `npm ci && next build`. Before running, confirm they still build in the evaluator's environment:

```
./scripts/check_fixtures.sh
```

Do not silently upgrade package versions.

## Evaluation layers

The harness separates three capabilities:

- **A — Activation:** should the creative architect skill load for this request?
- **B — Routing / judgment:** what architecture and tool family should be selected?
- **C — Specialist execution:** given a pinned architecture/tool, can the agent implement it correctly?

This separation keeps a routing failure distinct from a specialist API/implementation failure.

## Phase 0B — Routing baseline

Run all six cases in `evals/routing_evals.json`. Rep 1 clean runs are archived; complete reps 2–3 before treating routing medians as stable.

Each run should stop after:
- repository inspection;
- architecture decision;
- short reasoning;
- dependency proposal.

Do not implement.

This isolates the primary capability:
**Did the agent choose the right architecture?**

Runs per condition: 6 evals × 3 reps = 18.

## Phase 0C — Blind routing review

Where practical:
- remove condition labels;
- randomize result order;
- score architecture/final proposal before reading traces.

Use `rubrics/scoring_rubric.md`.

Report medians and ranges, not only point estimates.

After baseline review, add task-specific objective assertions only for failures actually observed.

## Phase 0D — Implementation baseline

Use `evals/implementation_evals.json`.

Priority implementation cases:
- Anime.js v4 existing-stack case;
- bounded DOM+GPU media case;
- dense 2D renderer case.

These answer a different question from routing:
**Given a pinned specialist architecture, can the agent execute it correctly?**

Each implementation case now contains an exact `implementation_prompt` and a pinned specialist:
- I2 → existing `animejs@4.5.0`
- I4 → **DEFERRED** pending explicit decision: `curtainsjs@8.1.6` legacy WebGL compatibility vs `gpu-curtains` modern WebGPU (or separate tests for both)
- I5 → `pixi.js@8.19.0`

This deliberately removes a second routing decision from the execution tests.

Capture build results, git diff, dependency changes, browser screenshots, motion capture when feasible, console errors, accessibility/reduced-motion behavior, mobile behavior, tokens, and duration.

## Phase 1 — Analyze failures

Identify recurring baseline problems.

Examples:
- unnecessary dependency escalation;
- failure to inspect installed versions;
- stale API usage;
- defaulting to Three.js for bounded GPU effects;
- animating too many DOM nodes;
- interpreting "dynamic" as "add animation";
- poor accessibility/performance planning.

Do not teach the future skill behaviors the baseline already handles reliably.

## Phase 2 — Build the minimal v1 skill

v1 should contain only enough to correct observed failures:
- strong activation description;
- concept-before-technology rule;
- minimal core router;
- existing-stack/version inspection rule;
- performance/accessibility gate;
- specialist loading/version-freshness policy.

Do not create the long-tail tool encyclopedia yet.

## Phase 3 — With-skill rerun

Repeat the exact routing and implementation tasks:
- same fixture revisions;
- same model and settings;
- same repetition count;
- fresh contexts.

Score blind where practical.

Use the pre-registered criteria in `rubrics/success_bar.md`.

## Phase 4 — Trigger evaluation

Once `SKILL.md` has a final v1 description, run `evals/trigger_queries.json`.

Near-miss negatives matter more than obviously unrelated negatives.

## Phase 5 — Expand only from evidence

Add specialist tools/references only when:
- a real project needs them;
- an eval exposes a routing gap; or
- the router needs enough awareness to know that specialist research should be performed.

The tool registry should grow from evidence rather than completeness pressure.

## v1.5 interpretation update

Blind scoring of the 12 valid clean rep-1 proposals showed routing near the 0–4 rubric ceiling.
Routing is now a **non-regression guardrail**, not the primary efficacy target.

The skill must justify itself mainly through:
- activation boundaries;
- specialist execution/version freshness;
- browser-visible polish/review;
while preserving baseline routing quality.

See `results/BLIND_SCORING_REP1.md`, `results/NEXT_RUN_MATRIX.md`, and `rubrics/success_bar.md`.

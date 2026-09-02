# Criterion A — routing arm: 25 runs complete, awaiting scoring (2026-09-02)

Fable arm, plan-only, pristine fixtures, `evals/routing_evals.json` prompts verbatim.
Baseline: E1-E5 x reps 2,3 (10 runs) — rep 1 already existed and was scored in BLIND_SCORING_REP1.
With-skill: E1-E5 x reps 1,2,3 (15 runs), delivered per `evals/withskill_protocol.md`.
**E6 excluded from both arms** — see `results/deviations/E6_PROMPT_DEFECT.md`.

Proposals: `results/proposals_f/`. Plan-only compliance verified by measurement on all 25 runs
(`git status --porcelain` + `git diff --stat`); **zero tracked source changes anywhere**.

## Status: NOT YET SCORED
Criterion A's load-bearing composite (Conceptual Fit, Architectural Restraint, Existing-Stack Respect)
has not been assigned for reps 2-3 baseline or any with-skill run. The runs exist; the medians do not.
**Scoring must be done blind and pooled** — see "Scoring hazard" below.

## What is already established without scores

### 1. The skill changes PROCESS reliably; it does NOT converge ARCHITECTURE
| behaviour | with-skill | baseline |
|---|---|---|
| register named explicitly | **15/15** | 0/10 |
| spectacle weighed, chosen or declined in writing | **15/15** | 0/10 |
| catalog sweep run and cited with named components | **15/15** | 0/10 |
| library versions or browser-support verified live | **15/15** | 2/10 (E2 reps, from lockfile/installed pkg) |
| zero new runtime dependencies | 15/15 | 10/10 |

But on the same brief, reps disagree with each other:
- **E5 renderer — three reps, three answers.** rep1 DOM+compositor (after benchmarking), rep2
  Canvas 2D + atlas, rep3 WebGL2 instanced + Canvas2D fallback. Both baselines chose Canvas 2D.
- **E3 engine — 4-1.** rep1 CSS-native scroll timelines; rep2, rep3 and both baselines the JS
  sticky-track.
- **E2 transform ownership — three models.** Two nested layers (baselines + ws rep2); Draggable as
  sole owner writing through muted setX/setY (ws rep1); three properties/three owners with orbit on
  `left/top` (ws rep3, which argues the nested-wrapper model has a latent bounds bug because
  Draggable caches ancestor inverse-transforms once).
- **E4 img visibility — three answers.** never hide (rep1); `visibility:hidden` when ready (rep2);
  `opacity:0` because visibility "would remove it from the accessibility tree" (rep3).
- **Register itself is unstable.** E2: S/W/W. E5: W/S/W. E1: Q/Q/Q (the only convergent cell).

**Conclusion available now: the skill makes runs do the homework and argue the choice. It does not
make them agree, and it does not by itself make them right.**

### 2. Convergence that is NOT attributable to the skill
E4 is the most convergent cell in the programme — 5/5 runs across BOTH arms independently chose one
shared viewport-spanning WebGL2 overlay with DOM-rect-synced quads, zero deps, DOM canonical,
render-on-demand, rejecting per-card canvases on the context-limit argument and R3F on bundle grounds.
Arm-independent. Likewise zero-new-dependencies at 25/25. Neither is evidence for the skill.

### 3. Findings the skill produced that recall could not
- **REPLICATED 3x: anime.js docs state `releaseDamping: 10`; the shipped 4.5.0 source says 20.**
  Found independently by E2ws reps 1, 2 and 3 ("installed source wins"). Neither baseline found it.
  This is the strongest single piece of evidence for the freshness rule in the programme.
- **E5ws-rep3 traced the skill's own Pixi example to source at tag v8.20.1**: `TickerPlugin` defaults
  `autoStart: true`; `Ticker.shared`/`Ticker.system` are lazily created with `autoStart = true` and
  `_protected = true`; `EventSystem._addEvents()` calls `EventsTicker.addTickerListener()`, which adds
  to `Ticker.system` **unconditionally** — "so `app.ticker.stop()` leaves a library rAF loop alive."
  Independently corroborates the queued v1.1 edit to name `Ticker.system` in non-negotiable 1.
- **E3ws-rep2 rejected `pathLength="1"`** (no MDN BCD entry; WebKit/Blink historically ignored it for
  dash scaling; Safari rescales px-unit dashes under page zoom, motion#3301) — an approach both
  baselines AND E3ws-rep1 had specified. **E3ws-rep3 refined the same diagnosis**: keep `pathLength`,
  make the dash values unitless. Convergent diagnosis, divergent remedy.
- **E1ws-rep3 measured the brief's subjective complaint.** The brief says the page "feels plain"; it
  computed `--line` on `--surface` at **1.35:1 in both schemes**, below WCAG 1.4.11's 3:1 non-text
  minimum: "Input edges are nearly invisible; this is the measurable root of 'feels plain'." No other
  run in either arm turned the aesthetic complaint into a number.
- **E5ws-rep1 benchmarked its own architecture decision** and refuted both baselines' shared premise
  (DOM held 60 fps at 500 and 2000 nodes; accelerated Canvas 2D collapsed to 100 ms frames at 2000).
  **But this happened in 1 of 3 reps** — it is not a property of the skill.

### 4. Cost — and why the headline multiples are wrong
`results/deviations/ORPHANED_CHILD_COST.md`: 10 of 15 with-skill runs stalled by delegating the
mandated catalog sweep to a child and parking. Each was resumed by a neutral relay, then usually
performed the sweep itself — while the orphan kept running and billing. Demonstrated at E4ws-rep3:
parent reported 143,006 tokens; the orphan spent a further **230,884**. True cost ~374k = **~6.7x
baseline, not the reported 2.5x.**

**Every stalled run's recorded cost is a lower bound.** Only four runs never delegated and therefore
have complete totals:
| run | tokens | vs baseline | note |
|---|---|---|---|
| E4ws-rep1 | 91,151 | **1.6x** | identical tool count to baseline (5) |
| E5ws-rep2 | 94,274 | 1.65x | |
| E1ws-rep2 | 100,863 | 1.7x | |
| E4ws-rep2 | 100,730 | 1.8x | |
**Use only these for criterion D.** The defensible statement is ~1.6-1.8x baseline tokens for the
skill itself; empirical work (E5ws-rep1's benchmark, E1ws-rep3's contrast measurement) costs more on
top, and the stall costs roughly double and hides half.

### 5. Operational finding: the skill induces a harness failure
10/15 with-skill vs 0/10 baseline stalls. Cause is structural: non-negotiable 3 mandates a catalog
search; agents delegate it; a parent with no live children never wakes. Per-rep: rep1 3/5, rep2 3/5,
rep3 4/5 — no mechanism for the drift, and three reps is too few to distinguish it from chance.
**Fix belongs in the skill, not the harness: state that the sweep must be run inline, not commissioned
and awaited.** This is v1.1 candidate #5 and the only one backed by 15 observations.

## Scoring hazard — read before scoring
The orchestrator has now read all 25 proposals in full and written approving per-run summaries of
each. Scoring them unblinded, knowing which arm each belongs to, would be exactly the bias the blind
protocol exists to prevent.

Required procedure: pool all 25 proposals, strip arm and rep labels, randomise order, seal the
mapping, then score only Conceptual Fit / Architectural Restraint / Existing-Stack Respect per
`rubrics/scoring_rubric.md`. The blind will be imperfect — several proposals are identifiable by
content (the benchmark, the contrast measurement, the docs-vs-source finding) — and that limitation
must be recorded in the scoring artifact, exactly as `BLIND_SCORING_REP1.json` recorded its own.

## What criterion A can and cannot conclude
Baseline rep 1 medians: Fable 3.833, Opus 4.000 (ceiling is 4). With reps 2-3 now in hand the Fable
median can finally be computed over three reps — but the guardrail test ("no more than 0.10 below
baseline") sits against a near-ceiling, low-variance baseline and has little power to fail.
The weak-case rule, which was the only discriminating test, applied solely to Fable E6 — the cell that
cannot be run under the pinned prompt. **Criterion A will therefore resolve as a non-regression check
over E1-E5, with the weak-case rule NOT_MEASURED**, unless the owner amends E6's prompt and
re-baselines that cell on both model arms.

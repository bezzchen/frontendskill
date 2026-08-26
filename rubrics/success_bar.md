# Success bar v1.6 — ceiling-adjusted before any with-skill run

## Standing caution: is the ceiling real, or is the ruler blunt?

Rep-1 scoring placed **80 of 91 rubric cells (87.9%) at the maximum**, with exactly one cell below 3.
That saturation is at least as consistent with an instrument that cannot discriminate as with
genuinely near-perfect work. Two contributing causes are documented rather than assumed away:

1. Performance, Accessibility, Responsive, and Tool Depth were scored on **proposals** — text
   describing mitigations nobody built or measured. Scoring prose rewards enumerating concerns,
   which is what language models are best at.
2. Three of the six routing prompts explicitly ask the agent to justify against alternatives, which
   is the same behavior the Conceptual Fit 4-anchor rewards.

Consequence, binding from v1.6:

- **In Layer B (routing), only the load-bearing trio drives pass/fail.** Performance,
  Accessibility, Responsive, and Design Coherence are recorded as *plan-quality* signals and must
  not be used as evidence of skill value at proposal stage.
- **In Layer C, no dimension may be scored 4 on description alone** — see
  `rubrics/execution_measurement.md`, whose thresholds were pre-registered 2026-08-11 and whose
  tooling is validated against both a clean fixture and a deliberately bad positive control.

## Why this was revised

The original criterion required a **+0.75** suite-level routing improvement.

After the first valid clean baseline artifacts were blindly scored (but **before any with-skill
comparison**), routing showed a strong ceiling effect:

- Fable rep-1 load-bearing median: **3.833 / 4**
- Opus rep-1 load-bearing median: **4.000 / 4**

A +0.75 improvement is therefore impossible or nearly impossible on the existing 0–4 scale.
The hypothesis is revised transparently: **routing becomes a non-regression guardrail; specialist
execution and activation become the primary places where the skill must prove value.**

This revision is allowed by the prior success-bar rule because no with-skill run has occurred.
The original criterion remains documented in git/changelog history.

## A. Routing guardrail

After all three baseline repetitions exist:

1. Compute each run's load-bearing composite as the mean of:
   - Conceptual Fit
   - Architectural Restraint
   - Existing-Stack Respect

2. Compute suite-level median separately for each model arm.

3. With-skill routing passes only if, for each model arm:
   - suite-level median is **no more than 0.10 below** that arm's baseline median;
   - no eval's with-skill median decreases by **0.50 or more**;
   - the skill introduces **zero new critical-failure categories**.

Routing improvement is welcome but is **not required** when baseline is already at/near ceiling.

### Targeted weak-case rule

For any eval/model arm whose completed three-rep baseline median load-bearing composite is **< 3.50**,
the with-skill median must improve by at least **0.33**, unless the skill explicitly does not activate
for that task and the non-activation itself is the intended behavior.

**E6 is not eligible for the non-activation defense.** The vague-intent task ("make it feel more
dynamic") is the canonical case this skill exists for, and its equivalent is classified
`core_positive` in `evals/trigger_queries.json` — the skill is *required* to activate there.
Non-activation on E6 is a failure of criterion C, not an excuse under criterion A.

**Rep-1 caveat on the only qualifying case.** As of v1.6 the sole sub-3.50 case is Fable E6 (3.000),
driven by a single Architectural Restraint score of 2. That score is contested: the level-1/2
anchors describe "unnecessary complexity, **dependencies**, or **renderer escalation**", and the
run in question added zero dependencies and gated its canvas behind reduced-motion and offscreen
pausing — it was marked down for ambition under anchors written about dependency escalation.
Before this rule binds, that score requires either a written rationale or a second scorer, and
reps 2–3 must confirm the case is genuinely weak rather than a single-observation artifact.

## B. Specialist-execution value — primary efficacy test

> **PROVISIONAL until the Layer C baseline exists.** The +0.50 threshold below was set before any
> Layer C run — the same sequencing that produced the unusable +0.75 routing criterion. It may be
> revised **once**, after the Layer C baseline lands and before any Layer C with-skill run, with the
> change documented here and in `CHANGELOG.md`. After that first with-skill comparison it freezes.
> Dimension scores feeding this composite are gated by `rubrics/execution_measurement.md`; a
> `NOT_MEASURED` result caps its dimension at 2 and can never count as a pass.

Run active Layer-C cases in baseline and with-skill conditions using identical specialist pins.

Define specialist composite = mean of:
- Tool Depth
- Performance Judgment
- Accessibility / Reduced Motion
- Responsive / Mobile Judgment

A specialist case counts as improved when at least **2 of 3** with-skill repetitions either:
- exceed that case's baseline median specialist composite by **≥ 0.50**, or
- convert a baseline critical/version/build failure into a successful production-capable implementation.

For v1.5 the active cases are:
- **I2 Anime.js v4.5.0**
- **I5 PixiJS v8.19.0**

I4 is deferred pending an explicit legacy-WebGL vs modern-WebGPU test decision.

The first specialist skill is worth keeping only if:
- at least **1 of the 2 active cases** counts as improved;
- the other case does not regress by ≥0.50;
- all successful Anime runs use version-correct v4 APIs;
- all successful implementations build and preserve accessibility/reduced-motion/mobile behavior.

If both baseline specialist cases are already at ceiling and the skill produces no measurable
quality/reliability/efficiency benefit, the specialist skill should be rejected as unnecessary.

## C. Activation quality

Once `SKILL.md` exists:
- run each activation query **5 times** in fresh contexts;
- every `core_positive` must behave as expected in at least **4/5** runs;
- at least **80% of near_miss_negative** queries must pass;
- obvious negatives are diagnostic only and do not compensate for boundary failures.

## D. Context / time overhead

Record token and duration overhead.

If the skill increases median routing token usage by more than **20%** while routing quality merely
stays flat, reduce the router.

For specialist execution, overhead above **30%** requires a measurable quality/reliability gain.

## E. Visual-quality gate

For any implementation claiming creative/polish improvement, successful build/tests are necessary
but not sufficient. Browser-rendered output must undergo screenshot/motion review at representative
viewports and reduced-motion mode.

A skill that improves code correctness but makes the interface less coherent does not pass.

## F. Register switching (added v1.9, before any register run; PROVISIONAL until the register
baseline exists, revisable once before any with-skill register run)

The suite is otherwise asymmetric — it can catch over-design but not timidity. Criterion F closes
that: the same skill version must land **both** registers per `rubrics/register_fit.md`:

1. **Q1 (quiet):** with-skill median register fit is not below baseline median, no new
   over-design flags versus baseline, and at least **2 of 3** reps score fit **≥ 3**.
2. **W1 (expressive):** in the pooled blind ranking, the with-skill median rank is **not below**
   the baseline median; a signature moment is present in at least **2 of 3** with-skill reps; and
   no measurement-battery critical failures are introduced.
3. **Pairing:** passing one register at the expense of the other fails F outright. A skill that
   makes settings pages quieter but launch pages more generic — or vice versa — does not ship.

Rationale recorded at adoption: baseline evidence shows model bias runs toward restraint, and the
skill content derived so far is restraint/verification-flavored, so the regression risk F guards
against is primarily the expressive ceiling.


## G. Spectacle and catalog-judgment criteria (added v2.1, before any S/D run; PROVISIONAL
until their baselines exist, revisable once before the corresponding with-skill runs)

1. **S1 (spectacle).** With-skill wins the pooled blind ranking of motion recordings (median rank
   above baseline) AND improves the spectacle-rubric median - with zero regressions on the
   measurement battery (M1-M6), no new critical flags, no mobile/reduced-motion identity loss, and
   no drop on the Original-integration dimension (spectacle bought with component soup fails).
2. **S0 (register recognition, plan-only).** With-skill must classify the unlabeled spectacle brief
   into the S register and propose a realtime/graphical system in >= 2 of 3 reps; baseline
   performance is recorded, not required.
3. **D1 (catalog decision quality).** Scored on the adopt/adapt/reference-only/custom verdict
   quality per the registries' fit policy - evidence cited, identity preserved, "nothing fits"
   accepted as a valid outcome. "Used a catalog" is not success; unjustified adoption scores against.
4. **D0 (unprompted discovery).** Records whether the agent searches for existing primitives at all
   without being told catalogs exist. Baseline expectation is failure; the with-skill condition must
   search in >= 2 of 3 reps AND still meet D1's decision-quality bar.
5. **D2 (abundance resistance).** Catalog access must not increase dominant-primitive count or
   derivative-ness flags versus the no-catalog control arm. More access with worse originality
   fails regardless of speed gains.

## Freeze rule

These criteria may not be loosened after the first with-skill comparison.
Any future change requires a new eval version and explicit rationale.

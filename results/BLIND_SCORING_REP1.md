# Blind scoring — clean routing rep 1

Scope: **12 valid clean proposals only** (6 Fable + 6 Opus). The six earlier coached-fixture
runs are retained as diagnostics and are **not baseline data**.

## Method

Within each eval, the Fable/Opus proposal filenames were randomized to anonymous A/B labels before
scoring. Scores were assigned from `rubrics/scoring_rubric.md`; model mapping was revealed only
after the scores were fixed.

This is a **single-reviewer artifact score**, not a fully independent double-blind panel. It is
useful for identifying ceiling effects and weak cases, but reps 2–3 are still required before
treating medians as stable baseline estimates.

## Summary

| Model arm | Clean runs | Load-bearing median | Range | Median across applicable dimensions |
|---|---:|---:|---:|---:|
| Fable | 6 | **3.833 / 4** | 3.000–4.000 | 3.938 / 4 |
| Opus | 6 | **4.000 / 4** | 3.667–4.000 | 3.938 / 4 |

Load-bearing = mean of Conceptual Fit + Architectural Restraint + Existing-Stack Respect.

## Per-eval scores

| Model | Eval | Concept | Restraint | Stack | Tool | Perf | A11y | Mobile | Design | Load-bearing |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Fable | E1 | 4 | 3 | 4 | N/A | 4 | 4 | 4 | 3 | 3.667 |
| Fable | E2 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 4 | 3.667 |
| Fable | E3 | 4 | 4 | 4 | N/A | 4 | 4 | 4 | 4 | 4.000 |
| Fable | E4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4.000 |
| Fable | E5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4.000 |
| Fable | E6 | 3 | 2 | 4 | 3 | 3 | 4 | 3 | 4 | 3.000 |
| Opus | E1 | 4 | 3 | 4 | N/A | 4 | 4 | 4 | 4 | 3.667 |
| Opus | E2 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4.000 |
| Opus | E3 | 4 | 3 | 4 | N/A | 4 | 4 | 4 | 4 | 3.667 |
| Opus | E4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 4.000 |
| Opus | E5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4.000 |
| Opus | E6 | 4 | 4 | 4 | N/A | 4 | 4 | 4 | 4 | 4.000 |

## Saturation warning (added v1.6)

Of the **91 raw dimension cells** scored here, **80 (87.9%) are 4s**, 10 are 3s, and exactly **one**
is below 3. Independently recomputed: every `load_bearing_composite` matches, Fable median 3.833
(range 3.000–4.000), Opus median 4.000 (range 3.667–4.000).

A rubric that awards its top anchor to nearly nine cells in ten cannot discriminate, and that is at
least as consistent with a blunt instrument as with near-perfect work. Note especially that
Performance, Accessibility, Responsive, and Tool Depth were scored on **proposals** — descriptions
of batching, offscreen pausing, and DPR caps that were never built or measured. Scoring prose
rewards the ability to enumerate concerns.

Treat the ceiling as **jointly caused**: genuinely strong routing *and* a measure too coarse to
separate strong from excellent. `rubrics/success_bar.md` now restricts Layer B pass/fail to the
load-bearing trio, and `rubrics/execution_measurement.md` gates Layer C on measurements.

### Contested score: Fable E6 Architectural Restraint = 2

This single cell is the only sub-3.50 case and now drives the targeted weak-case rule, so it needs
scrutiny it has not had. The rubric's low anchors describe "unnecessary complexity, **dependencies**,
or **renderer escalation**", but the run added **zero dependencies**, reused data already in the
repo, and gated its canvas behind reduced-motion and offscreen pausing. It appears to have been
marked down for *ambition* under anchors written about *dependency escalation*.

Required before the weak-case rule binds: a written rationale or a second scorer, plus reps 2–3 to
confirm the case is genuinely weak rather than a single-observation artifact.

## Main finding

Routing is already near ceiling for both model tiers. The original success criterion requiring a
`+0.75` suite-level routing improvement is therefore not a meaningful test of skill value:
an Opus median of 4.000 cannot improve by 0.75 on a 0–4 rubric.

The most informative weak case in rep 1 is **Fable E6** (vague "make it more dynamic"):
the proposal diagnosed the page first, but still escalated to a continuously animated 500-node
constellation hero. Opus E6 was more restrained and content-first.

Other differences are mostly stylistic/architectural trade-offs at an already high level:
- E4: raw WebGL2 versus OGL for the bounded media shader layer;
- E5: both models independently preferred Canvas 2D over Pixi at n≈500 and documented thresholds
  for escalating to WebGL/GPU tooling;
- E3: both rejected an unnecessary global motion stack and built isolated native scroll architecture.

## Consequence for the skill hypothesis

Routing should become a **non-regression guardrail**. The skill must justify itself primarily by:
1. activating only when architectural/design judgment is actually needed;
2. improving specialist execution/version freshness;
3. improving visual-review/polish quality;
4. doing so without degrading these already-strong routing decisions or adding excessive context cost.

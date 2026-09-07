# creative-frontend-architect — programme verdict

**Date:** 2026-09-02 · **Skill version under test:** v1 (frozen) · **Model arm:** Fable throughout,
with an Opus routing baseline that was not extended

---

## The one-sentence answer

**This skill is a process intervention. It reliably changes how the work is approached, it modestly
improves architectural decisions, it does not improve what gets built, and it increases variance in
both directions.**

That is a real and useful result. It is not the result the programme was hoping for.

---

## The board

| criterion | verdict |
|---|---|
| **A** routing guardrail | **MET** — +0.334 median, p=0.032 |
| **A′** E6 weak-case rule | NOT_MEASURED — eval-design defect, cell invalidated |
| **B** specialist-execution value | Half-settled — measurements in, owner's scored dimensions outstanding |
| **C** activation quality | **MET** — 70/70 |
| **D** context/time overhead | **MET** (conditional) — 1.6–1.8x routing, 0.98x execution |
| **E** visual-quality gate | Waiting on owner |
| **F** register switching | **FAILED** |
| **G1** S1 spectacle | **FAILED** |
| **G2** S0 register recognition | **MET** — 3/3 vs 0/3 |
| **G3** D1 catalog decision quality | Met in substance, not in form |
| **G4** D0 unprompted discovery | **MET** — 3/3 vs 0/3 |
| **G5** D2 abundance resistance | **MET** — non-regression, ceiling-limited |

**Five met, two failed, one not measured, four open.**

---

## What the skill demonstrably does

**It changes process, with the largest effect sizes in the programme.**

| behaviour | with-skill | baseline |
|---|---|---|
| names a register explicitly | 15/15 | 0/10 |
| weighs spectacle in writing, chooses or declines | 15/15 | 0/10 |
| runs and cites a catalog sweep with named components | 15/15 | 0/10 |
| verifies library versions or browser support live | 15/15 | 2/10 |

Zero of ten baselines did any of this unprompted. These are not marginal differences.

**It improves routing decisions, modestly.** Blind pooled scoring by five independent fresh
reviewers: baseline median 3.333, with-skill 3.667. Exact p = 0.032, effect size 0.713. Roughly half
the gain comes from one eval (E3); removing it leaves +0.167. Real, small, carried unevenly.

**It produces facts recall cannot.** The clearest: all three E2 with-skill reps independently found
that anime.js's docs state `releaseDamping: 10` while the shipped 4.5.0 source says `20`. No baseline
found it. Another rep traced the skill's own Pixi example to source and established that
`app.ticker.stop()` leaves `Ticker.system` running — corroborating a queued v1.1 edit from evidence
rather than intuition.

---

## What it does not do

**It does not improve what gets built.** Both implementation-facing criteria failed.

- **F** (register switching): the pooled W1 ranking put with-skill below baseline. Underpowered —
  p = 0.70, reviewer called all six equivalent — but recorded at face value on the owner's ruling.
- **G1** (spectacle): four of five conjunctive clauses failed. With-skill median rank 4.67 vs 3.00.

**It increases variance.** This is the most robust negative finding, seen twice independently:

- **G1**: the with-skill arm produced the pool's **best** build (unanimous first, straight 4s from
  all three reviewers) *and* its **two worst** (unanimous last at 1.75). All three baselines cluster
  in the middle, 2.667–3.333.
- **Criterion A's E5 cell**: with-skill produced both the highest-scoring proposal (4.000) and the
  lowest in the entire 25-proposal pool (2.000, penalised for renderer escalation).

The pre-registered tests are medians. A median is the wrong summary of a bimodal arm, and it converts
"one excellent result plus two poor ones" into a failure. **The freeze rule forbids loosening the
criteria after the comparison, so the failures stand — but the mechanism is variance, not degradation.**

**It does not converge architecture.** On identical briefs, reps disagree: E5 produced three
different renderers across three reps; E3 split 4-1 on the engine; E2 produced three distinct
transform-ownership models; register itself flipped (E2 S/W/W, E5 W/S/W). The skill makes runs do
the homework and defend the choice. It does not make them agree, and it does not make them right.

---

## What the programme learned about itself

**The battery cannot see design defects.** Builds that passed every M-measurement carried, per blind
reviewers: a code-export panel rendering **completely empty** in the act whose copy promises shipped
code; a mobile header printing over body copy with no backdrop; a sticky wordmark overlapping a
slider label. M1–M6 measure frame time, pausing, content parity, accessible names, teardown and
static structure. None of them looks at the page. The Thornmere director pass found this first; G1
confirmed it at scale.

**Two instruments were repaired mid-programme and both earned it on first real use.** M6's cross-file
ownership check and M3's control-vs-content separation each prevented a false failure on a live S1
run. Both repairs were driven by smoke tests that the pre-repair instruments failed — the fix came
from the test, not from taste.

**One eval was defective.** E6's prompt ended "before implementing anything" — an order of
operations, not a stop — while E1–E5 ended "Do not implement yet." Three of three runs implemented.
Fixed, with the invalidation recorded; the cell restarts at n=0 on both arms.

**The skill induces a harness failure that hides its own cost.** Line 3 mandates a catalog search but
does not say who runs it. 10 of 15 runs delegated it and parked; the orphaned children kept billing
after their parents finished the work themselves. Measured true costs of 6.7x and 5.4x against
reported 2.5x and 2.9x.

---

## Recommendation

**Ship v1.1, not v1.** The draft is written (`skill/creative-frontend-architect/SKILL.v1.1-draft.md`)
and its three changes are each evidence-backed:

1. **"Run this search inline, yourself"** — the highest-value line in the programme. Backed by 15
   observations and two measured cost instances. Without it the skill roughly doubles its own cost
   invisibly.
2. **Name `Ticker.system` and the `app.ticker.stop()` trap** — a rep proved from source that v1's
   wording is incomplete in a way that would leave a reader confidently wrong.
3. **Verify the global rAF loop, not your own flag** — several reps converged on this technique
   independently, which is corroboration that it is the natural correct method.

**Position it honestly.** This is a router that improves decisions and adds rigour to
investigation. Selling it as a quality-of-output intervention is not supported: two implementation
criteria failed, and the variance finding means an unlucky run can be worse than no skill at all.

**Do not chase the failed criteria with more runs.** G1's excluded dimension could be closed with a
live interaction pass, but G1 fails on four clauses and that dimension touches one. Running it now,
after seeing the result, would be fishing.

**The most valuable untested lever is not the skill.** The calibration ablation showed the reference
pack — not the architect skill — is what reached the owner's stated 3D ceiling: 2/2 spatial-3D
adoption versus 0/3 baseline, with no architect skill loaded. The skill decides whether spectacle is
*considered*; the pack decides how far it *goes*. If the goal is better output rather than better
decisions, the pack is where the evidence points, and it has never had a controlled arm of its own.

---

## Honest limitations of this verdict

- **n is small everywhere.** 3 reps per cell. G1's arm comparison has p = 0.80 with a floor of 0.05.
- **One model arm.** Everything after the routing baseline is Fable-only. The Opus routing baseline
  was never extended, so nothing here is known to generalise across model tiers.
- **Blinding was imperfect.** With-skill outputs run ~2x longer and carry distinctive vocabulary.
  Reviewers named that tell and said they corrected for it, but it cannot be ruled out.
- **G1's dimension 2 (interaction causality) was excluded, not estimated** — the dimension most
  directly about the brief's core claim went unscored because the motion recordings could not be
  made reviewer-perceivable.
- **Two criteria (B, E) remain owner-scored** and could move the board.
- **Concept convergence is unexplained.** Six of six S1 runs across both arms independently reached
  "the page is a Meridian document / scroll is the playhead." That is a property of the model or the
  brief, not of the skill, and the programme never isolated which.

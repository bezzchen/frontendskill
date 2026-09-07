# Success-bar status — where each pre-registered criterion actually stands (updated 2026-08-27)

One view of `rubrics/success_bar.md` criteria A–G: what is settled, what is waiting on a human
judgment, and what is waiting on runs. Nothing here re-interprets a criterion; where a reading is
contested the contest is named.

| Criterion | Status | Evidence / what's missing |
|---|---|---|
| **A** Routing guardrail | **MET** (2026-09-02) | Blind pooled scoring of all 25 runs by five independent fresh reviewers, one per eval, conditions withheld. Suite median **baseline 3.333 vs with-skill 3.667 (+0.334)** — the guardrail allowed a 0.10 *drop*; no eval fell by ≥0.50 (worst E5 −0.333); critical failures **5 across 3 baseline runs vs 1 in one with-skill run**, and that one shares a category two baseline runs were flagged for, so no new category. Exact Mann-Whitney p=0.032, effect size 0.713 — real but modest, and roughly half of it comes from E3 alone. Counterweight: the skill produced the pool's **worst** proposal too (E5-ws-rep3 at 2.000, renderer escalation), widening the range from [3.000,4.000] to [2.000,4.000]. NOT poolable with BLIND_SCORING_REP1's 3.833 (different reviewer/protocol). See `results/CRITERION_A_RESULT.md`. |
| **A**′ E6 weak-case rule | **NOT_MEASURED** (closed 2026-09-02) | The rule applies only to eval/model cells with a baseline median < 3.50, and Fable E6 (3.000) was the programme's only qualifying case. E6 cannot be scored under the prompt it was baselined with: 3/3 attempts implemented instead of proposing, because the original terminal instruction ('before implementing anything') was an order of operations, not a stop. The prompt was amended 2026-09-02 to match E1-E5, which **invalidates E6 rep 1 on both model arms** and restarts that cell at n=0. Recorded NOT_MEASURED rather than passed or failed. The owner's pending E6 rescore is now moot for this rule — a rescore of an invalidated run cannot revive it. See `results/deviations/E6_PROMPT_DEFECT.md`. |
| **B** Specialist-execution value | **Half-settled** | Measurement-gated dimensions are fully populated both conditions (`I2I5_WITHSKILL_FINDINGS.md`). On measurements: I2 0/3→3/3 operative pause, I5 1/3→2/3 binding, with two M3 flags against. The ≥ +0.50 composite needs the owner's scored judgment dimensions; the "convert a critical/version/build failure" clause is not triggered (baselines had none). |
| **C** Activation quality | **MET** | 70/70 across 14 queries × 5 fresh-context reps; all core positives 5/5, all near-miss negatives correct in every rep (`SECTION_D_FINDINGS.md`). |
| **D** Context/time overhead | **Routing clause now measurable** | Execution clause unchanged (no overhead detected). Routing clause: with-skill data exists, but **10/15 runs stalled and their reported costs are LOWER BOUNDS** — a parent's figure omits its orphaned child's spend (demonstrated: E4ws-rep3 parent 143k + orphan 231k = ~374k, i.e. 6.7x not the reported 2.5x; see `results/deviations/ORPHANED_CHILD_COST.md`). Only four stall-free runs have complete totals: **1.6x, 1.65x, 1.7x, 1.8x** baseline tokens (E4ws-rep1 at identical tool count). Defensible figure: **~1.6–1.8x for the skill itself**; empirical work costs more on top; the stall roughly doubles cost and hides half of it. |
| **E** Visual-quality gate | **Waiting on owner** | Screenshots at both viewports exist for all six with-skill implementation runs, plus three S1 recordings. No with-skill artifact has yet had its visual review. |
| **F** Register switching (Q1/W1 pairing) | **FAILED (owner ruling 2026-08-27)** | With-skill arm complete 2026-08-27 (Q1 ×3, W1 ×3): zero critical failures, zero deps in 5 of 6, registers named and spectacle explicitly declined in all six; timidity risk unrealised on the instrument side. F.2's measurable clause met. Pooled blind ranking unsealed: baseline medians rank 3, with-skill rank 4 → F.2's rank clause fails. Recorded as FAILED at face value. Context, not excuse: perfectly alternating result, exact rank-sum **p = 0.70**, and the reviewer declared all six equivalent — the criterion had no power to discriminate. `results/CRITERION_F_REGISTER_FINDINGS.md`. |
| **G1** S1 spectacle | **FAILED** (2026-09-02) | Pooled blind ranking of all six builds by three independent fresh reviewers. Four of five conjunctive clauses fail: with-skill median rank 4.67 vs baseline 3.00; composite median 2.500 vs 3.000 (−0.500); an M-battery regression (S1ws-rep1 M3 ratio 1.003 where baseline passed at 0.00); Original-integration −0.222. No new criticals. **Shape matters: the with-skill arm produced BOTH the best build (S1ws-rep2, unanimous first, 4.000, straight 4s from all three reviewers) and the two worst (1.750 unanimous last, 2.500).** Baselines cluster 2.667–3.333. The skill widened variance and the median test penalises that. Inter-rater agreement high (A and B identical rankings, C swapped one adjacent pair) — unlike F. p=0.80, no significance claimed; verdict rests on the clauses. Limitation: dimension 2 (interaction causality) EXCLUDED, not estimated — recordings could not be made reviewer-perceivable. See `results/CRITERION_G1_RESULT.md`. |
| **G2** S0 register recognition | **MET** | 3/3 with-skill classified into the S register and proposed a realtime graphical system, vs 0/3 baseline (bar was ≥2/3). |
| **G3** D1 catalog decision quality | **Met in substance, not in form** | No standalone with-skill D1 arm was run; the three D0 with-skill reps each produced verdicts meeting D1's evidence bar (cited sweeps, license gates, "adapt" over unjustified adoption). Recorded as a form gap so the owner can decide whether a D1 arm is still wanted. |
| **G4** D0 unprompted discovery | **MET** | 3/3 searched catalogs unprompted and met D1-grade decision quality, vs 0/3 baseline (bar was ≥2/3). |
| **G5** D2 abundance resistance | **MET** (non-regression, ceiling-limited) | With-skill 3/3 custom, 0 catalog primitives adopted vs baseline's 1; derivative flags 0 in all 9 cells. Baseline was already at ceiling, so no-harm is the strongest supported claim. See results/G5_D2_WITHSKILL_FINDINGS.md. |

## Reading the board

**Three criteria are met** (C, G2, G4), one is effectively met on measurements alone (B's
pause component), and **F has now been run and FAILED on the owner's ruling.** All three met criteria are of the same kind: they measure whether the skill
changes *behaviour the agent otherwise omits* — activation, register recognition, catalog search.
That is the pattern the whole project predicted, and it is now on the record with matched
baselines at 0/3.

**One criterion has now failed: F.** The pooled W1 ranking put with-skill median rank below
baseline, and the owner ruled it recorded at face value rather than revised. The same data shows
the comparison was underpowered (p = 0.70, reviewer called the six equivalent), so the defensible
claim is narrow: *the skill was not shown to improve expressive quality*. Separately, one
with-skill rep failed a pause measurement (I5ws-rep2) and three M-flags are recorded across the
programme.

**The gating shape is lopsided:** of the unsettled rows, most need only the Fable arm to
resume, and four need a human sitting down with recordings and screenshots for perhaps an hour
(`results/OWNER_SCORING_WORKSHEET.md`). No row is blocked on analysis or tooling.

## Pinnacle probe (outside the criteria, 2026-08-30)

The calibration ablation is **done at n=2**: spatial-3D adoption 2/2 vs a 0/3 baseline, and the
owner confirmed these outputs finally reach their stated ceiling. It sits outside criteria A–G by
design — it measures the *reference pack*, not the skill — but it reframes them: the skill governs
whether spectacle is considered, the pack governs how far it goes. See
`results/CALIBRATION_ABLATION_FINDINGS.md`.

## The cheapest paths to a verdict

1. **Owner scoring session** — now unblocks A′, B's composite, E, **all of F**, and G1's baseline
   half. Needs no model arm at all, and F is the only criterion still capable of failing.
2. **With-skill routing arm (E1–E6)** — the single cheapest run wave, and it closes criterion A
   *and* criterion D's routing clause together.
3. ~~With-skill register arm~~ — **done 2026-08-27**; see `results/CRITERION_F_REGISTER_FINDINGS.md`.

S1 with-skill and the calibration ablation are the most expensive arms and answer the owner's
"pinnacle" question; they are worth running last, once the cheap criteria are settled.

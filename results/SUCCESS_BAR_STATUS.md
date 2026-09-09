# Success-bar status — where each pre-registered criterion actually stands (updated 2026-09-09)

> **Which body was measured.** Every row below was measured against **v1**, now preserved at
> `skill/creative-frontend-architect/SKILL.v1-frozen.md`. `SKILL.md` was cut over to **v1.1 rev2**
> on 2026-09-09. Only criterion **C** transfers to v1.1 by construction (the activation surface is
> byte-identical — see its row). Every other row describes v1 and must not be read as a v1.1
> result. v1.1 itself has been measured on **process and cost only**
> (`results/V11_INLINE_VALIDATION_RESULT.md`); its output quality has never been scored.
>
> **v1.2 (2026-09-09) is shipped and unmeasured.** It adds an ask-the-requester rule for briefs
> that name no level and grant no license. **No criterion below has been measured against v1.2**,
> and **G2 is at explicit regression risk** — see its row and `CHANGELOG_v1.2.md`.

One view of `rubrics/success_bar.md` criteria A–G: what is settled, what is waiting on a human
judgment, and what is waiting on runs. Nothing here re-interprets a criterion; where a reading is
contested the contest is named.

| Criterion | Status | Evidence / what's missing |
|---|---|---|
| **A** Routing guardrail | **MET — qualified** (2026-09-02, qualifier added 2026-09-07) | Blind pooled scoring by five independent fresh reviewers: suite median **baseline 3.333 vs with-skill 3.667 (+0.334)**, no eval fell ≥0.50, no new critical-failure category; exact p=0.032, effect 0.713, though ~half the gain is E3 alone. **Qualifier:** the frozen rule requires three baseline repetitions *per model arm*; this pass used **two** baseline reps per eval (rep 1 exists but was scored under a different reviewer and protocol and was not pooled), and covers **five evals on the Fable arm only** — E6 is excluded for its prompt defect and the Opus arm was never extended. Read as a qualified five-eval Fable result, not an unqualified completion of the frozen gate. See `results/CRITERION_A_RESULT.md`. |
| **A**′ E6 weak-case rule | **NOT_MEASURED** (closed 2026-09-02) | The rule applies only to eval/model cells with a baseline median < 3.50, and Fable E6 (3.000) was the programme's only qualifying case. E6 cannot be scored under the prompt it was baselined with: 3/3 attempts implemented instead of proposing, because the original terminal instruction ('before implementing anything') was an order of operations, not a stop. The prompt was amended 2026-09-02 to match E1-E5, which **invalidates E6 rep 1 on both model arms** and restarts that cell at n=0. Recorded NOT_MEASURED rather than passed or failed. The owner's pending E6 rescore is now moot for this rule — a rescore of an invalidated run cannot revive it. See `results/deviations/E6_PROMPT_DEFECT.md`. |
| **B** Specialist-execution value | **Half-settled** | Measurement-gated dimensions are fully populated both conditions (`I2I5_WITHSKILL_FINDINGS.md`). On measurements: I2 0/3→3/3 operative pause, I5 1/3→2/3 binding, with two M3 flags against. The ≥ +0.50 composite needs the owner's scored judgment dimensions; the "convert a critical/version/build failure" clause is not triggered (baselines had none). |
| **C** Activation quality | **MET — scope-limited** | 70/70 across 14 queries × 5 fresh-context reps; all core positives 5/5, all near-miss negatives correct every rep (`SECTION_D_FINDINGS.md`). **Scope:** this is description-classification against a **fixed six-skill roster supplied in the prompt**. It does not measure installation, selection and use against a user's full real skill roster in a live task. Strong evidence that the name+description discriminate; not evidence of real-world activation. **Transfers to v1.1 rev2 by construction** (verified 2026-09-08): the probe shows names+descriptions only — "the body is not shown, matching how activation works at runtime" — and v1.1's `name`/`description` are byte-identical to v1's, as is the description frozen in the protocol (967 bytes). This is the one row that is not v1-only. |
| **D** Context/time overhead | **MET — provisional** (2026-09-02, qualifier added 2026-09-07) | Routing **~1.6–1.8x** baseline tokens (n=4 stall-free runs, median 1.67x). Execution **0.98x — no overhead**. **Provisional because:** the execution ratio rests on three with-skill runs against **one approximate baseline figure**, and that baseline rep had to reconstruct a wiped project; the routing figure **excludes orphaned-child cost** for the 10/15 stalled runs (true costs measured at 6.7x and 5.4x on two of them); and the headline number assumed the **then-untested** inline-sweep fix. **Update 2026-09-08:** that fix has now been tested — and the stall it addresses did not occur in either arm (v1 0/5, v1.1 0/5, Fisher p=1.0), so it cannot be credited with fixing anything, and whether the stall is genuinely gone or was masked by orchestrator concurrency is unresolved (`results/deviations/V11VAL_CONCURRENCY_CONFOUND.md`). The 1.6–1.8x figure still rests on the 4 stall-free historical runs; the 10 new runs give a v1.1/v1 ratio, not a skill/baseline ratio, so they do not replace it. See `results/CRITERION_D_RESULT.md` and `results/V11_INLINE_VALIDATION_RESULT.md`. |
| **E** Visual-quality gate | **Waiting on owner** | Screenshots at both viewports exist for all six with-skill implementation runs, plus three S1 recordings. No with-skill artifact has yet had its visual review. |
| **F** Register switching (Q1/W1 pairing) | **FAILED (owner ruling 2026-08-27)** | With-skill arm complete 2026-08-27 (Q1 ×3, W1 ×3): zero critical failures, zero deps in 5 of 6, registers named and spectacle explicitly declined in all six; timidity risk unrealised on the instrument side. F.2's measurable clause met. Pooled blind ranking unsealed: baseline medians rank 3, with-skill rank 4 → F.2's rank clause fails. Recorded as FAILED at face value. Context, not excuse: perfectly alternating result, exact rank-sum **p = 0.70**, and the reviewer declared all six equivalent — the criterion had no power to discriminate. `results/CRITERION_F_REGISTER_FINDINGS.md`. |
| **G1** S1 spectacle | **FAILED** (2026-09-02) | Pooled blind ranking of all six builds by three independent fresh reviewers. Four of five conjunctive clauses fail: with-skill median rank 4.67 vs baseline 3.00; composite median 2.500 vs 3.000 (−0.500); an M-battery regression (S1ws-rep1 M3 ratio 1.003 where baseline passed at 0.00); Original-integration −0.222. No new criticals. **Shape matters: the with-skill arm produced BOTH the best build (S1ws-rep2, unanimous first, 4.000, straight 4s from all three reviewers) and the two worst (1.750 unanimous last, 2.500).** Baselines cluster 2.667–3.333. The skill widened variance and the median test penalises that. Inter-rater agreement high (A and B identical rankings, C swapped one adjacent pair) — unlike F. p=0.80, no significance claimed; verdict rests on the clauses. Limitation: dimension 2 (interaction causality) EXCLUDED, not estimated — recordings could not be made reviewer-perceivable. See `results/CRITERION_G1_RESULT.md`. |
| **G2** S0 register recognition | **MET for v1 / v1.1 — AT RISK for v1.2** | 3/3 with-skill classified into the S register and proposed a realtime graphical system, vs 0/3 baseline (bar was ≥2/3). **v1.2 caveat:** the bar requires *proposing*, and v1.2 adds a rule that stops to ask when a brief names no level. S0 grants "full creative license", which v1.2 defines as settled — so it should still decide — but that is **intent, not measurement**. If v1.2 asks on S0 instead of proposing, G2 fails as written. Re-run before claiming G2 for v1.2. |
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

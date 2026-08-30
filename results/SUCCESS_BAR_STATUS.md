# Success-bar status — where each pre-registered criterion actually stands (updated 2026-08-27)

One view of `rubrics/success_bar.md` criteria A–G: what is settled, what is waiting on a human
judgment, and what is waiting on runs. Nothing here re-interprets a criterion; where a reading is
contested the contest is named.

| Criterion | Status | Evidence / what's missing |
|---|---|---|
| **A** Routing guardrail | **Blocked on runs** | Baselines complete (Fable load-bearing median 3.833, Opus 4.000, 18 per-run records). No with-skill routing arm exists yet — it is the cheapest remaining arm (~95k tokens, ~8 min/run). Its weak-case sub-rule additionally waits on the E6 rescore. |
| **A**′ E6 weak-case rule | **Waiting on owner** | `results/E6_RESCORE_DOSSIER.md`. Only a score of 4 lifts E6 above 3.50; 2→3 keeps the rule binding. E6 reps 2–3 also unrun, so the case stays single-observation either way. |
| **B** Specialist-execution value | **Half-settled** | Measurement-gated dimensions are fully populated both conditions (`I2I5_WITHSKILL_FINDINGS.md`). On measurements: I2 0/3→3/3 operative pause, I5 1/3→2/3 binding, with two M3 flags against. The ≥ +0.50 composite needs the owner's scored judgment dimensions; the "convert a critical/version/build failure" clause is not triggered (baselines had none). |
| **C** Activation quality | **MET** | 70/70 across 14 queries × 5 fresh-context reps; all core positives 5/5, all near-miss negatives correct in every rep (`SECTION_D_FINDINGS.md`). |
| **D** Context/time overhead | **Half-blocked** | Execution clause: indicative, **no overhead detected** (with-skill I2 median 245k vs baseline range 250–300k). Routing clause: no with-skill routing data. Recording gap documented and half-fixed — with-skill records now carry `cost`; baselines can't be reconstructed (`CRITERION_D_ACCOUNTING.md`). |
| **E** Visual-quality gate | **Waiting on owner** | Screenshots at both viewports exist for all six with-skill implementation runs, plus three S1 recordings. No with-skill artifact has yet had its visual review. |
| **F** Register switching (Q1/W1 pairing) | **FAILED (owner ruling 2026-08-27)** | With-skill arm complete 2026-08-27 (Q1 ×3, W1 ×3): zero critical failures, zero deps in 5 of 6, registers named and spectacle explicitly declined in all six; timidity risk unrealised on the instrument side. F.2's measurable clause met. Pooled blind ranking unsealed: baseline medians rank 3, with-skill rank 4 → F.2's rank clause fails. Recorded as FAILED at face value. Context, not excuse: perfectly alternating result, exact rank-sum **p = 0.70**, and the reviewer declared all six equivalent — the criterion had no power to discriminate. `results/CRITERION_F_REGISTER_FINDINGS.md`. |
| **G1** S1 spectacle | **Blocked on runs** | Baseline closed at 3 reps with all measurable cells passing; blind set built and sealed. Needs the with-skill S1 arm and the pooled ranking. Owner's blind ranking of the baseline three is ready to do now. |
| **G2** S0 register recognition | **MET** | 3/3 with-skill classified into the S register and proposed a realtime graphical system, vs 0/3 baseline (bar was ≥2/3). |
| **G3** D1 catalog decision quality | **Met in substance, not in form** | No standalone with-skill D1 arm was run; the three D0 with-skill reps each produced verdicts meeting D1's evidence bar (cited sweeps, license gates, "adapt" over unjustified adoption). Recorded as a form gap so the owner can decide whether a D1 arm is still wanted. |
| **G4** D0 unprompted discovery | **MET** | 3/3 searched catalogs unprompted and met D1-grade decision quality, vs 0/3 baseline (bar was ≥2/3). |
| **G5** D2 abundance resistance | **Blocked on runs** | Baseline established (3/3 resisted, zero derivative drift vs controls). No with-skill D2 arm. |

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

**The gating shape is lopsided:** of the nine unsettled rows, five need only the Fable arm to
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

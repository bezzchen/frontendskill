# Criterion D — context/time overhead accounting (2026-08-25)

Criterion D has two clauses: routing overhead **> 20%** with flat quality means "reduce the
router"; specialist-execution overhead **> 30%** requires a measurable quality/reliability gain.
This is the first attempt to evaluate either. Status: **one clause indicative, one clause
blocked, and a recording gap found.**

## What the data actually supports

| Clause | Baseline data | With-skill data | Status |
|---|---|---|---|
| Routing ≤ 20% | **Yes** — per-run tokens + duration for all 18 rep-1 routing runs (`results/rep1_runs.json`) | **None** — no with-skill routing arm has been run | **Blocked on runs** (needs the Fable arm), not on analysis |
| Specialist execution ≤ 30% | **Partial** — I2 only, and only as an aggregate range ("~250–300k tokens, 46–67 min each", `SONNET_AND_LAYERC_FINDINGS.md`); **no I5 baseline cost data at all** | **Yes** — per-run figures for all six with-skill implementation runs | **Indicative only** |

## Indicative execution-overhead comparison (I2, the only comparable case)

Token figures are *total context tokens* as reported by the orchestrating harness (the convention
set in `rep1_runs.json`), **not** cumulative spend — they measure how large a context the run
grew, which is the closest available proxy and is consistent across both conditions.

| | tokens | wall-clock |
|---|---|---|
| I2 baseline ×3 | ~250–300k (range as recorded) | 46–67 min |
| I2 with-skill rep1 | ~245–256k (three stops; spend-limit interruption) | interrupted; ~71 min elapsed incl. idle |
| I2 with-skill rep2 | 240k | 43.5 min |
| I2 with-skill rep3 | 311k | 58.6 min |
| **I2 with-skill median** | **245k** | **~58.6 min** (rep1 excluded: interrupted) |

**Reading: no execution overhead detected.** The with-skill median (245k) sits at or below the
baseline range's midpoint (~275k), and durations overlap the baseline band. The 30% ceiling
(~325-390k against the baseline range) is not approached by any rep; the highest with-skill run
(311k) remains inside the baseline's own upper bound. I5 with-skill (218–313k, median 241k) are recorded for future comparison but have **no baseline to compare against**.

Caveats, stated rather than buried: the baseline figure is a range not a per-run series, so no
proper median or dispersion exists on that side; one with-skill rep was interrupted, making its
wall-clock unusable; and n=3 per condition cannot separate a small effect from run-to-run noise.
This is an indication that the skill is not expensive at execution time — **not** a criterion D
pass, which the owner should only record once the routing clause has data.

## Recording gap found (worth fixing before further arms)

`evals/implementation_evals.json > capture` already requires "token usage" and "duration" per
run. The baseline implementation wave did not persist them per-run — they survive only as prose
in a findings document, and not at all for I5. Recommendation (not applied; the owner owns
harness changes): have the battery write `tokens` and `duration_ms` into each
`*.record.json`, exactly as `rep1_runs.json` does for routing, so criterion D becomes a
computation rather than an archaeology exercise. **Partially self-executed:** the six with-skill records were backfilled on 2026-08-25 with a
`cost` block (`tokens`, `duration_ms`, convention, and per-run caveats), so the with-skill side
of any future comparison is now a computation. The baseline side cannot be reconstructed — those
transcripts are gone — so the asymmetry is permanent for these arms.

## What would close criterion D

1. A with-skill routing arm (E1–E6 with the skill loaded) — the only missing piece for the
   20% clause, and cheap: routing runs are plan-only and averaged ~95k tokens / ~8 min each.
2. Per-run cost fields in the record schema going forward.
Neither is doable without the Fable arm (1) or an owner decision (2).

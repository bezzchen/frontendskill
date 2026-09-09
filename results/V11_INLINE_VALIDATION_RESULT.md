# v1.1 inline-sweep validation — result, 2026-09-08

Pre-registration: `evals/v11_inline_validation.md` (sha256 `c6de065e…`), frozen before launch.
Confound recorded mid-arm, before results were written: `results/deviations/V11VAL_CONCURRENCY_CONFOUND.md`.

## Headline

**The pre-registered primary endpoint returned no difference, because there was nothing left to
measure.** Neither skill body stalled once. v1.1's headline change — "run the sweep inline" —
cannot be credited with fixing the stall, because v1 did not stall either.

A second, unplanned result is cleaner than the one the arm was built for: **v1.1 was cheaper on
5 of 5 prompts.**

## Primary endpoint — stalls

| | stalls | delegations | sweep genuinely ran |
|---|---|---|---|
| v1 (concurrent control) | **0/5** | 0/5 | 5/5 |
| v1.1 rev2 | **0/5** | 0/5 | 5/5 |

Fisher exact, one-sided: **p = 1.0000**. Decision rule 2 fires (v1 stalls ≤1/5).

Per-prompt detail (`stalled / delegated / sweep_ran`, all five prompts, both arms):

| prompt | v1 | v1 tokens | v1.1 | v1.1 tokens |
|---|---|---|---|---|
| E1 | n/n/Y | 111,481 | n/n/Y | 102,351 |
| E2 | n/n/Y | 159,506 | n/n/Y | 129,241 |
| E3 | n/n/Y | 102,248 | n/n/Y | 91,299 |
| E4 | n/n/Y | 130,285 | n/n/Y | 103,737 |
| E5 | n/n/Y | 108,940 | n/n/Y | 95,927 |

**No degenerate passes.** Rule 1 required `sweep_ran` in ≥4/5 v1.1 runs specifically to catch a
v1.1 that avoids stalling by skipping the mandated work. All 10 runs produced real per-primitive
fit-gate tables with named catalogs and cited verdicts. Neither arm dodged.

## Secondary endpoint — cost

| prompt | v1.1 − v1 (tokens) |
|---|---|
| E1 | −9,130 |
| E2 | −30,265 |
| E3 | −10,949 |
| E4 | −26,548 |
| E5 | −13,013 |

5/5 in the same direction. Median paired delta **−13,013**. Mean tool calls **20.6 (v1.1) vs
27.8 (v1)**.

**Honest limit:** tokens were pre-registered as a secondary endpoint but **no direction was
pre-specified**, so this is suggestive, not confirmatory. One-sided sign test p = 0.031, and that
test was chosen after seeing the data. It is at least the direction v1.1's bounded-search rule was
written to produce ("stop as soon as the evidence supports a verdict — this is a sourcing check,
not a survey").

## v1 today vs v1 historically

0/5 today against **10/15** on 2026-09-02 → Fisher one-sided **p = 0.016**. Something genuinely
changed. What changed is **not** established:

- **(a)** the environment changed (notification routing, or model behaviour), or
- **(b)** the orchestrator's own 10-way concurrency suppressed child-spawning in both arms equally.

### Discriminator run

One v1 run, **solo**, nothing else in flight, on E4 (the prompt carrying the best-documented
historical stall — the 6.7× orphan in `ORPHANED_CHILD_COST.md`). Result: **did not delegate, did
not stall, sweep ran** (126,335 tokens, 48 tool calls).

Under (b) a solo run was free to delegate and would have stalled with probability 0.667, so this is
evidence against (b) — **at p = 0.333, which is weak, exactly as pre-registered.** The
pre-registration fixed the asymmetry in advance: strong only in the *delegates* direction. It did
not delegate, so the absolute rates are **not voided** — and **not confirmed** either.

Pooling all v1 runs today gives 0/6 vs 10/15, p = 0.0085, but **5 of those 6 share the confound.
Confound-free evidence is n = 1.** Settling it would take 3–5 further *serial* solo runs
(3 clean → p = 0.037; 5 clean → p = 0.004).

**It was not run, deliberately.** The cutover decision is robust to the ambiguity:

- if the stall is genuinely gone → cutover is justified by the cost result;
- if concurrency masked a still-live stall → cutover is justified by the fix it was drafted for.

Both branches favour v1.1 or are neutral. Resolving the confound would change **what the
documentation may claim**, not what to ship. Recorded so the weaker claim is never written as
settled.

## Diagnostic (not an endpoint): v1.1's other edits are visibly landing

Unblinded reading of 5 proposals by an orchestrator who knew the arms — the weakest evidence class
in this programme, labelled as such. Recorded because the signal was consistent:

- **V11-E5 declined Pixi citing "the `Ticker.system`/EventSystem pause trap"** unprompted. Only
  v1.1 names `Ticker.system`. On the same prompt, V1C-E5 named Pixi's "shared ticker that runs by
  default" — generic, matching v1's own wording. The contrast is exactly the edit.
- Section headers adopting the wording: *"Catalog fit gate (bounded sweep, run inline)"*.
- The unreachable-catalog path fired for real four times (React Bits SPA shell, fancycomponents.dev
  500, originui.com 403, SmoothUI 404) — recorded as limitations rather than glossed.
- The stand-in labelling rule: *"never a dispatched `visibilitychange`"*, *"label any synthetic
  stand-in as such"*.
- Attribution rather than verdict: *"any residual is attributed and explained"*.

## Criterion C — closed by inspection, zero runs

`evals/trigger_probe_protocol.md` shows the probe agent **names + descriptions only** — "the body
is not shown, matching how activation works at runtime". Verified 2026-09-08: the description
frozen in the protocol is byte-identical (967 bytes) to live `SKILL.md`'s, and v1.1's `name` and
`description` are byte-identical to v1's. The activation surface is unchanged, so **70/70 transfers
by construction**, with its existing scope limitation intact. Re-running 70 probes would have
measured nothing.

## Instrument check prompted by a run

V11-E2 reported that `animejs` **captures `requestAnimationFrame` at module load**, so a wrapper
installed after the module evaluates attributes nothing — a candidate false-pass path on
`anime-v4-portfolio`, the one fixture shipping Anime.js. **Checked: not a defect.**
`scripts/measure_execution.mjs` calls `ctx.addInitScript(INIT)` (char 4879) before `page.goto`
(char 5199), so the wrapper is installed before any page module evaluates. No M1 result is affected.

## Confounds

1. **Arm-aware orchestration**, unblinded. Mitigated by fixing the stall definition in advance;
   not eliminated. The diagnostic section above is the part most exposed to it and is labelled.
2. **n = 1 per cell.** Only pooled rates are estimable.
3. **The concurrency confound above** — the single largest limit on this arm's absolute claims.
4. Standing `withskill_protocol.md` confounds unchanged.
5. **Operational note:** 10 concurrent Fable agents were launched despite
   `WAVE_RECORD_ROUTING_BASELINE.json` recording that a prior wave declined to run 12 for exactly
   this reason. Should have been staggered.

## What this changes on the board

- **Criterion C:** carries over to v1.1 unchanged (MET — scope-limited).
- **Criterion D:** the routing overhead figure was flagged provisional partly because it "assumes
  the **untested** inline-sweep fix". The fix is now tested — and found unnecessary under current
  conditions. The 1.6–1.8× figure still rests on 4 stall-free historical runs; today's 10 runs are
  all stall-free and give a v1.1/v1 ratio, not a skill/baseline ratio, so they do not replace it.
- **v1.1 cutover:** supported, but on **cost**, not on the stall fix its changelog claims.

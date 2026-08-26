# Section E — I2/I5 with-skill arm (primary efficacy test), 2026-08-25

Six serialized implementation runs (`with_skill_v1`, pristine pinned fixtures, full independent
batteries on GPU Chrome with the v2.6 M2b instrument). Records:
`results/execution/I{2,5}ws-fable-rep{1,2,3}.record.json`.

## Headline: the pre-registered pause target is MET on the binding case — with real variance

**I5 (PixiJS — the library-ticker trap; pause explicitly demanded by the prompt):**

| | M2 scroll-out (binding) | M2b hidden | M3 reduced-motion | Verdict |
|---|---|---|---|---|
| baseline rep1 | 0.51 partial FAIL (own loop stopped, shared ticker survived) | — (pre-instrument) | pass | FAIL |
| baseline rep2 | 0.00 PASS (silenced Ticker.system too) | — | pass | PASS |
| baseline rep3 | 0.99 FAIL (proxy-verified via document.hidden) | — | pass | FAIL |
| **ws rep1** | **0.00 PASS (mobile binding; desktop geometry-gated)** | 0.00 | desktop 0.00 / **mobile 0.358 FAIL** | PASS w/ M3 flag |
| **ws rep2** | **0.50 FAIL (mobile binding)** | **0.50 FAIL** | **0.50 FAIL both** | **FAIL** |
| **ws rep3** | **0.00 PASS (BOTH profiles binding)** | 0.00 | 0.00 both | **PASS — clean sweep** |

**I5 with-skill: 2/3 ≤ 0.2 → the pre-registered success condition ("M2 ≤ 0.2 in ≥ 2/3 reps") is
MET**, against a 1/3 baseline. Not saturated: rep2 reproduced the baseline-rep1 failure class one
layer deeper — its own dedicated ticker stopped everywhere, but the exact-half signature (0.50 on
every should-stop probe) matches Pixi v8's autostarting `Ticker.system` GC scheduler, which reps 1
and 3 explicitly gated (0.00 in the identical battery). Attribution is a high-confidence inference
from that differential, not directly observed. Rep2 also self-verified by counting its own
ticker's frames — a proxy, the precise skill-line-2 failure mode; the instrument caught it.

**I2 (Anime.js — pause never mentioned in the prompt; baseline M2 0/3 at ratio 1.00):**

All three with-skill reps built **top-of-page compositions**, so the scroll-away M2 never bound
(geometry gate, mechanical, 71–92% still visible) — an honest comparability limit: baselines put
the viz below the fold and failed; with-skill runs changed the layout class. Under the
pre-registered operative-measure clause (v2.6 amendment), M2b decides: **3/3 PASS at ratio 0.00
with clean resume**, plus M1 60fps, M3 parity, zero dependency changes, and no anime-v3 patterns.
Read strictly on M2 alone, I2ws is "not comparable" rather than pass/fail; read per the
pre-registered operative clause, pause discipline is 3/3. Both readings stated; the owner's
success-bar application should cite whichever it uses.

## Follow-up investigations (2026-08-25) — two inferences upgraded to observations

### (a) rep2's failure attribution is now OBSERVED, not inferred

A one-off probe (`scripts/investigations/attribution_probe2.mjs`; raw result
`results/execution/I5ws-rep2-ATTRIBUTION.json`) tallied `requestAnimationFrame` **by callback
identity**, so independent loops count separately, on the mobile profile where the section
fully exits the viewport (visible fraction asserted 0.00 before sampling):

| | active | paused (fully offscreen) |
|---|---|---|
| **ws rep2** (harness FAIL 0.50) | **2** Pixi `Ticker._tick` loops, 60/s each | **1 survives at 60/s** |
| **ws rep3** (harness PASS 0.00) — matched control | **2** Pixi `Ticker._tick` loops, 60/s each | **0 — empty tally** |

Both builds run two independent Pixi tickers while active; rep3 stops both on scroll-out,
rep2 stops only its own. One surviving 60/s loop out of two is arithmetically the 0.50 the
harness measured on every should-stop probe. The residual one-step inference — that the
survivor is `Ticker.system` rather than `Ticker.shared` — rests on rep2's own
`sharedTicker: false` config, Pixi v8's autostart of `Ticker.system` for SchedulerSystem GC,
and rep3's documented lockstep gating of exactly that ticker producing zero survivors under
the identical probe. `Ticker.system.started` was never read directly (neither build's debug
hook reaches the Ticker class), so that last step is stated as inference backed by a matched
control rather than as a direct reading.

**Why this matters beyond bookkeeping:** rep2's agent verified pausing with its *own* ticker's
frame counter, which correctly read zero — while a second Pixi loop ran at full rate the whole
time. That is skill line 2's failure mode reproduced in miniature, and it sharpens the v1.1
candidate below from "name the ticker" to "verify globally."

### (b) rep1's mobile M3 flag is settle latency — measured, not assumed

`scripts/investigations/decay_probe.mjs` (raw: `results/execution/I5ws-rep1-M3-DECAY.json`)
sampled eight consecutive 2s windows under `prefers-reduced-motion` on the mobile profile:

```
94.5, 0, 0, 0, 0, 0, 0, 0   rAF/s
```

Activity is confined to the first ~2s and is then **exactly zero for the following 14 seconds**.
M3's single 3s window opens as the section enters view, so it captures the settle tail —
~1.4s of activity averaged over 3s reproduces the measured 43 rAF/s (ratio 0.358) almost
exactly. **The FAIL stands as measured** (thresholds are not renegotiated after the fact, and
a page that animates for ~1.5–2s after a reduced-motion load is doing something real), but the
diagnosis is now observed rather than hypothesised: nothing runs forever. This is the direct
evidence for v1.1 candidate #3 ("paused means promptly"), and it suggests a future *instrument*
note — M3 could report a decay series alongside the single-window ratio, separating latency
from persistence mechanically (not applied; the thresholds are frozen).

## Cross-arm observations

1. **Pause discipline totals: 5/6 reps verified pausing under at least one binding or operative
   instrument condition (all six at 0.00 where they passed); 1/6 failed outright.** Baseline
   equivalent: I2 0/3 + I5 1/3.
2. **M3 regressions appeared with-skill (I5 reps 1–2)** — new relative to baseline I5's clean M3
   record. Rep1: stop-latency breach (0.358 mobile; auto-sleep ~1.5s at the 30fps cap) with full
   parity. Rep2: same 0.50 root cause as its M2 fail. No content was ever lost (parity true
   everywhere), so no critical-failure category was introduced, but the dimension regressed on
   those reps and is recorded as such for the criterion B composite.
3. **Register discipline generalized:** every rep named a register unprompted (I2: S-scoped, W,
   W; I5: S-bounded ×3), each with reasons.
4. **Freshness line visibly working:** I2 reps discovered and adopted anime 4.5's new first-party
   AutoLayout FLIP by reading the installed package; all Pixi APIs source-verified; zero stale-API
   usage anywhere. Restraint held: dependency diffs are exactly the pinned specialist or nothing.
5. **Verification depth rose with honesty:** raw-CDP genuine hidden-tab tests, refusals to fake
   unproducible conditions, self-caught bugs (AutoLayout style-restore stomp, hover-repulsion
   dead-zone, two category-dropping mobile subsample bugs). One rep verified via proxy and paid
   for it (rep2's FAIL).
6. **Interruption protocol held:** two org spend-limit kills (I2ws-rep1, I5ws-rep3) resumed from
   transcripts with run dirs undisturbed; both reps completed validly.

## Skill v1.1 candidates (NOT applied — freeze rules; owner decides after Section E)

- Line 1's example could name the deeper default: "e.g. Pixi's shared ticker *and* v8's
  `Ticker.system` scheduler" — the trap that survived in 1/3 with-skill reps.
- Line 2 could demand global verification: "verify by observing global rAF activity, not your own
  loop's counter."
- Possible line-1 nuance from the I5 M3 flags: "paused means promptly — a sleep that takes
  seconds to settle still reads as running."

## Criterion B status (specialist-execution value)

Measurement-gated dimensions are now fully populated for both conditions; the composite also needs
the owner's judgment scores (Tool Depth nuance, Conceptual Fit, etc.) per `scoring_rubric.md`.
On measurements alone: I2ws converts baseline's 0/3 pause failure into 3/3 operative passes with
equal-or-better M1/M3/M5/M6; I5ws converts 1/3 into 2/3 binding passes at the cost of two M3
flags. The "convert a baseline critical/version/build failure" clause is not triggered (baselines
had none); the ≥ +0.50 composite comparison awaits the owner's scored dimensions.

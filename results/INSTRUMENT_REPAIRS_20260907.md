# Four false-pass paths repaired (2026-09-07)

Prompted by an external appraisal of commit `815aa7c`. **Every claim was independently reproduced in
this harness before being accepted**, and the repairs were pre-registered in
`rubrics/execution_measurement.md` before any code changed. Pre-repair copies retained as
`scripts/*.pre-20260907`.

## The four defects — all confirmed

| # | defect | reproduction |
|---|---|---|
| **M1** | one `last` timestamp shared across all rAF callbacks; extra callbacks in a frame push zero-length intervals that dilute `hitchPct` | Live two-loop control: OLD reports `p50=0ms, hitch 0.965% → PASS`; repaired reports `16.7ms, 1.935% → FAIL` against ~2% ground truth |
| **M3** | parity measured on `textContent`, which includes `display:none` subtrees | `smoke_controls/m3-display-none.html`: OLD sees 206 chars both states → parity TRUE on a page rendering nothing |
| **M5** | `axNames > 0 && focusables > 0` — any named element anywhere passes | `smoke_controls/m5-inventory-only.html`: one `aria-hidden`, disabled button satisfied the old gate |
| **M6** | `case "$ver" in *"8."*)` substring-matched the pin | declared `^7.8.0` PASSED a Pixi-v8 gate; repaired reports `FAIL (major=7, want 8)` |

## Blast radius — which archived results were affected

The appraisal stated it could not establish which runs would change verdict. **It can be
established, and the answer is none.**

- **M1 dilution requires ≥2 rAF callbacks per frame.** Across 47 archived M1 measurements, exactly
  **12 show the multi-loop signature** (`rafPerSec ≈ 120`), and all 12 are in the **I5 (Pixi) cell** —
  the only cell with two concurrent tickers. Zero non-I5 records exceed 70 rAF/s.
- **In that cell the worst reported hitch is 0.106%.** Doubling it gives ~0.21% against a 1%
  threshold, and every p95 there sits at 17.2–18.4 ms, far under the 32 ms hitch bound. **No M1
  verdict changes.**
- **The S1 arm was re-measured end to end with the repaired instruments. All three verdicts are
  unchanged**: rep1 M3 FAIL (for the original reason — its loop keeps running, unrelated to the
  parity hole), reps 2 and 3 PASS.
- **What did change is the meaning of the M5 passes.** Previously "some named element exists";
  now 21 / 36 / 23 rendered, keyboard-reachable controls with real prose and a surface correctly
  hidden from the accessibility tree. The verdicts are the same; the evidence behind them is not.

## A false positive I introduced and caught

The first M5 patch checked `aria-hidden` on the surface element itself. **`aria-hidden` inherits**,
and the real S1ws-rep1 build hides its canvas via an ancestor wrapper — so the patch produced a
**false FAIL on a correct build**. Caught by running the control in both directions against a real
build before recording anything, and fixed with `closest('[aria-hidden="true"]')`.

A second over-reach was caught the same way: the surface check originally scanned every `canvas`/`svg`
on the page, which would false-FAIL any page carrying a decorative inline icon. Now scoped to the
measured section, per the amendment's own wording.

## What this says about the earlier repairs
The 2026-08-30 M3 amendment fixed a false *critical* and left a false *pass* in its place, because
its controls tested content **removal** and never content **hiding**. The lesson is not "test the
fix" — that was done — but **"a control only covers the failure mode it enacts."** The new controls
are kept in `smoke_controls/` and both 2026-08-30 controls were re-run to confirm no regression.

## Standing rule restated
These repairs correct **definitions of failure**, never thresholds. No threshold moved.
Historical records are labelled by instrument version rather than silently reinterpreted; the
`-REMEASURED` files sit alongside the originals rather than replacing them.

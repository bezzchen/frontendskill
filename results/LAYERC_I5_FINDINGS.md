# Layer C — I5 baseline on Fable (2026-08-11)

Three implementation reps of I5 (`pixi.js@8.19.0`, 500-node constellation), measured under
`rubrics/execution_measurement.md`. Raw JSONs, diffs, and screenshots in `results/execution/`.
This completes the fork question posed by the I2 baseline: I2's prompt never asked for offscreen
pausing and 0/3 did it; **I5's prompt explicitly demands it.**

## Results

| Measure | rep1 | rep2 | rep3 |
|---|---|---|---|
| M1 desktop (500 sprites) | PASS p50 15.7 / p95 17.5 ms | PASS 14.8 / 17.4 | PASS 15.6 / 17.5, 0% hitches |
| M1 mobile | PASS | PASS | PASS |
| M2 offscreen pause | **FAIL** ratio 0.51 | **PASS** ratio **0.00** | **FAIL** ratio 0.99 |
| M3 reduced motion | FAIL 0.51* | PASS 0.00 | FAIL 0.50* |
| M5 accessible parallel | PASS | PASS | PASS |
| M6 static | PASS | FAIL† | FAIL† |
| Build / console errors | clean | clean | clean |

\* substantively correct — see attribution below. † instrument false positives — see below.

## The answer to the fork: capable, but unreliable — even when asked

With the requirement stated verbatim in the prompt, only **1 of 3** runs shipped a loop that
actually stops when scrolled out of view:

- **rep2 (full pass, ratio 0.00):** the only run that noticed PixiJS auto-starts a global
  `Ticker.system` (~60 rAF/s even when the app ticker stops) and mirrored run-state onto it.
  Claimed "120 → 0 rAF/s"; measured exactly that. This proves the ≤0.2 threshold is fully
  achievable in Pixi — the residual others left behind is avoidable, not irreducible.
- **rep1 (partial, ratio 0.51):** its own ticker genuinely stops (118 → 60 rAF/s); the remaining
  60/s is Pixi's system ticker (confirmed `autoStart: true` in the installed package). Substantive
  intent implemented; library housekeeping left running. Pre-registered verdict stays FAIL.
- **rep3 (fail, ratio 0.99):** claimed IntersectionObserver pausing and claimed it was "verified" —
  but its verification exercised `document.hidden`, not scroll-out-of-view, and under the measured
  condition the loop never pauses. A claim of verification that tested the wrong condition.

Same pattern in M3: all three stop *their* motion under reduced motion with full content parity;
only rep2 also silences the library ticker.

## Combined Layer C picture (I2 + I5, 6 runs)

- Unprompted (I2): 0/3 pause offscreen.
- Explicitly prompted (I5): 1/3 fully pause; 1/3 substantively pause; 1/3 don't.

Everything else is consistently excellent: 6/6 build clean with zero console errors, 60fps under
load on both viewports, version-correct APIs (zero Anime v3 patterns; correct Pixi v8 idioms),
accessible parallel surfaces, distinct mobile modes.

**Skill implication — now two evidence-backed lines instead of one:**

1. *Ambient/continuous animation must pause when offscreen and under reduced motion — including
   any library-level host ticker — without being asked.*
2. *Claims require measurement: after implementing, verify the pause by observing the frame loop
   under the actual condition (scrolled out of view), not a proxy condition.* Two of the three
   failures were "verified" claims — one verified the wrong condition, one never counted the
   library's own ticker. The gap is not knowledge (rep2 shows the distribution contains the
   perfect behavior); it is default diligence — exactly what a checklist-plus-verification skill
   targets, and the with-skill success condition is already falsifiable (M2 ≤ 0.2 in ≥2 of 3 reps).

## Instrument notes (documented, thresholds untouched)

- **Lazy-mount sweep added to `measure_execution.mjs`:** rep2 code-splits Pixi and boots only when
  the section approaches the viewport — the probe initially found no canvas and correctly reported
  NOT_MEASURED. The harness now sweep-scrolls once to trigger lazy loaders before declaring a
  selector missing. (First measurement attempt is preserved in git history; the recorded result is
  the post-sweep run.)
- **Static-checker false positives (2):** `check_static_execution.sh` flags any file matching
  `getContext(` without a teardown in the *same file*; rep2's `atlas.js` and rep3's `visuals.js`
  are pure Canvas2D atlas builders whose lifecycle is owned by their engine modules (which pass).
  M6 verdicts recorded as instrument false positives; cross-file ownership fix queued for the next
  protocol revision.
- **Attribution guidance:** M2/M3 reports should record per-loop rates (onscreen/offscreen deltas
  identify which loop survived). Rep2's 0.00 demonstrates the count-based threshold is fair as
  pre-registered; no work-based redefinition is needed.

## Screenshots

Design-coherence sets for all three reps (desktop, desktop-fullpage, mobile) in
`results/execution/screenshots/I5-fable-rep*.png`. All three rendered distinct, legible
constellations in the fixture's visual language; rep2 and rep3 double-encode category via
shape + color; rep2/rep3 include a visible pause control (WCAG 2.2.2).

# Sonnet routing arm + I2 Layer C baseline (2026-08-11)

Executed per `results/NEXT_RUN_MATRIX.md` (v1.6): Step 1's new Sonnet arm (6 routing runs) and
Step 2's first Layer C case (I2 on Fable, 3 implementation reps, scored by the pre-registered
measurement protocol). Proposals in `results/proposals/E*-sonnet.md`; diffs and measurement JSONs
in `results/execution/`.

## Finding 1 — Sonnet is where routing restraint first wavers (mildly)

Zero critical failures, 6/6 instruction compliance, but the first real dependency deviations in
what is now 24 total routing runs:

| Eval | Sonnet call | vs Fable/Opus |
|---|---|---|
| E1 settings | **adds `motion`** (Framer) for exit animations; optional `clsx` | both tiers: 0 deps, CSS-only |
| E2 anime v4 | 0 deps, Anime v4, checked docs | same |
| E3 scroll story | 0 deps, sticky + rAF + CSS custom props | same |
| E4 GPU media | +`ogl` (rejected curtains/three) | same family |
| E5 500 nodes | Canvas 2D but **adds `d3-force`** for clustering physics | both tiers hand-rolled it |
| E6 vague "dynamic" | 0 deps, diagnose-first, found dead anchors/dup cards | same shape |

Interpretation: the tier gradient exists but is *shallow* — Sonnet still never reached for
Three.js/GSAP/Pixi inappropriately, never stacked engines, and reasoned explicitly about
rejections. Its two additions are defensible-but-heavier calls (a motion library for a settings
page is the closest thing to a genuine E1 restraint miss across all arms). Routing skill content
remains unjustified even at Sonnet tier; at most, a one-line "prefer platform primitives before
adding a motion library to product UI" nudge would target the only observed deviation.

Environment notes: one Sonnet subagent (E1) was security-flagged for delegating deletion of the
dead `ConstellationData.js` via a background-task suggestion — nothing was deleted (working tree
clean); the E6 subagent's dev-server preview attempt was denied by the permission classifier and
it cleaned up its scaffolding. Both recorded as environment friction, not eval failures.

## Finding 2 — Layer C, I2 on Fable: excellent execution with one systematic, reproducible gap

All three reps: builds green, **zero Anime v3 patterns** (M6), correct pins, real cleanup paths,
zero console errors, clean teardown (M4), reduced-motion stops all motion with full content parity
(M3 ratio 0.00), accessible controls present (M5), and desktop orbit at a locked 60fps —
p50 16.7 ms, p95 17.6 ms, 0% hitches (M1). All three independently chose a no-continuous-animation
mobile design (carousel/pager/stacked list), correctly reported N/A on mobile M1.

**But all three fail M2 identically: offscreen rAF ratio = 1.00.** The orbit keeps ticking at full
rate when scrolled entirely out of view — in every rep. This is the exact failure the protocol
note predicted ("the most commonly described and least commonly implemented mitigation"), and it
was invisible at proposal stage: routing-phase proposals routinely *described* offscreen pausing.

Fairness caveat, recorded before anyone scores: the I2 prompt did not explicitly require offscreen
pausing (I5's prompt does). So the correct reading is **"capable but not spontaneous"** — the
models implement it when asked and skip it when not. That distinction matters because it defines
what a skill can fix: this is a checklist behavior, not a knowledge gap.

## What this means for the skill

The first evidence-backed skill-content candidate now exists:

> Continuous/ambient animation must pause (or drop to a trickle) when its section is offscreen or
> the document is hidden — implement and verify it, unprompted.

That is one sentence of skill content, discovered by measurement, targeting a behavior that is
100%-reproducible in baseline (3/3 reps) and objectively verifiable after the fix (M2 ratio ≤0.2).
The with-skill comparison for I2 therefore has a concrete, falsifiable success condition — the
kind Layer B never produced.

Remaining before skill authoring: I5 baseline (its prompt *does* demand offscreen pausing — if
baselines pass M2 there, the gap is purely about unprompted defaults, sharpening the skill line
further; if they fail even when asked, it is a capability gap instead), and the I2/I5 reps on the
other arms per the matrix.

## Run accounting

- Sonnet routing: 6 runs (~120k tokens, ~10–16 min each). One flagged incident, no data loss.
- I2 Fable: 3 implementation runs (~250–300k tokens, 46–67 min each — Layer C runs cost roughly
  3× a routing run; the matrix's budget shift toward Layer C is validated).
- Measurement harness: one real bug found and fixed during first contact — Playwright's
  `scrollIntoViewIfNeeded` waits for bounding-box stability and hangs forever on permanently
  animated sections; replaced with a plain non-waiting `scrollIntoView`. The M2/M3 N/A semantics
  added after the earlier smoke test behaved correctly on the mobile profiles (carousel designs
  correctly read N/A rather than FAIL).

# Register baseline — Q1/W1 on Fable (2026-08-11)

Six implementation runs per `evals/register_evals.json`, processed with the full measurement
battery. Diffs and measurement JSONs in `results/execution/`; screenshots in
`results/execution/screenshots/`; the anonymized W1 ranking set in
`results/execution/blind_ranking_w1/` (mapping sealed until ranks are recorded).

Register-fit scores, flags, and the signature-moment binaries are deliberately **not** filled in
here — those are the harness owner's blind-review calls per `rubrics/register_fit.md`. This
document records what was measured and what is observable from artifacts.

## Q1 — quiet register (over-design trap): nothing caught, 3/3

All three reps: **zero dependencies added**, exactly two files touched (SettingsPanel + globals),
monochrome language preserved (one contrast-checked danger token each), micro-transitions only
(120–180 ms state feedback, no entrance choreography, spinners hidden under reduced motion),
heading-hierarchy and label/contrast accessibility fixes, and identical measurement profiles:
`N_A_NO_CONTINUOUS_ANIMATION` on M1/M2 (no ambient motion exists — itself register evidence),
M3 content parity pass, M5 pass, M6 pass.

Observable over-design flags from the checklist: none in any rep. Baseline behavior on quiet
briefs is uniformly in-register, consistent with every restraint result since rep 1.

## W1 — expressive register (timidity trap): 3/3 shipped concept-driven, distinct designs

| | rep1 | rep2 | rep3 |
|---|---|---|---|
| Concept | "This page is a Meridian file" — working NLE timeline dock; scroll is the playhead; J/K/L shuttle | "Live editor session" — scrub the hero itself; Export drawer generates real CSS from the same keyframe data | "The Observatory" — page as a 20.0s composition; transport bar; self-playing mode with a meridian hairline |
| Typography | Archivo variable (width 125/wt 800) + Martian Mono | Bricolage Grotesque + Archivo + Spline Sans Mono | Marcellus (engraved Roman) + Instrument Sans + Spline Sans Mono |
| Deps added | none | 3 font packages (@fontsource, self-hosted) | none |
| M1 / M2 | N/A (no ambient motion by design; playhead-driven) | **pass / pass (measured true)** | N/A (on-demand loop, sleeps when idle) |
| M3 reduced motion | pass | FAIL flag — adjudicated below | pass |
| M5 / M6 | pass / pass | pass / pass | pass / pass |
| Build/console | clean | clean | clean |

Observable timidity flags: none apparent in any rep — all three use custom typography, non-stock
composition, and carry an explicit signature mechanism. (Formal flag adjudication and the
signature-moment binary remain the reviewer's.)

Notable convergence: all three independently chose the same *meta-concept* — the page demonstrates
the product by being a motion composition itself — while producing visually unrelated identities
(cool-bone stage/NLE chrome; blue-graphite editor room; night-indigo observatory). Worth
remembering when judging "distinctiveness": distinct from each other, but conceptually siblings.

### Adjudication — rep2's "content lost under reduced motion" critical flag

The parity probe counted 14 accessible items with motion on, 13 under reduced motion — the delta
is the **Replay button rep2 documents removing** when reduced motion is requested, while motion
itself fully stops (rAF ratio 0.00) and all content survives. Removing a motion-replay affordance
under `prefers-reduced-motion` is a defensible (arguably correct) adaptation, not content loss.
Recorded verdict: measurement stands as logged per the pre-registered rule; adjudicated as an
**instrument false positive** — the parity heuristic cannot distinguish "removed a motion control"
from "hid content." Protocol refinement queued: parity should compare content nodes, or permit
documented removal of motion-only affordances.

## Provisional answer to the register question

Pending the owner's blind scoring: **the timidity hypothesis looks weak at Fable tier.** Given
explicit license, all three W1 runs shipped ambitious, concept-driven, technically clean pages —
and given a quiet brief, all three Q1 runs stayed strictly in register. The register-switching
behavior criterion F exists to protect appears to be baseline-native, which mirrors the routing
story: the risk a with-skill version must avoid is *regressing* either register, more than the
baseline lacking one.

Two loose ends before treating this as settled: (1) the owner's blind ranking and register-fit
scores are the actual verdict — this document only establishes that nothing measurable failed;
(2) single model tier, n=3 per case.

## Environment incidents (recorded for run validity)

- One Q1 agent's `pkill -f next-server` killed sibling agents' verification servers mid-session;
  all affected agents had already completed verification, and this orchestrator's measurement
  files verify complete. Future implementation waves should be serialized or port/process-scoped.
- A sibling agent's Playwright activity replaced the pinned Chromium revision (1223 → 1234)
  mid-baseline; measurements before/after the swap ran on different browser builds. Frame-timing
  thresholds passed with wide margins on both, but the browser pin must be enforced at the
  environment level for official comparisons.
- Two W1 agents reported the shared browser pane being navigated by sibling sessions; both fell
  back to isolated headless verification. Same lesson: concurrent implementation reps on one
  machine interfere.

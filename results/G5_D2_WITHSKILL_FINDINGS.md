# Criterion G5 — D2 abundance resistance, with-skill arm (2026-08-31)

Three plan-only reps, Fable (model-arm matched to baseline), pristine `next-tailwind-base`
@ `edf3be4`, delivered per `evals/withskill_protocol.md`: skill body as a loaded-skill block +
`registries/component_libraries.json` verbatim + the pinned D2 prompt, unmodified.
Proposals archived at `results/proposals_e/D2ws-rep{1,2,3}.md`.

## Criterion under test

> **G5** — Catalog access must not increase dominant-primitive count or derivative-ness flags
> versus the no-catalog control arm.

**This is a do-no-harm criterion, and the baseline was already at ceiling** (3/3 resisted, zero
derivative drift). The with-skill arm therefore *cannot* demonstrate improvement on the headline
measure; it can only confirm the skill does not induce component soup when catalogs are in view.
Scored on that basis. Reading a non-regression as a win would misstate what the design supports.

## The 3×3 grid

| | catalog | skill | catalog primitives adopted | new runtime packages | derivative-ness flags |
|---|---|---|---|---|---|
| D2ctl-rep1 | ✗ | ✗ | n/a | 0 | none |
| D2ctl-rep2 | ✗ | ✗ | n/a | 0 | none |
| D2ctl-rep3 | ✗ | ✗ | n/a | 0 | none |
| D2-rep1 | ✓ | ✗ | 0 | 0 | none |
| D2-rep2 | ✓ | ✗ | **1** (Magic UI `Noise Texture`, good_foundation — "adopt the recipe, restyle") | 1 (GSAP) | none |
| D2-rep3 | ✓ | ✗ | 0 | 1 (GSAP + DrawSVG) | none |
| D2ws-rep1 | ✓ | ✓ | 0 | 1 (`perfect-freehand` 4KB) | none |
| D2ws-rep2 | ✓ | ✓ | 0 | **2** (`motion@13.1.1`, `perfect-freehand`) + roughjs devDep | none |
| D2ws-rep3 | ✓ | ✓ | 0 | **0** (roughjs build-time only, output committed) | none |

Final route: **9/9 custom.** No arm let a catalog primitive define the identity.

## Verdict: G5 MET (non-regression)

- **Dominant-primitive count did not increase.** Catalog primitives adopted: controls n/a,
  catalog-only baseline **1**, with-skill **0**. The one adoption in the whole grid is in the
  *baseline* arm, not the skill arm.
- **Derivative-ness flags: zero in every cell**, unchanged.
- **Runtime dependency count did not systematically increase**: baseline 0/1/1, with-skill 1/2/0.

### Honest caveats

1. **`D2ws-rep2` is the grid's high-water mark for runtime packages (2 vs a baseline high of 1).**
   It is not a criterion failure — neither package is a catalog primitive, and it pre-registered a
   decision gate to drop `motion` for WAAPI if the bundle budget breaks — but the number is the
   highest in the grid and is recorded as such rather than averaged away.
2. **The constellation bait is NOT a skill effect.** `components/ConstellationData.js` (500 orphaned
   nodes) is discussed in 8 of 9 proposals *including all three no-catalog controls*. Resistance to
   it is baseline-native fixture hygiene and is scored arm-independent. It is not evidence for the
   skill and is not counted toward G5.
3. **Ceiling effect limits inferential value.** With baseline at 3/3, this arm has almost no room to
   discriminate. G5 is now closed as "no harm demonstrated," not as "skill improves abundance
   resistance" — that stronger claim is unsupported by this design and would need a harder trap
   (e.g. a catalog primitive that genuinely *fits* the brief).

## Unscored observations (not part of G5)

- **Live querying replaced recall in 3/3.** Every rep fetched `llms.txt` / registry indexes rather
  than reasoning from the registry blurb, and named specific primitives before rejecting them
  (`Stroke Text`, `Text Cursor Proximity`, `Elastic Line`, `Highlighter`, `Noise Texture`,
  `Squiggly Text`). Rejections cite what the primitives render, not category judgments.
- **`rough-notation` — the obvious library answer to this brief and absent from the registry — was
  found and rejected by 3/3**, each on fit-policy grounds (dormant; owns its own timing, so a second
  timeline owner; recognizable defaults). The search extended past the supplied catalog.
- **Staleness handled by containment, twice.** rep2 and rep3 both adopted `roughjs` (last push
  2024-07) as a *build-time* generator with committed output — "dormancy is contained… zero runtime
  exposure" — rather than accepting or rejecting it wholesale.
- **A freshness self-correction on record:** rep2 found `motion` at 13.1.1, a major ahead of its
  training-era knowledge, and noted this "itself proves the verify-at-build rule."
- **Register named 3/3; S weighed and explicitly declined 3/3**, each with stated reasons
  (editorial identity is a reading surface first; GPU fluid reads glossy-digital against a hand-made
  thesis; operate surfaces on the same page must stay calm). Consistent with criterion G2, and no
  spectacle inflation on a brief that does not call for it.
- **Unprompted lifecycle discipline 3/3** (IntersectionObserver + visibilitychange, rAF only while
  work is in flight) and **anti-proxy verification language 3/3** — all three explicitly refused
  `document.hidden` flag-flipping as a stand-in for the scroll-away case. Plan-only, so nothing is
  measured; these are commitments, not verified behavior, and are recorded as such.

## Deviations

- **`D2ws-rep2` stalled on the known notification-routing failure** (commissioned a catalog-survey
  child, ended its turn, no live children remained to wake it). Resumed by orchestrator relay that
  named no source and no verdict and carried a mismatch escape hatch, so it could not act as a
  hidden steer. Rep2's higher dependency count is noted alongside this, though the two are not
  causally linked by any evidence.
- Plan-only compliance **verified by measurement, not by self-report**: all three run dirs
  `git status --porcelain` = 0 lines at `edf3be4`.

## Success-bar effect

G5: *Blocked on runs* → **MET (non-regression, ceiling-limited)**.

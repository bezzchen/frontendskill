# Calibration ablation — pre-registered 2026-08-27, BEFORE any run

Run-matrix item 4, deferred since v2.0. It answers the owner's standing question — restated three
times, most recently 2026-08-27: *"my definition of best design is usage of 3d objects (which give
depth) and scrolling animations etc."*

## Why this arm exists

Criterion G2 is met: with the skill, agents weigh the spectacle register 3/3 where baseline was
0/3. But **every S1 and W1 output so far has declined 3D**, each on product-fit grounds ("Meridian
sells frame-level 2D precision"; "a shader canvas would upstage the story"; "would add payload and
GPU load without demonstrating it"). So the ceiling is not blocked by register *awareness*. The
untested lever is whether **showing the ceiling** moves output toward it.

## Design

| | condition |
|---|---|
| **Control** | the existing **S1 baseline ×3** (no skill, no calibration) — already banked, not re-run |
| **Ablation arm** | **S1 + `references/landing_love_calibration.md` ×3**, no architect skill |

Only one variable changes: the calibration reference. The architect skill is deliberately absent
from both sides so this measures the *reference pack*, not the skill. Everything else is held:
same pinned `launch-page-base` fixture at 3543ef9, same verbatim S1 prompt, same Fable arm by
explicit model override, fresh context and pristine copy per rep, same battery, same pinned
choreography for recordings.

Delivery: the calibration file's full text is supplied as context ahead of the unchanged S1
prompt, framed as reference material — mirroring how the catalog registry was supplied to the
D1/D2 catalog-aware arms.

## Pre-registered observations (fixed before the first run)

Recorded per rep, binary unless stated:

1. **Spatial-3D adoption** — does the build use a 3D scene with depth and camera (Three/R3F/OGL/
   WebGPU/raw 3D matrices), as opposed to a 2D/2.5D particle or typographic system? *This is the
   owner's ceiling, stated plainly.*
2. **Camera choreography** — is camera movement authored (travel//dolly/orbit tied to input or
   scroll), rather than a static viewpoint?
3. **Scroll-driven animation** — is scroll a primary driver of the visual system?
4. **Reference influence, cited** — does the run cite or paraphrase calibration axes (world
   premise, material language, interaction causality, signature memory) in its own reasoning?
5. **Cost of the pack** — tokens and duration vs the S1 baseline range, to test the "raises
   ambition vs merely consumes context" question in the run matrix.
6. Full M1–M6 battery + screenshots + choreographed recording, as for every S1 run.

## What counts as a result

- **Calibration moves the ceiling** if spatial-3D adoption (observation 1) occurs in **≥ 2 of 3**
  ablation reps, against **0 of 3** in the S1 baseline.
- **Calibration does not move the ceiling** if adoption stays 0–1 of 3. In that case the finding
  is that the model declines 3D for reasons the reference pack does not overcome — and the next
  probe would have to *demand* a spatial world in the brief, separating "won't self-select" from
  "can't execute".
- Spectacle quality itself remains owner-scored via `rubrics/spectacle_fit.md` and a pooled blind
  ranking against the three S1 baselines; recordings are captured for that purpose.

## Known limitations, stated in advance

- n=3 per condition. The W1 pooled ranking just demonstrated that this cannot discriminate
  near-equivalent artifacts (p = 0.70). **Observation 1 is a presence/absence count, not a quality
  ranking, precisely so this arm does not depend on that discrimination.**
- The control arm was run earlier, in a different session. Fixture, prompt, model arm and battery
  are identical, but the calendar gap is a real difference and is recorded as such.
- The reference pack names real sites. Runs are expected to extract *quality axes*, not copy;
  any run that reproduces a named site's structure would be a finding in its own right.

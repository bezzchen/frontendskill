# Landing Love spectacle calibration — snapshot 2026-08-12

## Purpose

This reference pack calibrates the **upper expressive ceiling** of the evaluation harness. It does
not ask an agent to copy any site. It defines the quality register the user means by “wow frontend”:
the page itself can become a realtime visual system, with authored space/material/motion rather than
ordinary sections plus decorative transitions.

Landing Love is used because it preserves full-page video recordings in addition to screenshots,
which makes it useful for judging choreography and interaction, not only first-frame styling.

## Reference set

### Tomasz Szmajda / ITom
- Landing Love: https://www.landing.love/sites/itomdev/
- Calibration traits: hand-drawn 3D corridor; navigation is spatial; scroll maps to camera travel;
  R3F/GSAP-level integration; feels closer to a small world/game than a conventional portfolio.

### Noomo — Storytelling
- Landing Love: https://www.landing.love/sites/storytelling/
- Calibration traits: chaptered immersive 3D narrative; case studies embedded in the journey;
  cinematic UI overlays; spatial storytelling is the information architecture.

### ASTRODITHER
- Landing Love: https://www.landing.love/sites/astrodither/
- Calibration traits: audio-reactive Three.js/WebGPU experiment; dithering + fluid simulation + TSL;
  material/graphics behavior itself is the experience.

### Joseph Santamaria
- Landing Love: https://www.landing.love/sites/joseph-san-2/
- Calibration traits: 3D loading experience followed by GSAP/WebGL project storytelling; immersive
  graphics coexist with readable portfolio structure.

### Dragonfly / broader Three.js collection
- Collection: https://www.landing.love/collection/threejs/
- Calibration traits: scroll-driven spatial scenes can make even institutional/business narratives
  feel cinematic without turning every textual element into canvas.

## What to extract from references

Do not copy pixels, brands, assets, layout sequences, or source code. Extract only the **quality axes**:

1. **World / spatial premise** — does the page have a coherent visual world or merely decorations?
2. **Material language** — light, shader, type, geometry, imagery and color behave as one system.
3. **Interaction causality** — pointer/scroll/audio/input visibly changes the world, not only opacity.
4. **Authored continuity** — transitions connect acts; the page does not feel like isolated demo cards.
5. **Camera / composition** — when spatial, framing and movement are designed, not default orbit-controls.
6. **Signature memory** — a visitor can name one moment/system afterward.
7. **Technical invisibility** — the chosen renderer disappears behind the concept; “it uses Three.js” is not the idea.
8. **Graceful fallback** — mobile, reduced-motion and capability fallbacks preserve identity and content.

## Register boundary

- **Q1 Quiet / Operate:** craft disappears behind task completion.
- **W1 Expressive / Persuade-Experience:** distinctive art direction and at least one memorable moment.
- **S1 Spectacle / Immersive:** a visually dominant realtime system or equivalent authored graphical world
  materially changes through interaction and unfolds across multiple visual acts.

A conventional DOM landing page with excellent type, asymmetry and tasteful motion can score W1=4 while
still scoring only S1=2. That is not a contradiction; they measure different ceilings.

---

## R1 sweep addendum (2026-08-12, verified where stated)

All five entries above verified live; astrodither self-confirms WebGPU/TSL/fluid-sim. Caveat:
itomdev's SSR HTML reads as conventional sections; the corridor is client-side (or redesigned).

### Additional calibration anchors

- **Lusion** — https://lusion.co — Awwwards/FWA/CSSDA SOTY sweep; strongest overall S1 anchor.
- **Igloo Inc** — SOTY 2024; procedural crystals/shader-driven UI (material language).
- **Bruno Simon** — https://bruno-simon.com — physics-driven drivable world (interaction causality).
- **Coastal World** — gamified archipelago, SOTM 2022 (world premise + acts).
- **Chartogne-Taillet** — authored-camera 3D villages (camera/composition).
- **Particle Love** — particle systems as the experience.
- **Patatap** — audio-visual instrument (audio-reactive mode).
- **The Boat (SBS)** — scroll-cinematic editorial (narrative continuity without 3D).
- **Unseen Studio** — typography as WebGL material (type-as-spectacle).
- **Apple AirPods Pro page** — scroll-scrubbed product cinema; deliberate W1/S1 *boundary* probe.

### Axis refinements adopted

1. Add **entry/loading choreography** (the first five seconds are authored or they aren't).
2. Add **runtime performance integrity** as a formal axis — wired to `rubrics/execution_measurement.md`
   rather than judged by eye; the most automatable axis.
3. Generalize axis 5 to **composition & choreography** (unconditional; spatial camera is one form).
4. Add **content coexistence** — spectacle that still lets the visitor actually read/do the thing.
5. Treat **signature memory** as the S1>=4 gate rather than a parallel axis.

Verification limits: landing.love video recordings are not fetchable; motion claims rest on page
text, award writeups, and prior knowledge. Full detail: results/research/R1_landing_love_calibration.md

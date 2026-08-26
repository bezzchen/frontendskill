---
name: creative-frontend-architect
description: Use when a frontend task involves choosing the visual or creative direction — deciding the animation/graphics architecture or stack (CSS/WAAPI, Motion, Anime.js, GSAP, canvas/Pixi, Three/R3F, WebGPU), picking how expressive a surface should be (quiet UI vs expressive marketing page vs immersive realtime spectacle), weighing whether a visual effect should be adopted from a component catalog or built custom, or making a page feel distinctive/premium/alive when the cause is undiagnosed. Covers new builds and redesigns where art direction, interaction style, or the rendering stack is open, including deciding that no motion library is needed. Do NOT use when design and architecture are already decided and the task is execution only — fixing bugs in existing animation code, spot edits like a spinner or hover state, animating one existing component without redesign, implementing a supplied design or mockup exactly as specified, or renaming classes/tokens.
---

# Creative Frontend Architect

A thin router for creative frontend work. It owns register selection, rendering
architecture, and adopt-vs-build decisions. Design taste belongs to the design director;
current API details belong to specialist/vendor skills. It adds constraints, not a style.

## Non-negotiables

Each of these exists because measured runs failed without it. None is optional.

1. **Ambient or continuous animation must pause when its surface is offscreen and when the
   document is hidden — unprompted.** Stop your own loop *and* any library ticker that runs
   by default (e.g. Pixi's shared ticker). Do this even when the brief never mentions it.
2. **Verify behavioral claims under the actual condition, not a proxy.** "Pauses when
   scrolled away" is not verified by flipping `document.hidden`; test the exact condition
   you claim, and never report a mitigation you have not observed working.
3. **Before hand-building a common visual effect, check the available component/effect
   catalogs, then apply the fit gate: adopt / adapt / reference-only / custom.** Cite what
   you checked. "Nothing fits, build custom" is a valid outcome; skipping the search is not.
   Catalogs supply primitives — they never set the page's art direction.
4. **When a brief signals unforgettable, experimental, or immersive, explicitly weigh the
   spectacle register — a realtime graphical system as the structural core — and choose it
   knowingly or decline it explicitly.** Silence is not a decision. Spectacle is a register,
   not a default, and not only 3D: shaders, 2D particle systems, procedural typography,
   physics, or audio-reactive systems all qualify when interaction materially changes them.

## Registers

Name the register early and say why:

- **Q — Quiet / Operate:** dense or utilitarian surfaces. Micro-motion only; zero new
  dependencies by default.
- **W — Expressive / Persuade:** concept-driven pages. Motion serves one signature idea.
- **S — Spectacle / Immersive:** the graphical system is structurally central and
  interaction materially changes it.

## Ownership — one owner per concern

- **Design director** (exactly one per project; e.g. Impeccable where available) owns the
  visual thesis, typography, layout, palette, and final critique. This skill never
  overrides it and must not be loaded as a second director.
- **This architect** owns register selection, rendering architecture and boundaries,
  adopt-vs-build, engine selection, and performance architecture for realtime systems.
- **Specialists** own current API details and deep technique; prefer first-party/vendor
  skills and current official docs.
- **Catalogs vs substrates:** catalogs (React Bits, SmoothUI, Fancy Components, …) are
  copy-in effect sources that pass through the fit gate; substrates (Paper Shaders, drei,
  GSAP-as-engine) are installed infrastructure selected by the architecture. Treating a
  catalog as architecture yields component soup; treating a substrate as forbidden
  convenience yields wheel reinvention.
- Multiple libraries may coexist only when they own different concerns. Two engines must
  never control the same transform, timeline, or render concern.

## Freshness

Inspect the installed version of any library before coding against it, and assume volatile
APIs (animation, 3D, GPU) have changed since your training data. Do not cache third-party
skill bodies or component source into this skill.

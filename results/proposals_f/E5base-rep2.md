# E5base-rep2 — BASELINE (no skill), Fable, plan-only

Eval: E5-dense-2d-renderer. Fixture next-tailwind-base @ edf3be4 (pristine).
Delivery: minimal wrapper + verbatim pinned prompt. No skill, no catalog context.

## Repo findings reported
Next.js 16.2.12 App Router + React 19.2.8 + Tailwind 4.3.3 (@tailwindcss/postcss). Plain JS/.jsx,
jsconfig maps @/*. node_modules not installed; single commit, clean tree.
Zero runtime deps beyond the framework — lockfile confirms no three.js/pixi/d3/framer-motion.
app/page.jsx (server) composes ProjectGrid.jsx (server) + SettingsPanel.jsx (client) — the
"use client" pattern is already established.
**components/ConstellationData.js exports exactly 500 items {id,label,category} across 4 categories
(engineering, research, design, math)** — i.e. this file is E5's own dataset. No image assets in the
repo, so node visuals must be generated procedurally.
Theming: CSS custom properties with automatic dark mode via prefers-color-scheme; the constellation
must read these at runtime.

## Decision
**Canvas 2D hot path + React/DOM cold path (hybrid), ZERO new dependencies.**
One <canvas> renders all 500 nodes from a pre-baked sprite atlas; a plain-JS simulation runs in a
rAF loop outside React's render cycle; React/DOM renders everything discrete — filter chips, legend,
tooltip/detail card, accessibility layer.

## Alternatives rejected, with numbers
- DOM/SVG (500 animated elements): per-frame transform writes push style-recalc + compositing to
  ~8-15ms/frame on a laptop, far worse on mobile — "the budget is blown before drawing anything."
  DOM tops out ~150-200 continuously animated nodes; brief is 500 with per-frame proximity forces.
- WebGL (raw or three/pixi): "the right call at 5k-50k nodes, overkill at 500." Raw WebGL adds a
  large bespoke surface (shaders, atlas UVs, context-loss handling); a library adds this repo's
  FIRST runtime dependency and ~100KB+ for one bounded section. Budget check: 500 small sprite
  blits/frame ~1-3ms on integrated laptop GPU; O(n) physics at n=500 <0.1ms.
  Mitigation kept anyway: renderer isolated behind a draw(world, ctx) boundary so a WebGL backend
  could be swapped later without touching physics or chrome.

## Architecture sketch
1. Engine (framework-free components/constellation/engine.js): node = position, velocity, home
   target. Forces: spring-to-target + damping, per-node dual-sine drift (no per-frame RNG), pointer
   repulsion within radius (squared-distance early-out; brute force fine at 500, no spatial index).
   Semi-implicit Euler with clamped dt. **Regrouping is free** — switching layout reassigns targets
   (scatter phyllotaxis vs 4 category clusters) and the springs animate the transition. Filtering
   animates per-node alpha/scale in-sim.
2. Sprite atlas: deterministic procedural "logos" (glyph/shape/monogram from id+category) rasterized
   once into an offscreen canvas at capped DPR; per-frame cost is one drawImage per node, no filters
   (globalAlpha only). Rebuilt on theme change (matchMedia) using the page's CSS variables.
3. React shell (client): world lives in a ref; rAF never triggers re-renders. React state only for
   discrete UI. Hover tooltip positioned imperatively in the rAF, not React state. Server-rendered
   shell keeps heading + filter buttons in HTML (no layout shift, no hydration mismatch since node
   positions never touch HTML). Canvas sized via ResizeObserver, DPR-aware, transparent background.
4. Interaction/a11y: pointermove -> nearest-node hit test; click selects -> DOM detail card with real
   text. Filter chips are real buttons; canvas aria-hidden with keyboard arrow-navigation on the
   wrapper plus aria-live announcements as the accessible path.
5. Degradation ladder: DPR cap 2 (1.5 mobile); **IntersectionObserver + visibilitychange pause the
   loop entirely when unseen**; prefers-reduced-motion disables drift and shortens regroup to a brief
   settle; coarse-pointer/narrow viewports drop to ~200-250 nodes with touch as transient pointer
   force; frame-time EMA steps quality down (effects first, then node-count tier) if sustained >20ms.

## Note for scoring
Offscreen + hidden pausing appears here UNPROMPTED in a BASELINE run with no skill loaded. Per the
rubric's described-not-demonstrated rule this is a Layer-B plan-quality signal only and carries no
decision weight; it is NOT evidence of built behaviour. Recorded because it bears on how much of the
skill's pause line is baseline-native at proposal stage.

## Compliance
Plan-only respected; agent reports working tree clean at edf3be4.

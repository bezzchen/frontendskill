# E5base-rep3 — BASELINE (no skill), Fable, plan-only
Eval: E5-dense-2d-renderer. Fixture next-tailwind-base @ edf3be4.

## Repo findings
Next 16.2.12 App Router, React 19.2.8, Tailwind 4.3.3, plain JS with @/* alias, no TS.
Zero extra dependencies — lockfile holds only the Next/React/Tailwind ecosystem; no three.js, pixi,
d3, framer-motion. node_modules not installed. **No public/ directory, so no image assets exist.**
Page is server-rendered with one existing client island (SettingsPanel); the constellation slots in
as its own <section> and the page stays a server component.
components/ConstellationData.js exports exactly 500 items {id,label,category} across 4 evenly
distributed categories. **No image URLs** — so node visuals must be generated (category-coloured
glyphs/initials), with a seam for real logos later.

## Decision: Canvas 2D + sprite atlas, DOM chrome, React-free simulation core
One <canvas> renders all 500 nodes; React never touches per-frame state. WebGL rejected as primary
renderer; DOM/SVG rejected outright.

1. DOM (500 divs) / SVG — REJECTED. 500 per-frame transform writes force either 500 compositor
   layers (memory blowup) or continuous style recalc. "This is the architecture that's janky at
   exactly this scale, worst on mobile."
2. WebGL (three/pixi/instancing) — REJECTED at n=500, kept as escalation path. "Instancing shines at
   5k-50k nodes. At 500 it buys nothing measurable while costing ~100-150KB gz of dependencies in a
   zero-dep repo, context-loss handling, and a texture pipeline we'd need anyway. Wrong point on the
   complexity curve."
3. Canvas 2D — CHOSEN. 500 drawImage blits from a pre-rasterised offscreen sprite atlas ~1-3ms/frame
   on integrated-GPU laptop; drift/spring math for 500 nodes ~0.2ms. "60fps with 5x headroom", zero
   new dependencies, no hydration concerns (canvas paints client-only).

## Structure
- **Renderer-agnostic seam:** engine.js (pure JS, no React imports) writes node state into FLAT
  TYPED ARRAYS (x, y, scale, alpha, spriteIndex); the renderer only consumes that buffer. Past
  ~2-3k nodes or if shaders are needed, the Canvas2D renderer swaps for instanced WebGL "without
  touching simulation, layout, or interaction code."
- **Regrouping without a physics solver:** each node has a `home` target from a layout function
  (seeded phyllotaxis scatter; grouped mode = 4 category discs). Drift is per-node phase noise;
  pointer proximity is a radial displacement field; everything eases with critically-damped
  smoothing toward home + drift + pointerOffset. Regroup = swap targets, springs animate —
  deterministic and cheap, no d3-force.
- **Interaction:** uniform spatial-hash grid for hit-testing and proximity queries. Selection/filter
  live in React state (mode, active categories, selectedId only) and are pushed into the engine via
  methods; the engine never triggers renders. Filter chips, tooltip and labels are DOM/Tailwind
  overlaying the canvas — "accessible for free."
- **Degradation ladder:** DPR capped 2 (1.5 mobile); **rAF fully paused via IntersectionObserver when
  off-screen and on tab hide**; prefers-reduced-motion disables drift and shortens transitions;
  rolling frame-time governor drops DPR to 1 then subsamples node count on weak devices; touch gets
  tap-ripple instead of hover proximity.
- **A11y/SEO fallback:** canvas role="img" plus a parallel visually-hidden DOM list of nodes grouped
  by category; filter buttons aria-pressed; selection announced via live region. "This list is also
  the no-JS fallback."

## Convergence note
E5 rep2 and rep3 independently reached the SAME architecture: Canvas 2D + pre-baked sprite atlas +
React-free rAF engine + DOM chrome, zero new dependencies, WebGL rejected as overkill at n=500 with a
swappable renderer boundary kept, and the same degradation ladder (DPR cap, IntersectionObserver +
hidden pause, reduced-motion, mobile node-count reduction). Both also noted the absence of image
assets forces procedural node visuals. This is high between-rep convergence for the E5 cell.

## Note for scoring
Offscreen AND tab-hide pausing again present unprompted in a baseline with no skill loaded (4th such
run: E2, E3, E5-rep2, E5-rep3). Layer-B plan-quality signal only; no decision weight.

## Compliance
Plan-only respected; agent reports git status clean, no files written.

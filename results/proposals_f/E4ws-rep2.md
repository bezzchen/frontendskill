# E4ws-rep2 — WITH SKILL, Fable, plan-only
Eval: E4-dom-plus-gpu-media. Fixture next-tailwind-base @ edf3be4. NO STALL (15 tool calls).

## Register: W, spectacle weighed and declined AS A PAGE REGISTER
"The brief's language ('high-end', 'dramatic', 'shader-like') is a spectacle signal, so I weighed S
explicitly. **Full S would mean the grid itself is rendered in GL with the DOM demoted to hidden
proxies. Rejected: it contradicts the brief's normal-DOM requirement and makes two systems own
layout.** What the brief actually describes is one signature idea... on a page that is otherwise Q.
The GL substrate is spectacle-grade but confined to the media surfaces; it must be inert elsewhere."

## Same architecture family as rep1 and both baselines
One shared `position: fixed; inset: 0; pointer-events: none` canvas, **mounted once from
app/layout.jsx** (same route-persistence insight as rep1), one textured quad per VISIBLE project image
at its getBoundingClientRect(), raw WebGL2 (~300 lines + two fragment shaders), zero new dependencies.
Named module boundaries with an explicit API surface: `register(img) -> handle`, `pointer(handle,u,v)`,
`open(handle) -> Promise`, `release()`, `destroy()`.
Pointer effect: analytic refraction from a uniform ring buffer (<=12 samples: uv, birth time,
velocity) — "No state texture, no FBO simulation, no per-frame CPU->GPU upload; **it is a pure
function of (uniforms, time), which is what makes it pausable.**"
Loop policy: rAF pending only while (pointer active OR ripple energy > eps OR transition playing OR
scroll/resize/texture-load dirty) AND grid intersects viewport AND visibilityState === "visible".
"At rest: nothing scheduled. Scroll redraws exactly one frame (rects moved)." DPR capped 2,
antialias:false, powerPreference:"low-power", textures <=2048 with mips.

## DIVERGENCE FROM rep1 on the img-visibility question
rep1: **"Overlay, never swap"** — the DOM <img> is NEVER hidden; the GL quad fades in on top of the
identical image, so every failure mode degrades to the unmodified site.
rep2: hides the <img>s — sets `data-gl="on"` on <html> "so CSS hides the <img>s (visibility: hidden)
**only once textures are ready**", and notes the canvas must sit ABOVE the cards because they have
opaque --surface backgrounds.
Both are defensible and both handle the failure path (rep2 gates on readiness and falls back via
data-gl off), but they are opposite choices on the same question, from the same skill, on the same
brief. rep2 additionally flags the a11y consequence rep1's approach sidesteps: "Images are decorative
(alt=''...); if alt ever becomes meaningful, hide via opacity: 0 instead of visibility: hidden to keep
AT exposure."

## Fit gate — source verified same-day
- React Bits `GridDistortion` (source verified today): "hard three.js dependency, one WebGLRenderer per
  instance, **unconditional rAF with no IO/visibility pause**, mousemove only, plain displacement with
  no dispersion or specular" -> reference-only, but noted as "a legitimate alternative LOOK if the
  director prefers 'stretch' over 'water'."
- Paper Shaders 0.0.80 ("published today"): "none of its image shaders exposes a pointer uniform" ->
  reference-only; its "lens-distortion dispersion chain and its IO + visibilitychange pause pattern are
  worth copying."
- Per-tile canvas/context: "N contexts — **Chrome evicts the oldest past ~16**, so a grid that grows
  breaks — N program compiles, and no way for the open transition to escape the tile without a SECOND
  rendering system." (Same context-limit argument as rep1 and baseline rep2/rep3.)
- three/R3F + drei <View> (r185/9.7/10.7): "~150 kB gz plus a reconciler to draw eight quads and two
  shaders; the rect sync would still be ours; monthly API churn."
- OGL 1.0.11 (last published Jan 2025): "the honest one-notch-up option — same architecture, GLSL
  passthrough, saves ~80 lines of boilerplate. **Sanctioned swap** if the implementer wants a wrapper;
  not the default because it buys little for a dependency nobody is upkeeping."
- curtains.js 8.1.6 (May 2024): "literally this architecture as a library, but dormant — its author
  moved to gpu-curtains (WebGPU-first, 0.16)."
- Pixi 8.20 DisplacementFilter: "a full 2D scene graph for eight sprites, **a shared ticker that runs
  by default (the exact hazard the skill names)**."
- CSS/SVG filters: "CPU-rasterised per frame on large bitmaps (Safari worst)... **Not even a good
  fallback — the fallback is the untouched <img>.**"
- View Transitions: "right tool for a layout morph, wrong for a shader — it animates snapshots, no GLSL
  on the pseudo-elements. Running it on the same element as the GL cover would be two engines owning
  one transform."

## Verification (actual conditions)
Instrumented rAF counter must read 0 over 2s when (a) the grid is ACTUALLY scrolled offscreen, (b) the
tab is hidden, (c) the pointer has been at rest >1.5s with the grid visible. Plus: modifier-click opens
a new tab with no transition; **LCP still attributes to the <img>**; screenshot diff between data-gl
on/off at rest below threshold.

## E4 cell status: 4 of 4 runs across both arms converge on the architecture
Baseline rep2, baseline rep3, ws rep1, ws rep2 all independently chose one shared viewport-spanning
WebGL2 overlay with DOM-rect-synced quads, vanilla GL, zero new dependencies, DOM canonical for
SEO/a11y/layout, render-on-demand, DPR cap, and all rejected per-card canvases on the context-limit
argument and R3F on bundle/frameloop grounds. This is the most convergent cell in the routing arm.
With-skill additions over baseline remain: quantified context cap, layout-mounted route persistence,
same-day source verification of the specific catalog components, and the pause rule used as a
selection criterion (Pixi's default-on ticker, GridDistortion's unconditional rAF).

## Cost note for criterion D
100,730 tokens, 15 tool calls, 549s, no stall. Baseline E4: 56,077 tokens, 5 tool calls. ~1.8x —
consistent with the 1.6-1.8x band for stall-free, non-benchmarking with-skill runs.

## Note
Second run to offer publishing its decision as a shareable artifact. Declined again by the
orchestrator: eval outputs are programme artifacts and are not published.

## Compliance
Plan-only RESPECTED — git status --porcelain empty.

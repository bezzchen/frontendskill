# E4base-rep3 — BASELINE (no skill), Fable, plan-only
Eval: E4-dom-plus-gpu-media. Fixture next-tailwind-base @ edf3be4.

## Repo findings
Next 16 App Router + React 19 + Tailwind 4, JS only, zero runtime deps beyond React/Next.
ProjectGrid.jsx is a SERVER component: 8 plain <a href="#project-N"> cards, each with heading, summary
and a media slot that is a **CSS-gradient placeholder div (not a real <img>)**, already tagged
data-project-media. Only client component is SettingsPanel. ConstellationData unused. No project
detail routes — "opening" a project is a dead hash link today.
Three repo facts named as shaping the decision: the DOM is already exactly the semantic baseline the
ask wants preserved; the media slots are placeholders, "so the effect layer must bind to a contract,
not to <img> specifics — data-project-media is that contract"; and "open" has no destination yet.

## Recommendation
**One shared WebGL2 canvas overlay with DOM-rect-synced planes, mounted as a single non-SSR client
island; the DOM stays canonical and untouched.**
1. ProjectGrid stays a server component, byte-for-byte semantic; no "use client" spreads into existing
   components — "so text, headings, links, SEO, and responsive layout are untouched by construction,
   not by discipline."
2. One client island via next/dynamic ssr:false renders a single position:fixed, pointer-events:none,
   aria-hidden canvas spanning the viewport. Mounts NOTHING when WebGL is unavailable, on
   prefers-reduced-motion: reduce, or on coarse pointers — "the page is already complete without it,
   so the fallback tier is 'no effect,' the cheapest possible one."
3. Framework-free GL core in plain modules (renderer: context/programs/textures/DPR/context-loss;
   sync: ResizeObserver rect measurement + per-frame scroll offset, IntersectionObserver culling).
   React owns lifecycle only; no per-frame React state or re-renders.
4. Sync model: each [data-project-media] gets one textured quad at exactly its screen rect. Texture is
   the placeholder gradient today; when real <img>s land the upload path switches to currentSrc after
   decode "so responsive srcset still picks resolution."
5. Interaction: pointer events delegated on the grid (canvas is pointer-events:none so the DOM keeps
   receiving all events), feeding a uniforms object. **A single RAF renders ONLY while any plane is
   "hot" — idle grid = zero GPU work** and native-crisp DOM images; the plane fades in over the image
   on enter, first frame undistorted, "so there is no fidelity mismatch at rest."
6. Hover effect = fragment shader on that plane; one ping-pong flowmap FBO only if persistent liquid
   trails are specced.
7. Open transition = progress uniform on the clicked card's plane which, because the canvas is
   page-wide, **can expand beyond the card's box**. "Per-card canvases physically cannot do this
   without re-parenting hacks; this is the requirement that most strongly selects the shared-canvas
   architecture."
8. Vanilla WebGL2 first (~300-400 lines). Named tripwires: adopt OGL (~15KB) if the roadmap grows into
   multi-pass render-target work; adopt three.js only if an actual 3D scene becomes the product.

## Alternatives rejected
- Per-card canvas per image — 8 WebGL contexts at typical browser context caps (oldest gets killed),
  N render loops, cost grows with the grid, open transition clipped to the card box. "This is the
  classic first-draft mistake the shared canvas exists to fix."
- R3F + drei — pulls three.js (~150KB min+gzip) plus a second reconciler to draw flat quads with
  custom fragment shaders: no camera motion, no lighting, no scene graph used. "R3F earns its keep
  when the scene is the product; here GL is a cosmetic layer over DOM truth."
- **curtains.js — "the closest alternative, and it validates the pattern: it is exactly DOM-synced
  WebGL planes. But it is a WebGL1-era library with sparse maintenance, taken on to avoid ~100 lines
  of sync code we can own and test. Copy its shape, skip the dependency."**
- SVG feTurbulence/feDisplacementMap or CSS filters — zero-dep but below the bar: no true refraction/
  chromatic dispersion or velocity-driven flow, filter rasterisation on the main thread, Safari
  pitfalls, backdrop-filter: url(#…) displacement is Chromium-only.
- View Transitions API / Motion for the open transition — snapshot crossfade + transforms only; cannot
  produce a shader-like dissolve. Kept "in the back pocket as the NO-WEBGL open-transition fallback."
- WebGPU — unnecessary for this effect class; WebGL2 is the universal baseline, and isolating the
  renderer keeps a backend swap cheap.

## Risks named
Scroll/resize "swim" (GL plane lagging its DOM rect) called the main quality risk, mitigated by
re-measuring only on ResizeObserver/mutation and reading scroll offset inside the same RAF that draws.
Placeholder-vs-image duality bound to the data-project-media contract. Colour parity between GL and
DOM decode, verified cheaply because the enter-frame draws the undistorted texture over the live image.
Context loss handled by hiding the canvas — "the DOM beneath is always complete."
Pending owner decision flagged as non-blocking: what "open" navigates to (overlay/dialog -> island in
page.jsx; future /projects/[id] -> island moves to layout.jsx so the canvas persists through
navigation). "The architecture is identical either way; only the mount point moves."

## Convergence note — E4 rep2 vs rep3
Both independently chose ONE shared viewport-spanning WebGL2 overlay canvas with quads synced to
[data-project-media] DOM rects, vanilla GL with zero new dependencies, DOM left canonical for
SEO/a11y/layout, render-on-demand rAF, DPR cap, reduced-motion/no-WebGL bail-out, and both rejected
per-card canvases on the WebGL-context-limit argument and R3F/three on the "shader is identical either
way" argument. Both independently identified that the page-wide canvas is what allows the open
transition to escape the card's bounds. Rep3 additionally named curtains.js and the View Transitions
API; rep2 additionally named OGL as the fallback. Very low between-rep variance.

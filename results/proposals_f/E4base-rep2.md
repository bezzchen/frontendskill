# E4base-rep2 — BASELINE (no skill), Fable, plan-only
Eval: E4-dom-plus-gpu-media. Fixture next-tailwind-base @ edf3be4.

## Repo findings
Next 16 app router + React 19 + Tailwind 4, nothing else; whole site ~167 lines. ProjectGrid.jsx is a
SERVER component: 8 semantic <a> cards, each with a decorative gradient div already tagged
data-project-media and aria-hidden="true". **No project detail route exists** — "opening" a project is
a hash link that doesn't even scroll, and no element carries id="project-N", so the card links are
inert. Only SettingsPanel is a client component. ConstellationData.js (500 nodes) unused — ignored.

## Recommendation: ONE shared WebGL2 overlay canvas, raw GL, progressive enhancement, ZERO new deps
DOM stays exactly as is; ProjectGrid remains a server component and the cards remain the truth for
SEO/a11y/layout/responsiveness. One new client component ProjectMediaFX.jsx rendered as a SIBLING of
the grid: on mount checks prefers-reduced-motion and WebGL2 support (bail silently on either), finds
all [data-project-media], creates a SINGLE position:fixed full-viewport canvas with
pointer-events:none and aria-hidden, draws one textured quad per card at that card's
getBoundingClientRect() (pixel-space orthographic projection). **Only once the first GL frame has
rendered does it visually hand off** (hide DOM media via visibility) — failure at any point leaves the
current site untouched. Framework-free GL core in lib/refraction/; React only mounts/unmounts and
forwards events, GL code never touches React. focus-visible drives the same uniform as hover so
keyboard users get parity. Click triggers a per-quad transition uniform that CAN escape card bounds
because the canvas is viewport-sized. Perf: render-on-demand rAF (runs only while pointer active over
the grid or a transition settling, then cancels), rect cache refreshed on scroll/resize, DPR capped 2,
offscreen cards skipped.

## Nearest alternatives rejected, with reasons
1. Per-card canvases — 8 separate WebGL contexts sits at typical browser context limits (~8-16),
   duplicates program/texture state 8x, clips the dramatic open transition to card bounds, and drags
   8 component instances through React lifecycle. The shared canvas pays only trivial rect syncing.
2. three.js / R3F / OGL — workload is textured 2D quads + one fragment shader; no scene graph, camera
   math or model loading. three.js ~150KB; R3F adds a second reconciler tree coupled to React 19 /
   Next 16 versions. "Crucially, the genuinely hard part — the shader — is identical code either way,
   so the library buys almost nothing here." OGL named as acceptable fallback if the team refuses to
   own GL boilerplate; three.js/R3F not warranted.
3. SVG/CSS filters (feTurbulence + feDisplacementMap) — least code but cannot hit the bar: displacement
   maps don't follow the pointer without regenerating turbulence per frame (main-thread stutter),
   Safari SVG-filter perf is poor, shader-like open transition out of reach. "'Least unnecessary
   complexity' is bounded below by the quality requirement, so this fails on necessity, not on taste."
4. Rasterizing whole cards into textures — violates the brief: text must stay selectable/accessible/
   real DOM. Distorting only the media is what makes the single-overlay approach clean.
5. WebGPU — adds nothing for 2D refraction and worsens the fallback story; WebGL2 is the right floor.

Constraints honored by construction: canvas decorative (aria-hidden, pointer-events:none), all
interaction stays on real links; quads follow DOM rects so Tailwind's md:grid-cols-2 keeps owning
layout; reduced-motion and no-WebGL users get today's site bit-for-bit.
Open decisions flagged for implementation: texture source while media is a CSS gradient (procedural
in-shader recommended until real images land); whether the open transition blocks navigation once a
real route exists (recommend play ~400-600ms then push).

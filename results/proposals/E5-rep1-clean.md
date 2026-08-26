# Proposal: Experience Constellation — Rendering Architecture

Status: proposal only, no implementation yet.
Scope: one bounded, interactive section on the existing portfolio page containing ~500 small logo/image nodes that drift subtly, react to pointer proximity, support selection/filtering, and smoothly regroup by category.

---

## 1. What the repository tells us

Survey of the repo (all paths relative to root):

| Fact | Evidence | Consequence |
|---|---|---|
| Next.js 16.2.12, React 19.2.8, app router | `package.json`, `app/layout.jsx` | The constellation must be a client-boundary island inside an otherwise server-rendered page. |
| Plain JavaScript, no TypeScript | `.jsx`/`.js` files, `jsconfig.json` (only `@/*` alias) | New code stays JS (JSDoc typedefs where helpful). No `tsconfig` churn. |
| Tailwind CSS v4 via PostCSS | `postcss.config.mjs`, `app/globals.css` | Overlay UI (chips, cards, labels) styled with Tailwind + the existing CSS variables. |
| Light/dark via CSS variables + `color-scheme` | `app/globals.css` (`--background`, `--surface`, `--line`, `--muted`) | Canvas must read theme colors from computed CSS variables and react to scheme changes, or it will clash with the page. |
| Data stub already exists: 500 items, 4 categories | `components/ConstellationData.js` (`engineering`, `research`, `design`, `math`) | Extend this file as the single source of truth; do not invent a second data source. |
| No `public/` directory, no image assets | repo listing | Logo artwork does not exist yet. The architecture must not depend on 500 files being hand-placed; it needs an asset pipeline story plus a placeholder mode. |
| Zero graphics/animation/physics deps | `package-lock.json` (only next/react/tailwind transitive tree) | Any library we add is a deliberate, visible cost. Nothing is "already there" to lean on. |
| Existing page structure | `app/page.jsx` renders header, `ProjectGrid`, `SettingsPanel` | The constellation slots in as one more `<section>`; it must not affect scroll, layout, or interactivity of its neighbors. |

Derived hard requirements:

1. ~500 continuously-animated visual nodes at 60 fps on a mid-range laptop, with graceful tiering down on mobile.
2. Per-frame pointer-proximity response (hover magnification/repulsion) and click selection.
3. Category filtering and animated regrouping (scatter cloud ↔ 4 category clusters).
4. One bounded section: small bundle, no global side effects, pauses when off-screen, respects `prefers-reduced-motion`, works in light and dark.
5. Server-rendered page shell must not break: no `window` access at module scope, no hydration mismatch, no cumulative layout shift.

---

## 2. Options considered

### Option A — 500 DOM elements (divs/`<img>` + CSS transforms), React or hand-driven

- **How:** each node is an absolutely-positioned element; a rAF loop (or Framer Motion / CSS animations) writes `transform` per node per frame.
- **Why it fails our budget:** 500 per-frame style writes ≈ 30,000 style mutations/second, each a candidate for style recalculation; 500 composited layers costs significant GPU memory (each promoted layer holds its own texture) and compositor time, which is precisely what mid-range mobile lacks. Pointer-proximity means most nodes update every frame while the pointer moves, so we cannot cheat by animating only a few. React reconciliation per frame is out of the question; even bypassing React, the DOM/compositor overhead per node dwarfs the actual work. Realistic ceiling for smooth per-frame JS-driven DOM transforms is roughly 100–200 elements — we need 500.
- **What it would buy:** free accessibility tree, free image loading/decoding, easy debugging. Not worth the frame budget.
- **Verdict: rejected** as the node renderer. DOM is still the right tool for the *UI around* the nodes (chips, tooltip, detail card, cluster labels) — see Section 3.

### Option B — SVG

- Same per-element mutation economics as Option A but with a generally slower rendering path for hundreds of `<image>` elements, plus quirkier image decode/caching behavior. Filters (glow) are notoriously slow. **Rejected.**

### Option C — Canvas 2D, single element, hand-rolled engine (recommended)

- **How:** one `<canvas>` sized to the section (DPR-aware). A framework-free engine owns positions/velocities/targets in typed arrays and redraws all nodes each frame with `drawImage` from a sprite atlas. React never touches per-frame state.
- **Budget check (the reason this wins):** 500 `drawImage` calls of ~24–48 px sprites sampled from a single atlas bitmap cost on the order of 0.5–2 ms per frame on a normal laptop, 2–6 ms on a mid-range phone. Physics for 500 nodes (spring toward target + drift + pointer field) is ~10–20 arithmetic ops per node ≈ well under 0.5 ms. Total frame cost sits comfortably inside a 16.6 ms budget with 3–5× headroom on desktop, and inside budget on mobile after tiering (Section 7). One canvas = one compositor layer, versus 500 in Option A.
- **Costs:** we own hit-testing, accessibility, theming, and DPR handling ourselves. All four are small, well-understood problems at n=500 (brute-force hit-testing over 500 points is microseconds; no spatial index needed). Zero dependencies.
- **Verdict: accepted.**

### Option D — WebGL (PixiJS, three.js/react-three-fiber, or raw instancing)

- **How:** instanced quads with a texture atlas; trivially renders 500 — or 50,000 — sprites.
- **Why not:** capability we don't need at a price we'd feel. 500 sprites is one to two orders of magnitude below the point where Canvas 2D becomes the bottleneck. The cost side is real: PixiJS or three.js adds on the order of 100–200 KB gzipped to a page that currently ships almost no client JS, plus WebGL context-loss handling, atlas upload management, harder debugging, and a second rendering idiom in a one-section feature. react-three-fiber additionally couples the render loop back into React's world, which we are deliberately avoiding.
- **Escape hatch kept:** the engine/renderer split (Section 4) keeps the draw layer behind a ~5-method interface so a WebGL backend could replace the Canvas 2D one if the design ever grows to thousands of nodes or per-pixel effects. **Rejected for now, with a revisit threshold: >~2,000 nodes or shader-dependent visuals.**

### Option E — OffscreenCanvas + Web Worker

- Moves rendering off the main thread — attractive in principle, but the win is small when the frame costs ~2 ms, and the price is a message-passing protocol for pointer events, selection, filter state, and DOM-overlay position sync, plus a second bundle/entry point. Browser support is fine now (Safari 16.4+ supports 2D OffscreenCanvas), so this remains a **documented future optimization**, structured so the engine (already framework-free and DOM-free except the draw calls) could be moved into a worker without rewrite. **Not in scope initially.**

### Option F — Animation libraries (Framer Motion / Motion One, react-spring, GSAP, d3-force)

- Framer Motion / react-spring animate DOM/React values — wrong substrate (see Option A) and per-node JS object overhead at 500 springs.
- GSAP could tween canvas-backed values but brings a license-encumbered dependency for what is ~40 lines of critically-damped spring math.
- **d3-force** deserves a real look for the regrouping behavior: cluster-attraction layouts with `forceCollide` give organic, non-overlapping clusters. Rejected because (a) its alpha-decay model fights the "perpetual subtle drift" requirement (needs constant reheating), (b) deterministic slot layouts (phyllotaxis packing per cluster, Section 5) guarantee zero overlap without any solver, and (c) it's another dependency for behavior we can express in ~60 lines. If organic collision response during transitions later becomes a design must-have, `d3-force` (or just its quadtree/collide modules) is the first candidate to add — it is small and tree-shakeable.

### Decision

**Option C: a single Canvas 2D rendering island with a framework-free engine, wrapped by a React client component that renders all non-node UI (filter chips, group toggle, tooltip, selection card, cluster labels, a11y layer) as ordinary DOM. Zero new runtime dependencies.**

---

## 3. Architecture overview

```
app/page.jsx (server component)
  └─ <ExperienceConstellation />        ← "use client" island boundary
       ├─ <section> shell (fixed aspect / reserved height → no CLS)
       ├─ <canvas>                      ← all 500 nodes drawn here
       ├─ DOM overlay (absolute, pointer-events routed deliberately)
       │    ├─ filter chips + "group by category" toggle (real <button>s)
       │    ├─ cluster labels (only visible in grouped mode)
       │    ├─ hover tooltip (one element, repositioned via transform)
       │    └─ selection detail card (focusable, Esc to close)
       ├─ visually-hidden a11y layer (live region + instructions)
       └─ engine (plain JS module, no React, no JSX)
            ├─ state: typed arrays (x, y, vx, vy, targetX, targetY,
            │         scale, alpha, categoryId, atlasIndex, flags)
            ├─ layout: slot computation (scatter / per-category phyllotaxis)
            ├─ simulation: springs + drift noise + pointer field
            ├─ renderer: Canvas2D atlas drawing (swappable interface)
            └─ interaction: hit-testing, hover, selection
```

Division of responsibility — the one rule that keeps this fast:

- **React owns discrete state** (which filters are on, grouped vs. scattered, which node is selected, current quality tier). These change on user actions, a few times a minute. Normal `useState`.
- **The engine owns continuous state** (positions, velocities, hover proximity, per-frame alpha/scale). These change 60 times a second and never pass through React. React communicates *into* the engine via imperative calls (`engine.setFilter(set)`, `engine.setGrouped(bool)`); the engine communicates *out* via a small callback surface (`onHover(nodeId|null, x, y)`, `onSelect(nodeId|null)`) that React turns into state for the tooltip/card.
- The tooltip and selection card follow their node via direct `style.transform` writes on a ref inside the engine's frame callback — not React re-renders — so they track at 60 fps too.

### Proposed file layout

```
components/constellation/
  ExperienceConstellation.jsx   ← client component: shell, overlay UI, lifecycle glue
  engine.js                     ← createEngine(canvas, items, opts): loop, simulation, interaction
  layout.js                     ← pure functions: scatter slots, category cluster slots (phyllotaxis)
  renderer2d.js                 ← Canvas2D draw backend (atlas, DPR, theme colors)
  atlas.js                      ← atlas loading / runtime atlas assembly / placeholder glyphs
  quality.js                    ← tier detection + adaptive frame-time governor
components/ConstellationData.js ← extended in place (see Section 4)
public/constellation/
  atlas.webp (+ atlas.json)     ← generated sprite sheet, when real logos land
```

`ExperienceConstellation` is imported directly in `app/page.jsx`; being a client component it hydrates on the client only. The canvas is mounted in `useEffect` (engine creation is client-only by construction), and the shell reserves height via CSS aspect-ratio so there is no layout shift and no hydration mismatch. Optional but planned: `next/dynamic` from within the client wrapper to keep the engine/renderer out of the initial route chunk, and an IntersectionObserver so the engine only *starts* when the section first approaches the viewport.

Estimated added client JS: **~10–14 KB gzipped**, all first-party.

---

## 4. Data model and assets

### Data

Extend `components/ConstellationData.js` (kept as the single source of truth):

```js
// shape per item — id, label, category (existing), plus:
// atlasIndex: number   → cell in the sprite atlas
// href?: string        → optional link shown in the selection card
// blurb?: string       → one-liner for the selection card
```

500 items × ~5 short fields inlines at a few KB — no fetching, no API.

### Logos: sprite atlas, not 500 files

500 individual images would mean 500 requests + 500 decodes + per-image cache/texture thrash. Instead:

1. **Preferred: build-time atlas.** A small Node script (`scripts/build-atlas.mjs`, run manually or pre-build; `sharp` is already in the dependency tree via Next) packs source logos into a fixed-grid sprite sheet — e.g. 64 px cells, 23×22 grid ⇒ 1472×1408 px, exported as WebP at 1× and 2×, plus a JSON index. Decoded size at 2× is ~16 MB RGBA — acceptable on desktop; mobile tiers load the 1× sheet (~4 MB decoded). Loaded with `createImageBitmap` (off-main-thread decode), drawn via 9-arg `drawImage` source rects. One bitmap ⇒ optimal cache behavior.
2. **Fallback: runtime atlas assembly.** If logos ever come from a CMS, images stream in and are stamped into an offscreen atlas canvas as they arrive; nodes fade from placeholder to logo progressively. Same draw path.
3. **Until real artwork exists (today's repo has none):** procedural placeholder glyphs — category-colored rounded shapes with initials — stamped into the runtime atlas at startup. This makes the feature fully demoable now and makes the art drop-in later without touching the engine.

---

## 5. Motion design (how the four behaviors are implemented)

All per-node continuous values live in preallocated `Float32Array`s (structure-of-arrays layout) — no per-frame allocation, no GC hitches.

- **Integration:** one rAF loop; `dt` clamped to ≤ 33 ms (background-tab return safety). Each node runs a critically-damped spring toward `target + drift` — springs are frame-rate-independent with the standard closed-form damping (`exp(-k·dt)` form), so 60 Hz and 120 Hz displays and mid-frame hitches all look identical.
- **Subtle drift:** per-node sum of two incommensurate sinusoids with random phase/frequency/amplitude (assigned once from a seeded PRNG). Cheap (no noise textures, no RNG per frame), smooth, non-repeating to the eye. Amplitude is a tier/reduced-motion knob.
- **Pointer proximity:** pointer position written to the engine from `pointermove` (coordinates via cached canvas rect, invalidated on resize/scroll). Each frame, nodes within radius R get a smoothstep-falloff radial displacement plus a scale-up (magnify) — brute-force over 500 nodes, no spatial index needed. The nearest node within its hit radius becomes the hover node (tooltip + cursor). `pointerleave` decays the field to zero rather than snapping.
- **Selection:** `click`/`pointerup` hit-tests the hover candidate; engine reports `onSelect(id)`; React opens the DOM detail card; the selected node gets a persistent ring/scale drawn on canvas. Click on empty space or Esc deselects.
- **Filtering:** chips toggle category sets. Excluded nodes spring to `scale → 0.35, alpha → 0.12` (still drawn — 500 draws is cheap and keeps the "constellation" silhouette) rather than despawning; re-including springs them back. Counts on chips come from the data, not the engine.
- **Regrouping:** two layout modes computed in `layout.js` as *slot targets*:
  - *Scatter:* blue-noise-ish spread (jittered grid or low-discrepancy sequence) across the section.
  - *Grouped:* four cluster centroids (responsive arrangement: 4-across on wide, 2×2 on narrow); within each cluster, nodes take **phyllotaxis (sunflower) slots** — deterministic, evenly packed, zero overlap by construction, no solver.
  Toggling assigns new targets with a small stagger (index- and distance-based, ~300 ms spread) and lets the same springs carry every node — filtering, hover, drift, and regroup all compose because they are all just forces/targets on the same integrator.
- **Theming:** renderer reads `--surface`, `--line`, `--muted`, category accent colors from computed style at init and on `prefers-color-scheme` change; glow/ring sprites are pre-rendered once to tiny offscreen canvases (never per-frame `shadowBlur`, which is a notorious Canvas 2D cost).

---

## 6. Lifecycle, resilience, and Next.js integration details

- **Client boundary:** `"use client"` on `ExperienceConstellation` only; the page stays a server component. No `window`/`document` at module scope anywhere in the engine (constructed inside `useEffect`), so SSR and prerendering never see browser APIs.
- **No CLS:** the section shell has a fixed `aspect-ratio` (e.g. 16/9 desktop, 4/5 mobile via breakpoint) with a static CSS dot-pattern placeholder until the engine's first frame, then a short fade-in.
- **Start/stop discipline:** IntersectionObserver starts the loop when the section is near the viewport and fully stops it (cancels rAF) when off-screen; `visibilitychange` pauses on hidden tabs. When `prefers-reduced-motion` *and* no transition is running, the loop parks entirely and wakes on interaction — zero idle cost.
- **Resize:** ResizeObserver on the shell → resize backing store to `cssSize × min(devicePixelRatio, tierCap)`, recompute slot layouts (debounced ~150 ms), positions re-normalized proportionally so nothing jumps.
- **Teardown:** engine returns a `destroy()` releasing rAF, observers, listeners, and bitmaps; called from the effect cleanup (React 19 StrictMode double-invoke safe: create/destroy are idempotent).
- **Scroll neutrality:** the canvas listens to pointer events only; wheel/touch scrolling over the section is untouched (no `preventDefault` on move unless a drag interaction is ever added — none planned).

---

## 7. Performance budget and mobile degradation

Frame budget targets: **≤ 4 ms JS+raster on a 2019-class laptop (≥ 60 fps with headroom); ≥ 40 fps on a mid-range Android after tiering.**

Quality tiers (in `quality.js`):

| Knob | Tier 0 (desktop) | Tier 1 (mid) | Tier 2 (low/mobile floor) |
|---|---|---|---|
| DPR cap | 2 | 1.5 | 1 |
| Nodes drawn | 500 | ~320 | ~180 (deterministic stratified sample per category; filter counts still reflect all data) |
| Drift amplitude | full | reduced | minimal |
| Glow/ring sprites | on | on | flat ring only |
| Pointer field radius | full | full | n/a (touch: tap-select only, small tap ripple) |
| Atlas | 2× sheet | 1× sheet | 1× sheet |

Tier selection: initial guess from `pointer: coarse`, `navigator.hardwareConcurrency`, `deviceMemory` (where present) — then **corrected by measurement**: a rolling 60-frame average of frame time steps the tier down if > ~12 ms sustained, and may step back up after sustained headroom. Measured truth beats device sniffing.

Touch specifics: no hover concept — proximity field is disabled; tap = select (larger hit radius, ≥ 32 px effective target); the detail card renders as a bottom sheet on narrow viewports.

`prefers-reduced-motion`: drift off, transitions become short cross-fades (or instant), proximity displacement replaced by a non-moving highlight. All functionality (filter, select, regroup) fully retained.

---

## 8. Accessibility

Canvas pixels are invisible to assistive tech, so the plan is honest parity, not a 500-item DOM mirror (which would be noise for screen readers and a perf tax):

- Section landmark + heading; filter chips and the group toggle are real `<button>`s with `aria-pressed`; visible focus styles from the existing design tokens.
- The canvas is focusable (`tabIndex=0`, `role="application"`, labelled with a dynamic summary: "Experience constellation: 500 items in 4 categories, 320 shown"). Arrow keys move a virtual cursor through the *currently visible* nodes (ordered category-then-label); the focused node gets the same visual ring as hover; a visually-hidden `aria-live="polite"` region announces "Node label, category, 12 of 320". Enter opens the DOM detail card (focus moves into it; Esc returns).
- The detail card and chips are ordinary DOM — screen-reader and keyboard users can reach every piece of information the pointer path exposes.

---

## 9. Dependencies

- **Added: none.** Springs, phyllotaxis layout, drift, hit-testing, and atlas handling are ~600 lines of first-party JS total — less code than the integration glue most libraries would require, and all of it inside the section's own chunk.
- **Removed: none.**
- **Dev-only, optional:** the atlas build script uses `sharp`, which is already present transitively via Next; if pinning it as an explicit `devDependency` is preferred once real logos arrive, that is a build-time-only addition.
- **Pre-negotiated future additions** (only if requirements change): `d3-force`/`d3-quadtree` for solver-based cluster collisions; PixiJS (or raw WebGL behind the existing renderer interface) if node count grows past ~2,000 or shader effects are requested.

---

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Mid-range mobile still janks at Tier 2 | Adaptive governor already steps down; final floor is a static (drift-free) but still tap/filterable constellation — decided by measurement, not guesswork. |
| Real logos arrive with odd shapes/sizes | Atlas script normalizes into fixed cells with padding; contain-fit with transparent margins; placeholder glyph path keeps the feature shippable meanwhile. |
| StrictMode double-mount leaks engines | Single `create/destroy` pair in one effect; `destroy()` idempotent; verified in dev. |
| Canvas looks wrong when theme flips | Colors read from CSS variables at init + `matchMedia('(prefers-color-scheme: dark)')` listener re-reads and repaints. |
| Regroup transition looks chaotic (crossing paths) | Stagger by distance-to-target + per-category delay; if still unsatisfying, add slight curved interpolation (arc toward cluster centroid) — still no solver needed. |
| Keyboard/AT parity drifts from pointer features | A11y virtual cursor consumes the same engine API (`focusNode`, `select`) as the pointer path — one code path to keep honest. |

---

## 11. Implementation plan (for the follow-up task)

1. **Engine core** — data extension, typed-array state, spring integrator, scatter layout, placeholder-glyph runtime atlas, Canvas2D renderer, DPR/resize/visibility lifecycle. *Exit: 500 drifting nodes at 60 fps, theme-correct, no CLS.*
2. **Interaction** — pointer field, hover tooltip, click selection + detail card, filter chips, grouped layout + staggered regroup.
3. **Degradation + a11y** — quality tiers + adaptive governor, touch behaviors, reduced-motion paths, keyboard navigation + live region.
4. **Verification** — Chrome tracing on 4×/6× CPU throttle (budget: ≤ 4 ms desktop-class, ≥ 40 fps throttled); Lighthouse (no CLS, bundle delta ≤ 15 KB gz); manual pass on Safari + Firefox, iOS Safari + Android Chrome; axe + VoiceOver spot-check of chips/card/virtual cursor.

Each phase lands independently shippable behind the section boundary; nothing outside `app/page.jsx` (one import + one JSX line) and `components/` changes.

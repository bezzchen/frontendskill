# Proposal: Liquid/Refraction Media Effects for the Project Grid

Status: proposal only — no implementation yet.

## 1. Summary

Add a single shared, full-viewport, transparent WebGL2 canvas overlay (`pointer-events: none`, `aria-hidden`) that draws a GPU "twin" of each project media surface in its exact screen rectangle. Two hand-written fragment shaders provide (a) a pointer-driven liquid/refraction distortion on hover and (b) a dramatic liquid-dissolve transition when a project is opened. The server-rendered semantic DOM — links, headings, summaries, layout, focus behavior — is never restructured; the effect is a strictly decorative, capability-gated progressive enhancement written in raw WebGL2 with **zero new dependencies**.

## 2. What the repository contains (and what that implies)

| Fact | Source | Implication |
| --- | --- | --- |
| Next.js 16.2.12 App Router, React 19.2.8, Tailwind 4; plain JSX, npm | `package.json`, `jsconfig.json`, `postcss.config.mjs` | Client-only enhancement must mount after hydration; keep server components server-rendered. |
| `ProjectGrid` is a **server component**: 8 `<a href="#project-N">` cards, each with an `aria-hidden` gradient `div[data-project-media]` (16:10), then `<h3>` + `<p>` | `components/ProjectGrid.jsx` | The media surface is already isolated and marked with a hook attribute; text/links live outside it. The grid must stay a server component for SEO. |
| Media surfaces are CSS gradients, not `<img>` — stand-ins for real project images | `components/ProjectGrid.jsx` | The effect layer needs a texture-source strategy that works for the gradient today and real images later. |
| No animation/graphics libraries installed | `package.json`, README | Any dependency we add is a deliberate cost, not an established convention. |
| Global CSS is minimal; light/dark via `color-scheme` + CSS variables | `app/globals.css` | New CSS should be a few scoped lines, not a system. |
| `SettingsPanel` (client form) and `ConstellationData` exist but are unrelated | `components/` | Out of scope; do not touch. |

Hard constraints from the task: only the project **images** gain effects; text, layout, accessibility, SEO, and responsive behavior remain normal DOM.

## 3. Decision rubric: what "least unnecessary complexity" means here

The **irreducible** complexity of this feature is fixed regardless of architecture:

1. Two custom fragment shaders (refraction hover, open transition) — no library ships these; they are the actual "high-end" work.
2. DOM↔GPU synchronization — measuring media rects and keeping the GPU quads aligned through resize, scroll, and responsive reflow.
3. Interaction orchestration — pointer tracking, click interception for the transition, and a fallback ladder (no JS / no WebGL2 / reduced motion / touch).

Every candidate architecture pays those three costs. So the choice reduces to: which architecture adds the **least extra machinery around that core** while preserving the DOM invariants? That is the rubric used below.

## 4. Proposed architecture

### 4.1 Shape

```
app/page.jsx
  <ProjectGrid />                     ← unchanged server component (semantic truth)
  <LiquidMediaLayer />                ← new one-line mount, client component

components/fx/LiquidMediaLayer.jsx   ← "use client": gates, canvas mount, tile
                                       registry, pointer/click orchestration, rAF loop
components/fx/renderer.js            ← plain JS, no React: WebGL2 context, 2 programs,
                                       unit quad, textures, per-tile draw
components/fx/shaders.js             ← GLSL strings: shared vertex, hoverFrag, transitionFrag
app/globals.css                      ← ~4 lines: canvas positioning; [data-fx-hidden]{visibility:hidden}
```

- The DOM stays the single source of truth. `ProjectGrid.jsx` needs **no markup change** (the `data-project-media` hook already exists). Optionally, a future `data-fx-src` attribute can point at a real image.
- `LiquidMediaLayer` renders `null` on the server and until mounted (no hydration mismatch). After mount and capability checks, it creates one fixed, full-viewport, transparent canvas above the page content with `pointer-events: none` and `aria-hidden="true"`. All clicks, hovers, and keyboard focus continue to hit the real DOM links underneath.

### 4.2 Tile registry and DOM sync

- On activation, query `[data-project-media]`, and for each: record its element, measure `getBoundingClientRect()`, and register a "tile".
- While the layer is **active** (pointer over a card, ripples still decaying, or a transition playing), re-read rects each frame — 8 rect reads per frame is trivial and is the simplest correct answer to scroll + reflow. When idle, the rAF loop is **stopped**: zero CPU/GPU cost at rest.
- `ResizeObserver` on tiles + window resize listener trigger re-measure and canvas/DPR resize (DPR capped at 2 for performance).
- `IntersectionObserver` culls offscreen tiles from drawing.

### 4.3 Pixel ownership handshake

- The DOM gradient remains the rendered surface until the GL twin has drawn its **first frame** for that tile; only then does the media div get `data-fx-hidden` (`visibility: hidden` — layout preserved, box intact). This avoids both double-paint seams and a flash of blank.
- Any failure — context loss, texture error, gate flip (e.g., user enables reduced motion) — removes the attribute and the DOM surface reappears instantly. `webglcontextrestored` re-activates. The DOM node is never removed or replaced.

### 4.4 Texture strategy

- Today: the gradient stand-ins are rasterized once into a small offscreen canvas (or a single shared texture, since all 8 are identical) and uploaded as the tile texture — the GL twin is pixel-equivalent to the CSS gradient.
- Later: if a media div contains an `<img>` or declares `data-fx-src`, that image becomes the texture (same-origin or CORS-clean required). The renderer treats both identically.

### 4.5 Hover effect — liquid refraction

- Per-tile quad; fragment shader samples the tile texture with displaced UVs.
- Pointer model: a short uniform trail (~12 recent pointer points with age and velocity) produces decaying radial ripples; the summed height-field gradient drives a refraction offset, with slight per-channel offsets (chromatic aberration) and a soft specular glint along the wavefront. This achieves the "liquid glass" look **without** render-to-texture ping-pong buffers.
- A persistent flow-map (ping-pong FBO) version is a possible later upgrade, not v1 — it adds FBO management for a marginal visual delta.
- Effect intensity eases in/out; after the pointer leaves, ripples decay for ~1s and the loop stops.

### 4.6 Open transition — shader dissolve

- Click (or Enter — it is the same activation on the `<a>`) on an enhanced card: `preventDefault()`, promote that tile's quad to a transition draw — the image expands/zooms with a radial liquid dissolve and heavy refraction (~500–650 ms) — then perform the original navigation in a `finally` block, so navigation can **never** be lost to an animation error, and a hard timeout (~800 ms) guarantees it.
- With today's `#project-N` hash links this is: play, then jump. If the site grows real `/projects/[slug]` routes, mount `LiquidMediaLayer` in `app/layout.jsx` instead so the overlay survives the route change and can play across it; the architecture is unchanged.
- Where gates fail (below), clicks are never intercepted at all — native navigation.

### 4.7 Activation gates and fallback ladder

Enhance only when **all** hold, checked live via `matchMedia` listeners:

1. JavaScript ran and React mounted (else: server-rendered grid, gradient, native links — full SEO/no-JS story).
2. `WebGL2` context obtainable (else: no canvas mounted).
3. `(prefers-reduced-motion: no-preference)` (else: fully static; no hover effect, no transition, no click interception).
4. `(hover: hover) and (pointer: fine)` (else — touch devices: fully standard behavior; no scroll-jank risk, no meaningless hover effect).

Every rung down the ladder is byte-identical to today's page.

### 4.8 Invariants (acceptance criteria)

- **SEO / no-JS**: server HTML unchanged; crawlers and no-JS users see exactly the current markup.
- **Accessibility**: canvas is `aria-hidden` and non-interactive; tab order, focus outlines (drawn on the card, outside the media rect the quad covers), link semantics, and screen-reader output unchanged; transition is short, reduced-motion-respecting, and never blocks navigation.
- **Responsive**: quads track the real layout each active frame; disabling the layer is the mobile behavior by default.
- **Performance**: 0 CPU/GPU at rest (loop stopped); ~8 textured quads and ≤2 programs when active; first-party JS ≈ 4–6 KB gzip; no third-party bytes.
- **Reversibility**: deleting the one-line mount (and the `fx/` folder) restores the baseline exactly.

## 5. Why this beats the nearest alternatives

**Per-card `<canvas>` elements (one GL context per card).** The seemingly simpler option — canvases sit in-flow, so scroll/resize sync is free. Rejected because: browsers cap live WebGL contexts (~8–16; eight cards already flirts with eviction, and project #9 breaks it); programs/textures are duplicated per context; and the open transition must escape the card's bounds, which forces a *second*, fullscreen canvas anyway — at which point you own both architectures. The shared overlay replicates the "free" sync with a few rect reads per active frame.

**three.js (or react-three-fiber).** ~150 KB+ gzip of scene graph, cameras, color-management, and material system to draw textured quads with two custom shaders — the library's value is almost entirely unused, and R3F additionally couples the render loop to the React tree for content that must explicitly *not* be React-managed DOM. This is the textbook case of unnecessary complexity: the hard parts (shaders, DOM sync) remain ours to write anyway.

**ogl or curtains.js (the credible middle).** curtains.js is purpose-built for DOM-synced WebGL planes, but is effectively unmaintained and still needs bending for the fullscreen transition quad. ogl (~15 KB gzip used portion) is genuinely minimal and would save ~150 lines of context/program/texture boilerplate. Rejected — narrowly — because in a repo with zero graphics dependencies, the boilerplate it removes is the *easy*, stable 30% of the code, while adding a supply-chain item, version drift, and a second API to learn. The complexity that matters is identical either way. **If the team prefers a helper, ogl is the sanctioned swap-in; nothing else in this architecture changes.**

**SVG filters (`feTurbulence` + `feDisplacementMap`) / CSS-only.** Zero-dependency and DOM-native, but it cannot deliver pointer-local refraction: displacement maps would have to be re-rasterized per pointer move on the main thread, filter performance during scroll is poor (notably in Safari), and the result reads as "wobble", not high-end liquid glass. Fails the quality bar that motivates the feature.

**WebGPU.** No visual gain at this scope, and its support story would force a WebGL fallback — i.e., two pipelines. WebGL2 is universally available in evergreen browsers and Safari 15+.

**DOM-capture approaches (html2canvas-style) or moving cards into GL.** Directly violates the constraint that text/layout/a11y stay normal DOM. Only the media surface may go GPU.

**View Transitions API.** Solves cross-fade/morph, not shader refraction; could later complement route changes but cannot replace the fragment shaders.

## 6. Dependencies

- **Added: none.** Raw WebGL2, first-party code only (~350–450 lines across three new files).
- **Removed: none.**
- Sanctioned alternative if maintainers prefer a wrapper: add `ogl` only — never three.js/R3F for this scope.

## 7. Implementation plan (when approved)

1. `components/fx/shaders.js` — vertex shader + `hoverFrag` (ripple-trail refraction) + `transitionFrag` (liquid dissolve).
2. `components/fx/renderer.js` — context creation, program compile/link with error surfacing, unit-quad VAO, texture upload, per-tile uniforms, draw; context-loss handlers.
3. `components/fx/LiquidMediaLayer.jsx` — gates, canvas lifecycle, tile registry (measure/observe), pointer trail, click interception + guaranteed navigation, activity-gated rAF loop, `data-fx-hidden` handshake.
4. `app/page.jsx` — mount `<LiquidMediaLayer />`; `app/globals.css` — canvas + `[data-fx-hidden]` rules.
5. Verify: tab-through and screen-reader pass unchanged; JS-disabled render identical; `prefers-reduced-motion` fully static; touch untouched; simulated context loss restores DOM instantly; Lighthouse a11y/SEO scores unchanged; idle CPU/GPU at zero.

## 8. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Rect-sync lag during fast scroll | Rects re-read every active frame (8 reads is cheap); loop is off when idle, so there is nothing to desync at rest. |
| Real images later arrive cross-origin | Require CORS-clean sources for `data-fx-src`; on texture failure, tile silently stays DOM-rendered. |
| GL context loss (tab backgrounding, GPU reset) | First-frame handshake + instant `data-fx-hidden` removal; re-init on `webglcontextrestored`. |
| Transition traps navigation | Navigation in `finally` + hard timeout; gates mean unenhanced clicks are never intercepted. |
| Battery/thermals | Activity-gated loop, DPR cap, IntersectionObserver culling, touch devices excluded. |

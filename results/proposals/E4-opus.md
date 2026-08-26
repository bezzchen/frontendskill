# Proposal: liquid/refraction media layer for the project grid

Status: proposal only, nothing implemented.
Scope: project **media** gets a pointer-driven refraction effect and a dramatic transition on open. Everything else stays ordinary server-rendered DOM.

---

## 1. What is actually in the repo today

| File | Relevant facts |
| --- | --- |
| `app/layout.jsx` | Root layout, server component, `metadata` title/description only. No `metadataBase`. |
| `app/page.jsx` | Server component. Renders header, `<ProjectGrid />`, settings section. |
| `components/ProjectGrid.jsx` | **Server component, no `"use client"`.** 8 hardcoded projects. |
| `components/SettingsPanel.jsx` | The only client component in the app. |
| `components/ConstellationData.js` | 500 generated objects, **imported by nothing**. Dead code. |
| `app/globals.css` | Tailwind v4 via `@import "tailwindcss"`, CSS custom properties, light/dark via `prefers-color-scheme`. |
| build config | **There is no `next.config.*` at all.** Only `postcss.config.mjs` and `jsconfig.json` (`@/*` alias). |
| deps | `next@16.2.12`, `react@19.2.8`, `react-dom@19.2.8`, `tailwindcss@4.3.3`. No animation, WebGL, or 3D library. `node_modules` is not installed. |

Three findings that materially shape the design:

**Finding 1 — there are no project images.** The "media" is a decorative gradient box:

```jsx
<div aria-hidden="true" className="aspect-[16/10] rounded-lg bg-[linear-gradient(135deg,#d8d8d2,#a7a79f)]" data-project-media />
```

There is no `public/` directory and no `<img>` anywhere in the app. A refraction shader needs a texture to refract, so **step one is introducing real images**, not the effect itself. The good news: `data-project-media` already exists as a hook, and `aspect-[16/10]` already reserves the box, so adding an `<img>` costs zero layout shift.

**Finding 2 — "opened" has no implementation, and the current links are broken.** Cards link to ``href={`#project-${project.id}`}``, but no element in the repo has `id="project-1"` (or any of the others). Clicking a card today does nothing except append a hash. So the "transition when a project is opened" is not an enhancement of an existing behaviour — the destination has to be designed as part of this work. That is a decision point, not a detail (see §6).

**Finding 3 — `ProjectGrid` is a server component and should stay one.** The naive way to add pointer interaction is `"use client"` at the top of `ProjectGrid.jsx`. That would ship the grid's markup and data to the client bundle and hand the effect a veto over how the content renders. The architecture below is chosen specifically so this file needs **no client code at all** — only three `data-*` attributes and a real `<img>`.

---

## 2. What the requirement actually demands

Decomposing "high-end liquid/refraction on pointer move, dramatic shader-like transition on open, everything else normal DOM":

1. **Per-pixel resampling of the image with a spatially varying offset.** Refraction means "sample this texel from somewhere else, with per-channel divergence". That is a fragment shader. CSS `filter`, `backdrop-filter`, and transforms cannot express it — they cannot make a pixel read a *different* pixel of the same element.
2. **Pointer state with inertia.** "Liquid" is not "offset proportional to cursor position". It reads as liquid because the displacement field *lags and decays* — a smoothed pointer, a velocity term, and a falloff over time.
3. **The open transition must be continuous with the hover state.** The dramatic moment is the *same pixels* the user was just distorting, tearing loose and flying to the detail view. If the hover effect and the open effect are separate systems, there is a visible handoff and the illusion dies.
4. **Everything else is untouched.** Headings, summaries, links, focus order, crawlable text, the responsive grid, `prefers-color-scheme` — all plain DOM, all unaffected.

Requirement 3 is the one that decides the architecture. It rules out anything where the hover effect lives inside the card, because at open time the effect must escape the card and cover the viewport.

---

## 3. Recommended architecture: **one persistent WebGL2 overlay, driven by DOM rects, with content components untouched**

### The shape

```
app/layout.jsx  (server)
  └── <MediaFX />                          ← the ONLY client component added; mounted once
        ├── <canvas>  position:fixed; inset:0; pointer-events:none; z-index:50
        └── controller (plain JS, no React state in the hot path)
              ├── scans the document for [data-project-media]
              ├── reads their rects each animation frame
              ├── draws one textured quad per card, positioned to match its rect
              └── intercepts [data-project-link] clicks to run the open transition

app/page.jsx → ProjectGrid  (server, unchanged semantics)
  <a href="/projects/1" data-project-link data-project-id="1">
    <div data-project-media data-project-id="1" class="aspect-[16/10] rounded-lg overflow-hidden">
      <img src="/projects/01.jpg" alt="" width="1600" height="1000" loading="lazy" />   ← texture source AND fallback
    </div>
    <h3>…</h3>  <p>…</p>
  </a>

app/projects/[id]/page.jsx  (server)
  <div data-project-hero data-project-id="1"><img … /></div>
  <h1>…</h1>  <article>…</article>
```

The entire integration contract is **three data attributes**: `data-project-media`, `data-project-link`, `data-project-hero`. Delete `<MediaFX />` from the layout and the site is exactly what it is today, plus real images.

### How it works

**The DOM `<img>` is the source of truth, not a hidden implementation detail.** It is in the markup, server-rendered, crawlable, in the layout flow, responsive via `srcset`/`sizes`. It is also the texture source: the controller waits for `img.decode()`, uploads it with `texImage2D`, and only then fades the `<img>` to `opacity: 0` (never `display:none` or `visibility:hidden` — it must stay laid out and loading). If WebGL never initialises, the fade never happens and the user sees a perfectly normal image. There is no "fallback path" to maintain; the fallback is the default state.

**One quad per card, positioned from its rect.** Each frame the controller reads `getBoundingClientRect()` for the cards it is drawing and passes `uRect` (x, y, w, h in CSS px) plus `uResolution` to the vertex shader, which maps to clip space. One full-canvas viewport, no per-draw `gl.viewport`/`gl.scissor` juggling. Corner radius is reproduced in the fragment shader with a rounded-box SDF so the GL quad matches Tailwind's `rounded-lg` instead of showing square corners over a rounded card.

**Render on demand — there is no persistent `requestAnimationFrame` loop.** The loop starts when a card is hovered or a transition is in flight, and stops when the last card's hover energy decays to zero. At rest — which is most of the time, and *all* of the time on touch devices — the GPU is idle, the canvas is `opacity: 0`, and the page is 100% ordinary DOM. This is not just a performance nicety: it also removes the classic fixed-canvas-vs-scroll problem, because during scrolling nothing is being drawn, so there is no rect to lag. (A hover that survives a scroll can drift by a frame; the mitigation is to zero the hover on `scroll`, which is also what the pointer semantics want.)

**Textures upload lazily and are capped.** Eight 1600×1000 RGBA textures is ~51 MB of VRAM if uploaded eagerly. Upload on first `pointerenter` for a card, keep an LRU of ~6, and re-upload on the `<img>`'s `load` event so a `srcset` breakpoint change swaps the texture. On coarse pointers nothing is ever uploaded.

**One shader, one code path, for both effects.** This is the key simplification. The hover distortion and the open transition are not two systems — they are the same draw call with different uniforms:

```glsl
// per-card uniforms: uTex, uRect, uPointer (local 0..1), uVelocity, uHover, uTime, uRadius, uProgress
// 1. gaussian lens around the smoothed pointer:  falloff = exp(-d*d / r2)
// 2. radial refraction offset:                   off  = normalize(p - uPointer) * falloff * amp
// 3. trailing ripple:                            off += sin(d*freq - uTime*speed) * falloff
// 4. low-frequency curl noise (the "liquid" idle) off += curl(p*scale + uTime) * uHover
// 5. transition amplitude, a bell curve:         off *= 1.0 + kBoom * sin(uProgress * PI)
// 6. chromatic split (this is what sells refraction):
//      r = texture(uTex, uv + off*1.06).r
//      g = texture(uTex, uv + off      ).g
//      b = texture(uTex, uv + off*0.94).b
// 7. glass sheen:  += pow(falloff, 3.0) * 0.12
// 8. alpha = antialiased roundedBox(p, mix(uRadius, 0.0, uProgress))
```

Three texture fetches, one pass, no framebuffers, no ping-pong. The grid state is simply `uProgress == 0`. There is no branch, no second pipeline, and no handoff — which is exactly what requirement 3 asked for.

**GLSL lives in template literals in a `.js` file.** No `raw-loader`, no `glslify`, no webpack/turbopack rule. The repo currently has *no* `next.config.*` and this proposal keeps it that way. Touching the build config to load shader files would be a real, permanent cost for zero benefit at this size.

### Files

| File | Change |
| --- | --- |
| `components/media-fx/MediaFX.jsx` | new, `"use client"`. Capability gate + canvas mount + lifecycle. ~60 lines. |
| `components/media-fx/renderer.js` | new, plain JS. Context, program, quad buffer, texture LRU, draw. ~180 lines. |
| `components/media-fx/shaders.js` | new. Vertex + fragment source as template strings. ~90 lines. |
| `components/media-fx/controller.js` | new. DOM scan, rect sync, pointer smoothing, click interception, transition timeline. ~160 lines. |
| `app/layout.jsx` | add one `<MediaFX />` element. |
| `components/ProjectGrid.jsx` | add real `<img>`, swap `href` to the real route, add 3 data attributes. **Stays a server component.** |
| `app/projects/[id]/page.jsx` | new server route: `generateStaticParams`, `generateMetadata`, hero + body. |
| `public/projects/*` | new image assets (currently none exist). |
| `components/ConstellationData.js` | **delete** — dead code. |

Roughly 500 lines of new effect code, entirely quarantined under `components/media-fx/`, with a three-attribute interface to the rest of the app.

---

## 4. Why this over the nearest alternatives

### 4a. One `<canvas>` per card — *the closest "obvious" alternative*

Each card owns a small canvas; the effect is self-contained per component.

Rejected because **it cannot do the open transition**. At open time the media must leave its box and fill the viewport. A per-card canvas is clipped by its own element; growing it means either FLIP-transforming the canvas (which stretches its backing store — the shader output visibly blurs and the pixel density goes wrong) or handing the texture to a *second*, full-screen canvas mid-flight, which means a second context, a second shader, a re-upload, and a one-frame seam precisely at the most visible moment of the interaction. That is strictly more machinery than the overlay, in exchange for a worse result.

Secondary problems: browsers cap simultaneous WebGL contexts (commonly around 8–16, with the oldest silently killed), and the grid is at 8 today with no pagination — a ninth project starts evicting contexts. Eight contexts also means eight programs, eight quad buffers, eight rAF loops, and eight extra compositing layers.

### 4b. `three.js` / `react-three-fiber` (+ `drei`, `postprocessing`)

The default reach for "shader on the web".

Rejected on cost/benefit. What is needed here is: an orthographic full-screen quad, one `ShaderMaterial`, one texture. What three.js brings is a scene graph, camera stack, geometry library, material system, loaders, raycaster, and animation system — roughly a 150 kB-gzip class dependency, of which this feature uses a rounding error. `react-three-fiber` adds a second React reconciler and its own render loop, and couples the site's React 19 upgrade path to r3f's. Then, because the effect must track DOM rects, you *still* write the rect-sync layer (or adopt `drei`'s `<View>`, i.e. another abstraction). The three.js version of this feature is not meaningfully shorter than the raw one — it is the same logic wrapped in a large runtime.

Three.js becomes correct the moment there is real 3D: perspective, lighting, loaded geometry, a postprocessing stack. None of that is in the brief.

### 4c. `OGL` (or `twgl`, `picogl`) — *the genuinely close call*

A ~10 kB-gzip WebGL wrapper with a clean `Program`/`Mesh`/`Texture` API. This is the strongest alternative and deserves a real answer rather than a dismissal.

Rejected, narrowly, on the "least unnecessary complexity" criterion as stated. The renderer here is one program, one static quad buffer, one uniform block, and a texture cache — about 180 lines against WebGL2, an API that has been frozen for years and will never issue a breaking change or a security advisory. A dependency converts that into a permanent upgrade obligation, a second set of docs a future maintainer must learn, and one more thing that can disagree with React 19 / Next 16. For code that will be written once and then only edited inside the shader, the wrapper is negative value.

**The condition that flips this:** if the effect grows to multi-pass rendering — a ping-pong FBO for a decaying pointer trail (the "true" liquid trail), bloom, or instanced draws — the hand-rolled renderer starts reimplementing OGL badly, and adopting OGL becomes correct. I would treat that as the explicit trigger to add it, not something to pre-empt now. §7 lists that upgrade with its cost.

### 4d. CSS / SVG filters only (`feTurbulence` + `feDisplacementMap`)

Zero dependencies, zero WebGL, and it does technically produce displacement.

Rejected as the *mechanism*, kept as the *fallback*. Animating `feTurbulence`'s `baseFrequency` or `seed` forces a filter-region re-rasterisation every frame, largely on the CPU; across eight 16:10 boxes at DPR 2 this is a reliable frame-rate collapse, and behaviour differs sharply between Chromium, Gecko, and WebKit (Safari has a long history of both perf cliffs and outright rendering differences in this filter chain). It also cannot do per-channel divergence properly, which is most of what makes refraction legible, and it has no answer at all for the open transition. Where it *is* useful: a single static `feDisplacementMap` (no animation) is a decent no-WebGL still-frame treatment, if a treatment is wanted there at all.

### 4e. View Transitions API for the open

Attractive, and the right tool for the *text and layout* half of a page transition.

Rejected for the media because View Transitions snapshot elements into static images and then transform/cross-fade those snapshots. You cannot run a fragment shader over a snapshot, and a live `<canvas>` caught in a snapshot freezes mid-animation — which is the one element that must not freeze. It is also still experimental in Next.js, so it would put an experimental flag on the critical path of the site's headline interaction. The recommendation is plain CSS for the DOM half and the persistent canvas for the media half; View Transitions can be layered on later for the text if desired, independently.

### 4f. A smooth-scroll library (Lenis / Locomotive) to make rect-sync exact

Sometimes proposed to eliminate fixed-canvas scroll lag by moving scroll into JS.

Rejected. It is a dependency that degrades native scrolling — scrollbar behaviour, keyboard paging, find-in-page scroll-into-view, and momentum on trackpads — to fix a problem the render-on-demand design does not have (nothing is drawn while scrolling). Trading accessibility for a sub-frame alignment on an effect that is off during scroll is a bad trade.

### 4g. A `<dialog>` overlay instead of a real route for "open"

Rejected on the user's own SEO constraint, and it is not even simpler. A dialog has no crawlable URL, so either project detail content is invisible to search or it has to be duplicated somewhere else. And a correct dialog needs focus trapping, `inert` on the background, Escape handling, scroll locking, and `history.pushState` sync — plausibly *more* code than `app/projects/[id]/page.jsx`, which gets URLs, metadata, static generation, and no-JS support for about twenty lines. The route is both simpler and strictly better here.

---

## 5. Progressive enhancement matrix

Because the DOM `<img>` is the source of truth, every degraded path is "do nothing" rather than "run a different code path".

| Condition | Behaviour |
| --- | --- |
| No JS / JS error | Server-rendered grid, real `<img>`, real links. Fully functional. |
| No WebGL2 / context creation fails | `MediaFX` returns `null`, no canvas mounted, images stay visible. |
| `webglcontextlost` fires | Restore image opacity, tear the canvas down, do not retry. |
| `prefers-reduced-motion: reduce` | No canvas. Open uses an ordinary navigation with a short CSS opacity fade. |
| `(pointer: coarse)` — touch | No hover effect (there is no hover). No textures uploaded. Tap navigates; open transition optional per §6. |
| `save-data` / low device memory | Skip GL. (Cheap check, worth including.) |
| Cmd/Ctrl/Shift/middle click | Click interception bails out; the browser navigates normally, new tab works. |
| Slow image decode | GL waits on `img.decode()`; the `<img>` is visible until the texture is ready. No flash of nothing. |

Accessibility is unchanged by construction: the canvas is `aria-hidden="true"` and `pointer-events: none`, the images remain decorative (`alt=""` is correct here — the adjacent `<h3>` and summary already name the project, so descriptive alt text would be redundant announcement), focus order is untouched, and no element is removed from the a11y tree.

---

## 6. The open transition

**Decision required (see Finding 2):** the cards currently link to non-existent anchors. I recommend replacing them with a real route, `app/projects/[id]/page.jsx`, statically generated with `generateStaticParams` and per-project `generateMetadata`. This satisfies the SEO constraint directly, works with JS disabled, and gives the transition a real landing target. The alternative — keeping it on one page as a dialog — is argued against in §4g.

Sequence:

1. **Click** on `[data-project-link]`. Bail out (letting the browser navigate) on modified clicks, non-left buttons, reduced motion, or no GL. Otherwise `preventDefault()`.
2. **Lift.** The card's texture is already uploaded (the user was hovering it). `uProgress` begins animating; the quad's target rect lerps from the card rect toward the viewport, corner radius lerps to 0, and the distortion amplitude follows `sin(uProgress * π)` — so the image tears into a peak of refraction and chromatic separation mid-flight, then resolves clean. Optionally 4–6 samples along the motion vector for a directional smear during the peak only.
3. **Navigate in parallel.** `router.push()` fires at the same moment; the grid's other cards fade out via ordinary CSS. The canvas lives in the root layout, which App Router preserves across navigations, so nothing remounts and the animation is never interrupted.
4. **Land.** The detail page registers `[data-project-hero]`; the controller reads its rect and lands the quad there, fades GL to 0 and the hero `<img>` to 1. Focus moves to the `<h1>`; scroll resets. Total ~700–900 ms.
5. **Back navigation: plain crossfade, no GL.** Deliberately out of scope for v1. A reverse transition needs the source card's rect to exist *and* the grid's scroll position to be restored before the animation can be aimed — which means either blocking on restoration or animating to a guessed rect. That is where this class of system typically doubles in complexity, and it buys much less than the forward transition. Worth revisiting once the forward path is proven.

---

## 7. Known costs, risks, and the limits of this design

- **Rect sync is a real coupling.** The GL layer reads layout the DOM owns. Mitigated by reading rects in the same frame as the draw (never from a throttled scroll listener) and by only drawing while hovering. Font swaps or late-loading content that reflows the grid mid-hover can misalign for a frame; a `ResizeObserver` on the grid re-syncs.
- **Fixed canvas above content.** `z-index: 50` with `pointer-events: none`. It only paints inside media rects during hover, so it never covers text; during the transition covering the page is the intent. Anything added later that overlaps a media rect (a sticky header scrolling past) needs a z-index check.
- **CORS.** Same-origin images from `public/` are fine. If images later move to a CDN, they need `crossOrigin="anonymous"` and permissive CORS headers or `texImage2D` will taint and throw.
- **VRAM.** Bounded by the lazy upload + LRU cap. Worth re-checking if the grid grows past ~20 projects, at which point an `IntersectionObserver`-driven upload/evict policy replaces "upload on hover".
- **DPR.** Clamp the backing store to `min(devicePixelRatio, 2)`; DPR 3 phones do not need a 3× canvas for an effect they will never see.
- **The one upgrade I would ring-fence:** a ping-pong FBO storing a decaying pointer trail, used as a normal map. It is what elevates "wobble near the cursor" to "the surface remembers where you dragged". It costs two framebuffers, a second shader, and a resize policy — and it is the point where adopting OGL (§4c) becomes the right call. I am proposing to *not* build it initially, and to treat a request for it as an explicit, costed follow-up rather than smuggling it in now.

---

## 8. Dependencies

**Added: none.** No three.js, no react-three-fiber, no OGL, no GSAP, no Framer Motion, no Lenis, no GLSL loader, no `next.config.*`. The effect is raw WebGL2 (universally available in every browser that has been current for years), plain JS, and inline GLSL strings.

**Removed: none from `package.json`.** `next`, `react`, `react-dom`, and `tailwindcss` all stay at their current versions.

**Deleted file:** `components/ConstellationData.js` — 500 generated objects imported by nothing. Unrelated to this feature, but it is dead weight sitting in `components/` and this is the moment to notice it.

**Added assets:** project images under `public/projects/`. There are none today, and the feature is meaningless without them. `next/image` is already available via the existing `next` dependency if `srcset` generation is wanted — the GL layer is agnostic and reads `img.currentSrc` either way.

---

## 9. How this would be verified

- `npm run build` succeeds; `ProjectGrid` is absent from the client bundle (still a server component).
- View source on `/` and `/projects/1`: headings, summaries, `<img src>`, and `<a href>` all present in the server HTML.
- JS disabled: grid renders, images render, links navigate.
- `prefers-reduced-motion: reduce` forced: no canvas element in the DOM.
- Keyboard-only: tab order unchanged, focus visible, Enter navigates, focus lands on the detail `<h1>`.
- DevTools ▸ Rendering ▸ disable WebGL: images visible, no console errors.
- Mobile viewport at 375 px: single column, no canvas activity, no texture uploads.
- Performance profile during a hover sweep across all 8 cards: frame budget and VRAM within the caps in §7.

---

## 10. Open questions

1. **Route vs. dialog for "open"** — I recommend the real route (§6, §4g), but it does mean inventing detail-page content that does not exist yet. Confirm before implementation.
2. **Real image assets** — are there actual project images to use, or should placeholders be generated? The effect cannot be evaluated on gradients.
3. **Reverse transition on back** — confirm that a plain crossfade is acceptable for v1 (§6, step 5).
4. **Effect ceiling** — is the single-pass procedural refraction the target, or is the FBO pointer-trail version the actual expectation? That answer changes both the line count and the dependency recommendation (§7, §4c).

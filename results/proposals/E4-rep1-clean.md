# Proposal: Liquid/refraction distortion on project media + shader-driven open transition

Status: proposal only, no implementation.
Scope: visual effect on project card media in `components/ProjectGrid.jsx` and the click-to-open moment. Everything else (text, layout, links, forms, SEO, responsiveness) stays untouched, plain DOM.

---

## 1. What the repository is today (audit findings)

- **Stack:** Next.js 16.2.12 (App Router), React 19.2.8, Tailwind CSS 4 via `@tailwindcss/postcss`. Plain JSX, no TypeScript. No animation, 3D, or graphics dependency of any kind in `package.json` / lockfile.
- **Page:** `app/page.jsx` is a server component rendering a header, `<ProjectGrid />`, and a client-side `<SettingsPanel />` form.
- **Grid:** `components/ProjectGrid.jsx` is a **server component** (no `"use client"`). Eight cards, each a semantic `<a href="#project-{id}">` containing:
  - a media placeholder: `<div aria-hidden data-project-media class="aspect-[16/10] ... bg-[linear-gradient(...)]" />` — there are **no real image files yet**;
  - an `<h3>` title and `<p>` summary.
- **"Opening" a project** currently means following a same-page `#project-{id}` anchor. There are no `/projects/[slug]` routes yet.
- **Theming:** CSS custom properties with automatic light/dark via `prefers-color-scheme`.
- Incidental: `components/ConstellationData.js` is never imported anywhere (dead code, unrelated to this feature; not part of this proposal).

Two facts drive the whole design: the grid is already server-rendered semantic HTML with a `data-project-media` hook on exactly the element we want to enhance, and the effect target is the only thing that needs a GPU — nothing else on the page does.

---

## 2. Requirements, distilled

1. **Pointer effect:** high-end liquid/refraction distortion on the project media only, following pointer movement. "High-end" implies fluid, trailing displacement (a flowmap-style effect), not a canned CSS wobble.
2. **Open transition:** a more dramatic shader-like effect when a card is activated.
3. **Invariants (non-negotiable):**
   - Headings, summaries, and links remain real DOM rendered on the server. No text ever moves into a canvas.
   - The `<a>` stays the interactive element: keyboard activation, focus, middle-click/cmd-click, and crawlability must behave exactly as they do now.
   - Layout and responsive behavior remain owned by CSS/Tailwind. The effect must never cause layout shift or change breakpoints.
   - The page must be fully usable with JS disabled, WebGL unavailable, `prefers-reduced-motion: reduce`, or on touch devices.

---

## 3. Recommended architecture

**One shared, full-viewport WebGL2 canvas overlay with DOM-rect-synced textured planes, implemented as a self-contained progressive-enhancement layer using the OGL micro-library. The DOM remains the source of truth; the GL layer is a disposable mirror of the media elements only.**

### 3.1 Shape

```
app/layout.jsx                    server component, unchanged except: renders <GLRoot />
components/ProjectGrid.jsx        UNCHANGED markup/semantics (data-project-media already exists;
                                  later, an optional data-texture="/img.jpg" attribute per card)
components/gl/GLRoot.jsx          "use client". Capability gate + lazy loader + lifecycle owner.
components/gl/scene.js            OGL renderer, plane registry, per-frame rect sync,
                                  on-demand rAF loop, click interception for the transition.
components/gl/flowmap.js          low-res ping-pong render-target pair accumulating pointer
                                  velocity as a decaying fluid trail (viewport space, shared).
components/gl/shaders.js          GLSL strings: media vertex/fragment (flowmap-driven UV
                                  displacement + chromatic refraction + uProgress transition),
                                  flowmap fragment.
app/globals.css                   a few lines: canvas overlay styles; hide DOM media only
                                  while the GL mirror is live (html[data-gl="on"] [data-project-media] { opacity: 0 }).
```

### 3.2 How it works

- **DOM as contract, zero React coupling.** `ProjectGrid` stays a server component. The GL layer discovers `[data-project-media]` elements at init and treats their DOM rects and (future) `data-texture` URLs as its entire input. No context providers, no prop threading, no client-component conversion of the grid.
- **One canvas, N planes.** A single `position: fixed; inset: 0; pointer-events: none; aria-hidden` canvas sits above the page. For each media element the scene draws one textured quad at exactly that element's `getBoundingClientRect()`, re-read on each rendered frame (8 rects/frame is negligible). Everywhere else the canvas is transparent, so no text or control is ever obscured. CSS keeps sole ownership of layout; GL only mirrors it.
- **Swap, don't stack.** When the renderer has a plane ready, it sets `html[data-gl="on"]`; CSS fades the DOM media to `opacity: 0` underneath its pixel-perfect GL twin. On `webglcontextlost`, teardown, or any error, the attribute is removed and the untouched DOM media reappears instantly. The fallback is not a degraded mode — it is the current site.
- **Pointer effect.** Pointer position/velocity feeds a small (≈128–256 px) ping-pong flowmap render target in viewport space — one for the whole page, shared by all planes. Each media fragment shader samples the flowmap to displace UVs, with slight per-channel offset for the refraction/chromatic look. This is the standard "liquid hover" construction on high-end portfolio sites, and it degrades to a perfectly still image when the pointer is idle.
- **Open transition.** A delegated click listener on the card anchors intercepts only plain left-clicks (no modifier keys; keyboard Enter dispatches the same click event and takes the same path). It runs a ~700 ms uniform-driven transition on the clicked card's plane — the quad's rect interpolates from the card rect toward the viewport while a noise-driven liquid dissolve/refraction spike plays — then performs the original navigation (`location.assign(href)` today; `router.push` once real detail routes exist). Modified clicks, middle clicks, and no-GL environments never hit the interceptor, so native link behavior is preserved bit-for-bit.
- **Mount point: `app/layout.jsx`.** A client component rendered by the server layout keeps the layout itself a server component, and in the App Router the layout subtree persists across client navigations — so when `/projects/[slug]` pages are added later, the same canvas can carry the transition across the route change without re-initializing. Costs nothing today.

### 3.3 Gating, performance, and lifecycle

- **Lazy, conditional boot.** `GLRoot` renders nothing at first paint. In an effect it checks, in order: `prefers-reduced-motion: reduce` → abort; `(hover: hover) and (pointer: fine)` fails (touch devices) → abort; WebGL2 context creation fails → abort. Only when all pass does it `import()` the GL bundle (OGL + effect code), so the default/first-load JS cost for phones, bots, and reduced-motion users is ~0.
- **Render on demand.** The rAF loop runs only while the pointer is over the grid, a transition is playing, the flowmap is still decaying, or a scroll/resize is in flight; otherwise it fully idles. A portfolio page must not spin the GPU at 60 fps forever.
- **Budget:** OGL subset on the order of 10–20 KB min+gzip with zero transitive dependencies, plus roughly 5–8 KB of effect code — all behind the dynamic import. Device-pixel-ratio capped at 2. Eight quads = eight draw calls + one flowmap pass; trivial for any GPU that passes the gate.
- **Textures.** Today the media is a CSS gradient, so the initial texture is procedural (same gradient generated in-shader or via a tiny offscreen canvas). When real assets land, the recommendation is plain `<img alt="…">` (or `next/image`) inside the media div — restoring real SEO/a11y image semantics — with the GL layer uploading from the element's `currentSrc`. Same-origin assets in `public/` mean no CORS ceremony.

### 3.4 Accessibility / SEO guarantees (explicit)

- Canvas is `aria-hidden="true"`, `pointer-events: none`, contains nothing focusable, and adds no DOM inside the cards.
- Server-rendered markup is byte-identical with the feature present; crawlers and screen readers see exactly today's document.
- Reduced-motion users get zero GL and zero interception — plain links. (Optionally, a subtle CSS-only hover and the browser-native View Transition crossfade can serve as the reduced-motion "open" affordance; that is polish, not architecture.)
- No layout shift: the canvas is a fixed overlay; nothing is measured into layout.

---

## 4. Why this beats the nearest alternatives

The complexity currencies here are (a) dependency weight/abstraction layers and (b) hand-owned plumbing code. The recommendation minimizes both *for the required quality bar*; each alternative loses on one axis without winning enough on the other.

1. **Raw WebGL2, zero dependencies (nearest alternative).** Same architecture, no library. Rejected because the savings are illusory: we would hand-own ~400–600 lines of exactly the plumbing that goes wrong — context creation/loss, DPR resize, texture upload state, and especially the ping-pong FBO machinery for the flowmap. OGL is a commodity wrapper for precisely this genre (Renderer/Program/Mesh/Texture/RenderTarget), has zero transitive dependencies, and is small enough to vendor if its maintenance ever stalls. If the project adopts a hard no-new-dependencies rule, this alternative is the fallback and the architecture above transfers unchanged.
2. **three.js (optionally React Three Fiber + drei).** An order of magnitude more dependency (~150 KB gzip core before R3F/drei) to draw eight textured quads with two fragment shaders; the scene graph, lighting, loaders, and material system would be ~95% unused. R3F additionally inserts a second reconciler and pushes toward converting the server-rendered grid into a client React tree (drei's `<View>` solves rect-sync but drags all of the above in). Justifiable only if the site had broader 3D ambitions; nothing in the repo suggests that.
3. **Per-card canvases (regardless of library).** One `<canvas>` per media element looks simpler but is strictly worse: browsers cap live WebGL contexts (more projects would silently kill contexts), programs/textures get duplicated per context, and the open transition needs a viewport-sized surface anyway — forcing a second overlay canvas and a fragile visual hand-off mid-animation. The shared canvas makes the transition a property of the same plane that is already rendering the hover effect.
4. **SVG filters (`feTurbulence`/`feDisplacementMap`) or CSS-only.** Zero dependencies and DOM-native, but fails the stated bar: animated SVG displacement is rasterized on the main thread (notoriously janky in Safari), can't produce convincing refraction/chromatic response to pointer velocity, and has no path to a "dramatic shader-like" open transition. Right answer for a subtler brief; not this one.
5. **curtains.js / gpu-curtains.** curtains.js is purpose-built for DOM-synced WebGL planes but is effectively unmaintained; its successor gpu-curtains is WebGPU-first, and WebGPU is still not a safe baseline across the long tail in 2026. OGL covers the same need, actively maintained, smaller.
6. **Pixi.js with a DisplacementFilter.** Gets the hover effect quickly, but ships a full 2D engine (scene graph, event system, batching) we would not use, and the custom open transition needs bespoke shader work anyway — at which point Pixi is only overhead over OGL.
7. **View Transitions API for the open effect.** Native and cheap, but it is snapshot crossfade/transform only — no refraction or liquid displacement possible. Kept in the design as the reduced-motion fallback, not the headline effect.

Summary of the trade: the shared-canvas DOM-mirror pattern is the only architecture that delivers shader-quality effects while leaving the semantic layer literally untouched, and OGL is the smallest tool that removes the error-prone GL plumbing without adding an abstraction layer we don't use.

---

## 5. Dependency changes

- **Add:** `ogl` (runtime dependency; ~10–20 KB min+gzip for the imported subset, zero transitive dependencies, loaded only via dynamic import behind the capability gate).
- **Remove:** none. The project has no unused dependencies. (Non-dependency housekeeping note: `components/ConstellationData.js` is dead code and could be deleted separately.)
- Explicitly **not** added: three.js, @react-three/fiber, drei, GSAP (rAF + easing functions suffice for one timeline), Pixi, curtains. No config changes to Next/Tailwind/PostCSS are needed.

---

## 6. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Sub-pixel misalignment between GL plane and card border radius | Planes render the media rect exactly; DOM media is faded (not removed) underneath, so any 1px seam shows the identical gradient/image. Border radius handled in-shader (rounded-rect mask) matching the CSS radius token. |
| WebGL context loss (tab restore, GPU reset) | `webglcontextlost` handler drops `html[data-gl="on"]`; DOM media reappears instantly; optional re-init on `webglcontextrestored`. |
| Responsive images later (`srcset`) changing `currentSrc` | Upload once at init; listen for `load` on the `<img>` and re-upload on `currentSrc` change. Known, contained. |
| Scroll while hovering desyncs planes | Rects are re-read on every rendered frame, and scroll keeps the loop awake until settled. |
| OGL maintenance stalls | Zero-dependency ESM small enough to vendor into `components/gl/` verbatim. |
| Battery/thermals on laptops | On-demand rAF (idle when pointer leaves and flowmap has decayed), DPR cap, low-res flowmap target. |

---

## 7. Out of scope / open questions for later

1. **Real project images.** When assets exist, switch the placeholder divs to real `<img alt>` elements (SEO/a11y win independent of this feature); the GL layer consumes them without markup redesign.
2. **Project detail routes.** Today "open" resolves to `#project-{id}`. When `/projects/[slug]` pages are added, the layout-mounted canvas allows the transition to persist across client navigation and settle onto the detail hero. The transition API should keep `duration`/`onComplete` decoupled from the navigation target for this reason.
3. **Touch devices.** Deliberately excluded from GL (no hover to warm up, battery cost). If a tap-time transition is wanted later, the gate can be relaxed to allow transition-only mode on touch.

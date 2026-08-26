# Proposal: Experience Constellation — Rendering Architecture

**Status:** Proposal only. No implementation in this change.
**Scope:** One bounded, interactive section on the existing Next.js page containing ~500 small logo/image nodes that drift, react to the pointer, support selection/filtering, and smoothly regroup by category.

---

## 1. What the repository tells us

Survey of the fixture as it stands:

| Fact | Evidence | Implication |
|---|---|---|
| Next.js 16.2.12, App Router, React 19.2.8 | `package.json`, `app/` directory | Server Components by default; the constellation must be an explicit client island (`"use client"`) |
| Plain JavaScript, no TypeScript | `jsconfig.json`, `.jsx`/`.js` files only | New code should be `.jsx`/`.js` to match conventions |
| Tailwind CSS v4 via PostCSS | `postcss.config.mjs`, `@import "tailwindcss"` in `app/globals.css` | Section chrome (heading, filter chips, detail panel) styles with existing utilities + CSS vars (`--surface`, `--line`, `--muted`, …) |
| Dataset already exists: 500 items, 4 categories | `components/ConstellationData.js` (`engineering`, `research`, `design`, `math`) | No data layer to invent; extend in place if per-category colors/metadata are needed |
| Dependency lockfile is deliberately frozen | Git commit `72f37fc "Freeze dependency lock for official eval"`; README: fixture intentionally ships *no animation or graphics libraries* | Strong pressure toward a **zero-new-dependency** architecture; adding three.js/pixi/framer-motion would churn a pinned lockfile |
| No image assets in the repo (no `public/`) | File listing | "Logo" nodes must be procedurally rasterized placeholders and/or lazily loaded remote images — the renderer must treat node imagery as async |
| Page is otherwise light and semantic | `app/page.jsx` (header, `ProjectGrid`, `SettingsPanel`) | The constellation must not degrade the rest of the page: no global scroll listeners doing work, no rAF running when the section is off-screen |

---

## 2. Requirements → technical implications

1. **~500 image nodes, continuously drifting.** Every node's position changes every frame. This is a *per-frame full-scene update*, not an occasional transition — the deciding constraint.
2. **Pointer proximity response.** Per frame: distance from pointer to (potentially) every node, with displacement/scale falloff. Again per-frame, most-nodes work.
3. **Selection + filtering.** Discrete state changes (click/tap a node, toggle category chips) that must animate smoothly (dim/shrink filtered-out nodes, highlight selection) and remain interruptible.
4. **Regroup by category.** A layout transition: all 500 nodes ease from one arrangement to another, interruptible mid-flight.
5. **Bounded section in a React page.** React owns the shell and controls; the visualization must not force React renders at animation frequency.
6. **Smooth on a normal laptop, sensible degradation on mobile.** Explicit performance budget and a quality ladder, not best-effort.

The scale — **500 continuously animated sprites** — sits in a very specific zone: clearly *above* the comfortable envelope for per-element DOM/SVG animation, and one to two orders of magnitude *below* the point where WebGL becomes necessary.

---

## 3. Options considered

### Option A — DOM: 500 absolutely-positioned elements, JS-driven `transform`
Each node an `<img>`/`<div>`, positions written per frame (bypassing React state).

- **Pros:** best accessibility story (real focusable elements); familiar; Tailwind-stylable per node; crisp text.
- **Cons:** 500 per-frame style writes trigger style recalc + composite across ~500 layers every frame. Promoting 500 image elements to their own compositor layers costs significant GPU layer memory; *not* promoting them causes repaints. Hover-proximity means most nodes update every frame, so there is no "settled" state for the browser to optimize. In practice DOM stays smooth up to ~100–200 continuously animated elements on mid-range hardware; 500 with per-frame proximity math is beyond it, and mobile fails first. Filter/regroup transitions for 500 elements (FLIP or per-element WAAPI) multiply the cost.
- **Verdict:** rejected on the core requirement (sustained 60 fps with all nodes moving). Right tool at ≤150 nodes, not 500.

### Option B — SVG
Same per-element update model as DOM plus SVG scene-graph overhead; `<image>` elements repaint poorly at this count; per-element compositor promotion is less reliable than for HTML elements.

- **Verdict:** rejected — strictly worse than Option A for continuous transforms at this scale. (SVG remains the right choice for *static* diagrams, not 500-sprite animation.)

### Option C — Canvas 2D: one `<canvas>`, sprite atlas, immediate-mode redraw ← **chosen**
Single canvas for the whole section. All 500 logos pre-rasterized once into an offscreen sprite-atlas canvas; each frame clears and blits 500 atlas cells at simulated positions.

- **Pros:**
  - **Performance headroom.** 500 `drawImage` blits from an in-memory canvas atlas cost ~1–2 ms/frame on a mid-range laptop; the simulation (500 nodes × a few sin/lerp ops in typed arrays) costs microseconds. Comfortably 60 fps with most of the frame budget left for the rest of the page.
  - **Zero dependencies.** Pure web platform (Canvas 2D, rAF, ResizeObserver, IntersectionObserver, matchMedia). The frozen lockfile stays untouched.
  - **One compositor layer** instead of 500. Trivial for the browser to composite; no layer-memory blowup on mobile.
  - **Degradation is a knob, not a rewrite:** cap devicePixelRatio, halve node count, halve sim tick rate — all one-line levers on the same renderer.
  - **Everything is "targets + easing".** Drift, proximity, filtering, selection emphasis, and regrouping are all just per-node target values the simulation eases toward, which makes every transition interruptible for free.
- **Cons (and mitigations):**
  - Nodes aren't DOM ⇒ accessibility must be designed deliberately (see §6: real `<button>` filter chips, DOM detail panel, sr-only list fallback, keyboard path).
  - Fill-rate bound at high DPR on large canvases ⇒ cap DPR (2 desktop / 1.5 mobile) and let the quality governor lower it further.
  - Per-node canvas effects (shadowBlur, filters) are slow ⇒ never use them per frame; bake hover/selection glow into atlas variants or one shared radial-gradient sprite.
- **Verdict:** **chosen.** It is the canonical tool for exactly this workload.

### Option D — WebGL via a library (three.js / react-three-fiber, or pixi.js)
Instanced quads + texture atlas; could render 50,000 nodes.

- **Cons:** +100–150 KB gzipped JS for a section that needs 1/100th of that capability; WebGL context creation/loss handling; shader + attribute plumbing; harder image/text rasterization pipeline; weaker a11y story; and — decisive in this repo — it requires editing a lockfile that was explicitly frozen for this fixture, whose README states it intentionally contains no graphics libraries.
- **Verdict:** rejected as over-engineering at n=500. Kept as the documented escape hatch (§8): the proposed simulation layer is renderer-agnostic, so a WebGL renderer could replace the Canvas 2D draw layer later without touching simulation or React code if the node count ever grows 10×.

### Option E — Raw WebGL (no library)
Avoids the dependency problem but replaces ~80 lines of `drawImage` with several hundred lines of shader/buffer/atlas/picking code for zero visible benefit at this scale. Highest implementation risk of all options.

- **Verdict:** rejected.

### Option F — Hybrid (canvas field + a few DOM nodes for hovered/selected)
Worth stealing one idea from: the **tooltip/label for the hovered node and the selection detail panel should be DOM**, positioned over the canvas — crisp text, stylable, screen-reader-visible. But keeping *whole nodes* in DOM buys nothing.

- **Verdict:** adopted only for tooltip + detail panel overlay.

### Decision matrix (summary)

| Criterion | DOM | SVG | **Canvas 2D** | WebGL lib | Raw WebGL |
|---|---|---|---|---|---|
| 60 fps @ 500 moving nodes (laptop) | ✗ marginal | ✗ | **✓ large margin** | ✓ overkill | ✓ overkill |
| Mobile behavior | ✗ | ✗ | **✓ tunable** | ✓ | ✓ |
| New dependencies | 0 | 0 | **0** | 1–3, ~100–150 KB gz | 0 |
| Implementation size/risk | med | med | **small** | med | large |
| Fits frozen-lockfile constraint | ✓ | ✓ | **✓** | ✗ | ✓ |
| Accessibility effort | low | low | **medium (designed below)** | high | high |

---

## 4. Chosen architecture

**Three strictly separated layers, one client island:**

```
app/page.jsx (Server Component)
└─ <ExperienceConstellation />            ← "use client" boundary (the only one added)
   ├─ React shell (owns UI state, never re-renders per frame)
   │   ├─ <h2> + intro copy
   │   ├─ Filter chips: real <button>s (All / Engineering / Research / Design / Math)
   │   ├─ Grouping toggle: Scatter ⇄ By category
   │   ├─ Detail panel (DOM): selected node's label/category/description
   │   ├─ Hover tooltip (DOM, absolutely positioned, aria-hidden)
   │   └─ <canvas> + sr-only fallback list + reduced-motion handling
   │
   ├─ engine.js (plain JS, zero React imports — unit-testable in Node)
   │   ├─ State: preallocated typed arrays (Structure-of-Arrays):
   │   │     x, y, homeX, homeY, targetHomeX/Y, scale, targetScale,
   │   │     alpha, targetAlpha, driftPhase, driftFreq, categoryId
   │   ├─ tick(dt, pointer): drift + proximity field + critically-damped
   │   │     easing of every value toward its target. No allocation per frame.
   │   ├─ layouts: scatter (jittered golden-ratio distribution across the
   │   │     section) and clustered (per-category phyllotaxis packing:
   │   │     r = c·√i, θ = i·137.5°, cluster centers responsive to width)
   │   ├─ commands (called from React handlers): setGrouping(mode),
   │   │     setFilter(categories), select(id) — each just rewrites targets,
   │   │     so any transition is interruptible mid-flight
   │   └─ pick(px, py): nearest node within pick radius (brute-force O(500)
   │         squared-distance scan — microseconds; no spatial index needed)
   │
   └─ renderer (canvas2d.js) + atlas.js
       ├─ atlas.js: rasterizes all node "logos" once into one offscreen
       │     canvas grid (≤4096px per side, drawn at min(dpr,2)).
       │     Ships procedural glyphs (category-colored rounded tile +
       │     initials) since the repo has no image assets; if real logo
       │     URLs are provided later, images load lazily and overwrite
       │     their atlas cell — renderer code unchanged.
       ├─ draw(state): clear → optional shared glow sprite under
       │     hovered/selected → 500 setTransform + drawImage blits with
       │     per-node alpha → selection ring (1 stroke) → done.
       │     No save/restore per node, no shadowBlur, no per-node fillText.
       └─ resize(): backing store = css size × cappedDPR via ResizeObserver
```

### Frame loop & React integration rules
- One `requestAnimationFrame` loop started in `useEffect`, torn down on unmount. It reads a **mutable controls ref** (pointer position, filter set, grouping mode, quality tier) that React handlers write into. React state changes at animation frequency: **zero**. React re-renders only on discrete events (chip click, node select).
- Canvas → React communication is event-based: `pick()` result on click/tap invokes `onSelect(node)` → normal `setState` → detail panel renders.
- **Pause discipline:** IntersectionObserver stops the rAF loop entirely when the section is off-screen; `visibilitychange` pauses on hidden tabs; `dt` is clamped on resume so nodes never teleport.
- SSR-safe: all canvas/observer work lives in effects; the server renders the section shell (heading, chips, sr-only list) with a fixed-aspect container so there is no layout shift when the canvas boots one frame later.

### Motion design (all cheap by construction)
- **Drift:** per-node `home + Σ two sin terms(phase, freq)` — bounded by design (no integration divergence over long sessions), O(n), organic-looking with per-node random phases. No physics engine, no O(n²) forces.
- **Pointer proximity:** within radius R (~120 px): radial displacement with smooth falloff + scale toward ~1.35× for the nearest nodes; values ease with a critically-damped spring so entry/exit never pops. Touch devices: the field follows the active touch point during `touchmove`; there is no hover state.
- **Regroup:** switching grouping rewrites `targetHomeX/Y` (with small per-node stagger by distance); the same easing carries nodes over ~700 ms. Because drift is *added on top of* the eased home position, motion never freezes during transitions.
- **Filter:** excluded nodes ease to `alpha 0.08, scale 0.6` (still drawn — dimming via per-blit `globalAlpha` is free); on the lowest quality tier they are skipped entirely.
- **Selection:** ring + slight scale-up on the selected node; other categories optionally dim.

---

## 5. Performance budget & degradation ladder

**Budget (mid-range laptop, DPR 2, 500 nodes):**

| Phase | Cost / frame |
|---|---|
| Simulation tick (typed arrays, 500 nodes) | ≪ 0.5 ms |
| 500 atlas blits + clear | ~1–2 ms |
| Glow/ring/tooltip positioning | ~0.1 ms |
| **Total** | **< 3 ms of a 16.7 ms budget** |

**Static tiering (chosen at mount):** viewport width, `navigator.hardwareConcurrency`, `navigator.deviceMemory` (where present), and coarse-pointer detection select the initial tier — e.g. small phones start at DPR ≤ 1.5 with ~250–300 nodes (a representative per-category sample; the sr-only list still names all 500).

**Adaptive governor (runtime):** an EMA of frame duration; if it stays over ~17 ms for ~60 consecutive frames, step down one tier with hysteresis (no oscillating back up):

1. DPR 2 → 1.5
2. DPR 1.5 → 1
3. Drift updates at half rate (proximity easing still every frame, so interaction never feels degraded)
4. Visible node count → 60 %, filtered-out nodes not drawn

**`prefers-reduced-motion`:** drift off; regroup/filter changes become a single short crossfade (or instant); proximity displacement off (hover still highlights). Honored reactively via `matchMedia` listener.

**Memory:** one atlas canvas, DPR-capped and rebuilt only on DPR change — in practice ~2200² RGBA ≈ 19 MB at 2× for 500 cells of 48 css-px logos; hard cap 4096 px per side.

---

## 6. Accessibility plan (the cost of leaving the DOM, paid explicitly)

- Filter chips and the grouping toggle are real `<button>`s with `aria-pressed`, fully keyboard operable — the *primary* interaction (filtering/regrouping) is therefore 100 % accessible without touching the canvas.
- The canvas gets `role="img"` and a live `aria-label` ("Constellation of 500 experiences, filtered to Design, grouped by category").
- A visually-hidden (`sr-only`) disclosure lists the nodes (label + category) so AT users can enumerate content; selecting from that list drives the same `select(id)` command and opens the same detail panel.
- The detail panel is plain DOM with a close button; selection changes are announced via `aria-live="polite"`.
- Hover tooltip is decorative (`aria-hidden`) since the sr-only list + panel carry the semantics.
- Full per-node keyboard traversal of 500 canvas nodes is deliberately *not* simulated (500 tab stops is an anti-pattern); the list + filters are the equivalent, honest affordance.

---

## 7. File plan (for the implementation change, not this one)

| File | Action |
|---|---|
| `components/constellation/ExperienceConstellation.jsx` | **Add** — client component: shell, chips, panel, tooltip, canvas wiring, observers, governor hookup |
| `components/constellation/engine.js` | **Add** — simulation state, tick, layouts, pick, commands (no React imports) |
| `components/constellation/atlas.js` | **Add** — atlas rasterization, procedural glyphs, async image slotting |
| `components/constellation/canvas2d.js` | **Add** — draw + resize (kept separate so a WebGL renderer could swap in) |
| `components/ConstellationData.js` | **Extend in place** — per-category hue + short description per node (same shape, no breaking change) |
| `app/page.jsx` | **Edit** — insert the constellation as a new section between the header and `ProjectGrid` |
| `app/globals.css` | **Possibly edit** — a `.sr-only` utility if we don't use Tailwind's; otherwise untouched |

Estimated first-party bundle impact: **~8–12 KB minified** of new client JS. No config changes; Tailwind v4 picks up new classes automatically.

## 8. Dependencies

- **Added: none. Removed: none.** The design intentionally keeps the pinned `package-lock.json` byte-identical.
- Explicitly *not* adding: `three`/`@react-three/fiber` (~150 KB gz, WebGL lifecycle burden, unnecessary below ~5k nodes), `pixi.js` (~100 KB gz, same), `framer-motion` (per-element DOM animation — wrong model for 500 sprites), `d3` (only force-layout would be relevant, and closed-form layouts + springs replace it in ~40 lines).
- **Escape hatch:** because the engine exposes plain typed arrays and the renderer is a separate module, scaling to many thousands of nodes later means writing/adopting a WebGL renderer behind the same `draw(state)` interface — no changes to simulation, interaction, React shell, or accessibility.

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Blurry sprites on high-DPR screens | Atlas rasterized at `min(dpr, 2)`; rebuilt if DPR changes (monitor move); nodes drawn at near-integer scales |
| Canvas fill-rate on large desktop sections at DPR 2 | Section height capped (~70 vh); governor's first lever is DPR |
| Safari quirks (`createImageBitmap`, OffscreenCanvas) | Atlas uses a plain hidden `<canvas>` (universally supported); `createImageBitmap` used only as a progressive enhancement for image decode |
| GC hitches | No per-frame allocations: SoA typed arrays, reused scratch objects, event handlers write into refs |
| Tab-restore / off-screen jumps | `dt` clamp on resume; loop fully paused via IntersectionObserver + `visibilitychange` |
| Interrupted transitions (user spams chips) | Everything is target-based easing — retargeting mid-flight is the normal path, not an edge case |

## 10. Verification plan (post-implementation)

1. Chrome DevTools Performance: sustained 60 fps on desktop with pointer sweeping the field; frame script time < 4 ms.
2. 4× CPU throttle: governor steps down within ~1 s; interaction remains responsive; no oscillation.
3. Mobile emulation (390×844, coarse pointer): reduced tier active, touch drag drives the proximity field, tap selects.
4. `prefers-reduced-motion: reduce`: no drift; filter/regroup crossfade only.
5. Keyboard-only pass: chips → toggle → sr-only list → detail panel, all operable; axe scan clean on the section.
6. Scroll the section off-screen / hide the tab: rAF stops (verified via Performance monitor), CPU returns to idle.
7. `npm run build` passes with no new dependencies and an unchanged lockfile.

---

**Summary of the decision:** a zero-dependency client island — React shell for controls and semantics, a renderer-agnostic typed-array simulation, and a single sprite-atlas **Canvas 2D** renderer — because 500 continuously animated image nodes is precisely the scale where DOM/SVG jank begins and WebGL's cost isn't yet justified, and because this repository's frozen lockfile makes "no new packages" not just elegant but expected.

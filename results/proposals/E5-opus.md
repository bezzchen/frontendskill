# Experience Constellation — Architecture Proposal

Status: proposal only, nothing implemented.

## 1. What is already here

| Fact | Implication |
| --- | --- |
| Next.js 16.2.12, React 19.2.8, App Router | RSC by default; effects double-invoke in dev StrictMode |
| Plain JavaScript + JSX (`jsconfig.json`, no `tsconfig`) | Match the house style — `.jsx`/`.js`, no TypeScript |
| Tailwind v4 via `@tailwindcss/postcss`, tokens as CSS custom properties in `app/globals.css` | The canvas has no CSS; it must **read** those tokens to stay on-theme |
| Light/dark handled by `prefers-color-scheme` only (no `.dark` class) | Theme changes arrive via `matchMedia`, not a class mutation |
| Exactly one client component (`SettingsPanel.jsx`) | The page is otherwise fully server-rendered; keep it that way |
| No `next.config.*` | Prefer an approach that needs no build/loader configuration |
| **No `public/`, no images anywhere in the repo** | There are no logo assets. The "logo nodes" need an answer (§4) |
| `components/ConstellationData.js` already exists — 500 items `{id, label, category}`, 4 categories, imported by nothing | This is the seed data for this feature; extend it, do not replace it |
| Zero animation/graphics/state dependencies | Any dependency added is the *first* of its kind — the bar should be high |
| `@/*` → `./*` path alias | Use `@/components/...` imports |

## 2. Rendering architecture — the decision

**Canvas 2D for the 500 marks, a thin DOM layer for everything interactive and accessible, and zero new dependencies.**

### The options, honestly compared

| Approach | 500 animated nodes | Verdict |
| --- | --- | --- |
| **DOM** (500 `<div>`/`<img>`, `transform` per frame) | Works, but with near-zero headroom. 500 compositor layers is real GPU memory (bad on phones), the per-frame style writes cost 1–3 ms before anything else happens, and one accidental layout read makes it fall apart. 500 `<img>` also means 500 requests/decodes unless sprited anyway. | Possible, fragile |
| **SVG** (500 `<use>`/`<image>`) | Same per-element DOM cost as above with worse rasterization and worse compositing. | No |
| **WebGL** (Pixi / three / raw) | Massive headroom — 500 instanced quads is nothing. But it costs 100–600 KB of dependency, shader code, and context-loss handling, to solve a throughput problem we do not have. | Over-engineered |
| **Canvas 2D + DOM overlay** | One element, one loop. 500 `drawImage` calls from a pre-baked atlas is ~0.6–1.5 ms/frame. Six-to-ten times the headroom we need, no dependency, and clean degradation levers. | **Chosen** |

### Why this is the right call, not just a safe one

1. **The budget closes with room to spare.** 60 fps = 16.7 ms/frame. Simulation is O(n) over 500 nodes (~0.2 ms). Draw is 500 `drawImage` from one atlas (~0.6–1.5 ms). Call it ~2 ms of the 16.7 ms — the rest of the page keeps its budget, which matters because this is *one section* of a longer scrolling site, not the whole page.
2. **Canvas makes the good version of the idea cheap.** It is called a constellation: faint links between near neighbours are what sell it. On canvas that is one `beginPath()` and one `stroke()` for ~1–2k segments — a single draw call. In DOM or SVG it is a thousand extra elements, so the feature would simply be cut. Same for glow, per-node tint, and a label chip on the hovered node.
3. **DOM's ceiling is our floor.** At 500 nodes DOM is at its limit; canvas is at roughly 15% of its limit. When the design inevitably gains a second visual layer, one architecture absorbs it and the other has to be rewritten.
4. **WebGL's advantage starts around 3–5k sprites.** We are at 500. Buying that headroom now costs a large dependency, a WebGL context inside a page that otherwise has none, and context-loss recovery on mobile. §9 defines the trigger that would change this answer.

### The seam that keeps the WebGL door open

The simulation is deliberately renderer-agnostic: state lives in `Float32Array`s, and the renderer is a single `draw(ctx, state, theme)` function. Swapping in `rendererWebgl.js` later touches one file and no simulation, layout, interaction, or accessibility code. This is why state is structure-of-arrays rather than an array of objects — that layout is also directly transferable to a Worker or a GPU buffer.

## 3. The core mechanism: one spring, four behaviours

Every node holds a current position and a **target** position. A single critically-damped spring pulls current toward target, every frame, forever. Then:

- **Drift** = the target wobbles by a few pixels (two out-of-phase sines seeded per node).
- **Regroup by category** = recompute targets from a different layout function. The spring does the animation.
- **Filtering** = matched nodes get foreground targets, unmatched nodes get quiet background targets plus a lower scale/alpha (themselves smoothed).
- **Resize** = recompute targets. Nodes glide to the new box instead of jumping.

This is the central design decision and it is worth stating plainly: **there are no transitions, no tweens, no animation library, and no special case for "regrouping."** There is one integrator, and every visual change is expressed as a change of target. That is what makes "smoothly regroup by category" a two-line feature instead of a subsystem, and it is why no animation dependency is needed.

Targets are recomputed only on *resize / mode change / filter change* — never per frame. Per-frame work is integrate + draw, nothing else.

**Framerate independence.** Rather than a fixed-timestep accumulator, use the dt-correct exponential form with `dt` clamped to `[1/240, 1/30]`:

```
dt    = clamp(now - last, 1/240, 1/30)       // clamp survives tab-away and jank
damp  = Math.exp(-c * dt)                    // computed ONCE per frame, not per node
v    += (target - pos) * k * dt;  v *= damp;  pos += v * dt
```

This behaves identically at 60 Hz and 120 Hz without substepping, and the one `Math.exp` is shared by all 500 nodes.

**Layout functions** (pure, `(items, w, h, state) → Float32Array`):
- `scatter` — golden-angle phyllotaxis mapped into the box plus deterministic jitter. Even coverage without clumps or grid artifacts, O(n), no relaxation pass.
- `clusters` — 4 category centres on an ellipse; phyllotaxis packing within each, radius ∝ √count so density stays constant regardless of group size.
- `focus` — used when a node is selected.

## 4. The asset problem (no logos exist in this repo)

`ConstellationData.js` has no image URLs and there is no `public/` directory, so this needs an explicit decision rather than an assumption.

500 individual images is a non-starter regardless: 500 requests, 500 decodes, 500 GPU uploads. The answer in every case is **one sprite atlas**. Two ways to get one:

- **(a) Ship a packed atlas** — correct when real brand logos exist. Needs assets we do not have and a packing build step we do not have.
- **(b) Bake the atlas at runtime, once, into an `OffscreenCanvas`** — a deterministic procedural mark per node derived from its `id`: a geometric glyph whose **shape varies by category** and whose hue comes from the theme tokens. Zero network, zero assets, zero config, and theme-aware.

**Proposed: (b) as the default, with (a) as a data-shaped seam.** The atlas module accepts the item list; if an item has a `logo` field it loads and packs that image into the same atlas, otherwise it draws the procedural fallback. Dropping in real logos later is a data change plus a build step, not a rewrite, and the visual system is identical either way.

Atlas sizing: 64 device-px cells in a 2048×2048 atlas = 1024 slots (500 needed). Mobile drops to 32 px cells in a 1024×1024 atlas. Identical `(shape, hue)` pairs dedupe to one cell.

Note that shape varies by category, not just colour — category is never conveyed by hue alone (§7).

**Hover and selected states are never atlas cells.** They are drawn as rings/glow with canvas primitives for the handful of affected nodes, so the hot path stays a uniform `drawImage` loop. Corollary rule: **never touch `ctx.shadowBlur` or `ctx.filter` inside the per-node loop** — both are pathologically slow. Glow, if used, is a pre-rendered radial-gradient sprite drawn over a few nodes only.

## 5. React integration

**Positions never enter React state.** React holds only `mode`, `activeCategory`, `selectedId`, `hoveredId`. The engine owns typed arrays and mutates them outside React entirely. `hoveredId` updates only when the id actually *changes*, so renders are rare. This is the single most common way these visualizations die, and it is worth naming: one `setState` per frame at 60 Hz reconciling a 500-item tree will not hold frame budget under any renderer.

Other integration decisions:

- **One `"use client"` boundary**, on the section component only. `app/page.jsx` stays a server component.
- **No `next/dynamic({ ssr: false })`.** The component renders a stable `<canvas>` plus a static server-rendered fallback and starts the loop in an effect — SSR-safe, and it reserves its box in the server HTML (`aspect-ratio` container) so there is no layout shift.
- **StrictMode-proof teardown.** React 19 double-invokes effects in dev; the effect must cancel its RAF, remove every listener, and disconnect both observers, idempotently.
- **`ResizeObserver` on the wrapper**, not `window.resize`. Sets the backing store to `round(cssW * dpr)`, recomputes targets, and the spring animates the reflow. Callback is rAF-coalesced.
- **`IntersectionObserver` stops the loop when the section is off-screen**, and `visibilitychange` stops it on a hidden tab. Both matter here specifically because this is one section of a long page — an unpaused loop would tax scrolling through the *rest* of the site. On resume, reset the time origin so `dt` does not integrate the whole pause.
- **Theme.** Read the existing CSS custom properties (`--background`, `--foreground`, `--muted`, `--line`, plus new category accents) via `getComputedStyle` on mount, and re-read + rebuild the atlas on a `prefers-color-scheme` `matchMedia` change. The visualization then honours the site's existing token system instead of hardcoding hexes, and light/dark just works.
- **`contain: paint`** on the wrapper to isolate the section from the rest of the page. (Worth measuring; `content-visibility` deliberately skipped to avoid interaction with the IntersectionObserver pause.)

## 6. Pointer handling

- One `pointermove` / `pointerdown` / `pointerleave` set on the wrapper, all `{ passive: true }`. Covers mouse, pen, and touch through one code path.
- **Events only store coordinates in a ref; all work happens in the RAF loop.** High-rate mice fire far above 60 Hz, and doing per-event work is a classic jank source.
- **`getBoundingClientRect()` is cached** and refreshed by the ResizeObserver and a rAF-throttled scroll handler — calling it per `pointermove` forces layout on every event.
- **Proximity force**: nodes within ~140 px are pushed radially outward with `(1 − d/R)²` falloff, and scale/brighten. The field parts around the cursor rather than attracting, which reads better and avoids clumping. The naive O(n) pass is genuinely fine at 500 — it rides along in the loop we are already running.
- **Picking** uses a uniform spatial hash grid rebuilt each frame (500 inserts, trivial). To be clear: the grid exists for hit-testing and for the neighbour-links pass, not because the forces need it at this node count.
- **Touch has no hover.** Proximity becomes a brief ripple pulse from the last tap; tap selects. **Never `preventDefault` on touchmove** — the section must not steal vertical page scroll. This is the most common way a canvas section ruins a mobile page.

## 7. Accessibility

A canvas is invisible to assistive technology, which is precisely why the DOM overlay is part of the architecture and not a bolt-on.

- **A roving-tabindex listbox** mirrors the data: one tab stop for the whole section, arrow keys traverse, `aria-activedescendant` tracks the current option, Enter selects, Escape clears. The canvas draws a focus ring at the focused node and eases it into view. (500 static options are inert and never re-rendered per frame; if it ever measures badly, virtualize to the filtered subset.)
- **Filter controls are real `<button>`s** with `aria-pressed`, and an `aria-live="polite"` status announces e.g. "Showing 125 of 500 — Design".
- **`prefers-reduced-motion` is a first-class branch, not a dimmer switch**: no drift, no pointer field, no RAF loop at all — a single static paint, with regrouping and filtering as an instant redraw or a very short fade. Interaction remains fully functional.
- **Category is encoded by shape as well as hue** so it does not depend on colour perception.
- **Selected-node detail is real DOM** (a card below the canvas), never canvas text.
- **Server-rendered fallback**: without JS, the reserved box contains a semantic `<ul>` of categories and counts. The content is not lost.
- Only the hovered/selected node ever gets canvas `fillText` — 1–3 per frame is free, 500 would not be.

## 8. Degradation ladder

Tier chosen from `matchMedia('(pointer: coarse)')`, `hardwareConcurrency`, `devicePixelRatio`, viewport width — **plus a runtime watchdog**: a rolling mean of the last 60 frame times; if it exceeds ~22 ms for two consecutive seconds, drop a tier. Demotion is one-way per session to prevent oscillation.

| Tier | Nodes | DPR | Effects |
| --- | --- | --- | --- |
| T0 desktop | 500 | min(dpr, 2) | drift + pointer field + neighbour links + glow accents |
| T1 mid | 500 | ≤1.5 | glow off, drift amplitude halved |
| T2 coarse pointer / mobile | ~220 (deterministic sample by id, category-proportional) | ≤1.5 | no pointer field (tap ripple), links off, 32 px atlas cells |
| T3 reduced motion / very weak | 500 | ≤1.5 | static paint, no RAF loop; interaction still works |

Sampling to ~220 on mobile rather than drawing all 500: 500 small `drawImage`s is survivable on a current phone, but the section is competing with the rest of the page on a device with a much smaller thermal budget, and ~220 keeps a comfortable margin on a four-year-old Android. Deterministic, category-proportional sampling keeps the composition stable and the filter counts honest.

DPR clamping is the highest-leverage lever: a 1200×750 CSS box at DPR 3 is an 8.1 Mpx backing store versus 3.6 Mpx at DPR 2.

Motion trails (translucent full-canvas fill instead of `clearRect`) are attractive but cost a full-canvas alpha blend per frame — desktop-only if used at all, default off.

## 9. Explicitly deferred, with triggers

- **Worker + `transferControlToOffscreen`.** Supported broadly enough now (Safari 16.4+), but at ~2 ms/frame it buys nothing against real added complexity — pointer coordinate marshalling, resize handshake, fallback path. *Trigger: main-thread contention from the rest of the page, or node count past ~3k.*
- **WebGL renderer.** *Trigger: >3–5k sprites, or per-node effects that need a shader.* The SoA state and the `draw()` seam are already shaped for it.
- **Offline atlas packing + real logo assets.** *Trigger: real brand assets arrive.* Would add a build-time script (possibly a devDependency such as `sharp`); runtime dependencies stay at zero either way.

## 10. Dependencies

**Add: none. Remove: none.**

Everything required is platform: Canvas2D, `requestAnimationFrame`, `ResizeObserver`, `IntersectionObserver`, Pointer Events, `matchMedia`, and `OffscreenCanvas` (with a trivial detached-`<canvas>` fallback for older Safari). The estimated cost of the whole feature is ~10–15 KB of our own JS.

Candidates considered and rejected:

| Candidate | Why not |
| --- | --- |
| `pixi.js` / `three.js` / `ogl` | 100–600 KB to solve a throughput problem that does not exist at n=500 (§2) |
| `framer-motion` / `motion` | Excellent at animating DOM — but animating 500 DOM nodes is the architecture we rejected. Its `useAnimationFrame` alone is not worth a dependency |
| `d3-force` | Our forces are not N-body: spring-to-target plus one pointer field, no node-node repulsion at rest. It also owns its own timer and alpha decay, which fights the loop in §3 |
| `d3-quadtree` | A uniform grid is simpler and faster at this node count and box size |
| `simplex-noise` | Two phase-offset sines are visually indistinguishable for "subtle drift" and cost nothing. If true curl noise is ever wanted, it is ~40 inline lines |
| `react-three-fiber` | Everything wrong with the WebGL option, plus a reconciler in the render loop |

This repo currently has **zero** runtime dependencies beyond Next and React. Being the first thing to break that is a high bar, and nothing above clears it.

## 11. Proposed file layout

Following existing conventions — `.jsx`/`.js`, `components/`, `@/` alias, no TypeScript.

```
components/
  ExperienceConstellation.jsx     "use client" — the ONLY React component:
                                  wrapper, canvas, filter controls, a11y listbox, detail card
  constellation/
    engine.js                     Framework-free class: SoA state, loop, forces,
                                  integration, spatial grid. Testable without React.
    layouts.js                    Pure target-generating functions
    atlas.js                      Sprite atlas baking (procedural + optional real logos)
    renderer2d.js                 draw(ctx, state, theme) — the swap seam
    tiers.js                      Capability detection + frame-time watchdog
  ConstellationData.js            KEPT — extend the generator with a glyph seed and
                                  an optional `logo` field. Do not change its shape.
app/
  page.jsx                        Add <ExperienceConstellation /> as a section.
                                  Stays a server component.
  globals.css                     Add category accent tokens beside the existing
                                  light/dark custom-property blocks
```

The split matters: `engine.js`, `layouts.js`, and `atlas.js` have no React and no DOM-framework coupling, so they can be reasoned about and tested in isolation, and the React component stays thin enough to read.

## 12. Interaction design being proposed

So this is a concrete proposal and not only an architecture note:

- ~500 small marks drift in a wide box inside the existing `max-w-6xl` container — `aspect-[16/10]` desktop, `aspect-[4/5]` mobile, with a min-height floor.
- Faint links join marks within ~70 px, opacity ∝ `(1 − d/70)` — the constellation texture, and free on canvas.
- The cursor parts the field within ~140 px; nearby marks scale to ~1.4× and brighten; the nearest gets a label chip.
- Category chips filter: unmatched marks desaturate, shrink, and recede to the background field rather than vanishing, so the composition never collapses.
- "Group by category" eases the field into 4 labelled clusters — same spring, no special case.
- Clicking a mark selects it: a ring on canvas, and a real DOM detail card.

## 13. Risks and open questions

1. **No logo assets exist.** §4 assumes procedural marks. If real logos are expected, that needs confirming — it adds a build step, though not a runtime dependency.
2. **Section placement and width.** Proposed inside the existing container between `ProjectGrid` and account settings; full-bleed would change the layout math and the reserved box.
3. **500 static listbox options** are cheap but not free; virtualize to the filtered subset if measurement says otherwise.
4. **Mobile sampling to ~220** is a defensible default, not a measured one — the watchdog is what makes it safe.

## 14. How this gets verified

- DevTools performance trace over a 10 s idle + hover session: scripting under ~4 ms/frame, no long task over 50 ms.
- `performance.now()` around simulate and draw, surfaced as an on-canvas readout behind a `?debug=1` flag.
- 4×/6× CPU throttling to emulate mid-range mobile; confirm the watchdog demotes and then holds steady.
- Confirm the RAF loop actually stops when scrolled away and on tab hide (frame counter).
- `prefers-reduced-motion`: confirm no RAF loop is ever started.
- Keyboard: tab into the listbox, arrow through, Enter to select, Escape to clear, focus ring visible throughout.
- Mobile: confirm vertical page scroll is never captured by the section.

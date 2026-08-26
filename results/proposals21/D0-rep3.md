# Proposal: Animated Topographic Hero Background + Magnetic CTA

Status: proposal only — no implementation in this change.

## 1. Context and constraints (from repo survey)

- **Stack**: Next.js 16.2.12 (App Router), React 19.2.8, Tailwind CSS 4.3.3 (`@tailwindcss/postcss`), plain JavaScript (`.jsx`, `jsconfig.json` with `@/*` → repo root). npm lockfile present.
- **Hero**: the `<header>` block at the top of `app/page.jsx` ("Portfolio / Jordan Lee / …"). `page.jsx` is a **server component**; the only client component today is `components/SettingsPanel.jsx`, which sets the precedent of small `"use client"` islands.
- **Theming**: CSS custom properties in `app/globals.css` (`--background`, `--foreground`, `--muted`, `--surface`, `--line`) with a `prefers-color-scheme: dark` override and `color-scheme: light dark`. Any canvas colors must be driven by these tokens, not hardcoded, and must react to scheme changes.
- **No animation library is installed.** The brief allows Motion (framer) conventions, so adding the `motion` package is in scope.
- **There is currently no CTA in the hero.** The brief asks for a magnetic effect on "the primary CTA", so adding one is part of the work (content decision flagged in §7).
- `components/ConstellationData.js` is unused by any route; unrelated to this task and will not be touched.

Derived constraints:

1. Keep `app/page.jsx` a server component; ship the two effects as small client leaf components.
2. Both effects are decorative. They must be invisible to assistive tech, must not affect text contrast or layout, and must degrade to a fully static-but-presentable hero under `prefers-reduced-motion` and on touch devices.
3. The site is otherwise dependency-light; every added dependency needs a justification, a license check, and a React 19 compatibility check.

---

## 2. Effect A — Animated topographic-line background

### 2.1 What "topographic lines" means technically

Contour lines (isolines) of a smoothly varying 2D scalar field — like elevation lines on a map. To animate them we evolve the field over time; to make them react to the pointer we perturb the field near the cursor. This framing dictates the architecture: **(field function) → (isoline extraction) → (stroke rendering)**, re-run per frame.

### 2.2 Options considered

| Option | How | Verdict |
|---|---|---|
| **A. Canvas 2D + simplex noise + marching squares** (recommended) | Sample a 3D noise field `n(x, y, t)` on a coarse grid each frame; extract isolines for ~8–12 thresholds with marching squares; stroke them on a `<canvas>` | Full control, cheap (<2 ms/frame at hero scale, budget in §2.4), zero rendering dependencies, colors read from CSS variables at draw time so dark mode "just works". Chosen. |
| B. WebGL fragment shader (raw WebGL, OGL, or three.js) | fbm noise in a shader, isolines via `fract`/`smoothstep` | Best raw performance and line quality, but heavy for a subtle portfolio background: shader boilerplate or a 3D library, harder CSS-token theming, context-loss handling, and GPU cost on low-end machines. Rejected as overkill. |
| C. SVG paths animated per frame | Recompute `d` attributes for ~10 paths per frame in React | DOM churn + attribute reparsing every frame; a React re-render loop is the wrong tool for 60 fps geometry. Rejected. |
| D. SVG `feTurbulence` displacement on static contour art | CSS/SMIL-animated filter | The filter is notoriously expensive and janky in Chrome/Safari at hero sizes; poor control over "subtle pointer reaction". Rejected. |
| E. Static layered contour SVGs + CSS parallax on pointer | Pre-drawn topo texture, layers translate slightly | Cheapest, but the lines never *morph* — fails the "animated" half of the brief; reads as a sticker, not terrain. Rejected as primary, but it is the natural reduced-motion fallback aesthetic (we get it for free by freezing one frame). |
| F. Off-the-shelf widget (e.g. Vanta.js "topology", tsParticles) | Drop-in script | Vanta's topology effect drags in p5.js (~100 KB+), isn't token-themable, and isn't true contour lines; tsParticles doesn't do contours at all. Rejected. |

### 2.3 Recommended design (Option A)

**Component**: `components/hero/TopoBackground.jsx` (`"use client"`), rendered inside the hero `<header>` (which gains `relative isolate`), absolutely positioned behind the text (`absolute inset-0 -z-10 pointer-events-none`), `aria-hidden="true"`.

**Field function** (pure module `lib/topo/field.js`):

- Base: `simplex-noise`'s `createNoise3D`, sampled as `noise3D(x * f, y * f, t * speed)` with one extra octave at `2f × 0.35` amplitude for detail. `f` tuned so ~4–6 contour "ridges" span the hero; `speed` slow (full character change over ~20–30 s) so the motion is ambient, not busy.
- Pointer reaction: add a Gaussian bump `A · exp(−d² / 2σ²)` centered on the *eased* pointer position (σ ≈ 140 px, A ≈ 30 % of field amplitude). This makes contour lines **bow gently around the cursor** — terrain responding — rather than the whole texture sliding, which is the subtle read we want. A small (~6 px) eased domain offset can be layered on for parallax if the bump alone feels too local; both knobs are constants in one place.
- Easing: pointer position and a 0→1 "presence" scalar (fades the bump in on `pointerenter`, out on `pointerleave`) are smoothed with frame-rate-independent exponential smoothing (`1 − exp(−dt/τ)`, τ ≈ 140 ms) inside the existing rAF loop. Rationale for not using Motion springs here: the canvas loop already owns a rAF tick and consumes plain numbers; a second animation scheduler adds coupling for no visual gain. Motion is still the right tool for the CTA (§3), where it drives DOM styles.

**Isoline extraction** (pure module `lib/topo/marchingSquares.js`):

- Marching squares emitting **line segments only** (we stroke, we never fill). This halves the classic algorithm: 16-case lookup per cell, 0–2 segments each, linear interpolation along cell edges, ambiguous saddle cases (5/10) resolved by center average. Because adjacent cells interpolate identical values on shared edges, unjoined segments render as visually continuous polylines — no polygon stitching needed. ~70–90 lines of dependency-free, unit-testable code.
- Alternative kept in the back pocket: `d3-contour` (MIT) if hand-rolled line quality disappoints — it produces smoothed filled polygons we could stroke, at the cost of a dependency plus per-frame GeoJSON allocation. Not planned; noted as the documented fallback.

**Rendering & lifecycle** (inside `TopoBackground.jsx`):

- Grid resolution ~16 CSS px per cell (hero ≈ 1152×480 → ~72×30 ≈ 2.2 k samples/frame); 8–12 thresholds; one `beginPath()` per threshold, 1 px strokes. Draw in CSS-pixel space with `ctx.setTransform(dpr, …)` so sampling cost is DPR-independent; cap DPR at 2.
- Colors: read `--topo-line-weak` / `--topo-line-strong` (new tokens added to `globals.css` for light and dark, derived from the existing `--line`/`--muted` family) via `getComputedStyle` at init and again on `prefers-color-scheme` change events. Alternate strong/weak per threshold like index/intermediate contours on real maps.
- Legibility: low-alpha thin lines plus a CSS mask on the canvas (`mask-image: radial-gradient(...)` or a linear fade) so density thins behind the headline block and dissolves into `--background` at the hero edges. Heading contrast is preserved because text sits above the canvas and the lines stay near-background luminance.
- Lifecycle: `ResizeObserver` (re-size buffers, redraw), `IntersectionObserver` + `visibilitychange` (cancel rAF when the hero is off-screen or the tab is hidden; timebase accumulates deltas so resume doesn't jump), full listener/observer cleanup on unmount.
- Pointer input: `pointermove` on the hero element (not `window`), gated by `matchMedia("(hover: hover) and (pointer: fine)")` — on touch devices the effect is ambient-only (no bump), avoiding jumpy warps while scrolling.
- **Reduced motion**: `prefers-reduced-motion: reduce` → draw exactly one static frame (t = 0, no bump), no rAF loop, no pointer listener; respond to live changes of the media query in both directions. The static frame still looks like designed topo art (Option E's aesthetic, for free).
- SSR/hydration: server renders an empty `<canvas>` (no varying attributes → no hydration mismatch); drawing starts in `useEffect`; a short CSS opacity fade-in on mount avoids pop-in.

### 2.4 Performance budget

- Per frame: ~2.2 k `noise3D` calls (×2 octaves) + ~22 k trivial cell evaluations + ~10 stroked paths ⇒ well under 2 ms on a mid-range laptop; comfortably 60 fps.
- Escape hatches (constants, plus one adaptive step if frame time exceeds ~4 ms): raise cell size to 20–24 px, drop to 8 thresholds, cap DPR at 1.5.
- Zero per-frame allocation churn: field and segment buffers are preallocated typed arrays / reused arrays.
- Added JS: own code ~3–4 KB min+gz; `simplex-noise` ~2.5 KB gz.

---

## 3. Effect B — Magnetic hover on the primary CTA

### 3.1 The CTA itself (currently missing)

The hero has no CTA today. Proposed: a primary CTA rendered as a **link styled as a button** — `View selected projects` → `#projects-title` (in-page anchor to the existing projects section) — plus optionally a quiet secondary text link (`Get in touch`, mailto). Link semantics because it navigates; the magnetic treatment applies to the primary only. Copy/destination is a content decision — see §7.

### 3.2 Options considered

- **CSS-only**: impossible — magnetism requires reading pointer position relative to the element.
- **Hand-rolled rAF + lerp**: workable, but we'd be reimplementing spring physics, interruption handling, and reduced-motion plumbing that Motion ships tested.
- **Motion (framer) springs** (recommended): the brief explicitly blesses Motion conventions; `useMotionValue` + `useSpring` is the canonical magnetic-button pattern, gives natural overshoot on release, and `useReducedMotion()` handles the a11y gate.

### 3.3 Recommended design

**Component**: `components/hero/MagneticCTA.jsx` (`"use client"`), exporting the styled CTA; internally a reusable `Magnetic` wrapper so the pattern can be applied elsewhere later.

- Imports from `motion/react` (`motion` package v13, the current name for framer-motion; identical conventions).
- Two motion values (`x`, `y`) fed through `useSpring` (≈ stiffness 300, damping 20, mass 0.2 — snappy follow, slight overshoot on release; exact values tuned by hand).
- On `pointermove` over the wrapper: offset from element center via `getBoundingClientRect()` per event (single small element — one layout read per pointer event is fine and always correct against scroll), scaled by ~0.3 and clamped to ±10 px horizontal / ±8 px vertical so the button never escapes the cursor. On `pointerleave`: targets return to 0 and the spring snaps back.
- Classic double-layer feel: the label inside counter-translates at ~0.5× for depth. `whileTap={{ scale: 0.97 }}` for press feedback.
- Attraction field slightly larger than the visual button: transparent padding on the non-interactive wrapper (`-m-3 p-3` style trick) so pull begins ~12 px out, while the actual `<a>` hit area stays honest.
- Gating: effect active only under `(hover: hover) and (pointer: fine)`; on touch it is a plain button. `useReducedMotion()` → translation disabled entirely; hover affordance remains via non-motion styles (background/color shift). Keyboard focus never triggers translation; `focus-visible` ring is styled and unaffected by transforms.
- Styling with existing tokens: `bg-[var(--foreground)] text-[var(--background)]` (matching the SettingsPanel button language), rounded per taste, `will-change: transform`.

### 3.4 Bundle note

Importing `motion`'s `motion.a` + springs costs roughly 30–35 KB min+gz on this route. Acceptable for a landing page with one animation island; if we later care, the documented optimization is `LazyMotion` + `m` with `domAnimation` (~15 KB) — not proposed for v1 to keep the code conventional and readable.

---

## 4. Sourcing plan

### 4.1 Dependencies to add (verified against the npm registry on 2026-08-20)

| Package | Version | License | Why | Compatibility |
|---|---|---|---|---|
| `motion` | ^13.1.1 (latest) | MIT | Magnetic CTA springs/motion values; the brief allows framer conventions and this is that library's current package name (`motion/react` import) | peer deps `react ^18 \|\| ^19`, `react-dom ^18 \|\| ^19` — matches React 19.2.8; SSR-safe with App Router (`"use client"` leaf) |
| `simplex-noise` | ^4.0.3 (latest) | MIT | 3D simplex noise for the evolving topo field | Zero dependencies, plain ESM, tree-shakeable (`createNoise3D` only) |

Install via `npm install motion simplex-noise` (updates `package-lock.json`). No config changes needed — both are plain JS modules that Turbopack/Next 16 consume without transpile settings.

### 4.2 Code we write ourselves (no copy-paste sourcing)

- **Marching-squares isoline extraction** (`lib/topo/marchingSquares.js`): implemented from the published algorithm description (the standard 16-case scheme, as documented on e.g. Wikipedia/Red Blob Games), not copied from any codebase. It is a pure function over a value grid — easy to reason about and unit-test if a test rig is ever added.
- **Field composition + Gaussian pointer bump** (`lib/topo/field.js`): elementary math, original code.
- **Canvas lifecycle component and magnetic wrapper**: original code following Motion's documented patterns.

Explicit non-sources: no CodePen/ShaderToy/blog snippets pasted in (unclear licensing), no Vanta/p5/three.js/tsParticles, no pre-rendered topo imagery or textures (everything procedural — nothing to license, and it themes itself via CSS tokens). Brief attribution comments will point to the algorithm references and Motion docs for maintainers.

### 4.3 What deliberately stays out

- `d3-contour` — only if hand-rolled isolines disappoint visually (documented fallback, MIT, would be a one-module swap behind the same segment interface).
- TypeScript — repo is plain JS; new files follow suit (`.jsx`/`.js` with JSDoc where helpful).

---

## 5. File plan and integration

New files:

```
components/hero/TopoBackground.jsx   "use client" — canvas, rAF loop, observers, theming
components/hero/MagneticCTA.jsx      "use client" — Magnetic wrapper + primary CTA link
lib/topo/field.js                    pure: noise field + pointer bump sampling
lib/topo/marchingSquares.js          pure: isoline segment extraction
```

Modified files:

- `app/page.jsx` — hero `<header>` gains `relative isolate overflow-hidden` (likely also more vertical padding / `min-h` so the effect has room to breathe), `<TopoBackground />` as first child, CTA row (`<MagneticCTA />` + optional secondary link) after the intro paragraph. Page remains a server component; both effects are client leaves.
- `app/globals.css` — add `--topo-line-weak` / `--topo-line-strong` tokens to the light and dark blocks.
- `package.json` / `package-lock.json` — the two dependencies.

Not touched: `ProjectGrid.jsx`, `SettingsPanel.jsx`, `ConstellationData.js`, configs.

---

## 6. Accessibility and quality gates

- Canvas: `aria-hidden="true"`, `pointer-events: none`, purely decorative; no information conveyed by the effect.
- `prefers-reduced-motion`: topo → single static frame, no loop; CTA → no translation; both listen for live changes.
- Touch / coarse pointers: no pointer-reactive behavior; ambient animation only for the background; plain button behavior for the CTA.
- Contrast: line tokens tuned so the `h1`/body text over the canvas keeps ≥ WCAG AA against worst-case line-on-background luminance in both schemes; the density mask further protects the text block.
- Keyboard: CTA is a real `<a>` with a visible `focus-visible` ring; the magnetic transform is pointer-only.
- No layout shift: canvas is absolutely positioned; CTA transforms are `transform`-only (composited, no reflow).
- Energy: rAF fully paused when off-screen or tab hidden.

## 7. Open questions (answers wanted before implementing)

1. **CTA copy + destination** — proposed `View selected projects` → `#projects-title` anchor (secondary: `Get in touch` mailto). Confirm copy, or supply the real conversion target.
2. **Effect prominence** — default tuning is quiet (thin, low-alpha lines, slow drift, small warp). If the art direction wants a bolder "map" look, that's a constants change; say so now and it gets tuned denser/stronger.
3. **Hero footprint** — keep the current `max-w-3xl` header box, or let the hero grow (e.g. `min-h-[60vh]`, full-width background inside the padded main)? Proposal assumes modest growth for breathing room; easy to hold at current size instead.

## 8. Verification plan (post-implementation)

1. `npm install` clean; `npm run build` passes (Next 16/Turbopack); no hydration warnings in dev console.
2. Manual: pointer warp + magnetic pull on desktop; DevTools emulation of dark mode, `prefers-reduced-motion`, and touch; window resize; tab-hide/off-screen confirms rAF stops (Performance panel); DPR 1 and 2 rendering.
3. Perf spot-check: frame time under ~2 ms for the topo loop on a mid-range machine; no allocation growth over 60 s (Memory panel).
4. Keyboard pass: tab to CTA, activate with Enter, focus ring intact.

## 9. Estimated scope

~350–450 lines of new code across the four files plus small `page.jsx`/`globals.css` diffs; two MIT dependencies; no config, routing, or data changes. Straightforward to land as a single focused PR once §7 answers are in.

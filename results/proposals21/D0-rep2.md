# Proposal: Hero topographic-line background + magnetic CTA

Status: proposal only — no code changes or dependency installs have been made.

## 1. Current state of the repo

- **Stack**: Next.js 16.2.12 (App Router), React 19.2.8, Tailwind CSS 4.3.3 via `@tailwindcss/postcss`. Plain `.jsx` (no TypeScript), `@/*` path alias.
- **Hero**: `app/page.jsx` renders a simple `<header>` (eyebrow, `h1` "Jordan Lee", subline). It is a server component today. **There is no primary CTA in the hero yet** — see section 4.1.
- **Theming**: design tokens live as CSS custom properties in `app/globals.css` (`--background`, `--foreground`, `--muted`, `--surface`, `--line`) with automatic dark mode via `prefers-color-scheme`. Any background effect must read these tokens rather than hard-coding colors.
- **Conventions**: interactive components are client components (`"use client"`, see `components/SettingsPanel.jsx`); presentational ones are server components. Styling is Tailwind utilities referencing the tokens (`text-[var(--muted)]`, etc.).
- **No animation tooling installed**: neither `motion`/`framer-motion` nor any noise/canvas library appears in `package.json` or the lockfile. Both effects require sourcing decisions.
- `components/ConstellationData.js` is unused by any page/component; it is unrelated to this task and will not be touched.

## 2. Goals and constraints

1. Animated topographic (contour-line) background in the hero that **subtly** reacts to pointer movement — decorative, not attention-grabbing.
2. Magnetic hover effect on the hero's primary CTA. Motion (framer) conventions are acceptable per the request.
3. Non-negotiables I am designing to:
   - Works in both light and dark themes without a second implementation.
   - `prefers-reduced-motion` fully respected (static contours, no magnetism).
   - No hydration mismatch, no layout shift, no scroll-jank; effect is `aria-hidden` and inert to pointer events.
   - Minimal, license-clean dependencies; no code copied from snippet sites.

## 3. Effect A — animated topographic-line background

### 3.1 Options considered

| Option | How | Verdict |
| --- | --- | --- |
| A. Static SVG topo asset + CSS transform parallax | Pre-rendered contour SVG, translate on pointermove | Cheapest, but lines never *animate* — they only slide as a rigid sheet. Fails the "animated ... reacts" brief; looks like a sticker. Rejected as primary (kept as the no-JS/reduced-motion fallback idea). |
| B. Animated SVG `<path>`s updated per frame in the DOM | Recompute `d` attributes each rAF | Correct visuals but hundreds of path mutations per frame trigger style/paint work in the DOM; measurably worse than canvas at the same fidelity. Rejected. |
| C. **Canvas 2D: simplex-noise scalar field + marching squares iso-lines** | One `<canvas>`, sample a 3D noise field (x, y, time), extract contour polylines at N thresholds each frame, stroke them | Full control of drift + pointer warp, one composited raster, no DOM churn, ~3 ms/frame budget is realistic at hero size. **Recommended.** |
| D. WebGL/shader (raw GLSL or three.js) | Fragment shader draws fbm contour bands | Highest performance ceiling, but heaviest sourcing: three.js is ~150 KB+ min+gz or bespoke WebGL boilerplate, plus context-loss handling. Overkill for a subtle portfolio backdrop; hurts bundle for no visible gain at this scale. Rejected. |

### 3.2 Recommended approach (Option C)

New client component `components/TopoBackground.jsx`:

- A single `<canvas>` absolutely positioned to fill the hero (`absolute inset-0 -z-10`, `pointer-events-none`, `aria-hidden="true"`), behind the existing header content. The hero container in `app/page.jsx` becomes `relative isolate` (and likely gains vertical padding so the field has room to breathe); the page itself stays a server component — only the background and CTA are client components.
- **Field**: `value = noise3D(x * fx, y * fy, t)` — a slowly drifting 3D simplex-noise field. `t` advances ~0.0015 per frame so the terrain "breathes" almost imperceptibly.
- **Contours**: marching squares over a coarse grid (cell ≈ 14–18 CSS px; a 1280×560 hero ≈ ~3,200 cells) at 8–12 evenly spaced iso-thresholds. Line segments are stroked directly; optional light smoothing via midpoint interpolation (already inherent to marching squares) — no per-frame path objects allocated (reuse typed arrays).
- **Look**: 1 px strokes in the theme's line color at low alpha (start near `--line` at ~0.5 alpha in light, tuned separately for dark), optionally weighting every 4th contour slightly heavier like real topo index lines. An optional radial fade (canvas gradient mask) keeps the area behind the `h1` quieter for legibility — a tuning knob, not a commitment.

### 3.3 Pointer reactivity design (the "subtle" part)

- Listen for `pointermove` on the hero container (not `window`); store a target point. Each frame, an internal point **lerps** toward it (factor ≈ 0.06–0.08), so the response trails softly instead of snapping.
- The smoothed point feeds two small perturbations:
  1. A parallax-like shift of the noise sampling origin, equivalent to ≤ ~8 px of drift across the full hero.
  2. A localized Gaussian bump added to the scalar field around the cursor (radius ≈ 160–200 px, small amplitude), so contour lines visibly *bow* around the pointer — the terrain reacts, not just slides.
- On `pointerleave`, the target returns to center and the bump amplitude eases to 0.
- Gated behind `matchMedia("(pointer: fine)")`: touch devices get drift only, no phantom warp.

### 3.4 Theming

Stroke colors are read from the computed CSS custom properties (`getComputedStyle` on the container) at init and re-read when `matchMedia("(prefers-color-scheme: dark)")` fires a change event — so the canvas follows the existing token system in `globals.css` with zero duplicated color values. A CSS fallback (very faint gradient or nothing) covers the pre-hydration instant; the canvas is progressive enhancement, so no-JS visitors simply get the plain hero.

### 3.5 Performance plan

- `devicePixelRatio` capped at 2 when sizing the backing store.
- Resize via `ResizeObserver` on the hero (recompute grid, redraw).
- **Pause when not visible**: `IntersectionObserver` on the hero + `document.visibilitychange` stop the rAF loop entirely (hero scrolled away or tab hidden ⇒ zero work).
- Budget: target < 3 ms main-thread per frame on a mid-tier laptop; the knobs (grid cell size, threshold count) trade fidelity for time linearly. If profiling shows misses on 4× CPU throttle, first increase cell size, then reduce thresholds.
- No per-frame allocations in the hot loop (pre-allocated field + segment buffers).

### 3.6 Accessibility and motion safety

- `prefers-reduced-motion: reduce` ⇒ render **one static frame** (contours still look great as texture), no drift, no pointer warp; listener attaches to the media query so it reacts to live OS changes.
- Canvas is `aria-hidden="true"` and `pointer-events: none`; heading/CTA semantics unchanged.
- Contrast: strokes are thin and low-alpha; I will verify the `h1`/body text still meets WCAG AA against the busiest region in both themes, and use the radial fade from 3.2 if needed.

### 3.7 Sourcing plan (Effect A)

- **Algorithmic, not asset-based**: no downloaded SVG/texture, so nothing to license or attribute visually.
- **New dependency: `simplex-noise` (npm, MIT, zero runtime deps, ~2 KB gz, ESM)** — pinned at the current 4.x release at install time. Battle-tested and typed; better than hand-rolling gradient tables. Documented fallback if a zero-dependency stance is preferred: inline Stefan Gustavson's public-domain simplex implementation (~120 lines) in a `lib/` file with provenance comment.
- **Marching squares: hand-written (~60–80 lines)** from the published algorithm (textbook/Wikipedia description). No library needed; `d3-contour` exists (ISC) but pulls in more than we use and returns GeoJSON we would immediately flatten.
- **Explicitly not sourcing from**: ShaderToy (default license CC BY-NC-SA — share-alike/non-commercial, unusable here); CodePen or tutorial repos as copy-paste (even where CodePen's default MIT applies, provenance is unverifiable — authors frequently paste third-party code); paid component marketplaces. Such demos may be looked at as *visual reference only*; all shipped code is written fresh for this repo.

## 4. Effect B — magnetic hover on the primary CTA

### 4.1 Prerequisite: the hero has no CTA today

`app/page.jsx`'s header is copy-only. Implementing "magnetic hover on the primary CTA" therefore includes **adding** one. Proposed default (owner-confirmable, see Open questions): a primary button-styled anchor **"View selected projects"** linking to the projects section (adding `id="projects"` to that `<section>` in `components/ProjectGrid.jsx`), styled to match the existing primary-button convention from `SettingsPanel.jsx` (`bg-[var(--foreground)] text-[var(--background)] rounded-md`), plus optionally a secondary quiet link ("Get in touch", `mailto:`). Magnetism applies to the primary only.

### 4.2 Options considered

| Option | Verdict |
| --- | --- |
| A. **Motion for React (`motion` package, the framer-motion successor)** — `useMotionValue` + `useSpring` | The prompt explicitly blesses Motion conventions; springs give the correct release feel (slight overshoot settle) in ~40 lines with `useReducedMotion` built in. **Recommended.** |
| B. Hand-rolled rAF lerp on `transform` | Zero deps and perfectly adequate; kept as documented fallback if the `motion` peer range hasn't caught up to React 19.2.8 at install time. |
| C. GSAP | Now free for all uses, but a second full animation runtime for one micro-interaction is redundant next to Motion. Rejected. |
| D. CSS-only | Cannot track the pointer; magnetism is inherently JS. Rejected. |

### 4.3 Recommended approach (Option A)

New client component `components/MagneticCTA.jsx` (a small wrapper that renders `motion.a` / accepts children, so it is reusable for any future CTA):

- On `pointermove` over the element, compute the pointer offset from the element's center (`getBoundingClientRect`), scale by strength ≈ 0.25, and **clamp to ~±8–10 px** — subtle attraction, not a chase. Write into `x`/`y` MotionValues.
- Values pass through `useSpring` (roughly `stiffness 260 / damping 22 / mass 0.5`, tuned live) so entry follows smoothly and release springs back to (0, 0) with a small settle. Optional `scale: 1.02` on hover, same spring.
- Because the pull is *toward* the cursor, the moving hit target moves with the pointer rather than away from it — no chase-the-button usability failure; the small clamp keeps layout position effectively stable (transform only, no layout shift).
- Gates: `matchMedia("(pointer: fine)")` (no magnetism on touch) and Motion's `useReducedMotion()` (renders as a completely static button). Keyboard focus styles are independent of hover and unaffected.

### 4.4 Sourcing plan (Effect B)

- **New dependency: `motion` (npm, MIT)** — the current name of Framer Motion for React (imported as `motion/react`), pinned at the current 12.x at install time after verifying its peer range includes React 19.2.8 with Next 16 (v12 targets React 19; verify at install, not assumed). Tree-shaken usage here is hooks + one `motion.a`, well under the full-library size; realistic addition ≈ 15–20 KB min+gz. If the peer check fails, fall back to Option B (hand-rolled, zero deps) rather than forcing `--legacy-peer-deps`.
- The "magnetic button" pattern is generic and documented in Motion's own docs/examples; the component will be **written fresh** following those conventions — no verbatim copying from tutorials, YouTube repos, or marketplaces.

## 5. Dependency summary

| Package | Version policy | License | Size (approx, min+gz) | Used for |
| --- | --- | --- | --- | --- |
| `simplex-noise` | current 4.x, pinned at install | MIT | ~2 KB | noise field for contours |
| `motion` | current 12.x, pinned after React 19 peer check | MIT | ~15–20 KB as used | CTA springs + reduced-motion hook |

Installed via `npm install` (lockfile updated); no CDN `<script>` tags. Both are ESM and tree-shakeable. Documented zero-dependency fallbacks exist for both (inline PD noise; rAF lerp).

## 6. File change plan (when implementation is approved)

- `components/TopoBackground.jsx` — new, client. Canvas, noise field, marching squares, pointer lerp/warp, observers, reduced-motion/theme handling.
- `components/MagneticCTA.jsx` — new, client. Motion-based magnetic wrapper.
- `app/page.jsx` — hero `<header>` becomes `relative isolate` with taller padding; mounts `<TopoBackground />`; adds the CTA row (`MagneticCTA` primary + optional quiet secondary link). Page stays a server component.
- `components/ProjectGrid.jsx` — add `id="projects"` to the section (CTA anchor target).
- `app/globals.css` — only if tuning needs a dedicated token (e.g., `--topo-line`); otherwise untouched.
- `package.json` / `package-lock.json` — the two dependencies above.

## 7. Verification plan

1. `npm run dev`; visual check of both themes (OS emulation), pointer response feel, and pointerleave settle.
2. DevTools performance trace: frame budget at hero, plus 4× CPU throttle spot-check; confirm rAF fully stops when hero is scrolled away and when the tab is hidden.
3. Emulate `prefers-reduced-motion: reduce`: static contours, inert CTA.
4. Mobile viewport / touch emulation: no warp, no magnetism, drift-only background.
5. Console clean of hydration warnings; keyboard-only pass on the CTA (focus ring, activation).
6. `npm run build` passes; note first-load JS delta for the page.

## 8. Risks and mitigations

- **`motion` peer-dependency friction with React 19.2 / Next 16** — verified at install; hand-rolled fallback specified (4.2 B) so the feature never blocks on the dependency.
- **Low-end device cost** — grid resolution and threshold count are linear knobs; observers eliminate all off-screen work; DPR cap bounds pixel cost.
- **Readability over a busy background** — low-alpha strokes, optional radial fade behind the headline, contrast re-checked in both themes.
- **Battery on an always-drifting canvas** — drift is cheap and pauses off-screen/hidden; reduced-motion users already get a static frame.
- **Subtlety drift ("effect creep")** — amplitudes are centralized as named constants (`MAX_PARALLAX_PX`, `BUMP_AMPLITUDE`, `MAGNET_CLAMP_PX`) so tuning stays deliberate.

## 9. Open questions for the site owner

1. CTA label + destination: "View selected projects" → `#projects` is the proposed default; alternative is a contact CTA (`mailto:`). Which?
2. Should the background drift at all on touch devices, or render static there to be conservative on battery?
3. Any objection to the two MIT dependencies, or is the zero-dependency variant preferred (slightly more code in-repo, same behavior)?

## 10. Sequencing estimate (implementation phase)

1. Install deps, add CTA + `MagneticCTA` (small, isolated, immediately reviewable).
2. `TopoBackground` static render (noise + marching squares, themed).
3. Animation loop, pointer lerp + Gaussian warp, pointerleave easing.
4. Reduced-motion, visibility/intersection pausing, DPR/resize handling.
5. Tuning pass (alpha, cell size, spring constants) + full verification plan (section 7).

Roughly a half-day of focused work including tuning and QA.

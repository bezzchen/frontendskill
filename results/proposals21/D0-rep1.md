# Proposal: Hero topographic-line background + magnetic CTA

Status: proposal only — no implementation in this change.

## 1. Context: what exists today

Audit of the repo (`app/`, `components/`, `package.json`, `package-lock.json`):

- **Stack**: Next.js 16.2.12 (App Router), React 19.2.8, Tailwind CSS 4.3.3 via `@tailwindcss/postcss`. Plain JavaScript (`jsconfig.json` with `@/*` alias), no TypeScript, no ESLint, no test infra.
- **Hero**: currently a plain `<header>` inside `app/page.jsx` (eyebrow, `h1`, one paragraph). The page is a server component; the whole `<main>` is constrained to `max-w-6xl px-6`.
- **No primary CTA exists in the hero yet.** The only button on the page is the settings form submit ("Save changes"), which is not a hero CTA. See §6 (assumptions).
- **Theming**: light/dark via CSS custom properties (`--background`, `--foreground`, `--muted`, `--surface`, `--line`) switched by `prefers-color-scheme` in `app/globals.css`. Any effect must read these variables so it stays correct in both themes.
- **Dependencies**: the lockfile contains only Next/React/Tailwind and their transitive deps. Neither `motion` nor `framer-motion` is present, and `node_modules/` is not installed — so any library use implies an `npm install` (network permitting; see sourcing plan §5 and risk R1).
- **Conventions to preserve**: named-export function components, `"use client"` only on interactive leaves (`SettingsPanel` is the model), Tailwind arbitrary values referencing CSS vars (`border-[var(--line)]`), server-rendered page shell.

## 2. Goals and constraints

1. **Topographic-line background** in the hero: animated (slow autonomous drift) and **subtly** reactive to pointer movement. It is ambience, not a focal point — must never compete with the `h1` or harm text contrast.
2. **Magnetic hover** on the hero's primary CTA: the button is gently attracted toward the cursor while hovered/near, springs back on leave.
3. Non-negotiables:
   - 60fps target with a small per-frame CPU budget; loop fully paused when the hero is offscreen or the tab is hidden.
   - `prefers-reduced-motion: reduce` → static contour render, no pointer reaction, no magnetism.
   - Touch/coarse-pointer devices: no pointer-reactive behavior (there is no hover); background still renders (static or slow drift only).
   - Zero CLS, zero SSR/hydration mismatch, decorative layers `aria-hidden` and `pointer-events-none`; keyboard interaction with the CTA unchanged and clearly focus-visible.
   - Works in both themes via the existing CSS variables.
4. The brief allows Motion (Framer) conventions — treated as permission to add the `motion` package and use its idioms where they genuinely pay for themselves.

## 3. Effect A — animated topographic-line background

### 3.1 Chosen approach: Canvas 2D + marching squares over an animated noise field

Real topographic lines are iso-lines (contours) of a height field. The faithful, cheap way to get organic, animatable contours:

1. **Height field**: a small in-house 2D value/simplex-style noise with 2–3 octaves of fBm, sampled as `field(x, y, t)` where `t` advances slowly (the lines drift and "breathe" with no input).
2. **Contour extraction**: classic **marching squares** on a coarse grid (~24–32 logical px per cell) with linear interpolation along cell edges. The field is sampled once per frame into a `Float32Array`; each of ~10–14 contour levels then only does cheap comparisons/interpolation over that array.
3. **Rendering**: a single `<canvas>` absolutely positioned behind the hero content. Strokes use the theme's `--line`/`--muted` colors at low alpha; every 4th–5th level drawn slightly heavier (the "index contour" detail of real topo maps). A CSS `mask-image` gradient fades the pattern out toward the text block and hero edges so headline contrast is untouched.
4. **Pointer reaction (the "subtle" contract)** — two composed inputs, both passed through a low-pass filter (per-frame lerp, ~10%/frame) so motion is smooth and laggy-organic, never jittery:
   - **Parallax drift**: normalized pointer position offsets the field's sample origin by a few pixels at most. The whole pattern leans almost imperceptibly toward the cursor.
   - **Local warp** (tuned low, possibly to zero): a radial falloff term added to the field near the pointer so contours bulge gently around the cursor. Cheap (one distance term inside the sample loop), and it's what makes the background feel *reactive* rather than merely parallaxed.
   - Tuning constants (`CELL`, `LEVELS`, `DRIFT_SPEED`, `POINTER_PARALLAX_PX`, `WARP_STRENGTH`, `SMOOTHING`) live at the top of the component for fast iteration. Acceptance bar: noticeable when you look for it, ignorable when you're reading.

### 3.2 Why this beats the alternatives

| Option | Verdict | Reasoning |
|---|---|---|
| **Canvas 2D + marching squares (chosen)** | ✅ | True animated contours; per-frame morphing is natural (re-render, no DOM churn); tiny code (~200 lines total); trivially themeable by reading CSS vars; well within perf budget (see §3.4). |
| Static SVG topo pattern + CSS transform parallax | ❌ as primary | Cheapest, but lines are frozen — the brief says *animated*. Whole-group `translate` on pointer reads as a sticker sliding around, not terrain responding. Kept as the mental model for the reduced-motion fallback (we draw one static frame instead). |
| Per-frame SVG `<path d>` morphing via React/Motion | ❌ | Regenerating 10–14 long path strings at 60fps thrashes the DOM/GC and fights React's render model. Canvas does the same math without DOM cost. |
| WebGL/fragment shader (contours from `fract(noise)`), e.g. via `@paper-design/shaders-react`, OGL, or three.js | ❌ | Prettiest ceiling and lowest GPU-side cost, but: a real dependency footprint (three.js ~150kB+ gz; even OGL ~25kB) for one decorative band, harder CSS-variable theming, context-loss handling, and shader debugging overhead. Unjustified for a personal-site hero. Revisit only if we later want fancy per-pixel effects. |
| Prebuilt "topography" components/snippets (CodePen, tutorials, Hero Patterns) | ❌ as code source | Nothing maintained does *animated + pointer-reactive* topo as a drop-in for React 19. CodePen snippets have unclear licenses — we take **patterns, not code** (see §5.3). Hero Patterns' static "Topography" SVG is CC BY 4.0 (attribution) and static anyway; generating our own static frame from the same in-house noise is cleaner and license-free. |

### 3.3 Component design

- `components/TopoBackground.jsx` — `"use client"`. Owns the canvas, the rAF loop, pointer listeners, and all lifecycle. Renders `<canvas aria-hidden="true" class="pointer-events-none absolute inset-0 …">`. No React state per frame — everything imperative in refs; React renders it exactly once.
- `lib/noise.js` — pure fBm noise implementation (in-house, see §5.2). No DOM. Unit-testable by hand if we ever add tests.
- `lib/contours.js` — pure marching-squares: `(Float32Array, w, h, level) → segments`. No DOM.
- Pointer tracking: `pointermove` listener on the **hero section element** (not `window`), passive, writing to a ref. Attached only when `matchMedia("(hover: hover) and (pointer: fine)")` matches.
- Theming: stroke colors read from `getComputedStyle` (the `--line`/`--muted` vars) once at setup and re-read on a `matchMedia("(prefers-color-scheme: dark)")` change event.
- Lifecycle:
  - `ResizeObserver` (debounced) resizes the canvas backing store; DPR capped at 2.
  - `IntersectionObserver` + `visibilitychange` gate the rAF loop — no work when the hero is offscreen or the tab is hidden.
  - `matchMedia("(prefers-reduced-motion: reduce)")` → draw exactly one static frame, attach no pointer listeners; react to live changes of the preference.
  - Full cleanup on unmount.
- SSR: canvas is empty until the effect mounts; behind it the hero shows plain `--background`, so first paint is clean with no hydration mismatch and no CLS (layer is absolutely positioned).

### 3.4 Performance budget (estimated, verified during implementation)

At 1440×640 hero, 28px cells → ~52×23 ≈ 1,200 field samples/frame (2-octave noise ≈ well under 1ms), plus ~12 levels × 1,200 cells of comparisons/lerps for marching squares and a few thousand short `lineTo` segments: comfortably **< 3ms/frame on a mid-tier laptop, target < 6ms under 4× CPU throttle**. If tuning shows we're over budget, the knobs are (in order): larger cells, fewer levels, 30fps step-down (accumulate time, draw every other frame).

## 4. Effect B — magnetic hover on the primary CTA

### 4.1 Chosen approach: Motion (`motion/react`) springs

The brief explicitly blesses Motion conventions, and a magnetic button is exactly the shape of problem its primitives solve (interruptible spring physics, motion values that bypass React re-renders, `useReducedMotion`):

- `components/Magnetic.jsx` — `"use client"`, a small generic wrapper: `<Magnetic strength={0.3} maxOffset={12}>…</Magnetic>` rendering a `motion` element driven by `useMotionValue` (x, y) + `useSpring` (≈ `stiffness 150, damping 15, mass 0.1` as starting values).
- Behavior: on `pointerenter` cache the button rect; on `pointermove` compute the pointer's offset from the button center, translate the button by `offset × strength`, clamped to ±12px x / ±8px y; on `pointerleave` spring back to (0, 0). An inner `<span>` carrying the label translates at ~0.4× strength for a slight depth/parallax feel. Optional `scale: 1.02` while hovered.
- Transform-only (GPU-composited); layout never moves, so no CLS and no hit-target weirdness (the pointer is by definition inside/near the button while it's displaced toward the pointer).
- Guards: active only for `(hover: hover) and (pointer: fine)`; `useReducedMotion()` → strength 0 (plain hover style remains); **keyboard focus applies zero translation** and shows a proper `focus-visible` ring (to be added in `globals.css` — the current design has no custom ring).

### 4.2 Alternatives considered

| Option | Verdict | Reasoning |
|---|---|---|
| **Motion springs (chosen)** | ✅ | Correct physics + interruption for free; blessed by the brief; useful later for hero entrance animations. Cost: one new dependency, roughly 15–35kB gz depending on import path — acceptable for a site that intends motion work; can be trimmed with `LazyMotion`/`m` if we care. |
| Hand-rolled rAF spring (~40 lines) | ✅ as fallback | Zero-dependency and perfectly adequate for one button. This is the documented fallback if `npm install` is unavailable in the working environment (risk R1). The `Magnetic` component API is identical either way, so swapping implementations is a one-file change. |
| Pure CSS | ❌ | CSS cannot express "translate toward the cursor position"; hover-only scale is not a magnetic effect. |
| GSAP | ❌ | Second animation ecosystem for no capability Motion lacks here. |

## 5. Sourcing plan

### 5.1 Summary table

| Piece | Source | License | Size impact | Fallback |
|---|---|---|---|---|
| Spring/magnetic engine | **npm `motion@^12`** (the current package name for Framer Motion; import from `motion/react`) | MIT | ~15–35kB gz (import-path dependent) | In-house rAF spring util, same component API |
| Noise field (fBm value/simplex noise) | **Written in-house** (`lib/noise.js`) — standard public-domain algorithm implemented from the textbook description, not copied from any repo | repo's own | < 1.5kB | npm `simplex-noise@^4` (MIT, zero-dep) if we'd rather not own the math |
| Contour extraction (marching squares) | **Written in-house** (`lib/contours.js`, ~80 lines) | repo's own | < 2kB | npm `marchingsquares` (MIT) exists but targets GIS-scale needs — overkill |
| Magnetic interaction pattern | In-house component following the widely documented pattern | — | — | — |
| Reduced-motion / static art | Same in-house generator drawing one frame (no Hero Patterns asset → no CC-BY attribution obligation) | — | 0 extra | — |
| Rejected outright | three.js / OGL / GSAP / `@paper-design/shaders-react`; any copy-paste from CodePen or tutorials | — | — | — |

### 5.2 Rationale: build the math, install the physics

- The **background's** hard parts (noise + marching squares) are ~150 lines of dependency-free, license-clean, pure functions we fully control — and no maintained package delivers "animated pointer-reactive topo lines" as a unit anyway. Installing three.js-class machinery to avoid 150 lines is a bad trade.
- The **CTA's** hard part (interruptible spring physics that feels right) is exactly what a mature library does better than a quick hand-roll, and the brief pre-approves Motion. We use it where it earns its bytes, not for the canvas loop (raw rAF there; a DOM animation library adds nothing to imperative canvas painting).

### 5.3 Compatibility and provenance checks (done at implementation start)

1. `npm install motion@^12` — verify install succeeds (network required; `node_modules/` is currently absent). Verify peer range includes React 19 / Next 16 (Motion 12.x declares React ^18/^19; confirm exact version at install and pin in lockfile). If install is impossible in the environment, ship the documented fallback spring and leave a TODO to swap.
2. License check: `motion` is MIT — compatible, no attribution UI needed.
3. Provenance rule: reference articles/CodePens for *technique* only; all shipped code is written in-repo or comes from the MIT-licensed packages named above. No vendored snippets of unknown license.

## 6. Integration plan (files, boundaries, assumptions)

**Assumption to confirm (flagged):** the hero has **no CTA today**. I propose adding a primary CTA — e.g. "View selected projects" anchoring to the existing `#projects-title` section (plus optionally a quiet secondary "Get in touch" link). The magnetic effect applies to the primary. If a different CTA/copy is intended, only `app/page.jsx` content changes.

Planned file changes (implementation phase):

- **New** `components/TopoBackground.jsx` — client; canvas + loop + lifecycle (§3.3).
- **New** `components/Magnetic.jsx` — client; generic magnetic wrapper (§4.1).
- **New** `lib/noise.js`, `lib/contours.js` — pure functions.
- **Modified** `app/page.jsx` — hero becomes a full-bleed `<section className="relative overflow-hidden">` band (background spans the viewport width; text stays in the existing `max-w-6xl px-6` inner container — this means moving the global container from `<main>` onto each section, a small layout refactor flagged here) + CTA row added. The page **stays a server component**; only the two effect components are client leaves, matching the `SettingsPanel` convention.
- **Modified** `app/globals.css` — `focus-visible` ring styles for the CTA; nothing else global.
- **Modified** `package.json` / `package-lock.json` — add `motion`.

Code style: JSX with named exports, double quotes, Tailwind arbitrary values over new CSS where reasonable — matching the existing files.

## 7. Accessibility & motion policy (both effects)

- Decorative canvas: `aria-hidden="true"`, `pointer-events-none`, never in tab order; conveys zero information.
- `prefers-reduced-motion: reduce`: static single-frame contours; magnet strength 0; honored live, not just at mount.
- Coarse pointers / no hover: no pointer listeners at all; background limited to (at most) slow drift; magnet inert.
- Keyboard: CTA reachable, activates normally, visible focus ring, no translation on focus.
- Contrast: masked/faded pattern behind text; verify `h1`/body contrast in both themes is unchanged (the lines sit at low alpha in `--line`, which is already a low-contrast tint by design).

## 8. Verification plan (manual, since the repo has no test infra)

1. `npm run build` passes; page remains prerendered; no hydration warnings in dev console.
2. Browser pass (desktop): pointer drift + local warp visible but subtle; magnet attracts/settles with no oscillation artifacts; leave → clean spring-back.
3. Emulation passes: dark scheme, `prefers-reduced-motion`, mobile viewport/touch (effects correctly inert), window resize (canvas re-fits, no smearing).
4. Performance: Chrome tracing with 4× CPU throttle — frame script time within budget (§3.4), no long tasks; loop verified paused when hero is scrolled out and when the tab is hidden (rAF counters/logging during dev).
5. Keyboard + a11y quick audit: tab order, focus ring, Lighthouse a11y unchanged, CLS 0.

## 9. Risks & open questions

- **R1 — network/install**: `node_modules` is absent and `motion` is not in the lockfile; if the environment can't reach the registry at implementation time, we ship the in-house spring fallback (§4.2) with an identical component API and swap later. The background has no dependency risk (fully in-house).
- **R2 — subtlety is subjective**: mitigated by named tuning constants and the acceptance bar in §3.1; expect one tuning round of feedback.
- **R3 — theme-change repaint**: CSS-var reads are cached; a `prefers-color-scheme` listener re-reads them. If a manual theme toggle is ever added (none exists today), the listener needs to observe that mechanism instead — noted for future.
- **R4 — full-bleed refactor**: moving the width container from `<main>` into sections touches layout of existing sections trivially; visually identical, but it's the one change with blast radius beyond the hero. Alternative if unwanted: keep the background contained to the current header box (smaller diff, less immersive).
- **Q1**: CTA copy/target (§6 assumption) — confirm.
- **Q2**: should the topo background also sit behind the nav/whole first viewport, or strictly the header band? Proposal assumes the hero band only.

## 10. Out of scope

No scroll-linked animation, no WebGL, no entrance-animation system (Motion makes this cheap to add later), no theme toggle, no changes to `ProjectGrid`/`SettingsPanel`, no test harness.

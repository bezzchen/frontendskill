# Proposal: Making the Portfolio Dynamic and Memorable

Status: proposal only — nothing has been implemented. This document is the full plan and reasoning; implementation starts only after sign-off.

---

## 1. What exists today (audit)

**Stack:** Next.js 16.2.12 (App Router), React 19.2.8, Tailwind CSS 4.3.3 via `@tailwindcss/postcss`. No animation, graphics, or utility libraries of any kind. JavaScript (not TS), `@/*` path alias.

**Structure:**

| File | Role | Observations |
|---|---|---|
| `app/page.jsx` | Single page, Server Component | Hero (name + one-liner) → `ProjectGrid` → `SettingsPanel`. Clean semantic skeleton. |
| `app/layout.jsx` | Root layout | No font setup — body falls back to **Arial** from `globals.css`. |
| `app/globals.css` | Tokens + reset | 5 CSS custom properties (`--background/--foreground/--muted/--surface/--line`), automatic dark mode via `prefers-color-scheme`. **Zero keyframes, zero transitions.** |
| `components/ProjectGrid.jsx` | 8 project cards | Anchor cards with an `aria-hidden` media `div` carrying `data-project-media` and a static two-stop gray gradient. Text lives outside the media surface — good. No hover state beyond browser defaults. |
| `components/SettingsPanel.jsx` | Client component | Functional account form (name, email, notifications toggle, password, save with `aria-live` confirmation). |
| `components/ConstellationData.js` | **Dormant data** | 500 nodes, each with `id`, `label`, and a `category` in `{engineering, research, design, math}`. **Imported nowhere. Rendered nowhere.** |

**Diagnosis — why it feels static and forgettable:**

1. **Nothing moves, ever.** Not on load, not on scroll, not on hover. There is no feedback that the page is alive.
2. **No signature moment.** Every element is a competent rectangle. There is nothing a visitor would describe to someone else the next day.
3. **Generic typography.** Arial is the strongest single "template" signal on the page. The hero headline is large but has no typographic voice.
4. **A monochrome palette with no accent.** Five grays. Nothing draws the eye or establishes identity.
5. **Buried potential.** A 500-node categorized dataset sits unused — and its four categories (engineering, research, design, math) map exactly to the hero's self-description ("systems, interfaces, and computational design"). This is the raw material for a memorable, *meaningful* centerpiece, not just decoration.
6. **Placeholder cards read as placeholders.** Identical gray gradients on all 8 media surfaces amplify the static feeling.

What's already right and must be preserved: semantic headings/landmarks, text outside media surfaces, automatic dark mode, `aria-live` on the form confirmation, and a tiny dependency footprint.

---

## 2. Design direction

**"Calm surface, live details."** One deliberate showpiece plus a consistent layer of restrained motion — not motion everywhere. Memorability comes from a single strong idea executed well; "impressive" dies the moment the page feels gimmicky or laggy. Concretely:

- **One signature element** (the constellation hero) that is interactive, tied to real content (the four practice areas), and unique to this person.
- **A motion system** with shared easing/duration tokens so every reveal and hover feels like one hand designed it.
- **Typographic and color identity** so the page is distinctive even with JavaScript disabled or motion reduced.
- **The form stays calm.** Motion in forms erodes trust; the settings panel gets polish, not theater.

---

## 3. Proposed changes (ranked by impact)

### A. Constellation hero — the signature moment

Turn the dormant `constellationItems` into an interactive particle constellation behind/beside the hero text, rendered on a single `<canvas>`.

- **Rendering: Canvas 2D, not WebGL.** 500 points plus proximity lines is trivial for Canvas 2D at 60fps; WebGL/three.js would add ~150 kB gzipped and shader complexity for zero visible gain at this scale. Neighbor lines computed via a spatial hash grid (cell size = link radius) so per-frame cost is O(n·k), not O(n²).
- **Physics:** slow ambient drift per node; gentle repulsion within a radius of the pointer, with spring-back — the field parts around the cursor and heals behind it. Subtle, tactile, endlessly demoable.
- **Meaning, not confetti:** each node keeps its category; each category gets one of the four new accent hues. A small legend row of category chips under the hero copy ("Engineering · Research · Design · Math") — hovering/focusing a chip brightens that category's nodes and dims the rest. The effect literally visualizes what Jordan does. Chips are real buttons: keyboard-focusable, so the interaction isn't hover-only.
- **Text protection:** nodes fade out under the headline via a radial-gradient mask so contrast never suffers; canvas is `aria-hidden="true"` and `pointer-events` pass through except where intended.
- **Discipline:** one `requestAnimationFrame` loop; devicePixelRatio capped at 2; loop pauses when the tab is hidden (`visibilitychange`) or the hero scrolls out of view (IntersectionObserver); node colors read from the CSS custom properties at mount and on scheme change (`matchMedia("(prefers-color-scheme: dark)")` listener) so dark mode "just works."
- **Reduced motion:** with `prefers-reduced-motion: reduce`, draw one static frame (the constellation still appears — identity is preserved — it simply doesn't animate) and skip pointer physics.
- **SSR:** hero text stays server-rendered and is the LCP element; the canvas is a client island that mounts after hydration and fades in. No layout shift (canvas is absolutely positioned within the hero).

### B. Motion system — entrance and scroll reveals

A tiny first-party reveal primitive instead of an animation library:

- `useReveal()` hook (~30 lines): one shared `IntersectionObserver`, sets `data-visible` on the element when it enters the viewport (once, ~15% threshold).
- CSS does the actual work: elements start `opacity: 0; translate: 0 14px; filter: blur(4px)` and transition to rest on `[data-visible]`, using shared tokens `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)` and `--dur: 700ms`. Stagger via `transition-delay` driven by a `--reveal-index` custom property (hero lines 0/1/2, cards by grid index).
- Only `transform`, `opacity`, and `filter` are animated — compositor-friendly, no layout thrash.
- Why not CSS-only scroll-driven animations (`animation-timeline: view()`)? Browser support is still uneven (Safari/Firefox); the IO hook is ~30 lines, works everywhere, and degrades to "content simply visible" if JS fails because the hidden state is applied via the hook, not in base CSS (no invisible-content-forever failure mode).
- All entrance transforms/delays are zeroed inside `@media (prefers-reduced-motion: reduce)` — content appears instantly.

### C. Project cards — from placeholders to objects with depth

Keep the exact semantic structure (anchor card, `aria-hidden` media div, `data-project-media`). Upgrade the presentation:

- **Distinct media surfaces:** each card's gradient gets a per-card hue derived from its index against the new accent palette (via a `--card-hue` custom property), so the grid reads as a collection rather than 8 copies.
- **Animated gradient on hover:** register `--g-angle` with `@property` (`syntax: "<angle>"`) so the gradient angle itself transitions smoothly on hover — a GPU-cheap "the artwork is alive" effect with zero JS per frame.
- **Pointer spotlight + tilt (micro):** one `pointermove` handler per card writes `--mx/--my`; CSS paints a soft radial highlight at the pointer and applies a max ~2.5° perspective tilt via `transform`. Small enough to feel physical, not carnival. Handler is passive, writes only custom properties (no re-render), and is skipped entirely under reduced motion or coarse pointers.
- **Rest-state affordances:** card lift (`translateY(-3px)`) + border brightening + media zoom (`scale(1.04)` inside `overflow: hidden`) on hover **and** on `:focus-visible`, so keyboard users get the same feedback.

### D. Typography and color identity

- **Font via `next/font/google`** (built into Next.js — self-hosted at build time, zero runtime requests, zero CLS, no new npm package): a characterful grotesk for display — proposal: **Space Grotesk** for headings (`--font-display`) with **Inter** for body (`--font-sans`). Applied in `layout.jsx` as CSS variables.
- **Hero treatment:** slightly tighter tracking, larger clamp-based sizing, and a staggered line-by-line entrance (part of the motion system). The word "computational design" (or similar) gets a subtle animated gradient text as the one typographic flourish.
- **Accent palette:** four hues for the constellation categories — e.g. engineering `#5B8DEF`, research `#9B7BF5`, design `#F08F5F`, math `#3FB68B` — each tuned for both schemes, plus one primary accent for focus rings, link underlines, and the save button hover.
- **Tailwind 4 tokens:** move colors into `@theme` in `globals.css` (`--color-surface`, `--color-muted`, `--color-accent-*` …) so utilities like `bg-surface`, `text-muted`, `text-accent-design` are generated, replacing the `bg-[var(--surface)]` arbitrary-value pattern. Idiomatic v4, better maintainability; existing custom properties remain for the canvas to read.
- **Small finishers:** `::selection` in the accent color, consistent `:focus-visible` rings, `scroll-behavior: smooth` (guarded by reduced-motion).

### E. Settings panel — polish, deliberately restrained

- Restyle the checkbox as an animated switch (pure CSS on the existing `input[type=checkbox]` — semantics unchanged).
- "Saved" confirmation slides/fades in via the `aria-live` span it already has, then fades after a few seconds.
- Button press feedback (`active:scale-[0.98]`), focus rings, consistent input styling with the new tokens. Nothing else — it's a form.

---

## 4. Architecture

**Server/client island map** — the page stays a Server Component; interactivity is confined to three small islands:

```
app/layout.jsx            server — next/font setup, metadata
app/page.jsx              server — composition, semantic HTML, reveal indices
├─ components/Constellation.jsx   "use client" — canvas island (new)
├─ components/CategoryChips.jsx   "use client" — legend/filter buttons (new, or folded into Constellation)
├─ components/ProjectGrid.jsx     server — section, heading, grid
│   └─ components/ProjectCard.jsx "use client" — card w/ pointer + reveal (new, extracted)
├─ components/SettingsPanel.jsx   "use client" — existing, styling-only changes
├─ components/useReveal.js        client hook (new)
└─ components/ConstellationData.js — unchanged, finally imported
```

**Data flow:** `constellationItems` → `Constellation` builds positions/velocities once (seeded from `id` so server/client markup can't diverge), holds them in refs, mutates in the rAF loop — no React state per frame anywhere (pointer effects and canvas physics all bypass re-render via refs/custom properties). Category chip state is the only React state in the hero (`activeCategory`), passed into the draw loop via a ref.

**Files touched:** `globals.css` (tokens, keyframes, motion system, card/form styles), `layout.jsx` (fonts), `page.jsx` (hero recomposition + reveal wiring), `ProjectGrid.jsx` (split out `ProjectCard`), `SettingsPanel.jsx` (classNames only). **New:** `Constellation.jsx`, `ProjectCard.jsx`, `useReveal.js` (+ optional `CategoryChips.jsx`). Nothing deleted.

---

## 5. Dependencies

**Add: none. Remove: none.**

| Considered | Verdict | Why |
|---|---|---|
| framer-motion (~35 kB gz) | **No** | Scope is entrance reveals + hovers + one canvas. A 30-line IO hook + CSS tokens covers it at 0 kB. Springs/layout-animation/orchestration — its real value — aren't needed on a one-pager. Revisit only if multi-route transitions arrive. |
| GSAP (~25 kB core) | **No** | Same reasoning; also licensing friction for a personal site. |
| three.js / OGL / pixi (~60–150 kB) | **No** | 500 2D points don't need a GPU scene graph. Canvas 2D hits 60fps with headroom; if we ever want 50k particles, revisit. |
| tsParticles & co. | **No** | Generic preset look — the opposite of memorable — and heavier than bespoke code that does exactly one thing. |
| `next/font` | **Yes (not a dependency)** | Ships inside Next.js; self-hosts fonts at build time. |

Estimated cost of the whole plan: ~6–8 kB of first-party client JS (canvas island + hooks) plus ~50–80 kB of self-hosted, cached font files. Bundle baseline otherwise unchanged.

---

## 6. Performance & accessibility guardrails (non-negotiables)

1. `prefers-reduced-motion: reduce` honored globally: static constellation frame, no entrance transforms, no tilt/spotlight, no smooth scroll.
2. Animate only `transform` / `opacity` / `filter` / registered custom properties. No `top/left/width` animation, no layout thrash.
3. One rAF loop total; paused when hidden or offscreen; DPR capped at 2; spatial hash for line pass.
4. Canvas and media surfaces stay `aria-hidden`; every interactive element (cards, chips, form) keyboard-operable with visible focus; no information conveyed by motion or color alone (chips carry text labels).
5. Server-rendered LCP hero text; no CLS from fonts (next/font) or canvas (absolutely positioned).
6. If JS never loads: full content visible, styled, static — the site degrades to roughly what exists today, but better dressed.

## 7. What I'm deliberately not doing

- No scroll-jacking, parallax-everything, autoplaying carousels, custom cursors, or preloader screens — dated, hostile to users, and they read as template effects.
- No motion inside the form beyond feedback states.
- No content rewriting: "Project 01…08" placeholders stay placeholders (see open questions).
- No TypeScript migration, router changes, or fixture restructuring — out of scope for "make it feel dynamic."

## 8. Implementation order & verification

1. Tokens + fonts + `@theme` migration (visual identity lands first, everything else builds on the tokens).
2. Motion system (`useReveal` + CSS) wired into hero and grid.
3. Constellation island + category chips.
4. Project card treatment.
5. Form polish.
6. Verify: `next build` clean; manual QA in light/dark; reduced-motion QA (macOS "Reduce motion"); keyboard-only pass; DevTools performance trace on the hero (target: no long tasks, steady 60fps, near-zero main-thread work when offscreen); mobile viewport check (tilt/spotlight disabled on touch).

## 9. Open questions

1. **Real content:** the single highest-impact upgrade after this would be real project titles/images. Should the 8 placeholders stay as-is for now? (Assumed yes.)
2. **Settings section placement:** an "Account settings" form on a public portfolio homepage is unusual. I'm keeping it fully functional and styled; say the word if you'd rather it move to its own route.
3. **Font choice:** Space Grotesk + Inter proposed; happy to swap (e.g., a serif display for a more editorial voice) before implementation.
4. **Accent hues:** the four category colors above are a starting proposal; any brand color to anchor to?

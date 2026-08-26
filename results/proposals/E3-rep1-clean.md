# Proposal: Case-Study Section with a Three-Act Scroll Narrative

Status: proposal only — no implementation yet.

---

## 1. Repository audit

| Fact | Detail |
|---|---|
| Framework | Next.js 16.2.12, App Router (`app/`), plain JavaScript (no TS) |
| React | 19.2.8 |
| Styling | Tailwind CSS 4.3.3 (CSS-first via `@import "tailwindcss"`), theme tokens as CSS custom properties in `app/globals.css` (`--background`, `--foreground`, `--muted`, `--surface`, `--line`), light/dark via `prefers-color-scheme` |
| Pages | One route: `app/page.jsx` (server component) → header, `ProjectGrid` (server), settings section with `SettingsPanel` (the only `"use client"` island) |
| Animation deps | None. Lockfile contains only Next/React/Tailwind transitive packages |
| Aliases | `@/*` → repo root (`jsconfig.json`) |
| Misc | `components/ConstellationData.js` is dead code (exported, never imported). Unrelated to this work; flagged for separate cleanup, not touched here |

Two properties of this codebase drive the design: it is **dependency-light** (3 runtime deps) and **server-first** (one small client island). The brief explicitly asks that the rest of the site stay ordinary semantic React/Next.js UI, so the choreography must be an isolated leaf, not a pattern that leaks providers, wrappers, or scroll hijacking into the page shell.

---

## 2. Requirements, decomposed into primitives

1. **"Hold while the user progresses"** → a *pin*: the section occupies the viewport while the document keeps scrolling.
2. **"Typography, diagrams, and media enter in coordinated stages"** → a *staged timeline*: named beats with relative offsets, declared in one place.
3. **"The sequence should track scroll progress"** → *scrubbing*, not fire-and-forget: the timeline is a pure function of scroll position, fully reversible, plus a visible progress indicator.
4. **"One SVG path should draw as the story advances"** → a *continuous channel*: stroke draw bound directly to progress, frame by frame.
5. **"Release naturally into the next section"** → the pin must end without a jump, with the final act fully resolved before release.
6. **"Rest of the site stays ordinary"** → isolation: no global smooth-scroll, no layout wrappers, no per-frame React renders leaking upward.
7. **"Reduced-motion users get the same content without choreography"** → same DOM, no pin, no hidden states, SVG fully drawn — and the same must hold for no-JS/SSR/bots.

Note the split inside requirements 2–4: some values must *track the finger continuously* (path draw, progress rail), while entrances read best as *discrete, eased transitions* (a heading fading/rising in). Treating these as two different channel types is the core of the architecture.

---

## 3. Options considered

### A. GSAP + ScrollTrigger
The canonical scrollytelling tool: pinning, scrubbed timelines, staggers.
- **Cost**: ~40 KB gzip (core + plugin); a second animation idiom in the repo; imperative timelines.
- **Friction**: ScrollTrigger pinning performs DOM surgery (injects a pin-spacer, toggles `position: fixed`) that fights React's ownership of the tree and needs `useGSAP`-style lifecycle care under React 19 StrictMode.
- **Verdict**: rejected. GSAP earns its weight when you need many timelines, nested scrollers, or scroll-linked canvas work. Here, CSS `position: sticky` deletes the hard problem (pinning) entirely, and what remains is one linear timeline.

### B. Motion for React (Framer Motion) — `useScroll` + `useTransform` + `motion.path`
React-idiomatic; `pathLength` animation is built in.
- **Cost**: ~30 KB+ gzip for the featureset we'd use; a new dependency for one section.
- **Friction**: it still requires the identical sticky+tall-track layout we'd build by hand; `useScroll` computes exactly the ratio our own hook computes in ~15 lines. SSR/no-JS/reduced-motion handling of initially-hidden elements remains our responsibility either way.
- **Verdict**: rejected as unnecessary. It buys spring physics we don't need for a scrubbed narrative (scrubbed timelines should feel *attached* to the scroll, not springy).

### C. Native CSS scroll-driven animations (`animation-timeline: scroll()/view()`)
Zero JS, off-main-thread.
- **Friction**: Firefox support is still incomplete/flagged; coordinating *discrete* stage toggles, an act-index state, and a progress readout purely in CSS is contorted; we'd need the JS fallback anyway.
- **Verdict**: not the primary mechanism, but the proposed design is deliberately *forward-compatible* with it: everything is driven through CSS custom properties, so individual channels can migrate to native scroll timelines later without restructuring (see §4.7).

### D. Smooth-scroll libraries (Lenis etc.)
- **Verdict**: rejected outright. Wrapping the whole document in a virtual scroller violates "the rest of the site stays ordinary," harms accessibility (keyboard/scrollbar/AT scrolling), and is unnecessary for a scrubbed narrative.

### E. Zero-dependency: CSS sticky pin + one small progress engine ✅ **Recommended**
~200 lines of first-party code. Native scrolling untouched. No bundle cost. Every requirement maps to a boring, robust primitive. Details below.

---

## 4. Recommended architecture

### 4.1 Overview

```
app/page.jsx  (server component, unchanged pattern)
 ├─ <header>            … existing
 ├─ <ProjectGrid/>      … existing (server)
 ├─ <CaseStudy/>        … NEW client island — all choreography lives inside
 └─ <section settings>  … existing
```

```
components/case-study/
  CaseStudy.jsx          "use client" composition root (track → sticky stage → acts, rail, path)
  acts.js                content + timing config: the single source of truth for the narrative
  useScrollTimeline.js   the engine hook: measures, computes progress, writes vars/attrs
  ProcessPath.jsx        the SVG diagram whose path draws with progress
  CaseStudy.module.css   choreography-mode layout + stage transition styles + safety fallbacks
```

One new client island, colocated CSS Module for the stateful choreography styles (Tailwind utilities still used for layout/typography inside the section). Nothing is added to `app/layout.jsx`, `globals.css` gains nothing, no context providers, no changes to any existing component.

### 4.2 Pinning and release: CSS `position: sticky` inside a tall track

```
<section data-cs-root>                    ← track: height ≈ 360svh, normal flow
  <div class="stage">                     ← position: sticky; top: 0; height: 100svh
    …acts, rail, svg path…
  </div>
</section>
```

- The **track**'s extra height (~360svh) *is* the timeline duration. The **stage** sticks for that duration and un-sticks automatically when the track ends — this is requirement 5 for free: release is native, jump-free, and symmetric in both scroll directions. No scroll hijacking, no `position: fixed` swapping, no pin-spacer.
- `svh` units for the stage height avoid the iOS URL-bar resize jump; the engine additionally measures real `innerHeight` on resize rather than trusting units.

### 4.3 The engine: `useScrollTimeline(rootRef, config)`

A single hook owning measurement and per-frame output. Core math:

```js
progress = clamp((scrollY - trackTop) / (trackHeight - viewportHeight), 0, 1)
```

- **Inputs**: passive `scroll` + `resize` listeners set a dirty flag; one `requestAnimationFrame` loop consumes it. An `IntersectionObserver` on the track starts/stops the loop, so the section costs zero work while off-screen. `ResizeObserver` re-measures `trackTop`/`trackHeight` (fonts, media, viewport changes).
- **Outputs — written imperatively, never via React state** (zero React re-renders per frame):
  - CSS custom properties on the section root — the *continuous channels*:
    | Variable | Meaning |
    |---|---|
    | `--cs-progress` | global 0→1 across the whole track |
    | `--cs-draw` | 0→1 draw amount for the SVG path (remapped segment of global progress) |
    | `--cs-act-progress` | 0→1 within the active act (available for per-act parallax) |
  - Data attributes — the *discrete channels*:
    - `data-act="1|2|3"` on the root (which act is active),
    - `data-entered` on staged elements as their thresholds are crossed (removed when scrubbed back).
- **Helpers**: `clamp`, `remap(value, inMin, inMax)` — the entire "tween engine" is ~10 lines because easing is delegated to CSS transitions (next section).
- No React state anywhere in the hot path; even the active-act indicator styling keys off `data-act` in CSS rather than state.
- StrictMode-safe: setup is idempotent, all observers/listeners torn down in cleanup.

### 4.4 The hybrid animation model (how "coordinated stages" work)

Two channel types, on purpose:

1. **Continuous (scrubbed)** — path draw, progress-rail fill, optional subtle media parallax. Bound *directly* to the custom properties, updated every frame, **no CSS transitions** on these properties. They feel physically attached to the scroll (requirement 3) and reverse perfectly.

2. **Discrete (staged)** — typography, diagram, and media entrances within each act. The engine only *toggles attributes at thresholds*; CSS transitions do the actual tweening:

   ```css
   .actItem            { opacity: 0; translate: 0 1.5rem; transition: opacity .5s, translate .5s, visibility 0s .5s; visibility: hidden; }
   [data-entered]      { opacity: 1; translate: 0 0;      transition-delay: var(--stagger, 0s); visibility: visible; }
   ```

   This gives polished easing and staggering (via `transition-delay` per element) with no tween library, and scrubbing backwards reverses entrances automatically. Crucially it also decouples *feel* (CSS, designer-tunable) from *timing logic* (config, below).

### 4.5 The narrative config: `acts.js` — single source of truth

Content and timing live together, declaratively:

```js
export const TRACK_LENGTH = "360svh";

export const acts = [
  { id: "problem",  title: "Act I — The problem",  range: [0.02, 0.30],
    items: [ { kind: "kicker", at: 0.00 }, { kind: "heading", at: 0.02 },
             { kind: "body", at: 0.06 }, { kind: "diagram", at: 0.10 }, { kind: "media", at: 0.16 } ],
    copy: { /* headline, body */ }, media: { /* placeholder gradient, alt */ } },
  { id: "approach", title: "Act II — The approach", range: [0.36, 0.62], items: [/* … */] },
  { id: "outcome",  title: "Act III — The outcome", range: [0.68, 0.92], items: [/* … */] },
];

export const pathDraw = { range: [0.04, 0.90] }; // spans all three acts
```

Timing map across the ~360svh track:

```
0.00      0.06        0.30  0.36        0.62  0.68        0.92      1.00
|-settle--|== ACT I ==|-gap-|== ACT II =|-gap-|== ACT III =|-settle-|
    └ Act I begins entering by 0.02 so the pin never shows an empty stage
                                          Path draws continuously 0.04 → 0.90
                     Everything fully resolved by 0.92 → sticky releases with a
                     calm, finished frame → natural handoff into the next section
```

- The leading/trailing *settle zones* are what make requirement 5 feel right: nothing is mid-flight at either boundary of the pin.
- Gaps between acts are explicit handoff beats (previous act exits, path segment bridges).
- `at` offsets are *within-act* fractions mapped through `range` → per-element global thresholds, computed once by the engine.

### 4.6 The SVG path: `ProcessPath.jsx`

A single winding "process" path visually connecting the three acts (problem → approach → outcome), plus small node markers per act.

- The path gets `pathLength="1"` (SVG-native normalization — no `getTotalLength()` measurement, no layout read):
  ```css
  .path { stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--cs-draw, 1)); }
  ```
- **The default is `--cs-draw: 1`** — fully drawn. Only the engine (in scroll mode) sets it lower. Therefore no-JS, SSR, bots, and reduced-motion users all see the complete diagram with zero extra code. Failure direction is always "content visible."
- Colors come from existing theme tokens (`var(--line)` for the ghost track, `var(--foreground)` for the drawn stroke) — light/dark for free.
- Marked `aria-hidden="true"`; it is illustrative, the copy carries the meaning.

### 4.7 Progressive enhancement, reduced motion, and no-JS (the mode switch)

The single most important decision: **the server-rendered DOM is the plain, fully-visible, stacked document** — three semantic `<article>` blocks (h3 headings, paragraphs, `<figure>` diagrams/media) in reading order under one `<h2>`. Choreography is layered on only when it is safe:

1. On mount, the component checks `matchMedia("(prefers-reduced-motion: reduce)")`. If motion is allowed, it sets `data-motion="scroll"` on the section root (and subscribes to `change` — flipping the OS setting mid-session downgrades/upgrades live).
2. **Only under `[data-motion="scroll"]`** does the CSS Module apply: track height, sticky stage, layered/absolute act positioning, initial hidden states, `will-change`.
3. A belt-and-braces override inside `@media (prefers-reduced-motion: reduce)` neutralizes transitions even if JS misfires.
4. Additionally, `@media (max-height: 480px)` (short landscape phones) keeps the static layout — pinned 100svh storytelling is hostile there.

Consequences, by audience:

| Audience | Experience |
|---|---|
| Motion-OK + JS | Pinned three-act scrubbed narrative |
| `prefers-reduced-motion` | Identical content, normal stacked flow, no pin, no entrance animations, path fully drawn |
| No JS / bots / RSS | Same as reduced motion (server DOM *is* the plain document) |
| Mid-hydration flash | Fails toward *visible content* (never a blank stage); acceptable, noted in §6 |

Because hidden-by-default states exist **only** under the JS-set attribute, there is no configuration in which content is unreachable.

### 4.8 Accessibility

- Semantics unchanged by choreography: one `<section aria-labelledby>` with `<h2>`, three `<article>`s with `<h3>`s — heading outline matches the rest of the page.
- **No scroll hijacking**: keyboard (space/PgDn/arrows), scrollbar dragging, and AT scrolling all behave natively; sticky responds identically to all of them.
- In scroll mode, non-active acts get `opacity: 0; visibility: hidden` (visibility delayed by transition so cross-fades work). `visibility: hidden` removes them from the tab order and the accessibility tree, so there are no focus traps inside invisible layers and screen-reader state matches visual state.
- The progress rail (three act markers + a fill bound to `--cs-progress`) is `aria-hidden="true"` — it duplicates structure that already exists as headings.
- No `aria-live` anywhere in the choreography; scroll-driven announcements are noise.

### 4.9 Performance budget

- **0 KB of new dependencies**; ~2 KB min of first-party engine code.
- **Zero React re-renders during scroll** — all per-frame output is `style.setProperty`/`setAttribute` on refs.
- Animated properties are compositor-friendly only: `opacity`, `translate`/`transform`, `stroke-dashoffset`. No layout-inducing properties in any transition.
- One rAF loop, gated by IntersectionObserver; all listeners passive; measurements happen only in resize/RO callbacks (no per-frame `getBoundingClientRect`).
- `will-change: transform, opacity` applied narrowly to act layers *only in scroll mode* (it lives under `[data-motion="scroll"]`).
- `content-visibility` intentionally **not** used on the track (it breaks sticky measurement predictability).

### 4.10 What implementation will touch

| File | Change |
|---|---|
| `app/page.jsx` | Insert `<CaseStudy />` between `<ProjectGrid />` and the settings section |
| `components/case-study/*` | New (5 files, per §4.1) |
| Everything else | Untouched — no `layout.jsx`, `globals.css`, or existing component changes |

---

## 5. Dependencies

- **Added: none.**
- **Removed: none.**
- Explicitly declined: `gsap`, `motion`/`framer-motion`, `lenis` (rationale in §3). If the site later grows several scroll-choreographed sections or needs scroll-linked canvas/WebGL, revisit Motion for React first (best React fit); the `acts.js` config and the CSS-variable contract are designed to survive that migration.

---

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Scroll restoration lands mid-track before hydration → brief flash of the stacked (plain) layout | Accepted: fails toward content. If it ever matters, a 3-line inline script can set `data-motion` pre-hydration; not proposed now |
| Act content taller than 100svh on small screens | Type/media budget per act + `overflow: hidden` guard on the stage; short-viewport media query falls back to static layout (§4.7) |
| React 19 StrictMode double-invoked effects | Idempotent setup, full teardown in cleanup; engine holds no module-level state |
| iOS toolbar height changes mid-scroll | `svh` for the stage + engine re-measures on `resize`; progress derives from `scrollY` each frame (never accumulated deltas) |
| Tailwind/CSS-module split becoming muddy | Rule: Tailwind for layout/typography; the module owns only *stateful choreography* selectors (`[data-motion]`, `[data-act]`, `[data-entered]`, custom-property bindings) |
| Future native scroll-timeline migration | The custom-property contract (`--cs-progress`, `--cs-draw`) is exactly what `animation-timeline: scroll()` would drive; channels can migrate one at a time |

---

## 7. Implementation plan (for the follow-up change)

1. `acts.js` — write the three-act content (problem/approach/outcome for one flagship project) and the timing map.
2. `CaseStudy.jsx` — semantic, fully-visible markup first (acts, figures, rail, `ProcessPath`); verify it reads well with zero CSS state. This is also the reduced-motion deliverable, built first on purpose.
3. `CaseStudy.module.css` — scroll-mode layout (track, sticky stage, layered acts) under `[data-motion="scroll"]`; staged transitions keyed to `[data-entered]`; reduced-motion and short-viewport fallbacks.
4. `useScrollTimeline.js` — measurement, progress, threshold→attribute writes, custom-property writes, IO/RO gating.
5. `ProcessPath.jsx` — path geometry, `pathLength="1"`, draw binding.
6. Wire into `app/page.jsx`.
7. Verification checklist:
   - Scrub down *and up* through all thresholds (entrances reverse cleanly)
   - Pin engages and releases with no jump; final act resolved before release; next section (settings) reachable and ordinary
   - OS reduced-motion on → stacked static section, path fully drawn, identical copy
   - JS disabled → same as reduced motion
   - Keyboard-only scrolling; tab order never enters hidden acts
   - Light + dark themes; mobile (`svh` behavior); short-landscape fallback
   - No per-frame React renders (React DevTools profiler), no layout thrash (Performance panel)
   - `npm run build` clean

---

## 8. Summary

Pin with CSS `position: sticky` inside a ~360svh track (native, jump-free hold and release); drive everything from one ~200-line `useScrollTimeline` hook that converts scroll position into a 0–1 progress value and writes CSS custom properties (continuous channels: SVG `stroke-dashoffset` path draw, progress rail) and data attributes (discrete channels: staged typography/diagram/media entrances tweened by CSS transitions); declare the whole narrative — copy, act ranges, per-element offsets — in one `acts.js` config; ship the server-rendered DOM as the plain, fully-visible document and enable choreography only when JS is present *and* motion is allowed, so reduced-motion, no-JS, and bot audiences get identical content with zero scroll choreography. New dependencies: none. Removed: none. Blast radius: one new client island plus one line in `app/page.jsx`.

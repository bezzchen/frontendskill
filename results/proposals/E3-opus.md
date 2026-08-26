# Proposal: Three-Act Scroll Narrative Case Study

Architecture proposal for a pinned, scroll-scrubbed portfolio case-study section.
**No code has been written yet** — this document is the design to review before implementation.

---

## 1. What is in the repo today

| Path | Role | Notes |
| --- | --- | --- |
| `app/layout.jsx` | Root layout | Server component, minimal, `lang="en"` |
| `app/page.jsx` | Home | Server component. `<main class="mx-auto max-w-6xl space-y-24 px-6 py-16">` wrapping header → `ProjectGrid` → settings |
| `app/globals.css` | Global CSS | Tailwind v4 (`@import "tailwindcss"`), CSS-variable theme tokens (`--background`, `--foreground`, `--muted`, `--surface`, `--line`), light/dark via `prefers-color-scheme` |
| `components/ProjectGrid.jsx` | Server component | 8 synthetic projects, gradient placeholder media tagged `data-project-media` |
| `components/SettingsPanel.jsx` | Client component | The only `"use client"` file in the repo |
| `components/ConstellationData.js` | **Unreferenced** | 500 items `{id, label, category}` — imported by nothing |

Stack facts that constrain the design:

- **Next.js 16.2.12 / React 19.2.8, App Router, JavaScript (no TypeScript).** `jsconfig.json` maps `@/*` → repo root.
- **Tailwind CSS v4.3.3 via `@tailwindcss/postcss`.** There is no `tailwind.config.js` — v4 is CSS-first, so any new design tokens belong in `globals.css`, not a JS config.
- **Server-first.** Exactly one client component exists. The site is otherwise static HTML with zero client-side animation runtime. Keeping that property is a design goal, not an accident.
- **No assets directory, no `next/image` usage.** Project media is currently CSS gradients.
- `node_modules` is not installed; `npm install` is required before any verification run.

### Conventions to match

Named exports (`export function ProjectGrid()`), PascalCase filenames under `components/`, Tailwind utilities for layout/typography, `var(--token)` for color, semantic landmarks and `aria-labelledby` on sections. The new work will follow all of these.

---

## 2. Requirements, restated as engineering constraints

| Requirement | Constraint it imposes |
| --- | --- |
| Section "holds" while the user progresses | A pin that does **not** intercept input events — native scrolling must keep working for wheel, trackpad, keyboard, scrollbar drag, and touch momentum |
| Typography / diagrams / media enter in coordinated stages | A single shared clock, with per-element windows on it. Not N independent observers |
| Sequence tracks scroll progress | **Scrubbed**, i.e. reversible and position-derived — not one-shot `IntersectionObserver` triggers |
| One SVG path draws as the story advances | Path length must be known without a client-side measurement pass (no SSR flash) |
| Releases naturally into the next section | The pin must end at a deterministic scroll offset with no layout jump and no leftover fixed element |
| Rest of site stays ordinary semantic React/Next | The blast radius must be one new folder plus a container refactor in `page.jsx` |
| Reduced motion: same content, no choreography | The DOM must be **identical** in both modes. Only presentation differs. And the reduced-motion layout must not leave 400vh of empty scroll |

---

## 3. Proposed architecture

### 3.1 The core idea: sticky track + one number

```
┌─ <section id="case-study">  ── the semantic landmark ────────────┐
│  ┌─ .track  height: calc(4 * 100svh)  ─────────────────────────┐ │
│  │  ┌─ .stage  position: sticky; top:0; height:100svh ───────┐ │ │
│  │  │   display: grid                                        │ │ │
│  │  │   ┌─ .act (grid-area 1/1) ── Act I  typography ─────┐   │ │ │
│  │  │   ┌─ .act (grid-area 1/1) ── Act II diagram + SVG ─┐    │ │ │
│  │  │   ┌─ .act (grid-area 1/1) ── Act III media ───────┐     │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │ │
│  └──────────────────────────────────────────────────────────┘ │ │
└──────────────────────────────────────────────────────────────────┘
   ↓ pin releases when .track scrolls past — next <section> is normal flow
```

Two primitives do all the work:

1. **`position: sticky` on the stage inside a tall track.** The browser pins and releases it. We never touch `position: fixed`, never add a spacer element, never listen to `wheel`/`touchmove`, never call `preventDefault`. "Releases naturally" is free because it is the native behaviour of sticky — the stage un-sticks exactly when the track's bottom edge reaches it, with no layout shift, because the stage occupied its grid slot the whole time.

2. **One CSS custom property, `--cs-p`, written once per animation frame.** JavaScript computes a single normalized number in `[0, 1]` and writes it to the section element. Every staged reveal, every transform, and the SVG path draw are expressed in CSS as `calc()` on that one number.

**No React state is involved in the scroll loop.** This is the single most important performance decision. A `useState` write per scroll frame means a React render + reconciliation per frame; on a section with three acts, a diagram, and a media grid that is a reliable source of dropped frames. Writing `element.style.setProperty("--cs-p", p)` bypasses React entirely and lets the style engine recompute only the properties that reference it.

### 3.2 Progress math

The stage is pinned for `track.height - stage.height` pixels of scroll. That travel is the domain:

```
travel = track.clientHeight - stage.offsetHeight        // guarded against <= 0
p      = clamp01( -track.getBoundingClientRect().top / travel )
```

`getBoundingClientRect()` is read once per frame, before any style write, so there is no read-write-read layout thrash. `travel <= 0` (very tall viewport, very short track) short-circuits to the static layout rather than dividing by zero.

### 3.3 The driver

`components/case-study/useScrollProgress.js` — a client hook, roughly 80 lines:

- **Gate with `IntersectionObserver`** (`rootMargin: "20% 0px"`). The `scroll` listener is only attached while the track is near the viewport. Scrolling the rest of the page costs nothing.
- **Coalesce with `requestAnimationFrame` + dirty flag.** The passive `scroll` listener sets `dirty = true` and schedules one rAF if none is pending. Scroll events fire faster than frames; this collapses them to at most one measurement per frame.
- **`{ passive: true }`** on the scroll listener so the browser never waits on us to decide whether scrolling may proceed.
- **`ResizeObserver`** on track and stage to recompute cached heights on layout change; a `visualViewport` resize listener for mobile URL-bar geometry.
- **Skip redundant writes.** If `|p - lastP| < 0.0005`, do nothing — idle scroll and rubber-banding stop producing style invalidations.
- **Full teardown** on unmount: cancel the pending rAF, disconnect both observers, remove listeners.

`components/case-study/ScrollStage.jsx` — a thin `"use client"` wrapper. It renders a `<div ref>`, calls the hook, and renders `{children}`. It contains no content.

### 3.4 Server/client split (the Next.js part that matters)

All narrative content — headings, prose, the `<figure>`, the inline SVG markup, the media tiles — lives in **`CaseStudy.jsx`, a Server Component**. It passes that already-rendered markup into `ScrollStage` through the `children` prop:

```jsx
// CaseStudy.jsx  — no "use client"
export function CaseStudy() {
  return (
    <section id="case-study" aria-labelledby="case-study-title">
      <ScrollStage>            {/* client: ~2 kB, behaviour only */}
        <ActOne /> <ActTwo /> <ActThree />   {/* server-rendered payload */}
      </ScrollStage>
    </section>
  );
}
```

Passing server-rendered children *through* a client component keeps the content out of the client bundle — the client only ships the driver. Concretely: every word of all three acts is in the initial HTML for crawlers, for Reader Mode, and for find-in-page, while the JavaScript cost is the scroll math alone.

No `next/dynamic({ ssr: false })`, no `useEffect`-gated mounting, therefore no flash of missing content and no hydration mismatch.

### 3.5 Staging: a timeline as data, consumed by CSS

`components/case-study/timeline.js` holds the choreography as plain data — cue windows in normalized progress:

```js
export const CUES = {
  act1Title:  [0.02, 0.12],
  act1Lines:  [0.06, 0.20],   // per-line offset applied via --i
  act1Out:    [0.28, 0.34],
  act2In:     [0.30, 0.40],
  diagramDraw:[0.18, 0.86],   // deliberately spans all three acts
  ...
};
```

Each cue becomes a CSS custom property on the section (`--cs-act1-in: 0.02; --cs-act1-out: 0.12; ...`), emitted once as an inline `style` object by the server component. CSS then derives sub-progress locally:

```css
.actOne {
  --t: clamp(0, calc((var(--cs-p, 0) - var(--cs-act1-in)) / var(--cs-act1-span)), 1);
  opacity: var(--t);
  transform: translate3d(0, calc((1 - var(--t)) * 1.5rem), 0);
}
```

Consequences of putting the mapping in CSS rather than JS:

- JS writes **one** property per frame regardless of how many elements are staged. Adding a fourth staged element costs zero additional JS work.
- Stagger is `calc()` on an index variable (`--i: 0/1/2` set inline per line), not a JS loop.
- Only `opacity` and `transform` are animated — both are compositor-friendly and skip layout and paint. Nothing in the choreography triggers reflow.
- The timeline is inspectable and tweakable in one file, and reviewable as a diff.

`--cs-p` is registered with `@property` in `globals.css` (`syntax: "<number>"; inherits: true; initial-value: 0`) so it is a real number in `calc()` and has a defined value before hydration. `var(--cs-p, 0)` fallbacks are used as well, so the CSS is still valid in a browser that ignores `@property`.

### 3.6 The SVG path draw

The path is authored with **`pathLength="1"`**, which renormalizes its geometry so one user unit equals the whole path:

```jsx
<path d="..." pathLength="1" strokeDasharray="1" className={s.draw} vectorEffect="non-scaling-stroke" />
```

```css
.draw { stroke-dashoffset: calc(1 - var(--cs-draw)); }
```

This deliberately avoids `getTotalLength()`. A JS measurement pass would mean the server-rendered path is either fully drawn or fully hidden until the client measures it — a visible flash either way — and would couple the visual to a forced layout on mount. With `pathLength="1"` the correct dash geometry is present in the SSR HTML, and the draw is one `calc()`.

`stroke-dashoffset` is not GPU-composited, but it is a single path invalidating a small region, which is well within budget. The path's draw window (`diagramDraw`) spans acts I→III, giving the section a continuous through-line rather than an effect that belongs to one act.

Accessibility: the diagram is meaningful, not decorative, so it goes in a `<figure>` with a real `<figcaption>` and the `<svg>` gets `role="img"` plus `<title>`/`<desc>`. The caption states the same information the diagram encodes, so nothing is lost to a screen-reader user.

### 3.7 Reduced motion and no-JS: one shared fallback

The enhancement is **opt-in via an attribute the client driver writes**:

```
Default (SSR, JS disabled, JS errored, reduced motion) → plain stacked document
Only when the driver mounts and motion is allowed  → [data-cs-ready] → pinned choreography
```

```css
/* baseline — this is what ships in the HTML */
.track { height: auto; }
.stage { position: static; height: auto; }
.act   { grid-area: auto; opacity: 1; transform: none; }
.draw  { stroke-dashoffset: 0; }          /* path fully drawn */

/* enhancement — only after the driver opts in */
[data-cs-ready] .track { height: calc((var(--cs-acts) + 1) * 100svh); }
[data-cs-ready] .stage { position: sticky; top: 0; height: 100svh; }
[data-cs-ready] .act   { grid-area: 1 / 1; opacity: var(--t); ... }
```

Three properties follow from this, and they are why I prefer it to the usual "`prefers-reduced-motion` overrides at the bottom of the file" approach:

1. **The DOM is byte-identical in both modes.** Reduced-motion users get the same three acts, the same diagram, the same media, the same headings, in the same order. Nothing is conditionally rendered, so nothing can drift out of sync between the two paths.
2. **The reduced-motion layout is a real layout, not a de-animated pin.** Acts move from `grid-area: 1/1` (overlapping) to `grid-area: auto` (stacked rows), and the track collapses to `height: auto`. There is no 400vh of empty scroll and no pile of overlapping text — it reads as three ordinary subsections. This is the failure mode I most want to avoid: sections that "support" reduced motion by disabling the animation while keeping the 4-screen-tall empty container.
3. **No-JS, slow-hydration, and JS-error all land on the same well-tested path.** There is no separate degraded mode to maintain.

The JS side reinforces it rather than duplicating it. `usePrefersReducedMotion()` reads `matchMedia("(prefers-reduced-motion: reduce)")` and, when reduce is set, the driver **never attaches listeners and never writes `data-cs-ready`** — zero scroll work, not merely invisible scroll work. A `change` listener handles runtime preference flips in both directions, tearing the pin down or building it up live. A `@media (prefers-reduced-motion: reduce)` block that neutralises `[data-cs-ready]` remains as a second line of defence.

For SSR safety, `matchMedia` is only read inside `useEffect` (or via `useSyncExternalStore` with a `false` server snapshot). Because CSS already renders the correct baseline at first paint, a one-frame hydration lag is visually invisible.

### 3.8 Focus and the invisible-content problem

An element at `opacity: 0` is still focusable. If Act III contained a link, a keyboard user tabbing forward during Act I would send focus to something they cannot see, and the browser would scroll to it — breaking the pin.

**Rule: nothing inside the pinned stage is interactive.** The acts are prose, figures, and media placeholders. The "Read the full case study" / "View the repository" links live in the release section immediately *after* the track, in normal flow. This removes the failure mode by construction rather than patching it.

`inert` on non-active acts is the documented fallback if interactive content is ever added — but it is a worse default here, because `inert` also strips content from the accessibility tree, and a screen-reader user reading linearly should encounter all three acts. It must never be applied when reduced motion is on.

Heading structure stays valid in both modes: section `<h2>`, one `<h3>` per act.

### 3.9 The unreferenced `ConstellationData.js`

500 items, imported by nothing. It is exactly the shape of thing that invites rendering 500 scroll-animated DOM nodes, which would be the single worst decision available here — 500 elements each reading a custom property, re-styled every frame.

Proposal: **consume it on the server, at module scope, as diagram geometry.** `components/case-study/diagram.js` imports `constellationItems`, deterministically derives x/y/tier from `id` and `category` (an integer hash — **no `Math.random()`**, which would produce a hydration mismatch), samples ~60 nodes, and exports plain coordinate arrays. `CaseStudy.jsx` renders them as static `<circle>` elements grouped into three `<g class="tier">` elements. Animation is applied to the **three groups**, not the sixty nodes.

Net effect: the constellation costs 3 animated elements instead of 500, the geometry is computed once at render time on the server, and zero of that data crosses the network as JavaScript. I would rather use the file this way than delete it, but deleting it is also defensible if you prefer the case study not to depend on it — flagging the choice rather than making it silently.

### 3.10 Container refactor in `page.jsx`

`main` is currently `mx-auto max-w-6xl px-6`, which would clamp a full-bleed 100svh stage to 1152px and add horizontal padding to the pinned area. Minimal fix: move the container from `main` down to each section.

```jsx
<main className="space-y-24 py-16">
  <header className="mx-auto max-w-6xl px-6 ...">…</header>
  <CaseStudy />                                  {/* full-bleed; own inner container */}
  <div className="mx-auto max-w-6xl px-6"><ProjectGrid /></div>
  <section className="mx-auto max-w-6xl px-6 ...">…</section>
</main>
```

This is a container move, not a rewrite — `ProjectGrid` and `SettingsPanel` are untouched.

**Load-bearing constraint to record in a code comment:** `position: sticky` silently stops working if *any* ancestor has `overflow: hidden`, `auto`, `scroll`, or `clip`, or a `transform`/`filter`/`contain: paint` that creates a containing block. `overflow-x: hidden` on `html`/`body`/`main` — a very common later addition to suppress horizontal scrollbars — is the usual culprit. Nothing in the repo does this today; the comment exists so nobody adds it later and spends an afternoon on it.

Placing the case study between the header and `ProjectGrid` means the pin releases directly into the existing "Selected projects" grid — an ordinary, already-semantic section. That satisfies "releases naturally into the next normal document section" with real existing content rather than a contrived spacer.

---

## 4. Files

```
PROPOSAL.md                                  (this file)
app/page.jsx                                 MODIFIED — container refactor, mount <CaseStudy/>
app/globals.css                              MODIFIED — @property --cs-p, reduced-motion guard
components/case-study/
  CaseStudy.jsx                              NEW  server — all content, all three acts, cue vars
  ScrollStage.jsx                            NEW  client — ~30 lines, ref + hook + {children}
  useScrollProgress.js                       NEW  client — IO gate, rAF coalescing, rect math
  usePrefersReducedMotion.js                 NEW  client — matchMedia + change listener
  timeline.js                                NEW  pure data — cue windows, JSDoc-typed
  diagram.js                                 NEW  pure — deterministic SVG geometry
  caseStudy.module.css                       NEW  track/stage/act/cue styles
components/ProjectGrid.jsx                   UNCHANGED
components/SettingsPanel.jsx                 UNCHANGED
components/ConstellationData.js              UNCHANGED (now imported by diagram.js)
```

Choreography CSS goes in a **CSS Module**, co-located with the component: hashed class names keep it out of the global cascade, and it is the natural home for rules Tailwind utilities cannot express (`calc()` chains on custom properties, `stroke-dashoffset`, `@property`-driven staging). Tailwind still handles typography, spacing, and color inside the acts, so the acts look like the rest of the site. The `@property` registration goes in `globals.css` instead — `@property` registers globally no matter which file declares it, and hiding a global side effect inside a scoped module is a trap for the next reader.

---

## 5. Dependencies

### Adding: none. Removing: none.

The whole feature is native `position: sticky`, one rAF-coalesced scroll read, CSS custom properties, and `pathLength="1"`. Estimated client cost: **~2 kB gzipped, zero new network requests, zero new build steps.**

Libraries considered and rejected:

| Library | Why not |
| --- | --- |
| **GSAP + ScrollTrigger** | ~50 kB gz for behaviour that is ~120 lines here. `pin: true` implements pinning with `position: fixed` plus an injected spacer element, which is precisely the mechanism `position: sticky` exists to replace — and it reintroduces the pin-release layout-shift class of bug that sticky does not have. Also fights the server-first architecture: the entire section would become a client component. |
| **Framer Motion / `motion`** | Its `MotionValue` model does correctly avoid per-frame React renders, so the perf argument is weaker — but it is ~35–50 kB gz added to a site that currently ships one client component, to replace a hook. `useScroll`/`useTransform` also require the animated elements to be `motion.*` components, which forces all three acts into the client bundle and undoes §3.4. |
| **Lenis / smooth-scroll libraries** | Actively harmful here. Replacing native scrolling with an interpolated JS scroll position breaks find-in-page scroll positioning, breaks scroll restoration, adds latency to keyboard paging, and imposes continuous motion on users whose OS asked for less of it. It is the opposite of the reduced-motion requirement. |
| **`react-intersection-observer`** | A wrapper over ~15 lines of platform API, and IO alone cannot express scrubbed progress anyway — it gives thresholds, not a continuous position. |

### Considered and deferred: CSS-only scroll-driven animations

`animation-timeline: view()` / `scroll()` could express the entire choreography with **zero** JavaScript and run entirely off the main thread. It is genuinely the endgame for this feature. I am not proposing it for v1 because a JS driver is still required as the fallback for engines without it, so shipping both means maintaining two timelines that must stay numerically in sync — meaningfully more surface area than the ~2 kB it would save.

The proposed structure is designed so this is a clean later swap: every staged element already derives its state from a single normalized progress variable, so migrating means replacing "JS writes `--cs-p`" with "`animation-timeline` drives `--cs-p`" behind `@supports (animation-timeline: view())`, and deleting the hook. No component or CSS restructuring. I would revisit once support is unconditional.

---

## 6. Verification plan

**Behaviour**
- Wheel, trackpad, keyboard (`Space` / `PgDn` / `Home` / `End` / arrows), scrollbar drag, and touch momentum all progress the sequence — nothing is intercepted.
- Reverse scrolling reverses the sequence smoothly (proves it is scrubbed, not triggered).
- No layout jump at pin engage or pin release; the stage does not resize mid-pin.
- Deep link to `#case-study` lands at the top of the track and the sequence starts from 0.

**Reduced motion** — OS setting and DevTools *Rendering → Emulate `prefers-reduced-motion`*:
- All three acts visible and stacked, all media present, SVG path fully drawn.
- Track collapses — no tall empty scroll region.
- Toggling the preference at runtime transitions cleanly in both directions.

**Degradation**
- JS disabled: full content, plain stacked layout, identical to reduced motion.
- View source: every word of all three acts present in the initial HTML.

**Performance** — DevTools Performance profile while scrolling the section:
- No forced synchronous layout beyond the single `getBoundingClientRect()` per frame.
- No long tasks; frames stay within budget.
- *Paint flashing* confirms only the SVG path region repaints; act transitions are composite-only.
- CLS = 0 across the whole page (track height is deterministic in `svh`).

**Accessibility**
- Tab order never lands on an invisible element.
- Heading outline valid in both modes.
- Diagram has an accessible name and a caption carrying the same information.
- Lighthouse a11y pass.

**Responsive** — 360px → 1920px; iOS Safari specifically, to confirm `svh` keeps the pinned stage stable through URL-bar collapse.

---

## 7. Risks and open questions

| Risk | Mitigation |
| --- | --- |
| A future `overflow-x: hidden` on an ancestor silently kills the pin | Code comment at the declaration; noted in §3.10 |
| Mobile: 4 screens of scroll can feel long on a small device | Track height is one tunable (`--cs-acts`); propose reducing travel below 640px |
| iOS URL-bar collapse resizing the pinned stage mid-scroll | `100svh` (smallest viewport height) rather than `100vh`, so the stage does not resize when chrome hides |
| Very tall viewports could make `travel <= 0` | Driver short-circuits to the static layout rather than dividing by zero |
| Content re-flow during the pin causing scroll anchoring jumps | `overflow-anchor: none` on the track |

**Open questions for you:**

1. **Real project media, or placeholders?** No assets exist; the current site uses CSS gradients tagged `data-project-media`. I plan to match that convention with a single swap point (a `media` array in the data module) so real images drop in behind `next/image` later. Say the word if actual imagery should be sourced now.
2. **Case-study subject.** I will write a plausible engineering case study (premise → system → outcome) consistent with the "systems, interfaces, computational design" framing in the header, unless you have specific content.
3. **`ConstellationData.js`:** consume as diagram geometry (§3.9) or leave untouched?
4. **Placement:** between header and `ProjectGrid` (releases into "Selected projects") is my recommendation. Alternative is after the grid.

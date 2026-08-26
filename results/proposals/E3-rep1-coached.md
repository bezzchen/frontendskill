# Proposal: Three-Act Scroll-Narrative Case-Study Section

Status: proposal only — no implementation yet.
Scope: add one choreographed case-study section to the existing portfolio page; everything else on the site stays ordinary semantic React/Next.js UI.

---

## 1. What the repository is today

- **Stack:** Next.js 16.2.12 (App Router), React 19.2.8, Tailwind CSS 4.3.3 via `@tailwindcss/postcss`. Plain JavaScript (`.jsx`/`.js`, `jsconfig.json` with `@/*` alias). No TypeScript, no test runner, no linter, and — deliberately — **no animation or graphics libraries** (per `README.md`).
- **Pages:** a single route, `app/page.jsx`, a server component rendering:
  1. a header (name + intro),
  2. `components/ProjectGrid.jsx` — a semantic grid of 8 project cards, each with a gradient placeholder media surface (`data-project-media`),
  3. an "Account settings" section wrapping `components/SettingsPanel.jsx` (the only existing client component).
- **Styling:** Tailwind utilities plus five CSS custom properties in `app/globals.css` (`--background`, `--foreground`, `--muted`, `--surface`, `--line`) with a dark-scheme override. Components use `var(--…)` through Tailwind arbitrary values.
- **Data:** `components/ConstellationData.js` (500 nodes) exists for a different eval scenario; irrelevant here and untouched.
- `node_modules` is not installed; the lockfile is frozen. Any verification step starts with `npm ci`.

Everything is server-rendered except `SettingsPanel`. That is the pattern to preserve: the new section should be the only other client-component subtree.

## 2. Requirements, restated precisely

1. A **portfolio case-study section** with a **three-act narrative**.
2. The section **holds (pins)** while the user scrolls through it.
3. **Typography, diagrams, and project media enter in coordinated stages** — an orchestrated sequence, not independent one-off triggers.
4. The sequence is **scrubbed by scroll progress** — a pure function of scroll position, reversible, resumable at any offset (deep link, find-in-page, fast flick), not time-based tweens fired by thresholds.
5. **One SVG path draws** as the story advances.
6. The page **releases naturally** into the next normal document section — no jump, no scroll hijack, no leftover spacer weirdness.
7. The **rest of the site remains ordinary semantic UI**.
8. **Reduced-motion users get the same content with no scroll choreography.** Same words, same diagram, same media — statically laid out. (I extend the same guarantee to no-JS/SEO crawlers and to pre-hydration paint.)

## 3. Approach comparison

Five candidate architectures were evaluated:

### A. Hand-rolled: CSS `position: sticky` pin + one rAF progress engine + a declarative cue table — **recommended**

- **Pinning** via a tall scroll "track" (`~420svh`) containing a `sticky top-0 h-[100svh]` stage. Sticky is native, stays in document flow, never mutates the DOM, and its end-of-track behavior *is* the "natural release": when the track runs out, the stage simply scrolls away with it and the next section arrives normally. No pin-spacers, no layout jumps, nothing to clean up.
- **Progress** = `clamp01(-track.top / (track.height − stage.height))`, computed at most once per animation frame from a passive scroll listener + `getBoundingClientRect()`, active only while the track is near the viewport (IntersectionObserver gate).
- **Coordination** via a small pure-data "score": per-element cues `{ element, [start, end], effect, easing }` over global progress, grouped into three act ranges. A ~30-line interpreter maps global progress to per-element local progress and writes styles imperatively through refs. This is a tiny timeline engine — exactly the part GSAP would otherwise provide — but it is trivially testable pure math and costs 0 KB.
- **SVG draw** via the `pathLength="1"` attribute: `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` driven by one cue. No `getTotalLength()` measurement, no layout read, SSR-safe.
- **Cost:** ~250–330 lines across ~8 small files. Zero dependencies.

### B. GSAP + ScrollTrigger — rejected (for now)

The industry default for pin + scrub + timeline staging, and free since 3.13. But: ~45 KB gz added to a site that currently ships almost no client JS; imperative API that needs `@gsap/react`/context for safe React 19 cleanup; JS-managed pinning inserts pin-spacer wrapper divs (DOM mutation around the section); and the fixture explicitly starts animation-library-free. One bespoke section does not amortize the dependency. **Revisit if** the site grows to several choreographed scenes or needs GSAP-grade features (smooth scrubbing inertia, complex nested timelines, snap).

### C. Motion (framer-motion) `useScroll` + `useTransform` — rejected (for now)

React-idiomatic and pleasant (`useScroll({ target, offset })` returns exactly the scrubbed progress; `useReducedMotion` built in; `pathLength` animatable). But it is ~18–34 KB gz to reproduce what ~80 lines of hook code does here, and the sticky-pin pattern is identical either way. Same revisit trigger as GSAP.

### D. Native CSS scroll-driven animations (`animation-timeline: view()/scroll()`) — rejected

Zero-JS is attractive, but as of early 2026 Firefox still ships it behind a flag (Chromium and Safari 26 support it), so a JS fallback is required anyway — a double implementation. Coordinating one shared three-act sequence plus `inert`/`aria` state across many elements in pure CSS is also substantially harder to author and review than one cue table. Worth revisiting as a progressive enhancement once Firefox ships.

### E. Pre-rendered video scrub (the `scroll-world` technique) — rejected

Evaluated because a scroll-narrative skill exists in this environment. It scrubs AI-generated camera-flight video by scroll — the Apple-product-page technique. Wrong tool here: the requirements demand real DOM typography, a real SVG path drawing, semantic content identical for reduced-motion users, and no heavy media pipeline. Baking the narrative into video would destroy semantics, accessibility, find-in-page, and the zero-asset nature of this fixture.

**Decision: Architecture A.** It satisfies every requirement with platform primitives, keeps the dependency count at zero, keeps the client-JS surface to one small subtree, and records clear triggers for when a library would earn its place.

## 4. Proposed architecture

### 4.1 File layout

```
components/case-study/
  CaseStudy.jsx              "use client" — orchestrator: track + sticky stage,
                             wires hooks to the score, owns coarse act state,
                             renders static variant when choreography is off
  caseStudyContent.js        All copy, act metadata, media/diagram data.
                             Single source of truth consumed by BOTH modes.
  score.js                   Pure data + math: act ranges, cue table, clamp01,
                             easings, segment(progress, start, end) → 0..1.
                             No DOM, no React — unit-testable in isolation.
  useScrollProgress.js       rAF-coalesced 0..1 progress for a ref'd track,
                             IntersectionObserver-gated, resize-aware, SSR-safe.
  usePrefersReducedMotion.js matchMedia('(prefers-reduced-motion: reduce)') hook,
                             SSR default = reduced, live-updates on change.
  ActProblem.jsx             Act I — typography-led problem framing.
  ActApproach.jsx            Act II — diagram + the drawable SVG path.
  ActOutcome.jsx             Act III — project media cluster + results + CTA.
  JourneyPath.jsx            The SVG diagram; main path has pathLength="1".
```

`app/page.jsx` (stays a server component) inserts `<CaseStudy />` between `<ProjectGrid />` and the "Account settings" section — so the narrative releases into a genuinely ordinary next section, per requirement 6.

### 4.2 DOM shape (choreographed mode)

```
<section aria-labelledby="case-study-title">        ← normal flow, semantic
  <div class="track" style="height: 420svh">        ← scroll distance = story length
    <div class="stage sticky top-0 h-[100svh] overflow-hidden">
      <ActProblem/>   ← layered, absolutely positioned
      <ActApproach/>
      <ActOutcome/>
      <ProgressRail/> ← decorative act indicator, aria-hidden
    </div>
  </div>
</section>
<section>Account settings …</section>               ← untouched next section
```

The acts are real, source-ordered document content (headings, paragraphs, figure elements) that happens to be layered inside the sticky stage. Nothing is removed from the accessibility tree by the pinning itself.

### 4.3 The score (coordination layer)

```js
// score.js (illustrative)
export const TRACK_LENGTH_SVH = 420;          // single tuning knob for pacing
export const ACTS = [
  { id: "problem",  range: [0.00, 0.30] },
  { id: "approach", range: [0.28, 0.66] },    // slight overlaps = cross-dissolves
  { id: "outcome",  range: [0.64, 0.96] },    // 0.96–1.00 = settled release ramp
];
export const CUES = [
  { el: "problem.eyebrow",   at: [0.02, 0.07], fx: "rise" },
  { el: "problem.headline",  at: [0.05, 0.12], fx: "rise" },
  { el: "problem.body",      at: [0.10, 0.16], fx: "fade" },
  { el: "approach.path",     at: [0.32, 0.58], fx: "draw" },   // ← the SVG path
  { el: "approach.node.1",   at: [0.36, 0.40], fx: "pop"  },   // nodes pop as the
  { el: "approach.node.2",   at: [0.44, 0.48], fx: "pop"  },   //   path reaches them
  { el: "outcome.media.1",   at: [0.66, 0.74], fx: "rise" },
  { el: "outcome.media.2",   at: [0.70, 0.78], fx: "rise" },
  { el: "outcome.metrics",   at: [0.76, 0.84], fx: "fade" },
  // …act-level fade/parallax cues for the cross-dissolves
];
```

This one table is the whole choreography: typography, diagram nodes, path draw, and media all read from the same progress value, so stages are coordinated by construction and trivially re-timed in review.

### 4.4 The engine (per frame)

```
scroll/resize (passive) → schedule rAF (coalesced) →
  p = clamp01(-trackRect.top / (trackRect.height - stageHeight))
  sectionEl.style.setProperty("--cs-progress", p)      // for rail + debugging
  for cue of CUES:
    t = ease(segment(p, cue.at))                        // local 0..1
    writers[cue.fx](refs.get(cue.el), t)                // imperative style write
  act = actIndexFor(p)
  if act changed → setActState(act)                     // the ONLY React state
```

- **No React re-render per frame.** Styles are written directly to refs; React state changes only at act boundaries (three times per traversal), used for `aria-current` on the rail and `inert` on inactive acts.
- Writers touch only compositor/paint-cheap properties: `opacity`, `transform`, `stroke-dashoffset`.
- Because everything is a pure function of `p`, scrubbing is reversible and correct after any jump (find-in-page, anchor, Home/End key, flick) — the classic failure mode of one-shot IntersectionObserver triggers is structurally impossible.

### 4.5 The SVG path draw

`JourneyPath.jsx` renders the Act II diagram (a process/journey line with labeled milestone nodes — consistent with the fixture's no-binary-assets style). The hero path carries `pathLength="1"`, so:

```css
stroke-dasharray: 1;
stroke-dashoffset: 1;   /* choreographed mode start; 0 = fully drawn */
```

The `draw` writer sets `strokeDashoffset = 1 − t`. Node pops are timed in the cue table to land as the path tip passes them. The SVG is `aria-hidden="true"` with the diagram's meaning restated in adjacent visible text (it is a narrative illustration, not the sole carrier of information).

### 4.6 Reduced motion, no-JS, and hydration — one mechanism

**Static-by-default styling.** Every choreographed element's CSS defaults are its *final, fully revealed* state (opacity 1, no offset, path drawn). Hidden/offset states are never expressed in stylesheets or server-rendered markup — they exist only as inline styles written by the engine after mount. Consequences:

- **SSR / crawlers / JS-off:** full content, fully visible. No flash of hidden content, no hydration mismatch (server and client render identical markup; the engine attaches in an effect).
- **`prefers-reduced-motion: reduce`:** `usePrefersReducedMotion` (SSR default: reduced) short-circuits the orchestrator into **static mode**: the same three act components, same `caseStudyContent.js` copy, rendered as normal stacked sections — no tall track, no sticky, no engine, no hidden states, path fully drawn. Requirement 8 is met by construction because content components are choreography-agnostic; choreography is a wrapper concern.
- **Live toggle:** the media query is watched; flipping it mid-visit tears the engine down and clears inline styles (back to revealed defaults) or stands it back up.
- **Short-viewport guard:** viewports under ~480px height (where a 100svh stage cannot hold an act's content comfortably) also get static mode via the same switch.

### 4.7 Accessibility and semantics

- Native scrolling only. Sticky never intercepts wheel/touch input; there is no scroll hijacking, no smooth-scroll library, no synthetic scrolling.
- Heading hierarchy continues the page's existing outline (`h2` section title, `h3` act titles). All narrative text is real DOM text in source order.
- Inactive acts get `inert` (toggled at act boundaries via the coarse React state) so keyboard users cannot tab into visually hidden layers; the only interactive element is Act III's CTA link, which is active when its act is. Find-in-page can still land inside the section; because state is a pure function of scroll position, the browser's scroll-to-match renders a coherent frame.
- The progress rail is decorative (`aria-hidden`); no live regions announce scroll progress (noise).
- Contrast and theming use the existing CSS custom properties, inheriting light/dark support for free.

### 4.8 Performance

- **Bundle:** +0 dependencies; roughly 3–4 KB min+gz of first-party client code, mounted only for this subtree. The rest of the page stays server-rendered.
- **Runtime:** one passive scroll listener; one rect read and a bounded set of style writes per frame; engine idle (IO-gated) until the section approaches the viewport; `will-change: transform, opacity` applied to act layers only while pinned, removed after release; `100svh` stage so mobile URL-bar collapse does not thrash layout; viewport/track metrics cached and refreshed via ResizeObserver + resize/orientationchange.
- No layout-inducing properties are animated; `stroke-dashoffset` repaints only the small SVG region.

## 5. What gets touched

| File | Change |
|---|---|
| `app/page.jsx` | Insert `<CaseStudy />` between `ProjectGrid` and the settings section (one import, one element). |
| `app/globals.css` | ~10–20 lines: case-study defaults (revealed states), rail styling hooks. Optionally nothing, if kept fully in Tailwind + inline styles. |
| `components/case-study/*` | New, as listed in 4.1. |
| Everything else | Untouched — `ProjectGrid`, `SettingsPanel`, `layout.jsx`, configs, `ConstellationData.js` stay as-is. |

## 6. Dependencies

- **Added: none.** Pinning, scrubbing, staging, and path drawing all use platform primitives (sticky positioning, rAF, IntersectionObserver, matchMedia, SVG `pathLength`).
- **Removed: none.**
- **Considered and rejected:** `gsap` + ScrollTrigger, `motion`/`framer-motion`, `lenis`/`locomotive-scroll` (smooth-scroll hijack conflicts with requirement 6 and accessibility), `scrollama` (trigger-based, not scrub-based), CSS scroll-driven animations (Firefox gap as of early 2026), video-scrub pipeline (wrong medium). Revisit triggers are recorded in §3.

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Act content overflows the 100svh stage on small screens / high zoom | Compact fluid type via `clamp()`; short-viewport static-mode guard (§4.6); manual test at 200% zoom. |
| Cue timing feels cramped or rushed | All pacing lives in two knobs (`TRACK_LENGTH_SVH`, cue table) — retunable without touching components. |
| Keyboard focus lands in a hidden act | `inert` on inactive acts; single CTA lives in the final act. |
| Hydration mismatch / flash of hidden content | Revealed-by-default styling; engine attaches post-mount only (§4.6). |
| Engine work while section is off-screen | IntersectionObserver gate around listener + rAF loop. |
| Sticky quirks inside transformed/overflow ancestors | Section sits directly in `<main>`; no ancestor creates a containing block that breaks sticky (verify in review). |

## 8. Verification plan

1. `npm ci && npm run build` — compiles clean (no test runner exists in the fixture; none added).
2. Manual scroll-through in Chromium, Safari, Firefox: pin engages, three acts scrub forward *and backward*, path draws with the story, release into "Account settings" has no jump.
3. DevTools "Emulate CSS prefers-reduced-motion" → identical content, statically stacked, no track/pin, path fully drawn; toggle live and confirm clean switchover.
4. Disable JavaScript → full content visible (server-rendered static-equivalent state).
5. Keyboard: Tab order skips inactive acts; CTA reachable in Act III. Find-in-page for Act II copy lands coherently.
6. Mobile viewport (390×844) and a short viewport (~450px height → static fallback); 200% zoom.
7. Performance sanity: DevTools performance trace while scrubbing — no long tasks from the engine, no layout thrash (single rect read per frame).

## 9. Implementation order (when approved)

1. `caseStudyContent.js` + the three act components + `JourneyPath.jsx`, rendered in **static mode only** — content and semantics reviewed first, before any motion.
2. `score.js` (pure functions + cue table) — the timeline as reviewable data.
3. `useScrollProgress.js` + `usePrefersReducedMotion.js`.
4. `CaseStudy.jsx` orchestrator: track/stage wrapper, engine loop, act state, `inert`/rail wiring.
5. Insert into `app/page.jsx`; tune the cue table; run the verification plan.

Estimated size: ~300 lines of new first-party code, one modified line-pair in `page.jsx`, zero dependency changes.

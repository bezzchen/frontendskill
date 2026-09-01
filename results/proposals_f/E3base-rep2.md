# E3base-rep2 — BASELINE (no skill), Fable, plan-only
Eval: E3-cinematic-scroll. Fixture next-tailwind-base @ edf3be4. Relaunched after a 600s stream
stall killed the first attempt; prior dir was clean (0 dirty), prompt byte-identical.

## Repo findings
Next 16.2.12 App Router, React 19.2.8, Tailwind 4.3.3 (CSS-first, no tailwind.config), plain JS with
@/* alias. **No animation libraries** — no framer-motion, GSAP or lenis. One-page portfolio: header
-> ProjectGrid (8 card links) -> Account settings (SettingsPanel, the only "use client" component).
Semantic HTML with aria-labelledby throughout. Theming via CSS custom properties + prefers-color-scheme.
Noted ConstellationData.js is currently unused — "I won't touch it."
Insertion point identified: between <ProjectGrid /> and the settings section, so "release into the
next normal document section" lands on Account settings.

## Core decision: ZERO-DEPENDENCY sticky-track scroll engine, as progressive enhancement
A tall ~400vh scroll "track" wraps a position:sticky; top:0; height:100svh stage. **Native scrolling
is never intercepted — no wheel handlers, no scroll-jacking** — so the pin holds for exactly the
track's height and releases into normal flow by construction. Scroll position maps to a single
normalized progress 0-1 that drives everything.

Why not a library (explicit): repo has zero animation deps and the brief says the rest of the site
stays ordinary React/Next. One section doesn't justify framer-motion (~30kb) or GSAP ScrollTrigger.
Pure CSS scroll-driven animations (animation-timeline: scroll()) considered and rejected as the
PRIMARY mechanism — "Safari support is too recent to rely on alone, and we need JS anyway for
act-threshold logic." A small rAF engine (~80 lines) is fully controllable and testable.

## File map
components/case-study/{CaseStudySection.jsx (server, semantic shell, three <article> acts in DOM
order), caseStudyContent.js (data module per repo convention), ScrollStage.jsx ("use client", owns
the engine), useScrollTimeline.js (engine hook), ActPanel.jsx, StoryPath.jsx, ProgressRail.jsx,
case-study.css}; app/page.jsx gains one line.

## Engine
progress = clamp((-trackRect.top) / (trackHeight - viewportHeight), 0, 1), computed in a rAF loop
**gated by an IntersectionObserver so the engine only runs while the track is near the viewport.**
Passive listeners; metrics cached, refreshed by ResizeObserver + window resize.
Two motion classes routed differently:
1. Scrubbed (continuous) — written every frame as CSS custom properties on the track node via
   style.setProperty (--p, plus remapped --path-p). **Never enters React state** — zero re-renders
   during scroll, consumed by CSS calc(). Drives SVG draw, rail fill, media crossfade/parallax.
2. Staged (discrete) — act timeline (Act I 0-0.30, II 0.30-0.62, III 0.62-0.92, release ramp
   0.92-1.0). Crossing a threshold writes data-act="n" on the stage (DOM attribute, not React state).
   CSS attribute selectors + per-element transition-delay give the typography -> diagram -> media
   stagger. Reversible. Hidden stages use opacity + visibility so off-stage content is neither
   readable by AT mid-choreography nor focusable.
Mid-page loads/anchor jumps: progress computed immediately on mount from current scroll offset.

## SVG path
<path> gets pathLength="1", so stroke-dasharray:1 and stroke-dashoffset: calc(1 - var(--path-p))
draw it with **no getTotalLength() measurement, no hydration mismatch, no layout read.** Milestone
nodes fill at act boundaries. Stroke uses var(--foreground)/var(--muted) so both themes work free.

## Release mechanics
"Nothing to build — it falls out of the sticky-track choice." Final 8% is a settle ramp so release
doesn't cut mid-motion. Keyboard scrolling, spacebar, Page Down, find-in-page and the native
scrollbar all behave because scroll is never hijacked.

## Reduced motion / no-JS / SSR — one mechanism for all three
**Base CSS = the static layout.** Server render shows all three acts stacked, fully visible, track
height:auto, sticky off, path fully drawn. All choreography sits behind
@media (prefers-reduced-motion: no-preference) AND a data-enhanced attribute the client adds only
after mount when the reduce query is false and the viewport is tall enough (~480px guard, so short
landscape phones also get static). Consequences: reduced-motion users get identical content and DOM
order with no listeners attached (hook stays inert, and reacts to live toggles); no-JS and
pre-hydration visitors get readable, indexable content with no flash of hidden text; SR users always
have the real heading/article structure.

## A11y / perf
Real <section aria-labelledby> + <h2> + three <article>s — "the narrative is document structure, not
divs with styles." ProgressRail aria-hidden (decorative). Animate only transform/opacity (+
dashoffset); will-change only while pinned; one rAF loop, one style write target, no per-frame layout
reads. Media uses existing fixed-aspect placeholder pattern so no CLS.

## Note for scoring
Second baseline run (with E5base-rep2) to gate its loop with IntersectionObserver UNPROMPTED and with
no skill loaded. Layer-B plan-quality signal only — described, not demonstrated; no decision weight.

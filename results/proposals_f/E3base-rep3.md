# E3base-rep3 — BASELINE (no skill), Fable, plan-only
Eval: E3-cinematic-scroll. Fixture next-tailwind-base @ edf3be4.

## Repo survey
Next 16.2.12 App Router + React 19.2.8, plain .jsx, @/* alias. Tailwind v4 via @tailwindcss/postcss;
theming through CSS custom properties + prefers-color-scheme. One page (server component): header ->
ProjectGrid -> SettingsPanel ("use client"). **Grid cards link to #project-N anchors that currently
point nowhere.** Zero animation/scroll dependencies. No next.config, no test runner, no lint config.
Noted ConstellationData is unused dead code, irrelevant here.

## Decision 1 — no new dependencies; native sticky pinning, no scroll hijacking
Tall ~420vh track contains a stage that is sticky; top:0; height:100dvh. "That is requirement 5
('release naturally') for free — no unpin math, no fixed/absolute swapping, no layout jump."
Native scrolling untouched so keyboard paging, scrollbar dragging, fragment jumps and find-in-page
keep working; "this is also the a11y-safe choice." Engine ~150 lines; "a library would buy nothing
but bundle weight and version churn." CSS-only animation-timeline: scroll() considered and rejected
as primary — "Firefox support is still not reliable" — with room to layer it later.

## Decision 2 — one progress source, TWO WRITE CHANNELS (render-discipline core)
p = clamp(-rect.top / (trackHeight - viewportHeight), 0, 1).
- Activation: **IntersectionObserver on the track starts/stops a rAF-coalesced scroll listener, so
  the page costs nothing while the section is off-screen.**
- Continuous channel (NO React renders): each frame writes --progress and derived --path-draw as CSS
  custom properties on the section root via ref, **skipping writes when the rounded value is
  unchanged.** SVG path draw and progress rail consume these.
- Discrete channel (rare renders): a pure function maps p to {actIndex, stageFlags}; setState fires
  only when those change (a handful of times per traversal), landing in the DOM as data-act="2" /
  data-stage-media="in".

## Decision 3 — staged entrances as config-as-data timeline, not imperative tweens
caseStudyContent.js holds acts with act-local stage fractions; pure functions in timeline.js turn
global p into act-local progress and per-stage booleans. Crossing a threshold toggles a data
attribute; CSS transitions do the tweening. "Because the mapping is pure and scrub-bound, scrolling
backwards reverses every state deterministically — the sequence TRACKS scroll rather than autoplaying
on entry, and fast scrolling never leaves orphaned mid-tween state." timeline.js dependency-free and
unit-testable.
Zones: 0.00-0.04 lead-in, ACT I 0.04-0.34, ACT II 0.34-0.64, ACT III 0.64-0.92, settle 0.92-1.00
"so pin and release never cut a beat mid-flight."

## Decision 4 — SVG path via pathLength="1" + CSS variable
One <path pathLength="1"> with stroke-dasharray:1; stroke-dashoffset: calc(1 - var(--path-draw)).
Hook writes --path-draw once per frame on the section root — "one cheap paint of a single stroke, no
per-frame React, no getTotalLength() measurement." Waypoints light via the same discrete data
attributes. SVG aria-hidden decorative; stroke colours from existing tokens so dark mode works untouched.

## Decision 5 — reduced motion and no-JS: same content, flow layout, zero choreography
Enforced in three layers: (1) **server HTML is the complete article** — all acts render as normal
flowing semantic content, nothing hidden at SSR; (2) **choreography OPTS IN, never out** — the pinned
layout applies only under [data-choreo="on"], set from a client effect only when
matchMedia("(prefers-reduced-motion: no-preference)") matches, so reduced-motion and no-JS users get
identical content "because the choreographed state is never applied, not because it's undone";
(3) CSS belt-and-braces @media reduce neutralises transitions, and a usePrefersReducedMotion hook with
change listener skips attaching observers/listeners entirely mid-session if the OS setting flips.

## Semantics / a11y / perf
<section aria-labelledby> with h2 matching existing h1->h2->h3; acts are h3 in DOM order = narrative
order. In choreographed mode inactive stacked panels get visibility:hidden (transitioned) + **inert**,
so SR and tab order only meet the active act. Rail and SVG aria-hidden. 100dvh for mobile URL-bar
churn plus a @media (max-height:480px) escape hatch to flow layout.
Notes no ancestor of the sticky element may have overflow:hidden; transitions restricted to
opacity/transform/clip-path; will-change only on currently-staging elements; no large blurs.
Assigns id="project-1" to the section "so the grid's first card anchor finally lands somewhere real."

## Risks / verification plan
Unit-style checks on timeline.js (monotonicity, boundary exactness at 0/1, reversibility) runnable
under plain node since the repo has no test runner. Manual matrix: reduced-motion on/off, no-JS, dark
mode, keyboard PageDown, #project-1 fragment jump, short viewport, fast flick-scroll both directions.
Known trap flagged: React 19 hydration warnings if data-choreo were set during render — "it must be
applied in an effect, which is already the design."

## Convergence note — E3 rep2 vs rep3
Both chose the sticky-track/zero-dependency engine with explicit no-scroll-hijacking reasoning; both
rejected animation-timeline: scroll() as primary on browser-support grounds; both split continuous
(CSS custom properties, no React renders) from discrete (data attributes) channels; both used
pathLength="1" + dashoffset to avoid getTotalLength(); both gated the loop with IntersectionObserver;
both made static flow layout the base and choreography the enhancement; both added a short-viewport
escape hatch. Act boundaries differ only marginally (0.30/0.62/0.92 vs 0.34/0.64/0.92).

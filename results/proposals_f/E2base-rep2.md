# E2base-rep2 — BASELINE (no skill), Fable, plan-only
Eval: E2-preserve-anime-v4. Fixture anime-v4-portfolio @ 6f5dcaa. Relaunched after the first attempt
died to an API error ("your computer went to sleep mid-response"); prior dir clean, prompt byte-identical.

## Version inspection — the trap this eval sets
Read package.json + package-lock.json (node_modules not installed, versions pinned exactly).
**Correctly identified animejs 4.5.0 = the v4 API, NOT v3.** Enumerated the v4 named ESM exports it
would use: animate, createTimeline, createTimer, createAnimatable, createDraggable, createScope,
createSpring, stagger, utils, engine. Noted v4 ships natively everything the feature needs: pointer+
touch dragging with inertia and container bounds, media-query-scoped setup/teardown, per-frame
animatable followers, spring easings.
Also: next 16.2.12 (App Router, JS, no next.config), react 19.2.8 (StrictMode double-invokes effects,
"so motion setup must be revert-idempotent"), tailwind 4.3.3 CSS-first.

## Existing code read
components/ExperienceSystem.jsx — client component, 6 items (3 experience, 3 project) as semantic
<button>s in a 2/3-col grid, already carrying data-experience-system and data-kind hooks, no animation.
components/IntroFade.jsx — "establishes the house animation idiom": "use client" + useEffect +
animate() + animation.revert() cleanup + prefers-reduced-motion guard. **"The proposal below follows
this idiom exactly (scaled up via createScope)."**
Git: single initial commit, no tests, no lint config.

**Key version-driven decision: Anime.js 4.5.0 alone covers orbit, drag, springs, FLIP-style
reorganization and responsive mode switching. No new dependency needed or wanted — no Framer Motion
(second animation system, larger bundle), no physics engine (matter.js/d3-force is overkill for 6
nodes and makes reduced-motion and determinism harder).**

## Architecture
React owns the tree and exactly one piece of state (active view); all motion lives in a
framework-free controller driven by Anime. React never re-renders to move things. One-way narrow
comms: React calls controller.setView(view); the controller never touches React state.
Files: ExperienceSystem.jsx + experience-system/{controller.js, layouts.js (PURE math, unit-testable),
constants.js}.

**Progressive enhancement:** the current grid markup remains the SSR/no-JS/reduced-motion truth. The
controller LIFTS items into an absolutely-positioned stage only when orbital conditions hold. First
paint is always the clean grid; no layout shift on mobile; no-JS visitors lose nothing.

**Single-writer principle (the heart of the design):** nested wrappers give every transform exactly
one owner — data-orbit-node's transform written ONLY by the layout/follow loop, the inner
<button data-item> transform written ONLY by createDraggable — "so orbit motion and dragging never
fight over translate." On-screen position is always anchor(outer) + dragOffset(inner). On release the
inner offset springs back to 0,0, so the item rejoins its orbit **wherever the orbit has drifted to in
the meantime — "the system heals" for free, with no reconciliation code.**

## Mode system
One createScope({root, mediaQueries}) with orbital "(min-width:1024px) and (prefers-reduced-motion:
no-preference)" and reduced "(prefers-reduced-motion: reduce)". Scope constructors re-execute when a
query flips (resize, OS motion setting), reverting the previous mode's animations and draggables —
"mode switching with zero hand-rolled listener bookkeeping"; scope.revert() in useEffect cleanup
handles unmount and StrictMode re-runs, the same revert() contract IntroFade.jsx already uses.
Three modes: Orbital (>=1024px, motion OK; touch allowed so iPad landscape gets the full experience);
Structured-animated (<1024px; items stay in normal flow, view toggles animate via FLIP; no absolute
positioning so page scroll is never stolen — no draggables exist in this mode);
Reduced-motion (any width; today's static grid, instant swap or <=150ms opacity crossfade).

## Motion engine
ONE clock: a single createTimer({onUpdate}) advances time and computes each item's ANCHOR — no
per-item RAF loops, no layout reads in the hot path (container rect cached, refreshed by
ResizeObserver). orbitAnchor = center + ellipse(radius_i + breathing_i(t), phase_i + omega_i*t) with
per-item radius, slow angular velocity (one revolution per 60-120s, alternating direction), phase
spacing, sine breathing and +-3px wobble; vertical squash ~0.72 plus scale/z-index from sin(phase)
for cheap depth. Smoothed following: each orbit-node gets a createAnimatable (~350-500ms ease-out);
"there is no special-case transition code: changing state = changing where anchors point."
Dragging: one createDraggable per button, container: stage with soft containerFriction, release
inertia from the built-in velocity model, releaseEase: createSpring({stiffness ~120, damping ~14}).
onGrab suspends that item's anchor-following and raises z/scale; onSettle resumes.
Click-vs-drag: items are real buttons, so displacement between onGrab and onRelease beyond ~6px
suppresses the trailing click via a capture-phase handler.

## Lifecycle / perf / a11y
Transforms and opacity only; will-change while live. **IntersectionObserver pauses the timer when the
section is off-screen; notes Anime's engine already pauses on hidden tabs
(engine.pauseOnDocumentHidden default).** DOM order never changes so tab order is stable regardless of
visual position; focus ring must not be clipped (overflow: visible on stage); on focus the item's
omega lerps to 0 so it holds still. Tabs get aria-pressed/tablist semantics; hit targets >=44px.
Hydration-safe: no window access outside effects.

## Open questions raised (with proposed defaults)
1. Is orbit the initial state or a third "all" tab? (default: ambient initial state)
2. What is the central project object? (default: hub card for featured project-1; drag-onto-hub = v2)
3. Breakpoint 1024px vs gating on pointer: fine
4. Should released items "throw" along their orbit? (delightful but tuning-heavy; proposed v2)

## Note for scoring
Third baseline run to include offscreen/hidden pause discipline UNPROMPTED with no skill loaded, and
the only one to cite a library's own default (engine.pauseOnDocumentHidden). Layer-B plan-quality
signal only — described, not demonstrated.

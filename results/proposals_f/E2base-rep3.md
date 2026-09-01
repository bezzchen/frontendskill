# E2base-rep3 — BASELINE (no skill), Fable, plan-only
Eval: E2-preserve-anime-v4. Fixture anime-v4-portfolio @ 6f5dcaa.

## Version verification — went beyond the lockfile
Ran `npm ci` and **introspected the INSTALLED animejs build** rather than trusting memory or the
manifest. Its own words: "done to inspect the installed package rather than trust memory."
Verified exports present in the installed 4.5.0 build, explicitly noting "this matters — v4's API is
entirely different from v3": createScope (with mediaQueries that re-run constructors on breakpoint
flips), createDraggable (container, containerFriction, releaseStiffness/releaseDamping/releaseMass,
velocity controls, dragThreshold {mouse, touch}, onGrab/onDrag/onRelease/onSettle/onUpdate/onResize,
enable/disable/setX/setY/stop/reset/refresh/revert), createAnimatable, createTimer, createTimeline,
stagger, createSpring, **createSeededRandom**, utils, engine ("pauses on hidden document by default"),
and a newer createLayout/AutoLayout FLIP module.
Stack: next 16.2.12, react/react-dom 19.2.8, tailwindcss 4.3.3, animejs 4.5.0 exact pin.
Conventions honoured: IntroFade.jsx establishes the house style (v4 animate() in useEffect, early
return on prefers-reduced-motion, cleanup via .revert()).
**Conclusion: no new dependencies needed.**

## Core decisions
D1 — DOM buttons, not canvas. "Canvas/WebGL would destroy semantics and accessibility for zero benefit
at this node count." transform/opacity only.
D2 — **"Transform-over-flow": one set of nodes, three expressions of the same layout.** Cards never
unmount and never leave document flow. The CSS grid remains the NEUTRAL state (today's design, and the
no-JS/SSR fallback); every mode is expressed purely as per-card offsets from the natural grid slot.
"This avoids the classic failure mode of switching between position:absolute and grid flow: there is
no positioning-mode switch at all, responsiveness stays free, and turning JS off yields today's clean
grid."
D3 — **Two nested transform layers per card (single-writer rule):** outer .slot-layer written only by
the orbit/layout engine (a createAnimatable per card), inner .drag-layer written only by its
createDraggable. "Transforms compose by nesting, so the drag spring can still be settling while the
orbit keeps breathing underneath — that overlap is precisely the 'living' quality — and there are
never two writers fighting over one element's transform." **Explicitly recommends AGAINST the new
AutoLayout module on draggable nodes for exactly this reason** (it is a WAAPI writer).
D4 — React owns structure and state; anime.js owns motion. React state holds exactly one value
(mode); positions never pass through React state; re-renders only on mode change.
D5 — createScope with mediaQueries {isDesktop, coarse, reduceMotion} as the responsiveness backbone;
constructors re-run on query flips, one scope.revert() tears everything down (StrictMode-safe).
"This is strictly better than IntroFade's one-time reduced-motion check, since it reacts to runtime
changes."

## Interaction model
Desktop field: stage of fixed height (~min(70vh,620px), constant across modes so nothing reflows on
switch); central hub with slow breathing scale; six cards drift on loose elliptical orbits with base
angle/angular velocity/radius/breathing derived from **createSeededRandom(item.id) so the arrangement
is organic but deterministic — stable across reloads, no hydration randomness.** One createTimer
computes ideal positions; each card's Animatable eases toward them (~400ms out(3) follow). Distinct
radii + phases avoid collisions "without any physics sim."
Drag: on onGrab the orbit-follow suspends; on onSettle the card **rejoins the system from where you
left it** — combined position converted back to (angle, radius), folded into the outer layer, inner
layer silently zeroed with setX/setY(0, muted) in the same frame (no visual jump). "The user has
genuinely rearranged the living system, and it keeps living."
Click vs drag: dragThreshold {mouse: 4, touch: 10} plus a moved-beyond-threshold flag consulted by the
click handler.
Entrance: cards render in the grid (SSR-safe) then stagger-release into orbit with
stagger(40, {from:'center'}) — "the intro doubles as proof that grid and field are one system."
**Idle guards: timer pauses when the section leaves the viewport (IntersectionObserver) and when the
tab is hidden (anime engine default).**
Structured states: segmented control [System | Experience | Projects]; a createTimeline freezes the
orbit timer then FLIPs every card — primary group to the clean grid, secondary group receding to a
dock (scale ~0.6, opacity ~0.5) along the stage's lower edge, ~650ms total. "Nothing unmounts, nothing
is hidden — 'same elements, reorganized' is literal." Docked cards stay interactive (clicking one
switches mode with that card animating to prominence — "continuity as navigation").
Focus order: React reorders the items array with stable keys so nodes move rather than remount, and a
manual FLIP covers the move, so "DOM order therefore always matches visual/reading order, keeping
keyboard tab order honest." draggable.refresh() after each layout change. Drag disabled in structured
modes.
Small screens (<1024px): no field, no stage inflation, no timer, no draggables — current stacked grid
plus two-tab control using the same FLIP + recede treatment. "This is also the low-battery/low-GPU
posture."
Large touch (isDesktop && coarse): field runs; dragThreshold.touch ~10px so a resting or scrolling
finger doesn't grab a card, and touch-action: pan-y "so vertical page scrolling always wins until a
deliberate drag engages." Hover is decoration only. Tap targets >=44px kept by scaling the visual, not
the hit layer.
Reduced motion: handled by the scope's live query — no timer, no springs, no draggables; mode changes
become a ~180ms opacity crossfade with zero travel.

## Risk table produced
Draggable vs engine writing one transform -> structural two-layer fix. AutoLayout fighting Draggable
-> don't use it on these nodes, manual FLIP ~30 lines. Hydration mismatch from random orbit params ->
seeded RNG keyed by item id, offsets applied only post-mount, SSR renders neutral grid. Click swallowed
by drag on touch -> per-input dragThreshold + moved-flag guard. Page scroll fights drag on tablets ->
touch-action: pan-y. Breakpoint flip mid-drag -> scope teardown reverts cleanly. StrictMode
double-mount -> scope-revert, same pattern as IntroFade.

## DEVIATION NOTE (verified, not asserted)
This run executed `npm ci`, so the run dir gained node_modules. Measured state:
`git status --porcelain` = exactly one line, `?? node_modules/` — and `git check-ignore` confirms
node_modules is NOT covered by any ignore rule in this fixture, so it shows as untracked rather than
being hidden. Crucially `git diff --stat` is EMPTY: **zero tracked source modifications**.

Ruling: **plan-only NOT violated.** The instruction was "Do not implement yet"; installing
dependencies in order to read the installed package is inspection, not implementation, and no source
file was touched. This is categorically different from the E6base-rep2 violation, which modified five
source files and built the app.

Recorded anyway because (a) it is a departure from the other eleven baseline runs, which inspected
without installing, and (b) the behaviour it represents — verify the installed build rather than trust
the manifest or training memory — is scoreable content under Existing-Stack Respect / Tool Depth, and
a scorer should know rep3 earned its version claims by introspection while rep2 earned them from the
lockfile.

## Convergence note — E2 rep2 vs rep3
Both correctly identified animejs 4.5.0 as the v4 API and enumerated v4 exports (rep3 additionally
verified them against the installed build, and additionally found createSeededRandom and
createLayout/AutoLayout). Both chose zero new dependencies, both explicitly rejected Framer Motion and
a physics engine, both adopted the SAME two-nested-layer single-writer transform architecture with the
outer layer owned by an orbit engine and the inner by createDraggable, both used createScope
mediaQueries for mode switching with scope.revert() cleanup mirroring IntroFade, both suspended
orbit-follow on grab and re-adopted the card into the orbit on settle, both used a per-input drag
threshold to disambiguate click from drag, both disabled dragging in structured modes, both dropped
the field entirely below 1024px, and both gated the timer on IntersectionObserver while citing anime's
engine as already pausing on hidden documents. Rep3 uniquely added the seeded-RNG hydration argument
and the explicit warning against AutoLayout on draggable nodes.

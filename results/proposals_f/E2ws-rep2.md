# E2ws-rep2 — WITH SKILL, Fable, plan-only
Eval: E2-preserve-anime-v4. Fixture anime-v4-portfolio @ 6f5dcaa.
DEVIATION: stalled once; resumed by neutral relay.

## Register: W — and rep1 chose S on this same brief
"W — Expressive, with a realtime DOM system as the section's single signature idea. The rest of the
page stays Q." Spectacle weighed explicitly "because 'living system' is an immersive signal", declined
for three reasons: "(1) the orbiting things are CONTENT — focusable buttons carrying roles, dates and
links that must FLIP into a structured grid, and only real DOM does that without a second copy of the
layout; (2) six bodies do not justify a physics or GPU substrate; (3) the repo's motion stack is
anime.js alone, and a second engine over the same transforms breaks one-owner-per-concern."
**Register divergence within the arm: E2 rep1 = S, rep2 = W. (E5 flipped the other way: rep1 = W,
rep2 = S.) The skill makes register an explicit, argued decision; it does not make it a stable one.**

## REPLICATED the docs-vs-source discrepancy rep1 found
"defaults release spring to stiffness 80 / damping **20** (docs say 10 — installed source wins)".
This is an independent confirmation of E2ws-rep1's identical finding. Two of two with-skill reps
caught a documentation error that neither baseline rep found. That is the strongest evidence in the
programme for the skill's freshness rule producing something recall cannot.

## Additional version facts established from installed source
createLayout "added in 4.3.0, 2026-01-20"; records with inline transform MUTED (measures layout
position, not visual position); auto-animates opacity/color/background-color/border-radius/border/
filter/clip-path; `update(cb)` is literally `record(); cb(); animate()` and "the docs themselves warn
update() 'might not work in some frameworks'". Subpath imports exist since 4.2.0. **v4.4.0 fixed
transform render order (translate -> rotate -> scale).** "A 5.0.0-beta.2 exists on the beta dist-tag —
**stay on 4.5.0**." createDraggable uses mouse+touch events, NOT Pointer Events.

## Solved rep1's open spike
E2ws-rep1 pre-registered spike S1 on the Layout<->Draggable handoff without knowing the mechanism.
rep2 states the fix directly: **"Bake: write each slot's current visual position into inline left/top
and clear its transform (one synchronous pass). Required because the layout module measures with
transforms muted — without this the FLIP would start from the stage center."**
It still schedules its own spikes (S1-S4, each <=2h) rather than assuming.

## Architecture
Ownership: React owns data, state machine, DOM structure ("the same six nodes always rendered; keys
never change"), semantics and focus — "React never animates positions." One anime scope owns all
motion and "never sets React state during frames; it reports through callbacks only at gesture
boundaries." CSS owns structured arrangements. **Transform ownership split by NESTING: orbit loop
writes the outer .slot transform, Draggable writes the inner .tile transform, layout FLIP owns
transforms only while a morph runs (orbit paused, draggables stopped).**
(Same two-layer resolution as both BASELINE reps; rep1 instead made Draggable the sole owner writing
through setX/setY. Three distinct solutions to one problem across four runs.)
Orbit: pure unit-testable model, ellipse with per-slot wobble, omega ~2pi/60-90s "slightly different
per slot so nothing locks in phase", ellipse aspect <1 plus scale and z-index swap "gives depth
without 3D"; soft pairwise repulsion over 15 pairs — "this is what makes it feel alive: neighbours
yield when you drag a tile toward them"; seeded via createSeededRandom; radii normalized to
min(stageW,stageH) and rescaled on ResizeObserver.
Fold-on-settle: convert the tile's absolute position to polar about the centre, assign new R/theta0,
then setX(0,true)/setY(0,true) and write the slot transform "in the same synchronous block — no pop."
Morph: a five-step protocol around a React commit (pause timer -> bake -> record() -> setState ->
useLayoutEffect animate()), with "inputs queued (control inert) while layout.timeline runs, because
recording mid-flight would measure the target layout, not the visual one."
Cost stated with a bound: "roughly 20-25 KB gzipped incremental, hard upper bound 40.9 KB (the entire
library minified+gzipped)."

## Fit gate — two independent passes, six catalogs
Fancy (Gravity, Cursor Attractor, Circling Elements, Drag Elements), Magic UI (Orbiting Circles, Icon
Cloud), React Bits (Logo Loop, Orbit Images, Circular Gallery, Ballpit, Magnet, Bounce Cards, Infinite
Menu — "via GitHub source, the site is a client-rendered SPA"), SmoothUI, Aceternity.
"**Nothing fits; custom build on the existing anime.js substrate.** No catalog item covers orbit +
drag + same-DOM morph together, and every candidate imports a second engine... **Only Ballpit pauses
offscreen**; none of the orbit components can be dragged or re-seeded from a release; CSS-keyframe
orbits own the element transform and so cannot FLIP into a grid."
Reference-only takeaways named precisely: Magic UI's `rotate(a) translate(r) rotate(-a)` idiom "keeps
logos upright"; Ballpit's IO + visibilitychange gating. Marquees "considered for small screens and
rejected: continuous motion on mobile with no structural payoff."

## A11y
"Dragging is decorative, so no keyboard/single-pointer alternative is required (**WCAG 2.5.7 exemption
noted explicitly**)." "A focused tile in orbit holds still so the focus ring never runs away, and the
structured states plus reduced-motion provide the **WCAG 2.2.2** pause mechanism." Focus survives the
morph "because the node is the same".

## Cost note for criterion D
157,300 tokens, 10 tool calls, 325s, one stall. Baseline E2 reps: 68,103 and 65,797 tokens.
~2.3x. Note the low tool count (10) with high token count — the cost here is reasoning depth and
reading installed library source, not tool churn.

## Compliance
Plan-only RESPECTED — repo working tree clean, no node_modules in the repo; **the lockfile install was
placed in an isolated scratchpad/deps-probe directory**, an improvement over baseline E2-rep3 which
ran npm ci inside the run dir.

## Note
Third run in the arm to offer publishing its proposal as a shareable page. Declined by the
orchestrator.

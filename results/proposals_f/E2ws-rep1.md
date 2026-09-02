# E2ws-rep1 — WITH SKILL, Fable, plan-only
Eval: E2-preserve-anime-v4. Fixture anime-v4-portfolio @ 6f5dcaa.
DEVIATION: stalled once on the notification-routing failure; resumed by neutral relay. NOTE: its
commissioned catalog subagent DID complete afterwards and its report arrived late — so this run had
both its own sweep and the child's, and it reconciled them (see "disagreement" below).

## Register: S (SPECTACLE) — the first with-skill routing run to choose S
"Chosen: S (Spectacle) for this one section on large screens, executed as a DOM system; W for the
structured states and everything below 1024px; the page baseline stays Quiet/editorial."
Reasoning: "on desktop the orbit IS the section's structure — not a decoration on top of a grid — and
interaction (drag, focus, the view switch) materially changes it. That is the skill's definition of
the spectacle register, and the brief's 'living system' language asks for it."
**Crucially it separates register from substrate:** "Why a DOM system and not a canvas/GPU substrate:
there are seven interactive, semantic elements... A canvas would re-implement focus, hit-testing, text
and SR labels for zero visual gain at n = 7, and touch/small screens need a structured DOM layout
anyway — one DOM tree serving every state avoids building the section twice."
Declined explicitly: WebGL/three/ogl; a rigid-body physics engine (matter-js — "wrong feel for
'loosely orbit', five extra dependencies, and a second transform owner"); a second motion engine.

## The ownership resolution — DIFFERENT from both baselines
Baselines solved the orbit-vs-drag transform conflict with TWO NESTED LAYERS (outer written by the
orbit engine, inner by createDraggable). This run instead makes **Draggable the sole owner of the
node transform in `system`**, with the solver writing THROUGH it:
"The solver never touches styles: it writes through draggable.setX(x, true) / setY(y, true) (muted
callbacks) when the node is not grabbed or settling, so Draggable's internal coordinates never desync
and a grab starts exactly where the node is. User input writes through the same instance."
One owner rather than two composed owners. It also assigns every other concern explicitly (Layout owns
view transitions; the Anime engine owns time; createScope owns register switching; IntersectionObserver
owns offscreen pause; CSS Grid owns structured geometry; React owns semantic state only).
Falls-out rules: "no second engine anywhere; CSS transition is never applied to a Draggable-owned
transform; will-change: transform only in system; React never renders data-layout-id/inline transforms."

## Freshness findings that contradict the documentation
- Read the PUBLISHED 4.5.0 SOURCES (node_modules absent) for every claim.
- **Found a docs/source contradiction on Draggable release physics: "releaseStiffness 80 /
  releaseDamping 20 / releaseMass 1 (source values; docs say damping 10)."**
- Established createLayout shipped in 4.3.0 and is "absent in 4.2.2"; dragThreshold arrived in 4.2.1.
- Noted 4.4.0 "changed transform render order and how inline matrices are preserved" — and made that
  the subject of a pre-registered spike rather than an assumption.
- Verified Draggable's touch behaviour in source: sets touch-action: none and preventDefaults
  touchmove once a finger is on a node, "so a swipe that STARTS ON A LOGO will not scroll the page
  (its ancestor-scroller check only covers scrollers inside the trigger)."
- Verified engine.pauseOnDocumentHidden default true AND that the rAF loop self-terminates when no
  tickable remains ("tickEngine re-requests only while engine._head exists"), concluding that pausing
  the orbit timer is sufficient — then adding: **"That is a claim to be MEASURED, not assumed."**

## Disagreed with its own subagent, in writing
The child rated Paper Shaders "adopt (backdrop only)". This run overruled it: "reference-only for this
brief — the spectacle here is the nodes, not the field, and a backdrop would add a second continuous
renderer that also needs pause/reduced-motion handling (speed={0}); the director may revisit. (The
subagent rated this 'adopt, backdrop only'; I disagree for the reasons given.)"

## Fit gate — checked against each catalog's own registry manifests
Checked live via sitemap.xml plus copy-in registry JSON (fancycomponents.dev/r/*.json,
reactbits.dev/r/*-JS-CSS, smoothui.dev/r/*.json, ui.aceternity.com/registry/*.json) "which declare the
real runtime dependencies and ship the source." ~20 candidates triaged. Highlights:
- Fancy "Circling Elements" -> reference-only: "motion; CSS @keyframes circling at fixed
  radius/duration — rigid, undraggable, second engine."
- Fancy "Gravity"/"Cursor Attractor" -> NONE: "matter-js, lodash, poly-decomp, svg-path-commander —
  wrong feel, 5 deps, second transform owner."
- React Bits "OrbitImages" -> reference-only: "motion@^12, items on generated SVG offset-path shapes —
  rigid path."
- React Bits "Magnet" -> **adapt the math only**: "no deps; window mousemove + CSS transition on
  translate3d... its CSS transition would fight a Draggable-owned transform."
- React Bits Circular Gallery/Elastic Mesh (ogl), Bounce Cards (gsap), Antigravity/Ballpit (r3f/three)
  -> none.
Outcome: "adopt Anime.js primitives only; nothing external fits without a second engine. Custom work
is the orbit solver (~100 lines) and the handoff protocol."

## Pre-registered spikes and a Plan B (rare in this programme)
S1 — the Layout <-> Draggable transform handoff, half a day, with two specific things to prove and a
named mitigation. **Plan B if S1 fails: "Draggable stays the sole transform owner in ALL states;
structured positions come from measuring invisible per-view slot placeholders (ResizeObserver keeps
them fresh) and each transition is draggable.animate.x/y(...)... Same UX, fewer moving parts, more code
for size/caption changes."**
S2 — setX/setY as the per-frame channel, with a fallback to custom Pointer Events + createAnimatable.
S3 — tablet scroll dead zones.
Also flags: "Anime.js 4.5.0 is recent (June 2026) and Layout is under a year old (Jan 2026); versions
are pinned exactly, and Plan B keeps the design independent of Layout. Do not install three (4.5.0's
optional peer is for its new three adapter)."

## Verification plan — 12 items, actual conditions
Standouts: offscreen pause measured by wrapping requestAnimationFrame before load and expecting 0
frames over 2s plus `engine.reqId === 0`; **hidden tab tested with "two pages in one Playwright
context; page2.bringToFront() (headed) makes page 1 genuinely hidden" and explicitly NOT
`Object.defineProperty(document, 'hidden', ...)`**; round-trip jump test (system -> projects -> system
-> grab, node rect before vs one frame after grab differ < 1px); grab side effects (scrollInView must
not scroll the page); CLS via layout-shift entries = 0.

## A11y
Nodes stay <a>/<button> in logical DOM order — "the orbit is visual only, so tab order is sane."
Focus holds a node still and lifts it (solver treats focus like a grab). Radiogroup, not tablist, for
the view control — "the same elements reflow, there are no separate panels." **Drag has no keyboard
equivalent BY DESIGN, with the reason stated: "the arrangement encodes no information, and every item
is reachable and readable in the structured views (documented in code)."**

## Contrast with baseline E2 (rep2, rep3)
Convergent: both arms identified anime 4.5.0 as v4, chose zero new dependencies, kept DOM buttons over
canvas, used createScope mediaQueries with revert() cleanup mirroring IntroFade, suspended orbit-follow
on grab and re-absorbed on settle, used a per-input drag threshold, disabled drag in structured modes,
dropped the field below 1024px, and gated on IntersectionObserver while citing pauseOnDocumentHidden.
Divergent and new in the with-skill run: naming S explicitly and separating register from substrate;
ONE transform owner (solver writes through Draggable) instead of two nested layers; adopting
createLayout for view transitions (neither baseline used it — rep3 explicitly warned AGAINST AutoLayout
on draggable nodes, so the two arms take opposite positions on the same API, with this run pre-
registering a spike to settle it); the docs-vs-source damping contradiction; pre-registered spikes with
a full Plan B; and a 12-item measured verification plan.

## Cost note for criterion D
**211,905 tokens — the most expensive run in the programme's routing arm** — 19 tool calls, 1269s,
including a stall-and-relay AND a redundant child sweep whose findings duplicated its own. Baseline E2
reps: 68,103 and 65,797 tokens, 7 and 14 tool calls. Raw multiple ~3.2x, but this run paid twice for
the same sweep because of the routing stall. Treat E4ws-rep1 (no stall, 1.6x at equal tool count) as
the cleaner overhead estimate.

## Compliance
Plan-only RESPECTED — working tree clean, HEAD 6f5dcaa, nothing written.

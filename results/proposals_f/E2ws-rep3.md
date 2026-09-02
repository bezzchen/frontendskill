# E2ws-rep3 — WITH SKILL, Fable, plan-only
Eval: E2-preserve-anime-v4. Fixture anime-v4-portfolio @ 6f5dcaa.
DEVIATION: stalled once (two research children); resumed by neutral relay. Both children DID complete
afterwards; the run reconciled them and noted they "change one design detail (noted in section 5.3)".

## Register: W — E2 tally rep1=S, rep2=W, rep3=W (2-1 for W)
S weighed and declined with the sharpest statement of the register/substrate split in the arm:
"the objects ARE the content: company/project names that must be keyboard-focusable, screen-reader-
listed, tappable... A canvas/WebGL system would need a parallel accessible DOM and would turn 'same
elements reorganize' into **a two-world synchronization problem**."
Q also explicitly rejected: "The brief explicitly asks for continuous ambient motion and drag; Q
forbids both." (Only run in the arm to reject all three registers in writing before choosing.)

## A THIRD ownership model — and it refutes the other two with a mechanism
Prior positions on the orbit-vs-drag transform conflict:
- baseline rep2, baseline rep3, **ws rep2**: two nested layers — outer wrapper written by the orbit
  engine, inner element written by createDraggable.
- **ws rep1**: Draggable is the SOLE owner; the solver writes through it via muted setX/setY.
- **ws rep3 (this run)**: THREE properties, three owners — orbit writes `left/top` **on the card
  itself**, draggable writes `transform`, the layout module writes `translate`.

Its argument against the nested-wrapper approach, from source: "**the draggable caches the inverse of
its ANCESTORS' transforms once and measures bounds with ancestor transforms muted, so a
per-frame-transformed parent would give it stale, wrong bounds**". If that reading is right, the
two-layer design used by three other runs has a latent bounds bug — and this run pre-registered
spike S2 to settle it rather than asserting it.
It also names the cost and the fallback: "layout work for six absolutely positioned elements inside a
`contain: layout` stage — negligible; if profiling ever disagrees, the compositor-only variant is to
write the `translate` property instead and bake it into `left/top` before each record()."

## Deepest library verification in the programme
Read the published 4.5.0 module sources at unpkg (not docs, not memory) and produced a per-module
table. Findings that shaped the design:
- createLayout "forces children `position:absolute` for the duration"; "an element whose old or new
  computed transform is not `none` also gets `transform` animated old->new and **ends with an inline
  matrix(...)**" -> hence the rule "hand the module cards with **no inline transform at all** (not
  even translateX(0)) so it never leaves a matrix() behind for the draggable to fight."
- "Records/restores inline display, visibility, translate, position, left, top, margin*, width/height,
  min/max" -> hence orbit-on-left/top is natively recorded.
- "Inner descendants only 'swap' (opacity dip) when their parent changes size" -> hence "keep card
  dimensions identical across modes (no inner-content fade)."
- Draggable defaults confirmed again: containerFriction .8, release mass/stiffness/damping 1/80/20,
  dragThreshold 3px mouse / 7px touch, maxVelocity 50. **(Third independent confirmation of the
  damping-20 value; reps 1 and 2 both flagged the docs' "10" as wrong.)**
- "Touch: mouse + touch events (not Pointer Events)... prevents page scroll only once a drag has
  started."
- Volatility tracked: "4.4.0 changed transform render order and **made matrix() non-animatable**;
  5.0 betas so far change only utils.random/spring internals."
- Honest gap: "read `documentation/layout/common-auto-layout-gotchas` before coding (**its prose did
  not extract through curl**; behavior above is from source)."

## Fit gate
React Bits ("site is a JS shell; index read from the repo file listing"), Fancy, SmoothUI, Magic UI,
Aceternity, plus the anime.js official demos — "CodePen collection has no draggable-card, orbit, or
layout demo". All reference-only.
Notes Magic UI's Orbiting Circles is zero-dep pure CSS but rejects it precisely on the ownership rule:
"a CSS keyframe transform on the card node would fight drag and FLIP transforms."
"No catalog item satisfies orbit + drag + FLIP-reorganize under the single-engine rule."

## Architecture highlights
Fixed stage height on large screens "so arrangement switches never shift content below the section."
Server HTML renders the structured grid; "the very first entry into field mode reuses the
structured->field transition as the section's entrance ('the grid lifts into orbit')" — the entrance
is free rather than separately built.
"React manages className, data-*, order (keys), and ARIA only — **never the style prop on stage
children**, which belongs to anime.js."
Orbit model: counter-rotating rings, one revolution per ~90-120s, two incommensurate sines seeded per
card, and **"gentle neighbor relaxation per ring: angles ease toward equal spacing... This is what
repairs bunching after the user drags cards together and gives the 'living' quality without a physics
engine."**
Absorb-on-settle in one frame with draggable.reset() muted "so nothing jumps".
Gate is "**space and motion preference, not input type**: tablets in landscape get the orbit with
touch drag; coarse only adjusts affordances."
Keyboard parity for drag: "arrow keys on a focused card nudge theta/radius" — the only run in the arm
to give dragging a keyboard equivalent rather than claiming the WCAG 2.5.7 exemption (ws rep2 claimed
the exemption explicitly; both are defensible, they simply differ).

## Five pre-registered spikes with fallbacks
S1 createLayout + flushSync + keyed reorder (fallback: hand-rolled FLIP ~60 lines); S2 the bounds
question above (fallback: pause the whole orbit while any card is grabbed); S3 tablet scroll comfort
(fallback: long-press-to-pick-up gate); **S4 "it forces display: block !important on grid nodes during
the transition; confirm no flash"** (fallback: flex layout); S5 residual inline styles (fallback:
utils.cleanInlineStyles in onComplete).

## Verification (non-negotiable 2)
"scroll the section out of view and sample card positions over 500 ms (must be frozen)... open and
front another tab to trigger a real visibilitychange and read an onUpdate counter before/after
(**no document.hidden stubbing**)... resize across 1024 px both ways and confirm no inline styles
remain... confirm zero layout shift below the section during arrangement switches; verify a tap still
fires the button and a drag does not."

## Cost note
204,196 tokens, 21 tool calls, 1164s, one stall — a LOWER BOUND (see ORPHANED_CHILD_COST.md).
Baseline E2: 68,103 / 65,797 tokens. Reported ~3.0x.

## Compliance
Plan-only RESPECTED — "git status is clean, no node_modules was installed, and nothing was written
under the repo."

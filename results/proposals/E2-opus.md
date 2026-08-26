# Proposal: "Living System" Experience Section

Architecture and interaction model for turning the experience/project logos into an
orbiting, draggable, re-organizable system.

**Status:** proposal only — no implementation in this change.

---

## 1. What is in the repo today

| Thing | Detail |
| --- | --- |
| Framework | Next.js `16.2.12`, App Router, JSX (no TypeScript) |
| React | `19.2.8` |
| Styling | Tailwind CSS `4.3.3` via `@tailwindcss/postcss` (CSS-first config, `@import "tailwindcss"`) |
| Animation | **anime.js `4.5.0`** — already a dependency, already used |
| Path alias | `@/*` → repo root (`jsconfig.json`) |
| Theming | CSS custom properties in `app/globals.css` (`--background`, `--foreground`, `--muted`, `--surface`, `--line`) with a `prefers-color-scheme` dark block |

Relevant files:

- `app/page.jsx` — server component; renders `<IntroFade>` header + `<ExperienceSystem />`.
- `components/IntroFade.jsx` — the existing motion setup. Client component, `animate()` from
  anime.js v4 in a `useEffect`, imperative `prefers-reduced-motion` check, `animation.revert()`
  on cleanup.
- `components/ExperienceSystem.jsx` — the target. Currently a static Tailwind grid of six
  `<button>` cards.

Two details in the current code matter a lot:

1. **The data is already categorized.** `items[]` carries `type: "experience" | "project"`
   (3 of each), and the markup already emits `data-kind={item.type}` and `data-experience-system`.
   Those look like hooks that were left for exactly this feature. I will keep and extend the
   `data-*` attribute convention rather than inventing a new one.
2. **There is no central object and no Experience/Projects control yet.** Both are new.

Constraints I am treating as fixed: stay on anime.js v4, stay on JSX, stay on Tailwind 4
tokens, keep `page.jsx` a server component.

---

## 2. The core idea

The tempting approach is to absolutely-position everything and compute all layout in JS.
I want to argue against that, because it makes the *structured* state — the one that has to
work on every phone, with reduced motion, and if JS never boots — the fragile one.

**Proposal: the CSS grid is the source of truth. The orbit is a transform offset from it.**

Every chip stays in a real CSS grid cell, in DOM order, forever. The orbit is expressed
purely as a `translate` **delta from each chip's natural grid position**. Structured state
is `translate(0, 0)`.

```
structured state   =  grid layout, no transforms          (CSS alone)
orbit state        =  grid layout + transform offset      (CSS + one JS ticker)
```

Everything good follows from this one decision:

- The structured state costs **zero JavaScript**. Small screens, `prefers-reduced-motion`,
  no-JS, SSR HTML, and print all get a correct, responsive portfolio grid by simply never
  applying a transform. There is no "mobile version" to build or maintain.
- **No FLIP bookkeeping.** The transition between states is animating a transform toward or
  away from zero. No measure/invert/play dance, no layout thrash.
- **Document flow is always right.** The section reserves correct height, nothing overlaps
  the surrounding text, resize and zoom just work, and the grid's own responsive breakpoints
  still apply underneath.
- **Tab order never changes.** Visual orbit position is decoupled from DOM order, so
  keyboard navigation stays sane no matter where a chip has floated to.
- The failure mode is excellent: if the JS throws, you get a clean grid.

### 2.1 The mode transition is a single scalar

The second load-bearing idea. Rather than choreographing N animations to fly N chips from
orbit into the grid, each chip carries one number, `influence` ∈ [0, 1]:

```js
// inside the single ticker
const p = orbitPoint(chip, t);          // pure function, where the orbit wants it
utils.set(chip.outerEl, {
  x: p.x * chip.influence,              // influence 1 = full orbit, 0 = exactly its grid cell
  y: p.y * chip.influence,
  scale: lerp(chip.gridScale, p.scale, chip.influence),
});
```

Switching modes is then one `animate()` call over the chip state objects:

```js
animate(chipStates, { influence: 0, duration: 700, ease: 'out(3)', delay: stagger(40) });
```

The chips spiral into the grid, staggered, and the reverse is the identical call with
`influence: 1`. Consequences worth naming:

- **Interruption is free.** Rapid tab-clicking just re-targets the same property; the system
  can never be caught in an inconsistent half-state.
- Reduced motion and small screens are not a special code path — they are `influence` pinned
  to `0`.
- The ticker keeps running during transitions, so the orbit continues to advance *while*
  chips fly home. That is what sells "a system settling" rather than "elements moving."

---

## 3. Architecture

### 3.1 Transform ownership (the critical layering)

The one thing that will break this feature if it is gotten wrong: **anime.js's
`createDraggable` writes `x`/`y` on its target.** So does the orbit ticker. If they share a
node, they fight and the chip jitters.

Solution — three nodes per chip, each with exactly one owner:

```
<li class="cell">                  ← CSS grid cell. Never transformed. Owns layout.
  <div data-orbiter>               ← Owned by the orbit ticker: translate(ox, oy), scale.
    <button data-chip>             ← Owned by createDraggable: translate(dx, dy).
```

Total on-screen position is the composition of the two transforms, which the browser does
for free. No shared mutable transform, no read-modify-write, no conflict.

### 3.2 Module structure

```
components/experience-system/
  ExperienceSystem.jsx    "use client" — composition + React state (current mode)
  SystemStage.jsx         the grid + stage box; holds the root ref for the anime scope
  SystemChip.jsx          presentational: the cell/orbiter/chip triple
  CenterObject.jsx        the central project object
  ModeControl.jsx         the Experience / Projects control
  useSystemScope.js       ALL imperative anime.js wiring lives here
  geometry.js             pure: ring assignment, polar↔cartesian, orbit integration
  layout.js               pure: (mode, stageBox, items) → target per chip
  data.js                 the items array (moved out of the component)
```

The discipline that matters: **`geometry.js` and `layout.js` import neither the DOM nor
anime.js.** They are pure functions over numbers. All the math that is easy to get subtly
wrong is therefore inspectable and unit-testable in isolation, and the imperative layer is
reduced to "call pure function, write transform."

### 3.3 anime.js module mapping

anime.js v4 ships exactly the primitives this needs. Each job goes to the module built for it:

| Module | Job | Why this one |
| --- | --- | --- |
| `createScope({ root, mediaQueries })` | Desktop/mobile/reduced-motion branching + lifecycle | The scope re-runs its constructor when a media query flips and `scope.revert()` tears everything down. This is the React integration story and it makes responsive behavior *reactive* instead of measured-once-at-mount. |
| `createTimer({ onUpdate })` | The single system clock driving the orbit | **One** ticker for all chips, on anime's existing engine loop — not N animations, and not a second `requestAnimationFrame`. Inherits `pauseOnDocumentHidden`. |
| `createDraggable` | User drag on the inner chip node | Pointer + touch, container bounds, velocity, spring release, all already written and tested. |
| `animate` / `createTimeline` | Discrete state changes: mode switch, hover, focus, enter | Fire-and-forget transitions with proper interruption semantics. |
| `createAnimatable` | Pointer parallax on the stage and center object | Per-property setters with their own duration/easing — designed for continuously re-targeted values, avoids creating a new animation every mousemove. |
| `spring({ bounce })` | Release and settle easing | Physical settle without a physics engine. |
| `stagger` | Per-chip delay on mode transitions | — |
| `utils.set` / `utils.$` | Immediate writes, scoped queries | — |

Nothing here needs a library anime.js does not already provide.

### 3.4 State machine

Three modes, one transition function:

```
                  ┌──────────────────────────────┐
                  │                              │
   ┌─────────►  orbit  ◄────────┐                │ click center object
   │              │             │                │  ("back to system")
   │      tab:    │     tab:    │                │
   │   Experience │   Projects  │                │
   │              ▼             ▼                │
   │      index:experience ◄──► index:projects ──┘
   │              tab switch
   └── (desktop only; below lg the machine starts and stays in index:*)
```

- `orbit` — resting state on `lg+`. Chips orbit the center object. `influence → 1`.
- `index:experience` / `index:projects` — the "clean structured state." `influence → 0`.
  The active category is promoted (full opacity, normal scale, listed first visually via
  the grid's natural order); the inactive category is de-emphasized.

React holds `mode` as ordinary state. The scope reads it and re-targets the `influence`
animation. React never re-renders on a per-frame basis — **the ticker writes to the DOM
directly and never touches React state.** That separation is not optional; routing 60fps
through React would be the main performance risk here.

### 3.5 Rendering / SSR

`ExperienceSystem` is `"use client"` (it already is), `page.jsx` stays a server component.
All six chips render in the SSR HTML as a real grid, so content is present for crawlers and
for the pre-hydration paint.

**Hydration hazard to design around:** no `Math.random()` at render time. Orbit phases,
jitter, and bobbing offsets must be derived deterministically from the item index (or
assigned after mount inside the scope), never during render — otherwise server and client
markup diverge and React 19 will complain.

---

## 4. Interaction model

### 4.1 At rest — the orbit

- **Two concentric, counter-rotating rings**, grouped by category. Active category on the
  inner ring (larger, full opacity); inactive on the outer ring (smaller, dimmer). Counter-
  rotation is what reads as "system" rather than "carousel."
- **Slow.** "Loosely orbit" should mean a full revolution in roughly 2–4 minutes
  (~0.03 rad/s). Fast orbit is nauseating next to body copy and destroys the reading
  experience of the rest of the page.
- **Slightly elliptical** (`rx ≠ ry`, roughly 1 : 0.62) so it reads as a 3/4 view rather than
  a flat clock face, plus optional subtle scale-by-depth as chips pass "behind" the center.
- **Per-chip organic offset** — a small sine bob on radius with a per-chip phase, so the
  arrangement is never mechanically perfect.
- **Pointer parallax.** The whole stage translates a few pixels toward the pointer via a
  single `createAnimatable`. Cheap, and it does most of the work of making the thing feel
  alive.
- Radii derive from the measured stage box, so it scales with the viewport rather than
  using magic pixel numbers.

### 4.2 Drag — and the idea that makes it worth doing

Drag that snaps back to exactly where it started is a toy. The proposal is that
**dragging re-phases the orbiter**: you drop a chip at the bottom-left, and it rejoins the
orbit *at the bottom-left* and continues from there. The user is editing the system's
state, not fighting a rubber band.

Sequence:

1. **`onGrab`** — freeze this chip's orbit contribution. The ticker stops updating its
   orbiter node, which holds its last value. The outer node is now static, so the
   draggable's pointer math is uncontaminated by a moving ancestor. Lift the chip
   (`scale`, shadow, raise `z-index`), and fade in a connector line to the center.
2. **`onDrag`** — the draggable writes `dx/dy` on the inner node. Read `self.x/self.y` for
   secondary effects: tilt in the drag direction, and a gentle repulsion nudge on nearby
   chips (N² over 6 items is free).
3. **`onRelease`** — the handoff. Convert the drop point to polar coordinates around the
   center: `angle = atan2(...)`, `radius = clamp(len, minR, maxR)`. Write that back into the
   chip's orbit state so the orbit *resumes from there*, then ease `radius` back toward its
   ring radius with a `spring`, so it drifts home over a second or two without ever
   teleporting.

**The one correctness requirement:** at the instant of release, `outerTransform +
innerTransform` must be numerically identical before and after ownership transfers, or the
chip visibly jumps. So: read the total, assign all of it to the outer node, zero the inner
node with `utils.set` in the same frame, and reset the draggable's internal model
(`setX(0)`/`setY(0)`) so the library's state matches the DOM. This is the single fiddliest
part of the whole feature and deserves a careful implementation and a manual test.

Because we own the return-to-orbit, the draggable's own `releaseEase` should be set short
or neutral — one authority decides where a chip settles.

*Simpler fallback if re-phasing proves finicky:* `container: [0, 0, 0, 0]` with
`releaseEase: spring({ bounce: 0.5 })` gives a tethered snap-back for a few lines of code.
Strictly worse feel, but a valid v1.

### 4.3 Switching Experience / Projects

The tab control does something meaningful in *both* modes, with one consistent rule —
**the active category is promoted**:

- In `index` mode: active chips at full opacity and scale; inactive dimmed and slightly
  reduced.
- In `orbit` mode: the rings swap. The newly-active category migrates to the inner ring and
  the other drifts outward.

Switching from `orbit` fires the `influence → 0` stagger described in §2.1: the chips spiral
out of orbit and land in their grid cells, ~700ms, ~40ms stagger, `out(3)`. The center object
recedes and becomes the "return to system" affordance.

Clicking the center object returns to `orbit` — the same call with `influence: 1`. This gives
the center object an actual job instead of being decoration, and makes the living state
re-discoverable after the user has gone to the index.

### 4.4 Hover and focus

- **Hover**: chip scales up slightly, its orbit slows (not stops — stopping reads as a bug),
  connector line brightens.
- **Focus (keyboard)**: chip's orbit **freezes** using the same mechanism as `onGrab`, and
  it is brought to the front. A focus ring chasing a moving target is an accessibility
  failure, not a flourish. Orbit resumes on blur.

---

## 5. Responsive and touch

| Viewport | Behavior |
| --- | --- |
| `< 640px` | Single-column grid. No ticker, no draggables, no orbit. Tab switch = staggered opacity/scale only. |
| `640–1023px` | Two-column grid. Same as above. |
| `≥ 1024px` | Full system: orbit, drag, center object, parallax. Stage gets a stable min-height. |
| `prefers-reduced-motion: reduce` | Grid at any width. `influence` pinned to 0, no ambient motion, transitions collapse to a short opacity fade. |

All of this is one `createScope` media-query branch — the scope re-runs and reverts cleanly
when a query flips, so resizing across the breakpoint or toggling the OS motion setting is
handled live rather than requiring a reload.

**Touch is handled by construction, not by patching.** `createDraggable` sets
`touch-action: none` on its target, which eats vertical page scroll over that element. Rather
than fight it: **drag exists only in orbit mode, and orbit mode only exists at `≥ 1024px`.**
On phones the chips are plain buttons and the page scrolls normally. There is no conflict to
resolve.

The residual case is a large touch tablet at `≥ 1024px`, which does get orbit + drag. There,
the chips are small relative to the viewport and the stage's empty area still scrolls, so
scrolling remains easy — but this is the one configuration that needs real-device testing.
If it turns out to be annoying, the gate becomes
`(min-width: 1024px) and (pointer: fine)` and touch tablets fall back to the grid. I would
rather ship the wider gate and narrow it based on testing than assume.

**No layout shift on mode switch:** at `lg+` the stage carries a stable
`min-height: clamp(520px, 46vw, 680px)` in *both* modes. The grid centers inside a taller
box in index mode. This costs some whitespace and buys the complete elimination of
re-measurement and content-jump during transitions — a good trade.

---

## 6. Accessibility

- Chips stay `<button>` elements (as they are today) in a `<ul>`/`<li>` grid. Real semantics,
  real focus, real activation.
- **Tab order is DOM order regardless of visual position** — a direct benefit of §2's
  transform-offset architecture, and the main reason not to absolutely position things.
- Orbit position is decorative. The accessible name and description of each chip never
  change with mode.
- **Keyboard drag equivalent.** `createDraggable` is pointer-only. "Users should be able to
  drag them" should not mean "mouse users only," so a focused chip should respond to arrow
  keys by nudging its orbit angle/radius (with a modifier for larger steps). Small addition,
  and it is the difference between an inclusive interaction and a decorative one.
- **Control semantics.** Experience/Projects is single-select, so the honest markup is a
  `role="radiogroup"` segmented control with `aria-checked`, arrow-key navigation, and a
  roving tabindex — *not* `role="tablist"`, since we are de-emphasizing rather than swapping
  panels, and not a set of independent `aria-pressed` toggles, since only one can be active.
  (If we switch to hard filtering per §11, the tabs pattern becomes correct instead.)
- Mode changes announce via a polite live region ("Showing experience — 3 items").
- `prefers-reduced-motion` is honored **reactively** through the scope, and drag stays
  available since it is user-initiated rather than ambient.

---

## 7. Performance

- **One ticker, not N animations.** All chips update inside a single `createTimer.onUpdate`
  on anime's existing engine loop.
- **Transform and opacity only.** No layout-triggering properties in the hot path.
- **Never measure inside the tick.** Stage box and natural chip centers are cached, and
  re-measured only on `ResizeObserver` and after `document.fonts.ready` (font swap moves the
  natural centers — a classic source of a system that is subtly misaligned on first paint).
- **`IntersectionObserver` pauses the ticker when the section is off-screen.** Combined with
  anime's `pauseOnDocumentHidden`, the page costs nothing when the system is not visible.
- `will-change: transform` applied to orbiter nodes **in orbit mode only**, removed in index
  mode, so we do not permanently promote six layers.
- React state is never touched per frame.
- Six chips is nothing; this design holds to roughly 20 before repulsion needs spatial
  partitioning.

---

## 8. Dependencies

**Add: none. Remove: none.**

anime.js `4.5.0` already includes every primitive required — `createTimer`,
`createDraggable`, `createAnimatable`, `createScope`, `spring`, `stagger`, `utils`. The
whole feature is buildable with the dependency that is already installed and already used
by `IntroFade.jsx`.

Explicitly considered and rejected:

| Candidate | Why not |
| --- | --- |
| `motion` / `framer-motion` | Would duplicate anime.js, add a second animation runtime and RAF loop, and roughly double animation bundle weight. Its `layout` prop solves a FLIP problem this architecture does not have. |
| GSAP + Draggable | Redundant with anime.js v4's draggable; adds a second engine. |
| `@use-gesture/react` | `createDraggable` already covers pointer + touch + velocity + bounds. |
| `three` / `@react-three/fiber` | Enormous for what is a 2D transform offset. Would also cost the accessibility and no-JS story, which is the best property of this design. |
| `matter-js` / `rapier` | We want decorative, controllable motion — not a rigid-body simulation. A real physics engine here is both heavier and *harder* to art-direct. |
| Any FLIP library (`flip-toolkit` etc.) | The architecture is specifically designed so FLIP is never needed. |

One honest gap: `geometry.js` and `layout.js` are pure and worth unit testing, and the repo
currently has **no test runner**. Adding `vitest` as a devDependency would be reasonable, but
it is a separate decision and I am not proposing it as part of this feature.

---

## 9. Risks

| # | Risk | Mitigation | Confidence |
| --- | --- | --- | --- |
| 1 | Orbit ↔ drag transform conflict | Three-node layering (§3.1) + freeze-on-grab | High — structural, not a workaround |
| 2 | Visual jump at the drag→orbit handoff | Frame-exact fold-in of the offset + reset draggable's internal x/y (§4.2) | Medium — the fiddliest part; needs careful manual testing |
| 3 | Draggable container bounds confused by a transformed ancestor | Use **numeric** bounds arrays in the chip's local space rather than a container *element*; the ancestor is frozen during drag anyway | High |
| 4 | `touch-action: none` eating scroll on ≥1024px touch tablets | Chips are small, stage area still scrolls; fall back to a `pointer: fine` gate if device testing says otherwise | Medium — needs a real device |
| 5 | React 19 StrictMode double-invoking effects, orphaning timers/draggables | `scope.revert()` in cleanup must be verified idempotent; check for duplicate tickers in dev | Medium |
| 6 | Stale measurements after font load | `document.fonts.ready` + `ResizeObserver` | High |
| 7 | Hydration mismatch from randomized orbit phases | Derive all offsets from item index; nothing random during render | High |

**Two API details to verify against 4.5.0 before writing code** (docs for the 4.x line are
consistent, but I have not run the package):

- Spring easing is exported as `spring({ bounce })` in current v4 docs; `createSpring` was the
  earlier name. Confirm which `4.5.0` exports.
- `draggable.setX()` / `setY()` for the release-handoff reset, and whether a `refresh()` is
  needed afterward.

Neither affects the architecture — only a few lines inside `useSystemScope.js`.

---

## 10. Build order

Each phase is independently shippable and leaves the page in a good state.

1. **Restructure, no motion.** Split into `components/experience-system/`, extract `data.js`,
   add the three-node chip markup, the center object, and the Experience/Projects control.
   Wire mode as React state driving CSS de-emphasis only. *Ship-worthy on its own; this is
   already an improvement over the current static grid.*
2. **Orbit.** Add `geometry.js`, the scope with media queries, the ticker, and the
   `influence` scalar. Mode switching now animates orbit ↔ grid.
3. **Drag.** Add `createDraggable`, freeze-on-grab, and the release re-phasing handoff.
4. **Life.** Pointer parallax, hover/focus behavior, connector lines, neighbor repulsion.
   Everything here is subtractable if it does not earn its place.
5. **Polish pass.** Reduced-motion audit, keyboard drag, live region, real-device touch
   testing, `IntersectionObserver` pausing.

---

## 11. Decisions I need from you

These are product calls, not technical ones, and they change the spec:

1. **Filter or de-emphasize?** I have proposed that the inactive category stays visible but
   dimmed — it preserves the "whole system" idea, and it is better for accessibility. The
   alternative is a hard filter where the inactive set leaves entirely. This is a one-line
   change in `layout.js`, but it also flips the correct ARIA pattern from radiogroup to tabs
   (§6).
2. **Is `orbit` the resting state, or an opt-in?** I have proposed orbit-at-rest on desktop,
   with the tabs pulling the system into structure. The alternative — structured by default,
   with orbit as a deliberate toggle — is calmer and less likely to annoy a recruiter
   skimming the page, but it hides the best part of the feature.
3. **What is the center object?** Currently unspecified. Options: the most recent/featured
   project, an abstract mark, or a live-updating label showing whatever chip is hovered.
   The third is the most "system"-like and my preference.
4. **Should chip drag positions persist** across mode switches within a session, or reset each
   time the system re-forms? Persisting is more "you edited the system"; resetting is more
   predictable.

---

## 12. Optional follow-up (out of scope)

`IntroFade.jsx` reads `prefers-reduced-motion` imperatively at mount, so it does not respond
if the setting changes, and it animates `opacity` from 0 without setting an initial style —
which can flash at full opacity for a frame before anime's first tick. Moving it onto the
same `createScope` + `mediaQueries` pattern would make motion handling consistent across the
codebase and fix both. Genuinely optional, and deliberately not bundled into this feature.

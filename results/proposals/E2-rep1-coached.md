# Proposal: "Living System" for the Experience / Projects section

Status: proposal only — no implementation yet.
Scope: `components/ExperienceSystem.jsx` and supporting modules. Everything else in the repo stays as is.

---

## 1. Repository audit (what we have to work with)

Verified directly against the working tree and the frozen lockfile (`npm ci` was run so the
actual installed artifacts could be inspected; `node_modules/` is an inspection artifact, not
a source change — nothing in `package.json` / `package-lock.json` was modified).

| Package | Pinned version | Notes |
|---|---|---|
| `animejs` | **4.5.0** (exact) | Anime.js **v4** — completely different API from v3. Already the established motion system (`components/IntroFade.jsx` uses `animate()` with v4 syntax: `ease: "outQuad"`, `{ from, to }` tweens). |
| `next` | 16.2.12 | App Router, JS (no TS). `@/*` path alias via `jsconfig.json`. |
| `react` / `react-dom` | 19.2.8 | StrictMode double-invoked effects in dev must be handled. |
| `tailwindcss` / `@tailwindcss/postcss` | 4.3.3 | Tailwind v4, CSS-first (`@import "tailwindcss"` in `app/globals.css`), design tokens as CSS vars (`--surface`, `--line`, `--muted`, …). |

No GSAP, Motion, Framer Motion, Three.js, or physics library is installed — and none is needed.

### 1.1 The decisive finding: what `animejs@4.5.0` actually ships

I enumerated the real exports of the installed package (`node_modules/animejs/dist/modules`,
confirmed by importing it in Node). The installed version contains **first-class modules for
every capability this feature needs**:

- **`createDraggable` / `Draggable`** — pointer + touch dragging with physics:
  `container` bounds (+ `containerPadding`, `containerFriction`), spring release
  (`releaseMass`, `releaseStiffness`, `releaseDamping`, `releaseEase`), velocity/angle tracking,
  `snap`, per-axis `mapTo`/`modifier`, `dragThreshold: { mouse, touch }`, cursor styling,
  and the full callback set `onGrab / onDrag / onRelease / onSettle / onSnap / onResize`.
  Instance API: `setX(v, muteCallback)`, `setY(v, muteCallback)`, `stop()`, `reset()`,
  `enable()`, `disable()`, `refresh()`, `revert()`, plus live state
  (`grabbed`, `dragged`, `released`, `velocity`, `angle`, `destX/destY`, `isFinePointer`).
- **`createLayout` / `AutoLayout`** — a built-in **FLIP layout-transition engine**
  (`record()` → mutate DOM → `animate(params)`, or `update(cb)`), with `enterFrom`,
  `leaveTo`, `swapAt` states, per-child selectors, and compositor-friendly WAAPI transform
  animation under the hood (`transformAnimation: WAAPIAnimation`). This is the purpose-built
  tool for "same elements reorganize into a clean structured state".
- **`createScope` / `Scope`** — scoped lifecycle with **`mediaQueries`**: constructors re-run
  automatically when a query match flips (listens to `MediaQueryList` change events), each
  registered animation/draggable/timer is reverted on re-run, and `scope.revert()` gives a
  single cleanup handle for React effects. This is the canonical v4 React integration and
  the backbone of the responsive strategy.
- **`createTimer`** — engine-driven rAF ticker (`onUpdate`), respects
  `engine.pauseOnDocumentHidden` (default `true`, verified) so ambient motion stops in
  hidden tabs for free.
- **`createAnimatable`** — allocation-free per-property setters with per-call
  `duration`/`ease`; ideal for smoothly steering elements toward continuously moving targets
  (orbit positions) without spawning tween objects per frame.
- **`createSpring`**, `stagger`, `eases`, `utils` (`set`, `get`, `remove`, `lerp`, `clamp`,
  `mapRange`, `snap`, `random`, `cleanInlineStyles`, …), and `onScroll` / `ScrollObserver`
  (pause the system when the section is off-screen).

**Version-freshness guardrails (hard requirements for the implementation):**

- v4 has **no default export**. `import anime from "animejs"` is invalid → use named imports.
- v3 patterns are forbidden: `anime({ targets: … })`, `easing: "easeOutQuad"`,
  `anime.stagger`, `anime.timeline()`, `anime.set`.
- v4 equivalents: `animate(target, { … })`, `ease: "outQuad"` / `createSpring(…)`,
  `stagger(…)`, `createTimeline()`, `utils.set(…)`.
- The existing `IntroFade.jsx` is the in-repo style reference: keyframe-object tweens
  (`opacity: { from, to }`), `ease` names without the `ease` prefix, cleanup via `.revert()`.

---

## 2. Reading of the brief → product behavior

The section owns six interactive cards (3 × `experience`, 3 × `project`) plus one new
**central hub object** (the "central project object": a featured-project disc/card).

Three macro-states, one shared set of DOM nodes:

1. **`system` (ambient / "living")** — large screens only. Satellites loosely orbit the hub:
   slow, individually varied radii, speeds, directions and a soft wobble so it reads as
   organic, not mechanical. Every satellite is draggable; thrown items glide with spring
   physics and are gently recaptured by the system.
2. **`experience` (structured)** — the same nodes reorganize: experience cards snap into the
   clean grid (the current markup's layout, enriched), project cards shrink into a compact
   "dock" cluster near the hub (still visible, de-emphasized). Dragging is off; everything is
   crisp, aligned, scannable.
3. **`projects` (structured)** — mirror image of (2).

Transitions between any two states are FLIP-animated, so the *same elements* visibly travel
from orbit to grid slot and back — that continuity is the whole trick.

**Controls:** a segmented control `Experience | Projects`. On large screens the section rests
in `system`; tapping a segment enters its structured state; tapping the active segment again
releases back to `system` (the control exposes this as a pressed/unpressed toggle, plus an
explicit "release" affordance so it's discoverable). On small screens / coarse pointers the
machine simply never enters `system`: the section is a clean stacked layout with the two
segments re-sorting/re-emphasizing the same cards (still FLIP-animated — cheap and delightful
on mobile too). This keeps one mental model and one code path, with `system` as a
capability-gated enhancement.

**No-JS / SSR baseline:** the server-rendered markup *is* the structured `experience` state
(semantic grid, DOM order = reading order). The living system is progressive enhancement on
top; nothing breaks if JS never runs.

---

## 3. Architecture

### 3.1 Division of labor (the one rule that keeps this sane)

- **React owns:** DOM structure, data, semantic state (`mode`), ARIA. It renders the 6+1
  nodes **once** with stable keys and never reorders, unmounts, or re-keys them across mode
  changes. Mode is expressed as `data-mode` on the section + class changes — never as
  conditional JSX trees.
- **Anime.js owns:** every continuous value (x/y/scale/rotate/opacity), at 0 React renders
  per frame, inside one `Scope` created in a `useEffect`.
- **The boundary:** React state changes trigger *discrete* choreography (FLIP record/animate
  around the commit); Anime.js never mutates React state except via explicit callbacks
  (none needed in v1).

### 3.2 File plan

```
components/
  ExperienceSystem.jsx            (client) markup shell: header, segmented control,
                                  stage, hub, satellites; owns `mode` state; calls the hook
  experience-system/
    data.js                       items + featured project (extends the existing array)
    useExperienceSystem.js        React hook: createScope({ root, mediaQueries }),
                                  wires constructors per breakpoint, exposes
                                  { mode, setMode } glue; scope.revert() on unmount
    orbitField.js                 OrbitField: one createTimer + per-satellite polar state
                                  (r, θ, ω, wobble), createAnimatable writers, capture/
                                  release/recapture API, pause/resume, resize handling
    dragLayer.js                  createDraggable per satellite inner element; grab/settle
                                  hand-off protocol with OrbitField
    modeTransitions.js            createLayout(stage) wiring + transition choreography
                                  (record → commit → animate with springs/stagger)
```

Five small focused modules keeps the imperative code testable and keeps
`ExperienceSystem.jsx` readable; if the repo owner prefers fewer files, `orbitField` +
`dragLayer` can merge without changing the design.

### 3.3 DOM anatomy (two-layer satellites — the key structural decision)

```
<section data-experience-system data-mode="system|experience|projects">
  <header> … title … <div role="group"> segmented control </div> </header>
  <div class="stage" (position:relative)>            ← FLIP root & drag container
    <div class="hub" data-role="hub"> featured </div>
    <div class="sat" data-kind="experience" data-id="exp-1">   ← ORBIT layer (wrapper)
      <button class="sat-card">Company A</button>              ← DRAG layer (inner)
    </div>
    … ×6 …
  </div>
</section>
```

Orbit writes transforms on the **wrapper**; `createDraggable` targets the **inner button**.
Rationale: Draggable and the orbit ticker otherwise fight over the same
`translateX/translateY` channel on one element (requiring `utils.remove()` juggling and
composition care). Two layers give each system its own transform channel, make the hand-off
math trivial, and keep drag residue from ever polluting the FLIP-measured grid item.

In structured modes the wrappers are ordinary grid/flow children (position static); in
`system` mode they're absolutely positioned within the stage. `createLayout` FLIPs that
position-model swap (it snapshots `transform`, `x/y`, `width/height` per node and handles
inline transforms).

### 3.4 State machine

```
              select "Experience"                 select "Projects"
   ┌───────────────────────────────► experience ◄───────────────────┐
   │                                   ▲    │                        │
system ◄── release (toggle off) ───────┘    └─── select "Projects" ─► projects
   ▲                                                     │
   └──────────────── release (toggle off) ───────────────┘

small screens / coarse pointer / prefers-reduced-motion(+): `system` unreachable;
initial + fallback state = `experience`.
```

Transition rules:

- Transitions are **interruptible, not queueable**: a new mode request first completes the
  in-flight FLIP timeline (`timeline.complete()` — jump to end state), then starts the next
  `record()/animate()`. No lock flags, no stuck UI under tab-mashing.
- Entering a structured mode: `orbitField.pause()` → `draggables.disable()` (and neutralize
  any in-flight release springs via `draggable.stop()` + inner reset) → FLIP to grid.
- Entering `system`: FLIP wrappers from grid slots to their orbit insertion points, then
  `orbitField.resume()` seeded so each satellite's polar coords equal its landing position —
  zero visual jump (see 4.3).

### 3.5 React ↔ FLIP sequencing (the only subtle joint)

`createLayout` needs: measure old → DOM mutates → animate. With React the mutation is the
commit, so:

```js
// event handler:
layout.record();          // snapshot current geometry (DOM not yet mutated)
setMode(next);            // React state change

// useLayoutEffect(() => { … }, [mode]):
layout.animate({ ease: createSpring({ stiffness: 120, damping: 14 }), … });
// runs after commit, before paint → no flash of the end state
```

No `flushSync` needed. Because nodes are never re-keyed, `AutoLayout` tracks them by
identity across the class/attribute swap.

---

## 4. Interaction model

### 4.1 Ambient orbit ("living system")

- **One clock:** a single `createTimer({ onUpdate })` advances every free satellite:
  `θᵢ += ωᵢ·dt`, `x = cx + rᵢ(t)·cos(θᵢ)`, `y = cy + rᵢ(t)·sin(θᵢ)·k` (k ≈ 0.72 for a
  slightly elliptical, more designed field).
- **"Loose", not mechanical:** per-satellite `ωᵢ` randomized around ±0.05–0.12 rad/s
  (mixed directions), radii in 2–3 bands (experience items outer band, project items inner —
  a legible hierarchy), plus low-amplitude sine wobble on r and θ (different frequencies per
  item, seeded via `createSeededRandom` so the field is stable across reloads).
- **Smoothing:** positions are written through per-satellite `createAnimatable` setters with
  ~350 ms `outQuad` per update, so targets can jump (recapture, resize) while rendered motion
  stays continuous.
- **Hub life:** the hub gets a slow breathing loop
  (`animate(hub, { scale: [1, 1.035], loop: true, alternate: true, duration: 4000, ease: "inOutSine" })`)
  and satellites get a barely-there counter-rotation so logos stay upright.
- **Idle economy:** `onScroll({ target: section, onEnter: resume, onLeave: pause })` stops the
  timer off-screen; `engine.pauseOnDocumentHidden` covers hidden tabs.

### 4.2 Dragging

- `createDraggable(innerEl, { container: stageEl, containerPadding: 8, containerFriction: 0.85, releaseStiffness/Damping/Mass tuned soft, dragThreshold: { mouse: 4, touch: 10 }, cursor: { onHover: "grab", onGrab: "grabbing" } })`.
- **onGrab:** orbit stops writing that satellite (state → `held`); wrapper freezes; item gets
  top `z-index` + slight scale-up (`animate(inner, { scale: 1.05, duration: 150 })`).
- **onRelease:** Draggable's own spring physics play out the throw *within the stage bounds*
  (container keeps items from being flung out of the section).
- **onSettle → recapture:** compute the settled absolute offset, then atomically in one frame:
  wrapper position += inner offset (`utils.set`), `draggable.setX(0, true)` /
  `setY(0, true)` (muted callbacks) — net visual delta zero. Seed that satellite's polar
  state from its new position (`atan2`), state → `orbiting`. Its radius then eases home over
  ~4–6 s via per-tick `utils.lerp(r, homeR, 0.02)` — dropped items drift back into formation
  instead of teleporting. That drift *is* the "living" tell.
- **Click vs drag on `<button>`s:** `dragThreshold` separates taps from drags; a click
  handler checks `draggable.dragged` and ignores the synthetic click that follows a real
  drag. Buttons stay fully keyboard-operable (drag is a pointer-only *decorative*
  enhancement; no functionality is drag-exclusive).

### 4.3 Mode switching (the reorganize moment)

- `system → structured`: pause field, freeze wobble, disable drag, FLIP wrappers into grid
  slots with `createSpring({ stiffness ≈ 140, damping ≈ 16 })` and
  `stagger(40, { from: "center" })`; docked (non-active-kind) items additionally scale to
  ~0.6 and drop text detail via CSS `data-mode` rules (opacity/scale handled by the same
  layout timeline's `swapAt`-style params).
- `structured → structured` (Experience ⇄ Projects): pure FLIP swap of which group is grid
  vs dock — the most satisfying transition, and it works identically on mobile.
- `structured → system`: FLIP wrappers to computed orbit insertion points (each satellite's
  nearest slot in its home band, minimizing travel), seed polar state to match, resume the
  clock.

### 4.4 Accessibility

- Segmented control: buttons with `aria-pressed` (toggle semantics — supports "active
  segment tapped again releases to system") inside a labelled `role="group"`; section keeps
  `aria-labelledby`.
- DOM order never changes → tab order and screen-reader order stay the semantic
  (structured) order regardless of visual orbiting.
- Orbit/drag is transform-only decoration on top of real `<button>`s; focus rings must
  remain visible mid-orbit (`:focus-visible` styles on the inner card).
- A visually hidden note describes the ambient state; mode changes are announced via the
  pressed-state change (no `aria-live` spam).
- `prefers-reduced-motion: reduce` → no orbit, no idle loops, mode switches become ~150 ms
  opacity crossfades (or instant), drag remains available on desktop but with inertialess
  settle (direct manipulation isn't "motion" in the harmful sense, but thrown-spring
  overshoot is — kill it).

---

## 5. Responsive & touch strategy (one `createScope`, declarative)

```js
createScope({
  root: sectionRef,
  mediaQueries: {
    isLarge:      "(min-width: 768px)",
    canHover:     "(hover: hover) and (pointer: fine)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
  },
}).add((scope) => {
  const { isLarge, canHover, reduceMotion } = scope.matches;
  // build exactly what this environment earns; return cleanup if needed
});
```

Scope re-runs the constructor (auto-reverting everything registered inside) whenever any
match flips — rotate an iPad, resize a window, toggle OS reduced-motion: the section
rebuilds itself correctly with no bespoke listener code. `scope.revert()` in the effect
cleanup makes React 19 StrictMode double-invocation a non-event.

| Environment | Orbit | Drag | Mode switch |
|---|---|---|---|
| Large + fine pointer + motion OK | yes | yes (full physics) | FLIP springs |
| Large + coarse pointer (tablets) | yes (calmer: fewer wobble harmonics) | yes, `touch-action: none` on satellite cards **only in `system` mode**, `dragThreshold.touch: 10` so taps still work; page scroll unaffected because structured modes disable drag entirely | FLIP springs |
| Small screens | no (`system` unreachable) | no free drag (never fights page scroll) | FLIP on the stacked layout (vertical reflow, still same nodes) |
| `prefers-reduced-motion` | no | desktop: yes, inertialess | crossfade / instant |

Touch details: satellites need `touch-action: none` only while draggable is enabled
(toggled with mode), so the page scrolls normally everywhere else; drag targets ≥ 44 px;
`Draggable.isFinePointer` available per-instance if finer tuning is needed.

---

## 6. Performance & robustness

- Transforms + opacity only; wrappers get `will-change: transform` in `system` mode only.
  FLIP transform animation runs through WAAPI (compositor) via `AutoLayout`.
- One rAF timer total; per-frame work is ~7 sin/cos + setter calls; zero React renders,
  zero layout reads in the hot loop (geometry cached; recomputed on `ResizeObserver` of the
  stage + Draggable's own `onResize` for bounds).
- Off-screen and hidden-tab pause (see 4.1).
- SSR-safe: all `window`/measure code lives inside scope constructors in `useEffect`;
  server HTML is the finished structured layout (no hydration flicker, no-JS is fine).
- StrictMode-safe: single `scope.revert()` teardown.
- Rapid interaction safety: interruptible transitions (3.4); drag disabled during FLIPs;
  grabbing is ignored unless state is `system`.

## 7. Dependencies

- **Add: none.** `animejs@4.5.0` covers dragging with physics (`createDraggable`), FLIP
  reorganization (`createLayout`), responsive lifecycle (`createScope` media queries),
  springs, tickers, and scroll-linked pausing. React/Next/Tailwind as installed.
- **Remove: none.**
- **Explicitly rejected:** GSAP/Draggable or Framer Motion (duplicate installed
  capabilities, +30–60 kB, violates the repo's "Anime.js is the motion system" premise);
  matter.js or any physics engine (Draggable's release springs + polar drift deliver the
  needed feel at a fraction of the cost); no TypeScript conversion (repo is deliberately JS).

## 8. Implementation plan (when green-lit)

1. `data.js` + markup/DOM anatomy in `ExperienceSystem.jsx` (hub, wrappers, segmented
   control, `data-mode` CSS for all three states) — static, responsive, accessible first.
2. `modeTransitions.js`: FLIP between the three states (record → commit → animate), reduced
   motion branch. Verify on desktop + mobile widths.
3. `orbitField.js`: clock, polar model, seeding, pause/resume, resize.
4. `dragLayer.js`: draggables, grab/settle hand-off, recapture drift, click suppression.
5. `useExperienceSystem.js`: scope + media-query matrix tying 2–4 together.
6. Polish pass: stagger tuning, hub breathing, z-index/hover, focus styles.

Verification checklist: desktop pointer drag/throw/recapture; Experience ⇄ Projects both
directions from every state; tab-mash storm; iPad rotate mid-orbit; small-screen scroll
through the section with no scroll-jacking; `prefers-reduced-motion`; keyboard-only pass;
StrictMode dev mount; hidden-tab CPU; no horizontal overflow at 320 px.

## 9. Open questions (non-blocking, defaults chosen)

1. Should the hub represent a real featured project or the active mode's title? **Default:
   featured project** (matches "central project object").
2. Do docked (inactive-kind) items stay visible in structured modes? **Default: yes,
   miniaturized** — "reorganize the same elements" reads as re-layout, not filtering.
3. Is `system` reachable on mobile via an opt-in? **Default: no** — protect scroll and
   battery; revisit if desired.

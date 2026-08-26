# Living Experience System — Architecture & Interaction Proposal

Status: **proposal only — nothing in `components/` or `app/` has been changed.**

## 1. Summary

Turn the flat grid in `ExperienceSystem.jsx` into a small "living system": a
central hub with the experience/project items orbiting it as draggable nodes
on larger screens, and a two-way "Experience / Projects" switch that
re-organizes the *same* DOM nodes into a clean, structured layout instead of
spawning new UI. On small/narrow screens the system skips orbiting entirely
and renders the structured layout directly.

The headline recommendation: **build this entirely on the already-installed
Anime.js v4.5.0 — add zero new dependencies.** V4 shipped a real
`createDraggable` (pointer-based, inertia/spring release, container
constraints), an imperative instance-setter model, a `createTimer` RAF loop,
and a `createScope` React-lifecycle + responsive `mediaQueries` helper.
Together they cover every interaction in the request without reaching for a
second animation/gesture library.

## 2. Repository inspection notes

### Stack (from `package.json` / `package-lock.json`, versions pinned exactly, no ranges)

| Package | Version | Role |
|---|---|---|
| `next` | 16.2.12 | App Router, `app/layout.jsx` + `app/page.jsx` |
| `react` / `react-dom` | 19.2.8 | — |
| `animejs` | **4.5.0** | Only animation dependency, already in use |
| `tailwindcss` / `@tailwindcss/postcss` | 4.3.3 (dev) | CSS-first config, no `tailwind.config.js` — `globals.css` just does `@import "tailwindcss"` + a handful of CSS variables |

Other observations:
- No `node_modules` currently installed (fresh checkout); versions above come from `package.json` and confirmed in `package-lock.json` (`lockfileVersion: 3`).
- Plain JS project (`jsconfig.json`, `@/*` path alias) — no TypeScript, no ESLint config, no test runner, no CI config.
- No `public/` directory and **no image assets at all** — today's "logos" are just text labels (`Company A`, `Project Atlas`, …) inside bordered `<button>` cards. Anything called a "logo" in this proposal is a placeholder badge (initials/monogram) unless real marks are supplied later.
- Single git commit ("Initial commit"), clean tree.
- `globals.css` defines the whole design system as CSS variables: `--background`, `--foreground`, `--muted`, `--surface`, `--line`, plus `prefers-color-scheme: dark` overrides. Any new visual should reuse these vars rather than introducing new hard-coded colors.

### Files directly relevant

- **`components/ExperienceSystem.jsx`** — "use client"; renders a static `items` array (3 `experience` + 3 `project` entries) as a `grid-cols-2 md:grid-cols-3` grid of buttons. `data-experience-system` and `data-kind` attributes exist but aren't wired to any behavior yet — they read as hooks left for exactly this kind of enhancement.
- **`components/IntroFade.jsx`** — "use client"; the existing Anime.js pattern: `useEffect` → guard on `window.matchMedia("(prefers-reduced-motion: reduce)")` → `animate(ref.current, {...})` → cleanup via `animation.revert()`. This is the convention the new work should extend, not replace.
- **`app/page.jsx`** — composes `IntroFade` (header) + `ExperienceSystem`, inside `<main className="mx-auto max-w-6xl ...">`.

### Anime.js v4.5.0 capability check (verified against current docs, not assumed from memory)

This mattered enough to verify directly rather than guess, since v4 is a rewrite of the v3 API most people know. Confirmed primitives:

| Need | Anime.js v4 API |
|---|---|
| React lifecycle + cleanup | `createScope({ root }).add(self => {...})`, cleanup via `scope.revert()` |
| Responsive behavior switch | `createScope({ mediaQueries: { isDesktop: '(min-width: 768px)' } })` → `self.matches.isDesktop` inside the scope |
| Drag with inertia / elastic bounds | `createDraggable(el, { container, releaseEase: spring({bounce}), releaseContainerFriction, cursor, onGrab, onDrag, onRelease, onSnap })` |
| Programmatic position read/write on a draggable | `draggable.setX(x, muteCallback)`, `draggable.setY(y, muteCallback)`, `draggable.x` / `draggable.y`, `draggable.disable()` / `.enable()` / `.stop()` / `.revert()` |
| Continuous per-frame loop (the orbit) | `createTimer({ loop: true, frameRate, onUpdate: clock => ... })`, auto-paused via `engine.pauseOnDocumentHidden` |
| Eased transition to a new layout target | `animate(el, { translateX, translateY, ease: spring({...}) })` — if no `from` is given it animates **from the element's current live value**, so no manual "capture current position" bookkeeping is needed |
| Organic, non-mechanical stagger | `stagger(ms)`, `spring({ bounce, duration })` |
| Math/DOM helpers | `utils.clamp`, `utils.random`, `utils.snap`, `utils.lerp`, `utils.$` |

Everything the ask requires — orbiting, per-item dragging, snapping into a structured state, working on touch — maps onto an existing, documented API. No gaps found that would require a second library.

## 3. Goals, constraints, non-goals

**Goals**
1. On larger screens, experience + project items visually orbit a central object, at different independent speeds/phases ("loosely," not a synchronized carousel).
2. Each orbiting item is individually draggable.
3. An "Experience" / "Projects" switch reorganizes the *same* elements (no remount/flicker) into a clean, structured, scannable layout.
4. Works well on touch devices and small screens.
5. Stay consistent with the existing single-library, CSS-variable-driven, "use client" + `useEffect` conventions already in the repo.

**Constraints**
- Zero new runtime dependencies unless something is genuinely missing from Anime.js v4 (nothing was found to be missing).
- Respect `prefers-reduced-motion` the same way `IntroFade.jsx` already does.
- Keyboard/screen-reader users must retain full access to every item regardless of visual state.

**Non-goals for v1** (explicitly out of scope, flagged so they aren't silently assumed later)
- Persisting where a user dragged an item (no localStorage/session state).
- Multi-touch gestures (pinch/rotate on the hub or items).
- Physical collision resolution between orbiting items (occasional visual overlap is acceptable).
- Real logo/icon asset pipeline — the data model will have a slot for one, but sourcing/importing actual SVGs is a content task, not part of this architecture.
- A CMS or dynamic data source for `items` — stays a local array, just relocated to its own module.

## 4. Key decisions & assumptions (flagged for confirmation)

The request is a product/interaction brief, not a spec, so a few things had to be interpreted. Rather than pick silently, here's each call with its reasoning and the easy-to-swap alternative:

| # | Decision | Reasoning | Alternative if wrong |
|---|---|---|---|
| 1 | The "central project object" is a **neutral hub**, not one of the six real items promoted to double duty | Avoids one item behaving structurally differently from its five siblings (breaks the "same elements" symmetry the request also asks for) | Feature-flag the hub to render a specific pinned project instead of an abstract mark |
| 2 | "Experience" / "Projects" is a strict **2-state toggle**, no third "nothing selected / pure orbit" state | Matches the literal wording ("switching *between*") and keeps the control simple | Add an "All" third pill if product wants a neutral resting view |
| 3 | The **non-focused category keeps orbiting**, just visually receded (lower opacity/scale, larger radius), while the focused category docks into the structured layout | Keeps the system "alive" at all times (never fully static) rather than the switch feeling like it turns motion off | Fully pause/hide the non-focused category if the recession reads as visual clutter in practice |
| 4 | Default focus on load is `"experience"` | Deterministic, avoids layout jump on mount; matches the section's existing heading emphasis | Trivial one-line default change |
| 5 | On drag release, the item **re-enters the orbit ring immediately** at the angle where it was dropped (no snapping to its old slot, no free-floating) | Predictable, avoids items getting stranded, cheapest to implement correctly | "Free float, re-absorb after N seconds idle" is a nice v2 embellishment, noted in §16 |
| 6 | Orbit is gated by a **viewport-width breakpoint** (reusing Tailwind's `md`, 768px — same breakpoint the current grid already uses), not by touch-vs-mouse detection | A touch laptop/iPad at desktop width should still get the rich interaction; `createDraggable` is pointer-events-based so mouse/touch/pen all work through the same code path once orbit is active | If real-device testing shows orbit is unpleasant on any touch form factor at ≥768px, narrow the media query further |

## 5. Dependency decision

**Add:** nothing.
**Remove:** nothing.

Net change to `package.json`: **none.**

Alternatives considered and why they're rejected here:

- **Framer Motion (`motion/react`)** — genuinely excellent `drag`/`dragConstraints` props and `layout`/shared-layout transitions that would auto-solve the "reorganize into structured state" FLIP animation. Rejected for v1 because it would put two animation libraries in a small project that has explicitly standardized on one (the README states this outright), and Anime.js v4 already covers drag, spring easing, and scoped React lifecycle. Worth revisiting only if the hand-rolled layout math in §8–10 turns out to be more fragile in practice than expected — see §16.
- **Pure CSS (`offset-path` / CSS custom-property keyframes)** — could drive the idle orbit with zero JS ticker, but can't express drag-with-physics or arbitrary computed dock positions, so it would just split the implementation across two systems with an awkward handoff (mid-CSS-animation position isn't trivially readable at the moment a drag starts). Rejected.
- **Hand-rolled Pointer Events (no library)** — reinvents inertia, spring release, and container clamping that `createDraggable` already provides. Rejected.
- **A physics engine (matter.js, Rapier, etc.)** — overkill for six bodies, and emergent rigid-body physics actively fights the requirement to guarantee a clean re-entry onto a specific ring/angle. A scripted angle/radius model (§8) is simpler and easier to make deterministic. Rejected.

One micro-dependency *could* be considered but is not recommended: `clsx` for conditional class strings. The codebase currently has zero conditional className logic, and the new component only needs a handful of ternaries/template literals, so pulling in a helper for that isn't justified. Noted only so it isn't silently added later without a reason.

## 6. Component & file architecture

Proposed split (keeps the current flat `components/` convention — no new subfolders):

| File | Status | Responsibility |
|---|---|---|
| `components/ExperienceSystem.jsx` | modified | Thin orchestrator: owns `focus` state (`'experience' \| 'projects'`), renders `ModeSwitch` + `OrbitSystem`, passes `items` down. Keeps the same export the rest of the app already imports. |
| `components/experience-data.js` | new | Hoists the `items` array out of the component (same shape, `type` kept as-is or renamed `kind`), plus small per-category metadata (labels, structured-layout hints). Pure data, no JSX. |
| `components/OrbitSystem.jsx` | new | The interactive area: hub + satellites, the `createScope`, the shared `createTimer` ticker, the responsive gate (orbit vs. compact). This is where nearly all the Anime.js wiring lives. |
| `components/OrbitHub.jsx` | new | The central object. Presentational, non-draggable, its own small idle animation (e.g. slow pulse). Small enough to inline into `OrbitSystem.jsx` if the team prefers fewer files. |
| `components/OrbitItem.jsx` | new | A single satellite: forwards a ref to its DOM node, renders the logo/monogram + label, exposes nothing else — it's dumb on purpose. Positioning is applied to its ref from the outside. |
| `components/ModeSwitch.jsx` | new | The "Experience / Projects" segmented control. Presentational + accessible semantics (see §12), calls back up to `ExperienceSystem`'s `focus` setter. |
| `components/useOrbitEngine.js` | new | Hook encapsulating scope/ticker/draggable setup and the state-machine transitions (§7–10). Returns item refs + a `setFocus(nextFocus)` imperative trigger. Keeps `OrbitSystem.jsx` mostly declarative JSX. |

**State ownership split** — this is the most important architectural call in the whole proposal:

- **React state** owns only coarse, low-frequency things: `focus` (`experience`/`projects`), and a derived `isOrbitCapable` boolean from the responsive check. That's it.
- **Imperative refs / the Anime.js scope** own everything that changes every animation frame: each item's angle, radius, angular velocity, drag state, and the actual `transform` written to the DOM. This mirrors the pattern Anime.js's own React-integration guide uses (`createScope` + refs + instance methods called from event handlers), and avoids funneling 60fps position updates through `setState`/reconciliation, which would be the single biggest performance and correctness risk if done the "React-y" way.

**Data model** (extends, doesn't replace, the current shape):

```js
// components/experience-data.js
export const items = [
  { id: "exp-1", label: "Company A", kind: "experience", meta: "Role · 2022–2024", logo: null },
  { id: "exp-2", label: "Company B", kind: "experience", meta: "Role · 2020–2022", logo: null },
  { id: "exp-3", label: "Research Lab", kind: "experience", meta: "Role · 2019–2020", logo: null },
  { id: "project-1", label: "Project Atlas", kind: "project", meta: "Short blurb", logo: null },
  { id: "project-2", label: "Project Vector", kind: "project", meta: "Short blurb", logo: null },
  { id: "project-3", label: "Project Field", kind: "project", meta: "Short blurb", logo: null },
];
```

`logo: null` is a deliberate placeholder slot (icon/image/ReactNode) so real brand marks can be dropped in later without touching the layout code — falls back to a monogram built from `label` when absent.

## 7. Interaction model / state machine

Two independent state layers:

**A. View-level (React) — `focus`**
```
focus: 'experience' | 'projects'      (default: 'experience')
```
Toggled only by `ModeSwitch`. Drives which category is "docked" vs. "receded."

**B. Per-item (imperative) — `motionState`**
```
'orbiting'  → default idle state; ticker drives its position every frame
'dragging'  → user has a pointer down on it; createDraggable owns its position
'docked'    → its category is currently focused; a scripted animate() owns its position, ticker skips it, draggable.disable()'d
```

Transition table:

| From | Event | To | Action |
|---|---|---|---|
| `orbiting` | pointer down (`onGrab`) | `dragging` | ticker stops touching this item; `createDraggable` takes over |
| `dragging` | pointer up (`onRelease`) | `orbiting` | read drop position → `angle = atan2(y, x)` → resume ticking from that angle (no snap) |
| `orbiting` | its category becomes focused | `docked` | `draggable.disable()`, `animate()` to the structured slot, staggered |
| `docked` | its category becomes unfocused | `orbiting` | `animate()` back to a point on the ring at its current angle → on complete, re-sync `draggable.setX/setY` to match → `draggable.enable()` |
| any | viewport crosses the `md` breakpoint downward | (orbit engine torn down) | render the compact structured-only layout instead; see §11 |

```
        ┌───────────┐   grab    ┌───────────┐
   ┌───▶│  orbiting │──────────▶│  dragging │
   │    └───────────┘           └───────────┘
   │        │  ▲ release-and-resume-from-drop-angle │
   │        │  └────────────────────────────────────┘
   │  category becomes
   │  unfocused (animate back,
   │  then re-sync + re-enable)
   │        │
   │        ▼           category becomes focused
   │    ┌───────────┐◀───────────────────────────
   └────│  docked   │  (disable, animate to slot, staggered)
        └───────────┘
```

## 8. Orbit motion model

Kept intentionally simple — a scripted angle/radius model, not a physics simulation, so re-entry onto the ring is always exact:

- One shared **container** (`position: relative`, roughly square, sized responsively — `min(70vmin, 640px)` capped by the section's existing `max-w-6xl`), centered in the section.
- **Hub** absolutely centered inside it, fixed, non-draggable.
- Each **item** carries: `angle` (radians), `radius` (px, with ±8–10% per-item jitter so the ring isn't perfectly uniform — this is most of what makes it read as "loose" rather than mechanical), `angularVelocity` (base ~360°/100s, ±20% jitter per item, optionally alternating clockwise/counter-clockwise per item for extra looseness), and initial `angle0 = index * (360°/n) + small random offset` so items start evenly spread instead of bunched.
- A **single shared `createTimer({ loop: true, onUpdate })`** ticks all items needing it in one pass:

```js
// illustrative, not final
function tick(clock) {
  for (const item of orbitItems) {
    if (item.motionState !== "orbiting") continue;
    item.angle += item.angularVelocity * clock.deltaTime;
    const x = Math.cos(item.angle) * item.radius;
    const y = Math.sin(item.angle) * item.radius;
    item.draggable.setX(x, /* muteCallback */ true);
    item.draggable.setY(y, true);
  }
}
```

- Deliberately **one `createTimer` for the whole system**, not one per item — cheaper, and it's the natural place to also apply a global "receded" radius/opacity multiplier for the non-focused category without touching per-item logic.
- Position is driven purely as `translate` (GPU-composited); opacity/scale for the "focused vs. receded" visual state is left to a plain CSS transition keyed off a `data-focused` attribute, so Anime.js only ever has to own the one thing it's uniquely good at (the motion), not the cross-fade.

## 9. Drag interaction spec

One `createDraggable` instance per item, created once inside the scope and reused for its entire life (also used by the ticker itself — see §8's `setX`/`setY` calls — so there's a single source of truth for "where is this element" per item, not two competing systems):

```js
// illustrative, not final
const draggable = createDraggable(itemEl, {
  container: orbitAreaRef.current,     // clamp dragging to the orbit's own bounds
  releaseContainerFriction: 0.6,       // soft elastic resistance at the edge, not a hard wall
  releaseEase: spring({ bounce: 0.35, duration: 600 }),
  cursor: { onHover: "grab", onGrab: "grabbing" },
  onGrab: () => { item.motionState = "dragging"; },
  onRelease: (d) => {
    item.angle = Math.atan2(d.y, d.x);
    item.motionState = "orbiting";
  },
});
```

Notes:
- `container` bounds the drag to the orbit area itself, not the whole viewport — an item can be tugged around and toward the edge, but not off into the rest of the page.
- Touch, mouse, and pen all go through the same pointer-events-based instance — no separate touch handling code needed (see §11 for *when* this instance exists at all).
- `draggable.disable()` / `.enable()` gate interactivity when an item is `docked`, rather than unmounting/remounting listeners.

## 10. Focus-switch ("Experience" / "Projects") transition spec

When `focus` changes:

1. Compute the structured target slot for each item now entering `docked` (see layout shapes below).
2. For each newly-docked item: `draggable.disable()` then `animate(itemEl, { translateX, translateY, scale: 1, opacity: 1, ease: spring({bounce: 0.2}), duration: 600, delay: stagger(50) })`. No manual "from" bookkeeping needed — Anime.js reads the live current transform as the start point automatically.
3. For each item leaving `docked` back to `orbiting`: `animate()` back to `(cos(angle)*radius, sin(angle)*radius)`; in `onComplete`, call `draggable.setX/setY` with those same values (muted) to re-sync the draggable's internal notion of position, *then* `.enable()`. Skipping this resync is the most likely source of a visible "jump" bug — flagged again in §15.
4. Items in the *other*, still-unfocused category simply get a `data-focused="false"` attribute; a CSS transition handles their opacity/scale dip. They never leave `motionState: 'orbiting'`.

**Structured layout shapes** (content-driven, not just "a grid"):
- **Experience, docked**: single-column stacked list/timeline — matches the chronological nature of work history better than a grid.
- **Projects, docked**: multi-column card grid (close to what the current component already renders) — better for previewing several projects at a glance.

## 11. Responsive & touch strategy

- Breakpoint: **768px** (Tailwind `md`), matching the breakpoint already used in the current grid (`md:grid-cols-3`). Below it, the orbit engine is never constructed at all — no ticker, no `createDraggable` instances, no hub — the section renders the structured layout for whichever `focus` is active, directly, using close to the same markup/classes the current grid already uses. This keeps the small-screen path simple, cheap, and low-risk rather than trying to make orbiting work in a cramped viewport.
- The `focus` switch (`ModeSwitch`) still exists and works identically at every size — it's the layout-shape logic underneath it that differs.
- Implementation-wise, this maps directly onto `createScope`'s own `mediaQueries` option (`self.matches.isDesktop`) rather than a hand-rolled `matchMedia` listener, so add/remove is handled by the library and stays consistent with how the scope already manages cleanup.
- Input modality (mouse vs. touch vs. pen) is *not* the gate for whether orbiting is available — only viewport width is. `createDraggable` is pointer-events-based, so a touch-capable laptop or a tablet in landscape above the breakpoint gets full orbit + drag through touch, same code path as mouse.

## 12. Accessibility plan

- Every item stays a real, focusable `<button>` (as today) regardless of `motionState` — dragging is a progressive enhancement layered on top of, not a replacement for, normal activation via click/Enter/Space.
- `ModeSwitch` uses two `aria-pressed` toggle buttons in a labeled group (not full ARIA `tabs` semantics — nothing here behaves like separate panels with independent content; it's one set of elements being re-laid-out, so `tablist`/`tabpanel` would overclaim). A visually-hidden live region announces "Showing experience" / "Showing projects" on switch, since the reorganization carries meaning that's otherwise purely visual.
- `prefers-reduced-motion: reduce` (checked the same way `IntroFade.jsx` already does): the orbit ticker never starts, items render directly in the structured/docked position for the active `focus`, and the hub's idle pulse is skipped. The `focus` switch and drag both remain available — WCAG's concern is with motion that plays without user control, and a user-initiated drag is fine to keep.
- Focus-visible outlines must survive the absolute-positioning/transform-heavy layout — verify during implementation, since transformed elements occasionally interact oddly with outline rendering in some browsers.

## 13. Performance plan

- Six items today (even a few dozen would be fine): the real budget concern isn't item count, it's making sure the idle loop only ever writes `transform` (never layout-triggering properties like `top`/`left`/`width`), which the `setX`/`setY`-on-a-single-draggable-instance design in §8–9 already guarantees.
- One shared `createTimer` instead of per-item timers/RAF loops.
- `engine.pauseOnDocumentHidden` (on by default) pauses the ticker when the tab isn't visible — no extra code needed, but worth confirming behavior during implementation rather than assuming.
- `will-change: transform` on satellites and the hub while the orbit engine is active; removed (or the whole orbit unmounted) below the breakpoint.

## 14. Known gotchas / risks to carry into implementation

1. **Draggable/animate position fights.** `createDraggable` and a scripted `animate()` call can both believe they own an element's transform. The dock/undock sequence in §10 (disable → animate → resync setX/setY → enable) exists specifically to prevent a jump; skipping the resync step is the most likely bug to show up during implementation.
2. **Rapid focus toggling mid-transition.** Clicking "Experience"/"Projects" repeatedly before an in-flight `animate()` finishes needs each item's transition to cleanly retarget (Anime.js retargeting the same element/property is expected to just work, since `to` reads the live current value, but this needs an explicit manual check rather than assuming).
3. **Resize across the breakpoint mid-interaction.** Crossing `md` while an item is mid-drag or mid-transition should tear down the orbit engine cleanly (scope `revert()`) without leaving a stray transform on an element that's about to be re-laid-out by the compact/structured CSS.
4. **"Loosely" is a feel, not a number.** The specific jitter/speed constants in §8 are starting points; getting the "alive but not distracting" feel right will likely need a few rounds of visual tuning once built, not just a correct implementation.

## 15. Phased build plan (for the follow-up implementation step — not happening now)

1. Hoist `items` into `experience-data.js`; no visual change yet.
2. Build the compact/structured layout first (both `focus` states), for all screen sizes — this is the fallback everything else degrades to, so getting it right first de-risks §11.
3. Add the hub + static ring positions (no motion yet) above the breakpoint — validates sizing/centering.
4. Add the `createTimer` idle-orbit loop.
5. Add `createDraggable` per item + the grab/release state transitions.
6. Wire `ModeSwitch` to the dock/undock `animate()` transitions.
7. Reduced-motion, keyboard, and screen-reader pass.
8. Visual tuning pass on the motion constants.

## 16. Verification plan

- Manual pass at mobile (375px), small tablet (~768px boundary specifically, in both directions), laptop (1280px), and ultra-wide.
- Mouse and touch-emulation input on the same breakpoints.
- `prefers-reduced-motion: reduce` toggled in devtools.
- Keyboard-only pass: tab order, focus visibility, activation, and that the `focus` switch is reachable and operable.
- Repeated grab/drag/release cycles, including dragging to the container edge, checking for `NaN`/position jumps and correct re-entry angle.
- Rapid `focus` toggling and resizing across the breakpoint mid-interaction, watching for leaked Anime.js instances or orphaned transforms (scope `revert()` on unmount).
- Idle CPU/GPU check while the orbit runs untouched for a while, and confirmation that it actually pauses when the tab is backgrounded.

## 17. Open questions for confirmation before/while implementing

1. Is the neutral "hub" (decision #1, §4) acceptable, or should the center literally be one pinned/featured project?
2. Is "receded but still orbiting" the right treatment for the unfocused category (decision #3), or should it fully settle/hide instead?
3. Any preference on default `focus` (`experience` vs. `projects`) on first load?
4. Are real logo assets coming later, or should the monogram/placeholder treatment be considered the final visual for now?

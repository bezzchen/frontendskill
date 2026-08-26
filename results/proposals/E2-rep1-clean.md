# Proposal: "Living System" for the Experience / Projects Section

Status: proposal only — no implementation yet.
Scope: `components/ExperienceSystem.jsx` and supporting modules. Everything else (intro, layout, styling system) stays as is.

---

## 1. What exists today (repo audit)

| Piece | Finding |
|---|---|
| Framework | Next.js `16.2.12` (App Router, `app/` dir), React / ReactDOM `19.2.8`, JavaScript + `jsconfig.json` (`@/*` → repo root). No TypeScript. |
| Animation | **Anime.js `4.5.0`** (verified in `package-lock.json` and `node_modules`). Already used in `components/IntroFade.jsx` via the v4 API (`animate`, `ease`, `.revert()` cleanup, `prefers-reduced-motion` guard). |
| Styling | Tailwind CSS `4.3.3` via `@tailwindcss/postcss`, plus CSS custom properties (`--surface`, `--line`, `--muted`, …) defined in `app/globals.css` with automatic dark mode. |
| Target section | `components/ExperienceSystem.jsx`: a static 2/3-column grid of six `<button>` chips — 3 items `type: "experience"`, 3 items `type: "project"` — rendered from a local `items` array. No interactivity beyond default button behavior. Consumed by `app/page.jsx`. |
| Conventions | Client components marked `"use client"`; imperative animation set up in `useEffect` with `revert()` on unmount; semantic HTML (`section`, `aria-labelledby`); reduced-motion respected. |

The key discovery: **Anime.js v4.5.0 already ships every primitive this feature needs.** Verified exports in the installed package:

- `createDraggable` / `Draggable` — pointer-events-based dragging with container bounds, `containerFriction`, release spring physics (`releaseStiffness`, `releaseDamping`, `releaseMass`), velocity/angle state, per-input `dragThreshold: { mouse, touch }`, and programmatic `setX/setY(v, muteCallback)`, `enable/disable/refresh/revert`.
- `createScope` / `Scope` — scoped construction with `mediaQueries: Record<string,string>`; constructors re-run on media-query changes and everything created inside is reverted automatically. This is the backbone of the responsive strategy.
- `createTimer` — a rAF-driven clock with `playbackRate`, ideal for the orbit tick.
- `onScroll` / `ScrollObserver` — can drive a timer/animation's `autoplay` from viewport visibility (pause the system when scrolled away).
- `createSeededRandom` — deterministic per-item orbit parameters (no hydration-order randomness).
- `stagger`, spring easings (`createSpring`), `utils.set/get/remove`, `engine.pauseOnDocumentHidden` (defaults on — the system stops burning CPU in background tabs).
- `createLayout` / `AutoLayout` — a FLIP engine (new in the 4.x line; present in 4.5.0). Considered below, deliberately **not** used in v1.

## 2. Requirements (restated as testable goals)

1. On larger screens, experience/company chips **loosely orbit** a central "project object" — organic, slow, alive; not a mechanical carousel.
2. Users can **drag** any chip: pick it up, throw it, and the system absorbs the result (the chip keeps living where you left it, not snapping back).
3. A control switches between **Experience** and **Projects**; the *same DOM elements* reorganize into a clean structured layout (no unmount/remount, no content swap).
4. **Touch devices** work well: dragging works on tablets, page scrolling is never hijacked, taps still activate items.
5. **Small screens** get a layout that fits: no free-floating field, but the same elements, same toggle, with a tasteful reorganize animation.
6. Non-negotiables inherited from the codebase: `prefers-reduced-motion` respected, semantic/keyboard-accessible markup, clean revert on unmount, no hydration mismatch.

## 3. Dependency decision: add nothing, remove nothing

**Proposed: zero dependency changes.** Anime.js 4.5.0 covers orbit (timer + math), drag (Draggable), physics feel (springs, container friction), responsive lifecycle (Scope + mediaQueries), scroll gating (ScrollObserver), and deterministic randomness (seeded RNG). It is already the project's stated motion standard (README).

Alternatives considered and rejected:

| Option | Why not |
|---|---|
| `motion` (Framer Motion) | Excellent `layout`/drag support, but ~35–50 kB extra, redundant with Anime.js, and two animation runtimes would fight over the same `transform` — the classic source of janky hybrids. |
| `@use-gesture/react` + `react-spring` | Same redundancy; also pushes per-frame values through React, which we specifically want to avoid. |
| `matter-js` (real physics) | Overkill for a decorative constellation; hard to art-direct (calm, slow, deterministic); ~80 kB. |
| GSAP + Draggable/Flip | Capable but heavy and completely parallel to the existing stack. |
| CSS-only orbits | Cannot blend with user drag or reorganize into measured grid targets. |
| Anime's own `createLayout` (AutoLayout/FLIP) | Tempting for the mode switch, but it is designed around *layout-driven* snapshots (class/DOM changes), while our floating state is *transform-driven* and co-owned by live Draggables. One owner of `transform` per element is the safest contract. Revisit for the mobile single-column reflow if hand-rolled targets ever feel limiting. |

Bundle impact of using more of Anime.js: it ships tree-shakeable ESM with per-module subpath exports (`animejs/draggable`, `animejs/scope`, `animejs/timer`, …). Importing the extra modules costs roughly +10–15 kB min+gzip over today's `animate`-only usage. No removals: `IntroFade` stays untouched.

## 4. Architecture

### 4.1 Module layout

```
components/
  ExperienceSystem.jsx            # rewritten in place (same export, page.jsx untouched)
  experience/
    data.js                       # items: id, label, kind, href/detail, optional logo
    layouts.js                    # PURE functions: coordinates only, no DOM
    createSystemController.js     # imperative motion controller (framework-free)
app/globals.css                   # small additions: field container, mode classes,
                                  # touch-action, will-change, focus-visible styles
```

Three layers with strict boundaries:

1. **React layer** (`ExperienceSystem.jsx`) — renders semantic markup once; owns exactly one piece of state: `mode` (`"system" | "experience" | "projects"`), used only for ARIA attributes and a `data-mode` attribute. Mounts the controller in `useEffect`, calls `controller.setMode(mode)` on change, `controller.destroy()` on unmount. **No positions ever pass through React state** — zero re-renders per frame.

2. **Controller layer** (`createSystemController(rootEl, opts)`) — a plain-JS factory wrapping one `createScope({ root, mediaQueries })`. Everything animated lives inside the scope, so teardown is a single `scope.revert()` (the same idiom `IntroFade` already uses). Owns: the orbit timer, one Draggable per chip, mode transitions, resize handling.

3. **Math layer** (`layouts.js`) — pure, unit-testable functions:
   - `orbitParams(items, seed)` → per-item `{ baseRadius, eccentricity, angularVelocity, phase, wobbleFreq, wobbleAmp }` using `createSeededRandom` keyed off item ids (stable across mounts).
   - `orbitPosition(params, tSeconds, fieldRect)` → `{ x, y, depth }`.
   - `structuredTargets(items, mode, fieldRect)` → `{ [id]: { x, y, scale, opacity } }` — grid slots for the active kind, a compact "dock" row for the inactive kind.

### 4.2 The transform-ownership rule (the crux of the design)

Draggable and any animation must not both write `translateX/Y` on the same element or they will stomp each other. The contract:

- **Each chip's Draggable is the single owner of its x/y.**
- The orbit tick moves chips *through* the Draggable API: `draggable.setX(x, true)` / `setY(y, true)` (the `true` mutes the update callback). Verified present in 4.5.0.
- While a chip is `grabbed`/`dragged`, the tick skips it entirely — the user has authority.
- Mode transitions animate a plain `{x, y}` proxy object per chip with `animate()` and write into `setX/setY` in `onUpdate` — same channel, no conflict.
- Everything that is *not* x/y (scale, opacity, zIndex, rotation of the core) is animated directly with `animate()`/`utils.set` — disjoint properties, no contention.

### 4.3 State model

A small explicit machine in the controller:

```
modes:      system | experience | projects        (visual organization)
per-chip:   orbiting | grabbed | thrown | settling-to-slot | slotted
global:     idle | transitioning
```

Legal transitions worth calling out:

- `system → experience/projects`: pause orbit timer (ease `playbackRate` → 0 over ~300 ms), then staggered spring flight of every chip to its structured target. If a chip is mid-throw, its release spring is stopped and re-targeted.
- `experience ↔ projects`: pure re-targeting — active grid and dock swap populations; one staggered pass.
- `back to system`: chips spring to their orbit positions *as computed for the current time*, then the timer's `playbackRate` ramps 0 → 1. No teleporting.
- **Drag during a structured mode**: allowed; on release the chip springs back to its slot (a "clean" state is the promise of these modes).
- **Drag during system mode**: on release, Draggable's own spring physics run the throw (container-bounded with friction/bounce); on `onSettle`, the controller *re-homes* the chip — it solves `radius`/`phase` from the settle position so the orbit adopts the new location instead of snapping back. This is what makes it feel like a living system the user actually rearranged.
- **Mode switch requested while a chip is grabbed**: deferred — stored and applied on `onRelease`/`onSettle` (the toggle reflects the pending state immediately).

### 4.4 Responsive strategy — one `createScope`, declarative breakpoints

```js
createScope({
  root: rootEl,
  mediaQueries: {
    lg:        "(min-width: 1024px)",
    md:        "(min-width: 768px)",
    coarse:    "(pointer: coarse)",
    reduced:   "(prefers-reduced-motion: reduce)",
  },
});
```

The scope constructor re-runs whenever any of these flips (resize, device rotation, OS motion-setting change) and auto-reverts everything built previously — including mid-drag Draggables, which revert safely. Behavior matrix:

| Context | Behavior |
|---|---|
| `md+`, motion OK | Full system: orbit field (fixed-height canvas), drag with physics, three-way toggle (System / Experience / Projects), System is the default. |
| `md+`, `reduced` | No autonomous motion: structured layout only, toggle swaps layouts with a ~150 ms opacity/position fade (or instantly), drag still enabled (direct manipulation is user-initiated) but with 1:1 tracking, no throw physics, instant slot return. |
| `< md` (any pointer) | No free-floating field. Elements render in a single-/two-column structured flow with natural document height. Toggle = Experience / Projects only; switching animates chips between list slots with a short stagger (same `structuredTargets` machinery, single-column variant). Drag disabled (`draggable.disable()` or never constructed) — small screens + drag + page scroll is a losing fight; the section scrolls like normal content. Central object shrinks to a decorative header medallion with a subtle idle breathing loop. |
| Background tab | `engine.pauseOnDocumentHidden` (default true) stops the engine. |
| Scrolled out of view | The orbit timer's `autoplay` is bound to `onScroll(...)` (ScrollObserver) on the section — the system sleeps off-screen, wakes on enter. |

### 4.5 SSR, hydration, and no-JS

- The server renders the **structured grid** (essentially today's markup) with zero inline transforms — so no-JS users and the pre-hydration paint get a clean, useful grid, and there is nothing nondeterministic to mismatch.
- On mount (and once scrolled into view, on `md+`): the controller measures each chip's grid position (FLIP-style read), adopts those coordinates as starting x/y, switches the field to its fixed-height positioning mode, and *drifts the chips into orbit* from where they already are. The "system waking up" is the entrance animation, for free.
- Field height on `md+` is reserved up front via CSS (`aspect-ratio` with `clamp()` caps) → no CLS when the mode flips.
- All randomness is seeded (`createSeededRandom`) and only ever runs client-side in the controller.

### 4.6 DOM sketch (semantics before motion)

```html
<section aria-labelledby="experience-title">
  <header>
    <h2 id="experience-title">Work and projects</h2>
    <div role="tablist" aria-label="View">        <!-- System / Experience / Projects -->
      <button role="tab" aria-selected="true">…</button> …
    </div>
  </header>

  <div class="orbit-field" data-mode="system">    <!-- relative; fixed aspect on md+ -->
    <div class="core" aria-hidden="true">…</div>  <!-- central project object -->
    <ul role="list">                              <!-- DOM order = reading order, never changes -->
      <li><button data-kind="experience">Company A …</button></li>
      …
    </ul>
  </div>
</section>
```

DOM order stays fixed (experience items, then projects) regardless of visual position — screen-reader and tab order remain stable and sensible in every mode.

## 5. Interaction model (the feel)

### System mode (default, `md+`)

- **Idle**: chips drift on elliptical paths around the core at individually seeded angular velocities (some slightly counter-phased), with a low-frequency sine wobble layered on radius and angle so paths never look mechanical. A `depth` value derived from the orbit angle modulates `scale` (~0.92–1.06), `zIndex`, and slight opacity — chips read as passing in front of/behind the core. The core itself breathes (slow scale 1↔1.04 loop) and rotates a few degrees per minute.
- **Hover (fine pointer) / focus-visible (keyboard)**: the global timer's `playbackRate` eases to ~0.25 — the system slows down to be read; the hovered/focused chip eases 4–6 px outward and sharpens (full opacity, slight scale). On leave/blur, rate eases back to 1. (Focus slowing matters: a moving focus target is an accessibility irritant; we calm the whole system whenever keyboard focus is inside the field.)
- **Grab** (`onGrab`): rate eases to ~0.1 (the system "holds its breath"), grabbed chip scales to ~1.08 with a soft shadow, cursor grab/grabbing via Draggable's `cursor` option.
- **Drag**: 1:1 with pointer, bounded by the field (`container` = field element, `containerPadding`, `containerFriction` ≈ 0.8 for soft edge resistance).
- **Release**: Draggable's release spring runs the throw (tuned `releaseStiffness`/`releaseDamping`/`velocityMultiplier`, `maxVelocity` clamped so it can't slingshot). Edges absorb with a damped bounce.
- **Settle** (`onSettle`): controller re-derives that chip's orbit `radius` + `phase` from the settle point; the chip resumes drifting *from where the user left it*. The constellation is genuinely rearrangeable.
- **Click vs drag**: `dragThreshold: { mouse: 4, touch: 12 }` — a press that never exceeds the threshold falls through as a normal button click (validated during implementation as an explicit test case).

### Structured modes (Experience / Projects)

- Orbit pauses; all six chips fly, ~40 ms stagger, spring ease, to computed targets:
  - **Active kind** → a tidy grid (2×2 / 1×3 depending on width) in the field's focus area; chips expand slightly and reveal secondary metadata (role, dates, stack) via a `data-mode`-driven CSS class — same elements, richer state.
  - **Inactive kind** → a compact, dimmed "dock" row near the core (still present, still draggable-but-snap-back, one click on the toggle away from prominence). The core docks toward the header as a small medallion.
- Switching Experience ↔ Projects swaps the two populations in one choreographed pass (dock ↔ grid).
- Back to System: everything drifts out to its orbit position, timer ramps back up.

### Touch specifics

- Draggable is pointer-event based and handles touch natively; the touch threshold (12 px) plus **`touch-action: pan-y`** on chips means: vertical swipes over the section scroll the page normally; a deliberate sideways/press-drag engages the chip. No scroll hijacking.
- Tablets (`md+` + coarse pointer) get the full system; hover choreography simply never fires (it is gated on `(pointer: fine)` via the scope's `coarse` flag), grab/slow-down still works.
- Phones (`< md`) get structured-only, as per the matrix above.

## 6. Performance plan

- Animate **only `transform` and `opacity`**; `will-change: transform` on the six chips (small, fixed set — no memory concern). No top/left, no layout properties → zero reflow per frame.
- One shared `createTimer` drives the orbit; per-tick work is ~20 sin/cos ops for 6 items (O(n), trivially fine up to a soft cap of ~20 items which the data file will document).
- Anime's engine batches everything on a single rAF loop; React renders exactly twice per mode change (ARIA state), never per frame.
- Sleeping: ScrollObserver gates the timer off-screen; `pauseOnDocumentHidden` handles background tabs.
- Measurements (field rect, chip sizes) are cached and refreshed only on ResizeObserver ticks (debounced) / scope media-query re-runs, then `draggable.refresh()` re-syncs bounds.
- Optional "mutual repulsion" between close chips is explicitly **deferred to a later polish phase** (O(n²) and needs art-direction time; the system is alive without it).

## 7. Accessibility summary

- Chips remain real `<button>`s in stable DOM order; activation (click/Enter/Space) keeps working in every mode; drag is a pointer-only *enhancement*, never a requirement — everything reachable by drag is equally reachable via the toggle.
- Toggle is a proper `tablist`/`tab` set (or `radiogroup` — decided in implementation) with arrow-key support and `aria-selected` state; the current organization is announced via the tabs themselves, no live-region noise.
- Keyboard focus inside the field slows the system (see above) and focused chips get a strong `:focus-visible` ring that follows the transform (ring is on the chip itself, so free).
- `prefers-reduced-motion` is a first-class scope media query, not an afterthought: no autonomous motion, near-instant reorganizations, no throw physics.
- Color/contrast: reuses the existing token system; dimmed dock chips stay ≥ 4.5:1 for their labels.

## 8. Edge cases handled by design

| Case | Handling |
|---|---|
| Mode switch while dragging | Deferred until release/settle; toggle UI updates immediately. |
| Breakpoint change / rotation mid-drag | Scope constructor re-runs; previous Draggables revert (pointer canceled safely); chips land in the new context's layout. |
| Rapid toggle mashing | Transitions re-target rather than queue: in-flight x/y animations are composition-replaced per chip (last write wins), so state can never wedge. |
| Item added/removed later | Layouts are pure functions of `items`; orbit params are id-seeded, so existing chips keep their character. |
| Throw at extreme velocity | `maxVelocity` clamp + container bounce; can never leave the field. |
| JS disabled / hydration pending | Server-rendered structured grid, fully readable and clickable. |

## 9. Testing & verification plan

1. **Unit (pure math)**: `layouts.js` tested with `node:test` (no new dev deps): targets always within field bounds, no NaN for degenerate rects, deterministic output for a fixed seed, dock/grid populations partition the item set exactly.
2. **Interaction (manual + scripted)**: click-without-drag activates; drag beyond threshold does not trigger click; throw settles in bounds; re-homed orbit resumes without jump; mode-switch-while-grabbed defers correctly.
3. **Device matrix**: Chrome/Safari/Firefox desktop; iOS Safari (simulator) and Android Chrome for touch-scroll vs drag; tablet width with coarse pointer.
4. **Accessibility pass**: keyboard-only walkthrough, VoiceOver reading order, `prefers-reduced-motion` toggled at OS level mid-session (scope must live-swap behavior).
5. **Performance**: DevTools trace on a mid-tier profile — no layout/paint per orbit frame (transforms only, compositor-driven), stable frame rate, ~0 CPU when section is off-screen or tab hidden.

## 10. Implementation plan (each phase shippable)

1. **Structure & structured modes** — extract `data.js`; new semantic markup (toggle, field, core); `layouts.js` structured targets; animated Experience ↔ Projects reorganization; mobile behavior; reduced-motion behavior. *(Delivers requirement 3, 4-partial, 5, 6.)*
2. **Orbit** — timer, seeded orbit params, depth illusion, grid→orbit entrance, ScrollObserver gating, hover/focus choreography. *(Requirement 1.)*
3. **Drag** — Draggables, ownership rule, grab/slow/release/settle, re-homing in system mode, snap-back in structured modes, touch thresholds + `touch-action`. *(Requirements 2, 4.)*
4. **Polish & hardening** — springs/stagger tuning, edge-case sweep from §8, full test matrix from §9.

## 11. Open questions (answers would refine, not block, phase 1)

1. Should chips link somewhere (project pages, external company URLs) or open an in-page detail panel? (They are inert buttons today; the click affordance should do *something* once drag exists.)
2. Is a three-segment toggle (System / Experience / Projects) on desktop acceptable, or must it be strictly two tabs with the orbit as the resting state between selections?
3. Will real logos (SVG/img) replace the text chips? (Affects only sizing constants and the dock's visual density.)
4. Should the default desktop state be the orbit (proposed) or the structured grid with orbit as an opt-in "play" state?

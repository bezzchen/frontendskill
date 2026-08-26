# Proposal: Account Settings Polish

Scope: visual polish and interaction quality of the account settings page — profile form,
notification toggles, password section, save state, validation, and mobile behavior — while
keeping the page accessible and production-ready. This document is the plan; no code changes yet.

---

## 1. Current state (audit)

Stack: Next.js 16 (App Router, JS not TS), React 19, Tailwind CSS 4 (CSS-first config via
`@import "tailwindcss"` in `app/globals.css`, no `tailwind.config`). No animation, form, or
component libraries installed.

`components/SettingsPanel.jsx` today:

- **Uncontrolled inputs** (`defaultValue`) for name/email; no validation of any kind; the form
  submits with `preventDefault` and flips a `saved` boolean that **never resets** — edit the form
  after saving and it still says "Saved".
- **Notifications** is a single native checkbox, visually a browser-default 13px box inside a
  bordered row — the label row is clickable (good) but the affordance is weak and the hit target
  on the control itself is tiny.
- **Password** is one bare input with a `placeholder` as its only label (fails WCAG 3.3.2 /
  4.1.2 in practice; placeholder disappears on input), no confirm, no visibility toggle, no
  `autocomplete` attribute.
- **Save** button has no disabled/dirty/pending/error states; double-submit is possible; nothing
  communicates "you have unsaved changes".
- **Heading bug**: the page renders "Account settings" as an `h2`, and the panel renders three
  more `h2`s ("Profile", "Notifications", "Password") — the section headings should be `h3`s.
- **Missing hygiene**: no `autocomplete` (`name`, `email`, `new-password`), no `noValidate`
  strategy, no focus-visible styling beyond browser default, no reduced-motion consideration
  (there is no motion at all), inputs are ~15px so iOS Safari zooms on focus.
- Design tokens exist (`--background/--foreground/--muted/--surface/--line`, light + dark) but
  are consumed via arbitrary values (`border-[var(--line)]`) and there are **no semantic tokens**
  (accent, danger, success) to build validation or save states with.
- Unrelated observation: `components/ConstellationData.js` is imported nowhere (dead code). Out
  of scope; I would leave it untouched.

The page is otherwise a typographic, warm-gray portfolio (Arial, generous spacing). The polish
should feel native to that aesthetic: quiet, monochrome-first, precise — not a bolt-on design
system.

---

## 2. Design goals

1. **Honest state, visibly.** The form should always answer: is anything changed? is it valid?
   is it saving? did it save? did it fail? Today it answers none of these.
2. **Motion as feedback, not decoration.** Every animation maps to a state transition (toggle
   flips, error appears, save bar slides in, check pops). 150–250ms, ease-out, all gated behind
   `motion-safe:`.
3. **Accessible by construction.** Native elements first (real `<input type="checkbox">` under
   the switch, real `<button>`s), ARIA only where semantics need upgrading, focus management on
   invalid submit, live regions for async state.
4. **Production-ready seams.** The fake save is isolated behind one async function so a real API
   drops in later; validators are pure functions; no behavior hidden in JSX.
5. **Mobile is a first-class layout**, not a squished desktop: 44px+ targets, sticky save bar
   with safe-area padding, 16px inputs, correct keyboards via `autocomplete`/`inputMode`.

---

## 3. Architecture

### 3.1 File structure

Decompose the monolith into a small settings module. All components stay JSX (repo is JS, not
TS) and colocate under `components/settings/`:

```
components/
  settings/
    SettingsPanel.jsx     ← orchestrator: state machine, submit, dirty tracking (client)
    SettingsSection.jsx   ← card shell: h3 title, description, divided field area (server-safe)
    TextField.jsx         ← label + input + hint/error wiring (useId, aria-invalid/-describedby)
    PasswordField.jsx     ← TextField variant: show/hide toggle, optional strength meter
    Switch.jsx            ← accessible toggle: native checkbox + role="switch", CSS-animated
    SaveBar.jsx           ← sticky action bar: dirty/saving/saved/error presentation
  ProjectGrid.jsx         (unchanged)
  SettingsPanel.jsx       ← deleted; app/page.jsx import updated to @/components/settings/SettingsPanel
lib/
  settings.js             ← validators, password-strength heuristic, notification prefs config,
                            saveSettings() fake API (single seam for a real backend)
```

Rationale: the current file is one component doing five jobs. Field primitives make the
label/error/ARIA wiring impossible to get wrong twice, and `SettingsSection` guarantees visual
consistency across the three sections. Only `SettingsPanel` (and the leaf inputs it renders)
needs `"use client"`; the page stays a server component.

### 3.2 State model (no form library)

Four fields and three toggles do not justify react-hook-form. Plain React:

- **Values**: one `useState` object `{ name, email, currentPassword, newPassword, notifications: {…} }`,
  fully controlled inputs.
- **Baseline**: `lastSaved` snapshot in state; `isDirty` is derived by shallow comparison
  (`useMemo`), never stored — so it can't drift.
- **Save status**: a tiny explicit machine, `status: 'idle' | 'saving' | 'saved' | 'error'`.
  Transitions:
  - submit (valid, dirty) → `saving`; button disabled + spinner; inputs stay enabled.
  - resolve → `saved`; snapshot `lastSaved = values`; password fields cleared; auto-return to
    `idle` after ~2.5s (timeout cleared on unmount/re-submit). **Fixes the sticky "Saved" bug.**
  - reject → `error`; inline alert with the message and the button re-enabled ("Try again").
  - any edit while `saved` → back to `idle` (dirty again).
- **Errors/touched**: `errors` object + `touched` set. Validation runs on blur for the touched
  field, on every change for fields that currently have an error (errors clear the moment input
  becomes valid — reward early, punish late), and on submit for everything.
- **Submit guard**: ignore submit while `saving`; on validation failure, focus the first invalid
  field (refs collected by the field components).
- **Unsaved-changes guard**: a `beforeunload` listener registered only while `isDirty` — cheap,
  and the single biggest "production app" tell.
- **Fake API**: `saveSettings(values)` in `lib/settings.js` returns a promise resolved after
  ~800ms. One place to swap in `fetch('/api/settings')` later. (Server Actions would be the
  Next-native path, but there is no backend here; the seam keeps that door open.)

### 3.3 Validation rules

Pure functions in `lib/settings.js`, presented via `noValidate` on the form so browser bubbles
never fight our inline UI:

| Field | Rule | Message |
|---|---|---|
| Name | required, trimmed, ≤ 100 chars | "Please enter your name." |
| Email | required + pragmatic RFC-ish pattern | "Enter a valid email address." |
| Current password | required **only if** new password is filled | "Enter your current password to change it." |
| New password | optional; if filled: ≥ 8 chars | "Use at least 8 characters." |

Password change stays inside the single form (matching today's one-save contract): leaving the
password fields empty means "don't change it", and the section says so in its description.
The strength meter (Weak / Fair / Strong from length + character variety, a ~10-line heuristic —
**not** zxcvbn, which is ~800KB) is purely informational and never blocks submission.

### 3.4 Notification toggles

The section header says "Notifications" and the brief says toggles, plural — I'd promote the
single checkbox to a small data-driven group defined in `lib/settings.js` (e.g. *Email
notifications*, *Product updates*, *Security alerts* — security alerts defaulted on), rendered
inside a `<fieldset>` with a visually-hidden-but-present `<legend>`. Each row: label + one-line
description on the left, `Switch` on the right, whole row clickable, `divide-y` separators.

`Switch` implementation: a real `<input type="checkbox" role="switch">` (screen readers announce
it as a switch with on/off) rendered `sr-only`-style over a CSS track + thumb driven by
`:checked` via Tailwind's `peer` — keyboard, forms, and forced-colors behavior come free from the
native input; the thumb translates with a `motion-safe` 150ms transition. Track "on" color is
`--foreground` (monochrome, matches the site), thumb white/dark per theme, plus a visible
`:focus-visible` ring on the track.

---

## 4. Visual design

### 4.1 Tokens (Tailwind 4 `@theme`)

Extend `globals.css` — this is the only global change:

- Map existing vars into the theme so utilities read cleanly:
  `--color-surface`, `--color-line`, `--color-muted`, `--color-canvas`, `--color-ink`
  → `bg-surface`, `border-line`, `text-muted`, etc., replacing every `[var(--…)]` arbitrary value
  in the settings components (ProjectGrid left as-is to keep the diff scoped).
- Add semantic tokens tuned for AA contrast in both schemes:
  - `--color-danger` (light `#b3261e` / dark `#f2857c`) + a faint `--color-danger-soft` bg,
  - `--color-success` (light `#1a7f37` / dark `#57ab5a`),
  - accent stays **monochrome** (`--foreground`) for primary button and switch-on — this site
    doesn't want a blue SaaS accent; red/green appear only as meaning (error/success).
- Focus treatment: uniform `focus-visible:ring-2 ring-ink ring-offset-2 ring-offset-canvas`
  (offset ring reads clearly against the warm-gray field borders).

### 4.2 Section cards

Each section becomes a `SettingsSection` card: `bg-surface`, `border-line`, `rounded-xl`; header
block (h3 + one-line muted description, e.g. "This is how your name appears across the site."),
hairline divider, then the fields with consistent vertical rhythm. Widen the page's settings
container from `max-w-2xl` to `max-w-3xl` so the cards breathe. Inputs get a unified recipe:
`rounded-lg border-line bg-canvas/50 px-3.5 py-2.5 text-base sm:text-sm`, hover border darkens,
focus ring per above, `aria-invalid:border-danger` when errored. Autofill styling normalized via
a small `:autofill` shadow trick so Chrome's yellow doesn't break the palette.

### 4.3 Save bar

Replace the inline button row with a `SaveBar` that is `position: sticky; bottom: 0` **inside the
form** (not fixed to the page — it only occupies/floats within the settings flow, which is the
last section of a long page): translucent `bg-canvas/85` + `backdrop-blur`, top hairline,
`pb-[max(theme(spacing.3),env(safe-area-inset-bottom))]`.

Contents by state:
- **clean/idle** → bar hidden (present in DOM, `opacity-0 translate-y-2 pointer-events-none`,
  and `inert` so it's skipped by AT and tab order; `motion-safe` transition handles enter/exit —
  no unmount animation library needed).
- **dirty** → "Unsaved changes" hint + secondary **Reset** (reverts to `lastSaved`) + primary
  **Save changes**.
- **saving** → button shows an inline SVG spinner + "Saving…", `disabled` + `aria-disabled`.
- **saved** → transient check icon + "Saved" (subtle 200ms scale-in pop), then bar slides away.
- **error** → the bar stays with a `role="alert"` message and an enabled "Try again".

One `role="status" aria-live="polite"` region (visually part of the bar) announces
"Saving changes…" / "Changes saved" / the error text.

### 4.4 Motion spec (all CSS, all `motion-safe:`)

| Element | Animation | Duration/easing |
|---|---|---|
| Switch thumb / track | `translate-x` / `background-color` | 150ms ease-out |
| Input border + ring | color transition | 150ms |
| Save bar enter/exit | `translate-y-2→0` + fade | 200ms ease-out / 150ms ease-in |
| Error message enter | fade + 2px slide-down via Tailwind `starting:` (`@starting-style`) | 150ms |
| "Saved" check | scale 0.9→1 + fade keyframe | 200ms ease-out |
| Password show/hide icon | crossfade | 120ms |

`@starting-style` (Tailwind 4 `starting:` variant) gives mount animations for error messages
without JS or a presence library; in older browsers errors simply appear instantly — a clean
progressive enhancement. Under `prefers-reduced-motion`, everything snaps (opacity-only or
no transition); no content is motion-gated.

---

## 5. Accessibility checklist (acceptance criteria)

- Real `<label>`s for every control; password gets a visible label (no placeholder-as-label).
- `useId`-wired `aria-describedby` chains: hint and error both referenced when present;
  `aria-invalid` on errored fields.
- On invalid submit: focus moves to the first invalid field; errors are announced via the
  describedby association (no disruptive `role="alert"` per field).
- Notifications in `<fieldset>/<legend>`; switches announced as switches with state.
- Save status via a single polite live region; save errors via `role="alert"`.
- Show/hide password is a `<button type="button" aria-pressed aria-label="Show password">` that
  never leaves tab order; toggling does not clear the field.
- Heading hierarchy fixed (`h2` page section → `h3` card titles).
- All interactive elements ≥ 44×44px effective target on touch; visible focus for keyboard only
  (`:focus-visible`).
- Contrast AA in light and dark for text, borders-as-affordances, danger/success tokens.
- `beforeunload` guard only when dirty (never traps otherwise).

---

## 6. Mobile behavior

- Inputs `text-base` (16px) below `sm` to prevent iOS focus-zoom; `sm:text-sm` on desktop.
- `autocomplete="name" / "email" / "current-password" / "new-password"` (also enables password
  managers), `spellCheck={false}` + `autoCapitalize="none"` on email.
- Sticky save bar sits above the home indicator via `env(safe-area-inset-bottom)`.
- Switch rows: full-row tap target, switch scaled up (~44×26 track) with padding to 44px height.
- Cards go edge-to-comfortable: slightly reduced card padding at `<sm`, page keeps `px-6`.
- No layout that depends on hover; show/hide password and reset are real buttons.

---

## 7. Dependencies

**Add: none. Remove: none.**

Considered and rejected:

- **`motion` (Framer Motion)** — the motion inventory above is 6 micro-transitions on mounted
  elements; the only "hard" case (save-bar exit) is solved by keeping the bar mounted with
  `inert`. Not worth ~30KB gz + a new API surface on a page this small. Would become justified
  only for layout/shared-element animation, which nothing here needs.
- **`react-hook-form` + `zod`** — 4 validated fields with bespoke cross-field logic (current ⇄
  new password) is less code as two pure functions than as a schema + resolver.
- **Radix/Headless UI (Switch, etc.)** — a native checkbox with `role="switch"` is smaller,
  form-native, and forced-colors-correct; libraries earn their keep on comboboxes/dialogs, not
  switches.
- **`zxcvbn`** — ~800KB for an informational meter; a 10-line heuristic is proportionate.
- **`clsx`** — string templates suffice at this scale.

Zero new dependencies keeps install time, bundle, supply-chain surface, and React-19/Next-16
compat risk at zero, and the interaction quality target is fully reachable with Tailwind 4
primitives (`peer`, `starting:`, `motion-safe`, `@theme`).

---

## 8. Out of scope / explicitly not changing

- `ProjectGrid`, page header, global font, and page-level layout (beyond widening the settings
  container and fixing the heading level).
- No backend, no Server Actions, no persistence (the seam in `lib/settings.js` is where that
  lands later).
- `components/ConstellationData.js` (dead code) left untouched.

---

## 9. Implementation order & verification

1. `globals.css`: `@theme` token mapping + semantic tokens + autofill/focus polish.
2. `lib/settings.js`: validators, strength heuristic, notification config, `saveSettings` stub.
3. Primitives: `TextField` → `PasswordField` → `Switch` → `SettingsSection`.
4. `SettingsPanel` orchestrator + `SaveBar`; update `app/page.jsx` import + heading fix.
5. Verify: `npm install && npm run build` (clean build, no new deps); dev-server pass in light +
   dark, 375px / 768px / 1280px viewports; full keyboard walkthrough (tab order, focus ring,
   invalid-submit focus jump, switch via Space); VoiceOver spot-check of live region + switches;
   `prefers-reduced-motion` pass; iOS zoom check via 16px inputs.

Estimated diff: ~6 new small files, 2 edited (`globals.css`, `app/page.jsx`), 1 moved/rewritten
(`SettingsPanel.jsx`), ~450–550 lines total.

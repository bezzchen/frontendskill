# Proposal: Account Settings Polish

Scope: visual polish and interaction quality of the account settings section — profile form, notification toggles, password section, save state, validation, and mobile behavior — while keeping the page accessible and production-ready. This document covers the audit, the proposed architecture, the interaction/motion spec, the dependency decision, and the verification plan. No implementation yet.

---

## 1. Current-state audit

Stack: Next.js 16.2.12 (App Router), React 19.2.8, Tailwind CSS 4.3.3 (v4 CSS-first config via `@import "tailwindcss"` in `app/globals.css`), plain JavaScript with `@/*` path alias. No animation, icon, or form libraries.

Relevant files:

- `app/page.jsx` — renders `<SettingsPanel />` inside a `max-w-2xl` section titled "Account settings" (h2).
- `components/SettingsPanel.jsx` — the entire settings UI (69 lines).
- `app/globals.css` — five theme tokens (`--background`, `--foreground`, `--muted`, `--surface`, `--line`) with a `prefers-color-scheme: dark` override; Arial body font.

Issues found in `components/SettingsPanel.jsx`:

| # | Issue | Where |
|---|-------|-------|
| 1 | `saved` is set `true` on submit and never resets — "Saved" persists forever, even after further edits. No pending state, no dirty tracking, no error path. | lines 7, 12–15, 63–65 |
| 2 | No validation of any kind. Browser-default bubbles would appear for `type="email"` only, inconsistently styled across browsers. | whole form |
| 3 | Password input has no `<label>`, no `name`, no `autocomplete="new-password"`, no visibility toggle, no guidance on requirements. | lines 52–56 |
| 4 | Notifications is a single bare native checkbox — tiny hit target, default UA styling, no description. The brief calls for notification toggles (plural). | lines 40–47 |
| 5 | Heading hierarchy: the page section heading is an h2, and the groups inside the form ("Profile", "Notifications", "Password") are also h2s — sub-sections should sit one level below, and as form groups they are better expressed as `fieldset`/`legend`. | lines 18, 39, 51 |
| 6 | Name/email are uncontrolled (`defaultValue`), so dirty state can't be derived; the notification checkbox is controlled — mixed model. | lines 23, 31, 43 |
| 7 | No focus-visible treatment beyond UA default, no hover/transition on any control, no error/success/accent color tokens, Arial body font. | globals.css |
| 8 | Mobile: no 16px input floor (iOS zooms on focus), no sticky access to the save action on long forms, small touch targets. | whole form |

What's already good and should be preserved: the neutral ivory/charcoal token system with automatic dark mode, the `aria-live="polite"` status span (right idea, wrong lifecycle), semantic `<form>`/`<label>` usage for name/email, and the overall restrained typographic direction of the page.

---

## 2. Goals and non-goals

Goals

1. A settings section that feels designed: card-grouped sections, consistent spacing rhythm, real switches, stateful save button, inline validation with tasteful motion.
2. Interaction quality: every state change (hover, focus, toggle, error, saving, saved) has a deliberate, fast, interruptible transition; everything respects `prefers-reduced-motion`.
3. Accessibility at WCAG 2.1 AA: correct semantics, full keyboard operation, visible focus, programmatic error association, live announcements, AA contrast in both color schemes.
4. Production-ready code: controlled form state with dirty tracking, timer cleanup, no layout shift, clean `next build`.

Non-goals

- No backend or persistence — save remains simulated (short async delay), as in the fixture.
- No redesign of the portfolio header or `ProjectGrid`; global changes are limited to shared tokens (colors, focus ring, font stack) that the settings UI needs.
- No TypeScript migration, no test framework introduction (the fixture has neither), no routing changes.

---

## 3. Design direction

Keep the existing quiet, editorial character (ivory/charcoal, hairline borders) and sharpen it rather than replacing it:

- Sections become cards: `bg-[--surface]`, 1px `--line` border, `rounded-2xl`, with a header zone (title + one-line muted description) and a divided content zone. Light mode gets a whisper of shadow; dark mode relies on borders only (shadows read as mud on near-black).
- Typography: upgrade the body font from Arial to a system stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) — free, zero-network, immediately less "unstyled". Section titles ~15px/semibold, field labels 14px/medium, descriptions and errors 13px.
- The primary action stays the existing monochrome inversion (foreground-on-background button) — it matches the page identity. New semantic tokens are added for the states the current palette can't express:
  - `--accent` — switch on-state and focus rings (a restrained near-foreground tone, not a brand blue, to preserve the mono identity)
  - `--danger` / `--success` — validation errors and saved confirmation, tuned separately for light and dark to hold ≥4.5:1 against their backgrounds
- 8px spacing grid throughout; controls sized for 40px (desktop) / 44px (touch) hit areas.

---

## 4. Architecture

### 4.1 File layout

Decompose the monolithic panel into a small settings feature plus reusable UI primitives. `app/page.jsx` keeps importing `SettingsPanel` from the same path, so the page changes at most trivially (section width).

```
components/
  SettingsPanel.jsx          # orchestrator (client) — composition + submit flow only
  settings/
    useSettingsForm.js       # form state, dirty tracking, validation wiring, save lifecycle
    validators.js            # pure per-field validators + password strength heuristic
    ProfileSection.jsx       # name + email fields
    NotificationsSection.jsx # group of 3 switch rows
    PasswordSection.jsx      # password field + strength meter + requirements
    SaveBar.jsx              # save/discard actions, status live region, mobile sticky behavior
    SettingsSection.jsx      # shared card shell (fieldset + legend + description + content)
  ui/
    TextField.jsx            # label + input + description/error wiring (useId, aria-*)
    PasswordField.jsx        # TextField variant with show/hide toggle
    Switch.jsx               # accessible toggle built on a real checkbox
    Button.jsx               # primary/ghost variants, pending + success states
    Icons.jsx                # 5–6 inline SVG icons (eye, eye-off, check, alert, spinner)
```

Rationale: primitives (`ui/`) are stateless and reusable; the feature folder (`settings/`) owns composition; a single hook owns all state so the save lifecycle, dirty diffing, and validation timing live in one testable place instead of being smeared across components.

### 4.2 State model (single hook, derived everything)

```js
// useSettingsForm.js
{
  values:  { name, email, notifyActivity, notifyProduct, notifySecurity, newPassword },
  initial: { ...snapshot },            // for dirty diff + "Discard changes"
  touched: { [field]: true },          // set on blur
  submitAttempted: bool,
  status: 'idle' | 'saving' | 'saved', // save lifecycle
}
// Derived, never stored:
errors  = validate(values)                                  // pure
isDirty = !shallowEqual(values, initial)
showError(f) = errors[f] && (touched[f] || submitAttempted)
```

- Controlled inputs throughout (fixes audit #6) so dirty state is a pure diff against `initial`.
- Errors are derived on every render from pure validators — no stale error state, trivially unit-testable if tests are ever added.
- Save lifecycle: `submit → validate all → (errors: mark submitAttempted, focus first invalid) | (clean: status='saving', ~700 ms simulated latency → status='saved', snapshot initial = values, clear password field → auto-revert to 'idle' after ~4 s or on next edit)`. All timeouts held in refs and cleared on unmount and on re-entry.
- "Discard changes" resets `values` to `initial`, clears `touched`/`submitAttempted`.

### 4.3 Validation approach (hand-rolled, no library)

Four fields do not justify `react-hook-form` + `zod` (~25 kB min+gzip combined, plus schema ceremony). Pure functions in `validators.js`:

- `name`: required, trimmed length ≥ 2.
- `email`: required, pragmatic pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `newPassword`: optional (empty = "not changing password"); when non-empty: ≥ 8 chars, at least one letter and one digit.
- `passwordStrength(value)`: 0–4 heuristic (length tiers + character variety) driving the meter and its text label; informational, not blocking beyond the minimum rules.

Timing follows "reward early, punish late": errors first appear on blur; once a field is in an error state it re-validates on every keystroke so the error disappears the moment it's fixed; submit validates everything, sets `submitAttempted`, and moves focus to the first invalid control. The form gets `noValidate` so our consistent inline errors replace UA bubbles.

### 4.4 Markup and semantics

- Each section is a `<fieldset>` with a styled `<legend>` (fixes audit #5): groups form controls semantically, keeps the page heading outline clean (h1 → h2 "Account settings"), and gives screen-reader users group context on every control.
- `Switch` is a real `<input type="checkbox" role="switch">`, visually hidden, with a styled sibling track/thumb driven by Tailwind `peer-*` utilities. Native semantics, focus, Space toggling, and label activation come free; `role="switch"` announces on/off correctly. Each row: label (medium) + one-line muted description, whole row clickable.
- Every input gets a real `<label>`, `useId`-generated ids, `aria-describedby` chaining description + error, `aria-invalid` when showing an error, and proper `autocomplete` (`name`, `email`, `new-password`).
- Save status is a `role="status"` live region that persists in the DOM (visibility toggles content, not the region) so announcements fire reliably.

---

## 5. Interaction and motion spec

All motion is CSS transitions/keyframes gated behind `motion-safe:`; `motion-reduce:` falls back to instant state swaps. Durations 120–250 ms, ease-out (`cubic-bezier(0.2, 0, 0, 1)`) — fast, interruptible, never blocking input.

| Surface | Behavior |
|---|---|
| Text fields | Border-color + ring transition on hover/focus (150 ms). Focus: 2px accent ring with offset via `:focus-visible` only. Error: danger border + danger ring + message reveal (no shake/wobble). |
| Error messages | Reveal with the CSS grid `grid-template-rows: 0fr → 1fr` trick + opacity/4px slide (180 ms) — animates height without JS measurement, no layout jump on disappear. Message = alert icon + text (not color-only). |
| Switch | Thumb translate 180 ms; track color crossfade; while pressed (`:active`) the thumb stretches ~15% wider (iOS-style) then settles — pure CSS. 44×24 px track inside a ≥44 px tap row. |
| Password | In-field show/hide button (`type="button"`, `aria-pressed`, icon swap + accessible label). 4-segment strength meter: segments fill left-to-right with width/color transitions (250 ms); text label ("Too short / Weak / Fair / Good / Strong") rendered adjacent so strength is never color-only; meter wrapped in a polite live region throttled to label changes. Requirements hint shown as muted description below. |
| Save button | Three visual states crossfaded (140 ms): idle "Save changes" → saving (inline SVG spinner, 600 ms linear spin, `disabled` + `aria-busy`) → saved (check icon draws in via stroke-dashoffset, 300 ms, success tint) → auto-revert. Width is reserved via a min-width so the button never reflows between states. |
| Dirty state | Save button disabled while pristine; becomes enabled the moment `isDirty`. A ghost "Discard changes" button fades in alongside only when dirty. Status text ("Unsaved changes" / "Saved just now") lives in the same status region. |
| Mobile save bar | Below `md`, the action row docks: `position: sticky; bottom: 0`, top hairline border, translucent `--background` + `backdrop-blur`, `padding-bottom: env(safe-area-inset-bottom)`. Slides up (220 ms) when the form first becomes dirty. Content above gets bottom scroll margin so nothing is obscured. On `md+` the same component renders inline at the end of the form. |
| Section cards | Static — no scroll-triggered or entrance animation. Settings pages should feel instant, not theatrical. |

Focus management: on failed submit, focus moves to the first control with `aria-invalid="true"` (refs collected by the hook); on success, focus stays on the save button and the status region announces "Changes saved".

---

## 6. Accessibility checklist (acceptance criteria)

- Keyboard: every control reachable and operable (Tab order = visual order; Space toggles switches; Enter submits); show/hide password is a focusable button.
- Focus visible on every interactive element via `:focus-visible` (2px accent ring, 2px offset) — including switch tracks and the sticky-bar buttons.
- Errors: `aria-invalid` + `aria-describedby` per field; first invalid field focused on submit; error text ≥ 13px at AA contrast; icon + text, never color alone.
- Live regions: one persistent `role="status"` for save lifecycle; strength label announced politely.
- Semantics: fieldset/legend groups; `role="switch"` checkboxes; labels for all inputs including password; `autocomplete` tokens correct.
- Contrast: all text and control states ≥ 4.5:1 (≥ 3:1 for large text and UI component boundaries) in both light and dark — the new `--danger`/`--success`/`--accent` tokens will be picked per scheme and spot-checked with a contrast tool.
- `prefers-reduced-motion`: all transitions/keyframes disabled or reduced to opacity-only.
- Touch: ≥ 44 px targets on mobile; inputs at 16px font-size to prevent iOS focus zoom; `autocapitalize="none"` + `spellCheck={false}` on email.

---

## 7. Dependencies: add none, remove none

The prompt invites dependencies, so this is an explicit decision, not an omission:

- **No animation library (framer-motion / react-spring / auto-animate).** Every animation in §5 is a 1:1 fit for CSS transitions and keyframes: color/transform micro-interactions, the grid-rows height trick for error reveal, an SVG stroke draw, a sticky-bar slide. There is no presence choreography, no FLIP/layout animation, no gesture physics — the only things that would earn `motion` its ~32 kB min+gzip client cost on this page. Reconsider if scope grows to stacked toasts, reorderable lists, or shared-element transitions.
- **No form/validation library (react-hook-form, zod, formik).** Four fields with three rules; a 40-line pure-validator module is smaller than the libraries' type ceremony and keeps error-timing behavior fully in our control.
- **No icon library (lucide-react, heroicons).** Five inline SVGs in `Icons.jsx` (~1 kB total, tree-shaken by definition).
- **No class-merge utility (clsx/tailwind-merge).** A 3-line local `cn()` (filter + join) covers the primitives' needs.
- **No web font.** `next/font/google` needs network at build time (risky in a sandboxed environment) and adds weight; the system-ui stack is the right cost/benefit here.
- **Remove nothing** — the dependency set is already minimal and `ConstellationData.js`/`ProjectGrid` belong to the fixture.

Net effect: zero new runtime bytes; the polish budget is spent on design tokens and interaction detail instead of library weight.

---

## 8. Tailwind v4 token plan (`app/globals.css`)

Tailwind 4's CSS-first config lets us promote the existing CSS variables into first-class utilities and add the missing semantic tokens:

```css
:root {
  /* existing tokens unchanged */
  --accent:  #1f1f1e;   /* near-foreground; switch on-state, focus ring */
  --danger:  #b3261e;
  --success: #1a7f37;
}
@media (prefers-color-scheme: dark) {
  :root { --accent: #e8e8e4; --danger: #f2867f; --success: #57ab5a; }
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted:      var(--muted);
  --color-surface:    var(--surface);
  --color-line:       var(--line);
  --color-accent:     var(--accent);
  --color-danger:     var(--danger);
  --color-success:    var(--success);
}
```

New components then use `border-line`, `text-muted`, `text-danger`, etc., instead of the current `border-[var(--line)]` arbitrary-value syntax (which keeps working in untouched files like `ProjectGrid.jsx`). Also in globals: the system font stack, a shared `:focus-visible` ring recipe, and the few custom keyframes (spinner, check draw) under a `motion-safe` guard. Exact hex values above are provisional — final values get contrast-verified in both schemes during implementation.

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| `fieldset`/`legend` default-styling quirks (legend positioning, min-width) | Known resets: `legend` as block/`float: none`, `fieldset` `min-w-0 m-0 p-0 border-0`; verify in Safari/Firefox. |
| Sticky bar obscuring the last field / covering iOS home-indicator area | Bottom scroll margin on the form; `env(safe-area-inset-bottom)` padding. |
| Stale "Saved" or timer leaks (the current bug, reintroduced) | Save lifecycle centralized in the hook; timeout refs cleared on unmount, on re-submit, and on first edit after save. |
| Browser autofill vs controlled inputs | React 19 handles autofill `change` events; visual autofill tint accepted (fighting `:autofill` styling is not worth it). |
| Live-region announcements dropped when the region mounts late | Status region always in the DOM; only its text content changes. |
| Dark-mode contrast regressions from new tokens | Per-scheme token values + manual contrast check before finalizing. |
| Layout shift from button state changes / error reveal | Reserved button min-width; grid-rows height animation (occupies space smoothly, no jump). |

---

## 10. Implementation order and verification

Order (each step leaves the app working):

1. `globals.css`: tokens, `@theme inline`, font stack, focus-ring recipe, keyframes.
2. UI primitives: `Icons`, `Button`, `TextField`, `Switch`, `PasswordField`.
3. `validators.js` + `useSettingsForm.js` (state, dirty diff, save lifecycle).
4. Sections + `SettingsSection` card shell; rewrite `SettingsPanel` as composition.
5. `SaveBar` incl. mobile sticky behavior; page-level tweak only if section width needs it.
6. Accessibility + reduced-motion pass; dark-mode pass.

Verification:

- `npm install && npm run dev`; manual matrix: light/dark × 375px/768px/1280px viewports.
- Interaction walkthrough: blur-then-fix validation timing; submit with errors (focus jump + announcement); happy-path save (saving → saved → auto-revert); edit-after-save clears status; discard restores snapshot; toggle switches via mouse, Space, and label click; password show/hide + strength meter narration.
- Keyboard-only full pass; axe DevTools scan; `prefers-reduced-motion` emulation; iOS-zoom check (16px inputs).
- `npm run build` completes clean.

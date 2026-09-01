# E1base-rep2 — BASELINE (no skill), Fable, plan-only
Eval: E1-ordinary-settings-restraint. Fixture next-tailwind-base @ edf3be4.

## Current state found
Next 16.2 App Router, React 19, Tailwind v4 (CSS-first, no tailwind.config), plain JSX, no TS, no
animation/form/component libraries. Tokens in app/globals.css with light/dark via prefers-color-scheme.
SettingsPanel.jsx (69 lines) single client component. Concrete defects found by reading:
- No save lifecycle: submit sets saved=true permanently — still says "Saved" after you edit again.
  No pending state, no dirty tracking (button always active even with no changes), no error path.
- No validation: email accepts anything; name can be empty; password has no rules.
- A11y bugs: password input has NO LABEL (placeholder only); group headings are <h2> nested under the
  page's <h2 id="settings-title">, flattening hierarchy — should be <h3>.
- Visual flatness: native unstyled checkbox for "toggles" (singular despite plural intent), default
  focus rings, no hover/active/disabled button states, sections lack the card treatment used elsewhere.
- Mobile: no sticky save affordance, tiny checkbox touch target, inputs don't guard iOS auto-zoom
  (needs 16px), no autocomplete hints.

## Proposal
Decompose into components/settings/{SettingsPanel,SettingsSection,TextField,PasswordField,ToggleRow,
SaveBar}.jsx + lib/settings-validation.js (pure, unit-testable). No form library
("react-hook-form is overkill for 6 fields"). **No animation library.**
State: values + savedValues -> isDirty by shallow compare (editing after save re-arms button and
clears "Saved"); status idle|saving|saved|error with an async saveSettings(values) stub (~700ms) as
the seam for a real API, error branch fully rendered; errors + touched with validate-on-blur-after-
first-touch ("reward early, punish late"); on submit validate all, focus first invalid, announce via
live region. Notifications become a config-driven array of 3 real toggles. Password change-optional:
empty = no change and valid; cleared from state after successful save.

Visual: add --accent (restrained moss/olive tuned AA both schemes), --danger, --ring,
--accent-contrast; sections as --surface cards matching ProjectGrid; switches = visually-hidden
native checkbox driving a styled 44x24 track (keyboard/AT support for free, whole row is tap target);
inputs with outline-based focus ring (no layout shift, honors forced-colors), error text revealed via
CSS grid-template-rows 0fr->1fr (animates height without JS measurement); password show/hide with
proper aria-label state + 4-segment strength meter; save button morphs Idle->Saving->Saved (SVG check
via stroke-dashoffset, auto-reverts ~2s)->Error, mirrored to the existing aria-live region.
Motion policy: all micro-interactions CSS, gated with motion-safe: / prefers-reduced-motion.

**Why no animation library (explicit):** switch thumb, error reveal, button morph, check draw and
sticky-bar slide are all achievable with CSS + a timeout ref. "Framer Motion would add ~35kB gzipped
to buy layout-animation conveniences this page doesn't need." Revisit if dialogs/toasts arrive.

Mobile: 16px inputs, autocomplete/inputmode correctness, >=44px targets, sticky save bar sliding up
only when isDirty on small screens with safe-area-inset-bottom; inline at sm: and up.
A11y commitments: labeled password, aria-describedby chains, aria-invalid, focus to first invalid,
native checkbox semantics, visible focus rings, h1->h2->h3 fixed, AA contrast both schemes,
reduced motion honored, live-region announcements.
Verification plan: npm install, next build clean, browser pass light+dark at 375/768/desktop,
keyboard-only walkthrough, dirty->saving->saved->re-edit loop.

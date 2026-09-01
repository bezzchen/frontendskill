# E1base-rep3 — BASELINE (no skill), Fable, plan-only
Eval: E1-ordinary-settings-restraint. Fixture next-tailwind-base @ edf3be4.

## Inspection findings
Next 16.2.12 app router, React 19.2.8, Tailwind 4.3.3 (v4 CSS-first, no tailwind.config, tokens in
app/globals.css), plain JS with @/* alias. No test setup, no animation library, no other runtime deps.
Quiet editorial portfolio; settings UI is one client component. Warm neutrals via CSS vars, light+dark
via prefers-color-scheme, Arial, generous whitespace.

Defects found in SettingsPanel.jsx:
- Password input has NO LABEL (placeholder only), no confirm/visibility affordances — a11y failure.
- Heading hierarchy broken: Profile/Notifications/Password are h2 nested under the page's h2 —
  should be h3.
- `saved` flag set once and NEVER RESETS — edit after save still shows "Saved"; no dirty tracking,
  no saving/pending state, no double-submit guard.
- Zero validation, no error rendering, no aria-invalid/aria-describedby.
- Notifications is a bare native checkbox, not a switch; single toggle only; small touch target.
- Inputs uncontrolled (defaultValue) so dirty state can't be derived; no focus-visible treatment
  beyond browser default, no motion, no reduced-motion consideration, no mobile-specific behaviour.

## Dependency decision: ADD NOTHING
"Every interaction this page needs — switch thumb slide, button state morphs, error slide-in, sticky
save bar reveal — is comfortably covered by CSS transitions/keyframes plus small React state
machines." Tailwind v4 @theme provides easings/keyframes as first-class tokens. "An animation library
(motion/framer) costs ~30-50 kB gzip and React-19 peer-dep surface for zero capability we need"; exit
animations handled with data-state attributes + transitionend/timeouts. "Staying dependency-free is
the production-ready call for a repo this lean."

## Files
components/SettingsPanel.jsx (orchestrator) + components/settings/{Field,Switch,PasswordField,
SaveBar}.jsx + lib/settings.js (pure validators + async saveSettings() stub as the single swap point
for a real API) + globals.css token extensions + a minor page.jsx width change.

## State model
Controlled `values` + `savedValues` snapshot; **`dirty` is DERIVED by comparison, never stored —
"eliminates the stale-'Saved' class of bug."** status idle|saving|saved; submit -> validate all ->
saving (await saveSettings(), ~700ms) -> saved (auto-decays to idle after ~2.5s; any edit cancels it
immediately); snapshot updates on success; aria-busy + double-submit guard.
errors map + touched set. Validation timing: **on blur first, then re-validate on every change once a
field has erred — "reward early, punish late."** On submit: validate all, focus first invalid, announce
count via live region. Rules: name required >=2 chars; email required + format; password optional but
if filled -> min 8 + confirm match.

## Interaction / visual
One --surface card with internal border-t dividers; label+description column left, controls right at
>=sm, stacking on mobile — "the Stripe/GitHub settings idiom, which reads as intentional rather than a
bare stacked form." Headings fixed to h3. Inputs 40-44px, border hover darken, 2px --accent focus ring
with offset, error swaps to --danger ring + inline message sliding in 150-200ms motion-safe only,
autocomplete throughout. Three notification rows, whole row tappable, switch with 44px hit area,
thumb slide with slight ease-out overshoot, Space/Enter support. Password: New + Confirm, per-field
show/hide (aria-pressed), requirements checklist ticking as criteria are met (visual only, described
once via aria-describedby "to avoid live-region chatter"), excluded from dirty until non-empty,
cleared after save. Save button idle/disabled-ish via aria-disabled + handler guard "so it stays in
the tab order", saving spinner, saved check flash; one polite live region.
Mobile: below sm a sticky save bar docks to viewport bottom ONLY while dirty, translate-y reveal,
backdrop-blur, env(safe-area-inset-bottom); >=44px targets; no horizontal scroll at 375px.
A11y: all animation gated behind prefers-reduced-motion; contrast of new tokens verified >=4.5:1 both
schemes, "and I'll re-check --muted, which sits near the 4.5 line today." Arial -> system-ui stack.

## Considered and rejected
React 19 form actions/useActionState (controlled inputs win because dirty-tracking and per-field
validation need the values anyway; saveSettings() isolation keeps a later server-action swap trivial);
TypeScript migration (needless churn); any component library (would fight the existing hand-rolled
aesthetic).

## Convergence note — E1 rep2 vs rep3
Both reps independently found the SAME defect set (unlabelled password, h2-under-h2 hierarchy,
permanently-stuck "Saved", no validation, bare checkbox, tiny touch target, iOS/mobile gaps); both
chose ZERO new dependencies with an explicit Framer Motion price (~35kB rep2, ~30-50kB rep3); both
derived `dirty` from a savedValues snapshot; both adopted blur-then-change validation and both used
the identical phrase **"reward early, punish late"**; both proposed three notification toggles, a
show/hide password affordance with strength/requirements feedback, and a sticky mobile save bar shown
only while dirty. Between-rep variance in this cell is very low.

## Compliance
Plan-only respected.

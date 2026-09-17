# Membership and preferences implementation plan

Goal: deliver /membership and /preferences using the established tokens, Button and Field, without new dependencies or external submissions.

Architecture: retain React 19.1.1, Vite 7.1.5 and CSS Modules. App owns shared navigation/footer; separate page components own forms. A small local-storage module validates stored preferences. Native controls and static SVG cover the interface; no animation engine or continuous work is necessary.

## Design contract

Source of requirements: design/project-decisions.md and the user's delegated design request. Concept approval is explicitly waived.

Director: anthropic-scoped-adaptation through the creative-frontend-architect adapter; prepared local source content matches the pinned hash. No second director. Shared palette remains src/tokens.css: indigo #383B80, cream #FAF5E9, ink #24264F, muted #75769A, white #FFFFFF, line #D5D1E4, ochre #E8AE50. Existing Arial remains body/control typography; Georgia is a local display-font addition for the membership headline. No remote fonts.

Membership: W (expressive persuade). Workshop-poster composition, large serif headline, a custom static vector still life of repairable objects, clear £8/month offer, three concrete benefits, then a name/email form. Expression is concentrated in the hero. Prototype notice sits by the form. Success explicitly confirms only a local demo registration and links to preferences.

Preferences: Q (quiet operate). Compact left context column and white form panel on cream; plain sans-serif hierarchy, native checkboxes, explanatory descriptions, Save preferences and Cancel. Defaults come from initialPreferences. Errors preserve edits and focus the invalid field. Success uses a polite live region. Storage failures retain edits and offer a retry by resubmitting.

Responsive: split hero and preferences columns collapse below 760px; header wraps without hiding either route; benefits stack; form controls remain full width and labels visible. Keyboard focus uses the established ochre outline. No automatic motion, graphics loops, canvas, WebGL or dependency additions. SVG is custom subject illustration, not a common visual effect; native layout/controls need no catalog lookup.

## Implementation sequence

- [x] Shared shell: replace src/App.jsx and App.module.css with linked brand, active route navigation, skip link and footer. Preserve shared tokens; refine only component interaction states in Shared.module.css.
- [x] Membership: create src/pages/Membership.jsx, Membership.module.css and src/components/RepairIllustration.jsx. Use content.js for offer/benefits. Validate trimmed name and native email validity, focus errors, write local demo entry before showing confirmation; make storage failure visible.
- [x] Preferences: create src/pages/Preferences.jsx and Preferences.module.css. Read schema-checked values or initialPreferences; edit displayName and three booleans; save trimmed name; cancel restores saved state. Persist only after validation.
- [x] Verification: build with npm run build. Use installed Playwright and supplied Chromium for desktop/mobile flows, validation retention, reload persistence, keyboard controls, malformed/blocked storage, navigation and screenshots. Review rendered pages independently under the architect review workflow; fix observed defects.
- [x] Record actual checks, provenance and limitations in work-log.md.

No Git checkout is present, so commits are unavailable. Work remains in the supplied project.

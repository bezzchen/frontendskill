# Volunteer shift sign-up

A single form keeps shift availability and contact details visible together. A wizard would hide context; a dropdown would make capacity harder to compare. Use existing moss/stone tokens, Georgia headlines, and Arial body text. Small planting-bed marks visualize occupied and open places alongside explicit capacity text.

1. Replace `src/App.jsx` with native radio selection, contact-name validation, and confirmation of name, shift, date and time. Disable full shifts, guard submission, focus errors and confirmation, and clear the form when starting again.
2. Build responsive CSS Modules in `src/App.module.css`, preserving Button, Field, brand tokens, and visible keyboard focus.
3. Run `npm run build` and browser checks for validation, full-shift exclusion, both available choices, reset, keyboard navigation and narrow layouts. Save artifacts in `output/playwright/`.
4. Record actual checks and limitations in `work-log.md`. This is local only: no reservation, storage, capacity changes or external requests. No Git repository is present.

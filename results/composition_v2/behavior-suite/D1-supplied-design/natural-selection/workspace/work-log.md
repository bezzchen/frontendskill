# Workshop booking work log

## Approved scope and implementation plan

The supplied contract and screenshots are the design specification. Preserve all token values, existing copy, type sizes, squared controls, and desktop/mobile layout. Use React state and CSS Modules with no added dependencies or external services.

- [x] Add browser regression checks for single selection, keyboard interaction, missing/whitespace-only input, confirmation details, reset, and narrow layouts. Run against the unfinished app to establish failing checks.
- [x] Update `src/App.jsx`: track selected slot, attendee, field errors, and a confirmation snapshot; use pressed button semantics; focus the first invalid control, confirmation heading, and first slot after reset.
- [x] Extend `src/App.module.css` only for selected, error, confirmation, and disabled states. Preserve the initial approved appearance and `src/tokens.css` unchanged.
- [x] Run the browser checks and `npm run build`; inspect desktop/mobile screenshots and record actual results and limitations here.

Implementation choices: session cards remain buttons with mutually exclusive `aria-pressed` states in a labelled group. Selection has an explicit “Selected” label as well as ochre styling. Submit validates both fields, trims attendee whitespace, and captures the chosen session. Confirmation keeps the schedule visible but disables it until “Start another reservation” clears all state. No capacity changes or persistence are implied by this local demo.

## Checks and limitations

- Initial source and supplied desktop/mobile references inspected.
- Local preview initially blocked by sandbox (`listen EPERM`); retry through the normal sandbox approval mechanism.
- This directory has no Git repository; no commit or branch workflow applies.
- Chromium also required sandbox escalation to launch; both preview and browser succeeded through the normal approval mechanism.
- Before implementation, `node tests/booking.mjs` failed all five behavior checks for the expected missing selection, validation, and confirmation states.
- After implementation, `node tests/booking.mjs` passed **5/5** checks: mutually exclusive selection using Space/Tab/Enter; missing session and attendee errors; whitespace-only rejection and focus; attendee-only submission blocked; all three sessions confirmed with correct attendee/day/time; reset clears the form and restores focus; long attendee names fit a 320px viewport. No browser page errors occurred.
- `npm run build` passed (Vite 7.1.5, 26 modules transformed).
- Visually inspected `output/playwright/initial-desktop.png` (1440px), `initial-mobile.png` (390px), `confirmation-desktop.png`, and `confirmation-narrow.png` (320px). Initial typography, content, colors, controls, spacing, and responsive layout match the supplied references. Screenshots of selected and error states are also saved in that directory.
- `src/tokens.css`, `src/slots.js`, and installed dependencies were not changed. No new packages were installed.
- Limitations: reservations are in-memory only and reset on reload, as required by the local demo contract. No real booking, capacity update, payment, email, or persistence. Browser checks used the supplied Chromium runtime; other browsers and assistive technology were not manually tested. The regression script uses this environment's provided Playwright/Chromium paths and expects the preview on port 5173.

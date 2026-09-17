# Work log

## Scope and decisions

- Implemented using the supplied shift dataset, moss/stone tokens, Button and Field components.
- Native radio choices, explicit capacity, contact validation, selected-shift summary, confirmation and reset.
- Local prototype only: no requests, reservations, storage or capacity changes. The interface explains this limitation.
- Design and implementation checklist: `design/volunteer-signup-plan.md`. User delegated remaining decisions and authorized proceeding. No Git repository is present.

## Verification

- `npm run build`: PASS after final source changes (Vite 7.1.5; 29 modules transformed).
- `node output/playwright/check-signup.mjs`: PASS using the supplied Playwright and Chromium runtime.
- Browser assertions covered all three capacity totals; disabled full shift; missing selection; empty/whitespace name; trimming and a single-character Unicode name; correct name/date/time for both available shifts; clearing selection, name and errors on reset; focus on first invalid field, confirmation and reset; skip-link tab access; arrow-key navigation skipping the full shift; Enter submission; and reduced-motion behavior.
- No horizontal overflow at 320, 390, 768, 1024 or 1440 pixels. A 180-character contact name also wrapped correctly in the 320-pixel confirmation view.
- No browser page errors. Visually reviewed `output/playwright/desktop.png` and `output/playwright/mobile.png`. Additional captures: `validation.png` and `confirmation.png` in that directory.
- Updated the document title and description for Moss Lane volunteer shifts.
- Local server and Chromium launches were blocked by the sandbox initially; both ran successfully through the normal approval mechanism. Preview is served at `http://127.0.0.1:5173/`.

## Limitations

- Local state resets on page reload. The supplied capacity is reference data; confirmation does not reserve or decrement a place, and no personal details are sent externally.
- Browser verification used Chromium. No manual screen-reader session or cross-browser audit was performed; accessible names, error associations, native keyboard behavior and focus changes were checked through the browser.
- No Git repository was available, so no commit was created. No dependencies were installed.

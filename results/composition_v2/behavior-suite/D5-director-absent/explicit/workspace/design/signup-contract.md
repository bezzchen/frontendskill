# Volunteer sign-up design contract

- Surface: Moss Lane Garden volunteer shift selection and local confirmation.
- Brief and acceptance: reuse accessible Button/Field and moss/stone tokens; show remaining places and total capacity; prevent full shifts; require an available shift and trimmed nonblank contact name; confirm shift, date/time and name; allow another sign-up. No external submission or payment.
- Authority: design/project-context.md, src/tokens.css, src/components/Button.jsx, src/components/Field.jsx, src/shifts.js.
- Director: builtin-fallback. The exact CFA_ANTHROPIC_SOURCE path is absent. No substitute upstream director loaded.
- Concept: a calm community-garden noticeboard, restrained typography, numbered form steps, clear capacity indicators and a white contact panel. Existing Arial, moss/stone palette and component styling retained.
- Hierarchy: garden identity, welcoming introduction, shift options, contact and live selection summary, confirmation action, local-demo notice.
- Responsive: two columns on desktop, one column at 650px and below; decorative side message omitted on narrow screens.
- States: unselected, selected, full/disabled, missing shift, blank/whitespace contact name, focused controls, confirmed details, reset. One local place deducted per success until reload; personal details clear on reset and are never persisted.
- Register: Q (quiet operate), chosen for a short form task.
- Rendering: React 19.1.1 + Vite 7.1.5 + CSS Modules; native radio group and existing Button/Field. No added dependencies, effects or continuous animation. Catalog search and animation lifecycle probes are not applicable to ordinary layout/native controls.
- Verification: production build, real browser desktop/mobile/intermediate layouts, keyboard flow, validation, full shifts, confirmation, restart, capacity depletion, no external signup requests. Screen-reader software and cross-browser coverage remain outside the checks.

## Implementation plan

1. Build stateful selection, contact validation, confirmation and restart in src/App.jsx. Use immutable local capacity updates and existing accessible components; focus the first invalid control and the confirmation heading.
2. Style ordinary responsive layout in src/App.module.css using existing tokens; update the page title in index.html.
3. Run npm run build; exercise the actual UI using the installed Playwright/Chromium runtime; capture screenshots in output/playwright and request an independent rendered review.
4. Correct observed defects and record actual checks, skill provenance and limitations in work-log.md.

The user delegated remaining decisions and requested implementation, so no additional approval gate applies. This directory has no Git repository; no commits are created.

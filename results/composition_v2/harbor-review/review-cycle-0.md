# Harbor Bench — initial rendered review

**Result: pass. Verification status: verified** for the bounded live desktop/mobile review described below. No actionable blocker, major or minor defect was observed. No correction cycle is required from this review.

Reviewed route: `http://127.0.0.1:8766/`. Viewports: 1440 × 900 and 375 × 812. Reviewer: `/root/v2_director_adapter`; review mode `independent`; initial review cycle 0. This reviewer did not build Harbor Bench and did not read its work-log, parent build traces, self-assessment or earlier review reports. The supplied brief and approved design contract were the handoff. Prior work on the separate Field Notes fixture is not evidence about Harbor Bench. This is a development smoke review, not measured design superiority or a blind efficacy comparison. Exact reviewer tokens are unavailable and recorded as null.

## Observed acceptance results

- **Service and brand:** The page explains chair, table and cabinet repair in concrete terms. A chair-joint illustration ties the visual identity to repair work. The navy, warm-white and copper scheme remains coherent across hero, service explanations and form. No style change is requested.
- **Responsive layout:** Full-page desktop and mobile screenshots were visually inspected with `view_image`, followed by scrolled error, form-focus and confirmation screenshots. No text collision, clipped primary action or horizontal document overflow was observed. Document widths matched the viewports in both initial and recorded interactive states.
- **Empty/invalid input:** Empty submit exposes furniture, email and description errors and focuses the first invalid radio. Selecting Chair, entering `broken-email`, and entering only spaces in the description leaves corrective email/description messages and focuses the email input. The email error includes an example address. Entering valid values removes the errors.
- **Pointer primary flow:** Chair and Table requests were successfully submitted by pointer at both viewports. Confirmations show the selected furniture, email and entered repair description. They explicitly say this is a demo, nothing was sent, and no email will follow.
- **Edit:** Edit request restores the selected furniture and original email/description at both viewports. Values remain available for amendment.
- **Keyboard flow:** The skip link is visible on Tab and moves onward into main content. Native radio selection changes with ArrowRight. Tab follows furniture → email → description → submit; Shift+Tab returns from description to email. Space submits a Cabinet request at both sizes. Focus moves to the confirmation heading, Tab reaches Edit request, and Enter restores the form with focus on the selected radio. Focus indicators on submit, edit and invalid text input were visible in inspected screenshots.
- **Motion:** No decorative motion was observed in the live flow. Reduced-motion temporal samples at approximately 0, 400 and 800 ms showed zero running document animations and a stable heading position. A reduced-motion mobile pointer submission also completed. This local synchronous flow has no loading wait or server-failure state to exercise.
- **Local-only behavior:** During instrumented desktop/mobile flows, the only observed requests were initial GETs to the localhost page. No submission request, external font/asset request or page JavaScript error appeared in the logged flows.
- **JavaScript unavailable:** In a browser context with JavaScript disabled, the page explains that JavaScript is needed to try the local estimate form, states nothing has been sent, and keeps submit disabled.

## Evidence

All evidence is in this report's directory:

- `desktop-initial.png`, `mobile-initial.png`: complete layouts, inspected visually.
- `desktop-empty-errors.png`, `mobile-invalid-errors.png`: corrective messages and narrow-layout error state.
- `desktop-chair-success.png`, `mobile-chair-success.png`: pointer confirmation and local-only wording.
- `desktop-submit-keyboard-focus.png`, `mobile-submit-keyboard-focus.png`: visible submit focus and entered Cabinet request.
- `mobile-edit-keyboard-focus.png`: keyboard-reachable edit button and complete confirmation.
- `desktop-edit-preserved.png`, `mobile-edit-preserved.png`: restored request data.
- `mobile-reduced-motion-success.png`, `mobile-noscript.png`: supported environment variants.
- `initial-observations.json`, `interaction-log.json`: viewports, inputs, focus, displayed states, network requests, animation samples and page-error observations.
- `observe.cjs`, `interact.cjs`: reproducible browser actions using the bundled runtime.

Evidence-collection caveat: the first interaction collector recorded `document.activeElement.textContent`; when BODY was active, that field incidentally included the page's inline script in the tool output. Initial screenshots had already been observed, and the interaction script had already been authored before this occurred. No fixture source file was opened or used to design a correction, and no correction was proposed. The raw log is retained; the collector now omits BODY/HTML text to prevent repeating that incidental source exposure. This caveat limits any claim of a fully source-blind interaction review; it does not replace the captured live results.

Coverage limits: headless Chromium with desktop and narrow emulation, not a physical touch device or other browser engine. No screen-reader session, exhaustive accessibility audit or backend transport validation. Network/server errors do not apply to the explicitly local prototype. No performance benchmark or efficacy comparison. No fixture edits were made.

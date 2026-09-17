# Workspace settings — independent rendered review

```yaml
review_mode: independent
reviewer: Codex /root, directly assigned independent reviewer
review_date: 2026-09-17
result: incomplete
verification_status: verified
correction_cycle: 0
```

The rendered review is complete, but the page does not pass: one blocker and one major defect remain at 390px. `verified` describes the bounded live checks below, not approval of the application. No corrections were made.

Inputs: [brief.txt](brief.txt), [design-contract.md](design-contract.md), [task.json](task.json), and [rendered-review.md](rendered-review.md). No builder assessment was available or consulted. I opened and inspected the live page before any implementation inspection; no application source files were subsequently read. DOM, computed styles and interaction observations supported diagnosis after operating the interface.

Route: `http://127.0.0.1:8890/D2-settings-and-review/checkpoints/explicit/`. Failure mode: append `?save=error`.

## Observed defects

### D1 — Save cannot be activated by pointer at 390px

- **Kind:** observed defect.
- **Severity:** blocker for the phone pointer task. Keyboard submission remains a workaround.
- **Expected behavior:** the full-width Save settings button must submit valid preferences through ordinary pointer operation, including on a phone.
- **Observed behavior:** clicking or emulated tapping the visible button leaves “You have unsaved changes.” indefinitely within the observed 850ms window; no pending or success state follows. A normal Playwright locator click also timed out because `.actions` intercepted pointer events. This is not a disabled-button state: the controls are enabled before the attempted save.
- **Viewport/state:** 390 × 900, normal edited form. Reproduced on fresh navigation, after resizing the same page from 1440px, and with reduced motion. Sampled 320, 375, 600, 601 and 1440px widths accepted pointer saves; the exact affected breakpoint interval was not determined.
- **Reproduction:** open the route at 390 × 900; replace the name with `  River Clay Studio  `; click the kiln-alert label to uncheck it; click the center of Save settings; wait at least 850ms. The form remains unsaved. Focus the name and press Enter to demonstrate that the same data can reach saving and success.
- **Evidence:** [pointer attempt screenshot](output/playwright/390-pointer-save-blocked.png), [touch attempt screenshot](output/playwright/390-touch-blocked-reduced.png), [mobile observations](output/playwright/mobile-observations.json), [hit-testing diagnostics](output/playwright/diagnostics.json), and [resize/touch log](output/playwright/resize-touch.json).
- **Supporting diagnosis:** at 390px, the button occupies x=42–348 and y≈523–571. Hit tests at 5%, 50% and 95% of its width resolve to `DIV.actions`. Its rendered `::after` has empty generated content, absolute positioning and `inset: 0px`; this overlay is absent at the other sampled widths. These observations support an overlay intercepting the button.
- **Proposed smallest correction:** remove the action overlay's interception, for example by removing an unnecessary overlay or making a decorative pseudo-element ignore pointer events. Preserve the full-width square button and brand styling. Recheck actual mouse and touch activation at 390px. No correction was applied.

### D2 — Introduction overlaps the heading at 390px

- **Kind:** observed defect.
- **Severity:** major.
- **Expected behavior:** the contracted heading and introduction hierarchy must remain legible and free of text collisions on a phone.
- **Observed behavior:** “Make this space feel like yours…” is drawn across the lower portion of “Workspace settings,” materially obscuring both lines. The collision is visible in default, validation, saving, success and service-error screenshots.
- **Viewport/state:** 390 × 900; also reproduced after live resizing and with reduced motion. It was absent in the inspected 320, 375, 600, 601 and 1440px screenshots.
- **Reproduction:** open the route at 390 × 900 without interacting; inspect the heading and first introduction line. Alternatively, open at 1440px and resize to 390px.
- **Evidence:** [default screenshot](output/playwright/390-default.png), [invalid screenshot](output/playwright/390-empty-invalid.png), [service-error screenshot](output/playwright/390-service-error.png), and [rendered geometry](output/playwright/resize-touch.json).
- **Supporting diagnosis:** the heading spans y=73.5–110.9. The introduction begins at y=92.9, an approximately 18px box overlap. Its computed transform is `matrix(1, 0, 0, 1, 0, -38)`.
- **Proposed smallest correction:** remove or correct the 390px introduction translation so that it follows the heading with the intended spacing. Preserve the approved typography, palette and composition. No correction was applied.

## Verification and passing observations

Both required viewports used Chromium at 1440 × 900 and 390 × 900. At 390px, pointer submission failed as D1 records; keyboard submission was then used to exercise every remaining state without altering application behavior.

| Check | Actual observation | Evidence |
|---|---|---|
| Normal layout | Desktop hierarchy is readable. Paper/ink palette, system type, white bordered panel and square controls retain the accepted direction. Phone collision is D2. | [Desktop](output/playwright/1440-default.png), [390px](output/playwright/390-default.png) |
| Empty and invalid | Empty string, three spaces and 61 ASCII characters produce an inline error and focus the name. `aria-invalid=true`; help and error IDs resolve through `aria-describedby`. | [Desktop empty](output/playwright/1440-empty-invalid.png), [phone empty](output/playwright/390-empty-invalid.png), [phone overlength](output/playwright/390-overlength-invalid.png) |
| Boundaries and trimming | 60 ASCII characters and `  A  ` save successfully. `  River Clay Studio  ` becomes `River Clay Studio` after success. | [Desktop log](output/playwright/desktop-observations.json), [phone log](output/playwright/mobile-observations.json) |
| Saving | “Saving…” and persistent pending text appear. A disabled fieldset makes all three controls effectively disabled. Attempts to type, toggle, repeatedly click and press Enter during pending leave values intact; only one pending-to-success transition was observed. | [Desktop pending](output/playwright/1440-saving.png), [phone pending](output/playwright/390-saving.png), [timed diagnostics](output/playwright/diagnostics.json) |
| Timing and success | Diagnostic runs at both required widths recorded pending at approximately 3ms and success at 605ms from the observation start. No early success was seen. Success remained through an additional 1.2-second check. Checkbox choices survived completion. | [Desktop success](output/playwright/1440-success.png), [phone success](output/playwright/390-success.png), [timed diagnostics](output/playwright/diagnostics.json) |
| Service error and retry | `?save=error` displays actionable failure feedback, retains the exact untrimmed edited name and checkbox value, re-enables controls and allows another attempt. Retry enters pending and rejects again under the failure query. | [Desktop error](output/playwright/1440-service-error.png), [phone error](output/playwright/390-service-error.png), state logs |
| New edits | Editing the name after success replaces stale feedback with “You have unsaved changes.” Both checkbox and name changes clear stale rejection feedback. | Desktop and phone observation logs |
| Keyboard operation | Tab order is name → checkbox → Save; Shift+Tab reverses it. Space toggles the checkbox and activates the focused button. Enter submits from the name or Save. Keyboard-only success, failure, retry and empty validation were exercised at both widths. Focus returns to Save after completion or to the name after invalid submission. | [Desktop focus](output/playwright/1440-keyboard-save.png), [phone focus](output/playwright/390-keyboard-save.png), [keyboard error](output/playwright/390-keyboard-error.png), diagnostics |
| Focus and semantics | Visually inspected orange focus outlines on the name, checkbox and button at both required widths. Native labels are associated; feedback has `role=status` and `aria-live=polite`. Checkbox label measures 44px high on desktop and 68px at 390px and toggles when clicked. | Focus screenshots, observation and geometry logs |
| Responsive fit | At 320 × 812 and 375 × 812, default and invalid states have no horizontal clipping; document width equals viewport width. At 600px the button fills the panel content width; 601px uses the desktop button. | [320 default](output/playwright/320-default.png), [320 invalid](output/playwright/320-invalid.png), [375 default](output/playwright/375-default.png), [375 invalid](output/playwright/375-invalid.png), [600](output/playwright/600-default.png), [601](output/playwright/601-pointer.png) |
| Scroll and motion | Full-page screenshots cover the complete surface. Default tested heights contain the page. A 390 × 400 check scrolled 283px and exposed Save and feedback without clipping. No animation was observed; normal and reduced-motion checks found zero active Web Animations. | [Short-screen bottom](output/playwright/390-short-scrolled.png), [resize log](output/playwright/resize-touch.json) |
| Runtime errors | No console messages or page errors were recorded in the desktop and phone state-flow runs. | Observation logs |

## Stylistic suggestions

None. The approved brand colors, system typography, squared controls, white panel and quiet layout are contractual. Neither defect is a taste objection or a request for new art direction.

## Actual verification limits

- This is a bounded Chromium rendered review, not comprehensive accessibility certification. No screen reader, real phone, native mobile keyboard, Safari or Firefox was used. Touch was emulated through Chromium; announcement attributes were inspected, but speech output was not tested.
- Desktop and 390px cover all requested states. Additional widths cover responsive layout, empty validation and ordinary pointer saving, not the full failure/keyboard matrix. The precise interval around 390px remains unmeasured.
- The initial browser launch was blocked by the macOS sandbox; the authorized escalation successfully launched the supplied existing executable. No browser was installed or replaced.
- The first state runner stopped when the 390px pointer save timed out. Its desktop evidence was retained. The phone run then deliberately submitted with Enter; those screenshots must not be read as successful phone pointer saves.
- In the initial desktop log, `disabled` records each control's own property, which is false even while an ancestor fieldset disables it. The subsequent diagnostics use `matches(':disabled')`, inspect the fieldset and attempt real interactions. Those diagnostics are authoritative for effective disabled state; there is no reported pending-edit defect.
- Timed observations show the expected roughly 600ms behavior. They do not independently establish the exact service promise-resolution instant or count internal service invocations. The live `studioService` object exists, but service internals, payloads, network durability and cross-reload persistence were not audited. Duplicate prevention was checked at the user-interaction level.
- ASCII name boundaries were tested; alternate Unicode character-count conventions, extended-duration feedback persistence and exhaustive zoom/contrast testing were not covered.
- The application was not edited, fixed, built, deployed or published. All writes are review documentation and local diagnostic artifacts. Cycle 0 only; no correction/recheck cycle occurred.

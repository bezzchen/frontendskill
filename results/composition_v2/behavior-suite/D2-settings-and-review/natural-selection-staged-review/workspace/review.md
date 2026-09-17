**Workspace settings — independent rendered review**

```text
review_mode: independent
reviewer: Codex /root, independently assigned reviewer
review_date: 2026-09-17
result: incomplete
verification_status: verified
correction_cycle: 0
```

The required live checks were performed. One blocker and one major defect remain at 390px: Save does not respond to pointer input, and the heading overlaps the introductory copy. “Verified” describes the rendered evidence and completed review coverage; it does not mean the application passed. Mobile pointer submission was tested and failed, rather than left untested. No application changes or correction cycles were performed.

**Basis and independence**

Reviewed against [brief.txt](brief.txt), [design-contract.md](design-contract.md), [task.json](task.json), and the procedure in [rendered-review.md](rendered-review.md). No builder assessment or prior findings were supplied. The live page was opened and its desktop screenshot inspected before any implementation-source inspection; application source was not inspected at any point. Rendered DOM, computed styles, focus, hit testing, and timed text changes supplement the visual evidence.

Route: `http://127.0.0.1:8890/D2-settings-and-review/checkpoints/natural-selection/`. Failure route: the same URL with `?save=error`.

The supplied warm paper/earth ink/accent palette, system typography, squared controls, and quiet single-column panel are contractual choices. They are preserved in this assessment and are not defects or redesign requests.

**Observed defects**

**D1 — Save cannot be activated with a pointer at 390px**

- Kind: observed defect.
- Severity: **blocker**. The primary task cannot be completed using the visible Save button with a mouse or emulated touch at the required phone width. Keyboard submission remains possible.
- Expected behavior: pointer activation submits valid settings, shows the approximately 600ms saving state, and produces success or service-error feedback. Retry must remain usable after failure.
- Observed behavior: the name and alert preference can be changed, but clicks on the visible Save button leave “You have unsaved changes.” unchanged. No saving or success state appears after 750ms. Clicking Save with an empty name also fails to invoke validation. At `?save=error`, a pointer retry after a keyboard-triggered failure does nothing. A direct emulated touchscreen tap independently reproduces the failure.
- Viewport/state: 390 × 900, default/edited, empty, and service-error states.
- Reproduction: open the default route at 390 × 900; enter `Juniper Pointer Studio`; click the kiln-alert label to uncheck it; click the center of Save settings; wait at least 750ms. Repeat at the upper-left and lower-right portions of the button. For retry, open `?save=error`, submit using keyboard Enter, wait for the error, and click Save settings.
- Evidence: [after center click](output/playwright/390-pointer-center-after.png), [emulated touch](output/playwright/390-touch-save-blocked.png), [blocked retry](output/playwright/390-pointer-retry-blocked.png). In [mobile-results.json](output/playwright/mobile-results.json), `pointer-hit-center/left/right` and the corresponding after-states show clicks at `(195, 675.6875)`, `(50, 659.6875)`, and `(340, 691.6875)` hitting `.actions` instead of the button. [review-failure.txt](output/playwright/review-failure.txt) records the ordinary Playwright click timing out because `.actions` intercepts pointer events. [followup-results.json](output/playwright/followup-results.json) records touch and retry outcomes.
- Proposed smallest correction: correct the mobile actions area's stacking/hit-testing so the visible button receives pointer events. If a decorative overlay or pseudo-element covers it, remove its interception. Preserve the current squared button, dimensions, colors, and keyboard behavior. The precise CSS rule was not inspected; the intercepting element was observed through rendered hit testing.

**D2 — Phone heading and introduction overlap**

- Kind: observed defect.
- Severity: **major**. Two prominent lines collide, materially harming legibility on the required phone viewport.
- Expected behavior: the heading and introduction occupy separate readable lines at 390px while retaining the accepted typography and single-column composition.
- Observed behavior: “Workspace settings” overlaps the first line of “Make this space feel like yours. Choose how we keep you in the loop.” The collision is visible immediately and persists through validation, saving, success, and service-error states. It is absent in the inspected desktop and 768px screenshots.
- Viewport/state: 390 × 900, including the untouched initial state.
- Reproduction: load the default route at 390 × 900 and inspect the top of the page. Resizing the open desktop page to 390px reproduces it without editing any fields.
- Evidence: [390px default](output/playwright/390-default.png), [390px invalid](output/playwright/390-empty-invalid.png), [390px service error](output/playwright/390-service-error-settled.png); comparison: [desktop default](output/playwright/1440-default.png), [768px default](output/playwright/768-default.png). In [followup-results.json](output/playwright/followup-results.json), the mobile heading spans y=59.5–96.89 and `#settings-help` starts at y=78.89, an 18px rectangle overlap. Its rendered transform is `matrix(1, 0, 0, 1, 0, -38)`; the desktop and 768px help text has no transform. The screenshots independently confirm actual glyph collision.
- Proposed smallest correction: remove the mobile upward displacement of the introductory paragraph and let it follow the heading in normal flow, retaining the current typography, palette, and panel design.

**Coverage and working behavior**

| Check | 1440 × 900 | 390 × 900 | Evidence |
| --- | --- | --- | --- |
| Normal layout | Readable, entire panel visible | Header collision D2; form readable | [Desktop](output/playwright/1440-default.png), [phone](output/playwright/390-default.png) |
| Empty/whitespace validation | Pointer and Enter show inline error and focus the name | Enter works; pointer blocked by D1 | [Desktop empty](output/playwright/1440-empty-invalid.png), [phone empty](output/playwright/390-empty-invalid.png), logs |
| Input length | A 61-character input is limited to 60 | Same | `length-boundary` in both primary logs |
| Preference | Label click and keyboard Space toggle checkbox | Same | Pointer/keyboard control values in logs |
| Saving | Pointer and keyboard show Saving…; both inputs disabled | Keyboard reaches same state | [Desktop saving](output/playwright/1440-pointer-success-saving.png), [phone saving](output/playwright/390-keyboard-success-saving.png) |
| Success | “Settings saved.” with entered values retained | Same through keyboard | [Desktop success](output/playwright/1440-pointer-success-settled.png), [phone success](output/playwright/390-keyboard-success-settled.png) |
| Service error/retry | Pointer and keyboard preserve name and unchecked preference; retry runs again | Keyboard does the same; pointer retry blocked | [Desktop error](output/playwright/1440-service-error-settled.png), [desktop retry](output/playwright/1440-service-retry-settled.png), [phone error](output/playwright/390-service-error-settled.png), [phone retry](output/playwright/390-service-retry-settled.png) |
| Keyboard focus | Name → checkbox → Save; Shift+Tab reverses; visible outlines | Same | [Desktop Save focus](output/playwright/1440-keyboard-save-focus.png), [phone Save focus](output/playwright/390-keyboard-save-focus.png), [phone checkbox focus](output/playwright/390-keyboard-checkbox-focus.png) |
| Reduced motion | Saving and success exercised | Same through keyboard | [Desktop saving](output/playwright/1440-reduced-motion-saving.png), [phone saving](output/playwright/390-reduced-motion-saving.png), timed logs |

Keyboard completion used Tab, Shift+Tab, text entry, Space to toggle the checkbox, Enter to submit, and Space to activate the focused Save button on the error route. Validation focused the invalid input; its rendered `aria-invalid` and description references were checked. Status and service-error elements expose `status` and `alert` roles. This is DOM evidence, not a screen-reader test.

The saving-to-result transition measured approximately 601–602ms in the recorded runs, consistent with the contracted 600ms local service. The error query deterministically fails on repeated attempts; a second error is the expected retry outcome. Subsequent edits after success replace “Settings saved.” with “You have unsaved changes.” Both default-on and changed-off alert values were exercised. These observations establish local prototype feedback, not backend persistence.

The full panel was inspected in screenshots at both required sizes. Document width equaled viewport width; no horizontal overflow was observed. At 900px height, scrolling to the bottom leaves scrollY=0 because the content fits. An additional 390 × 600 check scrolled 186px and exposed the entire action area without clipping: [scrolled viewport](output/playwright/390x600-scrolled.png). Resizing through 1440 → 768 → 390 confirmed the header collision at the narrow size. The 768px check was visual only.

No page errors or console messages were recorded during the completed primary desktop and mobile state runs. No active animations were observed in the recorded normal/reduced-motion snapshots; saving was examined through timed changes rather than inferred from a still image.

**Preferences, separately from defects**

No stylistic suggestions are raised. Changing the brand palette, system typography, squared controls, or quiet composition is unnecessary to correct D1 or D2 and would require design-owner direction.

**Actual verification limits and reproducibility**

- Used the supplied prepared headless Chromium and Playwright library. The initial sandbox launch failed; the normal approved escalation allowed launch. No browser binary was installed or replaced.
- Phone coverage is a 390px browser viewport plus one emulated-touch attempt, not a physical phone or Safari test. Native software-keyboard occlusion, screen readers, browser zoom/text enlargement, other browsers, and comprehensive accessibility/contrast conformance were not tested.
- Pointer-triggered mobile saving/success could not be reached because D1 blocks submission. These states were inspected using actual keyboard operation, without forced DOM clicks or application changes.
- The deterministic error route cannot demonstrate an eventual successful recovery in the same route. Repeated failed retries, retention, and default-route success were verified independently. No real backend, reload persistence, or cross-session persistence is claimed.
- No recording was made. Timing evidence is in mutation timelines; screenshot evidence covers rendered spatial states. Screenshot capture may not show every instant between those observations.
- Evidence scripts: [review-browser.cjs](output/playwright/review-browser.cjs), [mobile-review.cjs](output/playwright/mobile-review.cjs), [followup-review.cjs](output/playwright/followup-review.cjs). Run with `node` from the workspace using the same prepared browser permissions. The initial script intentionally retains its ordinary mobile click failure; the mobile script continues coverage without bypassing that defect.
- Raw state evidence: [desktop results and initial mobile state](output/playwright/review-results.json), [mobile results](output/playwright/mobile-results.json), [follow-up results](output/playwright/followup-results.json). The screenshots linked in this report were opened and visually inspected.

This is a bounded rendered review of the supplied settings surface. The application remains unchanged, with both findings outstanding.

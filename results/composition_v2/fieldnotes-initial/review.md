# Field Notes Studio Day — independent rendered review

- Reviewer: `/root/independent_browser_review`
- `review_mode: independent`
- `cycle: 0`
- `result: incomplete`
- `verification_status: verified`
- Route: `http://127.0.0.1:8765/`
- Date: 2026-09-17

The initial live review found two defects: the desktop event date collides with the title, and the mobile event-note panel hides and intercepts the reserve button. Required browser checks were performed; verified describes the evidence, not acceptance. The mobile pointer path was tested and failed. No application changes, force-clicks, correction cycle, or post-fix recheck were performed.

## Findings

### F1 — Mobile note covers the primary action

- **Kind:** observed defect
- **Severity:** blocker
- **Expected behavior:** Visitors at 375×812 can read and activate “Reserve my seat” using the normal pointer/touch interaction, with visible keyboard focus.
- **Observed behavior:** A fixed note occupies the lower viewport and covers almost all of the fixed reserve button, including its label. Normal clicking times out because `p.event-note` intercepts pointer events. Tab reaches the button, but only the lower edge of its focus ring is visible. This prevents the ordinary mobile pointer registration path. Enter/Space still submit from the focused button; that workaround does not make the pointer path usable.
- **Reproduction:** Open `/` at 375×812. Scroll down about 630 px to the registration form. Observe the persistent note covering the bottom action. Attempt a normal click on “Reserve my seat”; the click is intercepted. Alternatively enter Sam Rivera / `sam.example`, Tab through attendance to the button, and observe hidden button text/focus. The obstruction persists through validation and submitting states.
- **Evidence:** [Mobile form](output/playwright/12-mobile-form.png), [obscured button focus](output/playwright/13-mobile-submit-focus-obscured.png), [mobile validation](output/playwright/14-mobile-invalid-email.png), and the normal-click timeout in [interaction log](output/playwright/interaction-log.jsonl).
- **Smallest correction:** Keep the mobile note in document flow, or reserve a separate nonoverlapping area for the fixed action and note. Ensure the button label, full target, and focus outline remain visible and unobstructed. Preserve palette, typography, rounded panel, and current copy.

### F2 — Desktop date overlaps the hero title

- **Kind:** observed defect
- **Severity:** major
- **Expected behavior:** Visitors can read the event title and date/time as distinct text.
- **Observed behavior:** At 1440×900, “Saturday 24 October · 10:00–16:00” is drawn across the bottom line of the large serif title. The date/time and portions of “for making.” are difficult to read.
- **Reproduction:** Load `/` at 1440×900 and inspect the hero before interacting.
- **Evidence:** [Desktop initial full page](output/playwright/01-desktop-initial.png), [desktop initial viewport](output/playwright/02-desktop-skip-focus.png). Supporting live geometry: title y=173, height≈155; date y≈298, height=27, computed margin-top=-30px, placing the entire date box inside the title’s vertical extent.
- **Smallest correction:** Remove the negative desktop spacing on the event date and give it enough normal-flow separation below the title. Retain the accepted gradient and serif display treatment.

## Coverage and successful behavior

| Check | Actual coverage/result |
| --- | --- |
| Desktop rendering | 1440×900; initial viewport and full page inspected; page scrolled through registration/footer; title/date collision recorded. |
| Narrow rendering | 375×812; initial viewport/full page and scrolled form/footer inspected; note/button obstruction recorded. |
| Intermediate rendering | 768×1024 initial full page inspected because desktop/mobile composition differs. No collision or overflow observed at that width. Interaction flow not repeated at this optional width. |
| Horizontal overflow | Document scroll width equals viewport width at 1440, 375, and 768. Screenshots inspected visually. |
| Event information | Copy exposes date/time, address, online option, free attendance, and schedule. Readability fails for the desktop date as described in F2. |
| Desktop keyboard | Skip link via Tab/Enter; logical order name → email → attendance → reserve; Shift+Tab returns from email to name. Visible input and skip-link focus inspected. Enter and Space exercised. Keyboard-only in-person submission succeeds. |
| Desktop pointer | Name/email interaction, Online selection, reserve, personalized success, and reset succeed. Native option selection used Playwright’s selectOption. |
| Validation | Empty name/email and malformed email exercised at both required widths. Corrective messages appear; focus goes to the first invalid field; correction allows submission. |
| Loading | Brief “Reserving…” / “Saving your place…” state captured. Normal-motion timed samples found loading through ~252 ms and success by ~308 ms from click initiation. |
| Success | Jordan Lee, Morgan Chen, Avery Patel, Sam Rivera, Casey Wong, and Alex Kim test registrations produced corresponding personalized name/email/attendance text. In-person and Online exercised. Success title receives focus. |
| Reset/repeat | Desktop keyboard reset and mobile pointer reset clear name/email and return focus to name. Subsequent registrations succeed. |
| Mobile pointer | Inputs and reset are operable. Reserve was attempted normally and intercepted; no forced click or direct event dispatch. |
| Mobile keyboard | Skip link, ordered Tab navigation, Enter/Space submission, corrective focus, success, and repeat registration exercised. Typing “o” on native attendance select chooses Online; “i” chooses In person. Button focus is obscured by F1. |
| Reduced motion | Mobile preference set to reduce; repeat registration succeeds. Timed samples show loading at ~215 ms and success at ~272 ms. Only the short submission wait was observed; no additional visible motion. |
| Runtime errors | Browser console/page-error collection remained empty. |

All 20 saved PNG screenshots were opened with `view_image` and visually inspected. Evidence metadata is in [observations.json](observations.json); actions, inputs, timing, browser outputs, and the pointer interception are in [interaction-log.jsonl](output/playwright/interaction-log.jsonl). [Browser helper](output/playwright/review-browser.cjs) uses the supplied installed Playwright and Chromium without dependency installation.

## Independence and limits

The reviewer began with only `rendered-review.md`, the supplied brief/accepted constraints, URL, and browser instructions. The Playwright skill was read for operating guidance. No repository source files, implementation plans, fixture README, previous reports, or other test results were read. Live DOM labels, focus, geometry, and computed styles supported browser observations after the initial visual defect was seen; one active-element diagnostic returned the body including its inline script. No separate source investigation was needed.

This is a bounded Chromium desktop/narrow-viewport review, not comprehensive accessibility conformance. A physical touch device, on-screen keyboard, screen reader, other browsers, zoom/text enlargement, and exhaustive edge-case inputs were not tested. Narrow-screen pointer behavior was exercised using a mouse in a resized browser, not hardware touch emulation. No real booking or email delivery was attempted or asserted. All visits and submissions were local. These optional limits do not hide the tested mobile pointer failure or downgrade it to an untested condition.

Accepted purple gradient, serif display, restrained rounded form panel, and current copy were preserved. There are no style-preference findings.

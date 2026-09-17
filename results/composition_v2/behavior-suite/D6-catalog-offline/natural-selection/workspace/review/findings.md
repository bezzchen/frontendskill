# Independent rendered review

Reviewed the running page before inspecting application source. Used only the supplied `node browser.cjs <config>` launcher at http://127.0.0.1:8864. All successful runs used a 375 × 812 viewport. No application files were edited for this review.

## Observed results

- **Reduced motion:** `narrow-reduced.json` with `reducedMotion: "reduce"` captured the original open-book illustration immediately, with no paper leaves covering it. Heading, descriptive text, workshop dates, labels, and native form controls remain legible. The full-page screenshot shows a single column with no visible horizontal overflow.
- **Required fields:** `required.json` clicked Reserve a place with empty fields. The browser focused `#guest-name`; there was no confirmation. `required.png` shows the orange focus outline and a native required-field message.
- **Booking:** `booking.json` filled Sam Binder / sam@example.com and selected 18 October · 14:00. Clicking Reserve a place produced “Thanks, Sam Binder. Your place is reserved for 18 October · 14:00.” Focus moved to `#confirmation`. `booking.png` shows the result without clipping.
- **Keyboard focus and submission:** `keyboard.json` confirmed the first Tab focuses `#guest-name`, visibly outlined in `keyboard.png`. `keyboard-valid.json` traversed name, email, session, and submit using Tab, with supported fill/select actions supplying values. `keyboard-valid-focus.png` shows a clear outline around the submit button. Enter submitted successfully and focused the confirmation.
- **Normal motion:** `narrow-motion.json` captured closed paper leaves in `narrow-motion-early.png`, then the revealed original book in `narrow-motion-middle.png` and the settled capture. Captured leaves remained inside the illustration area and did not cover heading, workshop dates, or booking controls. Text and form placement remained consistent in the captured states.
- Successful launcher output contained no console error events.

## Limits and execution notes

- This was a narrow desktop browser viewport, not true touch-device emulation. The supplied launcher has no touch emulation action. Real-device touch, mobile keyboard, and mobile native select interaction remain unverified.
- The launcher provides no background-tab switching, screen-reader audit, or direct DOM geometry inspection. Background resume and exact hit-target measurements were not tested.
- An exploratory `keyboard-submit.json` sequence using ArrowDown twice on the native select did not commit a selection; submission returned focus to the required session control. The successful keyboard submission used the launcher's select action, so native dropdown arrow-key selection is not claimed verified.
- The initial sandbox browser launch failed with macOS MachPort permission denial. The normal sandbox escalation allowed launch. An initial boolean reducedMotion config was rejected by the launcher; corrected to the supported string `"reduce"` before successful checks.
- Screenshots establish sampled states, not a frame-by-frame timing or performance measurement. Exact 1250 ms duration and one-shot CSS behavior require source inspection outside this rendered-only review.
- The first reduced-motion screenshot preceded the parent's correction to the first workshop option; subsequent form and keyboard runs exposed both session labels and successfully selected 18 October.

No blocking visual or booking regression was observed within this review's supported scope.

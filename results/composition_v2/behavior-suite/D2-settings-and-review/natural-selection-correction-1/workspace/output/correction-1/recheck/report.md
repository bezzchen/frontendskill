# Independent rendered recheck

- review_mode: independent
- reviewer: /root/rendered_recheck
- correction_cycle: 1 of maximum 2
- result: pass
- verification_status: verified
- remaining observed defects: none within the checks below

Read the brief, accepted design contract, project instructions, supported launcher, and rendered-review instructions. Operated the live interface before inspecting any application source; no application source inspection was needed. Did not read the builder's work log or review findings. No application files were changed.

## Actual coverage

| Check | Observed result | Evidence |
| --- | --- | --- |
| Desktop, 1440×900, primary mouse save | Changed name and kiln preference; Saving state then Settings saved. | evidence.json, desktop-pointer-pending.png, desktop-pointer-complete.png |
| Empty and whitespace, desktop and 390×900 mouse | Inline required message, invalid input state, and focus on name. | evidence.json, mobile-input-evidence.json, empty.png, whitespace.png, mobile-empty.png, mobile-whitespace.png |
| Length boundary | Attempted 61 characters; native input limited value to 60; 60 characters saved successfully. | evidence.json, length-60-complete.png |
| Service failure and mouse retry, desktop and 390×900 | Error explained retained changes; name and unchecked preference retained. Set service mode to success and clicked Save; success followed. | evidence.json, mobile-input-evidence.json, desktop-error-complete.png, desktop-retry-complete.png, mobile-pointer-error.png, mobile-pointer-retry.png |
| Keyboard, desktop and 390×900 | Tab order name → checkbox → save; Shift+Tab reversed order. Space toggled checkbox and activated Save. Enter from name submitted. All three controls showed visible focus rings. | evidence.json, mobile-input-evidence.json, keyboard-*-focus.png, mobile-keyboard-*-focus.png, mobile-keyboard-space-saved.png, mobile-keyboard-enter-saved.png |
| Emulated touch, 390×900 | Touch save, failure with retained values, and retry succeeded. | evidence.json, phone-touch-pending.png, phone-touch-complete.png, phone-error-complete.png, phone-retry-complete.png |
| Narrow layout and header | Visually readable at 389, 390, 391 pixels, with no overlapping header or controls. scrollWidth equaled viewport width at each checked size. 768px layout also fit. | boundary-evidence.json, boundary-389.png, phone-initial.png, boundary-391.png, boundary-768.png |
| Pointer hit testing, 390×900 | Center, near top-left, and near bottom-right all hit Save and activated successful saves. | boundary-evidence.json, pointer-corner-saved.png |
| Short phone, 390×600 | Scrolled full surface; document height 786px and scroll position 186px at bottom. Save remained accessible and completed. | evidence.json, phone-short-top.png, phone-short-bottom.png, phone-short-complete.png |
| Timing and motion | Primary script observed resolution 616–671ms after activation, consistent with a 600ms service plus browser overhead. Saving state was captured. Reduced-motion save succeeded; no active animations after completion. | evidence.json, boundary-evidence.json |
| Console/runtime | No captured console messages or page errors in any completed script. | All three final evidence JSON files |

Visually inspected desktop initial, pending, success and all desktop focus captures; phone initial, pending, error, retry, required validation, all phone focus captures, short-phone bottom, and 389/391/768 boundary captures. Warm paper/earth presentation, system typography, square controls and single-column hierarchy remained legible in these views. Geometry confirmed 0px control corner radii at 389, 390, 391 and 768px.

## Execution notes and limits

Used the exact prepared Playwright package and Chromium executable specified by browser.cjs. Initial sandbox launch failed with the Chromium Mach port permission error; normal sandbox escalation allowed the supported browser to run. No launcher, browser, application or service modifications were made. Only runtime service mode was changed for the requested retry scenario.

Three partial harness runs are preserved as harness-first-attempt.json, harness-second-attempt.json and harness-third-attempt.json. The first two checked native disabled state instead of the rendered Saving state on a button using an ARIA disabled state; the third expected an overlength validation error where native maxlength correctly capped input at 60. These are corrected diagnostic assumptions, not application defects or additional correction cycles. Final review.cjs, boundary.cjs and mobile-input.cjs all exited 0.

This is a bounded Chromium review of local prototype state. Physical phone hardware, screen-reader announcement behavior, other browser engines, reload persistence, real backend saves and comprehensive accessibility conformance were not tested or claimed. Touch was emulated. No required review condition remains untested.

# Independent rendered review

- review_mode: independent
- reviewer: /root/rendered_review
- result: pass
- verification_status: verified
- correction_cycle: 0
- Route: http://127.0.0.1:5173/
- Contract: design/signup-contract.md
- Browser: installed Chromium headless shell via Playwright

Reviewed the live interface before inspecting any application source. No application source inspection or changes were needed. Screenshots were opened and visually inspected at desktop 1440 × 900, intermediate 768 × 1024, and phone 375 × 812; complete page captures include content below the fold. Phone controls were also reached using keyboard scrolling and pointer interaction.

## Observed defects

None observed. No remaining blocker, major or minor findings in this bounded review.

## Stylistic suggestions

None. The accepted moss/stone palette, Arial typography, calm noticeboard composition and existing control styling are coherent and preserved.

## Actual checks and evidence

- Initial state: clear remaining places and total capacity; full Compost crew visibly marked and its native radio disabled. Desktop two-column and phone one-column compositions showed no clipped/colliding content or horizontal overflow. Evidence: review-desktop-initial.png, review-tablet-initial.png, review-phone-initial.png.
- Empty submission: both errors displayed, focus moved to first available shift. Selected shift plus whitespace contact name remained invalid and focused contact name. Evidence: review-desktop-errors.png, review-phone-errors.png, review-log.json.
- Successful desktop submission: surrounding whitespace trimmed from Taylor Sample; confirmation displayed correct shift, date/time and contact name and focused confirmation heading. Evidence: review-desktop-confirmed.png, review-log.json.
- Phone selection and confirmation with Morgan Demo: all required details visible; reset cleared name and selection. Evidence: review-phone-confirmed.png, review-responsive-log.json.
- Keyboard-only desktop completion and restart used Tab, Space, ArrowDown, Shift+Tab and Enter. Focus order progressed through shift selection, name, confirm, then confirmation/reset. Confirmation and reset headings received focus. A separate phone keyboard flow also completed. Visible focus was inspected on radio, text input, confirm and reset controls. Evidence: review-desktop-keyboard-focus.png, review-phone-field-focus.png, review-phone-button-focus.png, review-phone-reset-focus.png.
- Capacity: four Morning planting signups consumed four places, then radio became disabled and displayed Full / 0 available / 12 total. Previous Path and bed care signup had reduced its count by one. Reload restored capacities and blank personal details. Evidence: review-phone-depleted.png, review-responsive-log.json.
- Reduced-motion preference: selected and confirmed successfully. No continuous or entrance animation observed during normal or reduced-motion interactions; no temporal effect needed separate motion analysis.
- Runtime: no page errors, all observed browser requests were localhost asset GETs; confirmation made no external signup request. Evidence: review-log.json.
- Reproduction scripts: review-flow.cjs, review-responsive.cjs, review-focus.cjs.

## Environment recovery and limitations

Initial sandboxed Chromium launch failed with macOS bootstrap permission denial; normal sandbox escalation succeeded. The supplied URL initially refused connections; starting the existing Vite preview on port 5173 recovered access (server session 1548).

This is bounded Chromium UI verification, not comprehensive accessibility conformance. Screen-reader software, other browsers, real touch hardware and production deployment were not tested. The local synchronous demo has no loading/network-error state to exercise. Build validation remains the builder's responsibility. No real reservation or personal data submission occurred; only fake names were used.

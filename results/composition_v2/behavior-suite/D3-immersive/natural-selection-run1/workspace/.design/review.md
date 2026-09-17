# Independent rendered review

Reviewed the running observatory against `.design/contract.md` and the original imaginary migrating moon brief. Operated the interface before source inspection. Browser: locally cached Chromium headless, launched with normal sandbox escalation after sandboxed launch failed with macOS Mach-port permission denial.

## Verdict

Pass with a minor explanatory-copy recommendation. No blocking functional or layout defects observed. The large textured moon, restrained orbital instrument lines, editorial title, and changing scene create a distinct spatial encounter. Arrival, alignment, and departure have visible changes in moon position, scale, lighting, trail, and supporting copy. The revised phone layout keeps a compact moon preview visible while using the controls.

## Observed checks

- Desktop 1440×900, phone 375×812, tablet 820×1180: no horizontal overflow and no captured JavaScript page errors.
- Chapter controls selected alignment 50, departure 90, and arrival 12; field-note headings updated correspondingly.
- Native range keyboard operations: viewpoint Home/End yielded −30/+30; passage End yielded 100 and Home then ArrowRight yielded 1. Reset returned passage 12 and viewpoint 0.
- Star guides toggled `aria-pressed` from true to false.
- Normal playback advanced passage 12 to 13 during the short observation window; manual pause held the value.
- Phone with reduced motion: static canvas remained identical while idle; chapter/range controls remained operable; “Next chapter” advanced directly to alignment 50.
- Field guide opened with focus on its close button; Escape closed it and returned focus to the initiating Field guide button. Repeated Tab did not reach background controls. Chromium reports BODY while focus passes through browser chrome; this is not evidence of a background-focus defect.
- Phone guide fits within the viewport and its final content is reachable by internal scrolling (82px scroll range observed).
- Fresh-page keyboard test showed the skip link visibly at top 20px on Tab; Enter targeted the passage input.
- Latest phone and tablet captures were made after reloading the revised sticky-preview layout.

## Minor finding

**Low — reduced-motion guide copy does not name its replacement control.** With reduced motion enabled, the main playback action correctly becomes “Next chapter,” but the guide still has a “Let it wander” heading and says “Play the passage, or pause it wherever you like.” The subsequent reduced-motion sentence explains removal of animated transitions but not the replacement action. Consider adding “With reduced motion, Next chapter moves directly between moments.” Evidence: `output/playwright/reviewer-reduced-guide.png`; operated reduced-motion control reported “Next chapter.”

## Evidence and limits

`output/playwright/reviewer-results.json` records the main check results. `reviewer-check.cjs` is the repeatable browser script. Screenshots under `output/playwright/reviewer-*` cover initial renders, each chapter, modal, and phone keyboard focus. The initial `reviewer-desktop.png` precedes the mobile revision; all `reviewer-*-initial.png` and chapter captures were refreshed afterward.

This review did not test actual screen-reader speech, physical touch devices, Safari/Firefox, or background lifecycle behavior. Parent agent owns real scrolling/background lifecycle verification. Reduced-motion idle rendering was checked by comparing canvas data over 500ms; this does not claim exhaustive animation scheduling instrumentation. Phone appearance was checked via browser viewport emulation, not a physical device.

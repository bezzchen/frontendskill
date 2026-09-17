# Independent rendered review

Verdict: PASS for reviewed layout and exercised interactions. Review completed; visual color verification has the limited capture ambiguity below. No confirmed actionable application defect.

Scope and independence: Read brief.txt, design-contract.md, AGENTS.md and browser.cjs, then operated the live page before reading application source. Did not read builder work logs or prior review findings. Used the supplied Playwright library and exact Chromium executable. The initial sandbox launch failed with macOS Mach rendezvous permission denial; the normal sandbox escalation allowed subsequent browser runs.

## Verified

- At 1440×900 the studio eyebrow, heading, introduction, bordered white panel, display-name field, preference and save action form a clear hierarchy. Paper/ink/terracotta styling and square controls remain recognizable. Evidence: desktop-normal.png and desktop-focus-save-verified.png.
- At 390×900 the panel has modest padding, the save button spans the field width (306×48px), labels and explanations wrap naturally and all primary content fits. No document horizontal overflow at 390, 375 or 320px. At 320px the heading wraps cleanly. Evidence: mobile-normal-verified.png, mobile-375-verified.png, mobile-320-verified.png; evidence.json contains measurements.
- Tab moves name → checkbox → save, Shift+Tab returns to checkbox, and Space toggles the checkbox. All three controls receive visible 3px focus outlines. Checkbox label measures 44px high on desktop and 68px at 390px. Evidence: desktop-focus-name-verified.png, desktop-focus-checkbox-verified.png, desktop-focus-save-verified.png.
- A whitespace-only name produces the inline instruction and save-area correction message, with focus moved to the name field. Feedback does not overlap controls. Evidence: mobile-invalid-verified.png.
- Pointer save at 390px shows pending text followed by success, trims “  Clay & Co  ” to “Clay & Co”, and preserves unchecked alerts. Touch emulation can tap the checkbox label and save successfully with “Touch studio”. Pending controls match :disabled through the disabled fieldset. Evidence: evidence.json, mobile-pending-pointer-verified.png, mobile-success-pointer-verified.png, mobile-pending-touch-verified.png, mobile-success-touch-verified.png.
- The error route shows a readable failure message while retaining “River retry”. Changing the provided service mode to success then activating Save succeeds. Feedback wraps within the panel. Evidence: mobile-error-verified.png and mobile-retry-success-verified.png.
- Current computed pending-button color is rgb(134,85,65), white text, opacity .7. A separate fresh pending capture visibly matches that terracotta treatment: pending-color-check.png and color-check.json.

## Limits and capture ambiguity

- Some multi-state screenshot artifacts display the pending button as blue and error text brighter red, despite the same captures' computed-style evidence reporting the expected terracotta button and current CSS containing only the expected tokens. The separate fresh pending screenshot is terracotta. The discrepancy remains unlocalized; these artifacts are not sufficient evidence of a CSS defect. Pending brand-color consistency across every rendered capture is therefore **unverified**, not an unconditional visual pass.
- This independent review did not test Enter submission, maximum name length, duplicate-save call counts, stale-outcome clearing, screen-reader announcements, zoom, forced colors or non-Chromium browsers. Coordinator diagnostics own the broader behavioral checks; no conclusions from them are included here.
- Touch was Playwright mobile/touch emulation, not physical hardware or a mobile operating-system keyboard. Local save service behavior is a prototype, not backend persistence.

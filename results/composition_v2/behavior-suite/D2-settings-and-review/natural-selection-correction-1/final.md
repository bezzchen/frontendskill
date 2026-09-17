Fixed both defects by removing one CSS override: Save now receives pointer input, and the mobile heading no longer overlaps the introduction. Approved styling and functional flow are preserved.

Cycle 1 passed independent browser checks for save, validation, error/retry, 390px layout, touch, and keyboard focus. `npm run check` passed.

Actual evidence and limitations are recorded in [work-log.md](/Users/bezzchen/Documents/Codex/2026-09-16/take-x20/work/v2-behavior/D2-settings-and-review/natural-selection-correction-1/workspace/work-log.md). Coverage used Chromium and emulated touch; saves remain local prototype state.
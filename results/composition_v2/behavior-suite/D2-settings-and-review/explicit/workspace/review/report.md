# Independent rendered review

Status: PASS after correction cycle 1. The one observed validation defect is resolved; no outstanding observed defects. Reviewed the live UI before inspecting application source. Used only the supplied `node browser.cjs <config>` launcher.

## Observed defect — resolved

- Display names at the length boundary can be silently truncated. `trim-boundary.json` fills two spaces, 60 A characters, and two trailing spaces; after save, `trim-boundary.log` reports only 58 A characters and a success message. `long-invalid.json` fills 61 x characters, but `long-invalid.log` reports 60 and a pending save instead of the length error. Subsequent source inspection identifies `maxlength="60"` on the input, which limits the raw value before the trimmed-length validator can act. Correction cycle 1 removed the raw limit. Rerunning the same browser configs confirms all 60 A characters are preserved after trimming (`trim-boundary-corrected.log`), while 61 x characters remain intact and show the length error with focus on the name field (`long-invalid-corrected.log`). Before and after logs are retained.

## Passing observations

- Desktop 1440×900: readable hierarchy, studio paper/ink/clay palette, square controls, visible keyboard focus (`desktop.png`). Tab reaches name, checkbox and save; Space changes the preference (`desktop.log`).
- Phone 375×812: comfortable padding, full-width save action and legible label wrapping; initial, validation, pending and success screenshots remain within the viewport.
- Phone 320×812: failure feedback wraps without visible horizontal clipping and remains within the viewport (`mobile-error.png`).
- Whitespace-only name shows inline validation and focuses the field (`mobile-invalid.log`).
- Saving is visibly distinguished with disabled-looking controls and pending copy (`mobile-pending.png`); success appears after waiting and trims the name (`mobile-success.log`). Failure preserves the exact entered name and checkbox preference (`mobile-error.log`).
- Mobile Tab, Shift+Tab, Space and Enter operate the form; Enter saves successfully and focus returns to the save button (`mobile-keyboard.log`).
- Editing after success replaces stale feedback with the unsaved message (`edit-after-success.log`). Retrying a failed request visibly enters pending again; editing after failure clears stale failure copy (`retry-pending.png`, `retry-error.log`).
- No console error events were reported in these browser logs.

## Preferences

No optional visual changes requested. The restrained presentation supports the existing studio identity.

## Limitations

The first sandboxed browser launch failed with the host Chromium permission error; browser checks then succeeded through normal sandbox escalation. Screenshots verify visible clipping, not measured document scroll width. The supplied output does not expose disabled attributes, saved service payloads or request counts, so duplicate blocking and payload persistence are not independently established here. Screen readers, physical touch, browser zoom and forced colors were not tested. Review covers Chromium at the stated viewports.

# Clay House settings — correction cycle 1

Date: 2026-09-17. Scope: repair the two evidence-backed defects from `review-findings.md`, preserving the accepted `design-contract.md`. Cycle 1 of maximum 2; no new design approval needed.

## Correction

Both defects originated in the only rule in `checkpoint.css`, scoped to 389–391px. Removed that rule and left a comment pointing to the existing responsive styles. Its `translateY(-38px)` caused D2's heading/introduction collision; its absolutely positioned `.actions::after` intercepted Save for D1. This restores the existing mobile layout without adding overrides. No functional JavaScript, markup, brand tokens, typography, square controls, or service behavior changed.

Before correction, the supported browser successfully captured `output/cycle-1/before-390.png`; visual inspection confirmed the collision. A normal locator click timed out with `.actions` intercepting pointer events, recorded in `output/cycle-1/before-pointer.log`. The original independent review remains unchanged.

## Actual checks

Application: `http://127.0.0.1:8871/`, started with `npm start -- 8871`. `npm run check` exited 0. The supported `node browser.cjs output/cycle-1/before.config.json` captured the initial page. Additional diagnostics use exactly the prepared Playwright library and Chromium executable from `browser.cjs`; neither launcher nor browser was changed or installed.

`node output/cycle-1/check.cjs` exited 0. Assertions and observations are saved in [checks.json](output/cycle-1/checks.json); runner output is [check-run.log](output/cycle-1/check-run.log). This coordinator pass is self-review, supported separately by a fresh independent reviewer under `output/cycle-1/independent/`.

| Check | Actual result |
| --- | --- |
| D1: 390px pointer and touch | Normal mouse click and emulated touch tap both completed saving. Hit testing resolves to `save-settings`. Full-width button measures 306px, equal to its action container. |
| D2: 390px heading hierarchy | Introduction starts at y=130.89, heading ends at y=110.89: 20px separation. Visually inspected corrected default, pending, error and keyboard-focus captures; text is legible without collisions. |
| Desktop and 390px primary flow | Name `  River Clay Studio  ` saves as `River Clay Studio`, unchecked kiln preference persists in the local service. Pending appears first; success follows the actual instrumented service completion at approximately 601ms. Success remains after an additional 800ms. |
| Pending and duplicate prevention | Name, checkbox and button all match `:disabled`. A further Enter and pointer click during pending cause no duplicate service call; exactly one call was recorded. |
| Validation at 1440px and 390px | Empty, whitespace-only and 61-character ASCII names rejected, inline error visible, `aria-invalid=true`, name focused, description IDs resolve, no service call. 60 characters and padded one-character name accepted and trimmed. |
| Error/retry at both widths | `?save=error` retains the exact untrimmed edited name and checkbox choice and re-enables Save. Checkbox editing clears stale failure feedback. Changing the service's supported mutable mode to success allows a successful retry with current values. Name editing clears stale success feedback. |
| Keyboard at both widths | Tab visits name → checkbox → Save; Shift+Tab reverses. Space toggles checkbox and submits the button. Enter submits from the name. Successful completion restores Save focus. All three controls have visible orange 3px outlines with 4px offset, captured individually. |
| Responsive sweep | Live resize and pointer save at 320, 375, 388, 389, 390, 391, 392, 600, 601 and 1440px passed. No horizontal overflow; heading/introduction retain 20px separation. Save fills its container at <=600px. |
| Short viewport and reduced motion | At 390×400, scrolled to Save and completed submission. At 390×900 with reduced motion, pointer save passed; zero active Web Animations. |
| Runtime | No page errors or console errors during the diagnostic run. |

Representative captures: [before](output/cycle-1/before-390.png), [corrected 390px](output/cycle-1/390-default.png), [pending](output/cycle-1/390-saving.png), [touch success](output/cycle-1/390-touch-success.png), [validation](output/cycle-1/390-invalid.png), [failure](output/cycle-1/390-error.png), [retry success](output/cycle-1/390-retry-success.png), [keyboard focus](output/cycle-1/390-focus-save-settings.png), [desktop](output/cycle-1/1440-default.png). Captures of other states/widths are in the same directory.

## Limitations and environment

Initial server binding and Chromium launching were blocked by the sandbox. Normal escalation succeeded; all reported browser results come from successful subsequent launches. There was no automatic approval rejection. The directory is not a Git repository, so Git status/diff was unavailable; application correction is confined to `checkpoint.css`.

This is a bounded Chromium review, not comprehensive accessibility certification. Touch is emulated; no real phone, mobile keyboard, screen-reader speech, Safari or Firefox was tested. Validation boundaries use ASCII; alternate Unicode character-count conventions and exhaustive zoom/contrast coverage were not tested. The responsive sweep covers layout/pointer completion, not every state at every width. The service persists only local prototype state; reload durability and remote persistence are outside this application. The diagnostic service wrapper records real calls and completion without changing timing or outcomes; failure-to-success retry explicitly uses the supported service mode switch.

## Skill and decision provenance

Read the project `.agents/skills/creative-frontend-architect/SKILL.md` and its `references/rendered-review.md`; reused the existing accepted contract and its settled studio director and Q/native HTML/CSS/JavaScript architecture. No director fallback, external catalogs, new visual system or upstream director was needed. Read `brief.txt`, `design-contract.md`, `review-findings.md`, `AGENTS.md`, `browser.cjs`, `package.json` and the application source. Also read host `using-superpowers`, `systematic-debugging`, and `verification-before-completion` skills. No external skill installation or upstream source lookup occurred.

SHA-256 provenance:

```text
abeb51e1c1a769366ea7ea134b85b0d2acfa00aeaa16d3ac565adc5dd72883e5  .agents/skills/creative-frontend-architect/SKILL.md
463b94a54dec590a412dc9dc98deb7b2f3ecac6ce20639c1940c8113ec9b1194  .agents/skills/creative-frontend-architect/references/rendered-review.md
d2f0abf28883b5cd6321c74bb7af6058084decf5cc2e1e8491533e9ba011c206  design-contract.md
bfeb213ee01b7d259605bb0403b69532debbac6696a21c97b159cf6e44784691  brief.txt
0545a37cf27999d0796236a4809e64550318623d47ee24d033015a8b385c51bb  review-findings.md
85fc23365be21ad7e94386b12789eb6635ef66dfb2d7b146e00224627376485d  checkpoint.css
55379fe7c1c473a02c61961c822996bff30e1320d6921d9062509bc508482c05  /Users/bezzchen/.codex/skills/using-superpowers/SKILL.md
3b20719eca4f0461cb51a195221320d775dcf03b6859271066a03a5132a6ce7a  /Users/bezzchen/.codex/skills/systematic-debugging/SKILL.md
ea52d15aabaf72bc6b558efe2c126f161b53961090ddcd712000273bfe8c7b6c  /Users/bezzchen/.codex/skills/verification-before-completion/SKILL.md
```

## Cycle 1 outcome

```yaml
correction_cycle: 1
maximum_cycles: 2
review_mode: self-review with separate independent rendered review
result: pass
verification_status: verified
scope: reported defects and requested functional/responsive/keyboard rechecks
```

D1 and D2 are resolved in fresh live checks; no remaining blocker or major defect was observed. A second correction cycle was not needed. The [independent review](output/cycle-1/independent/review.md) also passes its exercised layouts and interactions, including pointer/touch completion. It reports an unresolved artifact-color discrepancy in some of its multi-state screenshots: they appeared blue/red despite expected computed styles and a separate terracotta pending capture. Cross-capture color consistency in that review remains unverified; it is not labeled a confirmed application defect. Coordinator captures `390-saving.png` and `1440-saving.png` visibly retain the existing terracotta pending treatment, and the only application change removes the two faulty responsive overrides. This bounded pass does not claim the independent artifact discrepancy is resolved or extend beyond the checks and limitations recorded above.

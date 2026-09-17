# Independent rendered review — Moonward

- review_mode: independent
- reviewer: `/root/rendered_review`
- result: incomplete
- verification_status: unverified
- correction_cycles: 1
- route: `http://127.0.0.1:8313`
- browser: installed Chromium headless shell, Playwright

The independently exercised rendered experience has no remaining blocker or major defect. The overall contract remains unverified because an actual hidden-document state could not be established in the coordinator's browser environment. This is a verification limit, not an observed product defect; this report does not declare a contract-wide pass.

## Live coverage

Operated the interface before source inspection. Viewed full-page screenshots at 1440×900, 768×812, 375×812, and 320×812. All four widths fit their viewport horizontally and the notebook/footer remain readable without text collisions. Desktop and phone screenshots show materially different moon position, size, trail, and alignment indicators across Arrival, Alignment, and Departure.

- Selected all three stage buttons at all four widths. At Alignment, Center produced `Reference locked`; bearing changes released it. Desktop drag changed bearing from 0 to −6.
- Native slider keyboard Home/ArrowRight yielded passage 1 and bearing −29. Enter on Alignment and Space on Center completed the lock without a pointer. Tab order moves from skip link/navigation into scene actions and instruments; the passage focus ring is clearly visible.
- Opened the guide on desktop and mobile, inspected its rendered contents, and operated close/return. Escape restored focus to the guide opener; “Back to the telescope” focused the passage input. Native modal navigation stayed among dialog controls/browser chrome without reaching background page controls. No screen reader was run.
- Reduced-motion load showed Motion off. Two full-page images captured 500 ms apart were byte-identical, while stage and bearing controls remained functional. Normal-motion canvas images 300 ms apart differed. Runtime preference changes observed after 250 ms changed Motion off/on correctly.
- Rechecked mobile telescope entry and stage transitions after localized corrections. At 375×812 and 320×812 the aligned moon, state explanation, and both instruments are visible together. Both range inputs have 44 px height.
- No page errors were observed in the interaction run.

Evidence: `output/playwright/review-interactions.json`, `review-extra.json`, `review-cycle1.json`; screenshots `review-desktop-initial.png`, `review-desktop-locked.png`, `review-desktop-departure.png`, `review-desktop-guide.png`, `review-keyboard-focus.png`, `review-768-arrival.png`, `review-768-locked.png`, `review-375-arrival.png`, `review-375-locked.png`, `review-320-arrival.png`, `review-mobile-guide.png`, `review-reduced-a.png`, `review-reduced-b.png`, `review-motion-a.png`, `review-motion-b.png`, and `review-cycle1-*.png`. The 768 px full-page image includes the focused skip link during keyboard navigation; this is its intended visible focus state.

## Resolved finding — mobile guide name

- Kind: observed defect
- Severity: minor
- Expected behavior: the guide opener retains a descriptive accessible name on phones.
- Observed behavior: at 375 px the visible “How to observe” span was hidden with `display:none`; lookup by its descriptive accessible name failed. Source inspection then confirmed the remaining question mark was `aria-hidden`, leaving no descriptive name.
- Viewport/state and reproduction: 375×812, initial page, locate the guide opener by accessible role/name.
- Evidence location: initial responsive render `output/playwright/review-375-arrival.png`; source diagnosis was `index.html` guide button and the <=700 px style rule. The initial failed lookup did not write a separate failure log; this evidence limitation is explicit.
- Proposed smallest correction: add `aria-label="How to observe"` to the existing button.
- Correction and recheck: coordinator added that label. Cycle 1 accessibility snapshot is `button "How to observe"`; role/name click opens the guide. Evidence `review-cycle1.json`. Resolved.

## Coverage boundaries

Offscreen suspension, real document hiding, and navigation teardown were assigned to the coordinator, not independently repeated. Coordinator reports actual scroll-out stop/resume and pagehide teardown evidence in `output/playwright/verification.json`. Attempts to switch tabs and minimize a headed browser still reported `document.visibilityState === 'visible'`; actual hidden-document suspension remains externally required and unverified, with attempted evidence in `output/playwright/visibility.json`.

No full assistive-technology, touch-device hardware, cross-browser, or content-fetch-failure exercise was performed by this reviewer. Native touch alternatives were inspected at phone widths; actual touch gesture scrolling was not independently exercised. No loading or validation/error UI was encountered in the supported encounter flow. These statements are bounded coverage, not comprehensive accessibility conformance.

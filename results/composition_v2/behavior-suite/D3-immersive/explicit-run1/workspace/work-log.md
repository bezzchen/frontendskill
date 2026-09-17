# Moonward Observatory work log

## Implementation

Built the requested digital observatory in the existing standalone HTML/CSS/JavaScript project. Start with `python3 -m http.server 8313 --bind 127.0.0.1` and visit http://127.0.0.1:8313. No compilation, package installation, remote font, generated-image service, backend, or external runtime is required.

- `index.html`: semantic observatory, narrative, native instruments, stage buttons, field notebook, skip link, and native help dialog.
- `styles.css`: nocturnal instrument palette, local serif/sans typography, desktop and mobile compositions, focus indicators, 44px phone slider hit areas, and reduced-motion scrolling.
- `scene.js`: procedural relief-lit Iona texture, layered star field, fixed guide stars, telescope reticle, passage trail, changing apparent distance, and parallax steering. Single renderer and animation clock. Texture baked once; pixel ratio capped at two.
- `app.js`: passage and bearing state, stage navigation, alignment lock, replay, accessible descriptions and live announcements, motion controls, system-preference updates, local content loading with complete fallback copy, modal focus behavior, and phone telescope entry framing.
- `content.json` remains the primary source of act titles and narratives. Both existing SVG assets remain in the notebook.

Visitors control all progression. At mid-passage, centering the telescope produces reference lock. Departure shrinks Iona into the western field and leaves a dotted trail. Dragging the sky is optional; native ranges and stage buttons provide equivalent control. On phones, Take the telescope and stage selection frame the moon above both instruments.

## Design and skill decisions

Applied `creative-frontend-architect` with its design contract, scoped Anthropic director adapter, architecture reference, and rendered-review reference. Read the supplied `.sources/frontend-design/SKILL.md`; its SHA-256 matches the pin `d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3`. The adapter SHA-256 is `750881b938bf2abc1bbb7893db504147aab2692987fa0333d3905b76fb646b7a`. Expected upstream revision is `34040c9c568585f6929bedeaad110ad08f079624`; actual repository revision is unknown. This is a scoped adaptation, not a full upstream workflow claim.

All loaded local references, their actual hashes, source roles and resolution details are recorded in `.design/provenance.json`. General brainstorming and verification guidance was read; the user's explicit instruction to choose and proceed overrides their unnecessary confirmation gates. No other design director was activated. The complete concept, tokens, boundaries, alternatives and acceptance conditions are in `.design/contract.md`.

Selected register **S — immersive realtime**. The scene is structurally central and changes materially with input. A 2.5D Canvas scene fits the bounded telescope view without adding a 3D engine.

Primitive sourcing was checked before custom rendering:

- [React Bits Galaxy](https://reactbits.dev/backgrounds/galaxy) and its [upstream implementation](https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Backgrounds/Galaxy/Galaxy.jsx): reference-only. React/OGL dependencies and continual callback scheduling do not fit this plain local stack. No source code copied.
- [Three.js sphere geometry substrate](https://threejs.org/docs/): considered, declined because arbitrary free-flight geometry is unnecessary here.
- Custom deterministic scene selected; supplied SVG artwork reused. No catalog or vendor was represented as supplying the project's visual identity.

## Actual checks and evidence

Used the installed Playwright Node module and cached Chromium executables specified by project guidance, without installing a CLI or dependency. Browser/server startup required normal sandbox escalation; both were allowed. The initial JavaScript syntax check found an exponentiation-parentheses error, corrected before browser testing.

- `node --check app.js` and `node --check scene.js`: passed.
- Desktop 1440×900 and phone 375×812 rendered screenshots inspected, including full-page layouts, alignment and departure.
- Actual buttons completed arrival → alignment → Center → reference lock → bearing change/unlock → departure → replay.
- Native ranges operated using ArrowRight, Home and End; expected range values, act text and lock status observed.
- Guide opened and closed with Escape; focus returned to the opener.
- Emulated system reduced motion stopped the renderer's frame count while retaining full stage/bearing/lock functionality. Reduced-motion scene updates are immediate.
- Actual page scrolling moved the canvas fully out of view. Its frame count remained unchanged and `running` became false. Returning to the sky resumed rendering.
- Actual navigation to `about:blank` triggered pagehide teardown: diagnostics recorded `destroyed: true` and `running: false` after the application listener ran.
- Zero JavaScript page errors in the interaction test.

Repeatable browser scripts and actual results:

- `output/playwright/capture.cjs`: baseline full-page screenshots.
- `output/playwright/verify.cjs` and `verification.json`: primary flow, native keyboard input, modal behavior, reduced motion, actual scroll-out, resume, teardown, and mobile instrument geometry.
- `output/playwright/visibility.cjs` and `visibility.json`: separate actual background/minimize attempts.
- `desktop-arrival.png`, `mobile-arrival.png`, `alignment-desktop.png`, `departure-desktop.png`, `mobile-telescope.png`, and `mobile-alignment.png` in `output/playwright/`.

A fresh reviewer was delegated by the skill's explicit rendered-review instruction, with the original brief, contract, URL, testing access, and evidence location rather than builder self-assessment. Review output: `.design/review.md`; independent evidence uses `output/playwright/review-*`. A missing accessible name on the mobile help button was corrected with an explicit label. The mobile lock caption was deduplicated; telescope-entry framing and touch target sizing were refined and rechecked.

## Limitations and honest coverage

**Actual hidden-document behavior remains unverified.** In headed Chrome, opening/focusing another tab and then minimizing the test browser window still left `document.visibilityState` at `visible`. A second run removed Playwright's backgrounding-related default arguments, with the same result. The owned visibilitychange handler cancels the renderer when `document.hidden` is true, but this environment did not produce that real condition. No synthetic visibility event was used or presented as proof. `visibility.json` records `verified: false`.

Browser interaction and responsive checks use Chromium. Real iOS/Android devices, Safari, Firefox, screen-reader output, and bfcache restoration were not tested. Native keyboard semantics and text alternatives were checked, not comprehensive accessibility conformance. No external service, publishing, git push, or global installation was performed. This workspace has no Git repository.

## Final rendered review outcome

Independent review completed one correction-and-recheck cycle. At 1440×900, 768×812, 375×812, and 320×812 there were no remaining blocker or major usability defects. The reviewer additionally observed drag steering, keyboard Enter/Space alignment, visible focus, reduced-motion screenshots remaining byte-identical, and normal-motion screenshots differing over time. The corrected mobile guide accessible name and mobile telescope framing passed recheck.

The rendered-review report conservatively records `result: incomplete` / `verification_status: unverified` solely because the required actual hidden-document condition could not be produced. Implementation and all other listed live checks are complete. That outstanding verification is explicitly preserved rather than converted into an unsupported pass.

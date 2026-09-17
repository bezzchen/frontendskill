# Fold & Thread — folding-paper opening

## Brief and design contract

Add a folding-paper reveal to the opening while keeping dates, text and booking controls semantic, usable on touch and available with reduced motion. The user delegated implementation choices and instructed us to proceed.

- Preserve `styles.css` ink/paper tokens, Georgia headings, all workshop content, the original `assets/book.svg` and local booking behavior.
- Concept: a single sheet opens along two folds to reveal the notebook. Concentrate motion on the illustration; headline, dates and form stay in normal document flow throughout.
- Register: W (expressive opening); booking remains Q (native task controls). Native CSS perspective/transforms own the fold. JavaScript owns only activation and cleanup. No canvas, realtime renderer, dependency or installation.
- Keep the existing 420px illustration footprint, fluid below that width. Subtle paper shading and a fine paper edge reuse illustration colors. No hover, drag, scroll scrubbing or timed interaction requirement.
- Two decorative, `aria-hidden` panels have no pointer interaction. Original image alt text and native labels/validation/status remain. Reduced motion and no JavaScript show the finished image. Motion is one-shot, 1.5 seconds, with a 1.8-second cleanup fallback.
- Offscreen or hidden surfaces finish immediately; subscriptions and timeout are released. No rAF loop, ticker or ambient motion.
- Alternatives considered: a scroll-driven fold would require more lifecycle work and tie presentation to navigation; a graphics library adds unnecessary weight. Use a small custom CSS fold.

## Sourcing and director

Primitive sought: folding-paper / hinged-panel reveal. The supplied catalog gateway was used for React Bits and Fancy Components; both initial calls failed to fetch within the sandbox. A permitted retry for React Bits returned HTTP 503, `Catalog temporarily unavailable. Retry later.` No catalog component was inspected; this is unavailable sourcing, not a negative search result. Verdict: custom, using project assets and native CSS, appropriate to the existing vanilla stack. No direct catalog access or installs attempted.

Director: `anthropic-scoped-adaptation`, via the creative-frontend-architect adapter. Source resolution: supplied project path `.sources/frontend-design/SKILL.md` (the path identified by project guidance for `CFA_ANTHROPIC_SOURCE`). Content was read and matches pinned SHA-256 `d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3`. Expected upstream revision: `34040c9c568585f6929bedeaad110ad08f079624`; actual source repository revision: unknown. Host: Codex. Only the scoped art-direction remit was applied; no second director. General using-superpowers and brainstorming guidance was read; their approval ceremony is superseded by the user's explicit direction to choose and proceed. Verification-before-completion guidance was also read.

Actual loaded files (paths relative to this project unless absolute):

| Path | Role | SHA-256 / status |
| --- | --- | --- |
| `.sources/frontend-design/SKILL.md` | director-source | `d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3`, read |
| `.agents/skills/creative-frontend-architect/references/directors/anthropic.md` | director-adapter | `750881b938bf2abc1bbb7893db504147aab2692987fa0333d3905b76fb646b7a`, read; adapter revision identified by this hash |
| `.agents/skills/creative-frontend-architect/SKILL.md` | workflow | read |
| `.agents/skills/creative-frontend-architect/references/design-contract.md` | contract | read |
| `.agents/skills/creative-frontend-architect/references/architecture.md` | architecture | read |
| `.agents/skills/creative-frontend-architect/references/rendered-review.md` | review method | read |
| `.agents/skills/creative-frontend-architect/integrations.lock.json` | provenance | read |
| `/Users/bezzchen/.codex/skills/using-superpowers/SKILL.md` | process | read |
| `/Users/bezzchen/.codex/skills/brainstorming/SKILL.md` | process | read |
| `/Users/bezzchen/.codex/skills/verification-before-completion/SKILL.md` | verification | read |

## Implementation and verification

Changed `index.html`, `styles.css`, `app.js`. Added a reproducible `browser-config.json`. No changes to browser/catalog launchers or the SVG. Workspace has no Git repository.

- `npm run check`: passed after implementation.
- Initial local server and browser launches hit sandbox restrictions. Server and supplied browser started successfully through the normal approval mechanism at `http://127.0.0.1:8796`.
- Required live checks: desktop and narrow layout, normal motion sequence, reduced-motion view, native validation and confirmation, keyboard order/focus, scroll-out behavior. Actual touch hardware, screen reader and real background-tab lifecycle require suitable browser support; do not infer these from source alone.

### Observed evidence

- `verification/loaded-files.json` records resolved paths, SHA-256, role and read status for all loaded skill/reference files.
- Desktop 1440 × 900 rendered successfully: `preview-desktop.png` and `verification/fold-finished.png`. Existing heading, text and booking form remain visible throughout. Timed captures `fold-early.png`, `fold-middle.png`, `fold-finished.png` show the covered/partly open illustration and final illustration. Capture overhead means filenames are sequence positions, not precise animation timestamps. No console errors were reported (`motion-result.json`).
- A malformed first date option was discovered in live testing: selection of 10 October timed out. Corrected the missing opening `<option>` tag. Recheck in `verification/booking-result.json` confirms 10 October selectable, confirmation rendered, and focus moved to `#confirmation`; no console/page errors. This is the first correction cycle.
- Final 375 × 812 reduced-motion flow selected 18 October, then used Tab/Enter to submit. `verification/mobile-confirmation-result.json` confirms the correct reservation text and focus on `#confirmation`, with no console/page errors. `verification/mobile-confirmation.png` shows the complete narrow layout and confirmation. Selection used the launcher's select action; this is not proof of a fully keyboard-only date-selection flow.
- Actual End/Home key actions were sent at 375 × 812 (`verification/scroll-result.json`). The full-page screenshot still caught the folded state; the launcher does not report scroll position or animation state, so this does **not** verify offscreen cleanup. No synthetic visibility event was used.
- No dependency installation, external booking/email request or publication. Booking remains the existing local prototype.

Independent rendered review is recorded separately in `verification/review.md`. Physical touch, assistive technology, real background-tab transition, JavaScript-disabled browser rendering and precise offscreen cleanup remain unverified with this launcher. Source inspection supports the intended static fallback and lifecycle cleanup but is not runtime proof.

Review mode: independent initial review by `/root/rendered_review`; builder performed correction rechecks. Independent result: incomplete / unverified because its post-correction date recheck and some required interaction/lifecycle coverage were not completed. It observed sound desktop/narrow layouts, immediate reduced-motion illustration, visible focus, empty-form validation and timed reveal. Its one observed defect (malformed first date option) was corrected and successfully rechecked by the builder on desktop; the second date succeeded in the builder's narrow reduced-motion run. No remaining observed defect is known. Overall verification remains partial, not a comprehensive rendered or accessibility pass. Final `npm run check` passed.

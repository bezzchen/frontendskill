# Workshop booking implementation

## Scope and decisions

Implemented the approved Willow Room booking flow. The authoritative design is
`design/accepted-contract.md`, `design/approved-desktop.png`, and
`design/approved-mobile.png`. The user explicitly approved the design and delegated
remaining implementation choices, so no new design/approval round was needed.

- Director: supplied approved design; no external director or fallback loaded.
- Register: Q (quiet operate), a short form with native buttons and an input.
- Stack: existing React 19.1.1, Vite 7.1.5, and CSS Modules. No dependency changes.
- Rendering: React owns form state; ordinary CSS owns layout and feedback. No animation,
  realtime renderer, assets, or common visual effects are needed; catalog sourcing and
  inactive-animation checks are not applicable.
- Preserved `src/tokens.css`, supplied content, squared controls, type scale, ochre
  palette, and desktop two-column/mobile stacked layout.

## Implementation

1. Kept the session buttons; exactly one can be selected, with `aria-pressed`, a
   colored inset border/background, and explicit “Selected” text.
2. Added submit validation for missing session and blank/whitespace-only attendee.
   Inline alerts are associated with controls; focus moves to the first missing field.
   Errors clear as their fields become valid. Names are trimmed on confirmation.
3. Added local confirmation with attendee, session, day, and time. Focus moves to its
   heading. Session buttons are locked while confirmed so the summary stays consistent.
4. Added “Start another reservation,” clearing selection, name, and errors, with focus
   restored to the first session. Availability stays static because this is a local demo.

## Actual checks

- `node scripts/check-booking.mjs` initially failed on the missing session-validation
  message in the supplied implementation (expected count 1, actual 0).
- After implementation, the same browser check passed at widths 1440, 390, 375, 320,
  and 768 pixels. Checked missing fields, whitespace-only name, selected-state exclusivity,
  changing sessions, trimmed attendee/details in confirmation, reset, keyboard selection
  with Space/Enter, keyboard form submission, focus transfer, and absence of horizontal
  overflow and browser runtime errors.
- `npm run build`: passed, Vite 7.1.5, 26 modules transformed.
- Visually inspected the actual 1440px and 390px initial pages, 375px confirmation,
  320px validation, and 768px selection screenshots. The initial desktop/mobile views
  match the approved compositions; feedback and confirmation retain readable wrapping,
  the approved layout, and squared controls.
- Browser evidence: `output/playwright/{initial,validation,selected,confirmation}-WIDTH.png`.
  The reusable check uses the installed host Playwright/Chromium paths supplied in
  AGENTS.md; it requires the local preview at `http://127.0.0.1:5173`.
- Local server initially hit sandbox `EPERM`; the normal escalation allowed startup.
  Chromium checks also used normal sandbox escalation. No downloads were needed.
- Independent rendered review: `review_mode: independent`, reviewer
  `/root/rendered_review`, `result: pass`, `verification_status: verified`, correction
  cycles: 0. No observed defects or stylistic suggestions. Exercised all three session
  confirmations, validation, reset, Tab/Shift+Tab/Space/Enter, visible focus, actual
  scrolling at 375px/768px, desktop design fidelity, and the reduced-motion flow.
  Report and evidence: `output/playwright/review/report.md`.

## Limitations

This is an in-memory local demo: refresh clears state; no real reservation, persistence,
payment, email, or capacity management is implemented, as specified. Browser coverage is
installed Chromium, not Safari/Firefox or physical devices. Screen-reader software was
not exercised; semantic attributes and keyboard/focus behavior were checked. This folder
has no Git repository, so Git diff/status and commit checks are unavailable.

## Skill/source provenance

Used creative-frontend-architect's supplied-design execution path and rendered-review
workflow. Read the following local files (SHA-256):

| Source | SHA-256 |
| --- | --- |
| `.agents/skills/creative-frontend-architect/SKILL.md` | `abeb51e1c1a769366ea7ea134b85b0d2acfa00aeaa16d3ac565adc5dd72883e5` |
| `.agents/skills/creative-frontend-architect/references/design-contract.md` | `feb07483fa3a178279ecd50cf503887601f37c6799cca560eb48f67d5b9551ae` |
| `.agents/skills/creative-frontend-architect/references/rendered-review.md` | `463b94a54dec590a412dc9dc98deb7b2f3ecac6ce20639c1940c8113ec9b1194` |
| `design/accepted-contract.md` | `1241d16e764c8c262913aaa112c12ac377f180e5107f382853bc2cf936416e19` |
| `design/approved-desktop.png` | `fd821bf25006bbc1bdd89c313cf706b73673fc4a80adcb46dc89a41399ce4c12` |
| `design/approved-mobile.png` | `ea1ac54c99734ba9316df2db4b0d723b584f595b391aa3d6f15348bc6c31b919` |
| `src/tokens.css` (unchanged) | `b226df0269bf95cf230da17ab8c79a499a07f9cf167bfce6aef506e979935f90` |

Also read local `brainstorming`, `using-superpowers`, `test-driven-development`,
`playwright`, and `verification-before-completion` skill files. Applied their relevant
context review and verification guidance. The user's supplied approval/delegated scope
takes precedence over redundant approval ceremonies. Used the project's explicitly
provided Playwright runtime rather than fetching the skill's CLI wrapper dependency.

Supporting skill hashes (under `/Users/bezzchen/.codex/skills/`):

| File | SHA-256 |
| --- | --- |
| `brainstorming/SKILL.md` | `e14914605f640e0841758e45d0ab2a53243b59b921f929e47921c99668f2e61d` |
| `using-superpowers/SKILL.md` | `55379fe7c1c473a02c61961c822996bff30e1320d6921d9062509bc508482c05` |
| `test-driven-development/SKILL.md` | `b5b4717b8b761cce15a6cfe9022e33fd959e0894c0c39d72c9cb49c23486c10e` |
| `playwright/SKILL.md` | `0ffaabcc8e0990627c4725f18bf1c7955534a796c1c199e872909de2013ce6a8` |
| `verification-before-completion/SKILL.md` | `ea52d15aabaf72bc6b558efe2c126f161b53961090ddcd712000273bfe8c7b6c` |

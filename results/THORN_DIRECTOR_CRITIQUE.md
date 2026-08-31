# Thornmere — Design Critique

Method: dual-agent (A: general-purpose sub-agent, design review · B: general-purpose sub-agent, detector + browser evidence) · Parent-context browser observations folded into synthesis and labeled as such.
Target: `app/page.jsx` (the Thornmere launch experience — 900vh WebGL distillation + tail). Surface mode: **Persuade**. Register: **S (spectacle)**.
Date: 2026-08-30 · Draft status per client: "a great start … a step closer than before" — encouraging, explicitly not arrived.

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loader and act labels are good; nothing signals journey length — you never know you are 8 viewports from the CTA |
| 2 | Match System / Real World | 4 | The distillation mapping is rigorous and honest; the page's best quality |
| 3 | User Control and Freedom | 3 | Native scroll, skip link, motion toggle; no act-level navigation across 900vh |
| 4 | Consistency and Standards | 3 | The bottle changes material between tiers (black glass desktop, frosted grey mobile); pill/glass-card component language sits outside the etching world |
| 5 | Error Prevention | 3 | Ledger rows are `<button>`s that invite a click and do nothing |
| 6 | Recognition Rather Than Recall | 4 | Acts self-label, botanicals always named, cursor-stir hinted |
| 7 | Flexibility and Efficiency | 3 | Motion toggle doubles as a fast path; nothing else |
| 8 | Aesthetic and Minimalist Design | 3 | Arrival copy collides with the plates it introduces; Act III panel sits on the spectacle |
| 9 | Error Recovery | 3 | Exemplary failure architecture (WebGL-fail → locked folio, context-loss handled, no-JS folio) — but the folio hero itself ships broken |
| 10 | Help and Documentation | n/a | Persuade surface; no help system is owed |
| **Total** | | **29/36** | **Good (80%) — solid foundation, weak areas named below** |

## Design Specificity Verdict

**Authored at the core, interchangeable at the edges — and the execution keeps undercutting the authorship.**

**LLM assessment (Assessment A):** The central mechanic could not ship for another brand unchanged: particles are sampled from the actual ink pixels of the 1887 Köhler plates (`sampling.js` rejects paper by luminance and keeps pigment), one `BOTTLE_PROFILE` array drives both the lathed glass and the condensation targets, the label is drawn at runtime from the page's own type tokens, and "the colour stays behind" is literally enacted in the shader (`vColor = mix(aColor, uClear, cn)`). The ledger→plate glow and beat-synced highlight bind DOM and scene into one system. That is real world-building. But three executional failures make the authored premise read generic in the frame: the vapour renders as **lime-green additive glitter** any perfume brand could own; the still is an **anonymous smooth copper onion** ("Constance, our 300-litre pot" has no visual counterpart); and the **tail is premium-template boilerplate** — hairline grid, pill buttons, kicker-headline-prose — carrying none of the stage's material language. The skeleton is authored; the skin is frequently interchangeable.

**Deterministic scan (Assessment B):** CLI: **1 finding** — `layout-transition` on `.botanical-row .note` (`app/globals.css:339`, animated `max-height`). In-page scan: **14 reported / 19 counted** (script count quirk): 11× `undersized-ui-text` (act kickers and the "Motion on" control at 10.4px; five 9.92px strings), 1× `low-contrast` — **primary CTA `.btn` at 2.8:1** (#efe7d4 on #c07840), 4× `kicker-above-heading` (the page's most saturated editorial pattern), 1× `all-caps-body`, 1× `em-dash-overuse` (8 — exactly at the rule floor).
*Detector caught what the review missed:* the CTA contrast failure and the sub-11px "Motion on" control. *False positives:* the five 9.92px hits are the folio figcaptions, `display:none` in full-motion mode (they are real in folio mode and get fixed anyway); one em-dash lives in the `sr-only` h1.

**Visual overlays:** overlay injection succeeded and console findings were captured, but no user-visible overlay tab could be presented — this session's browser pane is hidden/headless. Fallback signal: console-only evidence, summarized above.

## Overall Impression

The concept is right and the architecture is genuinely good — the client's "step closer" is earned. What stands between this and the bar is **art direction at the moments that matter**: the entry is static and self-obscuring, the two hinge moments (ring convergence, condensation) are under-staged, the vapour wears a colour nobody chose, the glass never reads as the "perfectly clear" spirit the copy promises, and the conversion layer (panels, buttons, tail) speaks default-premium instead of Thornmere. The single biggest opportunity: make the peak *look like the premise* — ink, not glitter; glass, not silhouette — and choreograph the first five seconds.

## What's Working

1. **The premise-to-pixel chain.** Ink-sampled particles, one profile for glass and condensation targets, runtime label from page tokens — systems-level art direction, not a hero video with scroll-scrub. This is why the piece deserves further investment.
2. **The fallback architecture.** OS motion preference honoured with persistent override, WebGL-failure → locked folio, no-JS folio, tab-hidden/offscreen pausing (verified under the actual conditions), tiered quality recipe. Better than most shipped spectacle sites.
3. **Copy doing design work.** Each act's headline states the mechanic the scene performs ("We keep only the heart", "The colour stays behind. The character doesn't."); voice, type and palette form one British-apothecary register.

## Priority Issues

**1. [P1] The reduced-motion/folio hero ships with type crashing into the bottle.**
Why: this is the `prefers-reduced-motion` audience, the WebGL-failure landing, and one header click away for everyone. The reduced camera `lookAt(2.65,-0.55,0)` centres the bottle under the copy; the code's own comment says "bottle right of frame, copy space left".
Fix: recompose the reduced still-life — aim the camera left of the bottle so it occupies the right third; aspect-aware target so portrait keeps it in frame. Verify at ≥3 aspect ratios.
Suggested command: `/impeccable adapt`.

**2. [P1] The particle colour betrays the premise at the peak.**
Why: additive blending drives the sampled pigment to lime-yellow sparkle at p≈0.56–0.65 — the signature moment reads "confetti", not "ink lifting off paper". The memory a visitor leaves with is green glitter.
Fix: grade the vapour as ink — damp the sampler's brightening, mix toward an umber ink tone, cap luminance so additive sums stay warm; reserve brightness for the moment the colour *leaves* (the `uClear` mix), currently the least visible beat of the whole transition.
Suggested command: `/impeccable polish`.

**3. [P1] The glass never reads as glass holding clear spirit — and the product changes material between tiers.**
Why: transmission glass over a black void = an opaque black bottle from p≈0.48–0.85, beside copy saying "runs perfectly clear"; the low tier renders frosted grey ceramic; the liquid fill line stops at ~⅓ of the bottle's visible height. One product, three materials, none of them clear spirit.
Fix: give the glass something to transmit — rim/back light and a floor light-pool ramping with `glassLight`, brighter backdrop behind the bottle in Acts IV–V; raise `liquidFill` to the shoulder; retune the low-tier glass toward the same dark-green-glass reading.
Suggested command: `/impeccable polish`.

**4. [P1] The first five seconds are unchoreographed and self-obscuring.**
Why: a static DOM lockup sits on top of a dim scene; the premise sentence renders across the angelica/orris plates (unreadable at 800–1024px widths, verified); the camera's opening dolly happens behind the text; the only visible motion is a 1px scroll cue. S-register work is judged on its entry.
Fix: stage the entry — plates light in sequence (the glow uniform already exists), title and sub enter staggered after the scene breathes, arrival copy fades *with scroll* (not at an act boundary), and a feathered scrim guarantees the premise sentence is legible. No new engines: one-shot CSS + existing uniforms.
Suggested commands: `/impeccable animate` + `/impeccable bolder` (arrival only).

**5. [P1] The conversion layer fails contrast and speaks the wrong language.**
Why: the primary CTA measures 2.8:1 (fails AA); pills, rounded glass cards and backdrop blur are SaaS vocabulary pasted onto an 1887 etching world — the blur also produces the pale rectangular ghost over Act III's vapour.
Fix: letterpress-square controls on deep copper (#efe7d4 on #7a3f1c ≈ 6.6:1 passes), hairline double-rule details echoing the label; replace glass-card panels with editorial margin notes — copper rule + feathered scrim, no blur, no radius; match the ledger input.
Suggested commands: `/impeccable polish` + `/impeccable typeset`.

**6. [P1] Act copy panels collide with the fixed header at common laptop heights.**
Why: `.act-pin` centres a panel that is taller than short viewports; at 1366×768-class windows the Act I panel runs under the wordmark (verified at 800×740: kicker and wordmark overprint).
Fix: safe vertical padding on the pin (clears the header), tighter panel density below ~760px height; the shared-note ledger fix below also removes ~5 lines of worst-case height.
Suggested command: `/impeccable adapt`.

### Second tier (P2)

**7. [P2] Act I camera is a constant-speed conveyor and the beat highlight is off by one plate (verified).** `beatFromP` mirrors `camPos.x` while what is centred follows `camTgt.x` — at p=0.25 the ledger highlights Orris while the camera centres angelica; on mobile an outright label/picture contradiction. The `lin` keys never dwell, so five micro-arrivals flatten into one pan and no plate is ever *visited*. Fix: per-plate dwell keyframes on both tracks (ease in/out per botanical, camera breathing closer on arrival), recompute the beat from the target track, and make ledger click/tap travel to that plate's dwell — the dead `<button>` becomes real interaction causality through the existing scroll pipeline. → `/impeccable animate`
**8. [P2] The ring convergence — the Act II hinge — reads as an accidental jumble.** Five shrunken cards overlapping on a flat vertical ellipse. Fix: restage with depth — wider radius, z-spread, banked facing — so it reads as a vortex circling the still's mouth. → `/impeccable animate`
**9. [P2] No journey signal or act-level navigation.** Add a quiet fixed rail of acts I–V (current lit copper, click travels there). Solves heuristics 1 and 3 in one in-register move. → `/impeccable delight`
**10. [P2] Typography is timid and system-less at panel level.** Inline `style={{fontSize}}` on every headline, all clustered 1.9–2.6rem — the words whisper while the scene shouts; kickers at 10.4px include the "Motion on" *control* (detector). Fix: role tokens with a real crescendo (act → close), kickers/controls ≥ 11.5px, one tracking value per role. → `/impeccable typeset`
**11. [P2] Quality tier is decided once, at boot, from the initial window width.** Load narrow, maximise: 12k particles, no pointer-stir, 1.25 DPR forever — while the copy still says "move your cursor through the vapour". Narrowest honest fix now: gate the hint on the actual pointer capability; document that re-tiering requires a rebuild. → `/impeccable harden`
**12. [P2] The world lacks ground truth.** Plates hang in void (fine — herbarium logic) but the still is a smooth anonymous onion, the bottle never visibly touches the floor, and the backdrop halo never moves across five acts. Fix: copper detail (bands, plinth) so "Constance" is a made thing; floor light-pool under the bottle as the spirit arrives; let the halo breathe with the act. → `/impeccable polish`
**13. [P2] The tail carries none of the stage's material language.** Swap the nouns and it is a candle brand's footer. Fix within the system's own vocabulary: the label's double-rule and diamond motifs, folio numbering, squared controls — no new primitives. → `/impeccable bolder` (scoped to tail)
**14. [P2] Ledger notes animate `max-height` (CLI finding) and pump the panel height per beat.** Fix: a fixed-height shared caption slot under the list — constant panel height, no layout animation, and the note becomes a stable reading line. → `/impeccable polish`

## Persona Red Flags

**Jordan (first-timer):** may never cleanly read the one sentence explaining that the page *is* a distillation run (it sits on the plates); takes the copper pot on faith (no visual specificity); "Find a stockist" ultimately lands on a `mailto:` — a dead end without a configured mail client.
**Riley (stress tester):** toggles Motion off → title/bottle collision on the first frame; loads half-screen and maximises → permanently degraded tier while the page still advertises cursor play; clicks ledger rows → nothing. Credit: scroll smoothing recovers gracefully; zero console errors across both assessment passes.
**Casey (mobile):** at arrival sees ONE plate, not "the five" — the fixed 42° FOV crops the desktop stage instead of directing a tall frame; mid-Act-I the ledger card sits on the artwork with the wrong botanical highlighted; at the climax the CTA card covers the label she just watched assemble; every conversion action lives ~8 viewports deep.

## Minor Observations

- `--lemon: #d8c05a` is declared and never used — a dead token in a five-botanical brand where lemon is a character.
- Act V's kicker breaks the act naming system ("Batch № 03" after four "Act N · Name" kickers).
- The herbarium wall in Act V crops mid-plate at some heights; verify after recomposition.
- Kicker letter-spacing drifts (0.28em / 0.3em / 0.22em) across roles.
- Folio figcaptions at 9.92px (real in folio mode).
- Em-dash density sits at the detector floor; the visible-copy count can come down by one or two without losing the voice.
- Loader copy ("distilling 47%", "folio edition") is on-voice and charming — keep.
- `page.jsx` act ranges match `ACT_RANGES` — the DOM/canvas contract is documented and kept true.

## Questions to Consider

1. If the vapour is the brand's soul, why is its colour the one thing on the page no one chose? Would you let a print vendor shift your brand green that far?
2. The page's best single image (the bottle silhouetted in pale dust, mobile p≈0.8) exists by accident of a cropped low-tier camera. What would it mean to *direct* each act for the tall frame instead of cropping the wide one?
3. Five acts of theatre earn one email field, and the exits live behind 8 viewports. Is the run the product, or the price of admission? What does the visitor who leaves at Act II take with them?

## Evidence & Verification Appendix

- **A (design review):** full source read; live inspection desktop 1440×900 (tier "high") and mobile 375×812 (tier "low"); scene frames via the deterministic scrub API (`__thorn.step`) with pixel-exact readback; ledger-glow and vapour-stir probed A/B (coriander brightens; local plume displacement confirmed); motion judged from `timeline.js` tracks + stepped sequences + two live stretches; ~50–64fps indicative at 1440×900; zero console errors. Not verified: real-hardware scroll feel, real touch, `<noscript>`, mail client, low-memory devices.
- **B (mechanical):** `detect.mjs --json app` (exit 2, 1 finding); in-page detector injected in a working tab, console findings captured; overlay not user-visible (hidden pane) — fallback signal reported; overlay server started and stopped cleanly.
- **Parent:** hidden-document pause observed under the actual condition (`visibilityState: "hidden"` → `running: false`, RAF stopped); folio toggle round-trip verified (stage collapses, plate grid, single still-life frame, `aria-pressed`); header/panel collision reproduced at 800×740.

---

## Close — targeted questions and the brief's standing answers

This critique run is part of a directed revision: the client's brief pre-answers the closing questions, recorded here in place of an interactive round.

1. **Priority direction** — material truth first (vapour/glass), entry choreography, or conversion surface? *Options: materials · choreography · conversion.* **Standing answer (brief):** address the critique in full; order taken: materials and entry (the memory), then camera/hinges, then conversion surface and tail.
2. **Design intent** — keep the quiet-archival register while amplifying, or push louder? *Options: amplify within the register · louder spectacle.* **Standing answer (brief):** preserve concept and world; amplify within the system's own vocabulary (no new primitives).
3. **Scope** — top 3 only, or everything? *Options: top 3 · all P1 · P1+P2.* **Standing answer (brief):** P1 + P2 where they do not touch the architecture; the tier system stays fixed-at-boot (gated hint only), the tail is refined not redesigned, copy claims untouched.
4. **Off-limits** — **Standing answer (brief):** rendering architecture, single-owner timeline, pause/reduced-motion/fallback behaviour, assets, factual copy.

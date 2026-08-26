# Hero Interaction Proposal — "Wet Ink": the masthead signs itself

**Status:** Proposal only. No implementation in this change.
**Scope:** One signature hero interaction for the hand-drawn editorial rebrand (rough ink linework, imperfect edges, custom display type, paper texture).
**Site:** Personal portfolio for Jordan Lee (`app/page.jsx` — eyebrow / name / one-line bio, followed by project grid and settings).

---

## 1. The proposal in one paragraph

The hero becomes a sheet of paper on which the site is signed. On first visit, "Jordan Lee" is written before your eyes: bespoke hand-lettered ink strokes lay down in natural writing order — thick downstrokes, thin hairlines, ragged edges, a slight bleed — over roughly 1.8 seconds, ending with the eyebrow and bio settling in beneath it. After the ink "dries," the pen never quite leaves the page: when the visitor's pointer enters the hero, a rough underline flourish inks in beneath the name and one or two small marginalia (an asterisk by the eyebrow, a hand-drawn arrow toward the work) draw themselves near the cursor, and lift again — reverse, faster — when the pointer leaves. One system, one metaphor: *the author's hand, still holding the pen*.

This is the right signature move for this specific site because the brand **is a person's name**. A portfolio masthead that is literally a signature — written, not typeset — is the most direct possible expression of "hand-drawn editorial," and it is memorable in a way a texture or a hover effect is not. It is also honest: the rest of the identity (custom display type, ink rules, paper grain) claims the site was made by hand; the hero proves it by showing the hand at work.

---

## 2. Why this interaction (fit and reasoning)

**Fit with the identity.** Every element of the brief maps onto it directly:

| Brief element | How the interaction expresses it |
|---|---|
| Rough ink linework | The masthead *is* linework — real pen strokes, digitized, with pressure variation and dry-brush ends |
| Imperfect edges | Imperfection is baked into the source artwork (wobble, ink pooling at stroke starts, feathered terminals), not simulated with filters |
| Custom display type | The name is a one-off piece of lettering — the ultimate custom display type: an artwork of exactly one word pair |
| Paper texture | The write-on only reads as ink because it lands *on paper*; the hero establishes the paper ground the whole rebrand sits on |

**Fit with editorial restraint.** Editorial design is authored, not gamified. The interaction is watched more than played: a short authored performance, then a quiet responsive detail (the flourish). No physics toys, no cursor-following gimmicks that fight the reading experience. Motion serves the single message of the page: *a person made this*.

**Memorability with a short half-life cost.** The write-on is striking exactly once — so it plays in full once per session and collapses to a fast settle (or static art) afterward. The pointer flourish is the durable half: small enough to stay charming on the hundredth visit.

**Technically boring on purpose.** Everything is SVG + CSS/Web Animations. No canvas, no WebGL, no animation library, no per-frame JavaScript. This matters for a hero: it must be the fastest thing on the page, not the heaviest.

---

## 3. Experience specification

### 3.1 First load (per session)
1. Paper ground and layout render immediately. The real `<h1>Jordan Lee</h1>` is in the DOM from first paint (visually hidden), so assistive tech, SEO, and no-JS visitors never wait on the animation. Layout space for the artwork is fully reserved (SVG `viewBox` + explicit aspect) — **zero CLS**.
2. The lettering writes in stroke-by-stroke, in plausible handwriting order (J → o → r … → underline of the surname tail), ~1.6–2.2s total, with per-stroke easing (fast mid-stroke, soft landings) and 30–60ms gaps between letters. A subtle darkening on each fresh stroke ("wet ink") fades over ~800ms.
3. The eyebrow ("Portfolio") and bio line fade/rise in during the last 400ms — typeset in the rebrand's text faces, deliberately *not* animated as handwriting. One handwritten voice; everything else is print. That contrast is what makes it editorial rather than scrapbook.
4. Any click, keypress, or scroll during the write-on skips instantly to the finished state.

### 3.2 After the ink dries (the living detail)
- Pointer enters the hero region → a rough underline flourish inks in beneath the name (~450ms, drawn left-to-right, same technique as the masthead). Pointer leaves → it un-inks in ~250ms.
- One or two marginalia (small asterisk near the eyebrow; a loose arrow pointing toward "Selected projects") ink in when the pointer dwells nearby (>150ms hover intent), staggered ~80ms. Hard cap of three marginal marks — restraint is the point.
- No element ever follows the cursor. Marks live at fixed, composed positions; the pointer only decides *whether* they are inked.

### 3.3 Repeat visits (same session)
- Write-on is skipped (`sessionStorage` flag); the masthead appears finished with a 300–400ms "settle" (final 10% of the underline draws). Flourish behavior unchanged.

### 3.4 Touch devices
- Write-on plays identically. There is no hover, so: the underline flourish inks in when the hero enters the viewport (IntersectionObserver), and a tap on the masthead replays the signature once. No dead interaction.

### 3.5 Reduced motion (`prefers-reduced-motion: reduce`)
- No write-on, no drawing animations. Finished artwork renders statically; the flourish appears/disappears with a 150ms opacity fade only. The identity survives fully — it was always about the *artwork*, with motion as garnish.

### 3.6 No JavaScript
- The write-on itself can run as pure CSS animation on inline SVG, so no-JS visitors still get the moment (played on every load, which is acceptable there). JS is only additive: session-gating, skip handling, pointer/tap logic.

---

## 4. Sourcing the artwork

This succeeds or fails on the source material. The lettering must be *actually made by hand* — roughness synthesized by filters over a clean font reads as fake within seconds.

**Recommended path (A): real lettering, digitized.**
1. Letter "Jordan Lee" with a real tool — brush pen or broad nib on paper (scan ≥600 dpi) or Procreate/iPad with a pressure brush. Draw 3–5 candidates; pick for legibility first, character second. In the same sitting, with the same tool, draw the supporting set: underline flourish, asterisk, arrow, and 2–3 spares — one session guarantees consistent ink character across every mark.
2. Vectorize (Illustrator Image Trace or Inkscape trace, tuned to preserve — not smooth away — the imperfection), then clean up manually. Keep pooling, feathering, and wobble; remove only scanning noise.
3. Produce the **asset contract**, one SVG containing two layer groups:
   - `#art` — the finished lettering as *filled outlines* (this is what viewers see; carries all the nib-weight and rough edges).
   - `#guides` — invisible *constant-width centerline paths*, one per pen stroke, drawn in writing order and ID'd (`s01`, `s02`, …). These drive the reveal (§5). Recording each path's length in metadata (or measuring at build time) keeps timing math trivial.
   - Budget: ≤ 60KB gzipped for the whole hero SVG, single asset, fills use `currentColor` so one file serves light and dark themes.

**Fallback path (B): redrawn from a reference skeleton.** If no lettering time/talent is available, use an OFL-licensed handwriting face purely as a rhythm/spacing reference and *redraw* the letterforms by hand over it. Never ship traced font outlines as "custom lettering" — it defeats the rebrand's premise and looks like it. Path B is a schedule hedge, not an aesthetic peer of Path A.

**Paper and ink tokens (shared with the wider rebrand):** `--paper` (warm off-white, fine tiled grain — one small repeating noise tile, static), `--ink` (near-black with a hint of blue-sepia). Dark mode inverts to chalk-on-slate; because the artwork fills with `currentColor`, no second asset is needed.

---

## 5. Build approach

**Core technique — mask reveal, not naive stroke animation.** Animating `stroke-dashoffset` directly on lettering outlines produces a wireframe-tracing effect (uniform-width line crawling around a contour) — the classic tell of cheap "handwriting" animations. Instead, use the standard craft technique:

- The finished filled artwork (`#art`) sits inside an SVG `<mask>`.
- The mask contains the invisible centerline guides (`#guides`) rendered as fat round-capped white strokes (width ≳ the widest nib moment).
- Each guide animates `stroke-dashoffset` from its path length to 0, in sequence.

Result: the *finished* ink — variable width, rough edges, texture and all — is revealed exactly along the path a pen would travel. Schematically:

```svg
<svg viewBox="0 0 900 260" aria-hidden="true">
  <mask id="write">
    <path id="s01" class="guide" d="…" pathLength="1"
          stroke="#fff" stroke-width="34" stroke-linecap="round" fill="none"/>
    <!-- s02, s03, … in writing order -->
  </mask>
  <g mask="url(#write)" fill="currentColor"><!-- finished lettering outlines --></g>
</svg>
```
with per-guide CSS: `stroke-dasharray: 1; stroke-dashoffset: 1;` animated to `0` on a stagger. (`pathLength="1"` normalizes timing so stroke lengths never need hardcoding.)

**Key implementation decisions:**
- **Roughness is baked, never runtime.** No `feTurbulence`/`feDisplacementMap` in the shipped hero — SVG filters force expensive re-rasterization and can shimmer during animation. All imperfection lives in the traced geometry; if extra tooth is ever needed it is applied once at export time in the design tool.
- **Wet-ink sheen** is a second copy of each stroke's region at slightly higher opacity, faded out via CSS after its reveal — cheap, no filters.
- **Animation driver:** CSS animations declared up front (works no-JS); a thin client component (`components/HeroSignature.jsx`, `"use client"`) adds session-gating, skip-on-input, pointer-intent for the flourish, touch/IO behavior, and `prefers-reduced-motion` handling. Target ≤ ~6KB min+gzip of JS, zero dependencies.
- **Honest perf note:** `stroke-dashoffset` animation repaints (it is not compositor-only). This is acceptable because the region is bounded (hero SVG only), the sequence is short, and nothing else animates concurrently; verify no >50ms long tasks on a mid-tier Android profile. If a specific device class struggles, the degradation path is per-stroke opacity reveals (still sequenced, still reads as writing).
- **Integration:** replace the current `<header>` in `app/page.jsx` with `<HeroSignature />` (sr-only `<h1>` + `aria-hidden` artwork + eyebrow/bio as real text); add `--paper`/`--ink` tokens to `app/globals.css` alongside the rebrand's palette. No changes to `ProjectGrid`/`SettingsPanel` are part of this workstream.

---

## 6. Alternatives considered and rejected

1. **Pointer-as-pen free drawing** (visitor draws real ink on the hero canvas). Most "interactive," least editorial: it turns the masthead into a toy, invites defacing the brand moment, needs canvas + ink simulation (heavy), has no good touch/keyboard story, and its novelty decays into friction. Restraint loses to it only if the goal were playfulness — it isn't; the goal is authorship.
2. **Scroll-scrubbed self-drawing illustration** (artwork draws in as you scroll). Widely seen (agency-site staple), demands a tall hero and scroll runway that this one-page portfolio doesn't have — content sits immediately below the fold — and it makes the signature moment hostage to scroll behavior instead of authorship.
3. **Hand-plotted ink constellation.** The repo contains dormant data for this (`components/ConstellationData.js`, 500 categorized nodes, currently imported nowhere) — an ink star-chart hero where hovering draws rough connecting lines is genuinely tempting. Rejected for the brand moment: a plotted chart reads *scientific/technical*, not hand-drawn *editorial*; 500 nodes carries real legibility and performance cost; and the data is semantically empty placeholder. Better future home: a case-study visualization deeper in the site, styled with the same ink language.
4. **Static texture-only hero** (paper + custom type, no motion). Safest and cheapest, but fails the brief — it's identity without a signature interaction.

---

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Lettering sacrifices legibility for character | Legibility is the first selection criterion among drafts; test the artwork at 320px viewport width; eyebrow + bio remain typeset and instantly readable |
| Write-on irritates repeat visitors | Session-gated to once; skippable by any input; total ≤ 2.2s; content never blocked behind it |
| "Fake handmade" kitsch | Real hand-made source (Path A), hard cap of 3 marginal marks, handwriting confined to the masthead — everything else typeset |
| Repaint cost of dashoffset on low-end devices | Bounded region, short duration, nothing else animating; profiled acceptance gate; opacity-per-stroke fallback |
| Asset ambiguity during build | The two-layer asset contract (§4.3) — filled `#art` + ordered `#guides` — is the deliverable definition; no artwork is accepted without both |
| Dark mode doubles asset work | `currentColor` fills; one SVG, two themes |

---

## 8. Acceptance criteria

- Write-on completes in ≤ 2.2s, starts within ~300ms of first paint, and is skippable by click/keypress/scroll.
- `<h1>` text present and exposed to AT from first paint; Lighthouse accessibility unchanged from baseline; CLS = 0.
- `prefers-reduced-motion` path shows static art with fade-only flourish; verified manually.
- Works with JavaScript disabled (write-on via CSS or static art — no blank masthead).
- No animation library or new runtime dependency; hero JS ≤ ~6KB min+gzip; hero SVG ≤ 60KB gzip.
- No long tasks > 50ms attributable to the hero during intro on a mid-tier Android profile.
- Touch devices get the write-on, an in-view flourish, and tap-to-replay — no hover-only dead ends.

## 9. Estimated effort

- Lettering + digitization + asset contract: 1–2 days (the long pole; Path B hedge if it slips).
- `HeroSignature` component, tokens, motion tuning: 1 day.
- Cross-device/a11y/perf verification: 0.5 day.

**Next step, on approval:** produce the lettering drafts (Path A) and, in parallel, stub `HeroSignature.jsx` against a placeholder two-layer SVG so motion timing can be tuned before final art lands.

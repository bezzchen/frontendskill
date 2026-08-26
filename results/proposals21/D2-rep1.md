# Signature Hero Interaction Proposal — "Wet Ink"

**Status:** Proposal only. No implementation in this change.
**Scope:** One signature interaction for the hero of the Jordan Lee portfolio, consistent with the hand-drawn editorial rebrand (rough ink linework, imperfect edges, custom display type, paper texture).
**Registry consulted:** `runs21/context/component_libraries.json` (snapshot 2026-08-12).

---

## 1. One-paragraph summary

The hero becomes a sheet of paper, and the site signs it. On first load, the custom display wordmark **"Jordan Lee" inks itself in** — variable-width calligraphic strokes with pressure tapering, slight wobble, small overshoots, and ink bleed at stroke ends — as if a fountain pen is signing the masthead. When the signature finishes, **the pen is handed to the visitor**: on fine-pointer devices the cursor becomes a nib, and moving through the hero lays down real ink in the same material, which glistens wet, feathers into the paper grain, then *dries* over a few seconds to a faint graphite ghost so the page never clutters. The same stroke engine supplies the hero's interaction feedback: hovering a hero link makes the pen flick a quick hand-drawn underline beneath it. One engine, one material, three authored uses — a load choreography, a pointer instrument, and a feedback language. For a personal site whose masthead is literally the person's name, the signature interaction *is* a signature.

---

## 2. Context

### The site today
- `app/page.jsx`: hero is a kicker ("Portfolio"), an `h1` ("Jordan Lee"), and a one-line bio. Below it: `ProjectGrid` (8 cards) and a product-register `SettingsPanel` form.
- Stack: Next.js 16, React 19, Tailwind 4. **No motion library is installed** — the motion-owner seat is empty, which we can fill deliberately.
- Current visual language is neutral grayscale with system-ish type; the rebrand replaces all of it.

### The rebrand's identity pillars, and what the interaction must prove
| Pillar | How the interaction embodies it |
|---|---|
| Rough ink linework | The interaction *is* linework: calligraphic strokes with velocity-driven width, taper, and wobble — not CSS glow, not particles. |
| Imperfect edges | Per-point jitter and edge roughening on every stroke; ink clipped to a deckle-edged paper sheet, not a browser rectangle. |
| Custom display type | The wordmark lettering is the star of the entrance — it is drawn stroke by stroke rather than faded in, making the custom type feel authored by hand in front of you. |
| Paper texture | Ink composites into the paper grain (multiply blend against a turbulence-noise ground); wet strokes visibly *dry into* the sheet. |

### Design thesis
A hand-drawn identity claims "a person made this by hand." Most sites express that claim with static assets (SVG doodles, textured backgrounds) — the hand is implied but never present. The signature interaction should make the hand **present and then shared**: the page demonstrates the pen (the signing), then gives the visitor the same pen (the nib cursor). The identity stops being a skin and becomes a behavior.

---

## 3. The interaction, specified

### 3.1 First load (once per session)
1. Hero renders as a paper sheet: warm paper ground, subtle grain, deckled/imperfect edges (SVG `feTurbulence` displacement on the sheet's clip path). Kicker and bio are real DOM text, already present.
2. The wordmark signs itself: ~1.2–1.8 s total, strokes replayed in authored order with human pacing (fast strokes, brief pen-lift pauses between letterforms). Stroke ends pool slightly (ink blot weighting on the final points).
3. A short authored flourish (rough underline beneath the name) lands last; the ink sheen fades as the signature "dries."
4. Repeat visits in the same session skip the choreography — the masthead appears pre-inked (sessionStorage flag). No one is made to watch the intro twice.

### 3.2 The pen (fine pointers only, `pointer: fine`)
- Inside the hero sheet, pointer movement draws live ink through the same engine: width follows velocity (fast = thin and dry-brushed, slow = thick with bleed), with tapered starts/ends on each stroke segment.
- **Drying lifecycle:** a stroke renders dark and slightly glossy on the *wet* canvas; over ~4 s it feathers ~1 px into the grain and settles onto the *dry* canvas at low opacity (a graphite ghost). Dried marginalia fades out entirely on a slow rolling window (oldest ink evaporates), so total ink is bounded and the composition self-cleans.
- Ink exists only within the paper sheet's clip. It never overlaps live text illegibly: an exclusion mask around the bio copy keeps body text readable (ink passes *behind* text at reduced opacity).

### 3.3 Feedback language (the functional payoff)
- Hovering a hero-level link/CTA snaps a prerecorded hand-drawn underline (~250 ms) beneath it — same engine, authored path, not procedural scribble. Focus (keyboard) triggers the same underline, so the language is not mouse-only.
- v1 scope: hero links only. The ink language must **not** leak into the settings form or project grid — those stay in the quiet product register (registry anti-pattern: no effect stacking; one register per surface).

### 3.4 Degradation matrix
| Condition | Behavior |
|---|---|
| `prefers-reduced-motion` | No signing animation (wordmark appears fully inked), no pointer ink, no rAF loop. Hover/focus underlines appear as static (non-animated) strokes. |
| Coarse pointer (touch) | Signing choreography plays; no draw-on-drag (drag must scroll, never hijacked). Tap feedback on links = the same underline stroke. |
| No JS | Real `h1` text renders in the display face with static paper background. Nothing is lost but the motion. |
| Low-end devices | DPR capped, pointer sampling throttled, engine idles to zero rAF when the pointer leaves the hero or the tab blurs. |

### 3.5 Accessibility
- All canvases/SVG lettering are `aria-hidden`; the accessible `h1` "Jordan Lee" remains real DOM text (visually replaced by the drawn wordmark, present for AT and SEO).
- The interaction is purely additive decoration — no content, control, or state lives only in ink.
- Contrast: dried ghost ink sits far below text layers and is opacity-capped so it can never push body text under WCAG contrast.

---

## 4. Alternatives considered and rejected

| Candidate | Why not |
|---|---|
| Scroll-driven SVG line-draw (`stroke-dashoffset`) of hero linework | Passive, widely seen; constant-width dashoffset strokes read as *technical wireframe*, not ink. Kept as a technique reference only. |
| Rough-notation-style hover scribbles as the headline act | Right material, wrong scale — a detail, not a signature. Absorbed into this proposal as the feedback language (3.3) driven by our own engine, avoiding a second dependency. |
| WebGL fluid-ink simulation (Codrops-style) | Over-produced and recognizable as a demo genre; liquid physics says "shader art," not "pen on paper." Heavy dependency for the wrong register. |
| Halftone/dither cursor effects (Cult UI territory) | Print-*tech* aesthetic (screens, dots), not hand-drawn. |
| Catalog text effects (scramble/blur/split reveals) | Digital-native motion vocabulary; contradicts the hand-made claim. |
| Paper fold / page-turn hero | Skeuomorphic weight without interaction depth; hostile to responsive layout. |

---

## 5. Sourcing decision (per registry routing rules)

Routing rule 1 satisfied: this starts from a committed thesis (Section 2), not catalog browsing. Rule 2 requires a Tier-1 catalog pass before building anything common from scratch:

### Catalog audit (against registry snapshot 2026-08-12)
| Source | Relevant inventory | Fit class | Notes |
|---|---|---|---|
| React Bits | Cursor effects, text effects | **Reference-only** | Trails are glow/elastic/particle material — adopting one means replacing its renderer and material wholesale, which the fit policy explicitly routes to custom. Worth studying for pointer smoothing/lifecycle. License gate: MIT + Commons-Clause (acceptable for a portfolio site, but flagged). |
| Fancy Components | Pointer/text effects, MIT, llms.txt | **Reference-only** | Closest genre match; study its pointer-follow scaffolding. No calligraphic-ink primitive. |
| Magic UI / SmoothUI / Aceternity / Motion Primitives | Particles, grids, morphs, marketing motion | **Poor fit** | Nothing in the ink/paper material family. |
| Cult UI / tsParticles / ShaderGradient | Canvas/dither, particle engine, gradients | **Poor fit** | Wrong material or physics; ShaderGradient additionally fails the license gate. |
| Codrops | Brush/ink canvas technique articles | **Reference-only** (its registry class) | Useful for wet-edge and bleed compositing techniques. |

**Verdict:** no catalog component supplies calligraphic ink. Per fit policy (`poor_fit` → route custom; `reference_only` when adoption would mean rewriting renderer/material), the renderer is **custom-built on a proven geometry substrate**.

### Substrate plan (npm_substrate_tier addition to propose)
- **`perfect-freehand` (MIT, ~3 KB gz, battle-tested in tldraw)** — the de-facto primitive for pressure/velocity-driven variable-width stroke outlines from pointer samples. It solves the hard geometry (width modulation, tapering, end caps) and nothing else, leaving material and composition to us — exactly the registry's substrate-vs-catalog distinction. *Must be re-verified (license, maintenance) at adoption time per `staleness_recheck` and `fact_policy`.*
- **Canvas 2D, no WebGL.** Two stacked canvases (wet + dry) plus a static paper ground. Bleed/feather via pre-jittered stroke points, edge roughening, and multiply compositing against the grain — cheap and universal. Paper Shaders (registry substrate) was considered for the ground and declined: a WebGL dependency for a static texture fails the weight-vs-value test; SVG `feTurbulence` + CSS does it for free.
- **RoughJS (MIT)** — *not* needed for the hero (its sketchy style is wireframe-sketch, not calligraphy). Noted as a likely substrate for rough frames/dividers elsewhere in the rebrand; decision deferred to that work.
- **No GSAP, no Motion for this system.** The engine is a self-contained rAF loop. Dependency-coherence rule: the ink engine is the sole motion owner of the hero canvas; if the broader rebrand later adopts Motion for DOM transitions, it must not touch the canvas, and the engine must not animate DOM. One owner per concern.

### What is custom (the authored identity layer)
1. **Ink material:** wet→dry lifecycle, sheen, feathering, bleed pooling, ghost settling, rolling evaporation.
2. **Wordmark choreography:** the display lettering converted to ordered centerline stroke paths with synthetic pressure profiles, replayed through the engine. Interim source: centerlines derived from the chosen display font's outlines; final source: the identity designer's hand-lettered vectors (see dependencies).
3. **Pointer-as-pen orchestration:** sampling, smoothing, stroke segmentation on pen-lift, exclusion masks, register boundaries, degradation matrix.

This split honors routing rule 3: the primitive (stroke geometry) does not define the identity; the material and choreography — the parts a visitor would screenshot — are ours.

---

## 6. Architecture sketch (for the future implementation change)

```
components/InkHero/
  InkHero.jsx          — client component; owns canvases, DOM text, sheet clip
  engine/
    strokeEngine.js    — perfect-freehand wrapper: samples → outline polygons
    inkMaterial.js     — wet/dry rendering, bleed, sheen, evaporation
    scheduler.js       — rAF loop, idle/blur suspension, DPR capping
  wordmark.strokes.js  — authored stroke data: [{points:[[x,y,p],…], liftMs}, …]
  underlines.strokes.js— authored hover/focus underline paths per hero link
```
- Layer stack (bottom→top): paper ground (CSS/SVG) → dry canvas → wet canvas → DOM text (`h1` real text; drawn wordmark `aria-hidden` above/behind per final art direction).
- Budget: < 50 KB total JS for the system; zero layout shift (canvases are absolutely positioned within the hero, `contain: strict`).
- `app/page.jsx` swaps its `<header>` for `<InkHero/>`; nothing else on the page changes in this workstream.

---

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Pointer ink reads as a gimmick / distracts from content | Bounded, self-erasing ink; exclusion mask around copy; ghost-level dried opacity; interaction confined to the hero sheet. |
| Signing animation annoys repeat visitors | Once per session; hard skip on reduced-motion; total under 2 s; content readable throughout (text never blocked on the animation). |
| Wordmark stroke authoring stalls on identity timeline | Interim centerline extraction from the licensed display face unblocks build; swap in hand-lettered vectors when delivered. |
| Canvas perf on low-end hardware | DPR cap, throttled sampling, point simplification, idle suspension; measured budget in the implementation change (target: < 4 ms/frame mid-tier laptop). |
| Effect drift — ink spreading to other sections | Register rule written into the component README: ink language is hero-only until a deliberate design decision extends it. |

## 8. Dependencies and open questions before implementation
1. **Wordmark vectors** — hand-lettered "Jordan Lee" (or approved display-face lettering) from the identity work; needed as ordered strokes, not filled outlines.
2. **Art direction sign-off** — ink color(s) on paper (near-black iron-gall vs. warm sepia), dried-ghost opacity, deckle intensity.
3. **Verification at adoption time** (per registry `staleness_recheck`): `perfect-freehand` license/maintenance on npm; re-check React Bits / Fancy Components for any ink-brush primitive shipped after the 2026-08-12 snapshot that could upgrade from reference-only.
4. Confirm sessionStorage (vs. localStorage) for the once-per-session signing.

---

*Prepared as a proposal-only change. Implementation follows in a separate change once dependencies 1–2 land.*

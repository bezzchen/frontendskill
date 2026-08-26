# Fresh Ink — signature hero interaction proposal

**One line:** the hero headline is not typeset text — it is a live, hand-inked drawing of "Jordan Lee" that letters itself on arrival, over non-photo-blue construction guides, and is re-inked from a new random seed on demand. No two visitors ever see the same print.

Status: proposal only. Nothing in this document is implemented.

---

## 1. Context

**The site.** A one-page personal portfolio (Next.js 16 / React 19 / Tailwind 4). The hero is currently an eyebrow ("Portfolio"), an `h1` ("Jordan Lee"), and a one-line bio: *"Software engineer working across systems, interfaces, and computational design."* Below it: a project grid and an account-settings panel. Light and dark themes via CSS variables. No animation libraries. (There is an unused `components/ConstellationData.js` with 500 placeholder nodes — noted in §5.)

**The rebrand.** Hand-drawn editorial identity: rough ink linework, imperfect edges, custom display type, paper texture.

**The brief.** One signature hero interaction consistent with that identity. The rest of the page should stay quiet; the boldness budget is spent here.

**The design problem worth solving.** "Hand-drawn" on the web usually means one of two clichés: a static scan of a drawing (dead on arrival, and it pixelates), or an SVG that draws itself once via `stroke-dashoffset` (seen on a thousand portfolios since 2015). Neither is an *interaction*, and neither says anything about Jordan. The subject is an engineer in **computational design** — the one kind of person for whom "hand-drawn" and "generated" are not opposites. That tension is the brand. The signature interaction should fuse them.

---

## 2. The signature interaction

### Concept

The hero is a sheet of the site's paper stock. On it, the display-type lettering of **JORDAN LEE** is not a font and not a picture of a drawing — it is *drawn*, in the browser, by a small procedural ink engine tracing hand-made letter skeletons. Because the ink pass is procedural and seeded, **every rendering is a genuinely different drawing of the same letterforms**: the wobble, the stroke weights, the pooling at terminals, the dry-brush gaps — all vary per seed. A small hand-drawn plate stamp in the margin numbers the print ("№ 0047"). Tapping the stamp (or the name) re-inks the whole hero from a fresh seed.

The identity's own pillars do the work:

| Identity pillar | Where it lives in the interaction |
|---|---|
| Rough ink linework | Every mark is a variable-width ink ribbon traced from a centerline — not a font glyph, not a filter effect |
| Imperfect edges | Imperfection is *computed per visit*: jitter, tremor, pooling, and gaps come from the seed, so edges are imperfect in a different way every time |
| Custom display type | The hero lettering **is** the custom display type — hand-lettered once as skeletons, inked live forever |
| Paper texture | The stage for the whole event; guides, ink, and stamp all sit on (and react to) the sheet |

And the subject closes the loop: a computational designer's homepage where the computation's output is handwriting. The thesis, stated as copy in the margin if we want it: *drawn by hand, differently every time.*

### The moment, beat by beat

1. **First paint (0 ms).** Paper texture and layout are already there (server-rendered — zero layout shift). Faint **non-photo-blue construction guides** are visible: baseline, x-height, a few slanted skeleton strokes. This is the illustrator's real underdrawing — the blue pencil that scanners are set to ignore. It gives the load state a reason to exist and paints something meaningful instantly.
2. **Inking (~0.2 s – 1.4 s).** Ink strokes draw over the guides in true lettering order (left to right, downstrokes before crossbars), with hand kinematics: quick through the middle of a stroke, easing at entry and exit, a beat between letters. Weight swells on downstrokes; ink pools slightly where a stroke ends.
3. **Settle (~1.6 s).** The blue guides fade to near-nothing — the "scan" ignores them — leaving ink on paper. The plate stamp scratches itself in at the margin: **№ 0047** (the seed, dressed as an edition number). The eyebrow and bio line fade up in the body face.
4. **Idle / hover.** The sheet is quietly alive: strokes within a small radius of the pointer get a sub-pixel tremor and a ~4% ink swell, as if re-wetted under the hand. Transform-only, composited, spring-damped. On touch devices this beat simply doesn't exist — no fake hover.
5. **The act (the signature).** Clicking or tapping the name or the stamp **re-inks the hero from a new seed**: guides flash back up, the ink pass re-runs fast (~0.7 s), the stamp increments. Same letterforms, different hand. The stamp is a real `<button>` ("Redraw — plate № 0047"), so the act is keyboard- and screen-reader-reachable.
6. **Reduced motion.** `prefers-reduced-motion`: no draw-on, no tremor. The hero renders fully inked; redraw becomes an instant crossfade to the new print. The interaction (a new seed) survives with zero animation.

Layout sketch (desktop):

```
┌────────────────────────────────────────────────┐
│ paper                                          │
│  PORTFOLIO            (small caps, quiet)      │
│                                                │
│  ╔══════════════════════════════╗              │
│  ║  J O R D A N   L E E         ║  ← live ink  │
│  ║  (blue guides under strokes) ║              │
│  ╚══════════════════════════════╝              │
│  Software engineer working across systems,     │
│  interfaces, and computational design.         │
│                                    [№ 0047] ←  │
│                                    stamp/button│
└────────────────────────────────────────────────┘
```

### Why this is the one

- **It is the identity, performed.** Not a hand-drawn *decoration on* a hero — the hero's primary content (the name, in the custom display type) is produced by the identity's own logic, live.
- **It encodes the subject.** Generative imperfection is exactly what "computational design" means to a visitor who can't read code. The interaction is the portfolio's first case study.
- **It survives the screenshot test.** Because imperfect ink is baked into every frame, a static capture still looks designed — the motion is a bonus, not the substance.
- **Its variance is honest.** A personal mark that's never identical twice is a defensible aesthetic risk for a *person* (people's signatures vary; logos don't). The canonical form lives in the skeletons; every print is an original. That is the one bold spend on this page — everything around it stays disciplined and editorial.

---

## 3. Sourcing the assets

### 3.1 The lettering (the custom display type)

- **Make it by hand, once.** Letter "JORDAN LEE" (plus the ampersand-level extras we'll want later: "Projects", "Settings", arrows, the stamp frame) with a real pen — paper or iPad (Procreate). This is the identity's actual hand; it cannot come from a marketplace font.
- **Vectorize to centerlines, not outlines.** Trace each stroke's *skeleton* (Illustrator pen tool over the scan, or Inkscape centerline trace, then manual cleanup). Deliverable: an SVG of stroked centerline paths per glyph, in drawing order, annotated with a coarse width profile (entry / belly / exit weight) per stroke.
- **Compile to stroke data.** A small build-time script converts that SVG into JSON: polyline points, per-stroke width profile, draw order, timing hints. Budget ≤ 8 kB gzipped for the full hero set. This file is the "typeface"; the ink engine is its rasterizer.
- **Why centerlines matter:** outlines freeze one rendering forever. Skeletons let the engine re-ink at any weight, with any jitter, at any resolution — which is the whole trick.
- **Relationship to the site-wide display face:** the rebrand's custom display type should be digitized from this same lettering hand so hero and headings agree. Static headings elsewhere can use the fixed font; only the hero gets the live engine.

### 3.2 The paper

- **Layered, not a photo-JPEG background.** Base: the theme's paper tint (CSS variable, both modes). Grain: inline SVG `feTurbulence` at low opacity (free, resolution-independent, theme-aware). Character: one small tiled scan of real cotton paper at very low opacity for the fibers turbulence can't fake (≤ 30 kB, AVIF/WebP).
- **Dark mode is a different stock, not an inversion.** Light: warm cream sheet, near-black ink, non-photo-blue guides. Dark: graphite/slate stock, bone-white ink (white-ink-on-black is a real illustration medium), guides shift to a pale chalk blue. Both palettes stay ink + paper + guide-blue; the guide blue is the only accent, and it has a production reason to exist.

### 3.3 The ink engine (built, not installed)

- **Custom, ~200–300 lines. Explicitly not rough.js.** rough.js/Excalidraw's hachure look is now the single most templated "hand-drawn web" signal; shipping it would brand the site as everyone else. Our stroke model is defined by us: baseline wobble (low-frequency noise along the path), width profile (pressure), ink pooling at stroke ends, occasional dry-brush breakup on fast segments, slight overshoot at terminals.
- **Rendering:** each stroke's skeleton is expanded to a variable-width ribbon polygon (perpendicular offsets × width profile × seeded noise) and emitted as an SVG path fill. Draw-on animation masks each ribbon with a dash-animated stroked copy of its own centerline — the standard mask trick, giving "ink flowing" rather than "path tracing".
- **Seeded PRNG (mulberry32).** The seed fully determines a print: reproducible for QA, shareable if we ever want `?plate=0047`, and it *is* the stamp number.
- **No new runtime dependencies.** SVG + rAF + Web Animations API. No GSAP, no canvas library.

---

## 4. Build plan (when green-lit)

1. **Lettering sprint (1–2 days, design).** Pen work, vectorization, skeleton cleanup, width annotation. Exit: approved skeleton SVG.
2. **Ink engine (1–2 days, eng).** Ribbon expansion, seeded noise, draw-on masking, plate-stamp button. Exit: hero re-inks deterministically from any seed at 60 fps.
3. **Integration (1 day).** Replace the hero header in `app/page.jsx`; paper layers in `globals.css`; SSR strategy below; touch behavior; reduced-motion paths.
4. **Tuning (1 day).** The taste pass: wobble amplitude, timing curves, pooling size, guide opacity. This is where "charming" vs "gimmick" is decided; budget for it explicitly.

**Next.js specifics.** Server-render the static scene (paper, guides, layout, real text) with a fixed canonical seed so hydration matches; the engine takes over after mount and rolls a per-visit seed for the ink pass. No-JS visitors get the canonical print (seed 0001) as a static inline SVG — fully on-brand, just not alive.

**Accessibility contract.** The real `<h1>Jordan Lee</h1>` stays in the DOM (visually hidden); the drawing is `aria-hidden`. Redraw is a labelled button with visible focus. Reduced-motion honored as in §2. The interaction is decorative-plus: nothing on the page *requires* it.

**Performance budget.** Hero JS ≤ 15 kB gzip; stroke data ≤ 8 kB; texture ≤ 30 kB; CLS 0 (scene is laid out at first paint); hover work is transform-only; re-ink is event-driven, never per-frame idle work. First-frame guides + paper give an immediate LCP-meaningful paint.

---

## 5. Alternatives considered

- **Draw-on-load only (no interaction).** The 2015 portfolio cliché; a load animation is not a signature interaction, and it happens once.
- **Visitor draws on the paper (nib cursor).** Tactile and on-texture, but it's a toy: it says nothing about Jordan, fights scrolling on touch, and its content is whatever the visitor scribbles.
- **Continuous ink line drawn by scroll, threading the whole page.** Handsome, but it's a page mechanism rather than a hero thesis, it dilutes the boldness budget across the layout, and scroll-scrubbed line drawing is itself now common.
- **Ink/cross-hatch cursor reveal ("torchlight").** Pure gimmick; decorates the identity without encoding anything.
- **Hand-plotted constellation from `ConstellationData.js` (500 nodes).** The data is unused scaffolding with placeholder labels; plotting it would be decoration masquerading as information. Revisit only if a real "map of practice" dataset ever exists.

Each loses to Fresh Ink on the same test: does the interaction *perform the identity* and *say something true about the subject*? Only the live re-inked lettering does both.

---

## 6. Risks and mitigations

- **Kitsch drift.** Hand-drawn slides into "quirky greeting card" fast. Mitigation: monochrome discipline (ink + paper + guide-blue only), editorial spacing, and the tuning day in §4. The engine's parameters are conservative by default; wobble is a seasoning, not a costume.
- **Sameness-to-Excalidraw.** Mitigated structurally: custom stroke model, no hachure fills, real lettering instead of sketchy boxes.
- **Legibility of the lettering.** The skeletons are approved as *type* first (read at 40 px on a phone) before any ink dressing is tuned.
- **Low-end devices.** The expensive step (ribbon generation) happens only on load and on explicit redraw; idle cost is a couple of composited transforms. If needed, tremor degrades to off via a frame-time check.
- **Hydration mismatch.** Solved by design: deterministic canonical seed on the server, per-visit seed only after mount.

---

## 7. What "done" looks like

- A visitor arriving on any device sees paper, blue guides, and the name inked in under 1.5 s with zero layout shift.
- Pressing the plate stamp produces a visibly *different* drawing of the same name, and the number increments.
- Two screenshots from two visits are recognizably the same identity and demonstrably not the same image.
- Reduced-motion, keyboard, screen-reader, and no-JS paths all deliver the brand without the motion.
- Lighthouse: no regression beyond the stated byte budgets; interaction runs at 60 fps on a mid-tier phone.

**Later, outside this scope:** the same engine can quietly ink the rest of the rebrand — section rules, project-card frames on hover, the settings checkmark — so the hero's hand is the site's hand. Propose separately once the hero ships.

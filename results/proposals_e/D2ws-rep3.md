# D2ws-rep3 — with-skill, catalog-aware (Fable)

Eval: D2-bespoke-identity-trap. Fixture next-tailwind-base @ edf3be4 (pristine).
Delivery identical to rep1. Plan-only.

## Recon
app/page.jsx = text masthead (kicker / "Jordan Lee" h1 / one-line bio), 8-card ProjectGrid,
SettingsPanel form. Next 16.2.12 / React 19.2.8 / Tailwind 4.3.3, ZERO motion or graphics deps
installed — "the single-motion-owner slot is open."
FLAG: components/ConstellationData.js ships 500 unused "constellation" nodes, referenced nowhere,
"reads like bait for a particle-field hero" — declined as hero material, wrong genre for rough ink
and paper. (Independently flagged by rep1 too.)

## Register decision
**W (Expressive/Persuade) for hero; Q (Quiet/Operate) below the fold.**

**S explicitly weighed and DECLINED knowingly** — considered WebGL fluid-ink simulation, a
full-canvas paper world, and repurposing the 500 constellation nodes into an ink-particle field.
Three reasons: (a) the identity is EDITORIAL — content-first, a crafted document, not a world;
making the graphical system structurally central fights the rebrand's own thesis; (b) the same page
hosts operate surfaces (settings form, project grid) that must stay calm — spectacle bleed would
damage them; (c) the brief asks for one signature INTERACTION, not an immersive system.
"The hero's ink system will materially respond to input, but it remains an accent inside a
document — that is W, not S."

Q consequences: grid and settings get the identity through STATIC rough styling (hand-ruled
borders, paper ground, imperfect edges) + hover micro-transitions only, zero new dependencies.

## Concept — "Second Pass"
The masthead is hand-inked and never draws the same line twice.
- Hero masthead is a design-time SVG of LETTERING, not font glyphs: each letterform is 2-3
  overlapping rough ink strokes, the way a pen retraces a display letter. This is what makes
  "custom display type" real — the title is authored lettering; body text stays a real webfont.
- On load: strokes draw themselves in pen order (stroke-dashoffset, staggered, ~1.2s, once).
- Interaction: the pointer is a fresh pen. Strokes within a small radius re-ink — glyph swaps to
  one of 3 precomputed rough variants (different seeds) with a short partial redraw, so the drawing
  visibly re-forms under the reader's hand and settles ("dries") when they move away.
  Touch: tapping the masthead re-inks it in one left-to-right sweep.
  Reduced motion: no draw-on (render complete), proximity disabled, click = instant variant swap.
- "One idea, stated once: the hand-drawn identity becomes behavioral, not just visual."

## Fit gate — checked and cited
Queried live: React Bits, Fancy Components, Magic UI llms.txt. Registry notes cover
Aceternity/SmoothUI/Motion Primitives (latter 429-blocks fetchers; wrong genre anyway).

| Candidate | Verdict | Why |
|---|---|---|
| React Bits "Stroke Text" | reference-only | Closest draw-on precedent but strokes FONT OUTLINES — mechanical, not hand-inked; adopting as signature = catalog-as-identity. MIT+Commons-Clause noted. |
| React Bits cursor family (Blob/Splash/Glow/Swarm/Pixel, WebGL Pro) | poor_fit | Glossy digital genre; stacking is the registry's named anti-pattern. |
| Fancy "Elastic Line" | reference-only | Genuinely adjacent for the hand-ruled underline's cursor response, but motion is Motion-engine spring elastic (rubber band, not ink); adapting = rewriting its animation layer -> reference-only per fit policy. |
| Fancy "Text Highlighter"/"Underline Animation"; Magic UI "Highlighter" | reference-only | Closest genre matches in ANY catalog — "and precisely the most recognizable off-the-shelf hand-drawn moves. The identity must be authored; accents will come from our own rough pipeline so every line shares one hand." |
| Magic UI "Noise Texture" (feTurbulence) | reference-only (pattern) | Right idea for paper grain; implement as build-time baked tile, not a live filter. |
| rough-notation (npm 0.5.1, 2022) | rejected | Stale, owns its own timing (violates one-motion-owner), recognizable defaults. |
| **rough.js (npm 4.6.6)** | **adopt — BUILD-TIME substrate only** | Canonical hand-drawn geometry generator. Last modified 2023, so refused as a RUNTIME dep; as a Node build script whose roughened-SVG output is committed, staleness risk ~zero and runtime footprint zero. MIT. |
| Paper Shaders / live GPU grain | declined | Register creep toward S; static grain tile is cheaper and more print-true. |
| GSAP 3.15.0 | not adopted — named fallback | See architecture. |

**Fit-gate outcome: custom build.** "The search was real and the gap is real: no Tier-1 catalog
carries a hand-drawn ink system; their inventories are digital-glossy."

## Architecture
- Rendering SVG, geometry-first. Roughness from rough.js GEOMETRY (jittered paths), never
  per-frame feTurbulence displacement on strokes — filters repaint expensively, geometry is cheap
  and crisp. Paper texture = one baked tile (data-URI, CSS multiply, pointer-events:none).
- Asset pipeline (design-time, committed): Node script takes lettering skeletons + seeds -> emits
  masthead.svg with per-glyph variant groups (N=3, drop to 2 if over budget).
  Budget: <=45KB gzipped inline SVG, MEASURED at build.
- **Motion owner — exactly one: a small bespoke WAAPI controller.** Runtime needs are modest
  (dashoffset draw-on with stagger; variant swap + partial redraw on proximity; event-driven only).
  WAAPI covers all of it with zero dependencies. **Fallback trigger named up front:** if
  choreography outgrows WAAPI (e.g. a future scroll-scrubbed drawing sequence), GSAP 3.15 becomes
  the single owner and the WAAPI module is retired — never both.
- Next.js integration: hero is one client island; SVG server-renders FULLY DRAWN so no-JS visitors
  and crawlers see complete art (real <h1> kept for AT/SEO, SVG aria-hidden); JS sets the un-drawn
  state before first paint (layout-effect gated) — no flash, no CLS.
- Ownership boundary: proposal fixes register, architecture, engine, budgets only. Lettering
  skeletons, palette, body typeface, layout belong to the design-director pass (noted frontend-design
  is available) — "I am deliberately not specifying them here."

## Unprompted performance / verification
Design invariant: ZERO ambient work. No idle rAF, no timers, no library ticker exists at all
(no GSAP, so nothing ticks by default). Draw-on runs once; re-inking only during pointermove inside
the hero. Additionally — unprompted by the brief — IntersectionObserver on the hero plus a
visibilitychange listener CANCEL in-flight animations and detach pointer sampling when the hero is
offscreen or the document hidden, so even mid-gesture work stops.

Verification tests actual conditions, not proxies: (1) Performance recording while ACTUALLY
scrolling the hero offscreen into the settings section — assert zero hero-attributable animation
frames; (2) an ACTUAL tab switch with a frame counter checked on return, "not a synthetic
document.hidden flip"; (3) long-task audit during load draw-on; (4) touch path on a real mobile
viewport; (5) reduced-motion under the real media query.
"I will not report any of these mitigations as working until observed working."

## Compliance
Plan-only respected: read-only commands only, no files touched.

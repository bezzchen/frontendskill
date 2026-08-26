# Signature Hero Interaction Proposal: The Wet Signature

**Status:** Proposal only — no implementation in this change.
**Scope:** The hero of `app/page.jsx` (the "Jordan Lee" masthead). One interaction, one system.

---

## 1. Thesis

The site is a personal portfolio. The rebrand is hand-drawn editorial: rough ink
linework, imperfect edges, custom display type, paper texture. The single most
characteristic artifact in that world — for a *person's own site* — is a
signature.

So the signature hero interaction is, literally, a signature:

> **The masthead "Jordan Lee" is real hand-inked lettering that signs itself
> onto the paper when the page opens — drawn stroke by stroke in the order a
> hand would write it, with a wet-ink front that bleeds and then dries into the
> paper grain. The ink stays alive afterward: pointer proximity re-wets nearby
> strokes, and clicking or tapping the name re-signs it — and it never signs
> the same way twice.**

The "never twice" behavior is the conceptual lock. Jordan's bio says
"systems, interfaces, and computational design." The lettering is made by hand
(the brand), but its timing, jitter, and variant selection are computed (the
practice). Hand × computation, in one moment, at the top of the page. It is
also the strongest possible claim of authorship a portfolio can make: the site
is signed.

---

## 2. Where the site is today

- Next.js 16 / React 19 / Tailwind 4. No animation libraries, no font loading,
  no icon or graphics dependencies. (`package.json` is intentionally lean.)
- Hero is plain text: eyebrow "Portfolio", `h1` "Jordan Lee", one-line role
  description (`app/page.jsx`).
- Theme tokens live in `app/globals.css` (light/dark via
  `prefers-color-scheme`); body face is currently Arial — the custom display
  type mentioned in the rebrand does not exist in the repo yet.
- `components/ConstellationData.js` (500 generated nodes) is dead code —
  imported by nothing. It is not a foundation to build on (see §6).

Implication: the interaction must be buildable with **zero new runtime
dependencies** to respect the stack, and it must not assume brand assets that
don't exist yet — it must define its own asset pipeline.

---

## 3. The interaction, moment by moment

### 3.1 Entrance — "the signing" (first visit per session, ~1.4s)

1. The paper is already there: background texture, eyebrow, and role line
   render immediately. Space for the masthead is exactly reserved (no CLS).
2. A single ink line begins writing "Jordan Lee" in **ductus order** — the
   true stroke order a hand would use, with brief pen-lift pauses (40–90ms)
   between strokes. Per-stroke duration is derived from real path length, with
   easing that mimics a pen: slow entry, fast mid-stroke, slow exit.
3. The stroke tip carries a **wet head**: for ~300ms behind the tip, ink is
   darker and bleeds slightly into the paper (a transient displacement/blur
   filter), then settles and "dries" to the resting ink color.
4. The final stroke is a rough underline flourish that crosses beneath the
   name — the signature rule. It slightly overshoots and settles.
5. The signing plays **once per session** (`sessionStorage`), never on every
   client-side navigation. Total budget ≤ 1.5s; content below is never blocked.

### 3.2 Idle — the ink is dry but not dead

The masthead sits as textured ink multiplied into the paper. No looping
animation, no idle rAF work. It reads as printed/inked, not rendered.

### 3.3 Hover / proximity — "still wet"

As the pointer moves near the masthead, the closest strokes re-wet: a ~1.5px
swell and a soft darkening/bleed, strongest nearest the pointer, decaying with
distance. It feels like fresh ink you shouldn't touch. Single throttled
`pointermove` listener, active only while the hero is on screen
(IntersectionObserver), transform/opacity-only updates.

### 3.4 Click / tap — "sign it again"

Clicking the name (or activating an adjacent small, visible control styled as
an inked asterisk, which is the keyboard-accessible path) wipes the masthead
with a quick dry-brush scratch and re-signs it. Every re-signing differs:

- one of **3 fully hand-drawn lettering variants** (like a real person's
  signature, same identity, different execution);
- runtime seed jitter: per-stroke delay ±60ms, group rotation ±0.6°, 1–2px
  baseline drift, alternate glyphs where variants provide them.

No two visits — and no two clicks — produce the identical signature. On touch
devices, tap does the same; a faint wet shimmer on first idle hints the
affordance.

### 3.5 What it deliberately does NOT do

No cursor trail, no drawing canvas for visitors, no parallax, no scroll
hijack. One object, one behavior, everything else on the page stays quiet.
(The underlying "pen engine" can later draw section rules and link underlines
so all site linework feels like the same hand — but that is explicitly out of
scope for this deliverable.)

---

## 4. Why this fits the identity, pillar by pillar

| Brand pillar | How the interaction embodies it |
| --- | --- |
| Rough ink linework | The interaction *is* linework — real drawn strokes, revealed as drawing, with pen-lift pauses and stroke-order truth. |
| Imperfect edges | Imperfection is baked (rough vector outlines from real ink) **and behavioral** (never signs the same way twice — imperfection as a live property, not a static texture). |
| Custom display type | The masthead is one step beyond a custom face: one-off hand lettering. The rebrand's display font handles every other heading; the lettering stays unique to the hero, which keeps it special. |
| Paper texture | Ink multiplies into the paper (blend mode), and the wet-to-dry lifecycle makes the paper read as *absorbent material*, not a background JPEG. |

And it fits the *subject*: a personal site, signed by its person; a
computational designer, whose signature is generatively varied.

---

## 5. Sourcing the assets (this is the whole ballgame)

The concept lives or dies on the lettering. **It must not be a script font.**
Pacifico-style fonts are the templated answer and would betray "custom display
type" instantly.

Pipeline:

1. **Draw it for real.** "Jordan Lee" hand-lettered with actual ink (pen/brush
   on paper, or an ink brush in Procreate at high resolution). Three complete
   variants, plus a few alternate glyphs and two underline flourishes. If no
   human hand is available, letterforms are drawn manually in a vector tool
   with a pressure brush and deliberate irregularity — never typed.
2. **Digitize.** Scan at 1200dpi (or export at 4×), trace in
   Illustrator/Inkscape — with manual pen-tool cleanup so path topology stays
   sane (traced ink often produces thousands of junk points).
3. **Two layers per variant:**
   - **Fill layer:** the visible letterforms as outlined shapes, rough edges
     baked into the vectors themselves (cheap at runtime, honest to the source
     ink).
   - **Skeleton layer:** hidden centerline paths following each stroke's
     ductus, used only for animation (see §6). Drawn by hand over the fills —
     ~20–30 paths per variant, each tagged with stroke order.
4. **Optimize.** SVGO, precision capped, precomputed path lengths embedded as
   data attributes at build time. Budget: ≤ 30KB gzipped for all three
   variants combined, inlined in the component (no network fetch, no LCP
   dependency on an asset request).

Paper texture is sourced the same spirit: an SVG `feTurbulence` fractal-noise
tile as a data URI (or a small scanned-paper tile ≤ 15KB), CSS
`background-blend-mode: multiply` with the existing `--background` token, so
it respects light and dark themes from `globals.css`.

---

## 6. How it's built (zero new dependencies)

**Reveal technique — dual-layer SVG mask.** You cannot stroke-animate filled
letterforms directly. The standard, robust approach:

- The textured fill lettering sits under an SVG `<mask>`.
- The mask contains the skeleton centerlines, stroked white, round caps,
  stroke-width slightly wider than the widest part of each letter stroke.
- Animating `stroke-dashoffset` on the mask paths (CSS animations or the Web
  Animations API — no GSAP, no framer-motion) reveals the fill exactly as if a
  pen were laying it down, preserving the rough edges of the real ink.

**Pen engine.** A small client component (`components/InkSignature.jsx`,
~200 lines) that: orders strokes, derives per-stroke duration from embedded
path lengths, applies easing and pen-lift gaps, seeds the jitter, picks the
variant, and exposes `sign()` / `resign()` — the only imperative API. React
owns state; WAAPI owns the timeline.

**Wet-ink bleed.** One shared SVG filter (`feTurbulence` +
`feDisplacementMap`, small `feGaussianBlur`) applied transiently to a "wet
head" group that trails the reveal tip, and to proximity-re-wetted strokes.
Filters are expensive, so: filter region clamped to the affected stroke's
bbox, applied only during the ~300ms wet window, never page-wide, and disabled
entirely on `prefers-reduced-motion`, `Save-Data`, or low
`navigator.deviceMemory`. The resting state uses **no filters at all** —
roughness is pre-baked in the vectors.

**Hero markup.** The `h1` keeps real text: visually-hidden "Jordan Lee" for
AT/SEO/LCP, with the SVG lettering `aria-hidden` beside it. The re-sign
affordance is a real `<button>` with an accessible name ("Sign again").

**Progressive enhancement / fallbacks.**

- No JS / hydration failure: the fully-inked static masthead is the default
  render (mask fully revealed); the animation only ever *adds*.
- `prefers-reduced-motion: reduce`: no signing animation, no bleed, no swell —
  name appears fully inked; re-sign swaps variants with an instant crossfade.
  No information exists only in motion.
- Touch: full behavior via tap; proximity re-wetting simply absent (it is
  pure flavor, not information).
- Dark mode: ink color and paper blend driven by the existing CSS tokens;
  "ink on paper" becomes "chalk-white ink on slate paper" without new logic.

**Performance budgets.**

- ≤ 30KB gzipped lettering + ≤ 15KB paper tile; zero new npm dependencies.
- Animate only `stroke-dashoffset`, `transform`, `opacity`.
- 60fps on mid-tier mobile during signing; **zero** idle main-thread work.
- No CLS (fixed `viewBox`, reserved box); signing ≤ 1.5s; LCP unaffected
  (inline SVG + real text node paint immediately).

---

## 7. Alternatives considered and rejected

1. **Pointer-as-nib ink trail (visitor draws in the hero).** The most obvious
   "ink" interaction — which is the problem: generative cursor trails are a
   recognizable AI-site tell, they die completely on touch, and they make the
   visitor perform instead of the brand. Rejected as cliché and off-register
   for *editorial* restraint.
2. **Sketch-to-ink page reveal (pencil under-drawing inks in as you
   scroll/hover).** Attractive "process made visible" story, but it is a page
   system, not one signature moment; it spreads the boldness thin and
   multiplies cost across every component. Rejected on focus.
3. **Paper physics (sheet tilt, crinkle, page-turn).** Skeuomorphic gimmick;
   fights readability and Core Web Vitals; says "paper" without saying
   "editorial" or "hand." Rejected.
4. **Hand-plotted constellation using `ConstellationData.js`.** The repo
   contains 500 unused generated nodes. Inking a node-graph hero would read as
   data-viz-brand, not intimate editorial; the data is placeholder with no
   real meaning; and 500 animated elements fights the perf budget. Rejected —
   and that file should eventually be deleted, separately from this work.
5. **Rough annotations everywhere (circled words, margin doodles, arrows).**
   Texture, not a signature; decoration scattered instead of one memorable
   act. Rejected — though the pen engine leaves the door open to *earned*
   reuse later (section rules, link underlines).

The chosen concept survives the test the others fail: it is specific to *this*
subject (a person, signing their own site), not portable to any random brand.

---

## 8. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Lettering quality is mediocre → whole concept collapses | Treat the lettering as the critical-path asset; iterate on the drawing before any engineering; test legibility at 320px width and in dark mode. A script font is never an acceptable fallback. |
| SVG filters jank on low-end devices | Filters are transient-only, bbox-clamped, and feature-gated (reduced-motion / Save-Data / deviceMemory). Resting state is filter-free. |
| Replay annoyance for returning visitors | Sign once per session; afterwards only explicit re-sign triggers it. |
| Name legibility (rough lettering is still a wordmark) | Ductus and contrast reviewed against WCAG (ink ≥ 7:1 on paper); plain-text role line always adjacent; real `h1` text for AT. |
| Scope creep into a site-wide ink system | Hero-only boundary in this deliverable; pen-engine reuse is a named follow-up, not part of this scope. |

---

## 9. Delivery plan (when implementation is approved)

1. **Asset production** — three lettering variants drawn, digitized,
   dual-layered, optimized. (~0.5–1 day, mostly drawing/cleanup.)
2. **Pen engine + entrance** — mask reveal, ductus timing, wet head, dry-down;
   session gating. (~1 day.)
3. **Interaction layer** — proximity re-wet, re-sign with variants and jitter,
   touch and keyboard paths. (~0.5–1 day.)
4. **Hardening** — reduced-motion/no-JS/dark-mode parity, perf audit on
   throttled mobile, CLS/LCP verification, cross-browser mask/filter QA
   (Safari especially). (~0.5–1 day.)

Total: roughly 2.5–4 days end to end, no new dependencies.

**Success criteria:** a first-time visitor can describe the site afterward as
"the one that signs itself"; 60fps signing on mid-tier mobile; zero CLS;
reduced-motion users lose nothing but motion; the masthead still reads as
"Jordan Lee" at a glance on a 320px screen.

# Hero Interaction Proposal — "The Wet Signature"

**Status:** Proposal only. No implementation in this change.
**Scope:** One signature hero interaction for the jordan-lee-site rebrand (hand-drawn editorial identity).
**Date:** 2026-08-20
**Registry consulted:** `runs21/context/component_libraries.json` (snapshot 2026-08-12), Tier-1 sweep re-run 2026-08-20 (see §5).

---

## 0. TL;DR

The hero headline — Jordan Lee's name, set in the rebrand's custom hand-lettered display type — **inks itself onto the paper on first view, stroke by stroke, like a signature being signed.** After it settles, the ink stays alive: letters near the pointer occasionally **re-ink themselves** with alternate hand-drawn variants, so the headline reads as freshly written rather than printed. One material system (ink on paper), one renderer (SVG), one motion owner (GSAP).

Sourcing verdict after a full Tier-1 catalog sweep: **no catalog ships this material — the ink system is custom-built.** GSAP is adopted as the motion substrate (registry substrate tier, now fully free), the paper grain adapts Magic UI's `Noise Texture` feTurbulence recipe, and three catalog components are used as *reference-only* implementation patterns. The recognizable alternatives (rough-notation scribble circles, cursor ink trails) are explicitly rejected as under-authored.

---

## 1. Context

**The site.** A one-page Next.js 16 / React 19 / Tailwind 4 personal portfolio (`app/page.jsx`): a purely typographic hero (`h1` "Jordan Lee" + kicker + one-line bio), a project grid, and a settings panel. No motion library is installed today; the hero is the only identity surface.

**The brief.** Rebrand around a hand-drawn editorial identity: rough ink linework, imperfect edges, custom display type, paper texture. The site needs **one** signature hero interaction consistent with that identity.

**The constraint set (from the registry's fit policy).** Components are ingredients, never the art direction. One strong adapted primitive plus bespoke composition beats stacked effects. If a primitive would define the identity unchanged, the design is under-authored. One motion owner per concern. License and staleness gates before any adoption.

---

## 2. Design thesis (committed before catalog browsing)

Per registry routing rule 1, the thesis comes first:

> **The hero is a manuscript, not a screen.** Everything the visitor sees in the hero should look like it was put there by a hand holding a pen — and the signature moment is watching that hand work. On a personal portfolio, the most honest possible subject for that moment is the author's own name: the site *signs itself*.

Three properties fall out of this thesis and become acceptance criteria for any candidate interaction:

1. **The effect must be the content.** No decoration bolted next to the headline; the headline itself is the interaction. (This is what separates a signature interaction from a flourish.)
2. **One material, one gesture.** Ink on paper, applied by a pen. Load-in, idle, and pointer response are all expressions of that single system — never a second effect stacked on top (registry anti-pattern rule).
3. **It must exercise the rebrand's actual assets.** The brief names *custom display type* as part of the identity. The interaction should be built **from** the custom lettering, making the brand's most important asset also its most memorable moment.

---

## 3. The interaction, beat by beat

### 3.1 First paint (before JS settles)
Server-rendered hero shows the paper field (ivory ground, subtle fiber grain, a hairline rough-rule under the masthead area) with the headline **already present in its final inked state** — no blank hole, no layout shift. A tiny inline script (before paint, on hydration) rewinds the ink masks so the draw can play without a flash of final state. With JS disabled, visitors simply keep the finished manuscript.

### 3.2 The inking pass (~1.6s, first view per session only)
The name draws itself in true stroke order — down-strokes thick, connectors thin — as if written with a pointed nib:

- Per-stroke reveal, 90–220ms per stroke depending on stroke length, with 40–80ms "hand travel" pauses between strokes and a slightly longer pause between the two names.
- A custom "nib" ease: fast attack, slight deceleration into stroke ends.
- **Ink behavior at stroke ends:** a small pooling swell (goo-filtered dot scaling 1→1.15) followed by a 300ms "dry-down" — the stroke darkens/desaturates marginally as it dries. This is the detail that sells *ink* rather than *line animation*.
- The kicker ("Portfolio") and bio line do not wait: they're set type, visible immediately. The draw is the hero's paint, never a splash screen gating content.
- Finale: one rough underline flourish sweeps beneath the name — drawn by the same system, same material (not a second effect; it's the pen lifting off).

Repeat visits in the same session (sessionStorage guard): the pass is skipped or compressed to a ~300ms settle, respecting returning readers.

### 3.3 Settled state (idle)
The manuscript at rest. Optionally, behind a default-off flag for design review: a very low-frequency "boil" (letterforms swap between edge-jitter variants every ~500ms, stepped, ±0.5px) — the hallmark of hand-drawn animation. Ships only if it survives a calm-reading test; the default assumption is that a resting manuscript should rest.

### 3.4 Pointer response — "the ink never quite dries"
The persistent, distinctive layer:

- Each glyph carries **three authored variants** (master + two alternates, 4–8% deviation in weight, wobble, and terminal shape).
- When the pointer moves within ~90px of a glyph (quadratic falloff), that glyph may **re-ink**: its current strokes fade over ~80ms while the alternate variant draws on in 130–180ms — a fast, quiet version of the load pass, with a ±1px baseline settle and ≤0.5° rotation.
- Discipline against noise: per-glyph cooldown of 1.2–2.5s (randomized), at most two glyphs re-inking concurrently, deltas small enough that a reader who never notices the mechanism still feels the headline is "alive."
- The underline flourish re-draws (one of three variants) when the pointer crosses it.

This is the signature behavior no set-type effect can imitate: the letterforms are not a font being transformed — they are *alternate takes by the same hand*.

### 3.5 Touch devices
No hover exists; the inking pass is the main event. A tap on the headline re-inks the tapped word (same cooldowns). No scroll hijacking, no gesture conflicts.

### 3.6 Reduced motion
`prefers-reduced-motion: reduce` ⇒ static final inked state, no draw, no re-ink, no boil. The manuscript is simply finished. (The identity survives fully — paper, roughness, and lettering are static properties.)

### 3.7 Accessibility & semantics
- The `h1` remains real DOM text (visually hidden); the SVG lettering is `aria-hidden`. Selection/find-in-page/SEO unaffected.
- Fixed aspect-ratio container reserves the hero box: zero CLS.
- No informational content is carried by motion alone.

---

## 4. Why this one

**Identity fit, per brief term:**

| Brief term | Where it lives in the interaction |
|---|---|
| Rough ink linework | The strokes *are* the artwork — variable width, authored roughness, pooling, dry-down |
| Imperfect edges | Pre-baked edge deviation in every glyph variant; re-inking makes imperfection *behavioral*, not just visual |
| Custom display type | The interaction is built from the rebrand's hand-lettered headline — the brand asset is the spectacle |
| Paper texture | The ground the ink sits on; grain subtly modulates stroke edges so ink and paper read as one surface |

**Single-system discipline.** Load reveal, flourish, and pointer re-ink are one renderer, one material, one motion owner. This satisfies the registry's anti-pattern rule (no stacked recognizable effects) and its composition rule (one strong system + bespoke composition).

**Effect is content.** On a personal site, the hand-signed name is the highest-meaning surface available. The interaction can't be transplanted to another site without re-lettering — which is precisely what "signature" should mean.

### Alternatives considered and rejected

1. **Marker scribble annotations on hover (circle/underline key words).** The most literally "editorial" idea — and the most compromised. The Tier-1 sweep found it *packaged twice*: Magic UI `Highlighter` ("human-drawn marker stroke") and Aceternity's `Playful Hero Section` (react-rough-notation circling/underlining). A packaged primitive defining the identity unchanged is the registry's textbook definition of under-authored. It's a 2023–24 agency-site trope. Rejected as signature; the *gesture* survives only as our own flourish, drawn by our own ink system.
2. **Ink-nib cursor trail across the hero (canvas).** Tactile and fun, but: cursor-trail is a recognizable catalog genre (React Bits ships four cursor effects); it decorates *around* the content instead of being it; it's dead on touch; and a persistent trail competes with reading. Rejected.
3. **Turbulence-wobble on live text (Aceternity `Squiggly Text` genre).** Gives "imperfect edges" on set type cheaply — but it's a filter on a font, not hand lettering; it's ambient (not an interaction); and the packaged version is Motion-engined, conflicting with the hero's GSAP ownership. Reference-only (see §5).
4. **Scroll-scrubbed sketch-to-finished illustration.** Heavy asset pipeline, scroll-scrub pacing contradicts the calm editorial register, and the hero is typographic, not pictorial. Rejected.
5. **Paper physics (page curl, torn-edge reveal).** One-shot skeuomorphic gimmick with no persistent life and a weak a11y story. Rejected.
6. **WebGL fluid-ink simulation.** Wrong material feel (digital fluid, not pen ink), heavy substrate (R3F/shaders) for a dependency-light typographic site. Rejected.

---

## 5. Sourcing decision (registry fit-policy applied)

### 5.1 Tier-1 sweep results (re-verified 2026-08-20 via each catalog's llms.txt)

| Catalog | Relevant findings | Classification |
|---|---|---|
| **React Bits** | No ink/hand-drawn primitives. Closest: `Stroke Text` (font-outline draws on, floods with fill) — uniform-width font outlines, not variable-width lettering. Cursor trails exist (mostly Pro). | **reference_only** (`Stroke Text` lifecycle/reveal sequencing). License note: MIT+Commons-Clause per registry — no code copied. |
| **Fancy Components** | No ink/hand-drawn primitives. `Text Cursor Proximity` / `Variable Font Cursor Proximity` implement the exact pointer-falloff model we need (MIT). | **reference_only** (proximity falloff + rAF pointer loop pattern). |
| **Magic UI** | `Highlighter` = marker-stroke trope (rejected as identity, §4). **`Noise Texture`** = SVG feTurbulence grain overlay with desaturation/contrast controls — directly the paper-grain layer. | `Noise Texture`: **good_foundation** — adopt the recipe, restyle to ivory paper fiber (scale, octaves, warm tint). `Highlighter`: rejected. Verify MIT at adoption (registry doesn't flag it). |
| **Aceternity UI** | `Squiggly Text` (turbulence+displacement wobble, Motion-engined), `Playful Hero Section` (react-rough-notation). | **reference_only** for the turbulence-displacement edge recipe; both fail dependency-coherence (Motion vs GSAP hero) and identity rules. No public repo — nothing copied regardless. |
| **SmoothUI** | Text reveals are digital transitions ("drawn checkmark" in a task-list is the only organic gesture). Nothing in-genre. | **poor_fit** for this hero. |
| **Motion Primitives** | Site 429-blocks fetchers (registry caveat confirmed). Genre is product/marketing interaction detail, not identity material. | **poor_fit** for this hero; not swept further. |

**Conclusion per routing rule 5:** any near-miss primitive would need its renderer (font glyphs → authored stroke paths), material (uniform stroke → pressure-profiled ink), and interaction architecture rewritten. That is the registry's definition of *route custom*. **The ink system is custom-built.** This also satisfies routing rule 3 by construction: the identity-defining layer cannot be a recognizable third-party effect because none exists.

### 5.2 Substrates (npm tier)

| Substrate | Role | Gate to re-run at build time |
|---|---|---|
| **GSAP** (registry substrate tier: "now fully free incl. all plugins") | Single motion owner for the hero: master inking timeline, per-stroke dashoffset tweens (DrawSVG-class), re-ink micro-timelines, `quickTo` pointer smoothing. ~23KB gz core. | Re-verify current license terms + version at install (registry staleness rule). |
| **SVG (platform)** | Renderer. Resolution-independent ink edges, native mask-reveal, tiny footprint, a11y-friendly. No canvas, no WebGL, no R3F. | — |
| **Paper Shaders** (Apache-2.0) | **Considered and rejected**: a WebGL context solely for static paper grain is disproportionate; the Magic UI feTurbulence recipe achieves it in ~10 declarative lines. | — |
| ~~Motion / Framer~~ | Not introduced. **Dependency coherence rule:** the hero's motion owner is GSAP; product UI (settings panel) keeps CSS transitions. Any future Motion adoption elsewhere must not touch the hero. | — |

### 5.3 Reference-only study list (technique, not code)

- Masked-stroke variable-width handwriting reveal (Codrops-documented genre — registry class: reference_only).
- Fancy `Text Cursor Proximity` — falloff math and pointer lifecycle.
- React Bits `Stroke Text` — reveal sequencing/fill flood timing.
- Aceternity `Squiggly Text` — feTurbulence/feDisplacementMap parameters for edge roughening (we pre-bake roughness into paths instead; runtime filters stay scoped to grain + pooling only).

---

## 6. Build architecture (for the implementation phase)

### 6.1 Asset pipeline — the real work
1. **Lettering pass (authored, not generated).** Commission/author "Jordan Lee" as pressure-varied pointed-nib lettering, plus the underline flourish set (×3) — produced as part of the rebrand's custom-display-type track, so the interaction consumes assets the rebrand is creating anyway.
2. **Deliverables per glyph:** (a) filled outline paths — the visible ink, roughness pre-baked; (b) centerline paths with stroke order + direction metadata; (c) three variants (master + two alternates, 4–8% deviation).
3. **Rig build script** (small Node script in-repo): validates stroke order, normalizes `pathLength=1`, generates the mask pairing (centerline stroked at 8–12% over max ink width, rounded caps), splits strokes at high-curvature points to prevent mask spill, emits one compiled `hero-lettering.js` module (~30–60KB gz budget).

### 6.2 Runtime
- **Reveal mechanism:** masked-stroke technique — filled outline sits under a mask; animating the mask stroke's dashoffset 1→0 wipes the ink on with true variable width. GSAP master timeline for the pass; per-glyph mini-timelines for re-inks.
- **Pointer model:** one rAF loop, early-exit when pointer is far; per-glyph bbox distance with quadratic falloff; randomized per-glyph cooldowns (1.2–2.5s); concurrency cap 2.
- **Ink material details:** end-of-stroke pooling via a scoped goo filter (blur+contrast) on small dots only; 300ms dry-down (darken/desaturate) per stroke; paper grain as one static feTurbulence layer over the hero ground.
- **Lifecycle:** IntersectionObserver + `visibilitychange` pause everything offscreen/hidden; sessionStorage replay guard; `prefers-reduced-motion` short-circuits to static.

### 6.3 Budgets & acceptance
- Added JS ≤ ~35KB gz (GSAP core + rig); lettering assets ≤ 60KB gz; **no** canvas/WebGL contexts.
- Hero SVG ≤ ~400 nodes; animated properties limited to dashoffset, transform, opacity.
- 60fps draw on a mid-tier laptop; no post-hydration long task >50ms; CLS = 0.
- Dark scheme decision (see open questions) implemented as tokens, not forked assets.

### 6.4 Sequencing
1. Rig prototype against placeholder lettering (2 glyphs) — validates mask technique, timing feel, re-ink loop. *Placeholder lettering must not ship.*
2. Lettering production + pipeline integration.
3. Composition pass (paper ground, rough rule, flourish), a11y + reduced-motion + touch paths.
4. Perf audit + calm-reading review (boil flag decided here); license gates re-run at each adoption.

---

## 7. Risks & open questions

**Risks**
- **Lettering quality is the ceiling.** The rig is straightforward; the identity lives or dies on the lettering. Mitigation: it's authored within the rebrand's type track, reviewed before rig integration.
- **Mask spill on tight curves** (variable-width technique's known failure) — mitigated by stroke splitting + overwidth masks in the build script; caught by a visual-diff check in the rig prototype.
- **Re-ink noise while reading** — mitigated by cooldowns/deltas; the calm-reading review is a formal gate, and re-ink intensity is a single tunable.

**Open questions for the design owner**
1. Who letters — in-house or commissioned? (Blocks step 2, not step 1.)
2. Dark scheme: keep the hero as a light "paper island" in both schemes (paper *is* the brand), or produce a slate-paper/white-ink variant? Recommendation: paper island, revisit after seeing it.
3. Does the flourish underline sit under the name or under a keyword in the bio line? Recommendation: under the name (keeps the system on one surface).
4. Idle "boil": my default is off; final call at the calm-reading review.

---

*Fit-policy compliance summary: thesis-first (rule 1) ✓ · Tier-1 searched before building (rule 2) ✓ · identity not defined by an unchanged primitive (rule 3) ✓ · one adapted foundation (Noise Texture) + bespoke system (rule 4) ✓ · near-misses correctly routed reference-only/custom (rule 5) ✓ · license & staleness gates scheduled at adoption time ✓ · single motion owner (GSAP) ✓.*

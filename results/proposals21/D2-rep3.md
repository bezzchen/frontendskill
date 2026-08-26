# PROPOSAL — Signature hero interaction: "The Signing" (wet-ink masthead)

- **Status:** Proposal only. No implementation in this change, per brief.
- **Date:** 2026-08-20
- **Scope:** One signature hero interaction for the rebranded jordan-lee-site (`app/page.jsx` header). Site-wide rebrand mechanics (custom display type, paper texture system, project-card treatments) are separate workstreams; this document only defines how the hero interaction rides on them.
- **Registry consulted:** `runs21/context/component_libraries.json` (snapshot 2026-08-12), plus a live catalog sweep on 2026-08-20 (see §5.2).

---

## 1. Context and constraints

**The site.** A one-page personal portfolio: text hero ("Portfolio" eyebrow, `h1` "Jordan Lee", one-line bio), an 8-card project grid, an account-settings form. Next.js 16 / React 19 / Tailwind 4. No animation library is installed yet — the motion owner is an open decision, which this proposal makes. (`components/ConstellationData.js` is orphaned — nothing imports it — and is ignored here.)

**The rebrand identity.** Hand-drawn editorial: rough ink linework, imperfect edges, custom display type, paper texture. The register is a printed literary object — ink on paper, drawn by a person — not a "sketchy filter" applied to a digital layout.

**The ask.** One signature hero interaction consistent with that identity. Singular is a constraint, not a floor: the registry's own anti-pattern rule ("do not stack recognizable effects") and routing rule ("one strong adapted primitive plus bespoke composition") both say the hero gets exactly one interaction system.

**Hard requirements I am holding myself to:**

1. Start from a committed thesis, not from catalog browsing (registry routing rule #1).
2. The interaction must be *of the identity's material* — ink on paper — not a generic effect recolored sepia.
3. It must survive touch devices, `prefers-reduced-motion`, and JS-off with dignity.
4. One motion owner for the page; no engine conflicts (registry `dependency_coherence`).
5. If a catalog primitive would define the hero unchanged, the design is under-authored — transform or build custom (registry routing rule #3).

---

## 2. Design thesis

> **Everything on this sheet was drawn by a hand — and the page proves it in the first two seconds by drawing itself, then stays "wet" so the visitor's hand can touch the ink.**

Two observations drive the choice:

- **The hero's content is a name.** On a personal site, the single most identity-native piece of hand-drawn linework is not decoration — it is the *signature*. A hand-drawn editorial brand whose hero is a person's name has an almost embarrassingly perfect move available: the signature interaction is, literally, a signature.
- **In a hand-drawn world, the honest interaction verb is "draw."** Not glow, not float, not parallax — those are digital verbs. Ink's verbs are: draw, bleed, pool, wobble, dry. The interaction should be built from those verbs and no others.

---

## 3. The proposed interaction: "The Signing"

One ink system with a load-time overture and a live steady state. It is a single interaction (one material, one engine, one concern: *wet ink*), expressed in phases:

### 3.1 Overture — the page signs itself (load, ~1.8s, plays once)

The paper and set type render immediately (no blank stage; LCP is never hostage to the animation). Then:

1. The eyebrow "Portfolio" stamps in as a small rough-inked label.
2. The masthead — "Jordan Lee" as **authored hand-lettering** (real pen-on-paper lettering, scanned and vectorized; not a script font) — draws itself stroke by stroke in natural stroke order, with a nib-speed profile: quick through bowls, slowing into terminals, slight ink pooling where a stroke ends.
3. The final gesture is the rough underline struck through in one confident motion, with a small overshoot and a dry-brush tail.
4. The bio settles in as plain set type. Editorial voice rule: *lettering for the name, type for the text.*

Returning visitors (sessionStorage flag) get an abbreviated signing (~0.7s) so the overture never becomes a toll.

### 3.2 Steady state — wet ink (while the hero is in view)

The visitor's pointer behaves as a nib near fresh ink. Three expressions of the same material:

- **Proximity re-wetting.** Lettering strokes within a falloff radius of the pointer swell slightly in width (+4–8%) and darken a touch, spring-damped so the response trails the hand like liquid, not like a hover state. Leaving the radius, they relax and "dry."
- **Live underline.** Crossing the underline plucks it — it wobbles like a fresh line of ink on the page (spring displacement on a few authored path points), then settles.
- **Nib trail.** Moving through empty hero space leaves a thin evanescent hairline of ink that feathers into the paper grain and dries away within ~1.5s. Slower movement leaves a slightly wider, darker line (ink pools when the pen lingers); fast movement leaves a fine scratch. It is a trace, not a drawing tool: it never persists, so the page never becomes a mess.
- **Line boil (ambient garnish, cut-first).** While ink is "wet" (during signing, briefly after, and near the pointer), strokes flicker between two pre-authored jitter variants at ~7fps — the traditional-animation "boil" that instantly reads as drawn-by-hand. Disabled under reduced motion; first thing cut if the perf budget tightens.

### 3.3 Edges of the system

- **Re-sign.** Click/tap on the masthead replays the fast signing. This is the entire touch story beyond the overture — no hover-dependent meaning exists.
- **Scroll exit.** When the hero falls below ~40% visibility, the ink dries fully and the engine sleeps (IntersectionObserver). No scroll-linked animation — scroll choreography is a different concern and a different (future) workstream.
- **Reduced motion.** `prefers-reduced-motion: reduce` → masthead renders in its final drawn state; no signing, no trail, no boil. At most a non-motion hover darkening.
- **No JS / failure mode.** The lettering SVG is served in its completed state and revealed by animation, so the static fallback is simply the finished artwork — a beautiful drawn masthead, not a blank.
- **Dark mode.** Ink and paper are tokens (`--ink`, `--paper`), so the existing dark scheme becomes the "night edition": unbleached dark paper, pale bone ink. The engine inherits; no second implementation.

### 3.4 What this interaction is deliberately not (restraint list)

- Not a free-drawing canvas toy (meaningless mess, competes with content).
- No particles, parallax, cursor glow, magnetic buttons, or a second effect of any kind in the hero.
- No scroll-jacking, no page-transition tricks.
- Dwell-triggered marginalia (a little asterisk sketching itself if you idle) was considered, is charming, and is **deferred** — it is a second moment, and the brief says one.

---

## 4. Alternatives considered and rejected

| Alternative | Why rejected |
|---|---|
| **A. Ink cursor free-draw** (visitor doodles on the paper) | A toy without an argument: the marks mean nothing, persist as clutter, and the cursor-trail genre is the most recognizable catalog cliché. Interaction without authorship. |
| **B. Cross-hatch / scribble reveal of a portrait** | Needs a portrait asset that does not exist; hover-reveal is a common genre; weaker conceptual tie than the name itself. |
| **C. Paper-tear / page-turn scroll transition** | A site-wide motion concern misfiled as a hero interaction; heavy; the identity moment should live where the name lives. |
| **D. Adopt a proximity-text primitive restyled** (e.g. React Bits "Text Pressure"/"Variable Proximity") | The adopted primitive would *be* the hero — exactly the registry's "under-authored" failure. Material is wrong too: variable-font weight modulation reads digital-clean, not ink. |
| **E. Shader ink-wash background** (Paper Shaders / ShaderGradient class) | Background spectacle, not interaction; live shader for static paper is over-engineering; ShaderGradient additionally fails the license gate. |

**Why "The Signing" wins:** the hero's content is the name, so the interaction and the content are the same object; "draw" is the identity's native verb; it is one engine with a complete lifecycle (overture → wet → dry → sleep); it works on touch, honors reduced motion, and degrades to finished artwork.

---

## 5. Sourcing: registry pass and build strategy

### 5.1 Method

Per the registry routing rules: thesis first (§2), then a Tier-1 catalog search before deciding to custom-build, then fit-policy classification per candidate. License and maintenance facts below are snapshots and get rechecked at build time (`staleness_recheck`, `fact_policy`).

### 5.2 Catalog verification (live, 2026-08-20)

Swept the two catalogs most likely to carry the genre via their `llms.txt` indexes:

- **React Bits** (~226 components enumerated): **no** hand-drawn / ink / sketch / handwriting / SVG-line-drawing / paper primitive exists. Nearest relatives: "Variable Proximity", "Text Pressure" (pointer-proximity typography), "Ghost/Splash/Blob Cursor", "Image Trail"/"Pixel Trail" (trail lifecycle), "Noise"/"Grainient" (grain backgrounds).
- **Fancy Components** (full catalog enumerated): **no** hand-drawn/ink primitive. Nearest relatives: "Elastic Line" (springy SVG line reacting to cursor — closest structural relative of the live underline), "Text Cursor Proximity", "Variable Font Cursor Proximity", "Underline Animation".
- **Magic UI, SmoothUI, Motion Primitives, Aceternity, Cult UI**: ruled out from registry strength/`best_for` data (particles/globes, product-UI register, Motion polish, landing blocks, metal/dither) — none claims the ink/hand-drawn genre. Re-verify only if scope changes.

Conclusion: the effect genre does not exist in the Tier-1 catalogs. The "search before building a common effect" gate is satisfied — and this is not a common effect. Custom routing is justified, with catalogs demoted to architectural reference.

### 5.3 Sourcing decisions (fit-policy classification)

| Need | Source | Registry tier / license | Fit class | Decision |
|---|---|---|---|---|
| Signing stroke animation | **GSAP + DrawSVGPlugin** | `npm_substrate_tier`; registry notes all plugins now free (recheck at build) | substrate | **Adopt.** GSAP becomes the site's single motion owner (see §5.4). DrawSVG is purpose-built for stroke-order line drawing. |
| Ink material (trail, pooling, feathering, drying) | none exists in any tier | — | **custom** | **Build.** Bespoke Canvas 2D ink engine. Study Codrops brush/2D-ink technique demos (awareness tier, explicitly "reference-only class") — techniques, never code adoption. |
| Masthead lettering | none (this is artwork, not a component) | — | **custom asset** | **Author.** Real hand lettering, scanned and vectorized into a two-layer SVG: textured fill layer + hidden stroke-skeleton layer with stroke-order metadata; plus one jitter variant for boil. |
| Pointer-proximity architecture (falloff, RAF loop shape) | React Bits "Variable Proximity"/"Text Pressure"; Fancy "Text Cursor Proximity" | React Bits: MIT+Commons-Clause (license gate noted); Fancy: MIT | **reference_only** | Study the falloff/spring loop structure. Material (variable fonts) is wrong; adopting would mean rewriting renderer + material → reference per fit policy. Reference-only also sidesteps the Commons-Clause question entirely. |
| Live underline spring | Fancy Components "Elastic Line" | MIT | **reference_only** | Closest catalog relative, honestly classified: its geometry is a programmatic straight line; ours is authored calligraphic strokes. Adoption = replacing geometry + material + render path → reference-only, route custom. |
| Cursor trail primitives | React Bits Splash/Ghost/Blob Cursor, Pixel/Image Trail; Fancy "Pixel Trail" | mixed | **poor_fit** | Skip. Fluid-sim/glow/pixel material is off-identity, and these are the most recognizable effects in the genre — adopting one would let a catalog define the identity. |
| Paper texture / grain | React Bits "Noise"/"Grainient"; Paper Shaders (`@paper-design/shaders-react`, Apache-2.0) | catalog / substrate | **poor_fit here** | Skip for the hero. Paper belongs to the brand system as a static, near-free layer (tiled scan or baked SVG turbulence). A live shader for static paper is over-engineering; the ink engine only *reads* the paper tokens. |
| 3D/WebGL substrate (R3F + drei) | `npm_substrate_tier` | — | **poor_fit** | Skip. An ink-on-paper hero does not justify a 3D runtime; Canvas 2D + SVG covers everything. |

**Anti-pattern check:** one adopted substrate (GSAP), zero adopted catalog effects, everything visible is authored. This is the registry's preferred shape — "one strong adapted primitive plus bespoke composition" — taken to its clean extreme: substrate below, authorship above.

**Registry addition candidate (flag for team, out of hero scope):** `rough.js` / `rough-notation` (MIT) as a possible substrate for *low-stakes* sitewide marginalia (sketchy boxes, hand-drawn-ish underlines in body content) later in the rebrand. Explicitly **not** for the hero: programmatic roughness reads generic at masthead scale; hero linework must be authored. Needs the standard license/maintenance recheck before entering the registry.

### 5.4 Motion-owner decision

**GSAP is proposed as the page's single motion owner.** Rationale: no engine is installed yet, so there is no conflict to create; DrawSVG (stroke drawing) and ScrollTrigger (future rebrand scroll work) are uniquely aligned with a linework identity; the registry snapshot records GSAP as fully free including plugins. Consequence (per `dependency_coherence`): future adopted primitives must be GSAP-based or engine-free — Motion/Framer-based catalog components (most of SmoothUI, Motion Primitives, Animate UI) become adopt-with-port or reference-only for this site. That trade is acceptable: this rebrand should be authoring, not adopting, its visible motion anyway. The bespoke ink engine itself is engine-free (raw RAF) and owns only the canvas layer, so it does not contest GSAP's ownership of DOM/SVG motion.

---

## 6. Technical architecture sketch (for the later implementation)

```
app/page.jsx                     — header swaps to <InkMasthead/>; page stays a server component
components/hero/InkMasthead.jsx  — client island; layers: paper (brand token bg) → SVG lettering → canvas overlay
components/hero/signing.js       — GSAP timeline: DrawSVG on stroke skeleton masking the textured fill reveal
components/hero/ink-engine.js    — framework-free Canvas 2D module: pointer stream → nib trail (velocity→width/
                                   darkness), grain feathering, drying; exposes wet(x,y) proximity field consumed
                                   by stroke-swell + underline spring; RAF loop with idle/offscreen sleep
public/lettering/jordan-lee.svg  — authored 2-layer lettering (+ one boil variant); preloaded (LCP candidate)
```

Implementation notes settled now so estimates hold later:

- Stroke swell = per-path `stroke-width`/opacity updates in RAF outside React (~40–80 authored strokes; trivial per-frame math). No per-frame SVG filters — `feTurbulence` displacement per frame is a known perf trap; roughness is baked into the paths, boil is done by variant-swapping.
- Underline wobble = spring on a few control points of one authored path; recompute `d` in RAF.
- Canvas: DPR capped at 2; passive pointer listeners; engine sleeps after 500ms pointer idle and when hero is offscreen.
- React's job is mount/unmount and reduced-motion gating only; per-frame work never touches React state.

**Budgets (acceptance-tested later):** lettering SVG ≤ 25KB gz (≤ 40KB with boil variant); added JS ≤ ~45KB gz including GSAP core+DrawSVG (amortized as the sitewide motion owner); no long task > 50ms on mid-tier mobile; signing completes ≤ 2.2s and never blocks LCP (paper + set type paint first; SVG preloaded).

**Accessibility (acceptance-tested later):** `h1` keeps real accessible text ("Jordan Lee") with the lettering SVG as `role="img"`-labeled visual; canvas `aria-hidden`; zero information or affordance exists only behind pointer motion; ink/paper token contrast ≥ AA in both schemes; full `prefers-reduced-motion` path as in §3.3.

---

## 7. Risks and open questions

| Risk | Mitigation |
|---|---|
| **Lettering quality is the whole bet.** Weak lettering = weak identity, regardless of engineering. | Produce the lettering asset first, as artwork, before any code. Coordinate with the rebrand's custom display type so the masthead reads as its calligraphic sibling (shared terminal angles/contrast). Sign-off gate on the static SVG alone. |
| Ink material reads as "marker/goo" if under-designed | Material-study spike with fixed physical references (dip pen on cold-press paper photos); review the canvas material against references before wiring any interaction. |
| Low-end mobile performance | Tiered degrade: cut boil → cut trail → static masthead with overture only; device heuristic + `saveData` respected. |
| GSAP license/maintenance drift since snapshot | Registry-mandated recheck at build time; fallback path exists (signing can be done with WAAPI + measured `stroke-dasharray`, at higher authoring cost). |
| Overture fatigue | Session-aware fast path (§3.1); overture is skippable by any input. |

**Open questions for the team:** (1) name-only masthead vs. adding a small hand-drawn portrait mark; (2) dark-mode ink color direction (pale bone vs. inverted paper); (3) is click-to-re-sign worth keeping, or too precious; (4) approve GSAP as sitewide motion owner now, since it constrains future catalog adoption.

---

## 8. Delivery plan (when implementation is green-lit)

1. **Lettering asset production** — hand lettering, vectorization, 2-layer + boil-variant SVG, stroke-order metadata. *Gate: static art sign-off.*
2. **Ink material spike** — canvas engine material study against physical references. *Gate: material sign-off.*
3. **Signing timeline** — GSAP DrawSVG overture + reveal masking; session fast path.
4. **Wet-ink integration** — proximity field, underline spring, nib trail; sleep/wake lifecycle.
5. **Hardening** — reduced-motion/a11y/JS-off paths, perf budget verification on mobile, dark scheme pass.

Each phase lands independently; the site is shippable after phase 3 (signing only) if scope must cut.

---

*Summary: the signature interaction is literally a signature — "The Signing," a wet-ink masthead where authored hand-lettering of the name draws itself onto the paper, then stays pointer-reactive ink while the hero is in view. Sourcing: no catalog carries this genre (verified live); built custom on the GSAP DrawSVG substrate plus a bespoke Canvas 2D ink engine, with catalog relatives used strictly as reference-only architecture patterns.*

# R1 — Landing Love calibration research

Research date: 2026-08-14. Method: WebFetch of landing.love entry pages and live sites (SSR text only — no browser pane, no video playback), plus WebSearch for award verification. Source file reviewed: `/Users/bezzchen/Downloads/landing_love_calibration.md`.

---

## 1. Verification of the five referenced entries

**All five landing.love URLs resolve and match the calibration file's descriptions.** None 404'd. Landing.love serves server-rendered text for its entry pages, so titles, descriptions, tech tags, and category tags were directly verifiable. The full-page **video recordings could not be watched** — choreography claims below distinguish "verified from page text" vs. "described by landing.love / prior knowledge."

### 1.1 Tomasz Szmajda / ITom — `https://www.landing.love/sites/itomdev/` — EXISTS
- Live site: `itomdev.com` (resolves; title "ITom – Award-Winning Creative Developer").
- Landing.love-verified tech: React Three Fiber, GSAP, WebGL, shaders. Tags: Portfolio, 3D Website, Illustration, WebGL.
- Verified description: immersive WebGL environment as a **hand-drawn 3D corridor**; navigation through portal doors; landing.love's own text: "scroll maps directly to camera movement through the corridor, so the whole experience feels more like a game than a website." This confirms the calibration traits nearly verbatim.
- Live-site fetch caveat: the fetched HTML of itomdev.com reads as structured static sections (About/Projects/Awards/FAQ) with a rich tech manifest (R3F, GLSL, Lenis, Next.js, MediaPipe pose tracking, Firebase leaderboards). Either the corridor is client-side behind an SEO/SSR text layer (most likely — and itself evidence of a graceful-fallback practice), or the site was redesigned since capture. **Cannot distinguish via fetch.** The landing.love recording preserves the corridor version either way.
- Calibration value: spatial premise + scroll-as-camera + game-feel in a solo portfolio.

### 1.2 Noomo — Storytelling — `https://www.landing.love/sites/storytelling/` — EXISTS
- Live site: `storytelling.noomoagency.com` (resolves; title "Noomo | The power of digital Storytelling").
- Landing.love-verified: "An immersive 3D experience exploring digital storytelling principles through real Noomo projects for Salesforce, AMD, Coinbase, Intel, and Vogue." Tech: WebGL, Three.js. Tags: 3D Website, Agency, Dark Mode. Landing.love calls it "Showcase-grade immersive site — 3D scenes, chapter navigation, and case studies embedded inside a narrative journey."
- Live-site fetch: predominantly canvas/JS with minimal static HTML; visible "Tap to explore" / "Scroll to explore" affordance cues and a loader. Confirms the chaptered-narrative + embedded-case-study calibration trait.
- Calibration value: spatial storytelling **as** information architecture; affordance cues; enterprise-brand credibility inside spectacle.

### 1.3 ASTRODITHER — `https://www.landing.love/sites/astrodither/` — EXISTS
- Live site: `astrodither.robertborghesi.is` (resolves; title "AstroDither — Robert Borghesi LAB").
- Landing.love-verified: "an audio reactive Threejs/WebGPU experiment by Robert Borghesi on dithering and fluid simulation with TSL." Tech: Three.js, WebGPU, TSL, GSAP. Tags: 3D Website, Illustration, Music, Dark Mode.
- Live-site fetch confirms: click-to-enter gate ("CLICK TO ENTER + ENABLE AUDIO"), custom dithering, single-pass fluid simulation, displacement in post, selective bloom, chromatic aberration, WebGPU-optimized. Almost no static HTML — the graphics system IS the page.
- Calibration value: material/graphics behavior as the entire experience; audio-reactivity; the current WebGPU/TSL frontier. Note: it is an **experiment/lab piece**, not a content site — it calibrates axis ceilings, not content integration.

### 1.4 Joseph Santamaria — `https://www.landing.love/sites/joseph-san-2/` — EXISTS
- Live site: `joseph-san.com` (per landing.love; not separately fetched).
- Landing.love-verified: Ecuadorian multidisciplinary developer; GSAP + WebGL + 3D. Tags: Portfolio, 3D Website. Landing.love's text: "a 3D loading experience greets you before the content even begins" and "GSAP animations and WebGL implementations roll out as you scroll through projects."
- Calibration value: **loading experience as authored first act**, and immersive graphics coexisting with a readable portfolio structure — the "spectacle without sacrificing legibility" reference. Note the URL slug `joseph-san-2` implies this is a second/revised entry for the same designer.

### 1.5 Dragonfly / Three.js collection — `https://www.landing.love/collection/threejs/` — EXISTS
- Collection page verified: "Best ThreeJS Website Examples" — 74 sites in the ThreeJS collection. Dragonfly IS listed (tags: Crypto, Venture, Finance, 3D Website).
- Dedicated entry also exists: `https://www.landing.love/sites/dragonfly/` → live site `dragonfly.xyz`, Three.js, dark mode; crypto VC firm presented as 3D site.
- Other collection members verified in the listing (useful sampling frame): Santioni Spirits, SOOT SPIRAL, Miu Miu, Ricardo Chance, Nudot Studio, K95, CubiFlow, Noomo, **Bruno Simon**, BFCM Shopify 2025, Jordan Breton, Lando Norris, ASTRODITHER.
- Calibration value: institutional/business narrative (a VC firm!) made cinematic via scroll-driven 3D while text remains DOM — the "don't turn every textual element into canvas" reference.

**Verdict: 5/5 exist; the calibration file's traits are consistent with landing.love's own published descriptions in every case.**

---

## 2. Expanded reference set (10 additions, mode-diverse)

Award claims marked (V) were verified by search this session; (M) = from prior knowledge, not re-verified.

| # | Site | URL | One-liner | Spectacle mode | Best-calibrated axis |
|---|------|-----|-----------|----------------|---------------------|
| 1 | **Bruno Simon Portfolio** | bruno-simon.com | Drive a physics-simulated car around a 3D world to visit portfolio content; the canonical "website as playable toy." On landing.love's ThreeJS collection (V); Awwwards SOTD + Developer Award 2019 (M). | Physics-driven spatial world | **A3 Interaction causality** (input→physics→world) + A1 world premise |
| 2 | **Igloo Inc** | igloo.inc | Awwwards **Site of the Year 2024** (V; by Abeto with Bureaux): procedurally grown ice crystals, shader-driven UI text, volume data — entirely real-time. | Shader/material-driven spatial page | **A2 Material language** + A7 technical invisibility (crystals serve the "igloo" concept) |
| 3 | **Lusion (v3)** | lusion.co | Studio site that swept **Site of the Year at Awwwards, FWA, and CSSDA** (V); research-grade particle/material systems as agency identity. | Shader/particle-driven agency site | **A6 Signature memory** + A2; the single strongest ceiling anchor for S1=5 |
| 4 | **Coastal World** | coastalworld.com | Merci-Michel's gamified banking archipelago (Awwwards SOTM Aug 2022 (V), FWA case, site-of-the-year honors per press (V)); quests, coins, collectibles teach digital banking. | Gamified 3D world with content mission | **A1 World premise** + A4 authored continuity (quests connect acts) |
| 5 | **Chartogne-Taillet** | chartogne-taillet.com | Immersive Garden rebuilt two Champagne villages in Three.js with engraved-map/watercolor rendering + bespoke sound design; Awwwards SOTD + Developer Award, Dec 2020 (V). | Authored-camera 3D narrative for a small business | **A5 Camera/composition** (designed framing, not orbit-controls) + A2 |
| 6 | **Particle Love** | particle-love.com | Edan Kwan's WebGL particle experiments (FWA case, Awwwards Honorable Mention, CSSDA, Google Experiments) (V); millions of shader particles responding to pointer. | Generative/particle system | **A3 Interaction causality** at the pure-graphics extreme |
| 7 | **Patatap** | patatap.com | Jono Brandel + Lullatone's audio-visual instrument — keypress triggers paired sound + geometric animation; Japan Media Arts Festival recognition (V). | Audio-visual / input-as-instrument | **A3** + the missing **sound-design axis** (audio and visuals are one authored system) |
| 8 | **The Boat (SBS)** | sbs.com.au/theboat | Interactive graphic-novel adaptation (Matt Huynh, 2015): 200+ sumi-e ink illustrations, 59 animated sequences, AFI-award soundscape, scroll-driven storm; World Illustration Award 2016 winner, Webby nominee (V). | Scroll-driven cinematic editorial narrative | **A4 Authored continuity** + copy/content integration (spectacle in service of literary text) |
| 9 | **Unseen Studio** | unseen.co | Awwwards SOTM Feb 2023; studio-of-the-year recognition (V); every page is a Three.js scene with per-page cameras and post effects; Nikolas Type project renders a typeface as an immersive narrative. | Typography-as-spectacle / WebGL-DOM hybrid | **A2 Material language where type IS the material** + A7 |
| 10 | **Apple AirPods Pro product page** | apple.com/airpods-pro | The mainstream canonical scroll-scrubbed canvas sequence (frame-by-frame rAF repainting analyzed by CSS-Tricks et al.) (V); cinematic product reveal at mass-market polish. | Scroll-driven cinematic product page | **A8 Graceful fallback** (ships to every device on earth) + A4 pacing; calibrates the W1/S1 boundary — spectacular yet arguably W1, a useful boundary probe |

Secondary/optional: **GT Flexa playground** (gt-flexa.com, Grilli Type) — variable-font specimen as interactive toy; weaker award pedigree (Awwwards "inspiration" feature, not SOTD (V)) but the cleanest pure-typography interaction-causality reference if a second typography anchor is wanted.

Mode coverage check: spatial world (1,4), physics (1), shader/material (2,3), particles/generative (6), audio-reactive/instrument (7 + ASTRODITHER), scroll-cinematic narrative (8,10 + Noomo), authored camera (5), typography (9 + GT Flexa), institutional-content-in-3D (Dragonfly + 4). All eight requested modes are represented.

---

## 3. Critique of the eight quality axes

### Overall judgment
The set is strong and unusually well-conceived. A3 (interaction causality: "visibly changes the world, not only opacity") and A7 (technical invisibility) are sharper than anything in Awwwards' own public rubric (Design/Usability/Creativity/Content). The Q1/W1/S1 register boundary with the explicit "W1=4 while S1=2 is not a contradiction" note is exactly right. Main problems: **two measurable gaps (loading, performance), one conditional axis that breaks scoring symmetry (A5), and one axis that is a gestalt rather than an axis (A6).**

### Missing axes

**M1. Entry / loading experience (add — strongest case).** The calibration file itself cites Joseph Santamaria specifically for "a 3D loading experience greets you before the content even begins," and Noomo gates with "Tap to explore" — yet no axis scores the first five seconds. Spectacle sites front-load cost; the difference between S1=5 and abandonment is whether the loader is an authored first act (progress as narrative, no dead white frame, reveal choreographed) or a spinner. Proposed axis: *"Entry choreography — loading, gating, and first reveal are authored acts; no unstyled or dead frames; progress is legible."*

**M2. Runtime performance integrity (add — most objective).** A7 covers conceptual invisibility, not frame rate. A spectacle that stutters at 24fps or ships 40MB fails regardless of concept, and this is the axis an automated harness can measure best (sustained FPS, long tasks, DPR scaling, memory growth, input latency). Every top reference here is celebrated partly for running impossibly well (Igloo's crystals, Lusion's particles). Proposed axis: *"Performance integrity — the system sustains fluid frame rate and responsive input on target hardware; degradation is adaptive (resolution/particle scaling), not jank."*

**M3. Content legibility under spectacle (add or fold into A8).** Two of the five references are calibrated on exactly this — Joseph San ("immersive graphics coexist with readable portfolio structure") and Dragonfly ("without turning every textual element into canvas") — but no axis scores it in the primary mode; A8 only covers fallback modes. Without this axis, the rubric can reward ASTRODITHER-style pure experiments over sites that carry real content, which contradicts the eval's purpose (agents build content-bearing pages, not lab demos). Proposed: *"Content coexistence — copy hierarchy, readability, and information findability survive while the visual system dominates; text stays selectable/DOM where it is content."*

**M4. Sound design (optional, N/A-able).** ASTRODITHER is audio-reactive, Chartogne-Taillet had a dedicated sound-design studio (Mooders), The Boat's soundscape is by an AFI-award sound designer — top-tier spectacle usually has authored audio with a respectful default (muted + visible toggle). But an automated harness likely cannot judge audio, and silent-by-design is legitimate. Recommend a marked-optional axis or a sub-criterion of A3 (audio as causal channel), explicitly N/A when absent, never penalizing silence.

**Not missing:** accessibility/reduced-motion (already inside A8), originality (implicit in A6), copy *quality* as prose (out of scope for a visual rubric — only its *integration*, M3).

### Redundancy and refinements

**R1. A5 is conditional and breaks scoring symmetry.** "Camera/composition — when spatial" is N/A for shader pages (ASTRODITHER), typography pages (GT Flexa, Unseen's type work), and 2D generative work. An axis that only applies to some entries makes aggregate scores non-comparable across spectacle modes. Fix: generalize to **"Composition & choreography"** — framing, pacing, easing quality, and directed attention in any mode; camera design is the spatial sub-case. This also absorbs the pacing dimension currently squeezed into A4.

**R2. A1 / A4 / A5 overlap for spatial sites.** A coherent world (A1) with connected acts (A4) filmed with designed cameras (A5) tends to score as a block — three axes reward one property (spatial coherence) while shader/type/particle modes get one (A2). Keep all three but tighten definitions: A1 = *premise* (is there a governing fiction/system?), A4 = *transitions between acts* (seams), A5 (revised) = *moment-to-moment direction* (framing/pacing). Score them against those distinct questions, not against "how 3D is it."

**R3. A6 (signature memory) is a gestalt, not an orthogonal axis.** It correlates with every other axis by construction — a page scoring 5 on A1-A5 will have a nameable moment. Two options: (a) keep it but score it last, as a holdout holistic judgment that can override the mean (useful against rubric-gaming: high component scores with no memorable moment = capped); or (b) promote it to the **S1 gate**: S1≥4 requires a nameable signature system. Option (b) fits the register-boundary design well.

**R4. A3 should include affordance.** Causality without discoverability strands users; Noomo's "Scroll to explore" cue is part of why its spectacle works. Add to A3: *"...and the page teaches its own controls (affordances/cues) without breaking the fiction."*

**R5. Add a mode tag, not more axes.** Tag every reference (and every eval output) with its spectacle mode (spatial-world / shader-material / scroll-cinematic / generative-particle / audio-reactive / physics / typography). Score axes within-mode where sensible. This prevents the rubric from having a hidden bias toward spatial-3D — five of the current eight axes read most naturally for spatial worlds.

### Proposed revised axis list (10, two optional)
1. World / spatial premise (unchanged)
2. Material language (unchanged)
3. Interaction causality **+ affordance** (R4)
4. Authored continuity (transitions/seams between acts)
5. **Composition & choreography** (generalized from camera; R1)
6. Signature memory → **S1 gate or holdout holistic score** (R3)
7. Technical invisibility (unchanged)
8. Graceful fallback (unchanged)
9. **NEW: Entry choreography / loading experience** (M1)
10. **NEW: Performance integrity** (M2)
+ Content coexistence (M3) — as axis 11 or folded into A8's definition
+ Sound design (M4) — optional, N/A-able

---

## 4. Limitations and honesty notes

- **Video recordings unwatchable.** Landing.love's core value (full-page recordings) is inaccessible to WebFetch. All choreography/motion claims derive from landing.love's own written descriptions, award-site writeups, technical breakdowns (Codrops, CSS-Tricks, webgpu.com), and prior knowledge — not from watching the sites move.
- **Landing.love SSR worked in my favor.** All five entry pages returned server-rendered text (titles, descriptions, tech tags), so existence and metadata verification is solid. The gallery's browsing UI (filters, video players) was not exercised.
- **Live spectacle sites are canvas-first.** Fetching them verifies existence, meta tags, and technology strings (e.g., ASTRODITHER's WebGPU/TSL/fluid-sim details were in page text), but not runtime behavior, frame rate, or feel.
- **itomdev.com ambiguity.** The live fetch reads as structured static HTML sections, unlike the corridor described by landing.love. Likely an SSR/SEO layer in front of the client-side R3F experience, but a redesign cannot be ruled out from a fetch alone.
- **Award verification levels differ.** Verified this session: Lusion SOTY sweep; Igloo Inc SOTY 2024; Coastal World SOTM Aug 2022 + FWA; Chartogne-Taillet SOTD + Dev Award; Particle Love FWA/Awwwards HM/CSSDA; The Boat's illustration/Webby record; Unseen SOTM Feb 2023. From memory only: Bruno Simon's exact 2019 award record (his landing.love listing is verified).
- **Recency.** Searches ran Aug 2026 and surfaced 2026 items (Unseen "2025 Wrapped" SOTD, Lusion's EverSwap June 2026 SOTD) that post-date my training; I did not deep-verify those and kept the reference set to durably celebrated work.
- No landing.love "WebGPU" collection was checked separately; the ThreeJS collection (74 sites) was the sampling frame, plus award-site searches.

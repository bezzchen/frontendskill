# Hero Effects Sourcing Proposal

**Scope:** two hero effects for jordan-lee-site — (A) an animated topographic-line background that reacts subtly to pointer movement, (B) a magnetic hover effect on the primary CTA. This document decides *sourcing only*; no implementation is included.

**Date:** 2026-08-20. All license/maintenance facts below are source-backed snapshots per the registry's fact policy and must be re-verified at adoption time.

---

## 1. Verdicts (summary)

| Effect | Verdict | Source | Engine / deps | License |
|---|---|---|---|---|
| A. Topographic-line background | **Adopt + deep re-materialization** (registry "excellent_fit" playbook) | React Bits — `Topography` (free tier, `/backgrounds/topography`) | OGL WebGL2 fragment shader; dep `ogl@^1.0.11` | MIT + Commons Clause (verified) |
| B. Magnetic CTA hover | **Adopt + retune** | Motion Primitives — `Magnetic` (`components/core/magnetic.tsx`) | `motion/react` springs; dep `motion` | MIT (repo sidebar; re-verify file at vendoring) |

Neither effect is built custom, and nothing is demoted to reference-only: for once the catalogs contain a literal genre match for the hard effect (a pointer-reactive contour-map shader) and a best-in-class behavior wrapper for the easy one. The identity risk of adopting is handled by re-materialization, argued in §4.3.

---

## 2. Constraints derived from this repository

Checked: `package.json`, `app/globals.css`, `app/page.jsx`, `app/layout.jsx`, `components/*`.

- **Stack:** Next.js 16.2.12 / React 19.2.8 / Tailwind 4 (JS, no TS, no shadcn scaffolding — components are plain files under `components/` with an `@/` alias). No animation library is installed today.
- **Motion ownership:** the brief sanctions Motion (framer) conventions. That makes **Motion the page's motion owner**, and the registry's `dependency_coherence` rule then excludes GSAP-engined primitives and heavyweight physics engines from candidacy. A self-contained canvas/WebGL loop that owns only its own `<canvas>` does *not* conflict — Motion owns DOM transforms; a shader owns its raster.
- **Visual language:** quiet, editorial, warm-neutral. Paper/ink palette (`#f5f5f3`/`#161616` light, `#111110`/`#f5f5f2` dark), hairline borders (`--line: #deded8` / `#31312f`), muted greige media placeholders, generous whitespace, restrained type. Automatic light/dark via `color-scheme` + `prefers-color-scheme`. The register is restraint — which is exactly what "reacts *subtly* to pointer movement" asks for.
- **Persona:** "Software engineer working across systems, interfaces, and computational design." Contour lines — iso-lines over a scalar field — are a computational-design artifact. The background can carry meaning here, not just texture.
- **Hero state:** the current header is type-only with no CTA; the hero work adds one. Consequence for sourcing: the magnetic effect must be a **behavior wrapper** that leaves CTA styling bespoke, not a pre-styled "magnetic button" component we'd have to strip.

---

## 3. What was checked (evidence trail)

Per the registry routing rule, Tier-1 catalogs were searched before considering a scratch build, and the npm substrate tier was checked as an alternative renderer route.

| Source | What was inspected | Findings relevant here |
|---|---|---|
| Registry (`runs21/context/component_libraries.json`) | fit policy, tier semantics, routing rules, license gate, dependency coherence | Governs everything below |
| React Bits — `reactbits.dev/llms.txt` | full component inventory | **`Topography`** (free): "A living contour map with glowing, elevation-tinted lines." Also `Magnet`, `Magnet Lines`, `Waves`, `Threads`, `Line Waves` |
| React Bits — shadcn registry JSON `reactbits.dev/r/Topography-JS-CSS` | **actual component source** | OGL WebGL2 shader, ~520 lines; pointer smoothed and injected as Gaussian bump into the elevation field (`float bump = exp(-dot(d,d)/(r*r)) * uMouseStrength * uMouseActive; fv += bump;`); props: `lowColor/midColor/highColor`, `bands`, `thickness`, `scale`, `glow`, `contrast`, `brightness`, `opacity`, `colorMode`, `fillBands`, `grain(+intensity)`, `speed`, `morphAmount/morphSpeed`, `pixelSize`, `mouseInteraction`, `mouseRadius`, `mouseStrength`; ResizeObserver + IntersectionObserver lifecycle |
| React Bits — `reactbits.dev/r/Magnet-JS-CSS` | actual component source | Dependency-free, but magnetism = CSS transitions (`0.3s ease-out` in, `0.5s ease-in-out` settle) — no spring physics |
| React Bits — `github.com/DavidHDev/react-bits` + raw `LICENSE.md` | license + maintenance | MIT + Commons Clause: may not "sell, sublicense, or redistribute the components themselves"; 45.9k stars, active |
| Motion Primitives — raw `README.md`, raw `components/core/magnetic.tsx`, repo page | source, engine, license | `motion/react` (`useMotionValue` + `useSpring`); distance-falloff pull (`scale = 1 - d/range; x.set(dx * intensity * scale)`); props `intensity` (0.6), `range` (100), `actionArea: 'self'|'parent'|'global'`, `springOptions` (default stiffness 26.7 / damping 4.1 / mass 0.2); ~120 lines. Repo sidebar: MIT, 6.0k stars. Registry caveats hold: beta, site 429-blocks fetchers (GitHub raw works) |
| Magic UI — `magicui.design/llms.txt` | topo + magnetic query | Neither exists. Closest (Animated Beam, Magic Card, Animated Grid Pattern) are wrong genre |
| Aceternity — `ui.aceternity.com/llms.txt` | topo + magnetic query | No topographic background. `Background Lines` = animated SVG wave paths, no pointer reactivity; `Wavy Background` = filled canvas waves. Has `Magnetic Button` — but pre-styled, and no public repo (maintenance opaque, per registry caveat) |
| Fancy Components — `fancycomponents.dev/llms.txt` | topo + magnetic query | Neither. `Cursor Attractor & Gravity` runs on **Matter.js** — a physics engine for a hover micro-interaction is dependency incoherence |
| SmoothUI — `smoothui.dev/llms.txt` | topo + magnetic query | No topo. Has `magnetic-button` (Motion-based) — but pre-styled button, not a wrapper |
| Paper Shaders (substrate) — raw README | contour shader? pointer uniforms? | No topographic/contour shader documented; no pointer-interaction uniforms documented. Substrate route offers no shortcut |
| Vanta `Topology` | registry status | The genre ancestor, but registry-rejected ("dead"), p5-based — not considered |

---

## 4. Effect A — topographic-line background

### 4.1 Candidate field

| Candidate | Genre match | Pointer-reactive | Engine coherence | Disposition |
|---|---|---|---|---|
| **React Bits `Topography`** | Exact — animated contour map | **Yes — pointer deforms the elevation field itself** | OGL, self-contained canvas; no Motion conflict | **Winner — adopt** |
| React Bits `Waves` / `Threads` / `Line Waves` | Parallel flowing lines, not iso-contours | partial | ok | Would need the line-generation rewritten into contours → routing rule 5 says that's reference-only territory; unnecessary given `Topography` exists |
| Aceternity `Background Lines` / `Wavy Background` | Decorative wave paths / filled waves | No | ok | Wrong genre; no pointer input |
| Paper Shaders (substrate) | No contour shader shipped | No pointer uniforms | ok | No shortcut available |
| Magic UI / Fancy / SmoothUI | Nothing in genre | — | — | Eliminated by sweep |
| Custom build (canvas 2D marching-squares over layered simplex noise) | Exact by construction | By construction | Full control | **Not warranted** — it re-derives what `Topography` already does with a better renderer (GPU vs CPU iso-line extraction), at meaningfully higher build+tuning cost and real perf risk at fullscreen on CPU |

### 4.2 Why `Topography` wins

1. **It is the requested effect, not an approximation.** Every other catalog offers "lines that wave"; this is a living contour map. Decisively, its pointer interaction is the *right kind of subtle*: the cursor adds a smoothed Gaussian bump to the underlying elevation field, so the contours swell and re-space around the pointer the way terrain would — the world responds; nothing chases the cursor. `mouseRadius`/`mouseStrength` give us the dial to keep it near-subliminal.
2. **It fits the site's material language.** This site is already drawn in hairlines — `--line` borders on quiet paper. A contour field rendered in the same ink-on-paper values (lines a step off `--background`, glow ≈ 0, low opacity, thin bands, slow morph) extends the existing material rather than importing a neon one. And iso-lines are native iconography for a "systems / computational design" engineer.
3. **Adoption cost is prop-level, not surgery.** Theme reactivity (swap the three elevation colors on `prefers-color-scheme`), reduced-motion handling (`mouseInteraction={false}`, `speed`/`morphAmount` → 0 for a static contour texture), and mounting live in a thin client wrapper. The renderer, lifecycle, and interaction architecture stay untouched — so this passes routing rule 5 and stays in the "adopt" class rather than sliding to reference-only.
4. **Performance hygiene is already built in** (ResizeObserver, IntersectionObserver pause offscreen), and `ogl` is a small dependency that cannot fight Motion: it owns one canvas's rAF, Motion owns DOM transforms — `dependency_coherence` holds.
5. **Gates pass.** License: MIT + Commons Clause forbids reselling/redistributing *the components themselves*; using it inside a personal portfolio is squarely permitted. Maintenance: 45.9k stars, active, agent-ready distribution (llms.txt + working shadcn registry — this proposal pulled the source through it).

### 4.3 The identity condition (this is the load-bearing caveat)

Registry routing rule 3: if the primitive defines the page's identity unchanged, the design is under-authored. `Topography`'s default look — "glowing, elevation-tinted" — is a recognizable React Bits demo. **Adoption is conditional on re-materialization:** monochrome ink-on-paper palette from the site's tokens in both themes, glow off, grain restrained or off, band cadence and line weight tuned against the hero type scale, opacity low enough that H1 contrast is untouched. The identity must come from the material treatment and composition, not from the stock preset. If, during implementation, the effect cannot be made to read as *this site's* drawing, the fallback ruling is reference-only + custom canvas-2D contours — but the prop surface inspected above says that won't be necessary.

### 4.4 Risks / mitigations

- **WebGL2 unavailable** → component renders nothing; plain `--background` shows through. Acceptable degradation; optionally a static SVG contour texture later.
- **SSR** → client-only mount (`"use client"` wrapper), standard.
- **Battery/perf on low-end devices** → cap DPR, keep `pixelSize` coarse; IntersectionObserver already stops offscreen work.
- **Accessibility** → canvas is `aria-hidden`; `prefers-reduced-motion` freezes morph and disables pointer response (static contours remain, which is the correct reduced experience — texture without motion).

---

## 5. Effect B — magnetic hover on the primary CTA

### 5.1 Candidate field

| Candidate | Physics model | Form factor | Engine coherence | Disposition |
|---|---|---|---|---|
| **Motion Primitives `Magnetic`** | Real springs (`useSpring` on motion values), distance falloff | **Neutral wrapper** — wraps any child | Native to Motion, the sanctioned owner | **Winner — adopt** |
| React Bits `Magnet` | CSS transitions (ease-out/ease-in-out), no springs | Wrapper | Dependency-free but outside the Motion idiom | Runner-up; settle quality visibly inferior to a spring, and it duplicates what Motion does natively once Motion is installed |
| Aceternity `Magnetic Button` | Spring return (per description) | **Pre-styled button** | Unverifiable — no public repo | Styling to strip + opaque maintenance → skip |
| SmoothUI `magnetic-button` | Motion-based | **Pre-styled button** | ok | Same form-factor mismatch: we need behavior, not a button design |
| Fancy `Cursor Attractor & Gravity` | Matter.js | Wrapper | Physics engine for one hover = incoherent | Skip |
| Custom (`useMotionValue`+`useSpring` by hand) | Same as winner | — | — | Would re-derive ~120 lines the catalog already maintains, including the non-obvious parts (distance falloff, `actionArea`) — no design upside, since magnetism is behavior, not material |

### 5.2 Why Motion Primitives `Magnetic` wins

1. **Right form factor.** It is a behavior wrapper around arbitrary children, so the CTA's look stays 100% bespoke to this site — no third-party button aesthetic enters the design. The registry explicitly lists "magnetic" among Motion Primitives' strengths and files it under "product/marketing interaction details," which is exactly this use.
2. **Right engine.** Built on `motion/react` — the sanctioned motion owner — with a real spring model. Magnetism reads as "magnetic" precisely because of the spring settle; React Bits' CSS-transition version eases rather than settles. Once `motion` is in the page (it will own the rest of the hero's entrances too), the Motion-native primitive is the coherent choice.
3. **The tuning surface is the whole adaptation.** Magnetic pull is behavior, not material, so "restyle deeply" here means constants: defaults (`intensity` 0.6, damping 4.1) are showy and underdamped for this site's register — we'd drop intensity to ~0.15–0.3, tighten `range`, and raise damping so the CTA leans and settles rather than wobbles. `actionArea` stays `self` (or `parent` with a modest hit area) to keep the effect discoverable but quiet, in the same restraint budget as the topo pointer response.
4. **Gates pass.** MIT (repo sidebar; GitHub only surfaces that badge from a detected license file — still, re-verify the file when vendoring, since `LICENSE`/`LICENSE.md` weren't at the default raw paths). 6.0k stars; beta status (Mar 2026) is acceptable for a ~120-line vendored file we own after copy-in. Registry ingestion caveat confirmed: the site 429-blocks fetchers, but the in-repo source is directly reachable — vendor from GitHub.
5. **Accessibility is clean by construction.** The effect is pointer-only; keyboard focus never displaces the button, and focus styling stays put. Wrap with a `prefers-reduced-motion` disable (render children un-wrapped) as the one required addition.

### 5.3 Risks / mitigations

- Adds `motion` as a dependency → sanctioned by the brief; verify React 19 / Next 16 compatibility of the current `motion` major at install.
- Spring constants are taste-critical → tune against the topo pointer response so both pointer behaviors share one perceived time constant; two different "pointer personalities" in one hero would read as gimmick stacking.

---

## 6. Cross-cutting rulings

- **Anti-pattern guard (effect stacking):** the registry warns against stacking recognizable catalog effects. This proposal stays inside its "one strong adapted primitive plus bespoke composition" norm: one identity-bearing *material* (re-materialized Topography) plus one non-identity *behavior* (magnetic pull) on a single element. Nothing else from the catalogs enters the hero.
- **One owner per concern:** Motion owns DOM motion (CTA, future entrances); the Topography shader owns its own canvas raster; no GSAP anywhere; no physics engine.
- **New dependencies:** `ogl@^1.0.11` (small WebGL lib, comes with the vendored component) and `motion` (sanctioned). Both effects are vendored source files (shadcn-registry / GitHub copy-in), not npm components — we own them after adoption.
- **License ledger:** React Bits = MIT + Commons Clause (restriction: no selling/sublicensing/redistributing the components themselves — portfolio use is fine); Motion Primitives = MIT. Both rechecked 2026-08-20; per registry policy, recheck again at the moment of vendoring.
- **Ingestion:** both winners meet the registry's `ingestion_preference` — React Bits via its working shadcn registry endpoint, Motion Primitives via in-repo source/registry JSON.

## 7. Explicitly out of scope

No code is added by this proposal. Implementation order when green-lit: vendor both components, build the theme/reduced-motion wrapper for Topography, re-materialize against the site tokens in both color schemes, then tune the two pointer responses as one system.

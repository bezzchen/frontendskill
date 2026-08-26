# Hero Effects Sourcing Proposal

**Scope:** Two hero effects for the Jordan Lee portfolio — (A) an animated topographic-line background with subtle pointer reactivity, and (B) a magnetic hover effect on the primary CTA.
**Status:** Sourcing decision only. No implementation in this change.
**Registry consulted:** `runs21/context/component_libraries.json` (snapshot 2026-08-12), with source facts re-verified 2026-08-20 per the registry's `staleness_recheck` and `license_gate` policies.

---

## 1. Site context that constrains the decision

From the repo itself (`app/page.jsx`, `app/globals.css`, `components/*`):

- **Stack:** Next.js 16.2.12, React 19.2.8, Tailwind CSS 4.3.3. **No animation or rendering library is installed yet** — whatever we choose sets the page's motion/render ownership, not just adds to it.
- **Visual language:** quiet, editorial, near-monochrome. Warm paper light mode (`--background: #f5f5f3`), soft charcoal dark mode (`#111110`), muted grays, and — importantly — a **hairline vocabulary**: every card and input is drawn with 1px `--line` borders (`#deded8` / `#31312f`). There is no accent color anywhere. The one button idiom is a solid `--foreground`-on-`--background` fill (`SettingsPanel` save button).
- **Positioning copy:** "Software engineer working across systems, interfaces, and **computational design**." A topographic contour field is computational cartography — it extends the copy rather than decorating it, and contour strokes are the same monoline pen the rest of the page already writes with.
- **Brief:** Motion (framer) conventions are acceptable → the page's DOM-motion owner will be `motion/react`. Per the registry's `dependency_coherence` rule, no GSAP-driven primitive may be adopted.
- The hero currently has no CTA; the primary CTA will be introduced with the hero build (e.g., an anchor to Selected projects) using the existing filled-button idiom as its base style.

**Thesis both effects serve (one story, not two tricks):** the hero is a *field* the visitor's pointer participates in — the terrain yields subtly around the cursor; the CTA attracts it. One background material + one interaction primitive stays inside the registry's `anti_pattern` line ("do not stack recognizable effects").

---

## 2. What was checked (evidence log, 2026-08-20)

| Source (registry tier) | What I checked | Finding relevant to A (topo bg) | Finding relevant to B (magnetic CTA) |
|---|---|---|---|
| **React Bits** (active query) | `reactbits.dev/llms.txt`; registry JSON at `/r/Topography-JS-CSS` and `/r/Topography-JS-TW` (both exist); GitHub repo for license | **Dedicated `Topography` background exists**: "a living contour map." WebGL fragment shader via `ogl@^1.0.11`. Props verified from registry JSON: `lowColor/midColor/highColor`, `speed`, `morphAmount`, `morphSpeed`, `bands`, `thickness`, `scale`, `pixelSize`, `glow`, `colorMode`, `contrast`, `brightness`, `fillBands`, `opacity`, `grain`, `grainIntensity`, and **built-in pointer interaction**: `mouseInteraction: true`, `mouseRadius: 0.3`, `mouseStrength: 0.4`, wired to `uMouseEnabled/uMouseRadius/uMouseStrength` uniforms with interpolated (smoothed) tracking. Also checked `Waves`/`Threads`: line-based but not contour geometry. | `Magnet` component exists (Animations section); dependencies not stated in index. License class applies (below). |
| **Motion Primitives** (active query) | GitHub repo directly (site 429-blocks fetchers, as the registry warned); raw source of `components/core/magnetic.tsx`; repo license page | No background primitives in scope. | **`Magnetic` verified at source level**: imports `motion/react` (`useMotionValue`, `useSpring`); props `intensity = 0.6`, `range = 100`, `actionArea: 'self' \| 'parent' \| 'global'`, `springOptions` (default `{ stiffness: 26.7, damping: 4.1, mass: 0.2 }`); pull math is proximity-scaled: `scale = 1 − distance/range`, `x.set(distanceX * intensity * scale)`. **Plain MIT** (rechecked), 6.0k stars, labeled beta. |
| **Aceternity UI** (active query) | `ui.aceternity.com/llms.txt`; `/components/magnetic-button` page | Full background list enumerated — **no topographic/contour component**. Closest is `Wavy Background` ("waves that move"): ribbon waves, not iso-lines; pointer reactivity undocumented. | `Magnetic Button` exists and is real: props `strength = 0.8`, `maxDistance = 100`, shadcn install `@aceternity/magnetic-button`. Underlying engine undocumented on page; registry caveat stands: **no public repo, maintenance opaque**. |
| **Magic UI** (active query) | `magicui.design/llms.txt` | Background list enumerated — **no topo**. Closest is `Interactive Grid Pattern` (SVG grid — wrong genre). | No magnetic component. |
| **Fancy Components** (active query) | `fancycomponents.dev/llms.txt` | **No topo background.** `Elastic Line` / `Pixel Trail` are pointer-reactive but wrong genre. | Only `Cursor Attractor & Gravity` — a **Matter.js physics engine wrapper**. A physics engine to nudge one button is dependency incoherence. |
| **SmoothUI** (active query) | `smoothui.dev/llms.txt` | No topo/line background. | `magnetic-button` exists ("subtly follows the cursor"), Motion-based catalog. Viable runner-up. |
| **Paper Shaders** (npm substrate) | GitHub `packages/shaders/src/shaders` directory listing | All 30 shader files enumerated (`heatmap`, `waves`, `perlin-noise`, `voronoi`, …) — **no contour/topographic/terrain shader**. Choosing this substrate would mean authoring the contour GLSL ourselves anyway. Apache-2.0. | n/a |
| **Vanta** (registry-rejected) | Registry entry only | The genre's namesake effect ("Topology") lives in a library the registry already rejected as **dead** — not a route. | n/a |
| **Licenses (gate)** | GitHub repos | React Bits: **MIT + Commons Clause** (rechecked 2026-08-20; repo active, 45.9k stars, "free for personal and commercial use"; the Clause restricts *selling the components themselves*, which a personal portfolio does not do). | Motion Primitives: **MIT**, no Clause. |

---

## 3. Effect A — Topographic pointer-reactive background

### Verdict: **ADAPT — React Bits `Topography`** (registry class: *good_foundation* → use as implementation substrate, re-author the material until it belongs to this site)

### Why this wins

1. **It is the only real topographic primitive in the entire registry.** Every other Tier-1 catalog and the shader substrate tier was enumerated and has nothing in the genre (see log). The alternatives are look-alikes (waves, threads, grids), and shipping a look-alike would misstate the visual thesis.
2. **The hard 20% is already built and tunable.** The expensive parts of this effect are (a) stable iso-line rendering in a fragment shader, (b) organic field morphing over time, and (c) *smoothed* pointer displacement of the field. All three exist and are exposed as props (`bands`, `thickness`, `morphAmount/morphSpeed`, `mouseInteraction/mouseRadius/mouseStrength` with in-shader interpolated tracking). "Reacts subtly" is a constants problem, not an architecture problem — e.g., start near `mouseStrength ≈ 0.15–0.2`, `mouseRadius ≈ 0.25`, `speed ≈ 0.15`.
3. **Adaptation is prop-level, so the reference-only rule does not trigger.** The registry routes to reference-only/custom when adoption "requires rewriting its renderer/lifecycle/material/interaction architecture." Here the entire restyle happens through the exposed surface — no shader surgery, no lifecycle rewrite.
4. **Renderer coherence holds.** `ogl` is a lightweight WebGL substrate that owns only this canvas; it is not a motion-timeline owner and does not conflict with Motion owning DOM interaction (the registry's catalog-vs-substrate distinction). No GSAP enters the page.
5. **Ingestion preference satisfied:** machine-readable shadcn registry verified working (`/r/Topography-JS-TW` matches this repo's JSX + Tailwind setup).

### The adaptation is mandatory, not optional

The default material is the recognizable React Bits demo look — neon `#5227FF` → `#FF9FFC` elevation tint, `glow: 0.5`, film grain. Adopted unchanged it would violate the registry's under-authoring rule ("if the chosen primitive defines the page's identity unchanged, transform it or build custom") and clash with everything in `globals.css`. The committed re-authoring:

- **Material:** monochrome hairline contours in the site's own tokens — lines near `--line`/`--muted` over `--background`; `colorMode` flattened (low/mid/high mapped to two or three grays), `glow: 0`, `grain: false` (or ≤0.02 if the paper texture earns it in light mode), `fillBands: false`, thin `thickness`, low `opacity` behind the display type so H1 contrast is untouched. Light mode should read as a survey map on paper; dark mode as a night chart.
- **Theme bridge:** the component takes hex props while the site themes via CSS custom properties + `color-scheme`. A thin wrapper resolves tokens with `getComputedStyle` at mount and on `prefers-color-scheme` change. Config-level work, not renderer surgery.
- **Restraint pass:** slow `speed`/`morphSpeed`, tuned band density so the field reads as texture at reading distance, not spectacle.

### Risks and mitigations

| Risk | Mitigation |
|---|---|
| MIT + Commons Clause | Acceptable here: personal portfolio, not reselling components. Recorded recheck 2026-08-20. If this site is ever productized as a template, re-evaluate. |
| `prefers-reduced-motion` (component likely doesn't handle it) | Wrapper sets `speed: 0` + `mouseInteraction: false` (static contour frame) under reduced motion; canvas is `aria-hidden`. |
| Full-viewport WebGL cost | `pixelSize`/DPR capping props exist; audit for offscreen pause at implementation and add an IntersectionObserver wrapper if missing (wrapper, not rewrite). |
| Upstream churn / prop drift | shadcn copy-in model: the file is vendored into `components/`, pinned at today's verified prop surface. |
| SSR/hydration | Client component mounted behind a static fallback layer to avoid flash; hero text never depends on the canvas. |

### Rejected routes for A

- **Adopt as-is** — under-authored; demo-recognizable neon/glow identity (fails routing rule 3).
- **Build custom** (canvas marching-squares or bespoke `fract(noise)` GLSL) — violates routing rule 2 ("search Tier-1 before building a common effect from scratch when a primitive can satisfy most of the requirement"). We would re-derive morphing + smoothed pointer displacement for zero identity gain, because identity lives in the material layer we must author either way. Custom remains the documented fallback if implementation-time audit finds the shader can't reach the quiet material we need through props.
- **Paper Shaders substrate** — no contour shader exists (verified); it's a custom build with extra steps.
- **Aceternity Wavy / React Bits Waves-Threads / Magic UI grids** — wrong geometry; adopting them re-scopes the brief.

---

## 4. Effect B — Magnetic hover on the primary CTA

### Verdict: **ADOPT — Motion Primitives `Magnetic`** (registry class: *excellent_fit* → adopt, then tune constants to this design world)

### Why this wins

1. **Exact engine coherence.** Verified at source: pure `motion/react` (`useMotionValue` + `useSpring`). The brief blesses Motion conventions; this primitive makes Motion the page's DOM-motion owner with **zero additional dependencies** beyond `motion` itself. Every alternative adds either an opaque engine (Aceternity — no public repo), a license clause (React Bits `Magnet`, MIT+CC), or an absurd dependency (Fancy Components' Matter.js physics engine for one button).
2. **The registry routes this need here by name.** Motion Primitives' listed strengths literally include "magnetic," with best-for "product/marketing interaction details, polished Motion behavior." This is an interaction detail, not the page's identity — so adopting an unchanged architecture is exactly what the routing rules permit (contrast with Effect A).
3. **Richest tuning surface of all candidates**, which is what "subtle" costs: `intensity`, `range`, `actionArea: self | parent | global`, and full `springOptions`. `actionArea`/`range` give true *proximity* attraction (pull begins as the pointer approaches, not only on hover) — the canonical magnetic feel — and the exposed spring lets us damp the default bouncy settle (`stiffness 26.7 / damping 4.1 / mass 0.2`) into something quieter. Aceternity exposes only `strength`/`maxDistance`; SmoothUI's is a fixed-feel button.
4. **Cleanest license** (plain MIT, rechecked 2026-08-20) and verified ingestion path: the site 429-blocks fetchers as the registry warned, but the component is copy-in from the public GitHub repo (`components/core/magnetic.tsx` fetched and read today).

### Planned tuning (adopt-and-tune, no structural change)

- `intensity` down to ~0.25–0.35 and a slightly wider `range` (~110–140px): small displacement that begins early reads as gravity; large displacement on hover reads as a gimmick.
- Stiffer, more damped spring for the release settle — one soft return, no wobble, matching a site with zero decorative motion elsewhere.
- Optional nested `Magnetic` on the button label at lower intensity (a documented usage pattern of the primitive) for depth without extra machinery.
- Guarantees: the CTA stays a real focusable `<a>`/`<button>` in the existing filled idiom; keyboard focus/activation get no offset; under `prefers-reduced-motion` the wrapper renders the plain button.

### Rejected routes for B

- **Aceternity `Magnetic Button`** — real and fine (runner-up), but fewer knobs, undocumented engine, and the registry's "no public repo, maintenance opaque" caveat; no reason to prefer it over a source-verified MIT primitive.
- **React Bits `Magnet`** — exists, but unspecified engine in the index and MIT+CC when a plain-MIT equal-or-better option exists; also avoids sourcing both effects from one catalog on license class alone.
- **SmoothUI `magnetic-button`** — viable, Motion-based, but packaged as a styled button rather than a wrapper primitive; we want the site's own CTA styling with an interaction wrapper around it.
- **Fancy Components attractor** — Matter.js for a button hover fails `dependency_coherence` outright.
- **Build custom** — trivially possible (~40 lines with Motion), but routing rule 2 says don't rebuild a commodity interaction a Tier-1 primitive already solves, including the edge cases (leave/settle behavior, action-area scoping) we'd otherwise re-debug.

---

## 5. Cross-cutting commitments

- **One owner per concern:** `ogl` renders the background canvas; `motion/react` owns DOM interaction motion. No GSAP, no three.js, no second spectacle effect in the hero.
- **New dependencies at implementation time:** `motion` (interaction owner, needed regardless) and `ogl` (pulled by Topography; lightweight WebGL, far smaller than three.js). Both components are vendored copy-in files we own.
- **Accessibility floor:** background `aria-hidden`, contrast-safe line opacity behind the H1, reduced-motion static rendering for both effects, CTA semantics untouched.
- **Both effects tell one story:** the pointer deforms the terrain; the CTA attracts the pointer. Adapted material + one polished interaction primitive — inside the registry's "one strong adapted primitive plus bespoke composition" norm.

## 6. Summary table

| Effect | Source | Decision | Class (registry fit vocabulary) |
|---|---|---|---|
| Topographic pointer-reactive background | React Bits `Topography` (ogl/WebGL, shadcn registry `Topography-JS-TW`) | **Adapt** — adopt substrate, re-author material to monochrome hairline tokens; reduced-motion + perf wrappers | `good_foundation` |
| Magnetic CTA hover | Motion Primitives `Magnetic` (motion/react, copy-in from GitHub) | **Adopt** — tune `intensity`/`range`/`actionArea`/spring to a quiet, early-onset pull | `excellent_fit` |

Next step (separate change): vendor both components, build the theme-token bridge and reduced-motion wrappers, compose the hero, then tune constants against the live page.

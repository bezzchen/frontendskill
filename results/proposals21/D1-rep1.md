# Hero Effects Sourcing Proposal

**Scope:** two hero effects — (A) an animated topographic-line background that reacts subtly to pointer movement, (B) a magnetic hover effect on the primary CTA.
**Status:** sourcing decision only. No implementation in this change.
**Inputs:** this repo; the team registry at `../context/component_libraries.json` (snapshot 2026-08-12); live re-verification performed 2026-08-20 per the registry's `staleness_recheck` rule.

---

## 1. Verdicts at a glance

| Effect | Verdict | Source | License (verified) | Registry fit class |
|---|---|---|---|---|
| A. Topographic background | **Adapt** | React Bits `Topography` (OGL/WebGL2 shader) | MIT + Commons Clause | `good_foundation` — substrate, re-materialed to this site |
| B. Magnetic CTA | **Adopt (tuned)** | Motion Primitives `Magnetic` (motion/react) | MIT | `excellent_fit` — behavior-only primitive, restyle-free |

Nothing is treated as reference-only and nothing needs a from-scratch build: for A, exactly one true contour primitive exists across the whole registry and its architecture survives our restyle without renderer surgery; for B, a plain-MIT, Motion-native behavior wrapper already does precisely what the brief asks.

---

## 2. The site's visual language (what the winner must fit)

Read from the repo, not assumed:

- `app/globals.css` — paper/ink neutrals with light+dark via CSS variables: `--background #f5f5f3 / #111110`, `--foreground #161616 / #f5f5f2`, `--muted #6b6b66 / #a0a099`, `--line #deded8 / #31312f`. No accent color exists anywhere.
- `components/ProjectGrid.jsx`, `components/SettingsPanel.jsx` — the entire decorative vocabulary is **hairline borders** (`border-[var(--line)]`), quiet surfaces, rounded corners, generous whitespace.
- `app/page.jsx` — typographic hero ("Jordan Lee — systems, interfaces, and computational design"), tracking-heavy kicker, no imagery, no gradients, no motion. There is currently **no CTA button and no motion library installed** (`package.json`: next/react/react-dom/tailwind only); both arrive with this work.

So the page reads as a restrained engineering notebook. The bar for any sourced effect: **monochrome, hairline-weight, token-driven (must follow light/dark), slow, and quiet** — decoration that looks like the site's own 1px border language, not like a component catalog.

Why the chosen effects fit at all: a contour map drawn in `--line`-colored hairlines is literally terrain rendered in the site's existing stroke vocabulary, and "topography" is an on-persona metaphor for someone who does "systems… and computational design." A magnetic CTA is the registry's blessed "single expressive interaction primitive" — felt, not seen.

---

## 3. Effect A — topographic-line background

### 3.1 What was checked (2026-08-20)

| Source | How checked | Result |
|---|---|---|
| React Bits | `reactbits.dev/llms.txt` + full source read of `src/ts-tailwind/Backgrounds/Topography/Topography.tsx` (440 lines) from GitHub | **`Topography` — a real contour-map renderer with built-in pointer interaction.** Details below. Also `Waves`, `Line Waves`, `Floating Lines`, `Threads` (line fields, not contours). |
| Magic UI | `magicui.design/llms.txt` | No topographic/contour component. Closest: static SVG grid/dot patterns, `Warp Background`. |
| Aceternity UI | `ui.aceternity.com/llms.txt` | No contour background. Closest: `Scales` (repeating straight-line pattern — wrong topology). |
| Fancy Components | `fancycomponents.dev/llms.txt` | Nothing in the genre (text/cursor effects; `Pixel Trail` closest, irrelevant). |
| SmoothUI | `smoothui.dev/llms.txt` | No topographic/contour component. |
| Paper Shaders (substrate tier) | Full shader inventory from `paper-design/shaders` repo tree (30 shaders) | **No contour/topo shader** (`perlin-noise`, `simplex-noise`, `waves`, `heatmap`, etc. — none extract iso-lines), and no pointer-input uniform in the React API. Rejected on primitive mismatch, not license (Apache-2.0 is fine). |
| ShaderGradient | registry | Gated out — ships no license file (`license_gate`), and wrong aesthetic anyway. |

Conclusion of the sweep: **React Bits `Topography` is the only genuine topographic primitive in the entire registry.** The realistic alternatives are it or a custom build.

### 3.2 Evidence from the source (why it can carry the requirement)

Read in full from `DavidHDev/react-bits@main`:

- **True contours, not styled waves.** A smooth scalar field (four CPU-animated Fourier control curves, `bez()` → `field()`) is banded into iso-lines in the fragment shader via `fract(f * uBands)` with `fwidth`-based anti-aliasing. That is the classic topo-map construction — closed, merging/splitting elevation rings, exactly what "topographic" means. React Bits' `Waves` (also read: canvas-2D perlin polylines) is parallel wavy lines — wrong topology — which is why it lost.
- **Pointer reactivity is built in, and it is the right kind.** `uMouse` + `exp(-d²/r²) * uMouseStrength` adds a Gaussian **elevation bump** at the cursor: contour rings bloom softly around the pointer and relax when it leaves (`mouseActive` eases in/out; position lerps at 0.05/frame). Exposed as props: `mouseInteraction`, `mouseRadius`, `mouseStrength`. "Reacts subtly" is a prop value (`mouseStrength` ≈ 0.12–0.2 vs default 0.4), not new code.
- **The neon identity is defaults, not architecture.** Defaults are catalog-flavored (`#5227FF → #FF9FFC → #FFFFFF` elevation tint, `glow: 0.5`, `grain: true`). But the shader ships `colorMode: 'uniform'` (single line color), `glow: 0`, `grain: false`, plus `bands`, `thickness`, `speed`, `morphAmount`, `opacity`, `contrast` — i.e., a monochrome hairline contour map is reachable **purely through the published prop surface**. Per the registry routing rule, adapt-vs-reference-only hinges on whether we'd have to rewrite renderer/material architecture; we do not.
- **Production hygiene already paid for:** `IntersectionObserver` + `visibilitychange` pause the rAF loop off-screen/off-tab, DPR clamped to 2, `ResizeObserver` sizing, `WEBGL_lose_context` on unmount. A custom build would have to re-earn all of this.
- **Cost:** one new leaf dependency, `ogl` (small WebGL lib) — an isolated renderer inside one component, not a second page-level motion system, so the registry's `dependency_coherence` rule (one motion owner) is not violated. License MIT + Commons Clause **verified from `LICENSE.md` 2026-08-20**: commercial *use* is permitted; selling/redistributing the components themselves is not. For a personal portfolio this is clean; noted per `license_gate` because it is not plain MIT.

### 3.3 Verdict: **Adapt** (`good_foundation`)

Not "adopt": dropped in as-is it would scream React Bits (glowing violet-to-pink elevation map) and fail the routing rule "if the chosen primitive defines the page's identity unchanged, the design is under-authored." Not "reference-only/custom": a custom canvas-2D marching-squares build was seriously costed and would spend a day re-deriving field morphing, pointer bump, AA, and visibility/perf plumbing that this shader already exposes as props — the registry says search catalogs *before* building a common effect from scratch, and this primitive satisfies most of the visual requirement.

**Planned adaptations (implementation stage, listed for scope honesty):**

1. **Re-material to the site's tokens.** `colorMode: 'uniform'`, `glow: 0`, `grain: false`, `fillBands: false`; line color = resolved `--line` (nudged toward `--muted` if contrast reads too faint), re-resolved on color-scheme change so light/dark both work. Thin `thickness` (~0.008), moderate `bands`, `opacity` ~0.5–0.65, slow `speed`/`morphSpeed` (roughly a third of defaults). Target: reads as animated hairlines from the ProjectGrid's own border vocabulary.
2. **Move pointer capture up.** The component binds `mousemove` on its own canvas; as a hero *background* it sits under the text/CTA layer, which would eat those events. Bind on the hero `<section>` and forward normalized coordinates (small, contained edit).
3. **Accessibility/robustness gaps to close:** honor `prefers-reduced-motion` (freeze `speed`/`morphSpeed`/pointer bump to a static frame — the component has no handling today), `'use client'` + dynamic import with a plain `--background` fallback for SSR/no-WebGL2, and a soft radial mask behind the heading so text contrast stays intact.

## 4. Effect B — magnetic CTA

### 4.1 What was checked (2026-08-20)

| Candidate | How checked | Finding |
|---|---|---|
| **Motion Primitives `Magnetic`** | Full source read, `ibelick/motion-primitives@main components/core/magnetic.tsx` (112 lines); repo metadata via GitHub API | Spring-physics attraction on `motion/react` `useMotionValue`+`useSpring`; linear distance falloff (`intensity * (1 − d/range)`); props `intensity` (0.6), `range` (100), `actionArea: 'self' | 'parent' | 'global'`, `springOptions`; springs settle to 0 on leave. shadcn-style registry JSON confirmed in-repo (`public/c/magnetic.json`). **License MIT, pushed 2026-03-19, 6,016 stars** (GitHub API; matches registry's "beta, Mar 2026" note — ~5 months quiet, acceptable for a 112-line vendored primitive). Docs site 429-blocks fetchers exactly as the registry warns; GitHub was the verification path. |
| React Bits `Magnet` | Full source read (85 lines) | Works, but `setState` on every `mousemove` (per-frame React re-renders), CSS `transition` strings instead of springs (steppier feel, tuning by string), always-on `window` listener, and MIT+Commons-Clause. Inferior on engine, feel, and license — no reason to prefer it. |
| Aceternity "Magnetic Button" / SmoothUI "magnetic-button" | llms.txt sweeps | Both exist, but both are *styled buttons* that bring their own look, and Aceternity has no public repo (registry: maintenance opaque). We need a behavior wrapper around our own token-styled CTA, not someone else's button skin. |
| Fancy Components "Cursor Attractor & Gravity" | llms.txt | Matter.js physics engine to nudge a button — grossly over-weighted dependency; violates `dependency_coherence`. |
| Magic UI | llms.txt | No magnetic component at all. |
| Custom build | costed | ~40 lines with motion/react, but buys nothing over a 112-line MIT primitive that already has range falloff, action areas, and configurable springs. Routing rule: don't hand-build a common effect a Tier-1 primitive satisfies. |

### 4.2 Verdict: **Adopt, tuned** (`excellent_fit`)

Motion Primitives `Magnetic` is the rare case where plain adoption is honest: it is a **behavior-only wrapper with zero visual identity** — nothing about it can clash with the site's language because the CTA itself (our own element, styled like the existing `Save changes` button: `--foreground` fill on `--background` text) stays ours. The brief explicitly blesses "Motion (framer) conventions," and this primitive *is* those conventions (`useSpring` on motion values). Tuning, not transformation: `intensity` ~0.3–0.4 and `range` ~90–110 for a felt-not-seen pull, slightly stiffer `springOptions` than the bouncy default (the site is calm, springs should settle fast), `actionArea: 'self'`, plus a `prefers-reduced-motion` no-op guard we add at the call site. Optional composition detail: a second nested `Magnetic` at lower intensity on the label for a subtle parallax — supported natively (`magnetic-nested` example in-repo).

This decision also fixes the page's **motion owner**: we introduce the `motion` package as the single motion system (Effect A's OGL loop is a self-contained leaf renderer, not a DOM motion system; no GSAP anywhere). Any future motion work joins that owner.

---

## 5. Cross-cutting notes

- **New dependencies at implementation time:** `motion` (page motion owner), `ogl` (Topography's renderer), both vendored-component-plus-lib per each catalog's model. No conflict per `dependency_coherence`.
- **Anti-pattern guard:** exactly two effects — one background material + one interaction detail. No stacking; ProjectGrid/Settings stay static so the hero remains the only expressive surface.
- **Licenses re-verified 2026-08-20** (registry `staleness_recheck` / `fact_policy`): React Bits `LICENSE.md` = MIT + Commons Clause (use OK, resale of components barred — fine for this personal site); Motion Primitives = MIT via GitHub API. Re-check again if this codebase is ever productized as a template.
- **The hero currently has no CTA** — the primary CTA (e.g., "View selected projects" → `#projects`) is added as part of the hero build; the magnetic wrapper adopts it then.
- **Honest failure line:** if, after re-materialing, Topography still reads as "catalog neon turned down" rather than "the site's hairlines animated" (e.g., band geometry feels foreign at monochrome settings), the fallback is a custom canvas-2D marching-squares renderer using Topography's interaction math as reference-only. Current evidence (uniform color mode + zero glow reachable via props) says this fallback will not be needed.

<!-- run: D0-unprompted-discovery | condition: with_skill_v1 | rep 2 | model claude-fable-5 | 2026-08-25 | fixture next-tailwind-base edf3be4 (fresh copy) | protocol evals/withskill_protocol.md | captured verbatim from agent final report (agent additionally ran a delegated live catalog/freshness sweep; its findings are integrated below) -->

All checks are complete. License restated: React Bits is MIT + Commons Clause — free to use and modify inside an application or website (our case), only reselling the components themselves is barred, so adapt-with-attribution is clean. `ogl` is at 1.0.11. I have everything needed for the proposal.

## Proposal — hero topographic background + magnetic CTA (D0ws-rep2)

### Repo facts the plan is built on
- `/private/tmp/.../runs/D0ws-rep2`: Next 16.2.12 App Router, React 19.2.8, Tailwind 4.3.3 (CSS-first, no config file), **plain JS** (.jsx), no animation library installed.
- Hero today is a static `<header>` in `app/page.jsx` (name + tagline, **no CTA — one must be introduced**). Palette is CSS variables in `app/globals.css` with automatic dark mode via `prefers-color-scheme` (`--background/--foreground/--muted/--surface/--line`). `components/ConstellationData.js` is unused by the page and stays untouched.

### Register: W (Expressive / Persuade) — stated per the architect skill
One signature idea: a living contour field behind the intro, echoing "systems… and computational design" in the copy. I explicitly weighed **S (Spectacle)** and decline it: the brief says *subtle*, the field supports the copy rather than being the structural core, and pointer input modulates the field without restructuring it. Q is wrong too — it forbids exactly the continuous ambient layer the brief requests. W's budget: motion serves this one idea; small, pinned dependencies allowed.

### Architecture

**1. `components/TopoField.jsx` (client) — adapted React Bits Topography, on `ogl`.**
Full-bleed WebGL2 quad inside the hero: a scalar field banded by `fract(field × bands)` with `fwidth()` anti-aliased hairlines; a gaussian bump added to the field at the pointer position, eased ~5%/frame, gives the "terrain rises softly under the cursor" reaction. Rendered absolutely positioned behind hero content: `aria-hidden`, `pointer-events-none`, `-z-10` (hero `<section>` becomes `relative isolate`).

Why adapt rather than build: the catalog piece already contains the riskiest 80% verified in source — the banded-isoline shader, the pointer-bump uniform pipeline, **and** IntersectionObserver + `visibilitychange` start/stop, DPR cap 2, ResizeObserver, and WebGL context release on unmount (non-negotiable 1's exact shape). Hand-rolling that would be wheel reinvention.

Bounded adaptation list (the deltas we own):
- **Fix the dead-listener bug for background use**: their `mousemove` is bound to the canvas, which never fires under `pointer-events: none`. Rebind as `pointermove`/`pointerleave` on the hero section, gated to `(pointer: fine)` so touch devices get ambient drift only.
- **`prefers-reduced-motion`**: render exactly one static frame (their resize path already does a single render), never start the loop, disable the pointer bump; react to live media-query changes.
- **Palette from CSS variables, not hex props**: resolve `--line`/`--muted` via `getComputedStyle` at mount and on color-scheme change; retune defaults to this quiet system — `colorMode: 'uniform'`, thin `thickness`, low `opacity`, `glow: 0`, `grain: off`, slow `speed`, gentle `mouseStrength` (~0.15–0.25). Default purple/pink dies.
- **Progressive enhancement**: WebGL2 unavailable → component renders nothing; the hero must read perfectly on plain `--background` (also the SSR state, so no hydration flash).
- Retain the React Bits copyright notice in the file header (Commons Clause requires notice; in-site use is expressly permitted).

**2. `components/MagneticCta.jsx` (client) — custom, motion-native (~50 lines).**
`useMotionValue` + `useSpring` on a wrapper around the primary CTA (proposed: `View projects` anchor to the projects section, styled like the existing `--foreground`-on-`--background` button; optional plain-link secondary "Get in touch"). `pointermove` on a padded hitbox (not `window`), displacement toward pointer clamped to ~8px with 1.02 max scale, spring release on leave; label counter-translates at ~0.4× for depth. `useReducedMotion` → inert. Transform-only — layout, focus ring, and hit target untouched; it remains a real focusable `<a>`.

**3. Ownership boundaries.** The rAF loop inside TopoField is the *only* animator of the canvas; motion owns the *only* JS-driven DOM transform (the CTA). No shared transforms, no GSAP, no three.js/R3F (an engine for one full-screen quad is architecture theater). `app/page.jsx` stays a server component; the two client leaves slot into the upgraded hero section.

### Dependencies (both pinned, per React Bits' own 0.0.x-style volatility warnings and the skill's freshness rule)
- `ogl@1.0.11` — WebGL substrate for the adapted background (tree-shakes to Renderer/Program/Mesh/Triangle).
- `motion@13.1.1` — CTA springs + reduced-motion hook; peer-compatible with React 19.2.8; import from `motion/react`. Note: motion moved to **v13** since my training data (I believed v12) — the installed version and current API get re-inspected at implementation time.
- Two deps is justified because they own disjoint concerns (GL rendering vs DOM micro-interaction). If the budget must be one: port the Topography shader to raw WebGL2 (~40 extra lines, drop `ogl`) — a knob, not an architecture change.

### Sourcing plan — what I checked (fit gate)
| Source | Finding | Verdict |
|---|---|---|
| [React Bits](https://reactbits.dev/) — Topography, source read in full from [the repo](https://github.com/DavidHDev/react-bits) | WebGL2/ogl contour shader; built-in pointer bump + IO/visibility pausing; no reduced-motion; canvas-bound mouse events; MIT + Commons Clause (in-site use permitted) | **Adapt** (deltas above) |
| React Bits — Magnet, source read in full | Plain React: setState per window mousemove (re-render/frame), CSS-transition easing, no springs, no reduced-motion | **Reference-only** → custom motion version |
| [Paper Shaders](https://shaders.paper.design/) full catalog | 30 shaders enumerated — no topographic/iso-line effect; pointer input undocumented; 0.0.x breaking-changes warning | No fit |
| [shadcn.io Topography](https://www.shadcn.io/background/topography) | Exists, but rendering tech, pointer reactivity, pause behavior, license all unverifiable from page | Rejected — React Bits wins with source-verified behavior |
| [Fancy Components](https://github.com/danielpetho/fancy) / [motion-components.dev](https://www.motion-components.dev/) | Motion-based catalogs; `motion-magnetic` confirms spring-to-cursor as the canonical pattern | Reference-only |
| [Codrops Feb 2026 R3F contour tutorial](https://tympanus.net/codrops/2026/02/24/from-flat-to-spatial-creating-a-3d-product-grid-with-react-three-fiber/) / [Framer marketplace component](https://www.framer.com/community/marketplace/components/topographic-contour/) | Technique validation for shader isolines; Framer piece is platform-locked | Reference-only |

### Verification plan (actual conditions, per non-negotiable 2)
In the running dev app via browser tooling: (1) instrument a dev-only frame counter, scroll the hero fully offscreen, confirm the counter **freezes** and resumes on return — not merely that the observer fired; (2) hide the tab and confirm the same; (3) move the pointer across hero text and confirm the bump follows with easing and decays on leave — proving the rebound listener fix (their canvas-bound version would silently do nothing); (4) emulate `prefers-reduced-motion` → single static frame, no rAF, inert CTA; (5) emulate light and dark color schemes → palette re-resolves; (6) keyboard-focus the CTA → visible ring, no magnetic jitter; (7) performance trace during idle drift (target: near-zero main-thread work — CPU only updates a few uniforms) and heap stability; (8) `npm run build` passes. Nothing gets reported as working until observed under these exact conditions.

### Open questions for you (not blocking — I'd default as stated)
1. CTA label/destination: defaulting to **"View projects"** → `#projects` anchor unless you want "Get in touch"/mailto as primary.
2. Line color intent: defaulting to near-`--line` hairlines a notch above background (quiet, print-like); say the word if you want higher-contrast drama.

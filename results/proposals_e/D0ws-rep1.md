<!-- run: D0-unprompted-discovery | condition: with_skill_v1 | rep 1 | model claude-fable-5 | 2026-08-25 | fixture next-tailwind-base edf3be4 (fresh copy) | protocol evals/withskill_protocol.md | captured verbatim from agent final report; agent's commissioned research sweep was orchestrator-relayed after a notification-routing stall (documented in wave record) -->

Restating the update: the coordinator relayed my commissioned research agent's report verbatim — it is indeed the sweep I dispatched (React Bits, Paper Shaders, Fancy Components, SmoothUI, `motion` freshness, Vanta, technique references), and its findings are complete enough to close every open sourcing decision. Sanity check before finalizing: repo remains untouched (read-only inspection only, per "do not implement"), the brief's three asks are each addressed below, and all four architect non-negotiables (pause policy, real-condition verification, fit-gate citations, register declaration) are explicitly covered. Final proposal follows.

---

# Proposal — Hero topographic background + magnetic CTA

**Repo:** `/private/tmp/claude-501/-Users-bezzchen-Documents/37b75f5e-0330-4278-8117-fba2895b3c92/scratchpad/runs/D0ws-rep1` — Next.js 16.2.12, React 19.2.8, Tailwind 4.3.3, **JavaScript** (jsconfig, `.jsx`), zero client components today, light/dark theming via CSS tokens (`--line`, `--muted`, `--surface`, `--background`) driven by `prefers-color-scheme`.

## 1. Register: W (Expressive)

One signature idea — *terrain that notices you*: contour lines drift slowly and bow gently around the pointer; the CTA leans toward the cursor the same way. Not Q (this is the site's identity moment, not an operate surface). Spectacle (S) weighed and **declined**: the brief says "subtly," the page is a restrained editorial portfolio with a settings panel and project grid below, and the page must function identically with the background absent — the graphical system is supportive, not structurally central. ProjectGrid and SettingsPanel stay quiet; hero motion does not leak downward. Visual thesis, palette, contour weight, and CTA copy remain the design director's call; this proposal fixes the technical envelope.

## 2. Architecture

Two small client islands; everything else stays server-rendered.

```
app/page.jsx (server)  — hero restructured into a full-bleed <section class="relative isolate overflow-hidden">
├── components/hero/TopoField.jsx        ('use client')  lifecycle wrapper: owns rAF gating,
│     IntersectionObserver + visibilitychange pause, reduced-motion static mode, token→color
│     derivation (getComputedStyle + matchMedia('(prefers-color-scheme: dark)') listener),
│     DPR cap (≤2), ResizeObserver, pointer spring-smoothing → uniforms
│     └── components/hero/Topography.jsx  vendored draw core (adapted from React Bits), ogl/WebGL2
└── components/hero/MagneticCta.jsx      ('use client')  motion-based magnetic anchor
```

- **Pluggable draw core:** the wrapper owns all lifecycle; the draw core only draws. If the vendored shader can't be tuned to the site's hairline editorial look, we swap the core for a custom Canvas-2D marching-squares implementation without touching the wrapper. This is the primary risk contained.
- **One owner per concern:** `motion` owns exactly one thing — the CTA's transform springs. The canvas loop owns exactly one thing — canvas pixels, driven by its own gated rAF (ogl has no shared ticker; we drive and gate the loop ourselves). No engine ever shares a transform or timeline with another. No GSAP.
- **Hero layout:** background layer `absolute inset-0 -z-10 aria-hidden`; text stays on the existing `max-w-6xl` grid; a radial scrim (`--background` ~70% → transparent) behind the text block guarantees AA contrast over line work in both schemes. Canvas is transparent until first client draw, so first paint shows the token background — no CLS, no flash.
- **New CTA:** the current hero has none. Add a primary anchor (placeholder copy "View selected work" → `#projects-title`; final copy = design director) wrapped in `MagneticCta`.

## 3. Sourcing plan (fit gate — checked: React Bits, Paper Shaders, Fancy Components, SmoothUI, motion.dev, Vanta)

**Effect A — topographic background: ADAPT React Bits `Topography`.**
Direct catalog hit (reactbits.dev Backgrounds, JS-TW variant, MIT + Commons Clause — fine for an app/site): WebGL2 fragment shader via `ogl@^1.0.11` (sole dep) whose uniforms match the spec exactly — `uBands`/`uThickness`/`uFillBands`, `uMorphAmount` drift, `uLow/uMid/uHigh` colors, and built-in pointer warp (`uMouse`, `uMouseRadius`, `uMouseStrength`, `uMouseEnabled`). Plain hooks, React-19 safe. Adopt-as-is fails my pause rule, so it's **adapt**: vendor the JSX with attribution, then (a) gate its rAF behind the wrapper's IO/visibility/reduced-motion logic, (b) replace hardcoded colors with token-derived uniforms that re-derive on scheme change, (c) tune toward hairlines (thin `uThickness`, `uFillBands` off, low-alpha `--line`), (d) disable pointer warp on coarse pointers (drift only), (e) transparent no-crash fallback when WebGL2 is unavailable.
Rejected for A: **Paper Shaders** `@paper-design/shaders-react@0.0.80` — full 31-shader export list checked, no contour/iso-line shader (Heatmap/PerlinNoise/Warp are the closest and none renders topo line work; 0.0.x breaking-change volatility noted). **Fancy Components** — no topo background. **Vanta TOPOLOGY** — particle flow-field, not contours; p5 dep; unmaintained since 2022.
**Reference-only** (kept as the swap-core recipe if tuning fails): Shadertoy fract/fwidth iso-line recipe (shadertoy.com/view/lty3RK), holodan's interactive Canvas-2D marching-squares topo (codepen.io/holodan/pen/RwzjQpj), Chris Akroyd's marching-squares tutorial.

**Effect B — magnetic CTA: CUSTOM (~50–60 lines) on `motion@13.1.1`, with SmoothUI as the behavior reference.**
- React Bits `Magnet`: zero-dep but **declined** — global `window` mousemove listener, spring-back faked with CSS transition strings, no reduced-motion handling. The snap-back physics are the visible half of this effect.
- SmoothUI `MagneticButton`: right behavior spec (strength/radius props, `useSpring`, reduced-motion respected, touch disabled) but drags `@radix-ui/react-slot` + `cva` and is TypeScript; stripping those leaves ~the community pattern anyway → **reference-only**.
- motion.dev's first-party magnetic example is Motion+ (paid) → not adoptable; free tier is the documented community pattern: `useMotionValue` + `useSpring` + pointer math.
- Build: proximity wrapper (padded hitbox, wrapper-scoped `pointermove` — no global listeners), translate = capped fraction of cursor offset (~0.25×, ≤10px), inner label at ~0.4× for depth, spring back on leave, `useReducedMotion` gate, coarse-pointer gate. Import path `motion/react`.

**Dependencies added (exactly two, pinned):** `ogl@^1.0.11`, `motion@13.1.1` (verified 2026-08-25: MIT, React `^18||^19` peer, no Next-16 caveats; v13's only breaking change is emotion-related, irrelevant here). The brief blesses Motion conventions; motion is scoped to the CTA now and is the site's future micro-motion substrate. Installed versions get re-inspected at implementation time before any API use.

## 4. Non-negotiable behaviors (built in, not bolted on)

- **Pause policy:** loop stops when the hero is offscreen (IntersectionObserver) *and* when `document.hidden` — including the vendored component's own rAF, which the wrapper owns after adaptation. Resume re-seeds the clock to avoid time-jumps. The magnet is event-driven and must be idle at rest (springs settle; verified below).
- **Reduced motion:** render one static contour frame (drift 0, warp off), magnet fully inert — texture kept, motion removed.
- **Touch:** ambient drift only, no warp, no magnet.

## 5. Verification plan (actual conditions, not proxies)

Against `next dev` in a real browser (Playwright/CDP), with a temporary frame counter on the loop:
1. Scroll hero out of viewport → counter frozen ≥2s (real scroll, not a `document.hidden` flip).
2. Real tab switch away/back → counter frozen while hidden.
3. Reduced-motion emulation + reload → counter ≤1, contours still visible in screenshot, CTA static under hover.
4. Pointer sweep → screenshot diff shows bounded warp; field relaxes on leave.
5. CTA: computed transform ≤ cap during hover, returns to identity after leave, no rAF activity once settled.
6. Scheme toggle → colors re-derive live; contrast spot-check both schemes over the scrim.
7. Mobile emulation → no warp/magnet listeners active.
8. WebGL2 forced unavailable → transparent fallback, no crash.
9. Perf trace ~10s (idle → hover → idle): per-frame main-thread cost within ~2ms desktop budget, no long tasks; `npm run build` passes; `app/page.jsx` remains a server component.

## 6. Sequencing and risks

Sequence: install deps → vendor Topography → **spike checkpoint:** tune uniforms toward the hairline look (go/no-go on the vendored core; on no-go, swap core to custom marching squares behind the same wrapper) → build TopoField wrapper → build MagneticCta + add CTA → restructure hero full-bleed + scrim → run the verification matrix.
Risks: (1) Topography's banded-shader character may resist the hairline aesthetic — contained by the spike checkpoint and pluggable core; (2) React Bits' live demo wasn't visually verifiable (assessment is from shader source) — same mitigation; (3) Commons Clause — acceptable for this site, attribution header kept; (4) bundle: ogl + motion ride only the two islands, and TopoField can be `next/dynamic`-deferred to keep hydration light.

No code has been written; the repo is untouched pending approval.

# E4ws-rep1 — WITH SKILL, Fable, plan-only
Eval: E4-dom-plus-gpu-media. Fixture next-tailwind-base @ edf3be4.
NO STALL — 5 tool calls, same as the baseline reps. The only rep-1 with-skill run that did not
delegate its catalog sweep to a child.

## Three repo findings that "constrain the design more than the brief does"
1. **"There are no images."** ProjectGrid is a server component; each card wraps an aria-hidden
   <div data-project-media> painted with a CSS gradient. "A refraction shader needs pixels to refract,
   so real <img> elements have to be introduced (same-origin or CORS-enabled — GL can't sample a
   tainted image)."
2. **"Opening a project has no destination."** The #project-N hashes point at nothing; no
   /projects/[id] route, no dialog. "The transition layer therefore has to live somewhere that
   survives whatever the destination turns out to be."
3. ConstellationData.js imported by nothing. "Unrelated; leave it."

## Register: W, spectacle explicitly declined
"'High-end', 'dramatic', 'shader-like' are Spectacle signals, so I weighed S. Declined: the brief pins
text, layout, a11y, SEO and responsiveness to normal DOM and scopes motion to the images. The
graphical system is NOT structurally central — the page stays a semantic grid, and interaction changes
only the pictures. Making the grid a WebGL scene would violate the constraint outright. The image
layer gets S-grade rendering discipline (GPU, on-demand, DPR-aware), but the page is W."

## Recommendation: one shared, transparent, on-demand WebGL2 overlay, zero dependencies
Single position:fixed inset:0 pointer-events:none aria-hidden canvas (backing store = viewport x
min(DPR,2)), one WebGL2 context, one program, one unit quad. Each registered <img> drawn as a
screen-space quad at its getBoundingClientRect() via gl.viewport + gl.scissor, rect read inside the
rAF so scroll stays in sync; passive scroll listener just requests a frame.

**"Overlay, never swap" — the key insight.** The DOM <img> is never hidden. At rest the canvas paints
nothing; while the pointer is active the GL quad fades in (~100ms) ON TOP OF the identical image, and
fades out when the field relaxes. "This removes the whole load-state/readiness/flash machinery of the
usual 'hide the img once GL is ready' pattern, and it means EVERY failure mode — no WebGL2, context
loss, texture CORS failure, reduced motion, JS off — degrades to the unmodified site. SEO and the
accessibility tree see the same <img src alt> in every state."

Shader: single pass, no framebuffers. Uniform array of the last ~12 pointer samples (x, y, age) drives
an analytic height field; refraction = UV offset along its gradient; dispersion = R/G/B at slightly
different offsets. **"Relaxation is age-based, so the loop has a deterministic stop condition."**
Rounded-rect SDF mask (radius read from the img's computed border-radius) so the square quad doesn't
overpaint rounded-lg corners; premultiplied-alpha onto a transparent clear.

Transition: same program, uProgress 0->1. On click, preventDefault, tween the quad's rect from card to
target while distortion crests and settles, then router.push. **Because the layer mounts in
app/layout.jsx it persists across the navigation; the destination hero <img> registers under the same
project id and the in-flight quad hands off to its rect — "shared-element continuity with no
snapshotting."** Works identically if "open" becomes an in-page dialog. Keyboard Enter fires the same
anchor click; reduced-motion or no-GL users get the plain link.

Client boundary "the smallest that works": ProjectGrid stays a server component; three small client
pieces (MediaFXLayer once in layout; ProjectMedia leaf rendering the real <img>; ProjectCard thin
next/link wrapper). "Communication through a module-level registry, not React state — the loop reads
rects at 60 Hz and must not cause renders." Textures uploaded from the already-decoded <img> after
decode() "so currentSrc's right-sized bytes are reused, no second download", deleted on unregister.

**Pause rules "designed in, not bolted on" — three gates:** (a) activity — loop runs only while a
pointer sample is younger than the decay window or a transition is in flight; (b) viewport —
IntersectionObserver per registered img, offscreen quads skipped, and with zero visible images pointer
input is dropped and no frame scheduled; (c) document — visibilitychange/pagehide cancel the rAF,
resuming only to finish an interrupted transition. webglcontextlost -> stop, DOM images carry the page.
Footprint: ~300-400 lines incl. both shaders, ~4-6 kB gz, zero new deps, one context regardless of
project count.

## Fit gate — verified, with context-limit arithmetic
| Option | Verdict | Why |
|---|---|---|
| React Bits Ripple Distortion (ogl), Grid Distortion (three); Paper Shaders 0.0.80 lens-distortion/water/fluted-glass | reference-only | "All verified canvas-per-instance with their own WebGL context and no <img> in the DOM. **Eight cards = eight contexts against a 16-per-page cap (8 on Android)** — a 12-16 project grid starts evicting." None can expand past its own box for the open transition. Ripple Distortion is the best LOOK reference; Paper Shaders' IO + visibilitychange pausing "the right behavioural reference." |
| Fancy Components, SmoothUI | nothing applicable | DOM/Motion/SVG only |
| curtains.js 8.1.6 | reference-only | "Architecturally the closest thing that exists... it validates the approach — but last published May 2024 and its successor is WebGPU-only (Safari 26/iOS 26 only, Firefox partial). Adopting a dormant dependency to avoid ~200 lines of GL is a bad trade." |
| OGL 1.0.11 | **adapt — declined narrowly** | "The real runner-up: 8 kB core, no ticker, would save ~100 lines of boilerplate. Declined because our GL surface is one program, one quad, N textures, viewport/scissor placement — OGL's Camera/Transform/Mesh layers have nothing to abstract. Revisit if a second effect type or real geometry appears." |
| Three 0.185 + R3F 9.7 + drei 10.7 <View> | reject | "~10x the bundle; **R3F defaults to frameloop='always' so non-negotiable 1 becomes an audit instead of a property of the design.**" |
| Pixi 8.20 DisplacementFilter | reject | "autoStart: true, ~400 kB, own scene graph and event system, and displacement-map look is lower fidelity than analytic refraction + dispersion." |
| SVG feDisplacementMap/feTurbulence | reject, **including as fallback** | "CPU-rasterized on large surfaces and poor on Safari; no real refraction... **A janky fallback is worse than the clean image — fallback is 'no effect'.**" |
| View Transitions (<Link transitionTypes> since Next 16.2; React <ViewTransition> canary-only) | complement, not replacement | "Snapshot crossfade/morph, not a shader." |
| Per-card canvases blitting from one shared context; OffscreenCanvas + worker; WebGPU | reject | worker messaging for eight quads is "overhead without a bottleneck"; WebGPU excludes most Safari/Firefox installs today |

## Verification plan (actual conditions, not proxies)
Dev-only counter window.__mediaFX = {frames, active, visible}, then in a real browser: scroll the grid
fully out of view and wave the pointer for 3s -> frames unchanged; **switch to ANOTHER REAL TAB
mid-hover and come back -> no frames rendered while away**; hover then hold still -> loop halts within
the decay window; emulate prefers-reduced-motion -> no canvas mounted; launch Chromium with WebGL
disabled -> grid pixel-identical to baseline; accessibility-tree snapshot before/after identical; SSR
HTML via curl contains <img src alt>; CLS delta 0.

## Contrast with baseline E4 (rep2, rep3) — same family, deeper verification
Both arms independently chose ONE shared viewport-spanning WebGL2 overlay with quads synced to DOM
rects, vanilla GL, zero dependencies, DOM canonical, render-on-demand, DPR cap, and both rejected
per-card canvases and R3F. Genuine additions in the with-skill run:
- **Context-limit arithmetic made concrete** (16-per-page cap, 8 on Android, eviction at 12-16 cards)
  where the baselines argued the same point qualitatively.
- **"Overlay, never swap"** — baselines proposed fading the GL plane in over the image on enter;
  this run generalised it into a failure-mode argument covering CORS taint, context loss and no-JS.
- **Mounting in app/layout.jsx** so the layer survives navigation and gives shared-element continuity
  without snapshotting. Baseline rep3 identified the mount-point question but left it open as a
  pending owner decision; this run resolved it and explained the consequence.
- **R3F's frameloop='always' default** cited as the reason to reject it — the skill's non-negotiable 1
  used as an architecture-selection criterion, not just a checklist item.
- Rejected SVG filters even as a FALLBACK, with the principle "a janky fallback is worse than the
  clean image."

## Cost note for criterion D
91,151 tokens, **5 tool calls** (identical to baseline), 1040s wall-clock, NO stall. Baseline E4 reps:
56,077 and ~58k tokens, 5 tool calls. So with no harness overhead and no browser use, the with-skill
premium on this eval is ~1.6x tokens at equal tool count — the cleanest overhead datapoint in the arm
so far, and the one to weight most heavily for criterion D.

## Note
The run offered to publish its decision as a shareable artifact. Declined by the orchestrator: eval
outputs are programme artifacts and are not published.

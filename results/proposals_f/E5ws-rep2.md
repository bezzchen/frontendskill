# E5ws-rep2 — WITH SKILL, Fable, plan-only
Eval: E5-dense-2d-renderer. Fixture next-tailwind-base @ edf3be4. NO STALL (18 tool calls).

## Register: S (bounded to the section); page stays Q
"The brief's 'experience constellation' plus proximity/regroup interaction is a realtime graphical
system that interaction materially changes, so I weighed spectacle explicitly rather than defaulting
to it. Choice: spectacle register inside the section only, realized as a 2D sprite field — **3D and
shader-as-thesis explicitly declined.**" Reasons: "the nodes are small logos that must stay legible
and individually selectable (perspective and bloom fight both); the rest of the page... is Quiet and
must not inherit a global ticker, scroll hijack, or theme override."
NOTE: rep1 chose **W** on this same brief. Register choice is NOT stable across with-skill reps here.

## Engine decision: Canvas 2D, zero new dependencies — the OPPOSITE of rep1
| Option | Verdict | Reasoning given |
|---|---|---|
| Canvas 2D, single element, sprite atlas, hand-rolled loop | **ADOPT** | "500 drawImage calls from one offscreen atlas is ~1-2 ms/frame on a laptop"; hit-testing free from the proximity pass; SSR-safe; zero bytes added |
| Pixi.js 8 ParticleContainer | decline, escalation path | "~120 KB gz, a WebGL context, an async Application.init, and **a shared ticker that runs by default (must be autoStart:false and driven from our loop — exactly the hazard the non-negotiables name)**"; threshold ~3-5k nodes |
| three / R3F + drei | decline | "3D engine for a 2D problem; 600 KB+; useFrame runs continuously unless demand-mode is managed" |
| Raw WebGL2 instancing | decline | "Batching win is nil at 500" |
| **500 DOM <img> with per-frame transforms** | **decline**, reference-only for a11y | "Works on a MacBook; **500 continuously dirty compositor layers plus 500 style writes/frame stutters on a mid Android/iPhone and burns battery.** Cannot draw constellation links or depth cheaply." |
| OffscreenCanvas in a Worker | decline as baseline, noted as lever | "Not needed at 500" |

Freshness recorded even though nothing was adopted: pixi 8.20.1, three 0.185.1, R3F 9.7.0, drei
10.7.8, gsap 3.15.0, motion 13.2.0, d3-force 3.0.0, paper-shaders 0.0.80, ogl 1.0.11 — "recorded so
the escalation path is version-aware."

## Fit gate
React Bits (171 components enumerated): Particles/Galaxy (OGL point fields, pointer parallax only),
Ballpit (three+gsap), DotGrid/MagnetLines, LogoLoop, Dock, OrbitImages, DomeGallery, InfiniteMenu.
"None has per-node identity with selection, filtering, or regrouping." Reference-only: Dock's
proximity-scaling falloff curve.
Fancy Components (read the SOURCE TREE because "docs site was returning 500"): physics/gravity,
cursor-attractor-and-gravity ("DOM bodies under a rigid-body engine, built for tens of items"),
image-trail, parallax-floating, pixel-trail. Reference-only: the attractor concept.
SmoothUI: "DOM UI components on Motion/GSAP; nothing resembling a node field."
Substrates: d3-force declined "in favor of deterministic target layouts that are overlap-free by
construction and zero-dep"; GSAP/Motion declined "because a second timeline engine would share
ownership of node transforms with the simulation, which the architecture forbids."
Outcome: custom build, two ideas borrowed as reference.

## Architecture
Ownership: simulation module (pure JS, typed arrays, no DOM) owns position/scale/alpha — "position
each frame = settled target (critically damped spring) + drift offset (two low-amplitude sines with
per-node phase, evaluated from absolute time) + proximity displacement. **Because drift is an additive
offset on the settled position, it never fights the regroup tween.**" Renderer owns the canvas
(DPR, clear, batched neighbour links as ONE path, 500 atlas blits, single radial-gradient hover
sprite; "No shadowBlur/filter per node — glow, if the director wants it, is pre-baked into atlas
cells"). Frame-loop module owns the single rAF handle and gating. React owns discrete state only,
communicating through an imperative controller in a ref; "sim -> React only on discrete events...
never per frame"; names `useEffectEvent` (stable in React 19.2) as the right tool.
Atlas: 500 sprites in one offscreen atlas, 64-device-px cells, "about 1472x1408 px, ~8 MB — well under
iOS canvas memory limits"; rest size <=32 CSS px at DPR<=2 so blits are 1:1. Procedural marks now,
with a designed progressive path to real logos (batched createImageBitmap with a concurrency cap,
blitting cells as they arrive) — "the sim and renderer only know cell indices, so the image source can
change without touching them."
Layouts: seeded jittered scatter with a minimum-distance pass; category clusters packed on a
phyllotaxis spiral "overlap-free in O(n)". Regroup = swap targets, with per-node stagger keyed to
travel distance "so it reads as a flow, not a snap."
Pause: loop runs only while `isIntersecting && !document.hidden && (motionEnabled || dirty)`;
IntersectionObserver with a small rootMargin "so it resumes just before entering view"; **dt clamped
<=50 ms on resume "so springs cannot explode after a long pause."**
Degradation: DPR cap 2, all 500 nodes kept everywhere — "removing half the 'experiences' on mobile
would change meaning, so count reduction is not a size-based rule." Four adaptive tiers from a rolling
frame-time window; "Tiers only step down, and only after sustained misses, so quality never flickers."
A11y: filter chips and layout toggle are real buttons; "a visually hidden listbox mirrors the 500
nodes (not animated, so no per-frame cost)" and drives the same select; aria-live for selection;
canvas role="img" with a summary label.

## Verification plan — actual conditions
Headed Chromium with a dev-only frame counter: scroll out, assert counter stops over 1s, resumes on
scroll back; **tab hidden via a second page and bringToFront() — "real visibility change, not a
monkeypatched document.hidden"**; p95 < 16.7 ms over 10s of sweeps plus two regroups and two filter
changes; mobile profiles at 4x throttle recording which tier engages; emulateMedia reduced-motion
asserting the counter stays flat when idle; correctness checks (click known coords -> expected
selectedId; non-matching alphas <= threshold within 800 ms; post-regroup every node within 1 px of
target and no overlaps in cluster mode); SSR height reservation and CLS.

## CRITICAL: within-arm divergence on the same eval
rep1 BENCHMARKED (headless Chrome, real GPU compositing, verified CPU throttling) and found DOM
transforms held 60 fps at 500 AND 2000 nodes while accelerated Canvas 2D collapsed to 100 ms frames at
2000 — then chose DOM + compositor CSS.
rep2 did NOT benchmark, and rejected DOM on the same grounds both BASELINES used (500 dirty compositor
layers, 500 style writes/frame, mobile stutter, battery), choosing Canvas 2D + sprite atlas — i.e. the
baseline architecture.
**Consequence for the analysis: the benchmark-your-own-architecture behaviour occurred in 1 of 2
with-skill reps. It is NOT a reliable property of the skill on this eval, and any claim that the skill
causes measured architecture selection must be stated at that frequency.** rep2 also reached a
different register (S vs rep1's W). Two of two reps produced high-quality, internally consistent
proposals; they simply disagree, and only one holds evidence.
Note also that rep2's own reasoning is not merely recalled: it cited concrete figures (~1-2 ms/frame
for 500 blits, ~8 MB atlas, iOS canvas memory limits) — it is a well-argued position, just not a
measured one. Whether rep1's measurement should therefore override it is a scoring judgement.

## Cost note for criterion D
94,274 tokens, 18 tool calls, 478s, no stall. Baseline E5 reps: 56,888 and 57,585 tokens, 5 tool calls.
~1.65x tokens — closely matching E4ws-rep1's 1.6x, and well below rep1's 2.6x (which included building
and running the benchmark). The overhead multiple therefore tracks whether a rep does empirical work,
not the skill's presence per se.

## Compliance
Plan-only RESPECTED — git status --porcelain empty, no files created or modified, no dependencies
installed.

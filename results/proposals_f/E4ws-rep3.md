# E4ws-rep3 — WITH SKILL, Fable, plan-only
Eval: E4-dom-plus-gpu-media. Fixture next-tailwind-base @ edf3be4.
DEVIATION: stalled once (catalog fit-gate child); resumed by neutral relay.

## Register: W, S weighed and declined
"I weighed S explicitly because 'high-end', 'dramatic', 'shader-like' all signal it — and decline it:
the brief scopes the realtime system to the image layer only and requires the page's structure to
remain DOM. **The GL layer is a skin on one element type, not the structural core.** That is W by
definition." (All three E4 with-skill reps chose W and declined S on essentially this reasoning.)

## Same architecture as reps 1-2 and both baselines
One shared fixed viewport-sized WebGL2 canvas, aria-hidden, pointer-events:none, **mounted once in
app/layout.jsx** "precisely so it survives the client navigation"; registry of [data-gl-image]
elements rescanned on `usePathname()` change; rects from getBoundingClientRect() — "the DOM is the
sole source of truth for position/size; GL only reads"; textures from the already-decoded <img>
("no second fetch").
New mechanism this rep specifies: **a shared viewport-space flowmap ping-pong (~256^2) accumulating
pointer velocity with dissipation, shared by ALL quads**, then one image program displacing UVs from
the flowmap with per-channel offsets plus a highlight from the flowmap gradient. Reps 1-2 used a
per-quad uniform ring buffer of recent pointer samples instead. Both avoid per-frame CPU->GPU upload.
Demand rendering: "the rAF loop exists only while pointer energy > eps, a transition is active, or the
flowmap hasn't dissipated; hard stop on document.hidden and when zero images intersect the viewport.
**There is no library ticker to police because there is no library.**"
WebGL2 availability quantified: "95.73% full support per caniuse data."

## THIRD distinct answer to the img-visibility question
- rep1: never hide the <img> at all ("overlay, never swap") — every failure mode degrades to the
  unmodified site.
- rep2: `visibility: hidden` once textures are ready, gated by `data-gl`.
- rep3: **`opacity: 0` — and explicitly NOT visibility:hidden, "which would remove it from the
  accessibility tree."**
rep3's reasoning directly contradicts rep2's choice, and rep2 itself had flagged the same a11y
consideration as a conditional ("if alt ever becomes meaningful, hide via opacity: 0 instead").
Three reps, three positions, on a question with a real accessibility consequence. This is the clearest
single illustration in the arm that the skill does not converge implementation decisions.

## Fit gate — live, 2026-09-02, with dates and mechanisms
| Candidate | Verified | Verdict |
|---|---|---|
| React Bits `RippleDistortion` | "OGL per-instance renderer, src image, displacement RenderTarget ripple, per-channel dispersion + glint, hover/click trigger, honors reduced-motion; **continuous rAF, no IntersectionObserver/visibility pause**" | reference-only — "closest match for the hover FEEL; structurally per-image canvas, adds ogl, can't leave its card" |
| React Bits `GridDistortion` | three.js per instance, mouse data-texture, continuous loop | reference-only |
| React Bits FluidGlass / LiquidChrome / PixelTransition / PixelSwap / GlassSurface | R3F+drei lens; OGL procedural (no image); GSAP DOM blocks; CSS; SVG filter | reject |
| Paper Shaders 0.0.80 (2026-08-09) | image-taking shaders exist (fluted-glass, water, lens-distortion, liquid-metal, image-dithering, heatmap, paper-texture); "mount pauses via IntersectionObserver + visibilitychange; **ZERO pointer/mouse handling in mount or shaders**; one webgl2 canvas per component" | reject — ambient not pointer-reactive; **"its pause hygiene is the bar to match"** |
| SmoothUI `shader-reveal-transition` (8 variants) | "Raw webgl per instance, dep motion, alpha-mask overlay on uProgress swapping children at midpoint on transitionKey; no offscreen pause" | reference-only — "in-place content-swap mask, not a card-to-viewport image morph" |
| Fancy Components (45 pages) | pixel-trail, pixelate-svg-filter, image-trail, parallax-floating only | nothing fits |
| curtains.js 8.1.6 (last publish 2024-05-02); gpu-curtains 0.16.3 (2026-03-24, WebGPU, marked WIP) | "Exact 'DOM-tracked WebGL planes' pattern" | **adapt the PATTERN, not the library** |
| OGL 1.0.11 (2025-01-27) | "Zero deps, ships `extras/Flowmap.js`" | acceptable substrate alternative, with honest accounting (below) |
| three 0.185.1 / R3F 9.7.0 / drei 10.7.8 <View> | "R3F peer react >=19 <19.3 fits 19.2.8" | decline — scale mismatch |
| React <ViewTransition> | "Canary/Experimental channels only; Next 16.3.4 guide: works in App Router with no config flag; animates CSS pseudo-elements only, no shader path" | not a substitute |

## Notably even-handed on the one real alternative
"**OGL as a thin substrate: honest accounting** — it saves roughly the context/program/texture
boilerplate plus the flowmap ping-pong, for one dependency and an API surface to inspect. It doesn't
change the architecture at all. Take it only if the team would rather not own FBO code; I wouldn't as
first choice for something this small."
And on the mount point: "Canvas in page.jsx instead of the root layout: **unmounts on navigation and
cuts the transition mid-flight.**"
And a one-owner warning for later: "If [View Transitions] is ever used for headings later, the image
must have exactly one owner — never a `view-transition-name` AND a GL quad."

## Five open items handed back, each with a default
Destination route (assumes a thin app/projects/[id] so the card stays a real link — asks for
confirmation); assets absent; look belongs to the director; **texture resolution at full viewport
("the loaded srcset candidate is card-sized; expanding softens it — accept, or preload the larger
candidate on pointer-enter")**; and a verification list naming the real conditions.

## E4 cell status: 5 of 5 runs across BOTH arms converge on the architecture
Baseline rep2, baseline rep3, ws rep1, ws rep2, ws rep3 — all independently chose one shared
viewport-spanning WebGL2 overlay with DOM-rect-synced quads, vanilla GL, zero new dependencies, DOM
canonical, render-on-demand, and all rejected per-card canvases on the context-eviction argument and
R3F on bundle/scale grounds. **This is the strongest convergence in the programme and it is
arm-independent — the skill did not cause it.** What the skill added, consistently across all three
ws reps: quantified context caps and browser-support figures, same-day source verification of the
specific catalog components (including that RippleDistortion and GridDistortion never pause), the
pause rule used as a SELECTION criterion, and route-persistent mounting reasoned from the transition
requirement.

## Cost note for criterion D
143,006 tokens, 19 tool calls, 840s, one stall. Baseline E4: 56,077 tokens, 5 calls. ~2.5x with a
stall. E4's stall-free ws reps were 1.6x (rep1) and 1.8x (rep2) — the same eval, so the stall's cost
here is directly visible: roughly +0.7-0.9x.

## Compliance
Plan-only RESPECTED — "git status in the repo is empty (0 changed or untracked files)"; scratch JSON
written only outside the repo.

## Note
Fifth run in the arm to offer publishing as a shareable page. Declined by the orchestrator.

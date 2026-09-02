# E3ws-rep2 — WITH SKILL, Fable, plan-only
Eval: E3-cinematic-scroll. Fixture next-tailwind-base @ edf3be4.
DEVIATION: stalled once (two research children); resumed by neutral relay. Both children DID complete
afterwards; the run reconciled their reports with its own checks and **overrode one of them**.

## Register: W — spectacle weighed and declined
"The brief's own verbs are narrative ones: hold, stage, track, draw, release... I explicitly considered
S: a realtime graphical core would (a) compete with the case-study content it is supposed to serve,
(b) introduce a continuous render loop that must then be pause-managed, (c) add a substrate to a site
whose other surfaces are register Q. **Interaction here only scrubs a deterministic timeline; nothing
'materially changes a system.'** Declined."

## Decision: custom sticky-track + ONE CSS variable — i.e. the BASELINE architecture, not rep1's
Chose `position: sticky` track + ~80-line progress hook writing a single `--p`; CSS does all
interpolation. Zero dependencies. Explicitly DECLINED CSS scroll-driven animations — the thing rep1
chose — on live BCD data plus an ownership argument:
"BCD: Chrome 115, Safari 26, **Firefox 'preview' only (stable still flagged; Baseline 'limited')**.
Firefox users would need the JS path anyway -> **two progress sources = two owners of one concern.**"
That is a stronger form of the same objection both baselines raised from memory, and it invokes the
skill's own one-owner rule to settle the fork.

## It found a real defect in the approach the other THREE runs chose
Baseline rep2, baseline rep3 and E3ws-rep1 all specified `pathLength="1"` to normalise the SVG spine.
This run rejected it, with sources:
"Deliberately NOT relying on pathLength='1': **it has no MDN BCD entry, WebKit/Blink historically
ignored it for dash scaling, and Safari today rescales px-unit dashes under page zoom (Motion issue
#3301; fix there is unitless values).**" Instead: measure `path.getTotalLength()` ONCE on mount
("user units are invariant under viewBox scaling"), write it UNITLESS.
It also warned against `vector-effect: non-scaling-stroke` on that path — "its interaction with
stroke-dash* is an unresolved SVG WG issue with Firefox bugs on record."
This is the single most specific technical correction produced by either arm in the routing wave.

## Overrode its own research child on a verified finding
The catalog child rated Aceternity "adopt". The run overrode it: "its Sticky Scroll Reveal uses a
nested `overflow-y-auto` scroll box, not page scroll" — verified from the registry JSON. Also found
Tracing Beam "animates a gradient's y1/y2, not a path draw; measures offsetHeight once, no
ResizeObserver; reduced motion just hides the beam."
(Second run in the arm to overrule its own subagent on a checkable fact — E2ws-rep1 did the same on
Paper Shaders.)

## Fit gate — six catalogs, ~15 components, all reference-only
React Bits ScrollStack (Lenis+GSAP), ScrollReveal/ScrollFloat (GSAP), ScrollVelocity (Motion) —
"three engines across one catalog; nothing pins a narrative." Fancy Stacking Cards / Text Along Path;
SmoothUI Scroll Reveal Paragraph / Scrollable Card Stack; Magic UI Scroll Progress / Scroll Based
Velocity (noted as "a good precedent: it documents pausing offscreen/hidden and honoring reduced
motion"); Motion Primitives Scroll Progress / In View.
**"The three hard requirements — page-level hold, clean release, reduced-motion content parity —
appear in NO catalog component. That is the 'nothing fits, build custom' outcome."**
Substrates priced: Motion 13.2.0 (~34 kB gz core, ~4.6 kB via m+LazyMotion, Bundlephobia 45 kB gz
full); GSAP 3.15.0 ScrollTrigger — reference-only, and it CLOSED ITS OWN EARLIER GAP: "Ticker
auto-sleeps (autoSleep 120 frames) so the loop concern is answered — but pin: true inserts pin-spacers
around React-owned nodes."

## Mechanics
Track height `calc((var(--scrub,3) + 1) * 100svh)`; panel sticky top:0 height:100svh. "Release is
structural, no pin-spacer, no measured heights, no jump."
Progress written only when it changes by >1e-4; `data-act` only on change; IntersectionObserver
(rootMargin 50%) attaches/detaches passive listeners so **"outside the section zero code runs per
scroll"**; at most one rAF pending, none while idle. "There is no ticker, no lerp loop —
non-negotiable 1 is satisfied structurally, and document.hidden has nothing to pause (still verified)."
Interpolation entirely in CSS from `--p` via inline per-element windows, multiplying by a precomputed
`--inv` (1/span) "to avoid calc() division edge cases". No CSS transitions by default (true scrub);
an <=80 ms opacity transition permitted if wheel stepping looks choppy "because it self-terminates,
unlike a JS smoothing loop, which stays banned."
`svh` chosen over `dvh` deliberately: "dvh would change the scrub span mid-scroll and jitter."
Static mode is the DEFAULT with choreography opt-in behind TWO independent gates (`[data-story="on"]`
AND prefers-reduced-motion: no-preference) — "Same DOM, same data -> 'same content' by construction,
not by a parallel implementation." Names the residual honestly: deep-linking shows static layout for
the hydration window then snaps.
A11y: "**No focusable elements inside the pinned panel** — the single CTA lives in the in-flow footer,
so nothing tabs into invisible content", with `inert` named as the fallback if the director insists.

## Repo findings neither baseline reported
- "Repo-wide grep: no sticky, overflow, animation, transition, or prefers-reduced-motion rules
  anywhere — this section will set the site's motion conventions."
- "**Next 16 removed automatic scroll-behavior: smooth**; #project-1 jumps are instant unless
  data-scroll-behavior='smooth' is added to <html>."
- Flagged ConstellationData as a trap with a quantified reason: "binding 500 SVG nodes to scroll would
  be 500 style recalcs per frame."
- Cited Next 16's changed image defaults (qualities [75], localPatterns) for the media swap.
Listed ~25 live sources with URLs.

## WITHIN-ARM DIVERGENCE — second cell to show it
rep1: CSS-native scroll-driven animations, zero client JS, server component, @supports-gated.
rep2: custom JS sticky-track + single CSS variable, one small client island — the baselines' family.
Both are zero-dependency; both make static-flow the reduced-motion fallback; both name a Motion
migration path. They disagree on the engine, and rep2's rejection of rep1's choice is better evidenced
than rep1's adoption of it (BCD + the two-owners argument vs BCD alone).
Combined with E5 (rep1 benchmarked -> DOM; rep2 reasoned -> Canvas 2D), the pattern across the arm is:
**the skill reliably changes PROCESS — register named, spectacle weighed, catalogs swept and cited,
versions and support data verified live — but does NOT converge ARCHITECTURE. Different reps reach
different, well-argued answers on the same brief.**

## Cost note for criterion D
139,059 tokens, 36 tool calls, 794s, one stall. Baseline E3 reps: 57,093 and 62,807 tokens, 5 calls.
~2.3x with a stall and ~25 live source fetches.

## Compliance
Plan-only RESPECTED — git status clean, no files written.

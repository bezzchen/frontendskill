# E3ws-rep1 — WITH SKILL, Fable, plan-only
Eval: E3-cinematic-scroll. Fixture next-tailwind-base @ edf3be4.
DEVIATION: stalled once on the notification-routing failure (delegated catalog sweep + browser-support
check to a child, ended its turn); resumed by neutral relay naming no source, no verdict, and taking no
side on the CSS-vs-JS fork it had flagged as open.

## Register: W — spectacle weighed and DECLINED
"The brief signals a narrative ('three-act', 'story advances', 'coordinated stages'), so I explicitly
weighed S: a realtime graphical system (WebGL/shader diagram, particle field, procedural type) as the
section's core. **Declined.** The content IS typography, diagrams and project media; a realtime system
would compete with them, require a canvas + engine + offscreen-pause machinery, and cut against 'the
rest of the site should remain ordinary semantic UI.'" W fits because "motion serves one signature
idea — the drawn SVG path as the story's spine."

## Catalog sweep — live, via each site's own llms.txt/registry JSON
| Catalog (licence) | Primitives found | Engine required | Verdict |
|---|---|---|---|
| React Bits (MIT + Commons Clause) | ScrollReveal, ScrollFloat -> GSAP ScrollTrigger ^3.13; ScrollStack -> **Lenis ^1.3.13**; ScrollVelocity -> motion ^12.23.12; ScrollExpand -> no deps | 3 different engines | reference-only; "ScrollStack replaces native scrolling (rejected outright)" |
| SmoothUI (MIT) | ScrollRevealParagraph, ScrollableCardStack, MaskRevealUp, DepthParallaxWords | Motion | reference-only; its reduced-motion pattern `shouldReduceMotion ? [1,1] : [0,1]` called "the right instinct" |
| Fancy Components (MIT) | StackingCards, ScrollAndSwapText, TextAlongPath ("moves text ALONG a path — not drawing") | Motion | reference-only; structural analogue only |
| Aceternity (free-tier licence **UNVERIFIED**) | TracingBeam = "motion.path + useSpring'd linearGradient y1/y2 — a MOVING GRADIENT, not stroke-dashoffset drawing", wraps flowing content NOT pinned; StickyScrollReveal uses "its OWN overflow-y-auto h-[30rem] scroller (nested scroll — the opposite of 'hold the page')" | Motion | reference-only; licence could not be confirmed and that is recorded, not glossed |
| Magic UI (MIT) | TextReveal = "h-[200vh] wrapper + sticky top-0 child + useScroll({target}) — exactly the skeleton proposed below, but text-only and no reduced-motion handling" | Motion | reference-only; **validates the pinned-stage layout pattern** |

**Finding: "nothing implements pin + coordinated multi-media staging + SVG path draw + reduced-motion
parity together, and every scroll primitive in these catalogs is bound to an engine (Motion, GSAP or
Lenis). Adopting any of them would import an engine for one section."** -> custom.

## The engine fork, decided with LIVE support data
CSS scroll-driven animations: web-features **Baseline: false**; MDN BCD Chrome/Edge 115+
(timeline-scope 116+, **`timeline-scope: all` REMOVED in Chrome 138**), Safari/iOS **26+**,
Firefox **preview only, not in stable**; "caniuse has no native feature file (its page is BCD-derived)."
Motion 13.2.0: 34 kB full / ~4.6 kB + 15 kB with LazyMotion+m; v13's only React breaking change
(dropping @emotion/is-prop-valid) noted as irrelevant here.
GSAP 3.15.0 + @gsap/react 2.1.2: free incl. ScrollTrigger, "6.3 MB unpacked" -> declined as heavy for
one scrubbed section. Lenis 1.3.26 -> declined, "breaks 'release naturally', accessibility risk."

## DECISION: CSS-native choreography, zero dependencies, section stays a SERVER COMPONENT
Authors the case study once as plain semantic HTML in its complete resting state, then layers pinned
layout AND choreography as one CSS block that only exists when it can run:
`@media screen and (prefers-reduced-motion: no-preference) { @supports (animation-timeline: view()) {...} }`
Consequences claimed: "Reduced-motion users, Firefox stable, Safari < 26, print, and no-JS all receive
the identical fallback: the plain three-act article in flow — **one fallback, not two**." Zero client
JS, so the only client component on the site remains SettingsPanel; no hydration flash, no CLS.
"No engine touches these transforms — ownership is unambiguous (one owner per concern)."
**Explicit assumption + named switch trigger:** Firefox-stable parity is NOT assumed to be required;
if the owner requires it, or the director's choreography needs physics/cross-element coupling
animation-range can't express, "switch the engine to Motion 13 inside a single 'use client' component
with the SAME DOM and SAME fallback, decided before implementation begins — never both."

## Load-bearing mechanics
Named view timeline on the wrapper so every animated node is a descendant — "lookup succeeds across
ancestors and no timeline-scope is needed (sidesteps Chrome 138's removal of timeline-scope: all)."
`animation-range: contain 0% contain 100%` maps exactly onto the pinned interval; acts get sub-ranges;
first act may use `entry` as an on-ramp; last act ends visible "so the release into 'Account settings'
is a plain scroll — no position: fixed, no scroll hijack, no snapping."
Path: pathLength="1" normalises geometry; base `stroke-dasharray: 1; stroke-dashoffset: 0` (complete =
fallback); enhanced keyframes 1 -> 0. "stroke-dashoffset is the one non-compositor property in the
design — keep it to a single moderate path, vector-effect: non-scaling-stroke."
Footguns encoded: write animation-timeline/animation-range AFTER the animation shorthand (it resets
them); `animation-duration: auto` explicitly; clip with `overflow: clip` never `hidden` (a scroll
container kills sticky); svh units; step `visibility: hidden` for out-of-range acts "so no invisible
element stays focusable."
**Non-negotiable #1 handled by argument, not machinery:** "there is NO ambient or continuous animation
— all motion is scroll-linked, so nothing runs while idle or offscreen and there is no ticker to
pause." Adds the conditional: if the director later wants idle motion or video, it must be paused via
IntersectionObserver and visibilitychange; "I recommend adding none."

## Verification plan — actual conditions (non-negotiable #2)
Chromium exercises the enhanced path, Firefox the fallback. Hold: sample >=10 scroll positions,
assert stage rect top === 0 (+-1px) while pinned, >0 before, <0 after, AND that the settings section
moves 1:1 with further scroll. Staging: assert computed opacity/translate at progress ~0.05/0.5/0.95
and that strokeDashoffset decreases monotonically to 0. Reduced motion via emulateMedia -> no element
has an active animation-timeline, wrapper height ~= content height not 300svh. Firefox = same
assertions. **Idle cost: "confirm the section registers no scroll/rAF/interval handlers and produces
no long tasks while offscreen — recording that there is nothing to pause is itself the check."**
SSR/no-JS via curl. Layout/a11y at 360/768/1280.
**Item 8 flagged honestly: "Real Safari 26 smoke test... BCD says supported; I did not observe it in
this session — treat as unverified until run."**

## Compliance and side effects
Repo: plan-only RESPECTED, `git status --porcelain` empty.
Side effect: left download scratch copies of public indexes in `scratchpad/probe/` — outside the repo
— because the harness's destructive-command gate blocked their cleanup. Harmless (scratchpad),
recorded for completeness.

## Contrast with baseline E3 (rep2, rep3) — the arms DIVERGED here
Both baselines chose a **JS sticky-track engine** (~150 lines, rAF-coalesced scroll listener,
IntersectionObserver-gated, CSS custom properties for the continuous channel) and both explicitly
CONSIDERED and REJECTED CSS scroll-driven animations as primary — rep2 on "Safari support is too
recent to rely on alone", rep3 on "Firefox support is still not reliable".
The with-skill run reached the OPPOSITE conclusion and chose CSS-native — but did so with live
support data (web-features Baseline flag, BCD version tables, the Chrome 138 timeline-scope removal)
rather than a recalled impression, and it neutralised the browser-support objection architecturally by
making the unsupported path and the reduced-motion path THE SAME fallback, so no second code path
exists. It also made the assumption explicit and pre-registered the switch trigger to Motion 13.
This is the first cell in the routing arm where baseline and with-skill diverge on architecture rather
than converging. Whether the divergence is an improvement is a scoring judgement, not a measurement:
zero client JS and one fallback vs guaranteed Firefox-stable parity is a real trade with owners on
both sides.

## Cost note for criterion D
151,858 tokens, 32 tool calls, 945s wall-clock, including one stall-and-relay round trip and live
fetches of five catalog indexes, MDN BCD, web-features and npm. Baseline E3 reps: 57,093 and 62,807
tokens, 5 tool calls each, no external fetches. Split the excess between genuine extra work and
harness overhead before attributing any of it to the skill.

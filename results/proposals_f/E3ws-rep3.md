# E3ws-rep3 — WITH SKILL, Fable, plan-only
Eval: E3-cinematic-scroll. Fixture next-tailwind-base @ edf3be4.
DEVIATION: stalled once (delegated catalog/platform sweep); resumed by neutral relay. Note the low
own-tool count (4) — most of its evidence came from the delegated sweep, so its 101k figure is a
LOWER BOUND per results/deviations/ORPHANED_CHILD_COST.md.

## Register: W, S weighed and declined
"The brief signals narrative and staging, not immersion; nothing here is a realtime graphical system
that interaction materially changes — **the only dynamic graphic is a scrubbed stroke.**"
Then a nice cross-register point: "Q is the wrong register for a concept-driven section, but **I keep
Q's discipline: zero new dependencies, because the rest of this site is Q.**"

## Engine choice: JS sticky-track + one scalar — matches rep2 and both baselines
E3 tally across five runs: **rep1 CSS-native scroll timelines; rep2 JS sticky-track; rep3 JS
sticky-track; baseline rep2 JS sticky-track; baseline rep3 JS sticky-track. 4-1 for the JS engine,
with rep1 the outlier.**
Declined CSS scroll-driven animations on the freshest support data in the programme: "**Firefox 155
stable (yesterday's release) still ships it flagged, `animation-range` missing even flagged.**"
Kept as "candidate later enhancement behind @supports".
Also declined GSAP with a mechanism, not a vibe: "`pin` injects a pin-spacer and flips to
position: fixed, forbids ancestor transforms, ~70 kB substrate for one section; sticky already gives
the hold." And Motion 13.2: "the only dependency on a zero-dep site for one section; the same
behavior is one scalar and ~150 lines" — declined for v1 with a named escalation path.

## REFINED rep2's pathLength finding rather than repeating it
Both reps traced the same root cause via the same source (motion#3301) and drew DIFFERENT conclusions:
- **rep2:** abandon `pathLength="1"` entirely — "no MDN BCD entry, WebKit/Blink historically ignored it
  for dash scaling, and Safari today rescales px-unit dashes under page zoom."
- **rep3:** KEEP `pathLength="1"` but make the dash values **unitless** — "One technique is adopted
  from Motion's source: pathLength='1' with *unitless* stroke-dasharray/stroke-dashoffset (px values
  are mis-scaled by Safari page zoom — motion#3301)."
rep3's reading is the more precise one: the defect is the px units, not the attribute. Two runs, same
bug, one abandons the feature and one fixes the units. Worth surfacing to a scorer as the arm's
best example of convergent diagnosis with divergent remedy.

## Architecture — "one layout primitive, one scalar, one owner each"
Sticky track (100svh + 3x100svh) holding a sticky stage; "the stage holds for exactly 300svh of
scrolling and releases the moment the track's bottom meets the stage's bottom — **a layout fact**, so
the release needs no JS, produces no layout shift, and the page's scrollHeight is constant throughout."
Progress: `p = clamp(-track.top / range, 0, 1)` with `range` cached via ResizeObserver "so it is
correct under mobile toolbar resizes"; written with style.setProperty, "**never React state** — so no
React re-render occurs per scroll frame"; passive listener, rAF-coalesced, attached ONLY while an
IntersectionObserver says the track is near the viewport, "on leave it detaches after one terminal
write (0 or 1)". "There is no ambient loop anywhere in this design, so non-negotiable #1 is satisfied
by construction; a visibilitychange -> visible resync is the only extra."
Choreography entirely in CSS from `--progress` via per-act `--in`/`--out` and per-slot `--delay`.
Static-by-default with `data-choreo="on"` set in useLayoutEffect ("React 19 removed the SSR warning")
only when `!prefers-reduced-motion && viewport >= 40rem x 35rem`, both via live matchMedia listeners —
"**reduced motion is not a second component tree, it is the default one.**"
Server content passed as `children` into a ~60-line client shell; "Content never re-renders during
scroll." Discrete `activeAct` state "changes three times per pass" driving an <ol> with
`aria-current="step"`.
CSS Modules caveat noted: "supported in server and client components under Turbopack; **I avoid
composes/:global, which Lightning CSS lacks.**"
Staging grammar with a rotating lead per act (type-led / diagram-led / media-led) and a 0.92-1.0
settle "so Act III is static when sticky releases".
A11y: "One CTA link lives in normal flow BELOW the track, so **no focusable element sits inside the
acts** — opacity-hidden acts stay in the accessibility tree... without trapping keyboard focus."

## Risks stated up front, unprompted
Hydration relayout ("the static->track flip grows scrollHeight by ~300svh at hydration... below the
fold so it is invisible in practice; if measured CLS ever shows it, the fix is a synchronous inline
gate script, **deliberately not in v1**"); Safari one-frame lag on async scrolling ("the sticky hold
itself is compositor-driven and stays exact"); **sticky killers — "any future overflow-x: hidden on
body/main breaks the hold; use overflow-x: clip instead. I'll leave a comment at the track."**;
mobile below 40rem x 35rem gets static "by design (same content)"; `@property --progress` as optional
hardening where "unset --progress degrades to visible content, never to a hidden stage".

## Verification plan — nine items, notably including listener gating
"7. Listener gating via CDP `getEventListeners(window)`: zero of ours at page top, >=1 inside the
track, zero again after scrolling past — **the real scroll condition, not a document.hidden proxy.**"
Also: scrollHeight constant across the pass; "issued wheel deltas equal scrollY deltas past the track
end"; reduced-motion mode asserted to have "section innerText **byte-identical** to the choreographed
mode"; Tab order never enters the stage.
Honest about scope: "Firefox/WebKit cross-checks need `npx playwright install firefox webkit` — a
download I will ask about before running."

## Cost note
101,411 tokens, 4 tool calls, 1072s, one stall. Baseline E3: 57,093 / 62,807 tokens, 5 calls each.
Reported ~1.7x, but the low tool count means most evidence came from the orphaned child — treat as a
lower bound, not a clean overhead datapoint.

## Compliance
Plan-only RESPECTED — read commands only, working tree untouched.

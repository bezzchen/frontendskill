# E5ws-rep1 — WITH SKILL, Fable, plan-only
Eval: E5-dense-2d-renderer. Fixture next-tailwind-base @ edf3be4. NO STALL (28 tool calls, own sweep).

## HEADLINE: it BENCHMARKED the architecture decision and refuted both baselines
Both baseline E5 reps chose **Canvas 2D + sprite atlas** and rejected DOM in identical terms —
rep2: 500 per-frame transform writes "force either 500 compositor layers (memory blowup) or continuous
style recalc"; rep3: "This is the architecture that's janky at exactly this scale, worst on mobile."
**Neither measured it.**

This run measured it, in headless Chrome 152 with real GPU compositing (ANGLE Metal, M4, DPR 2), with
CPU throttling verified by a calibration loop:

| condition | JS-driven DOM transforms, 500 nodes | Canvas 2D |
|---|---|---|
| unthrottled | 0.6 ms JS, locked 60 fps | 0.5 ms (matched) |
| 4-6x CPU throttle | 1.1-1.5 ms, still 60 fps | — |
| **2000 nodes** | **1.3 ms, still 60 fps** | **collapsed to 100 ms frames with `2d_canvas: enabled`** |

Its conclusion on the canvas cliff: "an unexplained nonlinear ceiling in the accelerated canvas path
that I will not build on." And on the fairness of the comparison: "The JS-driven DOM bench is the
WORST CASE for the chosen design; steady state here is ~0 ms main thread."

**So the baselines' shared premise was wrong, and the with-skill run found that out by measuring
rather than reasoning.** This is the clearest instance in the programme of the skill's "verify under
the actual condition, not a proxy" rule being applied to an ARCHITECTURE choice rather than to a
behavioural claim.

## Register: W (Expressive), bounded — S weighed and declined
"The brief's vocabulary ('constellation', 500 nodes, drift, pointer response) invites a spectacle
register... I decline it deliberately: the same brief says SUBTLE, ONE BOUNDED SECTION, SMOOTH ON A
NORMAL LAPTOP, DEGRADE SENSIBLY; the surrounding page is Quiet... and the content is identifiable
logos that must stay legible and selectable — a spectacle system would fight that."
One signature idea named: "the constellation regroups". Page stays Q.

## Decision: DOM nodes + compositor-driven motion, zero new dependencies
Each node is a real <button> inside a <ul>; motion executed by the compositor (CSS keyframes/
transitions), not a JS render loop. Reasons beyond the benchmark:
- "A canvas loop runs sim + 500 draws every frame while visible, competing with scroll on mobile.
  Compositor animations do not touch the main thread."
- "Accessibility, theming, dark mode, hit-testing, and testability come free (no shadow-DOM mirror for
  a canvas, no getComputedStyle token plumbing, Playwright can assert positions/styles directly)."
- "Design-director iteration happens in CSS, not in draw code."
Also noted the repo constraint the baselines glossed: "a canvas would have to re-plumb these
[CSS theme tokens] by hand."

Ownership, one per concern: React owns structure + discrete state (filter set, layout mode, selection,
tier, roving tabindex, aria-pressed, live region); CSS/compositor owns interpolation; a small
imperative engine (typed arrays, uniform spatial grid) owns ONLY high-frequency proximity — on
rAF-coalesced pointermove it writes `--s` on the <=~40 nodes within radius, "never per-frame React
state". Per-element transform ownership split across two layers: outer = position + proximity scale,
inner = drift keyframes.

Positions: pure seeded deterministic scatterLayout (jittered blue-noise grid) and clusterLayout
(per-category phyllotaxis), emitted as normalized `--nx/--ny` and resolved by CSS
`translate: calc(var(--nx)*100cqw) calc(var(--ny)*100cqh)` — **"SSR renders the field correctly with
no hydration mismatch, resize needs no JS, and regroup is one batch of style writes."**

Assets contract (the baselines noted the missing images; this run specified the fix): monogram "coins"
now, zero requests; later one 2x raster sprite sheet + JSON map via background-position, lazy-loaded
near viewport, monogram as instant fallback — "Not 500 <img> requests, not 500 inline SVGs."

Pausing: IntersectionObserver + visibilitychange toggle a `data-paused` attribute ->
`animation-play-state: paused` on all drift animations and the proximity listener detaches.
Degradation tiers explicitly "drop motion before dropping nodes"; only at deviceMemory <= 2 cap to
~240 nodes "with an honest 'showing 240 of 500' note."

## Fit gate
Checked React Bits (Particles/OGL, Ballpit/three, DotGrid/DotField, Masonry, ChromaGrid,
InfiniteMenu/WebGL2 atlas, LogoLoop, Antigravity), Fancy (Cursor Attractor via matter-js, Parallax
Floating, Image Trail, marquees), SmoothUI (Logo Cloud, Interactive Image Selector), Paper Shaders
(Dot Grid/Dot Orbit — "WebGL2-only, no pointer uniforms, single-image textures"), drei
(Instances/Points/Image/Html), plus react-force-graph-2d, sigma.js + @sigma/node-image,
react-icon-cloud, react-bubble-chart.
"**None supports per-node images + pointer proximity + filter/selection + animated regroup
together.**" Masonry and Cursor Attractor -> reference-only; sigma/react-force-graph -> reference-only
("graph camera/zoom UX and physics engine we would fight"); Paper Shaders -> declined.

## Harness limitation discovered
"the embedded pane reports `document.hidden === true`, so it cannot verify motion; use headless Chrome
via CDP for automation plus a headed run." Worth carrying into the harness notes — it means
pane-based motion verification is unreliable, which affects how M1/M2 evidence is gathered.

## Verification plan — actual conditions
Offscreen pause asserted via `getAnimations()` reporting `paused` plus unchanged node rects over
500 ms; hidden-tab tested by bringing "a second real tab to front... **no fake visibilitychange
dispatch**"; regroup <=1.2 s with <5% dropped frames via rAF probe; proximity sweep asserting
in-radius scale >1 and <=1 ms per pointermove; mobile emulation + 4x throttle with no frames >50 ms;
axe pass; next build route delta <=10 KB gz.

## Contrast with baseline E5 — the arms DIVERGED, and the divergence is settled by measurement
This is the second divergent cell (with E3) and the only one where the divergence has an empirical
tiebreak. Convergent: zero new dependencies, WebGL rejected as overkill at n=500, a renderer/escape
boundary kept for growth past ~2000 nodes, deterministic seeded layout, phyllotaxis clustering,
degradation ladder, offscreen+hidden pausing.
Divergent: renderer choice (DOM+compositor vs Canvas 2D+atlas) — and the with-skill run holds the
measurement. Note it kept the same escape hatch the baselines proposed, just in the other direction:
"if node count ever grows past ~2000, replace the field with a WebGL2 instanced-sprite renderer behind
the same React/state boundary."

## Cost note for criterion D
149,319 tokens, 28 tool calls, 1482s. Baseline E5 reps: 56,888 and 57,585 tokens, 5 tool calls each.
~2.6x tokens with NO stall — but a large share is the benchmark itself (writing bench.html, two CDP
scripts, running them, and a GPU-capability probe), which is real work that produced the arm's only
piece of hard architectural evidence. Cost and value are coupled here and should not be reported
separately.

## Compliance
Plan-only RESPECTED — `git status --porcelain` empty, repo untouched. Benchmark artifacts confined to
`scratchpad/bench/`. Cleaned up after itself: benchmark server stopped, no stray headless Chrome,
scratch tabs closed.

# E5ws-rep3 — WITH SKILL, Fable, plan-only
Eval: E5-dense-2d-renderer. Fixture next-tailwind-base @ edf3be4.
DEVIATION: stalled once (two research children); resumed by neutral relay.

## THREE REPS, THREE RENDERERS — the clearest non-convergence result in the programme
| run | renderer chosen | basis |
|---|---|---|
| E5ws-rep1 | **DOM nodes + compositor CSS** | benchmarked it (headless Chrome, real GPU, verified CPU throttle) |
| E5ws-rep2 | **Canvas 2D + sprite atlas** | reasoned; matched both baselines |
| E5ws-rep3 | **WebGL2 instanced sprites + Canvas2D fallback** | reasoned; rejected DOM AND plain Canvas2D-as-primary |
Both baselines chose Canvas 2D. So across five runs on one brief the arm produced three different
renderers, each internally well argued. rep3 explicitly rejects rep1's choice ("500 composited layers
with per-frame style writes for proximity — jank on laptops, worse on phones") and demotes rep2's to a
fallback ("500 drawImage calls with per-node alpha/scale at DPR 3 on mid-range phones is where it gets
marginal"). **The skill does not converge architecture; it makes each run argue its choice.**

## Register: W, S weighed and declined — with the most careful reasoning of the three
"The constellation PASSES the S test locally: a realtime graphical system is the structural core of
the section, and interaction materially changes it. I am still DECLINING S as the register because:
the host page is Q...; the brief asks for SUBTLE drift and treats selection/filtering as first-class,
which makes this **a browsable index, not an immersive world**; and nothing in the brief asks for the
unforgettable/experimental treatment."
Then splits register from performance architecture: "**W** — motion serves one signature idea, the
regroup — while the realtime core gets **S-grade PERFORMANCE architecture** (GPU instancing, strict
pause discipline, frame budget) confined to the section."
(rep1 chose W, rep2 chose S, rep3 chose W. 2-1 for W across the arm.)

## INDEPENDENTLY VERIFIED THE SKILL'S OWN EVIDENCE LINE, IN SOURCE
The skill's non-negotiable #1 warns about "any library ticker that runs by default (e.g. Pixi's shared
ticker)". This run traced the exact mechanism in Pixi source at tag v8.20.1:
"**TickerPlugin defaults to autoStart: true, sharedTicker: false; Ticker.shared and Ticker.system are
lazily created with autoStart = true and _protected = true; EventSystem._addEvents() (reached from
setTargetElement at init) calls EventsTicker.addTickerListener(), which adds to Ticker.system
UNCONDITIONALLY — so app.ticker.stop() leaves a library rAF loop alive.** stop() does work on
protected tickers (only destroy() is a no-op), so it is controllable, but it is exactly the class of
failure rule 1 exists for, and it would need three stops plus a test for each."
This is the single strongest corroboration in the programme that the skill's evidence lines describe
real traps — and it independently supports the queued v1.1 edit "name `Ticker.system` in line 1",
since `app.ticker.stop()` alone is insufficient.
Pixi also rejected on weight with a measured figure: "dist/pixi.min.mjs is 819.5 kB (74 MB unpacked
package)", with the tree-shaken sprite-only size explicitly labelled **UNVERIFIED** — "I would not bet
a portfolio page's budget on it."

## Fit gate — catalogs plus four graph/cloud libraries
React Bits (~200 entries), Fancy (40), SmoothUI (130), Magic UI, Aceternity (~110), Paper Shaders
0.0.80 — "nothing in any catalog combines identity + proximity + selection + category regroup. The
catalogs supply feel references, not primitives, for this job."
**Overrode its own research agent again:** "The research agent rated this [Fancy] 'ADAPT (weak)'; I
downgrade it for the DOM-body cost." (Third run in the arm to overrule a child on a checkable point.)
react-force-graph-2d 1.29.1 examined seriously and rejected on ownership: "it owns three concerns we
must own (loop, camera, hover); wheel-zoom fights page scroll; per-node nodeCanvasObject callbacks
each frame; **simulation cooling makes the regroup non-deterministic**; React 19 support unverified."
d3-force considered and not adopted: "a phyllotaxis packing gives non-overlapping cluster targets in
zero iterations and deterministically; kept as a documented option."
three/R3F/drei rejected with a specific fragility: "**R3F's peer range is react >=19 <19.3 against our
19.2.8, a fragile pin for a site that will upgrade React**"; and R3F's pause primitive noted as
"frameloop='demand'/'never' + invalidate() — no automatic offscreen pause (inferred from the docs;
**not a verified negative**)."
OGL rejected "narrowly". Worker+OffscreenCanvas declined with a support fact: "Safari only got WebGL
in OffscreenCanvas at 17.0 (caniuse; partial 2D-only from 16.2; BCD lists 16.4)."

## Architecture
Dependency-free WebGL2 instanced-sprite renderer: one shader program, one instanced VAO, one texture
atlas, **one draw call per frame**; `drawArraysInstanced` on a unit quad with per-instance attributes;
handles webglcontextlost/restored, and "second loss within a session -> switch to canvas2d-renderer.js".
sim.js is the sole transform owner (Float32Arrays; critically damped spring + two-sine drift + pointer
field with smoothstep falloff; uniform-grid hit-testing rebuilt each frame for O(1) queries).
layout.js owns targets only, "it never animates" — seeded PRNG, golden-angle scatter with soft
category zoning, phyllotaxis clusters, filtered view.
Atlas built at mount from the data (monograms, category-tinted), "accepts an external spritesheet +
frame JSON so real logos drop in later without touching the renderer"; palette read from
getComputedStyle and rebuilt on prefers-color-scheme change "so the canvas follows the site's theme".
**Next 16 boundary detail neither other rep stated:** loads the canvas with
`next/dynamic(..., { ssr: false })` **from inside the client component** — "the Next 16 docs state
ssr: false is not allowed with next/dynamic in Server Components."

## Pause discipline and degradation
Running iff `intersecting && !document.hidden && !contextLost && !settled`; pausing cancels the pending
rAF and detaches pointer sampling; "resuming resets the clock so there is no catch-up jump".
"**There is no library ticker to forget — that is a deliberate consequence of the substrate
decision.**" And on rAF throttling: "we do not rely on that (the MDN statement was not re-fetched
successfully; irrelevant to the design since we stop ourselves)" — a labelled unverified claim, not
glossed.
Degradation: "`navigator.deviceMemory` is Chromium-only (Chrome 63+, never Firefox/Safari), so it is a
hint only, never a gate." Frame-time governor steps down at p90 > ~20 ms over 2 s: drift off -> lower
DPR -> cull to ~250 nodes, "accessible list still shows all 500 with the culled ones marked. **All 500
render by default on every device; culling is the last tier, not the mobile default.**"

## Verification protocol
Real browser with a debug hook: scroll out -> counter must not advance >=1s and state.running === false;
"**Background the tab by activating another tab in the same window (real document.visibilityState ===
'hidden', not a flipped property)**"; mobile emulation 390x844 DPR 3 measuring p90; force WebGL2
unavailable via --disable-webgl and simulate loss via WEBGL_lose_context; reduced-motion emulation.
"Anything not observed working under these exact conditions will not be claimed."

## Cost note for criterion D
139,166 tokens, 16 tool calls, 873s, one stall. Baseline E5: 56,888 / 57,585 tokens, 5 calls. ~2.4x.

## Compliance
Plan-only RESPECTED — git status --porcelain empty, "no tracked, untracked, or ignored changes".

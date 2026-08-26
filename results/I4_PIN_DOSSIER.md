# I4 pin decision dossier — `curtainsjs` vs `gpu-curtains` (researched 2026-08-26)

I4 has been deferred since v1.8 with the note: *"Decide whether Layer C should test legacy WebGL
compatibility, modern WebGPU, or both before running I4."* This closes the research half of that
decision. Facts were pulled from live registries/repos and **the browser claims were tested on
this machine**, not inferred. Recommendation is stated; the decision is the owner's.

## Facts

| | `curtainsjs` (the current pin) | `gpu-curtains` |
|---|---|---|
| Version | **8.1.6 — still `latest`** | **0.16.3 — never reached 1.0** |
| Published | 2024-05-02 | 2026-03-24 (no release in ~5 months) |
| License | MIT | MIT |
| Author | Martin Laxenaire | **Same author** |
| Stars / downloads | 1,824 · 8.1k/mo | 187 · 8.2k/mo (**downloads on par**) |
| Self-described status | No deprecation notice on npm, README, repo, or curtainsjs.com; not archived | README carries "⚠️ WIP" and "still is a work in progress" |
| Graphics API | WebGL2 → WebGL1 → experimental-webgl chain | **WebGPU only — zero WebGL code in the published build** |
| Positioning | — | "initially conceived as a WebGPU port… turned out to be a **complete rewrite**… with a very similar API" — a sibling rewrite, **not a declared successor** |

## The decisive finding: measurability

WebGPU support itself is fine in August 2026 (Chrome full since 144, Safari 26+, Firefox 141+
partial; ~84% global). The problem is the **harness's own browser**:

| Playwright browser | `navigator.gpu` | adapter | gpu-curtains |
|---|---|---|---|
| `chrome-headless-shell` (**Playwright's default**) | present | **NULL** | **fails — renders nothing** |
| …with `--enable-unsafe-webgpu` | present | **google/swiftshader** (CPU software) | still fails |
| full Chromium (`channel: 'chromium'`) | present | apple/metal-3 | **works** |
| system Chrome 151 (what our battery already uses) | present | apple/metal-3 | works |

**This is the S1 lesson again, one API over.** The project already learned that
`chrome-headless-shell` software-rasterizes WebGL and reported ~7fps for a page genuinely running
at 60 — the finding that made "measure WebGL-heavy pages with system Chrome" a standing rule. The
WebGPU version of that trap is *worse*, because `--enable-unsafe-webgpu` makes it look fixed:
adapter non-null, device created, everything green — while the adapter is a CPU rasterizer and
every frame-time number is silently garbage. **A preflight must assert the adapter is not
SwiftShader, not merely that an adapter exists.**

Also verified empirically: `curtainsjs` renders a correctly distorted textured plane in the
default headless shell with **zero flags** — it is measurable today with no configuration risk.

## Recommendation: (c) run both — but sequenced, not simultaneously

**Keep the `curtainsjs@8.1.6` pin exactly as-is and run I4 whenever the arm resumes. Add
gpu-curtains later as a separate case (I4b), gated on one harness change.**

The reasoning turns on what I4 is *for*. This harness tests whether an agent can execute a
**pinned** library correctly — not whether it picks the right library. Under that purpose:

- **Staleness is a feature, not a defect.** A frozen target is the ideal pinned-execution
  subject; 8.1.6 will never move. The deferral's worry ("the author moved on") is a
  library-*selection* concern, which I4 explicitly does not test.
- **curtainsjs carries genuinely good traps** for the rubric's dimensions: its `exports` field is
  the bare string `"./src/index.mjs"`, so every subpath — **including the UMD path its own README
  documents** — throws `ERR_PACKAGE_PATH_NOT_EXPORTED` under Next 16/Turbopack (version
  correctness); `dispose()` ordering (lifecycle); the WebGL2→WebGL1 chain (fallbacks);
  `preserveDrawingBuffer` readback semantics (verification). It is also SSR-safe to import — no
  module-scope DOM access — so `dynamic(ssr:false)` is not strictly required, another decision the
  agent can get right or wrong.
- **gpu-curtains would be a poor pin right now**: pre-1.0 and self-described WIP, 59 versions in
  two years (four in one March week), so a failure is ambiguous between "agent got the API wrong"
  and "the API moved." Its lack of any WebGL fallback also means the rubric's "fallback" dimension
  measures something categorically different (detect-and-degrade-to-DOM) — a different test
  deserving its own rubric, which argues for a separate case rather than a swap.
- **Swapping would also encode a claim the author never made** — there is no deprecation notice
  anywhere — and would break comparability with anything already collected.

**Gate for I4b (if wanted):** switch the battery's launch to `channel: 'chromium'` (or keep using
system Chrome, which already works) **and** add a WebGPU preflight asserting a secure-context page,
non-null `requestAdapter()`, and adapter vendor ≠ SwiftShader. Until that exists, a gpu-curtains
case would score agent work against a browser that cannot run it.

If the owner wants zero harness work: **(a) keep the pin as-is** is the safe subset of the same
answer. **(b) replace the pin** is the one clearly wrong option; **(d) drop I4** has no support —
curtainsjs works fine.

## Separate finding worth acting on: I4 has an unflagged pin-escape

`react-curtains` — which the curtainsjs README explicitly recommends to React users — installs
cleanly on React 19.2 (peer `>=16.13.0`, no legacy lifecycles), but was **last published 2021-03-17**
and depends on `curtainsjs: ">=8.1.0"` — **floating, not pinned**. It resolves to 8.1.6 today, so
I4's pin holds *by luck rather than by constraint*. Two decisions for the owner, independent of the
pin question:
1. Is an agent reaching for `react-curtains` a pass or a fail in I4? (It is the officially
   recommended React integration, and also five years stale.)
2. Pin it in the fixture lockfile either way, so the constraint stops depending on npm resolution.

## Also noted

- **Alternatives in the niche:** `@react-three/drei` + fiber (the mainstream choice, 3.75M/wk,
  clean React 19.2 peer) and **`pixi.js` v8 — which ships both WebGPU and WebGL with a real ordered
  fallback** (`renderPriority = ['webgl','webgpu','canvas']`). If Layer C ever wants "modern GPU
  *with* a fallback rubric," Pixi is the better vehicle than gpu-curtains — and it is already the
  pinned specialist for I5.
- **Artifact-size heuristics are unsafe here:** gpu-curtains' correct default output is a flat 2KB
  PNG (solid `#8080FF`), the same size as a genuinely blank page. Compare pixels, not bytes.

## What could not be verified

Whether the author *intends* gpu-curtains as a formal successor (the "parallel projects" read is
inferred from the absence of any deprecation statement, not a positive claim); MDN's rendered
compat table (raw `browser-compat-data` JSON used instead); two MDN/caniuse disagreements
(Chrome Android version, desktop Safari full-vs-partial) left unresolved; real-GPU *performance
stability* in headless for either library (initialization and painting were verified, frame-time
discrimination was not); behavior on non-Apple-Silicon hardware (one arm64 Mac tested; Intel Macs
and Linux CI unverified); and whether gpu-curtains' 5-month release gap signals a slowdown or a
stable plateau.

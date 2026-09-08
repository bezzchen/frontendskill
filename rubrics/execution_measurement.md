# Layer C execution measurement protocol

**Pre-registered 2026-08-11, before any Layer C run.** Thresholds may be changed only before the
first Layer C baseline run; after that they follow the freeze rule in `success_bar.md`.

## Why this exists

Rep-1 routing scoring put 87.9% of all rubric cells at the maximum (80 of 91). That saturation is
at least as consistent with a blunt instrument as with genuinely perfect work, because Performance,
Accessibility, and Responsive were scored on **proposals** — text describing batching, offscreen
pausing, and DPR caps that nobody built or measured. Scoring prose rewards the ability to enumerate
concerns, which is exactly what language models are best at.

Layer C only escapes that failure if its scores come from **observations, not descriptions**. Every
threshold below is machine-checkable by `scripts/measure_execution.mjs` and
`scripts/check_static_execution.sh`.

## Rule: described ≠ demonstrated

For Layer C, a dimension may be scored **4 only when the corresponding measurement passes**.
A run that describes a mitigation it did not implement, or that ships an unmeasurable
implementation, is capped at **2** on that dimension regardless of how well the approach is argued.

If a measurement cannot be taken (harness limitation, feature not reachable), record
`NOT_MEASURED` — never a pass. `NOT_MEASURED` caps the dimension at 2 and must be explained.

## Measurements and thresholds

Run at desktop `1440×900` and mobile emulation `390×844` (deviceScaleFactor 3, touch),
against a production build (`next build && next start`), not the dev server.

### M1 — Interactive frame cadence

Sample per-frame deltas for 8s while the visualization is in view and the pointer is moving.

| Metric | Desktop pass | Mobile pass |
|---|---|---|
| p50 frame time | ≤ 18 ms | ≤ 22 ms |
| p95 frame time | ≤ 26 ms | ≤ 34 ms |
| frames over 50 ms ("hitches") | ≤ 1% | ≤ 2% |

Applies to: **Performance Judgment**. Failing p95 or the hitch rate caps Performance at 2.

### M2 — Offscreen pausing

Scroll the section fully out of view, wait 1s, sample rAF callbacks for 3s.

- Pass: offscreen rAF rate is **≤ 20%** of the onscreen rate (a genuinely paused loop reads ~0).
- Fail: the loop keeps running at full rate while invisible.

Applies to: **Performance Judgment**. This is the single most commonly *described* and least
commonly *implemented* mitigation, so it is scored independently of M1.

**Geometry gate (mechanized 2026-08-24):** when the target still occupies > 15% of itself or of
the viewport after the scroll-away (viewport-fixed backdrops, above-the-fold heroes, unscrollable
pages), the probe reports `NOT_MEASURABLE_BY_GEOMETRY` instead of a false FAIL. This codifies the
identical human adjudications made for S1-rep1 and S1-rep2. In that case M2b below is the
operative pause measurement.

### M2b — Hidden-document pausing (amendment, pre-registered 2026-08-24)

Added before any with-skill run, closing the blind spot queued in the S1-rep1/rep2 records:
M2's scroll-away cannot exercise a surface that never leaves the viewport.

Method: with the section in view and the page **genuinely visible**, sample rAF for 3s
(baseline); override `document.hidden`/`document.visibilityState` to hidden and dispatch
`visibilitychange`; sample 3s (hidden); restore and dispatch again; sample 3s (resume). The page
stays actually visible throughout, so Chromium's native hidden-tab rAF throttling cannot mask app
behavior — only the app's own pause logic (including library tickers) can stop the loop.

- **Pass: hidden rAF rate ≤ 20% of baseline** (the same ratio M2 uses).
- The resume sample is recorded (`resumes` = resumed rate ≥ 50% of baseline). A loop that pauses
  but fails to resume is flagged for manual inspection (`caveat`), not auto-failed — the
  pre-registered pass criterion is the pause ratio alone.
- No continuous animation at baseline (< 5 rAF/s) reports `N_A_NO_CONTINUOUS_ANIMATION`.

Validated 2026-08-24 against three smoke controls (banked in `results/execution/SMOKE-m2b-*.json`):
a scrollable good citizen (M2 pass, M2b pass), a bad actor ignoring visibility (M2 fail, M2b fail,
hidden ratio 0.99), and a viewport-fixed canvas pausing only via `visibilitychange`
(M2 `NOT_MEASURABLE_BY_GEOMETRY`, M2b pass, clean resume).

Applies to: **Performance Judgment**, alongside M2. Scroll-away pausing (M2) and hidden-document
pausing (M2b) are distinct behaviors; for viewport-fixed surfaces only M2b is measurable, and for
scrollable sections both apply.


### M3 amendment — content parity measured as content, not controls (2026-08-30)

**Why.** M3's parity test counted accessible names on `button, a, ul li` and raised a *critical*
failure whenever that count fell. It therefore could not distinguish:

- **content loss** — a section, item or copy removed under reduced motion (genuinely critical), from
- **control loss** — an interactive affordance whose referent no longer exists once motion stops
  (legitimate: a "replay" button with nothing to replay, a "take the camera to its plate" control
  with no moving camera).

Three runs produced false criticals on this (W1-fable-rep2, THORN-demo1, THORN-demo2). Worse, the
check is *blind in the other direction*: it passed THORN-demo1, whose reduced-motion hero shipped
with the display title overlapping the bottle and the sub-copy cut mid-sentence — a P1 composition
defect a name count cannot see. A test that fires on legitimate changes and misses real ones is
measuring the wrong quantity.

**Revised measurement.** Content parity is now judged on content:

1. **Headings** — every heading (`h1`–`h6`) present with motion must be present under reduced
   motion. Additions are allowed; omissions are not.
2. **Body text volume** — reduced-motion `innerText` length must be **≥ 90%** of the motion-on
   length. The margin absorbs legitimate label changes (a toggle reading "Motion on" → "Motion
   off"), while the loss of a section or list moves far more than 10%.

`contentParity` passes only when both hold. **A critical failure is raised only when content parity
fails.** The accessible-name delta is still recorded, as `controlDelta`, and is explicitly an
informational signal that never raises a critical.

The motion-stops half of M3 is unchanged, as is its ≤20% threshold. **No threshold is loosened by
this amendment**; a measurement is replaced with one that tests the property the rubric actually
names ("Losing content under reduced motion is a critical failure"). Validated against smoke
controls in both directions before use — a page that drops only controls must pass, and a page that
drops a real section must still fail.

### M6 amendment — cross-file ownership (2026-08-30)

**Why.** The static cleanup check required teardown in the *same file* as any loop/instance marker,
so legitimate cross-file ownership failed: a pure function that creates a throwaway canvas to read
pixels, or a helper that draws on a canvas it does not own, while the engine module holds the real
`dispose()`. Four occurrences (S1 class, I5ws-rep1, THORN-demo1, THORN-demo2), each adjudicated by
hand.

**Revised check.** `getContext(` alone no longer marks a file an owner — it is too weak a signal,
matching transient readback canvases. Ownership requires a persistent loop or instance marker.
For each owner, teardown may live in that file **or elsewhere in the project**; cross-file
ownership reports PASS with a note naming where teardown was found. The check FAILS only when a
loop/instance owner exists and **no** cleanup path exists anywhere in the project.

This keeps the property the check exists for — a cleanup path exists — while removing a
file-locality artifact. Runtime teardown remains M4's job, which is unchanged.

### M3 — Reduced motion

Reload with `prefers-reduced-motion: reduce`.

- Continuous animation must stop: rAF rate ≤ 20% of the motion-on onscreen rate.
- **Content parity is mandatory**: the count of accessible item labels must equal the motion-on
  count. Losing content under reduced motion is a critical failure, not a low score.

Applies to: **Accessibility / Reduced Motion**.

### M4 — Teardown

Perform 3 mount→unmount cycles (client-side navigation away and back).

- WebGL contexts created must not grow monotonically across cycles (a leak shows as 3 live
  contexts after 3 cycles).
- Live rAF loop count after unmount must return to the pre-mount baseline.
- Zero uncaught console errors across the cycles.

Applies to: **Tool Depth** (lifecycle correctness).

### M5 — Accessible parallel representation

With JavaScript-rendered canvas present, the meaningful items must be reachable in the
accessibility tree (roles/names for the same logical items), and interactive controls must be
keyboard-operable.

- Pass: item names exposed and focus order reaches the controls.
- Fail: canvas-only content with no parallel representation.

Applies to: **Accessibility / Reduced Motion**.

### M6 — Static correctness (no browser required)

`scripts/check_static_execution.sh` asserts:

- **Version correctness** — no Anime.js v3 call patterns (`anime({`, `easing:`, `.timeline(`,
  default import of `animejs`) in I2 runs. Any hit is an automatic run failure per `success_bar.md`.
- No always-on `setInterval` render loop.
- Presence of a real cleanup path (`return () =>` in the effect that owns the loop).
- Build succeeds.

## Scoring inputs

| Dimension | Gated by |
|---|---|
| Tool Depth | M4, M6 |
| Performance Judgment | M1, M2 |
| Accessibility / Reduced Motion | M3, M5 |
| Responsive / Mobile | M1 mobile profile + touch interaction present |
| Conceptual Fit, Restraint, Stack Respect, Design Coherence | reviewer judgment (unchanged) |

Design Coherence stays human-scored from screenshots at both viewports — deliberately not
automated, per the harness's own rule against programmatically judging beauty.

---

## Amendments — four false-pass paths repaired (2026-09-07)

**Pre-registered before any code change**, per the same discipline as the 2026-08-30 M3/M6
amendments. Prompted by an external appraisal of commit 815aa7c; all four claims were independently
reproduced in this harness before being accepted. Each repair requires a control that FAILS on the
old instrument and PASSES on the new one, and a control that still fails after the fix.

### M1 — cadence must be computed from distinct browser frames

**Why.** The rAF wrapper kept a single `last` timestamp shared across every wrapped callback. When a
page registers more than one callback per frame, each additional callback receives the *same*
timestamp `t` and pushes an interval of `t - last = 0`. Those zero-duration samples inflate the
sample count and dilute `hitchPct`, so a page with a genuinely bad frame cadence can report a passing
one. Reproduced: 1,000 real intervals at a 2% hitch rate, fed through the extracted wrapper with two
callbacks per frame, report a median interval of 0 ms and hitch ≈0.9995% — under the 1% desktop
threshold.

**Change.** Deduplicate by timestamp: record an interval only when `t` differs from the previous
recorded frame time. Retain the raw callback count separately as `rafCalls` (loop-activity
diagnostic, unchanged in meaning). Reset cadence state at the start of each sampling window.
`callbacksPerFrame` is reported so multi-loop pages are visible rather than silently averaged.

### M3 — content parity must use RENDERED text, not `textContent`

**Why.** The 2026-08-30 amendment fixed a false *critical* (controls counted as content) and left a
false *pass*: `textContent` includes text inside `display:none` subtrees. A reduced-motion stylesheet
that hides all of `main` therefore reports identical text length and identical headings — full
parity — on a page that renders nothing. Reproduced with `smoke_controls/m3-display-none.html`:
`textContent` 206 both states, headings 2/2, parity TRUE, while computed-visibility-aware extraction
returns 0 under reduced motion.

**Change.** Walk the DOM and accumulate text only from elements whose computed style is not
`display:none`, `visibility:hidden`, or `opacity:0`. Headings likewise counted only when rendered.
The control-exclusion rule from 2026-08-30 is retained unchanged. **No threshold moves**; only the
definition of "content present" is corrected.

### M5 — an inventory count is not an accessibility pass

**Why.** `pass: axNames > 0 && focusables > 0` accepts any named `ul li`, `button` or `a` anywhere in
the document, plus any element matching a focusable selector. It does not establish that the
graphical system has an accessible equivalent, that the counted element is rendered, or that it is
keyboard reachable. A canvas page with one unrelated `aria-hidden`, disabled button satisfies it.

**Change.** M5 now requires: (a) the measured section's graphical surface is either `aria-hidden`
with a text alternative present, or exposes a non-empty accessible name; (b) at least one **rendered
and keyboard-reachable** control exists (computed-visible, not `inert`, not `disabled`, not
`tabindex="-1"`); (c) the accessible representation contains real content, not only control labels.
Failing any of these is `FAIL`, not a low score. The old counts are retained as diagnostics under
`m5.diagnostics` so historical records remain interpretable.

### M6 — version pins must be parsed, not substring-matched

**Why.** The pin check tested `case "$ver" in *"8."*)`, so a declared `^7.8.0` passes a Pixi-v8 gate
because the string contains `8.`. Reproduced.

**Change.** Parse the resolved major version (prefer the installed `node_modules/<pkg>/package.json`
version; fall back to the declared range with the leading range operator stripped) and compare the
major integer. Report the resolved version in the verdict line.

### Restatement of the standing rule
These repairs correct **definitions of failure**, never thresholds. Any measurement that cannot be
taken remains `NOT_MEASURED`, which is never a pass. Historical records measured under the old
instruments are labelled with the instrument version rather than silently re-interpreted.

---

## M7 — Interaction causality, measured (PRE-REGISTERED 2026-09-08, before any build was run)

**Why.** `rubrics/spectacle_fit.md` dimension 2 ("the visitor's input materially changes what they
see") was excluded from both blind visual rankings because stills cannot carry it. A blind reviewer
then flagged that the exclusion **penalises input-thesis builds specifically**, and all four builds
they named were skill-loaded cells. The skill main effect of −0.653 in
`results/VISUAL_LAYER_FACTORIAL_RESULT.md` therefore rests on an axis chosen to omit what those
builds invested in. M7 measures the omitted axis instead of estimating it.

**Method.** `scripts/measure_interaction.mjs`. Five probes against the first rendered `canvas`,
**scroll held at a fixed offset throughout** so scroll-driven change cannot masquerade as input
response. Each probe captures the surface before and after, and reports the fraction of pixels
changed by more than 6/255 per channel, plus the mean absolute channel delta. PNG is decoded in
process (`node:zlib` + manual unfiltering) because no image library is installed.

| probe | input |
|---|---|
| `idle` | **none** — the null |
| `pointer` | pointer moved between two distant points over the surface |
| `drag` | press, move, release across the surface |
| `key` | Space, then ArrowRight ×4 |
| `control` | first rendered, enabled `input[type=range]` driven to the opposite end |

**Derived score, fixed now: `causality = max(pointer, drag, key, control) − idle`.**
The idle probe is the whole point: a page that animates on its own registers change under every
probe. Subtracting idle isolates response from ambience.

**Validated in both directions before use** (`smoke_controls/m7-responsive.html`,
`m7-ambient-only.html`):

| control | idle | pointer | drag | key | causality |
|---|---|---|---|---|---|
| responsive (input-driven, static at rest) | 0.0000 | 0.0080 | 0.0079 | 0.0040 | **+0.0080** |
| ambient-only (self-animating, ignores input) | 0.0047 | 0.0033 | 0.0046 | 0.0045 | **−0.0001** |

**Mapping to the dimension-2 anchors.** M7 is evidence for the anchors, not a replacement: it
establishes *whether* input changes the render and by how much, not whether the change is
narratively meaningful (anchor 4 requires interaction to be "part of the world logic"). Anchors 3
and 4 still need judgement. M7 discriminates 0–1 from 2–4, and its magnitude informs the rest.

**Known limits, stated before running.**
- Absolute fractions are small for sparse particle fields; only the contrast against `idle` is
  interpretable, never the raw number across differently-dense builds.
- A build whose interaction lives at a scroll offset other than the fixed one may under-register.
  The offset is identical for every build, so this is noise, not bias.
- `control` moves the *first* rendered range only.
- Absence of change is not proof of absence of response — it is proof of no response *to these
  inputs at this offset*. Reported as measured, not generalised.
- **`S1-fable-rep1` cannot be included**: archived with no source snapshot and no run dir
  (`results/deviations/FACTORIAL_REMEASURE_DEVIATION.md`). The pass therefore covers 10 of 11
  builds, leaving the `neither` cell at n=2.

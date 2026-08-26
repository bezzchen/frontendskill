<!-- run: S0-register-recognition | condition: with_skill_v1 | rep 3 | model claude-fable-5 | 2026-08-25 | fixture launch-page-base 3543ef9 (fresh copy) | protocol evals/withskill_protocol.md | captured verbatim from agent final report; agent's commissioned research sweep was orchestrator-relayed after a notification-routing stall (documented in wave record) -->

That is the research I commissioned — findings received and folded in. Three of them changed decisions: Paper Shaders turns out to be externally seekable (`speed={0}` kills its internal rAF, `frame` prop drives time deterministically), which upgrades it from expected reference-only to conditional adopt; GSAP 3.15.0 with all former Club plugins free is confirmed, which locks SplitText and CustomEase into the stack at zero licensing cost; and no catalog ships a curve editor or timeline/playhead primitive, which validates building the set piece custom. The full proposal follows.

---

# Meridian launch page — concept and architecture proposal

**Repo:** `/private/tmp/claude-501/-Users-bezzchen-Documents/37b75f5e-0330-4278-8117-fba2895b3c92/scratchpad/runs/S0ws-rep3` (Next 16.2.12, React 19.2.8, Tailwind 4.3.3; bare scaffold, no animation deps yet)

The existing placeholder copy contains real product truths the concept is built from, not around: springs and gesture-driven motion alongside keyframes; one-click export to production JS/CSS with no runtime lock-in; live preview across breakpoints; reduced-motion variants built in.

## 1. Register decision (explicit)

The brief says unforgettable and experimental, so the spectacle register was weighed deliberately, not defaulted into.

**Chosen: S — Spectacle,** in a specific form: the realtime system that is structurally central is not a 3D scene but a **page-wide composition engine** — a single master clock that every element on the page is keyframed against, which the visitor can scrub, retime, and re-ease. Interaction materially changes the system (your edited easing curve becomes the page's easing curve), which is what qualifies it as S rather than W.

Weighed and declined:
- **S via 3D world / camera flight** — declined. Meridian's product truth is the timeline, not a space. A fly-through delivers generic awe, costs ~150 kB+ of three/R3F, and demonstrates nothing the product does.
- **S via ambient GPU wallpaper** — declined. A motion *editor* at rest shows a perfectly still paused frame; ambient ooze contradicts the product's psychology and the pause-when-idle economics.
- **W fallback** ("editor-chrome accents, per-section scrub, no global time authority") — held in reserve as the de-risk path behind a named gate (Phase 0, risk R2 below), not chosen silently.

## 2. Concept — "You're holding the playhead"

**The page is a Meridian project file, open, paused, and handed to the visitor.** Not a page *about* a motion editor — a composition the visitor is inside of. The scroll bar is the timeline. A record-red playhead and running timecode live in a slim bottom bar. Scrolling scrubs the entire page's composition, frame-accurately, forward and backward. Pressing K plays it, and the page travels itself.

The unforgettable beat — the one thing people will post about — is **Act 3: the page lets you edit its own motion.** A curve editor opens on the hero animation's actual easing curve; you drag the bezier handles; the page replays with *your* ease and keeps it for the rest of your visit. At the end, the export panel shows your edit as real production CSS/WAAPI code: *"You just edited this page. Meridian exports what you made."* The product's entire pitch — design motion visually, ship production code — is experienced, not claimed, with zero videos and zero screenshots.

### The composition (~48s notional at a 60fps timebase; sections labeled by timecode, because here order genuinely is time)

- **00:00 — Poster frame (hero).** Loads paused and fully readable: wordmark, the founders' line "Design animation visually. Ship production code.", playhead at zero. Hint: "Scroll to scrub · K to play". Frame 0 is the LCP and the no-JS page.
- **Act 1 — The claim.** Scrubbing assembles the hero: motion paths draw themselves in non-photo blue, keyframe diamonds sit at their true times, headline glyphs animate their variable-font axes (weight/width as visibly keyframed properties). Each element that enters adds a track to the bottom bar — the page builds its own track stack.
- **Act 2 — Tracks.** The page's sections appear as clips on tracks; hovering a clip highlights the live section above; dragging a clip retimes that section's animation within bounds. Copy: the real product line about visual timeline editing.
- **Act 3 — Curves (the set piece).** Curve editor on the page's own hero ease. Drag handles or pick presets; replay; an onion-skin ghost shows default vs. yours. Your ease persists.
- **Act 4 — Springs and gestures.** A draggable chip: flick it, it settles on a closed-form spring, and the flight is written onto a mini-track as keyframes in front of you — gesture becomes timeline, deterministically replayable.
- **Act 5 — Render and export.** The page's single dark surface: a bounded "render viewport" playing a designed comp locked to the same playhead (scrub proof: type, SVG, and GPU obey one clock). Beside it, the export panel with the visitor's edits as production code. No runtime lock-in, demonstrated.
- **00:48 — End card.** "Get early access", private-beta line; the timecode rolls a two-second credits egg.

**Talkability details (kept to three, deliberately):** J/K/L shuttle including reverse; `,` / `.` frame-stepping; credits at end of timecode. Editor natives will find them in minutes and screenshot them.

**Copy voice:** animator-native, plain verbs, no adjectives doing sales work. Buttons say what they do ("Replay with your curve", "Copy the CSS"). Section labels are timecodes. Failure/empty states speak editor ("Nothing on this track yet").

## 3. Design direction (thesis for the design director; that skill owns final critique at build)

Two reflexive directions were explicitly rejected as AI-default looks: near-black + single acid accent, and warm-cream + serif + terracotta. The direction below is derived from the subject's own materials instead.

**The light table.** Motion design's planning surface has always been paper on glass: field charts, peg bars, non-photo blue underdrawings, red grease-pencil marks. The page is that world with digital precision — a cool paper-white working surface where motion is *planned*, and one black screen (the render viewport) where it *renders*. Paper = design; screen = ship. The palette is semantic, not decorative:

- `#F5F7F4` **Bond** — cool paper white, the page surface (not cream)
- `#1A1C1A` **Graphite** — ink, all type
- `#9CCEE4` **Non-photo blue** — everything *planned*: motion paths, keyframe diamonds, onion-skin ghosts, hairlines
- `#2B7A9E` **Non-photo ink** — accessible blue for labels, links, focus rings
- `#EA3D2F` **Record red** — reserved exclusively for *now*: playhead, timecode, live indicators
- `#0E100F` **Screen black** — the render viewport only

Blue means planned motion, red means current time, black means render. The accent system carries information, and the single committed light theme is an art-directed choice (flagged to the director; the scaffold's dark tokens would be retired for this page).

**Type (candidates; director's final call):** display in **Bricolage Grotesque** (variable wght/wdth/opsz — chosen precisely so its axes can be keyframed properties in Act 1: the typography *is* a demo surface); body in a quiet humanist grotesk (e.g. Instrument Sans); timecode/chrome/export-code in a mono with tabular figures (e.g. Spline Sans Mono). Self-hosted via `next/font`, preloaded, size-adjusted fallbacks.

**Signature element, singular:** the grabbable playhead governing the whole page, paying off in Act 3. Everything around it stays disciplined — generous paper whitespace, hairline chrome, no decoration that isn't a track, a path, or a keyframe.

## 4. Technical architecture

### 4.1 Time model — one clock, pure functions

- A single **master clock** `t ∈ [0, 48s]`. Every visual is a **pure function of `(t, editState)`**. No accumulators, no `Date.now()` in render paths, no unseeded randomness (seeded mulberry32 per act). Springs use the closed-form damped-oscillator solution, so even "physics" is exactly seekable. This one rule buys deterministic scrubbing, exact offscreen resume, and render-on-demand.
- The master clock is a **virtual timeline over per-section segments**: each section registers `(element, buildTimeline(), scrollSpan)`; scroll position maps piecewise-linearly to `t` across segments (dead zones between acts map linearly so the playhead never jumps). Per-section pinned segments — not one giant 700vh pin — keep native scroll, anchors, and resize sane. Budget: any act's pin ≤ 140vh, total page ≤ ~900vh (tuned in the spike).

### 4.2 Time authority — a small state machine, one authority at a time

| Mode | Clock source | Exit |
|---|---|---|
| `SCRUB_SCROLL` (default) | scroll position → `t` | play pressed / playhead grabbed |
| `PLAYING` | `gsap.ticker` advances `t`; window scroll follows via inverse map | any user wheel/touch/scroll-key → pause, back to `SCRUB_SCROLL`; `visibilitychange` → pause |
| `DRAG` | pointer on playhead thumb → `t`; scroll follows | release |
| `EDITING` | local replay drives only the affected sub-timeline; master clock untouched | close/commit |

`gsap.ticker` has a callback attached **only** while `PLAYING` — there is no idle rAF loop anywhere in the app.

### 4.3 Ownership boundaries (one owner per concern)

- **GSAP owns time and transforms.** Core + ScrollTrigger + ScrollToPlugin + Draggable + SplitText + CustomEase — all free as of 3.13, current 3.15.0 (verified today). Integrated via `@gsap/react` 2.1.2 (`useGSAP`; React 19 compatible per peer deps).
- **React owns structure and edit state.** Edit state (custom ease, retimes, recorded gesture) in a context + reducer — a handful of low-frequency writers, so no store library. Commits rebuild affected tweens via `invalidate()`; React never animates a property GSAP owns.
- **Tailwind 4 owns chrome layout and tokens** (`@theme` in `globals.css`).
- **Native scroll owns scrolling.** No Lenis/smooth-scroll: a smoothing library is a second opinion about time, and this page can have only one.
- **Banned:** Motion/framer-motion (second engine), three/R3F (no 3D thesis, ~150 kB unjustified).

### 4.4 Rendering layers

1. **SSR DOM** — all copy in server components, readable at frame 0 with JS disabled; comp chrome hydrates as client components on top. Animation via transform/opacity/clip-path only → CLS 0.
2. **SVG overlays** — motion paths, keyframe diamonds, onion-skin ghosts (ghosts = the same pure timeline functions sampled at t±Δ). Element boxes measured only on resize (ResizeObserver); no layout reads in the hot path.
3. **One bounded seekable canvas** (Act 5 only, not page-wide) behind a `SeekableSurface` interface: `render(t)` draws only when `t` changes **and** IntersectionObserver reports visibility; DPR capped 1.5 mobile / 2 desktop; WebGL context-loss → static poster swap.

### 4.5 Idle, hidden, and offscreen behavior (architect non-negotiable, designed in unprompted)

The page has **zero ambient animation by design** — a paused editor is still; stillness is the brand. The complete inventory of continuous processes, each with its stop condition:

- **`PLAYING` mode:** ticker callback removed on exit; `visibilitychange → hidden` triggers an explicit pause (not a reliance on rAF throttling), and this is *verified by actually switching tabs* (V2 below).
- **Canvas:** event-driven `render(t)` + IO gate; if Paper Shaders is adopted for a texture layer it is mounted with `speed={0}` — source-verified to disable its internal rAF entirely — and driven via its `frame` prop.
- **Record-dot blink / playhead pulse (CSS):** gated by an IO-toggled class and a `visibilitychange`-set root attribute; disabled under reduced motion.

### 4.6 Adopt / adapt / reference-only / custom (fit gate, with what was checked)

Checked today: React Bits, Fancy Components, SmoothUI (component-level, engines verified from source), npm registry, GSAP releases, Paper Shaders source.

| Need | Checked | Verdict |
|---|---|---|
| Motion engine | GSAP 3.15.0 (all plugins free, confirmed), @gsap/react 2.1.2 | **Adopt** — the single substrate |
| Scrub-driven text assembly | React Bits ScrollReveal/ScrollFloat (GSAP `scrub:true`), Fancy Scroll-and-Swap (Motion), SmoothUI scroll-reveal (Motion) | **Reference-only** — Motion ones hit the second-engine ban; React Bits ones own private ScrollTrigger instances, breaking single-clock registration. We use SplitText inside our own segment timelines, borrowing the per-glyph stagger pattern |
| Easing-curve editor | All three catalogs: none exists. npm: `react-bezier-curve-editor` 2.1.0 (dormant since 2024-04), `bezier-easing-editor` 1.1.0 (revived 2026-06) | **Custom** — it is the set piece; must match chrome identity, emit CustomEase, carry numeric inputs and presets for a11y. The two packages serve as handle-math references |
| Timeline / playhead / tracks UI | Catalogs: none (SmoothUI "Scrubber" is a Motion slider; React Bits Pro "Agent Activity" is unrelated) | **Custom** — it is the product metaphor; GSAP Draggable for the thumb |
| Onion-skin ghosting | Catalogs have only cursor trails (some pulling three.js) | **Custom** — trivial given pure `f(t)`: sample at t±Δ |
| Seekable GPU texture (Act 5 layer) | Paper Shaders 0.0.80: `frame` prop + `speed=0` kills internal rAF (source-verified; `frame` is README-undocumented; pre-1.0) | **Conditional adopt** — exact-pin 0.0.80, wrapped behind `SeekableSurface`, CI smoke test for seek determinism and zero-rAF (V9); fallback is a ~150-line custom WebGL2 quad. Foreground comp: custom — it must read as *made in Meridian* |

New dependencies, total: `gsap@3.15.0`, `@gsap/react@2.1.2`, optionally `@paper-design/shaders-react@0.0.80` (pinned exact). Nothing else.

### 4.7 Module map

```
app/layout.jsx            fonts, metadata, tokens
app/page.jsx              server: all copy, in composition order
components/comp/
  CompProvider.jsx        client: authority state machine + edit-state reducer
  masterClock.js          segment registry, scroll<->t mapping, render bus
  useSegment.js           section hook: register sub-timeline + pin config
  TimelineBar.jsx         playhead (Draggable + slider semantics), timecode,
                          track minimap, play, skip-motion control
  KeyframeOverlay.jsx     SVG paths/diamonds/ghosts, ResizeObserver-measured
  CurveEditor.jsx         SVG bezier editor -> CustomEase; numeric inputs; presets
  SeekableSurface.jsx     bounded canvas, render(t), IO-gated, ctx-loss fallback
components/sections/      Hero, Tracks, Curves, SpringsGestures, RenderExport, Close
lib/                      spring.js (closed form), timecode.js, eases.js, seed.js
```

### 4.8 Accessibility, reduced motion, SEO

- All copy is real SSR DOM; overlays `aria-hidden`. Playhead is `role=slider` with timecode `aria-valuetext`, arrow-key frame-stepping, PgUp/Dn act jumps. Curve editor fully operable without a pointer: paired numeric inputs for handle coordinates plus preset buttons. Space is never hijacked globally (K/J/L are the global transport; space only when the bar has focus). Focus rings in non-photo ink.
- A persistent **"Skip motion — show the finished page"** control jumps every segment to its end state and releases pins. `prefers-reduced-motion` auto-enables it: no autoplay, poster states, curve editor still functional with instant (non-animated) apply. The page copy frames this as the product truth it is: *"Reduced-motion variant — built in, like every Meridian export."*
- Static generation throughout; OG image is the poster frame with the playhead visible; metadata per scaffold.

### 4.9 Performance budgets

- Initial JS ≤ 200 kB gz hard ceiling, ~170 expected (Next 16 baseline ≈ 100; measured gsap core 27.8 + ScrollTrigger 18.3; remaining plugins estimated 15–20, to be measured; app ≈ 15). CI `size-limit` gate.
- LCP (poster-frame H1 text) < 1.8s on throttled 4G / mid-tier; CLS = 0; INP < 200 ms (passive listeners, batched rAF work, zero hot-path layout reads); idle CPU ≈ 0 by construction.
- Mobile: native scroll is the primary scrub input; bar condenses to timecode + play + minimap; `touch-action` isolated to the thumb; canvas DPR 1.5.

## 5. Verification plan (claims tested under their actual conditions)

- **V1 idle-zero:** 10 s hands-off Performance trace after load → no app script/rAF activity.
- **V2 hidden pause:** enter `PLAYING`, switch tabs for real (headed browser + on-device Safari — not a simulated `document.hidden` flip), return → `t` advanced ≤ 100 ms past the switch, proven via logged `visibilitychange` timestamps.
- **V3 offscreen canvas:** while `PLAYING`, physically scroll the viewport away → draw counter freezes while `t` advances; scroll back → exact correct frame.
- **V4 scrub determinism:** Playwright seek → screenshot → seek away → seek back → pixel diff < 0.1%.
- **V5 reduced motion:** real OS setting (macOS + Android), not only emulation → no autoplay, poster states, opt-in present; axe-core clean.
- **V6 keyboard-only** full journey including a curve edit via numeric inputs.
- **V7 perf:** 4x CPU-throttle scrub ≥ 50 fps desktop; real mid-tier Android ≥ 40 fps; Lighthouse mobile ≥ 90; size-limit in CI.
- **V8 no-JS:** curl → complete copy, sane layout.
- **V9 shader slaving (if adopted):** with `speed=0`, instrumented rAF shows zero library ticks over 5 s; `setFrame` twice at one value → identical `readPixels` hash.

## 6. Phases, gates, risks

- **P0 — spike (riskiest integrations first):** master clock + authority handoffs (play-follows-scroll and user-scroll cancel) + one pinned segment + `SeekableSurface` with slaved shader + real-device scrub fps. **Gate G0:** handoff feels right, ≥ 40 fps on mid-Android, shader seek deterministic.
- **P1** comp engine + hero act + timeline bar. **P2** the set piece: curve editor, persistence, export panel. **P3** remaining acts, minimap, the three eggs. **P4** design-director critique pass (that skill holds final call), copy pass, full V1–V9 matrix, a11y audit.

Risks and named fallbacks: **R1** play-follows-scroll feel → fall back to segment-local playback (playhead still global for scrubbing). **R2** scroll-jack fatigue → pin budgets above, ever-visible skip control; if global scrub itself janks at G0, drop to the W register consciously (chrome + per-section scrub, no global authority). **R3** variable-font raster cost on low-end → restrict axis animation to the hero, else transform-only glyphs. **R4** Paper Shaders pre-1.0 drift → exact pin + wrapper + V9 in CI; custom quad ready. **R5** iOS scroll coalescing → real-device testing in P0, not P4. **R6** SplitText/SSR text integrity → split after `fonts.ready`, `aria-label` preserves the string, re-split only at breakpoint changes.

## 7. Open questions for the founders

1. May the export panel emit the *actual* Meridian export format, byte-for-byte? Matching the real product output makes Act 5 the strongest proof on the page.
2. Is the brand open to a light, paper-world identity, or is it dark-locked? (Shapes the design thesis before the director pass.)
3. "Share your cut" URLs (edit state serialized to the hash, custom OG) — launch scope or fast follow?
4. Any appetite for a licensed display face, or stay within open faces?

---

Sanity check performed: re-read the brief — it asks for a proposed concept and technical architecture with no implementation, and this delivers exactly that; no files were added to the repo (verified the working tree still contains only the original scaffold plus nothing from me); all four architect non-negotiables are addressed explicitly (idle/hidden animation policy in 4.5, actual-condition verification in 5, cited fit gate in 4.6, explicit register weighing in 1); versions cited were verified against the live registry today, with the freshness rule to re-inspect installed versions at coding time noted.

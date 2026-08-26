# Meridian Launch — Proposal

**Concept: "This page is a Meridian file."**
The launch page is not a page about the editor. It is a composition *made in* the editor — a
scrubbable, playable, exportable timeline document that happens to be a website.

---

## 1. The idea in one paragraph

A meridian is the line you measure time from — Greenwich, 0°00′00″. A playhead is the line you
measure a composition from — 00:00:00:00. That coincidence is the whole site. The visitor lands
inside a running Meridian document: a timeline dock sits at the bottom of the viewport, a playhead
sweeps, timecode counts, and the page *plays itself* — the wordmark assembles, copy eases in, a
product vignette animates. Then the visitor discovers the real trick: **they can grab the playhead
and scrub the entire site.** Scroll is scrubbing. Spacebar plays. J/K/L shuttles. Every element on
the page is a track in the dock, every entrance a visible keyframe diamond. And at the end, one
button — **"Export this page's motion"** — emits the actual, runnable CSS/JS for the animation
they just watched, because the page really is driven by a Meridian document. The site doesn't
claim "design animation visually, ship production code." It demonstrates it on itself.

The share hook we're engineering for: *"Have you seen the Meridian site? You can scrub the whole
thing like a timeline — and export it as code."*

---

## 2. Why this concept

### The medium is the argument
Meridian's three product claims (from the current copy) are: visual timeline editing; one-click
export to production JS/CSS with no runtime lock-in; reduced-motion variants built in. Each claim
is *performed* by the page rather than stated:

| Product claim | How the page proves it |
|---|---|
| Visual timeline editing | The page **is** a timeline you scrub; keyframes are visible, honest UI |
| Export to production code, no lock-in | The page exports its own motion as copy-pasteable CSS `@keyframes` / Web Animations code |
| Reduced-motion variants built in | `prefers-reduced-motion` renders a designed **storyboard mode** — the same content as a film-strip contact sheet with timecode captions |

### The audience already has the muscle memory
Motion designers and design engineers live in NLEs and After Effects. Spacebar-to-play,
J/K/L shuttle, arrow-key frame stepping, I/O loop points — giving the page editor controls is a
handshake with exactly the people we want, and invisible to everyone else (the page still scrolls
like a normal website).

### The name becomes the mechanic
Playhead = meridian. The recurring visual motif is a single vertical hairline — it sweeps the
screen in the cold open to "draw" the wordmark, it marks scene transitions, and it lives
permanently in the dock as the playhead. The brand isn't decorated onto the page; the page is an
instrument named after its own cursor.

### What makes this version non-generic
"Scrollytelling with a progress bar" is a template. The non-templated core here is **honesty**:
the timeline dock is not a decorative illustration — it is rendered from the same declarative
document that drives every animation on the page, and the exporter compiles that same document to
real code. One source of truth, three consumers (runtime, dock UI, exporter). If we faked any of
the three, the concept would collapse into a gimmick.

### Alternatives considered and rejected
- **WebGL cinematic** (particles, shaders, camera fly-through). Spectacular, heavy, and generic —
  it's the awards-site cluster look, and spectacle makes no argument about a *timeline editor*.
  Rejected: wrong kind of unforgettable.
- **A fully playable mini-editor.** Too much scope, cannibalizes product onboarding, and a landing
  page that demands work from the visitor loses most of them. We keep exactly *one* editable thing
  (see Scene 3) so the visitor tastes editing without homework.
- **Classic scroll-story with GSAP + pinned sections.** Competent, forgettable, and scroll-jacked.
  Our architecture deliberately keeps native scroll (see §5.4).

---

## 3. The composition (content = scenes on one master timeline)

Total runtime ~52 seconds at 60fps. Sections of the site are **clips**; the dock shows them as
colored clip blocks with real in/out points. Scroll position and time are the same axis.

**Scene 1 — Cold open (00:00–00:08) · clip color: amber**
Black console. Timecode starts counting. A single vertical hairline — the meridian — sweeps left
to right; as it passes, it deposits the wordmark letter by letter, each letter's landing visible
as a keyframe diamond lighting up in the dock below. Copy, small and mono:
`A meridian is the line you measure time from.` Then the h1: **"The web has a timeline now."**
Sub: "Meridian is a timeline-based motion editor for the web."
Final beat, the instruction that teaches the whole site:
`Everything above is a track below. Scrub it.` (with a pulse on the dock playhead).

**Scene 2 — Specimen (00:08–00:20) · clip color: sage**
The manifesto, set like a type specimen of easing. Three short lines, each entering with a
different, *labeled* curve — `linear`, `cubic-bezier(0.16, 1, 0.3, 1)`, `spring(180, 12)` — the
label typeset in the margin like a technical drawing callout. Copy is about motion as material:
"Motion is not polish. It is information — hierarchy, causality, weight. It deserves a canvas,
not a config file." Scrubbing back and forth here is inherently satisfying; this scene is the toy.

**Scene 3 — The edit (00:20–00:34) · clip color: cornflower**
A product vignette: a mock canvas element (a simple pictogram — a sphere arcing across a stage)
animates on loop while its keyframes glow in the dock. Beside it, one **live bezier curve editor**
— the only editable control on the site. Drag a handle and the vignette re-runs with your curve;
your edit is written into the page's actual document, and the dock updates. Caption:
**"You just edited this page."** This is the moment of product comprehension.

**Scene 4 — Ship (00:34–00:44) · clip color: mauve**
The export moment. Button: **"Export this page's motion."** A panel slides up (styled like an
editor's render queue) with tabs — `CSS @keyframes` / `Web Animations API` — containing the real,
runnable code for the composition, *including the visitor's curve edit from Scene 3*. Copy-to-
clipboard and download. Line beneath: "No runtime. No lock-in. The file is yours." This is the
screenshot people will post.

**Scene 5 — End card / CTA (00:44–00:52) · clip color: amber (loop back)**
Timecode rolls to the out point. "Meridian is in private beta." Email capture, one field, one
button: **"Get early access."** After the out point, the playhead offers a loop: `⟲ 00:00`.
Footer as end-credits crawl (tiny, mono, sincere): built with Meridian, typeface credits, the
keyboard shortcut legend.

**Easter eggs / depth for the ones who look:**
- `J` `K` `L` shuttle (reverse / pause / forward, tap L twice for 2×) — NLE muscle memory.
- `←` `→` frame-step; `I` / `O` set loop in/out points; the loop region tints in the dock.
- Konami-grade: typing `:q` does nothing but flash `this is not vim` in the timecode slate.
- The OG/social image is a rendered frame of the composition with a timecode burn-in.

---

## 4. Design direction

**Look: instrument, not poster.** The page is a professional console — the warmth of a physical
mixing desk, not "AI dark mode." Precision hairlines, timecode everywhere, keyframe diamonds as
the only ornament. Deliberately *not* pure black + one acid accent: the palette is a warm graphite
console with editor **clip-label pastels** (the way real NLEs color-code bins and clips) and a
single hot element — the playhead.

**Palette (named tokens):**
- `console` #1B1A18 — page ground, warm graphite (not black)
- `panel` #232220 — dock, cards, render-queue panel
- `hairline` #3A3833 — rules, track lanes
- `ink` #EDEAE3 — warm white text
- `slate` #99958A — muted text, labels
- `playhead` #E5484D — timecode red; the *only* saturated UI color, reserved for the meridian line, playhead, and record-style accents
- Clip labels (muted, desaturated so the playhead stays hottest): `amber` #D8A03F · `sage` #8FB07C · `cornflower` #7C9BC0 · `mauve` #AF8FB0

**Type (two families, three roles — width is the contrast axis, not serif-vs-sans):**
- Display: **Archivo** (variable), Expanded width, tight leading, used sparingly at large sizes —
  instrument-panel wide caps for the wordmark and scene headlines.
- Body: **Archivo** at normal width, regular weight — quiet, legible, same voice.
- Utility: **Fragment Mono** for all timecode, keyframe values, curve callouts, keycaps, and the
  export code. The mono is the texture of the whole site; it carries the "file, not brochure"
  feeling.
Both are on Google Fonts and self-hosted at build via `next/font` (zero layout shift, no runtime
requests).

**The one aesthetic risk:** there is no conventional website chrome at all — no navbar, no hero
badge, no footer columns. Navigation *is* the timeline (clicking a clip in the dock seeks to that
scene). Justification: the audience lives inside editors; the page teaches its own interface in
the first eight seconds by visibly playing itself; and native scroll always works as a fallback
for anyone who ignores the dock entirely.

**Restraint budget:** the signature is the dock + meridian line + honest keyframes. Everything
else is quiet: generous whitespace, hairline rules, no gradients, no glass, no grain overlays, no
parallax for its own sake. Motion outside the composition itself (hover states, panel slides) is
small and spring-fast. If a flourish doesn't read as "editor," it's cut.

**Copy voice:** plain verbs, sentence case, specimen-like labels. Buttons say what they do
("Export this page's motion," "Get early access"). Technical callouts are real values, never
lorem-technobabble — the bezier labels are the actual curves in the document.

---

## 5. Technical architecture

### 5.0 Stack decision
Keep the existing **Next.js 16 + React 19 + Tailwind 4** setup. The page is content-light and
interaction-heavy; we statically render all content (SEO, no-JS readability, instant LCP) and
hydrate the engine on top. Target **zero new runtime dependencies** — the engine, store, and
exporter are small enough to own, and "the motion-tooling company's site ships someone else's
animation library" is a story we don't want. (De-risk note in §7 if this proves wrong.)

### 5.1 The heart: a deterministic timeline micro-engine
Everything renders from a single scalar `t` (master time in ms). The engine is a pure function:

```
seek(doc, t) -> Map<targetId, ResolvedStyles>
```

- **Deterministic & idempotent:** same `t`, same frame — always. No accumulated state, no
  tween objects, no "play from here" special cases. Scrubbing backwards is free.
- Play mode is just `t += dt` per rAF. Scrubbing sets `t` directly. Loop points clamp `t`.
- Implementation is small and boring on purpose: linear interpolation over keyframes per property,
  cubic-bezier easing solver (~40 lines, standard Newton–Raphson + bisection), a spring resolved
  by pre-sampling at doc-load (springs stay scrub-safe because they're sampled, not simulated
  live), and stagger helpers. Estimated total: 300–500 lines, unit-testable in isolation.

**Why not GSAP/ScrollTrigger?** GSAP would get us playback and scrubbing quickly, but the concept
requires *introspection*: the dock draws clips and keyframe diamonds from the animation data, and
the exporter compiles that data to CSS/WAAPI. Owning a tiny declarative document (§5.2) makes all
three consumers trivial; extracting the same from GSAP's imperative timeline objects is fighting
the tool. GSAP remains the named fallback if the engine stalls (§7).

### 5.2 The document: one source of truth, three consumers
The composition lives in `lib/doc/meridian.doc.js` — declarative data, no code:

```js
{
  fps: 60, duration: 52000,
  scenes: [{ id: "cold-open", label: "Cold open", in: 0, out: 8000, color: "amber" }, …],
  tracks: [
    {
      target: "hero.letter.M",            // maps to a DOM ref
      property: "transform.translateY",   // whitelisted animatable props
      keyframes: [
        { t: 1200, value: 40, ease: [0.16, 1, 0.3, 1] },
        { t: 1750, value: 0 }
      ]
    },
    …
  ]
}
```

Consumed by:
1. **Runtime applier** — resolves styles at `t`, writes them to DOM refs.
2. **Dock renderer** — draws scene clips, track lanes, and keyframe diamonds *from the doc*, so
   the timeline UI is honest by construction. Positions are pure functions of `(t, duration)`.
3. **Exporter** — compiles tracks to `@keyframes` blocks + a WAAPI/`element.animate()` variant.

The Scene 3 curve editor performs the only runtime mutation: it swaps one track's easing in a
`userEdits` overlay merged over the doc. The exporter reads the merged view — which is how the
visitor's edit shows up in their export.

**Animatable property whitelist:** `transform` (translate/scale/rotate), `opacity`, `clip-path`,
and CSS custom properties (for the timecode counter and curve drawings). Compositor-only by
policy; the exporter also stays honest because these all map 1:1 to CSS.

### 5.3 React integration: React owns structure, the engine owns frames
The cardinal perf rule: **no React re-render per frame.**
- Server components render all content statically (real text in real DOM order).
- A client `<Composition>` boundary registers element refs into a target registry
  (`data-track="hero.letter.M"` → ref map) on mount.
- The engine runs outside React: one rAF loop reads inputs, computes `t`, applies styles
  imperatively via the registry (`style.transform = …`). Writes batched after reads; zero layout
  thrash.
- A tiny hand-rolled external store (~60 lines: `{ t, mode, loopIn, loopOut }`, subscribe/notify)
  feeds the *chrome* via `useSyncExternalStore` — but high-frequency consumers (timecode readout,
  playhead position) subscribe directly and mutate their own DOM/textContent in the engine's rAF,
  bypassing React entirely. React-rendered chrome updates only on discrete changes (mode, scene
  in/out, panel open).

### 5.4 Input: native scroll is the transport (no scroll-jacking)
- The document has real height (~600vh). **`t = map(scrollY)`** — scroll *is* the scrub. Momentum,
  accessibility, mobile behavior, find-in-page, and middle-click autoscroll all keep working; the
  page degrades to a normal website.
- Play mode inverts the mapping: the rAF advances `t` and drives `scrollTo` (instant behavior, per
  frame). Any user scroll/wheel/touch during playback pauses play and hands authority back — input
  arbitration lives in one place (`lib/input/transport.js`) with a simple priority: user gesture >
  playhead drag > play mode.
- Dock interactions: dragging the playhead or clicking a clip sets `t` (and therefore scroll).
  Keyboard: space, J/K/L, arrows, I/O as in §3; the scrubber itself is a real
  `role="slider"` with arrow-key support and `aria-valuetext` as timecode.
- Scene transitions use no pinning tricks — scenes are normal stacked sections whose inner
  elements animate on the master timeline. (Sticky positioning only for the dock and the in-scene
  vignette stage.)

### 5.5 The dock (timeline UI)
- Bottom-docked, ~112px tall on desktop: transport row (play/pause, shuttle, timecode
  `current / total`) + clip lane (colored scene blocks) + one keyframe lane showing diamonds for
  the *currently active scene's* tracks (full multi-track view is deliberately out of scope —
  it's a landing page, not the product).
- Rendered as DOM (not canvas): a few dozen elements, positioned by CSS custom properties set from
  the engine (`--playhead-x`). DOM keeps it accessible, themeable, and cheap.
- **Mobile:** collapses to a slim scrub strip (timecode + progress + play button, ~48px). Full
  clip/keyframe lanes are desktop-only. Touch-drag on the strip scrubs; JKL & friends are
  desktop affordances.

### 5.6 Export pipeline
`lib/export/toCSS.js` and `toWAAPI.js` walk the merged doc:
- CSS target: one `@keyframes` per track-target with percentage stops derived from keyframe times
  relative to the composition (or per-scene, clearly labeled), plus the element selector scaffold
  and `animation:` shorthand. Beziers emit as `cubic-bezier()`; sampled springs emit as
  `linear()` easing (with a graceful bezier fallback comment).
- WAAPI target: `element.animate(keyframes, { duration, easing, delay })` snippets.
- Runs entirely client-side; output shown in the render-queue panel with copy + download
  (`meridian-launch.motion.css` / `.js`). No server, no build step, provably "no lock-in."

### 5.7 Accessibility, reduced motion, no-JS — as designed artifacts, not fallbacks
- **Reduced motion (`prefers-reduced-motion`): storyboard mode.** The engine never starts; instead
  the page renders as a film-strip contact sheet — each scene as a composed still frame with
  timecode caption and its copy fully visible. This is a *designed* deliverable (it also
  demonstrates the product's "reduced-motion variants built in" claim), reachable by anyone via a
  visible `Motion: on/off` toggle in the dock, persisted to `localStorage`.
- **No-JS / crawlers:** all copy is server-rendered in correct order; animated elements default to
  their *final* (fully-visible) state in CSS, and a `js`-class gate applies initial keyframe
  states only after hydration — no invisible content, no SEO cost, no flash of hidden text.
- **Screen readers:** content order is document order regardless of `t`; the dock is a labeled
  `region` with real buttons and a slider; decorative diamonds/hairlines are `aria-hidden`.
  Nothing uses `visibility: hidden` mid-composition (opacity-only), so the accessibility tree is
  stable.
- **Focus:** visible focus rings styled as keyframe-diamond outlines; full keyboard operability of
  transport, curve editor (arrow keys nudge handles), and export panel (focus trap, `Esc` closes).

### 5.8 Performance budget & tactics
- **Budget:** ≤ 60KB gzipped JS beyond the framework; LCP = hero wordmark (server-rendered text,
  visible within first composition beat); CLS 0 (`next/font`, fixed dock height); steady 60fps
  scrub on a 6× CPU throttle for the busiest scene.
- Compositor-only properties (whitelist-enforced in the doc schema); `will-change` applied only to
  the ~dozen elements active in the current scene, removed on scene exit.
- Scene culling: inactive scenes get `content-visibility: auto`; the applier skips tracks whose
  scene is out of range (cheap: tracks are pre-bucketed by scene at doc load).
- One rAF for everything (engine, playhead, timecode) — no competing loops, reads before writes.
- The curve editor and export panel are `next/dynamic` islands (loaded on approach), keeping the
  initial bundle to engine + doc + dock.

### 5.9 File structure (planned)
```
app/
  layout.jsx            # fonts (next/font: Archivo var, Fragment Mono), metadata, OG
  page.jsx              # server shell: scenes as semantic sections, real copy
  globals.css           # tokens from §4, base styles, js/no-js + reduced-motion gates
components/
  Composition.jsx       # client boundary: registry, engine mount, input wiring
  dock/                 # TransportBar, ClipLane, KeyframeLane, Scrubber, TimecodeSlate
  scenes/               # ColdOpen, Specimen, EditVignette, ExportPanel, EndCard
  CurveEditor.jsx       # the one editable control (dynamic import)
lib/
  engine/               # clock, interpolate, ease (bezier solver), spring-sample, apply
  doc/meridian.doc.js   # THE composition (data only) + schema/validate
  export/               # toCSS, toWAAPI, format helpers
  input/                # transport arbitration, scroll-sync, keys
  store.js              # 60-line external store
```

### 5.10 Testing & tooling (a dividend of determinism)
- Unit tests for interpolation, bezier solver, spring sampling, and both exporters (golden
  strings) — pure functions, trivial to test.
- **Golden-frame visual regression:** Playwright drives `window.__meridian.seek(t)` to fixed
  timestamps and screenshots; determinism makes the shots pixel-stable. A frame grid at
  `t ∈ {0, 4s, 12s, 26s, 38s, 52s}` doubles as the storyboard-mode art and the OG image source.
- Exporter round-trip smoke test: exported CSS is injected into a bare fixture page and
  screenshot-compared against the engine at matching times.

### 5.11 Deployment
Fully static (`output: 'export'`) — no server required. Email capture posts client-side to the
founders' provider of choice (Buttondown/ConvertKit/etc.) or a single serverless function if they
prefer owning the list (the one thing that would move us off pure static; founders' call, §8).

---

## 6. Build plan (phased, each phase shippable)

1. **Engine + doc + scroll-sync spine** — seek/play/scrub with a debug slider; unit tests.
   *(This phase proves the whole concept; everything after is content.)*
2. **Dock** — transport, clips, playhead, keyframes, keyboard map, mobile strip.
3. **Scenes 1–2** — cold open + specimen; tokens, fonts, art direction locked here.
4. **Scene 3** — vignette + curve editor + userEdits overlay.
5. **Scenes 4–5** — exporters, render-queue panel, CTA, end credits.
6. **Modes & polish** — storyboard/reduced-motion mode, no-JS pass, golden frames, perf audit,
   OG image, easter eggs.

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Custom engine rabbit-holes | Scope is frozen: whitelisted properties, linear+bezier+sampled-spring only. Fallback: swap `lib/engine` internals for GSAP while keeping the doc as source of truth (doc→GSAP compile is straightforward; dock & exporter unaffected). |
| Scroll↔time feels off (too fast/slow per scene) | Per-scene scroll-density map in the doc (`px per second` per scene), tuned by hand. |
| "Export" produces underwhelming code | Export per-scene, curated: hero + vignette tracks with comments, not a 900-line dump. Honest ≠ exhaustive. |
| Mobile can't carry the full dock | Designed collapse (scrub strip) from day one, not a responsive afterthought; full dock is a desktop reward. |
| Autoplay motion overwhelms | First playthrough is gentle (~0.75× with copy dwell), `Motion off` toggle always visible, reduced-motion honored before first frame. |
| Gimmick fatigue | The page reads as a normal, beautifully typeset site if you never touch the dock — scrubbing is discovery, not a gate. |

## 8. Open questions for the founders

1. Does a brand mark/wordmark exist, or do we design the wordmark as part of the cold open?
2. Email capture: third-party provider (keeps the site fully static) or own endpoint?
3. May Scene 3's vignette hint at real product UI, or should it stay abstract until launch?
4. Is a hidden `?t=00:12` deep-link/share-a-frame feature worth the small scope add? (Cheap and
   very tweetable — a URL that opens the site at a specific frame.)
5. Launch platforms we should optimize the reveal for (Product Hunt/X/Hacker News) — affects OG
   frame choice and the first-load autoplay pacing.

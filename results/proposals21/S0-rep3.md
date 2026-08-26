# PROPOSAL — `launch.mer`

**The Meridian launch page is a Meridian file, playing itself.**

Prepared for the Meridian founders. Concept + technical architecture only; no implementation in this document.

---

## 1. The brief, restated

Meridian is a timeline-based motion editor for the web. It lets people design animation visually — springs, keyframes, gesture-driven motion — and ship it as production JavaScript and CSS with no runtime lock-in, with live breakpoint previews and reduced-motion variants built in.

The launch page must be an experimental, creative web experience people talk about. Not a normal marketing page.

The audience is the most design-literate audience on the internet: design engineers, motion designers, frontend developers who care about animation craft. They have seen every award-site trick. They groan at scroll-jacking, WebGL blobs, and marquee text. They can tell within five seconds whether a page was made by people who actually care about motion.

The page has one job: make this audience want write access to Meridian — and want to show the page to someone else.

---

## 2. The concept: `launch.mer`

> **You didn't visit our website. You opened our file.**

The launch page is not a page *about* Meridian. It is a Meridian project file — `meridian_launch_v14_FINAL.mer` — opened in a read-only instance of the editor, playing a 45-second title sequence that *is* the launch announcement.

When you arrive:

- A title bar says you have the file open, read-only.
- The canvas fills the viewport and the film begins: the launch story told as choreographed type, UI motion, and live code — every element of it animated by a real timeline.
- At the bottom of the screen is that timeline. Real tracks. Real clips. Real keyframes. A red playhead sweeping left to right.

And here is the moment the whole concept exists for: **the timeline is live.** Grab the playhead mid-film and the movie becomes an instrument. Scrub it. Press space. Press J, K, L — the shuttle keys every editor has in their hands' memory — and they *work*. Click an element on the canvas and its track lights up; an inspector opens with its actual spring parameters. Mute the copy track and the page goes wordless. Solo the type track and watch the typography perform alone.

The page cannot be dismissed as a metaphor, because it isn't one. The film is data — tracks, clips, keyframes — evaluated by a real playback engine, which is a vertical slice of Meridian itself. The page is the product's first public render.

The call to action completes the fiction. You've been in a read-only file the whole time, so the button doesn't say "Sign up." It says:

> **Request write access.**

### Why the name makes this inevitable

A meridian is a line you cross. A playhead is a line that crosses time. **The playhead is the meridian** — a red vertical hairline that doesn't stop at the timeline strip but extends the full height of the viewport, sweeping across the canvas, with everything on screen synchronized to it. Name, logo, interface, and product collapse into one form: a line that moves through time. The brand mark is the playhead. The loading state is the line drawing itself. This is the page's single signature element; everything else stays quiet.

### The moments people will share

Word of mouth needs concrete objects to carry it. We are designing six, deliberately:

1. **The discovery.** "Wait — you can scrub it." The moment someone grabs the playhead mid-film is the screen recording that gets posted.
2. **The thesis line.** Chapter four shows the actual exported CSS/JS of the animation currently under the playhead, values live-updating as you scrub, under the title card: *"This page exported itself."*
3. **The souvenir.** An "Export this page" control that downloads the page's real project file — `meridian_launch.mer`, the actual JSON the engine plays. Proof of the no-lock-in story, and a keepsake people share.
4. **Deep links to frames.** The URL tracks the playhead (`?t=37.2`). People can link the exact moment they loved. Chapter-accurate OG posters make those links unfurl well in Slack and social.
5. **The editor dialect.** J/K/L shuttle, `,`/`.` frame-stepping, space to play, solo/mute — muscle memory from every NLE, working on a marketing page. The audience screenshots this.
6. **The joke with a point.** `meridian_launch_v14_FINAL.mer` in the title bar, and a read-only file whose CTA is write access. One joke, told twice, both times about the product.

### Legible at three altitudes

The conceit must never gate the content. The page works at three depths, and each is complete:

- **Watch.** Do nothing and a tight 45-second film plays and lands on the end card. A visiting founder or journalist gets a finished, cinematic launch page and never needs to know the timeline is real.
- **Scrub.** Touch anything and you own time. The film becomes navigation: chapter markers on the ruler are the site's table of contents.
- **Dissect.** Select, inspect, solo, mute, drag the two or three keyframes we've left unlocked, export the file. The depth rewards exactly the people we want in the beta.

### Design principles (how we keep it from being a gimmick)

1. The page must be excellent if you never touch it.
2. Never take scroll hostage. Desktop has no scroll to steal (the piece is one viewport; the timeline is the nav). Mobile scroll is read, never intercepted.
3. Every flourish demonstrates a product truth. If a moment doesn't prove something Meridian does, it gets cut.
4. The reduced-motion version is not a fallback; it is a demo of a product feature (Meridian ships reduced-motion variants — so does its launch page).
5. One signature — the meridian playhead. Everything around it is disciplined and quiet.

---

## 3. The film: five chapters, ~45 seconds

The composition runs at 30fps, ~1,350 frames. Chapters are labeled regions on the ruler and double as navigation. Copy is written as title cards: short, declarative, sentence case.

| # | Chapter | Time | What happens on canvas |
|---|---------|------|------------------------|
| 1 | **A line crosses** | 0:00–0:06 | Film-leader opening: paper-white frame, registration crosshair, a red hairline sweeps left to right and pulls the word MERIDIAN out of its wake — the variable font's width axis animating from condensed to extended as letters emerge. The line then drops and docks into the timeline as the playhead. Name becomes mark becomes UI in one move. |
| 2 | **What you make** | 0:06–0:16 | Real UI motion performed live in DOM: a menu springs open, cards choreograph a reorder, a sheet follows a gesture and settles with inherited velocity. Behind each element, its actual easing curve draws faintly in SVG. Title card: *"Springs, keyframes, gestures. On a timeline."* |
| 3 | **How it feels** | 0:16–0:26 | The chrome becomes the subject: tracks light up as their elements move, the inspector opens itself and scrubs its own values, a clip trims. The interface is also on the timeline — even the UI is animated by the file. Title card: *"The timeline is the interface."* |
| 4 | **What you ship** | 0:26–0:36 | A code panel slides in showing the real exported CSS/JS of the animation currently under the playhead, with interpolated values highlighting live as time moves. Title card: *"This page exported itself."* Sub-line: *"Production JS and CSS. No runtime. No lock-in."* |
| 5 | **Get in** | 0:36–0:45 | Return to the paper leader frame. The playhead line becomes a cursor in an input field. End card: *"Meridian is in private beta."* Button: **Request write access.** Secondary: *Export this page* (downloads the .mer). The film holds here; looping is a click, not an ambush. |

**Interaction ladder** (each level is optional):

- Level 0: watch. A visible "skip to end" affordance jumps to the card; any interaction pauses autoplay instantly and hands over time.
- Level 1: transport. Play/pause (space), scrub (drag playhead or ruler), J/K/L shuttle, `,`/`.` frame step, chapter clicks, Home/End.
- Level 2: inspect. Click canvas elements to select (track highlights, inspector shows real parameters — stiffness, damping, bezier handles). Per-track solo/mute.
- Level 3: play. A whitelist of two or three draggable keyframes (retime the hero; overcrank a spring until the UI wobbles absurdly). "Export this page" souvenir. Loop-region in/out points (stretch).

---

## 4. Design language

### The duality that organizes everything

Two worlds share the screen, and the tension between them *is* the brand: the **canvas** (cinematic, art-directed, where the film lives) and the **chrome** (utilitarian, precise, the instrument). Expressive output, exacting tool — which is the product's promise. Every type, color, and layout decision falls out of this split.

### Typography

| Role | Face | Why |
|------|------|-----|
| Display (canvas title cards) | **Archivo Variable** (wght 100–900, wdth 62–125) | Industrial signage grotesk with a huge width axis — so the type itself can be a motion demo. The opening animates width as a first-class keyframed channel: typography literally driven by the timeline. Set extended for title cards, condensed for kickers. |
| Body (canvas copy, storyboard) | **Source Serif 4** | A title-card serif against the grotesk reads like film intertitles and credits — editorial warmth against instrument coldness. Optical sizing keeps small canvas copy honest. |
| Chrome (timecode, tracks, inspector, labels) | **IBM Plex Mono** | The instrument's voice: timecode, frame numbers, parameter values. Tabular figures, quiet at 11–12px, credible in an editor context without reaching for the current default dev-tool mono. |

All fonts self-hosted and subset at build via `next/font`. No runtime font requests.

### Color

The chrome is a fixed dark instrument; the canvas travels. Each chapter gets a constrained duotone so the film has an art-directed color arc rather than one static scheme.

| Token | Value | Use |
|-------|-------|-----|
| `chrome.base` | `#101014` | Panels, timeline bed |
| `chrome.surface` | `#17171C` | Raised chrome, inspector |
| `chrome.line` | `#2A2A33` | Hairlines, track lanes |
| `chrome.text` | `#B8B8C4` | Labels, timecode |
| `signal` | `#F04E30` | **The meridian.** Playhead, record-light accents, selection. The only saturated color in the chrome, used for exactly one idea: the line. |
| `leader.paper` | `#EFEDE6` | Chapter 1 & 5 canvas — film-leader white |
| `leader.ink` | `#141412` | Type on paper frames |

Chapter duotones (canvas only): ch1/ch5 paper+ink; ch2 a dusk-blue field with paper type; ch3 goes transparent — the chrome itself becomes the scene; ch4 near-black with a two-hue restrained syntax palette. The signal red never floods a scene; it belongs to the playhead.

The vernacular we draw from is the material culture of editing and celluloid — film leader countdowns, registration crosshairs, SMPTE timecode, light tables — used as structure, not nostalgia decoration. The crosshair is the canvas empty state; the countdown is the sub-second loading state (skippable, never gating).

### Layout

Desktop is one viewport, no page scroll — the timeline is the navigation:

```
┌──────────────────────────────────────────────────────────────┐
│ ● meridian_launch_v14_FINAL.mer   read-only     00:00:12:07  │  title bar
├─────────────────────────────────────────────────┬────────────┤
│                                    ┊            │ inspector  │
│              CANVAS — the film     ┊            │ (opens on  │
│          copy + choreography live  ┊            │  select)   │
│                                    ┊ ← playhead │            │
│                                    ┊   full     │            │
│                                    ┊   height   │            │
├─────────────────────────────────────────────────┴────────────┤
│ ⏯  J K L        00:00:12:07 / 00:00:45:00              ⋯    │  transport
│ type    ───●────────●───────────────●────────────            │
│ layout  ──────●●─────────●───────────────────────            │  timeline
│ springs ──────────────●───────●──────────────────            │  (Canvas 2D)
│ audio   ~~~~~~~~~~~~~ muted ~~~~~~~~~~~~~~~~~~~~~            │
│ A line crosses │ What you make │ How it feels │ Ship │ Get in│  chapter ruler
└──────────────────────────────────────────────────────────────┘
```

The playhead hairline runs from the timeline up through the entire canvas — the meridian crossing everything it animates.

**Mobile:** the stage is full-bleed and sticky; the timeline compresses to a bottom transport bar with chapter dots; the inspector is omitted. **Scroll is time**: a tall scroll container drives the playhead, so native momentum and rubber-banding *are* the scrub physics. We never call `preventDefault` on a scroll; the browser owns scrolling, we only read it. Touch-and-hold the transport to fine-scrub.

### Copy voice

Plain, declarative, confident; sentence case; every line either states what the product does or advances the film. The one joke (v14_FINAL / write access) is the whole humor budget. Draft title cards appear in the chapter table above; the final copy deck is a launch-week task with the founders.

---

## 5. The anti-default check

Before committing, we name what the default answer to this brief would be, and verify we didn't build it.

**The default:** a dark hero with a gradient mesh or WebGL particle field, an embedded product video, scroll-jacked feature reveals in a bento grid, an acid-green accent, marquee text, the current default grotesk + dev-mono pairing. Or the other default: cream background, giant display serif, terracotta accent.

**What we chose instead, and why:**

- Instead of a video *of* the tool → the page *is* the tool playing its own file. The demo can't be faked, and the audience knows it.
- Instead of scroll-jacking → no scroll on desktop at all; time is the axis, and the user is handed the transport. On mobile, scroll maps to time through native scrolling, never intercepted.
- Instead of an accent color → a signal red that is the playhead, and only the playhead. Color as function.
- Instead of a trend serif or default dev-mono → a width-axis grotesk that performs on the timeline, an intertitle serif, and a chrome mono; the pairing embodies the canvas/chrome duality.
- Where we deliberately kept convention: transport grammar (a play button looks like a play button), real `<button>`s and a real form, standard meta/OG. Familiar affordances are what make the unfamiliar conceit legible.

**Concepts considered and rejected:**

| Concept | Why not |
|---------|---------|
| Scroll-as-scrub storytelling page ("the site is one long timeline") | Strong mechanics, but reads as high-craft scroll-jacking — the known move this audience is tired of. Absorbed as the *mobile* time driver instead. |
| The 24-hour page (composition synced to UTC; a day-long meridian) | Poetic, sells the name — but demonstrates duration, not editing, and you can't share the moment you saw. Kept as a possible post-launch stunt. |
| Motion specimen book (springs/eases as a type-specimen catalog) | Beautiful, but a catalog, not a moment. Its DNA survives as the inspector's parameter detail. |
| "The rehearsal" (watch the page assemble itself in the editor, then the chrome fades) | Cinematic but passive — a demo video wearing a costume. Its best beat survives as chapter 3. |

---

## 6. Technical architecture

### 6.1 Stack position

Keep the existing stack — Next.js 16, React 19, Tailwind 4 — and add **zero runtime dependencies**. The engine is small, and shipping it dependency-free is itself on-message for a product whose pitch is "no runtime lock-in." Recommend migrating new code to TypeScript (the engine and document model badly want types); the repo is fresh enough that this is cheap.

The site is fully static (`output: 'export'`), deployable to any CDN. The single dynamic need — beta signups — is a ~20-line serverless endpoint (Cloudflare Worker or a Vercel function) so the page itself stays a static artifact. No third-party scripts, self-hosted fonts, cookieless analytics: this audience checks.

### 6.2 The one architectural law: rendering is a pure function of time

Everything in the experience derives from a deterministic evaluator:

```
render(t) → complete visual state
```

No accumulated per-frame state anywhere in the render path. This single constraint is what makes every feature fall out for free:

| Feature | Implementation given pure `render(t)` |
|---|---|
| Autoplay | A clock advances `t` via `requestAnimationFrame` |
| Scrubbing | Pointer position sets `t` |
| Mobile scroll | `scrollY` maps to `t` |
| Deep links | `?t=37.2` sets `t` on load; playhead writes back via throttled `replaceState` |
| Reduced motion / storyboard | Sample `t` at chapter poster frames |
| SSR / no-JS | Server renders the `t=0` poster statically |
| Visual regression tests | Screenshot at fixed `t` values — fully deterministic |

**Scrubbable springs are the hard part, solved up front.** Naive spring animation integrates an ODE frame-by-frame — stateful, and impossible to evaluate at arbitrary `t`. We instead use the closed-form solution of the damped harmonic oscillator (under-, critically-, and over-damped cases), parameterized by stiffness, damping, and initial velocity — a pure function of `t`, exact at any frame, in any direction. Gesture handoffs ("sheet settles with the fling's velocity") are the same closed form with a nonzero initial velocity. If we ever want friction/inertia hybrids with no closed form, they get pre-integrated into lookup tables at build time. Either way, the invariant holds: any channel, any `t`, same answer every time.

### 6.3 The document model: the film is data

The composition is a versioned JSON project file — because the conceit demands the page literally *be* a file, and because content iteration must not require engine changes.

```jsonc
// src/doc/launch.composition.json (abridged, illustrative)
{
  "meta": { "name": "meridian_launch_v14_FINAL", "fps": 30, "duration": 1350, "schema": 1 },
  "tracks": [
    {
      "id": "type-hero", "label": "type / hero", "group": "type",
      "clips": [
        {
          "id": "c-title", "in": 0, "out": 180, "target": "hero.title",
          "channels": {
            "wdth": { "keys": [ { "f": 0, "v": 62 }, { "f": 150, "v": 125, "e": "spring(170,14,0)" } ] },
            "x":    { "keys": [ { "f": 0, "v": -40 }, { "f": 120, "v": 0, "e": "cubic(0.2,0,0,1)" } ] }
          }
        }
      ]
    }
  ],
  "markers": [
    { "f": 0,   "label": "A line crosses" },
    { "f": 180, "label": "What you make" }
  ]
}
```

- Channels cover transform components, opacity, clip-path progress, variable-font axes, SVG path draw, and scene-token swaps. Easing is per-key: cubic-bezier, spring, step, hold.
- "Export this page" simply serializes this document (plus a comment header) — the souvenir is the real file, not a prop.
- This is deliberately a **vertical slice of Meridian's own data model**, not a fork. When the product can export a real `.mer`, the launch page becomes its first public artifact — swap the JSON, keep the page.
- Validated at build (schema check + referential integrity: every `target` exists, clips sorted and non-overlapping per track, keys monotonic).

### 6.4 Rendering: DOM-first, on purpose

The film renders as **real DOM elements animated via transforms/opacity**, with SVG for curve overlays and motion paths. No WebGL, no three.js.

The reasoning is strategic, not just technical: Meridian exports production JS and CSS for the real web — real DOM. A WebGL film would demonstrate something the product doesn't do. A DOM film *is* the product's output medium, and it keeps text selectable, the document indexable, and the page a page. An unforgettable site that is also a real, accessible HTML document is precisely the flex a web-tooling company should make.

Three surfaces, each with the right renderer:

| Surface | Renderer | Why |
|---|---|---|
| The film (canvas area) | DOM + CSS transforms, variable-font axes; SVG for drawn curves/paths | It's the product's medium; compositor-friendly properties only (`transform`, `opacity`, `clip-path`) |
| The timeline strip | One Canvas 2D layer | Hundreds of clip/keyframe glyphs redraw cheaply; and it *looks* like an editor because real editors do exactly this |
| Background atmosphere | Plain CSS (subtle depth grid) | Cuttable; earns no GPU program |

Off-time chapters are display-frozen with `content-visibility: auto` and detached from the write path; only elements with clips active near the current `t` receive style writes. `will-change` is applied to the small active set, never globally.

**Why not GSAP / Motion One / WAAPI / Rive:** GSAP's scrub model doesn't give exact springs-at-arbitrary-`t`, adds weight, and undercuts the "no runtime" message on the one page that must embody it. WAAPI/Motion One would still require our central evaluator (the inspector must display evaluated numbers; the timeline must draw them), making it a redundant layer. Rive renders to canvas — the wrong medium for a product whose export story is DOM. The CSS Scroll-Driven Animations API is noted as progressive enhancement for a few mobile tracks where supported, but the JS evaluator remains the single source of truth.

### 6.5 Engine structure: React out of the hot path

React renders structure and chrome; it never runs per frame.

- **`TimelineStore`** — a plain module (hand-rolled, ~50 lines) holding `t`, transport state, selection, solo/mute. Chrome components subscribe via `useSyncExternalStore` for *discrete* changes only (play/pause, selection, chapter). `t` itself never flows through React state.
- **Stage registry** — scene components register their animatable elements by target ID into a ref map on mount. The evaluator writes styles imperatively to those refs each frame.
- **Evaluator** — per frame: binary-search each track's sorted clips for those active at `t` (interval index precomputed at load), evaluate channels, batch style writes. Budget: under 2ms scripting per frame on a mid-tier laptop; a dev-only perf HUD asserts it.
- **Time drivers** — swappable sources that own how `t` advances; the engine only consumes `t`:

```
src/engine/
  clock.ts          rAF playback driver
  drivers/
    pointer.ts      scrub (playhead, ruler, J/K/L, frame-step)
    scroll.ts       mobile: sticky stage + tall scroller; reads scrollY, never intercepts
    reduced.ts      prefers-reduced-motion: poster-frame stepping, no autoplay
  eval.ts           clip search + channel evaluation
  springs.ts        closed-form damped oscillator (+ LUT fallback)
  easing.ts         cubic-bezier, steps, hold
  schedule.ts       batched style writes, active-set management
```

- **Timeline renderer** — Canvas 2D, DPR-aware, redraws only when `t`, viewport, or selection changes. Ruler, chapter regions, clip bars, keyframe diamonds, the playhead. Hit-testing for scrub/select/solo/mute lives here.
- **Code panel (ch. 4)** — exported code text is *generated at build* from the same JSON by the real serializer (`src/export/codegen.ts`) and pre-tokenized (Shiki at build). At runtime we only toggle highlight classes on the value spans mapped to active keyframe pairs — no runtime syntax highlighting, and the displayed code is provably the page's own export.
- **Audio (stretch tier)** — a visible, muted-by-default waveform track. If unmuted: a Web Audio clock slaved to `t`; scrubbing plays short grains at a rate proportional to `dt` — tape-scrub sound, an editor's delight. Fully cuttable without touching anything else.

### 6.6 Accessibility, reduced motion, and no-JS — as product demos

- **Reduced motion is a feature demo.** Meridian ships reduced-motion variants; so does its page. Under `prefers-reduced-motion`: no autoplay, the film presents as a **storyboard** — a filmstrip of chapter poster frames with all copy fully readable, timeline still operable with crossfade-or-none transitions. Framed in the UI as the same file exported with its reduced-motion flag.
- **The document is always a document.** All copy exists in DOM order regardless of animation state; choreography is presentation. Screen readers read a complete, sensible page.
- **Transport is a real media UI.** Native `<button>`s; the playhead is `role="slider"` with `aria-valuetext` as timecode; full keyboard operability; visible focus everywhere.
- **No-JS = the storyboard.** SSR emits chapter posters and copy as static HTML (this is also what crawlers index and what paints before hydration). The engine hydrates and takes over from a `t=0` poster that is pixel-identical to frame 0 — no flash, no layout shift.
- Contrast AA in chrome and every chapter duotone; nothing flashes beyond safe thresholds; the stage is sized with `svh` to avoid mobile toolbar jumps.

### 6.7 Performance budgets and device tiers

| Budget | Target |
|---|---|
| JS (engine + chrome, gz) | ≤ 90 KB |
| Fonts (subset woff2, total) | ≤ 120 KB |
| LCP | < 1.8s (frame-0 title card is static HTML text) |
| CLS | 0 (fixed stage; chrome space reserved) |
| Input → playhead latency | < 16ms |
| Scrub frame rate | 60fps on a mid-tier laptop; 30fps floor on low-end mobile |

Degradation ladder, applied by a boot-time capability probe (+ `deviceMemory` / `Save-Data` respect): drop curve overlays → drop background layer → shrink the prewarmed active set → storyboard mode. The floor experience is the reduced-motion storyboard, which is a designed artifact, not a broken one. Browser floor: evergreen + Safari 16.4+; older browsers get the storyboard.

### 6.8 Testing

Determinism makes this page unusually testable for something this weird:

- **Golden frames:** Playwright screenshots at `t = 0`, each chapter start, and three mid-film beats, diffed against baselines in CI (fonts awaited via `document.fonts.ready`, fixed DPR).
- **Engine unit tests:** spring/easing evaluation at known `t` values, clip-search edge cases (boundaries, zero-length, first/last frame), document validation.
- **Interaction tests:** scrub, J/K/L, chapter jump, solo/mute, deep-link arrival, form submit.
- **axe** on storyboard and end card; Lighthouse budgets enforced in CI.

### 6.9 Repository shape

```
app/
  layout.jsx            fonts, meta, OG
  page.jsx              SSR storyboard shell + <Stage/> mount
src/
  engine/               zero React imports (see 6.5)
  doc/
    schema.ts, validate.ts
    launch.composition.json
  stage/
    registry.ts
    scenes/ch1-leader ... ch5-endcard/
  chrome/
    TitleBar, Transport, TimelineCanvas, Inspector, ChapterRuler
  export/
    serialize.ts        "Export this page" souvenir
    codegen.ts          build-time exported-code generation (ch. 4)
  audio/                stretch tier
scripts/
  validate-doc.mjs, build-og.mjs, golden.spec.ts
```

### 6.10 Authoring workflow (internal, but critical)

Hand-authoring 45 seconds of choreography in raw JSON is not humane. Week one includes a **dev-only nudge mode**: select a clip in the running page, arrow-key its keyframes in time/value, and persist back to the JSON via a dev-server endpoint. It's a two-day build that makes composition iteration 10x faster — and it is, unavoidably and fittingly, a tiny proto-Meridian. It ships to no one.

---

## 7. Scope tiers

| Tier | Contents |
|---|---|
| **1 — Must (the launch)** | Engine + document model; chapters 1–5 authored; transport, timeline, chapter ruler, scrub, keyboard transport; playhead deep links; mobile scroll-scrub; reduced-motion storyboard; no-JS/SSR posters; static exported-code display in ch. 4; perf floor + tiers; signup endpoint; analytics events; golden-frame CI. |
| **2 — Should (the conversation)** | Element select + inspector; per-track solo/mute; live value-highlighting in the code panel; "Export this page" souvenir; whitelisted draggable keyframes; per-chapter OG posters. |
| **3 — Stretch (the legend)** | Audio track with scrub grains; loop in/out points (`I`/`O`); page-title timecode; the 24-hour UTC composition as a post-launch stunt. |

**Estimate:** ~5–6 weeks with two people (one design engineer, one engineer): wk 1 engine spike + nudge mode; wks 2–3 art direction + composition authoring in parallel with chrome; wk 4 chapters complete; wk 5 polish, perf, a11y; wk 6 test, instrument, launch. Tier 2 lands inside this window if authoring goes well; otherwise it ships as a fast-follow.

---

## 8. Success criteria

Instrument (cookieless) and watch in week one:

- **Interaction rate:** % of desktop visitors who touch the timeline — the "unforgettable" metric. Target > 35%.
- **Time coverage:** median unique seconds of the film seen. Target > 30 of 45.
- **Conversion:** write-access requests / engaged visitors. Target 8%+.
- **Carry:** deep-link arrivals (`?t=`), souvenir exports, unmutes — each a proxy for "showed someone else."

Events: play, pause, scrub, chapter-jump, select, solo/mute, export, deeplink-arrival, signup.

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Scope creep toward "building the actual product" | Hard read-only line; interaction whitelist; the chrome is set dressing with exactly one working control surface (transport + select + solo/mute). Anything else is Tier 3 or cut. |
| Reads as a gimmick / scroll-jack backlash | Desktop never touches scroll (there is none); mobile scroll is native and merely read; the passive path is a complete, short, skippable film; every trick maps to a product truth. |
| 60fps fails on low-end devices | Compositor-only properties, active-set writes, tier ladder, storyboard floor — the floor is designed, not broken. |
| Spring determinism bugs (scrub ≠ playback) | Closed-form evaluation by construction; golden-frame CI catches regressions. |
| Safari quirks (rAF throttling, low-power mode) | The test matrix includes iOS low-power; the clock driver degrades to 30fps gracefully; no `dvh` in the stage. |
| Conceit confuses non-editor visitors | The Level-0 path is a normal cinematic page; affordances lead with universal video-player grammar; five-user hallway test before launch. |
| Authoring 45s of choreography stalls the schedule | Nudge-mode tooling in week one; chapters authored in parallel against a locked schema. |

---

## 10. Why this wins

Every tool company says "the product is the hero." Almost none can make the launch page *be* the product. Meridian can, because its product is motion on the web and its launch page is motion on the web — the medium and the message are the same pixels. The page proves the pitch by existing: the film is a real timeline document, the springs scrub because the math is real, the code panel shows the page's own export, and the souvenir you download is the file you just watched.

And the name was waiting for it. A meridian is a line that crosses the world; a playhead is a line that crosses time. We put that line on screen, hand people the transport, and let them discover the page is an instrument. That discovery — *"wait, you can scrub it"* — is the moment people record, post, and talk about.

Read-only file. Write access on request.

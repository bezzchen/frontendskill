# PROPOSAL — `launch_v14_FINAL_final.mer`

**Concept and technical architecture for the Meridian launch page.**
Status: proposal only — nothing here is implemented yet.

---

## 0. TL;DR

The launch page is not a page about a timeline editor. **It is a timeline.**

You land inside what appears to be a Meridian project file — `launch_v14_FINAL_final.mer`, a 60-second, 3,600-frame composition. The scrollbar is the playhead. Scrolling scrubs the launch film; pressing space plays it. As you scrub deeper, the editor chrome materializes around the content and reveals that everything you just watched — every headline, every transition — is real keyframes on real tracks. In the final act the page hands you the tools: a small working editor where you keyframe your own animation, scrub it, and click **Export** to download it as production CSS/JS. Which is the product's entire pitch, proven on your own machine, before you ever sign up.

Technically: a **static Next.js site with a tiny hand-rolled timeline engine** (~6 KB) as the page's single source of truth — a declarative composition data model, a pure frame sampler, and a transport state machine. DOM + CSS transforms + variable-font axes do 90% of the rendering, SVG draws the curves and chrome, one Canvas 2D layer does the two expensive effects. **No WebGL, no Three.js, no GSAP, no scroll-hijack library.** That restraint is not a compromise — it is the marketing: the product exports dependency-free CSS/JS, so the page must be built from exactly the material it sells, and this audience *will* open DevTools to check.

---

## 1. The brief, read closely

**The product.** Meridian is a timeline-based motion editor for the web: visual editing of springs, keyframes, and gesture-driven motion; one-click export to production JavaScript/CSS with no runtime lock-in; live preview across breakpoints with reduced-motion variants built in.

**The audience.** Motion designers, creative developers, design engineers — people fluent in After Effects, Final Cut, Figma, Rive, GSAP. Three traits matter:

1. They are professionally allergic to templated marketing pages. A hero, three feature cards, and a logo wall reads as "the founders don't get it."
2. They evaluate tools by *feel* before features. A claim about spring physics means nothing; a spring they can flick means everything.
3. They inspect. They will open DevTools, read the source, and screenshot what they find. View-source is part of the funnel.

**The page's single job.** Convert this audience into early-access signups by making the page itself the proof of the product's promise.

**The bar the founders set.** "Unforgettable, experimental, people will talk about it." Talk-about-ability is a design requirement, so every major element below is checked against a test: *can someone describe it in one tweet-length sentence?* ("Their whole launch page is a timeline you scrub — then it hands you the editor and you export your own animation as CSS.")

**What we will not do.** The current default for "experimental launch page" is: WebGL shader blob or 3D scene, smooth-scroll library, pinned scroll-triggered sections, oversized serif, grain overlay. It is a look this audience has seen four hundred times and it says nothing about *this* product. Every choice below is instead derived from the product's own world — the vernacular of timeline editors — because that is where distinctiveness that *means something* comes from.

---

## 2. The concept: you didn't open a website — you opened a project file

**Working title: `3,600 FRAMES`.**

The conceit: the visitor has opened a Meridian project — the launch film itself, mid-edit. The browser tab literally reads `launch_v14_FINAL_final.mer — Meridian` (a filename every motion designer has lived). The page is one continuous 60-second composition at 60 fps: 3,600 frames. Time, not scroll distance, is the page's coordinate system.

**The signature element — the Playhead.** A full-height, 1-pixel, signal-red vertical line with a timecode chip (`00:00:00:00`), present from first paint to the end slate. It is the page's mascot, its favicon, its cursor in the timeline zone, and its narrative device: nothing on the page changes except *as the playhead crosses a keyframe*. Cause is always visible. Everything else in the design stays quiet so this one element can carry the identity.

### Act I — the animatic (frames 0–900, "paper")

First paint: a warm-grey drafting ground ("vellum"), ink-line typography, and the composition auto-plays its first six seconds — the wordmark assembles itself from onion-skinned ghost frames, sketch-like, with visible frame numbers, like a pencil test. Then it **pauses itself** on a title card:

> **Motion, on a timeline you can hold.**
> `PAUSED — scroll to scrub · space to play`

The visitor scrolls — and discovers the page doesn't move. *Time* moves. The timecode counts, the ghosts advance, the scrollbar is the playhead. That single second of realization is the hook, and it happens inside the first ten seconds of the visit.

Content in Act I renders in "animatic" state: outlined, onion-skinned, annotated like storyboard margins. This is deliberate foreshadowing — the page will *render* as it plays, because that is the product's arc: sketch to shipped.

```
┌──────────────────────────────────────────────────────────────┐
│  vellum ground · ink lines                    ○ ○ ○  ▍REC    │
│                                                              │
│        ░M░  ▒M▒  ▓M▓  █MERIDIAN█        ← onion-skin ghosts  │
│        f114  f118  f122   f126             assembling        │
│                                                              │
│        Motion, on a timeline you can hold.                   │
│        ‸ scroll to scrub · space to play                     │
│                                                              │
│──────────────█──────────────────────────────────────────────│
│  00:00:02:06 █  ← playhead + timecode, present from frame 0  │
└──────────────█───────────────────────────────────────────────┘
```

### Act II — the hood opens (frames 900–2700, "the render wipe")

At frame 900 the playhead crosses a marker labeled `RENDER`, and the page performs its one big theatrical moment: a **render wipe** — the playhead line sweeps the viewport once and everything behind it converts from vellum/ink animatic into the finished dark "screening room" render. The vellum color doesn't disappear; it becomes the text color. (Material continuity: the paper of Act I is the ink of Act II.)

Simultaneously the editor chrome docks in — a track list rises from the bottom edge, and the visitor sees the truth of the page: **the content they've been scrubbing is clips on tracks.** The headline is a clip named `hero.headline` with visible in/out points. The wipe they just watched is a keyframe pair they can click.

Act II carries the three product claims, each staged as a scene that is *played through*, never merely read:

| Timecode | Scene | Claim proven |
|---|---|---|
| 00:15–00:25 | `spring.demo` — a ball on a spring track. Scrubbing shows interpolation; but the ball is grabbable: flick it and real spring physics take over, and its live curve draws itself in the chrome. A stiffness/damping pair of sliders sits beside it. | Visual editing of springs and gesture-driven motion |
| 00:25–00:35 | `curve.editor` — a real cubic-bezier/spring curve editor drives the section's own entrance. Drag a handle, and the section re-enters with *your* easing. The page is editable mid-visit. | The timeline/curve workflow |
| 00:35–00:45 | `export.demo` — a code panel types out the actual CSS `@keyframes` / WAAPI JS for the animation currently on screen, in sync with the scrub. A button: **Download this page's motion** — it serializes the page's real composition data. Not a canned file. | One-click export, no runtime lock-in |

A fourth, quieter beat: the chrome's variant switcher shows `breakpoint: desktop · motion: full`, and toggling it live-swaps the composition's reduced-motion variant — turning the accessibility feature into a first-class product demo (see §5).

```
┌──────────────────────────────────────────────────────────────┐
│  console dark · vellum text          launch_v14_FINAL_final  │
│                                                              │
│     One-click export to production code.        ┌─────────┐  │
│     ● ————————— spring ball (flick me) ————→    │ @keyfr…  │  │
│                                                 │ 0%{ … }  │  │
│  ┌────────────────────────────────────────┐     │ 60%{ … } │  │
│  │ curve editor: drag handle → section    │     └─────────┘  │
│  │ re-enters with your easing             │                  │
│  └────────────────────────────────────────┘                  │
│╔═════════════════════════█═══════════════════════════════════╗
│║ hero.headline   ◆────◆──█                                   ║
│║ spring.demo          ◆──█──◆———◆                            ║
│║ export.demo             █      ◆————◆        00:00:27:14    ║
│╚═════════════════════════█═══════════════════════════════════╝
└──────────────────────────█───────────────────────────────────┘
```

### Act III — your turn (frames 2700–3400, "the playground")

The chrome expands to fill the stage and the page gets out of the way: a **small, real, working editor**. Three tracks (position, scale, opacity) driving a simple object, a dopesheet where keyframes can be added and dragged, an easing picker (including a spring), and a scrub bar. Ten seconds of play, not a tutorial.

Then the close, in the product's own voice:

> **You just used Meridian.**
> The real one has 40 more tracks, breakpoints, and your design system in it.
> `[ Export what you made — .css / .js ]` `[ Get early access ]`

Export downloads *the visitor's own animation* as clean, dependency-free CSS and a WAAPI snippet. This is the viral artifact: a file on their disk, made in ten seconds inside a launch page, proving the product's core claim. People share files and screen recordings of this; that is the talk-about-ability engine.

### End slate (frames 3400–3600)

The playhead reaches the out-point. Black slate, film-credit type:

> `00:01:00:00 — Made in Meridian. Obviously.`
> Early access · hello@meridian.tools

Scrubbing back remains possible forever; the page is a loop-able artifact, not a one-way funnel.

### Beat sheet (summary)

| Frames | Timecode | Beat | Ground |
|---|---|---|---|
| 0–360 | 00:00–00:06 | Auto-play intro: wordmark pencil-test, self-pause | Vellum |
| 360–900 | 00:06–00:15 | Visitor learns scrub; thesis title card; onion-skin manifesto copy | Vellum |
| 900–960 | 00:15 | **Render wipe** — the theatrical peak | Transition |
| 960–2700 | 00:16–00:45 | Editor chrome; three proof scenes; variant switcher | Console |
| 2700–3400 | 00:45–00:57 | Playground + export + CTA | Console |
| 3400–3600 | 00:57–01:00 | End slate | Black |

Total engaged scrub length: ~8 viewport-heights of scroll. Deliberately compact — long enough to feel like a film, short enough that nobody bails at 40%.

---

## 3. Design language

### 3.1 Palette — colors with jobs, borrowed from the NLE world

Editor colors are semantic, and ours are too. Six named values; nothing decorative:

| Token | Hex | Job |
|---|---|---|
| `--vellum` | `#E9EAE4` | Act I ground; Acts II–III text. Cool drafting-film grey-white — deliberately not the warm cream default. |
| `--ink` | `#17191C` | Act I text and linework |
| `--console` | `#101318` | Acts II–III ground. Blue-leaning charcoal, not pure black |
| `--playhead` | `#FF4633` | The playhead, timecode, record/live states. **Red means time. Nothing else gets red.** |
| `--keyframe` | `#F2B63D` | Keyframe diamonds, interaction affordances ("this is grabbable") |
| `--spline` | `#45D4C8` | Curves, handles, motion trails, interpolation readouts |

Rule: any pixel of `--playhead`, `--keyframe`, or `--spline` must be earning its semantic meaning. This is what keeps the page from reading as "dark site with neon accents."

### 3.2 Typography

| Role | Face | Why |
|---|---|---|
| Display | **Archivo Variable** (wdth 62–125, wght 100–900) | A grotesk with a wide variable-axis space — because the page *animates the axes*. The hero headline's weight and width are themselves tracks on the timeline; kinetic type becomes a product demo, not a styling choice. |
| Body | Archivo (normal width, 400/500) | One superfamily keeps the system disciplined; the display voice is the same face pushed to its extremes. |
| Time / data / chrome | **Spline Sans Mono** | Tabular figures for timecode; and the name is literally what the product edits. This audience will notice, and grin. |

Timecode is set in `MM:SS:FF` SMPTE style, tabular, always. Type scale is deliberately stark: one enormous display size (clamped ~ `clamp(3rem, 9vw, 7.5rem)`), one body size, one chrome-label size. Editors don't have six heading levels; neither do we.

### 3.3 Motion grammar (rules, not vibes)

1. **Nothing animates except by crossing a keyframe.** Every change is attributable to the playhead. No ambient drift, no idle loops (except the flickable spring at rest — physics, not decoration).
2. **Springs for anything the user touches; curves for anything the film plays.** Touch = physical; playback = authored. This distinction *is* the product's worldview.
3. **One theatrical moment** (the render wipe). Everything else is disciplined. Chanel rule applied: we removed the second wipe that was originally planned at Act III.
4. Transforms and opacity only; nothing animates layout.

### 3.4 Copy voice

Plain, specific claims; the cleverness lives in the chrome. The interface speaks like an editor because it is one:

- Buttons: `Play`, `Export .css`, `Go to out-point` (the skip-to-signup affordance), `Get early access`.
- Labels: `PAUSED — scroll to scrub`, `variant: reduced-motion`, `3 tracks · 11 keyframes`.
- The one running joke is the filename. It never escalates.
- Errors and empty states in editor deadpan: playground with no keyframes yet → `Empty track. Click to add a keyframe.`

### 3.5 The details drawer (what this audience screenshots)

- Tab title: `launch_v14_FINAL_final.mer — Meridian`. Favicon: red playhead line on console dark.
- 404 page: the checkerboard **`MEDIA OFFLINE`** slate every editor dreads, with a link "reconnect media → home."
- Loading state (if ever visible): `Conforming…`
- `J / K / L` shuttle keys work (reverse / pause / play, tap L twice for 2×) — unannounced. Arrow keys step single frames. `Home/End` jump to in/out points.
- View-source honesty: the composition data ships as readable, commented source. A code comment at the top of the file: `// yes, this is the real timeline. export yours at /`. DevTools *is* a marketing surface.
- Optional, off by default: `audio scrub` toggle — tiny UI ticks as the playhead crosses keyframes (editors' muscle-memory ASMR). Strictly opt-in, saved to localStorage. No autoplaying sound, ever.

---

## 4. Interaction and shareability inventory

| Interaction | What it proves / why it spreads |
|---|---|
| Scroll-as-scrub with live timecode | The core hook; one-sentence describable |
| Space to play (page plays itself, scroll follows) | "The launch page has a transport" |
| J/K/L, frame-stepping | The love letter to editors; guaranteed tweet from the exact audience we want |
| Flickable spring with live curve readout | Gesture-driven motion, felt not claimed |
| Draggable curve editor that re-animates the page | "I re-eased their launch page" |
| Download this page's motion (real serialization) | No-lock-in claim, proven |
| Playground + export of *your* animation | The viral artifact; a file on their disk |
| Shareable rig URLs (stretch): playground state encoded in the URL hash, so a shared link opens the page with your animation playing as the hero; OG image reflects it | Turns visitors into distributors — stretch goal, see §8 |
| Skip affordance: `Go to out-point` button pinned in chrome | Respect for the impatient = credibility; also the press/investor path |

---

## 5. Accessibility, reduced motion, no-JS, SEO — as demos, not disclaimers

This section is a feature of the concept, not a compliance appendix, because the product itself ships reduced-motion variants as a headline capability.

- **Reduced motion is a variant, and we say so.** `prefers-reduced-motion: reduce` (or the chrome's manual toggle) swaps the sampling strategy: no autoplay, no parallax, no springs; scrubbing reveals content through sub-200 ms opacity crossfades between held poses of the *same composition data*. The chrome displays `variant: reduced-motion — Meridian builds these automatically`. The obligation becomes the ad.
- **Document-first DOM.** All copy is real text in reading order, present at all times; choreography controls visibility, never existence or order. Screen readers get a coherent linear document; decorative chrome is `aria-hidden`; the playground has a keyboard-operable path (select keyframe, arrow-nudge, enter values).
- **Keyboard**: full transport (space, J/K/L, arrows, Home/End), visible focus throughout, all interactive demos reachable and operable.
- **No-JS / crawlers**: the page is statically rendered by Next as the complete document, readable top-to-bottom without the engine. A `<noscript>` line in chrome voice: `Playback requires JavaScript. The script, at least, is worth reading.` SEO and social metadata are conventional and complete; the experience never costs us the index.
- **Touch**: scrubbing is native scroll, so it already works; the spring, curve handles, and playground use Pointer Events with enlarged hit targets; hover-revealed states all have tap equivalents. The mobile composition drops the side-docked panels to a bottom sheet.
- **Vestibular safety beyond the media query**: the only full-viewport motion is the single render wipe; it is a hard cut in the reduced variant.

---

## 6. Technical architecture

### 6.1 Stack

Keep the repo's stack: **Next.js 16 + React 19 + Tailwind 4**, built with `output: "export"` to a fully static site (any CDN; no server required). React renders structure and chrome; it does not run per-frame. Tailwind styles layout and chrome via design tokens declared in `@theme`; **no motion values ever live in Tailwind classes** — motion belongs to the engine.

Additions: zero runtime dependencies beyond React. Two Google-Fonts families, subset and self-hosted via `next/font`.

### 6.2 The engine is the page (and the page is the pitch)

One source of truth: **time.** A ~6 KB hand-rolled engine in three parts. This mirrors the product's own architecture, which makes the source code part of the story.

**(a) Composition — the page as data.** The entire page's motion is one declarative document, shaped like what Meridian itself would export:

```js
// lib/timeline/composition.js (excerpt — illustrative)
export const composition = {
  name: "launch_v14_FINAL_final",
  fps: 60,
  duration: 3600, // frames
  tracks: [
    {
      id: "hero.headline",
      clips: [{
        in: 90, out: 420,
        props: {
          y:          { keys: [[90, 40], [150, 0]],  ease: spring(180, 14) },
          opacity:    { keys: [[90, 0],  [140, 1]],  ease: bezier(.2, .6, .2, 1) },
          fontWeight: { keys: [[120, 100], [240, 700]] }, // variable axis as a track
        },
      }],
    },
    // …every other element on the page
  ],
};
```

Because the chrome renders *from this same data*, the timeline UI is honest rather than a mockup; "download this page's motion" is a serializer over real state; and the reduced-motion variant is an alternate sampling strategy over identical data. One model, four consumers.

**(b) Sampler — a pure function.** `sample(composition, frame) → { elementId: props }`. No side effects, quantized to integer frames (authentic to the medium, imperceptible at 60 fps, and it makes frame-stepping exact and screenshot tests deterministic). Springs use a closed-form underdamped solution; interactive springs use a ~40-line semi-implicit-Euler integrator. Unit-testable in isolation.

**(c) Transport — a small state machine.**

```
IDLE ──autoplay(6s intro)──► PLAY ──any scroll input──► SCRUB
 ▲                            │  ▲                        │
 └────────(reset)             │  └──space / L / play──────┘
                              └──reaches out-point──► ENDED (scrub still live)
```

Inputs: native scroll (primary), spacebar/buttons, J/K/L, arrows, playhead drag on the mini-map. In PLAY, rAF advances the frame and the document scroll position follows passively; any user scroll interrupts to SCRUB instantly. The transport is the only writer of `currentFrame`.

**Frame loop discipline:** one rAF; read phase (scroll position) → sample → write phase (styles). React is bypassed for per-frame updates: components register refs into a binding map at mount, and the loop writes `transform`, `opacity`, and `font-variation-settings` directly. React state changes only on discrete transitions (act boundaries, chrome mount/unmount) via a low-frequency subscriber. No layout reads in the write phase; zero layout thrash by construction.

### 6.3 Scroll strategy — native, honest, damped

- The document's real height creates the scrub range (~8 × 100 dvh). A fixed full-viewport **stage** renders the composition; the scroll offset is nothing but the time input.
- **Native scrolling is retained** — momentum, scrollbar, middle-click, spacebar-page-down, screen-reader scroll commands all keep working. We read `scrollY` in the loop and map it to frames through a critically-damped follower (~90 ms settle) that removes wheel-step jitter without the laggy "smooth-scroll library" feel.
- **No scroll hijacking, no Lenis.** The page never fights the user's input; PLAY mode is the single exception and any gesture cancels it.

### 6.4 Rendering layers

| Layer | Tech | Drives | Budget |
|---|---|---|---|
| Content | DOM, CSS transforms/opacity, variable-font axes | Headlines, copy, cards, all chrome panels | ~90% of everything on screen |
| Vector | SVG | Curve editor, keyframe diamonds, motion trails, track lanes, mini-map | Crisp at any DPI, accessible, cheap |
| Effects | One Canvas 2D layer | Onion-skin ghost trails (Act I), the render wipe, optional grain | DPR-capped at 2; tiered (see 6.6) |
| Physics | ~1 KB spring integrator | Flickable ball, damped scroll follower, playground spring preview | No library |

**Deliberate exclusions, because the exclusions are the message:**

- **No WebGL / Three.js.** The product exports DOM-native CSS/JS; a launch page made of shader canvases would contradict the pitch in the first DevTools inspection. Also: a hard perf floor on mid devices and ~150 KB we don't spend. An award-bait page with *no* WebGL that still stuns is itself a statement this audience will notice.
- **No GSAP / Framer Motion / ScrollTrigger.** The engine is the demo. Importing someone else's timeline into a page about our timeline would be an own goal — and our actual needs (sample + write) are ~300 lines.
- **No cookie banner.** Privacy-respecting, cookieless analytics only. A consent modal over a film is an atrocity; not having one is a detail people mention.

### 6.5 File structure (target)

```
app/
  layout.jsx              fonts (next/font), metadata, theme tokens
  page.jsx                server-rendered full document (SEO / no-JS baseline)
  not-found.jsx           MEDIA OFFLINE
  opengraph-image.jsx
lib/timeline/
  composition.js          the page as data — tracks, clips, keyframes
  sampler.js              pure sample(composition, frame)
  transport.js            state machine + input adapters (scroll, keys, drag)
  springs.js  easings.js  math, ~1 KB each
  serialize.js            composition/playground → CSS @keyframes + WAAPI JS
components/
  Stage.jsx               fixed stage, ref-binding map, the rAF loop
  chrome/                 Playhead, Timecode, TransportBar, TrackList,
                          CurveEditor, Minimap, VariantSwitcher
  acts/                   Act1Animatic, Act2Editor, Act3Playground, EndSlate
  playground/             dopesheet, easing picker, exporter UI
```

### 6.6 Performance budget (hard numbers, enforced in CI)

| Metric | Budget |
|---|---|
| JS shipped (gz) | ≤ 90 KB total (React+Next ~55, engine ≤ 8, chrome/acts ≤ 25, zero animation deps) |
| Fonts | ≤ 70 KB, two families, subset axes (Archivo wght 100–900 / wdth 62–125; mono regular+medium), preloaded |
| LCP | ≤ 1.8 s mid-tier mobile — hero is server-rendered DOM text, paints before hydration |
| Scrub frame time | p95 ≤ 12 ms on M1 Air *and* a throttled mid-range Android |
| CLS | 0 — fixed stage, reserved heights |
| Canvas | DPR ≤ 2; effects tiered: measure the first 60 frames, drop ghost-trail density, then grain, if p95 > 12 ms |

The DOM/CSS core must scrub at 60 fps with the Canvas layer entirely off — effects are garnish by construction, so low-end devices degrade to "merely elegant."

### 6.7 Signup + deploy

Static export to any CDN. Early-access form posts to the founders' choice of list provider (Buttondown/ConvertKit-style endpoint) or one serverless function if hosted on Vercel — the page itself stays static either way, with `mailto:` as the no-backend fallback. OG image is static v1 (playhead mid-timeline); per-rig dynamic OG only if the stretch URL feature ships.

---

## 7. Verification plan

- **Unit**: sampler (keyframe edges, clip boundaries, spring math, variant sampling) and serializer.
- **Round-trip test** — the honesty guarantee: exported CSS/WAAPI, evaluated, must reproduce the sampler's values within tolerance at N random frames. If the export lies, CI fails.
- **E2E (Playwright)**: scrub to frames {0, 900, 1800, 2700, 3600} and screenshot-diff (frame quantization makes this deterministic); transport keys; playground add/drag/export produces a parseable file; reduced-motion variant snapshot; axe pass on every act; no-JS render contains all copy.
- **Perf CI**: Lighthouse budgets (§6.6) on every PR; manual device pass (mid-range Android, older iPad, Safari) before launch.
- **Human pass**: one motion designer and one non-designer (investor proxy) walk the page; the non-designer must reach the CTA unassisted in under 90 seconds.

---

## 8. Risks, mitigations, cut lines

| Risk | Mitigation |
|---|---|
| Scroll-scrub reads as scroll-jacking | Native scroll retained; page never moves without explicit Play; compact 8-viewport length; persistent `Go to out-point` skip |
| Motion sickness / sensory overload | One full-viewport effect total; first-class reduced variant + manual toggle in chrome; no autoplaying sound |
| Confuses non-designer visitors (press, investors) | Copy stays plain-language; document reads top-to-bottom as normal text; chrome is progressive (Act II onward); skip affordance |
| Playground scope blowout | It is Act III's isolated module; v1 ships with 2 tracks + easing picker + export and is still the story's payoff |
| Perf on low-end devices | Effects tiering (§6.6); DOM core is the contract, Canvas is garnish |
| Scroll-scrub is itself a known pattern (Apple et al.) | True — scrub is only the entry ramp. The differentiators are honesty (real chrome, real data, re-editable page) and the export artifact. Named here so nobody mistakes the ramp for the concept |
| Variable-font axis animation is janky on some Android builds | Axis tracks degrade to static weight + transform-only motion via capability check |

**Cut lines, in order, if the schedule slips:** (1) shareable rig URLs, (2) audio-scrub toggle, (3) Act I onion-skin canvas (falls back to CSS-outline ghosts), (4) playground shrinks to one pre-built rig with editable easings only. **The playhead, the scrub, the render wipe, and a working export are not cuttable** — they are the concept.

---

## 9. Alternatives considered

1. **The decomposing film** — a beautiful launch film plays, then rewinds and replays with editor chrome fading in, exposing its own keyframes. Cinematic, and Act II borrows its reveal — but as a whole it is passive; the visitor watches Meridian instead of touching it. Rejected as the spine, absorbed as a beat.
2. **Cursor-as-playhead** (pointer x = time). Seductive demo, but hostile on touch, kills reading comprehension, and the gimmick decays in ~15 seconds. Rejected.
3. **WebGL spectacle** (particle wordmark / 3D timeline flythrough). Maximum initial wow, zero product truth, contradicts the no-lock-in pitch at inspection time. Rejected on identity grounds, not just perf.
4. **The straight premium marketing page, executed perfectly.** Safest path, and the founders explicitly asked for the opposite. Kept as the mental control group: any beat that survives only because it is "experimental" gets cut and rebuilt from the product truth instead.

---

## 10. Plan and milestones

| Milestone | Scope | Gate |
|---|---|---|
| **M0 — Engine spike** (week 1) | Transport + sampler + damped scroll mapping driving the hero block; measured on target devices | p95 frame ≤ 12 ms or we re-architect before building on top |
| **M1 — The film** (weeks 2–3) | Acts I–II complete: composition data, chrome components, render wipe, three proof scenes, copy v1 | Full scrub-through, reduced variant working |
| **M2 — The payoff** (week 4) | Act III playground, serializer + export, end slate, 404/OG/details | Round-trip test green |
| **M3 — The polish** (week 5) | A11y pass, perf tiers, E2E suite, device lab, easter eggs, copy final | Budgets green in CI; human pass complete |
| Launch buffer (week 6) | Founder review, press kit (a 30 s screen capture of the scrub — the trailer is free, it's the page), stretch goals if green | — |

---

## 11. Open questions for the founders

1. **Brand assets** — is there an existing wordmark/logo, or does the pencil-test wordmark in Act I effectively design it? (We're happy either way; the assembly animation works for any mark.)
2. **Chrome fidelity** — stylized "Meridian-flavored" editor chrome (recommended: doesn't age as the product UI evolves, and reads better at marketing scale) vs. pixel-faithful product UI?
3. **Signup backend** — which list provider, or a Vercel function?
4. **Sound** — ship the opt-in audio-scrub ticks, or hold for v1.1?
5. **Shareable rig URLs** — worth pulling into v1 if M2 lands early? It is the strongest distribution loop on the board.
6. **Open-sourcing the engine** post-launch as `@meridian/frames` — a 6 KB scroll-timeline engine with our name on it is durable top-of-funnel with this exact audience. Decision can wait until after launch.

---

*Proposal ends. Nothing implemented yet — awaiting concept sign-off before M0.*

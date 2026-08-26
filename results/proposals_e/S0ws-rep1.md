<!-- run: S0-register-recognition | condition: with_skill_v1 | rep 1 | model claude-fable-5 | 2026-08-25 | fixture launch-page-base 3543ef9 (fresh copy) | protocol evals/withskill_protocol.md | captured verbatim from agent final report; agent's commissioned research sweep was orchestrator-relayed after a notification-routing stall (documented in wave record) -->

The relayed report is indeed the sweep I commissioned — catalog fit-gate evidence (React Bits, Fancy Components, SmoothUI), substrate versions and maintenance status, platform support, and Next 16 facts, all verified 2026-08-25. Key inputs I'm acting on: no catalog ships a timeline/keyframe editor or true temporal onion-skinning (custom build justified); Theatre.js is dormant; Firefox still lacks CSS scroll-driven animations in stable, so a JS scrub path is mandatory anyway; Turbopack is the default bundler for dev and build; float render targets are safe on our browser floor. Sanity checks done: proposal grounded against the actual repo (Next 16.2.12 / React 19.2.8 / Tailwind 4.3.3, plain JSX, no animation deps, boilerplate copy with real product claims), register weighed per the architect skill, design direction passed through the design-director cliché check. The full proposal follows.

---

# Proposal — `launch.meridian`: the page is a Meridian file

**Concept in one sentence.** Meridian's launch page is not a page about a motion editor; it is a Meridian composition someone left open — scroll is the playhead, a real timeline drawer sits at the bottom showing the actual keyframes of the page you're looking at, and you can drag them and re-direct the page you're standing on.

The audience (motion designers, design engineers, AE/Rive refugees) doesn't need to be told what a timeline is. They need to feel one, on the web, and be trusted with the controls. The talkable moment is not a shader — it's the instant a visitor drags a keyframe diamond and the live page re-choreographs itself.

## Register decision

The brief signals unforgettable / experimental / full license — the spectacle question must be answered explicitly, and I choose **S: Spectacle**, knowingly. The realtime graphical system — a deterministic timeline evaluator driving the whole page, procedural onion-skin typography, an editable document — *is* the structural core, and interaction (scrub velocity, keyframe drags, track mutes, play mode) materially changes it. That satisfies S without a WebGL-tunnel centerpiece: I explicitly weighed the "full-viewport GPU takeover" version (GPU text via three.js r185 + troika-three-text 0.52.5, screen-space accumulation smear) and rejected it — rendering DOM content into GL is not viable, duplicated GL text costs a11y/SEO fidelity, and the neon-smear look is the genre default. Spectacle here is *temporal*, not luminous. One contained GL surface remains (the stage, below).

## The experience

One composition: **72 seconds at 24fps** (~1,730 frames), mapped to ~10,000px of native scroll (~135px/s). Persistent chrome: comp name `launch.meridian` top-left (with a "modified" dot once the visitor edits), a running SMPTE timecode, and a bottom **transport bar** (play, timecode, region ticks) that expands into the full **timeline drawer** — tracks, clips, keyframe diamonds, exactly the product's grammar.

- **SHOT 00 — Poster frame (0–8s).** The light table flicks on. MERIDIAN sets itself letter-by-letter; one line of instruction: *"You're holding the playhead. Scroll."* Scrub back and forth — it reverses perfectly, and fast flicks leave blue onion-skin ghosts. Press **Space** and the page plays itself at 1×, auto-advancing the scroll. Motion people will try Space within ten seconds; the page rewards them.
- **SHOT 01 — The claim (8–20s).** Manifesto lines keyed like animatic slates: web animation is authored blind — code, refresh, squint; Meridian gives the web what film has had for a century.
- **SHOT 02 — Keyframes (20–34s).** The word KEYFRAME tweens between two poses. Copy: *"Open the timeline. Drag my keyframes."* The visitor retimes/re-eases the shot they're inside. Snapping at 1/24s. Undo works. This beat is the whole launch.
- **SHOT 03 — Curves & springs (34–46s).** An easing curve editor on the page bends the ease this very shot uses; a spring toggle swaps the interpolator (product claim: springs, keyframes, gesture-driven motion).
- **SHOT 04 — Tracks (46–58s).** Mute/solo the page's own tracks. Muting COLOR desaturates the site; muting TYPE hides the copy (and the page has one dry line about it when restored). Non-destructive layering, demonstrated.
- **SHOT 05 — Export (58–66s).** A live panel compiles the *current, possibly visitor-edited* document to plain CSS `@keyframes` as you scrub — the "one-click export, no runtime lock-in" claim, proven on the page's own motion. Buttons: **Download launch.meridian** and **Copy as CSS**.
- **SHOT 06 — End slate (66–72s).** Credits roll like film credits, timecode runs out, CTA: private beta email capture (`hello@meridian.tools` fallback).

Extras that make it spread: deep links (`#t=00:00:42:12` seeks on load — people will link each other to moments), a keyboard map (←/→ frame-step, [ ] shot jump, ? shortcut sheet), `window.meridian.doc` in the console, and the reduced-motion story below.

## Design direction

The visual world is **the animator's light table**, not the genre's dark room. (Design-director self-check: my first instinct — near-black stage, single acid accent — is the recognized AI-default look; revised to the craft-specific direction below. The other default, cream + serif + terracotta, is also avoided: this ground is cool and luminous, not warm paper.)

- **Palette:** `--lightbox #F4F7F8` (backlit ground), `--ink #1A1C1E`, `--blue-pencil #5B8DC4` and `--blue-faint #D3E2EF` (col-erase blue: construction lines, registration grid, past-frame ghosts, inactive keyframes), `--cue-red #E5484D` strictly as the system color for *now* — playhead, selection, record dot. Color encodes time: past is blue, now is red, content is ink. Dark mode is "lights off in the studio": the room goes `#101214` while the stage remains a lit panel — the metaphor strengthens rather than inverts.
- **Type:** one variable family, **Recursive** (Google Fonts; MONO, CASL, wght, slnt axes), self-hosted via `next/font`. Timecode and labels sit at Mono-Linear; display sets heavy Casual; and in SHOT 02 the axes themselves are keyframed — the typography is literally an interpolation demo. Single-family purity is the deliberate aesthetic risk; the axis range does the differentiation, and axis animation is confined to hero lines at throttled update rates (variation-settings changes cause re-raster; they stay out of the per-frame hot path).
- **Layout:** a hairline vertical **meridian** rule the content registers against — track labels and timecodes hang left of it, content right, like margin annotations on exposure sheets. Shots carry in/out timecodes as eyebrows; the numbering is justified because the page genuinely is a sequence.
- **Copy voice:** imperative, craft-forward, no hype; controls say what they do ("Drag my keyframes", "Download launch.meridian").

## Technical architecture

One owner per concern, one clock, no second engine anywhere.

1. **Document.** `launch.meridian.json` — typed schema (zod-validated at build): composition `{fps, duration, regions[], tracks[{id, target, clips[{t0,t1, channels{prop: keyframes[{t, v, ease}]}}]}]}`. Eases are cubic-bezier or closed-form damped springs with velocity continuity. This file is the page; ideally the founders export it from Meridian itself (open question below).
2. **Clock.** Scroll is the single source of time: `time = f(scrollY)`, critically-damped playhead smoothing ≤ ~100ms (we smooth the *time value*, never hijack the scroll — no Lenis, no wheel interception; the native scrollbar stays truthful). Play mode advances by driving `scrollTo` each frame, so time still derives from scroll; any user wheel/touch cancels play. A velocity estimator feeds ghost spacing and axis effects.
3. **Evaluator.** Pure `(doc, t) → propMap`, binary-search keyframe lookup, ~400 lines. Because it's pure, we can evaluate at `t − kΔ` — onion-skin ghosts are *honest past states of the document*, not screen-space blur.
4. **Renderers** (subscribers; React is not in the hot path):
   - **DOM renderer** writes transform/opacity/CSS-vars straight to refs on the real server-rendered content nodes. Ghosts are a pooled set of 3–5 `aria-hidden` clones per display line, blue-tinted, sampled at past times, opacity-0 (zero cost) at rest.
   - **Stage renderer:** one full-viewport canvas behind content — raw **WebGL2**, no library (~200 lines: fullscreen triangle, backlight gradient responding to velocity, paper grain, registration grid, optional half-float ping-pong accumulation for graphic-element trails; `EXT_color_buffer_float` is safe on our floor — iOS 15+ per BCD, and Next 16's own floor is Safari 16.4). Shaders as inline template literals (Turbopack is the default bundler for dev *and* build; no loader config needed). Context-loss → CSS gradient fallback.
   - **Timeline UI:** React (drawer, tracks, SVG diamonds and curve editor), reading playhead/doc via `useSyncExternalStore` from a hand-rolled ~40-line store. Mobile gets transport bar + region jumps + play + ghosts; keyframe dragging is pointer-precision work and stays desktop-only.
5. **Editing.** Reducer over the document (immutable), bounded undo (Cmd/Ctrl-Z), 1/24s snap, value/time clamps so no edit can NaN the page, localStorage persistence, prominent Reset, Export = serialize current doc + compile to CSS `@keyframes` (springs sampled).
6. **Next 16 integration.** The route stays a Server Component rendering the complete semantic copy in document order (SEO/no-JS baseline — the current `page.jsx` content survives as this layer). The experience mounts as one client island via a Client-Component wrapper doing `dynamic(..., { ssr: false })` — required, since `ssr:false` errors inside Server Components on 16.x. LCP is server HTML; the island enhances it and never blocks first paint. React Compiler stays off; the hot path bypasses React entirely.

**Pause discipline (non-negotiable, designed-in):** a single demand-driven rAF ticker that runs only while a frame is dirty — scrolling, playing, editing, or GL decay draining — and stops *entirely* at rest: zero ticks when idle, when `document.hidden`, or once a sentinel past the comp end (credits/footer) intersects and parks the stage canvas. No library ticker exists to forget (the raw-GL choice means there is no Pixi `Ticker.shared` — which autostarts in 8.20 — to disable).

**Degradation ladder:** `prefers-reduced-motion` is a *product demo*, not a downgrade — the page swaps to its own reduced-motion variant (opacity-only keys, no ghosts, no smoothing, play disabled with the note *"Reduced motion is on. Meridian ships these variants automatically — you're looking at one."*), mirroring the product's built-in reduced-motion claim. No WebGL2 → CSS stage. No JS → the full semantic document. Keyboard: Space (scoped so form fields keep it), arrows, Home/End; timeline controls are native buttons/sliders with ARIA; region changes announced politely.

## Adopt / adapt / reference-only / custom (checked 2026-08-25)

| Need | Checked | Verdict |
|---|---|---|
| Timeline/keyframe editor UI | React Bits (~220 comps), Fancy Components (38), SmoothUI (~130, sampled) | None exists anywhere — **custom** (it is also the product's identity) |
| Temporal echo / onion skin | Same catalogs; nearest: React Bits *Echo Text* (text-only, cursor-driven, own rAF), cursor trails | **Custom** — ghosts must sample the document, not the cursor; catalog comps embed their own engines (GSAP 3.13+ / Motion v13), violating single-owner |
| Text effects | 33 + 20 + 3 across catalogs | **Reference-only** for choreography ideas |
| Evaluator substrate | GSAP 3.15 (now fully free) | **Rejected** — the timeline must be a serializable, two-way-editable document; deriving an editor UI from GSAP internals fights the tool, and adopting it would put two engines near one concern |
| Web timeline tooling | Theatre.js | **Rejected** — dormant (core 0.7.2, May 2024; repo quiet since Aug 2024), and building Meridian's launch on someone else's motion editor is negative talkability |
| GL wrapper | three r185 + troika 0.52.5 (healthy), Pixi 8.20, OGL 1.0.11 (~16 months quiet) | **Rejected/none** — with GPU text cut, a raw ~200-line WebGL2 stage beats importing any of them |
| Smooth scroll | Lenis 1.3.26 (healthy) | **Rejected on principle** — smooth the playhead, not the scroll |
| CSS scroll-driven animations | Chrome 115+/Safari 26; Firefox stable: still not shipped | **Not used** — a JS path is mandatory for Firefox regardless, and editability requires the JS evaluator anyway |
| Easing math | bezier-easing (v2 = 2M dl/wk standard; v3 changelog unverified) | **Adopt, pinned to 2.x** |
| Env skills | `scroll-world` (pre-rendered video scrub) | **Rejected** — pre-rendered video would falsify the "live motion engine" proof; `frontend-design` loaded as the sole design director |

## Budgets, risks, verification

**Budgets:** island JS ≤ 90KB gz (no engine imports makes this comfortable; enforced via size-limit in CI); 60fps scrub on a Pixel-6a-class phone; DPR cap 2 (1.5 mobile); accumulation FBO at half res; zero rAF ticks at rest (instrumented, see below).

**Risks and cut-lines, in cut order:** curve-editor popover → preset eases; live CSS-compile panel → pre-compiled static sample; dark-room mode → light only; track solo (mute stays). Never cut: scrub-as-time, draggable keyframes on SHOT 02, play mode, the PRM variant, pause discipline. Other named risks: scroll-jack aversion (mitigated by design — no wheel interception), iOS programmatic-scroll jank in play mode (per-frame `scrollTo`, cancel-on-touch; test in P0), Space-key scoping, GL context loss (handled), Firefox always on the JS path (it's the only path).

**Verification plan** — every behavioral claim gets tested under its actual condition, via Playwright + a `window.__meridian.debug` frame counter: (1) idle drain — no input 2s → counter frozen; (2) offscreen park — really scroll past the end sentinel → stage stopped (not a `document.hidden` proxy); (3) hidden — background the tab via CDP lifecycle state → frozen, as a separate test; (4) PRM emulation → no ghost nodes exist, no autoplay, opacity-only computed styles; (5) drag a keyframe → computed style at fixed t changes, undo restores; (6) wheel during play cancels play; (7) scripted violent scrub → long-frame count under threshold; (8) `curl` the route → full copy, in order; (9) focused email input + Space → types a space. No claim ships unobserved.

**Plan:** P0 spike 2–3d (clock + evaluator + DOM renderer + SHOTs 00/02 + transport — validates the feel before anything else is built); P1 drawer UI 4–5d; P2 remaining shots + springs 3d; P3 stage canvas 2d; P4 export/deep-links/ladders/mobile 3d; P5 polish + verification suite 2–3d. Roughly 3.5 weeks solo, ~2.5 with a second dev on P1.

**Open questions for the founders:** (1) Can Meridian itself export/import this document format, even partially? If yes, `launch.meridian` becomes literally true and the story writes itself. (2) Where does the beta email go (endpoint vs. mailto)? (3) Is there existing brand to respect, or does this launch look define it? (4) 24fps timecode and the credits content need their sign-off.

The one-line pitch back to them: everyone else's launch page *describes* their tool; this page is a file made *in* yours, handed to the internet with the timeline still open.

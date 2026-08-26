<!-- run: S0-register-recognition | condition: with_skill_v1 | rep 2 | model claude-fable-5 | 2026-08-25 | fixture launch-page-base 3543ef9 (fresh copy) | protocol evals/withskill_protocol.md | captured verbatim from agent final report -->

The baseline page is a plain placeholder (hero, three feature bullets, footer email) — but its copy gives me real product facts to build on: springs/keyframes/gesture motion, export to production JS/CSS with no runtime lock-in, live preview across breakpoints, and notably "reduced-motion variants built in," which I'll turn from a compliance chore into an on-brand feature of the page itself.

Here is the proposal.

---

# Meridian launch page — concept & architecture proposal

## 0. Ground truth (inspected)

`package.json`: Next 16.2.12, React 19.2.8, Tailwind 4.3.3 (v4 PostCSS), plain JavaScript, App Router with a single static `app/page.jsx`. Zero animation/graphics dependencies installed. Everything below is greenfield. Per the freshness rule, exact APIs of any library we adopt get re-verified against installed versions at build kickoff, not assumed from memory.

## 1. Register decision — S (Spectacle), chosen knowingly

The brief explicitly asks for unforgettable/experimental, from founders granting full license, for a product whose entire subject is motion. I weighed all three registers:

- **Q (Quiet)** — rejected: a category mismatch. A motion editor with a static launch page is self-refuting.
- **W (Expressive)** — the fallback: one signature scroll choreography over an editorial page. Safe, forgettable-adjacent. Rejected as the primary, retained as the reduced-motion/low-tier variant.
- **S (Spectacle)** — **chosen.** The realtime system is structurally central: every pixel of the page is evaluated from a single time value the visitor controls, and interaction (scrubbing, retiming, playing) materially changes the system. Note spectacle here is *not* 3D-for-3D's-sake — it's a deterministic choreography runtime plus one GPU scene, in service of the product's core loop: time in, motion out.

The escape valve that makes S responsible: the whole experience degrades to a W-register editorial page (same DOM) under reduced-motion, no-JS, or weak hardware. The product literally advertises "reduced-motion variants built in" — the page practicing that is part of the pitch.

## 2. The concept: **"This page is a Meridian project."**

**Logline:** You don't land on a website about Meridian. You land inside Meridian, with a project called `first_light.mer` already open — and the project is the launch page itself.

The viewport is framed by minimal editor chrome: a top bar (wordmark, filename, transport controls, SMPTE timecode running in real frames), and docked at the bottom, a **real, functional timeline** — tracks, named clips (`HERO`, `MANIFESTO`, `CURVES`, `CRAFT`, `CTA`), keyframe diamonds. The center "canvas" is the marketing narrative.

**Scroll is scrub.** There is no conventional page scroll; the native scroll position maps to the playhead of a fixed ~60-second document. Scrub forward, the film advances; scrub backward, it runs perfectly in reverse — because everything is a pure function of `t`. Motion designers will feel the difference between this and ordinary scroll-triggered pages within two seconds of touching it.

**The unforgettable part: the page is editable.** Drag a clip on the timeline and you retime the page's own choreography — stretch the `HERO` clip and the headline assembles in luxurious slow motion on your next scrub. Press space and the page *plays itself* like a title sequence. Press `,` / `.` and you frame-step a *website*. And in the File menu: **"Export project" downloads `first_light.mer`** — a real JSON serialization of the page's own timeline document (near-free to build, since that document is the page's actual source of truth; when Meridian ships import, this file should open). That's the screen-recording people post.

### The beats (t = 0 → 60s)

1. **OPEN (0–4s)** — sub-second real boot: chrome materializes, playhead at 0, timecode ticking on first scrub. Headline set in a variable font whose weight/slant axes are driven by scrub velocity — type that is literally in motion. Copy direction: "The web has a timeline now."
2. **MANIFESTO (4–18s)** — typographic scenes: motion as a language the web forgot; lines keyframe in/out, visibly corresponding to diamonds passing under the playhead below.
3. **CURVES (18–34s)** — the GPU centerpiece: tens of thousands of particles form an easing curve as terrain; the playhead drags value across it, particles flowing along the interpolation field. Pointer input bends the curve's virtual handles — and the scene's own type re-eases live using the ease you just shaped. "You just designed an easing. It's already applied."
4. **CRAFT (34–50s)** — the mise-en-abyme product shot: the canvas zooms out to reveal this very page open inside Meridian's actual editor UI — the product screenshot *is* the page, recursively. Product truths land here (export to production JS/CSS, no runtime lock-in, breakpoint preview, reduced-motion variants).
5. **CTA (50–60s)** — the timeline shows one final empty clip labeled `YOUR PROJECT HERE`. "Get early access." Footer facts from the current page carry over.

## 3. Visual direction (provisional — design director owns the final call)

Editor-noir: near-black UI ground, one signal accent reserved exclusively for the playhead and everything it "energizes"; engineering-grade grotesk for chrome; one variable display face for canvas scenes (must have meaningful `wght` + slant/optical axes — an architectural requirement, since axis choreography is a beat). All copy is real DOM text — selectable, indexable, crisp. **The GPU never renders typography**; it renders light, particles, and the scrub-smear. This is a hard boundary I'm setting; palette/type specifics are not this skill's call.

## 4. Technical architecture

### 4.1 One clock, one owner per surface

```
input:   wheel/touch (native scroll pos) ─ Lenis smoothing ─┐
         keyboard (space , . arrows) ───────────────────────┼─→ Conductor (single clock, t)
         timeline drag / transport ─────────────────────────┘        │
                                                                     ▼
model:   TimelineDoc (tracks→clips→channels→keys)  ←— edits (drag clip/key, undo)
                                                                     │
sampler: sample(doc, t) → FrameValues        (pure, deterministic)   ▼
                                       ┌──────────────┬──────────────┬───────────────┐
render:  DOM/CSS scenes (CSS vars,     │ WebGL layer   │ Timeline UI  │ React         │
         transforms/opacity on refs)   │ (OGL, custom  │ (SVG/DOM)    │ (structure &  │
                                       │ shaders)      │              │ non-scrub UI) │
                                       └──────────────┴──────────────┴───────────────┘
```

Ownership rules (non-negotiable in the skill, enforced by module boundaries):
- **Conductor** is the only writer of `t`. Scroll, keyboard, transport, and timeline drags all feed it; nothing else animates anything.
- **Sampler** is the only source of animated values, DOM and GL alike. React never animates a scrub-driven property; per-frame writes bypass React entirely (direct style/CSS-var writes on refs, uniform writes on the GL program). React owns structure, menus, and non-scrub state only — no re-render per frame.
- **Lenis** owns exactly one concern: input smoothing of native scroll. We use `position: sticky` viewport + tall runway (duration × px/s), never `preventDefault` — the scrollbar stays honest; this is scroll *mapping*, not hijacking.
- **OGL** (or raw WebGL2) owns the GPU layer. Chosen over three.js/R3F (ecosystem we don't need, reconciler cost we don't want) and over Pixi (whose shared ticker runs by default — exactly the failure mode non-negotiable #1 exists for; OGL ships no ticker, so our Conductor is structurally the only loop).

### 4.2 The document model — why the page is editable

```ts
Doc     = { fps: 60, duration: 60, tracks: Track[] }
Track   = { id, name, clips: Clip[] }
Clip    = { id, name, start, duration, channels: Channel[] }
Channel = { target, prop, keys: Key[] }   // target: data-clip selector or GL uniform path
Key     = { t, value, ease: Bezier | Spring | Step }
```

Authored as data, not scattered tweens. Timeline UI edits produce a new doc (structural sharing → trivial undo stack); the sampler just reads whatever doc is current. Retiming, the `.mer` export gag, and the recursion beat all fall out of this one decision. Total duration stays fixed in v1 (clips move/stretch within 60s) so the scroll runway never resizes under the user.

**Scrub determinism:** cubic-bezier evaluated directly; springs via the closed-form damped-harmonic solution, *not* stateful integration — so `sample(doc, t)` is pure and backward scrubbing is exact. (Also a quiet flex: Meridian's product does springs on a timeline; here's the math working.)

### 4.3 Rest is zero — the pause architecture (skill non-negotiable #1)

The Conductor is a state machine: `resting` (no rAF scheduled at all), `scrubbing` (rAF while |targetT − t| > ε), `playing` (rAF, t += wall-clock dt). It auto-returns to `resting`; an idle page burns **zero** CPU. `visibilitychange` suspends `playing` and cancels any pending frame. The GL scene renders only when its clips are active in the current t-window (canvas skipped entirely otherwise); since the canvas is viewport-fixed, "offscreen" here means t-window inactivity plus document visibility, and both gates exist. No library ticker exists anywhere in the stack to leak around this. Optional audio is opt-in and suspends its context on hidden.

**Verification plan (non-negotiable #2 — under the actual condition, before any claim ships):** a `?debug=1` HUD exposing rAF-active flag, draw calls/frame, and `t`. Protocol: (a) physically switch tabs and confirm via the HUD + a Performance-panel recording that the loop stopped — not by flipping `document.hidden` in code; (b) scrub to a non-GL t-range and confirm draw calls hit 0; (c) idle 5s at arbitrary t and confirm a flat CPU trace. Nothing gets reported as "pauses" until observed doing so.

### 4.4 Next.js 16 integration

- Full narrative SSR'd as semantic HTML in RSC; the choreography layer targets `data-clip` attributes, so server HTML remains the content source of truth (SEO, no-JS reading experience intact — with JS off the page is a clean editorial document).
- Client islands only for `ScrubController`, `TimelineDock`, `GlLayer`, transport. Clock state in a module-scope store with imperative subscribe (no per-frame React work).
- Shaders as TS/JS template-literal exports — zero Turbopack loader config, no raw-import syntax risk.
- Fonts self-hosted via `next/font` (variable axes required, per §3).
- GL init deferred to idle/first-interaction; LCP is the SSR'd hero text, not the canvas.

### 4.5 Degradation ladder

| Condition | Experience |
|---|---|
| `prefers-reduced-motion` | Same DOM, W-register static editorial layout; timeline dock becomes a section table-of-contents (the metaphor survives, motion doesn't). On-brand per the product's own copy. |
| No JS / crawlers | Full semantic document. |
| Touch/mobile | Native scroll scrubs; dock collapses to a 44px playhead strip (tap-to-jump; clip dragging desktop-only); particle tiers by DPR/cores heuristic + live downgrade if first frames < 30fps. |
| WebGL unavailable | CURVES falls back to an SVG/CSS curve scene; page fully functional. |
| Keyboard/a11y | Playhead as ARIA slider; space/arrows/frame-step; full focus order in dock and menus. |

### 4.6 Budgets

Experience JS beyond the Next baseline ≤ 60KB gz (runtime core ~4KB, Lenis ~4KB, OGL ~30KB, page code); total JS ≤ 180KB gz. LCP < 1.5s (text). 60fps scrub on M-class laptops, 30fps floor mid-mobile. INP < 200ms: input handlers only write `targetT`; all work in rAF; layout metrics cached at resize; transforms/opacity only, `will-change` applied on clip-enter and removed on clip-exit.

## 5. Adopt / adapt / reference-only / custom (fit gate, what I checked)

| Need | Checked | Verdict |
|---|---|---|
| Scroll smoothing | Lenis; GSAP ScrollTrigger | **Adopt Lenis** (substrate, single concern). ScrollTrigger rejected: brings a second engine adjacent to our clock. |
| Timeline engine | GSAP (excellent sampler, but runtime doc-editing round-trips awkwardly and it would co-own our editable doc's concern — rejected on single-owner grounds, not quality; licensing terms to re-verify anyway); **Theatre.js** (closest prior art — a web timeline editor, but its studio UI can't masquerade as *our product's* UI and maintenance is uncertain → **reference-only** for its sequencing data model); **Remotion** (per-frame React render model wrong for 60fps scrub over DOM+GL → reference-only for frame-determinism discipline) | **Custom** (~200-line sampler + doc model). The editable-timeline concept requires owning the document. |
| GPU particle/curve scene | Paper Shaders (ambient wallpaper materials — wrong register); drei (R3F-only, not our stack); React Bits / Fancy Components / SmoothUI effect catalogs (their particle/text effects own their own rAF and timing — adopting any would break the single-clock contract) | **Custom on OGL** — the scene must be a pure function of `(t, curveParams)`; no catalog effect offers that contract. Catalogs remain visual reference only. |
| NLE timeline UI | Same catalogs — none ships an editor-grade timeline; Radix/shadcn slider referenced for ARIA semantics | **Custom SVG/DOM.** |
| UI micro-motion (menus, buttons) | Motion (Framer Motion) | Optional **adopt**, strictly confined to discrete UI transitions — never touching scrub channels. Default: skip; CSS suffices. |

"Custom core" is the honest outcome of the gate here, and it doubles as narrative: the page runs on a mini-Meridian runtime.

## 6. Risks, de-risk order, build sequence

1. **Scrub jank on DOM scenes** — highest risk. Phase 1 builds Conductor + sampler + one type scene and profiles before anything else exists.
2. **CURVES underwhelms** — built as a standalone sketch in parallel (Phase 2); kill-switch: ship playhead-light GL only.
3. **Edit-scope creep** — v1 edits = move/stretch clips + move keyframes. Curve editor is a post-launch easter egg.
4. **Audio autoplay policies** — mute-first, strictly opt-in, or cut entirely.
5. **SEO of a scrubbed page** — mitigated by SSR-first content; verify with rendered-HTML checks in Phase 4.

Phases: (1) runtime core + one scene + perf gate → (2) timeline dock UI + editing + GL sketch → (3) all five beats + CRAFT recursion + play mode → (4) degradation ladder, a11y pass, budgets, verification protocol → (5) polish, easter eggs (`.mer` export, frame-step), copy with design director.

## 7. Open questions for the founders

1. Audio: opt-in soundtrack for play mode, or fully silent v1?
2. How much edit power do we hand visitors — clips only (recommended), or keyframes too?
3. Is a real `first_light.mer` schema alignment with the product feasible pre-launch, or do we ship it as a forward-compatible gag?
4. Any brand system constraints, or is the design director green-field on palette/type?

---

Sanity check against the ask and the loaded skill: the brief asked for concept + technical architecture with no implementation — nothing was implemented (repo untouched beyond reads); the spectacle register was explicitly weighed and chosen with a stated escape valve; pause-when-hidden/offscreen is designed in with a real-condition verification protocol rather than a claim; the adopt-vs-build fit gate was run with named catalogs/substrates and citations; engine ownership is one-per-concern throughout; and installed versions (Next 16.2.12 / React 19.2.8 / Tailwind 4.3.3, plain JS) were inspected and the proposal is grounded in them.

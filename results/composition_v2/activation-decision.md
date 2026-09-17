# Lantern exhibition implementation architecture

Status: architecture decided; implementation and runtime verification not performed.

## Contract and evidence

Preserve the approved art direction, composition, typography, palette, content hierarchy, and responsive layout. The user's approved design is the visual authority; no new director, moodboard, palette, or type system is introduced. Use its existing tokens and lantern assets when integrating. This document decides rendering, interaction, sourcing, ownership, and lifecycle only.

The user establishes React, Tailwind, and an existing GSAP scroll narrative. This workspace contains installed project guidance but no application source, assets, package manifest, or lockfile. Library versions, actual component paths, design tokens, and the existing GSAP integration could not be inspected. Proposed module paths below are integration targets, not claims about existing files. Asset fidelity must be checked against the approved design during implementation.

Choose **S — immersive realtime** for the central lantern field: pointer/touch materially changes a structurally central graphical system. This warrants a dedicated realtime surface, without implying 3D or changing the approved visual language. Surrounding text, controls, and layout remain ordinary React/Tailwind DOM.

## Rendering decision

Use **native Canvas 2D for both the main field and the separate preview**, with a shared renderer implementation and two independently managed instances. Add no rendering or animation library. Model the exhibition as layered lantern artwork in a normalized 2D scene; layering, scale, glow, and bounded motion supply depth within the approved composition. True camera navigation, volumetric lighting, and physical cloth simulation are outside the brief.

| Approach | Fit and cost | Decision |
| --- | --- | --- |
| DOM/SVG lantern elements | Good for a few individually semantic objects; a dense field of transforms and overlapping glow effects complicates per-frame updates and browser compositing. | Keep for surrounding content, accessible controls, and fallback artwork. |
| Canvas 2D with cached lantern artwork | Direct drawing and hit testing suit a repeated, interactive 2D field. Independent surfaces need no GPU engine or engine ticker. Requires an explicit accessibility layer. | Choose. |
| Pixi/WebGL or Three/R3F | Useful if measured sprite throughput or actual spatial lighting demands it; adds renderer lifecycle, graphics resources, and dependency work without a demonstrated requirement here. | Defer unless profiling shows Canvas cannot preserve the approved result. |

Render approved lantern assets into reusable sprite caches, including bounded glow margins, rather than applying expensive blur filters to every lantern every frame. Do not replace approved lantern artwork with generic particle dots. Cache by artwork, visual variant, and pixel-density tier. Draw back-to-front; resolve a pointer hit in reverse order. Start with a simple linear proximity scan; introduce a spatial index only if measured scene density warrants it.

The preview is a second live view of the same scene definition and narrative chapter, **not a screenshot or copied frame from the main canvas**. It must remain able to animate when the main canvas is inactive. Mount its wrapper in the existing approved persistent UI region, outside any main-field scroll/pinning wrapper whose lifecycle would hide it. Use a portal only if existing containing blocks require it; do not invent a new placement or overlay style.

## Catalog fit decision

Needed primitive: an **interactive particle/sprite field** with bounded pointer influence, layered glow, deterministic placement, and explicit start/stop/dispose control.

The likely catalog candidate from prior knowledge is React Bits' particle-background family, including its Particles primitive. Its possible value is pointer falloff and particle update technique. A finished generic particle background does not establish fit for approved lantern silhouettes, scene composition, touch scrolling, independent preview state, or lifecycle ownership.

**Verdict: reference-only for that candidate; custom integration using project lantern assets.** Adapting an entire catalog component is not justified on available evidence: its renderer, looping behavior, dependencies, license, and exposed lifecycle controls are unverified, while those boundaries are central to this requirement. A small proven algorithm might later be reusable, but importing a complete visual treatment would require replacing most of its presentation and ownership assumptions.

External catalog access is unavailable in this test environment, as specified by the user. No live catalog inspection, source review, benchmark, or negative search result is claimed. The candidate name comes from prior knowledge, not an inspected current version. There are no project catalog components available locally to evaluate. This limitation does not block the custom architecture. If source access returns, inspect only this likely candidate first; adopt/adapt only if license and installed-stack compatibility are verified and it can accept approved assets and expose independent lifecycle control without introducing a competing animation owner. Do not install anything during planning.

GSAP is the existing animation substrate, not a catalog primitive. Preserve it for the scroll narrative.

## Modules and data boundaries

Proposed directory: `src/features/lantern-exhibition/`, adjusted to actual repository conventions during implementation.

| Module | Responsibility and interface |
| --- | --- |
| `LanternExhibition.tsx` | Compose the approved DOM layout and both surfaces; own shared semantic state and the existing GSAP adapter. |
| `LanternSurface.tsx` | Reusable canvas host accepting `scene`, `role` (`main` or `preview`), narrative inputs, and selection callback. Own instance creation, sizing, visibility, and teardown. |
| `lanternScene.ts` | Immutable stable IDs, normalized anchors, artwork references, depth ordering, movement bounds, and deterministic variation seed. Reuse approved layout data. |
| `lanternRenderer.ts` | Per-instance draw/update/hit-test state; expose resize, narrative update, input update, invalidate, activate/deactivate, and dispose operations. No DOM layout or GSAP calls. |
| `useLanternLifecycle.ts` | Observe surface visibility, document visibility, motion preference, and size; reconcile the instance scheduler. |
| `lanternNarrative.ts` | Bridge the existing scoped GSAP narrative into a latest-value input snapshot. Own only this feature's GSAP resources. |

Both surfaces share immutable scene data, decoded artwork caches, narrative chapter/progress, and an optional selected lantern ID. Each owns its canvas, simulation clock, pointer state, backing-store size, visibility state, and frame handle. Preview pointer movement never pushes lanterns in the main field. Selecting a lantern synchronizes its ID/highlight across both surfaces; visible details stay in accessible DOM.

High-frequency positions and narrative progress live in refs/plain renderer state, not React state. React state holds semantic changes such as selection and chapter labels. The GSAP adapter writes current normalized progress and chapter to the input snapshot and invalidates active surfaces. Inactive surfaces retain the newest snapshot without simulating. Resuming renders that latest narrative state immediately.

## Animation ownership

| Concern | Sole owner | Boundary |
| --- | --- | --- |
| Scroll progress, section pinning, narrative sequencing, existing DOM reveal transforms | Existing GSAP integration | Animate approved DOM wrappers and narrative input values; never individual simulated lantern positions. |
| Per-lantern drift, pointer response, spring settling, highlight drawing, final canvas pixels | Each Canvas renderer's local scheduler | Read narrative inputs and compute final positions; no GSAP tween writes into its simulation state. |
| Layout, typography, static palette, responsive shell | React/Tailwind | No CSS animation on properties controlled by GSAP or the canvas renderer. |
| Selection, accessible controls, labels | React | Events update semantic state; no per-frame React rendering. |

Derive each lantern's final position from its authored anchor, the narrative-controlled base, and the renderer-owned bounded interaction offset. This composition is explicit; two engines never write the same transform. No Motion engine, global animation bus, or new GSAP ticker callback is needed for the field.

## Input, accessibility, and motion

Pointer movement creates a soft local repulsion and damped return around the pointer, with excursion limits derived from the approved composition. Touch uses the same proximity response during an active contact. A tap selects the closest hit lantern and updates DOM details; movement beyond a small tap tolerance cancels selection. Handle pointer leave, pointer cancel, lost capture, and unmount by clearing interaction forces.

Preserve vertical page scrolling and pinch zoom (`touch-action: pan-y pinch-zoom`); do not cancel wheel/touch scrolling or require dragging. Browser cancellation when scrolling starts is expected. Convert viewport pointer coordinates through the surface's current bounding rectangle into normalized scene coordinates, separately for each canvas. Only the primary pointer drives a surface; a second contact does not become a second force.

Provide a DOM description and keyboard-operable previous/next/select controls for meaningful lantern content, styled through the approved control system. Decorative canvas content is hidden from assistive technology; announce selection changes through DOM content, never ambient drift. The preview is labeled as a preview and avoids duplicating the main content in the reading order. Its selection behavior uses the same accessible model.

For reduced motion, disable ambient drift, repulsion, and spring animation. Keep tap/click/keyboard selection and render highlights immediately on demand. Reflect narrative chapters without interpolated canvas movement. Apply the existing GSAP narrative's reduced-motion policy while preserving text and reading order. If canvas initialization or artwork loading fails, retain approved static artwork and functional DOM content/selection controls.

## Inactive-surface and teardown behavior

For each instance, `active = mounted AND hasNonzeroSize AND intersectsViewport AND documentVisible`. Use its own IntersectionObserver with no offscreen prewarming margin; document visibility gates both instances. A surface hidden by application UI also becomes inactive explicitly. Continuous work additionally requires that motion is allowed and the surface has ambient or settling motion. A static active surface renders only when invalidated.

| Main | Preview | Document | Required owned work |
| --- | --- | --- | --- |
| Visible | Visible | Visible | Both renderers can run independently. |
| Offscreen | Visible | Visible | Cancel main frame requests; preview continues. |
| Visible | Offscreen/closed | Visible | Main continues; preview has no frame requests. |
| Offscreen | Offscreen/closed | Visible | No canvas simulation or recurring frame requests. |
| Any | Any | Hidden | Cancel both canvas schedulers and clear transient input. |
| Unmounted | Unmounted | Any | No feature callbacks, observers, listeners, or held canvas resources. |

On deactivation, cancel the pending requestAnimationFrame, prevent callback rescheduling, and freeze local simulation time. Check activity again inside a callback to handle deactivation races. Target cancellation within one or two frames after an observable transition; browser observer delivery can affect exact timing. On reactivation, reset the timestamp baseline and use a clamped time delta; do not integrate elapsed hidden time or replay missed motion. Coalesce resize/narrative invalidations until the surface becomes active.

There is no shared canvas ticker. Shared artwork-cache entries are reference-counted and retained while either instance needs them; stopping the main surface must not free the preview's artwork. Teardown is idempotent: cancel frames, disconnect observers, remove input/media/visibility listeners, release cache references, and discard backing-store resources. React development remounts must not duplicate loops or subscriptions.

Do **not** globally sleep GSAP's ticker, kill unrelated ScrollTriggers, or pause the page because the main field leaves view. Scope/revert only this feature's GSAP resources on unmount. Pause any feature-owned autonomous GSAP timelines when hidden; scroll-driven narrative observers may remain registered to preserve current progress and visible page behavior. A visible preview or other visible narrative animation remains a legitimate consumer. If a shared scheduler is introduced later, use active-consumer accounting and stop it only after the final consumer becomes inactive.

Canvas 2D adds no engine-owned ticker. If profiling later justifies Pixi, audit application and shared/system tickers separately: stopping `app.ticker` alone does not establish that `Ticker.system` stopped. That migration would require an updated ownership/lifecycle decision.

## Performance and implementation sequence

Cap the initial main backing-store density at 2 device pixels per CSS pixel and preview density at 1.5; validate visual fidelity on actual target displays. Reuse decoded assets and cached glows. Target main updates at display cadence up to 60 fps and preview drawing at up to 30 fps. Never use a busy loop or interval for throttling; only active instances request frames. Measure both surfaces together. First reduce internal resolution/cache cost if necessary; preserve authored lantern count, placement, and visual identity unless a later design decision explicitly changes them.

Implementation order, for a later execution task:

1. Inspect real components, tokens, assets, installed versions, and GSAP scope; map the proposed modules to that repository. Capture approved desktop/mobile reference views. Check official documentation only where version-sensitive API use requires it.
2. Build the immutable scene and single Canvas surface with approved artwork, fallback DOM, sizing, and deterministic hit testing. Verify coordinate conversion and rendering fidelity before adding movement.
3. Add bounded pointer/touch response and accessible selection; verify scrolling, cancellation, keyboard equivalence, and reduced motion.
4. Add the independent preview and shared narrative adapter. Verify chapter/selection synchronization while keeping simulation and visibility independent.
5. Add lifecycle cancellation and resource cleanup, then execute the acceptance checks below and profile representative mobile/desktop devices. No additional effect dependency is planned.

## Acceptance evidence required during implementation

All runtime checks below are **unverified** in this plan-only environment. No service, browser session, benchmark, installation, or implementation was run.

| Check | Required evidence |
| --- | --- |
| Approved design preservation | Desktop/mobile captures compared with approved references, including canvas fallback and reduced-motion states. |
| Pointer/touch | Actual pointer movement and touch scrolling/tapping demonstrate bounded response, accurate hit mapping, uninterrupted scrolling, and cleared forces after cancellation. |
| Independent preview | Actually scroll the main field away while keeping preview visible; attribute counters to each surface and observe main update/draw counters stop while preview continues. Repeat with the reverse visibility state. |
| No visible surfaces | Actually scroll both away or close the preview; no recurring canvas callbacks remain. |
| Hidden document | Actually switch/background the browser tab. Record cancellation and pending-frame state for both renderers, not merely zero callbacks caused by browser throttling. Return without time jumps. |
| Teardown | Navigate away/unmount and remount through the application; observe released listeners/resources and no duplicate frame scheduling. |
| Accessibility | Keyboard and assistive-technology reading order expose equivalent content/selection; reduced motion retains operation without continuous canvas work. |
| Budget | Profile both surfaces, resize, and repeated navigation on representative devices; attribute frame cost, memory growth, and any global rAF callbacks to their actual owner. |

Focused automated checks should cover coordinate conversion, bounded simulation, activity transitions, and the key regression: deactivating main leaves preview active. Synthetic visibility events are useful logic tests but cannot substitute for real scrolling/backgrounding evidence. If those real conditions cannot be exercised, retain an explicit unverified result. Unrelated visible GSAP work is not evidence of a lantern lifecycle failure.

## Guidance provenance

This file also serves as the planning work log and scoped design contract. Followed the installed creative frontend architecture routing; skipped new art direction and implementation/review stages because the design is settled and the request is plan-only. Brainstorming/planning guidance supplied alternatives and self-review; user instructions override approval ceremonies, default document locations, implementation code, and execution handoff. No specialist API integration or upstream director integration is claimed.

Actual files read, with SHA-256 of the local bytes:

| File | SHA-256 |
| --- | --- |
| `.agents/skills/creative-frontend-architect/SKILL.md` | `abeb51e1c1a769366ea7ea134b85b0d2acfa00aeaa16d3ac565adc5dd72883e5` |
| `.agents/skills/creative-frontend-architect/references/design-contract.md` | `feb07483fa3a178279ecd50cf503887601f37c6799cca560eb48f67d5b9551ae` |
| `.agents/skills/creative-frontend-architect/references/architecture.md` | `012aabe7dcc34cead0f6caaeb42320666ec08c7e097723798d6bbce5d22504ce` |
| `.agents/skills/creative-frontend-architect/integrations.lock.json` | `d6c9f031d1b0c25357b4a2d200aa5f192d1ee4f9e6d003385400ce166cdbf4e3` |
| `/Users/bezzchen/.codex/skills/using-superpowers/SKILL.md` | `55379fe7c1c473a02c61961c822996bff30e1320d6921d9062509bc508482c05` |
| `/Users/bezzchen/.codex/skills/using-superpowers/references/codex-tools.md` | `9310bb2315eed2c1cebea02cd1c9e8fe121cb788fc6b41e8b8f8b5ff46f85f37` |
| `/Users/bezzchen/.codex/skills/brainstorming/SKILL.md` | `e14914605f640e0841758e45d0ab2a53243b59b921f929e47921c99668f2e61d` |
| `/Users/bezzchen/.codex/skills/writing-plans/SKILL.md` | `272e1af349f5062c28dc282b3e21b220d58d683a7314a10c455b7432ec91d845` |

The integration manifest was read for provenance only; its pinned upstream sources were not loaded or verified. No catalog contents were read. No application/library version evidence is available in this workspace.

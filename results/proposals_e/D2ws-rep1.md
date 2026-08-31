# D2ws-rep1 — with-skill, catalog-aware (Fable)

Eval: D2-bespoke-identity-trap. Fixture next-tailwind-base @ edf3be4 (pristine).
Delivery: skill body as loaded-skill block + registries/component_libraries.json verbatim
+ pinned D2 prompt. Plan-only. Protocol: evals/withskill_protocol.md.

## Recon (agent's own, before proposing)
Read package.json, app/page.jsx, app/globals.css, all three components.
Next 16.2.12 / React 19.2.8 / Tailwind 4.3.3, no animation or graphics deps installed.
Noted components/ConstellationData.js (500 nodes) is orphaned — imported nowhere.
Queried React Bits and Fancy Components llms.txt LIVE (not from memory); npm-verified substrates.

## Register decision
- Hero: **W — Expressive/Persuade.**
- Projects grid: W-adjacent, static-first, micro-motion only.
- Account Settings: **Q — Quiet/Operate** (materials only, no theatrics, zero new deps).

**S weighed and DECLINED knowingly**, with three reasons given:
(a) fluid/GPU ink reads as digital slickness — simulation-perfect diffusion contradicts
"rough linework, imperfect edges"; the identity's promise is a human hand, not a shader;
(b) editorial persuade-page where type and reading order must stay structurally central —
a graphical core would invert that hierarchy;
(c) it would add a rendering substrate (R3F/regl) to a site whose only other surfaces are
a grid and a form.

## Concept — "The Editor's Hand"
Broadsheet masthead on paper; pointer becomes an editor's nib. One ink-stroke system, three beats:
1. Entrance (once): masthead inks itself on — v1 roughened-mask wipe (no font vectors needed);
   v2 true stroke-order draw-on once the custom display face exists as vectors.
2. Idle: **nothing moves.** Paper doesn't animate — identity decision AND the performance story.
3. Signature interaction: near designated hot phrases, editorial proof-marks draw themselves in
   ink — wavy underline that overshoots, circle that doesn't quite close, margin caret with a
   scribbled note, asterisk, "stet". Fast pointer flicks a velocity-thinned nib trail that dries
   (~1s). Every mark procedurally roughened from a fresh seed — **no stroke renders the same
   twice**, making "imperfect edges" a behavior, not just a texture.

Rejected alternatives with reasons: plain cursor ink-trail = generic portfolio-ware; self-drawing
headline alone = an entrance, not an interaction; scratch-off reveal = novelty without editorial meaning.

## Architecture
L0 paper ground (static CSS): grain baked to small tiling data-URI, multiply-blended; deckled
edges via pre-generated SVG mask-image — explicitly NOT live feTurbulence on large areas (paint cost).
L1 real DOM editorial content: h1/subhead/CTA stay server-rendered, selectable, accessible;
hot phrases are <span data-ink-anchor> wrappers.
L2 one ink canvas: single 2D canvas overlaying hero, pointer-events:none, DPR-aware capped at 2.

Stroke engine (~200-300 lines, custom): mark skeletons as normalized polylines per type,
instantiated against DOM anchor rects (getBoundingClientRect + ResizeObserver re-anchoring);
per-instantiation seeded jitter + rotation = unrepeatable roughening (roughjs's approach, own
implementation); perfect-freehand getStroke() converts skeleton + speed-based pressure into
variable-width nib outline, alpha-layered for ink pooling; retained model (points, seed, birth
time, state) enabling progressive draw-on, drying fade, resize re-render, instant-paint under
reduced motion.

Ownership: ink module owns its canvas, pointer listeners, rAF loop — nothing else touches them.
CSS transitions own Q-register micro-motion elsewhere. **No Motion, no GSAP** — no DOM-timeline
orchestration need, so a second engine would create the dual-owner conflict the architecture forbids.
Design director owns palette/face/mark intensity/copy — and the rep NOTED no design-director skill
was loaded in this session, flagging those as open inputs rather than making the calls.

**Dependency delta: exactly one** — perfect-freehand (~4kB, MIT, v1.2.3, registry activity Feb 2026).

## Fit gate — checked and cited
| Source | Finding | Verdict |
|---|---|---|
| React Bits (llms.txt, live) | No hand-drawn/ink primitives. "Stroke Text" self-draws outlines but is techy display-type flooding, not ink; cursors are blob/glow/splash. MIT+Commons-Clause license gate noted. | reference_only (draw-on reveal timing) |
| Fancy Components (llms.txt, live) | No hand-drawn primitives. "Text Cursor Proximity", "Underline Animation", "Text Highlighter" are conceptual neighbours with clean geometric rendering — adopting them delivers the exact opposite of imperfect linework. | reference_only (proximity + text-anchor patterns) |
| Magic UI / Aceternity / SmoothUI | Particles/globes/beams, polished landing blocks, animated product UI — wrong material world. | poor_fit |
| Motion Primitives | Patterns for Motion-owned pages; no motion owner of that kind here. | poor_fit |
| rough-notation (npm, prior art) | The canonical hand-drawn annotation lib — dormant since 2022, SVG-per-element with no pointer-proximity model or nib weight, look so widely deployed that raw adoption under-authors the identity. Adapting = replacing renderer + lifecycle = fit policy's route-custom. | reference_only (mark vocabulary, roughening params) |
| roughjs (npm 4.6.6, 2023) | Hachure-sketch look, not nib ink; borrow the jitter approach, not the package. | reference_only |
| perfect-freehand (npm 1.2.3, active) | Exactly the missing primitive: pressure/velocity-variable stroke outlines, tiny, engine-agnostic. | **adapt — adopted as substrate**, geometry only; all art direction ours |

## Unprompted performance / correctness commitments
- No ambient animation exists, but the loop still gets full lifecycle discipline because
  entrance/drying can be mid-flight on scroll/tab-away: IntersectionObserver on hero
  (offscreen -> detach listeners, cancelAnimationFrame, freeze) and visibilitychange (hidden ->
  same). rAF runs ONLY while a stroke animates or dries; otherwise cancelled, not idling.
- Verification under the actual condition: instrumented frame counter, really scroll the hero
  offscreen and really hide the tab; assert frames-while-offscreen = 0. Explicitly refuses
  document.hidden flag-flipping as a stand-in for the scroll case.
- prefers-reduced-motion: entrance final state instantly; marks without draw-on; trail disabled.
- Coarse pointers: no hover exists — marks draw on tap of hot phrases; verified at mobile viewport.
- Resize/DPR: retained-model re-render on ResizeObserver, DPR capped at 2, canvas scoped to hero.

## Open inputs the rep declined to decide (director's, not architect's)
1. Custom display face — licensed/commissioned? Gates v2 stroke-order entrance; v1 ships without it.
2. Annotation copy — the 3-6 margin-note fragments are brand voice, not lorem.
3. Ink/paper palette for both colour schemes.

## Compliance
Plan-only respected: no code or files written in the run dir.

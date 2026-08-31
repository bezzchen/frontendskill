# D2ws-rep2 — with-skill, catalog-aware (Fable)

Eval: D2-bespoke-identity-trap. Fixture next-tailwind-base @ edf3be4 (pristine).
Delivery identical to rep1/rep3. Plan-only.
DEVIATION: stalled once on the known notification-routing failure (commissioned a catalog-survey
child, ended its turn, no live children left to wake it). Resumed by neutral orchestrator relay
that named no source and no verdict and carried a mismatch escape hatch. See findings §Deviations.

## Recon
Hero today: kicker "Portfolio", h1 "Jordan Lee", one subhead. Below: 8-card project grid
(placeholder gradients), then account-settings form. Theming already CSS-variable based with
light/dark prefers-color-scheme split; font is stock Arial — custom display face is greenfield.
Deps NOT installed (clean single-commit baseline); no incumbent animation library, so the
motion-owner slot is open.

FLAG: components/ConstellationData.js (500 labeled nodes) referenced by nothing.
"I am deliberately not taking that bait: animating it would add an ambient 500-node particle field
that is off-identity and off-register." Recommends deleting or repurposing later as a STATIC
hand-plotted "star chart" footnote graphic. (Third independent refusal — 3/3 across the arm.)

## Register decision
**W — Expressive/Persuade** for the hero; rest of page effectively **Q** (settings form and project
grid get static identity treatment — rough borders, paper — but zero new motion).

**S explicitly weighed and DECLINED knowingly** — considered full-viewport WebGL wet-ink fluid
simulation / generative ink-wash field reacting to the pointer. Reasons: (a) an editorial identity
is a reading surface first — on a personal portfolio whose job is credibility, a structurally
central graphics system subordinates the type and content it exists to serve; (b) material honesty —
GPU fluid advection reads glossy-digital and would undercut the hand-made thesis; (c) cost (WebGL
boot, continuous simulation upkeep) buys no communicative value a finite system cannot deliver.
Also explicitly rejects Q as under-delivering the commissioned signature. "W it is — one idea,
finite motion, total stillness afterwards."

## Concept — "The Inking Pass"
The hero is a proof sheet from Jordan's desk; the page performs the oldest move in illustration:
pencils, then inks.
- Beat 1 — pencil under-drawing at first paint: hero arrives as itself in graphite (name in display
  face, kicker, rough frame line), all REAL DOM text, pencil-styled, on paper grain. "Content is
  legible from the first frame; nothing is hostage."
- Beat 2 — the inking pass (auto, finite, ~1.6s) after ~400ms so keyboard, touch and passive
  visitors all get the full reveal without doing anything.
- Beat 3 — the nib (the interaction): pointer over hero is a wet nib; strokes are real ink, width
  from velocity, ragged edges, brief wet gleam; anything in pencil-state they cross gets inked early
  — "your hand can finish the proof before the brush does." Strokes then dry into faint graphite
  ghosts, leaving marginalia evidence of the visit. Splatter on fast flicks = optional garnish
  behind a flag, subject to design-director approval.
- Finale: same system draws one editorial annotation under "computational design", then the system
  goes fully idle — zero animation frames, forever, until you draw again.

Explicit cliché audit: "Not a flashlight-mask cliché" — differentiation stated as (i) the under-layer
is the content itself in pencil, never a void, (ii) the reveal auto-completes editorially rather than
depending on the cursor, (iii) strokes are physical ink with drying, not a circular spotlight.
GUARDRAIL: "if testing cannot hit that material bar, we ship draw-on + annotation without the nib
layer rather than ship a generic mask-reveal."
Alternative set aside: a "marginalia pen" (hover targets circled/underlined) — rejected as primary
because annotation-on-hover is rough-notation/Highlighter's well-worn recognizable territory and
fragments into many micro-effects instead of one signature.

## Fit gate — six sources queried live 2026-08-31
React Bits, Fancy Components, Magic UI, SmoothUI (llms.txt indexes), Aceternity components index,
Motion Primitives core component tree on GitHub; plus GitHub API + npm registry maintenance signals.

| Source / item | Verdict |
|---|---|
| React Bits — Fuzzy Text, Image Trail, Pixel Trail, Decay Card, Dither, Grainient | poor_fit — permanent ambient vibration on type and glossy shader-noise are the wrong material; license gate MIT+Commons-Clause; nothing adopted |
| Fancy Components | no hand-drawn/ink matches; nearest Elastic Line (springy SVG line) = reference_only |
| Magic UI — Highlighter | reference_only — human marker-stroke annotations incl. circle/underline/bracket; but triggers on mount/in-view only with NO external timeline control and undisclosed engine → "would be a second timing owner inside the hero sequence" |
| SmoothUI — mask-reveal-up, reveal-text, cursor-follow | poor_fit for the identity core |
| Aceternity — SVG Mask Effect, Tracing Beam, Hero Highlight, Following Pointer, Squiggly Text | reference_only — useful patterns, wrong material world; maintenance opaque (no public repo) |
| Motion Primitives (cursor, border-trail, 30+ UI-motion components) | poor_fit for this concern |
| roughjs 4.6.6 (MIT, 21k stars, last push 2024-07) | **adopt as BUILD-TIME substrate only** — "dormancy is contained: it runs in a generator script whose SVG output is committed; zero runtime exposure" |
| rough-notation 0.5.1 (MIT, last push 2024-03) | reference_only — same one-owner conflict as Highlighter |
| perfect-freehand 1.2.3 (MIT, actively maintained, pushed 2026-04) | **adopt as runtime substrate** for nib stroke geometry (~2KB, zero deps) |

Stated conclusion: "no catalog supplies a hand-drawn ink primitive that could carry this identity —
the custom route is taken with the search done, not skipped." Anti-pattern discipline explicit: no
stacking of recognizable catalog effects, no Grainient/Dither backgrounds, no stock cursor trails.

## Architecture
- Static identity system (zero runtime cost): paper grain = static SVG feTurbulence data-URI tile in
  CSS both themes; rough card borders / torn-edge dividers / imperfect rules generated at BUILD by a
  roughjs script with FIXED SEEDS, output committed as SVG — "hydration-safe by construction";
  settings form stays register-Q, identity via statics only.
- Ink plate: one inline <svg> over the hero box, pencil layer + ink layer of the same composition,
  ink revealed through an SVG <mask> (SVG-internal masking for cross-browser safety, GPU-composited,
  no per-frame rasterization). Ragged mask edges via a SINGLE seeded feTurbulence+feDisplacementMap
  on the mask group, with a designed fallback (drop the filter, rely on stroke-outline wobble and
  round caps) if Safari profiling disappoints. Real DOM h1 stays canonical/selectable/LCP; plate's
  text twin aria-hidden.
- **Motion owner: motion v13 (13.1.1) — sole owner of every DOM/SVG timeline.** Live check found v13
  is a MAJOR ahead of training-era knowledge, "which itself proves the verify-at-build rule"; its
  React API to be verified against installed docs before any motion code. No GSAP — "DrawSVG
  convenience is not worth a second timeline engine." Decision gate: if measured motion contribution
  breaks the bundle budget on this near-static site, fallback is WAAPI + ~1KB sequencing helper —
  still exactly one owner.
- Nib renderer owns exactly one concern: pointer samples -> stroke outlines (perfect-freehand) +
  wet-to-dry state. Runs its own rAF ONLY while ink is wet, and never animates anything the motion
  owner animates. Caps: ~24 concurrent wet strokes, ~200 retained ghost paths (oldest pruned).
- SSR/no-JS/flash discipline: server HTML ships the hero FULLY INKED (no-JS visitors get the finished
  proof); a one-line pre-paint inline script sets a root attribute switching the h1 to pencil styling
  only when JS will run and reduced motion is off — no inked-to-pencil flash, LCP stays the h1, CLS
  zero because all layers overlay the same box.

## Unprompted lifecycle policy
Every continuous phase gated by BOTH IntersectionObserver on the hero (offscreen -> timelines paused,
pointer listeners detached, rAF cancelled) AND visibilitychange (hidden -> same). Resume continues
from paused progress, "never wall-clock-jumped."
Finite by design: after the finale, steady state is zero rAF with only cheap listeners armed.
"No library shared ticker exists in this stack; if any library with a default ticker ever enters the
project, stopping that ticker under the same gates is part of its adoption cost."
Budgets: hero JS <=~40KB gz incl. motion (measured, with WAAPI fallback gate); interaction script
<=4ms/frame under 4x CPU throttle; LCP delta <=0.1s; CLS 0; INP <200ms while scribbling.

## Verification protocol (nothing claimed as working — nothing built)
1. Offscreen pause tested BY SCROLLING, not by toggling the observer: scroll hero out mid-sweep and
   mid-drying in real Chrome; dev-only frame counter must freeze within a frame; Performance trace
   must show zero rAF tasks while offscreen.
2. Hidden document tested BY ACTUALLY SWITCHING TABS, "not by flipping document.hidden
   programmatically": 5s away mid-sweep; frames frozen; resume from same visual progress.
3. Idle zero-cost: 10s trace after finale, all ink dry — no scripting, no rAF.
4. Reduced motion: macOS Reduce Motion on + DevTools emulation.
5. Hydration: production build, console clean of mismatch warnings (asserted even though committed
   fixed-seed assets should make it hold by construction).
6. CWV: Lighthouse mobile before/after, LCP element still the h1, budgets under 4x throttle.
7. Cross-browser material: Safari macOS+iOS, Firefox, Chrome — mask+displacement at 60fps or the
   no-filter fallback is activated AND re-verified.
8. Touch: real iOS Safari — vertical scroll across hero never impeded.
9. Bundle: measured hero-chunk report against the 40KB gz budget.

## Accessibility / inputs / theming
reduced-motion ships fully inked, no sweep, nib never mounts. Touch: no drag capture, no scroll
fighting, passive listeners only, coarse pointers get auto-sweep + tap ink-blot. Keyboard/SR:
content never depends on pointer participation; real text in a11y tree; focus-visible gets a static
rough underline. Dark mode "night proof" — same geometry, palette flip via existing CSS vars; exact
values left to the design director.

## Ownership note
Stops at register, architecture, adopt-vs-build. Left to the design director (none loaded this
session): display-face selection and licensing (which also decides true hand-lettered stroke draw-on
vs font-agnostic mask-wipe), ink/paper palette values both themes, splatter yes/no, annotation target
word, final critique.

## Dependencies
Runtime: motion@13.1.1, perfect-freehand@1.2.3 (both MIT). Build-time devDep: roughjs@4.6.6 (MIT,
generator only, output committed). Fonts via next/font/local. No GSAP, no WebGL.
Implementation to start with install then inspection of actually-installed versions.

## Compliance
Plan-only respected: git status confirmed working tree untouched, no files written.

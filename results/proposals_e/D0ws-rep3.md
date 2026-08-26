<!-- run: D0-unprompted-discovery | condition: with_skill_v1 | rep 3 | model claude-fable-5 | 2026-08-25 | fixture next-tailwind-base edf3be4 (fresh copy) | protocol evals/withskill_protocol.md | captured verbatim from agent final report; agent's commissioned research sweep was orchestrator-relayed after a notification-routing stall — agent re-verified the four load-bearing claims first-hand before use (documented in wave record) -->

All four load-bearing claims are now verified first-hand. React Bits Topography is real: its shadcn registry entry at `reactbits.dev/r/Topography-JS-TW` confirms the component, the `ogl@^1.0.11` dependency, and the exact pointer props (`mouseInteraction`, `mouseRadius`, `mouseStrength`), and the GitHub repo tree shows `Topography` alongside `Waves` and `Threads`. The relayed report was accurate on every claim I could test, so I'll treat its remaining inventory detail as credible, cited as agent-reported. No implementation has been done — repo untouched except reads. Here is the full proposal.

---

# Implementation proposal: topographic hero background + magnetic CTA

**Target repo:** `/private/tmp/claude-501/-Users-bezzchen-Documents/37b75f5e-0330-4278-8117-fba2895b3c92/scratchpad/runs/D0ws-rep3`
**Stack (verified from `package.json` and source):** Next.js 16.2.12, React 19.2.8, Tailwind 4.3.3, JavaScript (`.jsx`, no TS), no animation library installed. Conventions: flat `components/` with named exports, `"use client"` only on interactive leaves, all color through five CSS tokens (`--background`, `--foreground`, `--muted`, `--surface`, `--line`) with automatic dark mode via `prefers-color-scheme`. The hero is the text-only `<header>` in `app/page.jsx`; **no CTA exists yet**, so this work introduces one.

## 1. Register decision

**W — Expressive/Persuade.** The topographic field is one signature idea that visually literalizes the hero copy ("systems, interfaces, and computational design"); all motion serves it.

- **Spectacle (S) weighed and declined.** The brief says "reacts *subtly*," the site is a restrained editorial portfolio, and the graphic layer supports text rather than being the structural core; pointer input modulates the field, it doesn't transform the page. Declined knowingly, not by silence.
- **Quiet (Q) rejected** because the brief explicitly commissions an animated background and a magnetic CTA, and blesses Motion — Q's zero-new-deps default would contradict the ask.

## 2. Sourcing plan (fit gate, with what was checked)

Checked via a recon agent against live pages on 2026-08-24/25, with the four decision-changing claims re-verified by me directly (npm registry for `motion` and `@paper-design/shaders-react`, SmoothUI registry JSON, React Bits registry JSON + GitHub tree):

| Source | Topo background | Magnetic button |
|---|---|---|
| React Bits (MIT + Commons Clause) | **Topography** — true animated iso-line contours, OGL fragment shader, built-in pointer props (`mouseInteraction`, `mouseRadius`, `mouseStrength`), sole dep `ogl@^1.0.11` — verified in their registry JSON. Also Waves (canvas 2D, parallel flow-lines, not contours) and Threads (OGL) | Magnet — zero deps but window-level `mousemove` + CSS transitions, not Motion springs |
| Fancy Components (MIT, Motion-based) | None (backgrounds: gradient + pixel trail only) | None — Cursor Attractor/Gravity are Matter.js physics scenes, wrong tool for a CTA (agent-reported) |
| SmoothUI (MIT) | None | **magnetic-button** — `motion/react` with `useSpring` + `useReducedMotion`; deps `motion`, `@radix-ui/react-slot`, `class-variance-authority` — verified in registry JSON |
| Paper Shaders 0.0.80 (Apache-2.0, verified) | No contour/iso-line shader in the 30-shader inventory, and no pointer input in the shader mount (agent-reported) — would require per-frame prop animation from outside, defeating the purpose | n/a |
| Vanta Topology / Aceternity | Vanta matches visually but costs p5.js + imperative API — reference only. Aceternity has no topo; ships its own Motion magnetic button | reference points |

**Verdict A — topographic background: ADAPT React Bits Topography** (copy-in JS+Tailwind variant via their shadcn registry). It is the only true iso-contour match found, pointer reaction is built in, and the single `ogl` dep is small. Adopt-as-is fails my non-negotiables, so three adaptations are mandatory: (a) pause plumbing (below), (b) theme-token color wiring, (c) reduced-motion/coarse-pointer paths. Subtlety tuning: uniform color mode, thin lines, no glow/grain/elevation coloring. **Documented fallback** if it can't be tuned quiet enough or install-time inspection disqualifies it: custom canvas-2D marching-squares engine over fBm noise (~200 LOC, zero deps, same pause/a11y plan) — Waves and Vanta serve as interaction-feel references only.

**Verdict B — magnetic CTA: ADAPT (reference SmoothUI/Aceternity mechanism), not wholesale adopt.** The Motion-spring mechanism (`useMotionValue` + `useSpring`, padded activation zone, clamped pull ~8px, spring-back on leave) is exactly right; but SmoothUI's drop-in drags `@radix-ui/react-slot` + `class-variance-authority` into a repo with zero UI-kit scaffolding, and React Bits Magnet uses the wrong engine idiom. A ~50-line `MagneticCTA.jsx` on `motion/react` styled with existing token classes is the clean fit.

## 3. Architecture and ownership

- `app/page.jsx` stays a **server component**. Hero becomes `<section className="relative isolate overflow-hidden ...">` containing: `TopographyField` (absolute `inset-0 -z-10`, `aria-hidden`, `pointer-events-none`), the existing copy, and a new CTA row. Assumed CTA: "View selected projects" → `href="#projects"` (id added to the ProjectGrid section); swap copy freely.
- **New client leaves:** `components/TopographyField.jsx` (adapted React Bits source, attribution + license header retained) and `components/MagneticCTA.jsx`.
- **One owner per concern:** OGL owns the background canvas pixels; Motion owns the CTA's transform (no Tailwind `transition` on transform, no CSS hover translate on that element — hover color/shadow stays plain CSS). The two never touch the same property. No GSAP, no three.js. `ogl` enters scoped to this one component, not as a site-wide substrate — any second OGL surface requires a new decision.
- **Pointer pipeline:** `pointermove` listened on the hero section (canvas never intercepts), position lerped in the loop, fed to the shader's mouse uniforms; magnet listens on its own padded wrapper, not `window`.
- **Theme:** read computed `--line`/`--muted`/`--background` into shader colors at mount and on `prefers-color-scheme` change; contours stay low-contrast (target under ~8-10% against background behind text, with a CSS `mask-image` fade under the headline block if needed — engine-agnostic, no shader edits).

## 4. Non-negotiable behaviors (designed in, unprompted)

- **Pause when unobserved:** IntersectionObserver on the hero stops the rAF at 0% visibility; `visibilitychange` stops it when the tab hides; time base accumulates dt only while running (no jump on resume); unmount cancels rAF, removes listeners, and releases the GL context. React Bits copy-ins typically run an unconditional rAF started in an effect — this gating is a required adaptation, and install-time inspection must confirm there is no additional always-on ticker.
- **Reduced motion:** `prefers-reduced-motion` renders exactly one static contour frame (no loop), pointer uniforms off; magnet inert via `useReducedMotion` while hover styles still work. Live media-query listeners, not mount-time snapshots.
- **Coarse pointers:** `(pointer: fine)` gates both the pointer bump and the magnet; touch devices get ambient drift only (still pause-gated).
- **Budget:** DPR capped at 2; one rAF total on the page (Motion's loop sleeps when springs settle); idle cost is zero rAF when offscreen or hidden.

## 5. Dependencies

`motion@^13.1.1` (MIT, peers React ^18||^19 — compatible with React 19.2.8/Next 16; import from `"motion/react"`; v13's breaking change only affects styled-components/Emotion users, n/a here) and `ogl@^1.0.11` (pinned by the Topography registry entry). Nothing else. React Bits' MIT + Commons Clause permits use in this product (no reselling the components themselves). Zero-dep fallback path exists if `ogl` is vetoed.

## 6. Verification plan (actual conditions, before any "done" claim)

1. **Offscreen pause:** dev-only frame counter (`window.__topoFrames`); really scroll the hero out in the browser, sample twice 3s apart (frozen), scroll back (increasing). Not a `document.hidden` flip.
2. **Tab hidden:** actually switch tabs via browser automation, then return; assert the component's running flag flipped false on hide *and* the counter froze — flag assertion is the meaningful one since Chromium suspends rAF in hidden tabs anyway, which would mask a missing handler.
3. **Reduced motion:** emulate the real media feature (CDP `emulateMedia`), reload: no loop starts, static contours render, CTA does not translate.
4. **Coarse pointer:** mobile emulation: no magnet, no pointer bump, pause gating still works.
5. **Performance:** trace while circling the pointer 10s over the hero; budget <2ms scripting/frame at DPR 2; record numbers, tune iso density/DPR if over.
6. **Visual/a11y:** light + dark screenshots; text contrast over worst-case contour density; keyboard focus ring intact, no movement on focus.

## 7. Implementation order (on approval)

Install deps → pull Topography via `npx shadcn@latest add https://reactbits.dev/r/Topography-JS-TW` → **inspect the installed source before coding against it** (loop shape, prop names, ogl version — freshness rule) → apply the three adaptations → hero restructure + CTA in `app/page.jsx` → `MagneticCTA.jsx` → subtlety tuning pass → verification suite above.

**Open items for you:** CTA copy/destination (assumed "View selected projects" → `#projects`); confirm the `ogl` dependency is acceptable vs. the zero-dep custom fallback; final visual loudness stays with the design director — this proposal fixes mechanism and guardrails, not art direction. Side observation, out of scope: `components/ConstellationData.js` is orphaned (nothing imports it).

Sanity check: re-read the brief — proposal and sourcing plan only, no implementation. Confirmed: no files modified, no packages installed; every fit-gate citation above was either verified directly by me or is marked agent-reported.

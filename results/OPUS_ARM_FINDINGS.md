# Phase 0B — model-tier arm: Opus 5 (2026-08-10)

Second model arm of the routing baseline. Same six eval prompts, same de-instrumented fixtures
(`edf3be4` / `6f5dcaa`), same dispatch method as the Fable arm — only the model changed.
Proposals: `proposals/E*-opus.md`. Records: `rep1_runs.json` (opus entries).

Purpose: the Fable baseline showed none of the failure modes the skill was designed to prevent.
This arm tests whether those failure modes appear one capability tier down.

## Result: they do not

| Eval | Fable (clean) | Opus 5 | Same call? |
|---|---|---|---|
| E1 settings | 0 deps, CSS-only | 0 deps, CSS-only + React 19 server actions | yes |
| E2 anime v4 | 0 deps, Anime v4 | 0 deps, Anime v4 | yes |
| E3 scroll story | 0 deps, sticky + rAF scrub | 0 deps, sticky + one CSS custom property | yes |
| E4 GPU media | +ogl, WebGL overlay | 0 deps, raw WebGL2 overlay | same family, lighter |
| E5 500 nodes | 0 deps, Canvas 2D + atlas | 0 deps, Canvas 2D + atlas + springs | yes |
| E6 vague "dynamic" | diagnose-first, 0 deps | diagnose-first, 0 deps | yes |

**Dependencies added across 6 Opus runs: zero.** (Fable added one across 6 — `ogl` in E4.)
**Critical failure signals: zero.** No Three.js/R3F escalation, no engine stacking, no
DOM-to-canvas migration, no reduced-motion content loss, no Anime v3 API patterns.
**Instruction compliance: 6/6** — every run added only `PROPOSAL.md`; no tracked fixture file was
modified. (E4 recommended deleting the dead `ConstellationData.js` but correctly did not act.)
All six runs explicitly named and rejected at least one of framer-motion / GSAP / three.js / Pixi / R3F.

## Behaviors that appeared unprompted

- **Version verification.** E2 read the pinned version from `package-lock.json` and checked the
  v4 API against official documentation rather than trusting memory — the exact discipline spec
  §14 was written to enforce. (Caveat: its "correction" — that current v4 exports `spring({bounce})`
  "not `createSpring`" — is itself inaccurate; both `spring` and `createSpring` are exported by
  4.5.0, verified in `node_modules`. Right process, slightly wrong conclusion. Not scored as a
  failure signal, but it shows doc-consultation does not guarantee factual accuracy.)
- **Empirical inspection over reading.** E1 and E6 installed deps, ran the dev server, and measured
  the rendered DOM. E1 found the `--line` token yields 1.35:1 border contrast (WCAG 1.4.11 needs
  3:1) and a 13×13px checkbox target (2.5.8 needs 24×24) — defects invisible from source reading.
- **Root-cause diagnosis over motion.** E6 concluded the page is unmemorable because eight cards
  share one summary sentence and one gradient, and that animating undifferentiated content just
  makes it move; it proposed a content model first and explicitly declined to animate the 500-node
  dataset as a background particle field.
- **Named revisit triggers.** Multiple runs recorded the specific condition that would flip the
  decision (adopt Radix at the first dialog/combobox; move to WebGL past ~3–5k sprites; adopt OGL
  if the FBO pointer-trail version is wanted).

## Interpretation

Two model tiers, 18 routing runs total (12 Fable + 6 Opus), one dependency added. The premise
behind the original 31KB spec — that capable agents reflexively over-reach for impressive
technology — is **not supported at either tier tested**. Restraint, existing-stack respect, and
version-checking are baseline behavior here, not skill-dependent behavior.

This does not mean the skill is worthless; it means its value is not in routing at these tiers.
Untested territory that could still justify it:

1. **Genuinely smaller models** (Sonnet/Haiku) and **other agents** (Codex) — the harness targets
   cross-agent portability, and neither arm tested a cheap model.
2. **Layer C execution quality** — every run proposed sound architecture; none has been made to
   build it. Proposing a sprite-atlas Canvas is not shipping a smooth 500-node scene.
3. **Design craft** — routing proposals cannot show whether shipped work looks distinctive or
   generic. Design coherence is only measurable on implemented output.

Recommendation unchanged and now better supported: **do not write routing/restraint rules into
skill v1.** Either run a cheap-model arm to find the tier where judgment degrades, or pivot the
harness to Layer C, where the open question actually lives.

## Environment caveats

- n = 1 per eval per model; no variance estimate. Reps 2–3 unrun.
- Both arms ran in an environment with other skills installed (frontend-design, ui-ux-pro-max,
  superpowers, everything-claude-code); none reported invoking them.
- A local `Fact-Forcing Gate` hook fires inside subagents on first Bash/Write/destructive calls,
  consuming some effort and, in one crashed run, producing a verbose compliance preamble. It
  applies to both arms equally but is not part of a clean-room baseline; a dedicated eval machine
  without such hooks would be preferable for official runs.
- 2 of 6 Opus runs (E1, E2) and 4 of 6 Fable clean runs hit server-side API errors and were
  relaunched on pristine fixture copies. No partial-run output was scored.

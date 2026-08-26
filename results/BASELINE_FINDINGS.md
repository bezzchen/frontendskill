# Phase 0B baseline — rep 1 findings (2026-08-10)

12 routing runs completed: all six evals, each against two fixture variants (as-shipped
"coached" fixtures, then de-instrumented "clean" fixtures). Model: claude-fable-5 via fresh-context
subagents. Raw records: `rep1_runs.json`; full proposals: `proposals/`.

## Finding 1 — Harness validity bug (fixed mid-run): fixtures coached the agents

The v1.2 fixtures leaked eval expectations into agent-visible surfaces:

- Fixture READMEs contained rubric text ("Stale Anime.js v3 patterns count as a version-freshness
  failure", "no animation or graphics libraries", "Do not modify the fixture before a run").
- Page copy rendered "Evaluation fixture" / "Anime.js v4 fixture" / "intentionally restrained".
- Layout metadata and git commit messages ("Pinned evaluation fixture", "Freeze dependency lock
  for official eval") identified the repo as an eval.

Two of six coached runs explicitly cited README instrumentation as decision input (E2 quoted the
v3-failure warning; E5 cited "no graphics libraries" as a reason to add nothing).

**Fix applied:** neutral READMEs/copy/metadata, squashed single-commit history ("Initial commit"),
re-pinned manifest (next-tailwind-base `edf3be4`, anime-v4-portfolio `6f5dcaa`), builds re-verified.
All future runs must use the de-instrumented fixtures.

## Finding 2 — The coaching didn't change outcomes: the baseline is strong either way

Decisions were essentially identical across coached and clean variants:

| Eval | Coached | Clean |
|---|---|---|
| E1 settings | 0 deps, CSS-only | 0 deps, CSS-only |
| E2 anime v4 | 0 deps, Anime v4 (verified API in node_modules) | 0 deps, Anime v4 (verified API in node_modules) |
| E3 scroll story | 0 deps, sticky pin + rAF scrub | 0 deps, sticky pin + rAF scrub |
| E4 GPU media | 0 deps, raw WebGL2 (ogl as swap-in) | +ogl only |
| E5 500 nodes | 0 deps, Canvas 2D + atlas | 0 deps, Canvas 2D + atlas |
| E6 vague "dynamic" | diagnose-first, 0 deps | diagnose-first, 0 deps (ran the site first) |

Across 12 runs: **one dependency added in total** (ogl, a defensible pick inside E4's expected set),
**zero critical failure signals** (no Three.js/R3F escalation, no engine stacking, no DOM-to-canvas
migration, no reduced-motion content loss, no Anime v3 API patterns), **12/12 instruction
compliance** (proposal-only, no implementation). Both E2 runs installed from the lockfile and
enumerated the installed v4 exports before proposing — version-freshness behavior appeared
unprompted in the baseline.

## Finding 3 — Implications for the skill (EVAL_PLAN Phase 1/2)

Per the plan's own principle — "Do not teach the future skill behaviors the baseline already
handles reliably" — **routing/restraint rules for these six scenarios should not be the core of
skill v1 for this model tier.** The original spec's assumed failure modes (dependency escalation,
Three.js reflex, stale APIs, motion-as-first-answer) did not appear in any of 12 Fable runs.

Where the skill may still earn its keep (untested here):

1. **Weaker/cheaper models** — the failure modes may be alive on smaller models or other agents
   (Codex). A 6-run arm on a smaller model would answer this cheaply. The harness explicitly
   targets cross-agent portability, so this matters before concluding anything.
2. **Layer C execution quality** — proposing Canvas-atlas architecture is not the same as
   shipping a smooth 500-node scene. The pinned implementation evals remain unrun.
3. **Visual/design craft** — routing proposals say nothing about whether shipped work is
   distinctive vs. generic. Design-coherence judgment is only measurable on implemented output.
4. **Activation** — Layer A remains untested (needs a SKILL.md description first).

## Caveats

- n = 1 per eval per variant; no variance estimate yet (reps 2–3 not run).
- One model (claude-fable-5), one agent (Claude Code), default settings.
- Subagents ran in an environment with other skills installed (frontend-design, ui-ux-pro-max,
  superpowers, everything-claude-code); none reported invoking them, but one E3 run mentioned an
  installed skill's technique in its rejection list — environment skill listings are visible.
- Dispatch prompts added one neutral instruction (write PROPOSAL.md + summarize); otherwise
  verbatim eval prompts.
- Scoring against the 8-dimension rubric is deliberately not done here; that is the harness
  owner's blind-review step (Phase 0C).

## Open question for the harness owner

E4-clean asserted curtains.js is unmaintained — **verified against the npm registry on
2026-08-10**: `curtainsjs` last published 2024-05-02 (v8.1.6, 27+ months stale), while its
successor `gpu-curtains` last published 2026-03-24 and is actively maintained. The I4 Layer-C pin
(`curtainsjs@8.1.6`) therefore tests execution of a stale library — keep only if that is the
deliberate intent (docs-lookup under stale-API conditions); otherwise pin `ogl` or `gpu-curtains`.

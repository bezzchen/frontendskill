# With-skill condition protocol — pre-registered 2026-08-25, before any with-skill run

Defines how the `with_skill_v1` condition is delivered, for every Section E arm. Written and
frozen before the first with-skill run (the S0/D0 plan-only arms).

## Condition definition

`with_skill_v1` = the agent receives the **verbatim body** of
`skill/creative-frontend-architect/SKILL.md` (frontmatter stripped, name kept) as a
loaded-skill context block, followed by the **unchanged pinned task prompt**. Nothing else
differs from the baseline condition: same fixtures at the same SHAs, fresh pristine copy per
rep, same model tier (Fable), fresh context per rep, plan-only arms stay plan-only.

Wrapper template (verbatim; substitutions are RUN_DIR and the pinned PROMPT only):

```
A skill from your environment is loaded for this task:

<skill name="creative-frontend-architect">
[SKILL.md body, frontmatter stripped]
</skill>

Work in the repository at RUN_DIR — a Next.js 16 + Tailwind project.

[PINNED PROMPT VERBATIM]
```

## Why the skill is pre-loaded rather than activation-gated

At runtime a skill loads only when the agent invokes it off the name+description. Criterion C
measured that boundary directly (2026-08-24: 70/70, including both task shapes in this wave —
S0 is a choosing-creative-direction brief, D0 is an adopt-vs-build sourcing brief, both
explicit positives). Pre-loading therefore tests the skill's *content* without re-testing its
already-verified activation. If a future arm uses a task shape not covered by the trigger
suite, activation must be probed first.

## Scoring for this wave (restating pre-registered criterion G; frozen 2026-08-14/v2.1)

- **S0 with-skill (G2):** classifies the unlabeled brief into the S register AND proposes a
  visually dominant realtime/graphical system, in **≥ 2/3 reps**. Evidence = proposal text;
  tabulation quotes the classification and the proposed system verbatim.
- **D0 with-skill (G4):** searches/plans a concrete catalog check (real catalogs named,
  treated as a sourcing step, not a vague nod) in **≥ 2/3 reps**, AND the resulting verdicts
  meet D1's decision-quality bar (evidence-cited adopt/adapt/reference-only/custom per
  effect; identity preserved; "nothing fits" first-class).
- Proposals are captured to `results/proposals_e/` and the owner confirms the tabulation;
  quotes are mandatory so the calls are auditable.

## Limitations on the record

- The baseline plan-only wave's operational wrapper (the sentence around the pinned prompt)
  was not itself pinned in `results/proposals21/WAVE_RECORD.json`; it is known to have been a
  minimal work-here framing. The wrapper above is equally minimal; the only intended
  condition difference is the skill block. This is a documented parity assumption, not a
  proven identity.
- Standing environment confounds apply unchanged (Fact-Forcing Gate inside subagents; the
  environment's real skill listings exist around the injected block).
- Plan-only reps run in parallel (documented safe); implementation arms remain serialized.

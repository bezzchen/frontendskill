# Trigger-test probe protocol — pre-registered 2026-08-24, before any probe ran

Operationalizes success-bar **criterion C** for `evals/trigger_queries.json` against
`skill/creative-frontend-architect/SKILL.md` v1. Written and frozen before the first probe.

## Mechanism

One fresh subagent per probe (no shared context between reps or queries), model tier =
Fable (the primary baseline arm). The probe shows the agent a **fixed six-skill roster**
(names + descriptions only — the body is not shown, matching how activation works at
runtime) plus one user query, and asks which skill(s) it would invoke, or "none".

Probe prompt template (verbatim; `<QUERY>` is the only substitution):

```
You are a coding agent. Your environment lists these skills; a skill is invoked before
responding when its description matches the task. Consider ONLY this roster; ignore any
other skill lists you may have seen.

- code-review — Review a diff or PR for correctness bugs, security issues, and cleanups.
- creative-frontend-architect — Use when a frontend task involves choosing the visual or creative direction — deciding the animation/graphics architecture or stack (CSS/WAAPI, Motion, Anime.js, GSAP, canvas/Pixi, Three/R3F, WebGPU), picking how expressive a surface should be (quiet UI vs expressive marketing page vs immersive realtime spectacle), weighing whether a visual effect should be adopted from a component catalog or built custom, or making a page feel distinctive/premium/alive when the cause is undiagnosed. Covers new builds and redesigns where art direction, interaction style, or the rendering stack is open, including deciding that no motion library is needed. Do NOT use when design and architecture are already decided and the task is execution only — fixing bugs in existing animation code, spot edits like a spinner or hover state, animating one existing component without redesign, implementing a supplied design or mockup exactly as specified, or renaming classes/tokens.
- database-migrations — Plan and apply safe, reversible database schema migrations.
- e2e-testing — Generate, maintain, and run end-to-end browser tests for critical user flows.
- frontend-design — Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
- tdd-workflow — Write tests first, then implement; enforce tests-before-code for features and bug fixes.

The user's request:
"<QUERY>"

Which skill(s) would you invoke before responding, if any? Reply with only skill names
separated by commas, or exactly "none". No explanation.
```

Roster design: alphabetical order (pinned); five distractors spanning plausible neighbors.
`frontend-design` is included deliberately — it is the hardest realistic confuser, it
coexists with this skill in the owner's real environment, and multi-skill replies are
allowed precisely so director+architect co-activation is not forced into a false choice.

## Scoring (interpretation fixed before running)

- Per-rep correct: for `should_trigger: true`, `creative-frontend-architect` appears in the
  reply (alone or with others); for `should_trigger: false`, it does not appear.
- Query-level pass: correct in **≥ 4 of 5** reps (uniform for positives and negatives).
- Criterion C application: **all 5 `core_positive` queries must pass**; **≥ 80% of the 5
  `near_miss_negative` queries** (≥ 4 of 5 queries) must pass; `boundary_positive` and
  `easy_negative` are recorded as diagnostics and cannot compensate for failures.

## Documented confounds

- Probes run inside the owner's environment: subagents carry its hooks (Fact-Forcing Gate)
  and real skill listings. The template's "consider ONLY this roster" line mitigates but
  cannot fully remove this. The environment also carries a standing meta-instruction that
  biases toward invoking skills, which inflates trigger rates uniformly — it works against
  negatives passing and for positives passing; the positive-vs-negative contrast is the
  load-bearing signal.
- Multi-skill replies mean a rep can be correct for this skill while also naming others;
  co-invocations are recorded for the findings but do not affect pass/fail.

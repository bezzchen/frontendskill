# Creative Frontend Architect

An experimental Agent Skill for connecting frontend design direction, architecture,
implementation and review of the running result.

**This branch contains skill v2.0.0-alpha.1.** It is an integration candidate, not a proven
visual-quality improvement. [Development evidence](results/composition_v2/README.md)
distinguishes checks performed from the comparative experiments still required.

The [eight-case behavioral suite](results/composition_v2/behavior-suite/README.md) records
explicit and natural-selection builds, browser observations, seeded reviews and repairs.
It exposes remaining selection and catalog-budget gates; it does not establish superiority
over the incumbent or another director. The runtime remains v2.0.0-alpha.1.

## What it does

1. Reuses the brief and project identity in a compact surface-level design contract.
2. Uses one director: an already established director, the pinned Anthropic scoped
   adaptation, or an explicitly labeled builtin fallback.
3. Resolves open Q/W/S expression, sourcing and rendering choices.
4. Implements within settled decisions, consulting specialists only as needed.
5. Reviews the live result against the brief, corrects findings and rechecks.

The four measured v1 behaviors remain: pause inactive owned work, verify real conditions,
check catalog fit before custom effects, and explicitly weigh spectacle when warranted.
New composition instructions are experimental. Plans, registry entries and successful
syntax checks do not establish design quality.

## Install the candidate

Install **the whole folder**, including `references/` and `integrations.lock.json`.
Choose the command for your host from this repository checkout:

```sh
# Codex
mkdir -p ~/.codex/skills
cp -R skill/creative-frontend-architect ~/.codex/skills/

# Claude Code
mkdir -p ~/.claude/skills
cp -R skill/creative-frontend-architect ~/.claude/skills/
```

Use a temporary project skill directory for a trial before replacing a current installation.
Only hosts named in the development evidence have been exercised. The core references use
ordinary file/browser/agent capabilities; there is no installer service or custom dispatcher.

Invoke `/creative-frontend-architect` or use your host's skill selection for a new interface
or substantive redesign with open direction/architecture. Isolated style fixes and exact
execution of supplied designs stay outside automatic scope. Explicit invocation preserves
settled choices rather than reopening them.

### Optional Anthropic source

The adapter reads a separately prepared local source. It does not download or install one.
Use the `frontend-design/SKILL.md` advertised by the host roster, or set
`CFA_ANTHROPIC_SOURCE` to an existing file. The [manifest](skill/creative-frontend-architect/integrations.lock.json)
pins revision `34040c9c568585f6929bedeaad110ad08f079624` of
[Anthropic's frontend-design](https://github.com/anthropics/skills/tree/34040c9c568585f6929bedeaad110ad08f079624/skills/frontend-design).
Keep its license with the prepared source.

The adapter checks actual file content, not just the skill name or repository revision.
Missing, mismatched or incompatible sources use `builtin-fallback` and record why.
`anthropic-scoped-adaptation` means the source informed the bounded art-direction handoff;
it does not mean the entire upstream workflow ran. Review-method provenance is separately
attributed to OneRedOak. No external source is required for the packaged fallback.

## Verify and evaluate

```sh
python3 scripts/check_skill_package.py
python3 -m unittest discover -s tests -p 'test_skill_package.py'
```

These check packaging and failure behavior, not visual quality. The review development
fixture is in `evals/fixtures/composition_v2_review/`; its README is a runner answer key
and must not be shown to the initial reviewer.

[The v2 protocol](evals/composition_v2_protocol.md) separates the architect/handoff
contribution from independent review versus equally funded self-review. Its development
probes are separate from held-out build briefs. Freeze the exact environment and budgets
before efficacy runs. Impeccable and the specialist shortlist remain future trials until
that path demonstrates value; the research registry is not a dependency manifest.

## Stable version and historical evidence

The pre-v2 entrypoint is preserved byte-for-byte in
[`SKILL.v1.2-frozen.md`](skill/creative-frontend-architect/SKILL.v1.2-frozen.md).
To restore that single-file version, install it under the name `SKILL.md` in the host skill
directory. The reviewed pre-v2 repository revision is
`f1754947a3ad6841413e1235f0d9c21bbc32dd30`.

Read [VERDICT.md](VERDICT.md) for the historical programme: the earlier skill changed
process and modestly improved some architecture decisions, but did not establish better
built outputs. Those historical measurements primarily concern older skill bodies and
specific tested conditions. They do not measure the new v2 composition or all v1.2 behavior.
Frozen protocols, fixtures, verdicts and result records remain unchanged.

## Repository map

- `skill/creative-frontend-architect/`: installable candidate and frozen earlier bodies.
- `evals/`: historical protocols plus the new composition experiment definitions.
- `scripts/`: existing measurement tools and the package validator.
- `results/`: historical evidence and separately identified v2 development evidence.
- `registries/`: research candidates, not automatically loaded dependencies.
- [ARCHITECTURE_V2.md](ARCHITECTURE_V2.md): implemented boundaries and deferred integrations.
- [Skill usage](skill/creative-frontend-architect/README.md): examples and fallback behavior.

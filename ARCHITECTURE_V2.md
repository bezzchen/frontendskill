# Creative frontend architecture v2 — experimental implementation

The installable candidate now connects the stages below using Markdown references and the
host's existing tools. It is not a custom runtime. Source loading, independent-agent
availability and live browser checks must be observed; instructions alone do not prove them.

```text
Brief + established project identity
  -> reuse or complete the surface design contract
  -> one design director (only if direction remains open)
  -> open register / sourcing / renderer decisions
  -> relevant available specialist, if needed
  -> implementation
  -> independent rendered review, or labeled self-review/unverified fallback
  -> bounded correction and recheck
```

Skip settled stages. Respect plan-only scope. Reuse existing conventions and user decisions;
clarify only consequential missing information. Selective loading reduces unnecessary reads
but cannot remove conflicting instructions already loaded into a conversation.

## Runtime package

`skill/creative-frontend-architect/` contains the complete workflow:

- `SKILL.md`: triggers, stage routing, ownership and four visible behavioral invariants.
- `references/design-contract.md`: shared surface contract and builtin fallback design read.
- `references/architecture.md`: Q/W/S, bounded sourcing, engine ownership and lifecycle.
- `references/directors/anthropic.md`: prepared-source resolution and scoped art direction.
- `references/rendered-review.md`: live checks, evidence format, independence and bounded fixes.
- `integrations.lock.json`: reviewed pins, prerequisites, compatibility and provenance.

## One owner per concern

One director per **surface** owns concept, hierarchy, typography, palette and composition,
while preserving project-wide identity and tokens. The architect operationalizes intended
expression and owns sourcing, renderer boundaries, engine choice and performance architecture.
Specialists own current APIs/deep technique. The reviewer distinguishes reproducible defects
from preferences; it does not become a second director.

Multiple libraries may coexist when they own separate concerns; two engines may not control
the same transform, timeline or rendering work. Catalogs provide copy-in primitives assessed
as adopt/adapt/reference-only/custom. Substrates provide rendering infrastructure. Neither
substitutes for art direction.

Continuous-work checks retain surface-level ownership, active shared consumers and real
scroll/visibility conditions. Global rAF counts are discovery evidence, not an automatic
failure. Missing conditions are explicitly unverified.

## Source and host boundaries

Anthropic's pinned skill is read as source material through the documented scoped adaptation,
not independently activated as a full competing workflow. Actual bytes must match the pin;
installed revision and tested revision remain separate facts. Missing or incompatible source
uses the builtin fallback. The package does not auto-install or track upstream main silently.

The review method is attributed to OneRedOak, without loading its provider-specific agent.
Hosts without separate agents use labeled self-review; hosts without browser access cannot
claim rendered approval. Compatibility is recorded only for configurations actually exercised.

## Evaluation and deferred work

See `results/composition_v2/README.md` for development evidence and
`evals/composition_v2_protocol.md` for the staged comparison. The architect/handoff and
independent-review effects are measured separately with matched total budgets. Development
fixtures are excluded from efficacy results; promotion needs fresh confirmation.

Impeccable's runtime/context prerequisites and ordinary new-work rendering decisions need
their own adapter and trial. Interface-design remains a product-surface director candidate.
Emil's prototype/motion and Scottstts's camera/graphics validation are selected next trials,
along with engine-specific vendor guidance. These candidates are not supported dependencies
merely because they appear in the research registry.

Historical verdicts and frozen skill bodies remain available; their results are not relabeled
as v2 measurements.

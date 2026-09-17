# Shared design contract

Use this to pass settled decisions between design, architecture, implementation and review.
It is one evolving surface-level record, not a fresh questionnaire for each stage. Reuse
existing design documentation and reference project tokens instead of copying them.
For substantial work with no existing location, save `.design/contract.md`; use named
surface sections or separate surface files when the project has several. Small tasks
can keep these facts in working context. Omit irrelevant fields rather than inventing detail.

```markdown
# Design contract — [surface]
Surface and user task:
Original brief and acceptance conditions:
Authoritative project design files:
Settled decisions and constraints:
Open decisions:
Director / mode / actual source revision or hash:
Visual concept and content hierarchy:
Existing tokens/components to reuse; required additions:
Responsive behavior and important interaction states:
Register and reason:
Renderer/engine ownership and sourcing decisions:
Verification required; observed evidence; remaining unknowns:
```

The original brief remains available to the reviewer. A contract may explain how to fulfill
it; it may not quietly remove an acceptance condition. Record a material revision and its
reason. Existing user authorization covers routine decisions and fixes within scope.

## Ownership

| Concern | Owner | Handoff |
|---|---|---|
| Concept, content hierarchy, typography, palette, composition | One director per surface | Intent, tokens, layout/responsive decisions and primary interaction |
| Expression and implementation fit | Architect, informed by director intent | Q/W/S reason, sourcing verdict, renderer/engine boundaries, fallback and lifecycle |
| Engine API and deep technique | Selected specialist | Version-correct implementation guidance within those boundaries |
| Implementation | Builder | Running route, important states, reproduction/start instructions |
| Observed quality | Reviewer | Reproducible defects; separately labeled preferences; evidence and unknowns |

Resolve conflicts using user requirements, established project conventions, then the
accepted contract before module defaults. A later explicit user instruction can revise a
settled decision. If the design cannot meet a technical constraint, offer a concrete
tradeoff or choose within delegated authority. Do not silently weaken accessibility or
functional requirements to preserve an effect. An aesthetic preference is not a defect
unless it violates the brief/contract or prevents use.

## Builtin fallback design read

When no suitable verified director is available, record `director: builtin-fallback` and
the reason. This is local guidance, not an Anthropic or Impeccable run.

- Infer the audience and primary task from the brief and project. Ask only if missing
  information materially prevents progress; honor a request to decide.
- Establish one subject-specific concept and a content hierarchy that serves that task.
  For an existing product, reuse its identity, tokens and components. For a new surface,
  choose only the color/type/layout tokens needed to implement the concept.
- State the narrow-screen transformation and the primary interaction's relevant states.
  Review the proposal against the actual brief, then continue to open architecture choices.

There is no mandatory moodboard, multiple-concept selection or approval ceremony here.
Use those only when the task or an unresolved consequential decision calls for them.

## Reuse example

A studio's booking form and launch page share the same brand tokens. The booking form is
Q with native controls; the launch page is W with one expressive product demonstration.
The form does not inherit the launch page's motion budget. Neither surface invents a new
project identity. A supplied approved design skips concept generation entirely.

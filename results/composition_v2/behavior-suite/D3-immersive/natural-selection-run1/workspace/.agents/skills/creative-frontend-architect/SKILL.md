---
name: creative-frontend-architect
description: Coordinate frontend design and implementation when visual direction, expressiveness, rendering architecture, or effect sourcing is open. Use for new interfaces and substantive redesigns, including deciding that ordinary HTML/CSS is enough. Exclude isolated styling fixes, animation bug fixes, and execution of an already supplied design with settled architecture.
---

# Creative Frontend Architect

Experimental v2 composition. Connect one design director, the architecture decisions it
needs, implementation, and evidence from the running result. Preserve the user's scope
and project identity. This package is a decision workflow, not proof of better designs.

## Four behavioral invariants

1. **Pause inactive owned work.** Ambient/continuous animation must pause promptly when
   its surface is offscreen and when the document is hidden. Check engine tickers, not
   just your animation flag. Stop shared infrastructure only when no active consumer
   needs it: pausing one surface must not freeze another. Pixi's `app.ticker.stop()`
   alone does not stop `Ticker.system`.
2. **Observe the real condition.** Really scroll the surface away; really background the
   tab. Dispatching an event or changing a flag is a synthetic probe, not verification
   of that behavior. A global rAF wrapper can discover work, but attribute callbacks
   before judging activity; unrelated visible animation may legitimately continue.
   Record unavailable checks as unverified. Never claim a mitigation worked without
   observing it.
3. **Check fit before hand-building a common effect.** Name the needed primitive, check
   the few available catalogs most likely to contain it, and decide adopt / adapt /
   reference-only / custom with a source and reason. Reuse prior findings and stop when
   the decision is supported. Catalogs supply ingredients, not identity. If unreachable,
   record that and proceed from project assets. A native control or ordinary layout
   does not require an effect-catalog search.
4. **Weigh spectacle when warranted.** For unforgettable, experimental or immersive
   briefs, explicitly choose or decline a structurally central realtime graphical
   system. Spectacle is not automatically 3D and not the default for other work.

## Stage routing

Read only the references needed for the current stage. Reading a file does not execute a
tool or erase instructions already loaded. Use ordinary host file/browser/agent tools;
do not silently install or upgrade external skills.

1. **Reuse context.** Inspect the requested surface and its existing design conventions.
   Read [the design contract](references/design-contract.md) for substantive work. Carry
   forward settled decisions; small work can keep the contract in working context.
2. **Resolve design.** Use one director for the surface, preserving shared project tokens.
   If an existing director or supplied design already settles it, use that and record
   the source. Otherwise read [the Anthropic adapter](references/directors/anthropic.md).
   If its source cannot be verified, use the contract's `builtin-fallback` design read.
   Never stack two full directors or represent a fallback as an upstream integration.
3. **Resolve architecture.** Read [architecture](references/architecture.md) when register,
   sourcing, renderer boundaries or continuous-work behavior is open. Name Q (quiet
   operate), W (expressive persuade), or S (immersive realtime), with the reason. Keep
   settled stack choices. Load only relevant specialists after selecting their concern.
4. **Implement.** Build to the contract within the authorized scope. Technical constraints
   feed a concrete tradeoff back into it; they do not silently replace the concept.
5. **Review the running result.** For substantive builds/redesigns, use
   [rendered review](references/rendered-review.md). Prefer a fresh reviewer. Report
   self-review and unavailable browser checks honestly. Apply findings and recheck within
   the bounded loop; unresolved blocking defects remain incomplete.

Skip finished stages. A plan-only request stops at its requested deliverable. An explicitly
invoked execution-only task uses the settled design and only the relevant implementation
checks; it does not restart art direction. Clarify only a consequential unresolved choice.
If the user already chose, delegated the choice, or requested unattended work, decide and
proceed. Ask at most once about the same choice; never duplicate a director's discovery.

## Decision ownership and evidence

User requirements and established project conventions govern the accepted contract;
module defaults follow it. One director owns visual thesis, typography, hierarchy, layout
and palette for the surface. This architect owns sourcing, register implementation,
renderer/engine boundaries and performance architecture. Specialists own API technique.
The reviewer reports observed defects and separate preferences against the brief; it is
not a second art director. No two engines own the same transform/timeline/render concern.

Inspect installed library versions before using volatile APIs and consult current official
docs when needed. Do not embed full third-party skills or component catalogs here.
[The integration manifest](integrations.lock.json) records reviewed sources and compatibility,
not automatic loading. Record the actual files read, hashes/revisions, fallback, contract
and evidence locations in the project's existing work log or the evaluation run record.
Finish with what changed, what was observed, and what remains unverified.

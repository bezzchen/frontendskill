# Scoring rubric

## Described ≠ demonstrated (binding from v1.6)

Rep-1 scoring put 87.9% of cells at the maximum, largely because Performance, Accessibility,
Responsive, and Tool Depth were awarded 4s for **proposals describing** mitigations that were never
built. Therefore:

- **Layer B (routing/proposals):** only Conceptual Fit, Architectural Restraint, and Existing-Stack
  Respect drive pass/fail. The other five dimensions are recorded as *plan-quality* signals and
  carry no decision weight at proposal stage.
- **Layer C (implementations):** Tool Depth, Performance, Accessibility, and Responsive are gated by
  the measurements in `execution_measurement.md`. A dimension may reach 4 only when its measurement
  passes; a described-but-unmeasured mitigation caps that dimension at 2, and `NOT_MEASURED` is
  never a pass.
- Design Coherence stays human-scored from rendered screenshots, by design.

Score artifacts blind where practical. Randomize result labels before review. Review code/screenshots before reading execution traces when possible.

Use `N/A` when a dimension genuinely does not apply. N/A dimensions are excluded from that run's denominator; never convert N/A to zero.

## 1. Conceptual fit

- **0** — Architecture conflicts with the actual experience or misunderstands the problem.
- **1** — Partially relevant technology, but major conceptual mismatch.
- **2** — Workable approach, though alternatives fit the experience materially better.
- **3** — Strong fit; technology and interaction model support the requested experience with minor compromises.
- **4** — Excellent fit; the architecture grows naturally from the interaction/design problem and nearest alternatives are rejected for clear reasons.

## 2. Architectural restraint

- **0** — Fundamentally inappropriate or sprawling architecture.
- **1** — Major unnecessary complexity, dependencies, or renderer escalation.
- **2** — Workable but clearly heavier or more redundant than necessary.
- **3** — Appropriate architecture with only minor redundancy or avoidable complexity.
- **4** — Minimal sufficient architecture with crisp ownership boundaries and no novelty-driven dependencies.

## 3. Existing-stack respect

- **0** — Replaces/duplicates a capable existing stack without justification.
- **1** — Mostly ignores the installed architecture and adds substantial overlap.
- **2** — Notices the existing stack but still adds avoidable duplication.
- **3** — Preserves and extends existing capabilities, adding only a defensible dependency.
- **4** — Treats the installed stack/version as a first-class constraint and adds/replaces technology only when a concrete capability gap is demonstrated.

## 4. Tool depth

- **0** — Incorrect/stale API or superficial use that cannot deliver the requested effect.
- **1** — Basic cookbook usage with important capabilities missed.
- **2** — Competent use of standard capabilities.
- **3** — Uses tool-specific strengths appropriately and handles lifecycle/integration concerns.
- **4** — Expert use of the selected tool's distinctive capabilities with version-correct patterns and clear integration boundaries.
- **N/A** — No specialist tool is appropriate and native CSS/browser primitives are intentionally sufficient.

## 5. Performance judgment

- **0** — Architecture is predictably expensive or unsafe for the task.
- **1** — Major performance risks ignored.
- **2** — Basic performance awareness but incomplete strategy.
- **3** — Appropriate rendering/per-frame/lifecycle strategy with sensible fallbacks.
- **4** — Performance is part of the architecture: batching/render-loop ownership, pausing, DPR/asset strategy, cleanup, and adaptive quality are addressed as relevant.

## 6. Accessibility / reduced motion

- **0** — Core content/interaction becomes unusable.
- **1** — Accessibility is largely ignored or reduced motion simply removes information.
- **2** — Basic fallback exists but important interaction/accessibility gaps remain.
- **3** — Semantic/keyboard/reduced-motion behavior is deliberately preserved.
- **4** — Accessibility is integrated into architecture rather than patched on, including meaningful nonvisual/low-motion representations where needed.

## 7. Responsive/mobile judgment

- **0** — Desktop behavior is simply forced onto mobile or breaks.
- **1** — Mobile is acknowledged but not meaningfully designed.
- **2** — Basic responsive adaptation.
- **3** — Interaction is intentionally adapted to touch, viewport, and device constraints.
- **4** — Mobile receives an equally coherent but appropriately different interaction recipe when needed, with performance considered.

## 8. Design coherence

- **0** — Effects conflict with content/hierarchy or produce generic visual noise.
- **1** — Technically active but visually incoherent/template-like.
- **2** — Adequately polished but generic or inconsistently motivated.
- **3** — Motion/visual behavior supports hierarchy and a recognizable design idea.
- **4** — Highly coherent system: signature behavior, supporting motion, typography/layout, and restraint reinforce a clear visual/interaction thesis.

## Critical failure handling

Critical failure signals are recorded separately from numerical scoring.

A run can score reasonably in some dimensions and still fail because it exhibits a critical architecture/version/accessibility error.

Report:
- dimension scores;
- N/A dimensions;
- critical failures;
- short written rationale;
- confidence (low/medium/high).

# Deviation — E6base-rep2 (first relaunch) implemented on a plan-only eval

**Date:** 2026-09-01 · **Condition:** baseline_no_skill · **Model:** Fable · **Eval:** E6-vague-dynamic-intent

## What happened
E6's pinned prompt ends: *"Inspect the existing site first. Tell me what you would change and why
**before implementing anything**."* The suite's `run_policy.routing_phase_instruction` is
*"Inspect the repository and propose the architecture. Do not implement yet unless the prompt
explicitly requests otherwise."*

The run inspected, presented a plan, and then **implemented a full redesign anyway**: 5 files
modified, 2 new components, `next build`, `npm install` (334 MB node_modules), and a dev server left
listening on :3000. Its stated justification was that it was a "background run, stated up front" —
i.e. it treated the absence of an interactive user as license to proceed past a stated boundary.

## Ruling
**Run INVALID as a routing baseline and discarded**, per the wave policy that no partial artifact is
ever counted. It cannot be scored for criterion A regardless: Layer B scores a *proposal*, and the
returned artifact is an implementation report, not the proposal text.

Relaunched on a pristine copy with a byte-identical prompt.

## Preserved
Source-only diff (node_modules and .next excluded) at
`results/deviations/E6base-rep2-protocol-violation.diff` — 1820 lines. Kept for the record only;
never scored, never counted in any arm.

## Why this is worth keeping
1. **Second E6-specific misbehaviour.** Rep 1 is the programme's only sub-3.50 case (3.000), driven
   by an Architectural Restraint score of 2 — i.e. marked down for over-reach. Rep 2 over-reached
   past the plan/implement boundary itself. The vague-intent brief appears to induce scope
   escalation in the baseline, which is the exact behaviour E6 was designed to probe.
2. **It is an instrument observation, not just an incident.** A plan-only eval has no mechanical
   guard against implementation; compliance is currently verified only after the fact by
   `git status`. That check caught this one. It should stay mandatory for every plan-only run.
3. **Stray-server hygiene held.** The standing fix (kill stray dev servers before the next rep) was
   applied — PID 6921 killed, :3000 confirmed clear — before any further run was launched, so no
   cross-run contamination of the kind seen at W1ws-rep3 could occur.

## Not claimed
The discarded implementation was never measured by the M-battery, never screenshotted for review,
and is not evidence about baseline implementation quality. It is only evidence that the run
disregarded a stated boundary.

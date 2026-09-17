# Rendered review

Review the running surface against the original brief and accepted [design contract](design-contract.md). Preserve settled project style, components and tokens. A source skill's taste preference is not evidence that an accepted brand convention is defective.

## Handoff and independence

The builder/coordinator should dispatch one fresh reviewer when the host supports separate
agents. **If you have already been assigned that independent review, perform it yourself;
do not dispatch another reviewer just because this reference mentions a fresh agent.**
Supply only:

- the original brief and acceptance conditions;
- the accepted contract, including settled choices and known constraints;
- the running URL/route, startup/access instructions, relevant states and safe test data;
- locations where the reviewer may save evidence and inspect implementation files.

Exclude the builder's self-assessment, claimed score, prior findings and fixture answer keys from the initial review. Do not pass the builder conversation wholesale. The reviewer operates the interface first, then may inspect source to diagnose an observed issue. Record `review_mode: independent` and reviewer identity. Without a separate agent, make a distinct pass and record `review_mode: self-review`; do not call it independent.

## Operate before judging

Use the host's existing browser tools; no particular browser tool name or provider is required.

1. Open the supplied route. Complete the primary user task with realistic inputs; click, type and select as a user would. Observe the resulting state. Exercise relevant empty, loading, validation/error and success states that the surface supports. Record unavailable or untested states rather than inventing them.
2. Inspect a representative desktop viewport (default 1440 × 900) and narrow viewport (default 375 × 812). Resize and repeat the primary flow on narrow screens. Scroll through the entire surface; look for clipped or colliding text, horizontal overflow, obscured controls and loading remnants. Add an intermediate width when the layout warrants it.
3. Use Tab/Shift+Tab and Enter/Space to operate relevant controls. Check visible focus, logical order, labels and completion without a pointer. Examine motion at normal speed and reduced motion where present; a still screenshot cannot verify temporal behavior. Do not report assistive-technology checks that were not performed.
4. Capture the actual affected state: screenshots for spatial defects, a short recording or timed observations for motion, and interaction/console evidence for behavioral failures. Save viewport, state and reproduction steps with each capture. Source or DOM geometry can support diagnosis but cannot substitute for seeing the rendered result.

If preview/browser access fails, attempt the available local recovery within task scope. If it remains unavailable, set `verification_status: unverified`, name the missing checks and continue useful code inspection. No code-only review may claim rendered approval. Partial browser coverage also remains `unverified` for the untested required conditions.

## Findings and decision

For each finding record:

```text
Kind: observed defect | stylistic suggestion
Severity: blocker | major | minor | suggestion
Expected behavior: brief/contract requirement or concrete usability expectation
Observed behavior: what actually happened and its impact
Viewport/state and reproduction: dimensions, route, inputs and actions
Evidence location: capture/log path or unavailable with reason
Proposed smallest correction: preserve design intent; diagnose source if needed
```

A blocker prevents the primary task; a major defect materially harms use, access or legibility; a minor defect has limited impact. Preferences without an observed failure remain suggestions and do not fail the review. Intentional changes to concept, typography, palette or composition return to the design owner; do not silently redesign the surface during correction.

Report `result: pass | incomplete` separately from `verification_status: verified | unverified`. A pass requires the required live checks and no remaining blocker/major defect; list any minor findings and untested optional coverage. An unverified review cannot pass. This is a bounded check of this surface, not a claim of comprehensive accessibility conformance or measured design superiority.

## Correction and recheck

Return actionable findings to the builder. Allow at most **two correction-and-recheck cycles** by default; initial review is cycle 0. Each cycle consists of corrections followed by fresh browser evidence for affected behavior and the primary flow, including the affected viewport. Preserve before/after evidence and record the cycle count. Do not repeat unaffected checks without a reason.

If a blocker or major defect remains after cycle 2, report `result: incomplete` with remaining findings. The limit is a stopping boundary, not permission to pass. More cycles require explicit task scope; never erase failed evidence or relabel a self-review as independent.

## Provenance and adaptation

Method adapted from OneRedOak's [design-review agent](https://github.com/OneRedOak/claude-code-workflows/blob/6a653445125da828f31af473fcdd3cf29f99be82/design-review/design-review-agent.md), revision `6a653445125da828f31af473fcdd3cf29f99be82`. This is an original scoped adaptation, not a bundled upstream agent or a claim that it was loaded at runtime. It retains live interaction, responsive inspection, accessibility checks and evidence-based findings. It replaces provider-specific tools and PR-first context with host-neutral actions and a fresh brief/contract handoff, separates defects from taste, and adds explicit fallback modes and a bounded correction loop.

# Evaluation and package-validator review

Scope: `evaluation-review.diff`, current composition-v2 protocol/cases/metadata, `scripts/check_skill_package.py`, and `tests/test_skill_package.py`. Excluded the rendered-review fixture. No source files edited. Existing 17-test and actual-package pass reports were accepted without redundant reruns; one new targeted reproduction was performed.

Spec compliance: approved for the explicitly experimental implementation and draft, unexecuted efficacy definitions.

Quality verdict: approved after the narrow recheck below. No remaining actionable findings within scope.

## Resolved P2 — Reject local file URI dependencies instead of skipping them

Location: `work/frontendskill-v2/scripts/check_skill_package.py:85–89`, specifically the unconditional `parsed.scheme` skip at line 87.

The runtime-link traversal treats every URL scheme as an external reference. A Markdown link with a `file:` URI therefore bypasses `packaged_path`, even though it points to a machine-local file that is not shipped in the installed directory. This lets the installation gate return PASS for a missing or out-of-package runtime dependency, undermining the relocation/containment guarantee the checker provides.

Reproduction on 2026-09-17: copy the actual skill directory into a temporary installed directory; append `[Required local guide](file:///definitely-not-present/cfa-required-guide.md)` to `references/architecture.md`; run the checker on that installed directory. It returned exit code 0 and `PASS: package structure valid`. The source repository and real package were not modified.

Smallest correction: reject `file:` destinations explicitly as nonportable local dependencies before skipping genuine external links. Add a focused negative test for a missing/outside `file:` URI while preserving the existing successful HTTPS/anchor test. No network check is required.

Resolution rechecked on 2026-09-17: the runtime traversal now explicitly rejects `file`, `filesystem`, `vscode` and `vscode-insiders` schemes before the external-link skip. `test_local_file_uri_links_are_rejected` exercises all four schemes against a missing local target, while the positive external-link case keeps HTTPS, HTTP, mailto, anchors and code examples permitted. This addresses the reproduced bypass. The coordinator reports all 18 tests passing; no repeat suite run was needed for this narrow code/test inspection.

## Final evidence wording gate

Read the new `results/composition_v2/README.md` and `development-summary.json`. Their completion claims remain bounded to the documented smoke checks. Both explicitly say efficacy has not run and the full eight-probe suite has not run as defined. The README distinguishes planning-only activation/ownership behavior from live engine verification, reused reviewer context from a fresh reviewer, actual CSS repair from the positive-control toggle, model aliases from immutable snapshots, and known parent usage from unavailable all-agent cost. It also identifies the earlier review-reference hash and limits the manifest smoke status accordingly.

No unsupported production-readiness, general activation-accuracy or visual-superiority claim was found in these two summaries. Their outstanding full-suite, freeze, comparison and additional-host gates remain visible. This recheck assesses the code correction and accuracy of the scope/limitations wording; it does not independently rerun the recorded browser or CLI experiments.

## Findings on the evaluation definitions

No actionable causal-design or metadata issue found within the current draft scope. The protocol separates the architect/handoff bundle from reviewer independence, explicitly accounts for the scoped director adaptation as treatment, keeps ordinary checks symmetric, preserves all six continuation starts including failures, and reserves fresh confirmation cases. It records proposed budgets without claiming enforcement, requires concrete wrappers/fixtures/hashes and host controls before freeze, distinguishes assigned from actual exposure/fallback, and counts intervention/continuation work with unavailable accounting left null. Independent outcome assessment and condition-blind artifact handling are specified separately from the review intervention.

The case descriptions and unrun/null fields honestly remain specifications. Completion of all eight development probes, true activation checks, fixture construction, enforceable accounting and immutable freeze controls is still required before efficacy runs; their absence is disclosed rather than a defect in these draft definitions.

The existing package tests exercise real copied files and meaningful negative conditions: missing packaged references, escaping paths/symlinks, malformed manifests and pins, duplicate identities, and frontmatter errors. Their declared small Markdown/frontmatter parser scope is clear. The new finding above concerns a local dependency class skipped by traversal, not a request for a general YAML/CommonMark parser or behavioral verification.

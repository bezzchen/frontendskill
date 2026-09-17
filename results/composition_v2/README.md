# v2 development evidence — 2026-09-17

**The experimental composition works in the bounded smoke checks below. Visual-quality
superiority and production readiness have not been established.** The comparative protocol
is a draft; no A/B/C efficacy run has occurred. The eight full developmental fixtures in
`evals/composition_v2_cases.json` have not been executed as a complete suite.

Candidate: skill `2.0.0-alpha.1`, based on repository revision
`f1754947a3ad6841413e1235f0d9c21bbc32dd30`. Fresh CLI runs used `codex-cli 0.153.4`,
model alias `gpt-6-astra`, effort `high`, ephemeral sessions and task-local workspaces.
Browser checks used installed Playwright with Chromium headless shell revision 1243.
The alias is not an immutable model snapshot. This is development evidence, not a fair
comparison with another skill or model.

## Checks actually performed

| Check | Result and evidence |
|---|---|
| Package structure and failure cases | 18 stdlib tests pass, including a single-file install, missing references, escaping paths/symlinks, local file URIs, malformed pins and metadata. Actual package and copied installation pass. Bundled skill frontmatter validation passes. [Report](package-report.md) |
| Source identity | Adapter helper exercised matching, modified and absent files; missing/mismatched source falls back. The real build read matching pinned source content, not merely a hash. |
| Fresh build from installed folder | Harbor Bench page, design contract and work log produced. Settled colors and delegated choices preserved; source reads/hashes recorded. Build-stage browser access was deliberately unavailable and honestly recorded as unverified. [Run record](harbor-run.json), [source](harbor-build/index.html), [contract](harbor-build/design-contract.md), [work log](harbor-build/work-log.md) |
| Independent review of generated result | Desktop/mobile pointer and keyboard flows, validation, personalized confirmation, edit retention, focus and reduced-motion checks pass. No correction needed. Reviewer was separate from builder but reused an existing agent context. [Report](harbor-review/review-cycle-0.md) |
| Fresh review of seeded defects | A fresh reviewer found desktop title/date overlap and mobile submit interception through actual browser use; accepted gradient/type choices were preserved. The defective page correctly receives incomplete acceptance. [Report](fieldnotes-initial/review.md), [observations](fieldnotes-initial/observations.json) |
| Actual repair and recheck | Coordinator changed the copied source's CSS; a separate reviewer confirmed both defects fixed and primary flows working. Plain route used, not `?fixed=1`. [Repair](fieldnotes-corrected/repair.diff), [recheck](fieldnotes-recheck/review-cycle-1.md) |
| Natural positive selection | With the candidate in a project skill roster, an architecture request selected/read it without naming it in the prompt. It reused approved design, chose S and ownership boundaries, acknowledged offline catalogs and stayed plan-only. [Trace](activation-trace.jsonl), [decision](activation-decision.md) |
| Natural negative selection | A radius-only edit changed just `.button` from 4px to 6px. The architect body was not read. [Trace](near-miss-trace.jsonl), [result](near-miss-styles.css) |
| Missing director fallback | A fresh process observed the missing selected path, used `builtin-fallback`, preserved supplied tokens/native controls and produced the requested plan without an install or another approval request. [Trace](fallback-trace.jsonl), [log](fallback/work-log.md) |

The positive/negative selection checks are one example each under the actual local roster,
not an activation accuracy percentage. Offline catalog handling and shared-renderer ownership
in the natural-positive run were planning behavior, not live engine verification.

## Problems discovered and corrected during development

- Independent code review reproduced a validator bypass through `file:` links. The validator
  now rejects machine-local URI dependencies, with a regression test. See
  [evaluation review](evaluation-review.md) and the updated package report.
- An agent assigned the rendered-review role interpreted “use a fresh reviewer” as a reason
  to delegate again. The current protocol distinguishes coordinator dispatch from assigned
  reviewer execution. The later repair recheck executed directly. This is a narrow correction
  based on observed behavior; broad efficiency improvement has not been measured.
- A simple fresh build used 315,318 aggregate input/output tokens, including repeated cached
  input. Draft experiment allowances were revised before any efficacy run; exact enforcement
  still needs freezing. These totals are not unique prompt sizes or billed costs.

## Independence, accounting and environment limits

The first separate-agent Field Notes review had prior implementation-plan context. It is
preserved under [blind-review/](blind-review/review-cycle-0.md) with that limitation and is
**not** the fresh-review evidence. The subsequent `fieldnotes-initial/` run began in a fresh
CLI session and dispatched a fresh reviewer with only the review protocol, brief, URL and
tools. The repair recheck appropriately knew the earlier findings and was independent of
the coordinator's code repair; it was not a new blind review.

Live active-element diagnostics incidentally exposed inline script text after initial visual
inspection in two reviews. The reports disclose this; no hidden source file or answer key
was supplied to the fresh reviewer. This limits a claim of source-blindness while preserving
the observed pointer failure and screenshots. The collector was adjusted to avoid BODY/HTML
text for later runs.

General `using-superpowers`/`brainstorming` instructions appeared in the fresh build, and
planning guidance appeared in the natural activation run. No second director was observed,
but these are not clean efficacy contexts. The CLI also emitted a pre-existing global
`hooks.json` parse warning and continued. No global hooks/configuration were changed.

Raw prompts/traces, observations and screenshots accompany the reports. Some trace/report
paths and browser helpers identify the original machine's scratch directories and bundled
runtime; they document the run, not portable installation dependencies. The captured source
and repaired pages can be served locally with an ordinary static server. Reconfigure helper
paths and localhost ports to reproduce them elsewhere.

[development-summary.json](development-summary.json) records statuses and actual CLI usage.
Cached/reasoning token fields are subsets. Fresh-review child usage and collaboration-reviewer
usage are not separately exposed, so total all-agent cost remains unknown. The builder's
known partial total must not be presented as the complete workflow cost.

The build read an earlier review-reference hash; its actual loaded hashes remain in the run
record. Current protocol adds the dispatch guard. The manifest's bounded smoke-test status
covers the Anthropic source-resolution/design handoff on this host, not all package behavior,
upstream workflow certification or later text revisions.

## Remaining gates

Run the complete development suite, including actual shared-ticker/offscreen/document-hidden
cases. Freeze source/host/model, fixtures, comparison wrappers and enforceable budgets before
the matched pilot and fresh confirmation. Test other hosts and more activation cases. Keep
Impeccable and optional specialists as separate gated additions. Historical verdicts and
frozen evaluation records have not been changed or counted as v2 successes.

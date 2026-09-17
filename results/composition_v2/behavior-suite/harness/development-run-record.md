# Behavioral development suite — execution record

Prepared 2026-09-17 before starting candidate runs. This executes the eight development
cases in `evals/composition_v2_cases.json`, twice each: explicit invocation and ordinary
user prompt/natural selection. It does not execute, freeze, or score comparative A/B/C
experiments. Candidate at dispatch is commit `12f509e61d8aa15de2bfcc54195a7def07bda0a8`.

Each task gets a fresh ephemeral Codex CLI context, a new fixture copy, the full installed
candidate folder, and neutral project/environment instructions. The natural prompt is
the exact case prompt. The explicit prompt adds only an invocation sentence. Original
fixtures and hashes are retained; later repairs retain the original failed artifact.
Repository research, expectations and prior results are excluded by task instructions;
this is not an OS-enforced read barrier. Trace audits check unexpected reads.

## Scope interpretation made before execution

D1 supplies settled design and architecture. D8 requests a focused animation lifecycle
repair. Both match exclusions in the candidate's current description. Their natural
nonselection is an intended exclusion, not a false negative. Their explicit runs test
whether invoking the skill respects settled scope and applies relevant checks. Both
modes still implement the request. The other six cases are positive selection probes.
Selection, skill exposure, behavioral outcome and rendered verification are separate
fields; a good result without candidate exposure does not validate candidate behavior.

## Environment and limits

- Codex CLI with `--ignore-user-config --ephemeral --approve-for-me`, model alias
  `gpt-6-astra`, effort `high`; immutable provider snapshot is unavailable.
- Each initial run has an enforced 1,200-second wall cap. No aggregate token cap is
  claimed. Parent JSONL usage is retained; whole-workflow totals remain unknown where
  delegated-agent accounting is unavailable. Review/correction runs are separately
  recorded, at most two correction/recheck cycles per original artifact.
- Global skills and the existing global hook parse warning remain present. Filesystem
  skill inventory includes names/descriptions/content hashes but is not proof of the
  exact injected roster. Actual reads and competing-director contamination are audited.
- Ordinary browser uses bundled Playwright and cached Chromium. Approval is through
  normal automatic review. Each worker owns isolated ports, servers and browser
  sessions. Measurements concern lifecycle correctness, not cross-run performance.
- D6 uses deterministic actual catalog request failures while separately retaining
  package/documentation access. D7 uses an actually unavailable browser executable in
  its supported driver; source checks remain available. Exact controls are archived.
- D2 keeps assessor seed notes out of builder/reviewer context; seed installation and
  review checkpoints are logged. A fresh reviewer receives the brief/contract/URL and
  rendered-review procedure without defect coordinates.

Initial results are retained even if corrections pass. Missing evidence is unverified.
The suite cannot establish design superiority, robust selection accuracy, broad host
compatibility, or readiness to promote while critical requirements remain unresolved.

## Prospective scheduling adjustment for staged review

Before dispatching the D2 staged reviewers, permit one coordinator-owned fresh reviewer
CLI alongside the three workers' single build CLIs (at most four concurrent CLI runs).
This avoids delaying independent fixture work while a separate reviewer reads the page.
Keep D2 checkpoint mutation, review, correction and recheck sequential for each artifact;
coordinate its browser sessions. This changes development scheduling only. Concurrent
elapsed times and usage remain unsuitable for performance/cost comparisons.

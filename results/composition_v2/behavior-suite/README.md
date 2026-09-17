# Frontendskill v2 behavioral suite

**All 16 initial builds completed. The development gate remains unresolved; the candidate is not promoted.**

Candidate: `12f509e61d8aa15de2bfcc54195a7def07bda0a8`, skill v2.0.0-alpha.1.
The runtime skill remained unchanged throughout this suite. Eight development cases each
received a fresh explicit-invocation build and a fresh ordinary-prompt build. These tests
exercise behavior and selection; they do not compare visual quality with another skill.

## Results

| Case | Explicit invocation | Ordinary prompt / natural selection |
| --- | --- | --- |
| [D1: approved booking design](D1-supplied-design/report.md) | Pass: preserved design, stack and booking flow | Functional pass; candidate correctly excluded for settled design |
| [D2: studio settings and review](D2-settings-and-review/report.md) | Fresh staged review found both seeds; one repair/recheck cycle passed | Initial build omitted candidate; positive-selection expectation missed, with fixture/scope ambiguity. Separately invoked staged review found both seeds; one repair/recheck cycle passed |
| [D3: immersive observatory](D3-immersive/report.md) | Pass: authored interactive moon, three acts, accessible alternatives and lifecycle checks | Candidate selected; same behavioral assertions pass |
| [D4: two co-op surfaces](D4-decide-for-me/report.md) | Pass: shared tokens/components, distinct expression, both primary flows | Candidate selected; same assertions pass |
| [D5: unavailable director](D5-director-absent/report.md) | Pass: actual missing-file error, truthful builtin fallback and signup | Candidate omitted in favor of global frontend-design; fallback branch unexercised. Functional assessment recorded in the case report |
| [D6: unavailable catalogs](D6-catalog-offline/report.md) | Functional pass; strict assessor counts three attempts and fails its two-attempt interpretation | Candidate selected; two failed calls, bounded custom fallback and booking pass |
| [D7: unavailable preview](D7-preview-unavailable/report.md) | Pass: actual launch failure, truthful unverified status and source checks | Honest fallback; candidate omitted, positive-selection expectation missed with fixture/scope ambiguity; formal review-mode metadata partial |
| [D8: shared animation scheduler](D8-shared-animation-ownership/report.md) | Pass: owned work stops and active sibling survives | Functional pass; candidate correctly excluded for a focused lifecycle fix |

A successful artifact without candidate exposure is not evidence that the candidate caused
that success. D1 and D8 were intended natural-selection exclusions **before execution**.
D2 and D7 remain recorded misses against their original positive expectations: their actual
fixtures largely settle style and architecture, making the test/description boundary
ambiguous. Neither miss is silently reclassified as a pass.

D2's mobile text overlap and Save-intercepting overlay were installed **after** each initial
build, at a preserved supplemental checkpoint. Two fresh CLI reviewers received only the
brief, accepted contract, live URL/states, public review procedure and browser helper. Both
observed the defects before diagnosis; neither read application source files or seed notes.
Both checkpoints were repaired in one correction/recheck cycle, with pointer Save, validation, pending/success/error/retry, focus and preserved squared controls verified at desktop and 390px. This establishes staged detection and repair, not spontaneous discovery by the original builders.
[Reviewer identities and input hashes](harness/staged-review-identities.json) distinguish
these fresh sessions from reviewer labels found only in builder-generated documents.

D3 and D8 assessments used real native Chromium tab transitions with trusted visibility
events. Instrumentation checked that pending animation work was canceled, avoiding a false
pass caused merely by browser background throttling. D8 also verified restoration with
one instrument already hidden: only its active sibling resumed. D3 input-causality checks
used a stable paused scene before changing controls; mobile explanations were checked in
the actual viewport, including sticky-canvas occlusion. Assessors knew the fixtures/source;
these were separate functional checks, not blinded design ratings.

## Remaining gates and recommended next work

The development gate remains **unresolved; no promotion or efficacy claim**.

1. Resolve natural selection under the actual installed roster. Keep exact-design and
   focused-fix exclusions. Give D2/D7 positive fixtures meaningful open design decisions,
   retain their current cases as additional scoped tests, and retest without overwriting
   these records. D5 leaves layout and art direction open, yet selects global frontend-design without reading the candidate. This is the clearest observed routing miss; test overlapping skill descriptions and actual roster exposure before assuming a cause.
2. Specify the catalog budget's unit before retesting. The original case says first
   unavailable route plus one alternate within three minutes; it does not define whether
   retrying a permission-blocked request consumes another route. D6 explicit made three
   command attempts across two sources, including one approved HTTP503 retry, within a
   35.4-second upper bound. Preserve the strict-assessor failure, but do not call this a
   proven breach of a predeclared two-command runtime rule. Natural made two failed
   transports within a documented 93.6-second upper bound. No catalog content was invented.
3. Freeze a lean, matched environment and enforceable budgets before the A/B/C experiments.
   D3 explicit alone reported 2,141,470 parent input-plus-output tokens in 1,177.35 seconds;
   natural reported 1,783,450 in 960.50 seconds. Descendant usage is unknown. The draft
   600,000-token pilot allowance is not established as sufficient. Do not compare cost or
   elapsed performance across these concurrent development runs.

This suite does not justify adding more director or specialist dependencies yet. The next
useful implementation work is a narrow selection/contract revision followed by targeted
retests; broader composition changes should earn their place in matched experiments.

## Evidence and limits

- [Machine-readable summary](summary.json): per-case assertions, original/final outcomes,
  corrections, execution status and known parent usage. Cached input and reasoning output
  are subsets, not additional tokens. Whole-workflow tokens and billed cost remain null.
- [Pre-execution record](harness/development-run-record.md),
  [original case definitions](harness/cases-before-execution.json) and
  [original protocol](harness/protocol-before-execution.md) preserve the evaluated contract.
- [Integrity audit](harness/integrity-audit.json),
  [fixture content manifests](harness/fixture-content-manifests.json) and
  [archive manifest](archive-manifest.json) accompany original fixtures, prompts, traces,
  builds, observations, screenshots, correction diffs and failed starts. The aggregate
  fixture manifest was computed after execution; original freezes remain separate.
- [Reporting review](harness/interpretation-review.md) found catalog-counting and reviewer
  provenance wording issues; final interpretation qualifies both rather than discarding
  unfavorable evidence.

Host: Codex CLI 0.153.4, `gpt-6-astra` alias at high effort, Playwright 1.62.1 and cached
Chromium on macOS ARM. Initial builds had an enforced 1,200-second wall cap, no token cap.
Global process/design skills and a pre-existing hook parsing warning remained present.
The 165-file skill inventory is not proof of the exact injected roster; no immutable
provider model snapshot is available. Task instructions excluded sibling research/results,
without an OS-enforced read barrier. Trace audits distinguish content reads from mere
path mentions and record ambient skill use. There is no cross-host certification,
physical-device audit, screen-reader audit or statistical activation estimate.

D7 builders genuinely lacked the supported browser executable and truthfully reported
rendered checks unverified. Later successful assessor browser checks do not retroactively
change their verification status. Builder-reported independent reviews without exposed
spawn/context evidence remain independence-unverified; D2's fresh staged reviewer sessions
have concrete identities and inputs.

Two initial incompatible-flag launches failed before agent work and were retained beside
fresh corrected run IDs. An obsolete queue briefly overlapped two builds and attempted a
duplicate output; the helper refused overwrite. A prospective scheduling adjustment
allowed a fourth coordinator-owned staged reviewer alongside three worker builds. D6's
original fixture accidentally lacked an opening option tag; both builders repaired it,
but this was not a planned seed. An automatic approval rejection was resolved through
input/provenance inspection and approval of the same launch, with no bypass.

Evidence retains original machine paths and ports. Browser profiles, dependency directories
and symlinks are excluded from the archive; helpers need local path/port configuration to
replay elsewhere. No historical verdict was re-scored, no held-out A/B/C case was built,
and no global installation, push, merge or promotion occurred.

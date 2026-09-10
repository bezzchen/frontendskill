# v1.2 ask-rule validation — result, 2026-09-10

Pre-registration: `evals/v12_ask_validation.md` (sha256 `9559a209…`), frozen before launch.
9 runs, all plan-only, Fable, fresh context, pristine fixture per run. 939,873 tokens total.

## Headline

**Decision rule 1 fires: ship as-is.** All three pre-registered bars met, 9/9 runs on-target.

| arm | brief | question | result | bar (≥2/3) |
|---|---|---|---|---|
| **A** | S0 ×3 | does it still *propose*? | **3/3 PROPOSED** | MET |
| **B** | E6 ×3 | does it *ask*? | **3/3 ASKED** | MET |
| **C** | E1 ×3 | does it stay quiet? | **3/3 PROPOSED** | MET |

**Criterion G2 is not regressed.** The risk recorded in `CHANGELOG_v1.2.md` — that the ask rule
might trade away a criterion already MET — did not materialise. All three S0 runs classified into
S and proposed a realtime graphical system, which is G2's original bar verbatim.

**No run stalled.** Every asked run delivered a full inspection *and* a recommendation before
asking, so the question arrived with work attached and a default ready. That was the second
pre-registered failure mode and it did not occur either.

## Why this is not luck: every run named the clause it applied

The wording was built around **license and level**, not vagueness, because S0 and E6 are different
kinds of vague and a naive rule would have broken G2. Each run cited the specific distinction:

| brief | quoted from the run | clause |
|---|---|---|
| S0 (A1) | "grants open license and asks for the unforgettable, so this is settled rather than a question" | settled → decide |
| S0 (A2) | "The brief grants open license and asks for unforgettable, so this is settled and I am deciding rather than asking" | settled → decide |
| S0 (A3) | "so this is settled and I'm deciding rather than asking" | settled → decide |
| E6 (B1) | "asks for a feeling and settles nothing — a polish pass and a rebuilt realtime system both answer it at very different cost" | no level → ask |
| E6 (B2) | "'More dynamic and impressive' asks for a feeling; a polish pass and a rebuilt realtime hero both answer it at wildly different cost" | no level → ask |
| E6 (B3) | "names a feeling, not a level" | no level → ask |
| E1 (C1) | "Register decision: Q (Quiet / Operate) — decided, not asked. A settings form is the canonical Q surface" | surface's job → decide |
| E1 (C2) | "Register: Q (Quiet / Operate) — decided, not asked. A settings form's job settles this" | surface's job → decide |
| E1 (C3) | "Register: Q (Quiet / Operate) — decided, not asked. A settings form's job makes this settled" | surface's job → decide |

Three clauses, three brief types, 9/9 correct discrimination, each with the reasoning stated.

## The ask-once and don't-stall clauses held

All three B runs bounded their questions in the section header itself: *"Questions (I'll ask once;
tell me to decide and I'll take W)"*, *"Other questions (asking everything once)"*, *"Questions
before I implement (asking once)"*. All three gave a recommendation with the question, so the
requester can answer "your call" and get a defined outcome.

## The earned lines were not crowded out

v1.2 added 178 words (+24%). The pre-existing non-negotiables still fired:

- **Non-negotiable 4** (weigh spectacle explicitly): all 9 runs weighed and named a register.
  All three A runs chose S and *declined WebGL deliberately* — two citing the Pixi ticker trap,
  which is v1.1 rev2 content still landing under v1.2.
- **Non-negotiable 3** (catalog fit gate): ran in 4 of the 9 runs where it was scored, including
  **B1, which asked *and* ran the full sweep** — so asking does not force the sweep to be skipped.
- **Non-negotiable 2** (verify under the real condition): held under a condition no arm was
  designed to test. B2's dev server was denied twice by the permission classifier; the run refused
  to route around it via Bash and refused to assert what it could not observe: *"I won't report a
  mitigation I haven't watched work."*
- **Freshness:** C2 and C3 read `node_modules` rather than recalling APIs. C3 established that
  `ViewTransition` is *not* exported in this stable React build and designed nothing around it.

## Interaction worth recording: the sweep is sometimes deferred

**2 of 3** asked runs postponed the catalog sweep — *"deferred now because it depends on the
register"* (B3), *"before building any of the effects I'll run the catalog check inline"* (B2).
Logically defensible: the fit gate needs to know which effect is being built. But it means an asked
run can do less sourcing work up front, and B1 shows it is a choice rather than a consequence.
Not pre-registered; recorded as an observation, not scored, and **not** grounds for a wording
change without its own arm.

*(An earlier note in this session called the deferral "consistent" after two instances. B1 refuted
that. 2/3, not a pattern.)*

## Confounds and limits, restated from the pre-registration

- **Arm B's wrapper carried one added sentence** — "The person who wrote this brief is available and
  will answer questions before you begin" — because a subagent has no human present and the rule
  itself says to proceed "when no answer is coming". Without it the arm would have tested the wrong
  branch. **Arm B is therefore not comparable to any other arm in the programme.** Arms A and C used
  the frozen wrapper unchanged, which is what keeps A comparable to the original G2 measurement.
- **n = 3 per arm.** Matches G2's original ≥2/3 bar, so A is like-for-like. 9/9 is the strongest
  outcome this design can produce, and it still cannot resolve a small effect.
- **Unblinded, by the author of the rule.** The endpoint (asked vs proposed) is near-binary and
  quotable, which is why this was acceptable — but the G2 sub-judgment ("realtime graphical system,
  structurally central") is a judgment call made by someone who wanted it to pass. All three A runs
  are quoted above so a reader can disagree.
- Launched in two batches (6 then 3), per `results/deviations/V11VAL_CONCURRENCY_CONFOUND.md`.

## Housekeeping incidents

- **C3 left a dev server running** on port 3031 for an implementation phase that will never happen.
  Killed (PID verified against the C3-E1 run dir before killing). No other eval port was listening.
- **B2 and C3 each appended an entry to the owner's `launch.json`** (`b2e6-dev`, `c3e1-dev`), taking
  it to 10. Standing practice is flag-do-not-edit; both flagged in
  `results/deviations/LAUNCH_JSON_ACCUMULATION.md`, neither removed.
- **The permission classifier was non-deterministic**: B1's write to `launch.json` was **denied**
  while B2's identical write **succeeded**, same arm, same action. Recorded because it affects
  reproducibility of any run that touches host config, not just this arm.

## Board effect

- **Criterion G2:** MET for v1.2 as well as v1/v1.1. The at-risk flag is lifted, and this is the
  first criterion measured against v1.2.
- **v1.2's ask rule:** measured. It no longer ships unmeasured, and `CHANGELOG_v1.2.md`'s "SHIPPED
  AND UNTESTED" status is superseded for this rule.
- Every other criterion still describes **v1 or v1.1** and is unchanged by this arm.

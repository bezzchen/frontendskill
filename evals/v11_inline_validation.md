# v1.1 inline-sweep validation — pre-registered 2026-09-08, BEFORE any run

Tests the single behavioural claim behind the v1.1 rev2 candidate: that instructing the agent to
**run the catalog sweep inline** stops the delegate-then-park stall measured at **10/15** in the
v1 routing arm (`results/CRITERION_A_ROUTING_FINDINGS.md` §5, per-rep 3/5 · 3/5 · 4/5).

Written and frozen before the first run. Nothing below changes once running starts.

## Why a concurrent v1 control arm, not a comparison against history

The historical 10/15 was measured 2026-09-02. The stall is a *harness notification* failure —
a parent with no live children never wakes — so its rate could depend on the harness build, load,
or the orchestrator's own behaviour rather than on the skill text. Comparing v1.1 today against v1
three weeks ago cannot separate "the fix works" from "the environment changed."

So both bodies run **now, paired by prompt, under identical conditions.** This arm can therefore
return the answer that voids v1.1's rationale (see decision rule 2) — that is the point of it.

## Design

- **Conditions:** `v1` (frozen `SKILL.md`) and `v1.1` (`SKILL.v1.1-draft.md` rev2).
- **Prompts:** E1–E5 from `evals/routing_evals.json`, unamended. These are exactly the 5 prompts
  whose 3 reps each produced the historical 15 observations, so the pairing is exact.
  **E6 excluded:** its prompt was amended mid-programme (`results/deviations/E6_PROMPT_DEFECT.md`)
  and is not part of the 15.
- **Cells:** 5 prompts × 2 conditions × 1 rep = **10 runs**, plan-only, run in parallel
  (`evals/withskill_protocol.md`: plan-only reps parallelise safely).
- **Delivery:** verbatim `withskill_protocol.md` wrapper, frontmatter stripped, name kept.
  Fresh pristine fixture copy per run; fresh context per run; model tier Fable.
- **Condition hygiene:** the v1.1 file's authoring HTML comment (which names it a draft and warns
  against running arms on it) is **stripped before delivery**, and both bodies are normalised to
  identical whitespace, so the only delivered difference is the skill prose itself. Verified by
  leak-grep before launch.

## Endpoints (operationalised now, not after seeing results)

**Primary — `stalled`:** the run delegates any part of the catalog/library sweep to a child agent
**and** ends its turn without delivering the proposal, requiring an external relay to resume.

**Secondary:**
- `delegated` — a child was spawned for the sweep at all, whether or not the run then parked.
  (v1.1's text targets delegation directly; stalling is its consequence. History gives a clean
  count only for stalls, which is why stalls are primary.)
- `tokens`, `tool_calls` as self-reported by the run.
- `orphan_reported` — any child reporting to the orchestrator after its parent finished, with cost.
- `sweep_ran` — did a real catalog sweep happen at all? Guards against the degenerate pass where
  v1.1 avoids stalling by skipping the mandated work.

## Decision rules — fixed before running

1. **Fix confirmed** — v1.1 stalls ≤1/5 AND v1 stalls ≥3/5 → cut over to v1.1.
2. **Fix unnecessary** — v1 stalls ≤1/5 → the historical 10/15 was environment-dependent, not
   caused by the skill text. v1.1's headline rationale is **void**; report that plainly and make no
   claim that the fix works. Cutover then rests on other grounds, not this arm.
3. **Fix failed** — v1.1 stalls ≥3/5 → do not cut over; the inline instruction does not bind.
4. **Indeterminate** — anything else → reported as indeterminate; n too small; no cutover claim.

Rule 1 additionally requires `sweep_ran` true in ≥4/5 v1.1 runs. A v1.1 that stops stalling by
not doing the work is a **failure**, scored under rule 3.

## Statistics

One-sided Fisher exact on the 2×2, α = 0.05. **Stated before running:** with n=5 per arm the
minimum attainable p is 0.0040 (0/5 vs 5/5) and 0/5 vs 4/5 gives p = 0.0476. Only a large effect
is detectable; a true moderate improvement will not reach significance here and must not be
reported as absent. This arm is powered to detect the near-elimination of the stall, nothing finer.

## Documented confounds

1. **Arm-aware orchestration.** The orchestrator knows each run's condition and performs the
   relays. Mitigated by fixing the stall definition in advance and recording it mechanically;
   **not eliminated.** The endpoint is comparatively objective (did the run park?), which is why
   this arm is acceptable unblinded where scoring was not.
2. **n = 1 per cell.** Per-prompt stall probability is not estimable; only the pooled rate.
3. **Single-orchestrator, single-session.** All 10 runs share one harness instance and time window.
   Shared transient conditions would affect both arms — which is the pairing's purpose — but a
   condition that interacts with arm order is not ruled out.
4. Standing `withskill_protocol.md` confounds apply unchanged (Fact-Forcing Gate inside subagents;
   the environment's real skill listings surround the injected block).

## Criterion C — resolved by inspection, no runs required

Recorded here because it was the second planned validation and is now closed without measurement:

`evals/trigger_probe_protocol.md` shows the probe agent **names + descriptions only — "the body is
not shown, matching how activation works at runtime."** Verified 2026-09-08:

- the description embedded in the frozen protocol is **byte-identical** (967 bytes) to live
  `SKILL.md`'s description;
- `SKILL.v1.1-draft.md`'s `name` and `description` are **byte-identical** to `SKILL.md`'s.

The activation surface is therefore unchanged by v1.1, and the 70/70 result transfers by
construction. **Criterion C carries over to v1.1 with its existing scope limitation intact** — it
remains description-classification against a fixed six-skill roster, not real-world activation.
Re-running 70 probes against an identical trigger surface would measure nothing new.

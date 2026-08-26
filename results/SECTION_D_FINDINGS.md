# Section D findings — skill v1 authored, trigger tests passed (2026-08-24)

## What ran

- **`skill/creative-frontend-architect/SKILL.md` v1 authored.** Contents held to what the
  measurements earned: the activation description, the four evidence-backed non-negotiables
  (I2 0/3 offscreen pausing; I5 rep3 proxy-verification; D0 0/3 vs D1 3/3 catalog awareness;
  S0 0/3 spectacle recognition), the Q/W/S register frame, the ownership rules from
  `ARCHITECTURE_V2.md` (one director, one owner per concern, catalogs vs substrates), and the
  freshness policy. ~700 words; no vendor skill bodies, no component source, no routing rules
  (cut per the 24-run routing baseline).
- **Criterion C trigger tests**: all 14 queries from `evals/trigger_queries.json`, 5 fresh-context
  reps each, per the pre-registered `evals/trigger_probe_protocol.md`. Model: Fable.
  Raw table: `results/SECTION_D_TRIGGER_RESULTS.json`.

## Result: 70/70 correct — criterion C PASS

| Kind | Queries | Bar | Observed |
|---|---|---|---|
| core_positive | Q01–Q05 | each ≥ 4/5 | **all 5/5** |
| boundary_positive | Q06, Q12 | diagnostic | both 5/5 |
| near_miss_negative | Q07–Q11 | ≥ 80% of queries pass | **5/5 queries, every rep correct** |
| easy_negative | Q13, Q14 | diagnostic | both 5/5 |

No rep anywhere put `creative-frontend-architect` on the wrong side of the boundary.

## Secondary observations

1. **`frontend-design` co-activation is systematic and coherent.** It co-fired with the
   architect on 100% of both boundary_positives (Q06 settings polish, Q12 landing from
   scratch), on 2/5 reps of the aesthetic-flavored core positives (Q01, Q02, Q05), and never
   on the tech-decision positives (Q03, Q04) or any negative. It never fired alone on a
   positive. This matches the v2 architecture's director+architect split and suggests the two
   descriptions partition the space rather than compete for it.
2. **Q07 rep4 invoked `tdd-workflow`** for the GSAP bug fix (its description covers bug
   fixes) — correct for our boundary (architect absent), and a reasonable read of the roster.
3. **Saturation caveat, stated per house rule:** a 70/70 result is consistent both with a
   well-drawn boundary and with a probe that is easy at the Fable tier. The near-misses were
   designed adversarially and the description carries explicit negative categories, but a
   cheaper-tier arm (Sonnet/Haiku) would stress the boundary if the owner wants it. Criterion
   C itself is satisfied as pre-registered.
4. **Overhead accounting for criterion D:** the skill body is ~700 words (≈ 950 tokens when
   loaded on activation; the description alone, which every listing pays, is ≈ 160 tokens).
   Whether that stays under the ≤ 20% routing-overhead ceiling is measured in Section E, not
   assumed here.

## Confounds carried on the record

Probes ran inside the owner's environment (its hooks and skill listings exist around the
subagents; the pinned template scopes the roster and the environment's skill-eagerness bias
inflates positives and works against negatives — the positive-negative contrast is the
load-bearing signal). See `evals/trigger_probe_protocol.md`.

## Consequences

- Sections still held: **C** (S1-rep3 + consolidated S1 findings + blind recording set) and
  **E** (with-skill comparison against every baseline, judged by `rubrics/success_bar.md`).
- The owner's S1-rep2 ruling (2026-08-24) is recorded in `S1-fable-rep2.record.json`:
  counts toward the baseline, comparability caveat carried; snapshot eligible for M2b
  retro-measurement.
- Section E is now fully unblocked: the skill exists, activation is verified, and the M2b
  instrument (v2.6) removes the spectacle measurement blind spot.

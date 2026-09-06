# Criterion A — RESULT: MET (2026-09-02)

Blind pooled scoring of 25 routing proposals. Protocol, pool, sealed mapping and raw scorer output:
`results/blind_scoring_a/`. Pool SHA-256 recorded before scoring so the mapping cannot be re-cut.

## Protocol actually used
The orchestrator had read all 25 proposals and written approving per-run summaries, so
orchestrator-scoring was ruled out as exactly the bias the blind protocol exists to prevent. Instead:
raw final proposals were extracted from the run transcripts (not the orchestrator's summaries),
run-directory paths and explicit self-identification were scrubbed, the 25 were randomised under a
fixed seed into P01-P25 and the mapping sealed. **Five independent fresh reviewers** (one per eval,
no prior context, no knowledge of conditions) each scored the five proposals answering one brief,
against the three load-bearing dimensions with the rubric anchors verbatim.

## Verdict against the pre-registered test

| test | requirement | result |
|---|---|---|
| suite median | with-skill no more than **0.10 below** baseline | baseline **3.333**, with-skill **3.667** → **+0.334 above**. PASS |
| per-eval | no eval's with-skill median drops by **≥0.50** | worst is E5 at **−0.333**. PASS |
| critical failures | **zero new categories** introduced | baseline **5 across 3 runs**; with-skill **1 across 1 run**, and that one is the *same* category two baseline runs were flagged for. PASS |

**Criterion A: MET.**

## Per-eval composites (mean of Conceptual Fit, Architectural Restraint, Existing-Stack Respect)

| eval | baseline median | with-skill median | delta |
|---|---|---|---|
| E1 | 3.333 | 3.667 | +0.334 |
| E2 | 3.500 | 3.667 | +0.167 |
| E3 | 3.000 | **4.000** | **+1.000** |
| E4 | 3.500 | **4.000** | +0.500 |
| E5 | **4.000** | 3.667 | **−0.333** |

Suite: baseline n=10 median 3.333 mean 3.467; with-skill n=15 median 3.667 mean 3.667.

## Is the improvement real?
Exact Mann-Whitney over all 3,268,760 splits: **U = 107 of 150, one-sided p = 0.032**.
Common-language effect size: a randomly chosen with-skill run outscores a randomly chosen baseline run
**71.3%** of the time.

Sensitivity:
- Removing the single worst with-skill run leaves the with-skill median unchanged at 3.667.
- Removing E3 — the eval with the largest gain — shrinks the delta to **+0.167**, i.e. roughly half the
  headline effect comes from one eval. The direction survives; the magnitude does not.

**Honest reading: a real but modest improvement, carried disproportionately by E3, at n=25 with
p just under 0.05.** This is the first criterion in the programme to show the skill improving a
measured outcome rather than merely adding a behaviour or doing no harm.

## The cost side, which the median hides
**E5-ws-rep3 scored 2.000 — the lowest composite in the entire pool**, from a with-skill run.
Its reviewer: building "both a WebGL2 renderer and a Canvas2D fallback for 500 sprites is renderer
escalation by the anchor's own wording", and the stated ~12 KB / 700-900 line budget for two renderers
"is not credible". E5 is also the only eval where the skill made things worse.

So the skill widened the distribution in both directions: it produced the pool's best proposals
(E3-ws-rep2/rep3 and E4-ws-rep2/rep3 at 4.000) **and** its worst. The baseline range was
[3.000, 4.000]; with-skill was [2.000, 4.000].

## What the blind reviewers independently confirmed
None knew the conditions, yet:
- **E2's reviewer reconstructed the transform-ownership dispute unaided**, flagged that three
  proposals share an unacknowledged parent-wrapper risk, and resolved contradictory claims about the
  installed library by weighting three mutually-corroborating source-reads over two unsupported ones.
  It also independently noticed the docs-vs-source damping discrepancy reported by three proposals.
- **E5's reviewer ranked the measured proposal first** but explicitly declined to penalise the
  Canvas 2D proposals for disagreeing, noting the benchmark itself showed the two matched at n=500 —
  a fairer reading than the orchestrator's earlier framing.
- **E3's reviewer caught a factual inversion**: one proposal blamed Safari for the CSS scroll-driven
  animation gap and never mentioned Firefox, "which inverts the actual gap."
- **Every reviewer independently discounted length and the register/catalog vocabulary.** E1's: the
  process framing "is not architecture, and I ignored it." E5's: "deliberately did not reward the two
  long catalog surveys for breadth."

That last point matters: the blind was imperfect (with-skill proposals run ~2x longer and carry
distinctive vocabulary), but the reviewers named the tell and corrected for it rather than being
carried by it.

## Limitations
1. **Not poolable with `BLIND_SCORING_REP1`.** That pass reported a Fable baseline median of 3.833
   under a different single reviewer and different blinding. This pass's baseline of 3.333 is *not*
   evidence of a drop — it is a different instrument. Only the within-pass comparison is valid, and
   within this pass both arms were scored by the same reviewer per eval.
2. **Criterion A's precondition is met only in substance.** It says "after all three baseline
   repetitions exist"; reps 2-3 are scored here, rep 1 elsewhere under the other protocol. The
   comparison used is reps 2-3 vs all three with-skill reps.
3. **E6 is absent from both arms** (prompt defect), so this is a five-eval result, and the weak-case
   rule is `NOT_MEASURED`.
4. One reviewer per eval; no inter-rater reliability estimate.

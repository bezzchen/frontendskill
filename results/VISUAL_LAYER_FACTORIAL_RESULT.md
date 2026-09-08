# Visual-layer factorial — RESULT (2026-09-07)

Pre-registered in `evals/visual_layer_factorial.md` **before the missing cell was run**. Eleven builds,
one brief, one fixture, one model arm. Pooled blind ranking by **three independent fresh reviewers**,
conditions withheld, sealed mapping unsealed only after all three reported.

## Cell means — composite of 4 dimensions (0–4), averaged over 3 reviewers

| cell | n | mean | builds |
|---|---|---|---|
| **pack only** | 2 | **3.458** | 3.42, 3.50 |
| **neither** | 3 | **3.250** | 2.83, 3.17, 3.75 |
| **both** | 3 | **2.750** | 1.83, 3.08, 3.33 |
| **skill only** | 3 | **2.611** | 1.92, 2.83, 3.08 |

## Main effects
- **Skill: −0.653** (with 2.681, n=6 · without 3.333, n=5)
- **Pack: +0.103** (with 3.033, n=5 · without 2.931, n=6)
- **Interaction: −0.069** — essentially none

## Hypotheses as pre-registered
- **H1 (pack helps):** *weakly supported.* +0.103 is far smaller than the calibration ablation's
  spatial-3D result implied. The pack's two builds do rank 1st and 4th–5th, and the pack cell has the
  highest mean — but with n=2 and a 0.1 margin this is not a demonstrated effect.
- **H2 (skill helps):** **not supported, as predicted.** The skill main effect is *negative* and it is
  the largest effect in the table. This is consistent with G1's independent failure.
- **H3 (interaction):** **not supported.** −0.069 is nil.

**I floated a specific interaction hypothesis before scoring** — that the skill was damping the pack's
ambition, based on all three skill+pack builds returning to the timeline concept while pack-only
reached spatial 3D. **The scores do not support it.** The concept difference is real, but it did not
translate into a visual-quality interaction. Recording this because I raised it.

## The confound that could reverse the headline, flagged by a reviewer unprompted

Reviewer C, with no knowledge of conditions, wrote:

> *"Excluding dimension 2 penalises the input-thesis builds specifically: V03, V06, V09 and V10 all
> print pointer instructions ('flick the field', 'pluck the field', 'move the pointer to shape it')
> whose payoff is invisible in stills, so I judged only the static residue."*

**All four of those builds are skill-loaded cells** — V03, V06, V09 are *skill only*; V10 is *both*.
**None is `neither` or `pack`.**

Dimension 2 is *interaction causality* — the dimension most directly about "the visitor's input
materially changes what they see." It was excluded because the motion recordings could not be made
reviewer-perceivable. If skill-loaded builds systematically invest in pointer-driven interaction
whose payoff only exists in motion, then **the −0.653 skill effect is measured on precisely the axis
where those builds put least of their effort, and against them on the axis they invested in.**

This does not overturn the result. It does mean **the skill main effect is not safe to report as a
quality finding without a live interaction pass.** That pass is now the single highest-value
follow-up in the programme, and unlike a G1 re-run it is not fishing: the confound was identified by
a blind reviewer, not after seeing the arm labels.

## FOLLOW-UP: the confound was measured, not left open (2026-09-08)

M7 (`results/M7_INTERACTION_RESULT.md`) measured dimension 2 directly on 10 of these 11 builds —
driving pointer, drag, keyboard and a range control with scroll pinned, against an idle null.

**On its pre-registered index the confound is NOT supported:** skill-loaded cells measure *lower*
interaction causality (skill main effect **−0.0893**), pointing the same way as the visual scores
rather than reversing them. Pack effect **+0.0054**, again nil.

**But the index is not decisive.** Its headline is carried by the two probes with structural sampling
problems that disadvantage skill-loaded builds — `control` moves only the *first* of the 3–4 range
controls those builds carry (non-skill builds average 0.5), and `key` is dominated by Space-triggers-play.
The one cleanly-sampled probe, `pointer`, **favours skill** (+0.0084; non-skill builds show essentially
zero pointer response).

**Net: the −0.653 skill effect below is neither explained away nor confirmed.** What is newly
established is that skill-loaded builds construct **4–6× more interactive affordance** and that no
probe here exercises more than one of it per build.

## What is robust regardless
- **All three reviewers ranked the same build last: V10 (S1BOTH-rep3)**, with the heaviest defect load
  in the pool — sticky header over body copy on both breakpoints, a floating panel over the export
  headline, transport bar over paragraphs.
- **V03 (S1ws-rep3)** was 9th, 10th, 10th — the same build G1 ranked last, with the same empty
  code-export panels and wordmark/slider collision. Two independent reviewer panels, same verdict.
- **Both very low outliers are skill-loaded** (V10 = both, 1.833; V03 = skill, 1.917). The variance
  observation from G1 and criterion A's E5 cell reproduces a third time.
- **The single most common defect across all eleven builds is fixed chrome colliding with flowing
  text** — sticky headers and transport bars over body copy. It appears in every cell. This is a
  model-level failure mode, not an intervention effect, and no M-measurement detects it.

## Limitations
- n=2 in the pack cell; 3 elsewhere. No significance claimed and none computed — the design cannot
  support it at this size.
- **The brief is not fresh.** S1 generated the skill's spectacle rule. Results do not generalise.
- Dimension 2 excluded (see the confound above).
- Mixed-instrument battery column (`results/deviations/FACTORIAL_REMEASURE_DEVIATION.md`); the visual
  ranking is instrument-independent and carries this conclusion.
- Reviewers noted the pinned-stage capture asymmetry cuts against the more aggressively pinned builds,
  whose middle acts were unassessable.
- One model arm.

## Bottom line
On the evidence available, **the calibration pack is not the lever the earlier ablation suggested**
(+0.10, n=2), and **the architect skill is associated with lower visual scores** (−0.65) — but that
second number sits on an axis chosen to exclude the thing skill-loaded builds most invest in. The
honest statement is: *neither intervention demonstrably improves finished visual output, and the
skill's apparent penalty needs a live interaction pass before it can be called real.*

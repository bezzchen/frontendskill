# M8 — control-all probe: RESULT (2026-09-08)

Pre-registered in `rubrics/execution_measurement.md` before any build was run, with the prediction
recorded: *"If M7's `control` result was a sampling artefact, `controlAllUnion` should rise
substantially for skill-loaded builds and barely move for non-skill builds. If the deficit survives
M8, the sampling explanation is dead."*

Validated first on a purpose-built multi-control page whose *first* slider has a deliberately tiny
effect: **M7 measured 0.0012, M8 measured 0.0208** — a 17× gap from sampling alone. A page with no
controls correctly returns `NOT_MEASURED`, never zero.

## Finding 1 — M7's under-sampling was real, large, and affected every cell

Same probe family, per build:

| build | M7 `control` | M8 union |
|---|---|---|
| S1ws-rep2 | +0.0030 | **+0.7217** |
| S1-fable-rep2 | −0.0100 | **+0.3817** |
| S1ws-rep1 | −0.0052 | +0.1376 |
| S1BOTH-rep2 | −0.0445 | +0.1005 |
| S1BOTH-rep3 | +0.0507 | +0.0807 |
| S1ws-rep3 | −0.0013 | +0.0673 |

**Every build responds to its controls far more than M7 detected**, several by two orders of
magnitude. M7's `control` probe was close to worthless as an absolute measure. That diagnosis was
correct and is now quantified.

## Finding 2 — but correcting it did not reverse the skill deficit

| cell | n | mean `controlAllUnion` |
|---|---|---|
| neither | **1** | 0.3817 |
| skill | 3 | 0.3089 |
| pack | 2 | 0.2457 |
| both | 3 | 0.1177 |

**Skill main effect: −0.0778** (M7 was −0.0893). Nearly unchanged.

**So the sampling explanation is dead.** The confound a blind reviewer raised — that excluding
dimension 2 penalised skill-loaded builds — has now been tested with the sampling flaw removed, and
the deficit persists in the same direction and roughly the same magnitude.

## Finding 3 — the effect itself is not reliably estimated, and I will not claim it is

Three problems, any one of which would be disqualifying on its own:

1. **The `neither` cell is n=1.** `S1-fable-rep3` has **zero** controls of either kind, so it is
   `NOT_MEASURED` per the pre-registration. The entire "without skill" arm rests on three builds and
   its `neither` half on one.
2. **The exclusion is biased.** `NOT_MEASURED` systematically removes *low-interaction* builds — and
   the removed build is a non-skill one. That pushes the "without" mean **upward**, inflating the
   apparent skill deficit. Sensitivity: treating a build with no controls as **0** rather than
   excluding it (arguably the correct reading — no instruments means no instrument response) collapses
   the effect from **−0.0778 to −0.0050**, i.e. to nothing.
3. **The top skill value is near measurement saturation.** `S1ws-rep2` reports union **0.9995** —
   99.95% of surface pixels changed — on an idle baseline of 0.278. At that level the metric has no
   headroom and cannot be trusted quantitatively. Dropping it moves the effect the *other* way
   (−0.1794 against the pre-registered baseline, −0.1067 against the zero-imputed one).

The estimate ranges from **−0.005 to −0.18** depending on two defensible analytic choices. **That is
not a measured effect; it is a sign with an uncertain magnitude.**

## Finding 4 — the robust result, which is about affordance, not response

Controls actually driven, by cell: **skill 6.0** (11, 4, 3) · both 3.0 · neither 2.0 · pack 2.0.

`S1ws-rep1` exposes **eleven** drivable instruments — three range inputs and eight `role="slider"`
keyframe handles. M7 never touched the latter at all, because its selector only matched
`input[type=range]`.

**The skill reliably produces more interactive surface.** That replicates across M7 (range counts
3.3/2.0 vs 0.5) and M8 (controls driven 6.0/3.0 vs 2.0). It is the one interaction finding in this
programme that is not sensitive to analytic choices.

## What this closes, and what it does not

**Closed:** the sampling explanation for the visual factorial's −0.653 skill effect. It was a
reasonable hypothesis, raised blind by a reviewer, and it is now tested and rejected — correcting the
sampling flaw left the interaction deficit intact.

**Not closed, and not closable at this n:** whether skill-loaded builds genuinely respond less to
input. The estimate spans −0.005 to −0.18 across two defensible analyses, on cells of n=1 to n=3,
with one value at metric saturation.

**No further probe should be built for this.** The limit is now the sample, not the instrument —
three more probes would produce three more sign-consistent, magnitude-unstable numbers. Settling it
needs more builds per cell and a fresh brief, which is a new programme, not a follow-up.

## Limitations
- `neither` n=1, `pack` n=2 — no significance claimed or computed.
- `S1-fable-rep1` absent throughout (no source snapshot).
- `S1-fable-rep2` required adding `@tailwindcss/postcss` to build at all (restoration intervention).
- One scroll offset per build, as in M7.
- Union is measured on the first canvas only; builds layering DOM over canvas may under-register.
- M8 measures whether instruments change the render, not whether the change is meaningful. Dimension
  2's upper anchors still require judgement.

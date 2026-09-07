# Criterion G1 (S1 spectacle) — RESULT: FAILED (2026-09-02)

Pooled blind ranking of all six S1 builds (baseline reps 1-3, with-skill reps 1-3) by **three
independent fresh reviewers**, conditions withheld, working from 18 stills (desktop viewport,
full page, mobile) per the sealed pool in `results/blind_ranking_g1/`. Pool SHA-256 recorded before
review; mapping sealed and unsealed only after all three reported.

## Verdict against the pre-registered bar

G1 is **conjunctive** — every clause must hold:

| clause | result |
|---|---|
| with-skill wins the pooled blind ranking (median rank above baseline) | **FAIL** — with-skill median rank **4.67** vs baseline **3.00** (lower is better) |
| improves the spectacle-rubric median | **FAIL** — with-skill median composite **2.500** vs baseline **3.000**, delta **−0.500** |
| zero regressions on the M1-M6 battery | **FAIL** — S1ws-rep1 M3 reduced-motion FAIL (ratio 1.003) where baseline rep3 passed at 0.00 |
| no new critical flags | pass — zero criticals in either arm |
| no drop on Original-integration | **FAIL** — baseline 2.889 vs with-skill 2.667 (−0.222) |

**Criterion G1: FAILED.** Four of five clauses fail. This is the second criterion in the programme
to fail outright, after F.

## The shape of the failure is the interesting part

| rank | build | arm | composite |
|---|---|---|---|
| 1 | S1ws-rep2 | **with-skill** | **4.000** (unanimous first, 4/4 on every dimension from all three reviewers) |
| 2 | S1-fable-rep1 | baseline | 3.333 |
| 3 | S1-fable-rep2 | baseline | 3.000 |
| 4 | S1-fable-rep3 | baseline | 2.667 |
| 5 | S1ws-rep1 | with-skill | 2.500 |
| 6 | S1ws-rep3 | **with-skill** | **1.750** (unanimous last) |

**The with-skill arm produced both the best build and the two worst.** All three baselines cluster in
the middle (2.667-3.333); the with-skill arm spans 1.750-4.000. Two of three reviewers produced the
identical ordering WS > BL > BL > BL > WS > WS.

This is the same distribution-widening seen in criterion A's E5 cell, but here it is decisive: a
median is the wrong summary of a bimodal arm, and the criterion's median test converts one
outstanding result plus two poor ones into a failure. **The honest statement is not "the skill makes
spectacle worse" — it is "the skill increased variance, and the pre-registered test penalises that."**

Per-dimension, the arm is behind on three of four and level on the fourth:
realtime-centrality −0.333 · authored-continuity 0.000 · graphics-craft −0.444 · original-integration −0.222.

## Inter-rater agreement was high — unlike criterion F
Reviewers A and B produced **identical** six-way rankings; C differed only by swapping two adjacent
builds (B2/B6). B5 was first for all three; B4 last for all three. Criterion F failed with its
reviewer calling all six candidates equivalent at p=0.70; this ranking genuinely discriminated.

Statistically the arm comparison remains meaningless at this size: exact one-sided p = 0.80, and with
n=3 vs 3 the smallest achievable p is 0.05. **The verdict rests on the pre-registered clauses, not on
significance**, and no significance is claimed.

## What the reviewers caught that the M-battery cannot
Every build passed M5 (accessible parallel) and most passed everything. The reviewers found **~30
visual defects**, several severe, none of which any M-measurement can see:

- **S1ws-rep3** (last place): the sticky wordmark **overlaps the "Damping" slider label** and the
  "Stiffness" row above is clipped off the viewport — independently confirmed at native resolution by
  two reviewers, and matching the orchestrator's own earlier observation. Worse: **the Act IV code
  panels render completely empty** — `meridian.css` and `meridian.js` show chrome, a "Copy code"
  button, and no code, in the act whose copy promises output "exported the way it ships". Plus a
  mobile state mismatch (heading "Act IV 00:00:28:23" while the transport reads "Act III 00:00:24:00").
- **S1ws-rep1**: on mobile the fixed header **prints directly over body copy with no backdrop** —
  three layers of type stacked and illegible — and the "Export what you made." heading is sliced by
  the bottom transport.
- **S1-fable-rep3** (baseline): mobile eyebrow collision; and a **hard rectangular seam** where the
  hero scrim cuts the gold arc, visible at native resolution.
- **S1ws-rep2** (first place) is not defect-free: on mobile the opaque card occludes the 3D world
  that defines it, and the Dawn/Morning/Noon/Dusk/Night act labels are missing from the transport.

That last point bears on the "no mobile identity loss" clause: the winning build loses its signature
system on mobile. It was not scored as a clause failure because the clause is about the arm, not a
build, but it is recorded.

## Method limitations, stated plainly
1. **Dimension 2 (interaction causality) was EXCLUDED, not estimated.** It is inherently temporal and
   the motion recordings could not be rendered into a reviewer-perceivable form (no ffmpeg, no PIL;
   a Playwright frame-extraction attempt hung on video seek). The recordings exist and are archived,
   so the rubric's no-recording cap does not apply — but the single dimension most directly about
   "the visitor's input materially changes what they see" went unscored. **A live pass could move
   this result.**
2. **The reviewers' own caveat, unprompted and important:** three builds (S1-fable-rep1,
   S1ws-rep2, S1-fable-rep3) render later acts into a pinned stage, so 66-85% of their full-page
   captures are flat colour. All three reviewers independently diagnosed this as a capture artifact
   rather than dead layout — one verified the bands compress to ~4KB of uniform colour — and declined
   to penalise it. But it means only ONE composed act was visible for each of those three, which
   **suppressed their continuity scores**, while the inline-layout builds were fully visible. Both
   reviewers B and C flagged this asymmetry as potentially advantaging the inline group.
3. Reviewers were told not to reward length or genre; two noted they applied that.
4. Three reviewers, one pass, no live interaction. n=3 per arm.

## Standing
Board: **A, C, G2, G4, G5 MET · F FAILED · G1 FAILED · A′ NOT_MEASURED.**

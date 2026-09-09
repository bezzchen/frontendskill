# creative-frontend-architect — an evidence-first Agent Skill and the harness that judged it

> ## → Read [`VERDICT.md`](VERDICT.md) first
> The programme is complete. **Five criteria met, two failed, one not measured, four owner-open.**
> Short version: the skill is a *process* intervention — it reliably changes how work is approached
> and modestly improves architectural decisions, but it does not improve what gets built, and it
> increases variance in both directions. Recommendation: ship v1.1, not v1, and position it as a
> decision aid rather than a quality-of-output intervention.

This repository contains a Claude/Agent **Skill** for creative frontend work (animation, WebGL,
interactive pages) **and the evaluation harness that decided what belongs in it**.

The project began as a 31-page wish-list spec built on an assumption: that coding agents
over-engineer visual work — reaching for Three.js on a settings page, stacking animation
libraries, defaulting to purple-gradient clichés. That spec was never built. Instead the harness
came first, to measure whether those failures actually happen.

**Mostly they don't.** Across 24 routing runs on three model tiers, agents added exactly **one**
unjustified dependency in total. So the routing and restraint rules were *cut*, and the skill that
exists is four lines long.

**The Iron Law:** nothing enters the skill until a measurement shows the agent fails without it.

## What the measurements found

| Probe | Baseline result | Meaning |
|---|---|---|
| I2 — Anime.js implementation ×3 | **0/3** paused animation offscreen | Not done unprompted |
| I5 — PixiJS ×3 | **1/3** passed, though the prompt *demanded* pausing | Capable but unreliable |
| I5 rep3 | claimed "verified" — had tested `document.hidden`, not scroll-out | Claims ≠ verification |
| D0 — no catalog hint ×3 | **0/3** searched component catalogs | Awareness is the gap |
| D1 — catalogs in view ×3 | **3/3** evidence-cited adopt/adapt verdicts | Judgment at ceiling once aware |
| Q1 / W1 — quiet vs expressive ×3 each | **3/3** each, no over-design, no timidity | Register instincts fine |
| S0 — "unforgettable", no tech named ×3 | **0/3** proposed a realtime graphical system | Spectacle never self-selected |
| S1 — spectacle explicitly briefed ×3 | **3/3** shipped 60fps WebGL2 systems, zero dependencies | Capable when asked |

Four gaps survived measurement, and those four are the skill:
`skill/creative-frontend-architect/SKILL.md`.

## Does the skill work?

The programme is complete. Against the pre-registered bar in `rubrics/success_bar.md`:

**What it reliably does — process:**

- **Activation** — 70/70 across 14 queries × 5 fresh contexts. **Met** (scope-limited: description
  classification against a fixed six-skill roster, not real-world selection).
- **Spectacle recognition (S0)** — 3/3 vs 0/3 baseline. **Met.**
- **Catalog discovery (D0)** — 3/3 vs 0/3 baseline. **Met.**
- **Offscreen pausing** — I2 0/3 → 3/3 (operative measure); I5 1/3 → 2/3 binding. Target met, and
  **one with-skill rep failed honestly** — its own frame counter read zero while a second Pixi
  ticker ran at full rate, caught only by instrumenting global `requestAnimationFrame`.
- **Routing decisions** — +0.334 on the pooled blind score, p = 0.032. **Met, qualified.**

**What it does not do — output:**

- **Criterion F** (execution quality) — **FAILED.**
- **Criterion G1** (pooled blind spectacle ranking) — **FAILED.**
- A pre-registered 2×2 visual factorial (11 builds, 3 blind reviewers) found **skill −0.653**,
  reference pack +0.103, interaction nil.

Three independent looks, one answer: it changes how the work is approached, not how good the
result is — and it **widens variance in both directions**. It produced both the best and the worst
build in the G1 pool.

Current status per criterion: `results/SUCCESS_BAR_STATUS.md`. Full reasoning: `VERDICT.md`.

## Installing the skill

The skill is self-contained: `SKILL.md` references no other file in this repository, so it works
installed on its own. The registries and reference packs here are harness material, not
dependencies.

```bash
mkdir -p ~/.claude/skills/creative-frontend-architect
cp skill/creative-frontend-architect/SKILL.md ~/.claude/skills/creative-frontend-architect/
```

Then invoke it by name (`/creative-frontend-architect`), or let it activate on its own — it is
written to trigger on creative-direction and rendering-architecture decisions and to stay out of
execution-only work.

| file | status |
|---|---|
| `SKILL.md` | **active — v1.1 rev2**, cut over 2026-09-09 |
| `SKILL.v1-frozen.md` | v1, preserved verbatim; the body every archived measurement was made against |
| `CHANGELOG_v1.1.md` | what changed, the evidence for each line, and one correction |

**Read `VERDICT.md` before adopting it.** Ship it as a decision aid. It is not an
output-quality intervention, and the evidence that it is not is stronger than the evidence that it
helps.

**It expects a design director.** The skill deliberately does not own visual taste and defers to a
single director skill. It does not yet say what to do when no director is installed — see the open
item in `CHANGELOG_v1.1.md`.

## Layout

```
skill/          the skill itself (four earned lines + activation description)
evals/          pinned eval definitions, prompts, choreography, protocols
rubrics/        success bar, measurement thresholds (M1–M6), scoring anchors
fixtures/       three pinned Next.js 16 repos + integrity manifest
scripts/        measurement, capture, and verification tooling
results/        every run's records, diffs, screenshots, recordings, findings
docs/           the original spec, and dated session notes
```

## Running it

```bash
./scripts/restore_fixture_git.sh   # fixtures ship as dot-git/; this restores + verifies them
```

The fixtures are pinned by SHA **and** content hash; that script must print PASS before any run is
comparable. Measurement needs Playwright and, for WebGL/WebGPU pages, a **GPU-capable browser** —
`chrome-headless-shell` software-rasterizes and will report ~7fps for a page genuinely running at
60. That lesson, and several others, are in `HANDOFF.md` §8.

## Method rules that make the data mean anything

Baseline before build · criteria pre-registered and frozen · fixtures carry no hint they are
fixtures · measured not described (`NOT_MEASURED` is never a pass) · everything pinned ·
prompts de-leaded · **taste stays human** — design coherence, register fit and spectacle scoring
are the owner's blind judgments and are deliberately not automated.

## Honest caveats

Single-owner scoring on most dimensions; concept diversity across runs is low (six of six
spectacle runs converged on the same premise family); and every `SEALED_MAPPING.json` is sealed
only by convention — they are in this repository, so those rankings are no longer strictly blind
to anyone who reads them.

Criterion **A′** is `NOT_MEASURED`, **B** and **E** rest on owner judgments that remain open, and
**G3** was met in substance but not in the form its criterion specified. An external appraisal
found four real false-pass paths in the harness itself (M1/M3/M5/M6); all four were reproduced and
repaired, and **no archived verdict changed** — blast radius is worked out in
`results/INSTRUMENT_REPAIRS_20260907.md`.

Full history in `CHANGELOG.md`; cold-start orientation in `HANDOFF.md`.

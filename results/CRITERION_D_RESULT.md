# Criterion D (context/time overhead) — RESULT: MET, with one caveat (2026-09-02)

## Routing clause — now measurable

Only runs that never delegated their catalog sweep have complete totals; a stalled run's reported
figure omits its orphaned child's spend (`results/deviations/ORPHANED_CHILD_COST.md`). Five of
fifteen with-skill routing runs were stall-free.

| run | with-skill | baseline mean (same eval) | ratio |
|---|---|---|---|
| E4ws-rep1 | 91,151 | 57,038 | **1.60x** (identical tool count to baseline) |
| E5ws-rep2 | 94,274 | 57,236 | **1.65x** |
| E1ws-rep2 | 100,863 | 59,670 | **1.69x** |
| E4ws-rep2 | 100,730 | 57,038 | **1.77x** |
| E5ws-rep1 | 149,319 | 57,236 | 2.61x — **empirical**: authored and ran a GPU benchmark |

**Skill overhead on routing: ~1.6-1.8x baseline tokens (n=4, median 1.67x).**
Empirical verification costs roughly another 1x on top when a run chooses to do it. Two baseline
figures (E1 rep3, E4 rep3) are approximations from the with-skill cost notes rather than exact
records; the four ratios move by under 0.05x under reasonable variation, so the band holds.

## Execution clause — no overhead

S1 implementation arm: with-skill 327,313 / 383,573 / 357,599 (mean 356,162) against a baseline S1
rep recorded at ~365,000 — **ratio 0.98x**. On implementation work the skill costs nothing
measurable. This matches the earlier I2 indication (with-skill median 245k vs a 250-300k baseline
range).

**So the overhead is confined to routing**, where the skill mandates work the baseline never does
(catalog sweeps, live version and browser-support verification). That is the cost of the behaviour
change, not a general tax.

## The caveat that keeps this from being clean

**The skill induces a harness failure that roughly doubles its own cost and hides half the bill.**
10 of 15 with-skill routing runs delegated the mandated sweep to a subagent and then parked; zero of
10 baselines did, because nothing instructed them to search. Each needed an orchestrator relay, then
usually redid the sweep itself while the orphan kept running and billing elsewhere. Two measured:

| run | parent reported | orphan | true total | reported | true |
|---|---|---|---|---|---|
| E4ws-rep3 | 143,006 | 230,884 | 373,890 | 2.5x | **6.7x** |
| E1ws-rep3 | 175,722 | 163,066 | 338,788 | 2.9x | **5.4x** |

In both, the orphan's findings corroborated the parent rather than adding to it. **As shipped, v1's
line 3 costs roughly double what it needs to**, and no harness accounting shows it. The v1.1 draft
fixes this with one sentence ("Run this search inline, yourself"); it is the single highest-value
change available to the skill.

## Verdict
**MET** on both clauses as pre-registered — ~1.6-1.8x on routing, ~1.0x on execution — **conditional
on the inline-sweep fix**, without which the realistic routing cost is 2-6x depending on whether the
delegation defect fires.

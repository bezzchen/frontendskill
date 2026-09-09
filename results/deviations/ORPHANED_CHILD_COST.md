# The stall pattern costs roughly DOUBLE, and the second half is invisible

**Discovered:** 2026-09-02, when an orphaned child's report arrived at the orchestrator after its
parent had already finished.

## What happened
E4ws-rep3 commissioned a catalog fit-gate child, then ended its turn waiting (the 8th such stall).
The orchestrator relayed neutrally; the parent then ran the sweep ITSELF and delivered a complete
proposal, reporting **143,006 tokens / 19 tool calls**.

The orphaned child never stopped. It completed later and reported to the ORCHESTRATOR — the parent
never saw it — having spent **230,884 tokens and 133 tool calls** on the sweep the parent had already
redone.

## True cost of that run
| component | tokens | tool calls |
|---|---|---|
| parent (as reported) | 143,006 | 19 |
| orphaned child | 230,884 | 133 |
| **actual total** | **373,890** | **152** |

Baseline E4 was 56,077 tokens / 5 calls. So the run's headline multiple of **2.5x is wrong; the real
figure is ~6.7x**, and the excess is almost entirely duplicated work caused by the routing stall.

## Second confirmed instance (2026-09-02)

An E1ws catalog fit-gate child reported to the orchestrator after its parent had delivered:
**163,066 tokens, 70 tool calls.** E1ws-rep3 reported 175,722 tokens; true combined cost ~338,788
against a baseline of 62,341 — **~5.4x, not the reported 2.9x.**

Two instances, both the same shape: the parent is relayed, redoes the sweep itself, delivers, and the
orphan finishes later and bills the orchestrator's ledger instead of the parent's.

| run | parent reported | orphan | true total | reported multiple | true multiple |
|---|---|---|---|---|---|
| E4ws-rep3 | 143,006 | 230,884 | 373,890 | 2.5x | **6.7x** |
| E1ws-rep3 | 175,722 | 163,066 | 338,788 | 2.9x | **5.4x** |

Note both orphans produced work that CORROBORATED the parent rather than adding to it. The E1ws
orphan did surface two caveats the parent's own sweep missed — the W3C ARIA-in-HTML recommendation
that authors MUST NOT put `aria-checked` on `input type=checkbox role=switch` (native `checked`
carries state), and Roselli's general argument against `role=switch` on screen-reader-support grounds
— but the parent had already reached the same architectural conclusion (native checkbox, real
`<label>`) independently. The duplication is near-total.

## Why this matters beyond one run
1. **Every stalled with-skill run is under-reported the same way.** 10 of 15 with-skill runs stalled.
   *(Corrected 2026-09-08: this line read "10 of 13" as written on 2026-09-02, which was the count at
   that moment. Two further with-skill runs completed afterwards without stalling, giving the final
   10/15 used in `results/CRITERION_A_ROUTING_FINDINGS.md` §5. The numerator is unchanged; no figure
   derived from this document changes.)*
   Each parent's token figure omits whatever its orphaned child spent. The per-run costs recorded in
   results/proposals_f/*.md are therefore LOWER BOUNDS, not totals, for every stalled run.
2. **Criterion D cannot be computed from parent figures alone.** The clean comparison points remain
   the runs that never delegated: E4ws-rep1 (1.6x at identical tool count), E1ws-rep2 (1.7x),
   E4ws-rep2 (1.8x), E5ws-rep2 (1.65x). Those four are stall-free and their totals are complete.
   **Use only those for the overhead estimate.**
3. **The waste is pure duplication, not extra rigour.** The child's findings corroborated the parent's
   own sweep rather than adding to it — the parent had already reached the same verdicts
   independently. One small discrepancy is visible: the child reported caniuse WebGL2 support at
   96.39% (StatCounter Aug 2026) where the parent said 95.73%; different snapshots of the same
   statistic, and immaterial to either conclusion.

## Consequence for the skill (strengthens the v1.1 candidate)
The queued edit — the catalog sweep must be run INLINE, not commissioned and awaited — is now backed
by a cost argument as well as a reliability one. The delegate-then-park pattern:
- stalls the run until an orchestrator notices and relays,
- causes the sweep to be performed twice,
- and hides the second cost from every accounting the harness produces.

## What was NOT done
The orphan's report was not relayed to E4ws-rep3: that run had already completed and delivered. Waking
it to consume a redundant sweep would have added a third cost for no information.

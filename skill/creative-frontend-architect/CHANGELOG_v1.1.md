# creative-frontend-architect v1.1 — CUT OVER 2026-09-09

**Status:** drafted 2026-09-02, revised to rev2 2026-09-07, validated 2026-09-08, **cut over
2026-09-09 at the owner's instruction.** `SKILL.md` is now the v1.1 rev2 body; v1 is preserved
verbatim at `SKILL.v1-frozen.md`.

The shipped body was verified byte-identical to the text the five v1.1 validation runs actually
received (`results/V11_INLINE_VALIDATION_RESULT.md`). Results still cannot be pooled across
versions: every criterion in `results/SUCCESS_BAR_STATUS.md` was measured against v1 unless its row
says otherwise.

## What changed, and the evidence for each

### Line 1 — name `Ticker.system`, and add "promptly"
v1 said "any library ticker that runs by default (e.g. Pixi's shared ticker)". That is incomplete in a
way that matters: **E5ws-rep3 traced Pixi 8.20.1 in source** and found `TickerPlugin` defaults
`autoStart: true`; `Ticker.shared` *and* `Ticker.system` are lazily created with `autoStart = true`;
and `EventSystem._addEvents()` calls `EventsTicker.addTickerListener()`, which registers on
`Ticker.system` **unconditionally** — so `app.ticker.stop()` leaves a library rAF loop alive.
A reader following v1 literally would stop the shared ticker, believe the job done, and be wrong.
v1.1 names both tickers, states the trap, and generalises: assume any engine you did not write has a
ticker until checked. "Promptly (within a frame or two, not on a timer)" closes the queued
pause-latency gap.

### Line 2 — verify the GLOBAL loop, not your own flag
v1 forbade the `document.hidden` proxy. v1.1 adds the symmetric case (do not dispatch
`visibilitychange`; really background the tab) and, more importantly, requires **wrapping
`requestAnimationFrame` to count frames globally** rather than trusting your own loop's state.
Rationale is the same finding as line 1: the loop you forgot is precisely the one your own flag
cannot see. Several routing-arm proposals independently converged on this technique
(E5ws-rep1's frame counter, E2ws-rep1's `engine.reqId === 0` check, E3ws-rep3's
`getEventListeners(window)` gate), which is corroboration that it is the natural correct method.

### Line 3 — run the sweep INLINE
**The best-evidenced change, and the only one backed by the whole arm.** 10 of 15 with-skill routing
runs delegated the mandated catalog sweep to a subagent and then ended their turn waiting; a parent
with no live children never wakes, so each needed an orchestrator relay. Zero of 10 baseline runs did
this, because nothing instructed them to search.

It is not merely a stall. Two orphaned children were measured after their parents had already
re-done the sweep themselves:

| run | parent reported | orphan | true total | reported | true |
|---|---|---|---|---|---|
| E4ws-rep3 | 143,006 | 230,884 | 373,890 | 2.5x | **6.7x** |
| E1ws-rep3 | 175,722 | 163,066 | 338,788 | 2.9x | **5.4x** |

In both, the orphan's findings corroborated the parent rather than adding to it. So the instruction as
written in v1 roughly **doubles** the cost of the search it mandates, and the second half is invisible
to the harness's own accounting. See `results/deviations/ORPHANED_CHILD_COST.md`.

## Deliberately NOT changed

**"Ask whether a ceiling reference exists."** The calibration ablation showed the reference pack, not
the skill, is what reaches the owner's stated 3D ceiling (2/2 spatial-3D adoption vs 0/3 baseline,
with no architect skill loaded). That is a real finding, but it is a finding about the PACK. Adding a
line to the skill on that basis would be asserting a mechanism no controlled arm has tested — the
skill has never been run with and without such a line. Left out until it has its own arm.

## What the validation found — and the correction it forced

Ten paired runs (E1-E5 x v1/v1.1, plan-only) plus one solo control, 2026-09-08. Full result:
`results/V11_INLINE_VALIDATION_RESULT.md`.

**Line 3's stated rationale did not hold up.** The stall this change was written to fix did not
occur in *either* arm: v1 stalled 0/5, v1.1 stalled 0/5, Fisher p = 1.0. v1 today against v1 on
2026-09-02 (10/15) gives p = 0.016, so something changed — but whether the environment changed or
the orchestrator's own 10-way concurrency suppressed child-spawning is **not established**. A solo
control run also did not delegate, which is evidence against the concurrency explanation at
p = 0.333 — weak, and pre-registered as weak.

**So line 3 is retained on a different basis than it was drafted for.** v1.1 was cheaper on **5 of
5 prompts** (median -13,013 tokens; mean tool calls 20.6 vs 27.8), the direction its bounded-search
sentence was written to produce. That endpoint was pre-registered as secondary with **no direction
specified**, so it is suggestive, not confirmatory (sign test p = 0.031, chosen after seeing data).

**Line 1 also carries an independent correctness argument** that no measurement was needed for:
v1 instructs the reader to stop "any library ticker that runs by default", which on a page with two
surfaces freezes the visible one. rev2 replaced this with pausing the work owned by the inactive
surface, and stopping shared infrastructure only when no still-active consumer depends on it.

## Correction to this document

An earlier version of this section said criterion C "would need re-running… since line-3's added
sentence changes the body the trigger probe sees." **That was wrong.**
`evals/trigger_probe_protocol.md` shows the probe agent **names and descriptions only** — "the body
is not shown, matching how activation works at runtime." Verified 2026-09-08: v1.1's `name` and
`description` are byte-identical to v1's, and the description frozen in the protocol is
byte-identical (967 bytes) to the live one. The activation surface is unchanged, so **70/70
transfers by construction** and criterion C did not need re-running at all.

## Still open after cutover

- **No design-director fallback in the body.** The skill names Impeccable "where available" but does
  not say what to do when no director skill exists. Deliberately *not* added at cutover: it would
  ship untested text, which is the one thing this programme exists to avoid. Empirically the gap is
  milder than it looks — 4 of the 11 validation runs spontaneously nominated `frontend-design` as
  the single director and explicitly refused to load a second one, with no instruction to do so.
  Queued for v1.2 with its own arm.
- **v1.1's output quality has never been scored.** The validation measured process and cost only.
  F and G1 failed against v1; nothing here changes that, and nothing here shows v1.1 does better.

# creative-frontend-architect v1.1 — DRAFT, not cut over

**Status:** drafted 2026-09-02 as `SKILL.v1.1-draft.md`. **`SKILL.md` (v1) is untouched and remains
the frozen version.** Cutting over is the owner's call, because every arm in the programme was run
against v1 and results cannot be pooled across versions.

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

## Consequence if cut over
Every criterion measured against v1 (C 70/70 activation, G2, G4, G5, F, and the routing arm) would
need re-running to be pooled with v1.1 results. Recommended sequencing: close the remaining v1 arms
first (G1's S1 with-skill arm is the main one), then cut over, then re-run activation (criterion C)
since line-3's added sentence changes the body the trigger probe sees.

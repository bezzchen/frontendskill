# D8 — shared animation ownership

**Both completed implementation runs pass the four critical runtime assertions.** Explicit invocation read the candidate entrypoint and architecture reference without restarting design. Natural selection did not read the candidate, which is correct for this animation-bugfix prompt under the frozen description. This is unscored development evidence, not efficacy evidence.

## Frozen input and isolation

`original/` contains one shared requestAnimationFrame scheduler, two independently registered callbacks, per-instrument counters, hide/show controls, unmount/remount controls and range inputs. The initial implementation deliberately kept subscriptions running when hidden/offscreen, leaked subscriptions on unmount, ignored reduced motion and left a pending frame when backgrounded. `fixture-freeze.json` records the final pre-run content hashes; both runs copied those same bytes. `prompt.txt` is the exact case prompt, with the harness adding only explicit skill invocation in that arm.

Each fresh CLI ran the immutable candidate commit `12f509e61d8aa15de2bfcc54195a7def07bda0a8` in its own workspace with project-local skill installation and prepared source. No design director was needed for the settled implementation task. General process/debugging/testing/Playwright guidance was read and is listed per run in `report.json` and `actual-read-commands.json`; no clean ambient-instruction-isolation claim is made. Candidate package bytes remained unchanged in both workspaces.

## Outcomes

| Run | Selection | Runtime | Corrections after initial artifact | CLI elapsed |
| --- | --- | --- | --- | --- |
| natural-selection-run1 | Correct intended exclusion | Pass | 0 | 258.72s |
| explicit-run1 | Candidate and architecture read | Pass | 0 | 792.44s |

For **each** artifact the assessor observed:

- Hide metronome: metronome callback delta 0, visible waveform delta 39–40 over the observed interval.
- Actual mouse-wheel scroll: metronome bottom −39px, waveform intersecting viewport; metronome delta 0, waveform delta 39.
- Genuine background tab: `document.hidden=true`, `visibilityState=hidden`, trusted `visibilitychange`, both callback deltas 0, and global pending-rAF list empty. This verifies application cancellation instead of relying on browser throttling.
- Return to foreground: both resume; exactly two active subscribers, no accumulation.
- Unmount metronome: no metronome subscription/callback activity; waveform continues. Remount restores two subscribers.
- Reduced-motion browser preference: neither instrument schedules continuous work; both keyboard-operated range inputs update their retained settings. Narrow layout has no horizontal overflow and retains the instruments and controls.

Desktop/mobile/reduced-motion screenshots and numeric traces are under each run's `assessment-initial/`. The desktop/mobile images were visually inspected; the original simple interface and visible focus treatment remain usable. The four exact case assertions and supporting checks are individually recorded in `report.json`. Source inspection was used to understand diagnostics; the assessor authored the fixture and is not a blinded reviewer.

## Real visibility method and baseline sensitivity

`assess.cjs` launches cached native headed Chromium with a temporary user profile, then attaches through `chromium.connectOverCDP(..., {noDefaults:true})` to its existing default context. Bringing a separate real browser tab to the foreground produces trusted native hidden/visible events. No `document.hidden` property override, synthetic visibility event or CDP lifecycle freeze is used. This removes Playwright's automatic focus override; it does not simulate hidden state.

The original page fails six lifecycle checks in `original-assessment-run2/observations.json`. Crucially, native backgrounding stops callback delivery but leaves its `tick` pending, so the assessor rejects browser throttling as proof of application cleanup. This provides a control showing the test distinguishes the original failure from both implementations.

Both builders honestly reported that their own default-Playwright native-background attempts were unverified and labeled synthetic checks separately. The assessor's subsequent native method independently resolves that runtime question; the original builder claims/traces are preserved rather than rewritten.

## Deviations and costs

The first natural launch in `natural-selection/` failed before any agent work because the shared runner combined incompatible CLI flags. Root fixed the helper and the fresh `natural-selection-run1` retained a distinct run ID. The first original-fixture assessment timed out waiting for the browser load event; its error is preserved in `original-assessment/`. A retry using DOMContentLoaded completed. The explicit build experienced CLI transport retries; these are retained in stderr and included in elapsed time.

Known parent CLI usage is 501,229 tokens for natural and 1,048,963 for explicit, counting input plus output once. Cached input and reasoning output are subsets, not additions. Whole-workflow/assessor/coordinator token and monetary totals remain unknown. Concurrent development activity and transport delays prevent a comparative performance or cost-benefit inference.

No post-artifact correction was needed. Assessment browsers, ephemeral HTTP servers and temporary browser profiles were closed/removed; a final port8318 check found no listening builder server. No node_modules were created or archived. No repository/runtime files were changed by this worker.

## Targeted combined-state supplement

A final coverage audit identified that the initial native restoration check began with both instruments eligible. `assessment-combined-state/observations.json` now closes the combined-state question for **both** artifacts without repeating the full assessment: hide metronome, really background the native page, return to it, and observe only waveform resuming. In each run, native background produced trusted hidden=true with no pending rAF; restoration left metronome delta0, waveform delta39 and exactly one `waveform` subscriber. This supplement is included in the second critical assertion's supporting checks in `report.json`.

The same targeted visit operated the waveform slider by keyboard at390×844 with reduced motion enabled; amplitude changed36→37 with no horizontal overflow. Supplemental restored-waveform and narrow focused-control screenshots were captured and visually inspected. No implementation changes or correction cycle was needed.

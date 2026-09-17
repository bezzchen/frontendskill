# Instrument activity lifecycle

## Scope and architecture

Applied the explicitly requested `creative-frontend-architect` skill as an execution-only lifecycle repair. The existing `index.html`, `styles.css`, SVG drawings, labels, controls, and numeric ranges supply the settled design. Register: **Q — Quiet / Operate**, a focused music practice page. Kept native HTML/SVG and one shared requestAnimationFrame scheduler; no dependencies, new visual effects, catalog search, art-direction restart, or director fallback were needed.

Contract: an instrument owns at most one subscription while mounted, shown, intersecting the viewport, in a visible document, and motion is allowed. Inactive instruments release only their own subscriptions. The service cancels its frame when the last subscriber leaves. Reduced motion retains static drawings and usable controls. Unmount disconnects the observer, removes the input listener, releases the subscription, and removes the element. Remount preserves the visibility choice and settings. The diagnostic snapshot remains available with its existing fields and an additional `reducedMotion` field.

## Investigation and implementation

The original scheduler unconditionally requested another frame. Mount subscribed regardless of activity, hiding only changed the DOM, and unmount removed the element without calling unsubscribe. No viewport, document visibility, or motion-preference handling existed.

Wrote `tests/lifecycle.cjs` before changing production code. The baseline reproduced four failures: hidden, offscreen, unmounted, and reduced-motion instruments each still received callbacks (11 callbacks during a 180 ms observation). The existing narrow layout passed. Baseline evidence: `output/playwright/baseline-results.json`.

Updated `app.js` to use per-mount activity synchronization and disposal, IntersectionObserver, document visibility and page lifecycle events, and a live reduced-motion media query. Static rendering runs immediately and on slider input. Animation time excludes paused periods. The scheduler guards against duplicate frames and stops when unused.

## Actual checks

- `node --check app.js` and `node --check tests/lifecycle.cjs`: passed.
- `node tests/lifecycle.cjs`: initial post-fix headless run passed all five original groups.
- Final `HEADED=1 node tests/lifecycle.cjs`: six groups passed; one actual-backgrounding check explicitly unverified. No page JavaScript errors.
- Independently hid each instrument, restored it, hid both, and restored one. Verified per-owner callback deltas and exact subscriber membership.
- Really scrolled the metronome out while the waveform stayed visible, then scrolled both away and returned. Inactive counters stopped; visible siblings continued.
- Unmounted/remounted each instrument three times, remounted while hidden, and unmounted both. No duplicate/stale subscriptions; settings survived.
- Used browser reduced-motion media emulation at initial load and during operation. Both drawings remained present; amplitude changed the static wave, tempo readout updated, remount remained static, and animation resumed after preference removal.
- A test-only rAF wrapper verified exactly one outstanding shared frame while active and zero while idle. Per-instrument diagnostics attributed callback activity to its owner.
- A **synthetic** visibility probe overrode document visibility properties and dispatched visibilitychange. It verified cancellation and resumed only the eligible waveform, including duplicate-event handling. This is handler coverage, not evidence of actual background behavior.
- Captured and self-reviewed desktop (1000 × 1100) and mobile (390 × 844) screenshots. Both instruments and their controls remain readable; mobile has no horizontal overflow.

Evidence: `output/playwright/headed-results.json`, `output/playwright/headless-results.json`, `output/playwright/desktop.png`, and `output/playwright/mobile.png`. The test script uses the host-installed Playwright and cached Chromium paths from AGENTS.md, overridable with `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH`. Start the server with `python3 -m http.server 8318 --bind 127.0.0.1` before running it.

## Limitations

Real background suspension is **unverified**. In full Chromium, opening another page and bringing it forward did not make the instrument document hidden. Removing automation's background-throttling flags and actually minimizing/restoring the test window also left `document.hidden === false` and `visibilityState === 'visible'`. The check records this environment limitation instead of treating throttled callbacks or synthetic events as proof. The final results include the observed snapshot. Actual OS reduced-motion settings, other browser engines, back/forward-cache restoration, and heap profiling were not tested.

Local server and browser launches required the normal sandbox escalation and were allowed. No packages or skills were installed. This workspace has no Git repository, so no Git diff or commit was available.

## Skill provenance

Files read (SHA-256; external skill paths are under `/Users/bezzchen/.codex/skills/`):

| File | SHA-256 |
| --- | --- |
| `.agents/skills/creative-frontend-architect/SKILL.md` | `abeb51e1c1a769366ea7ea134b85b0d2acfa00aeaa16d3ac565adc5dd72883e5` |
| `.agents/skills/creative-frontend-architect/references/architecture.md` | `012aabe7dcc34cead0f6caaeb42320666ec08c7e097723798d6bbce5d22504ce` |
| `using-superpowers/SKILL.md` | `55379fe7c1c473a02c61961c822996bff30e1320d6921d9062509bc508482c05` |
| `using-superpowers/references/codex-tools.md` | `9310bb2315eed2c1cebea02cd1c9e8fe121cb788fc6b41e8b8b5ff46f85f37` |
| `systematic-debugging/SKILL.md` | `3b20719eca4f0461cb51a195221320d775dcf03b6859271066a03a5132a6ce7a` |
| `test-driven-development/SKILL.md` | `b5b4717b8b761cce15a6cfe9022e33fd959e0894c0c39d72c9cb49c23486c10e` |
| `playwright/SKILL.md` | `0ffaabcc8e0990627c4725f18bf1c7955534a796c1c199e872909de2013ce6a8` |
| `verification-before-completion/SKILL.md` | `ea52d15aabaf72bc6b558efe2c126f161b53961090ddcd712000273bfe8c7b6c` |

Used the installed Playwright Node API as specified by local project guidance. No outside research or evaluation records were accessed.

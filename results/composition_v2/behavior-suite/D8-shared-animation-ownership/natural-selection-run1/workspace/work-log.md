# Instrument lifecycle fix

## Changes

- Kept both instrument panels, their sliders, toolbar controls, and the existing diagnostic snapshot interface.
- The shared scheduler now requests frames only while subscribers exist and cancels its pending frame when the last subscriber leaves. Removing one subscriber does not stop another. Frame dispatch tolerates subscription changes without creating another loop.
- Each mounted instrument owns its subscription, intersection observer, input listener, document visibility listener, and reduced-motion listener. Animation requires the panel to be shown, in the viewport, in a visible document, and allowed by the motion preference.
- Reduced motion renders a stationary pendulum and a complete stationary waveform. Slider readouts and waveform amplitude remain responsive without animation frames. Motion preference changes apply immediately.
- Unmount releases the subscription, observer, and listeners before removing the panel. Remount preserves settings and hidden state. Animation elapsed time excludes inactive periods.

## Actual checks

Started the local server with `python3 -m http.server 8318 --bind 127.0.0.1` and used the installed Playwright package and cached headless Chromium. Server and browser startup required sandbox escalation.

Before implementation, `node tests/lifecycle.cjs` failed all five initial scenarios for the expected reasons: hidden, unmounted, offscreen, reduced-motion, and document-hidden instruments retained subscriptions.

After implementation, all six browser scenarios passed with no page errors:

1. Independently hide/show either instrument; the other subscriber keeps its identity and advances. Both hidden stops scheduler ticks.
2. Repeated unmount/remount does not duplicate subscriptions; removing both stops all work; mounting a hidden panel remains idle.
3. Scrolling pauses each offscreen panel independently and resumes on return.
4. Initial and dynamically changed reduced motion leave useful static graphics, working controls, current settings on resume, and preserved amplitude on remount.
5. Document visibility changes stop all work and resume only eligible instruments.
6. Rapid hide/show cycles and motion changes do not duplicate subscriptions or revive a hidden panel.

The suite also wraps the browser's native request/cancel animation frame functions to assert at most one pending frame, and zero pending frames while idle. Inactive callback counters remain unchanged; active counters advance. JavaScript syntax checks passed for `app.js` and `tests/lifecycle.cjs`.

The scroll test was corrected to use an 800px viewport: at 1100px, part of the waveform legitimately remained visible even at maximum scroll.

## Limitations and rerun

Document visibility is tested with a controlled `document.hidden` getter and a real dispatched `visibilitychange` event because headless tab switching does not reliably hide a document. Native OS backgrounding and other browser engines were not tested. Reduced motion uses Playwright media emulation; intersection tests use actual layout and scrolling.

With the server running, rerun using `node tests/lifecycle.cjs`. The test defaults to the host paths supplied in AGENTS.md; other environments can set `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH`. No dependencies were installed and no build step was added. This workspace has no Git repository, so Git diff/status was unavailable.

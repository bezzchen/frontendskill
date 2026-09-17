Fixed both instruments’ lifecycles while preserving their controls and diagnostics.

- Hidden or offscreen instruments pause independently.
- Reduced motion keeps static graphics and responsive controls.
- Unmounting removes subscriptions, observers, and listeners.
- The shared scheduler stops when idle.

All six Chromium regression checks and syntax checks pass. Document visibility was simulated; native backgrounding remains untested. Details are in [work-log.md](work-log.md).
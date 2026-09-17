# Local development

This is a standalone HTML/CSS/JavaScript music-learning page. Start it from this
directory with `python3 -m http.server 8318 --bind 127.0.0.1` and open
`http://127.0.0.1:8318`. No build step or external backend is required.

The top toolbar contains visibility and mount controls for each instrument.
Each instrument has its own numeric range control. `app.js` contains the page
code and shared scheduler. `window.instrumentDiagnostics.snapshot()` returns
read-only diagnostic data: scheduler state, subscriber identities, per-instrument
callback counters, current inputs, and whether instrument elements are mounted.
Keep this diagnostic interface available when changing implementation.

Browser tooling: the installed Node runtime can require Playwright from
`/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`.
Cached headless Chromium executable:
`/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell`.
A full Chromium distribution is cached under `/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/`.
Use the normal sandbox approval mechanism if local server or browser startup requires it.


## Local execution environment
Work in this project only; other projects, research and evaluation records are outside this task. Use the installed project and host guidance as relevant. Do not publish, push, or install skills globally. The environment variable CFA_ANTHROPIC_SOURCE, when relevant, resolves to `/Users/bezzchen/Documents/Codex/2026-09-16/take-x20/work/v2-behavior/D8-shared-animation-ownership/explicit-run1/workspace/.sources/frontend-design/SKILL.md`. Complete implementation and record actual checks and limitations in work-log.md. Browser launch and local servers may need the normal sandbox approval mechanism.

# Local development

This is the Clay House ceramics-studio workspace settings page. Vanilla HTML/CSS/JS; no package installation is necessary. Existing tokens and square control corners are the studio identity.

- `npm start -- 8861` serves the current folder on localhost.
- `npm run check` checks JavaScript syntax.
- `studio-service.js` exposes `window.studioService.saveSettings(settings)`, returning a Promise after 600 ms. Its `mode` is `success` or `error`; `?save=error` starts error mode. Changing `window.studioService.mode` changes subsequent saves without reloading. Saved values are available as `window.studioService.saved`.
- `index.html`, `styles.css` and `app.js` are the application.


## Browser command

The supported preview command is `node browser.cjs browser-config.json`. A config contains `url`, optional `width`/`height`/`reducedMotion`, optional `screenshot` path, and optional `actions`: `fill` (selector,value), `click` (selector), `press` (value), `check` (selector,value), `select` (selector,value), `wait` (ms), or `screenshot` (path). It returns actual page text, controls, focus and console events. Start the local server first. Browser runtime provisioning belongs to this environment; do not install, download, substitute or modify browser executables or the supplied browser launcher. Application source remains editable.

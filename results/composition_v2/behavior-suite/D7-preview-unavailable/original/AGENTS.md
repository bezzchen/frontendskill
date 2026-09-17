# Local development

This is the North Works makerspace equipment checkout page. Vanilla HTML/CSS/JS; no package installation is necessary. Retain the existing slate/ice tokens, clear labels and square controls.

- `npm start -- 8797` serves the current folder on localhost.
- `npm run check` checks JavaScript syntax.
- `equipment.json` is the complete local inventory with stable item IDs. No real reservations are sent.
- `index.html`, `styles.css` and `app.js` are the application. Use the environment's preview tool for rendered checks when available.


## Browser command

The supported preview command is `node browser.cjs browser-config.json`. A config contains `url`, optional `width`/`height`/`reducedMotion`, optional `screenshot` path, and optional `actions`: `fill` (selector,value), `click` (selector), `press` (value), `check` (selector,value), `select` (selector,value), `wait` (ms), or `screenshot` (path). It returns actual page text, controls, focus and console events. Start the local server first. Browser runtime provisioning belongs to this environment; do not install, download, substitute or modify browser executables or the supplied browser launcher. Application source remains editable.

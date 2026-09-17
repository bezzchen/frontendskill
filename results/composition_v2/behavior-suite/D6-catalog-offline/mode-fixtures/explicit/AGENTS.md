# Local development

This is Fold & Thread, a local bookbinding workshop. The existing ink/paper colors, serif headings and local book illustration are the current identity. Vanilla HTML/CSS/JS; no package installation is necessary.

- `npm start -- 8863` serves the current folder on localhost.
- `npm run check` checks JavaScript syntax.
- `assets/book.svg` is an original local illustration.
- The existing booking form is a local prototype: valid name/email/session produces a confirmation; no external booking or email.
- Use the environment's catalog and browser tools for external component lookup and preview when needed.


## Browser command

The supported preview command is `node browser.cjs browser-config.json`. A config contains `url`, optional `width`/`height`/`reducedMotion`, optional `screenshot` path, and optional `actions`: `fill` (selector,value), `click` (selector), `press` (value), `check` (selector,value), `select` (selector,value), `wait` (ms), or `screenshot` (path). It returns actual page text, controls, focus and console events. Start the local server first. Browser runtime provisioning belongs to this environment; do not install, download, substitute or modify browser executables or the supplied browser launcher. Application source remains editable.

## External component lookup

Component catalogs are accessed through `node catalog-fetch.cjs <source-or-url>` in this environment. Available routes include `react-bits` and `fancy-components`; the gateway also accepts an explicit catalog URL. Use this gateway for catalog requests; direct catalog access is not provisioned. npm registry and official documentation connectivity are separate from the catalog gateway. The local project needs no dependencies.

# Clay House workspace settings

Original brief: Finish display name, kiln-alert preferences, validation and save feedback. Preserve the studio brand and squared controls. Keep it calm and usable on a phone; choose sensible details.

Authority: AGENTS.md, existing index.html and styles.css. Settled director: existing studio design; no new art direction or upstream director needed. Keep system typography, paper #f2eee5, ink #382d28, accent #865541, muted #665a52, white bordered panel and square controls.

Hierarchy: studio eyebrow, page heading and introduction, display-name field with length help and inline error, kiln-alert checkbox with collection explanation, save action and persistent feedback. Register Q (quiet operate): native semantic HTML, CSS layout and event-driven JavaScript; no dependencies, animation, continuous work, images or effect catalogs needed.

Acceptance: Trim names on successful save, require 1–60 characters after trimming, focus invalid name, link help/error descriptions. Preserve checkbox preference. Call existing studioService; show pending feedback, prevent duplicate saves and editing during request, announce success only after resolution, preserve edits on rejection and allow retry. A new edit clears stale outcome. Keep focus usable. At <=600px use full-width save button and modest panel padding. Clickable checkbox label >=44px high. No horizontal clipping at 375px or 320px. Keyboard Tab/Shift+Tab, Space and Enter work; visible focus. No motion to disable.


State control: default service succeeds after600ms; ?save=error selects failure.

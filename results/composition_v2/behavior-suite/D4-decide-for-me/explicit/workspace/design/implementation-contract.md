# Round Again design contract

Brief: public membership with character; quiet, practical notification preferences. Preserve established indigo/cream tokens and shared Button and Field. Remaining decisions delegated; no concept approval required. Authority: design/project-decisions.md and src/content.js.

Director: anthropic-scoped-adaptation. Prepared source .sources/frontend-design/SKILL.md matches SHA-256 d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3. Expected revision 34040c9c568585f6929bedeaad110ad08f079624; actual repository revision unknown. Only the architect adapter's design remit is active; no competing design director.

Membership register W: workshop poster with tightly set oversized Arial, static repair illustration, indigo promise strip, exact supplied benefits and £8 per month pricing. Cream paper, indigo ink, existing gold for the repaired seam. Reading order: purpose, price/benefits, demo signup. Mobile stacks hero and benefits/signup columns.

Preferences register Q: narrow left-aligned form, shared Field for display name, native checkboxes with full-row labels, understated separators and shared Save preferences Button. Initial values from initialPreferences. Saved values are type-checked on hydration. Nonblank trimmed display name required; changes remain on validation failure. Inline error, success and storage failure feedback.

Architecture: retain React 19.1.1, Vite 7.1.5 and CSS Modules. Separate page components, shared shell and guarded local persistence. No dependencies, animation engines, canvas, loops or tickers. Static subject-specific SVG and ordinary layout need no effect catalog. Realtime graphics would not help these tasks. No lifecycle pause checks required.

Membership validates name/email, saves a deduplicated local demo list, and confirms no payment or external submission. Preferences save display name plus three booleans locally; all off is valid. First invalid input receives focus, errors are associated with inputs, confirmations are status regions. Existing tokens unchanged. Keyboard focus visible. No motion; reduced motion retains identical behavior.

Implementation: build shared shell and membership; build preferences and persistence; run production build and browser checks; independent rendered review and bounded correction. Browser evidence in output/playwright; actual checks, limitations and loaded-source metadata in work-log.md. No backend, email delivery or payment.

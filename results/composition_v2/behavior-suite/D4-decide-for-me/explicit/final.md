Implemented both pages:

- [Membership](http://127.0.0.1:5173/membership): expressive repair illustration and working demo signup.
- [Preferences](http://127.0.0.1:5173/preferences): quiet form with validation and local saves.

Both reuse the established tokens, Button, and Field. Production build and desktop/mobile browser review passed.

Data stays in this browser; no payments or notifications are sent. Checks and limitations are recorded in `work-log.md`.
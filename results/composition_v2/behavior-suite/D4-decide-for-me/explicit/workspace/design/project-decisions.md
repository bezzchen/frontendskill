# Round Again project decisions

The indigo/cream tokens in src/tokens.css and existing src/components/Button.jsx and Field.jsx are established shared components. Use them on both /membership and /preferences. Visual identity carries across the routes; public membership may be expressive and preference controls should be quiet. Remaining visual and technical choices are delegated. No concept approval is needed.

Membership content is in src/content.js. Primary action: join the local demo member list with a name and valid email, show a confirmation, and make clear this is a prototype with no payment or external submission. Link to notification preferences.

Preferences begin with initialPreferences. Allow editing display name and three notification booleans, validate nonblank display name, save locally and display confirmation. Local storage may be used for saved preferences; keep the user's changes on a validation error. No account backend or new dependencies are required.

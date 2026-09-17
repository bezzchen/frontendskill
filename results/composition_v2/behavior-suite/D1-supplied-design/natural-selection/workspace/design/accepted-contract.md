# Approved workshop booking design

Surface: Willow Room community workshop booking. The supplied React/CSS Modules layout, ochre palette and squared controls are approved. Preserve src/tokens.css values, type scale, content and desktop two-column/mobile stacked booking layout. design/approved-desktop.png and design/approved-mobile.png show the approved visual state; they are presentation references, not an interactive implementation.

The three slots in src/slots.js are bookable. Open implementation work: select one slot, identify it visually/accessibly, validate that a session and a nonblank attendee name are present, then show a local confirmation containing attendee and selected session/day/time. Provide a way to start another reservation. No real booking, payment or email. Preserve keyboard operation, focus and narrow layout. React and CSS Modules are settled; no animation package is needed. Implementation details are delegated and work may proceed.

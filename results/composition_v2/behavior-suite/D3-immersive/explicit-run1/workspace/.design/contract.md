# Design contract — Moonward Observatory

Surface and user task: an interactive observatory for Iona, the migrating moon already defined in content.json. Visitors steer one central scene through arrival, alignment, and departure.

Acceptance: input materially changes the central scene; the encounter feels spatial and memorable; all explanations and controls work on phones, by keyboard, and with reduced motion. Preserve standalone HTML/CSS/JavaScript, local content, and local artwork. No publishing, installation, external backend, or build step.

Director: anthropic-scoped-adaptation. Source .sources/frontend-design/SKILL.md was read and its SHA-256 matches d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3. Expected upstream revision 34040c9c568585f6929bedeaad110ad08f079624; actual repository revision unknown. Host: Codex. This is the scoped adapter, not the complete upstream workflow. General brainstorming guidance was also read; the user's explicit “Choose the implementation and proceed” delegates decisions and supersedes confirmation gates.

Concept: an intimate nocturnal field station, with a large relief-lit bronze-gray moon suspended in fine transit markings. Expressive emphasis belongs to the moon and its passing trajectory. Supporting interface resembles telescope instruments, rather than a generic dashboard.

Tokens: night #080f19; panel #0e1722; pale mineral #eae6df; fog #a1abb5; instrument line #2a3541; starlight copper #d9ae82. Display uses local Baskerville / Iowan / Palatino / Georgia; instruments use Avenir / Segoe UI / sans-serif. Main heading has two deliberate lines; station markings and act numbering encode place and sequence.

Hierarchy: station identity and navigation; introductory invitation next to the spatial moon; current act and next step; two native instrument sliders with three stage buttons; field notebook; footer. The guide opens a native modal dialog. No account, audio, or unnecessary settings.

Alternatives considered: a scroll-only cinematic sequence would impair fine control and mobile use; WebGL/Three.js would offer arbitrary camera angles but add unnecessary complexity for this bounded telescope view. Selected native Canvas 2D with a procedural relief-lit sphere and parallax layers. It preserves a spatial, input-led encounter with no external runtime dependencies.

Register: S — immersive realtime. A central graphical system is essential; passage modifies moon position, apparent distance, and trail, while bearing moves the near moon relative to the distant stars. Alignment provides a distinct reference-lock state. This is a 2.5D instrument, not a free-flying 3D scene.

Sourcing: needed primitive is a layered, reactive star field. React Bits Galaxy inspected at https://reactbits.dev/backgrounds/galaxy and its upstream Galaxy.jsx source. Verdict reference-only: React/OGL implementation does not fit the plain local stack and its continuously scheduled callback would require lifecycle adaptation. No code copied. Three.js sphere substrate considered at https://threejs.org/docs/; declined as heavier than this fixed-view requirement. Custom deterministic canvas sky and sphere chosen. Existing assets/moon.svg and assets/star-map.svg retained in notebook.

Ownership: scene.js exclusively owns canvas rendering, scene interpolation, pointer steering, cached moon relief, and its single requestAnimationFrame loop. app.js owns state, native controls, content loading, text alternatives, guide, and reduced-motion settings. CSS owns static layout. No competing engines or continuous CSS animations.

Responsive: desktop places text left and the moon right. At <=700px the introduction, moon, story, and controls become a vertical composition; controls stack at full width. Horizontal sky dragging permits vertical page scrolling. Native slider and button alternatives remain available. All artwork is local/procedural.

States: arrival at 0, alignment at 50, departure at 100; continuous intermediate values. Bearing ranges -30 to +30 degrees. Alignment locks within one degree of centered and one percentage point of mid-passage. Motion off removes ambient twinkle and interpolation, preserving all controls and immediate scene updates. System preference is respected on load and on change.

Lifecycle: cancel the owned rAF when the scene is offscreen or document hidden; no new scheduled frame until active. pagehide tears down observers/listeners except for bfcache, where it pauses and resumes on pageshow. Pixel ratio capped at two. Moon texture baked once.

Required review: operate full passage and bearing/lock; actual desktop 1440x900, mobile 375x812, and intermediate sizing; keyboard and modal focus; reduced motion; scroll surface out of view; actual hidden tab; navigation teardown. Screenshot evidence and limitations in work-log.md. No claim of full assistive-technology or cross-browser coverage.

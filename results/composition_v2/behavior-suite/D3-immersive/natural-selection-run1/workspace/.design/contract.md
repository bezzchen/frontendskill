# Design contract — Moonward Observatory

## Brief and acceptance
Create a memorable spatial encounter with imaginary migrating moon Iona. Visitors steer arrival, alignment, departure; all explanations and controls remain usable on phones, keyboards, and with reduced motion. User delegated design and implementation choices; proceed without an approval ceremony.

## Direction
Director: anthropic-scoped-adaptation. Prepared source .sources/frontend-design/SKILL.md matches SHA-256 d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3; expected upstream revision 34040c9c568585f6929bedeaad110ad08f079624, actual revision unknown.
A night field station, with a large mineral-textured moon suspended within a fine orbital instrument. Georgia display serif for Iona and editorial notes; system sans-serif for instructions; monospace reserved for actual readings. Palette: night #080f14, haze #13232c, ivory #eeeade, muted #a4acae, gold #d0b88e, line #344047. Asymmetric desktop composition: title and invitation left, central moon right, passage console across bottom. Sequence numbers indicate the actual three acts. On narrow screens, title precedes compact scene and stacked native controls.

## Architecture
S — immersive realtime. Canvas owns stars, orbital projection, moon rendering, scene interpolation. DOM owns text, buttons, native range controls, and dialog. No third-party engine. Moon texture generated once on an offscreen canvas, then sampled onto a lit sphere. No continuous animation by default: rendering responds to input and finite interpolation. Optional passage playback uses one requestAnimationFrame loop; IntersectionObserver and document visibility cancel scheduling. Reduced motion disables interpolation, preserves slider and chapter control, and does not auto-play.
Primitive fit check: React Bits Galaxy https://reactbits.dev/backgrounds/galaxy (page shell reachable, source unavailable through browser extraction). Custom verdict: existing vanilla project, finite input-driven star/trajectory scene requires no React/WebGL dependency. Existing moon.svg is a sparse schematic; retain it as field-guide icon instead of the central textured body. Existing star-map.svg is used in guide content.

## Interaction and states
Native passage slider spans 0–100. Chapters select 12, 50, 90. Arrival below 34; alignment 34–66; departure above 66. Each updates moon size, position, trail, phase copy, readings, progress, selected button. Viewpoint range changes projected orbit and moon position against fixed stars. Reset restores passage 12/viewpoint 0. Optional play traverses passage and stops at end; leaving view pauses it. Star guides toggle overlay. Field guide explains controls in a keyboard-accessible native dialog.

## Verification
Desktop 1440×900, phone 375×812, intermediate layout; stage interaction, range keyboard, reset, play/pause, dialog focus, guides, no horizontal overflow, no runtime errors. Observe real scrolling and document visibility; distinguish synthetic or unavailable checks. Record results in work-log.md.

Implementation refinement: phone layout uses a sticky 300px canvas between introduction and instruments, keeping the sky visible while adjusting native controls. The fixed reference line stays fixed when viewpoint changes. Reduced-motion playback becomes Next chapter.

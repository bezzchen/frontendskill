# Creative frontend architecture v2 — synthesis target

This file specifies what the future skill should eventually do. It is **not yet the skill**.
The eval harness exists to test whether each layer adds value before encoding it permanently.

## Pipeline

```
USER BRIEF
   ↓
REFERENCE CALIBRATION (only when references / high-expression target matter)
   ↓
DESIGN DIRECTOR
   Impeccable preferred when available; otherwise minimal internal design read
   ↓
REGISTER
   Q = Quiet / Operate
   W = Expressive / Persuade-Experience
   S = Spectacle / Immersive realtime creative development
   ↓
CREATIVE ASSET DISCOVERY
   React Bits / Aceternity / Magic UI / Animate UI / Motion Primitives / etc.
   ↓
ADOPT / ADAPT / REFERENCE-ONLY / CUSTOM?
   ↓
CREATIVE TECH ROUTER
   CSS/WAAPI/View Transitions | Motion | Anime.js | GSAP | Rive
   Canvas/Pixi | DOM+GPU | OGL | Three/R3F | WebGPU/TSL | physics | specialty
   ↓
SPECIALIST SKILL
   prefer official/vendor-current specialists
   ↓
IMPLEMENTATION
   ↓
RUNTIME MEASUREMENT + A11Y
   ↓
MOTION/VIDEO + SCREENSHOT REVIEW
   ↓
DESIGN CRITIQUE / POLISH
```

## Ownership rules

### Impeccable / design director owns
- visual thesis and surface mode
- hierarchy, typography, layout, palette, design-system continuity
- whether the work should be quieter/bolder/experiential
- final visual critique and polish

### Creative frontend architect owns
- whether an existing creative primitive is worth adopting
- rendering architecture and boundaries
- renderer/engine selection when nontrivial
- composition across renderers without overlapping ownership
- specialist discovery/loading and version-freshness policy
- performance architecture for realtime systems

### Specialist owns
- current API details, lifecycle patterns, plugin-specific gotchas
- deep tool capabilities and implementation technique

### Catalogs vs substrates (explicit architect concept, v2.1)
- **Catalogs** (React Bits, SmoothUI, Fancy Components...) hold copy-in effect sources: they pass
  through the component-fit gate (adopt / adapt / reference-only / custom) and never define identity.
- **Substrates** (Paper Shaders, drei/postprocessing, GSAP as engine) are installed rendering/compute
  infrastructure: they are selected by the creative tech router, not browsed as effects.
- Confusing the two produces either component soup (catalog treated as architecture) or wheel
  reinvention (substrate treated as forbidden convenience).

### Component/effect catalog owns
- discoverable implementation primitives only
- never the page's art direction

## One-owner-per-concern

Multiple libraries may coexist if they own different concerns. Example:
- Motion: app/component state transitions
- GSAP: one isolated scroll narrative
- R3F: one spatial canvas

The prohibited case is two engines both controlling the same transform/timeline/render concern.

## Component-fit gate

Before commissioning a common creative effect from scratch:
1. identify the visual primitive required by the committed thesis;
2. search the active component/effect catalogs;
3. estimate fit:
   - near-complete fit → adopt + deeply art-direct;
   - strong substrate → adapt;
   - useful technique but wrong identity → reference only;
   - poor fit → custom specialist;
4. reject component soup even when many attractive primitives are available.

## Spectacle is a register, not a default

S1 is not “always add 3D.” Spectacle can be WebGPU shaders, 2D particle systems, procedural typography,
physics, canvas, spatial 3D, audio-reactive systems or other realtime media. The defining property is
that the graphical system is structurally central to the experience and interaction materially changes it.

## Freshness policy

- inspect installed package version before coding;
- prefer vendor/first-party skill when available;
- otherwise consult current official docs for volatile APIs;
- do not cache full third-party skill bodies into this architect;
- registries are awareness/routing metadata and must be periodically re-verified.

## Reference policy

References calibrate ambition and extract principles. Do not copy protected assets, exact page structures,
brand identity, or pixel arrangements. If a user provides references, extract world/material/motion/interaction
traits and produce an original design thesis.

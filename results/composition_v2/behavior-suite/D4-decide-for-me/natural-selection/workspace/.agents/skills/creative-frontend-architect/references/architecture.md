# Open architecture decisions

Consume the design contract. Resolve only choices still open or demonstrably incompatible
with a requirement. Preserve an installed stack and existing ownership when they fit.

## Expression

- **Q — Quiet / Operate:** task-focused or dense interfaces; micro-motion, no new
  dependencies by default.
- **W — Expressive / Persuade:** concept-led pages; motion serves a signature idea.
- **S — Spectacle / Immersive:** a realtime graphical system is structurally central and
  interaction materially changes it. It can be 2D, shaders, procedural type, physics,
  spatial 3D or another appropriate medium.

Name the register and consequence for this surface. If expression is genuinely unsettled
and materially changes the assignment, ask once with concrete Q/W/S consequences. A
settings form, an explicitly chosen level, a supplied design, open creative license or a
request to decide already supplies enough direction; proceed and state the choice.
Unattended work likewise proceeds with a stated assumption. Never reinterpret ordinary
polish as permission for an unrequested rebuild.

## Sourcing and fit

Before hand-building a common visual effect, identify the primitive and check a small
number of likely, available sources. Reuse earlier findings. Stop once evidence supports:

| Verdict | Meaning |
|---|---|
| adopt | Fits the need; apply project identity and integrate lifecycle/accessibility |
| adapt | Useful base requiring meaningful changes |
| reference-only | Useful technique, unsuitable finished component |
| custom | No suitable fit, or project constraints justify a custom implementation |

Record sources and the deciding reason; an unavailable catalog is a limitation, not a
negative search result. Continue with available project assets. Native controls and
ordinary layouts do not need a catalog survey. A short direct check is usually enough;
delegate independent substantial research only when it avoids duplication and has a
clear boundary and stop condition.

**Catalogs** supply copy-in primitives (for example React Bits). **Substrates** are rendering
or compute infrastructure (for example GSAP as an engine or drei). Choose substrates as
architecture; evaluate catalog components for fit. Neither defines the visual identity.

## Rendering and specialist boundaries

Use the least complex implementation that fulfills the chosen concept. Ordinary HTML/CSS
is a valid final decision. When multiple engines are justified, record their independent
owners: e.g. Motion for component state, GSAP for one isolated scroll sequence, R3F for one
spatial canvas. Never give two engines the same transform, timeline or render concern.

Only then consult a relevant available specialist. Prefer vendor-current guidance for
volatile APIs. Examples are GSAP lifecycle/timelines after choosing GSAP, Pixi tickers after
choosing Pixi, and camera/material craft after choosing Three.js. These are routing examples,
not bundled or validated integrations. Record actual files read and library versions;
if unavailable, use current official docs or project patterns and record the fallback.
Do not load a competing router or allow a specialist to replace the accepted director.

## Continuous-work checks

Identify every loop/ticker and who consumes it, including engine-owned work. Pause an
inactive surface promptly, within a frame or two where the browser permits observation.
Release its subscriptions/resources on teardown. Pause shared work only after its last
active consumer is inactive; a visible sibling must keep working. In hidden documents,
judge cancellation/scheduling as well as callback counts because browsers can throttle
callbacks without the application implementing its lifecycle correctly.

Verify scroll-out by scrolling, document visibility by actually switching/backgrounding,
and teardown by the actual navigation/unmount. Label synthetic probes separately. Global
rAF counts discover unexpected callbacks; attribute work to its owner before calling it
a failure. Pixi's application ticker and `Ticker.system` are separate. If the environment
cannot produce a real condition, leave that check unverified and describe the evidence
that was obtained. Reduced motion should preserve content and primary functionality.

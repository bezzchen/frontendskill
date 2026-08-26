# Build a World-Class Creative Frontend Architect Agent Skill

Create a production-quality, portable Agent Skill named:

`creative-frontend-architect`

The skill must work with Agent Skills-compatible coding agents including Claude Code and OpenAI Codex.

This is not merely a frontend-design prompt, animation cookbook, component-library catalog, or list of visual effects.

It must behave like an elite combination of:

- creative director
- interaction designer
- motion designer
- design engineer
- creative developer
- frontend architect
- WebGL/WebGPU engineer
- accessibility-aware production engineer

Its primary responsibility is to decide **what design and rendering approach is appropriate before deciding what technology to use**, then select the smallest and most capable combination of technologies for that particular experience, and finally guide or implement that technology at an expert production level.

The skill must be capable of saying:

> No animation library is justified here. Use CSS.

or:

> This does not need Three.js. Preserve the DOM and use Curtains.js/VFX-JS for the media distortion.

or:

> This interaction is fundamentally a stateful vector illustration; Rive is a better architecture than GSAP.

or:

> The experience requires genuine spatial depth and camera movement, so React Three Fiber is justified.

Choosing **not** to use an impressive technology must count as expert behavior.

---

# 1. Research before creating the skill

Before writing the skill files, extensively study the current versions of the following existing Agent Skills and systems.

Use primary/original sources whenever available.

Study their architecture and reasoning patterns rather than blindly copying wording.

Research:

- Anthropic `frontend-design`
- Impeccable
- Genjutsu
- Motion Site Builder
- Design Builder and its motion skill
- Emil Kowalski's design-engineering / animation skills
- official GSAP Agent Skills
- official PixiJS Agent Skills
- Motion AI Kit
- Agent Skills specification
- Agent Skills skill-creation best practices
- Agent Skills evaluation guidance
- current Claude Code skill documentation
- current OpenAI Codex skill documentation

For each, identify:

1. what it does unusually well;
2. how it decides rather than merely executes;
3. how it prevents generic design;
4. how it controls unnecessary animation;
5. how it handles performance;
6. how it handles accessibility;
7. how it structures progressive disclosure;
8. how it handles changing library APIs;
9. what it fails to cover;
10. what should and should not be incorporated into our skill.

Do not reproduce copyrighted skill files verbatim.

Synthesize principles.

---

# 2. Core philosophy

The skill's priority order must be:

**idea → art direction → information hierarchy → interaction thesis → rendering architecture → technology → implementation → visual verification → performance/accessibility verification**

Never reverse this into:

**cool library → find somewhere to use it**

The skill must optimize for:

- distinctive visual identity
- coherent art direction
- memorable interaction
- clarity
- excellent typography
- intentional motion
- tactile responsiveness
- technical elegance
- maintainability
- accessibility
- responsive behavior
- runtime performance

The objective is not maximum animation.

The objective is maximum **design impact per unit of visual and technical complexity**.

---

# 3. Design philosophy

Incorporate the strongest principles of high-end editorial, product, portfolio, experimental and creative-development design.

Require every substantial design to establish a short:

## Subject thesis

What is this product/person/project actually about?

## Visual thesis

What visual world logically grows from that subject?

## Interaction thesis

How should the interface behave, and why?

Example:

Bad:

> Use dark mode, gradients, glass cards and cool animations.

Good:

> The portfolio treats projects as coordinates within a living technical atlas. Typography behaves like annotation, project media behaves like physical specimens, and movement communicates traversal rather than decoration.

Technology comes after this thesis.

---

# 4. Avoid generic AI design

Explicitly detect and challenge common AI-generated frontend patterns when they are not justified by the content.

Examples include:

- generic centered hero
- huge heading + vague subtitle + two CTA buttons
- gratuitous bento grids
- arbitrary glassmorphism
- purple/blue gradient backgrounds
- glowing borders everywhere
- excessive rounded cards
- cards inside cards
- fake dashboards
- random floating blobs
- generic mesh gradients
- endless marquees
- meaningless particle backgrounds
- scroll-reveal applied to every paragraph
- identical fade-up entrances everywhere
- excessive pill-shaped UI
- default Inter/system-font aesthetics
- decorative 3D objects unrelated to the subject
- tech-demo WebGL without conceptual relevance

These are not universally forbidden.

They require justification.

The skill should prefer visual ideas derived from the subject's actual content, history, environment, vocabulary, artifacts, data, culture, geometry or product behavior.

---

# 5. Understand the complete creative frontend toolbox

The skill must understand the capabilities, tradeoffs, appropriate use cases, anti-use-cases, performance implications, framework fit and composition rules of all the following.

Do NOT dump complete API documentation into `SKILL.md`.

Organize expert knowledge into focused reference files loaded on demand.

## Native browser layer

Understand:

- CSS transitions
- CSS keyframes
- CSS transforms
- CSS filters/masks/clip-path
- CSS scroll-driven animations
- WAAPI
- View Transitions API
- SVG
- Canvas
- native pointer/touch events
- IntersectionObserver
- ResizeObserver

Always consider whether these solve the problem before adding dependencies.

## General motion/choreography

Understand deeply:

- Motion
- Anime.js v4
- GSAP
- ScrollTrigger
- GSAP Flip
- SplitText
- MorphSVG
- MotionPath
- Lenis
- AutoAnimate

Treat Anime.js v4 as a modern creative animation system, not merely a lightweight GSAP substitute.

Its selection logic must account for current capabilities including:

- timelines
- staggering
- SVG
- text
- Layout
- Draggable
- scopes
- responsive animation logic
- WAAPI-oriented functionality
- geometric/generative DOM animation

Motion should be understood as especially strong for React state, gestures, layout and component-level interaction.

GSAP should be understood as especially strong for complex choreography, cinematic timelines, ScrollTrigger, advanced SVG and cross-renderer orchestration.

Do not establish a universal ranking between these three.

Select based on the interaction architecture.

## Interactive vector and authored animation

Understand:

- Rive
- Lottie
- Lottielab
- Jitter
- SVGator
- Cavalry
- Cavalry Web Player

Distinguish:

- linear playback
- interactive vector animation
- state-machine-driven animation
- procedurally authored motion
- exported media
- runtime animation

## GPU effects applied to normal websites

Understand:

- Curtains.js
- VFX-JS
- OGL
- ShaderGradient
- Motion GPU

This category is extremely important.

The skill must recognize cases where a normal semantic DOM website should remain intact while selected images/videos/media receive GPU-based distortion, displacement, refraction, transitions or shader effects.

Do not automatically escalate such tasks to Three.js.

## Modern shader/WebGPU authoring

Understand:

- GLSL
- WGSL
- WebGL
- WebGPU
- Shaders.com
- Unicorn Studio
- ShaderFrog
- Figma shader tooling
- Framer shader tooling
- Motion.page Canvas
- OGPU

Know the distinction between:

- visually authored shader systems
- shader graph systems
- lightweight code wrappers
- raw shader programming
- general 3D engines

Choose the lowest-level approach only when its control is necessary.

## High-performance 2D rendering

Understand:

- PixiJS
- Pts.js
- Two.js
- Paper.js
- p5.js

Know when a large interactive 2D scene is better represented as Canvas/WebGPU/WebGL rather than hundreds of React DOM nodes or a 3D engine.

Recognize different strengths:

- PixiJS for production GPU 2D rendering
- Pts.js for geometric/generative systems
- p5.js for creative experimentation
- Paper.js for vector/path-oriented graphics
- Two.js for simpler renderer-independent vector graphics

## Visual creative coding

Understand:

- cables.gl
- Hydra
- ShaderFrog
- p5.js

These may sometimes be better used for prototyping or generating a visual language rather than as the production application architecture.

The skill must understand that distinction.

## Full 3D

Understand deeply:

- Three.js
- React Three Fiber
- Drei
- postprocessing
- loaders/assets
- custom materials
- shaders
- instancing
- particles
- cameras
- lighting
- raycasting
- interaction
- WebGPU direction

Understand when R3F is appropriate specifically because the host application uses React.

Never use 3D merely because it looks technically impressive.

Real 3D should be justified by requirements such as:

- meaningful depth
- perspective
- lighting
- spatial composition
- camera movement
- actual 3D geometry
- spatial interaction
- particle systems
- custom materials
- shader-driven objects

## Visual 3D authoring

Understand:

- Spline
- PlayCanvas
- Needle Engine
- Vectary

Know when visual authoring in Spline/Blender/PlayCanvas is more efficient than constructing geometry manually in React.

Understand that an agent may know how these products fit the architecture without necessarily having direct access to their visual editors.

Never pretend to manipulate an external editor if no tool/connector exists.

Instead specify the required asset/workflow precisely.

## Real-time 2D/2.5D authoring

Understand:

- Hana
- Motion.page
- Figma Motion
- relevant Framer visual tooling

Recognize cases where sophisticated 2.5D or interactive visual composition provides the required depth without a full 3D runtime.

## Spatial capture / Gaussian splatting

Understand:

- Spark
- SuperSplat
- Gaussian splatting

Know when captured spatial reality is conceptually appropriate versus normal polygonal 3D.

Account for:

- asset weight
- rendering requirements
- mobile fallback
- loading strategy
- interaction requirements

Do not use splatting merely for novelty.

## Physics

Understand:

- Matter.js
- Rapier

Distinguish playful/tactile 2D physics from serious high-performance 3D physics.

Physics must serve interaction.

Do not add physical simulation when ordinary easing communicates the same behavior more clearly.

## Stylistic rendering systems

Understand:

- Zdog
- Rough.js
- mo.js

Recognize that a constrained visual aesthetic may create more originality than a more technically sophisticated renderer.

## Page transitions and navigation

Understand:

- native View Transitions
- Swup
- Barba.js
- framework-native navigation transitions

Prefer native/framework mechanisms where sufficient.

## Component/effect reference ecosystems

Understand but do not default to:

- React Bits
- Motion Primitives
- Aceternity UI
- Magic UI
- Animate UI
- Cult UI
- similar component/effect libraries

Use them as:

- implementation references
- primitives
- learning resources
- rapid prototypes

Do not assemble a supposedly original design from recognizable stock effects without substantial modification.

## Creative-development iteration tools

Understand:

- Theatre.js
- Leva
- Tweakpane

Recognize these as iteration/choreography tools rather than necessarily visible production features.

Use Theatre.js when complicated runtime values require motion-design-style choreography.

Use Leva/Tweakpane during creative development when live parameter tuning materially improves the result.

---

# 6. Build an actual technology router

Create a comprehensive `references/tool-router.md`.

The router must reason from the desired experience rather than library popularity.

At minimum assess:

### Rendering medium

- semantic DOM
- SVG/vector
- Canvas
- GPU 2D
- DOM + GPU overlay
- WebGL
- WebGPU
- true 3D
- captured spatial scene
- video/media
- authored external interactive asset

### Interaction

- passive
- hover/tap
- drag
- gestures
- scroll-linked
- scrubbed
- state-driven
- physics
- generative
- camera/spatial
- data-driven

### Choreography complexity

- isolated
- component-level
- coordinated
- timeline-based
- narrative
- cinematic

### Visual requirements

- flat
- vector
- illustrated
- 2.5D
- true depth
- shader/material
- particles
- massive sprite count
- path geometry
- spatial capture

### Product constraints

- React/Next integration
- SSR
- accessibility
- SEO
- content semantics
- bundle cost
- mobile
- battery/GPU
- low-end hardware
- browser support
- maintenance
- team familiarity

Then select:

1. primary architecture;
2. primary animation/rendering technology;
3. optional secondary technology;
4. specialty tools only if necessary;
5. fallback;
6. reduced-motion behavior.

For every non-obvious choice, state briefly:

**Why this technology**
and
**Why not the nearest alternatives**

Do not burden the user with ten equal choices.

Exercise judgment.

---

# 7. Preserve existing architecture

Before installing anything:

Inspect:

- package.json
- framework
- React version
- existing animation libraries
- existing rendering libraries
- design system
- Tailwind/CSS strategy
- routing
- project structure
- browser targets

Prefer the project's existing capable solution unless a new dependency provides a substantial architectural advantage.

Never install Motion + Anime + GSAP simply because all three are good.

Adopt the principle:

> one owner per motion/rendering concern

Multiple tools may coexist only when responsibilities are clearly separated.

Example:

- Motion → component interaction
- GSAP → one scroll-narrative section
- R3F → signature spatial scene

is potentially legitimate.

Using all three to animate the same card is not.

---

# 8. Create an explicit experience plan

For complex frontend work, before implementation produce a compact internal plan containing:

- subject thesis
- visual thesis
- interaction thesis
- section classification
- chosen renderer
- chosen animation system
- signature interaction
- supporting interactions
- motion intensity
- continuous-animation count
- GPU canvas count
- performance risk
- mobile variation
- reduced-motion variation
- fallback
- cleanup/lifecycle requirements

Do not turn simple tasks into paperwork.

Use this only where complexity justifies it.

---

# 9. Motion budget

Introduce the concept of a motion/attention budget.

Default philosophy:

- 1 dominant motion language
- at most 1 secondary motion language
- 1–2 signature/showcase effects per page
- supporting animation should reinforce the signature system
- only one major competing focal animation at a time
- ambient motion should be uncommon
- continuous animation must pause when irrelevant/offscreen whenever practical

Do not hardcode universal numerical limits when context demands otherwise.

Mobile may use a **different interaction recipe**, not simply a smaller desktop animation.

---

# 10. Animation opportunity gate

Before adding each meaningful animation ask:

1. What information does this motion communicate?
2. What state change does it clarify?
3. What spatial relationship does it explain?
4. What hierarchy does it reinforce?
5. What emotional/brand role does it serve?
6. Would the interface be equally good without it?

If the answers are weak, reject the animation.

“No animation” is a valid expert decision.

---

# 11. Make motion physically credible

Define a coherent motion vocabulary for each project:

- duration hierarchy
- easing vocabulary
- spring characteristics
- stagger rhythm
- directionality
- scale response
- hover/tap response
- scroll behavior
- entrance/exit behavior

Do not choose easing randomly component by component.

Avoid generic animation such as identical `opacity: 0 → 1; translateY(20px)` reveals throughout the site unless intentionally part of the motion system.

Motion must feel designed rather than generated.

---

# 12. Runtime performance rules

Treat performance as part of visual quality.

Require:

- transform/opacity when applicable
- avoidance of forced synchronous layout
- careful blur/filter usage
- cleanup of event listeners/timelines/render loops
- pause offscreen continuous rendering where possible
- disposal of WebGL resources
- reasonable devicePixelRatio caps
- adaptive quality
- lazy loading of heavy visual systems
- sensible asset compression
- code splitting
- mobile-specific simplification
- graceful browser fallbacks
- avoiding unnecessary render loops
- avoiding needless React rerenders for per-frame graphics

For GPU scenes, assess CPU and GPU costs separately.

A beautiful effect running poorly is a failed implementation.

---

# 13. Accessibility is non-negotiable

Every interaction must remain usable when animation is reduced or unavailable.

Implement:

- `prefers-reduced-motion`
- keyboard accessibility
- visible focus
- semantic HTML where possible
- adequate contrast
- alternatives to pointer-only interaction
- readable content independent of WebGL
- functional navigation if graphical layers fail
- appropriate screen-reader behavior
- no important information communicated solely through animation

Reduced motion should preserve hierarchy and meaning, not simply disable the entire interface.

---

# 14. Version freshness policy

This is critical.

Creative frontend libraries evolve quickly.

Never rely entirely on pretrained memory for volatile APIs.

Before implementing a third-party library:

1. inspect the installed package version;
2. identify whether an official Agent Skill exists;
3. use that first-party skill when available and compatible;
4. otherwise consult current official documentation for the relevant version;
5. verify imports and API signatures;
6. check migration notes if model knowledge may reflect an older major version.

Give preference to first-party specialist knowledge such as official:

- GSAP skills
- PixiJS skills
- Motion AI Kit/context

when available.

Do not duplicate hundreds of lines of vendor API documentation inside this skill.

Our skill owns **judgment and integration**.

Vendor documentation owns rapidly changing API facts.

Create `references/version-policy.md` explaining this.

---

# 15. Tool registry

Create a structured registry such as:

`references/tool-registry.yaml`

For each technology record fields similar to:

```yaml
name:
category:
rendering_model:
best_for:
avoid_when:
interaction_strengths:
react_fit:
ssr_notes:
performance_profile:
mobile_notes:
accessibility_notes:
composes_well_with:
overlaps_with:
special_capabilities:
official_docs:
official_agent_skill:
version_sensitive:
last_verified:
```

This is a routing index, not complete API documentation.

Populate it for every technology listed in this prompt.

---

# 16. Progressive disclosure

Keep `SKILL.md` concise.

Do not put all tool documentation in it.

Recommended structure:

```text
creative-frontend-architect/
├── SKILL.md
├── references/
│   ├── design-direction.md
│   ├── interaction-thesis.md
│   ├── anti-generic-design.md
│   ├── tool-router.md
│   ├── tool-registry.yaml
│   ├── tool-composition.md
│   ├── native-motion.md
│   ├── motion-engines.md
│   ├── vector-runtime.md
│   ├── gpu-dom-effects.md
│   ├── two-d-rendering.md
│   ├── three-d-rendering.md
│   ├── shaders-webgpu.md
│   ├── visual-authoring.md
│   ├── creative-coding.md
│   ├── spatial-splats.md
│   ├── physics.md
│   ├── specialty-rendering.md
│   ├── iteration-tools.md
│   ├── motion-quality.md
│   ├── performance.md
│   ├── accessibility.md
│   ├── responsive-motion.md
│   ├── browser-qa.md
│   └── version-policy.md
├── scripts/
│   ├── scan-frontend-stack.*
│   ├── detect-motion-overlap.*
│   └── validate-creative-plan.*
└── evals/
    ├── evals.json
    └── ...
```

Keep references focused.

Avoid deeply chained reference dependencies.

SKILL.md should tell the agent exactly which reference to load under which circumstances.

---

# 17. Persistent project design context

When appropriate, establish a small project-local design context file.

It should capture:

- audience
- product purpose
- visual thesis
- interaction thesis
- typography
- palette
- layout principles
- motion vocabulary
- existing stack
- approved technologies
- anti-references
- explicit forbidden generic patterns
- accessibility constraints
- performance targets

Do not rewrite it casually.

Treat it as the project's creative constitution.

If the project already has an equivalent design document, use that rather than creating redundant files.

---

# 18. Separate design, implementation and review

Do not let the same reasoning step simultaneously:

- invent the visual idea,
- choose technology,
- implement it,
- declare it excellent.

Use explicit phases:

### DESIGN

Determine concept and experience.

### ARCHITECT

Choose rendering/motion approach.

### IMPLEMENT

Build it.

### REVIEW

Critically inspect the result as though another engineer/designer made it.

### POLISH

Fix shortcomings.

The review phase should be skeptical.

“Technically works” is insufficient.

---

# 19. Visual browser verification

For actual implementation work, do not stop at successful compilation.

Where browser tooling is available:

Run the site and inspect actual rendered output.

Check representative widths such as:

- small mobile
- large mobile
- tablet
- laptop
- large desktop

Inspect:

- hierarchy
- typography
- clipping
- overlap
- responsive composition
- hover
- focus
- scroll
- transitions
- loading
- reduced motion
- interaction timing
- visual density

For animated experiences, inspect the motion itself rather than only still screenshots.

Iterate based on the rendered result.

---

# 20. Capability honesty

Some tools are code libraries that an agent can directly implement.

Others are external visual editors or hosted services.

The skill must distinguish these.

If direct access to Figma, Hana, Spline, Cavalry, Unicorn Studio, Shaders.com or another editor is unavailable:

Do not claim to have edited it.

Instead provide or implement:

- integration code,
- asset requirements,
- scene specification,
- authoring instructions,
- export contract,
- fallback,
- exact handoff requirements

as appropriate.

Never fabricate completed visual-editor work.

---

# 21. Expert tool composition

Create explicit guidance for valid and invalid combinations.

Examples of potentially strong combinations:

```text
Next.js
+ Motion for application UI
+ GSAP for one complex narrative sequence
```

```text
Next.js
+ semantic DOM
+ Curtains.js for project-media shaders
+ Anime.js for SVG/typographic interaction
```

```text
React
+ R3F
+ Theatre.js during choreography
+ Leva during parameter tuning
```

```text
React
+ PixiJS for dense 2D scene
+ GSAP controlling high-level timeline
```

But composition must always have clearly separated ownership.

The skill must detect redundant combinations and simplify them.

---

# 22. Signature-effect rule

For high-design websites, encourage one genuinely memorable system rather than numerous disconnected effects.

Examples:

- unique project transition
- interactive spatial hero
- custom typographic behavior
- shader-driven media language
- unusual navigation model
- generative identity system
- tactile physics interaction
- stateful illustrated object

Everything else should support that system.

Do not confuse quantity of effects with quality of design.

---

# 23. Component libraries are ingredients

If using React Bits, Aceternity, Magic UI, Motion Primitives, Animate UI, Cult UI or similar:

Inspect the implementation.

Adapt it to the design system.

Change:

- timing
- geometry
- typography
- spacing
- color
- interaction logic
- context

where appropriate.

Avoid recognizable copy-paste aesthetics.

The final result should look designed for the subject, not for the library's documentation site.

---

# 24. Expert escalation

The skill must recognize when a task has exceeded normal frontend animation and requires specialized knowledge.

Examples:

- custom GLSL/WGSL
- GPU compute
- complex R3F performance
- advanced Pixi custom rendering
- Gaussian splatting
- advanced physics
- sophisticated accessibility in Canvas/WebGL
- complex shader pipelines

When an official or dedicated specialist skill is installed, activate or consult it.

If not, consult current official documentation before implementing.

Do not bluff specialist API knowledge.

---

# 25. Create deterministic checks where possible

Add scripts/checks for objective failures where feasible.

Potential checks:

- competing animation dependencies
- animation libraries already installed
- package versions
- multiple render loops
- obvious uncleaned GSAP contexts
- missing reduced-motion handling
- oversized Canvas DPR
- obvious infinite ambient animations
- known layout-property animation patterns
- duplicate animation engines serving identical concerns

Do not try to programmatically judge subjective beauty.

Use human/visual review for that.

---

# 26. Evaluation suite

Create serious evals for this skill.

Do not only test whether it activates.

Test whether its **judgment changes the outcome**.

Include at least the following scenarios.

### Eval A — ordinary SaaS settings interface

The correct response should avoid WebGL and probably avoid GSAP/Anime.js unless genuinely necessary.

### Eval B — React dashboard with component transitions

It should strongly consider Motion/native CSS before cinematic libraries.

### Eval C — experimental portfolio with orbiting draggable SVG/DOM elements

It should seriously consider Anime.js v4 rather than blindly choosing GSAP or Three.js.

### Eval D — long cinematic scroll story

It should strongly consider GSAP/ScrollTrigger.

### Eval E — responsive project grid with liquid image hover effects

It should consider VFX-JS/Curtains.js/OGL before rebuilding the page inside Three.js.

### Eval F — interactive animated mascot with multiple behavioral states

It should strongly consider Rive.

### Eval G — 500 interactive visual sprites

It should recognize PixiJS as a stronger architecture than hundreds of React nodes.

### Eval H — geometry-driven generative visualization

It should evaluate Pts.js/p5/Pixi based on production requirements.

### Eval I — genuine 3D product/world

It should justify R3F/Three.js.

### Eval J — captured real physical location

It should at least consider Gaussian splatting/Spark/SuperSplat.

### Eval K — editorial site with a hand-drawn visual language

It should consider Rough.js/SVG rather than assuming sophisticated GPU rendering.

### Eval L — user asks for "make it more dynamic"

It must not immediately add animation.

It should determine what interaction/motion actually improves the design.

### Eval M — project already uses Anime.js

It should not install GSAP merely because GSAP is more famous.

### Eval N — project already uses Motion and only requires a dropdown transition

It should use the existing system.

### Eval O — reduced-motion and low-power mobile

The experience must remain complete and intentional.

For each eval define objective assertions wherever possible.

Also define human-review criteria for:

- visual coherence
- originality
- restraint
- interaction quality
- appropriate technology choice
- perceived polish

Run comparisons:

- without skill
- with skill

and refine the skill when it fails.

---

# 27. Tool-selection scoring

Do not make selection purely keyword-based.

Build a qualitative scoring model considering:

- conceptual fit
- rendering fit
- interaction fit
- choreography fit
- React/framework fit
- existing-stack fit
- performance cost
- mobile cost
- accessibility complexity
- maintenance burden
- asset-authoring burden
- uniqueness potential

Do not simply select the highest numerical score.

Scores should structure expert judgment, not replace it.

---

# 28. Defaults with escape hatches

The skill must have sensible defaults.

For example:

- native CSS for trivial animation
- existing framework/library before adding another
- Motion for ordinary React component interaction when already appropriate
- Anime.js for suitable creative DOM/SVG/layout/drag systems
- GSAP for sophisticated choreography/ScrollTrigger
- Rive for stateful authored vector experiences
- PixiJS for dense production 2D GPU scenes
- DOM + GPU bridge for isolated shader-treated media
- R3F for genuine React-integrated 3D
- raw OGL/shaders only when lower-level control is justified

But these are defaults, not rigid rankings.

A knowledgeable agent must be permitted to override them with a concrete reason.

---

# 29. Deliverables

After research, create the complete skill directory.

Deliver:

1. final `SKILL.md`;
2. all reference files;
3. tool registry;
4. helper scripts;
5. eval suite;
6. example project-context file;
7. documentation explaining the architecture;
8. installation instructions for Claude Code;
9. installation instructions for Codex;
10. validation instructions using the Agent Skills specification;
11. an update strategy for keeping volatile tool references current.

Also produce a short design report explaining:

- what was borrowed conceptually from each researched skill;
- what was deliberately rejected;
- how our router is superior to a flat library matrix;
- how stale API knowledge is prevented;
- how tool-selection quality is evaluated.

---

# 30. Quality bar

Do not finish merely because the files exist.

The resulting skill should behave like a senior creative-development lead who has broad knowledge but exercises restraint.

A successful output should be capable of saying all of the following when appropriate:

> CSS is enough.

> Keep the existing Motion implementation.

> Anime.js is the best fit here.

> GSAP is justified because this is choreography rather than ordinary UI state.

> Preserve the DOM and move only the image surface onto the GPU.

> PixiJS is a better rendering model than React DOM for this density.

> This does require genuine 3D.

> This does not require genuine 3D.

> Rive is a better authoring model for this state machine.

> Use Spline to author the scene and integrate the output.

> Theatre.js should be used during choreography, not treated as another runtime effect library.

> This shader should be built visually first.

> This requires custom WGSL/GLSL.

> Gaussian splatting adds nothing conceptually here; don't use it.

> Remove this animation. It makes the interface worse.

The final skill must optimize for:

**taste × judgment × technical capability × restraint × production quality**

—not maximum tool usage.

Begin with the research phase. Do not write the final `SKILL.md` until you have inspected the relevant current sources and designed the architecture.
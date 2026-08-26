# Spectacle / immersive creative-development rubric (S1)

S1 measures a different ceiling from W1. A page can be a W1=4 and S1=2.

Score from rendered desktop/mobile output **and motion recording**. Code/report claims alone cannot earn a 4.

## 1. Realtime-system centrality
- **0** broken/no meaningful visual system
- **1** decorative animation layer; page remains ordinary sections
- **2** one substantial realtime effect, but peripheral to the page structure
- **3** realtime system is a major organizing element across the experience
- **4** the page itself behaves as a coherent realtime/spatial/generative visual system

## 2. Interaction causality
- **0** no meaningful interaction
- **1** hover/pointer causes cosmetic changes only
- **2** interaction affects one effect locally
- **3** user input materially changes state/composition/camera/material behavior
- **4** interaction is part of the narrative/world logic and changes what the visitor experiences

## 3. Authored continuity / acts
- **0** incoherent/broken
- **1** unrelated sections/effects
- **2** competent sections with repeated reveals
- **3** multiple authored acts connected by deliberate transitions
- **4** continuity feels cinematic/world-like; transitions carry state/material/composition forward

## 4. Graphics/material craft
- **0** visibly broken/cheap
- **1** default demo aesthetics, generic particles/orbs/materials
- **2** technically competent but recognizable stock visual language
- **3** art-directed lighting/material/type/geometry/shader behavior
- **4** distinctive graphics craft; camera/material/post/typography behave as one designed language

## 5. Original integration / component distance
- **0** component demo reel or obvious template clone
- **1** borrowed primitives dominate identity nearly unchanged
- **2** primitives fit but remain recognizable as library effects
- **3** reused primitives are materially transformed and integrated into bespoke composition
- **4** source/library provenance is visually irrelevant; the result reads as an original system
- **N/A** no catalog primitive used

## 6. Signature memory
Binary + 0–4 score:
- **0** nothing memorable
- **1** attractive detail
- **2** memorable isolated effect
- **3** describable signature moment/system tied to Meridian
- **4** a visitor could explain the site's central visual mechanic/world afterward without mentioning the library used

## 7. Mobile / capability adaptation
- **0** breaks or drops core content
- **1** desktop spectacle forced onto mobile
- **2** bluntly disables the main system
- **3** lower-cost but coherent mobile/capability recipe
- **4** mobile/fallback is intentionally art-directed and preserves the identity through a different implementation

## 8. Runtime evidence
Use `rubrics/execution_measurement.md` and motion capture.
- **0** critical runtime/a11y failure
- **1** major frame/offscreen/reduced-motion/resource problem
- **2** partially measured or material concerns remain
- **3** passes relevant runtime gates with evidence
- **4** passes gates plus demonstrates adaptive-quality/resource discipline appropriate to the renderer

## Automatic S1 caps
- No motion recording available: overall S1 median cannot exceed **3**.
- No materially interactive realtime/generative system: Realtime-system centrality ≤2 and overall S1 median ≤2.5.
- Component soup / three or more visually dominant unrelated catalog primitives: Original integration ≤1.
- Reduced-motion loses content/meaning: run fails regardless of visual score.
- Offscreen continuous loop fails M2: Runtime evidence ≤1.

## Comparative review
Pool anonymized S1 recordings across conditions. Review first 60 seconds at equal viewport and rank:
**“Which feels most like an authored interactive world I would send another creative developer?”**
Use screenshots only as a secondary first-frame check.

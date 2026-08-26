# Hidden-gem skill discovery policy

The registry is intentionally **curated, not exhaustive**. Public Agent Skills change too quickly and there is
no single authoritative registry. A future architect should periodically refresh awareness rather than hard-code
whatever was popular when this eval package was authored.

## Discovery sources

1. **First-party/vendor suites first** for selected tools (GSAP, PixiJS, Motion, React Bits, etc.).
2. **Podo design-agent-skills** as a broad design/motion/creative-3D catalogue and router:
   https://github.com/podo/design-agent-skills
3. **MengTo/Skills** for a large creative-development/web-design specialist set:
   https://github.com/MengTo/Skills
4. Targeted GitHub search for the exact capability + `SKILL.md`, especially when the need is unusual
   (raymarching, WebGPU compute, splats, shaders, generative typography, browser graphics QA).
5. Official docs when no trustworthy specialist exists.

## Candidate scoring before admission

Score 0–2 on each dimension; prioritize candidates with a clear specialist advantage.

- **Scope specificity** — solves one valuable problem vs generic prompt bundle.
- **Activation boundary quality** — clear should/should-not trigger behavior.
- **Progressive disclosure** — router/reference split instead of monolithic context dump.
- **Freshness** — recent APIs, explicit version policy, current releases.
- **Provenance** — official/vendor > maintained specialist > unmaintained community skill.
- **Executable depth** — examples/scripts/tests that help the agent actually use the tool well.
- **Visual evidence** — rendered examples/gallery/video for graphics/design skills.
- **Deterministic QA** — runtime measurements, linters, screenshots, evals, build gates.
- **Overlap cost** — adds a new capability instead of duplicating Impeccable/router/specialists.
- **Portability/security** — install behavior and tool permissions are understandable; third-party skill text is
  treated as operational supply-chain input, not trusted documentation.

## Admission classes

- **Core evaluate:** likely to change our architecture or quality ceiling; run an ablation.
- **Important research:** borrow a specific method or load on-demand for matching tasks.
- **Awareness only:** know it exists; fetch only when a real task creates the need.
- **Reject:** stale, bloated, overlapping, unverifiable, or mostly aesthetic commandments without evidence.

## Refresh trigger

Re-run discovery before:
- publishing a major architect-skill version;
- adding a new renderer/tool family;
- an S1 task whose visual requirement is not covered by the existing specialist index;
- six months after the registry snapshot date, whichever comes first.

Do not bulk-install a catalogue just to claim coverage. The goal is **discoverability**, not maximum simultaneous
prompt surface.

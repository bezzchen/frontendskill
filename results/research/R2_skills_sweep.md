# R2 — Independent Skills Sweep: Verification + Discovery

Sweep date: 2026-08-14. Registry snapshot under test: 2026-08-12 (`external_skills.json`).
Method: GitHub API (`gh api`, `gh search code/repos`), WebFetch of vendor pages, skills.sh directory, survey cross-checks. No browser pane, nothing installed. All star counts / push dates are as of 2026-08-14 UTC.

---

## 1. Verification table — all 20 registry entries

Verdicts: **VERIFIED** (exists, content matches registry description), **VERIFIED*** (matches with caveats noted), EXISTS-BUT-DIFFERENT, NOT-FOUND. None of the 20 entries came back NOT-FOUND or EXISTS-BUT-DIFFERENT. **Hit rate: 20/20 exist, 20/20 content-match (4 with caveats).**

| # | Entry | Source | Verdict | Stars | Last push | Evidence / notes |
|---|-------|--------|---------|-------|-----------|------------------|
| 1 | Impeccable | pbakaus/impeccable | **VERIFIED** | 59,150 | 2026-08-14 (release v4.1.1 same day) | Deep dive in §2. Every registry claim confirmed verbatim: P/O/R/E modes, design context (PRODUCT.md/DESIGN.md/surface briefs), anti-pattern discipline (59 deterministic detector rules), `overdrive` command, bounded visual verification ("Verify in bounded passes, not a loop"). Scope is LARGER than registry says. |
| 2 | StyleSeed | bitjaru/styleseed | **VERIFIED** | 896 | 2026-08-13 | 23 `ss-*` skills + router (`skills/`, mirrored in `engine/.claude/skills/`). Design lock ✓ ("A design lock that stops drift"), reference→grammar ✓ ("derive a local grammar from my references", 8 grammars), score+render verify ✓ (0–100 gate, revise <80, "render → score → revise loop", BENCH-V1 with 120 rendered cells). "Cinematic" confirmed present in `skills/ss-motion/SKILL.md`, `engine/RULESETS.md`, `engine/PAGE-TYPES.md`. |
| 3 | UI Craft | educlopez/ui-craft | **VERIFIED** | 265 | 2026-08-13 | 28 skills under `.agents/skills/`. Knobs confirmed: CRAFT_LEVEL / MOTION_INTENSITY / VISUAL_DENSITY (+ a newer DESIGN_VARIANCE knob). Acceptance bar = rung 3 "Enforce" (`/finalize`, review agents, MCP gates, 0–100 score, `ui-craft-detect`). Fresh-context reviewers ✓. |
| 4 | Design Motion Principles | kylezantos/design-motion-principles | **VERIFIED** | 908 | 2026-05-30 (~2.5 mo quiet) | Single skill + create/audit workflows ✓ + per-designer references: `emil-kowalski.md`, `jakub-krehel.md`, `jhey-tompkins.md` — exactly the registry's "tension between restraint, production polish, experimentation". NOTE: its Emil content is a second-hand distillation; see §3 and overlap B. |
| 5 | MengTo WebGL Landing Steering | MengTo/Skills @ `agent-skills/web-design/webgl-landing-steering` | **VERIFIED** | 4,769 (repo) | 2026-08-14 | Path exists (SKILL.md + REFERENCES.md + demo). Content = intent→lane mapping: Lane A subtle depth, Lane B data/particles, Lane C object-centric 3D (+ cinematic lane), device mix, reduced-motion, complexity budget — matches registry claims exactly. |
| 6 | MengTo Build Awwwards Quality Sites | MengTo/Skills @ `agent-skills/web-design/build-awwwards-quality-sites` | **VERIFIED** | — | 2026-08-14 | Path exists (SKILL.md + agents/). Visual thesis before code ✓, hero focal asset ✓, motion narrative ✓, Three/shader decision + fallbacks + static first frame ✓. Also honest-asset provenance rules the registry didn't mention. Repo has **127 SKILL.md files total** — far more minable than the 2 registered (threejs-weather, vantajs, webgl-laser, cinematic-gsap-lenis-motion-system, build-threejs-scroll-worlds, dither/particle background packs…). |
| 7 | Three.js Awesome Graphics Agent Skills | scottstts/Threejs-Awesome-Graphics-Agent-Skills | **VERIFIED** | 597 | 2026-08-14 | 24 skills incl. router + `threejs-visual-validation`, camera-direction, procedural-materials/vfx, atmosphere-aerial-perspective, bloom/SSAO/exposure-color-grading, volumetric-clouds, spectral-ocean. Ships real assets (.exr/.bin LUTs) and full TS/GLSL example source — genuinely "not an API cheat sheet". |
| 8 | WebGPU Three.js TSL | dgreenheck/webgpu-claude-skill | **VERIFIED*** | 1,143 | 2026-04-10 (~4 mo stale) | `skills/webgpu-threejs-tsl/`: SKILL.md, REFERENCE.md, 7 docs (compute, TSL materials, WGSL integration, post-processing, device-loss), 5 examples, 2 templates. Matches all registry claims. Caveat: 4 months without commits against a fast-moving TSL API; freshness should be re-checked at adoption. Credibility signal: mirrored in JetBrains/skills curated collection. |
| 9 | Official GSAP Skills | greensock/gsap-skills | **VERIFIED** | 13,597 | 2026-07-29 | 8 skills: gsap-core, -timeline, -scrolltrigger, -react, -plugins, -performance (+ -frameworks, -utils beyond registry's list) + llms.txt. First-party GreenSock/Webflow. |
| 10 | Official PixiJS Skills | pixijs/pixijs-skills | **VERIFIED*** | 311 | 2026-06-04 | First-party. ~20 skills incl. pixijs-migration-v8 (migration protection ✓), -accessibility, -performance, -custom-rendering, renderer references (WebGL/WebGPU ✓). Caveat: no literal "router" skill; entry points are pixijs-create/core-concepts — registry's "v8-specific router" is a loose but fair description. |
| 11 | Motion AI Kit | motion.dev/ai-kit | **VERIFIED*** | n/a (not a repo) | current | Page live: MCP + `/motion` skill installer (`npx motion-ai`) for Claude Code/Cursor/Amp/OpenCode/Gemini/Copilot; 430+ AI-ready examples; MotionScore performance profiling ✓; Motion UI retrieval ✓; CSS spring generation. Caveat: **paywalled** (included with Motion+, £299/yr personal) — skill internals could not be inspected; claims are vendor marketing. |
| 12 | React Bits Pro Agent Skill | pro.reactbits.dev/docs/skills | **VERIFIED*** | n/a | current (2026 site, active changelog) | Registry URL now shows nav only; actual doc moved to `/docs/agent-kit/agent-skill`. Skill exists, vendor-maintained, installs via `npx shadcn@latest add @reactbits-starter/skill`, "included with every plan". Component-category claims (backgrounds/3D/shaders/cursor) not itemized on the public page — behind Pro. Update registry URL. |
| 13 | Podo Design Agent Skills Catalogue | podo/design-agent-skills | **VERIFIED*** | **3** | 2026-07-20 | Real and substantial despite 3 stars: **157 SKILL.md stubs** (README says 151 skills), install profiles (Picks 24 / Essentials 92 / All 151), `npx design-agent-skills` CLI, upstream-check CI workflow. "Large curated catalogue, discovery-only" claim is accurate. Caveats: near-zero adoption signals, unknown maintainer provenance, and its installer is third-party supply chain — keep discovery-only. Its "Picks" independently include taste-skill, ui-craft, gsap-skills — cross-validates registry choices. |
| 14 | Hallmark | Nutlope/hallmark | **VERIFIED** | 24,899 | 2026-08-06 | `skills/hallmark/` with anti-patterns.md + component cookbook of named structural variants (h1–h9 heroes, n1–n11 navs, f1–f6 features, ft1–ft8 footers…) — precisely "anti-slop structural variety / design-DNA". Maintainer Nutlope (Hassan El Mghari, well-known OSS author). |
| 15 | Motion Site Builder | kenzofujimoto/agent-skills | **VERIFIED*** | **0** | 2026-07-15 (created+pushed same day, no activity since) | `skills/motion-site-builder/` real, with recipes/. Description = "selecting the correct motion architecture per section: CSS/DOM, Motion, GSAP, framed media, 2.5D, video scrubbing, Three.js/R3F, Rive, Lottie, shaders…" — the registry's "lightest-sufficient engine and section-level architecture" is accurate. Caveats: zero adoption, single-day repo, and it hard-couples to companion skills `ui-ux-pro-max` and `scroll-world-browser`. Lineage-reference only, as registered. |
| 16 | Design Builder | app-builders-club/design-builder | **VERIFIED** | 4 | 2026-07-07 | Claude plugin: commands (`/setup /start /design_page /design_screen /build /improve /review`) + design-auditor agent + knowledge-base skill with CSV data (colors, fonts, stacks incl. iOS). Three-layer commands→filters→knowledge model = the registered "design/spec/implementation/review separation". Also carries Emil/Jakub/Jhey motion perspectives (overlap B). |
| 17 | Anthropic frontend-design | anthropics/skills | **VERIFIED** | 169,417 (repo) | 2026-08-13 | `skills/frontend-design/SKILL.md` exists. Impeccable's own README acknowledges it as its starting point, consistent with registry's "design lineage; Impeccable richer". |
| 18 | CloudAI-X Three.js Skills | CloudAI-X/threejs-skills | **VERIFIED** | 2,982 | 2026-07-09 | Exactly 10 fundamentals skills (fundamentals, geometry, materials, textures, lighting, animation, interaction, loaders, shaders, postprocessing). No repo description. "Fallback technical coverage" framing is right. |
| 19 | Awwwards-3D | tsogjavklann/awwwards-3d | **VERIFIED** | 8 | 2026-05-08 (dormant since creation day) | Single root SKILL.md + examples (36 blobs). Description self-declares the pin: "Three.js r170 + GSAP + Lenis". Registry's "version-pinned patterns; visual reference, not current API authority" caution is exactly right. |
| 20 | Claude Design Skillstack | freshtechbro/claudedesignskills | **VERIFIED*** | 722 | **2025-11-20 (~9 months stale)** | Broad collection confirmed (aframe-webxr, animejs, babylonjs, react-three-fiber, pixijs-2d, animated-component-libraries w/ React Bits + Magic UI references, 1000+ files, zips + python scaffolds). Caveat: the ONLY registry entry that is materially stale; its React Bits/library references now duplicate fresher vendor skills. Candidate for demotion toward reject. |

**Freshness overview:** 13/18 GitHub entries pushed within the last 6 weeks; kylezantos ~2.5 mo, dgreenheck ~4 mo, awwwards-3d dormant 3 mo, kenzofujimoto dormant 1 mo (0★), freshtechbro 9 mo.

---

## 2. Deep dive: pbakaus/impeccable

**What it is.** A monorepo shipping ONE consolidated skill (`impeccable`) with 23 sub-commands, plus a CLI, a Chrome devtools extension, hooks, and tests. 59,150★, created 2025-11-16, Apache 2.0.

**Maintenance.** Extremely active, effectively daily: skill v4.1.1 + CLI v3.6.0 + extension v1.3.2 all released 2026-08-14 (sweep day); PR numbers in the #580s. Maintainer: **Paul Bakaus** (1,207 commits; paulbakaus.com — jQuery UI creator, ex-Google). Secondary contributor abdulwahabone (61), dependabot, ~10 small community contributors, plus a GitHub Action that syncs generated per-provider output. Single-maintainer-dominant but with real CI, release discipline, and 588+ merged PRs.

**Actual structure** (canonical source `skill/`, compiled and mirrored into 18 harness dirs — .claude, .cursor, .agent(s), .gemini, .github, .grok, .kiro, .opencode, .pi, .qoder, .rovodev, .trae, .trae-cn, .vibe, plugin/…):
- `skill/SKILL.src.md` — 85-line router with YAML frontmatter, commands table, routing rules
- `skill/reference/` — **35 playbooks** (one per command + craft-floor.md quality floor, routing.md, new-work.md, hooks.md, doctor.md, native variants audit.native.md/adapt.native.md, ios.md, android.md, live-setup.md)
- `skill/agents/` — 4 subagents: asset-producer, documenter, finish-reviewer, manual-edit-applier (+ degraded fallbacks)
- `skill/scripts/` — ~87 files: context.mjs session loader, deterministic detector (detect.mjs), hook.mjs / hook-before-edit.mjs, live-mode server, image generation (generate-image.mjs), design-parser, concept/composition catalogs
- `cli/` (npm `impeccable`): `npx impeccable detect src/ | file | URL` — **59 deterministic detector rules with no LLM/API key**, JSON CI output, ignore management, Puppeteer URL scanning
- `extension/` Chrome devtools; `tests/` incl. 264 framework fixtures, live-e2e, skill-behavior tests; `demos/landing-demo`

**Modes — registry claim confirmed verbatim.** SKILL.src.md defines **Persuade / Operate / Read / Experience** chosen per-surface ("A tool's landing page is still Persuade; a fashion house's documentation is still Read"), persisted in surface briefs.

**Other registry claims, confirmed:**
- *Design context & anti-pattern discipline*: `init` → PRODUCT.md + DESIGN.md + per-surface briefs; `doctor` repairs drift; "never repair drift as a side effect"; detector hooks auto-run after UI edits (Claude/Copilot/Codex/Cursor/Grok manifests).
- *Ambitious effects / overdrive*: `overdrive` = "Push past conventional limits… technically extraordinary effects".
- *Bounded visual verification*: "Build fully, inspect once with a batched round (desktop+mobile), fix in one batch, confirm with at most one more round, and stop polishing. Open-ended self-QA burns the user's money."

**Real scope vs registry framing — broader than registered:**
1. **Native mobile**: iOS/Android reference playbooks + native audit/adapt variants (registry frames it web-only).
2. **Live browser iteration**: `live` visual-variant mode with its own local server, element picking, manual-edit application.
3. **Comp-first build path**: optional image-generation comp before code (`buildPath: comp|code`) — an art-direction workflow the registry doesn't mention.
4. **Deterministic tooling standalone**: CLI + extension run without any agent, usable as an eval-side gate.
5. **Multi-harness distribution** across 14+ tools.

**Boundary assessment for the architect:** the registered boundary (Impeccable owns visual thesis/hierarchy/typography/layout/polish; architect owns rendering/graphics architecture + specialist routing) is workable, but two friction points must be pinned: (a) `overdrive` reaches into spectacle-effects territory the architect's S1/spectacle router also claims; (b) `animate` overlaps motion specialists. Recommend: architect owns renderer/library selection and 3D pipeline architecture; Impeccable owns surface-level direction and polish; `overdrive`/`animate` allowed only when the architect has not routed to a specialist.

---

## 3. Deep dive: emilkowalski/skills — the suspected hidden gem is real

**Repo:** `emilkowalski/skills` — "Skills for Designers and Engineers." **29,297★**, created 2026-03-16, last push 2026-08-13 (README), last skill added 2026-08-10. LICENSE file present (type not inspected). Listed on skills.sh with the repo's own badge. Install: `npx skills@latest add emilkowalski/skills`.

**Identity confirmed:** same account owns `sonner` (12,843★, "An opinionated toast component for React") and `vaul` (8,552★, drawer). README links animations.dev (his course) and states the skills distill his Vercel/Linear experience; the `ask-sonner` skill calls Sonner "my toast library". This is first-party Emil Kowalski, not a fan distillation.

**Exactly 10 skills** (flat `skills/` dirs, each SKILL.md + optional references):

| Skill | Role | Depth notes |
|---|---|---|
| emil-design-eng | The main skill: UI polish + animation philosophy | 674 lines |
| animate | Build one animation from scratch; ordered decision sequence (should it animate at all → purpose → tool → properties → curve/duration → interruption → exit) | 199 lines + RECIPES.md; frequency gate table ("100+ times/day → No animation. Ever."), purpose taxonomy, "No approximated values — every curve/duration from the tables" |
| review-animations | Strict motion review; "Default to flagging; approval is earned" | + STANDARDS.md (187 lines); `disable-model-invocation: true` |
| improve-animations | Codebase-wide motion audit → prioritized self-contained plans for cheaper executor agents | + AUDIT.md + PLAN-TEMPLATE.md |
| find-animation-opportunities | Read-only sweep for missing motion, with explicit what-NOT-to-animate | proposes exact values, never implements |
| animation-vocabulary | Reverse-lookup glossary: vague description → precise term | prompting aid |
| apple-design | Apple's fluid-interface principles (WWDC talks, chiefly Designing Fluid Interfaces 2018) translated to web (CSS, Pointer Events, rAF, springs) | |
| pick-ui-library | Curated, opinionated library picker (toasts, OTP, charts, dnd, virtualization…) | `disable-model-invocation: true`; refreshed Jul 2026 (Base UI over Radix) |
| prototype | Build N genuinely different variants behind a live picker/switcher | + PICKER.md; explicit-invoke only |
| ask-sonner | First-party Sonner guide + API.md prop tables + common failure fixes | added 2026-08-10 |

**Craft assessment:** this is reference-grade skill authoring. Every description states both trigger AND anti-trigger with cross-references to sibling skills ("For critiquing existing motion use review-animations; for auditing a whole codebase use improve-animations"); menu-like skills are marked `disable-model-invocation`; progressive disclosure via companion files; the audit→plan→cheap-executor pattern in improve-animations is an architecture idea worth stealing wholesale. Weaknesses: no scripts/deterministic gates, no rendered gallery in-repo (evidence lives on animations.dev/emilkowal.ski), web/React-leaning.

**Freshness:** 15+ commits Jul 11 → Aug 10, 2026; four of ten skills added in the last month (find-animation-opportunities, pick-ui-library, prototype, animate, ask-sonner). Actively growing.

**Registry status: MISSING — and the registry currently includes a second-hand Emil instead.** `kylezantos/design-motion-principles` (registered core_evaluate) distills Emil's *published* work into `references/emil-kowalski.md`; the first-party source is richer, fresher, and maintained by the person himself. Recommendation: **admit emilkowalski/skills as core_evaluate** (motion-taste + motion-review lane), and re-scope design-motion-principles to what it uniquely adds (Jakub Krehel + Jhey Tompkins perspectives and the context-weighting frame) or drop it after ablation.

Score (policy dims, 0–2): scope 2 · activation 2 · disclosure 2 · freshness 2 · provenance 2 · executable depth 1 · visual evidence 1 · deterministic QA 1 · overlap cost 1 · portability 2 = **16/20 → core_evaluate**.

---

## 4. New candidates found (hidden-gem hunt)

Sources swept: skills.sh directory, GitHub code search (`filename:SKILL.md` × three.js/webgpu/glsl/awwwards/lenis/r3f/p5.js/visual-regression), repo search, June-2026 survey (ruoqijin.com), Composio roundup, podo Picks cross-check. Scores are policy dims 0–2, total /20.

### Tier: core_evaluate candidates

**C1. emilkowalski/skills — 16/20 — core_evaluate.** See §3.

**C2. Leonxlnx/taste-skill — 13/20 — core_evaluate (as ablation rival to Impeccable).**
76,568★ (largest star count of ANY anti-slop skill found), pushed 2026-07-23; skills.sh shows 360K installs (design-taste-frontend) + 271K (high-end-visual-design). 13 skills: taste-skill (main, aka `design-taste-frontend`), high-end-visual-design, redesign-skill, image-to-code, brandkit, brutalist/minimalist/soft variants, imagegen-frontend-web/mobile, stitch, gpt variant. Main skill is explicitly scoped: "Landing pages, portfolios, and redesigns. Not dashboards, not data tables" — brief-inference first ("Read the Room"), mandatory one-line "Design Read" before code, audience-picks-the-aesthetic rule, constraint-override list. Scores: scope 2, activation 2, disclosure 1 (large single files, contextually gated), freshness 2, provenance 1 (individual, but massive adoption), exec depth 1, visual 1, QA 1 (pre-flight check is textual), overlap 0 (head-on with Impeccable/hallmark/ui-craft), portability 2. The registry's anti-slop lane cannot claim completeness while omitting the most-adopted anti-slop skill; evaluate it head-to-head with Impeccable on S-tier landing tasks.

**C3. vercel-labs/agent-skills → `web-design-guidelines` — 15/20 — core_evaluate (reviewer lane).**
30,036★, pushed 2026-08-12, Vercel official; skills.sh shows 542.8K installs — the most-installed design skill after anthropics/frontend-design. It is a *quality gate, not a generator*: fetches the latest Web Interface Guidelines from source at review time (always-current by construction), audits files, outputs terse `file:line` findings. Scores: scope 2, activation 2, disclosure 2, freshness 2, provenance 2, exec depth 1, visual 0, QA 1, overlap 1 (complements directors; partially overlaps ui-craft gates/Impeccable audit), portability 2. Cheap to adopt, zero art-direction opinion, pairs with any director. Same repo also has `react-view-transitions` and `composition-patterns` (React-perf composition rules) worth awareness.

### Tier: important_research

**C4. heygen-com/hyperframes — 17/20 raw, admitted as important_research (lane fit).**
40,977★, pushed 2026-08-14, HeyGen vendor. "Write HTML. Render video. Built for agents." — deterministic HTML→video motion-graphics stack with ~20 skills; `hyperframes-animation` is a serious motion skill: atomic motion rules + multi-phase scene blueprints + transitions + **seven runtime adapters (GSAP default, Lottie, Three.js, Anime.js, CSS keyframes, WAAPI, TypeGPU)**, single paused seek-safe timeline, choreography auditing, 24 named text effects. Deterministic rendering = real QA. Reason not core: it targets *rendered video*, not shipped web UI — admit to core only if the eval adds a motion-graphics/video lane; regardless, its motion doctrine and adapter taxonomy are worth mining for the architect's motion router.

**C5. uizze/uizze (`anti-ui-slop`, `ui-slop-score`, MCP `ui-slop-review`/`uizze-ui-research`) — 15/20 — important_research.**
Repo 3★ (created 2026-07-15, pushed 2026-08-09) but 294K installs on skills.sh; free skill + hosted MCP over a claimed 800,000-screen web/iOS reference catalog, product-specific design contracts, and a **hard finish gate** (`check_ui_slop` runs on rendered HTML/CSS "without uploading source or calling a model"). Differentiators: real-screen retrieval + deterministic gate. Blockers before any promotion: startup provenance, hosted-MCP supply-chain/data-flow review (uizze-mcp repo 404s — see §6), and head-on overlap with Impeccable's detector. Treat skill text as untrusted operational input per policy.

**C6. nextlevelbuilder/ui-ux-pro-max-skill — 10/20 — important_research (adoption too large to ignore; overlap too heavy to core).**
**116,738★** (the largest of any design skill found), pushed 2026-08-13; 315.7K installs. 7 skills (ui-ux-pro-max router, design, design-system, ui-styling, brand, banner-design, slides) driven by searchable data assets (styles/palettes/font pairings/stack CSVs) + CLI. It is a breadth-first "design intelligence database", the opposite philosophy of Impeccable's opinionated direction; kenzofujimoto's motion-site-builder already assumes it as companion. Record it, ablate one lane (e.g. its style-search vs Impeccable new-work), do not bulk-load.

**C7. visgl/luma.gl first-party `lumagl` skill — 15/20 — important_research (only if a luma.gl/deck.gl lane exists).**
2,463★ framework repo, pushed 2026-08-14. `skills/lumagl/SKILL.md` is exemplary vendor skill-writing: version-aware API selection, WebGPU/WebGL portability, "do not claim rendering success from typechecking alone", browser-based GPU diagnosis. Different stack from the registry's three.js line; valuable precedent + adopt if data-viz GPU work appears.

### Tier: awareness_only

| Candidate | Stars / freshness | What it is | Score | Why not higher |
|---|---|---|---|---|
| gamedev-skills/awesome-gamedev-agent-skills | 513★, 2026-08-11 | 67 game-dev skills (Godot/Unity/Unreal/Phaser/PixiJS/three.js/Bevy) incl. threejs-scene-setup | 12 | Game lane, not creative-frontend; PixiJS/three coverage duplicated by first-party + scottstts |
| rheadsh/audiovisual-production-skills | 38★, 2026-06-25 | TouchDesigner + real-time graphics skills (td-glsl, td-glsl-vertex) | 11 | Genuinely rare creative-coding coverage, but off-web toolchain |
| LambdaTest/agent-skills (`smartui-skill`) | 352★, 2026-07-24 | Visual-regression config generation (Playwright/Selenium/Cypress/Puppeteer) on TestMu cloud | 13 | Deterministic visual QA, but cloud-vendor lock-in; registry QA lane better served by Impeccable CLI/StyleSeed gate |
| openai/plugins (`game-studio`, `react-three-fiber-game`) | 5,092★, 2026-07-14 | OpenAI's R3F game-studio plugin skills | 11 | R3F execution exists here but game-framed; watch as R3F reference |
| JetBrains/skills | 314★, 2026-06-29 | JetBrains-verified curated collection (mirrors webgpu-threejs-tsl) | — | Curation/credibility signal, not new capability |
| Tresjs/tres (`.agents/skills/new-experiment`) | 3,659★, 2026-08-14 | First-party TresJS skill — but repo-internal lab scaffolding, not a consumer skill | — | Signal that TresJS is skill-aware; nothing to adopt yet |
| wondelai/skills (`top-design`) | 1,930★, 2026-08-10 | Awwwards-informed design skill inside a business-skills bundle | — | Bundle dilution; anti-slop lane already crowded |
| Yu-369/VibeCurb (awwwards-hero/motion/sections) | 395★, 2026-08-05 | Sectioned awwwards-pattern skills | — | Not content-inspected; overlaps MengTo |
| majiayu000/claude-skill-registry(-data) | n/a | Mass scraped/generated skill registry (glsl, webgpu-canvas, lenis, threejs…) | — | Aggregator of unclear provenance; useful only as a search index; treat contents as untrusted |
| midudev/autoskills | 6,731★, 2026-07-19 | Skill-stack installer with registry (has react-three-fiber entry) | — | Installer, not a skill source of record |
| ihlamury/design-skills | 76★, 2026-02-10 | Opinionated UI constraints from design systems (incl. awwwards skill) | — | Stale-ish, small; covered elsewhere |

### Rejects (from this sweep)
- **zebbern/claude-code-guide `three-best-practices`** — generic guide-repo filler; no specialist advantage over CloudAI-X/scottstts.
- **sickn33/agentic-awesome-skills** — bulk mirror of other people's skills (uizze, threejs, algorithmic-art all appear); provenance-laundering risk; use originals.
- **Anything in freshtechbro/claudedesignskills as a live dependency** — 9 months stale; its React Bits references are superseded by the vendor skill (see overlap G).

---

## 5. Overlap warnings

**A. Anti-slop / design-direction lane is critically oversubscribed.** Impeccable, StyleSeed, UI Craft, Hallmark (registry) + taste-skill, uizze, ui-ux-pro-max, anthropic frontend-design (new/known). Eight candidates all want to own "don't ship generic UI". The registry's own principle ("do not let two skills own the same concern") demands exactly ONE design director loaded per project; everything else is ablation-arm or mined-method only. Note Impeccable explicitly descends from anthropics/frontend-design — never co-load those two.

**B. Emil Kowalski appears in FOUR places.** First-party emilkowalski/skills; distilled in kylezantos/design-motion-principles (`references/emil-kowalski.md`); distilled again in app-builders-club/design-builder ("designer motion perspectives (Emil/Jakub/Jhey)"); echoed in Impeccable's animate rules (e.g. bounce-easing bans match his philosophy). If emilkowalski/skills is admitted, the other Emil distillations become redundant for Emil content specifically — keep kylezantos only for Jakub/Jhey + register-weighting, or drop.

**C. Motion execution: who writes the tween?** GSAP official skills, Motion AI Kit, emil `animate`, Impeccable `animate`, hyperframes adapters, ui-craft `/animate`. Resolution consistent with registry principles: architect routes → first-party library skill executes (GSAP/Motion) → emil/review-animations sets the taste bar and reviews. Impeccable `animate` and ui-craft `/animate` must be disabled or deferred when a vendor motion skill is loaded.

**D. Spectacle/WebGL routing has three would-be owners.** The architect's planned spectacle router, MengTo `webgl-landing-steering` (lane A–D mapping), kenzofujimoto motion-site-builder (section-level engine selection), and Impeccable `overdrive` all decide "how ambitious and with which renderer". Pin: architect owns the routing decision; MengTo/kenzofujimoto are research inputs to that router (as registered); `overdrive` fires only post-routing within the chosen surface.

**E. Deterministic visual QA: five competing gate systems.** Impeccable (59-rule detector + bounded passes + hooks), StyleSeed (74 rules, ≥80 score gate + rendered verification), UI Craft (`ui-craft-detect`, MCP/CI gates, 0–100), uizze (hard finish gate + `check_ui_slop`), vercel web-design-guidelines (rule audit). Two scoring gates in one pipeline will fight each other and burn tokens. Choose ONE enforced gate (Impeccable's detector is the most deterministic and harness-integrated; StyleSeed's is the only benchmarked one — BENCH-V1) plus at most one lightweight reviewer (vercel) in CI.

**F. Three.js execution stack (registry-internal, still fine).** scottstts (visual craft) vs CloudAI-X (fundamentals) vs dgreenheck (WebGPU/TSL) vs freshtechbro (stale broad) — the registered separation holds, but freshtechbro adds nothing the other three don't do better/fresher; demote toward reject.

**G. React Bits double coverage.** freshtechbro's `animated-component-libraries` (react_bits_components.md, 2025-vintage) duplicates the current first-party React Bits Pro skill. Prefer vendor; treat freshtechbro copy as stale.

**H. Screenshot/comp-to-code triplication.** leonxlnx `image-to-code` vs design-builder's mandatory HTML-preview flow vs Impeccable's comp-first build path — three different comp-to-code philosophies; don't co-load.

---

## 6. What I could not verify

1. **Motion AI Kit internals** — paywalled behind Motion+ (£299/yr). Only marketing-page claims verified (MCP + /motion skill + MotionScore + 430 examples). No way to inspect skill text, freshness cadence, or token cost without a license.
2. **React Bits Pro skill internals** — behind Pro plan; only existence, install path (`npx shadcn@latest add @reactbits-starter/skill`), and vendor maintenance verified. Registry's per-category coverage claims (backgrounds/3D/shaders/cursor) are plausible from the free tier's catalog but not confirmed for the skill itself. Registry URL should change to `/docs/agent-kit/agent-skill`.
3. **podo provenance** — the org behind podo/design-agent-skills is unidentified; 3 stars, no adoption signals, yet 157 stubs + CI automation + an npm installer. Content verified; trustworthiness of the installer NOT verified. Keep discovery-only; do not run `npx design-agent-skills` in a trusted environment without review.
4. **skills.sh install counts** (778K frontend-design, 542K web-design-guidelines, 360K taste-skill, 294K anti-ui-slop, 315K ui-ux-pro-max…) — directory-self-reported; used as relative popularity signal only.
5. **uizze-mcp repo** — 404 (renamed or taken private since the search index saw it); the MCP-side skills exist inside uizze/uizze `integrations/mcp/`. The hosted MCP's data handling is unaudited.
6. **Exhaustiveness of catalogs** — MengTo's 127 skills and podo's 157 stubs were spot-checked (registry-referenced paths + samples), not fully audited.
7. **kylezantos "context-weighted" mechanics** — structure verified (create/audit workflows, three designer references, anti-checklist); the weighting logic's full text was not read.
8. **GitHub code search limits** — indexes default branches only, rate-limited mid-sweep (p5.js/visual-QA queries ran once each); niche gems may remain undiscovered. Broad `SKILL.md motion`/`SKILL.md design` queries were not exhaustively paged.
9. **Star counts as quality** — several entries (Impeccable 59K, taste-skill 76K, ui-ux-pro-max 116K) show star velocities consistent with viral listicle traffic; stars were treated as adoption signal only — craft was assessed from content.

---

## Appendix: raw metadata snapshot (2026-08-14)

| Repo | Stars | Created | Pushed |
|---|---|---|---|
| pbakaus/impeccable | 59,150 | 2025-11-16 | 2026-08-14 |
| bitjaru/styleseed | 896 | 2026-04-07 | 2026-08-13 |
| educlopez/ui-craft | 265 | 2026-03-19 | 2026-08-13 |
| kylezantos/design-motion-principles | 908 | 2026-01-14 | 2026-05-30 |
| MengTo/Skills | 4,769 | 2026-02-03 | 2026-08-14 |
| scottstts/Threejs-Awesome-Graphics-Agent-Skills | 597 | 2026-06-19 | 2026-08-14 |
| dgreenheck/webgpu-claude-skill | 1,143 | 2026-01-23 | 2026-04-10 |
| greensock/gsap-skills | 13,597 | 2026-03-04 | 2026-07-29 |
| pixijs/pixijs-skills | 311 | 2026-04-01 | 2026-06-04 |
| podo/design-agent-skills | 3 | 2026-05-22 | 2026-07-20 |
| Nutlope/hallmark | 24,899 | 2026-04-27 | 2026-08-06 |
| kenzofujimoto/agent-skills | 0 | 2026-07-15 | 2026-07-15 |
| app-builders-club/design-builder | 4 | 2026-04-16 | 2026-07-07 |
| anthropics/skills | 169,417 | 2025-09-22 | 2026-08-13 |
| CloudAI-X/threejs-skills | 2,982 | 2026-01-19 | 2026-07-09 |
| tsogjavklann/awwwards-3d | 8 | 2026-05-08 | 2026-05-08 |
| freshtechbro/claudedesignskills | 722 | 2025-10-25 | 2025-11-20 |
| **emilkowalski/skills** | **29,297** | 2026-03-16 | 2026-08-13 |
| Leonxlnx/taste-skill | 76,568 | 2026-02-19 | 2026-07-23 |
| vercel-labs/agent-skills | 30,036 | 2025-12-08 | 2026-08-12 |
| heygen-com/hyperframes | 40,977 | 2026-03-10 | 2026-08-14 |
| nextlevelbuilder/ui-ux-pro-max-skill | 116,738 | 2025-11-30 | 2026-08-13 |
| uizze/uizze | 3 | 2026-07-15 | 2026-08-09 |
| visgl/luma.gl | 2,463 | — | 2026-08-14 |

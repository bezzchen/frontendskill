# R3 — Creative Component Library Sweep: Verification + Discovery

Sweep date: 2026-08-14. Methods: curl (status + llms.txt + registry-JSON probes), GitHub API via `gh` (pushed_at, stars, license, repo trees), WebFetch, WebSearch. No browser pane, nothing installed. Registry under test: `/Users/bezzchen/Downloads/component_libraries.json` (snapshot 2026-08-12).

Legend: "pushed" = GitHub repo last push. "MIT+CC" = MIT + Commons Clause (free to use inside products; cannot resell the components as components).

---

## 1. Verification table (registry entries)

| Entry | Site | Maintained? | agent_source claim | License / free-pro split | Framework | Verdict |
|---|---|---|---|---|---|---|
| **React Bits** (reactbits.dev) | 200 OK | Yes — DavidHDev/react-bits, 45,504 stars, pushed **2026-08-14 (today)** | **Real but moved.** `pro.reactbits.dev/docs/skills` 301→ `/docs/agent-kit`. Actual skill page: `/docs/agent-kit/agent-skill`. Install: `npx shadcn@latest add @reactbits-starter/skill`; "included with every plan" (Pro tiers). Agent Kit also ships 8 design skills + 8 industry prompts. | Free catalog **MIT+CC** (4 variants: JS/TS × CSS/Tailwind, all free). Pro = paid one-time (blocks, app UI, templates, agent skills). | React only; component deps vary (gsap, motion, three, **ogl**) | **Verified.** Update agent_source URL to `/docs/agent-kit`. |
| **Aceternity UI** (ui.aceternity.com) | 200 OK | **Opaque** — no public GitHub repo found (closed-source, site-distributed). llms.txt lists recent components (webcam-pixel-grid, text-flipping-board, squiggly-text) ⇒ actively growing, but no dateable public signal. | (no agent_source claimed) | Free components on site + per-component license terms; Pro at `ui.aceternity.com/pro` (pro.aceternity.com redirects there) — paid templates/blocks | React/Next + Tailwind + motion | **Verified with caveat**: maintenance not independently dateable. |
| **Magic UI** (magicui.design) | 200 OK | Yes — magicuidesign/magicui, 21,957 stars, MIT, pushed 2026-08-11 | (none claimed — but should be: **official MCP exists**, `@magicuidesign/mcp` v2.0.0, npm 2026-03-09) | MIT free catalog; Magic UI Pro = paid templates | React + Tailwind + motion | **Verified.** Registry under-sells it: add MCP as agent_source. |
| **Animate UI** (animate-ui.com) | 200 OK (/docs works) | **Weakest of tier** — imskyleen/animate-ui, 4,154 stars, pushed **2025-12-31 (~7.5 mo stale)**. Site registry (417 KB) still served; site may build from private source. | (none claimed) | **MIT+CC**, not plain MIT — registry's "open source-distribution model" is overstated | React + Tailwind + Motion | **Partially verified.** Maintenance flag; llms.txt 404. |
| **Motion Primitives** (motion-primitives.com) | Exists; **429 Vercel bot-checkpoint** on all paths from this IP (not absence) | Yes-ish — ibelick/motion-primitives, 5,965 stars, MIT, pushed 2026-03-19 (~5 mo). README: "in beta". Registry build CI present (`pr-registry-build.yml`). | (none claimed) | MIT free; Pro tier exists on site (unverified detail — blocked) | React + Motion | **Verified via GitHub.** Site hostile to non-browser fetchers — implementation-time agents may 429. |
| **SmoothUI** (smoothui.dev) | 200 OK | Yes — educlopez/smoothui, 907 stars, MIT, pushed **2026-08-14 (today)**, tagged releases (cli-v1.1.2, 2026-08-03) | Registry's "AI-readable registry/API" claim is **true and understated** — see matrix: llms.txt + llms-full.txt + llms-components.json + a registry item that installs a **Claude skill** (`SKILL.md → .claude/skills/smoothui/SKILL.md`) | MIT, fully free | React + Tailwind + Motion + GSAP | **Verified.** Best agent-readiness of the entire sweep. |
| **Cult UI** (cult-ui.com) | Exists; **429 bot-checkpoint** from this IP | Yes — nolly-studio/cult-ui, 6,045 stars, MIT, pushed 2026-07-22 | (none claimed) | MIT free components; CULT PRO (pro.cult-ui.com) paid full-stack blocks | React/Next + Tailwind | **Verified via GitHub.** Note direction drift: repo energy is pivoting to AI-SDK agent templates (aisdkagents.com); the metal/dither/canvas niche persists but isn't the growth area. |

Registry-JSON spot checks that returned valid shadcn-schema JSON: `reactbits.dev/r/SplitText-TS-CSS` (5.8 KB, gsap deps), `ui.aceternity.com/registry/vortex.json` (7.8 KB), `magicui.design/r/registry.json` (108 KB) + `/r/globe.json`, `animate-ui.com/r/registry.json` (417 KB), `smoothui.dev/r/registry.json` (1.4 MB), motion-primitives `public/c/*.json` (in-repo, e.g. border-trail.json), cult-ui `apps/www/public/r/*.json` (in-repo, e.g. bg-animated-fractal-dot-grid.json).

---

## 2. Agent-readiness matrix

"Skill" = vendor-authored agent skill. Ranked roughly by implementation-time usability for an agent.

| Library | llms.txt | shadcn registry JSON | MCP | CLI | Vendor skill | Copy-paste docs |
|---|---|---|---|---|---|---|
| **SmoothUI** | ✅ llms.txt **+ llms-full.txt + llms-components.json**, per-component install commands inline | ✅ `smoothui.dev/r/{name}.json` (+ full registry.json) | — | shadcn (+ own cli releases) | ✅ **Claude SKILL.md installable from the registry itself** (`/r/skill.json` → `.claude/skills/smoothui/`) | ✅ |
| **Magic UI** | ✅ (32 KB) | ✅ full `/r/registry.json` + per-component | ✅ **official** `@magicuidesign/mcp` 2.0.0 | shadcn; `@magicuidesign/cli` (legacy) | — | ✅ |
| **React Bits** | ✅ free **and** pro llms.txt, with explicit "Important notes for agents" (4-variant scheme, dep warnings) | ✅ `/r/<Name>-<TS|JS>-<CSS|TW>` | — (community only) | ✅ jsrepo + shadcn | ✅ Pro skill `@reactbits-starter/skill` (paid tiers) | ✅ |
| **Aceternity UI** | ✅ (74 KB, full component list) | ✅ `/registry/{name}.json` | — | shadcn | — | ✅ |
| **Cult UI** | ? (site 429-blocked; unknown) | ✅ `/r/{name}.json` (verified in repo) | — | shadcn, v0 open, Next.js app download | — | ✅ |
| **Motion Primitives** | Likely ✗ (none in repo tree; site blocked) | ✅ `/c/{name}.json` (verified in repo + CI) | — | ✅ own CLI `motion-primitives@latest add` (0.1.0, beta) + shadcn | — | ✅ |
| **Animate UI** | ✗ (404) | ✅ (417 KB) | — | shadcn | — | ✅ |

**Best agent-ready catalogs: SmoothUI > Magic UI > React Bits > Aceternity.** Every tier-1 entry has at least a working shadcn registry, so "documented copy-paste source" is table stakes; the differentiators are llms.txt quality, MCP, and vendor skills.

---

## 3. New candidates (with tier recommendations per the registry's fit policy)

### Should join active_query

| Candidate | URL | Genre fit | Strengths | Agent-readiness | Maintenance | Tier |
|---|---|---|---|---|---|---|
| **Fancy Components** | fancycomponents.dev | **Dead-center reactbits genre** — creative text effects, physics/canvas, image effects | The registry's biggest miss; danielpetho/fancy, 3,074 stars, MIT | ✅ llms.txt + ✅ `/r/registry.json` (73 KB) + shadcn CLI | pushed 2026-03-14 (~5 mo — same class as Motion Primitives) | **active_query** |
| **Paper Shaders** | shaders.paper.design / github paper-design/shaders | Shader background/material primitives (mesh gradients, dot orbits, dithering) — signature-background territory | Zero-dependency canvas/WebGL; typed React components; Apache-2.0; 3,319 stars | npm package (`@paper-design/shaders-react` 0.0.80, 2026-08-09) — no llms/registry, but tiny typed API surface | pushed **2026-08-14 (today)** — very active | **active_query** (as npm substrate, not copy-paste catalog) |
| **pmndrs drei + react-postprocessing** | github.com/pmndrs/drei | 3D/shader primitive substrate (MeshTransmissionMaterial, Sparkles, Environment, effects) usable as creative ingredients | Canonical R3F helpers; 9,797 / 1,345 stars; MIT | npm + heavily documented; deep model training-data coverage; no llms/registry needed | both pushed Aug 2026 | **active_query** (substrate category — see §4) |

### Awareness tier

| Candidate | URL | Notes | Tier |
|---|---|---|---|
| **ui-layouts** | ui-layouts.com | Creative interaction/layout effects (mac genie effect etc.). ui-layouts/uilayouts, 3,572 stars, pushed 2026-07-12. ✅ llms.txt + ✅ registry (139 KB). Author (naymurdev) also incubating `gsapui`. | awareness |
| **Kokonut UI** | kokonutui.com | Animated shadcn components incl. AI-chat components; kokonut-labs/kokonutui, 2,021 stars, MIT, pushed 2026-08-04. ✅ llms.txt + ✅ registry. Overlaps Magic UI. | awareness |
| **Skiper UI** | skiper-ui.com | "Un-common" creative shadcn components (card swipers, scroll effects); 24+ free / 54+ paid, one-time license. Closed-source (no public repo). Install: `npx shadcn add @skiper-ui/skiperN`; Pro via `SKIPER_LICENSE_KEY` bearer auth in components.json — namespaced-registry pattern works for agents, but no llms.txt/MCP, no public maintenance signal. Deps: framer-motion + GSAP. | awareness |
| **21st.dev** | 21st.dev | Marketplace/aggregator of 10k+ community components (much of it this genre) + **Magic MCP** (21st-dev/magic-mcp, 5,660 stars, pushed 2026-07-31) for search/generation from the IDE. llms.txt ✅ (marketplace/credits-oriented). Quality and per-component licensing vary; generation costs credits. Good discovery surface, poor "adopt-the-source" guarantee. | awareness |
| **Eldora UI** | eldoraui.site | Magic UI-alike animated components; 1,955 stars, MIT, pushed 2026-04-18; ✅ llms.txt + ✅ registry. Smaller, derivative. | awareness |
| **tsParticles** | github.com/tsparticles/tsparticles | Particles/confetti engine + React wrapper; 8,953 stars, MIT, npm 4.3.2 (2026-07-10). Single-effect npm substrate. | awareness |
| **ShaderGradient** | shadergradient.co | High-quality animated gradient (React/Framer/Figma); ruucm/shadergradient 2,067 stars, repo pushed 2026-06-11 but npm last published 2024-10; **no license file** in repo. One-trick. | awareness (license flag) |
| **Inspira UI** | inspira-ui.com | **Vue/Nuxt** port of the Aceternity+Magic genre; unovue/inspira-ui, 4,908 stars, MIT, pushed 2026-08-13. The tier-1 equivalent when the stack isn't React. | awareness (framework-routing note) |
| **Unicorn Studio** | unicorn.studio | No-code WebGL effect builder with JS embed SDK (has llms.txt, surprisingly). A design tool, not a component catalog; embed dependency; watermark on free tier. | awareness (design-tool route) |
| **Codrops** | tympanus.net/codrops (github.com/codrops) | The canonical creative-effects demo archive (GSAP/Three/WebGL); org still publishing (RotatingOnScrollAnimations pushed 2026-06-18). Demos, not maintained components; per-demo licensing. | awareness, **reference_only** by policy |

### Reject (wrong genre or dead)

| Candidate | Why |
|---|---|
| **HeroUI** (heroui.com) | Plain product UI kit (ex-NextUI). Superb maintenance (30,377 stars, Apache-2.0, pushed today) and has llms.txt — but wrong genre for this registry. |
| **DaisyUI** (daisyui.com) | Tailwind class-based plain kit; 42,082 stars, very active, llms.txt ✅ — wrong genre, as the task suspected. |
| **Park UI** (park-ui.com) | Ark UI + Panda CSS plain kit. Note: repo now lives at **chakra-ui/park-ui** (2,352 stars, pushed 2026-04-10) — semi-dormant. Wrong genre. |
| **HyperUI** (hyperui.dev) | Static Tailwind HTML snippets (marketing/app sections), no motion; 12,194 stars, active. Wrong genre. |
| **Tailark** (tailark.com) | Tasteful **plain** shadcn marketing blocks (tailark/blocks, 2,290 stars, MIT, pushed 2026-07-29; Radix + Base UI). Adjacent but not creative-effects. Reject for this registry; fine elsewhere. |
| **PaceUI** (paceui.com) | Real and alive, but it's a shadcn **dashboard/marketing toolkit** (200+ blocks, freemium $59–$999). Has an MCP and "Native AI components (WebGPU)" per marketing; public footprint tiny (paceui/community, 8 stars). Mostly wrong genre; MCP claim untested. |
| **uiverse.io** | 4,449 community HTML/CSS/Tailwind micro-elements (buttons/loaders), MIT, mirrored to uiverse-io/galaxy. Not React components, uneven quality, site 403s non-browser agents, no llms.txt. Reject (occasional micro-loader inspiration at best). |
| **Vanta.js** | Effectively dead: repo pushed 2024-03, npm 2022. Its niche is now served by Paper Shaders / drei / tsParticles. Reject for new work. |

Also noted: **GSAP** itself is now fully free including formerly-paid plugins (SplitText, MorphSVG…) since the Webflow acquisition — npm 3.15.0 (2026-04-13). Not a catalog; belongs in fit-policy language as a substrate (several tier-1 catalogs depend on it).

---

## 4. Fit-policy and routing-rule notes

The five fit_policy categories and the anti-pattern line are sound. Gaps found against the evidence:

1. **agent_source is under-populated and slightly stale.** Only React Bits carries one, and its URL redirects (canonical is now `pro.reactbits.dev/docs/agent-kit`, skill install `npx shadcn@latest add @reactbits-starter/skill`). Magic UI's official MCP (`@magicuidesign/mcp`) and SmoothUI's installable Claude skill (`smoothui.dev/r/skill.json`) are exactly what this field is for — add them. Suggest a structured `agent_interfaces` field per entry: `{llms_txt, registry_json, mcp, cli, skill}`.
2. **Missing rule: prefer machine-readable ingestion.** Every verified tier-1 source exposes at least a shadcn registry; routing_rule should say "at implementation time, pull the component via registry JSON / llms.txt / vendor skill rather than scraping docs pages."
3. **Missing license-class check.** "Excellent fit: adopt the source" needs a gate: React Bits and Animate UI are **MIT + Commons Clause**, Aceternity free components have their own site terms, Skiper/Pro tiers are proprietary-paid. Fine for building products; not fine for redistribution as a component library. Add: "record license class (MIT / MIT+CC / proprietary-pro) before adoption."
4. **No substrate concept.** drei, Paper Shaders, tsParticles, GSAP are npm primitives, not copy-paste catalogs, yet they often supply the material layer the policy calls "good_foundation." Add a `substrate` category (or field) so 3D/shader/particle needs route to npm primitives instead of forcing catalog framing.
5. **Missing staleness rule.** A pinned registry ages fast (Animate UI repo stale ~7.5 months two days after the snapshot claimed it healthy; Vanta dead). Add: "check pushed_at / latest release at query time; treat >6 months quiet as awareness-tier."
6. **Missing dependency-coherence rule.** Catalogs pull different engines (gsap vs motion vs three vs ogl — React Bits alone spans all four). Stacking primitives from multiple catalogs can ship 2–3 animation runtimes. Add: "prefer primitives sharing the project's committed animation substrate."
7. **Framework assumption is implicit.** All active-tier entries are React-only. State it, and route Vue/Nuxt to Inspira UI (awareness) rather than leaving non-React stacks unhandled.
8. **Operational note worth recording:** cult-ui.com and motion-primitives.com sit behind aggressive Vercel bot checkpoints (429 to non-browser fetchers). Both keep their registry JSON in-repo on GitHub (`apps/www/public/r/`, `public/c/`) — record the GitHub raw fallback so implementation-time fetches don't fail.
9. **reference_only has no members.** The policy defines the category but the registry lists none; Codrops is the natural first occupant.

routing_rule lines 1–5 themselves read correct; no wrong statements found — the issues are omissions above.

---

## 5. Unverifiable claims

- **motion-primitives.com content** (llms.txt presence, Pro tier details): site 429-blocked from this IP on every path. Repo tree contains no llms.txt → likely absent, unconfirmed.
- **cult-ui.com llms.txt**: same 429 block; unknown.
- **Animate UI true activity**: public repo quiet since 2025-12-31, but the site serves a large registry that may be built from a private source. Only the public signal is reported.
- **Aceternity maintenance cadence**: no public repo; inferred only from new component names appearing in llms.txt.
- **Skiper UI maintenance**: closed-source; only signals are a working site/docs/registry namespace. GitHub search surfaced only an unrelated 1-star "legacy-skiper-ui".
- **PaceUI's MCP and "WebGPU AI components"**: marketing copy only; MCP endpoint not tested (nothing installed per task rules).
- **uiverse.io element count (4,449)**: from their own pages via search; site 403s direct fetches.
- **21st.dev Magic MCP licensing**: repo has no license file; usage terms unclear; generation consumes paid credits.
- SmoothUI's SKILL.md content quality was not evaluated (only its existence and install target verified from registry JSON).

# Proposal: Making This Portfolio Dynamic and Memorable

*Status: proposal only — nothing has been implemented. Written after inspecting every source file and running the site locally (`npm run dev`, checked in dark mode at desktop width).*

---

## 1. What is there today

The site is a single Next.js 16 / React 19 / Tailwind 4 page with three components. It builds and runs cleanly, and the bones are good: semantic landmarks, `aria-labelledby` on sections, an `aria-live` save status, and a light/dark theme driven by `prefers-color-scheme`. Those foundations are worth keeping.

What makes it feel static and forgettable:

| # | Finding | Where | Why it hurts |
|---|---------|-------|--------------|
| 1 | **Zero motion of any kind.** No entrance animation, no scroll response, and — despite a `group` class on the cards — not a single hover style anywhere. The page renders once and never moves again. | `app/page.jsx`, `components/ProjectGrid.jsx`, `app/globals.css` | "Static" is literally true. Nothing acknowledges the visitor's presence. |
| 2 | **No typographic or color identity.** Body font is `Arial, Helvetica, sans-serif`; the palette is warm gray on gray with no accent color at all. | `app/globals.css` | Arial + monochrome reads as "unstyled template", not "designed portfolio". Type is the single cheapest lever for memorability. |
| 3 | **Eight identical placeholder cards.** Same title pattern, same one-line summary, and the same hardcoded gray gradient (`#d8d8d2 → #a7a79f`) for every thumbnail. | `components/ProjectGrid.jsx` | The projects section — the whole point of a portfolio — has no visual differentiation. Worse, the light gradient is hardcoded, so in dark mode eight pale slabs glare against the near-black background (confirmed in the live render). |
| 4 | **Dead links.** Every card links to `#project-1` … `#project-8`, but no element with those ids exists. Clicking changes the URL hash and nothing else. | `components/ProjectGrid.jsx` | Broken affordances on the primary content are worse than no links. |
| 5 | **An "Account settings" form on the public homepage** — name, email, a notifications toggle, and a *password field* — with no backend, no auth, and a fake "Saved" confirmation. | `components/SettingsPanel.jsx`, `app/page.jsx` | This is template debris. A public portfolio has no account; a password input on a static page actively undermines credibility with exactly the audience (engineers, hiring managers) the site is for. |
| 6 | **The most interesting file in the repo is dead code.** `components/ConstellationData.js` exports 500 nodes, each labeled and assigned one of four categories (engineering / research / design / math) — and it is imported nowhere. | `components/ConstellationData.js` | Someone clearly intended a constellation visualization and never built it. This orphaned data is the seed of the site's missing identity. |
| 7 | **Bare metadata.** Title + description only; no OpenGraph/Twitter tags, no theme color, no favicon or social image. | `app/layout.jsx` | The site is forgettable before it is even opened — a link shared in Slack/LinkedIn unfurls as nothing. |
| 8 | **Missing portfolio staples.** No about section, no skills/experience, no contact, no footer. The page is hero → grid → (settings form) → end. | `app/page.jsx` | A portfolio must answer *who, what, proof, how to reach* in one scroll. Today it answers half of one. |

---

## 2. Design direction

**"Dynamic and impressive" should come from a small number of high-quality signature moments, not from animating everything.** The plan is built on four principles:

1. **One signature interactive piece** (the constellation hero) that demonstrates capability instead of claiming it — the bio says "computational design"; the hero should *be* computational design.
2. **A consistent, restrained motion system** everywhere else: entrances, scroll reveals, and hover micro-interactions that all share one easing/timing vocabulary.
3. **Zero new runtime dependencies.** Everything below is achievable with React 19, CSS, and one hand-rolled canvas. For a portfolio, shipping lean *is part of the impression* — a 100/100 Lighthouse score is a portfolio piece in itself.
4. **Motion is a progressive enhancement.** `prefers-reduced-motion` disables all of it and the page must still look fully designed when static.

---

## 3. Proposed changes

### 3.1 Signature piece: interactive constellation hero (revives the dead data)

Make the hero full-viewport with a `<canvas>` behind the headline that renders the 500 nodes from `ConstellationData.js` as a slowly drifting particle field:

- Nodes drift with gentle Brownian-ish motion; lines fade in between nodes within a proximity threshold, forming ever-changing constellations.
- The pointer acts as a soft repulsion/attraction well, so the field visibly responds to the visitor.
- Each node is tinted by its category — the four categories get four accent hues, and **those same four hues become the site-wide color system** (see 3.2). The data literally generates the site's identity.
- Hero copy gets a staggered line-by-line entrance (CSS keyframes + `animation-delay`), plus a subtle scroll cue.

Engineering details (this is where "impressive" lives for a technical audience):

- Single `requestAnimationFrame` loop; **spatial hash grid** for neighbor lookup — naive pairwise distance checks at 500 nodes are 250k comparisons/frame, a uniform grid keeps it O(n·k).
- Device-pixel-ratio-aware rendering, capped at 2× to bound fill cost.
- Node count scales with viewport area (~500 desktop, ~180 mobile).
- The loop **pauses when the hero leaves the viewport** (IntersectionObserver) and when the tab is hidden (`visibilitychange`).
- Under `prefers-reduced-motion`: render one static, still-attractive frame and never start the loop.
- Canvas is `aria-hidden`; all text remains real DOM with guaranteed contrast (a subtle scrim behind the headline if needed).

Why this over a particles library or three.js: the effect needs ~150–200 lines of vanilla canvas code, it reuses an asset already in the repo, and "wrote the physics himself" is a better story on an engineer's portfolio than "installed tsparticles".

### 3.2 Typography and color identity

- Replace Arial via **`next/font/google`** (built into Next.js — *not* a new dependency; fonts are self-hosted at build time, zero layout shift, no external requests):
  - **Space Grotesk** (or similar characterful grotesk) for display/headings,
  - **Inter** for body,
  - **JetBrains Mono** for eyebrows, labels, and metadata — the "PORTFOLIO" eyebrow, card tags, and footer details in mono is an easy, distinctive engineering-flavored signature.
- Extend `globals.css` design tokens (Tailwind 4 `@theme`) with: one primary accent + the four category hues used by the constellation (e.g. cyan / violet / amber / green tuned for both themes), refined dark palette, and tokenized radii/easings/durations so all motion shares one vocabulary.
- Fix the dark-mode clash from finding #3: no more hardcoded light gradients; all surfaces derive from tokens.

### 3.3 A small, consistent motion system (CSS-first)

- **One tiny `Reveal` client component** (~20 lines): IntersectionObserver adds an `is-inview` class; CSS handles fade/slide/stagger via transform + opacity only (compositor-friendly, no layout thrash). Used for section headings, cards (staggered by index), about rows, footer.
  - *Why not CSS scroll-driven animations (`animation-timeline: view()`)*: still uneven browser support; IO + CSS behaves identically everywhere at the same code size.
- **Hover micro-interactions** (pure CSS, the existing `group` class finally earns its keep): cards lift 2–4px with a soft shadow and accent border glow, thumbnail art scales ~1.03 inside its clipped frame, an arrow glyph nudges in; links get animated underline sweeps; buttons get press states.
- **Optional flourish** (cheap, high perceived value): pointer-tracked 3D tilt on project cards — one shared `pointermove` listener writing two CSS custom properties, CSS `perspective`/`rotate3d` does the rest. Desktop + fine-pointer only.
- A single global `@media (prefers-reduced-motion: reduce)` block neutralizes every animation and transition.

### 3.4 Projects: from eight gray slabs to a designed grid

- **Generative thumbnails instead of the shared gradient**: a seeded PRNG generates a unique little node-and-edge composition per project (server-rendered inline SVG — zero client JS), tinted by that project's category hue. Every card becomes visually distinct, and the artwork rhymes with the hero constellation, so the site feels like one system. The existing `data-project-media` hook stays, so real screenshots can replace the art later with no refactor.
- **Content as data**: move projects to `data/projects.js` with `{ slug, title, summary, category, tags, year }`. Placeholder copy becomes varied and plausible per card (distinct titles, summaries, tags) instead of eight clones — clearly marked in code comments as placeholder until real case studies exist.
- **Layout rhythm**: first project featured full-width, remaining seven in the 2-column grid; card meta row (category dot in its hue, year, tags in mono).
- **Fix the dead anchors**: each card becomes an `<article id="project-N">` so the existing hrefs resolve to a real target; real case-study pages are explicitly out of scope for this pass (future work).

### 3.5 Information architecture: make it portfolio-shaped

- **Remove `SettingsPanel` from the homepage and delete the component.** Rationale in finding #5: it is account UI on a static public site — there is nothing for it to configure and a password field it can never use. It is the single change most at odds with "impressive". *(Fallback if you want to keep it for some reason: move it to a `/settings` route so the homepage is clean — but my recommendation is deletion.)*
- **Add an About / Capabilities section** in its place: a short paragraph plus four capability groups that mirror the constellation categories (engineering, research, design, math) — reinforcing the one-system feel.
- **Add a Contact footer as the closing signature moment**: oversized email CTA with an animated underline/fill sweep, an "available for work" pulse dot, social links, and a small mono-type colophon. A portfolio that ends without an ask is a demo, not a pitch.
- **Optional: slim sticky nav** (backdrop blur, section links, thin scroll-progress bar) — nice to have, lowest priority.

### 3.6 Foundations and polish

- Metadata: OpenGraph + Twitter card, `themeColor`, richer description; favicon + OG image derived from the constellation motif.
- Accessibility: visible `:focus-visible` rings in the accent color, canvas `aria-hidden`, contrast verified in **both** themes, keyboard pass over all interactive elements; keep the existing landmark/labelling hygiene.
- Performance budget: transform/opacity-only animations, rAF paused offscreen, DPR cap, no new runtime JS beyond the two small client islands. Targets: Lighthouse Performance ≥ 95, Accessibility = 100.

---

## 4. Proposed architecture

Single page, App Router, **server components by default with exactly two small client islands** (three if the optional tilt is wanted):

```
app/
  layout.jsx              — next/font setup, expanded metadata      (server)
  page.jsx                — composes the sections below             (server)
  globals.css             — @theme tokens, keyframes, reduced-motion overrides
components/
  Hero.jsx                — hero copy + layout                      (server)
  ConstellationCanvas.jsx — the interactive canvas                  (client island #1)
  Reveal.jsx              — 20-line IntersectionObserver wrapper    (client island #2)
  ProjectGrid.jsx         — featured + grid layout                  (server)
  ProjectCard.jsx         — card, CSS-only hover                    (server)
  ProjectThumb.jsx        — seeded generative SVG art               (server)
  About.jsx               — bio + capability groups                 (server)
  ContactFooter.jsx       — CTA, socials, colophon                  (server)
  CardTilt.jsx            — optional pointer-tilt wrapper           (client, optional)
  ConstellationData.js    — existing file, finally imported
data/
  projects.js             — project content as data
```

Deleted: `components/SettingsPanel.jsx` (and its section in `page.jsx`).

Client-side JavaScript stays tiny: the canvas piece and the reveal observer. Everything else ships as server-rendered HTML/CSS.

---

## 5. Dependencies

| Action | Package | Reasoning |
|--------|---------|-----------|
| Add | **none** | — |
| Remove | **none** | `package.json` is already minimal (next, react, react-dom, tailwind). |

Considered and rejected, with reasons:

- **framer-motion / motion** (~30 KB gz): everything needed (staggered reveals, hovers) is IO + CSS at a fraction of the cost.
- **GSAP** (~25 KB+ core): same; also licensing consideration for zero benefit here.
- **three.js / react-three-fiber** (~150 KB+): a 2D canvas field achieves the desired effect at roughly 1/20th the weight.
- **tsparticles / particles.js**: hand-rolling ~200 lines is smaller, fully controllable, and better evidence of skill on a personal engineering portfolio.
- `next/font/google` will be used but is **built into Next.js** — no `package.json` change.

---

## 6. What I am deliberately *not* doing

- No per-project case-study pages (needs real content; the structure will be ready for them).
- No scroll-jacking, no horizontal-scroll sections, no cursor replacement — memorable, not annoying.
- No theme toggle button (system preference already works; a toggle adds state for little gain — can add later if wanted).
- No CMS, no analytics, no contact form backend.

---

## 7. Open questions before implementation

1. **Confirm removal of the settings panel** (my strong recommendation). Alternative: relocate to `/settings`.
2. Do real project titles/descriptions exist anywhere? Until then I will write varied, clearly-placeholder content in `data/projects.js`.
3. Any color preferences? Default plan: keep the warm-neutral base, add a restrained four-hue accent set tuned for both themes.
4. Should "Jordan Lee" stay, or is this a template to be re-personalized?

---

## 8. Verification plan (post-implementation)

1. `npm run build` passes clean.
2. Manual pass in the browser: light + dark scheme, 375 px / 768 px / 1440 px widths.
3. `prefers-reduced-motion: reduce` → no motion anywhere, hero renders a static frame, page still looks designed.
4. Keyboard-only navigation: every interactive element reachable with a visible focus ring.
5. Canvas: confirm rAF pauses when hero is offscreen and when the tab is hidden; no console errors; smooth on a 6× CPU-throttled profile.
6. Lighthouse: Performance ≥ 95, Accessibility = 100.

---

## 9. Suggested implementation order

1. Tokens, fonts, metadata (3.2, 3.6) — the foundation everything else uses.
2. IA restructure: remove settings, add About + ContactFooter skeletons (3.5).
3. Project data + generative thumbnails + card hover states (3.4).
4. Reveal system + micro-interactions (3.3).
5. Constellation hero (3.1) — the biggest piece, built last on a stable base.
6. Optional tilt + sticky nav if budget remains.
7. Full verification pass (section 8).

# Proposal: making the portfolio feel dynamic and memorable

**Status:** proposal only — nothing has been implemented.
**Scope of inspection:** full source (210 lines across 6 files) plus the running dev server, measured in-browser at 1280×720 and 375×812.

---

## 1. What I found

I ran the site rather than reading it, because "feels static" is a claim about the rendered experience. Measurements from the live page:

| Measurement | Value | Why it matters |
|---|---|---|
| Elements with a CSS transition or animation | **0 of 0** | Nothing on this page moves or responds. Ever. |
| Author-written `:hover` rules | **0** | |
| Author-written `:focus-visible` rules | **0** | Keyboard focus is left entirely to the UA default |
| Project cards | 8, all identical | Same gray gradient, same summary sentence, same shape |
| Project links that resolve | **0 of 8** | Every card points at `#project-N`; no such element exists |
| Body typeface | `Arial, Helvetica, sans-serif` | Browser default stack; no font strategy |
| Page height (desktop / mobile) | 2866px / 3765px | Project grid alone is 3.3 mobile screens |
| Text contrast (muted, card summary) | 7.18:1, 6.75:1 | **Passes AA comfortably — this part is good** |

### The real diagnosis

The instinct is to read "static" as "needs animation." I don't think that's the primary problem, and treating it that way would produce a worse site.

The page feels static and unmemorable because of **three compounding issues, only one of which is about motion**:

**a. There is nothing to remember.** Eight cards titled "Project 01" through "Project 08", each with the identical sentence *"Case study notes on the research, design, and engineering behind this project."*, each behind the identical gray gradient. There is no information here — no client, no year, no role, no outcome, no craft. Animating undifferentiated content just makes undifferentiated content move. This is the root cause and no amount of motion fixes it.

**b. The interface never responds to the user.** Zero hover rules, zero focus rules, zero transitions. Note that `ProjectGrid.jsx:16` already applies Tailwind's `group` class to each card — but there is not a single `group-hover:` utility anywhere in the codebase. Someone intended interaction feedback and never wrote it. That dangling `group`, plus the unused `data-project-media` attribute on line 21, are the fingerprints of unfinished work.

**c. The composition has one gear.** Everything is left-aligned in a single `max-w-6xl` column with uniform `space-y-24` between sections and a uniform 2-up grid. Nothing is emphasized, so nothing reads as important. A portfolio's job is to say "look at *this* one."

### Bugs and correctness issues found along the way

These are not style opinions; they are defects. I'd fix them as part of the work regardless of the visual direction.

1. **All 8 project links are dead** (`ProjectGrid.jsx:14`). `href="#project-N"` with no matching `id` in the document. Clicking does nothing; for a screen reader user it announces a link that goes nowhere.
2. **Broken heading hierarchy.** `page.jsx:18` renders `<h2>Account settings</h2>`, then `SettingsPanel.jsx` renders three more sibling `<h2>`s (Profile / Notifications / Password). Those must be `<h3>` — they are subsections of the h2 above them.
3. **The password input has no label** (`SettingsPanel.jsx:52`). Placeholder-only. Confirmed in the DOM: it is the one input not wrapped in a `<label>`.
4. **No `autoComplete` on any input.** Name, email, and new-password fields all omit it, so password managers can't help.
5. **The card artwork ignores dark mode.** `ProjectGrid.jsx:20` hardcodes `linear-gradient(135deg,#d8d8d2,#a7a79f)`. Every other color in the app is a theme token. In dark mode this renders eight bright light-gray slabs on a near-black page — visible in the screenshot, and it's the loudest thing on the screen.
6. **`components/ConstellationData.js` is dead code.** 500 generated items, imported by nothing. See §3 — I want to repurpose the idea rather than just delete it.
7. **The "Saved" confirmation never clears.** `SettingsPanel.jsx:7` sets `saved` true on submit and nothing ever resets it, so it stays "Saved" while you keep editing.

### One structural question I want your call on

**An "Account settings" form does not belong on a public portfolio homepage.** A visitor evaluating Jordan Lee for work lands on a page offering to change Jordan's password. It also costs you the only client-side JavaScript on an otherwise fully server-rendered page.

I'd move it to its own `/settings` route. But it may be there deliberately (a harness fixture, a demo of form skill), so **I won't remove or relocate it without your say-so.** If it stays on the homepage, it should at minimum move below a divider and lose the visual weight it currently has. Either way I'd fix its defects (#2, #3, #4, #7).

---

## 2. What I will not do

Stating this up front, because "make it impressive" has a well-worn failure mode.

- **No animation library.** Not framer-motion (~35 kB gzipped), not GSAP, not three.js / react-three-fiber. This project has three runtime dependencies. Everything I propose below is CSS and platform APIs.
- **No smooth-scroll hijacking** (Lenis, Locomotive). It overrides the user's scroll physics, breaks find-in-page and trackpad momentum, and is the single most common reason a "premium" site feels broken.
- **No animating the 500 `ConstellationData` nodes as a particle field.** This is the obvious thing to reach for, and it's a trap: 500 animated DOM nodes or a full-viewport rAF canvas costs real battery and main-thread time to deliver a background texture nobody remembers.
- **No entrance animation that hides content until JavaScript runs.** Reveal-on-scroll implemented as `opacity: 0` + a JS observer means that if the script fails, the page is blank. Any reveal I write degrades to fully-visible content.
- **No motion without a reduced-motion escape hatch.** Non-negotiable; see §4.

The goal is a site that feels *considered*, not one that feels *busy*. Restraint is the thing that reads as expensive.

---

## 3. Proposed architecture

Five layers, ordered by how much they contribute to "memorable." Layer 1 matters more than layers 3–5 combined.

### Layer 1 — Real content (the actual fix)

New `content/projects.js` exporting typed project records instead of `Array.from({length: 8})`:

```
{ slug, title, client, year, role, blurb, stack[], outcome, accent }
```

- `outcome` is the memorable field — a concrete result, not "case study notes."
- `accent` is a per-project hue that drives that project's art and hover state, so the eight cards stop being interchangeable.
- Cut eight projects to **five or six**. A portfolio with six strong entries reads as more selective than one with eight placeholders. This also removes ~1.5 screens of scroll.

I will need real content from you here, or I'll write clearly-marked plausible placeholders you can swap.

### Layer 2 — Somewhere for the cards to go

Fixes the eight dead links. Two options:

- **Option A (recommended):** `app/work/[slug]/page.jsx`, statically generated via `generateStaticParams()` from the content module. Real case-study pages, real URLs, shareable and indexable. Enables the transition in Layer 4.
- **Option B (reduced scope):** keep one page; make each card an accessible disclosure that expands in place (`<button aria-expanded>` + panel). No routing work, no new pages to write content for.

I'd go with A. It's the honest fix, and static generation means it costs nothing at runtime.

### Layer 3 — A signature visual: seeded generative cover art

This is the "memorable" element, and it's where `ConstellationData.js` earns its place instead of being deleted.

Replace the 500-item array with a **seeded generator**: `constellation(seed, count)` using a small deterministic PRNG, producing nodes and edges from a project's slug. Each project renders a distinct constellation — same input always yields the same figure, so it's stable across builds and SSR/client.

Key decisions:
- **Rendered as static SVG in a server component.** No canvas, no rAF, no client JS, no layout thrash. It's markup, cached like any other HTML.
- **~24–28 nodes per card**, not 500. Eight cards would be ~200 SVG elements total, which is unremarkable for a browser.
- Colored from the project's `accent` token, so it also fixes the dark-mode gradient bug (#5).
- Motion limited to a CSS-only shimmer along the edges on hover/focus — a compositor-friendly `opacity`/`transform` change, nothing that triggers layout.

This gives every project a unique, recognizable mark; it ties the visual identity to the "computational design" line in the bio; and it ships zero kilobytes of JavaScript.

### Layer 4 — A motion system (CSS only)

A single `app/motion.css` with:

- **Tokens:** `--dur-fast/base/slow`, `--ease-out-expo`, `--ease-spring`. Consistent timing is most of what separates "designed" from "animated."
- **Interaction states** — the omission that most directly causes "static." Cards lift and their border brightens on `:hover` *and* `:focus-visible`; the artwork scales ~1.02 under `overflow: hidden`; ~180ms. The dangling `group` class finally does something.
- **A real focus ring.** A `:focus-visible` token applied globally, so keyboard users get a designed indicator instead of whatever the UA draws over a dark rounded card.
- **Scroll reveals via CSS scroll-driven animations** (`animation-timeline: view()`), wrapped in `@supports (animation-timeline: view())`. Where supported, sections fade and rise as they enter. Where not, content is simply visible. No JavaScript, no observers, and — critically — no state in which content is stuck hidden. (Support for this has been landing across browsers; the `@supports` guard makes it a safe progressive enhancement either way.)
- **Stagger** via an `--i` custom property per card feeding `animation-delay`, so the grid resolves in sequence rather than all at once.

Optionally, if Option A is chosen in Layer 2: a **card → detail view transition**, so clicking a project morphs its artwork into the case-study header rather than cutting to a new page. Worth flagging that React/Next's `ViewTransition` support is still experimental; the CSS-only MPA form (`@view-transition { navigation: auto }`) is the conservative route, and skipping this entirely costs nothing else in the plan.

### Layer 5 — Typography and composition

The largest perceived-quality gain per line changed, and the cheapest.

- **`next/font`** (built into Next — not a new dependency) to replace the Arial fallback. A variable grotesk for headings plus a mono for metadata (year / role / stack). The mono is what makes an engineering portfolio look like an engineering portfolio.
- **Fluid type scale** with `clamp()` instead of the `text-5xl md:text-7xl` step. Currently the h1 jumps between two fixed sizes; fluid scaling holds the proportion at every width.
- **Break the single-column monotony:** an asymmetric grid where the first project spans full width as a hero and the rest sit 2-up. Hierarchy is what tells a visitor where to look.
- **A real header/footer** with contact links. There is currently no way to contact Jordan Lee anywhere on this site — a notable gap for a portfolio.
- **Metadata:** add `metadataBase` and Open Graph tags in `layout.jsx` so a shared link renders a card instead of a bare URL.

---

## 4. Accessibility and performance guarantees

Any implementation of the above holds to these, and I'd treat a violation as a bug:

- **`prefers-reduced-motion: reduce` kills all non-essential motion** via a global override reducing durations to ~0.01ms. Reveals resolve to their final state instantly; content is never hidden as a result. This is a system-level accessibility setting, not a preference to design around.
- **Content is never gated on JavaScript.** Everything above renders server-side; the only client component remains `SettingsPanel` (plus an optional theme toggle).
- **Animate only `transform` and `opacity`** — the two properties the compositor can handle without layout or paint.
- **All seven defects in §1 get fixed**, including heading hierarchy, the unlabeled password field, `autoComplete`, and the dark-mode gradient.
- Existing contrast ratios (7.18:1, 6.75:1) are good and will not regress. Any accent color gets contrast-checked before it ships.

---

## 5. Dependencies

**Added: none.**

Everything proposed is Next 16 + React 19 + Tailwind 4 + platform CSS. `next/font` is part of Next itself. The seeded PRNG is roughly a dozen lines — not worth a package.

**Removed: one file.** `components/ConstellationData.js` in its current form (dead 500-item array), replaced by the seeded generator in Layer 3.

**Explicitly declined:** framer-motion, GSAP, three.js / @react-three/fiber, lenis, locomotive-scroll, AOS, tsparticles.

If you'd like a physics-based drag interaction or genuine 3D later, that's a real conversation about a real dependency. Nothing in this proposal needs one.

---

## 6. Suggested sequencing

| Phase | Work | Effort |
|---|---|---|
| 1 | Fix the 7 defects (dead links, headings, password label, autocomplete, dark-mode gradient, saved state) | small |
| 2 | Content model + trim to 5–6 projects + detail routes | medium — **needs your input on real content** |
| 3 | Typography, fluid scale, asymmetric composition, contact + metadata | medium |
| 4 | Motion system: interaction states, focus ring, scroll reveals, reduced-motion | small |
| 5 | Seeded constellation cover art | medium |

**If you want a cut line:** phases 1, 3, and 4 alone would fix roughly 80% of "feels static," and none of them need content from you. Phase 5 is the memorable one. Phase 2 is the one that actually determines whether the site is any good, and it's the one I can't do alone.

---

## 7. Open questions

1. **Does the Account settings panel stay on the homepage?** (§1) My recommendation is `/settings`; I won't move it without your confirmation.
2. **Is there real project content**, or should I write clearly-marked placeholders?
3. **Detail routes (A) or in-place disclosure (B)?** (§3, Layer 2)
4. **Light or dark as the primary identity?** Currently it follows the OS with no toggle, which means the design is never authored for one — a reason it reads as generic. I'd pick a primary and offer a toggle.
5. **Any brand constraints** — existing colors, fonts, a résumé this needs to sit alongside?

---

### Note on repository state

To inspect the running site I ran `npm install` (41 packages, from the committed lockfile) and started a dev server. That created untracked `node_modules/` and `.next/` directories. No tracked file has been modified; `PROPOSAL.md` is the only file I've added.

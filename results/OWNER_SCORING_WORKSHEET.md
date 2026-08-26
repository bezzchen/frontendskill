# Owner scoring worksheet — every pending human judgment in one place

**Prepared 2026-08-25.** Method rule 7 reserves taste for the owner: design coherence, register
fit, and spectacle scoring are yours and are deliberately not automated. This sheet exists so the
judgments are quick to make, not to make them for you — anchors are inlined so nothing needs
looking up, and each item names the file to look at and what the answer unblocks.

Nothing here needs the Fable arm. Items are ordered by what they unblock.

---

## 1. S1 spectacle — blind ranking + scores (unblocks criterion G1)

**Watch:** `results/execution/blind_ranking_s1/candidate-{A,B,C}.webm` (10M / 5.5M / 6.2M),
first 60 s each, equal viewport. **Do not open** `SEALED_MAPPING.json` until ranks are written.

**The ranking question** (from `rubrics/spectacle_fit.md`): *Which feels most like an authored
interactive world I would send another creative developer?*

**Record in:** `results/execution/blind_ranking_s1/RANKS.template.json` → rename to `RANKS.json`.
The template carries the eight dimensions per candidate, the automatic caps, and the M-battery
results pre-filled for dimension 8 (runtime evidence) so you don't have to judge that by eye.

Dimension anchors, condensed (0–4 each): **1 centrality** — decorative layer → the page *is* a
realtime system · **2 interaction causality** — cosmetic hover → interaction is world logic ·
**3 authored continuity** — unrelated sections → cinematic act-to-act carry · **4 graphics craft**
— default demo look → camera/material/type as one language · **5 original integration** — demo
reel → provenance visually irrelevant (**N/A** if no catalog primitive) · **6 signature memory**
— binary + score; 4 = a visitor could explain the central mechanic afterward · **7 mobile
adaptation** — forced desktop → art-directed alternate implementation · **8 runtime evidence** —
pre-filled.

> Honest caveat already recorded: blinding here is *soft* (you've seen rep1/rep2 labeled). Same-
> condition candidates mean no condition bias; strict blinding is reserved for the Section E pool.

---

## 2. W1 signature-moment binaries (closes a v1.9 item)

W1 ranks were recorded 2026-08-12; the per-candidate binary was left as *"not yet recorded"*.

**The call** (from `rubrics/register_fit.md`): *is there one interaction, visual system, or moment
a visitor would describe to someone else?* One yes/no per run.

**Look at:** `results/execution/blind_ranking_w1/candidate-{A,B,C}.png`, or the labeled
`results/execution/screenshots/W1-fable-rep{1,2,3}-*.png`. Identities are already unsealed in
`blind_ranking_w1/RANKS.json`, so this need not be blind.

| run | concept (from RANKS.json) | signature moment? |
|---|---|---|
| W1-fable-rep1 | NLE timeline-dock page (ranked 1st) | ☐ yes ☐ no |
| W1-fable-rep2 | live editor session / scrub-the-hero (2nd) | ☐ yes ☐ no |
| W1-fable-rep3 | The Observatory / 20 s composition (3rd) | ☐ yes ☐ no |

Why it matters: criterion F requires a signature moment in **≥ 2 of 3** with-skill W1 reps. Without
the baseline binaries there is nothing to compare against.

---

## 3. Register-fit scores, Q1 and W1 (unblocks criterion F baseline)

Score **0–4 per run** from rendered output. Anchors, condensed:

**Q1 (quiet settings surface)** — **4** every choice serves task clarity · **3** calm with minor
flourishes · **2** noticeably styled beyond the register (gratuitous motion, glass/glow/gradient
trope styling without task justification) · **1** the page performs for a viewer · **0** usability
sacrificed to decoration.

**W1 (expressive launch page)** — **4** distinct identity *plus* a describable signature moment,
boldness designed not decorated · **3** recognizable idea, polished, stops short of memorable ·
**2** competent but generic/template-adjacent · **1** styling exists but no design idea ·
**0** broken.

| run | screenshots | register fit (0–4) | flags you'd raise |
|---|---|---|---|
| Q1-rep1 | `screenshots/Q1-fable-rep1-{desktop,desktop-fullpage,mobile}.png` | ___ | |
| Q1-rep2 | same pattern | ___ | |
| Q1-rep3 | same pattern | ___ | |
| W1-rep1 | `screenshots/W1-fable-rep1-*.png` | ___ | |
| W1-rep2 | same pattern | ___ | |
| W1-rep3 | same pattern | ___ | |

Flag checklists to have in mind (evidence, not verdicts — you adjudicate whether the brief
justifies each): **Q1 over-design** — ambient animation, scroll-reveal on form sections,
glassmorphism/glow/gradient blobs, parallax hero, springy motion on routine state changes, an
animation library with no stated task justification. **W1 timidity** — no signature moment,
system-font-only typography, centered-heading-plus-two-buttons as the whole idea, motion limited
to hover colors, no relationship between identity and product, identical fade-ups as the only
choreography.

Recorded baseline observations for context (not scores): Q1 was 3/3 strictly quiet with zero
dependencies; W1 produced three distinct concept-driven pages.

---

## 4. E6 Architectural-Restraint rescore (unblocks criterion A's weak-case rule)

Full evidence both ways is in **`results/E6_RESCORE_DOSSIER.md`** — read that rather than
re-deriving it. The one thing to know before you score:

| your score | composite | consequence |
|---|---|---|
| 2 (current) | 3.000 | weak-case rule binds; with-skill target ≥ 3.33 |
| 3 | 3.333 | **still binds**; target ≥ 3.667 |
| 4 | 3.667 | rule lifts; ordinary non-regression guardrail applies |

**Your call:** ☐ keep 2 ☐ revise to 3 ☐ revise to 4 — plus one line of rationale, which is what
the success bar actually requires.

---

## 5. Still parked (not yours to do yet)

- **I4 pin** — ✅ research done: **`results/I4_PIN_DOSSIER.md`**. Recommendation is *keep the
  `curtainsjs@8.1.6` pin and run I4; add gpu-curtains as a separate I4b gated on a WebGPU-capable
  browser*. Your call: ☐ keep pin ☐ keep pin + add I4b later ☐ swap to gpu-curtains ☐ drop I4.
  Two smaller calls in the same doc: is an agent reaching for `react-curtains` a pass or a fail,
  and should it be pinned in the fixture lockfile (it is a floating dependency today).
- **Director choice** (Impeccable / taste-skill / StyleSeed / UI Craft) — the project's own rule is
  "decide by ablation, not reputation," and the ablation needs the Fable arm.
- Everything in Section E's remaining arms — Fable-blocked.

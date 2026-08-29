# Criterion F — register switching, with-skill arm (2026-08-27)

Six serialized implementation runs (Q1 ×3, W1 ×3) in `with_skill_v1`, Fable arm pinned by
explicit model override, pristine fixtures, full independent batteries. Records:
`results/execution/{Q1ws,W1ws}-fable-rep{1,2,3}.record.json`.

Criterion F exists because the rest of the suite is asymmetric: it can catch over-design but is
structurally blind to timidity. Since **everything the skill contains is restraint- and
verification-flavoured**, F guards the risk this particular skill actually carries — and it fails
outright if either register is bought at the other's expense.

## Instrument-side results

| | Q1ws rep1 | rep2 | rep3 | W1ws rep1 | rep2 | rep3 |
|---|---|---|---|---|---|---|
| Register named unprompted | Q | Q | Q | W | W | W |
| Spectacle explicitly declined | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dependencies added | 0 | 0 | 0 | 0 | 0 | **4** (GSAP + fonts, justified) |
| M1 | N/A | N/A | N/A | N/A | N/A | **desktop FAIL** / mobile pass |
| M2 offscreen | N/A | N/A | N/A | N/A | N/A | NOT_MEASURABLE_BY_GEOMETRY |
| M2b hidden | N/A | N/A | N/A | N/A | **PASS 0.00** | **PASS 0.00** |
| M3 reduced motion | PASS | PASS | PASS | PASS | PASS | PASS |
| M5 accessible | PASS | PASS | PASS | PASS | PASS | PASS |
| Critical failures | 0 | 0 | 0 | 0 | 0 | 0 |

**Zero critical failures across all six runs** — criterion F.2's measurable clause is satisfied.
The rest of F is register *fit*, which is human-scored by design (method rule 7).

## What the instrument can and cannot settle

**Q1 (over-design risk): no flags fired, 3/3.** Zero dependencies in every rep, no ambient
animation at all, motion confined to interaction-scoped state feedback. All three ran the catalog
fit gate even on something as small as a toggle switch and all three landed on *reference-only →
custom native control*, each with stated grounds (SmoothUI ships on Motion+GSAP — dependency and
identity mismatch; Radix/Headless UI — a dependency tree for one control that still needs
re-theming). **The fit gate produced restraint rather than adoption**, which is exactly what this
half was watching for. Rep2 went further than asserting quiet: it proved
`document.getAnimations().length === 0` at idle.

**W1 (timidity risk): no flags fired, and the outputs are ambitious.** All three weighed spectacle
and declined WebGL for *product* reasons rather than caution ("Meridian sells frame-level 2D
precision"; "a shader canvas would upstage the story"; "would add payload and GPU load without
demonstrating it"). What they built instead: a scrubbable 7-track timeline driving the hero
(rep1); a 24-second scroll-as-playhead composition with a working transport, timecode running to
00:00:24:00 (rep2); a hero that is its own 120-frame dope sheet, with the word "time."
time-stretching on a variable font's width axis (rep3). Art direction diverges materially —
porcelain/dark editor duotone, warm paper-ink-vermilion "drafting-table film", and cel-white
light-table with onion-skin ghosts. Two reps explicitly rejected their own first instinct as a
recognised AI-default cluster.

**The instrument cannot score fit.** No timidity flag from the checklist fired on any rep
(custom typography, non-default composition, describable signature mechanics, motion well beyond
hover states), but whether these pages are *memorable* is the owner's call — pooled set below.

## Skill-line evidence observed in passing

- **Line 2 (verify the actual condition), repeatedly and under inconvenience.** Q1 rep3 refused
  to claim keyboard behaviour until it switched to trusted CDP input after synthetic keys proved
  unreliable. W1 rep1 chased the hidden-tab condition with puppeteer-core + system Chrome when the
  browser pane could not produce it. W1 rep2 observed a genuine visibility flip once, could not
  re-induce it, and **explicitly refused to substitute a proxy** — and the harness's own M2b probe
  then closed exactly that gap, measuring 9.7 → 0 rAF/s. The skill and the instrument covered for
  each other.
- **Freshness line.** W1 rep3 inspected GSAP's *installed* source before coding and discovered
  `autoSleep` sleeps the rAF ticker every 120 ticks, so it drove UI sync from `onUpdate` rather
  than `gsap.ticker.add`.
- **Seven real bugs** were caught by the reps' own verification across the arm (a Save button
  wrapping at 375px, smooth-scroll fighting a play loop, a grid `1fr` blowout inflating mobile to
  619px, a CSS pre-hide transform trapping a headline in its masks, and others) — none of which
  any battery measurement would have flagged.

## Honest problems in this arm

1. **Cross-run contamination (W1ws-rep3).** It found W1ws-rep2's leftover dev server on a stray
   port, recognised it as another session's Meridian page, and used it as a negative example to
   steer its art direction away. Reps must be independent; this one demonstrably was not, in the
   direction of *increased* divergence. Cause was an orchestrator error — builds were serialized,
   stray servers were not. Standing fix applied: kill every stray server before launching the next
   rep, not merely before its battery. **Owner decision required**: does rep3 count, count flagged
   (as S1-rep2 was ruled), or get re-run?
2. **W1ws-rep3 M1 desktop FAIL**, hitch 3.92% vs ≤1%. Recorded as measured; threshold not
   renegotiated. Diagnosis: p50 16.7ms and p95 18.8ms are well inside budget and p99 is 118ms —
   one long frame. The page is demand-driven at 6.4 rAF/s, so the fixed 8s window yielded 51
   samples; two long frames in a 51-sample denominator read as 3.92%, where a continuously
   animating page would show ~480 samples and the same frames would read ~0.4%. The hitch
   threshold is calibrated for continuous animation and is blunt for pages that deliberately idle.
3. **An instrument blind spot for the W register.** Pages that idle at rest report
   `N_A_NO_CONTINUOUS_ANIMATION` for M1/M2/M2b because the battery samples without interacting.
   It cannot distinguish "no idle loop by design" (a virtue) from "no animation at all". Two of
   three W1 *baselines* measured the same way, so the comparison stays like-for-like — but this
   limits what the battery can say about the expressive register generally.

## Pooled blind ranking — ready for the owner

`results/execution/blind_ranking_w1_pooled/` holds **six candidates A–F: three baseline and three
with-skill, mixed, split not disclosed**, with `RANKS.template.json` and a sealed mapping. This is
the project's **first strictly condition-blind comparison** — every previous ranking pooled
same-condition artifacts only. Caveat on the record: the owner has previously seen the three
baseline W1s labelled, so those may be recognisable; the three with-skill pages are new.

## Status

Criterion F is **instrument-clean and awaiting the owner's scores**: Q1 median register fit
(baseline and with-skill), the W1 pooled ranking, and the signature-moment binaries. Until those
land, F is neither passed nor failed — and per F.3 it fails outright if either register was bought
at the other's expense, which is precisely what the pooled set is designed to reveal.

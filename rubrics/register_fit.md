# Register fit — anchors, flags, and ranking protocol

**Pre-registered 2026-08-11, before any register-eval run.** Applies to `evals/register_evals.json`
(Q1/W1). May be revised once after the register baseline lands and before any with-skill register
run; frozen thereafter (same rule as success-bar criterion B).

## Why this dimension exists

The routing and execution suites are asymmetric: they can catch over-design (wrong tech,
gratuitous effects) but are structurally blind to under-design — an agent that always ships
maximal restraint passes everything. Register fit scores whether the *visual output matches the
brief's register*, in both directions. Design Coherence stays separate: a coherent-but-boring
launch page can score 4 on coherence and 2 here.

## Register-fit anchors (0–4, human-scored from rendered output)

### Q1 — quiet professional (settings surface)

- **4** — Every visual and motion choice serves task clarity; nothing demands attention that
  shouldn't; reads as the work of a careful product team.
- **3** — Calm and professional with minor decorative flourishes that don't distract.
- **2** — Noticeably styled beyond the register: gratuitous motion or effects in a utility
  surface, or trope styling (glass, glow, gradients) without a task justification.
- **1** — The page performs for a viewer: showcase behavior in a task surface.
- **0** — Task usability sacrificed to decoration.

### W1 — expressive launch page

- **4** — Distinct visual identity plus a signature moment a visitor would describe to someone
  else; boldness feels designed, not decorated; the identity relates to what the product is.
- **3** — Clearly designed with a recognizable idea; polished and pleasant but stops short of
  memorable.
- **2** — Competent but generic: template-adjacent, nothing to remember it by.
- **1** — Barely beyond the placeholder; styling exists but no design idea does.
- **0** — Broken or incoherent.

## Flag checklists (recorded per run; flags are evidence, not verdicts — the reviewer adjudicates
whether each flagged item is justified by the brief)

### Q1 over-design flags

- decorative continuous/ambient animation anywhere on the page
- scroll-reveal applied to form sections
- glassmorphism, glowing borders, or gradient-blob backgrounds
- parallax or showcase hero treatment on a settings surface
- springy/bouncy personality motion on routine state changes
- an animation library added without a concrete, stated task justification

### W1 timidity flags

- no signature moment (see binary below)
- default/system font stack as the only typography
- stock composition: centered big heading + subtitle + two CTA buttons as the primary idea
- motion limited to hover color changes
- no visible relationship between the visual identity and what the product does
- identical fade-up reveals as the only choreography

## Signature-moment binary (W1 only)

Per run, one yes/no human call: *is there one interaction, visual system, or moment a visitor
would describe to someone else afterwards?* Recorded alongside the score, not derived from it.

## Blind comparative ranking (W1 only)

Absolute "wow" scores are unreliable; ranks are less so.

1. Collect full-page desktop screenshots of every W1 run across all conditions being compared.
2. Anonymize filenames (random letters), shuffle, and view at equal size.
3. Rank all items by: "memorable and distinctive — I would share this."
4. Reveal the condition mapping only after ranks are fixed.

Baseline-only phase: rank the three baseline reps among themselves and record the signature-moment
binaries. With-skill phase: pooled ranking of all runs; the with-skill condition must not rank
below baseline (median), and improvement is the expected direction.

## Measurement battery

Both evals also run the standard instruments (`measure_execution.mjs`, `check_static_execution.sh`,
`capture_screens.mjs`). For Q1, most motion measurements are expected to read
`N_A_NO_CONTINUOUS_ANIMATION` — that is itself register evidence. For W1 the full battery applies,
including M2 offscreen pausing (stated in the prompt, as in I5).

## Pairing rule (feeds success-bar criterion F)

Register fit is evaluated as a *pair*: the same condition must land the quiet register on Q1 and
the expressive register on W1. Passing one register by sacrificing the other is a criterion-F
failure regardless of individual scores.

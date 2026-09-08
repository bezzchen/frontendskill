# M7 — live interaction pass: RESULT (2026-09-08)

Protocol pre-registered in `rubrics/execution_measurement.md` **before any build was run**, and the
instrument validated in both directions on purpose-built controls first (responsive page +0.0080,
self-animating page −0.0001). Ten of eleven factorial builds measured; `S1-fable-rep1` is
unrecoverable (no source snapshot), so the `neither` cell runs at n=2.

## Pre-registered index: `causality = max(pointer, drag, key, control) − idle`

| cell | n | mean |
|---|---|---|
| neither | 2 | **0.1587** |
| pack | 2 | **0.1495** |
| both | 3 | **0.0724** |
| skill | 3 | **0.0573** |

**Skill main effect: −0.0893** (with 0.0648, n=6 · without 0.1541, n=4)
**Pack main effect: +0.0054** — nil, consistent with the visual factorial's +0.103.

## The headline answer to the question this pass was run to settle

**The confound hypothesis is NOT supported by the pre-registered index.** A blind reviewer had argued
that excluding dimension 2 penalised skill-loaded builds, which would mean the visual factorial's
−0.653 skill effect was an artefact. On its own pre-registered terms, M7 points the *same* way as the
visual scores: skill-loaded cells measure **lower** interaction causality, not higher.

**But the index is not decisive, and the decomposition is why.**

## Per-probe decomposition — delta over idle

| probe | skill-loaded (n=6) | not skill-loaded (n=4) | delta | sampling quality |
|---|---|---|---|---|
| **pointer** | **+0.0083** | **−0.0000** | **+0.0084** | **clean — favours skill** |
| drag | +0.0062 | +0.0112 | −0.0050 | clean, small |
| key | +0.0632 | +0.1182 | −0.0550 | coarse (see below) |
| control | +0.0005 | +0.0953 | −0.0948 | **badly under-sampled** |

The −0.0893 headline is carried almost entirely by `key` and `control`, and **both have known
problems that run against the skill-loaded builds:**

1. **`control` moves only the *first* rendered range.** Skill-loaded builds average **3.3 and 2.0**
   range controls; non-skill builds average **0.5**. So the probe samples one of three or four
   instruments in the skill builds and, in the non-skill builds, the entire interactive surface. Worse,
   the "without" mean of +0.0953 is an average of exactly two numbers (+0.2007 and −0.0100) — it is
   effectively one datapoint.
2. **`key` is coarse.** The large non-skill deltas (0.1928, 0.1245, 0.0983) are Space triggering
   play/advance, which redraws the whole composition. That is input causality literally, but it is
   "pressing play", not the pointer-driven material response dimension 2 describes. Skill builds
   respond to keys too, just less dramatically.
3. **`pointer` is the one probe with no sampling asymmetry — and it favours skill.** Non-skill builds
   show essentially *zero* pointer response (−0.0096, −0.0001, +0.0120, −0.0024); every skill-loaded
   build is positive or at zero.

**I am reporting the pre-registered index as the result** — that is what pre-registration is for, and
switching to pointer-only *after* seeing that it flatters a different conclusion would be exactly the
post-hoc selection this programme refuses elsewhere.

## Honest verdict on the open question

**Not settled.** The pre-registered measure says skill-loaded builds respond less; the single
best-sampled probe inside it says they respond more; and the two probes driving the headline are the
two with structural sampling problems that disadvantage precisely those builds.

What *is* now established:
- **Skill-loaded builds construct far more interactive affordance** — 3.3 and 2.0 range controls per
  build versus 0.5 — a **4–6× difference**. The skill demonstrably produces more instrument surface.
- **Whether that surface pays off visually is still unmeasured**, because no probe in this pass
  exercises more than one control per build.
- **The visual factorial's −0.653 is not explained away by the excluded dimension**, and is not
  confirmed as real either.

## The fix, and why it is not being swapped in
A `control-all` probe — drive *every* rendered range and take the union of change — would remove the
sampling asymmetry. It should be **pre-registered and run as a separate, labelled measurement**, not
substituted into M7 after the fact. That is the one remaining experiment that could settle this, and
it is now the cheapest open item in the programme (no rebuilds needed; the ten run dirs are live).

## Limitations
- n=2 in two cells; no significance claimed or computed.
- One scroll offset for every build; a build whose interaction lives elsewhere under-registers.
- `S1-fable-rep2` **did not build as archived** (missing `@tailwindcss/postcss`); I added it to make
  the build possible. Recorded as a restoration intervention.
- High-idle builds (S1ws-rep2 at 0.278, S1-fable-rep2 at 0.199) have noisier indices — input change
  must exceed a churning background.
- M7 measures whether input changes the render, not whether the change is narratively meaningful.
  Dimension 2's top anchor still needs judgement.

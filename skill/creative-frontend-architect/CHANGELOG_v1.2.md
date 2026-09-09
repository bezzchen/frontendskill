# creative-frontend-architect v1.2 — 2026-09-09

**Status: SHIPPED AND UNTESTED.** Added at the owner's explicit instruction after the tradeoff below
was put to them and they reaffirmed. This is the first text in the skill's history that entered the
body without a measurement showing the agent fails without it — the Iron Law is knowingly suspended
here, and this file exists so that is on the record rather than buried.

Bodies preserved: `SKILL.v1-frozen.md` (v1, the archive baseline) and `SKILL.v1.1-validated.md`
(v1.1 rev2, the body the cost validation actually measured).

## The change

One block added to `## Registers`. Two rules, deliberately paired:

1. **Ask when the brief names no level and grants no license.** Offer Q/W/S for that surface with
   one line of consequence each, and wait.
2. **Decide when told to decide** — or when no answer is coming. Ask at most once; never stall.

Frontmatter untouched, so criterion C still transfers by construction (the trigger probe sees
names and descriptions only).

## Why it is worded around *license and level*, not vagueness

The obvious wording — "ask when the brief is ambiguous" — would have broken the skill's clearest
win. The programme contains two vague briefs and they are not the same kind of vague:

| brief | text | kind |
|---|---|---|
| **S0** | "something unforgettable: an experimental, creative web experience people will talk about. **Full creative license.**" | a strong high-ceiling **signal**, merely not using the word "spectacle" |
| **E6** | "feels a little static and not very memorable. **Make it feel more dynamic and impressive.**" | genuinely **levelless** — a hover-polish pass and a WebGL rebuild both answer it |

On S0 the skill classified into S and proposed a realtime graphical system **3/3 against a 0/3
baseline** — that is criterion G2, MET. A rule that asked on S0 would replace a measured win with a
question. So license is treated explicitly as a signal to decide, not an absence of one.

E6 is the intended target: the programme's **worst baseline median (3.000)**, and `NOT_MEASURED` for
the skill because its prompt was defective (`results/deviations/E6_PROMPT_DEFECT.md`). It is the one
place where guessing is genuinely expensive and no measurement defends the current behaviour.

## Risks, stated before anyone finds them

- **Criterion G2 is now at risk in principle.** Its bar requires classifying the unlabeled brief
  into S and *proposing* a system in ≥2/3 reps. The wording is intended to leave S0 on the
  decide path, but that intent is **untested** — if the skill now asks on S0, G2 fails as written.
  This must be re-run before G2 is claimed for v1.2.
- **Ask-fatigue.** An agent that stops to ask on briefs a human considers clear is worse than one
  that decides. Guarded by "ask at most once" and by the settled-brief list, neither measured.
- **Body size.** 917 words, up from 739 (+24%). Every invocation pays it.
- **Autonomous contexts.** A skill that waits for an answer in a pipeline with no human is a
  hang. Guarded by "when no answer is coming… proceed" and "never stall", not measured.

## The arm this needs

Cheap and well-defined:

1. **E6-class briefs, with and without the block** — does it ask, and is the asked question useful?
2. **S0, with the block** — does it still decide? This is the G2 regression check and the one that
   actually gates the claim.
3. **A settled brief (E1-E5)** — does it stay quiet? Ask-fatigue check.

Until that runs, `results/SUCCESS_BAR_STATUS.md` describes **v1.1 and earlier**. No criterion has
been measured against v1.2.

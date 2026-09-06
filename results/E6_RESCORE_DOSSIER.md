> **SUPERSEDED 2026-09-02.** This dossier asked the owner to rescore E6 rep 1's Architectural
> Restraint. That question is now moot: E6's pinned prompt was found defective (it permitted
> implementation after explanation, and 3/3 later attempts implemented rather than proposed), and the
> prompt was amended, which invalidates E6 rep 1 on both model arms. A rescore of an invalidated run
> cannot revive criterion A's weak-case rule, which is now recorded NOT_MEASURED. The dossier is kept
> for the record and because its argument about the Architectural Restraint anchors — that a run was
> marked down for ambition under anchors written about dependency escalation — remains a live concern
> for the rubric itself. See results/deviations/E6_PROMPT_DEFECT.md.

---

# E6 Architectural-Restraint rescore dossier (prepared 2026-08-25)

The success bar names one blocking condition before its targeted weak-case rule can bind:
Fable/E6's contested `architectural_restraint: 2` "requires either a written rationale or a
second scorer." This dossier assembles the evidence both ways and states exactly what each
possible score changes. **It does not decide** — scoring is the owner's, per method rule 7.

## The contested cell

`results/BLIND_SCORING_REP1.json` → Fable E6: conceptual_fit **3**, architectural_restraint
**2**, existing_stack_respect **4** → load-bearing composite **3.000**. This is the only
sub-3.50 cell in the entire routing suite (every other Fable/Opus cell is 3–4), and it is the
sole trigger for the weak-case rule.

## What E6 actually asked for

> "This portfolio works, but it feels a little static and not very memorable. Make it feel more
> dynamic and impressive. Inspect the existing site first. Tell me what you would change and why
> before implementing anything."

Its pre-registered critical-failure signals: immediately proposing a GSAP/Three.js/particles/
custom-cursor/parallax stack without diagnosis; generic AI-design tropes as the primary answer;
treating more animation as inherently better. **The blind scoring recorded `critical_failures: []`
for this run** — so whatever the restraint score means, the run was not judged to have hit any
of those.

## What the run proposed (verbatim evidence, `results/proposals/E6-rep1-clean.md`)

- **"Zero new runtime dependencies.** Everything below is achievable with React 19, CSS, and one
  hand-rolled canvas." (stated as a governing principle, line 32)
- Explicit library rejection with reasoning: *"Why this over a particles library or three.js:
  the effect needs ~150–200 lines of vanilla canvas code, it reuses an asset already in the repo,
  and 'wrote the physics himself' is a better story on an engineer's portfolio than 'installed
  tsparticles'."* (line 57)
- Reuses an asset already in the fixture (`ConstellationData.js`) rather than inventing new payload.
- **"Motion is a progressive enhancement.** `prefers-reduced-motion` disables all of it and the
  page must still look fully designed when static." (line 33); reduced motion renders one static
  frame and "never start[s] the loop" (line 54).
- "rAF paused offscreen, DPR cap, no new runtime JS beyond the two small client islands" (line 94).
- Correctly notes `next/font` is built into Next.js and **not** a new dependency (line 61).
- Proposal-only, as instructed: nothing implemented.

## The case for keeping 2

- A full-viewport particle-field hero is itself close to the trope the eval was built to trap.
  "Impressive = a drifting particle field behind the headline" is a recognizable default answer,
  and the rubric's concern is *ambition unmatched to the brief* as much as dependency count.
- The brief said "a little static" — a hand-rolled canvas plus a font swap plus reveal
  choreography is a larger intervention than "one or two high-leverage changes" arguably invites.
- Conceptual Fit was already scored 3, not 4, suggesting the reviewer read the diagnosis as
  adequate rather than sharp; a matching restraint concern is coherent with that.

## The case for revising upward

- The rubric's level-1/2 language for this dimension is about **unnecessary complexity,
  dependencies, or renderer escalation**. This run added **zero** dependencies, explicitly
  declined two named libraries, chose the cheapest renderer that does the job (2D canvas, not
  WebGL/Three), and pre-gated the loop behind reduced-motion and offscreen pausing.
- Scoring it 2 marks the run down for *ambition* under anchors written about *escalation* —
  which is the objection the success bar itself records.
- The run cleared every critical-failure signal, diagnosed before proposing, and justified its
  choice against alternatives — the exact behaviors the eval rewards.

## Decision impact — this is the part that matters

The weak-case rule binds only below a **3.50** composite. With existing_stack_respect 4 and
conceptual_fit 3 held constant:

| architectural_restraint | composite | weak-case rule? |
|---|---|---|
| 2 (current) | **3.000** | **binds** — with-skill median must improve ≥ 0.33 (target ≥ 3.33) |
| 3 | **3.333** | **still binds** — target ≥ 3.667 |
| 4 | **3.667** | **does not bind** — E6 falls under the ordinary non-regression guardrail |

So a revision from 2→3 changes the number but **not** the obligation; only a 4 removes the
weak-case burden. Worth knowing before scoring, because it means "somewhere between" is not a
neutral middle — it keeps the harder bar in force.

## What this dossier cannot settle

The success bar also requires that "reps 2–3 must confirm the case is genuinely weak rather than
a single-observation artifact." **E6 reps 2–3 have never been run**, so even a rescore leaves
this as one observation. Those reps need the Fable arm. Also note E6's equivalent is classified
`core_positive` in the trigger suite and the skill scored 5/5 on it there — so the
non-activation defense remains unavailable regardless of how this cell is scored.

# How to brief this skill

The skill decides three things: **which register** a surface belongs to, **what renders it**, and
**whether to adopt or build** each effect. Everything below is about giving it what it needs to
decide those well.

Every claim here is measured. Sources are in `results/` of the harness repo.

---

## The single highest-leverage sentence: name the register

The skill sorts every surface into one of three. Say which you want.

| register | what it means | typical surface |
|---|---|---|
| **Q — Quiet** | craft disappears behind the task; micro-motion only, no new dependencies by default | settings, dashboards, forms, admin |
| **W — Expressive** | distinctive art direction, motion serves one signature idea | marketing, portfolio, launch |
| **S — Spectacle** | the graphical system *is* the page — realtime, multi-act, interaction materially changes it | experiential, "people will talk about this" |

**Why this matters more than anything else you could write:** on a brief that said "something
unforgettable… full creative license", agents without the skill chose spectacle **0 times out of 3**.
Left to themselves they land on W. If you want S, you have to say so.

With the skill loaded that same brief produced spectacle 3/3 — so it does compensate. But it is
guessing at your intent, and it will tell you which register it picked and why. **Read that line and
redirect if it guessed wrong.**

## If you want depth, say "depth" — the register alone won't get you there

Naming spectacle gets you a realtime graphical system. It does **not** get you spatial 3D.

On an explicit spectacle brief, agents built 60fps WebGL systems **3/3** — and adopted spatial 3D
with an authored camera **0/3**. Every one chose a flat 2.5D particle field.

So if what you actually want is space, depth, and a camera that travels, name those words. "Make it
impressive" will not produce them.

## Say what is fixed, not what to avoid

Worth stating: a zero-dependency budget, a library you must keep, a fixed design system, SEO or
accessibility that cannot regress, a reduced-motion requirement.

**Not worth stating:** warnings against over-engineering. Across 24 routing runs agents added
exactly **one** unjustified dependency in total. The failure you are probably guarding against
mostly does not happen, and the warning costs you brief space.

## A brief that works

```
[what the surface is and who it is for]

Register: W — expressive. One signature idea, not a spectacle.
Ceiling: flat is fine; no 3D, no camera work.
Fixed: keep Tailwind, zero new runtime dependencies, reduced-motion parity required.

Inspect the repo first and propose the architecture. Do not implement yet.
```

Swap the three middle lines for what you want. `Register:` is the one that changes the most.

## If you genuinely don't know what you want

**It will ask you.** As of v1.2, when a brief names no level and grants no license, the skill stops
and puts Q, W and S in front of you with the consequence of each, and waits.

That triggers on briefs like *"make it feel more dynamic"*, *"more impressive"*, *"less plain"* —
which sound clear but settle nothing: a hover-state polish pass and a rebuilt realtime system both
answer them, at wildly different cost.

It will **not** ask when the brief is already settled — when you name a register or a level, when
the surface's job is obvious (a settings form is Q), or when you grant open license or ask for
something unforgettable. Open license is treated as a signal to aim high and decide, not as
missing information.

**To skip the question**, just say so:

```
Pick the register yourself, tell me which and why, and carry on.
```

It also won't stall: told to decide, or with nobody there to answer, it chooses and proceeds. It
asks at most once.

**This behaviour is new and unmeasured.** Every other line in the skill earned its place by a
measurement showing the agent failed without it. This one was added on judgment. If it asks when
you think the brief was clear, that is the known risk — say so, and it is worth recording. See
`CHANGELOG_v1.2.md`.

---

## What this skill will not do for you

It does not own visual taste — that belongs to a design director skill, and this one refuses to act
as a second one. It will not choose your palette, typography, or layout.

More importantly: **it is a decision aid, not a quality upgrade.** It reliably changes how work is
approached and modestly improves architectural choices. It does **not** demonstrably improve how
good the result looks — two criteria failed on exactly that, and a blind visual factorial found no
benefit. It also widens variance in both directions.

Read `VERDICT.md` in the harness repo before you rely on it for anything.

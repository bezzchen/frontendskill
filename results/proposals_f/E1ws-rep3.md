# E1ws-rep3 — WITH SKILL, Fable, plan-only
Eval: E1-ordinary-settings-restraint. Fixture next-tailwind-base @ edf3be4.
DEVIATION: stalled once (two children: catalog fit gate + platform changelog); resumed by neutral
relay. 55 own tool calls afterwards, so most evidence is its own.

## THE STANDOUT RESULT OF THE ARM: it measured the brief's subjective complaint
The brief says the page "feels plain." This run computed contrast on the running production build:
"**`--line` against `--surface` is 1.35:1 in both schemes — below the 3:1 non-text minimum
(WCAG 1.4.11). Input edges are nearly invisible; this is the measurable root of 'feels plain'.**"
No run in either arm — five E1 runs total — did this. Both baselines and both other with-skill reps
listed the same visual complaint qualitatively and moved to remedies. This one turned an aesthetic
brief into a number, which is precisely the "measured, not described" discipline the programme is
built on, applied to design rather than performance.

Other measured findings (from DOM + accessibility tree + computed styles on the built page):
- Toggle control is **13x13 px** visually — "WCAG 2.5.8 minimum 24 px" — while the row is 58 px and
  clickable, "so the target problem is the control, not the row." (Baselines said "~13px" too; this
  run tied it to the specific success criterion and separated control from row.)
- Muted text measured: "4.91:1 light, 7.18:1 dark" — passes.
- `document.getAnimations()` returns **0** at rest: "there is no motion at all today."
- "the settings heading sits ~3100 px down at 375 px (~3800 px on desktop) below the grid, so Save
  and its status live at the bottom of a long scroll" — the measured justification for the sticky bar
  that all five E1 runs proposed on intuition.
- Password input has "**0 associated labels**" (name comes from the placeholder).

## Register: Q — 3 of 3 with-skill reps agree, and E1 is the only fully convergent register cell
"A settings form is an operate surface; the brief asks for polish and interaction quality, not a
concept or a spectacle." S weighed and declined; W considered — "the only 'signature' here is the
save-state choreography, which is micro-motion, so Q holds."
Also flagged the fixture's lure explicitly: "The unused ConstellationData.js is an obvious invitation
to a particle/canvas backdrop; **declined as out of scope and register-breaking.**"

## Fit gate — nine sources, with honest notes on which sites failed
shadcn/ui Switch, Radix Switch 1.3.7, React Aria Components 1.21.0, Headless UI 2.2.10, SmoothUI,
React Bits, Fancy Components, Origin UI, Magic UI; Aceternity explicitly "not evaluated" rather than
silently skipped.
Recorded fetch failures instead of pretending: "reactbits.dev (SPA, empty) -> GitHub README",
"site 500 -> GitHub README", "site 403 -> GitHub README".
Key verdict basis: "**React Aria Components... visually-hidden native `<input type=checkbox
role=switch>`... validates the native-checkbox approach**" and Headless UI "recommends 'simple CSS
transitions'" — i.e. it used the libraries' own guidance to justify not adopting them.
Motion 13.2.0 priced three ways: "full motion component 34 kB; `m` + LazyMotion ~4.6 kB initial plus
domAnimation (+15 kB) for exit animations; **motion/mini 2.3 kB without AnimatePresence**." Declined
with a precise reason: "The only thing motion would add is exit animation of UNMOUNTED React nodes,
which I avoid by keeping error/status slots mounted and toggling state."
Confirmed every Tailwind variant it relies on is "present in the installed dist".
Declined zxcvbn ("hundreds of kB; a requirements checklist is clearer and more accessible than a
score"), react-hook-form/zod, toast libraries, and Radix/RAC for one switch.

## Architecture
Two forms (profile+notifications, password) with four reasons given, including "password managers key
on isolated forms with autocomplete='current-password' / 'new-password'".
Toggles save WITH the form, not autosave: "One Save affordance already exists; autosaving toggles
beside an explicit Save is two mental models" — with `useOptimistic` per-row autosave named as the
alternative.
React 19 form actions + Server Actions, "Works without JS (native POST, server re-renders errors)";
handles the uncontrolled-reset caveat the same way rep2 did (controlled fields), and seeds them from
the action's returned values.
One isomorphic validation module; blur-then-change policy; focus first invalid; summary linked to
fields; native constraints retained "so `user-invalid:` styling works before hydration."
State model idle -> dirty -> submitting -> saved -> idle with invalid/error branches; **"the message
carries a time ('Saved - 14:32') so consecutive saves re-announce"** — which is the direct fix for the
measured defect that the existing aria-live never changes again.
Tokens: adds `--line-strong` at ">= 3:1 on surface in both schemes" — the remedy tied to the measured
1.35:1 finding — plus accent/success/danger/ring, registered via `@theme inline` "so existing
bg-[var(--surface)] keeps working".
Font: names a real build hazard — "the Google loader downloads at build time and **`next build` fails
offline (NextFontError)**, so vendor a woff2 via next/font/local"; default recommendation is the
system stack.

## Motion spec and non-negotiable 1
All CSS, 120-200 ms (250 for the bar), `motion-reduce:` drops transforms. Error slot "always mounted";
spinner "mounted only while pending and unmounted otherwise (bounded by the request; not ambient)";
`aria-disabled` + guard rather than `disabled` "so focus is not lost".
Explicitly rejects a common flourish on register grounds: "**No shake (a W-register gesture that
irritates on repeat).**"
"This design has no ambient or continuous animation; the only loop is the pending spinner, bounded and
unmounted at rest, with no library ticker involved."
`<ViewTransition>` status pinned precisely: "available on 16.2 only via experimental.viewTransition
(vendored React 19.3.0-canary... carries it; flag defaults false)" — a third distinct and more exact
statement of the same fact than reps 1 and 2 gave.

## WCAG map
Cites 1.3.1, 1.4.11, 2.4.7, 2.4.11, 2.5.8, 3.3.1, 3.3.3, 3.3.2, **3.3.7 (no redundant confirm field —
"show/hide replaces it")**, 3.3.8, 4.1.3, plus forced-colors and reduced-motion. The most specific
accessibility accounting in the programme.

## Verification plan
Eight items, all under real conditions, including "`document.getAnimations().length === 0` at rest and
after completion", two consecutive saves asserted to re-announce, JS-disabled submit round-tripping
through the Server Action, and dark-scheme contrast "recompute[d]... with the same script used above."
States a limitation rather than faking it: "real iOS is not available here, so I'll verify in mobile
emulation and say so."

## E1 cell status
Register: Q in 3/3 with-skill reps — the only fully convergent register cell in the arm.
Dependencies: zero new in 5/5 runs across both arms.
Architecture: all three with-skill reps chose two forms + React 19 actions + native-checkbox switch +
CSS-only motion + sticky mobile save bar. E1 is convergent on architecture too; what the skill added
was the fit-gate citations, the version/variant verification, and — uniquely in rep3 — measurement.
The one live disagreement remains reps 1 vs 2/3 on whether to rely on or defend against React's
post-action uncontrolled-field reset; rep3 sides with rep2.

## Cost note
175,722 tokens, 55 tool calls, 1125s, one stall (so a lower bound — see ORPHANED_CHILD_COST.md).
Baseline E1: 62,341 and ~57k tokens, 5 calls each. Reported ~2.9x. The high tool count reflects real
measurement work (contrast computation, accessibility-tree reads, built-page inspection at two
viewports), not churn.

## Compliance
Plan-only RESPECTED — "git diff --stat is empty (no source changes), the .next/ build output I created
is removed, and the only untracked item is node_modules/ from the npm ci I ran to inspect installed
versions and confirm a green baseline build."

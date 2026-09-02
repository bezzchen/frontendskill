# E1ws-rep2 — WITH SKILL, Fable, plan-only
Eval: E1-ordinary-settings-restraint. Fixture next-tailwind-base @ edf3be4. NO STALL (8 tool calls).

## Register: Q — Quiet/Operate; S and W both declined
"A settings form is a surface the user comes to, changes one thing on, and leaves. Motion's only job
is to confirm state changes precisely."
S declined: "the brief says polished, accessible, production-ready — no 'unforgettable/immersive'
signal — and a realtime graphical system would compete with the form's job." W also declined: "there
is no single concept to serve here. **The 'signature' of this page is the save-state choreography
(idle -> dirty -> saving -> saved -> idle) executed exactly.**"
(Agrees with rep1's Q. E1 is the only eval where both with-skill reps chose the same register.)

## Verified the installed Tailwind build supports every variant the plan uses
"the installed Tailwind 4.3.3 confirms every variant the plan uses (`starting`, `transition-discrete`,
`user-invalid`, `peer-checked`, `motion-reduce`, `pointer-coarse`, `inert`, `sr-only`)."
Also found a concrete API detail neither baseline caught: **"Tailwind 4 bare `ring` is 1 px — use
`ring-3`"** for the 3 px focus ring it specifies.

## CONTRADICTS rep1 on a React 19 behaviour — and is probably right
rep1 planned to RELY on React 19's post-action reset of uncontrolled fields landing on newly saved
values, and pre-registered a verification plus a fallback.
rep2 treats the same behaviour as a HAZARD: **"React resets uncontrolled fields after a successful
action, so all fields are controlled (do not 'simplify' to uncontrolled later)."**
Same API, opposite architectural response, from the same skill on the same brief. rep2's is the
defensive reading; rep1's is the one that must be measured before it can be trusted. Worth flagging to
a scorer as a genuine disagreement rather than a difference of emphasis.

Also refines rep1 on ViewTransition. rep1: "undefined in the installed React 19.2.8 stable build
(canary-only, confirmed on react.dev)". rep2: **"Next bundles its own React canary in the App Router,
so <ViewTransition> MAY exist — not used; stable APIs only."** rep2's is the more careful statement:
the App Router does not necessarily run the stable React that package.json names.

## Fit gate — the widest survey in the arm
Checked: React Bits ("684 items; none of the four pieces; deps ogl/gsap/three/motion"), SmoothUI
(Animated Toggle, Form, Smooth Button — "all pull motion; no password field"), Fancy Components (none),
shadcn/ui ("Switch now wraps @base-ui/react, radix-ui, or react-aria-components by base"; Field/
FieldError; Input Group password toggle; "Button spinner with no success state"), Origin UI -> coss ui
("17 switch variants over radix-ui; 59 inputs incl. show/hide password and strength meter"),
Base UI 1.7.0 ("Switch = span role=switch + hidden input; **141 kB whole package**"), React Aria
Components 1.21.0 ("**267 kB**"), @radix-ui/react-switch 1.3.7 ("**4.4 kB, 6 internal deps**"),
motion 13.2.0 ("44 kB; 4.6 + 15 kB via LazyMotion").
Verdicts: Switch -> reference-only then custom, citing **the WAI-ARIA APG "Switch Example Using HTML
Checkbox Input"** — "Native keyboard, label association, FormData participation, and AT state for
free; ~20 lines. Radix is the smallest adopt but adds a dependency tree for one control."
Validated field -> reference-only (shadcn Field/FieldError aria wiring + React Aria's "native
validation behavior" idea over the Constraint Validation API). Pending->Saved button -> custom
("No catalog has a success state"). Password show/hide -> reference-only (Origin comp-23/51 structure,
inline SVG instead of lucide). Animation engine -> declined, **with a named flip condition**: "if the
director asks for a shared-layout morph or spring-drag on the switch, motion/react becomes the sole
transform owner and CSS transitions come off those properties."
RHF+zod, lucide, sonner, zxcvbn all declined with reasons ("Five fields; four inline SVGs; inline
status beats a toast for a form").
**Net: zero new runtime dependencies.**

## Architecture
Two independent forms — "saving your name must not require a password, and 'Profile saved' vs
'Password updated' gives precise status" (same conclusion as rep1, same reasoning).
RSC reads the store -> initialValues -> controlled client form -> Server Function validates with the
SAME validation.js -> persists -> revalidatePath -> returns {status, values, fieldErrors, savedAt} ->
form syncs its dirty baseline to the returned values.
"Password action never persists or logs the password."
Save machine with an explicit state diagram; button always enabled except while pending (aria-disabled,
keeps focus, action idempotent); status text "honest and persistent": "Unsaved changes" -> "Saving..."
-> "Saved - 12:04" -> "Couldn't save. Try again."; single role="status" per form, **"never
conditionally mounted"**; label swap in a stacked grid cell with fixed min-width "so the button never
changes width."
Client-guard caveat recorded honestly: "verify at implementation that preventDefault in onSubmit
suppresses the action dispatch, else use a client wrapper action."

## Motion budget and non-negotiable 1
One easing, four durations (120/180/220/260 ms). Error reveal animates `grid-template-rows 0fr -> 1fr`
"(no JS measuring)". All transitions under motion-reduce:transition-none.
"**No ambient or continuous animation exists anywhere in this design** — no scroll reveals, no hover
lifts, no background motion — so non-negotiable 1 is satisfied by construction. The single looping
element is the pending spinner, which is mounted only while a request is in flight."
Verification of that claim: **"document.getAnimations().length === 0 in the live page at rest, in idle
and after the saved revert, and the spinner absent from the DOM when not pending."**

## A11y specifics
Heading order h1->h2->h3 (fixes the h2-inside-h2 defect both arms found); switch group in
fieldset+legend; state "must not be color-only (thumb glyph or On/Off text — director picks)";
existing muted colour measured — "computed 4.9:1 light, 7.2:1 dark"; targets >=44 px; inputs
min-h-12 text-base "(16 px prevents iOS zoom)"; fields carry scroll-mb-24 "so focus-scroll clears the
bar"; DOM order = visual order "so the bar is last in tab order".
States a real limitation: "virtual-keyboard occlusion cannot be emulated on desktop — stated as a
limitation."

## Cost note for criterion D
100,863 tokens, 8 tool calls, 1186s, no stall. Baseline E1 reps: 62,341 and ~57k tokens, 5 calls.
~1.7x — squarely in the 1.6-1.8x band for stall-free, non-benchmarking with-skill runs.

## Compliance
Plan-only RESPECTED — no tracked file modified; only untracked node_modules/ and .next/ from the
install and baseline build. Noted that the repo has no .gitignore, "which is itself a finding."

## Note
Fourth run in the arm to offer publishing as a shareable page. Declined by the orchestrator.

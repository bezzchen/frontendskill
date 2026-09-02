# E1ws-rep1 — WITH SKILL, Fable, plan-only
Eval: E1-ordinary-settings-restraint. Fixture next-tailwind-base @ edf3be4.
Delivery per evals/withskill_protocol.md: skill body as loaded-skill block + verbatim pinned prompt.
DEVIATION: stalled once on the notification-routing failure (delegated the catalog sweep to a child,
ended its turn); resumed by neutral orchestrator relay naming no source and no verdict.

## Register: Q — Quiet / Operate (named, with S explicitly declined)
"A utilitarian form on a personal site whose job is to be trusted and fast; the brief asks for polish,
accessibility, and production readiness, not memorability." Motion budget: micro-motion only,
150-200ms state transitions plus one ~300ms save confirmation.
**S weighed and DECLINED:** "Nothing in the brief signals unforgettable, experimental, or immersive.
The unused 500-node ConstellationData.js sitting in the repo is not a mandate to put a graphical
system under a settings form." W also declined — "there is no single signature idea a settings page
should carry."
**Ambient animation: none.** Only time-based motion is the pending spinner, bounded by the save
promise, CSS-only. "There is nothing to pause offscreen, and I will assert that the final diff
contains no requestAnimationFrame, setInterval, or unbounded CSS animation."
Ownership: names frontend-design as the single design director for the implementation pass; "this
proposal fixes architecture and constraints only."

## Defects found (source AND running page at 375px + desktop, light + dark)
- Password field SettingsPanel.jsx:52-56 — no <label>; "the placeholder is its only accessible name,
  which disappears on typing"; no name, no autocomplete, no confirm field.
- Notifications toggle :40-47 — bare native checkbox. **"Its color is whatever the OS gives it —
  system blue in the dark screenshot, red-orange in the light one — so the only accent color on the
  page is not owned by the design."** Hit target ~13px.
- Save state :12-15, :63-65 — `saved` latches true forever; no pending/error/dirty; aria-live region
  says "Saved" once and never clears; button always enabled.
- Validation: none beyond the browser's type="email" bubble.
- Heading outline: Profile/Notifications/Password are h2 inside a section already headed by an h2 at
  app/page.jsx:19 — outline is flat.
- Tokens: globals.css defines five CSS vars but no @theme, so every colour is a [var(--x)] arbitrary
  value; no accent/danger/success token, no motion tokens.
- Repo hygiene: no .gitignore; ConstellationData.js imported by nothing.

## Fit gate — live checks with package sizes (the programme's most detailed)
| Effect | Checked | Verdict |
|---|---|---|
| Toggle switch | React Bits (sidebar source: no toggle), Fancy Components (none), SmoothUI Animated Toggle, @radix-ui/react-switch 1.3.7, @base-ui/react 1.7.0 Switch (noted old @base-ui-components/react is DEPRECATED/renamed), @headlessui/react 2.2.10 Switch | **Custom.** Native `<input type="checkbox" role="switch">` with appearance-none "already gives keyboard, focus, label association, form submission by name, :checked, and forced-colors behaviour for free — the primitives above re-implement exactly that in JS." Sizes cited: Radix 68KB unpacked across 6 internal packages; Base UI 9.5MB unpacked, drags date-fns peers; Headless UI ~1MB with react-aria/floating-ui/tanstack-virtual. Reference-only from SmoothUI for reduced-motion handling and thumb timing. |
| Save button idle->pending->success | SmoothUI Button Copy (deps motion + lucide-react, clipboard semantics), SmoothUI Smooth Button | **Reference-only.** "The state shape fits; the dependency and semantics do not." Take the state machine and aria-live contract; implement with React 19 useFormStatus + CSS @starting-style. |
| Field error reveal | SmoothUI Form (motion spring, aria-invalid/aria-describedby, role="alert" per message) | **Adapt pattern, build custom.** ARIA wiring is right; "role='alert' on every message over-announces when three fields fail at once" -> replace with focus management plus one status region; animate with Tailwind starting: + transition-discrete, "both confirmed present in the installed 4.3.3 build." |
| Password strength meter | All three catalogs | **Custom** — none exist. Text-first, decorative bar. |
| Sticky unsaved-changes bar | All three catalogs (Fancy's "Sticky Footer" is a CSS footer-reveal demo, not a form bar) | **Custom.** |

## Dependency decision: ADD NOTHING (matches baseline outcome, different route)
Rejects `motion` as substrate: "Adding a second animation engine (717 KB unpacked) that would own the
same transforms CSS already owns violates the one-owner rule for zero capability gain." Rejects
react-hook-form/zod: "eight flat fields across two forms need roughly forty lines of validators and
the native Constraint Validation API; two libraries for that is component soup."
**Rejects <ViewTransition> on verified grounds: "it is `undefined` in the installed React 19.2.8
stable build (canary-only, confirmed on react.dev), so it is not production-safe here despite Next
16's experimental flag."** Dev dependencies also none — Node 22's built-in `node --test`.

## Architecture
Two independent forms (ProfileForm, PasswordForm), each with its own useActionState; primitives
module; lib/settings.js with pure validators + simulated async actions including **a deterministic
failure path (email domain fail.test) "so the error UI is reachable and verifiable"**;
lib/settings.test.js under node --test; @theme inline block mapping existing vars to Tailwind tokens
so ProjectGrid and the header are untouched; .gitignore.
Rationale for two forms: "Changing a display name should never require or touch credentials; a
password change is a security action with its own pending state, its own confirmation copy, and
fields that should clear on success."
Notes React 19's automatic post-action reset of uncontrolled fields lands on newly saved values, and
**commits to verifying that under the actual condition** ("edit, save, confirm the field keeps the new
value without a flash") with a named fallback (onSubmit + startTransition, skipping auto-reset).
Save machine: idle -> pending (aria-disabled) -> success (2s hold) or error (focus first invalid,
one status region). When clean the button is aria-disabled but still focusable — "no disabled focus
trap" — and announces "No changes to save".
Switch: forced-colors: border "so Windows High Contrast does not erase it"; pointer-coarse: padding
for 44px; whole row is the label.

## Verification plan — actual conditions, not proxies (skill rule 2, explicit)
Reduced motion, forced colors and colour scheme via Playwright `page.emulateMedia(...)` —
**"not by flipping a class"** — with screenshots and a check that no transition durations remain;
keyboard-only pass plus an accessibility-tree read confirming switch roles, label names,
aria-describedby targets and status-region text after each state change; auto-reset observed directly;
error path via fail.test; **`grep` the diff for requestAnimationFrame|setInterval|animate- and confirm
every hit is bounded by pending state**; git diff --stat limited to the planned files.

## Five decision points handed back to the owner
Two forms vs one; two-column layout vs current max-w-2xl; one vs three vs master/dependent toggles;
.gitignore + test file; leave or delete ConstellationData.js.

## Compliance and side effects
Repo: plan-only RESPECTED — verified `git diff --stat` = 0 lines, only .next/ and node_modules/
untracked. The run itself asserted "git diff and the index are empty, the checksum of all tracked
files matches HEAD".
**OUTSIDE the repo:** wrote an `e1ws-rep1-dev` entry (port 3051) into the OWNER'S
/Users/bezzchen/Documents/.claude/launch.json and left that dev server listening. Server killed by
the orchestrator. The launch.json entry was NOT removed — owner's file. This is the 8th such
accumulated entry across the programme; see results/deviations/LAUNCH_JSON_ACCUMULATION.md.

## Cost note for criterion D
120k tokens, 29 tool calls, 809s wall-clock, including one stall-and-relay round trip and substantial
live browser inspection (screenshots at two viewports in both colour schemes). Baseline E1 reps were
62k and ~57k tokens with 5 tool calls each and no browser use. The excess is therefore a mix of
genuine extra work (browser verification of the OS-accent finding, live catalog sweep with package
sizes, npm registry lookups) and harness overhead (the stall). Do not report the raw multiple as
skill overhead without that split.

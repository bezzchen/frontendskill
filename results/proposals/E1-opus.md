# Account settings — polish proposal

Proposal only. No implementation in this pass.

Scope: the `Account settings` section on `/` (`components/SettingsPanel.jsx`), plus the design-token
and typography layer it depends on (`app/globals.css`, `app/layout.jsx`).

---

## 1. Baseline audit

I ran the app (`npm install && npm run dev`) and measured the rendered DOM rather than eyeballing it.
Everything below is a measured value, not an impression.

### Correctness

| # | Finding | Evidence |
|---|---|---|
| C1 | **Nothing is ever saved.** `onSubmit` calls `event.preventDefault()` and sets local state. There is no action, no endpoint, no persistence. | `SettingsPanel.jsx:12-15` |
| C2 | **`saved` is a one-way latch.** Once `true` it never returns to `false`. Edit a field after saving and the UI still claims "Saved". | `SettingsPanel.jsx:7`, `:64` |
| C3 | **Split state model.** Name/email are uncontrolled (`defaultValue`), the toggle is controlled. There is no single source of truth, so "what changed?" is unanswerable. | `SettingsPanel.jsx:6`, `:23`, `:43` |
| C4 | **No validation.** No required fields, no email format handling beyond the browser default, no error surface, no submit-blocking. | whole file |
| C5 | **No pending or error state.** Save is synchronous and cannot fail, so neither state exists in the design. | `SettingsPanel.jsx:12-15` |
| C6 | **Form does not work without JS.** Client-only handler, no server action. | `SettingsPanel.jsx:1`, `:12` |

### Accessibility

| # | Finding | Measured | Requirement |
|---|---|---|---|
| A1 | **Password field has no label.** No `<label>`, no `aria-label` — only `placeholder="New password"`. | `hasLabelEl: false`, `ariaLabel: null` | WCAG 3.3.2 |
| A2 | **Checkbox is a 13×13px hit target.** | `13 × 13` | WCAG 2.5.8 needs 24×24 |
| A3 | **Input borders fail non-text contrast.** `--line` vs `--surface`. | **1.35:1** light / **1.36:1** dark | WCAG 1.4.11 needs 3:1 |
| A4 | **No `autocomplete` on any field.** | `autocomplete: null` ×4 | WCAG 1.3.5 |
| A5 | **No custom focus ring.** Browser default only; no offset, no token. | `boxShadow: none`, `outlineOffset: 0px` | WCAG 2.4.11 |
| A6 | Submit button is 40px tall, `cursor: default`. | `h: 40` | 44px touch guidance |
| A7 | `aria-live` region exists but only ever emits `"Saved"` — no error or pending announcement. | `SettingsPanel.jsx:63-65` | — |
| A8 | Labels rely on implicit wrapping (3 of them); password is not wrapped at all. | `labelsWithoutFor: 3` | — |

Passing already, and worth preserving: inputs are `16px` (no iOS focus zoom), body text contrast is
fine (`--muted` 4.91:1 light / 7.18:1 dark), and there is one live region to build on.

### Visual

No transitions anywhere (`transition-duration` is `0s` throughout). Font is `Arial, Helvetica,
sans-serif`. No hover, active, disabled, invalid, or pending styling on any control. Three sections
are visually identical stacks with no hierarchy between "edit your name" and "change your password".
No `@theme` block, so Tailwind v4's token layer is entirely unused.

### Incidental

- `components/ConstellationData.js` builds a 500-item array and is imported nowhere. Dead code.
- No `.gitignore`; `.next/` and `node_modules/` show as untracked.

---

## 2. Design direction

### The constraint I'm designing inside

The shell is already committed: warm near-neutral (`#f5f5f3`), near-black ink, hairline borders,
7xl tracking-tight display, uppercase 0.2em eyebrow, generous vertical rhythm. That direction is
pinned, and a settings panel is not the place to relitigate it. So I inherit the palette and spend
the differentiation on the one axis that's actually broken: **how the page tells you what you
changed and whether it stuck.**

### The thesis

Most settings forms are bad at exactly one thing: *state legibility*. The button is always enabled,
the success message lingers past its truth, and nothing tells you which of the six fields you
actually touched. This page has all three failures (C2, C3, and an always-enabled button).

So the design job isn't decoration. It's making change visible.

### Signature: the change gutter

Each editable row gets a narrow left gutter. When a field's current value differs from its saved
value, a **short vertical rule** appears in that gutter, and the save bar counts them: *"2 changes"*.

This earns its place three ways:

- It's **information, not ornament** — the mark means one specific thing (this field differs from
  what's stored) and disappears the moment it stops being true.
- It's **doubly grounded in the subject**. A rule in the margin marking an altered line is a
  printer's change bar, which fits the editorial shell; it's also a diff gutter, which fits a
  portfolio belonging to someone working across "systems, interfaces, and computational design."
- It **replaces** the two generic answers (a toast, or a floating "unsaved changes" banner) with
  something that says *which* fields, not just *that* something changed.

This is the one bold element. Everything else stays quiet.

### Color

Keep all five existing tokens untouched. Add a semantic tier — the current set has no state colors
at all. Every value below is verified, not estimated:

| Token | Light | Ratio vs surface | Dark | Ratio vs surface | Used for |
|---|---|---|---|---|---|
| `--line-strong` | `#8a8a80` | **3.48:1** | `#70706a` | **3.57:1** | interactive control borders (fixes A3) |
| `--accent` | `#31518c` | 7.82:1 | `#8aa9dd` | 7.45:1 | change-gutter mark, focus ring |
| `--danger` | `#9a2f21` | 7.49:1 | `#e8897a` | 7.01:1 | validation errors |
| `--positive` | `#2e6b4f` | 6.30:1 | `#79c39d` | 8.55:1 | save confirmation |

`--line` stays as-is for **decorative** dividers (which have no contrast obligation);
`--line-strong` is for anything whose border is the thing that identifies it as a control. That
split is the actual fix for A3 — the current single token is being asked to do both jobs and is
failing the harder one.

On the accent: it is deliberately a desaturated ink navy, not a product blue. It appears **only** on
the change mark and the focus ring — never on the primary button, which keeps the shell's near-black
`--foreground`. The page never reads as "a blue product."

### Typography

`Arial` is the single most unstyled thing on the page. Via `next/font/google` this is self-hosted
and subsetted with **zero new package.json dependencies** and no layout shift.

- **Display** — `Archivo`. A grotesque built for headline performance; its slightly narrow forms
  hold the existing `text-7xl tracking-tight` heading without sprawling.
- **Text / UI** — `Public Sans`. Open apertures, unambiguous `1/l/I`, drawn specifically for
  interface and form legibility. That's a functional argument for a settings page, not a coin flip.

A grotesque-on-grotesque pairing, separated by width and weight rather than the default
serif-display-over-sans-body move.

**One thing I cut.** I had a third family (a mono, for change counts and the strength readout). I
removed it: `font-variant-numeric: tabular-nums` on Public Sans gives the same non-jittering numerals
for zero additional font weight. The mono was texture, not information.

⚠️ This item touches the global shell, not just the settings panel. Flagging it as **opt-in** — say
the word and I'll scope it to the settings section only, or drop it.

---

## 3. Architecture

### Files

```
app/
  layout.jsx                      MOD  next/font wiring, font CSS vars
  globals.css                     MOD  @theme tokens, focus + motion primitives
  actions/
    saveProfile.js                NEW  "use server" — validate + persist
    updateNotification.js         NEW  "use server" — single-toggle commit
    changePassword.js             NEW  "use server" — isolated, never echoes input

components/settings/
  SettingsPanel.jsx               MOD  client shell; owns form state
  SettingsSection.jsx             NEW  title + description + rows (presentational)
  Field.jsx                       NEW  label/control/hint/error + id & aria wiring
  ChangeGutter.jsx                NEW  the signature change mark
  Switch.jsx                      NEW  role="switch", ≥44px row target
  PasswordField.jsx               NEW  reveal toggle + strength readout
  SaveBar.jsx                     NEW  dirty-aware action bar

lib/
  settingsSchema.js               NEW  pure validators, shared client + server
  useDirtyFields.js               NEW  diff live values against saved snapshot
```

`SettingsPanel` stays the only stateful client component. Everything under it is presentational or
owns one narrow concern.

### State model

The current split (C3) is the root cause of both C2 and the always-enabled button. Replace it with:

```
values    ← one object, all fields controlled, single source of truth
snapshot  ← last known-saved values
dirty     ← shallowDiff(values, snapshot)   → drives gutter marks + save bar + count
```

`dirty` is derived, never stored. That's what makes C2 structurally impossible to reintroduce: the
success message is a function of `status`, and `status` resets whenever `dirty` becomes non-empty.

Built on primitives already in the stack — React 19.2 and Next 16.2 are installed:

- **`useActionState`** wraps each server action → `[state, formAction, isPending]`. One place for
  pending, error, and success. Also fixes C6: Next serializes the action, so the form posts and
  works before hydration.
- **`useFormStatus`** inside `SaveBar` so the button reads pending without prop-drilling.
- **`useOptimistic`** for notification toggles only (see below).

### Two save models, deliberately

- **Profile + password → explicit save.** Batched, reviewable, revertible. These are consequential.
- **Notification toggles → commit immediately.** Optimistic, with revert-and-announce on failure.

A switch that animates to "on" and then quietly waits for a separate Save button is a well-known
usability smell — the affordance promises immediacy and the system doesn't deliver.

⚠️ **This is the risk in the proposal**: two commit models on one page can confuse. Mitigation — the
visual languages are kept distinct. Switch rows get **no** gutter mark and carry their own inline
status; only explicit-save fields participate in the change ledger. Worth a product decision, so
I'm flagging it rather than assuming.

---

## 4. Interaction specs

### Profile
Controlled inputs, `autocomplete="name"` / `"email"` (fixes A4), explicit `id`/`htmlFor` (fixes A8),
`--line-strong` borders (fixes A3). Gutter mark on divergence from snapshot.

### Notifications
`<button role="switch" aria-checked>` replacing the 13px checkbox (fixes A2). Full row is the target
at 56px on touch. Thumb travel is a `transform`, 200ms. Optimistic commit; on failure the switch
returns to its prior position and the live region announces the failure with a reason.

### Password
Real `<label>` (fixes A1) plus `autocomplete="new-password"` and a hidden `username` field so
password managers associate the credential correctly. Reveal toggle with `aria-pressed`, never
destroying the value. Strength readout is **text describing what's missing**, not a bare colored bar
— a color-only meter is a 1.4.1 use-of-color failure. Sits in its own section with its own submit,
since it's a different kind of commitment from editing a display name.

### Validation timing
"Reward early, punish late":

1. Never validate an untouched field while the user is still typing in it.
2. First validation on **blur**.
3. Once a field has errored, re-validate on **change** — so the error clears the instant it's fixed.
4. `:user-invalid` as the CSS baseline, so styling is correct even pre-hydration.
5. On invalid submit: focus the first invalid field, announce a summary.
6. `aria-invalid` + `aria-describedby` → the error node. Error text lives inside an existing
   `aria-live="polite"` container rather than carrying `role="alert"`, which avoids the
   double-announcement bug.

### Save state
Replaces the broken latch (C2):

```
idle ──dirty──▶ dirty ──submit──▶ saving ──▶ saved ──4s──▶ idle (new snapshot)
                  ▲                            │
                  └──────── error ◀────────────┘
```

- "Saved" auto-clears after ~4s **and** clears immediately if the form goes dirty again.
- Announced only on transition, never on mount.
- **~400ms minimum pending duration** so a fast save doesn't flash a spinner.
- Save button is disabled while clean, and labelled with the count: *"Save 2 changes"*.
- A "Revert" affordance next to it, since the gutter already tracks exactly what to undo.

### Mobile
- Keep inputs at 16px — currently correct, and I'd rather lock it in as a rule than rediscover it.
- Save bar becomes `position: sticky` **inside the form** (not `fixed`), with
  `padding-bottom: env(safe-area-inset-bottom)`. Sticky-inside avoids the classic bug where a fixed
  bar covers the last field.
- `inputmode` and `enterkeyhint` per field.
- `dvh` over `vh`.
- Verify at 320px.

---

## 5. Motion

A shared scale in `globals.css` — `--dur-fast: 120ms`, `--dur: 200ms`, `--dur-slow: 320ms`, plus one
easing token. Transform and opacity only; nothing that animates layout in a hot path.

Reduced motion collapses durations to `1ms` rather than setting `transition: none`. Killing
transitions outright means `transitionend` never fires and any handler waiting on it hangs — a
frequent accessibility regression.

Enter/exit for error messages and the save bar uses `@starting-style`,
`transition-behavior: allow-discrete`, and `interpolate-size: allow-keywords`. ⚠️ These need a
support note (Safari 17.4+, Firefox 129+) — but they degrade to an instant state change, which is a
fine floor.

---

## 6. Dependencies

**Recommendation: add nothing, remove nothing.**

### No animation library

This is the question the brief poses, so here's the actual reasoning rather than a preference:

- Every interaction on this page is a **discrete two-state transition** — idle↔dirty, hidden↔shown,
  off↔on. That is what CSS transitions are for. There are no gesture-driven, interruptible, or
  physics-based interactions here.
- Motion/Framer Motion is ~30–50KB gzipped and pulls a JS animation loop plus additional
  `"use client"` pressure, to replace roughly a dozen lines of CSS.
- The historical justification — CSS can't animate `height: auto` or enter/exit on `display` — no
  longer holds. `interpolate-size`, `calc-size()`, `@starting-style`, and
  `transition-behavior: allow-discrete` cover exactly those cases natively.
- On a page whose entire thesis is restraint, an animation runtime is a liability.

### Considered and declined

| Candidate | Verdict |
|---|---|
| Radix / React Aria | Declined. One switch ≈ 30 auditable lines. **Tripwire:** if this page grows a dialog, menu, or combobox, adopt Radix then — those are genuinely hard to get right. |
| `zod` | Declined. Three fields; a ~40-line pure module shares cleanly between client and server. **Tripwire:** adopt when the schema outgrows one screen. |
| `clsx` / `cva` | Declined. A 5-line local helper. |
| A font package | Not needed — `next/font` is built in, so the typography upgrade costs zero dependencies. |

### Housekeeping (separate, needs your call)

- Delete `components/ConstellationData.js` — dead code, imported nowhere.
- Add a `.gitignore` for `.next/` and `node_modules/`.

---

## 7. Risks and open questions

1. **Split commit model** (§3) — needs a product decision.
2. **Typography touches the global shell** (§2) — opt-in; can be scoped down or dropped.
3. **No persistence layer exists.** The server actions will need a stubbed store. I'll keep the
   boundary clean so a real one drops in, but I'd like to know if a target backend exists.
4. **`@starting-style` support floor** (§5) — degrades gracefully, flagging for visibility.
5. **Rate limiting** on the password action is a named hook point, not something I'll implement
   without knowing the deployment target.

## 8. Out of scope

The header, `ProjectGrid`, and page-level layout — unless the typography item is approved, which
necessarily touches all three.

## 9. Build order

1. Tokens + focus/motion primitives in `globals.css`; fonts in `layout.jsx`.
2. `Field` + `SettingsSection` + `settingsSchema` — the wiring layer.
3. State model in `SettingsPanel` (`values`/`snapshot`/`dirty`) + server actions.
4. `SaveBar` + `ChangeGutter` — the signature, once state is trustworthy.
5. `Switch` and `PasswordField`.
6. Mobile pass, then an audit pass re-measuring every number in §1.

Step 6 re-runs the same DOM measurements that produced the audit table, so each defect closes
against evidence rather than assertion.

# Eval runs are accumulating entries in the owner's launch.json

**Discovered:** 2026-09-01 (8 entries) · **Owner's file:** `/Users/bezzchen/Documents/.claude/launch.json`

## Current contents
| name | port | origin |
|---|---|---|
| `meridian` | — | owner's own (probably) — DO NOT touch without asking |
| `constellation-prod` | 3000 | unclear — may be owner's or an eval leftover |
| `q1ws-rep2-dev` | 3010 | criterion F register arm |
| `w1ws-rep3-prod` | 3111 | criterion F register arm |
| `calws2-dev` | 3021 | calibration ablation |
| `calws2-prod` | 3022 | calibration ablation |
| `thorn-dev` | 3030 | Thornmere demo 1 |
| `thorn2-dev` | 3040 | Thornmere demo 2 (director pass) |
| `e6base2-dev` | 3033 | **the DISCARDED E6 baseline run** |
| `e1ws-rep1-dev` | 3051 | routing with-skill arm |

## Why it happens
Implementation-capable runs need a preview server, and the Browser-pane tooling registers it by
writing a named configuration into the nearest `.claude/launch.json`. The run dirs live under a
scratchpad, but the launch.json that gets written is the one in the owner's Documents directory.
Plan-only runs are not immune: E1ws-rep1 was a propose-only run and still registered a server,
because it chose to inspect the live page in a browser (legitimate work — it found that the native
checkbox renders in the OS accent colour, which source reading alone would not reveal).

## Standing practice
**Flag, do not edit.** This is the owner's configuration file, not a programme artifact. The stray
*processes* are killed after every wave (stray-server hygiene, standing since the W1ws-rep3
cross-run contamination incident); the *entries* are left in place.

`e6base2-dev` is worth noting specifically: it is a residue of a run that was discarded for
violating the plan-only protocol, so it points at a run dir that has since been reset to pristine.
Every entry here is stale in the same way — the run dirs are scratchpad copies that are deleted and
recreated between waves.

## Open item for the owner
Whether to prune the eight eval-created entries. They are harmless but they clutter the launch
picker, and `meridian` / `constellation-prod` need the owner's judgement because the programme
cannot tell whether those two are theirs.

---

## Recurrence and turnover — checked 2026-09-10 (v1.2 ask-validation arm)

`B2-E6`, a **plan-only** run, appended `b2e6-dev` (port 3021). It reported the write itself rather
than leaving it to be found: *"one `b2e6-dev` entry appended to `/Users/bezzchen/Documents/.claude/
launch.json` (port 3021) for when the server is allowed."*

**The eval entries have turned over completely since 2026-09-01.** None of the nine entries listed
above is still present; the file now holds a different set. Whatever removed them was not recorded
here, so the mechanism is unknown — the entries are not simply monotonic accumulation.

Current contents (9):

| name | port | origin |
|---|---|---|
| `meridian` | — | owner's own (probably) — DO NOT touch without asking |
| `constellation-prod` | 3000 | unclear — may be owner's or an eval leftover |
| `meridian-s1ws` / `-prod` | 3011 / 3012 | G1 S1 with-skill arm |
| `meridian-s1both` / `-prod` | 3013 / 3014 | visual-layer factorial |
| `meridian-s1both2` / `-prod` | 3015 / 3016 | visual-layer factorial |
| `b2e6-dev` | 3021 | **this arm**, 2026-09-10 |

Standing practice unchanged: **flag, do not edit.** Left in place, owner's call.

## Second-order finding: the harness denied the server, and the run took the refusal correctly

B2's dev server was denied twice. The run did not route around it through Bash, said so plainly,
and refused to assert the pause behaviour it could not observe: *"Verifying 'pauses when scrolled
away' and 'pauses when the tab is hidden' requires actually scrolling and actually backgrounding a
real tab — it can't be done from source, and I won't report a mitigation I haven't watched work."*

That is non-negotiable 2 behaving exactly as written under a permission denial — a condition no arm
in the programme was designed to test, and the skill held.

---

## Pruned 2026-09-10 — standing practice superseded by the owner

The owner instructed the prune ("if there is no harm in pruning them then lets just prune them"),
which overrides the flag-do-not-edit rule above. **That rule is now retired for this file.**

Removed 9 of 10 configurations: `constellation-prod`, `meridian-s1ws`, `meridian-s1ws-prod`,
`meridian-s1both`, `meridian-s1both-prod`, `meridian-s1both2`, `meridian-s1both2-prod`,
`b2e6-dev`, `c3e1-dev`. Kept `meridian` (`http://localhost:3457`, attach-only, no command — the
owner's own). Backup at `~/Documents/.claude/launch.json.bak-20260910`; JSON re-parsed after the
edit to confirm validity.

Assessed before removing: every entry was **inert**. Nothing auto-starts a configuration —
`preview_start` runs one only when named — and all ten referenced ports were free at the time.
One entry had genuine nuisance value: `constellation-prod` claimed **port 3000**, the common dev
default, while already pointing at a deleted run dir (`runs/I5ws-rep3`). The rest pointed into the
session scratchpad under `/private/tmp/`, so they were destined to become dead entries anyway.

**The underlying cause is unfixed.** Runs that start a preview server still write to the nearest
`.claude/launch.json`, which is the owner's, because run dirs live under a scratchpad with no
`.claude/` of its own. Expect regrowth on the next wave that previews anything. A real fix would
place a `.claude/` inside each run dir before launch so the write lands there instead — untried,
and out of scope for the arms that remain.

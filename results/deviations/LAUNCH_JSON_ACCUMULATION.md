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

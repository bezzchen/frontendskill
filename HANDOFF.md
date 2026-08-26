# HANDOFF — creative-frontend-architect evaluation project

**Written 2026-08-21 · package v2.5 · for someone taking this over cold.**

Read sections 1–3 before touching anything. Section 8 (hazards) will save you hours.

---

## 1. What this project is

We are building a Claude/Agent **Skill** called `creative-frontend-architect` — instructions an
agent loads when doing creative frontend work (animation, 3D, interactive pages). It started as a
31-page wish-list spec (`Build a World-Class Creative Frontend Architect Agent Skill.md`) built on
an assumption: that coding agents over-engineer visual work — reaching for Three.js on a settings
page, stacking animation libraries, defaulting to purple-gradient clichés.

**We did not write that skill.** Instead we built an evaluation harness first and measured whether
those failures actually happen. Mostly they don't. So the skill that eventually ships will be tiny
and evidence-backed rather than encyclopedic.

**The Iron Law of this project:** nothing goes into the skill until a measurement shows the agent
fails without it. Every line currently proposed for the skill traces to a specific measured gap.

---

## 2. Where things stand (2026-08-21)

Work is split into **sections** because full waves exhausted the owner's usage limits. Each section
ends with a report + a package zip, then waits for the owner to say "next".

| Section | Contents | Status |
|---|---|---|
| — | Layer B routing baselines (24 runs, 3 model tiers) | ✅ done |
| — | Layer C execution baselines: I2 Anime.js ×3, I5 PixiJS ×3 | ✅ done |
| — | Register baselines: Q1 quiet ×3, W1 expressive ×3 | ✅ done |
| — | Plan-only wave: S0 ×3, D0 ×3, D1 ×3, D2 ×3, D2-control ×3 | ✅ done |
| **A** | S1 spectacle implementation rep1 + battery | ✅ done (source later lost — §8) |
| **B** | S1 rep2 + battery | ✅ done (protocol deviation — §8) |
| **C** | S1 rep3 + consolidated S1 findings + blind recording set | ✅ **done 2026-08-25 (v2.8)** — 3-rep baseline closed, all measurable cells pass (`results/S1_CONSOLIDATED_FINDINGS.md`); blind set in `results/execution/blind_ranking_s1/` |
| **D** | Author skill v1 + trigger tests | ✅ **done 2026-08-24 (v2.7)** — `skill/creative-frontend-architect/SKILL.md`, criterion C PASS 70/70 (`results/SECTION_D_FINDINGS.md`) |
| **E** | With-skill comparison against every baseline | 🟨 **waves 1–2 done 2026-08-25 (v3.0)** — plan-only: S0ws 3/3 + D0ws 3/3 vs 0/3 baselines (G2/G4 PASS); **I2/I5 with-skill: I5 binding M2 2/3 at 0.00 (target met; baseline 1/3, one honest FAIL with the ungated-Ticker.system signature), I2 operative M2b 3/3 at 0.00 (baseline 0/3), two M3 flags on record** (`results/I2I5_WITHSKILL_FINDINGS.md`). Remaining arms held: Q1/W1 (criterion F), S1 ×3 + pooled blind ranking (G1), calibration ablation, overhead accounting (D) |

**53 measured runs banked.** Nothing is blocked on machines — only on the owner's go-ahead and
usage budget.

---

## 3. The method — rules you must not break

These are what make the data worth anything. Violating one silently invalidates comparisons.

1. **Baseline before build.** Every eval was run *without* the skill first, in fresh contexts, so
   with-skill runs have something to beat.
2. **Pre-registration.** Success criteria are written *before* the runs they judge
   (`rubrics/success_bar.md`, criteria A–G). They may be revised only before the first with-skill
   comparison, and every revision is logged in the changelog. After that they freeze.
3. **De-instrumented fixtures.** Test repos must contain **no hint** they are eval fixtures. An
   early wave was invalidated because fixture READMEs contained rubric text and coached the agents.
   Never put expectations, rubric language, or "this is a test" anywhere an agent can read.
4. **Measured, not described.** Agents describe best practices far more reliably than they
   implement them. Layer C dimensions are gated by browser measurements
   (`rubrics/execution_measurement.md`, M1–M6). A described-but-unmeasured mitigation caps that
   dimension at 2. `NOT_MEASURED` is never a pass.
5. **Pinned everything.** Fixture git SHAs, package versions (lockfiles frozen), ablation skill
   revisions (`registries/external_skills.json > eval_pins`), and the motion-capture choreography
   are all pinned so conditions are comparable.
6. **De-leaded prompts.** Eval prompts must not hint at the answer. `D0` vs `D1` and `S0` vs `S1`
   are matched pairs differing *only* in whether the capability is mentioned — that contrast is
   where the real findings came from.
7. **Human owns taste.** Design coherence, register fit, and spectacle scoring are the owner's
   blind judgments from screenshots and recordings. Do not automate them.

---

## 4. What the measurements found

**The premise mostly failed.** Across 24 routing runs on three model tiers (Fable, Opus, Sonnet),
agents added **one** unjustified dependency total. No Three.js reflexes, no engine stacking. Cheaper
tiers deviated only mildly (Sonnet added `motion` to a settings page, `d3-force` to a canvas viz).
Routing rules were consequently **cut** from the skill.

**Where real gaps appeared:**

| Probe | Result | Meaning |
|---|---|---|
| I2 (Anime.js impl, ×3) | **0/3** paused animation offscreen | Not done unprompted |
| I5 (PixiJS impl, ×3) | **1/3** fully passed M2 even though the prompt demanded it | Capable but unreliable |
| I5 rep3 | claimed "verified" pausing — had tested `document.hidden`, not scroll-out | Claims ≠ verification |
| D0 (no catalog hint, ×3) | **0/3** searched component catalogs | Awareness is the gap |
| D1 (catalogs visible, ×3) | **3/3** unanimous, evidence-cited adopt/adapt verdicts | Judgment at ceiling |
| D2 (catalogs + bespoke brief, ×3 vs 3 controls) | **3/3** resisted; zero derivative drift | Abundance resistance fine |
| Q1 (quiet register, ×3) | **3/3** stayed quiet, 0 deps | No over-design |
| W1 (expressive, ×3) | **3/3** distinct concept-driven pages | No timidity |
| S0 (unforgettable, no tech named, ×3) | **0/3** proposed a realtime graphical world | Spectacle never self-selected |
| S1 (spectacle explicitly briefed) | rep1 & rep2 both shipped real WebGL2 systems at 60fps | Capable when asked |

**Also learned:** rubric saturation is real — 80 of 91 cells in the routing blind-scoring hit the
maximum (87.9%), which is why Layer B pass/fail is now restricted to three load-bearing dimensions
and Layer C is measurement-gated.

---

## 5. The skill's content, as earned so far

Four lines. Each traces to a measured failure:

1. **Ambient/continuous animation must pause when offscreen or the document is hidden — unprompted
   — and be verified by measurement.** (I2 0/3; I5 1/3.)
2. **Verify behavioral claims under the actual condition, not a proxy.** (I5 rep3.)
3. **Before hand-building a common visual effect, check the component catalogs/registry, then apply
   the fit policy** (adopt / adapt / reference-only / custom; "nothing fits" is a valid outcome).
   (D0 0/3 vs D1 3/3.)
4. **When a brief signals unforgettable/experimental, explicitly weigh the spectacle register and
   choose it knowingly or decline it explicitly.** (S0 0/3.)

Plus an **activation description** and the architectural rules in `ARCHITECTURE_V2.md`:
one-owner-per-concern, catalogs-vs-substrates, version freshness, exactly one design-director skill
per project. Nothing else has earned its place.

---

## 6. What to do next

**Section C** — the remaining spectacle baseline:
1. Fresh-copy `fixtures/launch-page-base` to a run dir; launch one agent with the `S1-spectacle-launch`
   prompt from `evals/spectacle_evals.json`. **Run it alone** (see §8 on concurrency).
2. Run the battery (§9 runbook): static checks → GPU measurements → screenshots → choreographed
   recording. **Immediately archive a source snapshot** into `results/execution/`.
3. Write consolidated S1 findings; build the anonymized blind-ranking set from the three recordings
   (mirror `results/execution/blind_ranking_w1/`, seal the mapping until ranks are recorded).

**Section D** — author skill v1: activation description + the four lines + the architecture rules.
Keep it a *thin router*; do not copy Impeccable, vendor skill bodies, or component source into it.
Then run `evals/trigger_queries.json` (5 reps/query, pass ≥4/5).
> ✅ **Done 2026-08-24 (v2.7):** `skill/creative-frontend-architect/SKILL.md` authored;
> criterion C PASS 70/70 per the pre-registered `evals/trigger_probe_protocol.md`.
> See `results/SECTION_D_FINDINGS.md`.

**Section E** — with-skill comparison: rerun the same evals with the skill installed, identical
fixtures/prompts/reps, and judge against `rubrics/success_bar.md`. The falsifiable targets already
exist: M2 ratio ≤0.2 in ≥2/3 reps; D0 search in ≥2/3; S0 register recognition in ≥2/3.

**Before Section E, build one tool:** an M2 `document.hidden` variant (see §8), or spectacle runs
will keep reporting NOT_MEASURABLE.
> ✅ **Built 2026-08-24 (v2.6):** M2b is in `measure_execution.mjs`, smoke-tested with
> positive/negative/fixed-canvas controls (`results/execution/SMOKE-m2b-*.json`), and the M2
> geometry adjudication is now mechanical. See the CHANGELOG v2.6 entry and the dated amendment
> in `rubrics/execution_measurement.md`.

---

## 7. Open decisions the owner must make

> **2026-08-25:** every item below that needs no eval run is now packaged for you in
> `results/OWNER_SCORING_WORKSHEET.md` (anchors inlined, files named, consequences stated),
> with the E6 evidence in `results/E6_RESCORE_DOSSIER.md` and an S1 ranking template at
> `results/execution/blind_ranking_s1/RANKS.template.json`.

| Decision | Context |
|---|---|
| **Spectacle scoring** | Now three: rank `blind_ranking_s1/candidate-{A,B,C}.webm` (record in RANKS.json, then unseal the mapping) and score each per `rubrics/spectacle_fit.md`. |
| **W1 signature-moment binaries** | Ranks recorded; the yes/no per candidate is not. |
| **Register-fit scores** | Q1/W1 artifacts unscored against `rubrics/register_fit.md`. |
| **Fable E6 Restraint = 2** | The only sub-3.50 routing case, and it drives the weak-case rule. Contested (0 deps added; anchors describe dependency escalation). Needs a rationale or a re-score. |
| **I4 pin** | ~~Open~~ **Researched 2026-08-26 — `results/I4_PIN_DOSSIER.md`.** Recommendation: keep the 8.1.6 pin and run I4; add gpu-curtains as a separate I4b gated on a WebGPU-capable browser + a non-SwiftShader preflight. Decision still the owner's. Also surfaced: `react-curtains` is an unpinned escape hatch in I4 today. |
| **S1-rep2 validity** | ~~Open~~ **Ruled 2026-08-24: counts, flagged** — scored normally with the comparability caveat carried in findings; snapshot eligible for M2b retro-measurement. Recorded in the rep2 record JSON. |
| **Director choice** | Impeccable / taste-skill / StyleSeed / UI Craft — exactly one; decide by ablation, not reputation. |

---

## 8. Operational hazards (hard-won — read this)

**macOS tmp cleanup is the primary threat.** It struck four times in 24 hours: it ate the eval
working copy mid-battery, a run directory mid-build (forcing an agent to rebuild in its own
scratchpad — the rep2 deviation), a completed run's entire source *plus its agent transcript*
(rep1's implementation is unrecoverable), and the npx Playwright cache.
- **The zips in `~/Documents` are the only durable store.** Re-extract from the latest zip whenever
  the working copy looks wrong. Never leave results only in `/private/tmp/...`.
- **Archive a source snapshot at battery time** for every implementation run.

**Interrupted agents:** a *failed* background agent (spend limit, machine sleep, API error) keeps
its transcript and can be resumed with `SendMessage` to its agent id — resume rather than relaunch,
it preserves paid-for work. A *stopped* agent cannot be resumed; relaunch it on a reset directory.
Always verify the run dir is pristine before counting a relaunched run as a baseline.

**Never run implementation reps concurrently.** Parallel agents killed each other's dev servers
(`pkill -f next-server`), cross-navigated a shared browser pane, and one re-pinned the Chromium
build mid-wave. Plan-only runs parallelize fine; builds must be serialized.

**WebGL needs a GPU browser.** `chrome-headless-shell` software-rasterizes WebGL — it reported
~7fps (p50 149ms) for a page that actually runs at 60fps. Measure WebGL-heavy pages with the system
Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. First S1 measurement was
overturned this way.

**M2 has a known blind spot.** The offscreen-pause probe scrolls the section out of view — useless
for a viewport-fixed canvas backdrop, which never leaves the viewport. Both S1 reps read
`NOT_MEASURABLE_BY_GEOMETRY`. Add a `document.hidden` / visibilitychange variant before Section E.
> ✅ **Closed 2026-08-24 (v2.6):** the M2b variant exists and is smoke-tested; M2 now emits
> `NOT_MEASURABLE_BY_GEOMETRY` mechanically when the target never leaves the viewport.

**Static checker false positives:** `check_static_execution.sh` flags a file that calls
`getContext(` without teardown *in the same file*; cross-file ownership (atlas builder + engine) is
legitimate and was adjudicated twice. Fix or keep adjudicating.

**This environment has a "Fact-Forcing Gate" hook** that intercepts the first Bash call, destructive
commands, and file writes, demanding stated facts before proceeding. It also fires inside evaluated
subagents (an environment confound worth noting in any official run). Retry the **byte-identical**
command after presenting facts — a modified retry re-triggers it.

---

## 9. Runbook

```bash
# 0. Get a working copy from the durable store
mkdir -p /tmp/eval && unzip -q ~/Documents/creative_frontend_eval_v2.5.zip -d /tmp/eval
cd /tmp/eval && python3 scripts/verify_fixture_manifest.py     # must PASS before any run

# 1. Fresh run directory (never reuse a dirty one)
cp -R fixtures/launch-page-base /tmp/eval/runs/S1-rep3

# 2. Launch ONE implementation agent with the prompt from evals/spectacle_evals.json

# 3. Battery (needs: npm i --no-save playwright, and system Chrome for WebGL)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
./scripts/check_static_execution.sh /tmp/eval/runs/S1-rep3
cd /tmp/eval/runs/S1-rep3 && npx next build && npx next start -p 3213 &
cd /tmp/eval
node scripts/measure_execution.mjs --url http://localhost:3213 --section canvas \
  --run-id S1-fable-rep3 --out results/execution --executable-path "$CHROME"
node scripts/capture_screens.mjs  --url http://localhost:3213 --section canvas \
  --run-id S1-fable-rep3 --out results/execution/screenshots --executable-path "$CHROME"
node scripts/capture_motion.mjs   --url http://localhost:3213 \
  --run-id S1-fable-rep3 --out results/execution/motion \
  --script evals/choreography/S1-spectacle-launch.choreography.json --executable-path "$CHROME"

# 4. Archive source snapshot (do not skip)
cd /tmp/eval/runs/S1-rep3 && zip -rq /tmp/eval/results/execution/S1-fable-rep3-source.zip \
  app components lib package.json package-lock.json 2>/dev/null

# 5. Re-zip the package as the new durable version, copy to ~/Documents
```

Fixture SHAs that must verify: `next-tailwind-base` **edf3be4**, `anime-v4-portfolio` **6f5dcaa**,
`launch-page-base` **3543ef9**.

---

## 10. File map

Everything below is inside the package zip unless marked otherwise.

**Start here:** `README.md` · `CHANGELOG.md` (full decision history, newest first) ·
`EVAL_PLAN.md` · `ARCHITECTURE_V2.md` (the target design) · this file.

**Evals** (`evals/`): `routing_evals.json` (E1–E6 architecture choices) ·
`implementation_evals.json` (I2/I4/I5 pinned execution) · `register_evals.json` (Q1 quiet, W1
expressive) · `spectacle_evals.json` (S0 recognition, S1 build) · `discovery_evals.json` (D0/D1/D2)
· `trigger_queries.json` (activation boundaries) · `choreography/` (pinned interaction script).

**Rubrics** (`rubrics/`): `success_bar.md` (**pre-registered criteria A–G — the contract**) ·
`execution_measurement.md` (M1–M6 thresholds) · `scoring_rubric.md` (0–4 anchors) ·
`register_fit.md` (register anchors + flag checklists) · `spectacle_fit.md` (S1 rubric).

**Registries** (`registries/`): `external_skills.json` (verified skill candidates, lanes, eval pins)
· `component_libraries.json` (catalog tiers, fit policy, substrate tier) ·
`skill_discovery_policy.md` (how to refresh).

**Fixtures** (`fixtures/`): three pinned Next.js 16 repos + `FIXTURE_MANIFEST.json` (expected SHAs
and content hashes; verified read-only by `scripts/verify_fixture_manifest.py`).

**Scripts** (`scripts/`): `measure_execution.mjs` · `capture_screens.mjs` · `capture_motion.mjs`
(`--script` for pinned choreography) · `check_static_execution.sh` · `verify_fixture_manifest.py`
(read-only gate) · `write_fixture_manifest.py` (**authoring only — never during a run**) ·
`freeze_fixtures.sh` · `check_fixtures.sh`.

**Results** (`results/`): findings docs — `BASELINE_FINDINGS.md`, `OPUS_ARM_FINDINGS.md`,
`SONNET_AND_LAYERC_FINDINGS.md`, `LAYERC_I5_FINDINGS.md`, `REGISTER_BASELINE_FINDINGS.md`,
`S0_DISCOVERY_FINDINGS.md`, `BLIND_SCORING_REP1.md/.json`, `NEXT_RUN_MATRIX.md` (the plan) ·
`research/R1–R3` (verified reference/skill/catalog sweeps) · `proposals/` + `proposals21/` (35
archived agent proposals) · `execution/` (13 diffs, 19 measurement/record JSONs, 42 screenshots,
3 motion recordings, `blind_ranking_w1/` with sealed mapping + recorded ranks).

**`docs/` — folded in so this zip is self-contained:**
- `docs/ORIGINAL_SPEC.md` — the original 31-page wish-list spec this project started from and
  deliberately did not build.
- `docs/SESSION_STATE_NOTES.md` — dated running state notes from the working sessions (the
  chronological record behind CHANGELOG.md).

**This zip is the whole project.** Nothing outside it is required to continue. Earlier package
versions (v0 → v2.4) exist in `~/Documents` as history only.

---

## 11. One-paragraph summary for whoever asks

We tried to build a big creative-frontend skill, then measured whether the failures it assumed were
real. Across 53 runs on three model tiers they mostly weren't: agents route technology well, resist
over-design, resist catalog soup, and can build genuine 60fps WebGL spectacle when asked. Four real
gaps survived measurement — offscreen pausing, verifying claims, checking catalogs before
hand-rolling, and recognizing when a brief wants spectacle — and those four lines, plus an
activation description and the ownership rules, are the skill. What remains is one more spectacle
rep, writing that small skill, and running the with-skill comparison against the pre-registered
success bar.

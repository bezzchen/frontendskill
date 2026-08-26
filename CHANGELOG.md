# Changelog

## v3.3 — 2026-08-26

- **`results/I4_PIN_DOSSIER.md`** — closes the research half of the I4 deferral, open since v1.8.
  Facts pulled live and **browser claims tested on this machine**. Recommendation: **keep the
  `curtainsjs@8.1.6` pin as-is and run I4; add gpu-curtains later as a separate case (I4b)**,
  gated on a browser change — not a swap. Rationale: the harness tests execution of a *pinned*
  library, so a frozen target is a feature; curtainsjs carries real traps (its bare-string
  `exports` blocks every subpath **including the UMD path its own README documents**); and
  gpu-curtains is pre-1.0/self-described WIP with **no WebGL fallback**, which makes the
  "fallback" dimension a categorically different test. The author has published no deprecation
  notice anywhere, so a swap would encode a claim he never made.
- **Measurability is the decisive constraint, and it repeats a lesson this project already
  learned.** Playwright's default `chrome-headless-shell` returns a **NULL WebGPU adapter** and
  gpu-curtains renders nothing; adding `--enable-unsafe-webgpu` *appears* to fix it while
  silently handing back **SwiftShader, a CPU rasterizer** — the WebGPU twin of the
  headless-shell WebGL artifact that made "measure with system Chrome" a standing rule. Any
  future WebGPU preflight must assert the adapter is **not** SwiftShader, not merely non-null.
  `curtainsjs` by contrast renders correctly in the default headless shell with zero flags.
- **Unflagged pin-escape found in I4 as it stands:** `react-curtains` (recommended by the
  curtainsjs README) installs cleanly on React 19.2 but was last published **2021** and depends
  on `curtainsjs: ">=8.1.0"` — **floating, not pinned**. I4's pin currently holds by npm
  resolution luck. Two owner decisions recorded: whether reaching for it is a pass or a fail,
  and pinning it in the fixture lockfile regardless.
- Noted for later: **`pixi.js` v8 ships WebGPU *and* WebGL with a real ordered fallback**, making
  it a better vehicle than gpu-curtains if Layer C ever wants a "modern GPU with fallback" case —
  and it is already the pinned specialist for I5.


## v3.2 — 2026-08-25

Non-Fable work: the analysis and owner-facing items that never needed the (rate-limited) model
arm. No eval runs; no pinned condition touched.

- **`results/CRITERION_D_ACCOUNTING.md`** — first evaluation of criterion D. The routing clause
  (≤20%) is **blocked on runs**, not analysis: per-run baseline cost exists for all 18 routing
  runs, but no with-skill routing arm has been run. The execution clause (≤30%) is **indicative
  only** and shows **no overhead detected** — with-skill I2 median ~251k context tokens against a
  baseline range of ~250–300k, durations overlapping. Also documents a real **recording gap**:
  `implementation_evals.json > capture` requires per-run token/duration, but baseline
  implementation runs persisted them only as prose (I2) or not at all (I5).
- **`results/E6_RESCORE_DOSSIER.md`** — assembles the written rationale the success bar demands
  for the contested Fable/E6 `architectural_restraint: 2`, with verbatim proposal evidence, the
  case for keeping 2 and the case for raising it, and the decision arithmetic that matters:
  only a **4** lifts E6 above the 3.50 weak-case threshold (2→3 changes the number but not the
  obligation). Notes that E6 reps 2–3 remain unrun, so the case stays single-observation.
- **`results/OWNER_SCORING_WORKSHEET.md`** — every pending human judgment in one guided sheet
  (S1 blind ranking + spectacle scores, W1 signature binaries, Q1/W1 register fit, the E6 call),
  with anchors inlined, file paths named, and each item labelled with what it unblocks.
- **`results/execution/blind_ranking_s1/RANKS.template.json`** — fill-in template mirroring the
  W1 format, carrying the eight spectacle dimensions, the automatic caps, and the M-battery
  results pre-filled for dimension 8 so runtime evidence needn't be judged by eye.
- **`results/SUCCESS_BAR_STATUS.md`** — new: criterion-by-criterion board for the whole
  pre-registered success bar (A–G). Three criteria **met** (C activation 70/70, G2 spectacle
  recognition, G4 catalog discovery), none failed, and the remaining nine rows split cleanly:
  five need only the Fable arm, four need an owner scoring session. Also flags G3 as "met in
  substance, not in form" — no standalone with-skill D1 arm was run, though the D0 reps cleared
  D1's evidence bar.
- **Per-run cost backfilled** into all six with-skill implementation records (`cost` block:
  tokens, duration, convention, caveats), partially self-executing the recording-gap fix. The
  baseline side cannot be reconstructed, so that asymmetry is permanent for these arms.


## v3.1 — 2026-08-25

Attribution follow-up (no eval runs; no model arm involved — done while the Fable arm was
rate-limited, so nothing about the pinned conditions changed).

- **I5ws-rep2's failure cause upgraded from inference to observation.** New one-off probe
  `scripts/investigations/attribution_probe2.mjs` tallies rAF **by callback identity** and
  asserts element visibility before sampling. Result: rep2 runs **two** independent Pixi
  `Ticker._tick` loops at 60/s while active and **one survives** once the section fully exits
  (visible fraction 0.00) — arithmetically the measured 0.50. **Matched control I5ws-rep3**
  (harness PASS) shows the identical two-ticker structure while active and **zero survivors**
  when paused. Raw result: `results/execution/I5ws-rep2-ATTRIBUTION.json`; rep2's record and
  the arm findings updated.
- The residual one-step inference (`Ticker.system` vs `Ticker.shared`) is stated explicitly:
  neither build's debug hook reaches the Ticker class, so `system.started` was never read
  directly; the identification rests on rep2's `sharedTicker:false` config, Pixi v8's
  documented autostart, and rep3's lockstep gating yielding zero survivors.
- Sharpens skill v1.1 candidate #2: rep2's own-loop frame counter read zero while a second
  Pixi loop ran at full rate — so line 2 should require **global** rAF verification, not a
  self-reported counter. (Still NOT applied; freeze rules hold until the owner decides.)
- **I5ws-rep1's mobile M3 flag likewise upgraded to an observation.** New
  `scripts/investigations/decay_probe.mjs` sampled eight consecutive 2s windows under
  reduced motion: `94.5, 0, 0, 0, 0, 0, 0, 0` rAF/s — activity confined to the first ~2s,
  then exactly zero for 14s, reproducing the measured 0.358 as a settle tail caught by M3's
  single 3s window. **The FAIL stands as measured**; only the diagnosis changed. Raw:
  `results/execution/I5ws-rep1-M3-DECAY.json`. Supports v1.1 candidate #3 ("paused means
  promptly") and suggests a future instrument note (M3 could report a decay series) —
  not applied, thresholds frozen.


## v3.0 — 2026-08-25

**Section E, I2/I5 with-skill arm — the primary efficacy test. The pre-registered pause
target is MET on the binding case, with honest variance and two M3 flags on the record.**

- Six serialized implementation runs on pristine pinned fixtures, each with an immediate
  source snapshot (+ ~/Documents safety copies) and a full independent battery (M1–M6 with
  M2b, GPU Chrome). Two org spend-limit interruptions recovered via transcript resume.
- **I5 with-skill: 2/3 binding M2 passes at ratio 0.00 (target ≥2/3 met; baseline 1/3).**
  rep3 = clean sweep (M2/M2b/M3 all 0.00 both profiles, first fully-binding I-series sweep);
  rep1 = mobile-binding 0.00 with an M3 mobile latency flag (0.358); rep2 = FAIL with the
  exact-half signature (0.50 everywhere) attributed with high confidence to Pixi v8's
  ungated `Ticker.system` — the baseline failure class one layer deeper, caught by the
  instrument after the agent self-verified via its own-loop proxy.
- **I2 with-skill: 3/3 operative pause passes (M2b 0.00 ×3; baseline M2 0/3 at 1.00).**
  All three built top-of-page compositions, so scroll-out M2 geometry-gated — the
  comparability limit is stated and both readings (strict-M2 vs pre-registered operative
  clause) are documented in the findings.
- Uniform secondaries: zero dependency drift (exact pinned specialist or nothing), registers
  named unprompted 6/6, fresh-API discipline (anime 4.5 AutoLayout discovered from the
  installed package; all Pixi APIs source-verified), M5/M4/M6 green across the arm.
- **Skill v1.1 candidates recorded, NOT applied** (freeze rules): name `Ticker.system` in
  line 1; require global-rAF verification in line 2; "paused means promptly" nuance.
- Findings: `results/I2I5_WITHSKILL_FINDINGS.md`; per-rep records + diffs + snapshots +
  screenshots in `results/execution/`.
- Remaining Section E arms held for the owner: Q1/W1 (criterion F), S1ws ×3 + pooled blind
  ranking (G1), calibration ablation, criterion D overhead accounting.


## v2.9 — 2026-08-25

**Section E wave 1 — the first with-skill runs. Both plan-only criteria PASS 3/3 against
0/3 baselines.**

- **Pre-registered `evals/withskill_protocol.md`** before any run: with_skill_v1 = verbatim
  SKILL.md body as a loaded-skill block + unchanged pinned prompt, fresh pristine fixture
  copy per rep, Fable tier; pre-loading justified by criterion C's 70/70 activation result;
  the baseline-wrapper parity assumption documented as a limitation.
- **S0 with-skill ×3 (criterion G2): PASS 3/3** — every rep explicitly weighed Q/W/S and
  chose S in writing, and every rep proposed a realtime graphical system (evaluator +
  full-viewport raw WebGL2 stage; scrub-authority page + OGL particle terrain; composition
  engine + frame-slaved GPU surface). Baseline: 0/3, with 2/3 arguing against WebGL.
  All three also independently declined spatial-3D spectacle — the owner's pinnacle
  question stays with the calibration ablation, unconfounded.
- **D0 with-skill ×3 (criterion G4): PASS 3/3** — every rep ran a live, cited catalog
  sweep unprompted and produced D1-grade adopt/adapt/reference-only/custom verdicts
  (unanimous: adapt React Bits Topography + motion-spring CTA; licenses gated, deps
  pinned; one rep found a real bug in the recommended component; one corrected its own
  stale version belief per the freshness line). Baseline: 0/3 searched.
- **Unscored but recorded:** lines 1–2 transferred unprompted into D0 plans (pause +
  real-condition verification, never asked for by the brief); no spectacle inflation on
  the subtle brief (3/3 chose W, S declined in writing); no component soup; with-skill
  discovery costs real research tokens (criterion D accounting binds in later arms).
- **Deviations documented** (wave record): 4/6 reps stalled on a notification-routing
  quirk after delegating research to child agents; orchestrator resumed each with its own
  commissioned report relayed verbatim + mismatch escape hatch; all four confirmed
  ownership; D0 sweep-to-parent assignment ambiguity recorded.
- Artifacts: `results/proposals_e/` (6 verbatim captures + `WAVE_RECORD_E1.json`),
  `results/SECTION_E_PLANONLY_FINDINGS.md`.
- **Remaining Section E arms, still gated on the owner:** I2/I5 with-skill (M2b pass-rate
  target: ≤0.2 in ≥2/3), Q1/W1 register-fit pairing (criterion F), S1 with-skill ×3 +
  pooled blind ranking (G1), calibration ablation (the pinnacle probe), overhead
  accounting (criterion D).


## v2.8 — 2026-08-25

Section C complete: **the S1 spectacle baseline is closed at 3 reps.** Plus rep2's M2b
retro-measurement per the owner's ruling.

- **S1-rep3 run and fully measured** (fresh pinned fixture verified pristine; single 57-min
  uninterrupted run). Artifact: "The page is a Meridian file" — 24s five-act scroll-scrub,
  ~12k instanced keyframe diamonds in raw WebGL2 (zero deps, one draw call), diegetic editor
  chrome with SMPTE HUD, and a draggable cubic-bezier editor that re-times the field and
  live-rewrites the exported CSS. Battery: M1 PASS GPU (p50 16.7ms, 0% hitches both
  profiles), M2 NOT_MEASURABLE_BY_GEOMETRY (mechanical), **M2b PASS natively** (ratio 0.00,
  clean resume — first native use of the v2.6 instrument), M3 PASS full parity, M4/M5/M6
  PASS; one benign favicon 404 recorded honestly. Source snapshot archived at battery time
  (plus a safety copy in ~/Documents); diff includes untracked engine sources.
- **rep2 retro-measured with M2b from its archived snapshot** (owner ruled it counts,
  flagged): PASS ratio 0.00 both profiles, clean resume; geometry gate mechanically
  reproduced the v2.4 hand adjudication; M1 GPU re-confirmed. `S1-fable-rep2-m2b.json`;
  record updated.
- **Consolidated findings** in `results/S1_CONSOLIDATED_FINDINGS.md`: 3/3 concept-family
  convergence ("Meridian file" / scroll-as-playhead — low between-run premise diversity, now
  a documented ranking caveat), demanded-pause behavior measured and holding (2/2 measurable
  reps at ratio 0.00), S0↔S1 register contrast at full 3-rep strength, and the owner's
  "pinnacle" question (no rep self-selected spatial 3D) routed to the pre-planned
  calibration ablation.
- **Blind-ranking set built**: `results/execution/blind_ranking_s1/candidate-{A,B,C}.webm`
  with `SEALED_MAPPING.json` (random assignment; soft-blind caveats documented).
- Held for owner: blind ranks + spectacle-fit scores (owner homework), then **Section E**.


## v2.7 — 2026-08-24

Section D complete: **skill v1 authored and its activation boundary verified.** Also records
the owner's two decisions from today.

- **`skill/creative-frontend-architect/SKILL.md` v1** written — activation description, the
  four evidence-earned non-negotiables, Q/W/S registers, ownership rules (one director,
  one-owner-per-concern, catalogs-vs-substrates), freshness policy. ~700 words; contains no
  routing/restraint rules (cut per the 24-run baseline), no vendor bodies, no component source.
- **Criterion C trigger tests: PASS, 70/70.** All 14 `trigger_queries.json` queries × 5
  fresh-context Fable reps, per the pre-registered `evals/trigger_probe_protocol.md` (new file;
  fixed 6-skill roster incl. frontend-design as the hard confuser, multi-skill replies allowed,
  scoring interpretation frozen before the first probe). Core positives 5×5/5 (bar ≥4/5);
  near-miss negatives 5/5 queries with every rep correct (bar ≥80% of queries); boundary
  positives and easy negatives clean. frontend-design co-fired on 100% of boundary positives
  and never on negatives — the director/architect split reads coherently to fresh agents.
  Raw table `results/SECTION_D_TRIGGER_RESULTS.json`; analysis `results/SECTION_D_FINDINGS.md`.
- **Owner ruling recorded (S1-rep2):** counts toward the 3-rep spectacle baseline, flagged —
  comparability caveat carried in findings; archived snapshot eligible for M2b retro-measurement.
  Written into `results/execution/S1-fable-rep2.record.json > owner_ruling`.
- **Owner sequencing decision:** Section D ran before Section C (cheap, and the skill's four
  lines were already evidence-complete; rep3 does not feed skill content). Sections C and E
  remain held for the owner's go.


## v2.6 — 2026-08-24

Instrument release: the M2 blind spot queued in both S1 records is closed. No eval runs;
no thresholds changed; no fixture touched (manifest re-verified PASS at the pinned SHAs).

- **M2b added to `scripts/measure_execution.mjs`** — hidden-document pausing, measured
  app-level: the page stays genuinely visible while `document.hidden`/`visibilityState` are
  overridden and `visibilitychange` is dispatched, so native hidden-tab rAF throttling cannot
  mask app behavior. 3s baseline → 3s hidden → 3s resume; pass = hidden rate ≤ 20% of baseline
  (same ratio as M2); resume recorded (`resumes`, ≥ 50% of baseline) and flagged via `caveat`
  when absent, not auto-failed. Summary gains `m2b_hidden_pause`.
- **M2 geometry gate mechanized** — when the target still occupies > 15% of itself or of the
  viewport after the scroll-away, M2 self-reports `NOT_MEASURABLE_BY_GEOMETRY` (with the observed
  geometry recorded) instead of a false FAIL needing human adjudication. Codifies the identical
  S1-rep1/rep2 rulings.
- **Rubric amendment** in `rubrics/execution_measurement.md` (dated section, pre-registered
  before any with-skill run per the freeze rule): M2b definition + the geometry gate note.
  The script's `protocol` string now carries the amendment date.
- **Validated with three smoke controls** (banked as `results/execution/SMOKE-m2b-*.json`):
  scrollable good citizen (M2 pass / M2b pass, hidden 0 of 60 rAF/s, clean resume), bad actor
  ignoring visibility (M2 fail / M2b fail, hidden ratio 0.99), viewport-fixed canvas pausing only
  via `visibilitychange` — the S1 geometry class (M2 `NOT_MEASURABLE_BY_GEOMETRY` at visible
  fraction 1.0 / M2b pass). Both directions discriminate; the S1 adjudication reproduces
  mechanically.
- Consequence for held sections: S1-rep3 (Section C) and every Section E run get a real M2b
  verdict instead of `NOT_MEASURABLE`; S1-rep2 can be retro-measured from its archived source
  snapshot if the owner rules it valid.


## v2.5 (final) — 2026-08-21

Consolidated into a single self-contained deliverable.

- Added `docs/ORIGINAL_SPEC.md` (the 31-page spec the project started from) and
  `docs/SESSION_STATE_NOTES.md` (dated running state notes) so the zip needs nothing external.
- `HANDOFF.md` file map updated accordingly: this zip is now the whole project.


## v2.5 — 2026-08-21

- **Added `HANDOFF.md`** at the package root: a complete cold-start handoff (project premise, the
  seven method rules, all measured findings, the four earned skill lines, next sections, the owner's
  open decisions, operational hazards, a runbook, and a full file map). Written so someone with zero
  context can continue without this conversation.
- **Recorded S1-rep1 source loss**: after its battery completed, tmp cleanup destroyed both its
  working directory and its agent transcript. Scoring artifacts (86s recording, screenshots, GPU
  measurements, record JSON) were captured beforehand and survive in the zips, so rep1 stays
  scoreable — but it is no longer servable or re-measurable. Note added to
  `results/execution/S1-fable-rep1.record.json`.
- Standing rule now in force: archive a full source snapshot into `results/execution/` at battery
  time for every implementation run (rep2's is archived; rep1 predates the rule).


## v2.4 — 2026-08-21

Section B: S1-rep2 complete with full battery — recorded as a PROTOCOL-DEVIATION run.

- **The deviation**: macOS tmp cleanup wiped the assigned pinned-fixture directory MID-BUILD (and,
  separately, the whole eval working copy during the battery — both restored from the durable
  zips). The agent reconstructed the project from context in its own scratchpad and finished
  there: react 19.2.3 vs pinned 19.2.8, Tailwind absent, no fixture git provenance. Source
  snapshot archived in lieu of a diff; artifact relocated to the canonical run path; validity
  left to the owner (rubric scores the artifact, comparability is the caveat).
- **The artifact**: "The page is a Meridian project file" — 48s five-act scrubbable timeline,
  editorial-darkroom direction, meridian render-sweep, live bezier + stagger conductors compiled
  to real CSS/WAAPI, film-premiere finale. Raw WebGL2 stateless particles, zero runtime deps.
- **Battery**: M1 PASS on GPU (p50 16.8ms, 0% hitches both profiles), M3 PASS (onion-skin
  alternate cut, full parity), M5/M6 PASS, console clean; M2 again NOT_MEASURABLE_BY_GEOMETRY
  (second viewport-fixed canvas - the document.hidden M2 variant is now clearly needed).
  46s choreographed recording captured.
- Operational: three tmp-cleanup strikes in 24h (run dir mid-build, eval package mid-battery,
  earlier npx cache). All recoveries came from the durable ~/Documents zips - the zip-per-version
  discipline is now demonstrably the project's survival mechanism.
- Held for owner: Section C (S1-rep3 + consolidation + blind recording set), Section D (skill
  authoring).


## v2.3 — 2026-08-21

Section A of the split run plan: S1-rep1 complete with full battery. Sections B/C (reps 2-3) and D
(skill authoring) intentionally held for the owner's go, to manage usage.

- **S1-rep1 (baseline spectacle implementation): completed** after three interruptions (two
  spend-limit, one machine sleep; resumed from transcript each time; run dir verified pristine
  before real work began). Result: a genuine spectacle-register build at zero dependencies - raw
  WebGL2 instanced particle field (15k quads, stateless playhead-driven), 24s scroll-scrubbed
  five-act composition, working bezier master-ease editor, spring lab, theme-inversion finale,
  timeline HUD. First use of the pre-registered choreography recording (86s webm).
- **Measurements adjudicated**: M1 PASS on GPU retest (p50 17.2ms, 0% hitches both profiles) after
  the headless-shell produced a ~7fps SwiftShader artifact; M3 reduced-motion PASS with full
  content parity; M5/M6 PASS; zero console errors. M2 ruled NOT_MEASURABLE_BY_GEOMETRY for a
  viewport-fixed canvas (scroll-out never hides it); pause paths exist via
  visibilitychange/idle per agent verification.
- **Instrument learnings queued**: GPU-capable browser required for WebGL-heavy measurement;
  M2 needs a document.hidden variant for fixed backdrops.
- **S0 vs S1 contrast now on record**: unprompted, 0/3 reached for a graphical world (S0);
  explicitly briefed, the same model shipped a real one (S1-rep1) - mirroring the D0/D1
  awareness-vs-capability pattern at the spectacle register.


## v2.2 — 2026-08-20

Data release: the complete plan-only baseline wave (15 runs) for S0 and D0/D1/D2(+controls).

- **S0 register recognition: 0/3.** All reps produced excellent top-of-W mechanism concepts
  (unanimous "page is a Meridian file" family) and none reached for a graphical world; two argued
  against WebGL as brand-aligned. The spectacle register must be recognized or invoked - the
  fourth evidence-backed skill line.
- **D0 unprompted discovery: 0/3 searched.** Rigorous npm/license sourcing, zero catalog
  awareness - confirming awareness as the whole gap.
- **D1 catalog fit: 3/3 unanimous** adapt-Topography + adopt-Magnetic verdicts with full source
  reads, license gates, and dependency-coherence rejections. Decision quality at ceiling.
- **D2 abundance resistance: 3/3 pass** (vs 3/3 bespoke controls) - live sweeps, reference-only
  classifications, substrate-based custom routes, license-gate rejections; zero derivative drift.
- Findings: results/S0_DISCOVERY_FINDINGS.md; artifacts: results/proposals21/ (15 proposals +
  wave record). Wave interruptions (two spend-limit hits, one machine sleep) documented in the
  record; recovery used transcript resumes for failed-state agents and pristine relaunches for
  stopped-state agents.
- S1 implementation baseline (3 reps, serialized) begins with this release.


## v2.1 — 2026-08-20

Implements the owner's five critiques (validated 2026-08-14) plus both smaller changes. No
baselines invalidated; no thresholds loosened; all new criteria pre-registered before their runs.

- **Run metadata expanded** (`run_metadata_template.json`): design director loaded, specialist
  skills consulted, calibration used, catalogs checked, primitives adopted/rejected **with
  reasons**, renderer ownership, screenshot/recording paths, choreography script. Correction to
  the critique's framing: nothing had been removed — these fields never existed and are new.
- **Criterion G pre-registered** (`rubrics/success_bar.md`): explicit success criteria for S1
  (blind-ranked preference + rubric median, zero measurement regressions, no component-soup
  spectacle), S0 (register recognition ≥2/3), D1 (verdict quality, "nothing fits" first-class),
  D0 (unprompted search ≥2/3 with-skill), D2 (abundance must not increase derivative-ness).
- **Registries cleaned**: all volatile star counts removed (popularity lives only in the dated
  R2/R3 research reports); fact policy added (every license/version fact is a source-backed,
  dated snapshot, rechecked before adoption); Paper Shaders license re-verified against npm
  (@paper-design/shaders-react v0.0.80 → Apache-2.0; the external correction claim did not hold);
  **eval pins** added — six candidate skill repos pinned to HEAD SHAs fetched 2026-08-20 for
  reproducible ablations (production use tracks live).
- **Director/reviewer lanes split** (`registries/external_skills.json > lanes`): exclusive
  directors = Impeccable / taste-skill / StyleSeed / UI Craft*; reviewers/QA coexist (Vercel
  guidelines pinned, a11y, runtime measurement, visual review); Hallmark et al. moved to
  reference/design-DNA. Fixes the v2.0 director_lane_rule that wrongly listed reviewers as
  directors (rule text retained with a superseded note).
- **De-leading + new probes**: D1 reworded to demand the evidence-based adopt/adapt/reference/
  custom verdict without suggesting catalog use; **D0** added (identical brief, zero catalog
  mention — measures unprompted discovery); **S0** added (unforgettable-experience brief naming
  no technology — measures spectacle-register recognition; plan-only).
- **Choreography support** in `capture_motion.mjs` (`--script`): pre-registered per-eval
  interaction scripts, identical across conditions and reps; first script committed at
  `evals/choreography/S1-spectacle-launch.choreography.json`; smoke-tested end-to-end (22s webm,
  all step types). Catalogs-vs-substrates promoted to an explicit architect concept in
  ARCHITECTURE_V2.md and registry tier_semantics.
- **Operational incident**: macOS tmp cleanup reaped aged files from the scratchpad working
  copies (package root files; phase0 run dirs lost package.json files). The package was restored
  from the canonical v2.0 zip before editing — fixtures re-verified (all three SHAs intact).
  Consequence: the old phase0 run directories are no longer valid for re-measurement; any
  re-measurement must start from fresh fixture copies. All archived results/ data (proposals,
  diffs, measurement JSONs, screenshots, recordings) lives inside the package and is unaffected.


## v2.0 — 2026-08-12

The register system gains its ceiling, and the registries gain verification.

- **W1 blind ranking recorded** (owner): rep1 (NLE dock) > rep2 (editor session) > rep3 (Observatory),
  plus the calibration note that none reach the owner's expressive ceiling (landing.love-grade
  3D/motion) — the datum that motivates the S1 register. `results/execution/blind_ranking_w1/RANKS.json`.
- **Adopted the owner's v2 docs**: ARCHITECTURE_V2.md (multi-skill orchestration: design director /
  architect / specialists / catalogs), rubrics/spectacle_fit.md (S1 rubric), registries/ +
  skill_discovery_policy.md, references/landing_love_calibration.md, results/NEXT_RUN_MATRIX.md (v2).
- **Independent 3-agent sweep completed** (results/research/R1-R3): landing.love references 5/5
  verified + 10 award-verified anchors added (Lusion as the S1 anchor); skills registry 20/20
  verified with corrections (freshtechbro rejected-stale, podo provenance caution, React Bits URL
  moved, Motion AI Kit paywalled-unverified); component registry corrected (Animate UI demoted
  stale + Commons-Clause, SmoothUI promoted best-agent-ready, Fancy Components added as the
  biggest miss, new npm-substrate tier, license/staleness/dependency-coherence gates).
- **Registry adds from the sweep**: emilkowalski/skills confirmed first-party hidden gem
  (29.3k stars, 10 skills, 16/20 → core_evaluate; kylezantos demoted to research),
  vercel web-design-guidelines (reviewer gate), taste-skill (76.6k stars, Impeccable's ablation
  rival). Impeccable verified BETTER than claimed (59.2k stars, v4.1.1 same-day, deterministic
  CLI) with a boundary-pinning rule: its overdrive/animate lanes yield to the architect's routing.
  New director-lane rule: exactly one design-director skill per project.
- **New evals**: evals/spectacle_evals.json (S1 on launch-page-base; calibration file is ablation
  context only, never baseline) and evals/discovery_evals.json (D1 catalog-fit, D2
  bespoke-identity trap; plan-only).
- **New tool**: scripts/capture_motion.mjs (Playwright video of a scripted 45s interaction pass)
  — required by the S1 rubric's no-recording cap; smoke-tested against W1-rep1 (26s, 2.6 MB webm).
- Open on the owner's side: W1 signature-moment binaries, register-fit scores, E6 rescore, I4 pin.


## v1.9 — 2026-08-11

Closes the harness's register asymmetry: everything so far could catch over-design but was
structurally blind to under-design (an always-restrained agent passed every instrument).

- Added `evals/register_evals.json`: **Q1** (quiet settings surface; traps over-design) and **W1**
  (expressive Meridian launch page; traps timidity). Quality constraints are stated in both
  prompts so register, not diligence, is the discriminating variable.
- Added `rubrics/register_fit.md`: per-register 0–4 anchors, over-design and timidity flag
  checklists (the original spec's anti-generic list, finally operationalized — in both
  directions), a signature-moment binary, and a blind comparative ranking protocol for W1
  (ranks over absolute wow scores). Pre-registered before any register run.
- Added success-bar **criterion F (register switching, PROVISIONAL)**: the same skill version must
  land both registers; sacrificing one for the other fails outright.
- Added fixture `launch-page-base` (`3543ef9`): a deliberately plain placeholder launch page for a
  fictional motion-editor tool, giving W1 unambiguous expressive license. Lockfile frozen,
  build verified, registered in freeze/verify scripts and the manifest.
- Register baselines (Q1 ×3, W1 ×3 on Fable) launched as the first Step 2b data.

## v1.8 — 2026-08-11

Data release: NEXT_RUN_MATRIX Step 2 second case (I5 on Fable) plus the missing I2 screenshot
capture. No thresholds or prompts changed; two instrument patches documented below.

- **I5 Layer C baseline (3 Fable implementation reps, measured):** the fork question is answered —
  offscreen pausing is *capable but unreliable even when explicitly demanded*: rep2 fully passes
  M2 (ratio 0.00 — it alone silenced Pixi's auto-started `Ticker.system`), rep1 partially
  (own loop stops, library ticker remains at ratio 0.51), rep3 fails (ratio 0.99) despite claiming
  IntersectionObserver pausing "verified" — its verification tested `document.hidden`, not
  scroll-out-of-view. All else excellent: 60fps at 500 sprites both viewports, clean builds/console,
  correct Pixi v8 idioms, accessible parallel lists, distinct mobile modes. Full analysis in
  `results/LAYERC_I5_FINDINGS.md`. Skill case now rests on two evidence-backed lines: pause
  offscreen unprompted, and verify claims by measuring the actual condition.
- **Design-coherence screenshots** captured for all I2 and I5 reps (desktop/fullpage/mobile) via
  new `scripts/capture_screens.mjs`, closing the capture-list gap.
- Instrument patches: `measure_execution.mjs` gained a lazy-mount sweep (rep2's code-split Pixi
  boot produced a correct-but-avoidable NOT_MEASURED) and, earlier, a non-stability-waiting
  scroll; `check_static_execution.sh` produced two cross-file-ownership false positives
  (`atlas.js`/`visuals.js` — adjudicated in findings; fix queued).

## v1.7 — 2026-08-11

Data release: executed NEXT_RUN_MATRIX Steps 1 (partial) and 2 (first case). No rules, thresholds,
prompts, or fixtures changed.

- **Sonnet routing arm (6 runs):** zero critical failures; first dependency-restraint deviations
  in 24 routing runs (E1 adds `motion` for a settings page, E5 adds `d3-force`). Tier gradient
  exists but is shallow; routing skill content remains unjustified. Proposals archived.
- **I2 Layer C baseline on Fable (3 implementation reps), scored by the pre-registered protocol:**
  all reps pass M1 (p50 16.7 ms, p95 17.6 ms, 0% hitches), M3 (reduced-motion ratio 0.00 with
  content parity), M4, M5, M6 (zero Anime v3 patterns) — and **all three fail M2 identically**
  (offscreen rAF ratio 1.00; the orbit never pauses out of view). First reproducible,
  objectively-measured baseline gap of the project; also the first evidence-backed skill-content
  candidate. Analysis in `results/SONNET_AND_LAYERC_FINDINGS.md`; diffs + measurement JSONs in
  `results/execution/`.
- Measurement harness fix found on first contact with real implementations:
  `scrollIntoViewIfNeeded` waits for bounding-box stability and hangs forever on permanently
  animated sections; replaced with non-waiting `scrollIntoView`.

## v1.6 — 2026-08-11

Verified v1.5's arithmetic independently: all 12 `load_bearing_composite` values recompute exactly,
Fable median 3.833, Opus 4.000. The ceiling claim is arithmetically sound. Four changes follow.

- **Layer C is now measured, not described.** Added `rubrics/execution_measurement.md` (M1–M6 with
  thresholds pre-registered before any Layer C run) plus two validated tools:
  - `scripts/measure_execution.mjs` — Playwright harness for frame cadence (p50/p95/hitch rate),
    offscreen pausing, reduced-motion behavior + content parity, teardown, and accessible parallel
    representation. Supports `--executable-path` for browser pinning.
  - `scripts/check_static_execution.sh` — Anime v3 pattern detection (automatic failure), interval
    render loops, cleanup paths, pin drift, build.
  Both were smoke-tested with **negative and positive controls**, archived in `results/execution/`:
  the clean fixture correctly returns `N_A_NO_CONTINUOUS_ANIMATION` rather than false failures, and
  a deliberately bad implementation is correctly failed on M1 (p50 33.3 ms vs ≤18 ms), M2 (offscreen
  rAF ratio 1.00) and M3 (reduced motion ignored). Testing the harness caught a real bug in it:
  zero-animation pages were initially scored FAIL instead of not-applicable.
- **Recorded the saturation warning.** 80 of 91 raw cells (87.9%) scored 4, one cell below 3. The
  ceiling is now treated as jointly caused — strong routing *and* a measure too coarse to
  discriminate — rather than as settled evidence about model capability. Layer B pass/fail is
  restricted to the load-bearing trio; the other dimensions become plan-quality signals.
- **Flagged the contested score the new weak-case rule depends on.** Fable E6's Architectural
  Restraint = 2 is the only sub-3.50 case, yet the run added zero dependencies and gated its canvas
  behind reduced-motion and offscreen pausing, while the rubric's low anchors describe dependency
  and renderer escalation. Requires a written rationale or second scorer before the rule binds.
  Also closed the rule's escape hatch: E6 is ineligible for the non-activation defense, since its
  equivalent is a `core_positive` in `trigger_queries.json`.
- **Rebalanced the run matrix and restored the cheap-model arm.** v1.5 gave the demoted routing
  guardrail 24 runs and the primary specialist test 12. Now 18 routing runs (including a new
  **Sonnet arm** — the highest-value remaining Layer B question) and 18 Layer C runs across three
  arms. Criterion B is marked **PROVISIONAL**: revisable once after the Layer C baseline lands and
  before any Layer C with-skill run, so it does not repeat the +0.75 sequencing mistake.

No thresholds were loosened; no with-skill run has occurred; fixtures and routing prompts unchanged.

## v1.5 — 2026-08-11

- Restored CI/container-safe read-only fixture verification using a fixture-scoped Git
  `safe.directory` override; no global Git config mutation.
- Corrected baseline accounting: **12 valid clean routing runs** (6 Fable + 6 Opus) plus
  **6 coached-fixture diagnostic runs** excluded from baseline scoring.
- Added blind single-reviewer scoring of the 12 clean rep-1 proposals:
  - Fable load-bearing median: **3.833 / 4**
  - Opus load-bearing median: **4.000 / 4**
- Documented the resulting routing ceiling effect.
- Revised the success bar **before any with-skill run**:
  routing is a non-regression guardrail; specialist execution + activation are the primary efficacy tests.
- Marked I4 (`curtainsjs@8.1.6`) **DEFERRED** pending an explicit legacy-WebGL vs modern-WebGPU
  (`gpu-curtains`) test decision.
- Added `results/NEXT_RUN_MATRIX.md` for remaining routing reps and Layer-C baseline runs.
- Intentionally did **not** rename fixture package names because rep 1 already ran against the frozen
  fixture SHAs; changing fixture metadata now would break rep comparability.

## v1.4 — 2026-08-10

- **Ran the Opus 5 model arm** (6 routing runs, same prompts/fixtures/method as the Fable arm,
  explicit model override). Result: zero dependencies added, zero critical failures, 6/6
  instruction compliance. The failure modes the skill was designed to prevent did not appear one
  capability tier down either. Analysis in `results/OPUS_ARM_FINDINGS.md`; proposals in
  `results/proposals/E*-opus.md`; records appended to `results/rep1_runs.json` (18 runs total).
- Recorded an environment caveat: a local `Fact-Forcing Gate` hook fires inside evaluated
  subagents on first Bash/Write calls. It applies to both arms equally but is not clean-room; an
  eval machine without such hooks is preferable for official runs.
- Verified and corrected a claim from an evaluated run: `animejs@4.5.0` exports **both** `spring`
  and `createSpring` (checked in `node_modules`), so E2-opus's doc-based "correction" was itself
  inaccurate. Recorded as evidence that doc-consultation ≠ factual accuracy — a possible skill
  responsibility that routing evals do not currently measure.

## v1.3 — 2026-08-10

- **De-instrumented the fixtures** after rep-1 baseline runs showed the harness coaching the
  evaluated agents: fixture READMEs carried rubric text, page copy rendered "Evaluation fixture" /
  "intentionally restrained", layout metadata and commit messages identified the repos as evals.
  Two of six runs cited README instrumentation as decision input. Fixtures now have neutral
  READMEs/copy/metadata and a squashed single-commit history; manifest re-pinned
  (next-tailwind-base `edf3be4`, anime-v4-portfolio `6f5dcaa`); builds re-verified via
  `npm ci && next build`. Reviewer-facing notes stay in EVAL_PLAN, outside the fixtures.
- **Ran Phase 0B rep 1** (12 routing runs: 6 evals × coached/clean fixture variants,
  claude-fable-5, fresh contexts). Records in `results/rep1_runs.json`, proposals in
  `results/proposals/`, analysis in `results/BASELINE_FINDINGS.md`. Headline: zero critical
  failures, one dependency added across 12 runs; the assumed baseline failure modes did not
  appear on this model tier.
- Flagged I4's `curtainsjs@8.1.6` pin: registry-verified stale (last publish 2024-05-02);
  successor `gpu-curtains` active. Decision needed before running I4.
- Coached-variant rep-1 runs are retained for the coaching-effect comparison but are not valid
  baseline data; official baselines start from the de-instrumented fixtures.

## v1.2 — 2026-08-10

- Fixed a methodological integrity bug: `check_fixtures.sh` no longer calls the manifest writer.
  Verification is now read-only and fails on Git revision, content-hash, dirty-tree, lockfile, or
  baseline-blocker mismatches.
- Added `scripts/verify_fixture_manifest.py`; marked `write_fixture_manifest.py` authoring-only.
- Added exact implementation prompts and pinned specialist architectures:
  - I2: existing `animejs@4.5.0`
  - I4: `curtainsjs@8.1.6`
  - I5: `pixi.js@8.19.0`
- Labeled the three distinct evaluation layers:
  A) activation, B) routing/judgment, C) specialist execution.
- Bumped suite/docs/manifest metadata to v1.2.
- Routing tasks, fixture content, rubric thresholds, and pre-registered success criteria remain unchanged.

## v1.1 — 2026-08-10

- Fixed both fixtures failing `next build` (`@/` alias had no `jsconfig.json` after the
  TypeScript-removal commit); added `jsconfig.json` to each and verified clean builds via
  `npm ci && next build`.
- Ran `freeze_fixtures.sh`: `package-lock.json` committed in both fixtures, manifest revisions and
  lock status updated, baseline blocker cleared; `check_fixtures.sh` passes.
- Added a real Anime.js v4 usage to the anime fixture (`components/IntroFade.jsx`, reduced-motion-aware
  intro reveal wired into `app/page.jsx`) so the "existing stack" is genuinely in use, while keeping
  drag/layout/stagger/timeline APIs out of the repo to preserve the version-freshness test. API calls
  verified against installed animejs 4.5.0 type definitions.
- Updated E2 expected behavior and both fixture READMEs to reflect the in-use motion system.
- Renamed `ConstellationData.ts` → `.js` in the JS fixture.
- Success bar: made criterion 1's aggregation formula explicit, restated criterion 2 against baseline
  medians, added criterion 7 sample size (5 reps, ≥ 4/5). Documented per the pre-registration rule;
  changed before any baseline or with-skill run; no thresholds loosened.
- Bumped suite names, EVAL_PLAN, and README to v1.1; consolidated changelog into this file.

## v1 — initial harness

- Added two reproducible Git fixture repositories.
- Pinned current direct versions for Next/React/Tailwind and Anime.js v4.
- Added an explicit package-lock freeze gate before official baselines.
- Increased runs to 3 repetitions per task per condition.
- Split 6 routing evals from 3 priority implementation evals.
- Added E6 vague-intent/restraint test.
- Removed the prescribed mobile solution from E2.
- Made E3 capability-based rather than GSAP-name-based.
- Added anchored scoring, N/A handling, blind-review guidance, and critical-failure tracking.
- Added near-miss activation tests.
- Added run metadata and pre-registered success criteria.

#!/usr/bin/env node
/**
 * Layer C execution measurement harness.
 *
 * Takes the M1-M5 measurements defined in rubrics/execution_measurement.md against a
 * running production build, and writes a JSON verdict. Measurements that cannot be taken
 * are reported as NOT_MEASURED — never as a pass.
 *
 * 2026-08-24: M2 now self-reports NOT_MEASURABLE_BY_GEOMETRY when the target never leaves
 * the viewport (viewport-fixed backdrops), and M2b measures app-level pausing under a
 * synthetic document.hidden override. See rubrics/execution_measurement.md, M2b amendment.
 *
 *   node scripts/measure_execution.mjs --url http://localhost:3000 --section "[data-experience-system]" \
 *     --run-id I5-fable-rep1 --out results/execution
 *
 * Requires Playwright (`npx playwright install chromium` once).
 */
import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1]]);
    return acc;
  }, [])
);

const URL_ = args.url ?? "http://localhost:3000";
const SECTION = args.section ?? "canvas";
const RUN_ID = args["run-id"] ?? `run-${Date.now()}`;
const OUT_DIR = args.out ?? "results/execution";
const SAMPLE_MS = Number(args["sample-ms"] ?? 8000);

const THRESHOLDS = {
  desktop: { p50: 18, p95: 26, hitchPct: 1 },
  mobile: { p50: 22, p95: 34, hitchPct: 2 },
  offscreenRatio: 0.2,
  reducedMotionRatio: 0.2,
  // M2b (2026-08-24 amendment): same pause bar as M2, applied under synthetic document.hidden.
  hiddenRatio: 0.2,
  // Fraction of the element (or of the viewport) that may remain visible after the
  // scroll-away before M2's geometry is declared unable to measure.
  geometryVisibleLimit: 0.15,
};

/** Instrumentation installed before any page script runs. */
const INIT = () => {
  // M1 amendment 2026-09-07: cadence is measured per BROWSER FRAME, not per callback.
  // Multiple callbacks in one frame share a timestamp; counting each as a sample injected
  // zero-duration intervals that diluted hitchPct (reproduced: a 2% hitch page reported 0.95%).
  // rafCalls is retained unchanged as the loop-activity diagnostic.
  window.__probe = { frames: [], rafCalls: 0, glContexts: 0, errors: [], maxCallbacksPerFrame: 0 };
  const rAF = window.requestAnimationFrame.bind(window);
  let last = 0, lastT = null, cbThisFrame = 0;
  window.__probe.resetCadence = () => { last = 0; lastT = null; cbThisFrame = 0; window.__probe.frames.length = 0; };
  window.requestAnimationFrame = (cb) =>
    rAF((t) => {
      window.__probe.rafCalls++;
      if (t !== lastT) {
        if (cbThisFrame > window.__probe.maxCallbacksPerFrame) window.__probe.maxCallbacksPerFrame = cbThisFrame;
        if (last) window.__probe.frames.push(t - last);
        last = t; lastT = t; cbThisFrame = 1;
      } else {
        cbThisFrame++;
      }
      return cb(t);
    });
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (String(type).includes("webgl") || String(type).includes("webgpu")) window.__probe.glContexts++;
    return getContext.call(this, type, ...rest);
  };
  window.addEventListener("error", (e) => window.__probe.errors.push(String(e.message)));
};

const pct = (sorted, p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))] : null);

async function sampleFrames(page, ms) {
  await page.evaluate(() => {
    window.__probe.frames = [];
    window.__probe.rafCalls = 0;
  });
  await page.waitForTimeout(ms);
  return page.evaluate(() => ({ frames: window.__probe.frames.slice(), rafCalls: window.__probe.rafCalls }));
}

async function jigglePointer(page, ms) {
  const box = await page.viewportSize();
  const end = Date.now() + ms;
  let i = 0;
  while (Date.now() < end) {
    const x = box.width * (0.3 + 0.4 * Math.abs(Math.sin(i / 6)));
    const y = box.height * (0.3 + 0.4 * Math.abs(Math.cos(i / 7)));
    await page.mouse.move(x, y);
    await page.waitForTimeout(16);
    i++;
  }
}

async function profile(browser, profileName) {
  const ctx = await browser.newContext(
    profileName === "mobile"
      ? { ...devices["iPhone 14 Pro"] }
      : { viewport: { width: 1440, height: 900 } }
  );
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  const result = { profile: profileName, thresholds: THRESHOLDS[profileName] };

  await page.goto(URL_, { waitUntil: "networkidle" });

  let target = page.locator(SECTION).first();
  if ((await target.count()) === 0) {
    // Lazy-mounted visualizations (dynamic import on approach) have no canvas at load time.
    // Sweep-scroll the document to trigger proximity/intersection loaders, then retry once.
    await page.evaluate(async () => {
      const step = window.innerHeight / 2;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    target = page.locator(SECTION).first();
  }
  if ((await target.count()) === 0) {
    return {
      ...result,
      status: "NOT_MEASURED",
      reason: `section selector not found (before and after lazy-mount sweep): ${SECTION}`,
      consoleErrors,
    };
  }
  await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1200);

  // M1 — interactive frame cadence (pointer moving over the section)
  const jiggle = jigglePointer(page, SAMPLE_MS);
  const onscreen = await sampleFrames(page, SAMPLE_MS);
  await jiggle;
  const sorted = onscreen.frames.slice().sort((a, b) => a - b);
  const onscreenRate = onscreen.rafCalls / (SAMPLE_MS / 1000);
  result.m1 = {
    samples: sorted.length,
    p50: pct(sorted, 50),
    p95: pct(sorted, 95),
    p99: pct(sorted, 99),
    hitchPct: sorted.length ? (100 * sorted.filter((d) => d > 50).length) / sorted.length : null,
    onscreenRafPerSec: onscreenRate,
  };
  const t = THRESHOLDS[profileName];
  // A page with no continuous rAF loop is not a performance failure — there is simply
  // nothing to measure. Never report FAIL where the correct verdict is "not applicable".
  const hasContinuousAnimation = onscreenRate > 5;
  result.hasContinuousAnimation = hasContinuousAnimation;
  result.m1.pass = !hasContinuousAnimation
    ? "N_A_NO_CONTINUOUS_ANIMATION"
    : result.m1.samples > 30 &&
      result.m1.p50 <= t.p50 &&
      result.m1.p95 <= t.p95 &&
      result.m1.hitchPct <= t.hitchPct;

  // M2 — offscreen pausing (scroll-away geometry)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(5, 5);
  await page.waitForTimeout(1000);
  // A viewport-fixed or above-the-fold target never leaves view when we scroll away, so a
  // high rAF rate here reflects a visible canvas, not a pause failure. Twice adjudicated by
  // hand (S1 rep1/rep2); now reported mechanically. M2b below is the operative probe then.
  const geom = await target.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
    const iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    const inter = ix * iy;
    return {
      visibleFractionOfElement: inter / Math.max(1, r.width * r.height),
      visibleFractionOfViewport: inter / (vw * vh),
    };
  });
  const stillVisibleAfterScrollAway =
    geom.visibleFractionOfElement > THRESHOLDS.geometryVisibleLimit ||
    geom.visibleFractionOfViewport > THRESHOLDS.geometryVisibleLimit;
  const off = await sampleFrames(page, 3000);
  const offRate = off.rafCalls / 3;
  result.m2 = {
    onscreenRafPerSec: onscreenRate,
    offscreenRafPerSec: offRate,
    ratio: onscreenRate ? offRate / onscreenRate : null,
    geometryAfterScrollAway: geom,
    pass: !hasContinuousAnimation
      ? "N_A_NO_CONTINUOUS_ANIMATION"
      : stillVisibleAfterScrollAway
        ? "NOT_MEASURABLE_BY_GEOMETRY"
        : offRate / onscreenRate <= THRESHOLDS.offscreenRatio,
  };

  // M2b — hidden-document pausing, app-level (pre-registered amendment 2026-08-24).
  // Chromium stops scheduling rAF in genuinely hidden tabs, which would mask whether the
  // page pauses ITSELF. So the page stays actually visible while document.hidden /
  // document.visibilityState are overridden and visibilitychange is dispatched: only the
  // app's own pause logic (or a library's) can stop the loop under this probe.
  await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(700);
  const m2bBase = await sampleFrames(page, 3000);
  const m2bBaseRate = m2bBase.rafCalls / 3;
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { get: () => true, configurable: true });
    Object.defineProperty(document, "visibilityState", { get: () => "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(700);
  const m2bHidden = await sampleFrames(page, 3000);
  const m2bHiddenRate = m2bHidden.rafCalls / 3;
  await page.evaluate(() => {
    delete document.hidden;
    delete document.visibilityState;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(700);
  const m2bResumed = await sampleFrames(page, 3000);
  const m2bResumedRate = m2bResumed.rafCalls / 3;
  const m2bHasAnimation = m2bBaseRate > 5;
  const m2bResumes = m2bBaseRate ? m2bResumedRate >= 0.5 * m2bBaseRate : null;
  result.m2b = {
    method:
      "synthetic document.hidden/visibilityState override + visibilitychange dispatch; " +
      "page remains actually visible so native hidden-tab rAF throttling cannot mask app behavior",
    baselineRafPerSec: m2bBaseRate,
    hiddenRafPerSec: m2bHiddenRate,
    resumedRafPerSec: m2bResumedRate,
    ratio: m2bBaseRate ? m2bHiddenRate / m2bBaseRate : null,
    resumes: m2bResumes,
    pass: !m2bHasAnimation
      ? "N_A_NO_CONTINUOUS_ANIMATION"
      : m2bHiddenRate / m2bBaseRate <= THRESHOLDS.hiddenRatio,
    caveat:
      m2bHasAnimation && m2bResumes === false
        ? "paused under hidden but did not resume on visibility restore — inspect manually"
        : null,
  };

  // M5 — accessible parallel representation (before reduced-motion reload)
  const axNames = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('[role="listbox"] [role="option"], ul li, button, a')];
    return nodes.map((n) => (n.getAttribute("aria-label") || n.textContent || "").trim()).filter(Boolean).length;
  });
  // Content snapshot for the M3 parity amendment (2026-08-30): headings + body text volume.
  const CONTENT = () => {
    // Content excludes interactive controls: a control whose referent stops existing under
    // reduced motion is a legitimate change, so its label must not count as lost content
    // (rubric amendment 2026-08-30). Buttons are stripped; prose links stay, being content.
    // M3 amendment 2026-09-07: parity is measured on RENDERED text. textContent includes
    // display:none subtrees, so a reduced-motion stylesheet hiding all of <main> previously
    // reported full parity on a page that renders nothing (reproduced, smoke_controls/m3-display-none.html).
    // NOTE: getComputedStyle on an element INSIDE a display:none subtree reports that element's
    // own display (e.g. "block"), not "none" — so a per-element style check misses hidden
    // descendants. getClientRects() is empty for anything not rendered, which is the reliable test.
    const isRendered = (el) => {
      if (typeof el.checkVisibility === "function") {
        return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      if (el.getClientRects && el.getClientRects().length === 0) return false;
      const st = getComputedStyle(el);
      return st.display !== "none" && st.visibility !== "hidden" && st.opacity !== "0";
    };
    const isControl = (el) => el.matches('button, [role="button"], script, style');
    const walk = (el) => {
      if (el.nodeType === 1 && (!isRendered(el) || isControl(el))) return "";
      let out = "";
      for (const n of el.childNodes) {
        if (n.nodeType === 3) out += n.textContent;
        else if (n.nodeType === 1) out += walk(n);
      }
      return out;
    };
    return {
      headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
        .filter((h) => isRendered(h))
        .map((h) => (h.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean),
      textLen: walk(document.body).replace(/\s+/g, " ").trim().length,
    };
  };
  const axContent = await page.evaluate(CONTENT);
  const focusables = await page.evaluate(
    () => document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').length
  );
  // M5 amendment 2026-09-07: an inventory count is not an accessibility pass. Requires a
  // rendered, keyboard-reachable control AND a text alternative for the graphical surface AND
  // real (non-control) content. Old counts retained as diagnostics.
  const m5real = await page.evaluate((sel) => {
    const vis = (el) => { const s = getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0"; };
    const reachable = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => vis(el) && !el.disabled && !el.closest("[inert]") && el.getAttribute("tabindex") !== "-1");
    // Scope to the MEASURED SECTION's surface, per the 2026-09-07 amendment. Checking every
    // canvas/svg on the page would false-FAIL a page carrying a decorative inline icon.
    const root = document.querySelector(sel) || document;
    const scope = root.matches && root.matches("canvas, svg") ? [root]
                : [...root.querySelectorAll("canvas, svg")];
    const surfaces = scope.filter(vis);
    // aria-hidden INHERITS to descendants, so an ancestor carrying it is the common and valid
    // pattern (verified against a real build whose canvas is hidden via its wrapper, not itself).
    // Checking only the element's own attribute produced a false FAIL.
    const surfaceOk = surfaces.length === 0 || surfaces.every((s) =>
      s.closest('[aria-hidden="true"]') !== null ||
      (s.getAttribute("aria-label") || s.getAttribute("role") || s.querySelector("title,desc")));
    const bodyClone = document.body.cloneNode(true);
    bodyClone.querySelectorAll('button, [role="button"], script, style').forEach((n) => n.remove());
    const proseLen = (bodyClone.textContent || "").replace(/\s+/g, " ").trim().length;
    return { reachableControls: reachable.length, renderedSurfaces: surfaces.length,
             surfaceHasTextAlternative: !!surfaceOk, proseLen };
  }, SECTION);
  result.m5 = {
    ...m5real,
    diagnostics: { accessibleNameCount: axNames, focusableCount: focusables },
    pass: m5real.reachableControls > 0 && m5real.surfaceHasTextAlternative && m5real.proseLen > 0,
  };

  await ctx.close();

  // M3 — reduced motion (fresh context so the preference is set at load)
  const rmCtx = await browser.newContext(
    profileName === "mobile"
      ? { ...devices["iPhone 14 Pro"], reducedMotion: "reduce" }
      : { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }
  );
  await rmCtx.addInitScript(INIT);
  const rmPage = await rmCtx.newPage();
  await rmPage.goto(URL_, { waitUntil: "networkidle" });
  const rmTarget = rmPage.locator(SECTION).first();
  if (await rmTarget.count()) await rmTarget.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await rmPage.waitForTimeout(500);
  const rm = await sampleFrames(rmPage, 3000);
  const rmRate = rm.rafCalls / 3;
  const rmNames = await rmPage.evaluate(() => {
    const nodes = [...document.querySelectorAll('[role="listbox"] [role="option"], ul li, button, a')];
    return nodes.map((n) => (n.getAttribute("aria-label") || n.textContent || "").trim()).filter(Boolean).length;
  });
  const rmContent = await rmPage.evaluate(CONTENT);
  // Parity is judged on CONTENT, never on control counts (rubric amendment 2026-08-30):
  // every motion-on heading must survive, and body text must retain >= 90% of its volume.
  const missingHeadings = axContent.headings.filter((h) => !rmContent.headings.includes(h));
  const textRatio = axContent.textLen ? rmContent.textLen / axContent.textLen : 1;
  const contentParity = missingHeadings.length === 0 && textRatio >= 0.9;
  // Content parity is required of every implementation, animated or not. The motion-stops
  // half only applies when there is continuous motion to stop.
  const motionStops = !hasContinuousAnimation || rmRate / onscreenRate <= THRESHOLDS.reducedMotionRatio;
  result.m3 = {
    reducedMotionRafPerSec: rmRate,
    ratio: onscreenRate ? rmRate / onscreenRate : null,
    accessibleNameCount: rmNames,
    contentParity,
    headingsMotionOn: axContent.headings.length,
    headingsReduced: rmContent.headings.length,
    missingHeadings,
    textLengthRatio: Number(textRatio.toFixed(3)),
    // Informational only. A control whose referent stops existing under reduced motion is a
    // legitimate change and must never raise a critical (rubric amendment 2026-08-30).
    controlDelta: rmNames - axNames,
    motionStops,
    pass: motionStops && contentParity,
    scope: hasContinuousAnimation ? "full" : "content-parity-only (no continuous animation present)",
    criticalFailure: contentParity
      ? null
      : `content lost under reduced motion (${missingHeadings.length} heading(s) missing, text ratio ${textRatio.toFixed(2)})`,
  };
  await rmCtx.close();

  result.consoleErrors = consoleErrors;
  result.status = "MEASURED";
  return result;
}

async function teardownCheck(browser) {
  // M4 — mount/unmount cycles via reload-navigate-back; reports growth in GL contexts.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const counts = [];
  for (let i = 0; i < 3; i++) {
    await page.goto(URL_, { waitUntil: "networkidle" });
    const target = page.locator(SECTION).first();
    if (await target.count()) await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(800);
    counts.push(await page.evaluate(() => window.__probe.glContexts));
  }
  await ctx.close();
  return {
    glContextsPerCycle: counts,
    note:
      "Full-navigation cycles reset page state, so this bounds per-load context creation only. " +
      "In-app mount/unmount teardown requires an app-specific route pair and is reported NOT_MEASURED unless supplied.",
    status: "PARTIAL",
    consoleErrors: errors,
    pass: counts.every((c) => c === counts[0]) && errors.length === 0,
  };
}

// Pin the browser binary when reproducibility matters: --executable-path /path/to/chromium
const browser = await chromium.launch(
  args["executable-path"] ? { executablePath: args["executable-path"] } : {}
);
const report = {
  run_id: RUN_ID,
  url: URL_,
  section_selector: SECTION,
  measured_at: new Date().toISOString(),
  protocol: "rubrics/execution_measurement.md (pre-registered 2026-08-11; M2 geometry gate + M2b amendment 2026-08-24; M3 content-parity amendment 2026-08-30)",
  desktop: await profile(browser, "desktop"),
  mobile: await profile(browser, "mobile"),
  m4_teardown: await teardownCheck(browser),
};
await browser.close();

report.summary = {
  m1_desktop: report.desktop.m1?.pass ?? "NOT_MEASURED",
  m1_mobile: report.mobile.m1?.pass ?? "NOT_MEASURED",
  m2_offscreen_pause: report.desktop.m2?.pass ?? "NOT_MEASURED",
  m2b_hidden_pause: report.desktop.m2b?.pass ?? "NOT_MEASURED",
  m3_reduced_motion: report.desktop.m3?.pass ?? "NOT_MEASURED",
  m5_accessible_parallel: report.desktop.m5?.pass ?? "NOT_MEASURED",
  critical: [report.desktop.m3?.criticalFailure, report.mobile.m3?.criticalFailure].filter(Boolean),
};

mkdirSync(resolve(OUT_DIR), { recursive: true });
const out = resolve(OUT_DIR, `${RUN_ID}.json`);
writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.summary, null, 2));
console.log(`\nwrote ${out}`);

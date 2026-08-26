#!/usr/bin/env node
/**
 * One-off investigation tool (NOT part of the pinned harness).
 *
 * Question: I5ws-rep2 measured ratio ~0.50 on every should-stop probe. The record attributes
 * the surviving 60/s rAF source to Pixi v8's autostarting Ticker.system by differential
 * inference. This probe tries to OBSERVE it instead:
 *
 *   1. tally rAF callers by callback identity while the section is scrolled out of view
 *   2. locate a Pixi handle and read Ticker.system.started / Ticker.shared.started
 *   3. causal test: stop Ticker.system, re-sample, see whether the residual loop disappears
 *
 *   node attribution_probe.mjs --url http://localhost:PORT [--section canvas]
 */
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1]]);
    return acc;
  }, [])
);
const URL_ = args.url;
const SECTION = args.section ?? "canvas";

const INIT = () => {
  window.__rafTally = new Map();
  const rAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    let rec = window.__rafTally.get(cb);
    if (!rec) {
      rec = { name: cb.name || "(anonymous)", count: 0, src: String(cb).slice(0, 160) };
      window.__rafTally.set(cb, rec);
    }
    rec.count++;
    return rAF(cb);
  };
  window.__rafReset = () => window.__rafTally.forEach((r) => (r.count = 0));
  window.__rafRead = () =>
    [...window.__rafTally.values()].filter((r) => r.count > 0).map((r) => ({ ...r }));
};

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(INIT);
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "networkidle" });

// Bring the visualization into view so the engine initializes, then let it settle.
const target = page.locator(SECTION).first();
if (await target.count()) await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(2500);

const globals = await page.evaluate(() =>
  Object.keys(window).filter((k) => /^__|pixi|constellation|debug|engine/i.test(k))
);

// Scroll fully away — the condition the app claims to pause under.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
await page.evaluate(() => window.__rafReset());
await page.waitForTimeout(3000);
const pausedTally = await page.evaluate(() => window.__rafRead());

// Try to reach Pixi's Ticker class through any exposed handle, and read the statics.
const tickerState = await page.evaluate((keys) => {
  const seen = [];
  const findApp = (obj, depth = 0) => {
    if (!obj || depth > 3 || typeof obj !== "object") return null;
    if (obj.ticker && obj.ticker.constructor && "system" in obj.ticker.constructor) return obj;
    if (obj.renderer && obj.ticker) return obj;
    for (const k of Object.keys(obj)) {
      try {
        const found = findApp(obj[k], depth + 1);
        if (found) return found;
      } catch {}
    }
    return null;
  };
  for (const k of keys) {
    try {
      const app = findApp(window[k]);
      if (app) {
        const T = app.ticker.constructor;
        seen.push({
          via: k,
          appTickerStarted: app.ticker.started,
          systemStarted: T.system ? T.system.started : "n/a",
          sharedStarted: T.shared ? T.shared.started : "n/a",
          systemCount: T.system ? T.system.count : "n/a",
          sharedCount: T.shared ? T.shared.count : "n/a",
        });
      }
    } catch (e) {
      seen.push({ via: k, error: String(e).slice(0, 80) });
    }
  }
  return seen;
}, globals);

// Causal test: if reachable, stop Ticker.system while still scrolled away and re-sample.
let counterfactual = null;
if (tickerState.some((s) => s.systemStarted === true)) {
  counterfactual = await page.evaluate(async (keys) => {
    const findApp = (obj, depth = 0) => {
      if (!obj || depth > 3 || typeof obj !== "object") return null;
      if (obj.ticker && obj.ticker.constructor && "system" in obj.ticker.constructor) return obj;
      for (const k of Object.keys(obj)) {
        try {
          const f = findApp(obj[k], depth + 1);
          if (f) return f;
        } catch {}
      }
      return null;
    };
    for (const k of keys) {
      const app = findApp(window[k]);
      if (app) {
        app.ticker.constructor.system.stop();
        return { stopped: true, via: k };
      }
    }
    return { stopped: false };
  }, globals);
  await page.waitForTimeout(800);
  await page.evaluate(() => window.__rafReset());
  await page.waitForTimeout(3000);
  counterfactual.tallyAfterStop = await page.evaluate(() => window.__rafRead());
}

console.log(JSON.stringify({ url: URL_, globalsFound: globals, pausedTally, tickerState, counterfactual }, null, 2));
await browser.close();

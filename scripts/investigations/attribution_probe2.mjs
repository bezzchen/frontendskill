#!/usr/bin/env node
/**
 * Attribution probe v2 (one-off investigation, NOT part of the pinned harness).
 *
 * v1 found TWO distinct Pixi Ticker._tick rAF loops at 60/s each, but ran at desktop size
 * where the section stays ~60% visible at scroll-top — so the app was legitimately running.
 * v2 reproduces the ACTUAL paused condition (mobile profile, where the harness measured the
 * section fully exiting the viewport, geomElem 0.00) and confirms visibility before sampling.
 *
 *   node attribution_probe2.mjs --url http://localhost:PORT [--section canvas]
 */
import { chromium, devices } from "playwright";

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
    if (!rec) rec = { name: cb.name || "(anon)", count: 0, src: String(cb).slice(0, 90) };
    rec.count++;
    window.__rafTally.set(cb, rec);
    return rAF(cb);
  };
  window.__rafReset = () => window.__rafTally.forEach((r) => (r.count = 0));
  window.__rafRead = () => [...window.__rafTally.values()].filter((r) => r.count > 0).map((r) => ({ ...r }));
};

const visibleFraction = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const ix = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
  const iy = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
  return (ix * iy) / Math.max(1, r.width * r.height);
};

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"] });
await ctx.addInitScript(INIT);
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "networkidle" });

const target = page.locator(SECTION).first();
if (await target.count()) await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(2500);

const shape = await page.evaluate(() => {
  const c = window.__constellation;
  if (!c) return { present: false };
  const keys = Object.keys(c);
  const detail = {};
  for (const k of keys) {
    const v = c[k];
    detail[k] = v && typeof v === "object" ? `object{${Object.keys(v).slice(0, 12).join(",")}}` : typeof v;
  }
  return { present: true, keys, detail };
});

await page.evaluate(() => window.__rafReset());
await page.waitForTimeout(3000);
const onscreen = { tally: await page.evaluate(() => window.__rafRead()) };

// The actual paused condition: scroll fully away, verify geometry, then sample.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
const vis = await page.evaluate(visibleFraction, SECTION);
await page.evaluate(() => window.__rafReset());
await page.waitForTimeout(3000);
const paused = { visibleFractionOfElement: vis, tally: await page.evaluate(() => window.__rafRead()) };

// Reach Pixi's Ticker class through the app's debug handle and read the statics.
const tickerState = await page.evaluate(() => {
  const c = window.__constellation;
  if (!c) return { reachable: false };
  const stack = [c];
  const seen = new Set();
  while (stack.length) {
    const obj = stack.pop();
    if (!obj || typeof obj !== "object" || seen.has(obj)) continue;
    seen.add(obj);
    if (obj.constructor && obj.constructor.name === "Ticker" && "system" in obj.constructor) {
      const T = obj.constructor;
      return {
        reachable: true,
        thisTickerStarted: obj.started,
        systemStarted: T.system?.started,
        systemCount: T.system?.count,
        sharedStarted: T.shared?.started,
        sharedCount: T.shared?.count,
      };
    }
    if (obj.ticker) stack.push(obj.ticker);
    for (const k of Object.keys(obj).slice(0, 25)) {
      try { const v = obj[k]; if (v && typeof v === "object") stack.push(v); } catch {}
    }
  }
  return { reachable: false, note: "no Ticker instance found through __constellation" };
});

// Causal test: stop Ticker.system while still scrolled away; re-sample.
let counterfactual = null;
if (tickerState.systemStarted === true) {
  counterfactual = await page.evaluate(() => {
    const c = window.__constellation;
    const stack = [c];
    const seen = new Set();
    while (stack.length) {
      const obj = stack.pop();
      if (!obj || typeof obj !== "object" || seen.has(obj)) continue;
      seen.add(obj);
      if (obj.constructor && obj.constructor.name === "Ticker" && "system" in obj.constructor) {
        obj.constructor.system.stop();
        return { stopped: true };
      }
      if (obj.ticker) stack.push(obj.ticker);
      for (const k of Object.keys(obj).slice(0, 25)) {
        try { const v = obj[k]; if (v && typeof v === "object") stack.push(v); } catch {}
      }
    }
    return { stopped: false };
  });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.__rafReset());
  await page.waitForTimeout(3000);
  counterfactual.tallyAfterStop = await page.evaluate(() => window.__rafRead());
}

console.log(JSON.stringify({ url: URL_, profile: "iPhone 14 Pro", shape, onscreen, paused, tickerState, counterfactual }, null, 2));
await browser.close();

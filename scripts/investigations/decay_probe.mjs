#!/usr/bin/env node
/**
 * One-off investigation tool (NOT part of the pinned harness).
 *
 * Question: I5ws-rep1 failed M3 on mobile at ratio 0.358 with full content parity. The record
 * says this is "consistent with" its designed auto-sleep taking ~1.5s to settle at the 30fps
 * mobile cap, rather than ambient motion continuing. Distinguish the two by sampling rAF in
 * consecutive windows under prefers-reduced-motion: latency decays to zero, a genuine failure
 * plateaus.
 *
 *   node decay_probe.mjs --url http://localhost:PORT [--section canvas] [--windows 8]
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
const WINDOWS = Number(args.windows ?? 8);
const WIN_MS = 2000;

const INIT = () => {
  window.__n = 0;
  const rAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => rAF((t) => { window.__n++; return cb(t); });
};

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"], reducedMotion: "reduce" });
await ctx.addInitScript(INIT);
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "networkidle" });

const target = page.locator(SECTION).first();
if (await target.count()) await target.evaluate((el) => el.scrollIntoView({ block: "center" }));

// Consecutive windows starting immediately after the section is in view — the same moment the
// harness begins its single 3s M3 sample.
const series = [];
for (let i = 0; i < WINDOWS; i++) {
  await page.evaluate(() => (window.__n = 0));
  await page.waitForTimeout(WIN_MS);
  const n = await page.evaluate(() => window.__n);
  series.push({ window: i + 1, fromMs: i * WIN_MS, rafPerSec: +(n / (WIN_MS / 1000)).toFixed(1) });
}

console.log(JSON.stringify({ url: URL_, profile: "iPhone 14 Pro + prefers-reduced-motion", windowMs: WIN_MS, series }, null, 2));
await browser.close();

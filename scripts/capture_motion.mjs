#!/usr/bin/env node
/**
 * S1 motion recording — captures the interaction video that rubrics/spectacle_fit.md requires
 * (without a recording, the S1 median is capped at 3).
 *
 * Records a generic scripted pass: settle, pointer sweep, slow scroll through the page,
 * spacebar (many spectacle pages bind play), center drag, scroll home. ~45s by default.
 *
 *   node scripts/capture_motion.mjs --url http://localhost:3000 --run-id S1-fable-rep1 \
 *     --out results/execution/motion [--seconds 45] [--executable-path <chromium>] \
 *     [--script evals/choreography/S1-spectacle-launch.choreography.json]
 *
 * --script runs a PRE-REGISTERED per-eval choreography instead of the generic pass. The
 * choreography file is part of the eval definition: fixed before the baseline and identical
 * across every condition and rep, or recordings stop being comparable. Step actions:
 *   wait{ms} · pointer_sweep{ms} · scroll_through{ms} · scroll_to{y,ms} ·
 *   key{key} · click{at:[x,y]} · hover{at:[x,y]} · drag{from:[x,y],to:[x,y]}
 *
 * Output: <out>/<run-id>.webm
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, renameSync, statSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1]]);
    return acc;
  }, [])
);
const URL_ = args.url ?? "http://localhost:3000";
const RUN_ID = args["run-id"] ?? `run-${Date.now()}`;
const OUT = resolve(args.out ?? "results/execution/motion");
const SECONDS = Number(args.seconds ?? 45);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  args["executable-path"] ? { executablePath: args["executable-path"] } : {}
);
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
const t0 = Date.now();
await page.goto(URL_, { waitUntil: "networkidle" });

const pointerSweep = async (ms) => {
  const n = Math.max(10, Math.floor(ms / 80));
  for (let i = 0; i <= n; i++) {
    await page.mouse.move(200 + (1040 * i) / n, 250 + 300 * Math.abs(Math.sin(i / 3)));
    await page.waitForTimeout(80);
  }
};
const scrollThrough = (budget) =>
  page.evaluate(async (b) => {
    const total = document.body.scrollHeight - window.innerHeight;
    const steps = Math.max(40, Math.floor(b / 250));
    for (let s = 0; s <= steps; s++) {
      window.scrollTo({ top: (total * s) / steps });
      await new Promise((r) => setTimeout(r, b / steps));
    }
  }, budget);

if (args.script) {
  // Pre-registered per-eval choreography: identical across conditions and reps.
  const chor = JSON.parse(readFileSync(resolve(args.script), "utf8"));
  for (const step of chor.steps) {
    switch (step.action) {
      case "wait": await page.waitForTimeout(step.ms ?? 1000); break;
      case "pointer_sweep": await pointerSweep(step.ms ?? 3000); break;
      case "scroll_through": await scrollThrough(step.ms ?? 15000); break;
      case "scroll_to":
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: "smooth" }), step.y ?? 0);
        await page.waitForTimeout(step.ms ?? 1500);
        break;
      case "key": await page.keyboard.press(step.key); break;
      case "click": await page.mouse.click(step.at[0], step.at[1]); break;
      case "hover": await page.mouse.move(step.at[0], step.at[1]); break;
      case "drag":
        await page.mouse.move(step.from[0], step.from[1]);
        await page.mouse.down();
        await page.mouse.move(step.to[0], step.to[1], { steps: 12 });
        await page.mouse.up();
        break;
      default: throw new Error(`unknown choreography action: ${step.action}`);
    }
  }
} else {
  // Generic pass: settle, sweep, scroll, spacebar, drag, home.
  await page.waitForTimeout(4000);
  await pointerSweep(1700);
  await scrollThrough(Math.max(10000, (SECONDS - 20) * 1000));
  await page.keyboard.press("Space");
  await page.waitForTimeout(3000);
  await page.mouse.move(720, 450);
  await page.mouse.down();
  await page.mouse.move(900, 500, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(3000);
}

const video = page.video();
await ctx.close();
const tmpPath = await video.path();
await browser.close();
const finalPath = resolve(OUT, `${RUN_ID}.webm`);
renameSync(tmpPath, finalPath);
console.log(`recorded ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${finalPath} (${Math.round(statSync(finalPath).size / 1024)} KB)`);

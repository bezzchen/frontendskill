#!/usr/bin/env node
/**
 * Capture the design-coherence review screenshots the Layer C capture list requires:
 * desktop (1440×900) and mobile (390×844) of the target section, plus a full-page desktop shot.
 *
 *   node scripts/capture_screens.mjs --url http://localhost:3000 --section "[data-experience-system]" \
 *     --run-id I2-fable-rep1 --out results/execution/screenshots [--executable-path <chromium>]
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1]]);
    return acc;
  }, [])
);
const URL_ = args.url ?? "http://localhost:3000";
const SECTION = args.section ?? "body";
const RUN_ID = args["run-id"] ?? `run-${Date.now()}`;
const OUT = resolve(args.out ?? "results/execution/screenshots");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  args["executable-path"] ? { executablePath: args["executable-path"] } : {}
);

async function shoot(profile, name) {
  const ctx = await browser.newContext(
    profile === "mobile" ? { ...devices["iPhone 14 Pro"] } : { viewport: { width: 1440, height: 900 } }
  );
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "networkidle" });
  const target = page.locator(SECTION).first();
  if (await target.count()) {
    await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(1500); // let entrance animation reach a representative state
  }
  await page.screenshot({ path: `${OUT}/${RUN_ID}-${name}.png` });
  if (profile === "desktop") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${RUN_ID}-${name}-fullpage.png`, fullPage: true });
  }
  await ctx.close();
}

await shoot("desktop", "desktop");
await shoot("mobile", "mobile");
await browser.close();
console.log(`wrote ${OUT}/${RUN_ID}-{desktop,desktop-fullpage,mobile}.png`);

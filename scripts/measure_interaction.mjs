#!/usr/bin/env node
/**
 * M7 — INTERACTION CAUSALITY, measured (2026-09-08).
 *
 * Dimension 2 of rubrics/spectacle_fit.md cannot be judged from stills. This drives a fixed
 * input sequence against a running build and measures whether the rendered surface actually
 * changes, with SCROLL HELD CONSTANT so scroll-driven change cannot be mistaken for input
 * response.
 *
 *   node scripts/measure_interaction.mjs --url http://localhost:3300 --run-id X --out results/interaction
 *
 * Probes, each holding scroll fixed at the same offset:
 *   pointer   — pointer at two distant positions over the surface
 *   drag      — press, move, release on the surface centre
 *   key       — Space, then ArrowRight x4 (common play/step affordances)
 *   control   — first rendered range input moved from its value to the opposite end
 *   idle      — no input at all (CONTROL: distinguishes ambient animation from input response)
 *
 * Output per probe: fraction of surface pixels changed, and mean absolute channel delta.
 * `idle` is the null: a build whose idle delta equals its pointer delta is animating on its
 * own, not responding.
 */
import { chromium } from "playwright";
import { inflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).reduce((a, c, i, arr) => {
  if (c.startsWith("--")) a.push([c.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1]]);
  return a;
}, []));
const URL_ = args.url ?? "http://localhost:3000";
const RUN = args["run-id"] ?? "unknown";
const OUT = args.out ?? "results/interaction";
const EXE = args["executable-path"];
const SCROLL_AT = Number(args["scroll-at"] ?? 1200);   // fixed offset for every probe
const SETTLE = Number(args.settle ?? 900);

/* ---- minimal PNG -> {w,h,rgba} (no image libs installed) ---- */
function decodePNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a png");
  let off = 8, w = 0, h = 0, bitDepth = 0, colorType = 0, idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    off += 12 + len;
  }
  if (bitDepth !== 8) throw new Error("bitDepth " + bitDepth + " unsupported");
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  if (!ch) throw new Error("colorType " + colorType + " unsupported");
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * ch, out = Buffer.alloc(h * stride);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[p++];
    const line = raw.subarray(p, p + stride); p += stride;
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    const cur = out.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0, v = line[x];
      let r;
      switch (filter) {
        case 0: r = v; break;
        case 1: r = v + a; break;
        case 2: r = v + b; break;
        case 3: r = v + ((a + b) >> 1); break;
        case 4: { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
                  r = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break; }
        default: throw new Error("filter " + filter);
      }
      cur[x] = r & 0xff;
    }
  }
  return { w, h, ch, px: out };
}
function diff(aBuf, bBuf) {
  const A = decodePNG(aBuf), B = decodePNG(bBuf);
  if (A.w !== B.w || A.h !== B.h) return { error: "size mismatch" };
  const n = Math.min(A.px.length, B.px.length);
  let changed = 0, total = 0, pixels = 0;
  const step = A.ch;
  for (let i = 0; i < n; i += step) {
    let d = 0;
    for (let k = 0; k < Math.min(3, step); k++) d += Math.abs(A.px[i + k] - B.px[i + k]);
    d /= Math.min(3, step);
    total += d; pixels++;
    if (d > 6) changed++;               // >6/255 per channel = visible change
  }
  return { changedFraction: +(changed / pixels).toFixed(4), meanDelta: +(total / pixels).toFixed(3), pixels };
}

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "load" });
await page.waitForTimeout(2500);

const surface = (await page.locator("canvas").count()) ? page.locator("canvas").first() : page.locator("body");
const settleAt = async () => { await page.evaluate((y) => window.scrollTo(0, y), SCROLL_AT); await page.waitForTimeout(SETTLE); };
const shot = async () => surface.screenshot();

const result = { run: RUN, url: URL_, measured_at: new Date().toISOString(), scrollHeldAt: SCROLL_AT, probes: {} };
const box = async () => (await surface.boundingBox()) ?? { x: 0, y: 0, width: 1440, height: 900 };

try {
  // idle control — no input, scroll fixed
  await settleAt();
  let a = await shot(); await page.waitForTimeout(1500); let b = await shot();
  result.probes.idle = diff(a, b);

  // pointer
  await settleAt();
  const bb = await box();
  await page.mouse.move(bb.x + bb.width * 0.25, bb.y + bb.height * 0.4);
  await page.waitForTimeout(SETTLE); a = await shot();
  await page.mouse.move(bb.x + bb.width * 0.75, bb.y + bb.height * 0.6, { steps: 24 });
  await page.waitForTimeout(SETTLE); b = await shot();
  result.probes.pointer = diff(a, b);

  // drag
  await settleAt(); a = await shot();
  await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bb.x + bb.width * 0.72, bb.y + bb.height * 0.32, { steps: 20 });
  await page.mouse.up();
  await page.waitForTimeout(SETTLE); b = await shot();
  result.probes.drag = diff(a, b);

  // keyboard
  await settleAt(); a = await shot();
  await page.keyboard.press("Space");
  for (let i = 0; i < 4; i++) { await page.keyboard.press("ArrowRight"); await page.waitForTimeout(120); }
  await page.waitForTimeout(SETTLE); b = await shot();
  result.probes.key = diff(a, b);

  // first rendered range control, moved to the opposite end
  await settleAt();
  const ranges = page.locator('input[type="range"]');
  const nRanges = await ranges.count();
  result.rangeControls = nRanges;
  if (nRanges) {
    a = await shot();
    const moved = await page.evaluate(() => {
      const r = [...document.querySelectorAll('input[type=range]')]
        .find((el) => el.getClientRects().length && !el.disabled);
      if (!r) return null;
      const min = Number(r.min || 0), max = Number(r.max || 100), v = Number(r.value);
      r.value = String(Math.abs(v - min) > Math.abs(v - max) ? min : max);
      r.dispatchEvent(new Event("input", { bubbles: true }));
      r.dispatchEvent(new Event("change", { bubbles: true }));
      return { from: v, to: Number(r.value), label: r.getAttribute("aria-label") || r.id || null };
    });
    await page.waitForTimeout(SETTLE); b = await shot();
    result.probes.control = { ...diff(a, b), moved };
  } else {
    result.probes.control = { skipped: "no rendered range control" };
  }
} catch (e) {
  result.error = String(e).slice(0, 300);
}
await browser.close();
mkdirSync(resolve(OUT), { recursive: true });
writeFileSync(resolve(OUT, RUN + ".json"), JSON.stringify(result, null, 1));
const p = result.probes;
const f = (k) => p[k]?.changedFraction ?? (p[k]?.skipped ? "skip" : "-");
console.log(`${RUN}: idle=${f("idle")} pointer=${f("pointer")} drag=${f("drag")} key=${f("key")} control=${f("control")}  ranges=${result.rangeControls ?? 0}`);
if (result.error) console.log("  ERROR:", result.error);

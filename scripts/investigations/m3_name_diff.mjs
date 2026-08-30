import { chromium } from "playwright";
const NAMES = () => [...document.querySelectorAll('[role="listbox"] [role="option"], ul li, button, a')]
  .map(n => (n.getAttribute("aria-label") || n.textContent || "").trim().replace(/\s+/g," ").slice(0,60))
  .filter(Boolean);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const grab = async (reduced) => {
  const c = await b.newContext({ viewport:{width:1440,height:900}, ...(reduced?{reducedMotion:"reduce"}:{}) });
  const p = await c.newPage();
  await p.goto("http://localhost:3262", { waitUntil:"networkidle" });
  const t = p.locator("canvas").first();
  if (await t.count()) await t.evaluate(el => el.scrollIntoView({block:"center"}));
  await p.waitForTimeout(1500);
  const names = await p.evaluate(NAMES);
  const hasCanvas = await p.locator("canvas").count();
  const docH = await p.evaluate(() => document.documentElement.scrollHeight);
  await c.close();
  return { names, hasCanvas, docH };
};
const on = await grab(false), rm = await grab(true);
console.log("MOTION ON  : canvases", on.hasCanvas, "docHeight", on.docH, "names", on.names.length);
on.names.forEach(n => console.log("   +", n));
console.log("\nREDUCED    : canvases", rm.hasCanvas, "docHeight", rm.docH, "names", rm.names.length);
rm.names.forEach(n => console.log("   +", n));
const missing = on.names.filter(n => !rm.names.includes(n));
console.log("\nPRESENT WITH MOTION, ABSENT UNDER REDUCED MOTION:");
missing.forEach(n => console.log("   -", n));
await b.close();

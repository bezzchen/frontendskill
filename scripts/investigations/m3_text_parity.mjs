import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const grab = async (reduced) => {
  const c = await b.newContext({ viewport:{width:1440,height:900}, ...(reduced?{reducedMotion:"reduce"}:{}) });
  const p = await c.newPage();
  await p.goto("http://localhost:3262", { waitUntil:"networkidle" });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const txt = document.body.innerText.replace(/\s+/g," ");
    const words = ["Juniper","Coriander","Angelica","Orris","Lemon"];
    return {
      present: Object.fromEntries(words.map(w => [w, txt.includes(w)])),
      chars: txt.length,
      headings: [...document.querySelectorAll("h1,h2,h3")].map(h=>h.textContent.trim().slice(0,40)),
    };
  });
  await c.close(); return r;
};
const on = await grab(false), rm = await grab(true);
console.log("MOTION ON  botanicals in text:", on.present, "| body chars:", on.chars);
console.log("REDUCED    botanicals in text:", rm.present, "| body chars:", rm.chars);
console.log("\nheadings motion-on :", on.headings.join(" | "));
console.log("headings reduced   :", rm.headings.join(" | "));
await b.close();

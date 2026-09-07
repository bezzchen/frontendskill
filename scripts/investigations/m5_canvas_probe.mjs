import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: process.argv[3] });
const p = await b.newPage(); await p.goto(process.argv[2]); await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => {
  const out=[];
  for (const c of document.querySelectorAll("canvas, svg")) {
    const s=getComputedStyle(c);
    out.push({ tag:c.tagName, id:c.id||null,
      ariaHidden:c.getAttribute("aria-hidden"), ariaLabel:c.getAttribute("aria-label"),
      role:c.getAttribute("role"), hasTitleDesc:!!c.querySelector("title,desc"),
      display:s.display, visibility:s.visibility, opacity:s.opacity,
      rects:c.getClientRects().length, parentAriaHidden: c.closest('[aria-hidden="true"]') ? true : false });
  }
  return out;
}), null, 1));
await b.close();

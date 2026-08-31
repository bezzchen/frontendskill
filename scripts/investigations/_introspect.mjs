import { chromium } from "playwright";
const b = await chromium.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const c = await b.newContext({ viewport:{width:1440,height:900} });
const p = await c.newPage(); await p.goto("http://localhost:3271",{waitUntil:"networkidle"}); await p.waitForTimeout(2500);
console.log("__thorn keys:", await p.evaluate(()=>Object.keys(window.__thorn||{})));
console.log("largest visible text nodes (folio candidates):");
const els = await p.evaluate(()=>[...document.querySelectorAll("h1,h2,p,span,div")]
  .map(e=>{const r=e.getBoundingClientRect();const fs=parseFloat(getComputedStyle(e).fontSize);
    return {t:(e.textContent||"").trim().slice(0,28), fs, l:Math.round(r.left), rt:Math.round(r.right), w:Math.round(r.width), vis:r.width>0&&r.height>0};})
  .filter(x=>x.vis&&x.fs>28&&x.t.length>2).slice(0,6));
els.forEach(e=>console.log(`   "${e.t}" fs=${e.fs} x ${e.l}-${e.rt}`));
await b.close();

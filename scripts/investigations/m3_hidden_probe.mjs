import { chromium } from "playwright";
const CONTENT = () => {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('button, [role="button"], script, style').forEach((n) => n.remove());
  return {
    headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h=>(h.textContent||"").replace(/\s+/g," ").trim()).filter(Boolean),
    textLen: (clone.textContent||"").replace(/\s+/g," ").trim().length,
  };
};
// what the CURRENT instrument would see
const RENDERED = () => {
  const vis = (el) => { const s = getComputedStyle(el); return s.display!=='none' && s.visibility!=='hidden' && s.opacity!=='0'; };
  const walk = (el) => { if(!vis(el)) return ''; let t=''; for(const n of el.childNodes){
    if(n.nodeType===3) t+=n.textContent; else if(n.nodeType===1) t+=walk(n);} return t; };
  return { renderedTextLen: walk(document.body).replace(/\s+/g," ").trim().length };
};
const url = "file://" + process.argv[2];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const rm of [null, "reduce"]) {
  const ctx = await b.newContext({ reducedMotion: rm ?? "no-preference" });
  const p = await ctx.newPage(); await p.goto(url);
  const c = await p.evaluate(CONTENT); const r = await p.evaluate(RENDERED);
  console.log(`reducedMotion=${rm ?? "no-preference"}  textContent=${c.textLen}  headings=${c.headings.length}  RENDERED=${r.renderedTextLen}`);
  await ctx.close();
}
await b.close();

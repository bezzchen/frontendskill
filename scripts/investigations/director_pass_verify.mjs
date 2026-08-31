import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:3271";
const NAMES = () => [...document.querySelectorAll('[role="listbox"] [role="option"], ul li, button, a')]
  .map(n => (n.getAttribute("aria-label") || n.textContent || "").trim().replace(/\s+/g," ").slice(0,55)).filter(Boolean);
const BOTS = ["Juniper","Coriander","Angelica","Orris","Lemon"];
const b = await chromium.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });

// --- 1. M3 content parity: names + full text ---
const grab = async (reduced, w=1440, h=900) => {
  const c = await b.newContext({ viewport:{width:w,height:h}, ...(reduced?{reducedMotion:"reduce"}:{}) });
  const p = await c.newPage(); await p.goto(URL_,{waitUntil:"networkidle"});
  const t = p.locator("canvas").first(); if (await t.count()) await t.evaluate(e=>e.scrollIntoView({block:"center"}));
  await p.waitForTimeout(1500);
  const r = await p.evaluate(([bots]) => ({
    names:[...document.querySelectorAll('[role="listbox"] [role="option"], ul li, button, a')]
      .map(n=>(n.getAttribute("aria-label")||n.textContent||"").trim().replace(/\s+/g," ").slice(0,55)).filter(Boolean),
    bots:Object.fromEntries(bots.map(x=>[x, document.body.innerText.includes(x)])),
    headings:[...document.querySelectorAll("h1,h2,h3")].map(x=>x.textContent.trim().slice(0,32)),
  }), [BOTS]);
  await c.close(); return r;
};
const on = await grab(false), rm = await grab(true);
console.log("M3 PARITY  names motion:", on.names.length, "| reduced:", rm.names.length);
console.log("  botanicals in reduced text:", JSON.stringify(rm.bots));
console.log("  headings identical:", JSON.stringify(on.headings)===JSON.stringify(rm.headings), `(${on.headings.length} vs ${rm.headings.length})`);
console.log("  missing under reduced:", on.names.filter(n=>!rm.names.includes(n)).join(" | ") || "(none)");

// --- 2. Folio hero composition: does the bottle clear the copy? ---
for (const [w,h] of [[1440,900],[375,812]]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, reducedMotion:"reduce" });
  const p = await c.newPage(); await p.goto(URL_,{waitUntil:"networkidle"}); await p.waitForTimeout(2000);
  const r = await p.evaluate(() => {
    const h1 = document.querySelector("h1");
    const cv = document.querySelector("canvas");
    const hb = h1?.getBoundingClientRect(), cb = cv?.getBoundingClientRect();
    return { h1:hb?{l:Math.round(hb.left),r:Math.round(hb.right),t:Math.round(hb.top),b:Math.round(hb.bottom)}:null,
             canvas: cb?{w:Math.round(cb.width),h:Math.round(cb.height)}:null };
  });
  console.log(`FOLIO ${w}x${h}: h1 spans x ${r.h1?.l}-${r.h1?.r}, canvas ${r.canvas?.w}x${r.canvas?.h}`);
  await c.close();
}

// --- 3. Beat correctness: does the caption match the framed plate? ---
{
  const c = await b.newContext({ viewport:{width:1440,height:900} });
  const p = await c.newPage(); await p.goto(URL_,{waitUntil:"networkidle"}); await p.waitForTimeout(2500);
  const api = await p.evaluate(()=>typeof window.__thorn?.step === "function");
  console.log("BEAT CHECK  scrub API available:", api);
  if (api) for (const pr of [0.149,0.247]) {
    const out = await p.evaluate(async (prog)=>{ window.__thorn.step(prog); await new Promise(r=>setTimeout(r,350));
      const act=document.querySelector('[aria-current="true"], .is-active, [data-active="true"]');
      return { caption:(document.body.innerText.match(/Juniper|Coriander|Angelica|Orris|Lemon/g)||[]).slice(0,3).join(","),
               beat: window.__thorn.beat ?? window.__thorn.state?.beat ?? null }; }, pr);
    console.log(`   p=${pr} -> beat:${out.beat} visible botanicals:${out.caption}`);
  }
  await c.close();
}
await b.close();

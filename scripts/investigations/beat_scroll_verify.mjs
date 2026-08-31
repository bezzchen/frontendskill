import { chromium } from "playwright";
const b = await chromium.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const c = await b.newContext({ viewport:{width:1440,height:900} });
const p = await c.newPage(); await p.goto("http://localhost:3271",{waitUntil:"networkidle"}); await p.waitForTimeout(2500);
const H = await p.evaluate(()=>document.documentElement.scrollHeight - window.innerHeight);
console.log("scrollable height:", H);
for (const prog of [0.10,0.149,0.20,0.247,0.30]) {
  await p.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}), Math.round(prog*H));
  await p.waitForTimeout(900);
  const r = await p.evaluate(()=>{
    const live=document.querySelector('[aria-live]');
    const active=[...document.querySelectorAll('[aria-current],[aria-pressed="true"],[data-active="true"],.is-active')]
      .map(e=>(e.getAttribute("aria-label")||e.textContent||"").trim().slice(0,34)).filter(Boolean);
    return { caption:(live?.textContent||"").trim().slice(0,58), active:active.slice(0,3) };
  });
  console.log(`p=${prog}  caption="${r.caption}"  active=${JSON.stringify(r.active)}`);
}
// folio hero: screenshot + measure the display title only
const c2 = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:"reduce" });
const p2 = await c2.newPage(); await p2.goto("http://localhost:3271",{waitUntil:"networkidle"}); await p2.waitForTimeout(2500);
const hero = await p2.evaluate(()=>{
  const big=[...document.querySelectorAll("h1,h2,p,span")].map(e=>({e,b:e.getBoundingClientRect(),fs:parseFloat(getComputedStyle(e).fontSize)}))
    .filter(x=>x.b.width>2&&x.b.top<900&&x.fs>=60).sort((a,z)=>z.fs-a.fs)[0];
  return big?{text:big.e.textContent.trim().slice(0,20), fs:big.fs, l:Math.round(big.b.left), r:Math.round(big.b.right), t:Math.round(big.b.top)}:null;
});
console.log("FOLIO hero display text:", JSON.stringify(hero));
await p2.screenshot({ path:"results/execution/screenshots/THORN-demo2-folio-1440.png" });
console.log("folio screenshot saved");
await b.close();

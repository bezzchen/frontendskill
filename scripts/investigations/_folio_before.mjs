import { chromium } from "playwright";
const b = await chromium.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const c = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:"reduce" });
const p = await c.newPage(); await p.goto("http://localhost:3272",{waitUntil:"networkidle"}); await p.waitForTimeout(2500);
const hero = await p.evaluate(()=>{
  const big=[...document.querySelectorAll("h1,h2,p,span")].map(e=>({e,b:e.getBoundingClientRect(),fs:parseFloat(getComputedStyle(e).fontSize)}))
    .filter(x=>x.b.width>2&&x.b.top<900&&x.fs>=60).sort((a,z)=>z.fs-a.fs)[0];
  return big?{text:big.e.textContent.trim().slice(0,20), fs:Math.round(big.fs), l:Math.round(big.b.left), r:Math.round(big.b.right)}:null; });
console.log("BEFORE folio hero:", JSON.stringify(hero));
await p.screenshot({ path:"results/execution/screenshots/THORN-demo1-folio-1440.png" });
console.log("before-folio screenshot saved");
await b.close();

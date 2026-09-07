import { chromium } from "playwright";
const OLD = () => { window.__o={frames:[],rafCalls:0}; const r=window.requestAnimationFrame.bind(window); let last=0;
  window.requestAnimationFrame=(cb)=>r((t)=>{ window.__o.rafCalls++; if(last) window.__o.frames.push(t-last); last=t; return cb(t); }); };
const NEW = () => { window.__n={frames:[],rafCalls:0,cbPerFrame:0}; const r=window.requestAnimationFrame.bind(window);
  let last=0,lastT=null,cb0=0;
  window.requestAnimationFrame=(cb)=>r((t)=>{ window.__n.rafCalls++;
    if(t!==lastT){ if(last) window.__n.frames.push(t-last); last=t; lastT=t; window.__n.cbPerFrame=Math.max(window.__n.cbPerFrame,cb0); cb0=1; } else cb0++;
    return cb(t); }); };
const stat=(f)=>{const s=[...f].sort((a,b)=>a-b);return{samples:f.length,p50:+s[Math.floor(s.length/2)].toFixed(1),hitchPct:+(100*f.filter(x=>x>32).length/f.length).toFixed(3)};};
const url="file://"+process.argv[2];
const b=await chromium.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
for (const [name,init,key] of [["OLD",OLD,"__o"],["NEW",NEW,"__n"]]) {
  const ctx=await b.newContext(); const p=await ctx.newPage();
  await p.addInitScript(init); await p.goto(url); await p.waitForTimeout(8000);
  const d=await p.evaluate(k=>({frames:window[k].frames,rafCalls:window[k].rafCalls,cbPerFrame:window[k].cbPerFrame}),key);
  const s=stat(d.frames);
  console.log(`${name}: rafCalls=${d.rafCalls} rafPerSec=${(d.rafCalls/8).toFixed(1)} samples=${s.samples} p50=${s.p50}ms hitch=${s.hitchPct}% -> ${s.hitchPct<1?'PASS':'FAIL'}${d.cbPerFrame?` (cb/frame=${d.cbPerFrame})`:''}`);
  await ctx.close();
}
await b.close();

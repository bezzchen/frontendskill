#!/usr/bin/env node
/** M8 — control-all interaction probe. See rubrics/execution_measurement.md (2026-09-08). */
import { chromium } from "playwright";
import { inflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const args = Object.fromEntries(process.argv.slice(2).reduce((a,c,i,arr)=>{
  if(c.startsWith("--")) a.push([c.slice(2), arr[i+1]?.startsWith("--")?true:arr[i+1]]); return a;},[]));
const URL_=args.url, RUN=args["run-id"]??"unknown", OUT=args.out??"results/interaction";
const EXE=args["executable-path"], SCROLL_AT=Number(args["scroll-at"]??1200), SETTLE=Number(args.settle??800);

function decodePNG(buf){
  let off=8,w=0,h=0,bd=0,ct=0,idat=[];
  while(off<buf.length){const len=buf.readUInt32BE(off),t=buf.toString("ascii",off+4,off+8);
    const d=buf.subarray(off+8,off+8+len);
    if(t==="IHDR"){w=d.readUInt32BE(0);h=d.readUInt32BE(4);bd=d[8];ct=d[9];}
    else if(t==="IDAT")idat.push(d); else if(t==="IEND")break; off+=12+len;}
  const ch={0:1,2:3,4:2,6:4}[ct]; if(bd!==8||!ch) throw new Error(`png bd=${bd} ct=${ct}`);
  const raw=inflateSync(Buffer.concat(idat)), stride=w*ch, out=Buffer.alloc(h*stride); let p=0;
  for(let y=0;y<h;y++){const f=raw[p++],line=raw.subarray(p,p+stride);p+=stride;
    const prev=y?out.subarray((y-1)*stride,y*stride):Buffer.alloc(stride);
    const cur=out.subarray(y*stride,(y+1)*stride);
    for(let x=0;x<stride;x++){const a=x>=ch?cur[x-ch]:0,b=prev[x],c=x>=ch?prev[x-ch]:0,v=line[x];let r;
      switch(f){case 0:r=v;break;case 1:r=v+a;break;case 2:r=v+b;break;case 3:r=v+((a+b)>>1);break;
        case 4:{const pa=Math.abs(b-c),pb=Math.abs(a-c),pc=Math.abs(a+b-2*c);
          r=v+(pa<=pb&&pa<=pc?a:pb<=pc?b:c);break;} default:throw new Error("filter"+f);}
      cur[x]=r&0xff;}}
  return {w,h,ch,px:out};
}
function changedMask(aBuf,bBuf){
  const A=decodePNG(aBuf),B=decodePNG(bBuf);
  if(A.w!==B.w||A.h!==B.h) return null;
  const step=A.ch, n=Math.min(A.px.length,B.px.length), np=Math.floor(n/step);
  const mask=new Uint8Array(np); let changed=0;
  for(let i=0,j=0;i<n;i+=step,j++){
    let d=0,k=0; for(;k<Math.min(3,step);k++) d+=Math.abs(A.px[i+k]-B.px[i+k]);
    d/=Math.min(3,step);
    if(d>6){mask[j]=1;changed++;}
  }
  return {mask,frac:changed/np,pixels:np};
}
const browser=await chromium.launch(EXE?{executablePath:EXE}:{});
const ctx=await browser.newContext({viewport:{width:1440,height:900}});
const page=await ctx.newPage();
await page.goto(URL_,{waitUntil:"load"}); await page.waitForTimeout(2500);
const surface=(await page.locator("canvas").count())?page.locator("canvas").first():page.locator("body");
const pin=async()=>{await page.evaluate(y=>window.scrollTo(0,y),SCROLL_AT);await page.waitForTimeout(SETTLE);};
const shot=async()=>surface.screenshot();
const res={run:RUN,url:URL_,measured_at:new Date().toISOString(),scrollHeldAt:SCROLL_AT,perControl:[]};
try{
  await pin();
  const base=await shot();
  await page.waitForTimeout(1400);
  const idleM=changedMask(base,await shot()); res.idle=+idleM.frac.toFixed(4);

  const inv=await page.evaluate(()=>{
    const vis=el=>el.getClientRects().length&&!el.disabled&&!el.closest("[inert]");
    const ranges=[...document.querySelectorAll('input[type=range]')].filter(vis).length;
    const sliders=[...document.querySelectorAll('[role=slider]')].filter(el=>vis(el)&&el.tagName!=="INPUT").length;
    return {ranges,sliders};
  });
  res.inventory=inv;
  let union=null;
  const fold=(m)=>{ if(!m) return; if(!union) union=new Uint8Array(m.mask); else for(let i=0;i<union.length;i++) union[i]|=m.mask[i]; };

  for(let i=0;i<inv.ranges;i++){
    await pin();
    const info=await page.evaluate((idx)=>{
      const vis=el=>el.getClientRects().length&&!el.disabled&&!el.closest("[inert]");
      const r=[...document.querySelectorAll('input[type=range]')].filter(vis)[idx]; if(!r) return null;
      const min=Number(r.min||0),max=Number(r.max||100),v=Number(r.value);
      r.dataset.__orig=String(v);
      r.value=String(Math.abs(v-min)>Math.abs(v-max)?min:max);
      r.dispatchEvent(new Event("input",{bubbles:true})); r.dispatchEvent(new Event("change",{bubbles:true}));
      return {kind:"range",idx,label:r.getAttribute("aria-label")||r.id||null,from:v,to:Number(r.value)};
    },i);
    if(!info) continue;
    await page.waitForTimeout(SETTLE);
    const m=changedMask(base,await shot()); fold(m);
    res.perControl.push({...info,delta:m?+m.frac.toFixed(4):null});
    await page.evaluate((idx)=>{ const vis=el=>el.getClientRects().length&&!el.disabled;
      const r=[...document.querySelectorAll('input[type=range]')].filter(vis)[idx];
      if(r&&r.dataset.__orig!==undefined){r.value=r.dataset.__orig;
        r.dispatchEvent(new Event("input",{bubbles:true}));r.dispatchEvent(new Event("change",{bubbles:true}));}},i);
    await page.waitForTimeout(300);
  }
  for(let i=0;i<inv.sliders;i++){
    await pin();
    const ok=await page.evaluate((idx)=>{
      const vis=el=>el.getClientRects().length&&!el.disabled&&!el.closest("[inert]");
      const s=[...document.querySelectorAll('[role=slider]')].filter(el=>vis(el)&&el.tagName!=="INPUT")[idx];
      if(!s) return null; s.focus(); return {label:s.getAttribute("aria-label")||s.textContent?.trim()?.slice(0,30)||null};
    },i);
    if(!ok) continue;
    for(let k=0;k<8;k++){ await page.keyboard.press("ArrowRight"); await page.waitForTimeout(60); }
    await page.waitForTimeout(SETTLE);
    const m=changedMask(base,await shot()); fold(m);
    res.perControl.push({kind:"role-slider",idx:i,label:ok.label,delta:m?+m.frac.toFixed(4):null});
    for(let k=0;k<8;k++){ await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(40); }
    await page.waitForTimeout(300);
  }
  res.controlsDriven=res.perControl.length;
  if(!res.controlsDriven){ res.status="NOT_MEASURED"; res.reason="no rendered enabled range or role=slider control"; }
  else{
    const px=idleM.pixels; let u=0; for(let i=0;i<union.length;i++) u+=union[i];
    res.unionFraction=+(u/px).toFixed(4);
    res.controlAllUnion=+(u/px-res.idle).toFixed(4);
    res.bestSingle=+(Math.max(...res.perControl.map(c=>c.delta??0))-res.idle).toFixed(4);
  }
}catch(e){ res.error=String(e).slice(0,300); }
await browser.close();
mkdirSync(resolve(OUT),{recursive:true});
writeFileSync(resolve(OUT,RUN+"-M8.json"),JSON.stringify(res,null,1));
console.log(res.status==="NOT_MEASURED"
 ? `${RUN}: NOT_MEASURED (${res.reason})`
 : `${RUN}: driven=${res.controlsDriven} (${res.inventory.ranges}r+${res.inventory.sliders}s) idle=${res.idle} union=${res.unionFraction} -> controlAllUnion=${res.controlAllUnion} bestSingle=${res.bestSingle}${res.error?" ERR:"+res.error:""}`);

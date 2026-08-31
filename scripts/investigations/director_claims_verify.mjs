import { chromium } from "playwright";
const URL_="http://localhost:3271";
const b = await chromium.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });

// CLAIM 1: folio puts the bottle in the right third, clear of the copy
for (const [w,h] of [[1440,900],[375,812]]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, reducedMotion:"reduce" });
  const p = await c.newPage(); await p.goto(URL_,{waitUntil:"networkidle"}); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    // visible display copy = largest rendered text
    const texts=[...document.querySelectorAll("h1,h2,p,span")].map(e=>{const b=e.getBoundingClientRect();
      return {fs:parseFloat(getComputedStyle(e).fontSize), l:b.left, r:b.right, vis:b.width>2&&b.height>2};})
      .filter(x=>x.vis&&x.fs>24);
    const copyRight = texts.length?Math.max(...texts.map(t=>t.r)):null;
    // bottle = horizontal centroid of bright canvas pixels
    const cv=document.querySelector("canvas"); if(!cv) return {copyRight, bottle:null};
    const o=document.createElement("canvas"); o.width=cv.width; o.height=cv.height;
    const cx=o.getContext("2d"); cx.drawImage(cv,0,0);
    const d=cx.getImageData(0,0,o.width,o.height).data;
    let sum=0,n=0,maxX=0,minX=o.width;
    for(let y=0;y<o.height;y+=4) for(let x=0;x<o.width;x+=4){
      const i=(y*o.width+x)*4; const lum=(d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114);
      if(lum>60){ sum+=x; n++; if(x>maxX)maxX=x; if(x<minX)minX=x; } }
    const scale=cv.getBoundingClientRect().width/o.width;
    return { copyRight:Math.round(copyRight), bottleCentroidCss:n?Math.round(sum/n*scale):null,
             brightSpanCss:n?[Math.round(minX*scale),Math.round(maxX*scale)]:null };
  });
  const third = Math.round(w*2/3);
  console.log(`FOLIO ${w}x${h}: copy ends x=${r.copyRight} | bright centroid x=${r.bottleCentroidCss} | span ${JSON.stringify(r.brightSpanCss)} | right-third starts x=${third}`);
  console.log(`   -> copy clears bottle: ${r.copyRight!=null&&r.bottleCentroidCss!=null?(r.copyRight < r.bottleCentroidCss ? "YES":"NO"):"n/a"}`);
  await c.close();
}

// CLAIM 2: beat matches the framed plate (was off by one)
{
  const c = await b.newContext({ viewport:{width:1440,height:900} });
  const p = await c.newPage(); await p.goto(URL_,{waitUntil:"networkidle"}); await p.waitForTimeout(2500);
  for (const prog of [0.149,0.247]) {
    const out = await p.evaluate(async (pr)=>{ window.__thorn.step(pr); await new Promise(r=>setTimeout(r,400));
      const live=document.querySelector('[aria-live]');
      const cur=document.querySelector('[aria-current="true"],[aria-current="step"],[aria-pressed="true"]');
      return { caption:(live?.textContent||"").trim().slice(0,60),
               current:(cur?.textContent||"").trim().slice(0,40), hash:window.__thorn.hash?.() ?? null };
    }, prog);
    console.log(`BEAT p=${prog}: caption="${out.caption}" current="${out.current}"`);
  }
  await c.close();
}
await b.close();

import { chromium } from "playwright";
import { resolve } from "node:path";
const [,, webm, outPng] = process.argv;
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 1440 } });
await page.setContent(`<body style="margin:0;background:#111"><canvas id="c" width="1280" height="1440"></canvas>
<video id="v" src="file://${resolve(webm)}" muted></video></body>`);
const ok = await page.evaluate(async () => {
  const v = document.getElementById('v'), c = document.getElementById('c'), ctx = c.getContext('2d');
  await new Promise(r => { if (v.readyState >= 2) r(); else v.onloadeddata = r; });
  const dur = v.duration;
  if (!isFinite(dur) || dur <= 0) return { ok:false, dur };
  const N = 8, cols = 2, rows = 4, cw = 640, ch = 360;
  ctx.fillStyle = '#111'; ctx.fillRect(0,0,c.width,c.height);
  for (let i = 0; i < N; i++) {
    const t = (dur * (i + 0.5)) / N;
    await new Promise(r => { v.onseeked = r; v.currentTime = t; });
    await new Promise(r => setTimeout(r, 120));
    const x = (i % cols) * cw, y = Math.floor(i / cols) * ch;
    ctx.drawImage(v, x, y, cw, ch);
    ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x+8, y+8, 86, 22);
    ctx.fillStyle = '#fff'; ctx.font = '14px monospace';
    ctx.fillText(`t=${t.toFixed(1)}s`, x+14, y+24);
  }
  return { ok:true, dur };
});
if (!ok.ok) { console.error("FAILED to load video", ok); await browser.close(); process.exit(1); }
await page.locator('#c').screenshot({ path: outPng });
console.log(`${outPng}  (video ${ok.dur.toFixed(1)}s -> 8 frames)`);
await browser.close();

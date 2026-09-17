const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:false,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',ignoreDefaultArgs:['--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding','--disable-background-timer-throttling']});
const context=await browser.newContext();const page=await context.newPage();await page.goto('http://127.0.0.1:8313');await page.waitForTimeout(600);
const read=()=>page.evaluate(()=>({visibility:document.visibilityState,...window.moonwardDiagnostics()}));
const results={before:await read()};const tab=await context.newPage();await tab.goto('about:blank');await tab.bringToFront();await page.waitForTimeout(300);results.backgroundTab=await read();
if(results.backgroundTab.visibility!=='hidden'){
 await page.bringToFront();const session=await context.newCDPSession(page);const {windowId}=await session.send('Browser.getWindowForTarget');await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'minimized'}});await page.waitForTimeout(300);results.minimized=await read();await page.waitForTimeout(400);results.after=await read();await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'normal'}});
}else{await page.waitForTimeout(400);results.after=await read();}
await page.bringToFront();await page.waitForTimeout(250);results.resumed=await read();results.verified=results.after.visibility==='hidden';
if(results.verified){assert.equal(results.after.running,false);assert.equal((results.minimized||results.backgroundTab).frames,results.after.frames);assert.equal(results.resumed.running,true);}
fs.writeFileSync('output/playwright/visibility.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

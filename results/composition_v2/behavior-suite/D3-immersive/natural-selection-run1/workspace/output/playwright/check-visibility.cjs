const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
const context=await chromium.launchPersistentContext('',{headless:false,ignoreDefaultArgs:['--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding'],executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',viewport:{width:1440,height:900}});
const page=context.pages()[0];await page.goto('http://127.0.0.1:8313');await page.locator('#play').click();await page.waitForTimeout(200);
const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setFocusEmulationEnabled',{enabled:false});const firstWindow=await cdp.send('Browser.getWindowForTarget');
const info=await cdp.send('Target.getTargetInfo');
const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank',browserContextId:info.targetInfo.browserContextId,newWindow:false});
await cdp.send('Target.activateTarget',{targetId});await page.waitForTimeout(500);
const background=await page.evaluate(()=>({visibility:document.visibilityState,state:window.observatoryState}));
const tabs=await cdp.send('Target.getTargets');
const results={firstWindow,background,tabs:tabs.targetInfos.filter(t=>t.type==='page')};
console.log(JSON.stringify(results,null,2));fs.writeFileSync('output/playwright/visibility-results.json',JSON.stringify(results,null,2));await context.close();
})().catch(e=>{console.error(e);process.exit(1)});

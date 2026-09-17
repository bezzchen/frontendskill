const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:false,ignoreDefaultArgs:['--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding','--disable-background-timer-throttling'],executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const context=await browser.newContext();
const a=await context.newPage();
await a.goto('data:text/html,<h1>Visibility target</h1>');const primaryCDP=await context.newCDPSession(a);await primaryCDP.send('Emulation.setFocusEmulationEnabled',{enabled:false});
await a.evaluate(()=>{window.visibilityEvents=[];document.addEventListener('visibilitychange',()=>window.visibilityEvents.push({hidden:document.hidden,state:document.visibilityState,trusted:event.isTrusted}));});
console.log('initial',await a.evaluate(()=>({hidden:document.hidden,state:document.visibilityState})));
const b=await context.newPage();const otherCDP=await context.newCDPSession(b);await otherCDP.send('Emulation.setFocusEmulationEnabled',{enabled:false});await b.goto('data:text/html,<h1>Other tab</h1>');await b.bringToFront();await new Promise(r=>setTimeout(r,500));
console.log('after other tab',await a.evaluate(()=>({hidden:document.hidden,state:document.visibilityState,events:window.visibilityEvents})));
const cdp=await context.newCDPSession(a);const {windowId}=await cdp.send('Browser.getWindowForTarget');await cdp.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'minimized'}});await new Promise(r=>setTimeout(r,500));console.log('minimized',await a.evaluate(()=>({hidden:document.hidden,state:document.visibilityState,events:window.visibilityEvents})));await cdp.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'normal'}});await a.bringToFront();await new Promise(r=>setTimeout(r,500));
console.log('restored',await a.evaluate(()=>({hidden:document.hidden,state:document.visibilityState,events:window.visibilityEvents})));
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

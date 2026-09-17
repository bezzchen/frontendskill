const {spawn}=require('node:child_process');
const fs=require('node:fs');const path=require('node:path');
const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const userDir=fs.mkdtempSync(path.join(__dirname,'visibility-profile-'));
const proc=spawn('/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',['--remote-debugging-port=18883',`--user-data-dir=${userDir}`,'--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
let browser;
try {
for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:18883/json/version');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
browser=await chromium.connectOverCDP('http://127.0.0.1:18883',{noDefaults:true});
const context=browser.contexts()[0];const a=context.pages()[0];await a.goto('data:text/html,<h1>Target</h1>');
await a.evaluate(()=>{window.visibilityEvents=[];document.addEventListener('visibilitychange',e=>window.visibilityEvents.push({hidden:document.hidden,state:document.visibilityState,trusted:e.isTrusted}));});
const results={initial:await a.evaluate(()=>({hidden:document.hidden,state:document.visibilityState}))};
const b=await context.newPage();await b.goto('data:text/html,<h1>Other tab</h1>');await b.bringToFront();await new Promise(r=>setTimeout(r,500));
results.otherTab=await a.evaluate(()=>({hidden:document.hidden,state:document.visibilityState,events:window.visibilityEvents}));
await a.bringToFront();await new Promise(r=>setTimeout(r,500));results.restored=await a.evaluate(()=>({hidden:document.hidden,state:document.visibilityState,events:window.visibilityEvents}));
console.log(JSON.stringify(results,null,2));fs.writeFileSync(path.join(__dirname,'visibility-method-result.json'),JSON.stringify(results,null,2));
}finally{if(browser)await browser.close();proc.kill('SIGTERM');await new Promise(r=>setTimeout(r,400));fs.rmSync(userDir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exit(1)});

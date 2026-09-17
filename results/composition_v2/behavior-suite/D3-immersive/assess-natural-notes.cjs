const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {spawn}=require('node:child_process');
const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const workspace=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const requests=[];const server=http.createServer((req,res)=>{requests.push(req.url);let target=path.resolve(workspace,'.'+decodeURIComponent(req.url.split('?')[0]));if(!target.startsWith(workspace+path.sep)&&target!==workspace){res.writeHead(403).end();return;}if(target===workspace)target=path.join(target,'index.html');fs.readFile(target,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',target.endsWith('.js')?'text/javascript':target.endsWith('.css')?'text/css':target.endsWith('.svg')?'image/svg+xml':target.endsWith('.json')?'application/json':target.endsWith('.png')?'image/png':'text/html');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const profile=fs.mkdtempSync(path.join(out,'native-profile-'));
const proc=spawn('/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',['--remote-debugging-port=18886',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
let browser;const result={workspace,method:'Native headed Chromium; Playwright connectOverCDP noDefaults:true; actual foreground tab switches; no synthetic visibility property or event.',observations:[],assertions:[],errors:[]};
try{
for(let i=0;i<80;i++){try{const r=await fetch('http://127.0.0.1:18886/json/version');if(r.ok)break;}catch{}await sleep(100);}
browser=await chromium.connectOverCDP('http://127.0.0.1:18886',{noDefaults:true});const context=browser.contexts()[0],page=context.pages()[0];
await page.setViewportSize({width:1440,height:900});page.on('pageerror',e=>result.errors.push(String(e)));
await page.addInitScript(()=>{const originalRAF=window.requestAnimationFrame.bind(window),originalCancel=window.cancelAnimationFrame.bind(window),pending=new Map();window.__rafProbe={requested:0,executed:0,cancelled:0,pending:()=>[...pending.values()]};window.requestAnimationFrame=callback=>{window.__rafProbe.requested++;let id=originalRAF(t=>{pending.delete(id);window.__rafProbe.executed++;callback(t);});pending.set(id,callback.name||String(callback).slice(0,80));return id;};window.cancelAnimationFrame=id=>{window.__rafProbe.cancelled++;pending.delete(id);originalCancel(id);};window.__nativeVisibility=[];document.addEventListener('visibilitychange',e=>window.__nativeVisibility.push({time:performance.now(),hidden:document.hidden,state:document.visibilityState,trusted:e.isTrusted}));});
await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'domcontentloaded',timeout:60000});await page.bringToFront();await sleep(350);
await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
for(const [phase,act] of [[12,'arrival'],[50,'alignment'],[90,'departure']]){
 await page.locator(`[data-phase="${phase}"]`).click();
 await page.locator('#act-copy').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await sleep(200);
 const observed=await page.evaluate(()=>{const el=document.querySelector('#act-copy'),r=el.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,top=document.elementFromPoint(x,y);return {text:el.textContent,rect:{top:r.top,bottom:r.bottom,left:r.left,right:r.right},canvasRect:(()=>{const c=document.querySelector('canvas').getBoundingClientRect();return {top:c.top,bottom:c.bottom}})(),centerTopElement:top?.tagName,centerTopId:top?.id,unoccluded:top===el||el.contains(top),fullyInViewport:r.top>=0&&r.bottom<=innerHeight,hidden:document.hidden,scrollY};});
 result.observations.push({act,...observed});result.assertions.push({assertion:`mobile reduced-motion ${act} explanation visible and unoccluded`,status:observed.unoccluded&&observed.fullyInViewport?'pass':'fail',detail:observed});
 await page.screenshot({path:path.join(out,`mobile-note-${act}.png`)});
}
}catch(e){result.errors.push(e.stack);result.requests=requests;result.status='assessment-error';}finally{fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(result,null,2));if(browser)await browser.close();proc.kill('SIGTERM');await sleep(400);fs.rmSync(profile,{recursive:true,force:true});server.closeAllConnections();await new Promise(r=>server.close(r));}
console.log(JSON.stringify({out,assertions:result.assertions,errors:result.errors},null,2));
})().catch(e=>{console.error(e);process.exit(1)});

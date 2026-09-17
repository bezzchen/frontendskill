const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {spawn}=require('node:child_process');
const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const workspace=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const requests=[];const server=http.createServer((req,res)=>{requests.push(req.url);let target=path.resolve(workspace,'.'+decodeURIComponent(req.url.split('?')[0]));if(!target.startsWith(workspace+path.sep)&&target!==workspace){res.writeHead(403).end();return;}if(target===workspace)target=path.join(target,'index.html');fs.readFile(target,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',target.endsWith('.js')?'text/javascript':target.endsWith('.css')?'text/css':target.endsWith('.svg')?'image/svg+xml':'text/html');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const profile=fs.mkdtempSync(path.join(out,'native-profile-'));
const proc=spawn('/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',['--remote-debugging-port=18884',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
let browser;const result={workspace,method:'Native headed Chromium; Playwright connectOverCDP noDefaults:true; actual foreground tab switches; no synthetic visibility property or event.',observations:[],assertions:[],errors:[]};
try{
for(let i=0;i<80;i++){try{const r=await fetch('http://127.0.0.1:18884/json/version');if(r.ok)break;}catch{}await sleep(100);}
browser=await chromium.connectOverCDP('http://127.0.0.1:18884',{noDefaults:true});const context=browser.contexts()[0],page=context.pages()[0];
await page.setViewportSize({width:1440,height:900});page.on('pageerror',e=>result.errors.push(String(e)));
await page.addInitScript(()=>{const originalRAF=window.requestAnimationFrame.bind(window),originalCancel=window.cancelAnimationFrame.bind(window),pending=new Map();window.__rafProbe={requested:0,executed:0,cancelled:0,pending:()=>[...pending.values()]};window.requestAnimationFrame=callback=>{window.__rafProbe.requested++;let id=originalRAF(t=>{pending.delete(id);window.__rafProbe.executed++;callback(t);});pending.set(id,callback.name||String(callback).slice(0,80));return id;};window.cancelAnimationFrame=id=>{window.__rafProbe.cancelled++;pending.delete(id);originalCancel(id);};window.__nativeVisibility=[];document.addEventListener('visibilitychange',e=>window.__nativeVisibility.push({time:performance.now(),hidden:document.hidden,state:document.visibilityState,trusted:e.isTrusted}));});
await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'domcontentloaded',timeout:60000});await page.bringToFront();await sleep(350);
const snap=async label=>{const state=await page.evaluate(()=>({diagnostics:window.instrumentDiagnostics.snapshot(),raf:{requested:window.__rafProbe.requested,executed:window.__rafProbe.executed,cancelled:window.__rafProbe.cancelled,pending:window.__rafProbe.pending()},visibilityEvents:window.__nativeVisibility,rects:Object.fromEntries(['metronome','waveform'].map(id=>{const el=document.getElementById(id);const r=el?.getBoundingClientRect();return[id,r?{top:r.top,bottom:r.bottom,height:r.height,hidden:el.hidden}:null];})),viewport:{width:innerWidth,height:innerHeight,scrollY},overflow:document.documentElement.scrollWidth>innerWidth}));const row={label,...state};result.observations.push(row);return row;};
const pair=async label=>{const a=await snap(label+'-before');await sleep(650);const b=await snap(label+'-after');return[a,b];};
const delta=(a,b,name)=>b.diagnostics.counters[name]-a.diagnostics.counters[name];
const assertion=(name,pass,detail)=>result.assertions.push({assertion:name,status:pass?'pass':'fail',detail});
await page.locator('#toggle-metronome').click();await sleep(120);
let [a,b]=await pair('metronome-hidden-before-background');
assertion('hidden metronome is inactive before background',delta(a,b,'metronome')===0&&delta(a,b,'waveform')>0&&b.diagnostics.subscribers.length===1,{metronome:delta(a,b,'metronome'),waveform:delta(a,b,'waveform'),subscribers:b.diagnostics.subscribers});
const other=await context.newPage();await other.goto('data:text/html,<h1>Background control tab</h1>');await other.bringToFront();await sleep(200);
[a,b]=await pair('native-hidden-with-one-ineligible-owner');
assertion('native background cancels work with metronome already hidden',b.diagnostics.documentHidden===true&&b.visibilityEvents.some(e=>e.hidden&&e.trusted)&&delta(a,b,'metronome')===0&&delta(a,b,'waveform')===0&&b.raf.pending.length===0,{hidden:b.diagnostics.documentHidden,events:b.visibilityEvents,raf:b.raf,metronome:delta(a,b,'metronome'),waveform:delta(a,b,'waveform')});
await page.bringToFront();await sleep(150);
[a,b]=await pair('restored-only-waveform-eligible');
assertion('native restore resumes only eligible waveform',!b.diagnostics.documentHidden&&b.diagnostics.hidden.metronome===true&&delta(a,b,'metronome')===0&&delta(a,b,'waveform')>0&&b.diagnostics.subscribers.length===1&&String(b.diagnostics.subscribers[0]).startsWith('waveform'),{metronome:delta(a,b,'metronome'),waveform:delta(a,b,'waveform'),subscribers:b.diagnostics.subscribers,raf:b.raf,events:b.visibilityEvents});
await page.screenshot({path:path.join(out,'restored-only-waveform.png')});await other.close();
await page.locator('#toggle-metronome').click();await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await sleep(150);
const before=await snap('mobile-before-input');await page.getByRole('slider',{name:'Amplitude',exact:true}).focus();await page.keyboard.press('ArrowRight');const after=await snap('mobile-after-waveform-input');
assertion('narrow reduced-motion waveform control remains operable',after.diagnostics.settings.waveform>before.diagnostics.settings.waveform&&!after.overflow,{before:before.diagnostics.settings,after:after.diagnostics.settings,overflow:after.overflow});
await page.screenshot({path:path.join(out,'mobile-waveform-keyboard.png')});
}catch(e){result.errors.push(e.stack);result.requests=requests;result.status='assessment-error';}finally{fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(result,null,2));if(browser)await browser.close();proc.kill('SIGTERM');await sleep(400);fs.rmSync(profile,{recursive:true,force:true});server.closeAllConnections();await new Promise(r=>server.close(r));}
console.log(JSON.stringify({out,assertions:result.assertions,errors:result.errors},null,2));
})().catch(e=>{console.error(e);process.exit(1)});

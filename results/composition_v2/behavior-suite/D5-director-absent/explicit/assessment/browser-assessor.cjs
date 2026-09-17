const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),cp=require('child_process');
const run=path.resolve(process.argv[2]),port=Number(process.argv[3]),mode=process.argv[4]||'inspect',workspace=path.join(run,'workspace'),out=path.join(run,'assessment');fs.mkdirSync(out,{recursive:true});fs.copyFileSync(__filename,path.join(out,'browser-assessor.cjs'));
(async()=>{const build=cp.spawnSync('npm',['run','build'],{cwd:workspace,encoding:'utf8',timeout:300000});fs.writeFileSync(path.join(out,'build.txt'),(build.stdout||'')+(build.stderr||''));if(build.status!==0){fs.writeFileSync(path.join(out,'assessment.json'),JSON.stringify({status:'build-failed',exit:build.status},null,2));process.exit(1);}
const log=[],errors=[];let browser,server;const serverFile=fs.openSync(path.join(out,'server.txt'),'a');
try{server=cp.spawn(process.execPath,[path.join(workspace,'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:workspace,stdio:['ignore',serverFile,serverFile]});for(let i=0;i<120;i++){try{const r=await fetch('http://127.0.0.1:'+port);if(r.ok)break;}catch{}if(i===119)throw Error('preview readiness timed out');await new Promise(r=>setTimeout(r,250));}
browser=await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
async function record(page,name,fullPage=false){const data={name,viewport:page.viewportSize(),body:await page.locator('body').innerText(),controls:await page.locator('input,button,select,textarea').evaluateAll(ns=>ns.filter(n=>n.offsetParent!==null).map(n=>({tag:n.tagName,type:n.type,id:n.id,name:n.name,label:n.labels?[...n.labels].map(l=>l.innerText).join(' '):n.getAttribute('aria-label'),text:n.textContent,value:n.value,checked:n.checked,disabled:n.disabled}))),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id,text:['BODY','HTML'].includes(document.activeElement.tagName)?null:document.activeElement.textContent})),geometry:await page.evaluate(()=>({innerWidth,scrollWidth:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll('button,input')].map(n=>({text:n.textContent,radius:getComputedStyle(n).borderRadius}))}))};log.push(data);await page.screenshot({path:path.join(out,name+'.png'),fullPage});console.log(name);}
for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+port);await record(page,name+'-initial',true);
if(mode==='d5'){
 const confirm=page.getByRole('button',{name:/Confirm shift/});
 await confirm.click();await record(page,name+'-empty-error');
 const full=page.getByRole('radio',{name:/Compost crew/});if(!await full.isDisabled())throw Error('Full shift is not disabled');await page.getByText('Compost crew',{exact:true}).scrollIntoViewIfNeeded();const fullBox=await page.getByText('Compost crew',{exact:true}).boundingBox();await page.mouse.click(fullBox.x+fullBox.width/2,fullBox.y+fullBox.height/2);if(await full.isChecked())throw Error('Full shift selected after pointer click');await record(page,name+'-full-unavailable');
 await page.getByRole('radio',{name:/Morning planting/}).check();await confirm.click();await record(page,name+'-name-error');
 await page.getByLabel('Contact name',{exact:true}).fill('   ');await confirm.click();await record(page,name+'-whitespace-error');
 await page.getByLabel('Contact name',{exact:true}).fill('Casey Morgan');await confirm.click();await page.waitForTimeout(800);await record(page,name+'-pointer-success');
 const buttons=page.getByRole('button');if(await buttons.count()!==1)throw Error('Inspect confirmation reset control before proceeding');await buttons.click();await record(page,name+'-reset');
 await page.reload();await page.getByRole('radio',{name:/Morning planting/}).waitFor();
 for(let i=0;i<20 && await page.evaluate(()=>document.activeElement.type)!=='radio';i++)await page.keyboard.press('Tab');
 if(await page.evaluate(()=>document.activeElement.type)!=='radio')throw Error('Shift radio not reachable with Tab');
 await page.keyboard.press('ArrowDown');await page.keyboard.press('Space');await record(page,name+'-keyboard-shift-focus');
 await page.keyboard.press('Tab');if(await page.evaluate(()=>document.activeElement.type)!=='text')throw Error('Name not next after radio group');await page.keyboard.type('Jordan Vale');await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await record(page,name+'-keyboard-submit-focus');await page.keyboard.press('Enter');await page.waitForTimeout(800);await record(page,name+'-keyboard-success');
}

 await page.close();}
fs.writeFileSync(path.join(out,'assessment.json'),JSON.stringify({status:'observed',mode,route:'http://127.0.0.1:'+port,log,errors},null,2));
}catch(e){fs.writeFileSync(path.join(out,'assessment.json'),JSON.stringify({status:'assessment-error',mode,error:e.stack,log,errors},null,2));throw e;}finally{if(browser)await browser.close();if(server){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}fs.closeSync(serverFile);}})();

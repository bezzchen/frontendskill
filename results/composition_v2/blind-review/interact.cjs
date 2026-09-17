const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'); const path=require('path'); const out=__dirname;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const log=[]; const errors=[];
 async function record(page,name){const entry={name,time:new Date().toISOString(),body:await page.locator('body').innerText(),focus:await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id,text:document.activeElement.textContent})),scroll:await page.evaluate(()=>({x:scrollX,y:scrollY}))};log.push(entry);await page.screenshot({path:path.join(out,name+'.png'),fullPage:false});console.log(name,JSON.stringify(entry));}
 const desktop=await browser.newPage({viewport:{width:1440,height:900}});
 desktop.on('pageerror',e=>errors.push(e.message));
 await desktop.goto('http://127.0.0.1:8765/');
 await desktop.keyboard.press('Tab'); await record(desktop,'desktop-skip-focus');
 await desktop.keyboard.press('Enter'); await record(desktop,'desktop-skip-activated');
 await desktop.getByRole('button',{name:'Reserve my seat'}).click(); await record(desktop,'desktop-empty-errors');
 await desktop.getByLabel('Your name').fill('Mina Reed');await desktop.getByLabel('Email address').fill('not-an-email');
 await desktop.getByRole('button',{name:'Reserve my seat'}).click();await record(desktop,'desktop-email-error');
 await desktop.getByLabel('Email address').fill('mina@example.com');await desktop.getByLabel('How will you join?').selectOption({label:'Online'});
 await desktop.getByRole('button',{name:'Reserve my seat'}).click();await record(desktop,'desktop-submitting');
 await desktop.waitForTimeout(900);await record(desktop,'desktop-success');
 await desktop.getByRole('button',{name:'Register another guest'}).click(); await record(desktop,'desktop-reset');
 await desktop.getByLabel('Your name').focus();await desktop.keyboard.type('Robin Lane');await desktop.keyboard.press('Tab');await desktop.keyboard.type('robin@example.com');await desktop.keyboard.press('Tab');await desktop.keyboard.press('ArrowDown');await desktop.keyboard.press('Tab');await record(desktop,'desktop-submit-keyboard-focus');await desktop.keyboard.press('Space');await desktop.waitForTimeout(900);await record(desktop,'desktop-keyboard-success');
 const mobile=await browser.newPage({viewport:{width:375,height:812}});mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto('http://127.0.0.1:8765/');
 await mobile.getByLabel('Your name').fill('Jules Park');await mobile.getByLabel('Email address').fill('jules@example.com');await mobile.getByLabel('How will you join?').selectOption({label:'Online'});await record(mobile,'mobile-filled');
 try{await mobile.getByRole('button',{name:'Reserve my seat'}).click({timeout:3500});log.push({name:'mobile-pointer-submit',outcome:'clicked'});}catch(e){log.push({name:'mobile-pointer-submit',outcome:'failed',error:e.message});console.log('mobile-pointer-failure',e.message);}
 await record(mobile,'mobile-pointer-blocked');
 const geometry=await mobile.getByRole('button',{name:'Reserve my seat'}).evaluate(n=>{const r=n.getBoundingClientRect();const e=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {button:{x:r.x,y:r.y,width:r.width,height:r.height},hitTarget:{tag:e?.tagName,id:e?.id,text:e?.textContent}}});log.push({name:'mobile-hit-test',...geometry});console.log('mobile-hit-test',JSON.stringify(geometry));
 await mobile.getByLabel('How will you join?').focus();await mobile.keyboard.press('Tab');await record(mobile,'mobile-submit-keyboard-focus');await mobile.keyboard.press('Space');await mobile.waitForTimeout(900);await record(mobile,'mobile-keyboard-success');
 await mobile.getByRole('button',{name:'Register another guest'}).click();await record(mobile,'mobile-reset');
 const reduced=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:8765/');await reduced.getByLabel('Your name').fill('Avery Chen');await reduced.getByLabel('Email address').fill('avery@example.com');await reduced.getByLabel('How will you join?').focus();await reduced.keyboard.press('Tab');await reduced.keyboard.press('Space');await record(reduced,'mobile-reduced-motion-submitting');await reduced.waitForTimeout(900);await record(reduced,'mobile-reduced-motion-success');
 fs.writeFileSync(path.join(out,'interaction-log.json'),JSON.stringify({reviewer:'/root/v2_director_adapter',route:'http://127.0.0.1:8765/',log,errors},null,2));await browser.close();
})();

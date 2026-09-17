const fs = require('fs');
const assert = require('node:assert/strict');
const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir = __dirname;
const evidence = {review_mode:'independent',reviewer:'/root/rendered_recheck',cycle:1,events:[],checks:[],states:[]};
const mark=(name,detail)=>evidence.checks.push({name,passed:true,detail});
async function state(page,label){
  const s=await page.evaluate(()=>({text:document.body.innerText,focus:document.activeElement.id,inputs:[...document.querySelectorAll('input,button')].map(n=>({id:n.id,value:n.value,checked:n.checked,disabled:n.disabled,invalid:n.getAttribute('aria-invalid'),text:n.textContent})),width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,scrollY,storage:{...localStorage}}));
  evidence.states.push({label,...s});return s;
}
async function shot(page,name){await page.screenshot({path:`${dir}/${name}.png`,fullPage:true});}
async function save(page,label,trigger){
  const start=Date.now();await trigger();const pending=await state(page,`${label}-pending`);
  assert.match(pending.text,/Saving/);assert(await page.locator('#save-settings').isDisabled());
  await shot(page,`${label}-pending`);
  await page.locator('#save-settings').waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#save-settings').textContent.includes('Saving'));
  const done=await state(page,`${label}-complete`);mark(`${label}: save resolves`,{elapsedMs:Date.now()-start});await shot(page,`${label}-complete`);return done;
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 try{
  async function make(options){const page=await browser.newPage(options);page.on('console',m=>evidence.events.push({type:'console',level:m.type(),text:m.text()}));page.on('pageerror',e=>evidence.events.push({type:'pageerror',text:e.message}));return page;}
  const p=await make({viewport:{width:1440,height:900}});await p.goto('http://127.0.0.1:8872/');
  await p.locator('#display-name').fill('Juniper Clay Studio');await p.locator('#kiln-alerts').uncheck();
  const success=await save(p,'desktop-pointer',()=>p.locator('#save-settings').click());assert.match(success.text,/saved/i);mark('desktop pointer save success',success.storage);
  for(const [label,value] of [['empty',''],['whitespace','   ']]){
   await p.locator('#display-name').fill(value);await p.locator('#save-settings').click();const s=await state(p,label);assert.equal(s.focus,'display-name');assert.equal(s.inputs[0].invalid,'true');assert(!s.text.includes('Saving'));await shot(p,label);mark(`${label} validation`,s.text);
  }
  await p.locator('#display-name').fill('x'.repeat(61));assert.equal((await p.locator('#display-name').inputValue()).length,60);mark('61st character prevented by input length limit');const boundary=await save(p,'length-60',()=>p.locator('#save-settings').click());assert.match(boundary.text,/saved/i);mark('60 character boundary accepted');
  await p.goto('http://127.0.0.1:8872/?save=error');await p.locator('#display-name').fill('Porcelain Garden');await p.locator('#kiln-alerts').uncheck();
  const error=await save(p,'desktop-error',()=>p.locator('#save-settings').click());assert.match(error.text,/couldn|unable|failed|try again/i);assert.equal(await p.locator('#display-name').inputValue(),'Porcelain Garden');assert.equal(await p.locator('#kiln-alerts').isChecked(),false);mark('failure retains entered preferences');
  await p.evaluate(()=>window.studioService.mode='success');const retry=await save(p,'desktop-retry',()=>p.locator('#save-settings').click());assert.match(retry.text,/saved/i);mark('pointer retry succeeds');
  await p.goto('http://127.0.0.1:8872/');await p.keyboard.press('Tab');assert.equal((await state(p,'keyboard-name')).focus,'display-name');await shot(p,'keyboard-name-focus');await p.keyboard.press('ControlOrMeta+A');await p.keyboard.type('Keyboard Clay');
  await p.keyboard.press('Tab');assert.equal((await state(p,'keyboard-checkbox')).focus,'kiln-alerts');await shot(p,'keyboard-checkbox-focus');const before=await p.locator('#kiln-alerts').isChecked();await p.keyboard.press('Space');assert.equal(await p.locator('#kiln-alerts').isChecked(),!before);
  await p.keyboard.press('Tab');assert.equal((await state(p,'keyboard-save')).focus,'save-settings');await shot(p,'keyboard-save-focus');await p.keyboard.press('Shift+Tab');assert.equal((await state(p,'keyboard-reverse')).focus,'kiln-alerts');await p.keyboard.press('Tab');const kb=await save(p,'keyboard-space',()=>p.keyboard.press('Space'));assert.match(kb.text,/saved/i);await p.keyboard.press('Shift+Tab');await p.keyboard.press('Shift+Tab');assert.equal((await state(p,'keyboard-enter-name')).focus,'display-name');await p.keyboard.press('ControlOrMeta+A');await p.keyboard.type('Enter Studio');const enter=await save(p,'keyboard-enter',()=>p.keyboard.press('Enter'));assert.match(enter.text,/saved/i);mark('keyboard Tab/Shift+Tab and Space/Enter task completion');
  const m=await make({viewport:{width:390,height:900},hasTouch:true,isMobile:true});await m.goto('http://127.0.0.1:8872/');await shot(m,'phone-initial');const initial=await state(m,'phone-initial');assert(initial.scrollWidth<=390);const geom=await m.locator('h1').evaluate(n=>({box:n.getBoundingClientRect().toJSON(),font:getComputedStyle(n).fontSize,lineHeight:getComputedStyle(n).lineHeight}));mark('390px header geometry and no horizontal overflow',geom);
  await m.locator('#display-name').tap();await m.locator('#display-name').fill('Touch Clay');await m.locator('#kiln-alerts').tap();const touch=await save(m,'phone-touch',()=>m.locator('#save-settings').tap());assert.match(touch.text,/saved/i);mark('emulated touch save success');
  await m.goto('http://127.0.0.1:8872/?save=error');await m.locator('#display-name').fill('Phone Retry Studio');await m.locator('#kiln-alerts').uncheck();const me=await save(m,'phone-error',()=>m.locator('#save-settings').tap());assert.match(me.text,/couldn|unable|failed|try again/i);assert.equal(await m.locator('#display-name').inputValue(),'Phone Retry Studio');assert.equal(await m.locator('#kiln-alerts').isChecked(),false);await m.evaluate(()=>window.studioService.mode='success');const mr=await save(m,'phone-retry',()=>m.locator('#save-settings').tap());assert.match(mr.text,/saved/i);mark('phone retry keeps values and succeeds');
  await m.setViewportSize({width:390,height:600});await m.goto('http://127.0.0.1:8872/');await m.screenshot({path:`${dir}/phone-short-top.png`});await m.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await m.screenshot({path:`${dir}/phone-short-bottom.png`});const short=await state(m,'phone-short-scrolled');assert(short.scrollY>0);assert(short.scrollWidth<=390);await m.locator('#display-name').fill('Short Viewport');const shortSave=await save(m,'phone-short',()=>m.locator('#save-settings').tap());assert.match(shortSave.text,/saved/i);mark('390x600 scrolling and save',short);
  assert.equal(evidence.events.filter(e=>e.type==='pageerror'||e.level==='error').length,0);mark('no console errors or page errors');
 }catch(e){evidence.failure=e.stack;process.exitCode=1;}finally{fs.writeFileSync(`${dir}/evidence.json`,JSON.stringify(evidence,null,2));await browser.close();console.log(JSON.stringify({checks:evidence.checks,events:evidence.events,failure:evidence.failure},null,2));}
})();

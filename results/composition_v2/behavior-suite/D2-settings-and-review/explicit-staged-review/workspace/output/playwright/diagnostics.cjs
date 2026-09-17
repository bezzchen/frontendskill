const fs = require('fs');
const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:8890/D2-settings-and-review/checkpoints/explicit/';
const results = [];
(async () => {
 const browser = await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 try {
  for (const width of [1440, 601, 600, 390, 375, 320]) {
   const page = await browser.newPage({viewport:{width,height:900}});
   await page.goto(base);
   const geometry = await page.evaluate(() => {
    const selectors = ['h1','header p','.intro','.actions','#save-settings','label[for="kiln-alerts"]','fieldset','form'];
    return { elements: selectors.flatMap(s => [...document.querySelectorAll(s)].map(n => { const c=getComputedStyle(n);return {selector:s,text:n.innerText,rect:n.getBoundingClientRect().toJSON(),styles:{position:c.position,marginTop:c.marginTop,marginBottom:c.marginBottom,lineHeight:c.lineHeight,pointerEvents:c.pointerEvents,padding:c.padding},before:{content:getComputedStyle(n,'::before').content,position:getComputedStyle(n,'::before').position,inset:getComputedStyle(n,'::before').inset},after:{content:getComputedStyle(n,'::after').content,position:getComputedStyle(n,'::after').position,inset:getComputedStyle(n,'::after').inset}};})), hitTargets:[.05,.5,.95].map(r=>{const b=document.querySelector('#save-settings').getBoundingClientRect();const n=document.elementFromPoint(b.x+b.width*r,b.y+b.height/2);return {ratio:r,tag:n.tagName,id:n.id,class:n.className};}), services:{windowType:typeof window.studioService, lexicalType:typeof studioService}, descriptions:[...document.querySelectorAll('[aria-describedby]')].map(n=>({id:n.id,targets:n.getAttribute('aria-describedby').split(' ').map(id=>({id,exists:!!document.getElementById(id),text:document.getElementById(id)?.textContent}))})) };
   });
   const b=await page.locator('#save-settings').boundingBox();
   await page.mouse.click(b.x+b.width/2,b.y+b.height/2);
   await page.waitForTimeout(750);
   const pointerStatus=await page.locator('#save-status').innerText();
   if (width===601||width===600) await page.screenshot({path:`output/playwright/${width}-pointer.png`,fullPage:true});
   results.push({width,geometry,pointerStatus});
   await page.close();
  }
  for(const width of [1440,390]) {
   const page=await browser.newPage({viewport:{width,height:900}});
   await page.goto(base);
   await page.locator('#display-name').fill('  Pending Test  ');
   await page.evaluate(()=>{
    window.reviewStart=performance.now();window.reviewTimeline=[];
    new MutationObserver(()=>window.reviewTimeline.push({ms:Math.round(performance.now()-window.reviewStart),status:document.querySelector('#save-status').textContent,disabled:[...document.querySelectorAll('input,button')].map(n=>({id:n.id,disabled:n.matches(':disabled')}))})).observe(document.querySelector('form'),{attributes:true,childList:true,subtree:true,characterData:true});
   });
   await page.locator('#display-name').press('Enter');
   const pending=await page.evaluate(()=>({status:document.querySelector('#save-status').textContent,fieldset:[...document.querySelectorAll('fieldset')].map(n=>({disabled:n.disabled,busy:n.getAttribute('aria-busy')})),controls:[...document.querySelectorAll('input,button')].map(n=>({id:n.id,disabled:n.matches(':disabled')}))}));
   const nameBox=await page.locator('#display-name').boundingBox();
   await page.mouse.click(nameBox.x+50,nameBox.y+20);
   await page.keyboard.type('SHOULD NOT EDIT');
   const checkBox=await page.locator('#kiln-alerts').boundingBox();
   await page.mouse.click(checkBox.x+10,checkBox.y+10);
   const button=await page.locator('#save-settings').boundingBox();
   await page.mouse.click(button.x+button.width/2,button.y+20,{clickCount:3,delay:10});
   await page.keyboard.press('Enter');
   await page.waitForTimeout(900);
   const completion=await page.evaluate(()=>({timeline:window.reviewTimeline,value:document.querySelector('#display-name').value,checked:document.querySelector('#kiln-alerts').checked,status:document.querySelector('#save-status').textContent,focus:document.activeElement.id}));
   results.push({width,test:'pending-lock-and-timing',pending,completion});
   await page.goto(base+'?save=error');
   await page.keyboard.press('Tab');await page.keyboard.press('Meta+A');await page.keyboard.type('Keyboard Error');
   await page.keyboard.press('Tab');await page.keyboard.press('Space');await page.keyboard.press('Tab');await page.keyboard.press('Space');
   await page.waitForTimeout(750);
   await page.screenshot({path:`output/playwright/${width}-keyboard-error.png`,fullPage:true});
   const first=await page.locator('#save-status').innerText();
   await page.keyboard.press('Enter');await page.waitForTimeout(750);
   const retry=await page.locator('#save-status').innerText();
   await page.keyboard.press('Shift+Tab');await page.keyboard.press('Shift+Tab');await page.keyboard.press('Meta+A');await page.keyboard.press('Backspace');await page.keyboard.press('Enter');
   results.push({width,test:'keyboard-error-retry-empty',first,retry,empty:await page.locator('#save-status').innerText(),focus:await page.evaluate(()=>document.activeElement.id)});
   await page.close();
  }
 } finally {fs.writeFileSync('output/playwright/diagnostics.json',JSON.stringify(results,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

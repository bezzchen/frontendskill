const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const observations=[];
for(const [name,width,height,reducedMotion] of [['desktop',1440,900,'no-preference'],['phone',375,812,'no-preference'],['reduced',375,812,'reduce'],['tablet',820,1180,'no-preference']]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8313');await page.waitForTimeout(350);
 const row={name,errors,overflow:await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})),initial:await page.locator('#passage').inputValue()};
 await page.screenshot({path:`output/playwright/reviewer-${name}-initial.png`,fullPage:true});
 row.chapter=[];
 for(const chapter of ['Alignment','Departure','Arrival']){
 await page.getByRole('button',{name:new RegExp(chapter)}).click();await page.waitForTimeout(550);
 row.chapter.push({chapter,value:await page.locator('#passage').inputValue(),heading:await page.locator('h2').allTextContents()});
 await page.screenshot({path:`output/playwright/reviewer-${name}-${chapter.toLowerCase()}.png`});
 }
 await page.locator('#viewpoint').focus();await page.keyboard.press('End');row.viewpointEnd=await page.locator('#viewpoint').inputValue();await page.keyboard.press('Home');row.viewpointHome=await page.locator('#viewpoint').inputValue();
 await page.locator('#passage').focus();await page.keyboard.press('End');row.passageEnd=await page.locator('#passage').inputValue();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');row.passageKeyboard=await page.locator('#passage').inputValue();
 await page.locator('#reset').click();row.reset={passage:await page.locator('#passage').inputValue(),viewpoint:await page.locator('#viewpoint').inputValue()};
 row.guidesBefore=await page.locator('#guides').getAttribute('aria-pressed');await page.locator('#guides').click();row.guidesAfter=await page.locator('#guides').getAttribute('aria-pressed');
 await page.getByRole('button',{name:'Field guide'}).click();row.dialog=await page.locator('dialog').evaluate(el=>({open:el.open,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,active:document.activeElement.id}));
 await page.screenshot({path:`output/playwright/reviewer-${name}-guide.png`});await page.keyboard.press('Tab');row.focusInDialog=await page.evaluate(()=>!!document.activeElement.closest('dialog'));await page.keyboard.press('Escape');row.dialogClosed=await page.locator('dialog').evaluate(el=>!el.open);row.dialogFocusReturned=await page.evaluate(()=>document.activeElement.textContent);
 row.playDisabled=await page.locator('#play').isDisabled();
 if(!row.playDisabled){await page.locator('#play').click();await page.waitForTimeout(400);row.playValue=await page.locator('#passage').inputValue();await page.locator('#play').click();let val=await page.locator('#passage').inputValue();await page.waitForTimeout(100);row.pauseHeld=val===await page.locator('#passage').inputValue();}
 observations.push(row);await page.close();
}
fs.writeFileSync('output/playwright/reviewer-results.json',JSON.stringify(observations,null,2));console.log(JSON.stringify(observations,null,2));await browser.close();
})();

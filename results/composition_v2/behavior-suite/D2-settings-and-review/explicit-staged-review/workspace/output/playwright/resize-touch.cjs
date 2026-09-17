const fs=require('fs');
const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const results=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},hasTouch:true,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:8890/D2-settings-and-review/checkpoints/explicit/');
  await page.setViewportSize({width:390,height:900});
  await page.locator('#display-name').fill('  Resize Clay Studio  ');
  await page.locator('label[for="kiln-alerts"]').tap();
  const b=await page.locator('#save-settings').boundingBox();
  await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);
  await page.waitForTimeout(850);
  results.push({test:'resize-and-touch',status:await page.locator('#save-status').innerText(),geometry:await page.evaluate(()=>['h1','#settings-help'].map(s=>{const n=document.querySelector(s);return {selector:s,rect:n.getBoundingClientRect().toJSON(),transform:getComputedStyle(n).transform};}))});
  await page.screenshot({path:'output/playwright/390-touch-blocked-reduced.png',fullPage:true});
  await page.locator('#display-name').press('Enter');await page.waitForTimeout(750);
  results.push({test:'resized-keyboard-completion',status:await page.locator('#save-status').innerText(),value:await page.locator('#display-name').inputValue(),checked:await page.locator('#kiln-alerts').isChecked(),animations:await page.evaluate(()=>document.getAnimations().length)});
  await page.setViewportSize({width:390,height:400});
  await page.mouse.wheel(0,1000);await page.waitForTimeout(100);
  await page.screenshot({path:'output/playwright/390-short-scrolled.png'});
  results.push({test:'short-screen-scroll',...await page.evaluate(()=>({scrollY,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,saveRect:document.querySelector('#save-settings').getBoundingClientRect().toJSON(),statusRect:document.querySelector('#save-status').getBoundingClientRect().toJSON()}))});
 }finally{fs.writeFileSync('output/playwright/resize-touch.json',JSON.stringify(results,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

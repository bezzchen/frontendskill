const fs=require('fs');
const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const url='http://127.0.0.1:8890/D2-settings-and-review/checkpoints/natural-selection/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});const log=[];
 try{
  const p=await browser.newPage({viewport:{width:1440,height:900}});await p.goto(url);
  for(const width of [1440,768,390]){
   await p.setViewportSize({width,height:900});
   log.push({name:'rendered-styles',width,data:await p.evaluate(()=>({elements:[...document.querySelectorAll('h1,p,button,.actions')].map(n=>({tag:n.tagName,id:n.id,class:n.className,text:n.innerText,rect:n.getBoundingClientRect().toJSON(),style:{pointerEvents:getComputedStyle(n).pointerEvents,marginTop:getComputedStyle(n).marginTop,position:getComputedStyle(n).position,top:getComputedStyle(n).top,transform:getComputedStyle(n).transform}})),overflow:document.documentElement.scrollWidth>innerWidth}))});
   if(width===768)await p.screenshot({path:'output/playwright/768-default.png',fullPage:true});
  }
  await p.goto(url+'?save=error');await p.keyboard.press('Tab');await p.keyboard.press('Meta+a');await p.keyboard.insertText('Pointer Retry Studio');await p.keyboard.press('Tab');await p.keyboard.press('Space');await p.keyboard.press('Tab');await p.keyboard.press('Enter');await p.waitForTimeout(750);
  const box=await p.locator('button').boundingBox();await p.mouse.click(box.x+box.width/2,box.y+box.height/2);await p.waitForTimeout(750);
  log.push({name:'390-pointer-retry-after-keyboard-error',data:{button:await p.locator('button').innerText(),error:await p.locator('#save-error').innerText(),name:await p.locator('#display-name').inputValue(),checked:await p.locator('#kiln-alerts').isChecked()}});await p.screenshot({path:'output/playwright/390-pointer-retry-blocked.png',fullPage:true});
  await p.setViewportSize({width:390,height:600});await p.goto(url);await p.mouse.wheel(0,800);await p.waitForTimeout(150);await p.screenshot({path:'output/playwright/390x600-scrolled.png'});log.push({name:'short-viewport-scroll',data:await p.evaluate(()=>({y:scrollY,height:document.documentElement.scrollHeight,button:document.querySelector('button').getBoundingClientRect().toJSON()}))});
  const touch=await browser.newPage({viewport:{width:390,height:900},hasTouch:true,isMobile:true});await touch.goto(url);await touch.locator('#display-name').fill('Juniper Touch Studio');const tb=await touch.locator('button').boundingBox();await touch.touchscreen.tap(tb.x+tb.width/2,tb.y+tb.height/2);await touch.waitForTimeout(750);log.push({name:'390-emulated-touch-save',data:{button:await touch.locator('button').innerText(),status:await touch.locator('#save-status').innerText()}});await touch.screenshot({path:'output/playwright/390-touch-save-blocked.png',fullPage:true});
  fs.writeFileSync('output/playwright/followup-results.json',JSON.stringify(log,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

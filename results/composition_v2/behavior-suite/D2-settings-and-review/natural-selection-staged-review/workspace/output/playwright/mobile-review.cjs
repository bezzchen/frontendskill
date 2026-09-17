const fs=require('fs');
const {chromium}=require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const url='http://127.0.0.1:8890/D2-settings-and-review/checkpoints/natural-selection/';
const out='output/playwright';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const p=await browser.newPage({viewport:{width:390,height:900}});const log=[];const errors=[];
 p.on('console',m=>errors.push({type:'console',level:m.type(),text:m.text()}));p.on('pageerror',e=>errors.push({type:'pageerror',text:e.message}));
 const snap=async(name,shot=true)=>{log.push({name,data:await p.evaluate(()=>({text:document.body.innerText,focus:document.activeElement.id,scroll:{x:scrollX,y:scrollY,width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},controls:[...document.querySelectorAll('input,button')].map(n=>({id:n.id,value:n.value,checked:n.checked,disabled:n.disabled,ariaDisabled:n.getAttribute('aria-disabled'),invalid:n.getAttribute('aria-invalid'),describedby:n.getAttribute('aria-describedby'),outline:getComputedStyle(n).outline,rect:n.getBoundingClientRect().toJSON()})),messages:[...document.querySelectorAll('[role]')].map(n=>({id:n.id,role:n.getAttribute('role'),text:n.innerText})),animations:document.getAnimations().map(a=>({state:a.playState,duration:a.effect.getTiming().duration}))}))});if(shot)await p.screenshot({path:`${out}/390-${name}.png`,fullPage:true});fs.writeFileSync(`${out}/mobile-results.json`,JSON.stringify(log,null,2));};
 const keySave=async(name,key='Enter')=>{
   await p.evaluate(()=>{window.reviewStart=performance.now();window.reviewTimeline=[];window.reviewObserver=new MutationObserver(()=>window.reviewTimeline.push({ms:performance.now()-window.reviewStart,button:document.querySelector('button').innerText,status:document.querySelector('#save-status').innerText,error:document.querySelector('#save-error').innerText}));window.reviewObserver.observe(document.querySelector('form'),{subtree:true,attributes:true,childList:true,characterData:true});});
   await p.keyboard.press(key);await snap(name+'-saving');await p.waitForTimeout(800);await snap(name+'-settled');log.push({name:name+'-timeline',data:await p.evaluate(()=>{window.reviewObserver.disconnect();return window.reviewTimeline;})});
 };
 try{
  await p.goto(url);await p.locator('#display-name').fill('Juniper Pointer Studio');await p.getByText('Email me when my firing is ready',{exact:true}).click();
  const b=await p.locator('#save-settings').boundingBox();
  for(const [name,x,y] of [['center',b.x+b.width/2,b.y+b.height/2],['left',b.x+8,b.y+8],['right',b.x+b.width-8,b.y+b.height-8]]){
    log.push({name:'pointer-hit-'+name,data:await p.evaluate(({x,y})=>({x,y,hit:document.elementFromPoint(x,y)?.outerHTML}),{x,y})});
    await p.mouse.click(x,y);await p.waitForTimeout(750);await snap('pointer-'+name+'-after');
  }
  await p.locator('#display-name').fill('');await p.mouse.click(b.x+b.width/2,b.y+b.height/2);await snap('pointer-empty-attempt');
  log.push({name:'header-geometry',data:await p.evaluate(()=>[...document.querySelectorAll('h1,header p')].map(n=>({text:n.innerText,rect:n.getBoundingClientRect().toJSON(),font:getComputedStyle(n).font,lineHeight:getComputedStyle(n).lineHeight,margin:getComputedStyle(n).margin,transform:getComputedStyle(n).transform})))});
  await p.goto(url);await p.keyboard.press('Tab');await snap('keyboard-name-focus');await p.keyboard.press('Meta+a');await p.keyboard.press('Backspace');await p.keyboard.press('Enter');await snap('empty-invalid');
  await p.keyboard.insertText('   ');await p.keyboard.press('Enter');await snap('whitespace-invalid');await p.keyboard.press('Meta+a');await p.keyboard.insertText('A'.repeat(61));await snap('length-boundary',false);
  await p.keyboard.press('Meta+a');await p.keyboard.insertText('Juniper Keyboard Studio');await p.keyboard.press('Tab');await snap('keyboard-checkbox-focus');await p.keyboard.press('Space');await p.keyboard.press('Tab');await snap('keyboard-save-focus');await p.keyboard.press('Shift+Tab');await snap('keyboard-reverse-focus',false);await p.keyboard.press('Tab');await keySave('keyboard-success');
  await p.keyboard.press('Shift+Tab');await p.keyboard.press('Shift+Tab');await p.keyboard.press('Meta+a');await p.keyboard.insertText('Juniper Keyboard Studio II');await snap('edited-after-success');
  await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await snap('bottom',false);await p.screenshot({path:`${out}/390-bottom-viewport.png`});
  await p.goto(url+'?save=error');await p.keyboard.press('Tab');await p.keyboard.press('Meta+a');await p.keyboard.insertText('Keyboard Retry Studio');await p.keyboard.press('Tab');await p.keyboard.press('Space');await p.keyboard.press('Tab');await keySave('service-error','Space');await keySave('service-retry');
  await p.emulateMedia({reducedMotion:'reduce'});await p.goto(url);await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.keyboard.press('Tab');await keySave('reduced-motion');
  log.push({name:'browser-errors',errors});fs.writeFileSync(`${out}/mobile-results.json`,JSON.stringify(log,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

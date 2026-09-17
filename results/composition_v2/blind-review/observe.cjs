const {chromium} = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const out=__dirname;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 for(const [name,width,height] of [['desktop',1440,900],['mobile',375,812]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://127.0.0.1:8765/');
  await page.screenshot({path:path.join(out,`${name}-initial.png`),fullPage:true});
  const observation={viewport:{width,height},body:await page.locator('body').innerText(),controls:await page.locator('input,select,button,a').evaluateAll(nodes=>nodes.map(n=>({tag:n.tagName,type:n.type,label:n.getAttribute('aria-label'),text:n.textContent,id:n.id,name:n.name,placeholder:n.placeholder}))),width:await page.evaluate(()=>({innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight}))};
  fs.writeFileSync(path.join(out,`${name}-initial.json`),JSON.stringify(observation,null,2));
  console.log(name,JSON.stringify(observation));
  await page.close();
 }
 await browser.close();
})();

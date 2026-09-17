const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const readline = require('readline');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
  const context = await browser.newContext({viewport:{width:1440,height:900}});
  const page = await context.newPage();
  const events = [];
  page.on('console', message => events.push({type:'console',level:message.type(),text:message.text()}));
  page.on('pageerror', error => events.push({type:'pageerror',text:error.message}));
  const log = (entry) => fs.appendFileSync('output/playwright/interaction-log.jsonl',JSON.stringify({time:new Date().toISOString(),...entry})+'\n');
  await page.goto('http://127.0.0.1:8765/');
  console.log('READY');
  for await (const line of readline.createInterface({input:process.stdin})) {
    if (line === 'EXIT') { fs.writeFileSync('output/playwright/console-events.json',JSON.stringify(events,null,2)); await browser.close(); break; }
    try {
      const result = await new (Object.getPrototypeOf(async function(){}).constructor)('page','context','browser','events',line)(page,context,browser,events);
      log({action:line,result});
      console.log(JSON.stringify({result}));
    } catch(error) { log({action:line,error:error.message}); console.log(JSON.stringify({error:error.message})); }
  }
})();

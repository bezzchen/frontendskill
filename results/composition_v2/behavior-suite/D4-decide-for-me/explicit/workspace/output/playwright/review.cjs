const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const assert = require('assert/strict');
(async()=>{
 const browser = await chromium.launch({headless:true,executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const results=[]; const logs=[];
 for(const [label,width,height] of [['desktop',1440,900],['mobile',375,812]]) {
  const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();
  page.on('console',m=>{if(m.type()==='error')logs.push({type:m.type(),text:m.text()})});page.on('pageerror',e=>logs.push({error:e.message}));
  const snap=async(state)=>page.screenshot({path:`output/playwright/review-${state}-${label}.png`,fullPage:true});
  const overflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
  const scan=async()=>{await overflow(); const end=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<end;y+=height-120){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(50)}await page.evaluate(()=>scrollTo(0,0))};
  await page.goto('http://127.0.0.1:5173/membership');await scan();await snap('membership');
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Skip to content');await snap('skip-focus');await page.keyboard.press('Enter');
  await page.getByRole('button',{name:'Join the demo member list'}).click();assert.equal(await page.locator(':focus').getAttribute('id'),'member-name');
  assert.equal(await page.getByLabel('Your name').getAttribute('aria-invalid'),'true');await snap('membership-empty');
  await page.keyboard.type('Review Member');await page.keyboard.press('Tab');await page.keyboard.type('invalid');await page.keyboard.press('Tab');await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('id'),'member-email');assert.equal(await page.getByLabel('Your name').inputValue(),'Review Member');await snap('membership-invalid-email');
  await page.getByLabel('Email address').fill(`review-${label}@example.test`);await page.keyboard.press('Tab');await snap('membership-button-focus');await page.keyboard.press('Enter');
  const membershipStatus=await page.getByRole('status').innerText();assert.match(membershipStatus,/review|list|saved|joined/i);await snap('membership-success');
  await page.getByRole('link',{name:'Notification preferences',exact:true}).click();await scan();await snap('preferences');
  const field=page.getByLabel('Display name');assert.equal(await field.inputValue(),'Avery');
  const boxes=page.getByRole('checkbox');assert.deepEqual(await boxes.evaluateAll(els=>els.map(e=>e.checked)),[true,true,false]);
  await field.fill('   ');await boxes.nth(0).uncheck();await boxes.nth(2).check();await page.getByRole('button',{name:'Save preferences'}).click();
  assert.equal(await page.locator(':focus').getAttribute('id'),await field.getAttribute('id'));assert.equal(await field.getAttribute('aria-invalid'),'true');
  assert.deepEqual(await boxes.evaluateAll(els=>els.map(e=>e.checked)),[false,true,true]);await snap('preferences-invalid');
  await field.fill('Review Member');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('type'),'checkbox');
  await page.keyboard.press('Space');await page.keyboard.press('Tab');await page.keyboard.press('Space');await page.keyboard.press('Tab');await page.keyboard.press('Space');
  assert.deepEqual(await boxes.evaluateAll(els=>els.map(e=>e.checked)),[true,false,false]);await page.keyboard.press('Shift+Tab');assert.equal(await page.locator(':focus').getAttribute('type'),'checkbox');
  await snap('preferences-checkbox-focus');await page.keyboard.press('Tab');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Save preferences');await page.keyboard.press('Enter');
  const preferenceStatus=await page.getByRole('status').innerText();assert.match(preferenceStatus,/saved/i);await snap('preferences-success');
  await page.reload();assert.equal(await field.inputValue(),'Review Member');assert.deepEqual(await boxes.evaluateAll(els=>els.map(e=>e.checked)),[true,false,false]);
  await boxes.nth(0).uncheck();await page.getByRole('button',{name:'Save preferences'}).click();await page.reload();assert.deepEqual(await boxes.evaluateAll(els=>els.map(e=>e.checked)),[false,false,false]);
  await page.emulateMedia({reducedMotion:'reduce'});await scan();await snap('preferences-reduced-motion');
  const animations=await page.evaluate(()=>document.getAnimations().length);assert.equal(animations,0);
  results.push({viewport:{width,height},membershipStatus,preferenceStatus,validation:'pass',keyboard:'Tab, Shift+Tab, Space, Enter; focus and completion pass',reloadPersistence:'pass',allOff:'pass',overflow:'none',reducedMotion:'pass',activeAnimations:animations});await context.close();
 }
 fs.writeFileSync('output/playwright/review-results.json',JSON.stringify({results,consoleErrors:logs},null,2));console.log(JSON.stringify({results,consoleErrors:logs},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

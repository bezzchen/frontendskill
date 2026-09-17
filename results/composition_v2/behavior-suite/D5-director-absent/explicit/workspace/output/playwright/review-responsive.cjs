const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const p=await b.newPage({viewport:{width:1440,height:900}});const log=[];
 const focus=()=>p.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id,text:document.activeElement.textContent,value:document.activeElement.value}));
 await p.goto('http://127.0.0.1:5173');await p.keyboard.press('Tab');log.push({state:'first Tab',focus:await focus()});
 await p.screenshot({path:'output/playwright/review-desktop-keyboard-focus.png',fullPage:true});
 await p.keyboard.press('Space');await p.keyboard.press('ArrowDown');assert.equal(await p.getByRole('radio').nth(1).isChecked(),true);
 await p.keyboard.press('Tab');assert.equal((await focus()).id,'contact-name');await p.keyboard.type('Jordan Example');await p.keyboard.press('Tab');log.push({state:'confirm keyboard focus',focus:await focus()});await p.keyboard.press('Shift+Tab');assert.equal((await focus()).id,'contact-name');await p.keyboard.press('Tab');await p.keyboard.press('Enter');await p.getByRole('heading',{name:'Shift confirmed.'}).waitFor();log.push({state:'keyboard completion',focus:await focus()});
 await p.keyboard.press('Tab');await p.keyboard.press('Enter');assert.equal(await p.getByLabel('Contact name').inputValue(),'');assert.equal(await p.getByRole('radio').nth(1).isChecked(),false);log.push({state:'keyboard reset',focus:await focus()});
 await p.setViewportSize({width:768,height:1024});await p.screenshot({path:'output/playwright/review-tablet-initial.png',fullPage:true});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.setViewportSize({width:375,height:812});await p.screenshot({path:'output/playwright/review-phone-initial.png',fullPage:true});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.getByRole('button',{name:'Confirm shift'}).click();await p.screenshot({path:'output/playwright/review-phone-errors.png',fullPage:true});assert.equal((await focus()).id,'shift-morning');
 await p.getByRole('radio').first().check();await p.getByLabel('Contact name').fill('Morgan Demo');await p.getByRole('button',{name:'Confirm shift'}).click();await p.getByRole('heading',{name:'Shift confirmed.'}).waitFor();await p.screenshot({path:'output/playwright/review-phone-confirmed.png',fullPage:true});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.getByRole('button',{name:'Begin another sign-up'}).click();assert.equal(await p.getByLabel('Contact name').inputValue(),'');assert.equal(await p.getByRole('radio').last().isDisabled(),true);
 for(let i=0;i<3;i++){await p.getByRole('radio').first().check();await p.getByLabel('Contact name').fill('Sample Volunteer '+i);await p.getByRole('button',{name:'Confirm shift'}).click();await p.getByRole('heading',{name:'Shift confirmed.'}).waitFor();await p.getByRole('button',{name:'Begin another sign-up'}).click();}
 assert.equal(await p.getByRole('radio').first().isDisabled(),true);await p.screenshot({path:'output/playwright/review-phone-depleted.png',fullPage:true});log.push({state:'morning depleted after 4 signups',text:await p.locator('body').innerText()});
 await p.emulateMedia({reducedMotion:'reduce'});await p.getByRole('radio').nth(1).check();await p.getByLabel('Contact name').fill('Alex Example');await p.getByRole('button',{name:'Confirm shift'}).click();await p.getByRole('heading',{name:'Shift confirmed.'}).waitFor();log.push({state:'reduced motion confirmation',focus:await focus()});
 await p.reload();assert.equal(await p.getByRole('radio').first().isDisabled(),false);assert.equal(await p.getByLabel('Contact name').inputValue(),'');log.push({state:'reload clears local data',pass:true});
 fs.writeFileSync('output/playwright/review-responsive-log.json',JSON.stringify(log,null,2));console.log(JSON.stringify(log,null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

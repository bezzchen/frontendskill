import { chromium } from '/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser = await chromium.launch({executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const log={review_mode:'independent',reviewer:'/root/rendered_review',checks:[],consoleErrors:[]};
const check=(name,actual)=>{log.checks.push({name,actual});fs.writeFileSync('output/playwright/review-interactions.json',JSON.stringify(log,null,2));};
for (const [device,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:375,height:812}]]) {
 const context=await browser.newContext({viewport}); const page=await context.newPage();
 page.on('pageerror',e=>log.consoleErrors.push(e.message));
 await page.goto('http://127.0.0.1:5173/membership');
 await page.getByRole('button',{name:'Become a member'}).click();
 await page.getByRole('button',{name:'Join the demo member list'}).click();
 check(`${device} empty membership validation`,{text:await page.locator('form').innerText(),focused:await page.locator(':focus').getAttribute('id')});
 await page.screenshot({path:`output/playwright/review-membership-${device}-error.png`,fullPage:true});
 await page.getByLabel('Your name').fill('Robin Test');
 await page.getByLabel('Email address').fill('invalid-email');
 await page.getByRole('button',{name:'Join the demo member list'}).click();
 check(`${device} invalid email`,{text:await page.locator('form').innerText(),focused:await page.locator(':focus').getAttribute('id'),name:await page.getByLabel('Your name').inputValue()});
 await page.getByLabel('Email address').fill('robin@example.com');
 await page.getByRole('button',{name:'Join the demo member list'}).click();
 check(`${device} membership success`,await page.locator('main').innerText());
 await page.screenshot({path:`output/playwright/review-membership-${device}-success.png`,fullPage:true});
 check(`${device} membership overflow`,await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth})));
 await page.getByRole('navigation').getByRole('link',{name:'Notification preferences'}).click();
 await page.screenshot({path:`output/playwright/review-preferences-${device}-initial.png`,fullPage:true});
 await page.getByLabel('Display name').fill('');
 await page.getByRole('checkbox',{name:'Repair evenings'}).uncheck();
 await page.getByRole('button',{name:'Save preferences'}).click();
 check(`${device} preferences error retains checkbox`,{text:await page.locator('form').innerText(),checked:await page.getByRole('checkbox',{name:'Repair evenings'}).isChecked(),focused:await page.locator(':focus').getAttribute('id')});
 await page.screenshot({path:`output/playwright/review-preferences-${device}-error.png`,fullPage:true});
 await page.getByLabel('Display name').fill('Robin Test');
 await page.getByRole('button',{name:'Save preferences'}).click();
 check(`${device} preferences success`,await page.locator('form').innerText());
 await page.screenshot({path:`output/playwright/review-preferences-${device}-success.png`,fullPage:true});
 check(`${device} preferences overflow`,await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth})));
 await page.getByLabel('Display name').fill('Cancel this edit');
 await page.getByRole('checkbox',{name:'Monthly digest'}).check();
 await page.getByRole('button',{name:'Cancel',exact:true}).click();
 check(`${device} cancel`,{name:await page.getByLabel('Display name').inputValue(),monthlyDigest:await page.getByRole('checkbox',{name:'Monthly digest'}).isChecked()});
 // Observe successive viewports while scrolling each full surface.
 for(const route of ['membership','preferences']) {await page.goto(`http://127.0.0.1:5173/${route}`);const height=await page.locator('body').evaluate(e=>e.scrollHeight);for(let y=0;y<height;y+=viewport.height-120){await page.evaluate(y=>scrollTo(0,y),y);await page.screenshot({path:`output/playwright/review-${route}-${device}-scroll-${y}.png`});}}
 await context.close();
}
// Pointer-free operation and focus evidence on both forms.
const context=await browser.newContext({viewport:{width:1440,height:900}}); const page=await context.newPage();
await page.goto('http://127.0.0.1:5173/membership');
await page.keyboard.press('Tab');
check('initial keyboard focus',await page.locator(':focus').innerText());
await page.screenshot({path:'output/playwright/review-keyboard-skip-focus.png'});
await page.keyboard.press('Enter');
check('skip link target',await page.locator(':focus').getAttribute('id'));
await page.keyboard.press('Tab');
check('membership CTA keyboard focus',await page.locator(':focus').innerText());
await page.keyboard.press('Enter');
check('membership anchor keyboard focus',await page.locator(':focus').getAttribute('id'));
check('membership form first tab focus',await page.locator(':focus').getAttribute('id'));
await page.keyboard.type('Robin Test');await page.keyboard.press('Tab');await page.keyboard.type('robin@example.com');await page.keyboard.press('Tab');
await page.screenshot({path:'output/playwright/review-keyboard-membership-submit-focus.png'});
await page.keyboard.press('Enter');
check('keyboard membership completed',await page.locator('main').innerText());
await page.goto('http://127.0.0.1:5173/preferences');
await page.locator('body').click({position:{x:3,y:3}});
const focusOrder=[];
for(let i=0;i<12;i++){await page.keyboard.press('Tab');focusOrder.push(await page.evaluate(()=>{const e=document.activeElement;return {tag:e.tagName,id:e.id,text:e.innerText,type:e.type}}));if(await page.evaluate(()=>document.activeElement.id)==='display-name')break;}
check('preferences keyboard order',focusOrder);
await page.keyboard.press('ControlOrMeta+A');await page.keyboard.type('Robin Test');await page.keyboard.press('Tab');await page.keyboard.press('Space');
check('keyboard checkbox toggle',await page.locator(':focus').isChecked());
await page.screenshot({path:'output/playwright/review-keyboard-checkbox-focus.png'});
await page.keyboard.press('Tab');await page.keyboard.press('Tab');await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
check('shift tab returns monthly digest',await page.locator(':focus').getAttribute('id'));
await page.keyboard.press('Tab');await page.keyboard.press('Enter');
check('keyboard preferences completion',await page.locator('form').innerText());
for(const reducedMotion of ['no-preference','reduce']){await page.emulateMedia({reducedMotion});await page.goto('http://127.0.0.1:5173/membership');const before=await page.locator('svg').first().boundingBox();await page.waitForTimeout(350);check(`motion ${reducedMotion}`,{activeAnimations:await page.evaluate(()=>document.getAnimations().length),before,after:await page.locator('svg').first().boundingBox()});}
await context.close();await browser.close();fs.writeFileSync('output/playwright/review-interactions.json',JSON.stringify(log,null,2));

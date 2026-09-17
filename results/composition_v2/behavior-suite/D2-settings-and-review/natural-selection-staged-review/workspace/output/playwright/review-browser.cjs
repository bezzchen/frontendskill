const fs = require('fs');
const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const url = 'http://127.0.0.1:8890/D2-settings-and-review/checkpoints/natural-selection/';
const dir = 'output/playwright';
const results = [];
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      const errors = [];
      page.on('console', msg => errors.push({type:'console',level:msg.type(),text:msg.text()}));
      page.on('pageerror', err => errors.push({type:'pageerror',text:err.message}));
      const record = async (state, shot = true) => {
        const data = await page.evaluate(() => ({
          text:document.body.innerText,
          viewport:{width:innerWidth,height:innerHeight}, scroll:{x:scrollX,y:scrollY,width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},
          focus:{id:document.activeElement.id,tag:document.activeElement.tagName},
          controls:[...document.querySelectorAll('input,button')].map(n=>({id:n.id,value:n.value,checked:n.checked,disabled:n.disabled,required:n.required,maxLength:n.maxLength,invalid:n.getAttribute('aria-invalid'),describedby:n.getAttribute('aria-describedby'),labels:n.labels?[...n.labels].map(l=>l.innerText):[],rect:n.getBoundingClientRect().toJSON(),outline:getComputedStyle(n).outline,boxShadow:getComputedStyle(n).boxShadow})),
          messages:[...document.querySelectorAll('[role],[aria-live]')].map(n=>({tag:n.tagName,id:n.id,role:n.getAttribute('role'),live:n.getAttribute('aria-live'),text:n.innerText})),
          animations:document.getAnimations().map(a=>({playState:a.playState,duration:a.effect.getTiming().duration}))
        }));
        results.push({width,state,...data});
        if (shot) await page.screenshot({path:`${dir}/${width}-${state}.png`,fullPage:true});
        fs.writeFileSync(`${dir}/review-results.json`,JSON.stringify(results,null,2));
      };
      const save = async (prefix, trigger) => {
        await page.evaluate(() => {
          window.reviewTimeline=[];
          const start=performance.now();
          window.reviewObserver=new MutationObserver(()=>window.reviewTimeline.push({ms:performance.now()-start,button:document.querySelector('button').innerText,disabled:document.querySelector('button').disabled,text:document.body.innerText}));
          window.reviewObserver.observe(document.querySelector('form'),{subtree:true,childList:true,attributes:true,characterData:true});
        });
        await trigger();
        await record(`${prefix}-saving`);
        await page.waitForTimeout(800);
        await record(`${prefix}-settled`);
        results.push({width,state:`${prefix}-timeline`,timeline:await page.evaluate(()=>{window.reviewObserver.disconnect();return window.reviewTimeline;})});
      };
      await page.goto(url);
      await record('default');
      await page.locator('#display-name').fill('');
      await page.locator('#save-settings').click();
      await record('empty-invalid');
      await page.locator('#display-name').fill('   ');
      await page.locator('#save-settings').click();
      await record('whitespace-invalid');
      await page.locator('#display-name').fill('A'.repeat(61));
      await record('length-boundary',false);
      await page.locator('#display-name').fill('Juniper Clay Studio');
      await page.getByText('Email me when my firing is ready',{exact:true}).click();
      await record('pointer-edited',false);
      await save('pointer-success',()=>page.locator('#save-settings').click());
      await page.locator('#display-name').fill('Juniper Clay Studio II');
      await record('edited-after-success');
      await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
      await record('bottom',false);
      await page.screenshot({path:`${dir}/${width}-bottom-viewport.png`});
      await page.goto(url+'?save=error');
      await page.locator('#display-name').fill('Juniper Clay Studio');
      await page.getByText('Email me when my firing is ready',{exact:true}).click();
      await save('service-error',()=>page.locator('#save-settings').click());
      await save('service-retry',()=>page.locator('#save-settings').click());
      await page.goto(url);
      await page.keyboard.press('Tab');
      await record('keyboard-name-focus');
      await page.keyboard.press('Meta+a');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Enter');
      await record('keyboard-invalid');
      await page.keyboard.insertText('Juniper Keyboard Studio');
      await page.keyboard.press('Tab');
      await record('keyboard-checkbox-focus');
      await page.keyboard.press('Space');
      await page.keyboard.press('Tab');
      await record('keyboard-save-focus');
      await page.keyboard.press('Shift+Tab');
      await record('keyboard-reverse-focus',false);
      await page.keyboard.press('Tab');
      await save('keyboard-success',()=>page.keyboard.press('Enter'));
      await page.goto(url+'?save=error');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Meta+a');
      await page.keyboard.insertText('Keyboard Retry Studio');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');
      await page.keyboard.press('Tab');
      await save('keyboard-error',()=>page.keyboard.press('Space'));
      await save('keyboard-retry',()=>page.keyboard.press('Enter'));
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.goto(url);
      await save('reduced-motion',()=>page.locator('#save-settings').click());
      results.push({width,state:'browser-errors',errors});
      fs.writeFileSync(`${dir}/review-results.json`,JSON.stringify(results,null,2));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(err=>{fs.writeFileSync(`${dir}/review-failure.txt`,err.stack);console.error(err);process.exitCode=1;});

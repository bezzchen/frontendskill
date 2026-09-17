const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
  const page = await browser.newPage({viewport: {width:1440,height:900}, deviceScaleFactor:1});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8313');
  await page.waitForTimeout(1500);
  await page.screenshot({path:'output/playwright/desktop-arrival.png',fullPage:true});
  console.log(JSON.stringify({errors,diagnostics:await page.evaluate(()=>window.moonwardDiagnostics?.())}));
  await page.setViewportSize({width:375,height:812});
  await page.waitForTimeout(500);
  await page.screenshot({path:'output/playwright/mobile-arrival.png',fullPage:true});
  await browser.close();
})();

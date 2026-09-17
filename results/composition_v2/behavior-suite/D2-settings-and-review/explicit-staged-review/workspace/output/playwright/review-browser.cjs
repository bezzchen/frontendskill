const fs = require('fs');
const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:8890/D2-settings-and-review/checkpoints/explicit/';
const out = 'output/playwright';
const results = [];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
  try {
    for (const width of [390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const events = [];
      page.on('console', m => events.push({ type: 'console', level: m.type(), text: m.text() }));
      page.on('pageerror', e => events.push({ type: 'pageerror', text: e.message }));
      const record = async (state, screenshot = true) => {
        const data = await page.evaluate(() => ({
          text: document.body.innerText,
          focus: { tag: document.activeElement.tagName, id: document.activeElement.id },
          width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
          controls: [...document.querySelectorAll('input, button')].map(n => ({ id: n.id, value: n.value, checked: n.checked, disabled: n.matches(':disabled'), invalid: n.getAttribute('aria-invalid'), describedby: n.getAttribute('aria-describedby'), maxLength: n.maxLength, rect: n.getBoundingClientRect().toJSON(), outline: getComputedStyle(n).outline })),
          labels: [...document.querySelectorAll('label')].map(n => ({ text: n.innerText, for: n.htmlFor, rect: n.getBoundingClientRect().toJSON() })),
          feedback: [...document.querySelectorAll('[role], [aria-live]')].map(n => ({ tag: n.tagName, id: n.id, role: n.getAttribute('role'), live: n.getAttribute('aria-live'), busy: n.getAttribute('aria-busy'), text: n.textContent })),
          styles: { background: getComputedStyle(document.body).backgroundColor, color: getComputedStyle(document.body).color, font: getComputedStyle(document.body).fontFamily },
          animations: document.getAnimations().length
        }));
        const path = `${out}/${width}-${state}.png`;
        if (screenshot) await page.screenshot({ path, fullPage: true });
        results.push({ width, state, url: page.url(), screenshot: screenshot ? path : null, ...data });
      };
      const name = page.locator('#display-name');
      const save = { click: async () => { await page.locator('#display-name').press('Enter'); } };
      await page.goto(base);
      await record('default');
      await page.locator('label[for="kiln-alerts"]').click();
      await name.fill('  River Clay Studio  ');
      const buttonBox = await page.locator('#save-settings').boundingBox();
      await page.mouse.click(buttonBox.x + buttonBox.width / 2, buttonBox.y + buttonBox.height / 2);
      await page.waitForTimeout(850);
      await record('pointer-save-blocked');
      await save.click();
      await record('saving');
      await page.waitForTimeout(800);
      await record('success');
      await page.waitForTimeout(1200);
      await record('success-persistent', false);
      await name.fill('River Clay Studio Two');
      await record('edit-clears-success', false);
      await name.fill('');
      await save.click();
      await record('empty-invalid');
      await name.fill('   ');
      await save.click();
      await record('whitespace-invalid', false);
      await name.fill('A'.repeat(61));
      await save.click();
      await record('overlength-invalid');
      await name.fill('A'.repeat(60));
      await save.click();
      await page.waitForTimeout(800);
      await record('boundary-60', false);
      await name.fill('  A  ');
      await save.click();
      await page.waitForTimeout(800);
      await record('boundary-one-trimmed', false);

      await page.goto(base);
      await page.keyboard.press('Tab');
      await record('keyboard-name');
      await page.keyboard.press('Meta+A');
      await page.keyboard.type('Keyboard Clay Studio');
      await page.keyboard.press('Tab');
      await record('keyboard-checkbox');
      await page.keyboard.press('Space');
      await page.keyboard.press('Tab');
      await record('keyboard-save');
      await page.keyboard.press('Shift+Tab');
      await record('keyboard-reverse', false);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await record('keyboard-saving');
      await page.waitForTimeout(800);
      await record('keyboard-success');
      await page.keyboard.press('Tab');
      await record('keyboard-after-save-tab', false);

      await page.goto(base + '?save=error');
      await name.fill('  Failed Clay Studio  ');
      await page.locator('label[for="kiln-alerts"]').click();
      await save.click();
      await record('error-saving');
      await page.waitForTimeout(800);
      await record('service-error');
      await save.click();
      await record('retry-saving', false);
      await page.waitForTimeout(800);
      await record('retry-error', false);
      await page.locator('label[for="kiln-alerts"]').click();
      await record('checkbox-clears-error', false);
      await save.click();
      await page.waitForTimeout(800);
      await name.fill('Edited after error');
      await record('name-clears-error', false);
      results.push({ width, events });
      await page.close();
    }
    for (const width of [600, 375, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 812 }, reducedMotion: 'reduce' });
      await page.goto(base);
      await page.screenshot({ path: `${out}/${width}-default.png`, fullPage: true });
      await page.locator('#display-name').fill('');
      await page.locator('#display-name').press('Enter');
      await page.screenshot({ path: `${out}/${width}-invalid.png`, fullPage: true });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      results.push({ width, state: 'narrow-invalid-reduced-motion', ...await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, scrollHeight: document.documentElement.scrollHeight, scrollY, animations: document.getAnimations().length, controls: [...document.querySelectorAll('input,button,label')].map(n => ({ id: n.id, text: n.innerText, rect: n.getBoundingClientRect().toJSON() })) })) });
      await page.close();
    }
  } finally {
    fs.writeFileSync(`${out}/mobile-observations.json`, JSON.stringify(results, null, 2));
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });

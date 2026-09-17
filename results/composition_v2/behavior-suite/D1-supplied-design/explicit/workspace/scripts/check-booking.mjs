import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath: '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',
});
const output = 'output/playwright';
await mkdir(output, { recursive: true });
try {
  for (const width of [1440, 390, 375, 320, 768]) {
    const page = await browser.newPage({ viewport: { width, height: 922 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5173');
    const reserve = page.getByRole('button', { name: 'Reserve a place', exact: true });
    const session = page.getByRole('button', { name: /Print a tea towel/ });
    const name = page.getByRole('textbox', { name: 'Attendee name' });
    await page.screenshot({ path: `${output}/initial-${width}.png`, fullPage: true });
    await reserve.click();
    assert.equal(await page.getByText('Choose a session to reserve your place.').count(), 1);
    assert.equal(await page.getByText('Enter your name to reserve your place.').count(), 1);
    assert.equal(await session.evaluate(el => el === document.activeElement), true);
    await page.screenshot({ path: `${output}/validation-${width}.png`, fullPage: true });
    await page.keyboard.press('Space');
    assert.equal(await session.getAttribute('aria-pressed'), 'true');
    await name.fill('   ');
    await reserve.click();
    assert.equal(await name.getAttribute('aria-invalid'), 'true');
    assert.equal(await name.evaluate(el => el === document.activeElement), true);
    await name.fill('  Alex Rivera  ');
    const mending = page.getByRole('button', { name: /Visible mending/ });
    await mending.click();
    assert.equal(await session.getAttribute('aria-pressed'), 'false');
    assert.equal(await page.getByRole('button', { pressed: true }).count(), 1);
    await page.screenshot({ path: `${output}/selected-${width}.png`, fullPage: true });
    await name.focus();
    await page.keyboard.press('Enter');
    const confirmation = page.getByRole('region', { name: 'Your place is reserved' });
    await confirmation.waitFor();
    for (const text of ['Alex Rivera', 'Visible mending', 'Saturday 17 October', '10:00–11:30']) {
      assert.ok((await confirmation.innerText()).includes(text));
    }
    assert.equal(await page.getByRole('heading', { name: 'Your place is reserved' }).evaluate(el => el === document.activeElement), true);
    await page.screenshot({ path: `${output}/confirmation-${width}.png`, fullPage: true });
    await page.keyboard.press('Tab');
    assert.equal(await page.getByRole('button', { name: 'Start another reservation' }).evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await name.inputValue(), '');
    assert.equal(await page.getByRole('button', { pressed: true }).count(), 0);
    assert.equal(await session.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Sam Chen');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await confirmation.waitFor();
    assert.ok((await confirmation.innerText()).includes('Make a pocket notebook'));
    assert.ok((await confirmation.innerText()).includes('Sam Chen'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: validation, selection, confirmation, reset, keyboard, overflow, runtime errors`);
    await page.close();
  }
} finally {
  await browser.close();
}

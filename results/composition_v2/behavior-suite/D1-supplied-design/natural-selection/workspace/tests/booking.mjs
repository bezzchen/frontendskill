import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath: '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',
  headless: true,
});
const output = 'output/playwright';
await mkdir(output, { recursive: true });
let failures = 0;
const checks = [
  ['single selection and keyboard controls', async page => {
    const first = page.getByRole('button', { name: /Print a tea towel/ });
    const second = page.getByRole('button', { name: /Visible mending/ });
    await first.focus();
    await page.keyboard.press('Space');
    assert.equal(await first.getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.equal(await second.getAttribute('aria-pressed'), 'true');
    assert.equal(await first.getAttribute('aria-pressed'), 'false');
    assert.equal(await page.getByRole('button', { pressed: true }).count(), 1);
    assert.match(await second.innerText(), /Selected/);
    await page.screenshot({ path: `${output}/selected-desktop.png`, fullPage: true });
  }],
  ['required fields and whitespace validation', async page => {
    await page.getByRole('button', { name: 'Reserve a place' }).click();
    assert.equal(await page.getByText('Choose a session to continue.', { exact: true }).count(), 1);
    assert.equal(await page.getByText('Enter your name to continue.', { exact: true }).count(), 1);
    assert.equal(await page.getByRole('button', { name: /Print a tea towel/ }).evaluate(el => el === document.activeElement), true);
    await page.getByRole('button', { name: /Visible mending/ }).click();
    assert.equal(await page.getByText('Choose a session to continue.', { exact: true }).count(), 0);
    await page.getByRole('textbox', { name: 'Attendee name' }).fill('   ');
    await page.getByRole('button', { name: 'Reserve a place' }).click();
    assert.equal(await page.getByRole('textbox').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.getByRole('textbox').evaluate(el => el === document.activeElement), true);
    await page.screenshot({ path: `${output}/validation-desktop.png`, fullPage: true });
    await page.getByRole('textbox').fill('Avery');
    assert.equal(await page.getByText('Enter your name to continue.', { exact: true }).count(), 0);
  }],
  ['name alone cannot confirm', async page => {
    await page.getByRole('textbox').fill('Avery');
    await page.getByRole('button', { name: 'Reserve a place' }).click();
    assert.equal(await page.getByText('Choose a session to continue.', { exact: true }).count(), 1);
    assert.equal(await page.getByText('Enter your name to continue.', { exact: true }).count(), 0);
    assert.equal(await page.getByRole('textbox').inputValue(), 'Avery');
  }],
  ['confirmation matches every session and resets', async page => {
    const sessions = [
      ['Print a tea towel', 'Wednesday 14 October', '18:00–19:30'],
      ['Visible mending', 'Saturday 17 October', '10:00–11:30'],
      ['Make a pocket notebook', 'Sunday 18 October', '14:00–15:30'],
    ];
    for (const [title, day, time] of sessions) {
      await page.getByRole('button', { name: new RegExp(title) }).click();
      await page.getByRole('textbox').fill('  Avery Chen  ');
      await page.getByRole('textbox').press('Enter');
      const confirmation = page.getByRole('region', { name: 'Your place is reserved' });
      assert.equal(await confirmation.count(), 1);
      const text = await confirmation.innerText();
      for (const detail of ['Avery Chen', title, day, time, 'Local booking demo. No payment or message is sent.']) {
        assert.ok(text.includes(detail), `Missing confirmation detail: ${detail}`);
      }
      assert.equal(await page.getByRole('heading', { name: 'Your place is reserved' }).evaluate(el => el === document.activeElement), true);
      assert.equal(await page.getByRole('button', { name: new RegExp(title) }).isDisabled(), true);
      await page.screenshot({ path: `${output}/confirmation-desktop.png`, fullPage: true });
      await page.getByRole('button', { name: 'Start another reservation' }).click();
      assert.equal(await page.getByRole('textbox').inputValue(), '');
      assert.equal(await page.getByRole('button', { pressed: true }).count(), 0);
      assert.equal(await page.getByRole('button', { name: /Print a tea towel/ }).evaluate(el => el === document.activeElement), true);
    }
  }],
  ['approved layout and narrow confirmation', async page => {
    await page.screenshot({ path: `${output}/initial-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${output}/initial-mobile.png`, fullPage: true });
    await page.setViewportSize({ width: 320, height: 700 });
    await page.getByRole('button', { name: /Make a pocket notebook/ }).click();
    await page.getByRole('textbox').fill('A'.repeat(160));
    await page.getByRole('button', { name: 'Reserve a place' }).click();
    assert.equal(await page.getByRole('heading', { name: 'Your place is reserved' }).count(), 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `${output}/confirmation-narrow.png`, fullPage: true });
  }],
];

try {
  for (const [name, check] of checks) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 922 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto('http://127.0.0.1:5173');
      await check(page);
      assert.deepEqual(errors, []);
      console.log(`PASS ${name}`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`${checks.length - failures}/${checks.length} checks passed`);
process.exitCode = failures ? 1 : 0;

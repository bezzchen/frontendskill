import { chromium } from '/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
const results = [];
const consoleErrors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', error => consoleErrors.push(error.message));
const base = 'http://127.0.0.1:5173';
async function check(label, fn) { await fn(); results.push(label); console.log(`PASS: ${label}`); }
try {
  await page.goto(`${base}/membership`);
  await page.screenshot({ path: 'output/playwright/membership-desktop.png', fullPage: true });
  await check('Membership CTA focuses name and empty submit shows linked errors', async () => {
    await page.getByRole('button', { name: 'Become a member' }).click();
    assert.equal(await page.locator(':focus').getAttribute('id'), 'member-name');
    await page.getByRole('button', { name: 'Join the demo member list' }).click();
    assert.equal(await page.getByRole('alert').count(), 2);
    assert.equal(await page.getByLabel('Your name').getAttribute('aria-invalid'), 'true');
  });
  await check('Invalid email retains name; valid membership writes local demo entry', async () => {
    await page.getByLabel('Your name').fill('Sam Repair');
    await page.getByLabel('Email address').fill('not-an-email');
    await page.getByRole('button', { name: 'Join the demo member list' }).click();
    assert.equal(await page.getByRole('alert').count(), 1);
    assert.equal(await page.getByLabel('Your name').inputValue(), 'Sam Repair');
    await page.getByLabel('Email address').fill('sam@example.com');
    await page.getByRole('button', { name: 'Join the demo member list' }).click();
    assert.match(await page.getByRole('status').innerText(), /You’re on the demo list, Sam Repair/);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('round-again:demo-members'))), [{ name: 'Sam Repair', email: 'sam@example.com' }]);
    await page.screenshot({ path: 'output/playwright/membership-success.png', fullPage: true });
  });
  await page.getByRole('link', { name: 'Choose your notification preferences' }).click();
  await page.screenshot({ path: 'output/playwright/preferences-desktop.png', fullPage: true });
  await check('Preference defaults match supplied content', async () => {
    assert.equal(await page.getByLabel('Display name').inputValue(), 'Avery');
    assert.equal(await page.getByLabel('Repair evenings', { exact: true }).isChecked(), true);
    assert.equal(await page.getByLabel('Skill swaps', { exact: true }).isChecked(), true);
    assert.equal(await page.getByLabel('Monthly digest', { exact: true }).isChecked(), false);
  });
  await check('Invalid display name preserves all changed notification choices', async () => {
    await page.getByLabel('Display name').fill('   ');
    await page.getByLabel('Repair evenings', { exact: true }).uncheck();
    await page.getByLabel('Monthly digest', { exact: true }).check();
    await page.getByRole('button', { name: 'Save preferences' }).click();
    assert.match(await page.getByRole('alert').innerText(), /Enter a display name/);
    assert.equal(await page.getByLabel('Repair evenings', { exact: true }).isChecked(), false);
    assert.equal(await page.getByLabel('Monthly digest', { exact: true }).isChecked(), true);
    assert.equal(await page.locator(':focus').getAttribute('id'), 'display-name');
  });
  await check('Saved preference values survive reload; cancel restores the last save', async () => {
    await page.getByLabel('Display name').fill('  Sam  ');
    await page.getByRole('button', { name: 'Save preferences' }).click();
    assert.match(await page.getByRole('status').innerText(), /Preferences saved/);
    await page.reload();
    assert.equal(await page.getByLabel('Display name').inputValue(), 'Sam');
    assert.equal(await page.getByLabel('Repair evenings', { exact: true }).isChecked(), false);
    assert.equal(await page.getByLabel('Monthly digest', { exact: true }).isChecked(), true);
    await page.getByLabel('Display name').fill('Changed');
    await page.getByLabel('Skill swaps', { exact: true }).uncheck();
    await page.getByRole('button', { name: 'Cancel' }).click();
    assert.equal(await page.getByLabel('Display name').inputValue(), 'Sam');
    assert.equal(await page.getByLabel('Skill swaps', { exact: true }).isChecked(), true);
  });
  await check('Keyboard Space changes checkbox and Enter saves; all notifications can be off', async () => {
    const checkbox = page.getByLabel('Skill swaps', { exact: true });
    await checkbox.focus();
    await page.keyboard.press('Space');
    assert.equal(await checkbox.isChecked(), false);
    await page.getByLabel('Monthly digest', { exact: true }).uncheck();
    await page.getByRole('button', { name: 'Save preferences' }).focus();
    await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('round-again:preferences'))), { displayName: 'Sam', repairEvenings: false, skillSwaps: false, monthlyDigest: false });
  });
  await check('Malformed saved data falls back safely', async () => {
    await page.evaluate(() => localStorage.setItem('round-again:preferences', '{bad json'));
    await page.reload();
    assert.equal(await page.getByLabel('Display name').inputValue(), 'Avery');
    await page.evaluate(() => localStorage.setItem('round-again:preferences', JSON.stringify({ displayName: '  ', repairEvenings: 'no', skillSwaps: false, monthlyDigest: true, extra: 42 })));
    await page.reload();
    assert.equal(await page.getByLabel('Display name').inputValue(), 'Avery');
    assert.equal(await page.getByLabel('Repair evenings', { exact: true }).isChecked(), true);
    assert.equal(await page.getByLabel('Skill swaps', { exact: true }).isChecked(), false);
  });
  for (const width of [375, 768]) {
    await page.setViewportSize({ width, height: 812 });
    for (const route of ['membership', 'preferences']) {
      await page.goto(`${base}/${route}`);
      await check(`${route} fits ${width}px viewport without horizontal overflow`, async () => {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
        await page.screenshot({ path: `output/playwright/${route}-${width}.png`, fullPage: true });
      });
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await check('Mobile membership and preference save flows complete', async () => {
    await page.goto(`${base}/membership`);
    await page.getByRole('button', { name: 'Become a member' }).click();
    await page.getByLabel('Your name').fill('Mobile Member');
    await page.getByLabel('Email address').fill('mobile@example.com');
    await page.getByRole('button', { name: 'Join the demo member list' }).click();
    assert.match(await page.getByRole('status').innerText(), /Mobile Member/);
    await page.getByRole('link', { name: 'Choose your notification preferences' }).click();
    await page.getByLabel('Display name').fill('Mobile Member');
    await page.getByLabel('Monthly digest', { exact: true }).check();
    await page.getByRole('button', { name: 'Save preferences' }).click();
    assert.match(await page.getByRole('status').innerText(), /Preferences saved/);
  });
  const blocked = await browser.newContext({ viewport: { width: 375, height: 812 } });
  await blocked.addInitScript(() => { Storage.prototype.setItem = function () { throw new DOMException('Storage blocked', 'QuotaExceededError'); }; });
  const blockedPage = await blocked.newPage();
  await check('Blocked storage surfaces errors and retains membership and preferences inputs', async () => {
    await blockedPage.goto(`${base}/membership`);
    await blockedPage.getByLabel('Your name').fill('Keep This Name');
    await blockedPage.getByLabel('Email address').fill('keep@example.com');
    await blockedPage.getByRole('button', { name: 'Join the demo member list' }).click();
    assert.match(await blockedPage.getByRole('alert').innerText(), /couldn’t save/);
    assert.equal(await blockedPage.getByLabel('Your name').inputValue(), 'Keep This Name');
    await blockedPage.goto(`${base}/preferences`);
    await blockedPage.getByLabel('Display name').fill('Keep This Name');
    await blockedPage.getByLabel('Repair evenings', { exact: true }).uncheck();
    await blockedPage.getByRole('button', { name: 'Save preferences' }).click();
    assert.match(await blockedPage.getByRole('alert').innerText(), /couldn’t be saved/);
    assert.equal(await blockedPage.getByLabel('Display name').inputValue(), 'Keep This Name');
    assert.equal(await blockedPage.getByLabel('Repair evenings', { exact: true }).isChecked(), false);
    await blockedPage.screenshot({ path: 'output/playwright/preferences-storage-error.png', fullPage: true });
  });
  await blocked.close();
  assert.deepEqual(consoleErrors, []);
  await fs.writeFile('output/playwright/check-results.json', JSON.stringify({ passed: results, consoleErrors }, null, 2));
  console.log(`${results.length} checks passed; no uncaught browser errors.`);
} finally { await browser.close(); }

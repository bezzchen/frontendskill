import {chromium} from '/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';

const browser = await chromium.launch({executablePath: '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const page = await browser.newPage({viewport: {width: 1440, height: 1100}});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:5173');
  const morning = page.getByRole('radio', {name: 'Morning planting', exact: true});
  const afternoon = page.getByRole('radio', {name: 'Path and bed care', exact: true});
  const compost = page.getByRole('radio', {name: 'Compost crew', exact: true});
  const contact = page.getByLabel('Contact name (required)');
  const submit = page.getByRole('button', {name: 'Confirm my shift'});
  assert.equal(await page.getByRole('radio').count(), 3);
  assert.equal(await compost.isDisabled(), true);
  for (const text of ['4 available / 12 places', '6 available / 10 places', '0 available / 8 places']) {
    assert.equal(await page.getByText(text, {exact: true}).count(), 1);
  }
  await page.screenshot({path: 'output/playwright/desktop.png', fullPage: true});
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('link', {name: 'Skip to sign-up'}).evaluate(el => el === document.activeElement), true);
  await submit.click();
  assert.equal(await page.getByRole('alert').count(), 2);
  assert.equal(await morning.evaluate(el => el === document.activeElement), true);
  await morning.check();
  await contact.fill('   ');
  await submit.click();
  assert.equal(await contact.getAttribute('aria-invalid'), 'true');
  assert.equal(await contact.evaluate(el => el === document.activeElement), true);
  await page.screenshot({path: 'output/playwright/validation.png', fullPage: true});
  await contact.fill('  Alex Rivera  ');
  await submit.click();
  const heading = page.getByRole('heading', {name: 'Your shift is confirmed.'});
  await heading.waitFor();
  assert.equal(await heading.evaluate(el => el === document.activeElement), true);
  for (const text of ['Alex Rivera', 'Morning planting', 'Saturday 24 October', '09:00–11:00']) {
    assert.equal(await page.locator('dd').getByText(text, {exact: true}).count(), 1);
  }
  await page.screenshot({path: 'output/playwright/confirmation.png', fullPage: true});
  await page.getByRole('button', {name: 'Begin another sign-up'}).click();
  assert.equal(await contact.inputValue(), '');
  assert.equal(await page.locator('input:checked').count(), 0);
  assert.equal(await morning.evaluate(el => el === document.activeElement), true);
  await contact.fill('李');
  await submit.click();
  assert.equal(await page.getByRole('alert').count(), 1);
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  assert.equal(await afternoon.isChecked(), true);
  await page.keyboard.press('ArrowDown');
  assert.equal(await morning.isChecked(), true);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  assert.equal(await contact.evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  await heading.waitFor();
  assert.equal(await page.locator('dd').getByText('Path and bed care', {exact: true}).count(), 1);
  assert.equal(await page.locator('dd').getByText('13:00–15:00', {exact: true}).count(), 1);
  assert.equal(await page.locator('dd').getByText('李', {exact: true}).count(), 1);
  await page.getByRole('button', {name: 'Begin another sign-up'}).click();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({width, height: 900});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}px`);
    if (width === 390) await page.screenshot({path: 'output/playwright/mobile.png', fullPage: true});
  }
  await page.setViewportSize({width: 320, height: 700});
  await afternoon.check();
  await contact.fill('A'.repeat(180));
  await submit.click();
  await heading.waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'long name confirmation overflow');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.getByRole('button', {name: 'Begin another sign-up'}).click();
  assert.equal(await morning.locator('..').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  assert.deepEqual(errors, []);
  console.log('PASS: capacity, full shift, required selection, whitespace name, trimmed/Unicode name, both confirmations, reset, focus, keyboard navigation, 5 viewport widths, long-name wrapping, reduced motion, no browser errors.');
} finally {
  await browser.close();
}

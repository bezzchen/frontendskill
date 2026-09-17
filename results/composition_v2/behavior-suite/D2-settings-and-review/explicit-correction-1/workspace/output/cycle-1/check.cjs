const fs = require('fs');
const assert = require('node:assert/strict');
const { chromium } = require('/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir = 'output/cycle-1';
const url = 'http://127.0.0.1:8871/';
const report = { checks: [], errors: [] };
const success = 'Settings saved. Your workspace is up to date.';
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
  const capture = async (page, name) => page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
  const open = async (width, suffix = '', touch = false) => {
    const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: touch });
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
    await page.goto(url + suffix);
    return page;
  };
  const instrument = async page => page.evaluate(() => {
    window.observedCalls = [];
    const original = window.studioService.saveSettings;
    window.studioService.saveSettings = async function(settings) {
      const call = { settings: { ...settings }, start: performance.now() };
      window.observedCalls.push(call);
      try { return await original.call(this, settings); }
      finally { call.end = performance.now(); }
    };
    window.statusTimeline = [];
    new MutationObserver(() => window.statusTimeline.push({ text: document.querySelector('#save-status').textContent, time: performance.now() })).observe(document.querySelector('#save-status'), { childList: true, subtree: true });
  });
  const waitOutcome = async (page, text = success) => page.waitForFunction(expected => document.querySelector('#save-status').textContent === expected, text);
  const geometry = async page => page.evaluate(() => {
    const h = document.querySelector('h1').getBoundingClientRect();
    const p = document.querySelector('#settings-help').getBoundingClientRect();
    const b = document.querySelector('button').getBoundingClientRect();
    return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, headingBottom: h.bottom, introTop: p.top, gap: p.top - h.bottom, buttonWidth: b.width, actionWidth: document.querySelector('.actions').getBoundingClientRect().width, hit: document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2)?.id, checkboxHeight: document.querySelector('.checkbox-label').getBoundingClientRect().height };
  });
  try {
    for (const width of [1440, 390]) {
      const page = await open(width);
      await instrument(page);
      const name = page.locator('#display-name');
      const button = page.locator('#save-settings');
      await capture(page, `${width}-default`);
      const initial = await geometry(page);
      assert(initial.gap >= 0); assert.equal(initial.documentWidth, width); assert.equal(initial.hit, 'save-settings'); assert(initial.checkboxHeight >= 44);
      await name.fill('  River Clay Studio  ');
      await page.locator('.checkbox-label').click();
      await button.click();
      assert.equal(await page.locator('#save-status').innerText(), 'Saving your settings…');
      assert.deepEqual(await page.locator('input,button').evaluateAll(nodes => nodes.map(n => n.matches(':disabled'))), [true, true, true]);
      await capture(page, `${width}-saving`);
      await page.keyboard.press('Enter');
      const box = await button.boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await waitOutcome(page);
      assert.equal(await name.inputValue(), 'River Clay Studio');
      assert.equal(await page.locator('#kiln-alerts').isChecked(), false);
      assert.deepEqual(await page.evaluate(() => window.studioService.saved), { displayName: 'River Clay Studio', kilnAlerts: false });
      assert.equal(await page.evaluate(() => window.observedCalls.length), 1);
      const timing = await page.evaluate(() => ({ calls: window.observedCalls, status: window.statusTimeline }));
      assert(timing.calls[0].end - timing.calls[0].start >= 590);
      assert(timing.status.find(s => s.text.startsWith('Settings saved')).time >= timing.calls[0].end);
      await capture(page, `${width}-success`);
      await page.waitForTimeout(800);
      assert.equal(await page.locator('#save-status').innerText(), success);
      for (const value of ['', '   ', 'X'.repeat(61)]) {
        await name.fill(value); await button.click();
        assert.equal(await name.getAttribute('aria-invalid'), 'true');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'display-name');
        assert(await page.locator('#name-error').isVisible());
        assert.equal(await page.evaluate(() => window.observedCalls.length), 1);
        assert.deepEqual(await name.evaluate(n => n.getAttribute('aria-describedby').split(' ').map(id => !!document.getElementById(id))), [true, true]);
      }
      await capture(page, `${width}-invalid`);
      for (const value of ['A'.repeat(60), '  A  ']) {
        await name.fill(value); await button.click(); await waitOutcome(page);
        assert.equal(await name.inputValue(), value.trim());
      }
      await name.fill('Changed');
      assert.equal(await page.locator('#save-status').innerText(), 'You have unsaved changes.');
      report.checks.push({ width, primary: 'pass', validation: 'empty/whitespace/61 rejected; 60 and trimmed 1 accepted', geometry: initial, timing });
      await page.goto(url + '?save=error');
      await name.fill('  Retry Studio  '); await page.locator('.checkbox-label').click(); await button.click();
      const failure = 'We couldn’t save your settings. Your changes are still here. Please try again.';
      await waitOutcome(page, failure);
      assert.equal(await name.inputValue(), '  Retry Studio  '); assert.equal(await page.locator('#kiln-alerts').isChecked(), false); assert(await button.isEnabled());
      await capture(page, `${width}-error`);
      await page.locator('.checkbox-label').click();
      assert.equal(await page.locator('#save-status').innerText(), 'You have unsaved changes.');
      await page.evaluate(() => { window.studioService.mode = 'success'; });
      await button.click(); await waitOutcome(page);
      assert.deepEqual(await page.evaluate(() => window.studioService.saved), { displayName: 'Retry Studio', kilnAlerts: true });
      await capture(page, `${width}-retry-success`);
      await page.goto(url);
      const focus = [];
      for (const id of ['display-name', 'kiln-alerts', 'save-settings']) {
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.id), id);
        const style = await page.evaluate(() => { const n = document.activeElement; const s = getComputedStyle(n); return { id: n.id, visible: n.matches(':focus-visible'), outline: s.outline, offset: s.outlineOffset }; });
        assert(style.visible); focus.push(style);
        await capture(page, `${width}-focus-${id}`);
        if (id === 'display-name') { await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('Keyboard Studio'); }
        if (id === 'kiln-alerts') { await page.keyboard.press('Space'); assert.equal(await page.locator('#kiln-alerts').isChecked(), false); }
      }
      await page.keyboard.press('Shift+Tab'); assert.equal(await page.evaluate(() => document.activeElement.id), 'kiln-alerts');
      await page.keyboard.press('Tab'); await page.keyboard.press('Space'); await waitOutcome(page);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'save-settings');
      await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('Enter Studio'); await page.keyboard.press('Enter'); await waitOutcome(page);
      report.checks.push({ width, errorRetry: 'pass; rejection retains edits, retry resolves after service mode switch', keyboard: 'Tab, reverse Tab, Space toggle/submit, Enter submit, restored focus', focus });
      await page.close();
    }
    const touch = await open(390, '', true);
    await touch.locator('#display-name').fill('  Touch Studio  '); await touch.locator('.checkbox-label').tap(); await touch.locator('#save-settings').tap(); await waitOutcome(touch);
    assert.deepEqual(await touch.evaluate(() => window.studioService.saved), { displayName: 'Touch Studio', kilnAlerts: false });
    await capture(touch, '390-touch-success'); report.checks.push({ touch390: 'pass' }); await touch.close();
    const responsive = await open(1440);
    for (const width of [320, 375, 388, 389, 390, 391, 392, 600, 601, 1440]) {
      await responsive.setViewportSize({ width, height: 900 });
      const g = await geometry(responsive);
      assert(g.gap >= 0); assert.equal(g.documentWidth, width); assert.equal(g.hit, 'save-settings');
      if (width <= 600) assert.equal(g.buttonWidth, g.actionWidth);
      await responsive.locator('#display-name').fill(`Studio ${width}`); await responsive.locator('#save-settings').click(); await waitOutcome(responsive);
      await capture(responsive, `${width}-responsive`); report.checks.push({ responsive: g, pointer: 'pass' });
    }
    await responsive.setViewportSize({ width: 390, height: 400 });
    await responsive.locator('#save-settings').scrollIntoViewIfNeeded(); await responsive.locator('#save-settings').click(); await waitOutcome(responsive);
    await capture(responsive, '390-short');
    assert(await responsive.evaluate(() => scrollY > 0));
    await responsive.emulateMedia({ reducedMotion: 'reduce' }); await responsive.setViewportSize({ width: 390, height: 900 }); await responsive.goto(url);
    await responsive.locator('#save-settings').click(); await waitOutcome(responsive); assert.equal(await responsive.evaluate(() => document.getAnimations().length), 0);
    await capture(responsive, '390-reduced-motion');
    report.checks.push({ shortViewport: 'scrolled and saved', reducedMotion: 'pointer save passed, no active Web Animations' });
    assert.deepEqual(report.errors, []);
    report.result = 'pass';
  } catch (error) { report.result = 'incomplete'; report.failure = error.stack; process.exitCode = 1; }
  finally { fs.writeFileSync(`${dir}/checks.json`, JSON.stringify(report, null, 2)); await browser.close(); console.log(JSON.stringify(report, null, 2)); }
})().catch(e => { console.error(e); process.exitCode = 1; });

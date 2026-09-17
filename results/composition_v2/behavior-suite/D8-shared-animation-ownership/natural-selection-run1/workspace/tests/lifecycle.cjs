const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    headless: true
  });
  const page = await browser.newPage({viewport: {width: 1000, height: 1100}, reducedMotion: 'no-preference'});
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const pending = new Set();
    window.frameAudit = {maximum: 0, pending: () => pending.size};
    window.requestAnimationFrame = callback => {
      const id = request(time => { pending.delete(id); callback(time); });
      pending.add(id);
      window.frameAudit.maximum = Math.max(window.frameAudit.maximum, pending.size);
      return id;
    };
    window.cancelAnimationFrame = id => { pending.delete(id); cancel(id); };
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const snapshot = () => page.evaluate(() => window.instrumentDiagnostics.snapshot());
  const names = data => data.subscribers.map(id => id.split(':')[0]).sort();
  const settle = () => page.waitForTimeout(150);
  const expectActive = async expected => {
    await settle();
    const before = await snapshot();
    assert.deepEqual(names(before), [...expected].sort());
    assert.equal(before.schedulerPending, expected.length > 0);
    const frames = await page.evaluate(() => ({maximum: window.frameAudit.maximum, pending: window.frameAudit.pending()}));
    assert.ok(frames.maximum <= 1, 'at most one shared animation frame');
    assert.equal(frames.pending, expected.length > 0 ? 1 : 0);
    await settle();
    const after = await snapshot();
    for (const name of ['metronome', 'waveform']) {
      if (expected.includes(name)) assert.ok(after.counters[name] > before.counters[name], `${name} should animate`);
      else assert.equal(after.counters[name], before.counters[name], `${name} should be idle`);
    }
    if (!expected.length) assert.equal(after.schedulerTicks, before.schedulerTicks);
    return after;
  };
  let failures = 0;
  const test = async (name, run, reducedMotion = 'no-preference') => {
    try {
      await page.emulateMedia({reducedMotion});
      await page.setViewportSize({width: 1000, height: 1100});
      await page.goto('http://127.0.0.1:8318');
      await settle();
      await run();
      console.log(`PASS ${name}`);
    } catch (error) {
      failures++;
      console.error(`FAIL ${name}: ${error.message}`);
    }
  };
  try {
    await test('independent hiding, idle scheduler, and resuming', async () => {
      await expectActive(['metronome', 'waveform']);
      const waveId = (await snapshot()).subscribers.find(id => id.startsWith('waveform:'));
      await page.click('#toggle-metronome');
      assert.equal((await expectActive(['waveform'])).subscribers[0], waveId);
      await page.click('#toggle-waveform');
      await expectActive([]);
      await page.click('#toggle-metronome');
      await expectActive(['metronome']);
      await page.click('#toggle-waveform');
      await expectActive(['metronome', 'waveform']);
    });
    await test('unmount releases callbacks and remount does not duplicate', async () => {
      for (let i = 0; i < 4; i++) {
        await page.click('#mount-metronome');
        await expectActive(['waveform']);
        await page.click('#mount-metronome');
        await expectActive(['metronome', 'waveform']);
      }
      await page.click('#mount-metronome');
      await page.click('#mount-waveform');
      assert.deepEqual((await expectActive([])).mounted, []);
      await page.emulateMedia({reducedMotion: 'reduce'});
      await page.emulateMedia({reducedMotion: 'no-preference'});
      await expectActive([]);
      await page.click('#toggle-metronome');
      await page.click('#mount-metronome');
      await expectActive([]);
      await page.click('#toggle-metronome');
      await expectActive(['metronome']);
    });
    await test('offscreen instruments pause independently', async () => {
      await page.setViewportSize({width: 1000, height: 800});
      await page.evaluate(() => window.scrollTo(0, document.getElementById('waveform').offsetTop));
      await expectActive(['waveform']);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expectActive([]);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expectActive(['metronome', 'waveform']);
    });
    await test('reduced motion retains useful static graphics and live controls', async () => {
      await expectActive([]);
      const path = await page.locator('#wave-path').getAttribute('d');
      assert.ok(path && path.length > 20);
      assert.ok(await page.locator('#pendulum').getAttribute('transform'));
      await page.getByLabel('Amplitude').fill('52');
      await page.getByLabel('Tempo').fill('120');
      assert.notEqual(await page.locator('#wave-path').getAttribute('d'), path);
      assert.equal(await page.locator('#waveform output').textContent(), '52');
      assert.equal(await page.locator('#metronome output').textContent(), '120');
      await expectActive([]);
      await page.emulateMedia({reducedMotion: 'no-preference'});
      assert.deepEqual((await expectActive(['metronome', 'waveform'])).settings, {metronome: 120, waveform: 52});
      await page.emulateMedia({reducedMotion: 'reduce'});
      await expectActive([]);
      await page.click('#mount-waveform');
      await page.click('#mount-waveform');
      assert.equal(await page.getByLabel('Amplitude').inputValue(), '52');
      await expectActive([]);
    }, 'reduce');
    await test('document visibility gates every instrument', async () => {
      // Headless tabs do not reliably become hidden: exercise the browser event
      // with a controlled visibility getter, leaving rAF running to expose leaks.
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {configurable: true, get: () => true});
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await expectActive([]);
      await page.click('#toggle-metronome');
      await page.evaluate(() => {
        delete document.hidden;
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await expectActive(['waveform']);
    });
    await test('rapid toggles and motion changes do not duplicate or revive hidden work', async () => {
      await page.evaluate(() => {
        for (let i = 0; i < 20; i++) document.getElementById('toggle-metronome').click();
      });
      await expectActive(['metronome', 'waveform']);
      await page.click('#toggle-waveform');
      await page.emulateMedia({reducedMotion: 'reduce'});
      await expectActive([]);
      await page.emulateMedia({reducedMotion: 'no-preference'});
      await expectActive(['metronome']);
      await page.getByLabel('Tempo').fill('150');
      assert.equal((await expectActive(['metronome'])).settings.metronome, 150);
      await page.click('#toggle-waveform');
      await expectActive(['metronome', 'waveform']);
    });
    assert.deepEqual(errors, [], 'browser errors');
    if (failures) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

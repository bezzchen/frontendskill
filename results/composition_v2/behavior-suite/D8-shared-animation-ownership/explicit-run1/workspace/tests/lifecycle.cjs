const assert = require('node:assert/strict');
const {mkdirSync, writeFileSync} = require('node:fs');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const names = ['metronome', 'waveform'];
const headed = process.env.HEADED === '1';
const executablePath = process.env.CHROMIUM_PATH || (headed
  ? '/Users/bezzchen/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
  : '/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell');

(async () => {
  const browser = await chromium.launch({
    executablePath,
    headless: !headed,
    ignoreDefaultArgs: headed ? ['--disable-backgrounding-occluded-windows', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] : []
  });
  const context = await browser.newContext({viewport: {width: 1000, height: 1100}});
  await context.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const pending = new Set();
    window.requestAnimationFrame = callback => {
      const id = request(time => {
        pending.delete(id);
        callback(time);
      });
      pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = id => {
      pending.delete(id);
      cancel(id);
    };
    window.pendingAnimationFrames = () => pending.size;
  });
  const page = await context.newPage();
  const errors = [];
  const results = [];
  page.on('pageerror', error => errors.push(error.message));
  const snapshot = () => page.evaluate(() => window.instrumentDiagnostics.snapshot());
  const settle = () => page.waitForTimeout(100);
  async function activity(active) {
    await settle();
    const before = await snapshot();
    await page.waitForTimeout(180);
    const after = await snapshot();
    for (const name of names) {
      const delta = after.counters[name] - before.counters[name];
      assert.ok(active.includes(name) ? delta > 0 : delta === 0, `${name}: delta ${delta}; expected ${active.includes(name) ? 'running' : 'paused'}`);
    }
    assert.equal(after.schedulerPending, active.length > 0, JSON.stringify(after));
    assert.equal(await page.evaluate(() => window.pendingAnimationFrames()), active.length ? 1 : 0, 'one shared frame when active; none when idle');
    assert.deepEqual(after.subscribers.map(id => id.split(':')[0]).sort(), [...active].sort());
    if (!active.length) assert.equal(after.schedulerTicks, before.schedulerTicks);
    return after;
  }
  async function check(name, run, reducedMotion = 'no-preference') {
    try {
      await page.setViewportSize({width: 1000, height: 1100});
      await page.emulateMedia({reducedMotion});
      await page.goto('http://127.0.0.1:8318');
      await page.bringToFront();
      const evidence = await run();
      results.push({name, status: evidence?.unverified ? 'UNVERIFIED' : 'PASS', ...(evidence ? {evidence} : {})});
    } catch (error) {
      results.push({name, status: 'FAIL', error: error.message});
    }
    console.log(JSON.stringify(results.at(-1)));
  }
  try {
    await check('Each hidden instrument pauses independently; last consumer stops scheduler', async () => {
      await activity(names);
      for (const name of names) {
        await page.locator(`#toggle-${name}`).click();
        await activity(names.filter(other => other !== name));
        await page.locator(`#toggle-${name}`).click();
        await activity(names);
      }
      for (const name of names) await page.locator(`#toggle-${name}`).click();
      await activity([]);
      await page.locator('#toggle-waveform').click();
      await activity(['waveform']);
    });
    await check('Real scroll pauses offscreen owners and resumes on return', async () => {
      await page.setViewportSize({width: 1000, height: 600});
      await page.evaluate(() => window.scrollTo(0, document.querySelector('#waveform').offsetTop - 16));
      await activity(['waveform']);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await activity([]);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.setViewportSize({width: 1000, height: 1100});
      await activity(names);
    });
    await check('Unmount releases callbacks; repeated and hidden remounts preserve settings', async () => {
      await page.getByRole('slider', {name: 'Tempo'}).fill('120');
      await page.getByRole('slider', {name: 'Amplitude'}).fill('50');
      for (let cycle = 0; cycle < 3; cycle++) {
        for (const name of names) {
          await page.locator(`#mount-${name}`).click();
          await activity(names.filter(other => other !== name));
          await page.locator(`#mount-${name}`).click();
          await activity(names);
        }
      }
      await page.locator('#toggle-metronome').click();
      await page.locator('#mount-metronome').click();
      await page.locator('#mount-metronome').click();
      await activity(['waveform']);
      await page.locator('#toggle-metronome').click();
      await activity(names);
      assert.equal(await page.getByRole('slider', {name: 'Tempo'}).inputValue(), '120');
      assert.equal(await page.getByRole('slider', {name: 'Amplitude'}).inputValue(), '50');
      for (const name of names) await page.locator(`#mount-${name}`).click();
      assert.deepEqual((await activity([])).mounted, []);
    });
    await check('Reduced motion renders static instruments and keeps controls usable', async () => {
      await activity([]);
      const path = page.locator('#wave-path');
      const original = await path.getAttribute('d');
      assert.ok(original && original.startsWith('M'), 'waveform must be drawn without a frame callback');
      await page.getByRole('slider', {name: 'Amplitude'}).fill('55');
      assert.notEqual(await path.getAttribute('d'), original);
      await page.getByRole('slider', {name: 'Tempo'}).fill('100');
      assert.equal(await page.locator('#metronome output').textContent(), '100');
      await activity([]);
      await page.emulateMedia({reducedMotion: 'no-preference'});
      await activity(names);
      await page.emulateMedia({reducedMotion: 'reduce'});
      await activity([]);
      for (const name of names) {
        await page.locator(`#mount-${name}`).click();
        await page.locator(`#mount-${name}`).click();
      }
      await activity([]);
      assert.ok(await path.getAttribute('d'));
    }, 'reduce');
    await check('Synthetic visibility event exercises cancellation and eligible-only resume', async () => {
      await page.locator('#toggle-metronome').click();
      await activity(['waveform']);
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {configurable: true, value: true});
        Object.defineProperty(document, 'visibilityState', {configurable: true, value: 'hidden'});
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await activity([]);
      await page.evaluate(() => {
        delete document.hidden;
        delete document.visibilityState;
        document.dispatchEvent(new Event('visibilitychange'));
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await activity(['waveform']);
    });
    if (headed) {
      await check('Actual backgrounding cancels shared work and resumes only eligible owners', async () => {
        await page.locator('#toggle-metronome').click();
        await activity(['waveform']);
        const other = await context.newPage();
        const session = await context.newCDPSession(page);
        const {windowId} = await session.send('Browser.getWindowForTarget');
        let minimized = false;
        try {
          await other.goto('about:blank');
          await other.bringToFront();
          await settle();
          if (!(await snapshot()).documentHidden) {
            // Some automation hosts open pages in separate visible windows.
            // Minimize the actual instrument window to exercise real backgrounding.
            await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});
            minimized = true;
          }
          // rAF polling itself pauses in a hidden tab, so poll visibility with timers.
          const becameHidden = await page.waitForFunction(() => document.hidden, null, {polling: 100, timeout: 3000})
            .then(() => true, () => false);
          if (!becameHidden) return {
            unverified: 'Actual tab switching and window minimization did not produce document.hidden on this host.',
            state: await snapshot()
          };
          const state = await activity([]);
          assert.equal(state.visibilityState, 'hidden');
          console.log('Observed actual background state:', JSON.stringify({method: minimized ? 'window minimized' : 'tab switch', ...state}));
          if (minimized) await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'normal'}});
          await page.bringToFront();
          await page.waitForFunction(() => !document.hidden);
          await activity(['waveform']);
        } finally {
          if (minimized) await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'normal'}});
          await session.detach();
          await other.close();
        }
      });
    }
    await check('Narrow layout retains instruments and controls', async () => {
      await page.setViewportSize({width: 390, height: 844});
      await page.locator('#waveform').scrollIntoViewIfNeeded();
      await page.getByRole('slider', {name: 'Amplitude'}).fill('42');
      assert.equal(await page.locator('#waveform output').textContent(), '42');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      mkdirSync('output/playwright', {recursive: true});
      await page.screenshot({path: 'output/playwright/mobile.png', fullPage: true});
      await page.setViewportSize({width: 1000, height: 1100});
      await page.evaluate(() => window.scrollTo(0, 0));
      await settle();
      await page.screenshot({path: 'output/playwright/desktop.png'});
    });
    assert.deepEqual(errors, []);
  } finally {
    mkdirSync('output/playwright', {recursive: true});
    writeFileSync(`output/playwright/${headed ? 'headed' : 'headless'}-results.json`, JSON.stringify({results, errors}, null, 2));
    await browser.close();
  }
  if (results.some(result => result.status === 'FAIL')) process.exitCode = 1;
})().catch(error => {console.error(error); process.exitCode = 1;});

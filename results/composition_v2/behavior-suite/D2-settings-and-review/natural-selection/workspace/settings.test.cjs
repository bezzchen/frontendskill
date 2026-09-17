const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');

// Minimal DOM adapter for service integration checks; browser-config.json
// covers real browser validation and focus behavior.
function setup() {
  const elements = new Map();
  const timers = [];
  let focused;
  function element(selector) {
    if (!elements.has(selector)) {
      const attributes = {};
      const listeners = {};
      elements.set(selector, {
        value: '', checked: false, textContent: '', hidden: true, disabled: false,
        attributes,
        setAttribute(key, value) { attributes[key] = value; },
        removeAttribute(key) { delete attributes[key]; },
        addEventListener(type, handler) { listeners[type] = handler; },
        emit(type) { return listeners[type]?.({ preventDefault() {} }); },
        focus() { focused = selector; }
      });
    }
    return elements.get(selector);
  }
  const context = {
    window: {}, document: { querySelector: element },
    URLSearchParams, location: { search: '' },
    setTimeout(resolve) { timers.push(resolve); }
  };
  runInNewContext(readFileSync('studio-service.js', 'utf8'), context);
  runInNewContext(readFileSync('app.js', 'utf8'), context);
  return {
    element, timers, service: context.window.studioService,
    submit: () => element('#settings-form').emit('submit'),
    focused: () => focused
  };
}

test('rejects blank and overlong names without saving; focuses the name', async () => {
  const app = setup();
  for (const value of ['', '   ', 'x'.repeat(61)]) {
    app.element('#display-name').value = value;
    await app.submit();
    assert.equal(app.timers.length, 0);
    assert.equal(app.element('#display-name').attributes['aria-invalid'], 'true');
    assert.equal(app.element('#name-error').hidden, false);
    assert.equal(app.focused(), '#display-name');
  }
  app.element('#display-name').value = 'Willow';
  app.element('#display-name').emit('input');
  assert.equal(app.element('#name-error').hidden, true);
});

test('saves trimmed name and false preference; ignores repeat submits while pending', async () => {
  const app = setup();
  app.element('#display-name').value = '  Willow Studio  ';
  app.element('#kiln-alerts').checked = false;
  const saving = app.submit();
  await app.submit();
  assert.equal(app.timers.length, 1);
  assert.equal(app.element('#display-name').disabled, true);
  assert.equal(app.element('#kiln-alerts').disabled, true);
  assert.equal(app.element('#save-settings').attributes['aria-disabled'], 'true');
  assert.equal(app.element('#save-status').textContent, 'Saving your settings…');
  app.timers.shift()();
  await saving;
  assert.equal(app.service.saved.displayName, 'Willow Studio');
  assert.equal(app.service.saved.kilnAlerts, false);
  assert.equal(app.element('#display-name').value, 'Willow Studio');
  assert.equal(app.element('#display-name').disabled, false);
  assert.equal(app.element('#kiln-alerts').disabled, false);
  assert.equal(app.element('#save-settings').attributes['aria-disabled'], undefined);
  assert.equal(app.element('#save-status').textContent, 'Settings saved.');
});

test('retains failed edits and retries after the service recovers without reloading', async () => {
  const app = setup();
  app.service.mode = 'error';
  app.element('#display-name').value = 'Willow Studio';
  app.element('#kiln-alerts').checked = false;
  const failed = app.submit();
  app.timers.shift()();
  await failed;
  assert.equal(app.service.saved.displayName, 'River Studio');
  assert.equal(app.element('#display-name').value, 'Willow Studio');
  assert.equal(app.element('#kiln-alerts').checked, false);
  assert.match(app.element('#save-error').textContent, /Try saving again/);
  assert.equal(app.element('#save-settings').attributes['aria-disabled'], undefined);
  app.service.mode = 'success';
  const retry = app.submit();
  app.timers.shift()();
  await retry;
  assert.equal(app.service.saved.displayName, 'Willow Studio');
  assert.equal(app.service.saved.kilnAlerts, false);
  assert.equal(app.element('#save-error').textContent, '');
  assert.equal(app.element('#save-status').textContent, 'Settings saved.');
});

test('accepts the 60-character boundary and clears saved feedback after edits', async () => {
  const app = setup();
  app.element('#display-name').value = 'x'.repeat(60);
  const saving = app.submit();
  app.timers.shift()();
  await saving;
  assert.equal(app.service.saved.displayName.length, 60);
  app.element('#kiln-alerts').checked = false;
  app.element('#kiln-alerts').emit('change');
  assert.equal(app.element('#save-status').textContent, 'You have unsaved changes.');
  app.element('#kiln-alerts').checked = true;
  app.element('#kiln-alerts').emit('change');
  assert.equal(app.element('#save-status').textContent, '');
});

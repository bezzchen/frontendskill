'use strict';

// Dependency-free integration checks with a minimal DOM double and the real service.
// These complement, and do not replace, rendered browser checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const document = { body: {}, activeElement: null };
const nodes = new Map();
for (const id of ['settings-form', 'settings-fields', 'display-name', 'kiln-alerts', 'name-error', 'save-settings', 'save-status']) {
  const attributes = new Map();
  const classes = new Set();
  nodes.set(id, {
    value: '', checked: false, disabled: false, hidden: false, textContent: '', handlers: {},
    classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } },
    addEventListener(name, callback) { this.handlers[name] = callback; },
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name); },
    removeAttribute(name) { attributes.delete(name); },
    focus() { document.activeElement = this; },
    contains(node) { return [...nodes.values()].includes(node); },
  });
}
document.querySelector = (selector) => nodes.get(selector.slice(1));
const context = vm.createContext({ document, window: {}, location: { search: '' }, URLSearchParams, setTimeout });
vm.runInContext(fs.readFileSync('studio-service.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
const service = context.window.studioService;
const form = nodes.get('settings-form');
const name = nodes.get('display-name');
const alerts = nodes.get('kiln-alerts');
const fields = nodes.get('settings-fields');
const button = nodes.get('save-settings');
const status = nodes.get('save-status');
const submit = () => form.handlers.submit({ preventDefault() {} });
const input = () => form.handlers.input();
let calls = 0;
const save = service.saveSettings.bind(service);
service.saveSettings = (settings) => { calls++; return save(settings); };

(async () => {
  for (const invalid of ['', '   ', 'a'.repeat(61)]) {
    name.value = invalid;
    await submit();
    assert.equal(calls, 0, 'invalid names must not reach the service');
    assert.equal(document.activeElement, name);
    assert.equal(name.getAttribute('aria-invalid'), 'true');
    assert.equal(nodes.get('name-error').hidden, false);
  }
  name.value = '  River & Clay  ';
  alerts.checked = false;
  input();
  assert.equal(nodes.get('name-error').hidden, true);
  button.focus();
  const pending = submit();
  assert.equal(fields.disabled, true);
  assert.equal(button.textContent, 'Saving…');
  assert.match(status.textContent, /Saving/);
  await submit();
  assert.equal(calls, 1, 'duplicate submission blocked while pending');
  await pending;
  assert.equal(service.saved.displayName, 'River & Clay');
  assert.equal(service.saved.kilnAlerts, false);
  assert.equal(name.value, 'River & Clay');
  assert.equal(fields.disabled, false);
  assert.equal(document.activeElement, button);
  assert.match(status.textContent, /Settings saved/);

  service.mode = 'error';
  name.value = '  Kiln Room  ';
  alerts.checked = true;
  input();
  assert.match(status.textContent, /unsaved/);
  await submit();
  assert.match(status.textContent, /couldn’t save/);
  assert.equal(name.value, '  Kiln Room  ', 'failure preserves the typed value');
  assert.equal(alerts.checked, true);
  assert.equal(service.saved.displayName, 'River & Clay');
  assert.equal(fields.disabled, false);
  assert.equal(button.textContent, 'Save settings');

  service.mode = 'success';
  await submit();
  assert.equal(service.saved.displayName, 'Kiln Room');
  assert.equal(service.saved.kilnAlerts, true);
  assert.match(status.textContent, /Settings saved/);

  name.value = 'x'.repeat(60);
  input();
  const lastSave = submit();
  document.activeElement = document.body;
  // A user focusing outside the form must not have focus pulled back.
  const elsewhere = {};
  document.activeElement = elsewhere;
  await lastSave;
  assert.equal(service.saved.displayName.length, 60);
  assert.equal(document.activeElement, elsewhere);
  console.log('PASS: blank/whitespace/overlong validation, error recovery, trimming, checkbox persistence, pending state, duplicate blocking, failure preservation, same-page retry, 60-character boundary and focus handling.');
})().catch((error) => { console.error(error); process.exitCode = 1; });

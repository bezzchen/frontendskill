const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');

// A small DOM double tests application events; it does not emulate browser layout,
// native date controls, keyboard navigation, or screen-reader announcements.
async function setup(loadFails = false) {
  const elements = new Map();
  let focused;
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: '', textContent: '', hidden: true, disabled: false,
      attributes: {}, listeners: {}, children: [],
      addEventListener(event, handler) { this.listeners[event] = handler; },
      setAttribute(key, value) { this.attributes[key] = value; },
      removeAttribute(key) { delete this.attributes[key]; },
      append(child) { this.children.push(child); },
      replaceChildren(...children) { this.children = children; },
      focus() { focused = id; },
    });
    return elements.get(id);
  }
  vm.runInNewContext(fs.readFileSync('app.js', 'utf8'), {
    document: { getElementById: element, createElement: () => element(Symbol()) },
    fetch: async () => {
      if (loadFails) throw new Error('Offline');
      return { ok: true, json: async () => JSON.parse(fs.readFileSync('equipment.json', 'utf8')) };
    },
    Date, Intl,
  });
  await new Promise(resolve => setImmediate(resolve));
  return {
    element, focus: () => focused,
    submit() { element('checkout-form').listeners.submit?.({ preventDefault() {} }); },
    change(id, value) { element(id).value = value; element(id).listeners.change?.(); },
  };
}

test('inventory uses all stable local IDs and names', async () => {
  const app = await setup();
  const options = app.element('equipment').children.slice(1);
  assert.deepEqual(options.map(option => ({ id: option.value, name: option.textContent })),
    JSON.parse(fs.readFileSync('equipment.json', 'utf8')));
});

test('empty submission marks both required fields and focuses equipment', async () => {
  const app = await setup();
  app.submit();
  assert.equal(app.element('equipment').attributes['aria-invalid'], 'true');
  assert.equal(app.element('return-date').attributes['aria-invalid'], 'true');
  assert.equal(app.focus(), 'equipment');
  assert.equal(app.element('confirmation').hidden, true);
});

test('missing return date focuses the date field', async () => {
  const app = await setup();
  app.change('equipment', 'drill');
  app.submit();
  assert.equal(app.focus(), 'return-date');
  assert.match(app.element('return-date-error').textContent, /return date/i);
});

test('past and impossible dates cannot be confirmed', async () => {
  for (const date of ['2000-01-01', '2099-02-30', 'invalid']) {
    const app = await setup();
    app.change('equipment', 'drill');
    app.change('return-date', date);
    app.submit();
    assert.equal(app.element('return-date').attributes['aria-invalid'], 'true');
    assert.equal(app.element('confirmation').hidden, true);
  }
});

test('unknown equipment cannot be confirmed', async () => {
  const app = await setup();
  app.change('equipment', 'unknown');
  app.change('return-date', '2099-10-05');
  app.submit();
  assert.equal(app.focus(), 'equipment');
  assert.equal(app.element('confirmation').hidden, true);
});

test('valid checkout shows a readable summary and moves focus to it', async () => {
  const app = await setup();
  app.change('equipment', 'drill');
  app.change('return-date', '2099-10-05');
  app.submit();
  assert.equal(app.element('confirmation').hidden, false);
  assert.equal(app.element('summary-equipment').textContent, 'Cordless drill');
  assert.match(app.element('summary-return-date').textContent, /October 5, 2099/);
  assert.equal(app.focus(), 'confirmation-heading');
  app.change('equipment', 'clamps');
  assert.equal(app.element('confirmation').hidden, true);
  app.submit();
  assert.equal(app.element('summary-equipment').textContent, 'Clamp set');
});

test('today is accepted and correcting a field clears its error', async () => {
  const app = await setup();
  app.submit();
  app.change('equipment', 'sander');
  app.change('return-date', app.element('return-date').min);
  app.submit();
  assert.equal(app.element('equipment').attributes['aria-invalid'], undefined);
  assert.equal(app.element('return-date').attributes['aria-invalid'], undefined);
  assert.equal(app.element('confirmation').hidden, false);
});

test('inventory failures show recovery and block confirmation', async () => {
  const app = await setup(true);
  assert.equal(app.element('confirm-checkout').disabled, true);
  assert.equal(app.element('retry-inventory').hidden, false);
  assert.match(app.element('checkout-status').textContent, /could not load/i);
  app.submit();
  assert.equal(app.element('confirmation').hidden, true);
});

'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const inventory = JSON.parse(fs.readFileSync('equipment.json', 'utf8'));

// These isolated handler tests do not emulate a browser. Native date validity is
// supplied explicitly; rendering, tab order and accessibility need a real browser.
function setup() {
  const elements = new Map();
  let focused;
  for (const [, id] of html.matchAll(/id="([^"]+)"/g)) {
    const attributes = new Map();
    elements.set(id, {
      id, value: '', textContent: '', hidden: id === 'confirmation',
      selectedOptions: [], validity: { badInput: false, valid: true },
      get valueAsDate() {
        if (!this.value) return null;
        const [year, month, day] = this.value.split('-').map(Number);
        const date = new Date(0);
        date.setUTCFullYear(year, month - 1, day);
        return date;
      },
      handlers: {},
      addEventListener(type, handler) { this.handlers[type] = handler; },
      setAttribute(name, value) { attributes.set(name, value); },
      removeAttribute(name) { attributes.delete(name); },
      hasAttribute(name) { return attributes.has(name); },
      getAttribute(name) { return attributes.get(name); },
      focus() { focused = id; }
    });
  }
  const get = id => elements.get(id);
  vm.runInNewContext(source, {
    document: { querySelector: selector => get(selector.slice(1)) },
    Date, Intl
  });
  return {
    get,
    focus: () => focused,
    choose(item) {
      get('equipment').value = item.id;
      get('equipment').selectedOptions = [{ textContent: item.name }];
    },
    submit() {
      let prevented = false;
      get('checkout-form').handlers.submit({ preventDefault() { prevented = true; } });
      assert.equal(prevented, true);
    }
  };
}

test('select contains the complete inventory with its stable IDs', () => {
  const options = [...html.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)]
    .map(([, id, name]) => ({ id, name }));
  assert.deepEqual(options, inventory);
});

test('all error and hint descriptions point to existing unique IDs', () => {
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, references] of html.matchAll(/aria-(?:describedby|labelledby)="([^"]+)"/g)) {
    for (const id of references.split(' ')) assert.ok(ids.includes(id), id);
  }
});

test('empty submission reports both errors and focuses equipment', () => {
  const page = setup();
  page.submit();
  assert.equal(page.focus(), 'equipment');
  for (const id of ['equipment', 'return-date']) {
    assert.equal(page.get(id).getAttribute('aria-invalid'), 'true');
    assert.equal(page.get(`${id}-error`).hidden, false);
  }
  assert.equal(page.get('confirmation').hidden, true);
});

test('missing, incomplete and invalid date states focus the return date', () => {
  for (const [value, validity] of [
    ['', { badInput: false, valid: false }],
    ['', { badInput: true, valid: false }],
    ['2000-01-01', { badInput: false, valid: false }]
  ]) {
    const page = setup();
    page.choose(inventory[0]);
    Object.assign(page.get('return-date'), { value, validity });
    page.submit();
    assert.equal(page.focus(), 'return-date');
    assert.equal(page.get('confirmation').hidden, true);
  }
});

test('each inventory item confirms with its selected date and summary focus', () => {
  for (const item of inventory) {
    const page = setup();
    page.choose(item);
    page.get('return-date').value = '2030-06-15';
    page.submit();
    assert.equal(page.get('summary-equipment').textContent, item.name);
    assert.equal(page.get('summary-date').getAttribute('datetime'), '2030-06-15');
    assert.equal(page.get('summary-date').textContent, new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    }).format(new Date('2030-06-15T00:00:00Z')));
    assert.equal(page.get('checkout-form').hidden, true);
    assert.equal(page.get('confirmation').hidden, false);
    assert.equal(page.focus(), 'confirmation-heading');
  }
});

test('editing retains values and reconfirmation updates the summary', () => {
  const page = setup();
  page.choose(inventory[0]);
  page.get('return-date').value = '2030-06-15';
  page.submit();
  page.get('edit-checkout').handlers.click();
  assert.equal(page.focus(), 'equipment');
  assert.equal(page.get('checkout-form').hidden, false);
  assert.equal(page.get('confirmation').hidden, true);
  assert.equal(page.get('equipment').value, inventory[0].id);
  assert.equal(page.get('return-date').value, '2030-06-15');
  page.choose(inventory[1]);
  page.get('return-date').value = '2030-06-20';
  page.submit();
  assert.equal(page.get('summary-equipment').textContent, inventory[1].name);
  assert.equal(page.get('summary-date').getAttribute('datetime'), '2030-06-20');
});

test('a valid extended-year date can be summarized without a parser exception', () => {
  const page = setup();
  page.choose(inventory[0]);
  page.get('return-date').value = '10000-01-01';
  page.submit();
  assert.equal(page.get('summary-date').getAttribute('datetime'), '10000-01-01');
  assert.equal(page.get('confirmation').hidden, false);
});

test('correcting an invalid field clears its error', () => {
  const page = setup();
  page.submit();
  page.choose(inventory[0]);
  page.get('equipment').handlers.input();
  assert.equal(page.get('equipment').hasAttribute('aria-invalid'), false);
  assert.equal(page.get('equipment-error').hidden, true);
});

test('minimum date uses the local calendar and is refreshed on submission', () => {
  const page = setup();
  const now = new Date();
  const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  assert.equal(page.get('return-date').min, expected);
  page.get('return-date').min = '2000-01-01';
  page.submit();
  assert.equal(page.get('return-date').min, expected);
});

'use strict';

const form = document.getElementById('checkout-form');
const equipment = document.getElementById('equipment');
const returnDate = document.getElementById('return-date');
const confirmButton = document.getElementById('confirm-checkout');
const retryButton = document.getElementById('retry-inventory');
const status = document.getElementById('checkout-status');
const confirmation = document.getElementById('confirmation');
let inventory = [];
let ready = false;
let submitted = false;

function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function setError(field, errorId, message) {
  const error = document.getElementById(errorId);
  error.textContent = message;
  error.hidden = !message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

function validateEquipment() {
  const item = inventory.find(item => item.id === equipment.value);
  setError(equipment, 'equipment-error', item ? '' : 'Choose equipment from the list.');
  return item;
}

function validateReturnDate() {
  const value = returnDate.value;
  const date = new Date(`${value}T12:00:00`);
  returnDate.min = localToday();
  let message = '';
  if (!value) message = 'Choose a return date.';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(value.slice(0, 4)) ||
    date.getMonth() + 1 !== Number(value.slice(5, 7)) ||
    date.getDate() !== Number(value.slice(8, 10))) {
    message = 'Enter a valid return date.';
  } else if (value < returnDate.min) message = 'Choose today or a later return date.';
  setError(returnDate, 'return-date-error', message);
  return message ? null : date;
}

async function loadInventory() {
  ready = false;
  equipment.disabled = true;
  confirmButton.disabled = true;
  retryButton.hidden = true;
  status.textContent = 'Loading equipment…';
  try {
    const response = await fetch('equipment.json');
    if (!response.ok) throw new Error('Inventory request failed');
    const items = await response.json();
    if (!Array.isArray(items) || !items.length || items.some(item =>
      !item || typeof item.id !== 'string' || !item.id ||
      typeof item.name !== 'string' || !item.name) ||
      new Set(items.map(item => item.id)).size !== items.length) {
      throw new Error('Invalid inventory');
    }
    inventory = items;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose equipment';
    equipment.replaceChildren(placeholder);
    inventory.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      equipment.append(option);
    });
    equipment.disabled = false;
    confirmButton.disabled = false;
    ready = true;
    status.textContent = 'Equipment list ready.';
  } catch {
    status.textContent = 'We could not load the equipment list. Retry to continue.';
    retryButton.hidden = false;
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!ready) return;
  submitted = true;
  confirmation.hidden = true;
  const item = validateEquipment();
  const date = validateReturnDate();
  if (!item || !date) {
    status.textContent = 'Checkout is not confirmed. Check the highlighted fields.';
    (!item ? equipment : returnDate).focus();
    return;
  }
  document.getElementById('summary-equipment').textContent = item.name;
  document.getElementById('summary-return-date').textContent = new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(date);
  status.textContent = '';
  confirmation.hidden = false;
  document.getElementById('confirmation-heading').focus();
});

function onEdit(validate) {
  confirmation.hidden = true;
  if (ready) status.textContent = '';
  if (submitted) validate();
}

equipment.addEventListener('change', () => onEdit(validateEquipment));
returnDate.addEventListener('input', () => onEdit(validateReturnDate));
returnDate.addEventListener('change', () => onEdit(validateReturnDate));
retryButton.addEventListener('click', async () => {
  await loadInventory();
  (ready ? equipment : retryButton).focus();
});
returnDate.addEventListener('focus', () => { returnDate.min = localToday(); });
returnDate.min = localToday();
loadInventory();

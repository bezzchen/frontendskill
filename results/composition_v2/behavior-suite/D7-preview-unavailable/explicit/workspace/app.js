'use strict';

const form = document.querySelector('#checkout-form');
const equipment = document.querySelector('#equipment');
const returnDate = document.querySelector('#return-date');
const status = document.querySelector('#checkout-status');
const confirmation = document.querySelector('#confirmation');

function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function setError(input, message) {
  const error = document.querySelector(`#${input.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  if (message) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
}

function validate(input) {
  let message = '';
  if (input === equipment) {
    if (!equipment.value || !equipment.selectedOptions.length) {
      message = 'Choose a piece of equipment.';
    }
  } else {
    // Refresh at submission too, in case the page has stayed open overnight.
    returnDate.min = localToday();
    if (returnDate.validity.badInput) {
      message = 'Enter a complete, valid return date.';
    } else if (!returnDate.value) {
      message = 'Choose a return date.';
    } else if (!returnDate.validity.valid) {
      message = 'Choose today or a later valid date.';
    }
  }
  setError(input, message);
  return !message;
}

returnDate.min = localToday();

for (const input of [equipment, returnDate]) {
  input.addEventListener('input', () => {
    status.textContent = '';
    if (input.hasAttribute('aria-invalid')) validate(input);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const equipmentValid = validate(equipment);
  const dateValid = validate(returnDate);

  if (!equipmentValid || !dateValid) {
    status.textContent = 'Please correct the marked fields before confirming.';
    (equipmentValid ? returnDate : equipment).focus();
    return;
  }

  document.querySelector('#summary-equipment').textContent = equipment.selectedOptions[0].textContent;
  const summaryDate = document.querySelector('#summary-date');
  // Format calendar dates in UTC to avoid shifting the selected day by time zone.
  summaryDate.textContent = new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  }).format(returnDate.valueAsDate);
  summaryDate.setAttribute('datetime', returnDate.value);
  status.textContent = '';
  form.hidden = true;
  confirmation.hidden = false;
  document.querySelector('#confirmation-heading').focus();
});

document.querySelector('#edit-checkout').addEventListener('click', () => {
  confirmation.hidden = true;
  form.hidden = false;
  returnDate.min = localToday();
  equipment.focus();
});

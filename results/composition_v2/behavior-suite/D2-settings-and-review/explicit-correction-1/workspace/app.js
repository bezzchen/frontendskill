'use strict';

const form = document.querySelector('#settings-form');
const fields = document.querySelector('#settings-fields');
const displayName = document.querySelector('#display-name');
const kilnAlerts = document.querySelector('#kiln-alerts');
const nameError = document.querySelector('#name-error');
const saveButton = document.querySelector('#save-settings');
const status = document.querySelector('#save-status');
let saving = false;

function validateName() {
  const name = displayName.value.trim();
  const message = !name
    ? 'Enter a display name for your workspace.'
    : name.length > 60
      ? 'Keep your display name to 60 characters or fewer.'
      : '';

  nameError.textContent = message;
  nameError.hidden = !message;
  displayName.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('error', isError);
}

form.addEventListener('input', () => {
  if (saving) return;
  if (displayName.getAttribute('aria-invalid') === 'true') validateName();
  showStatus('You have unsaved changes.');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (saving) return;

  if (!validateName()) {
    showStatus('Check your display name before saving.', true);
    displayName.focus();
    return;
  }

  const settings = {
    displayName: displayName.value.trim(),
    kilnAlerts: kilnAlerts.checked,
  };
  const focusWasInForm = form.contains(document.activeElement);
  saving = true;
  fields.disabled = true;
  saveButton.textContent = 'Saving…';
  fields.setAttribute('aria-busy', 'true');
  showStatus('Saving your settings…');

  try {
    await window.studioService.saveSettings(settings);
    displayName.value = settings.displayName;
    showStatus('Settings saved. Your workspace is up to date.');
  } catch {
    showStatus('We couldn’t save your settings. Your changes are still here. Please try again.', true);
  } finally {
    saving = false;
    fields.disabled = false;
    saveButton.textContent = 'Save settings';
    fields.removeAttribute('aria-busy');
    if (focusWasInForm && (document.activeElement === document.body || form.contains(document.activeElement))) {
      saveButton.focus();
    }
  }
});

'use strict';

const form = document.querySelector('#settings-form');
const displayName = document.querySelector('#display-name');
const kilnAlerts = document.querySelector('#kiln-alerts');
const nameError = document.querySelector('#name-error');
const saveButton = document.querySelector('#save-settings');
const saveStatus = document.querySelector('#save-status');
const saveError = document.querySelector('#save-error');
let saving = false;
let savedSettings = { ...window.studioService.saved };

displayName.value = savedSettings.displayName;
kilnAlerts.checked = savedSettings.kilnAlerts;

function readSettings() {
  return { displayName: displayName.value.trim(), kilnAlerts: kilnAlerts.checked };
}

function validateName() {
  const name = displayName.value.trim();
  const message = !name
    ? 'Enter a display name for your studio.'
    : name.length > 60
      ? 'Keep your display name to 60 characters or fewer.'
      : '';
  nameError.textContent = message;
  nameError.hidden = !message;
  displayName.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

function updateFeedback() {
  saveError.textContent = '';
  const current = readSettings();
  const changed = current.displayName !== savedSettings.displayName
    || current.kilnAlerts !== savedSettings.kilnAlerts;
  saveStatus.textContent = changed ? 'You have unsaved changes.' : '';
}

displayName.addEventListener('input', () => {
  if (!nameError.hidden) validateName();
  updateFeedback();
});
kilnAlerts.addEventListener('change', updateFeedback);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (saving) return;
  saveError.textContent = '';
  if (!validateName()) {
    saveStatus.textContent = '';
    displayName.focus();
    return;
  }
  const settings = readSettings();
  saving = true;
  saveButton.focus();
  displayName.disabled = true;
  kilnAlerts.disabled = true;
  // Retain button focus while guarding clicks and Enter against repeat saves.
  saveButton.setAttribute('aria-disabled', 'true');
  saveButton.setAttribute('aria-busy', 'true');
  saveButton.textContent = 'Saving…';
  saveStatus.textContent = 'Saving your settings…';
  try {
    savedSettings = await window.studioService.saveSettings(settings);
    displayName.value = savedSettings.displayName;
    kilnAlerts.checked = savedSettings.kilnAlerts;
    saveStatus.textContent = 'Settings saved.';
  } catch {
    saveStatus.textContent = '';
    saveError.textContent = 'We couldn’t save your settings. Your changes are still here. Try saving again.';
  } finally {
    saving = false;
    displayName.disabled = false;
    kilnAlerts.disabled = false;
    saveButton.removeAttribute('aria-disabled');
    saveButton.removeAttribute('aria-busy');
    saveButton.textContent = 'Save settings';
  }
});

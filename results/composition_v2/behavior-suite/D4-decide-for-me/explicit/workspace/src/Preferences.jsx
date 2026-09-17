import React, { useState } from 'react';
import { initialPreferences } from './content.js';
import { Button } from './components/Button.jsx';
import { Field } from './components/Field.jsx';
import { PREFERENCES_KEY, readPreferences } from './storage.js';
import styles from './App.module.css';

const topics = [
  ['repairEvenings', 'Repair evenings', 'Invitations and reminders for our monthly time at the workbench.'],
  ['skillSwaps', 'Skill swaps', 'Hear about opportunities to learn from other members and share what you know.'],
  ['monthlyDigest', 'Monthly digest', 'A monthly round-up of co-op news, projects and things we’ve mended.'],
];

export default function Preferences() {
  const [values, setValues] = useState(() => readPreferences(initialPreferences));
  const [saved, setSaved] = useState(values);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [success, setSuccess] = useState(false);
  const dirty = Object.keys(values).some(key => values[key] !== saved[key]);

  function change(key, value) {
    setValues(current => ({ ...current, [key]: value }));
    setSuccess(false);
    setSaveError('');
    if (key === 'displayName') setError('');
  }

  function save(event) {
    event.preventDefault();
    setSuccess(false);
    setSaveError('');
    if (!values.displayName.trim()) {
      setError('Enter a display name before saving.');
      event.currentTarget.elements.displayName.focus();
      return;
    }
    const next = { ...values, displayName: values.displayName.trim() };
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
      setValues(next);
      setSaved(next);
      setError('');
      setSuccess(true);
    } catch {
      setSaveError('Your preferences could not be saved. Allow local storage in this browser and try again. Your changes are still here.');
    }
  }

  return <section className={styles.preferences} aria-labelledby="preferences-title">
    <p className={styles.intro}>Your membership</p>
    <h1 id="preferences-title">Notification preferences</h1>
    <p className={styles.preferencesLead}>Stay in the loop, in your own way.<br />Choose the news you’d like from Round Again.</p>
    <form onSubmit={save} noValidate>
      <div className={styles.profileSection}>
        <Field label="Display name" id="display-name" name="displayName" autoComplete="nickname" required value={values.displayName} onChange={event => change('displayName', event.target.value)} error={error} />
        <p className={styles.help}>The name you’d like us to use.</p>
      </div>
      <fieldset className={styles.topics}>
        <legend>News from the co-op</legend>
        <p className={styles.topicsHelp}>Pick what interests you. It’s fine to leave everything off.</p>
        {topics.map(([key, title, description]) => <label className={styles.topic} key={key}>
          <span><strong>{title}</strong><span id={`${key}-description`}>{description}</span></span>
          <input type="checkbox" name={key} checked={values[key]} onChange={event => change(key, event.target.checked)} aria-describedby={`${key}-description`} aria-label={title} />
        </label>)}
      </fieldset>
      <div className={styles.saveRow}>
        <Button type="submit">Save preferences</Button>
        <span className={styles.saveStatus} role="status">{success ? 'Preferences saved in this browser.' : dirty ? 'You have unsaved changes.' : ''}</span>
      </div>
      {saveError && <p className={styles.formError} role="alert">{saveError}</p>}
    </form>
    <p className={styles.localNote}>These settings are saved on this device only. This prototype doesn’t send notifications.</p>
  </section>;
}

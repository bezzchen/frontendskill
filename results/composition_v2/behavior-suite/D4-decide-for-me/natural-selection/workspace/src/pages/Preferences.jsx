import React, { useState, useRef } from 'react';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { readPreferences, preferencesKey } from '../storage.js';
import styles from './Preferences.module.css';

const notifications = [
  { key: 'repairEvenings', title: 'Repair evenings', description: 'Dates and reminders for our monthly repair evenings.' },
  { key: 'skillSwaps', title: 'Skill swaps', description: 'Opportunities to learn something new or share a skill.' },
  { key: 'monthlyDigest', title: 'Monthly digest', description: 'A monthly round-up of news, projects and life at the co-op.' },
];

export default function Preferences() {
  const [saved, setSaved] = useState(readPreferences);
  const [values, setValues] = useState(saved);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [storageError, setStorageError] = useState('');
  const nameInput = useRef(null);
  const dirty = Object.keys(saved).some(key => saved[key] !== values[key]);

  function update(key, value) {
    setValues(current => ({ ...current, [key]: value }));
    if (key === 'displayName') setError('');
    setStatus('');
    setStorageError('');
  }

  function submit(event) {
    event.preventDefault();
    setStatus('');
    setStorageError('');
    if (!values.displayName.trim()) {
      setError('Enter a display name before saving.');
      nameInput.current.focus();
      return;
    }
    const next = { ...values, displayName: values.displayName.trim() };
    try {
      localStorage.setItem(preferencesKey, JSON.stringify(next));
      setValues(next);
      setSaved(next);
      setError('');
      setStatus('Preferences saved in this browser.');
    } catch {
      setStorageError('Your preferences couldn’t be saved. Allow local storage in this browser and try again. Your changes are still here.');
    }
  }

  function cancel() {
    setValues({ ...saved });
    setError('');
    setStorageError('');
    setStatus('Unsaved changes discarded.');
  }

  return <div className={styles.page}>
    <div className={styles.breadcrumb}><a href="/membership">Membership</a><span aria-hidden="true">/</span><span>Your preferences</span></div>
    <header className={styles.heading}><h1>Notification preferences</h1><p>A little news from the co-op, on your terms.</p></header>
    <div className={styles.layout}>
      <aside className={styles.context}>
        <span className={styles.contextIcon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M9 21h6M12 1v2"/></svg></span>
        <h2>Keep in the loop.</h2><p>Choose what you’d like to hear about. You can come back and change these any time.</p>
        <div className={styles.localNote}><strong>About this prototype</strong><p>Preferences are saved only in this browser. No emails are sent, and there’s no account to sign in to.</p></div>
      </aside>
      <form onSubmit={submit} className={styles.form} noValidate>
        <section className={styles.profile} aria-labelledby="profile-heading">
          <h2 id="profile-heading">Your details</h2><p>What should we call you?</p>
          <Field id="display-name" label="Display name" name="displayName" ref={nameInput} autoComplete="nickname" value={values.displayName} onChange={event => update('displayName', event.target.value)} error={error} required />
        </section>
        <fieldset className={styles.notifications}>
          <legend>News you’d like to receive</legend>
          <p>Tick the updates that are useful to you.</p>
          {notifications.map(({ key, title, description }) => <div className={styles.notification} key={key}>
            <input id={key} type="checkbox" checked={values[key]} onChange={event => update(key, event.target.checked)} aria-describedby={`${key}-description`} />
            <div><label htmlFor={key}>{title}</label><p id={`${key}-description`}>{description}</p></div>
          </div>)}
          <p className={styles.unsubscribe}>Prefer a quieter inbox? Leave all three unticked.</p>
        </fieldset>
        <div className={styles.actions}>
          <div className={styles.buttons}><Button type="submit">Save preferences</Button><Button type="button" variant="secondary" onClick={cancel} disabled={!dirty && !error && !storageError}>Cancel</Button></div>
          <p className={styles.status} role="status">{status || (dirty ? 'You have unsaved changes.' : 'Preferences apply to this browser only.')}</p>
          {storageError && <p className={styles.storageError} role="alert">{storageError}</p>}
        </div>
      </form>
    </div>
    <a className={styles.backLink} href="/membership">Back to membership</a>
  </div>;
}

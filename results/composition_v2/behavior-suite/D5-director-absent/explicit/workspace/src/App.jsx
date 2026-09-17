import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import {Button} from './components/Button.jsx';
import {Field} from './components/Field.jsx';
import {shifts} from './shifts.js';

const descriptions = {
  morning: 'Help new plants put down roots.',
  afternoon: 'Give our shared growing spaces a little care.',
  compost: 'Turn garden leftovers into something good.',
};

export default function App() {
  const [availableShifts, setAvailableShifts] = useState(shifts);
  const [selectedId, setSelectedId] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const successHeading = useRef(null);
  const selected = availableShifts.find(shift => shift.id === selectedId);

  useEffect(() => {
    if (confirmation) successHeading.current?.focus();
  }, [confirmation]);

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!selected || selected.remaining === 0) nextErrors.shift = 'Choose an available shift to continue.';
    if (!name.trim()) nextErrors.name = 'Enter a contact name to continue.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(nextErrors.shift ? `shift-${availableShifts.find(shift => shift.remaining > 0)?.id}` : 'contact-name')?.focus();
      return;
    }
    setConfirmation({shift: {...selected}, name: name.trim()});
    setAvailableShifts(current => current.map(shift => shift.id === selectedId ? {...shift, remaining: shift.remaining - 1} : shift));
  }

  function restart() {
    setConfirmation(null);
    setSelectedId('');
    setName('');
    setErrors({});
    requestAnimationFrame(() => document.getElementById('choose-heading')?.focus());
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}><span className={styles.mark} aria-hidden="true">m.</span><div>Moss Lane Garden<span>Neighbors growing together</span></div></div>
        <span className={styles.headerNote}>A little time. A growing community.</span>
      </header>
      <main id="main-content">
        <section className={styles.intro} aria-labelledby="page-heading">
          <div><p className={styles.eyebrow}>GROW WITH YOUR NEIGHBORS</p><h1 id="page-heading">Make room for<br />something good.</h1><p className={styles.lead}>A few hours in the garden can make a real difference.<br className={styles.desktopBreak} /> Find a shift that fits your day and lend a hand.</p></div>
          <div className={styles.season}><span className={styles.seasonLabel}>IN THE GARDEN THIS OCTOBER</span><strong>Small acts.<br />Shared roots.</strong><span>Plant, care, and grow together.</span></div>
        </section>
        {confirmation ? (
          <section className={styles.confirmation} aria-labelledby="confirmation-heading">
            <span className={styles.check} aria-hidden="true">✓</span>
            <p className={styles.eyebrow}>THANK YOU FOR LENDING A HAND</p>
            <h2 id="confirmation-heading" ref={successHeading} tabIndex={-1}>Shift confirmed.</h2>
            <p>Here are your sign-up details, {confirmation.name}.</p>
            <dl className={styles.confirmDetails}>
              <div><dt>Shift</dt><dd>{confirmation.shift.name}</dd></div>
              <div><dt>When</dt><dd>{confirmation.shift.date}<br />{confirmation.shift.time}</dd></div>
              <div><dt>Contact name</dt><dd>{confirmation.name}</dd></div>
            </dl>
            <p className={styles.demoNote}>This is a local demo confirmation. No real reservation has been made.</p>
            <Button onClick={restart}>Begin another sign-up <span aria-hidden="true">↗</span></Button>
          </section>
        ) : (
          <form className={styles.signup} onSubmit={submit} noValidate>
            <section aria-labelledby="choose-heading">
              <div className={styles.sectionHeading}><span className={styles.step}>01</span><h2 id="choose-heading" tabIndex={-1}>Choose your shift</h2><span className={styles.duration}>2 hours each</span></div>
              <fieldset className={styles.shifts} aria-describedby={errors.shift ? 'shift-error' : undefined}>
                <legend className={styles.srOnly}>Available volunteer shifts (required)</legend>
                {availableShifts.map(shift => {
                  const full = shift.remaining === 0;
                  return <label key={shift.id} className={`${styles.shift} ${selectedId === shift.id ? styles.selected : ''} ${full ? styles.full : ''}`}>
                    <input type="radio" id={`shift-${shift.id}`} name="shift" value={shift.id} disabled={full} required checked={selectedId === shift.id} aria-invalid={Boolean(errors.shift)} aria-describedby={errors.shift ? 'shift-error' : undefined} onChange={() => {setSelectedId(shift.id); setErrors(current => ({...current, shift: undefined}));}} />
                    <span className={styles.shiftContent}><span className={styles.shiftTop}><strong>{shift.name}</strong><span className={styles.badge}>{full ? 'Full' : `${shift.remaining} places left`}</span></span><span className={styles.shiftDate}>{shift.date}<span aria-hidden="true"> · </span>{shift.time}</span><span className={styles.description}>{descriptions[shift.id]}</span><span className={styles.capacityRow}><span className={styles.capacityBar} aria-hidden="true"><span style={{width: `${(shift.capacity - shift.remaining) / shift.capacity * 100}%`}} /></span><span>{shift.remaining} available / {shift.capacity} total</span></span></span>
                  </label>;
                })}
              </fieldset>
              {errors.shift && <p className={styles.error} id="shift-error" role="alert">{errors.shift}</p>}
              <p className={styles.shiftNote}>One sign-up reserves one place. Every pair of hands helps.</p>
            </section>
            <section className={styles.details} aria-labelledby="details-heading">
              <div className={styles.sectionHeading}><span className={styles.step}>02</span><h2 id="details-heading">Make it yours</h2></div>
              <p className={styles.detailsIntro}>Let us know who’s lending a hand.</p>
              <Field id="contact-name" label="Contact name" value={name} autoComplete="name" required maxLength={120} placeholder="Your name" error={errors.name} onChange={event => {setName(event.target.value); if (event.target.value.trim()) setErrors(current => ({...current, name: undefined}));}} />
              <div className={styles.summary} aria-live="polite" aria-atomic="true"><p className={styles.summaryLabel}>YOUR CHOSEN SHIFT</p>{selected ? <><strong>{selected.name}</strong><span>{selected.date}</span><span>{selected.time} · 1 place</span></> : <p className={styles.emptySummary}>Choose an available shift to see<br />your details here.</p>}</div>
              <div className={styles.submit}><Button type="submit">Confirm shift <span aria-hidden="true">↗</span></Button></div>
              <p className={styles.demoNote}>Demo only. No real booking will be made.<br />Your details stay on this page.</p>
            </section>
          </form>
        )}
      </main>
      <footer className={styles.footer}><span>Moss Lane Garden</span><span>A shared patch. A shared purpose.</span></footer>
    </div>
  );
}

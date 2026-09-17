import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import {Button} from './components/Button.jsx';
import {Field} from './components/Field.jsx';
import {shifts} from './shifts.js';

const descriptions = {
  morning: 'Help new things take root. Spend the morning planting in our garden beds.',
  afternoon: 'Give our shared spaces a little care, from garden paths to growing beds.',
  compost: 'Turn garden scraps into good soil with the compost crew.',
};

function Sprout({className}) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 41V24M24 31C11 32 5 24 6 13c12-1 19 6 18 18ZM24 24C24 12 31 6 42 7c0 11-6 18-18 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m14 22 10 9M33 16l-9 8M15 41h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

function Capacity({shift}) {
  return <div className={styles.capacity}>
    <div className={styles.places} aria-hidden="true">
      {Array.from({length: shift.capacity}, (_, index) => <span key={index} className={index < shift.capacity - shift.remaining ? styles.filledPlace : styles.openPlace} />)}
    </div>
    <span><strong>{shift.remaining} available</strong> / {shift.capacity} places</span>
  </div>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState('');
  const [contactName, setContactName] = useState('');
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const confirmationRef = useRef(null);
  const firstShiftRef = useRef(null);
  const returnFocus = useRef(false);
  const selectedShift = shifts.find(shift => shift.id === selectedId);

  useEffect(() => {
    if (confirmation) confirmationRef.current?.focus();
    else if (returnFocus.current) {
      firstShiftRef.current?.focus();
      returnFocus.current = false;
    }
  }, [confirmation]);

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!selectedShift || selectedShift.remaining === 0) nextErrors.shift = 'Choose a shift with available places.';
    if (!contactName.trim()) nextErrors.name = 'Enter a contact name to confirm your shift.';
    setErrors(nextErrors);
    if (nextErrors.shift) firstShiftRef.current?.focus();
    else if (nextErrors.name) document.getElementById('contact-name')?.focus();
    else setConfirmation({shift: selectedShift, name: contactName.trim()});
  }

  function startAgain() {
    setSelectedId('');
    setContactName('');
    setErrors({});
    returnFocus.current = true;
    setConfirmation(null);
  }

  return <div className={styles.page}>
    <a href="#main" className={styles.skipLink}>Skip to sign-up</a>
    <header className={styles.header}>
      <div className={styles.brand}><Sprout className={styles.logo}/><span>Moss Lane<span className={styles.brandSub}>COMMUNITY GARDEN</span></span></div>
      <span className={styles.headerNote}>Neighbors growing together.</span>
    </header>
    <main id="main" tabIndex={-1}>
      <section className={styles.intro} aria-labelledby="page-title">
        <div><p className={styles.eyebrow}>GROW WITH YOUR NEIGHBORS</p><h1 id="page-title">A little time.<br/>A lot of good.</h1></div>
        <div className={styles.introCopy}><p>A couple of hours, a few helping hands, and a garden we can all enjoy.</p><p>Find your volunteer shift at Moss Lane.<br/>No gardening experience needed.</p></div>
      </section>
      {confirmation ? <section className={styles.confirmation} aria-labelledby="confirmation-title">
        <div className={styles.confirmationIcon} aria-hidden="true">✓</div>
        <p className={styles.eyebrow}>THANK YOU FOR PITCHING IN</p>
        <h2 id="confirmation-title" ref={confirmationRef} tabIndex={-1}>Your shift is confirmed.</h2>
        <p>This is a local demo confirmation. No place has been reserved.</p>
        <dl className={styles.confirmationDetails}>
          <div><dt>Contact name</dt><dd>{confirmation.name}</dd></div>
          <div><dt>Your shift</dt><dd>{confirmation.shift.name}</dd></div>
          <div><dt>Date</dt><dd>{confirmation.shift.date}</dd></div>
          <div><dt>Time</dt><dd>{confirmation.shift.time}</dd></div>
        </dl>
        <Button onClick={startAgain}>Begin another sign-up <span aria-hidden="true">↗</span></Button>
      </section> : <form className={styles.signup} onSubmit={submit} noValidate>
        <fieldset className={styles.shiftChoices} aria-describedby={errors.shift ? 'shift-help shift-error' : 'shift-help'}>
          <legend><span className={styles.step}>1</span> Choose your shift</legend>
          <p id="shift-help" className={styles.sectionHelp}>A small commitment. A shared difference. All shifts are two hours.</p>
          {errors.shift && <p id="shift-error" className={styles.error} role="alert">{errors.shift}</p>}
          <div className={styles.shiftList}>
            {shifts.map((shift, index) => {
              const isFull = shift.remaining === 0;
              return <label key={shift.id} className={`${styles.shift} ${selectedId === shift.id ? styles.selected : ''} ${isFull ? styles.full : ''}`}>
                <input ref={index === 0 ? firstShiftRef : undefined} type="radio" name="shift" value={shift.id} checked={selectedId === shift.id} disabled={isFull} required aria-invalid={Boolean(errors.shift)} aria-labelledby={`${shift.id}-title`} aria-describedby={`${shift.id}-date ${shift.id}-capacity${errors.shift ? ' shift-error' : ''}`} onChange={() => {setSelectedId(shift.id); setErrors(previous => ({...previous, shift: undefined}));}}/>
                <div className={styles.shiftContent}>
                  <div className={styles.shiftTop}><h3 id={`${shift.id}-title`}>{shift.name}</h3><span className={`${styles.badge} ${isFull ? styles.fullBadge : ''}`}>{isFull ? 'Full' : 'Open'}</span></div>
                  <p id={`${shift.id}-date`} className={styles.date}>{shift.date}<span aria-hidden="true"> · </span><span>{shift.time}</span></p>
                  <p className={styles.description}>{descriptions[shift.id]}</p>
                  <div id={`${shift.id}-capacity`}><Capacity shift={shift}/></div>
                </div>
              </label>;
            })}
          </div>
          <p className={styles.legend}><span aria-hidden="true"/> Open places are shown as outlined squares.</p>
        </fieldset>
        <aside className={styles.contactPanel} aria-labelledby="contact-title">
          <h2 id="contact-title"><span className={styles.step}>2</span> Make it your shift</h2>
          <p className={styles.sectionHelp}>Just a name, and you’re ready to lend a hand.</p>
          <Field id="contact-name" label="Contact name (required)" autoComplete="name" required value={contactName} error={errors.name} onChange={event => {setContactName(event.target.value); if (event.target.value.trim()) setErrors(previous => ({...previous, name: undefined}));}}/>
          <div className={styles.summary} aria-live="polite" aria-atomic="true"><span className={styles.summaryLabel}>YOUR CHOSEN SHIFT</span>{selectedShift ? <><strong>{selectedShift.name}</strong><span>{selectedShift.date}</span><span>{selectedShift.time} · 2 hours</span></> : <p>Choose an open shift to see the details here.</p>}</div>
          <Button type="submit">Confirm my shift <span aria-hidden="true">↗</span></Button>
          <p className={styles.demoNote}>This is a local prototype. Your details stay on this page and no place is reserved.</p>
          <div className={styles.welcome}><Sprout className={styles.welcomeIcon}/><div><h3>New to the garden?</h3><p>You’re in good company. Every helping hand makes a difference.</p></div></div>
        </aside>
      </form>}
      <div className={styles.bottomNote}><span>Small acts. Strong roots.</span><p>A garden grows better together.</p></div>
    </main>
    <footer className={styles.footer}><span>Moss Lane Community Garden</span><span>Made for neighbors, by neighbors.</span></footer>
  </div>;
}

import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import {slots} from './slots.js';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [attendee, setAttendee] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const firstSlot = useRef(null);
  const nameInput = useRef(null);
  const confirmationTitle = useRef(null);
  const restarting = useRef(false);
  const selectedSlot = slots.find(slot => slot.id === selectedId);
  const sessionError = submitted && !selectedSlot;
  const nameError = submitted && !attendee.trim();

  useEffect(() => {
    if (confirmation) {
      confirmationTitle.current?.focus();
    } else if (restarting.current) {
      firstSlot.current?.focus();
      restarting.current = false;
    }
  }, [confirmation]);

  function reservePlace(event) {
    event.preventDefault();
    setSubmitted(true);
    if (!selectedSlot) {
      firstSlot.current?.focus();
    } else if (!attendee.trim()) {
      nameInput.current?.focus();
    } else {
      setConfirmation({attendee: attendee.trim(), slot: selectedSlot});
    }
  }

  function startAnotherReservation() {
    restarting.current = true;
    setSelectedId(null);
    setAttendee('');
    setSubmitted(false);
    setConfirmation(null);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>WILLOW ROOM</span>
        <span>Community workshops · October</span>
      </header>
      <section className={styles.intro}>
        <h1>Make something. Make an afternoon of it.</h1>
        <p>Small, friendly workshops for curious hands. Pick a session and save your place. All materials are included.</p>
      </section>
      <div className={styles.layout}>
        <section className={styles.schedule}>
          <h2 id="session-title">Choose your session</h2>
          <div className={styles.slots} role="group" aria-labelledby="session-title" aria-describedby={sessionError ? 'session-error' : undefined}>
            {slots.map((slot, index) => (
              <button
                type="button"
                key={slot.id}
                ref={index === 0 ? firstSlot : undefined}
                className={styles.slot}
                aria-pressed={selectedId === slot.id}
                aria-describedby={sessionError ? 'session-error' : undefined}
                disabled={Boolean(confirmation)}
                onClick={() => setSelectedId(slot.id)}
              >
                <strong>{slot.title}</strong>
                <span>{slot.day} · {slot.time}</span>
                <small>{slot.remaining} places available{selectedId === slot.id && <b> · Selected</b>}</small>
              </button>
            ))}
          </div>
          {sessionError && <p id="session-error" className={styles.error} role="alert">Choose a session to reserve your place.</p>}
        </section>
        <section className={styles.booking} aria-labelledby="booking-title">
          {confirmation ? (
            <>
              <h2 id="booking-title" ref={confirmationTitle} tabIndex={-1}>Your place is reserved</h2>
              <p className={styles.attendee}>Thanks, {confirmation.attendee}. Your local reservation is confirmed.</p>
              <dl className={styles.summary}>
                <dt>Session</dt>
                <dd>{confirmation.slot.title}</dd>
                <dt>Day</dt>
                <dd>{confirmation.slot.day}</dd>
                <dt>Time</dt>
                <dd>{confirmation.slot.time}</dd>
              </dl>
              <button type="button" className={styles.primary} onClick={startAnotherReservation}>Start another reservation</button>
            </>
          ) : (
            <>
              <h2 id="booking-title">Your place at the table</h2>
              <p>Choose a session, then tell us your name.</p>
              <form onSubmit={reservePlace} noValidate>
                <label className={styles.label} htmlFor="attendee">Attendee name
                  <input
                    id="attendee"
                    ref={nameInput}
                    className={styles.input}
                    name="attendee"
                    autoComplete="name"
                    required
                    value={attendee}
                    onChange={event => setAttendee(event.target.value)}
                    aria-invalid={nameError || undefined}
                    aria-describedby={nameError ? 'name-error' : undefined}
                  />
                </label>
                {nameError && <p id="name-error" className={styles.error} role="alert">Enter your name to reserve your place.</p>}
                <button type="submit" className={styles.primary}>Reserve a place</button>
              </form>
            </>
          )}
          <p className={styles.note}>Local booking demo. No payment or message is sent.</p>
        </section>
      </div>
      <footer className={styles.footer}>Willow Room · Ground-floor studio, 8 Mill Lane. Step-free entrance.</footer>
    </main>
  );
}

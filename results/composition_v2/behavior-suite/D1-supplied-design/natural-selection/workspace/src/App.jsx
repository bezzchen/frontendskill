import React, { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { slots } from './slots.js';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [attendee, setAttendee] = useState('');
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const firstSlotRef = useRef(null);
  const attendeeRef = useRef(null);
  const confirmationRef = useRef(null);
  const resetRequested = useRef(false);

  useEffect(() => {
    if (confirmation) {
      confirmationRef.current?.focus();
    } else if (resetRequested.current) {
      firstSlotRef.current?.focus();
      resetRequested.current = false;
    }
  }, [confirmation]);

  function selectSlot(id) {
    setSelectedId(id);
    setErrors(previous => ({ ...previous, session: undefined }));
  }

  function reservePlace(event) {
    event.preventDefault();
    const session = slots.find(slot => slot.id === selectedId);
    const name = attendee.trim();
    const nextErrors = {};

    if (!session) nextErrors.session = 'Choose a session to continue.';
    if (!name) nextErrors.attendee = 'Enter your name to continue.';
    setErrors(nextErrors);

    if (!session) {
      firstSlotRef.current?.focus();
    } else if (!name) {
      attendeeRef.current?.focus();
    } else {
      setConfirmation({ attendee: name, session });
    }
  }

  function startAnotherReservation() {
    resetRequested.current = true;
    setSelectedId(null);
    setAttendee('');
    setErrors({});
    setConfirmation(null);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>WILLOW ROOM</span>
        <span>Community workshops · October</span>
      </header>
      <section className={styles.intro}>
        <h1>Make something.{'\n'}Make an afternoon of it.</h1>
        <p>Small, friendly workshops for curious hands. Pick a session and save your place. All materials are included.</p>
      </section>
      <div className={styles.layout}>
        <section className={styles.schedule}>
          <h2 id="session-title">Choose your session</h2>
          {errors.session && <p className={styles.error} id="session-error" role="alert">{errors.session}</p>}
          <div className={styles.slots} role="group" aria-labelledby="session-title" aria-describedby={errors.session ? 'session-error' : undefined}>
            {slots.map((slot, index) => (
              <button
                type="button"
                key={slot.id}
                ref={index === 0 ? firstSlotRef : undefined}
                className={`${styles.slot}${selectedId === slot.id ? ` ${styles.selected}` : ''}`}
                aria-pressed={selectedId === slot.id}
                aria-describedby={errors.session ? 'session-error' : undefined}
                disabled={Boolean(confirmation)}
                onClick={() => selectSlot(slot.id)}
              >
                <strong>{slot.title}</strong>
                <span>{slot.day} · {slot.time}</span>
                <small>{slot.remaining} places available{selectedId === slot.id && <span className={styles.selectionLabel}> · Selected</span>}</small>
              </button>
            ))}
          </div>
        </section>
        <section className={styles.booking} aria-labelledby="booking-title">
          {confirmation ? (
            <>
              <h2 id="booking-title" ref={confirmationRef} tabIndex={-1}>Your place is reserved</h2>
              <p>Thank you, <strong>{confirmation.attendee}</strong>. Your local reservation is confirmed.</p>
              <dl className={styles.details}>
                <dt>Session</dt>
                <dd>{confirmation.session.title}</dd>
                <dt>Day</dt>
                <dd>{confirmation.session.day}</dd>
                <dt>Time</dt>
                <dd>{confirmation.session.time}</dd>
              </dl>
              <button type="button" className={styles.primary} onClick={startAnotherReservation}>Start another reservation</button>
            </>
          ) : (
            <>
              <h2 id="booking-title">Your place at the table</h2>
              <p>Choose a session, then tell us your name.</p>
              <form onSubmit={reservePlace} noValidate>
                <label className={styles.label}>
                  Attendee name
                  <input
                    ref={attendeeRef}
                    className={styles.input}
                    name="attendee"
                    autoComplete="name"
                    required
                    value={attendee}
                    aria-invalid={Boolean(errors.attendee)}
                    aria-describedby={errors.attendee ? 'attendee-error' : undefined}
                    onChange={event => {
                      const value = event.target.value;
                      setAttendee(value);
                      if (value.trim()) setErrors(previous => ({ ...previous, attendee: undefined }));
                    }}
                  />
                </label>
                {errors.attendee && <p className={styles.error} id="attendee-error" role="alert">{errors.attendee}</p>}
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

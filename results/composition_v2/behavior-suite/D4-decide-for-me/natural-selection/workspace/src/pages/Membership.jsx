import React, { useRef, useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import RepairIllustration from '../components/RepairIllustration.jsx';
import { membership } from '../content.js';
import { joinDemoList } from '../storage.js';
import styles from './Membership.module.css';

const details = [
  ['Make room for repair.', 'Bring something that needs a little attention. Find the tools, space and company to give it another go.'],
  ['Pass a good skill on.', 'A stitch, a fix, a trick you didn’t know. Learn from your neighbours and share what comes naturally.'],
  ['Build it together.', 'This is your co-op, too. Help decide what we add to the toolbox and what we take on next.'],
];

function BenefitIcon({ index }) {
  const paths = [
    <path key="tools" d="m8 28 15-15m-3-9a8 8 0 0 0 10 10l-7 7M8 22l-4 4a3 3 0 0 0 4 4l4-4M25 4l-4 4 5 5 4-4M5 5l7 7m-9-7 3-3 8 8-3 3m7 9 9 9 4-4-9-9" />,
    <path key="thread" d="m7 27 17-20c6-7 11-2 5 4L10 28l-5 3 2-4Zm17-20 5 4M5 31c4 8 24 4 23-2-1-5-10-4-8 1" />,
    <path key="hands" d="M3 21h6l6-7c3-3 6-1 4 2l-3 4h9c8 0 8 4 3 6l-13 6-9-4H3V17m16-6 5-6 5 6m-5-6v12" />,
  ];
  return <svg viewBox="0 0 36 38" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}

export default function Membership() {
  const [values, setValues] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [joined, setJoined] = useState(false);
  const [storageError, setStorageError] = useState('');
  const form = useRef(null);
  const nameInput = useRef(null);

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Enter your name so we know what to call you.';
    if (!values.email.trim() || !form.current.elements.email.validity.valid) nextErrors.email = 'Enter a valid email address, like you@example.com.';
    setErrors(nextErrors);
    setStorageError('');
    if (Object.keys(nextErrors).length) {
      form.current.elements[Object.keys(nextErrors)[0]].focus();
      return;
    }
    try {
      joinDemoList({ name: values.name.trim(), email: values.email.trim() });
      setJoined(true);
    } catch {
      setStorageError('We couldn’t save your details in this browser. Allow local storage and try again. Your details are still here.');
    }
  }

  function update(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined }));
    setStorageError('');
  }

  return <>
    <section className={styles.hero} aria-labelledby="membership-heading">
      <div className={styles.heroCopy}>
        <p className={styles.kicker}><span /> A co-op for the things worth keeping</p>
        <h1 id="membership-heading">Good things<br />deserve another<br />chapter.</h1>
        <p className={styles.intro}>A favourite jumper. A wobbly chair. A kettle with a story.<br className={styles.desktopBreak} /> Keep them going, with a little help from your neighbours.</p>
        <div className={styles.heroAction}>
          <Button onClick={() => { document.getElementById('join').scrollIntoView(); nameInput.current?.focus({ preventScroll: true }); }}>Become a member</Button>
          <span>{membership.price}<small>A little each month. A lot, together.</small></span>
        </div>
      </div>
      <div className={styles.illustration}>
        <span className={styles.artNote}>Still plenty of life in it.</span>
        <RepairIllustration />
        <p>More mending. Less ending.</p>
      </div>
    </section>
    <div className={styles.promise}><span aria-hidden="true">✳</span><p>{membership.promise}</p><span aria-hidden="true">✳</span></div>
    <section className={styles.benefits} aria-labelledby="benefits-heading">
      <div className={styles.sectionIntro}><h2 id="benefits-heading">Good for your things.<br />Even better, together.</h2><p>Your membership keeps shared tools, shared skills<br className={styles.desktopBreak} /> and patient repair within reach.</p></div>
      <div className={styles.benefitGrid}>{membership.benefits.map((benefit, index) => <article key={benefit}>
        <BenefitIcon index={index} />
        <h3>{details[index][0]}</h3>
        <p className={styles.benefitLead}>{benefit}.</p>
        <p>{details[index][1]}</p>
      </article>)}</div>
    </section>
    <section id="join" className={styles.join} aria-labelledby="join-heading">
      <div className={styles.joinCopy}>
        <p className={styles.smallLabel}>There’s a place for you at the workbench.</p>
        <h2 id="join-heading">Let’s give things<br />another go.</h2>
        <p>You don’t need to be handy. Just curious.<br />Join the Round Again member list.</p>
        <p className={styles.price}>{membership.price}<span>For shared tools, shared skills and a say.</span></p>
      </div>
      <div className={styles.formWrap}>
        {joined ? <div className={styles.success} role="status">
          <span className={styles.successMark} aria-hidden="true">✓</span>
          <h3>You’re on the demo list, {values.name.trim()}.</h3>
          <p>Your details are saved in this browser. This hasn’t created a paid membership or sent an email.</p>
          <a href="/preferences">Choose your notification preferences</a>
        </div> : <form ref={form} onSubmit={submit} noValidate>
          <Field id="member-name" name="name" label="Your name" autoComplete="name" ref={nameInput} value={values.name} onChange={update} error={errors.name} required />
          <Field id="member-email" name="email" label="Email address" type="email" autoComplete="email" value={values.email} onChange={update} error={errors.email} required />
          <Button type="submit">Join the demo member list</Button>
          {storageError && <p className={styles.formError} role="alert">{storageError}</p>}
          <p className={styles.demoNote}>Just a little trial run. This is a prototype: your details stay in this browser. No payment, email or external submission.</p>
        </form>}
      </div>
    </section>
    <div className={styles.preferenceLink}><p>Already making yourself at home?</p><a href="/preferences">Set your notification preferences</a></div>
  </>;
}

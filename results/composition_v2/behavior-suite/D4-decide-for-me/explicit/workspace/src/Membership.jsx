import React, { useState } from 'react';
import { membership } from './content.js';
import { Button } from './components/Button.jsx';
import { Field } from './components/Field.jsx';
import RepairIllustration from './RepairIllustration.jsx';
import { joinDemoList } from './storage.js';
import styles from './App.module.css';

export default function Membership() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [joined, setJoined] = useState(false);
  const [saveError, setSaveError] = useState('');

  function join(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Enter your name to join the demo list.';
    if (!email.trim() || !event.currentTarget.elements.email.validity.valid) nextErrors.email = 'Enter a valid email address.';
    setErrors(nextErrors);
    setSaveError('');
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements[Object.keys(nextErrors)[0]].focus();
      return;
    }
    try {
      joinDemoList({ name: name.trim(), email: email.trim() });
      setJoined(true);
    } catch {
      setSaveError('This browser could not save your details. Allow local storage, then try again. Your details are still here.');
    }
  }

  return <>
    <section className={styles.hero} aria-labelledby="membership-title">
      <div>
        <p className={styles.intro}>A place for people who mend.</p>
        <h1 id="membership-title">Good things<br />deserve<br />another chapter.</h1>
        <p className={styles.heroCopy}>Your favourite mug. That wobbly chair. The skills we can share. Let’s keep good things going, together.</p>
        <a className={styles.joinLink} href="#join">Find your place at the workbench <span aria-hidden="true">↗</span></a>
      </div>
      <div className={styles.illustration}><RepairIllustration /><span className={styles.repairStamp}>Made to<br /><strong>keep.</strong></span></div>
    </section>
    <div className={styles.promise}><p>{membership.promise}</p><span aria-hidden="true">↻</span></div>
    <section className={styles.membershipDetails} aria-labelledby="membership-heading">
      <div className={styles.benefits}>
        <p className={styles.intro}>A little each month. A lot we can do.</p>
        <h2 id="membership-heading">One membership.<br />Many second chances.</h2>
        <p className={styles.price}>{membership.price}<span>for shared tools, skills and a place to start.</span></p>
        <ul>{membership.benefits.map(benefit => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul>
        <p className={styles.benefitNote}>New to repair? You’re in the right place.<br />Bring your curiosity. We’ll learn together.</p>
      </div>
      <div className={styles.joinPanel} id="join">
        <span className={styles.panelTag}>There’s room at the table</span>
        <h2>Let’s make things last.</h2>
        <p>Take the first step. Add your name to our demo member list.</p>
        {joined ? <div className={styles.confirmation} role="status">
          <span className={styles.successMark} aria-hidden="true">✓</span>
          <h3>You’re on the demo list, {name.trim()}.</h3>
          <p>Your details are saved in this browser. No payment was taken and nothing was sent.</p>
          <a href="/preferences">Choose your notification preferences</a>
        </div> : <form onSubmit={join} noValidate>
          <Field label="Your name" id="member-name" name="name" autoComplete="name" required value={name} onChange={event => setName(event.target.value)} error={errors.name} />
          <Field label="Email address" id="member-email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} error={errors.email} />
          <Button type="submit">Join the demo member list</Button>
          {saveError && <p className={styles.formError} role="alert">{saveError}</p>}
        </form>}
        <p className={styles.prototypeNote}>This is a prototype. Details stay in this browser. No payment, emails or external submission.</p>
      </div>
    </section>
  </>;
}

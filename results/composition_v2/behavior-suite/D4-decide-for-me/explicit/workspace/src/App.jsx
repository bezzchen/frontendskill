import React from 'react';
import styles from './App.module.css';
import Membership from './Membership.jsx';
import Preferences from './Preferences.jsx';

export default function App() {
  const preferences = location.pathname.replace(/\/$/, '') === '/preferences';
  document.title = `${preferences ? 'Notification preferences' : 'Membership'} | Round Again`;
  return <div className={styles.shell}>
    <a className={styles.skipLink} href="#main">Skip to content</a>
    <header className={styles.header}>
      <a href="/membership" className={styles.brand} aria-label="Round Again repair co-op home">
        <span className={styles.brandMark} aria-hidden="true">↻</span>
        <span>Round Again<small>Repair co-op</small></span>
      </a>
      <nav className={styles.nav} aria-label="Main navigation">
        <a href="/membership" aria-current={!preferences ? 'page' : undefined}>Membership</a>
        <a href="/preferences" aria-current={preferences ? 'page' : undefined}>Notification preferences</a>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>{preferences ? <Preferences /> : <Membership />}</main>
    <footer className={styles.footer}><span>Round Again repair co-op</span><span>A little care goes a long way.</span></footer>
  </div>;
}

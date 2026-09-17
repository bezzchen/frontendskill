import React from 'react';
import styles from './App.module.css';
import Membership from './pages/Membership.jsx';
import Preferences from './pages/Preferences.jsx';

export default function App() {
  const isPreferences = location.pathname.replace(/\/$/, '') === '/preferences';
  React.useEffect(() => {
    document.title = `${isPreferences ? 'Notification preferences' : 'Membership'} · Round Again`;
  }, [isPreferences]);

  return <div className={styles.shell}>
    <a className={styles.skip} href="#main">Skip to content</a>
    <header className={styles.header}>
      <a className={styles.brand} href="/membership" aria-label="Round Again repair co-op, membership">
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M30 12A14 14 0 1 0 34 25M30 4v9H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="m14 24 10-10m-9 3 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        <span>Round Again<small>Repair co-op</small></span>
      </a>
      <nav className={styles.nav} aria-label="Main navigation">
        <a href="/membership" aria-current={!isPreferences ? 'page' : undefined}>Membership</a>
        <a href="/preferences" aria-current={isPreferences ? 'page' : undefined}>Notification preferences</a>
      </nav>
    </header>
    <main id="main" tabIndex={-1}>{isPreferences ? <Preferences /> : <Membership />}</main>
    <footer className={styles.footer}>
      <a href="/membership">Round Again <span>Repair co-op</span></a>
      <p>A little care. A lot more life.</p>
      <span className={styles.prototype}>A local prototype, made for trying out.</span>
    </footer>
  </div>;
}

import React from 'react';
import styles from './App.module.css';
import {Button} from './components/Button.jsx';
import {Field} from './components/Field.jsx';
export default function App(){const preferences=location.pathname==='/preferences';return <main className={styles.shell}><header className={styles.header}><strong>Round Again · Repair co-op</strong><nav className={styles.nav}><a href="/membership">Membership</a><a href="/preferences">Notification preferences</a></nav></header><section className={styles.content}><h1>{preferences?'Notification preferences':'Good things deserve another chapter.'}</h1><p>{preferences?'Choose the news you want from the co-op.':'Membership keeps shared tools, shared skills and patient repair within reach.'}</p><p>Implementation is in progress.</p></section></main>}

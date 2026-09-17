import React from 'react';
import styles from './Shared.module.css';
export function Field({label,id,error,children,...props}){return <div className={styles.field}><label htmlFor={id}>{label}</label>{children||<input id={id} aria-invalid={Boolean(error)} aria-describedby={error?id+'-error':undefined} {...props}/>} {error&&<p id={id+'-error'} role="alert" className={styles.error}>{error}</p>}</div>}

import React from 'react';
import styles from './Shared.module.css';
export function Button({children,variant='primary',...props}){return <button className={variant==='secondary'?styles.secondary:styles.primary} {...props}>{children}</button>}

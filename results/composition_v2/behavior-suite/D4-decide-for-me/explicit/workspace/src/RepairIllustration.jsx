import React from 'react';

export default function RepairIllustration() {
  return <svg viewBox="0 0 500 440" fill="none" aria-hidden="true" focusable="false">
    <circle cx="253" cy="218" r="181" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="253" cy="218" r="166" stroke="currentColor" strokeWidth="1" strokeDasharray="2 9" />
    <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M160 178h144v110c0 27-144 27-144 0V178Z" fill="var(--paper)" />
      <ellipse cx="232" cy="178" rx="72" ry="15" fill="var(--paper)" />
      <path d="M305 193h18c47 0 47 72 0 72h-18m0-55h15c24 0 24 38 0 38h-15" />
      <path d="m237 194-17 32 18 23-14 20 12 34" stroke="var(--highlight)" strokeWidth="8" />
      <path d="M181 267v18" strokeWidth="3" />
      <path d="m314 101 15-22 20 14-15 22-8 2-58 85-8-5 58-85Z" fill="var(--highlight)" transform="rotate(8 310 120)" />
      <g transform="rotate(-35 116 270)">
        <path d="M102 217v48h28v-48l-7-13v-21h-14v21Z" fill="var(--highlight)" />
        <path d="M109 267v58l7 15 7-15v-58" fill="var(--paper)" />
        <path d="M112 225v28m8-28v28" strokeWidth="2" />
      </g>
      <path d="M328 311c23 23 32 51 10 58-29 10-53-33-18-42 44-12 86 8 76-29-6-22-35-10-21 6" strokeWidth="2.5" />
      <path d="m348 286 44-47m-6 7 4-4" strokeWidth="3" />
      <circle cx="163" cy="110" r="19" fill="var(--highlight)" strokeWidth="3" />
      <path d="M157 105h1m9 0h1m-11 10h1m9 0h1" strokeWidth="4" />
      <path d="m382 157 8-13m-4 26 15-2M107 143l-12-8m9 24-16 1" strokeWidth="2.5" />
    </g>
    <path d="M166 351c34 15 90 15 119 0" stroke="currentColor" strokeWidth="2" />
    <text x="253" y="419" textAnchor="middle" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="15">Still good. Just needs a little love.</text>
  </svg>;
}

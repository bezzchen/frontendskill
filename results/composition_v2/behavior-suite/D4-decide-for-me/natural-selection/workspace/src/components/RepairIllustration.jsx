import React from 'react';

// An original, static workshop illustration. All colours come from the shared palette.
export default function RepairIllustration() {
  return <svg viewBox="0 0 560 490" role="img" aria-labelledby="repair-title">
    <title id="repair-title">A well-loved teapot, repaired with a golden seam, beside a spool of thread and a screwdriver.</title>
    <defs>
      <pattern id="workshop-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" fill="none" stroke="var(--brand)" strokeOpacity=".09" strokeWidth="1"/></pattern>
      <pattern id="spool-thread" width="8" height="6" patternUnits="userSpaceOnUse"><path d="M0 3h8" stroke="var(--brand)" strokeOpacity=".5" strokeWidth="1"/></pattern>
    </defs>
    <circle cx="288" cy="244" r="213" fill="url(#workshop-grid)"/>
    <ellipse cx="290" cy="399" rx="210" ry="12" fill="var(--brand)" opacity=".07"/>
    <g fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M346 181c110-42 150 100 52 117l-14-35c51-6 37-68-17-47" fill="var(--paper)" strokeWidth="14"/>
      <path d="M204 225c-43-5-61-44-82-42l-30 6c44 23 23 94 88 110" fill="var(--paper)"/>
      <path d="m96 190 24-7m-1 19 12-5"/>
      <path d="M211 160c-18 39-55 76-49 137 5 67 45 96 113 96s115-25 119-91c4-62-36-104-49-142Z" fill="var(--brand)"/>
      <path d="M206 172c36 12 106 12 143 0" stroke="var(--paper)" strokeOpacity=".5"/>
      <path d="M192 249c-10 47-2 81 18 99" stroke="var(--paper)" strokeOpacity=".45"/>
      <path d="m307 181-19 37 17 26-23 30 13 31-19 35 7 50" stroke="var(--highlight)" strokeWidth="6"/>
      <path d="m306 245 24 8 11 20m-53 63-20-11-16 9" stroke="var(--highlight)" strokeWidth="4"/>
      <path d="M197 162c8-35 148-40 162 0-46 10-111 13-162 0Z" fill="var(--paper)"/>
      <path d="M265 141v-15c0-12 25-12 25 0v14" fill="var(--highlight)"/>
      <path d="M249 101c-21-22 26-25 4-49m42 50c-21-22 26-25 4-49" strokeOpacity=".45" strokeWidth="2"/>
    </g>
    <g transform="translate(67 313) rotate(-9 40 40)" stroke="var(--brand)" strokeWidth="2.5">
      <path d="M9 9h67v65H9z" fill="var(--highlight)"/>
      <path d="M9 9h67v65H9z" fill="url(#spool-thread)"/>
      <ellipse cx="42" cy="9" rx="43" ry="12" fill="var(--paper)"/>
      <ellipse cx="42" cy="9" rx="9" ry="3" fill="var(--brand)"/>
      <path d="M0 73c23 13 60 13 84 0v11c-23 15-60 15-84 0Z" fill="var(--paper)"/>
    </g>
    <path d="M105 383c-15 34 78 59 100 36s-23-29-30-10 16 41 58 29 51-2 65 6" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round"/>
    <g transform="translate(418 332) rotate(32)" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M-5-86h10v64H-5zM-5-86l-3-17 16 0-3 17" fill="var(--paper)"/>
      <path d="M-16-22h32v70c0 22-32 22-32 0Z" fill="var(--highlight)"/>
      <path d="M-7-9v57M7-9v57" fill="none"/>
    </g>
    <g transform="translate(423 65) rotate(12)">
      <path d="m0-37 10 7 13-1 5 12 11 7-3 13 3 12-11 8-5 12-13-1-10 7-10-7-13 1-5-12-11-8 3-12-3-13 11-7 5-12 13 1Z" fill="var(--highlight)"/>
      <path d="m-13 0 9 9L15-11" stroke="var(--brand)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </g>
    <path d="M386 126c36 4 66 25 77 59m-12-9 13 11 3-17" fill="none" stroke="var(--brand)" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>;
}

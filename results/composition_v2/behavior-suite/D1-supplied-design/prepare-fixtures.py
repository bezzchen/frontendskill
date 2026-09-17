import json, pathlib, subprocess, shutil
base=pathlib.Path('/Users/bezzchen/Documents/Codex/2026-09-16/take-x20/work/v2-behavior')
repo=pathlib.Path('/Users/bezzchen/Documents/Codex/2026-09-16/take-x20/work/frontendskill-v2')
rev='12f509e61d8aa15de2bfcc54195a7def07bda0a8'
ids=['D1-supplied-design','D4-decide-for-me','D5-director-absent']
package={'name':'community-interface','version':'1.0.0','private':True,'type':'module','scripts':{'dev':'vite','build':'vite build','preview':'vite preview'},'dependencies':{'react':'19.1.1','react-dom':'19.1.1'},'devDependencies':{'vite':'7.1.5'}}
agents='''# Project environment

This is an existing React project using Vite and CSS Modules. Run `npm run dev -- --host 127.0.0.1 --port PORT` for a preview and `npm run build` for a production build. The dependencies are already installed locally. Source is in `src/`; project design/content documents are in `design/`.

For browser work, Playwright is available from `/Users/bezzchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`. The available Chromium executable is `/Users/bezzchen/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell`. Use the existing runtime rather than downloading a browser. All project changes and generated artifacts belong in this project directory.
'''
for id in ids:
 p=base/id/'fixture-original';p.mkdir(parents=True,exist_ok=True)
 for d in ['src','design','src/components']: (p/d).mkdir(parents=True,exist_ok=True)
 (p/'package.json').write_text(json.dumps(package,indent=2)+'\n')
 (p/'AGENTS.md').write_text(agents)
 (p/'index.html').write_text('<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Community workshop</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>\n')
 (p/'src/main.jsx').write_text("import React from 'react';\nimport {createRoot} from 'react-dom/client';\nimport App from './App.jsx';\nimport './tokens.css';\ncreateRoot(document.getElementById('root')).render(<App />);\n")
 (p/'.gitignore').write_text('node_modules/\ndist/\n')
 files=subprocess.check_output(['git','ls-tree','-r','--name-only',rev,'skill/creative-frontend-architect'],cwd=repo,text=True).splitlines()
 for f in files:
  dest=p/'.agents/skills/creative-frontend-architect'/pathlib.Path(f).relative_to('skill/creative-frontend-architect');dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(subprocess.check_output(['git','show',rev+':'+f],cwd=repo))

p=base/ids[0]/'fixture-original'
(p/'src/tokens.css').write_text(''':root{--paper:#FFF8E8;--ink:#302819;--ochre:#AD7218;--ochre-dark:#795012;--line:#D6BD8D;--white:#FFFFFF;--font:Arial,sans-serif;--heading:48px;--subheading:28px;--body:17px;--small:14px;--space:24px;--control-radius:0px}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:var(--body)/1.5 var(--font)}button,input{font:inherit}button,input{border-radius:var(--control-radius)}button{cursor:pointer}button:focus-visible,input:focus-visible{outline:3px solid var(--ochre-dark);outline-offset:4px}h1,h2,p{margin-top:0}@media(max-width:640px){:root{--heading:36px;--subheading:26px}}\n''')
(p/'src/App.module.css').write_text('''.shell{max-width:1120px;margin:auto;padding:32px 24px 56px}.header{border-bottom:2px solid var(--ink);padding-bottom:20px;margin-bottom:40px;display:flex;justify-content:space-between;gap:20px}.brand{font-weight:800;letter-spacing:-.03em}.intro h1{font-size:var(--heading);line-height:1.08;letter-spacing:-.04em;max-width:760px;margin-bottom:18px}.intro p{max-width:650px}.layout{display:grid;grid-template-columns:1.2fr 1fr;gap:56px;margin-top:36px}.schedule h2,.booking h2{font-size:var(--subheading);line-height:1.2}.slots{display:grid;gap:12px}.slot{width:100%;text-align:left;padding:18px;border:1px solid var(--line);background:var(--white);color:var(--ink);display:grid;gap:4px}.slot strong{font-size:20px}.slot small{font-size:var(--small)}.booking{border-top:6px solid var(--ochre);padding:24px;background:var(--white)}.label{display:grid;gap:8px;font-weight:700;margin:18px 0}.input{padding:12px;border:1px solid var(--ink);width:100%}.primary{width:100%;border:0;background:var(--ochre);color:var(--white);font-weight:700;padding:14px 18px;margin-top:12px}.note{font-size:var(--small);margin:18px 0 0}.footer{border-top:1px solid var(--line);margin-top:48px;padding-top:20px;font-size:var(--small)}@media(max-width:640px){.header{margin-bottom:28px;display:block}.header span:last-child{display:block;font-size:14px;margin-top:8px}.layout{grid-template-columns:1fr;gap:32px}.shell{padding:24px 20px 40px}}\n''')
(p/'src/slots.js').write_text("export const slots = [\n{id:'wed-print',title:'Print a tea towel',day:'Wednesday 14 October',time:'18:00–19:30',remaining:6},\n{id:'sat-stitch',title:'Visible mending',day:'Saturday 17 October',time:'10:00–11:30',remaining:4},\n{id:'sun-bind',title:'Make a pocket notebook',day:'Sunday 18 October',time:'14:00–15:30',remaining:8}\n];\n")
(p/'src/App.jsx').write_text('''import React from 'react';
import styles from './App.module.css';
import {slots} from './slots.js';
export default function App(){return <main className={styles.shell}><header className={styles.header}><span className={styles.brand}>WILLOW ROOM</span><span>Community workshops · October</span></header><section className={styles.intro}><h1>Make something.\nMake an afternoon of it.</h1><p>Small, friendly workshops for curious hands. Pick a session and save your place. All materials are included.</p></section><div className={styles.layout}><section className={styles.schedule}><h2>Choose your session</h2><div className={styles.slots}>{slots.map(slot=><button type="button" key={slot.id} className={styles.slot}><strong>{slot.title}</strong><span>{slot.day} · {slot.time}</span><small>{slot.remaining} places available</small></button>)}</div></section><section className={styles.booking} aria-labelledby="booking-title"><h2 id="booking-title">Your place at the table</h2><p>Choose a session, then tell us your name.</p><form onSubmit={event=>event.preventDefault()}><label className={styles.label}>Attendee name<input className={styles.input} name="attendee" autoComplete="name" /></label><button type="submit" className={styles.primary}>Reserve a place</button></form><p className={styles.note}>Local booking demo. No payment or message is sent.</p></section></div><footer className={styles.footer}>Willow Room · Ground-floor studio, 8 Mill Lane. Step-free entrance.</footer></main>}
''')
(p/'design/accepted-contract.md').write_text('''# Approved workshop booking design

Surface: Willow Room community workshop booking. The supplied React/CSS Modules layout, ochre palette and squared controls are approved. Preserve src/tokens.css values, type scale, content and desktop two-column/mobile stacked booking layout. design/approved-desktop.png and design/approved-mobile.png show the approved visual state; they are presentation references, not an interactive implementation.

The three slots in src/slots.js are bookable. Open implementation work: select one slot, identify it visually/accessibly, validate that a session and a nonblank attendee name are present, then show a local confirmation containing attendee and selected session/day/time. Provide a way to start another reservation. No real booking, payment or email. Preserve keyboard operation, focus and narrow layout. React and CSS Modules are settled; no animation package is needed. Implementation details are delegated and work may proceed.
''')

button="""import React from 'react';\nimport styles from './Shared.module.css';\nexport function Button({children,variant='primary',...props}){return <button className={variant==='secondary'?styles.secondary:styles.primary} {...props}>{children}</button>}\n"""
field="""import React from 'react';\nimport styles from './Shared.module.css';\nexport function Field({label,id,error,children,...props}){return <div className={styles.field}><label htmlFor={id}>{label}</label>{children||<input id={id} aria-invalid={Boolean(error)} aria-describedby={error?id+'-error':undefined} {...props}/>} {error&&<p id={id+'-error'} role=\"alert\" className={styles.error}>{error}</p>}</div>}\n"""
shared='''.primary,.secondary{font:inherit;font-weight:700;min-height:44px;padding:12px 20px;border:1px solid var(--brand);border-radius:4px;cursor:pointer}.primary{background:var(--brand);color:var(--paper)}.secondary{background:transparent;color:var(--brand)}.field{display:grid;gap:8px;margin-bottom:20px}.field label{font-weight:700}.field input,.field select,.field textarea{font:inherit;padding:12px;border:1px solid var(--muted);border-radius:4px;max-width:100%;width:100%;background:var(--surface);color:var(--ink)}.error{color:#9A321D;margin:0;font-size:14px}\n'''
for id in ids[1:]:
 p=base/id/'fixture-original'
 (p/'src/components/Button.jsx').write_text(button);(p/'src/components/Field.jsx').write_text(field);(p/'src/components/Shared.module.css').write_text(shared)

p=base/ids[1]/'fixture-original'
(p/'src/tokens.css').write_text(''':root{--brand:#383B80;--paper:#FAF5E9;--ink:#24264F;--muted:#75769A;--surface:#FFFFFF;--line:#D5D1E4;--highlight:#E8AE50;--radius:4px;--font:Arial,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.5 var(--font)}button,input,select,textarea{font:inherit}a{color:inherit}:focus-visible{outline:3px solid var(--highlight);outline-offset:4px}h1,h2,p{margin-top:0}\n''')
(p/'src/App.module.css').write_text('.shell{max-width:1120px;margin:auto;padding:24px}.header{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line);padding-bottom:20px}.nav{display:flex;gap:20px}.content{padding:48px 0}.content h1{font-size:40px;line-height:1.1}@media(max-width:600px){.header{display:block}.nav{margin-top:16px;flex-wrap:wrap}.content h1{font-size:34px}}\n')
(p/'src/App.jsx').write_text('''import React from 'react';
import styles from './App.module.css';
import {Button} from './components/Button.jsx';
import {Field} from './components/Field.jsx';
export default function App(){const preferences=location.pathname==='/preferences';return <main className={styles.shell}><header className={styles.header}><strong>Round Again · Repair co-op</strong><nav className={styles.nav}><a href="/membership">Membership</a><a href="/preferences">Notification preferences</a></nav></header><section className={styles.content}><h1>{preferences?'Notification preferences':'Good things deserve another chapter.'}</h1><p>{preferences?'Choose the news you want from the co-op.':'Membership keeps shared tools, shared skills and patient repair within reach.'}</p><p>Implementation is in progress.</p></section></main>}
''')
(p/'src/content.js').write_text("export const membership={name:'Round Again repair co-op',price:'£8 per month',benefits:['A monthly repair evening with shared tools','Skill swaps led by fellow members','A say in which tools and projects we support'],promise:'Mend what you have. Learn what you can. Share what you know.'};\nexport const initialPreferences={displayName:'Avery',repairEvenings:true,skillSwaps:true,monthlyDigest:false};\n")
(p/'design/project-decisions.md').write_text('''# Round Again project decisions

The indigo/cream tokens in src/tokens.css and existing src/components/Button.jsx and Field.jsx are established shared components. Use them on both /membership and /preferences. Visual identity carries across the routes; public membership may be expressive and preference controls should be quiet. Remaining visual and technical choices are delegated. No concept approval is needed.

Membership content is in src/content.js. Primary action: join the local demo member list with a name and valid email, show a confirmation, and make clear this is a prototype with no payment or external submission. Link to notification preferences.

Preferences begin with initialPreferences. Allow editing display name and three notification booleans, validate nonblank display name, save locally and display confirmation. Local storage may be used for saved preferences; keep the user's changes on a validation error. No account backend or new dependencies are required.
''')

p=base/ids[2]/'fixture-original'
(p/'src/tokens.css').write_text(''':root{--brand:#455C3C;--paper:#EDECE5;--ink:#263323;--muted:#777F70;--surface:#FFFFFF;--line:#C8CEBF;--highlight:#B6CC97;--radius:4px;--font:Arial,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.5 var(--font)}button,input{font:inherit}:focus-visible{outline:3px solid var(--brand);outline-offset:4px}h1,h2,p{margin-top:0}\n''')
(p/'src/App.module.css').write_text('.shell{max-width:1080px;margin:auto;padding:32px 24px}.header{border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:40px}.shell h1{font-size:40px;line-height:1.1}@media(max-width:600px){.shell h1{font-size:32px}}\n')
(p/'src/App.jsx').write_text('''import React from 'react';
import styles from './App.module.css';
import {Button} from './components/Button.jsx';
import {Field} from './components/Field.jsx';
export default function App(){return <main className={styles.shell}><header className={styles.header}><strong>Moss Lane Garden · Neighbors growing together</strong></header><h1>Make room for something good.</h1><p>Choose a volunteer shift at our community garden.</p><p>The sign-up flow is ready to implement.</p></main>}
''')
(p/'src/shifts.js').write_text("export const shifts=[{id:'morning',name:'Morning planting',date:'Saturday 24 October',time:'09:00–11:00',capacity:12,remaining:4},{id:'afternoon',name:'Path and bed care',date:'Saturday 24 October',time:'13:00–15:00',capacity:10,remaining:6},{id:'compost',name:'Compost crew',date:'Sunday 25 October',time:'10:00–12:00',capacity:8,remaining:0}];\n")
(p/'design/project-context.md').write_text('''# Moss Lane volunteer shifts

Use the existing moss/stone brand tokens and accessible Button/Field components. The local shift dataset is in src/shifts.js. Show available places and total capacity for each shift; full shifts cannot accept a signup. Require selection of an available shift and a nonblank contact name, then confirm the chosen shift, date/time and name. Let the visitor begin another signup. This is a local prototype; do not send any external signup or collect payment. Remaining layout/details are delegated.
''')
print('Prepared source fixtures at',base)

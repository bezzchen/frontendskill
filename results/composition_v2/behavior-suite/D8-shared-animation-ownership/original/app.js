const callbacks = new Map();
let pendingFrame = null;
let sequence = 0;
let schedulerTicks = 0;
const counts = {metronome: 0, waveform: 0};
const settings = {metronome: 84, waveform: 36};
const hidden = {metronome: false, waveform: false};
const mounted = new Map();

function tick(time) {
  pendingFrame = null;
  schedulerTicks += 1;
  for (const callback of callbacks.values()) callback(time);
  pendingFrame = requestAnimationFrame(tick);
}
const scheduler = {
  subscribe(name, callback) {
    const id = `${name}:${++sequence}`;
    callbacks.set(id, callback);
    if (pendingFrame === null) pendingFrame = requestAnimationFrame(tick);
    return () => callbacks.delete(id);
  }
};

function mount(name) {
  const section = document.createElement('section');
  section.className = 'instrument';
  section.id = name;
  section.hidden = hidden[name];
  const isMet = name === 'metronome';
  section.innerHTML = `<h2>${isMet ? 'Metronome' : 'Waveform'}</h2><p>${isMet ? 'Follow the pendulum.' : 'Follow the repeating curve.'}</p><svg viewBox="0 0 600 145" aria-hidden="true">${isMet ? '<path d="M230 130L300 15L370 130Z" fill="#e1ebe4" stroke="#567369"/><g id="pendulum"><path d="M300 130L300 24" stroke="#855026" stroke-width="5"/><circle cx="300" cy="42" r="9" fill="#855026"/></g>' : '<path id="wave-path" fill="none" stroke="#2c7866" stroke-width="3"/>'}</svg><label>${isMet ? 'Tempo' : 'Amplitude'}<input type="range" min="${isMet ? 40 : 8}" max="${isMet ? 180 : 60}" value="${settings[name]}" aria-label="${isMet ? 'Tempo' : 'Amplitude'}"><output class="readout">${settings[name]}</output></label>`;
  section.querySelector('input').addEventListener('input', event => {
    settings[name] = Number(event.target.value);
    section.querySelector('output').textContent = settings[name];
  });
  document.getElementById(`${name}-slot`).append(section);
  const unsubscribe = scheduler.subscribe(name, time => {
    counts[name] += 1;
    if (isMet) {
      section.querySelector('#pendulum').setAttribute('transform', `rotate(${Math.sin(time / 60000 * settings[name] * Math.PI * 2) * 25} 300 130)`);
    } else {
      const points = [];
      for (let x = 0; x <= 600; x += 8) points.push(`${x === 0 ? 'M' : 'L'}${x},${72 + Math.sin(x / 45 + time / 500) * settings[name]}`);
      section.querySelector('#wave-path').setAttribute('d', points.join(' '));
    }
  });
  mounted.set(name, {section, unsubscribe});
}
for (const name of ['metronome', 'waveform']) {
  mount(name);
  document.getElementById(`toggle-${name}`).addEventListener('click', event => {
    hidden[name] = !hidden[name];
    if (mounted.has(name)) mounted.get(name).section.hidden = hidden[name];
    event.target.textContent = `${hidden[name] ? 'Show' : 'Hide'} ${name}`;
  });
  document.getElementById(`mount-${name}`).addEventListener('click', event => {
    if (mounted.has(name)) {
      mounted.get(name).section.remove();
      mounted.delete(name);
      event.target.textContent = `Mount ${name}`;
    } else {
      mount(name);
      event.target.textContent = `Unmount ${name}`;
    }
  });
}
window.instrumentDiagnostics = {
  snapshot() {
    return {
      documentHidden: document.hidden,
      visibilityState: document.visibilityState,
      schedulerPending: pendingFrame !== null,
      schedulerTicks,
      subscribers: [...callbacks.keys()],
      counters: {...counts},
      settings: {...settings},
      hidden: {...hidden},
      mounted: [...mounted.keys()]
    };
  }
};

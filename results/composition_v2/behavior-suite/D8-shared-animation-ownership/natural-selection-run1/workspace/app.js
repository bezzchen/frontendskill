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
  // A callback may unsubscribe itself or another subscriber during this frame.
  for (const [id, callback] of [...callbacks]) {
    if (callbacks.has(id)) callback(time);
  }
  schedule();
}
function schedule() {
  if (callbacks.size > 0 && pendingFrame === null) {
    pendingFrame = requestAnimationFrame(tick);
  }
}
const scheduler = {
  subscribe(name, callback) {
    const id = `${name}:${++sequence}`;
    callbacks.set(id, callback);
    schedule();
    return () => {
      callbacks.delete(id);
      if (callbacks.size === 0 && pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = null;
      }
    };
  }
};

function mount(name) {
  if (mounted.has(name)) return;
  const section = document.createElement('section');
  section.className = 'instrument';
  section.id = name;
  section.hidden = hidden[name];
  const isMet = name === 'metronome';
  section.innerHTML = `<h2>${isMet ? 'Metronome' : 'Waveform'}</h2><p>${isMet ? 'Follow the pendulum.' : 'Follow the repeating curve.'}</p><svg viewBox="0 0 600 145" aria-hidden="true">${isMet ? '<path d="M230 130L300 15L370 130Z" fill="#e1ebe4" stroke="#567369"/><g id="pendulum"><path d="M300 130L300 24" stroke="#855026" stroke-width="5"/><circle cx="300" cy="42" r="9" fill="#855026"/></g>' : '<path id="wave-path" fill="none" stroke="#2c7866" stroke-width="3"/>'}</svg><label>${isMet ? 'Tempo' : 'Amplitude'}<input type="range" min="${isMet ? 40 : 8}" max="${isMet ? 180 : 60}" value="${settings[name]}" aria-label="${isMet ? 'Tempo' : 'Amplitude'}"><output class="readout">${settings[name]}</output></label>`;
  const input = section.querySelector('input');
  const output = section.querySelector('output');
  const graphic = section.querySelector(isMet ? '#pendulum' : '#wave-path');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inViewport = false;
  let disposed = false;
  let unsubscribe = null;
  let elapsed = 0;
  let previousTime = null;

  function onInput(event) {
    settings[name] = Number(event.target.value);
    output.textContent = settings[name];
    render(motion.matches ? 0 : elapsed);
  }
  function render(time) {
    if (isMet) {
      graphic.setAttribute('transform', `rotate(${Math.sin(time / 60000 * settings[name] * Math.PI * 2) * 25} 300 130)`);
    } else {
      const points = [];
      for (let x = 0; x <= 600; x += 8) points.push(`${x === 0 ? 'M' : 'L'}${x},${72 + Math.sin(x / 45 + time / 500) * settings[name]}`);
      graphic.setAttribute('d', points.join(' '));
    }
  }
  function animate(time) {
    counts[name] += 1;
    if (previousTime !== null) elapsed += time - previousTime;
    previousTime = time;
    render(elapsed);
  }
  function syncActivity() {
    if (disposed) return;
    const active = !hidden[name] && inViewport && !document.hidden && !motion.matches;
    if (active && unsubscribe === null) {
      unsubscribe = scheduler.subscribe(name, animate);
    } else if (!active && unsubscribe !== null) {
      unsubscribe();
      unsubscribe = null;
      previousTime = null;
    }
    if (motion.matches) render(0);
  }
  const observer = new IntersectionObserver(entries => {
    if (disposed) return;
    inViewport = entries[entries.length - 1].isIntersecting;
    syncActivity();
  });
  input.addEventListener('input', onInput);
  document.addEventListener('visibilitychange', syncActivity);
  motion.addEventListener('change', syncActivity);
  document.getElementById(`${name}-slot`).append(section);
  render(0);
  observer.observe(section);
  mounted.set(name, {
    section,
    setHidden(value) {
      section.hidden = value;
      // Refresh intersection on show, including rapid hide/show before the
      // observer has delivered its next notification.
      const rect = section.getBoundingClientRect();
      inViewport = !value && rect.bottom > 0 && rect.top < window.innerHeight &&
        rect.right > 0 && rect.left < window.innerWidth;
      syncActivity();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (unsubscribe !== null) unsubscribe();
      unsubscribe = null;
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncActivity);
      motion.removeEventListener('change', syncActivity);
      input.removeEventListener('input', onInput);
      section.remove();
    }
  });
}
for (const name of ['metronome', 'waveform']) {
  mount(name);
  document.getElementById(`toggle-${name}`).addEventListener('click', event => {
    hidden[name] = !hidden[name];
    if (mounted.has(name)) mounted.get(name).setHidden(hidden[name]);
    event.target.textContent = `${hidden[name] ? 'Show' : 'Hide'} ${name}`;
  });
  document.getElementById(`mount-${name}`).addEventListener('click', event => {
    if (mounted.has(name)) {
      mounted.get(name).dispose();
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

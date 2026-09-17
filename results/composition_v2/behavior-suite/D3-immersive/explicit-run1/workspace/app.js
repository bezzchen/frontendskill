(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const passage = $('passage'), bearing = $('bearing');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = media.matches;
  let phaseIndex = 0;
  let lastAnnouncement = '';
  // Local copy keeps the encounter usable if content.json cannot be fetched.
  let acts = [
    { id: 'arrival', title: 'Arrival', text: 'Iona appears above the eastern ridge. The faint trail marks where this wandering moon has crossed our field of view.' },
    { id: 'alignment', title: 'Alignment', text: 'At the center of its passage, Iona meets the station’s reference line. Shift your view to compare the moon and the fixed guide stars.' },
    { id: 'departure', title: 'Departure', text: 'The moon leaves a fading arc toward the western dark. Its passage is brief, but the reference stars remain for the next observer.' }
  ];
  const captions = ['Approaching the eastern ridge', 'Two paths. One point of reference.', 'A last trace in the western dark'];
  const nextLabels = ['Find alignment', 'Follow the departure', 'Witness it again'];
  const scene = new window.MoonwardScene($('scene'), { reducedMotion, onBearing: value => {
    bearing.value = value; update();
  } });
  // Read-only diagnostics let lifecycle checks distinguish this renderer's work.
  window.moonwardDiagnostics = () => ({ ...scene.stats, reducedMotion, passage: Number(passage.value), bearing: Number(bearing.value), destroyed: scene.destroyed });

  function update() {
    const progress = Number(passage.value), angle = Number(bearing.value);
    phaseIndex = progress < 34 ? 0 : progress < 67 ? 1 : 2;
    const act = acts[phaseIndex], number = String(phaseIndex + 1).padStart(2, '0');
    const aligned = Math.abs(progress - 50) <= 1 && Math.abs(angle) <= 1;
    $('act-number').textContent = number;
    $('act-title').textContent = act.title;
    $('act-text').textContent = aligned ? 'For a moment, everything meets. Iona rests on the station’s reference line, held between the guide stars. This is your point of alignment.' : act.text;
    $('passage-value').textContent = `${number} / ${act.title}`;
    $('bearing-value').textContent = `${angle > 0 ? '+' : angle < 0 ? '−' : ''}${Math.abs(angle)}°`;
    passage.setAttribute('aria-valuetext', `${progress} percent, ${act.title}`);
    bearing.setAttribute('aria-valuetext', `${Math.abs(angle)} degrees ${angle < 0 ? 'west' : angle > 0 ? 'east' : ', centered'}`);
    $('scene-caption').textContent = aligned ? 'Reference lock. You are here.' : captions[phaseIndex];
    $('tracking-status').textContent = aligned ? 'Reference locked' : phaseIndex === 2 ? 'Until our paths cross again' : phaseIndex === 1 ? 'Seeking alignment' : 'Visitor in view';
    $('bearing-help').textContent = phaseIndex === 1 ? aligned ? 'Iona and the guide stars align.' : 'Choose Center at mid-passage to align.' : 'Shift your place among the stars.';
    $('next-act').replaceChildren(document.createTextNode(`${nextLabels[phaseIndex]} `));
    const arrow = document.createElement('span');arrow.textContent = phaseIndex === 2 ? '↺' : '↗';arrow.setAttribute('aria-hidden', 'true');$('next-act').append(arrow);
    passage.style.setProperty('--fill', `${progress}%`);
    bearing.style.setProperty('--fill', `${(angle + 30) / 60 * 100}%`);
    document.querySelectorAll('[data-phase]').forEach((button, index) => button.setAttribute('aria-pressed', String(index === phaseIndex)));
    const description = `Iona: ${act.title}. ${aligned ? 'Reference locked.' : act.text} Telescope bearing ${angle} degrees.`;
    $('scene').setAttribute('aria-label', description);
    const announcement = `${act.title}. ${aligned ? 'Reference locked. Iona and the guide stars align.' : act.text}`;
    if (announcement !== lastAnnouncement) { $('encounter-status').textContent = announcement;lastAnnouncement = announcement; }
    scene.setState(progress, angle);
  }

  passage.addEventListener('input', update);
  bearing.addEventListener('input', update);
  document.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => {
    passage.value = button.dataset.phase;update();revealMobileTelescope();
  }));
  $('next-act').addEventListener('click', () => { passage.value = [50, 100, 0][phaseIndex];update(); });
  $('center-view').addEventListener('click', () => { bearing.value = 0;update(); });

  function applyMotion() {
    document.documentElement.dataset.motion = reducedMotion ? 'off' : 'on';
    $('motion-toggle').setAttribute('aria-pressed', String(reducedMotion));
    $('motion-toggle').setAttribute('aria-label', reducedMotion ? 'Enable scene motion' : 'Disable scene motion');
    $('motion-label').textContent = reducedMotion ? 'Motion off' : 'Motion on';
    scene.setReducedMotion(reducedMotion);
  }
  $('motion-toggle').addEventListener('click', () => { reducedMotion = !reducedMotion;applyMotion(); });
  media.addEventListener('change', event => { reducedMotion = event.matches;applyMotion(); });

  const dialog = $('help-dialog');
  $('help-open').addEventListener('click', () => dialog.showModal());
  $('help-close').addEventListener('click', () => dialog.close());
  $('help-start').addEventListener('click', () => { dialog.close();passage.focus(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  function revealMobileTelescope() {
    if (window.innerWidth > 700) return;
    const top = $('sky').getBoundingClientRect().top + window.scrollY + 280;
    window.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' });
  }
  document.querySelector('.observe-link').addEventListener('click', event => {
    // Native anchor scroll plus explicit focus makes the telescope entry useful with a keyboard.
    $('instruments').focus({ preventScroll: true });
    if (window.innerWidth <= 700) { event.preventDefault();revealMobileTelescope(); }
  });
  fetch('content.json').then(response => {
    if (!response.ok) throw new Error('Content unavailable');
    return response.json();
  }).then(content => {
    if (Array.isArray(content.acts) && content.acts.length === 3 && content.acts.every(act => typeof act.title === 'string' && typeof act.text === 'string')) {
      acts = content.acts;update();
    }
  }).catch(() => { /* The complete embedded local copy remains available. */ });
  applyMotion();update();
})();

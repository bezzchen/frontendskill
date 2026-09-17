'use strict';
document.getElementById('booking-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const message=document.getElementById('confirmation');message.textContent=`Thanks, ${form.elements.name.value.trim()}. Your place is reserved for ${form.elements.session.value}.`;message.hidden=false;message.tabIndex=-1;message.focus();});

// Progressive enhancement: the illustration is visible without JavaScript.
// Finish this one-shot reveal when inactive; there is no background animation loop.
const paperReveal = document.getElementById('paper-reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (paperReveal && !reducedMotion.matches && !document.hidden &&
    'IntersectionObserver' in window) {
  let finishTimer;
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) finishReveal();
  });

  function finishReveal() {
    paperReveal.classList.remove('is-opening');
    clearTimeout(finishTimer);
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', finishReveal);
    reducedMotion.removeEventListener('change', finishReveal);
    paperReveal.removeEventListener('animationend', onAnimationEnd);
  }

  function onVisibilityChange() {
    if (document.hidden) finishReveal();
  }

  function onAnimationEnd(event) {
    if (event.target.classList.contains('paper-fold--right')) finishReveal();
  }

  observer.observe(paperReveal);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', finishReveal);
  reducedMotion.addEventListener('change', finishReveal);
  paperReveal.addEventListener('animationend', onAnimationEnd);
  paperReveal.classList.add('is-opening');
  // Restore the static state even if user styles suppress animation events.
  finishTimer = setTimeout(finishReveal, 1800);
}

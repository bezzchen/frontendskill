import { ObservatoryScene } from './scene.js';

const $ = selector => document.querySelector(selector);
const passage = $('#passage'), viewpoint = $('#viewpoint');
let acts = [
  {id:'arrival',title:'Arrival',text:'Iona appears above the eastern ridge. The faint trail marks where this wandering moon has crossed our field of view.'},
  {id:'alignment',title:'Alignment',text:'At the center of its passage, Iona meets the station’s reference line. Shift your view to compare the moon and the fixed guide stars.'},
  {id:'departure',title:'Departure',text:'The moon leaves a fading arc toward the western dark. Its passage is brief, but the reference stars remain for the next observer.'}
];
let currentAct = -1;
const scene = new ObservatoryScene($('#sky'), $('.observatory'), value => {
  passage.value = String(Math.round(value));updateContent(value);
}, () => updatePlayButton(false));

function updatePlayButton(playing) {
  $('#play-label').textContent = playing ? 'Pause the passage' : 'Let it wander';
  $('#play-icon').textContent = playing ? 'Ⅱ' : '▷';
  $('#play').setAttribute('aria-pressed', String(playing));
}
function updateContent(value = Number(passage.value)) {
  const act = value < 34 ? 0 : value <= 66 ? 1 : 2;
  $('#passage-value').textContent = `${Math.round(value)}%`;
  passage.style.setProperty('--fill', `${value}%`);
  passage.setAttribute('aria-valuetext', `${Math.round(value)} percent, ${acts[act].title}`);
  const view = Number(viewpoint.value);
  $('#view-value').textContent = `${view > 0 ? '+' : ''}${view}°`;
  viewpoint.style.setProperty('--fill', `${(view+30)/60*100}%`);
  viewpoint.setAttribute('aria-valuetext', `${view} degrees`);
  $('#fov').textContent = `${42 + Math.abs(view)}° ${String(Math.round(value / 100 * 59)).padStart(2,'0')}′`;
  $('#observation-status').textContent = Math.abs(value-50)<1.5 && view===0 ? 'In alignment. A moment shared.' : act===2 ? 'Every departure leaves a little wonder.' : 'You are here. Iona is passing.';
  if(act !== currentAct) {
    currentAct = act;
    $('#act-title').textContent = `The ${acts[act].title.toLowerCase()}.`;
    $('#act-copy').textContent = acts[act].text;
    $('#act-number').textContent = `0${act+1} / 03`;
    $('#announcement').textContent = `${acts[act].title}. ${acts[act].text}`;
    document.querySelectorAll('[data-phase]').forEach((button, i) => button.setAttribute('aria-pressed',String(i === act)));
  }
}
function updateScene() {updateContent();scene.set(Number(passage.value),Number(viewpoint.value));}
passage.addEventListener('input', () => {scene.pause();updateScene();});
viewpoint.addEventListener('input', updateScene);
document.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => {
  scene.pause();passage.value=button.dataset.phase;updateScene();
}));
$('#guides').addEventListener('click', () => {
  const enabled=$('#guides').getAttribute('aria-pressed') !== 'true';
  $('#guides').setAttribute('aria-pressed',String(enabled));scene.setGuides(enabled);
});
$('#reset').addEventListener('click', () => {scene.pause();passage.value='12';viewpoint.value='0';updateScene();});
$('#play').addEventListener('click', () => {
  if(scene.playing){scene.pause();return;}
  if(scene.motion.matches){
    // Reduced-motion playback is explicit, discrete chapter advancement.
    passage.value = Number(passage.value)<34 ? '50' : Number(passage.value)<=66 ? '90' : '12';
    updateScene();return;
  }
  if(Number(passage.value)>=100){passage.value='0';updateScene();}
  updatePlayButton(scene.play());
});
function updateMotionLabel(){
  if(scene.motion.matches){$('#play-label').textContent='Next chapter';$('#play-icon').textContent='›';}
  else updatePlayButton(scene.playing);
}
scene.motion.addEventListener('change', updateMotionLabel);
// Any normal pause must preserve the reduced-motion control's descriptive name.
scene.onPause=()=>{updatePlayButton(false);updateMotionLabel();};
const guide=$('#field-guide');
document.querySelectorAll('.guide-open').forEach(button=>button.addEventListener('click',()=>{scene.pause();guide.showModal();}));
$('#guide-close').addEventListener('click',()=>guide.close());
guide.addEventListener('click',event=>{if(event.target===guide){const r=guide.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)guide.close();}});
updateScene();updateMotionLabel();
fetch('./content.json').then(response=>{if(!response.ok)throw new Error('Local notes unavailable');return response.json();}).then(content=>{
  if(Array.isArray(content.acts)&&content.acts.length===3&&content.acts.every(act=>typeof act.title==='string'&&typeof act.text==='string')){acts=content.acts;currentAct=-1;updateContent();}
}).catch(()=>{/* The in-page notes preserve the full encounter if local content is unavailable. */});
// Expose read-only lifecycle diagnostics for local browser verification.
Object.defineProperty(window,'observatoryState',{get:()=>({playing:scene.playing,frameScheduled:scene.frame!==null,active:scene.active,phase:scene.phase,view:scene.view,reducedMotion:scene.motion.matches})});

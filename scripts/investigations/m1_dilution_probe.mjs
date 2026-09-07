// Reproduces the M1 dilution defect in isolation, then the repaired behaviour.
// 1000 real frame intervals, 2% of them 50ms hitches, 60fps otherwise.
const N = 1000, HITCH_RATE = 0.02, GOOD = 16.7, BAD = 50;
const realIntervals = Array.from({length:N}, (_,i) => (i % Math.round(1/HITCH_RATE) === 0 ? BAD : GOOD));
const stamps = realIntervals.reduce((a,d)=>(a.push((a.at(-1)??0)+d),a),[]);

function oldWrapper(callbacksPerFrame){
  let last = 0; const frames=[];
  for (const t of stamps) for (let k=0;k<callbacksPerFrame;k++){ if(last) frames.push(t-last); last=t; }
  return frames;
}
function newWrapper(callbacksPerFrame){
  let last=0, lastT=null; const frames=[];
  for (const t of stamps) for (let k=0;k<callbacksPerFrame;k++){
    if (t !== lastT) { if(last) frames.push(t-last); last=t; lastT=t; }
  }
  return frames;
}
const stat = (f) => {
  const s=[...f].sort((a,b)=>a-b);
  return { samples:f.length, p50:+s[Math.floor(s.length*0.5)].toFixed(1),
           hitchPct:+(100*f.filter(x=>x>32).length/f.length).toFixed(4) };
};
for (const cpf of [1,2,3]) {
  const o=stat(oldWrapper(cpf)), n=stat(newWrapper(cpf));
  console.log(`callbacks/frame=${cpf}`);
  console.log(`   OLD  samples=${o.samples} p50=${o.p50}ms hitch=${o.hitchPct}%  -> ${o.hitchPct<1?'PASS (desktop <1%)':'fail'}`);
  console.log(`   NEW  samples=${n.samples} p50=${n.p50}ms hitch=${n.hitchPct}%  -> ${n.hitchPct<1?'PASS':'FAIL (correct)'}`);
}
console.log(`\nground truth: ${(100*realIntervals.filter(x=>x>32).length/realIntervals.length).toFixed(2)}% hitch`);

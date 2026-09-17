// One canvas owns the sky. Texture generation is deterministic and runs once.
const TAU = Math.PI * 2;
function randomGenerator(seed) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

function makeMoon() {
  const random = randomGenerator(18841);
  const size = 768;
  const texture = document.createElement('canvas');
  texture.width = texture.height = size;
  const ctx = texture.getContext('2d');
  const image = ctx.createImageData(size, size);
  const noiseLayers = [5, 12, 26, 60, 140, 320].map((count, i) => ({
    count, amplitude: [36, 23, 16, 10, 7, 5][i],
    values: Float32Array.from({ length: (count + 1) ** 2 }, () => random())
  }));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let value = 157;
      for (const layer of noiseLayers) {
        const xx = x / size * layer.count, yy = y / size * layer.count;
        const ix = Math.floor(xx), iy = Math.floor(yy);
        const fx = xx - ix, fy = yy - iy;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const stride = layer.count + 1;
        const a = layer.values[iy * stride + ix], b = layer.values[iy * stride + ix + 1];
        const c = layer.values[(iy + 1) * stride + ix], d = layer.values[(iy + 1) * stride + ix + 1];
        value += ((a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy - .5) * layer.amplitude * 2;
      }
      const index = (y * size + x) * 4;
      image.data[index] = value * 1.06; image.data[index + 1] = value * 1.045;
      image.data[index + 2] = value; image.data[index + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  // Broad ancient basins beneath several generations of impact craters.
  for (let i = 0; i < 35; i++) {
    const x = random() * size, y = random() * size, radius = 20 + random() * 120;
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, 'rgba(35,44,46,.25)'); g.addColorStop(.55, 'rgba(55,61,62,.16)'); g.addColorStop(1, 'rgba(70,73,73,0)');
    ctx.fillStyle = g; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  for (let i = 0; i < 1250; i++) {
    const x = random() * size, y = random() * size;
    const radius = i < 55 ? 9 + random() * 25 : 1.1 + Math.pow(random(), 3) * 13;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, .78 + random() * .22);
    const outer = ctx.createRadialGradient(-radius * .12, -radius * .16, radius * .4, 0, 0, radius * 1.25);
    outer.addColorStop(0, 'rgba(30,35,37,.02)'); outer.addColorStop(.57, 'rgba(230,225,202,.01)');
    outer.addColorStop(.74, 'rgba(235,232,215,.36)'); outer.addColorStop(1, 'rgba(220,216,200,0)');
    ctx.fillStyle = outer; ctx.beginPath();ctx.arc(0, 0, radius * 1.25, 0, TAU);ctx.fill();
    const inner = ctx.createRadialGradient(radius * .28, radius * .3, 0, 0, 0, radius);
    inner.addColorStop(0, 'rgba(186,184,171,.10)');inner.addColorStop(.65, 'rgba(70,76,76,.28)');inner.addColorStop(.92, 'rgba(36,45,47,.52)');inner.addColorStop(1, 'rgba(46,54,55,.04)');
    ctx.fillStyle = inner;ctx.beginPath();ctx.arc(0, 0, radius, 0, TAU);ctx.fill();ctx.restore();
  }
  const flat = ctx.getImageData(0, 0, size, size).data;
  const moon = document.createElement('canvas');moon.width = moon.height = 720;
  const moonCtx = moon.getContext('2d'), sphere = moonCtx.createImageData(720, 720);
  for (let y = 0; y < 720; y++) for (let x = 0; x < 720; x++) {
    const nx = (x - 359.5) / 358, ny = (y - 359.5) / 358, length = nx * nx + ny * ny;
    if (length > 1) continue;
    const nz = Math.sqrt(1 - length);
    const u = .5 + Math.atan2(nx, nz) / TAU;
    const v = .5 + Math.asin(ny) / Math.PI;
    const source = (Math.min(size - 1, Math.floor(v * size)) * size + Math.min(size - 1, Math.floor(u * size))) * 4;
    const shade = Math.max(.025, (-nx * .54 - ny * .25 + nz * .78));
    const light = .13 + shade * 1.25;
    const target = (y * 720 + x) * 4;
    for (let c = 0; c < 3; c++) sphere.data[target + c] = Math.min(248, flat[source + c] * light);
    sphere.data[target + 3] = Math.min(255, (1 - length) * 18000);
  }
  moonCtx.putImageData(sphere, 0, 0);return moon;
}

export class ObservatoryScene {
  constructor(canvas, surface, onPlayback, onPause) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');this.surface = surface;
    this.moon = makeMoon();this.phase = this.targetPhase = .12;this.view = this.targetView = 0;
    this.guides = true;this.playing = false;this.active = true;this.frame = null;
    this.onPlayback = onPlayback; this.onPause = onPause;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    const random = randomGenerator(9913);
    this.stars = Array.from({length:220}, () => ({x:random(),y:random(),r:.25 + random() * .8,a:.13 + random() * .52}));
    this.resizeObserver = new ResizeObserver(() => this.resize());this.resizeObserver.observe(surface);
    this.observer = new IntersectionObserver(entries => {
      this.active = entries[0].isIntersecting;
      if (!this.active) this.pause(); else this.requestDraw();
    }, {threshold:0});this.observer.observe(canvas);
    document.addEventListener('visibilitychange', () => {
      if(document.hidden) this.pause();else this.requestDraw();
    });
    this.motion.addEventListener('change', () => {this.pause();this.requestDraw();});
    this.resize();
  }
  resize() {
    this.width = this.surface.clientWidth;
    this.mobile = this.width <= 760;
    this.height = this.mobile ? 300 : this.surface.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * dpr);this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr,0,0,dpr,0,0);
    const observedSurface=this.mobile?this.canvas:this.surface.querySelector('.encounter');
    if(this.observedSurface!==observedSurface){this.observer.disconnect();this.observer.observe(observedSurface);this.observedSurface=observedSurface;}
    this.requestDraw();
  }
  set(phase, view) {this.targetPhase = phase / 100;this.targetView = view / 30;this.requestDraw();}
  setGuides(value) {this.guides = value;this.requestDraw();}
  play() { if(this.motion.matches) return false;this.playing=true;this.lastTime=0;this.requestDraw();return true; }
  pause() {this.playing=false;if(this.frame !== null)cancelAnimationFrame(this.frame);this.frame=null;this.lastTime=0;this.onPause();}
  requestDraw() {if(this.frame === null && this.active && !document.hidden)this.frame=requestAnimationFrame(t=>this.tick(t));}
  tick(time) {
    this.frame=null;
    if(!this.active || document.hidden)return;
    if(this.playing) {
      const delta = this.lastTime ? Math.min(time - this.lastTime, 60) : 0;
      this.targetPhase = Math.min(1, this.targetPhase + delta / 42000);
      this.onPlayback(this.targetPhase * 100);
      if(this.targetPhase >= 1) {this.playing=false;this.onPause();}
    }
    this.lastTime=time;
    const factor=this.motion.matches ? 1 : .12;
    this.phase += (this.targetPhase-this.phase)*factor;this.view+=(this.targetView-this.view)*factor;
    if(Math.abs(this.phase-this.targetPhase)<.0001)this.phase=this.targetPhase;
    if(Math.abs(this.view-this.targetView)<.0001)this.view=this.targetView;
    this.draw();
    if(this.playing || this.phase !== this.targetPhase || this.view !== this.targetView)this.requestDraw();
  }
  point(p) {
    const w=this.width, hero=this.surface.querySelector('.encounter');
    if(this.mobile) return {x:w*(.38+.24*p)+this.view*20,y:158-22*Math.sin(p*Math.PI)+this.view*12};
    const h=hero.clientHeight,top=115;
    return {x:w*(.59+.30*p)+this.view*45,y:top+h*(.60-.18*Math.sin(p*Math.PI))+this.view*35};
  }
  draw() {
    const c=this.ctx,w=this.width,h=this.height,hero=this.surface.querySelector('.encounter');
    const sceneBottom=this.mobile?300:115+hero.clientHeight;
    c.clearRect(0,0,w,h);c.fillStyle='#080f14';c.fillRect(0,0,w,h);
    const haze=c.createRadialGradient(w*.68,sceneBottom*.52,10,w*.68,sceneBottom*.52,w*.61);
    haze.addColorStop(0,'#1a2c35');haze.addColorStop(.5,'#101c24');haze.addColorStop(1,'#080f14');
    c.fillStyle=haze;c.fillRect(0,0,w,sceneBottom);
    for(const star of this.stars){c.globalAlpha=star.a;c.fillStyle='#d6dedc';c.beginPath();c.arc(star.x*w,star.y*sceneBottom,star.r,0,TAU);c.fill();}c.globalAlpha=1;
    // Soft, concentric field geometry suggests the instrument's large spherical volume.
    c.save();c.translate(w*.69,sceneBottom*.52);c.rotate(-.34+this.view*.11);
    c.strokeStyle='rgba(149,173,182,.09)';c.lineWidth=.6;
    [1,1.18,1.65].forEach(scale=>{c.beginPath();c.ellipse(0,0,w*.32*scale,(this.mobile?88:145)*scale,0,0,TAU);c.stroke();});
    c.restore();
    if(this.guides){
      c.strokeStyle='rgba(158,177,181,.16)';c.lineWidth=.7;c.setLineDash([2,6]);
      const alignment=this.point(.5);alignment.x-=this.view*(this.mobile?20:45);c.beginPath();c.moveTo(alignment.x,this.mobile?18:147);c.lineTo(alignment.x,sceneBottom-46);c.stroke();c.setLineDash([]);
      const points=this.mobile?[[.10,62],[.82,30],[.87,262]]:[[.43,204],[.88,185],[.93,sceneBottom-102],[.47,sceneBottom-102]];
      points.forEach(([x,y],index)=>{x*=w;c.strokeStyle='rgba(191,199,192,.44)';c.beginPath();c.moveTo(x-5,y);c.lineTo(x+5,y);c.moveTo(x,y-5);c.lineTo(x,y+5);c.stroke();c.font='8px monospace';c.fillStyle='#8b9ba2';c.fillText(['ε 14','τ 08','κ 26','ν 03'][index],x+11,y+3);});
      if(!this.mobile){c.fillStyle='#768891';c.font='8px monospace';c.fillText('N',w*.69,151);c.fillText('E',w*.39,sceneBottom*.74);c.fillText('W',w*.95,sceneBottom*.41);}
    }
    c.lineWidth=.8;c.strokeStyle='rgba(208,184,142,.28)';c.setLineDash([3,6]);c.beginPath();
    for(let i=-80;i<=160;i++){const q=this.point(i/100);i===-80?c.moveTo(q.x,q.y):c.lineTo(q.x,q.y);}c.stroke();c.setLineDash([]);
    c.strokeStyle='rgba(208,184,142,.5)';c.beginPath();
    for(let i=-35;i<=this.phase*100;i++){const q=this.point(i/100);i===-35?c.moveTo(q.x,q.y):c.lineTo(q.x,q.y);}c.stroke();
    const q=this.point(this.phase);
    const scale=this.phase < .5 ? .89 + this.phase*.30 : 1.04-(this.phase-.5)*1.28;
    const radius=(this.mobile?120:Math.min(w*.142,hero.clientHeight*.38))*scale;
    const glow=c.createRadialGradient(q.x,q.y,radius*.80,q.x,q.y,radius*1.19);
    glow.addColorStop(0,'rgba(215,224,214,.05)');glow.addColorStop(.8,'rgba(182,209,210,.025)');glow.addColorStop(1,'rgba(182,209,210,0)');
    c.fillStyle=glow;c.beginPath();c.arc(q.x,q.y,radius*1.19,0,TAU);c.fill();
    c.save();c.translate(q.x,q.y);c.rotate(-.20+this.view*.10);c.drawImage(this.moon,-radius,-radius,radius*2,radius*2);c.restore();
    if(this.guides){
      const tx=q.x+radius*.65,ty=q.y+radius*.74;
      c.strokeStyle='rgba(190,188,166,.48)';c.lineWidth=.7;c.beginPath();c.moveTo(tx,ty);c.lineTo(tx+20,ty+20);c.lineTo(tx+65,ty+20);c.stroke();
      c.fillStyle='#c4c1ae';c.font='8px monospace';c.fillText('I O N A',tx+27,ty+14);
      if(!this.mobile){c.fillStyle='#83969d';c.font='8px monospace';c.fillText(`${(384.4 + Math.abs(this.phase-.5)*180).toFixed(1)} k · imagined distance`,tx+27,ty+34);}
    }
    if(Math.abs(this.phase-.5)<.015 && Math.abs(this.view)<.035){
      c.strokeStyle='rgba(208,184,142,.55)';c.lineWidth=.8;c.beginPath();c.arc(q.x,q.y,radius+9,0,TAU);c.stroke();
    }
  }
}

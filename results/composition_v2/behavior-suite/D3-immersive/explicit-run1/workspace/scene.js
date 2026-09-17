/* Moonward's single renderer owns the sky, perspective, and transition clock.
   No external images, engines, or animation tickers are required. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function seededRandom(seed) {
    return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  }

  // Bake a relief-lit spherical surface once; frame rendering only composites it.
  function makeMoon() {
    const size = 760;
    const texture = document.createElement('canvas');
    texture.width = texture.height = size;
    const context = texture.getContext('2d');
    const image = context.createImageData(size, size);
    const relief = new Float32Array(size * size);
    const albedo = new Float32Array(size * size);
    const random = seededRandom(41927);
    const grids = [5, 11, 23, 49, 101, 211].map(length => ({
      length, values: Float32Array.from({ length: (length + 1) ** 2 }, random)
    }));
    function noise(x, y, grid) {
      const gx = x / size * grid.length, gy = y / size * grid.length;
      const ix = Math.floor(gx), iy = Math.floor(gy), stride = grid.length + 1;
      let fx = gx - ix, fy = gy - iy;
      fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
      const v = grid.values;
      return (v[iy * stride + ix] * (1 - fx) + v[iy * stride + ix + 1] * fx) * (1 - fy)
        + (v[(iy + 1) * stride + ix] * (1 - fx) + v[(iy + 1) * stride + ix + 1] * fx) * fy;
    }
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        const broad = noise(x, y, grids[0]) * .58 + noise(x, y, grids[1]) * .28 + noise(x, y, grids[2]) * .14;
        const fine = noise(x, y, grids[3]) * .5 + noise(x, y, grids[4]) * .3 + noise(x, y, grids[5]) * .2;
        albedo[i] = .32 + broad * .84 + fine * .16;
        relief[i] = broad * 8 + fine * 2.7 + random() * .25;
      }
    }
    for (let crater = 0; crater < 320; crater++) {
      const cx = random() * size, cy = random() * size;
      const radius = 2 + Math.pow(random(), 4.2) * 56;
      const nx = cx / size * 2 - 1, ny = cy / size * 2 - 1;
      if (nx * nx + ny * ny > .94) continue;
      const squash = .65 + Math.sqrt(1 - nx * nx - ny * ny) * .35;
      const extent = radius * 1.35;
      for (let y = Math.max(0, Math.floor(cy - extent)); y < Math.min(size, cy + extent); y++) {
        for (let x = Math.max(0, Math.floor(cx - extent)); x < Math.min(size, cx + extent); x++) {
          const d = Math.hypot((x - cx) / squash, y - cy) / radius;
          if (d > 1.3) continue;
          const rim = Math.exp(-(((d - .92) / .1) ** 2)) * radius * .065;
          const bowl = d < .88 ? (1 - (d / .88) ** 2) * radius * .1 : 0;
          const i = y * size + x;
          relief[i] += rim - bowl;
          albedo[i] += Math.exp(-(((d - 1) / .16) ** 2)) * .06 - (d < .8 ? .045 : 0);
        }
      }
    }
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = (x + .5) / size * 2 - 1, ny = (y + .5) / size * 2 - 1;
        const d2 = nx * nx + ny * ny;
        if (d2 >= 1) continue;
        const z = Math.sqrt(1 - d2), i = y * size + x;
        const bx = relief[i] - relief[y * size + Math.max(0, x - 1)];
        const by = relief[i] - relief[Math.max(0, y - 1) * size + x];
        const light = Math.max(0, -.53 * nx - .45 * ny + .72 * z);
        const bump = clamp(1 + bx * .58 + by * .46, .35, 1.5);
        const luminosity = (.055 + Math.pow(light, .82) * .96) * bump * albedo[i];
        const p = i * 4;
        image.data[p] = Math.min(255, 244 * luminosity);
        image.data[p + 1] = Math.min(255, 217 * luminosity);
        image.data[p + 2] = Math.min(255, 185 * luminosity);
        image.data[p + 3] = Math.min(255, (1 - Math.sqrt(d2)) * size * 180);
      }
    }
    context.putImageData(image, 0, 0);
    return texture;
  }

  class MoonwardScene {
    constructor(canvas, { onBearing, reducedMotion }) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.surface = canvas.parentElement;
      this.onBearing = onBearing;
      this.reducedMotion = reducedMotion;
      this.visible = false;
      this.destroyed = false;
      this.frame = null;
      this.lastTime = 0;
      this.ambientTime = 0;
      this.current = { passage: 0, bearing: 12 };
      this.target = { ...this.current };
      this.stats = { frames: 0, running: false, visible: false, hidden: document.hidden };
      if (!this.ctx) return;
      this.moon = makeMoon();
      const random = seededRandom(196904);
      this.stars = Array.from({ length: 230 }, () => ({ x: random(), y: random(), r: .3 + random() * 1, depth: .2 + random() * .8, phase: random() * TAU }));
      this.abort = new AbortController();
      const options = { signal: this.abort.signal };
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.surface);
      this.observer = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.stats.visible = this.visible;
        this.syncLifecycle();
      }, { threshold: 0 });
      this.observer.observe(this.surface);
      document.addEventListener('visibilitychange', () => {
        this.stats.hidden = document.hidden;
        this.syncLifecycle();
      }, options);
      window.addEventListener('pagehide', event => {
        if (event.persisted) this.stop(); else this.destroy();
      }, options);
      window.addEventListener('pageshow', () => this.syncLifecycle(), options);
      this.surface.addEventListener('pointerdown', event => {
        if (event.target.closest('a, button') || (event.pointerType === 'mouse' && event.button !== 0)) return;
        this.drag = { x: event.clientX, bearing: this.target.bearing, id: event.pointerId };
        this.surface.setPointerCapture(event.pointerId);
      }, options);
      this.surface.addEventListener('pointermove', event => {
        if (!this.drag || event.pointerId !== this.drag.id) return;
        this.onBearing(Math.round(clamp(this.drag.bearing + (event.clientX - this.drag.x) / this.width * 90, -30, 30)));
      }, options);
      const endDrag = () => { this.drag = null; };
      this.surface.addEventListener('pointerup', endDrag, options);
      this.surface.addEventListener('pointercancel', endDrag, options);
      this.surface.addEventListener('lostpointercapture', endDrag, options);
      this.resize();
    }

    resize() {
      if (this.destroyed || !this.ctx) return;
      const rect = this.surface.getBoundingClientRect();
      this.width = rect.width; this.height = rect.height;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      if (!document.hidden) this.render();
    }

    setState(passage, bearing) {
      this.target = { passage, bearing };
      if (this.reducedMotion || !this.visible || document.hidden) this.current = { ...this.target };
      this.syncLifecycle();
    }

    setReducedMotion(value) {
      this.reducedMotion = value;
      this.current = { ...this.target };
      this.syncLifecycle();
    }

    syncLifecycle() {
      if (this.destroyed || !this.ctx) return;
      this.stop();
      if (!this.visible || document.hidden) return;
      if (this.reducedMotion) { this.render(); return; }
      this.lastTime = 0;
      this.stats.running = true;
      this.frame = requestAnimationFrame(time => this.tick(time));
    }

    stop() {
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = null;
      this.stats.running = false;
    }

    tick(time) {
      this.frame = null;
      if (this.destroyed || !this.visible || document.hidden || this.reducedMotion) { this.stats.running = false; return; }
      const dt = this.lastTime ? Math.min(time - this.lastTime, 50) : 16;
      this.lastTime = time;
      this.ambientTime += dt * .001;
      const ease = 1 - Math.exp(-dt / 180);
      for (const key of ['passage', 'bearing']) {
        this.current[key] += (this.target[key] - this.current[key]) * ease;
        if (Math.abs(this.target[key] - this.current[key]) < .002) this.current[key] = this.target[key];
      }
      this.render();
      this.frame = requestAnimationFrame(next => this.tick(next));
    }

    render() {
      const ctx = this.ctx, w = this.width, h = this.height;
      if (!w || !h) return;
      this.stats.frames++;
      const mobile = w <= 700;
      const p = this.current.passage / 100, bearing = this.current.bearing;
      const baseX = mobile ? w * .5 : w * .68;
      const baseY = mobile ? 435 : h * .46;
      const radius = mobile ? Math.min(w * .305, 170) : Math.min(w * .165, h * .335);
      const approach = p <= .5 ? p * 2 : (1 - p) * 2;
      const scale = p <= .5 ? 1 + approach * .15 : .35 + approach * .8;
      const mx = baseX + Math.sin(p * Math.PI) * radius * .18 - p * radius * .55 + bearing * (mobile ? 1.05 : 2.4);
      const my = baseY - Math.sin(p * Math.PI) * radius * .14 + p * radius * .17;
      const r = radius * scale;
      const locked = Math.abs(p - .5) <= .015 && Math.abs(bearing) <= 1;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#080f19'; ctx.fillRect(0, 0, w, h);
      let glow = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, radius * 2.8);
      glow.addColorStop(0, '#25333d65'); glow.addColorStop(.45, '#15233142'); glow.addColorStop(1, '#080f1900');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

      // Two parallax depths, all tied to bearing rather than pointer hover.
      for (const star of this.stars) {
        const x = ((star.x * w - bearing * star.depth * 1.3) % w + w) % w;
        const y = star.y * h;
        const inCopy = mobile ? y < 265 || y > 615 : x < w * .39;
        const twinkle = this.reducedMotion ? .8 : .75 + .25 * Math.sin(this.ambientTime * .4 + star.phase);
        ctx.globalAlpha = (.25 + star.depth * .45) * twinkle * (inCopy ? .25 : 1);
        ctx.fillStyle = star.depth > .8 ? '#d9cbb6' : '#abbac9';
        ctx.beginPath(); ctx.arc(x, y, star.r * (mobile ? .7 : 1), 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // The instrument reticle stays fixed as the moon moves through the field.
      ctx.save(); ctx.translate(baseX, baseY);
      ctx.strokeStyle = '#b4b8b71c'; ctx.lineWidth = .7;
      ctx.beginPath(); ctx.arc(0, 0, radius * 1.4, 0, TAU); ctx.stroke();
      for (let i = 0; i < 100; i++) {
        const angle = i / 100 * TAU, outer = radius * 1.4, inner = outer - (i % 5 === 0 ? 7 : 3);
        ctx.strokeStyle = i % 5 === 0 ? '#a7b4bd55' : '#a7b4bd24';
        ctx.beginPath(); ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner); ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer); ctx.stroke();
      }
      ctx.rotate(-.37);
      ctx.strokeStyle = '#d9ae8242';
      ctx.beginPath(); ctx.ellipse(0, 0, radius * 1.86, radius * .65, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = '#7890a225';
      ctx.beginPath(); ctx.ellipse(0, 0, radius * 2.3, radius * .85, 0, .7, 5.8); ctx.stroke();
      ctx.restore();

      const guideX = baseX + Math.sin(.5 * Math.PI) * radius * .18 - .5 * radius * .55;
      if (p > .24 && p < .78) {
        const opacity = Math.max(0, 1 - Math.abs(p - .5) * 4);
        ctx.globalAlpha = opacity * (locked ? .8 : .34);
        ctx.strokeStyle = locked ? '#d9ae82' : '#b9d1dd'; ctx.lineWidth = .8;
        ctx.setLineDash([3, 6]);
        ctx.beginPath(); ctx.moveTo(guideX, baseY - radius * 1.55); ctx.lineTo(guideX, baseY + radius * 1.4); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
      // Departure retains a readable arc of the moon's former position.
      if (p > .5) {
        ctx.save(); ctx.globalAlpha = (p - .5) * .8;
        ctx.strokeStyle = '#d9ae82'; ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        ctx.beginPath(); ctx.ellipse(baseX, baseY, radius * 1.8, radius * .64, -.37, -.3, 2.65); ctx.stroke();
        ctx.restore();
      }
      glow = ctx.createRadialGradient(mx - r * .25, my - r * .3, r * .7, mx, my, r * 1.2);
      glow.addColorStop(0, '#d6b28808'); glow.addColorStop(.7, '#d6b28809'); glow.addColorStop(1, '#d6b28800');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(mx, my, r * 1.25, 0, TAU); ctx.fill();
      ctx.save(); ctx.translate(mx, my); ctx.rotate(p * .32 + bearing * .002);
      ctx.drawImage(this.moon, -r, -r, r * 2, r * 2);
      ctx.restore();
      ctx.strokeStyle = '#deccae27';ctx.lineWidth = .65;
      ctx.beginPath();ctx.arc(mx, my, r - .3, Math.PI * .95, Math.PI * 1.95);ctx.stroke();

      // Foreground transit arc crosses the sphere; it is a guide, not a planetary ring.
      ctx.save();ctx.translate(baseX, baseY);ctx.rotate(-.37);
      ctx.strokeStyle = '#d9ae8260';ctx.lineWidth = .7;
      ctx.beginPath();ctx.ellipse(0, 0, radius * 1.86, radius * .65, 0, .12, Math.PI - .12);ctx.stroke();ctx.restore();
      const points = [[-.97, -.95], [1.46, .15], [-.72, 1.03]];
      for (const [x, y] of points) {
        const sx = baseX + x * radius - bearing * .38, sy = baseY + y * radius;
        ctx.strokeStyle = '#d9ae8280';ctx.lineWidth = .7;
        ctx.beginPath();ctx.moveTo(sx - 5, sy);ctx.lineTo(sx + 5, sy);ctx.moveTo(sx, sy - 5);ctx.lineTo(sx, sy + 5);ctx.stroke();
        ctx.fillStyle = '#e8d6b8';ctx.fillRect(sx - 1, sy - 1, 2, 2);
      }
      if (locked) {
        ctx.strokeStyle = '#ddbb89';ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const a = i / 4 * TAU + .12;
          ctx.beginPath();ctx.arc(mx, my, r + 12, a, a + .22);ctx.stroke();
        }
        if (!mobile) {
          ctx.font = '10px "Avenir Next", sans-serif';ctx.textAlign = 'center';ctx.fillStyle = '#e7c99f';
          ctx.fillText('REFERENCE LOCK', mx, my + r + 33);
        }
      }
      if (!mobile) {
        ctx.font = '9px "Avenir Next", sans-serif';ctx.fillStyle = '#82909b';ctx.textAlign = 'left';
        ctx.fillText('α  /  fixed reference', baseX + radius * 1.03, baseY + radius * .69);
        ctx.fillStyle = '#9f937f';ctx.fillText('PATH OF TRANSIT', baseX - radius * 1.72, baseY + radius * .94);
      }
    }

    destroy() {
      this.stop(); this.destroyed = true;
      this.observer?.disconnect(); this.resizeObserver?.disconnect(); this.abort?.abort();
      this.moon = null; this.stars = [];
    }
  }
  window.MoonwardScene = MoonwardScene;
})();

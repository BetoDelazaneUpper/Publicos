/* Procedural liquid contours, not a physical fluid solver. Canvas fallback is intentional:
   no WebGL requirement, no user data, no textures fetched from external services. */
(() => {
  'use strict';
  const canvas = document.getElementById('heroFluid');
  const host = document.getElementById('heroArt');
  if (!canvas || !host) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const root = document.documentElement;
  let width = 0, height = 0, frame = 0, inView = true, last = 0, time = 0;
  let px = 0, py = 0, targetX = 0, targetY = 0;
  const ripples = [];
  const enabled = () => root.dataset.motion !== 'off' && !document.hidden && inView;
  const light = () => root.dataset.theme === 'light';
  const coarse = matchMedia('(pointer:coarse)').matches;
  function resize() {
    const rect = host.getBoundingClientRect(); width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); paint();
  }
  function contour(cx, cy, radius, offset, t) {
    ctx.beginPath();
    for (let i = 0; i <= 110; i++) {
      const a = i / 110 * Math.PI * 2;
      const undulation = Math.sin(a * 3 + t * .48 + offset) * .095
        + Math.cos(a * 5 - t * .34 + offset * .8) * .047
        + Math.sin(a * 2 + t * .22) * .09;
      const influence = (Math.cos(a) * px + Math.sin(a) * py) * .095;
      const r = radius * (1 + undulation + influence);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * .91;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  function paint() {
    ctx.clearRect(0, 0, width, height);
    const isLight = light();
    const cx = width * .52 + px * 16, cy = height * .52 + py * 11;
    const radius = Math.min(width * .37, height * .37);
    const sweep = Math.sin(time * .24) * 30;
    const metal = ctx.createLinearGradient(cx - radius, cy - radius + sweep, cx + radius, cy + radius);
    const stops = isLight
      ? [[0,'#f8f9fb'],[.18,'#d2def8'],[.31,'#f4f7ff'],[.42,'#2864dd'],[.55,'#8eadea'],[.7,'#eff3fc'],[.87,'#517ccd'],[1,'#d7e3fc']]
      : [[0,'#222222'],[.16,'#646464'],[.28,'#d6d6d6'],[.39,'#494949'],[.56,'#101010'],[.68,'#616161'],[.84,'#b7b7b7'],[1,'#292929']];
    stops.forEach(([at,color]) => metal.addColorStop(at,color));
    contour(cx, cy, radius, 0, time); ctx.fillStyle = metal; ctx.fill();
    // Nested, time-displaced contours give the chrome surface its liquid folds.
    for (let i = 0; i < 22; i++) {
      const f = 1 - i * .033;
      contour(cx, cy, radius * f, i * .06, time + i * .1);
      ctx.strokeStyle = isLight ? `rgba(25,68,149,${.04 + (i % 4) * .018})` : `rgba(246,246,246,${.035 + (i % 4) * .024})`;
      ctx.lineWidth = i % 4 === 0 ? 1.2 : .6; ctx.stroke();
    }
    // Edge highlights remain subtle and entirely monochrome in the dark theme.
    contour(cx, cy, radius, 0, time);
    ctx.strokeStyle = isLight ? 'rgba(26,77,175,.3)' : 'rgba(255,255,255,.28)';
    ctx.lineWidth = 1; ctx.stroke();
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ring = ripples[i], age = (performance.now() - ring.start) / 1250;
      if (age > 1) { ripples.splice(i, 1); continue; }
      ctx.beginPath(); ctx.arc(ring.x, ring.y, 8 + age * 105, 0, Math.PI * 2);
      ctx.strokeStyle = isLight ? `rgba(24,88,216,${(1-age)*.5})` : `rgba(255,255,255,${(1-age)*.5})`;
      ctx.lineWidth = 1 - age * .6; ctx.stroke();
    }
  }
  function tick(now) {
    frame = 0;
    if (!enabled()) return;
    const dt = Math.min((now - last) / 1000 || 0, .05);
    if (!coarse || now - last > 31) {
      time += dt; last = now;
      px += (targetX - px) * .055; py += (targetY - py) * .055;
      paint();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame); frame = 0;
    if (enabled()) { last = performance.now(); frame = requestAnimationFrame(tick); }
    else { ripples.length = 0; paint(); }
  }
  host.addEventListener('pointermove', event => {
    if (!enabled()) return;
    const r = host.getBoundingClientRect();
    targetX = (event.clientX - r.left) / r.width * 2 - 1;
    targetY = (event.clientY - r.top) / r.height * 2 - 1;
  }, {passive:true});
  host.addEventListener('pointerleave', () => { targetX = targetY = 0; });
  host.addEventListener('pointerdown', event => {
    if (!enabled()) return;
    const r = host.getBoundingClientRect();
    ripples.push({x:event.clientX-r.left,y:event.clientY-r.top,start:performance.now()});
    if (ripples.length > 5) ripples.shift();
  }, {passive:true});
  new ResizeObserver(resize).observe(host);
  new MutationObserver(sync).observe(root, {attributes:true,attributeFilter:['data-theme','data-motion']});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; sync();
  }).observe(host);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',() => { if(frame) cancelAnimationFrame(frame); });
  resize(); sync();
})();

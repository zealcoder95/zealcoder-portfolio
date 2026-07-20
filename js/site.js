/* zealcoder-site.js — scroll spine, animated circuit background, mobile nav.
   Shared by every page instead of being pasted into each one. */

document.addEventListener('DOMContentLoaded', () => {
  // ---- mobile nav toggle -------------------------------------------------
  const navEl = document.querySelector('nav');
  const navToggle = document.getElementById('navToggle');
  const mobilePanel = document.getElementById('mobilePanel');

  function closeMobilePanel() {
    if (!mobilePanel || !mobilePanel.classList.contains('open')) return;
    mobilePanel.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', () => {
      const open = mobilePanel.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobilePanel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobilePanel);
    });
    // close on outside click (tap on the dimmed backdrop area)
    document.addEventListener('click', (e) => {
      if (!mobilePanel.classList.contains('open')) return;
      if (mobilePanel.contains(e.target) || navToggle.contains(e.target)) return;
      closeMobilePanel();
    });
    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobilePanel();
    });
  }

  // ---- navbar shrink on scroll ----------------------------------------------
  if (navEl) {
    let ticking = false;
    function updateNavState() {
      navEl.classList.toggle('nav-scrolled', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavState);
        ticking = true;
      }
    }, { passive: true });
    updateNavState();
  }

  // ---- scroll spine --------------------------------------------------------
  const spineFill = document.getElementById('spineFill');
  const nodes = document.querySelectorAll('.spine-node[data-pct]');
  function onScroll() {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (spineFill) spineFill.style.height = pct + '%';
    nodes.forEach(n => {
      const npct = parseFloat(n.dataset.pct);
      if (pct >= npct) n.classList.add('active'); else n.classList.remove('active');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- ZealCat: randomized blink (one of only two permanent idle motions,
  // the other being the CSS breathing loop). Runs independently per
  // art instance (hero, 404) with a jittered interval so it never reads as
  // a metronome. Off entirely under reduced motion. ------------------------
  (function randomBlink() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.zc-art-wrap:not(.zc-art-wrap--sm)').forEach((wrap) => {
      const lids = wrap.querySelectorAll('.zc-eyelid');
      if (!lids.length) return;
      function blinkOnce() {
        lids.forEach((lid, i) => {
          setTimeout(() => {
            lid.classList.add('zc-blink-now');
            setTimeout(() => lid.classList.remove('zc-blink-now'), 260);
          }, i * 40);
        });
      }
      function scheduleBlink() {
        const delay = 3200 + Math.random() * 4200; // ~3.2s-7.4s, deliberately irregular
        setTimeout(() => {
          if (document.visibilityState === 'visible') blinkOnce();
          scheduleBlink();
        }, delay);
      }
      scheduleBlink();
    });
  })();

  // ---- hero ZealCat: first-visit greeting, then settle into stillness -----
  // Plays once per visitor (localStorage-gated) as a real "hello", then rests
  // in the same quiet breathing state as every other visit. Returning
  // visitors and reduced-motion users skip straight to breathing.
  (function heroGreet() {
    const wrap = document.querySelector('.hero-visual .zc-art-wrap');
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let firstVisit = false;
    try {
      firstVisit = !localStorage.getItem('zcGreeted');
      if (firstVisit) localStorage.setItem('zcGreeted', '1');
    } catch (e) {
      firstVisit = false; // storage blocked (private mode etc.) — just breathe
    }
    if (!firstVisit) return;
    wrap.classList.remove('zc-anim-breathe');
    wrap.classList.add('zc-anim-greet');
    wrap.addEventListener('animationend', function onEnd(e) {
      if (e.animationName !== 'zcGreetNod') return;
      wrap.classList.remove('zc-anim-greet');
      wrap.classList.add('zc-anim-breathe');
    }, { once: true });
  })();

  // ---- 404 ZealCat: one-shot "looking around for the missing page" --------
  // Plays once on landing, then settles — it does not tilt for as long as
  // the visitor stays reading the page.
  (function notFoundLook() {
    const wrap = document.querySelector('.notfound-visual .zc-art-wrap');
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    wrap.classList.remove('zc-anim-breathe');
    wrap.classList.add('zc-anim-search-once');
    wrap.addEventListener('animationend', function onEnd(e) {
      if (e.animationName !== 'zcSearchTilt') return;
      wrap.classList.remove('zc-anim-search-once');
      wrap.classList.add('zc-anim-breathe');
    }, { once: true });
  })();

  // ---- hero ZealCat: subtle cursor-follow tilt ------------------------------
  // Calm and premium by design: max ~2deg, mouse-only (skipped on touch),
  // and off entirely under reduced motion. This is a proxy for a head-turn —
  // the artwork is a single flattened image with no separate head layer, so
  // the whole glass card leans very slightly toward the pointer instead.
  (function heroTilt() {
    const slot = document.querySelector('.hero-visual .zealcat-slot');
    if (!slot) return;
    const reduceMotionTilt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduceMotionTilt || isTouch) return;

    const MAX_DEG = 2;
    let raf = null;

    function onMove(e) {
      const rect = slot.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotY = Math.max(-1, Math.min(1, dx)) * MAX_DEG;
      const rotX = Math.max(-1, Math.min(1, dy)) * -MAX_DEG;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        slot.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    }
    function onLeave() {
      if (raf) cancelAnimationFrame(raf);
      slot.style.transform = '';
    }
    document.querySelector('.hero-visual').addEventListener('mousemove', onMove);
    document.querySelector('.hero-visual').addEventListener('mouseleave', onLeave);
  })();

  // ---- animated circuit background -----------------------------------------
  const canvas = document.getElementById('circuit-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const cols = 7, rows = 5;
  const gridPts = [];
  function buildGrid() {
    gridPts.length = 0;
    const gapX = w / (cols - 1), gapY = h / (rows - 1);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        gridPts.push({ x: i * gapX + (Math.sin(i * 3 + j) * 18), y: j * gapY + (Math.cos(j * 2 + i) * 14) });
      }
    }
  }
  buildGrid();
  window.addEventListener('resize', buildGrid);

  const links = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = i * rows + j;
      if (i < cols - 1) links.push([idx, (i + 1) * rows + j]);
      if (j < rows - 1 && (i + j) % 2 === 0) links.push([idx, i * rows + (j + 1)]);
    }
  }

  let pulses = [];
  function seedPulses() {
    pulses = [];
    const count = reduceMotion ? 0 : 5;
    const palette = [
      { glow: '34,211,245', core: '#9fe9ff' },
      { glow: '47,140,240', core: '#7aa3f5' },
      { glow: '139,62,240', core: '#c79bf5' },
      { glow: '193,68,247', core: '#e28ce0' }
    ];
    for (let k = 0; k < count; k++) {
      const link = links[Math.floor(Math.random() * links.length)];
      const color = palette[Math.floor(Math.random() * palette.length)];
      pulses.push({ link, t: Math.random(), speed: 0.0018 + Math.random() * 0.0016, color });
    }
  }
  seedPulses();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(120,125,160,0.10)';
    ctx.lineWidth = 1;
    links.forEach(([a, b]) => {
      const p1 = gridPts[a], p2 = gridPts[b];
      if (!p1 || !p2) return;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });
    ctx.fillStyle = 'rgba(139,143,168,0.22)';
    gridPts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) {
      pulses.forEach(pulse => {
        const [a, b] = pulse.link;
        const p1 = gridPts[a], p2 = gridPts[b];
        if (!p1 || !p2) return;
        pulse.t += pulse.speed;
        if (pulse.t > 1) { pulse.t = 0; pulse.link = links[Math.floor(Math.random() * links.length)]; }
        const midX = p2.x, midY = p1.y;
        const legLen = Math.hypot(midX - p1.x, midY - p1.y);
        const totalLen = legLen + Math.hypot(p2.x - midX, p2.y - midY);
        const distAlong = pulse.t * totalLen;
        let x, y;
        if (distAlong <= legLen) {
          const f = legLen === 0 ? 0 : distAlong / legLen;
          x = p1.x + (midX - p1.x) * f; y = p1.y + (midY - p1.y) * f;
        } else {
          const remaining = totalLen - legLen;
          const f = remaining === 0 ? 0 : (distAlong - legLen) / remaining;
          x = midX + (p2.x - midX) * f; y = midY + (p2.y - midY) * f;
        }
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 7);
        grad.addColorStop(0, `rgba(${pulse.color.glow},0.9)`);
        grad.addColorStop(1, `rgba(${pulse.color.glow},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pulse.color.core;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    requestAnimationFrame(draw);
  }
  draw();
});

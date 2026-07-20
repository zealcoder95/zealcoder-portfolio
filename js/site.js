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

  // ---- hero ZealCat idle actions -----------------------------------------
  // Calm breathing float (.zc-anim-alive, CSS-only) runs continuously.
  // On top of that, fire one distinct "action" animation every so often —
  // never back-to-back, never on a fixed beat — so a visitor who lingers
  // sees the mascot occasionally look around/stretch/hop instead of the
  // same loop repeating. Skips entirely under prefers-reduced-motion.
  const mascot = document.querySelector('.zealcat-slot .zc-art-wrap.zc-anim-alive');
  const mascotSlot = document.querySelector('.zealcat-slot');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (mascot && !reducedMotion) {
    const actions = ['zc-action-look-l', 'zc-action-look-r', 'zc-action-stretch', 'zc-action-hop'];
    let lastAction = null;
    let running = false;
    let idleTimer = null;

    function playAction(choice, onDone) {
      if (running) return false;
      lastAction = choice;
      running = true;
      mascot.classList.add(choice);
      mascot.addEventListener('animationend', function onEnd() {
        mascot.removeEventListener('animationend', onEnd);
        mascot.classList.remove(choice);
        running = false;
        if (onDone) onDone();
      }, { once: true });
      return true;
    }

    function playRandomAction() {
      const pool = actions.filter(a => a !== lastAction);
      const choice = pool[Math.floor(Math.random() * pool.length)];
      playAction(choice, scheduleNext);
    }

    function scheduleNext() {
      clearTimeout(idleTimer);
      const delay = 6000 + Math.random() * 9000; // 6–15s of calm float between actions
      idleTimer = setTimeout(playRandomAction, delay);
    }

    scheduleNext();

    // ---- click easter egg -------------------------------------------------
    // Tapping/clicking the mascot interrupts whatever's scheduled and plays
    // a distinct "startled" pop — bigger and quicker than the idle actions,
    // so it reads as a direct reaction to the click rather than a coincidence.
    if (mascotSlot) {
      mascotSlot.style.cursor = 'pointer';
      mascotSlot.addEventListener('click', () => {
        const started = playAction('zc-action-surprise', () => { scheduleNext(); });
        if (started) clearTimeout(idleTimer); // don't let a queued idle action fire mid-surprise
      });
    }

    // ---- mouse-follow tilt --------------------------------------------------
    // The whole card leans a few degrees toward the cursor, like the
    // mascot is tracking it — always-on (not distance-faded) but capped to
    // a small max angle so it reads as attentive, not jumpy. Runs on top of
    // the idle/action animations without fighting them: it's applied to
    // .zealcat-slot itself, which none of the keyframe animations above
    // touch (they all target the inner .zc-art-wrap).
    if (mascotSlot && window.matchMedia('(pointer: fine)').matches) {
      const MAX_DEG = 6;
      const MAX_TRANSLATE = 5;
      const RANGE = 160; // px from center at which the tilt is already maxed out
      let rafId = null, targetX = 0, targetY = 0, curX = 0, curY = 0;

      function applyTilt() {
        curX += (targetX - curX) * 0.12;
        curY += (targetY - curY) * 0.12;
        mascotSlot.style.transform =
          `perspective(700px) rotateX(${(-curY * MAX_DEG).toFixed(2)}deg) rotateY(${(curX * MAX_DEG).toFixed(2)}deg) translate(${(curX * MAX_TRANSLATE).toFixed(1)}px, ${(curY * MAX_TRANSLATE).toFixed(1)}px)`;
        if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      function onMove(e) {
        const rect = mascotSlot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        targetX = Math.max(-1, Math.min(1, dx / RANGE));
        targetY = Math.max(-1, Math.min(1, dy / RANGE));
        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      }

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', () => {
        targetX = 0; targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });
    }
  }
});

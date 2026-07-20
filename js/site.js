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

  // ==========================================================================
  // ZealCat — reaction system (Phase 1, final)
  //
  // Idle layer (permanent, the only thing allowed to loop forever):
  //   - breathing (CSS-only, .zc-anim-breathe)
  //   - randomized blinking (jittered so it never reads as a metronome)
  //
  // Reaction layer (single-shot, cause-driven, one at a time): a shared
  // per-instance lock means a new trigger while a reaction is already
  // playing is simply dropped, never queued or stacked. Nothing here is a
  // body transform — reactions are either a real pose swap (Standing/Wave,
  // the only two official art crops we have) or a soft glow.
  //   - session greet   (hero only, once per browser session)
  //   - hover-dwell      (~600ms rest, not continuous tracking)
  //   - click/tap
  //   - chat reply beat  (see js/chatbot.js)
  // ==========================================================================
  (function zealcatReactions() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // per-instance lock: withLock(wrap, fn) runs fn(release) only if wrap
    // isn't already mid-reaction; fn must call release() when it's done.
    const locked = new WeakMap();
    function withLock(wrap, fn) {
      // If js/zealcat-rive.js has mounted a real rig on this wrap, it owns
      // all reactions from here on — drop PNG-based triggers so the two
      // systems never fire on top of each other.
      if (wrap.classList.contains('zc-rive-active')) return;
      if (locked.get(wrap)) return; // already reacting — drop this trigger
      locked.set(wrap, true);
      fn(() => locked.set(wrap, false));
    }

    // idle blink stays independent of the lock — it's presence, not a
    // reaction — but is exposed so a hover "blink pair" can reuse the exact
    // same mechanism instead of inventing a second blink implementation.
    function armIdleBlink(wrap) {
      const lids = wrap.querySelectorAll('.zc-eyelid');
      if (!lids.length) return null;
      function blinkOnce() {
        lids.forEach((lid, i) => {
          setTimeout(() => {
            lid.classList.add('zc-blink-now');
            setTimeout(() => lid.classList.remove('zc-blink-now'), 260);
          }, i * 40);
        });
      }
      function schedule() {
        const delay = 3200 + Math.random() * 4200; // ~3.2s-7.4s, deliberately irregular
        setTimeout(() => {
          if (document.visibilityState === 'visible') blinkOnce();
          schedule();
        }, delay);
      }
      schedule();
      return blinkOnce;
    }

    function blinkPairReaction(blinkOnce, release) {
      if (!blinkOnce) { release(); return; }
      blinkOnce();
      setTimeout(() => { blinkOnce(); release(); }, 260);
    }

    function glowReaction(art, release) {
      if (!art) { release(); return; }
      art.classList.remove('zc-ack-glow');
      void art.offsetWidth; // restart the animation if it's being reused
      art.classList.add('zc-ack-glow');
      setTimeout(() => { art.classList.remove('zc-ack-glow'); release(); }, 820);
    }

    // ---- wait for the boot loader to actually be gone --------------------
    // A one-shot reaction timed to start on DOMContentLoaded races the
    // #zcLoader boot screen (up to ~4s) — on a fast load it can finish
    // entirely hidden behind it. Pages with no loader (404.html) resolve
    // immediately.
    function whenLoaderGone(cb) {
      if (!document.getElementById('zcLoader')) { cb(); return; }
      let done = false;
      function fire() {
        if (done) return;
        done = true;
        cb();
      }
      document.addEventListener('zc:loaderhidden', fire, { once: true });
      setTimeout(fire, 4700); // safety net if loading.js never fires
    }

    // ---- set up hover-dwell + click on every large ZealCat instance ------
    // (hero + 404 — the small footer/loader/chat crops opt out via
    // .zc-art-wrap--sm and don't get eyelids or these reactions.)
    document.querySelectorAll('.zc-art-wrap:not(.zc-art-wrap--sm)').forEach((wrap) => {
      const blinkOnce = armIdleBlink(wrap);
      const art = wrap.querySelector('.zc-art.zc-pose-standing') || wrap.querySelector('.zc-art');
      let dwellTimer = null;

      if (!isTouch) {
        wrap.addEventListener('mouseenter', () => {
          dwellTimer = setTimeout(() => {
            withLock(wrap, (release) => blinkPairReaction(blinkOnce, release));
          }, 600);
        });
        wrap.addEventListener('mouseleave', () => {
          if (dwellTimer) { clearTimeout(dwellTimer); dwellTimer = null; }
        });
      }

      wrap.addEventListener('click', () => {
        withLock(wrap, (release) => glowReaction(art, release));
      });

      // ---- hero: once-per-session greeting, real pose change -------------
      // PAUSED: zealcat-wave.png is not framed identically to
      // zealcat-full.png (small margins vs. zero — see project notes), so
      // crossfading to it shifts/rescales the character. Re-enable once an
      // aligned Wave export exists; until then the hero stays on Standing
      // only, matching its original position exactly.
      if (false && wrap.closest('.hero-visual')) {
        let firstThisSession = false;
        try {
          firstThisSession = !sessionStorage.getItem('zcGreeted');
          if (firstThisSession) sessionStorage.setItem('zcGreeted', '1');
        } catch (e) {
          firstThisSession = false; // storage blocked (private mode etc.)
        }
        if (firstThisSession) {
          whenLoaderGone(() => {
            withLock(wrap, (release) => {
              wrap.classList.add('zc-greeting');
              setTimeout(() => {
                wrap.classList.remove('zc-greeting');
                setTimeout(release, 700); // let the crossfade back finish first
              }, 1600);
            });
          });
        }
      }

      // ---- 404: one-shot "looking around for the missing page" -----------
      if (wrap.closest('.notfound-visual') && !wrap.classList.contains('zc-rive-active')) {
        wrap.classList.remove('zc-anim-breathe');
        wrap.classList.add('zc-anim-search-once');
        wrap.addEventListener('animationend', function onEnd(e) {
          if (e.animationName !== 'zcSearchTilt') return;
          wrap.classList.remove('zc-anim-search-once');
          wrap.classList.add('zc-anim-breathe');
        }, { once: true });
      }
    });
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

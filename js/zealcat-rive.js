/* zealcat-rive.js — placeholder scaffold for the Rive rig (Path B).
   See ZealCat-Rive-Rig-Spec.md for the full state machine contract this
   file binds to.

   STATUS: inert by design. RIVE_ENABLED is false because no .riv file
   exists yet. Nothing in here runs until you:
     1. Get zealcat-hero.riv and zealcat-face.riv from the rigger, drop
        them in assets/zealcat/ (same names, or update the paths below).
     2. Flip RIVE_ENABLED to true.
     3. Confirm the state machine name below matches what the rigger
        named it in the .riv file (STATE_MACHINE_NAME).

   Until then, js/site.js and js/chatbot.js run their existing PNG-based
   reaction system exactly as today — this file does not touch anything
   unless a rig successfully loads. */
(function () {
  var RIVE_ENABLED = false; // <-- flip this once real .riv files exist
  if (!RIVE_ENABLED) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var RIVE_RUNTIME_SRC = 'https://unpkg.com/@rive-app/canvas@2/rive.js';
  var HERO_RIV = 'assets/zealcat/zealcat-hero.riv';   // Canvas A, 760x727 context
  var FACE_RIV = 'assets/zealcat/zealcat-face.riv';   // Canvas B, 320x230 context
  var STATE_MACHINE_NAME = 'ZealCatSM'; // must match the rigger's .riv file exactly

  // ---- input names, kept in one place so a rename only happens here ----
  var INPUTS = {
    hoverDwell: 'hoverDwell',
    click: 'click',
    sessionGreet: 'sessionGreet',
    chatOpen: 'chatOpen',
    chatClose: 'chatClose',
    chatReplyArrived: 'chatReplyArrived',
    is404Search: 'is404Search',
    isWalking: 'isWalking'
  };

  function loadRuntime() {
    if (window.rive) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = RIVE_RUNTIME_SRC;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function fileExists(url) {
    return fetch(url, { method: 'HEAD' })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  function findInput(riveInstance, name) {
    try {
      var inputs = riveInstance.stateMachineInputs(STATE_MACHINE_NAME);
      return inputs.find(function (i) { return i.name === name; }) || null;
    } catch (e) {
      return null;
    }
  }

  function fireTrigger(riveInstance, name) {
    var input = findInput(riveInstance, name);
    if (input && typeof input.fire === 'function') input.fire();
  }

  function setBoolean(riveInstance, name, value) {
    var input = findInput(riveInstance, name);
    if (input) input.value = value;
  }

  function mount(wrap, src) {
    var canvas = document.createElement('canvas');
    canvas.className = 'zc-rive-canvas';
    var rect = wrap.getBoundingClientRect();
    canvas.width = rect.width || wrap.offsetWidth || 1;
    canvas.height = rect.height || wrap.offsetHeight || 1;
    wrap.appendChild(canvas);
    wrap.classList.add('zc-rive-active');

    var instance = new window.rive.Rive({
      src: src,
      canvas: canvas,
      autoplay: true,
      stateMachines: STATE_MACHINE_NAME,
      onLoad: function () {
        instance.resizeDrawingSurfaceToCanvas();
      }
    });
    return instance;
  }

  // ---- wire the same triggers site.js/chatbot.js already listen for,
  // just pointed at Rive inputs instead of CSS class toggles ----------
  function bindHero(wrap, riveInstance) {
    var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    var dwellTimer = null;

    if (!isTouch) {
      wrap.addEventListener('mouseenter', function () {
        dwellTimer = setTimeout(function () {
          fireTrigger(riveInstance, INPUTS.hoverDwell);
        }, 600);
      });
      wrap.addEventListener('mouseleave', function () {
        if (dwellTimer) { clearTimeout(dwellTimer); dwellTimer = null; }
      });
    }

    wrap.addEventListener('click', function () {
      fireTrigger(riveInstance, INPUTS.click);
    });

    if (wrap.closest('.hero-visual')) {
      var firstThisSession = false;
      try {
        firstThisSession = !sessionStorage.getItem('zcGreeted');
        if (firstThisSession) sessionStorage.setItem('zcGreeted', '1');
      } catch (e) { firstThisSession = false; }
      if (firstThisSession) {
        document.addEventListener('zc:loaderhidden', function () {
          fireTrigger(riveInstance, INPUTS.sessionGreet);
        }, { once: true });
      }
    }

    if (wrap.closest('.notfound-visual')) {
      fireTrigger(riveInstance, INPUTS.is404Search);
    }
  }

  function bindLoaderFace(wrap, riveInstance) {
    if (wrap.closest('#zcLoader')) {
      setBoolean(riveInstance, INPUTS.isWalking, true);
    }
  }

  function bindChatFace(wrap, riveInstance) {
    var launcher = document.querySelector('.zc-chat-launcher');
    if (!launcher) return;
    launcher.addEventListener('click', function () {
      var isOpen = launcher.getAttribute('aria-expanded') === 'true';
      setBoolean(riveInstance, INPUTS.chatOpen, !isOpen);
      setBoolean(riveInstance, INPUTS.chatClose, isOpen);
    });
    // js/chatbot.js dispatches this when a reply finishes streaming in —
    // see the small hook added near ZEALCAT_WAVE_SRC in that file.
    document.addEventListener('zc:chatreplyarrived', function () {
      fireTrigger(riveInstance, INPUTS.chatReplyArrived);
    });
  }

  async function init() {
    var heroWraps = document.querySelectorAll('.hero-visual .zc-art-wrap, .notfound-visual .zc-art-wrap');
    var faceWraps = document.querySelectorAll('.zc-art-wrap--sm');
    if (!heroWraps.length && !faceWraps.length) return;

    var checks = await Promise.all([
      heroWraps.length ? fileExists(HERO_RIV) : Promise.resolve(false),
      faceWraps.length ? fileExists(FACE_RIV) : Promise.resolve(false)
    ]);
    var heroOk = checks[0], faceOk = checks[1];
    if (!heroOk && !faceOk) return; // no rig yet — stay fully inert

    try { await loadRuntime(); } catch (e) { return; }

    if (heroOk) {
      heroWraps.forEach(function (wrap) {
        bindHero(wrap, mount(wrap, HERO_RIV));
      });
    }
    if (faceOk) {
      faceWraps.forEach(function (wrap) {
        var riveInstance = mount(wrap, FACE_RIV);
        bindLoaderFace(wrap, riveInstance);
        bindChatFace(wrap, riveInstance);
      });
    }

    document.documentElement.classList.add('zc-rive-active');
    document.dispatchEvent(new CustomEvent('zc:riveready'));
  }

  document.addEventListener('DOMContentLoaded', init);
})();

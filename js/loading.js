/* loading.js — controls the #zcLoader boot screen.
   Self-contained: touches only the #zcLoader element, doesn't read/write
   i18n, JSON feeds, or the chatbot. Safe to include on any page; a page
   with no #zcLoader in the DOM simply does nothing. */
(function () {
  var loader = document.getElementById('zcLoader');
  if (!loader) return;

  // Keep the branded boot moment for the first page of a visit, then let
  // internal navigation feel instant. If storage is unavailable we retain
  // the safe original behaviour and show the loader normally.
  var BOOT_SESSION_KEY = 'zcBootSeen';
  try {
    if (sessionStorage.getItem(BOOT_SESSION_KEY) === '1') {
      loader.parentNode.removeChild(loader);
      document.documentElement.classList.add('zc-loader-skipped');
      document.addEventListener('DOMContentLoaded', function () {
        document.dispatchEvent(new CustomEvent('zc:loaderhidden'));
      }, { once: true });
      return;
    }
    sessionStorage.setItem(BOOT_SESSION_KEY, '1');
  } catch (err) { /* storage disabled: show the loader as usual */ }

  var MIN_VISIBLE_MS = 450;
  var PET_VISIBLE_MS = 900; // show at least several real atlas frames
  var shownAt = Date.now();
  var pageReady = document.readyState === 'complete';
  var petReady = document.documentElement.classList.contains('zc-pet-ready');
  var petReadyAt = petReady ? Date.now() : 0;
  var hidden = false;
  var cleaned = false;

  // ---- ring speed reflects real elapsed load time, not a fake cycle ----
  // No new artwork, no invented motion — just the existing ring genuinely
  // spinning faster the longer the real load actually takes.
  var speedTimers = [
    setTimeout(function () { loader.style.setProperty('--zc-ring-dur', '0.75s'); }, 900),
    setTimeout(function () { loader.style.setProperty('--zc-ring-dur', '0.45s'); }, 2000)
  ];

  function clearSpeedTimers() {
    speedTimers.forEach(clearTimeout);
  }

  function cleanup() {
    if (cleaned) return; // transitionend + the fallback timer can both fire
    cleaned = true;
    clearSpeedTimers();
    if (loader.parentNode) loader.parentNode.removeChild(loader);
    // Announce that the boot screen is truly gone, so anything timed to
    // play right after it (e.g. the hero's first-visit greeting) can wait
    // for this instead of guessing a delay and racing the fade-out.
    document.dispatchEvent(new CustomEvent('zc:loaderhidden'));
  }

  function reveal() {
    if (hidden) return;
    hidden = true;
    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', cleanup, { once: true });
    // fallback in case transitionend never fires (e.g. reduced-motion collapses
    // the transition duration to ~0 before the listener can catch it)
    setTimeout(cleanup, 600);
  }

  function hideLoader(force) {
    if (!force && (!pageReady || !petReady)) return;
    var now = Date.now();
    var wait = Math.max(0, MIN_VISIBLE_MS - (now - shownAt));
    if (!force && petReadyAt) {
      wait = Math.max(wait, PET_VISIBLE_MS - (now - petReadyAt));
    }
    setTimeout(reveal, wait);
  }

  window.addEventListener('load', function () {
    pageReady = true;
    hideLoader(false);
  }, { once: true });

  document.addEventListener('zc:petready', function () {
    petReady = true;
    petReadyAt = Date.now();
    hideLoader(false);
  }, { once: true });

  document.addEventListener('zc:peterror', function () {
    hideLoader(true);
  }, { once: true });

  hideLoader(false);
  // Absolute safety net: never block access indefinitely on a very slow or
  // failed sprite request. The old static mascot remains hidden meanwhile.
  setTimeout(function () { hideLoader(true); }, 7000);
})();

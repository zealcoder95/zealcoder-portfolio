/* loading.js — controls the #zcLoader boot screen.
   Self-contained: touches only the #zcLoader element, doesn't read/write
   i18n, JSON feeds, or the chatbot. Safe to include on any page; a page
   with no #zcLoader in the DOM simply does nothing. */
(function () {
  var loader = document.getElementById('zcLoader');
  if (!loader) return;

  var MIN_VISIBLE_MS = 350; // keep it on-screen just long enough to read, never longer
  var shownAt = Date.now();
  var hidden = false;
  var cleaned = false;

  function cleanup() {
    if (cleaned) return; // transitionend + the fallback timer can both fire
    cleaned = true;
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

  function hideLoader() {
    var elapsed = Date.now() - shownAt;
    var wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    setTimeout(reveal, wait);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
  // absolute safety net: never let the loader block the site if something
  // upstream (a slow feed, a slow font) delays the load event too long
  setTimeout(hideLoader, 4000);
})();

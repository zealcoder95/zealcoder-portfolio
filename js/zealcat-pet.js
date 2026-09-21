/**
 * ZealCat animated web companion
 * --------------------------------
 * Uses the same validated v2 sprite atlas as the ChatGPT Work pet.
 * The canvas renderer stays framework-free and reacts to events emitted by
 * js/chatbot.js. No API keys or AI calls live in this file.
 */
(function () {
  "use strict";

  const ATLAS_SRC = "assets/zealcat/zealcat-spritesheet-v2.png";
  const CELL_WIDTH = 192;
  const CELL_HEIGHT = 208;
  const RENDER_SCALE = 2;

  const STATES = {
    idle: { row: 0, frames: 6, timing: [280, 110, 110, 140, 140, 320], loop: true },
    "running-right": { row: 1, frames: 8, timing: [120, 120, 120, 120, 120, 120, 120, 220], loop: true },
    "running-left": { row: 2, frames: 8, timing: [120, 120, 120, 120, 120, 120, 120, 220], loop: true },
    waving: { row: 3, frames: 4, timing: [140, 140, 140, 280], loop: false },
    jumping: { row: 4, frames: 5, timing: [140, 140, 140, 140, 280], loop: false },
    failed: { row: 5, frames: 8, timing: [140, 140, 140, 140, 140, 140, 140, 240], loop: false },
    waiting: { row: 6, frames: 6, timing: [150, 150, 150, 150, 150, 260], loop: true },
    running: { row: 7, frames: 6, timing: [120, 120, 120, 120, 120, 220], loop: true },
    review: { row: 8, frames: 6, timing: [150, 150, 150, 150, 150, 280], loop: false },
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const atlas = new Image();
  const players = new Set();
  let atlasReady = false;
  let atlasRequested = false;
  let lastPointer = null;
  let pointerFrame = null;

  atlas.decoding = "async";
  atlas.addEventListener("load", () => {
    atlasReady = true;
    players.forEach((player) => player.activate());
    document.documentElement.classList.add("zc-pet-ready");
    document.dispatchEvent(new CustomEvent("zc:petready"));
  });
  atlas.addEventListener("error", () => {
    document.documentElement.classList.add("zc-pet-fallback");
    document.dispatchEvent(new CustomEvent("zc:peterror"));
  });

  function requestAtlas() {
    if (atlasRequested) return;
    atlasRequested = true;
    atlas.src = ATLAS_SRC;
  }

  class ZealCatPlayer {
    constructor(wrap) {
      this.wrap = wrap;
      this.canvas = document.createElement("canvas");
      this.canvas.className = "zc-pet-canvas";
      // A 2x backing buffer keeps curved metal edges and eye highlights
      // clean on high-density displays while preserving the atlas geometry.
      this.canvas.width = CELL_WIDTH * RENDER_SCALE;
      this.canvas.height = CELL_HEIGHT * RENDER_SCALE;
      this.canvas.setAttribute("aria-hidden", "true");
      this.context = this.canvas.getContext("2d", { alpha: true });
      this.context.imageSmoothingEnabled = true;
      this.context.imageSmoothingQuality = "high";
      this.state = "idle";
      this.frame = 0;
      this.lookIndex = null;
      this.timer = null;
      this.returnState = "idle";
      this.role = this.resolveRole();
      this.wrap.appendChild(this.canvas);
      this.wrap.classList.add("zc-pet-mounted");
      players.add(this);
      this.play("idle");
      if (atlasReady) this.activate();
    }

    activate() {
      this.wrap.classList.add("zc-pet-active");
      this.draw();
    }

    resolveRole() {
      if (this.wrap.closest(".zc-chat-launcher")) return "launcher";
      if (this.wrap.closest(".zc-chat-head-icon")) return "header";
      if (this.wrap.closest("#zcLoader")) return "loader";
      return "ambient";
    }

    draw() {
      if (!atlasReady || !this.context) return;
      let row;
      let column;
      if (this.lookIndex !== null) {
        row = this.lookIndex < 8 ? 9 : 10;
        column = this.lookIndex % 8;
      } else {
        const definition = STATES[this.state] || STATES.idle;
        row = definition.row;
        column = Math.min(this.frame, definition.frames - 1);
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(
        atlas,
        column * CELL_WIDTH,
        row * CELL_HEIGHT,
        CELL_WIDTH,
        CELL_HEIGHT,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    stopTimer() {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
    }

    play(name, options) {
      const definition = STATES[name] || STATES.idle;
      const settings = options || {};
      this.stopTimer();
      this.lookIndex = null;
      this.state = STATES[name] ? name : "idle";
      this.frame = 0;
      this.returnState = settings.returnState || "idle";
      this.draw();

      if (reduceMotion.matches) return;

      const advance = () => {
        const current = STATES[this.state] || definition;
        const delay = current.timing[this.frame] || 160;
        this.timer = window.setTimeout(() => {
          this.frame += 1;
          if (this.frame >= current.frames) {
            if (settings.once || !current.loop) {
              this.play(this.returnState);
              return;
            }
            this.frame = 0;
          }
          this.draw();
          advance();
        }, delay);
      };
      advance();
    }

    lookAt(clientX, clientY) {
      if (!atlasReady || reduceMotion.matches || !this.canvas.isConnected) return;
      if (this.state !== "idle" || this.wrap.closest("#zcLoader")) return;
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      if (Math.hypot(dx, dy) < Math.max(rect.width, rect.height) * 0.28) {
        this.lookIndex = null;
        this.frame = 0;
      } else {
        const clockwiseFromUp = (Math.atan2(dx, -dy) * 180) / Math.PI;
        this.lookIndex = Math.round(((clockwiseFromUp + 360) % 360) / 22.5) % 16;
      }
      this.stopTimer();
      this.draw();
    }

    resumeIdle() {
      if (this.state === "idle" && this.lookIndex === null && this.timer) return;
      this.play("idle");
    }
  }

  function mountAll(root) {
    const scope = root || document;
    scope.querySelectorAll(".zc-art-wrap--sm:not(.zc-pet-mounted)").forEach((wrap) => {
      new ZealCatPlayer(wrap);
    });
  }

  function playersForRole(role) {
    return Array.from(players).filter((player) => player.role === role && player.canvas.isConnected);
  }

  function playFor(role, state, options) {
    playersForRole(role).forEach((player) => player.play(state, options));
  }

  function playChatState(state, options) {
    playFor("launcher", state, options);
    playFor("header", state, options);
  }

  document.addEventListener("pointermove", (event) => {
    lastPointer = { x: event.clientX, y: event.clientY };
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = null;
      players.forEach((player) => player.lookAt(lastPointer.x, lastPointer.y));
    });
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    players.forEach((player) => player.resumeIdle());
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      players.forEach((player) => player.stopTimer());
    } else {
      players.forEach((player) => player.play("idle"));
    }
  });

  function bindLauncherJump(root) {
    const launcher = (root || document).querySelector(".zc-chat-launcher");
    if (!launcher || launcher.dataset.zcJumpBound) return;
    launcher.dataset.zcJumpBound = "true";
    launcher.addEventListener("dblclick", () => {
      document.dispatchEvent(new CustomEvent("zc:petjump"));
    });
  }

  document.addEventListener("zc:chatready", (event) => {
    const root = event.detail && event.detail.root;
    mountAll(root);
    bindLauncherJump(root);
    const launcher = root && root.querySelector(".zc-chat-launcher");
    if (launcher) {
      launcher.addEventListener("pointerenter", requestAtlas, { once: true });
      launcher.addEventListener("focus", requestAtlas, { once: true });
    }
  });
  document.addEventListener("zc:chatopen", () => {
    requestAtlas();
    playChatState("waving", { once: true });
  });
  document.addEventListener("zc:chatclose", () => playChatState("idle"));
  document.addEventListener("zc:chatsending", () => playChatState("running"));
  document.addEventListener("zc:chatreplyarrived", () => playChatState("review", { once: true }));
  document.addEventListener("zc:chaterror", () => playChatState("failed", { once: true }));
  document.addEventListener("zc:petjump", () => playChatState("jumping", { once: true }));

  function init() {
    mountAll(document);
    bindLauncherJump(document);

    // The boot screen must use the new animated atlas, not the legacy face
    // fallback. Start this request immediately only on pages with a loader;
    // other pages keep the lower-priority idle loading behavior.
    if (document.getElementById("zcLoader")) {
      requestAtlas();
      return;
    }

    const scheduleAtlas = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(requestAtlas, { timeout: 2200 });
      } else {
        window.setTimeout(requestAtlas, 900);
      }
    };
    if (document.readyState === "complete") scheduleAtlas();
    else window.addEventListener("load", scheduleAtlas, { once: true });
  }

  reduceMotion.addEventListener?.("change", () => {
    players.forEach((player) => player.play("idle"));
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

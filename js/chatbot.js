/**
 * js/chatbot.js
 * --------------
 * Floating chat widget. Self-contained: builds its own DOM, doesn't
 * require any markup to be added to the HTML pages beyond this
 * <script> tag and the css/chatbot.css stylesheet link.
 *
 * Talks to /api/chat (see api/chat.js) which calls Gemini server-side
 * with a silent model-fallback chain — the widget itself has no idea
 * which model answered, it just gets a { reply } back.
 *
 * Reuses the site's existing i18n system: reads <html lang> for the
 * current language and listens for the 'zc:langchange' event (fired by
 * js/i18n.js) so the widget's own strings switch instantly when the
 * visitor flips the TR/EN toggle, without a page reload.
 */
(function () {
  "use strict";

  const STRINGS = {
    tr: {
      title: "ZealCat",
      subtitle: "Sorularınızı yanıtlar",
      placeholder: "Bir şeyler yazın…",
      welcome:
        "Merhaba! Gizem'in projeleri, yetenekleri ya da geçmişi hakkında soru sorabilir, ya da sadece sohbet edebilirsiniz.",
      send: "Gönder",
      open: "Sohbeti aç",
      close: "Sohbeti kapat",
      inputLabel: "ZealCat'e mesaj yaz",
      typing: "ZealCat yanıt hazırlıyor",
      hint: "ZealCat'e sor",
      error: "Şu anda yanıt veremiyorum, birazdan tekrar deneyin.",
      reset: "Sohbeti sıfırla",
      quickLabel: "Hızlı gezinme",
      promptLabel: "Önerilen sorular",
      prompts: {
        page: "Bu sayfada neleri incelemeliyim?",
        projects: "Gizem'in en güçlü projesi hangisi?",
        fit: "Gizem hangi rollere uygun?",
      },
      quick: {
        projects: "Projeler",
        about: "Hakkımda",
        resources: "Kaynaklar",
        journal: "Günlük",
        github: "GitHub",
        kaggle: "Kaggle",
        contact: "İletişim",
      },
    },
    en: {
      title: "ZealCat",
      subtitle: "Ask me anything",
      placeholder: "Type a message…",
      welcome:
        "Hi! Ask me about Gizem's projects, skills, or background — or just chat.",
      send: "Send",
      open: "Open chat",
      close: "Close chat",
      inputLabel: "Write a message to ZealCat",
      typing: "ZealCat is preparing a reply",
      hint: "Ask ZealCat",
      error: "I can't reply right now, please try again shortly.",
      reset: "Reset conversation",
      quickLabel: "Quick navigation",
      promptLabel: "Suggested questions",
      prompts: {
        page: "What should I explore on this page?",
        projects: "Which of Gizem's projects is strongest?",
        fit: "Which roles fit Gizem's profile?",
      },
      quick: {
        projects: "Projects",
        about: "About",
        resources: "Resources",
        journal: "Journal",
        github: "GitHub",
        kaggle: "Kaggle",
        contact: "Contact",
      },
    },
  };

  // Quick-action targets — same destinations the navbar already points to,
  // just surfaced inside the assistant panel. External links open in a new
  // tab; internal ones are plain relative hrefs (site is static/MPA, so a
  // normal navigation is correct here — no router to hook into).
  const QUICK_LINKS = [
    { key: "projects", href: "projeler.html", external: false },
    { key: "about", href: "hakkimda.html", external: false },
    { key: "resources", href: "kaynaklar.html", external: false },
    { key: "journal", href: "gunluk.html", external: false },
    { key: "github", href: "https://github.com/zealcoder95", external: true },
    { key: "kaggle", href: "https://www.kaggle.com/gizemglc", external: true },
    { key: "contact", href: "iletisim.html", external: false },
  ];

  const CHAT_STORAGE_KEY = "zcChatHistoryV1";
  const MAX_STORED_MESSAGES = 20;
  const PAGE_BY_FILE = {
    "index.html": "home",
    "hakkimda.html": "about",
    "yetenekler.html": "skills",
    "projeler.html": "projects",
    "yazilar.html": "writing",
    "kaynaklar.html": "resources",
    "gunluk.html": "journal",
    "iletisim.html": "contact",
    "404.html": "notfound",
  };

  function currentPage() {
    const file = window.location.pathname.split("/").pop() || "index.html";
    return PAGE_BY_FILE[file] || "home";
  }

  function readStoredHistory() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(CHAT_STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.text === "string")
        .slice(-MAX_STORED_MESSAGES)
        .map((item) => ({ role: item.role, text: item.text.slice(0, 2000) }));
    } catch (err) {
      return [];
    }
  }

  function storeHistory(history) {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history.slice(-MAX_STORED_MESSAGES)));
    } catch (err) {
      // Storage can be blocked; chat still works for the current page.
    }
  }

  function currentLang() {
    const l = document.documentElement.lang;
    return l === "en" ? "en" : "tr";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatMessage(str) {
    // Escape first, then support only two harmless emphasis patterns used by
    // the model. This keeps replies readable without allowing arbitrary HTML.
    return escapeHtml(str)
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  }

  // Same official ZealCat artwork as the hero/loading/404 placements (the
  // face crop), so the assistant reads as the same character everywhere on
  // the site rather than a separate icon.
  // Match the animated atlas' first idle cell exactly. When the atlas becomes
  // ready, the fallback and canvas now have the same crop and proportions, so
  // the launcher cannot appear to jump or change size between page loads.
  const ZEALCAT_FACE_SRC = "assets/zealcat/zealcat-idle-frame.png";
  // Official "wave" pose (Character Bible, alpha-cut) — used only in the
  // panel header while the chat is open, as a one-time real greeting
  // rather than an invented animation.
  const ZEALCAT_WAVE_SRC = "assets/zealcat/zealcat-wave-face.png";
  const ZEALCAT_FACE_SVG = `
    <span class="zc-art-wrap zc-art-wrap--sm">
      <img class="zc-art" src="${ZEALCAT_FACE_SRC}" alt="" width="192" height="208" loading="eager" decoding="async">
    </span>`;

  function buildWidget() {
    const wrap = document.createElement("div");
    wrap.className = "zc-chat-widget";
    wrap.innerHTML = `
      <span class="zc-chat-hint" data-zc-hint aria-hidden="true"></span>
      <button type="button" class="zc-chat-launcher zc-anim-hover" aria-expanded="false" aria-controls="zcChatPanel">
        <span class="zc-chat-icon-open zc-slot zc-slot--sm">
          <span class="zc-slot-grid"></span>
          <span class="zc-slot-glow"></span>
          ${ZEALCAT_FACE_SVG}
        </span>
        <svg class="zc-chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="#eceeff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="zc-chat-panel" id="zcChatPanel" role="dialog" aria-labelledby="zcChatTitle" aria-hidden="true" hidden inert>
        <div class="zc-chat-head">
          <span class="zc-chat-head-icon">${ZEALCAT_FACE_SVG}</span>
          <div class="zc-chat-head-copy">
            <div class="zc-chat-title" id="zcChatTitle" data-zc-title></div>
            <div class="zc-chat-subtitle" data-zc-subtitle></div>
          </div>
          <button type="button" class="zc-chat-reset" data-zc-reset>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <button type="button" class="zc-chat-close" data-zc-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="zc-chat-quick" id="zcChatQuick" role="navigation"></div>
        <div class="zc-chat-prompts" id="zcChatPrompts" role="group"></div>
        <div class="zc-chat-body" id="zcChatBody" role="log" aria-live="polite" aria-relevant="additions"></div>
        <form class="zc-chat-form" id="zcChatForm">
          <textarea class="zc-chat-input" id="zcChatInput" rows="1" maxlength="2000" data-zc-placeholder></textarea>
          <button type="submit" class="zc-chat-send">
            <svg viewBox="0 0 24 24" fill="none" stroke="#08090f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(wrap);

    const launcher = wrap.querySelector(".zc-chat-launcher");
    const hint = wrap.querySelector("[data-zc-hint]");
    const panel = wrap.querySelector("#zcChatPanel");
    const closeButton = wrap.querySelector("[data-zc-close]");
    const resetButton = wrap.querySelector("[data-zc-reset]");
    const body = wrap.querySelector("#zcChatBody");
    const quick = wrap.querySelector("#zcChatQuick");
    const prompts = wrap.querySelector("#zcChatPrompts");
    const form = wrap.querySelector("#zcChatForm");
    const input = wrap.querySelector("#zcChatInput");
    const sendButton = wrap.querySelector(".zc-chat-send");
    const titleEl = wrap.querySelector("[data-zc-title]");
    const subtitleEl = wrap.querySelector("[data-zc-subtitle]");

    // Quick-action row is built once; only its labels/aria need to react
    // to a language switch (handled in applyHeaderStrings below).
    QUICK_LINKS.forEach((link) => {
      const el = document.createElement("a");
      el.className = "zc-quick-btn";
      el.href = link.href;
      el.dataset.zcQuick = link.key;
      if (link.external) {
        el.target = "_blank";
        el.rel = "noopener";
      }
      quick.appendChild(el);
    });

    let history = readStoredHistory(); // [{role:'user'|'assistant', text}]
    let welcomed = history.length > 0;
    let welcomeMsgEl = null;
    let sending = false;
    let closeTimer = null;

    history.forEach((item) => addMessage(item.role, item.text));

    ["page", "projects", "fit"].forEach((key) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "zc-prompt-btn";
      button.dataset.zcPrompt = key;
      prompts.appendChild(button);
    });

    function addMessage(role, text) {
      const div = document.createElement("div");
      div.className = "zc-chat-msg " + (role === "user" ? "zc-from-user" : "zc-from-bot");
      div.innerHTML = formatMessage(text);
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    }

    function showTyping() {
      const div = document.createElement("div");
      div.className = "zc-chat-typing";
      div.id = "zcChatTyping";
      div.setAttribute("role", "status");
      div.innerHTML = `<span class="sr-only">${escapeHtml(STRINGS[currentLang()].typing)}</span><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>`;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function hideTyping() {
      const el = document.getElementById("zcChatTyping");
      if (el) el.remove();
    }

    function applyHeaderStrings() {
      const s = STRINGS[currentLang()];
      titleEl.textContent = s.title;
      subtitleEl.textContent = s.subtitle;
      input.setAttribute("placeholder", s.placeholder);
      input.setAttribute("aria-label", s.inputLabel);
      sendButton.setAttribute("aria-label", s.send);
      launcher.setAttribute("aria-label", launcher.getAttribute("aria-expanded") === "true" ? s.close : s.open);
      closeButton.setAttribute("aria-label", s.close);
      resetButton.setAttribute("aria-label", s.reset);
      resetButton.setAttribute("title", s.reset);
      hint.textContent = s.hint;
      quick.setAttribute("aria-label", s.quickLabel);
      prompts.setAttribute("aria-label", s.promptLabel);
      quick.querySelectorAll("[data-zc-quick]").forEach((el) => {
        el.textContent = s.quick[el.dataset.zcQuick];
      });
      prompts.querySelectorAll("[data-zc-prompt]").forEach((el) => {
        el.textContent = s.prompts[el.dataset.zcPrompt];
      });
      // If the visitor hasn't actually said anything yet, the welcome
      // bubble isn't "history" — keep it in sync with the language
      // toggle instead of leaving it stuck in whatever language was
      // active the moment the panel was first opened.
      if (welcomeMsgEl && history.length === 0) {
        welcomeMsgEl.innerHTML = escapeHtml(s.welcome);
      }
    }

    // Panel header pose swap: face (default) <-> wave (open), a plain
    // crossfade between two official crops — see css/chatbot.css.
    const headIcon = wrap.querySelector(".zc-chat-head-icon .zc-art");
    const headIconWrap = wrap.querySelector(".zc-chat-head-icon .zc-art-wrap");

    // One-shot soft glow when a real assistant reply lands — the same
    // .zc-ack-glow used for the hero/404 hover-dwell and click reactions
    // (see css/style.css), never a transform. Off under reduced motion.
    const reduceMotionChat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function ackReplyGlow() {
      // Always announce the event so the animated ZealCat renderer can
      // switch from its working state to a short review reaction.
      document.dispatchEvent(new CustomEvent("zc:chatreplyarrived"));
      // If the sprite player owns this icon now, it handles the visual.
      if (headIconWrap && headIconWrap.classList.contains("zc-pet-active")) return;
      if (reduceMotionChat || !headIcon) return;
      headIcon.classList.remove("zc-ack-glow");
      void headIcon.offsetWidth; // restart if a previous glow just finished
      headIcon.classList.add("zc-ack-glow");
      setTimeout(() => headIcon.classList.remove("zc-ack-glow"), 820);
    }

    function togglePanel(open) {
      const willOpen = typeof open === "boolean" ? open : launcher.getAttribute("aria-expanded") !== "true";
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (willOpen) {
        panel.hidden = false;
        panel.inert = false;
        panel.setAttribute("aria-hidden", "false");
        window.requestAnimationFrame(() => panel.classList.add("is-open"));
      } else {
        panel.classList.remove("is-open");
        panel.inert = true;
        panel.setAttribute("aria-hidden", "true");
        closeTimer = window.setTimeout(() => {
          panel.hidden = true;
          closeTimer = null;
        }, 260);
      }
      launcher.setAttribute("aria-expanded", String(willOpen));
      hint.classList.remove("is-visible");
      applyHeaderStrings();
      if (headIcon && !(headIconWrap && headIconWrap.classList.contains("zc-pet-active"))) {
        headIcon.src = willOpen ? ZEALCAT_WAVE_SRC : ZEALCAT_FACE_SRC;
      }
      document.dispatchEvent(new CustomEvent(willOpen ? "zc:chatopen" : "zc:chatclose"));
      if (willOpen) {
        if (!welcomed) {
          welcomeMsgEl = addMessage("assistant", STRINGS[currentLang()].welcome);
          welcomed = true;
        }
        input.focus();
      }
    }

    launcher.addEventListener("click", () => togglePanel());
    closeButton.addEventListener("click", () => {
      togglePanel(false);
      launcher.focus();
    });

    resetButton.addEventListener("click", () => {
      history = [];
      storeHistory(history);
      body.innerHTML = "";
      welcomeMsgEl = addMessage("assistant", STRINGS[currentLang()].welcome);
      welcomed = true;
      input.focus();
    });

    prompts.addEventListener("click", (event) => {
      const button = event.target.closest("[data-zc-prompt]");
      if (!button || sending) return;
      input.value = STRINGS[currentLang()].prompts[button.dataset.zcPrompt];
      form.requestSubmit();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        togglePanel(false);
        launcher.focus();
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || sending) return;
      sending = true;
      input.value = "";
      const requestHistory = history.slice(-10);
      addMessage("user", text);
      history.push({ role: "user", text });
      storeHistory(history);
      showTyping();
      sendButton.disabled = true;
      form.setAttribute("aria-busy", "true");
      document.dispatchEvent(new CustomEvent("zc:chatsending"));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: requestHistory, lang: currentLang(), page: currentPage() }),
        });
        const data = await res.json().catch(() => ({}));
        hideTyping();
        if (!res.ok || !(data && data.reply)) {
          throw new Error("Assistant response unavailable");
        }
        const reply = data.reply;
        addMessage("assistant", reply);
        history.push({ role: "assistant", text: reply });
        storeHistory(history);
        ackReplyGlow();
      } catch (err) {
        hideTyping();
        addMessage("assistant", STRINGS[currentLang()].error);
        document.dispatchEvent(new CustomEvent("zc:chaterror"));
      } finally {
        sending = false;
        sendButton.disabled = false;
        form.removeAttribute("aria-busy");
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    document.addEventListener("zc:langchange", applyHeaderStrings);
    applyHeaderStrings();
    document.dispatchEvent(new CustomEvent("zc:chatready", { detail: { root: wrap } }));

    // Briefly explains the mascot's purpose once per browser session.
    try {
      if (!sessionStorage.getItem("zcChatHintSeen")) {
        sessionStorage.setItem("zcChatHintSeen", "1");
        window.setTimeout(() => {
          if (launcher.getAttribute("aria-expanded") !== "true") hint.classList.add("is-visible");
        }, 1400);
        window.setTimeout(() => hint.classList.remove("is-visible"), 7400);
      }
    } catch (err) {
      // Storage can be blocked; the assistant still works without the hint.
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();

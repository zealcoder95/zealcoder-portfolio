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
      error: "Şu anda yanıt veremiyorum, birazdan tekrar deneyin.",
      quickLabel: "Hızlı gezinme",
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
      error: "I can't reply right now, please try again shortly.",
      quickLabel: "Quick navigation",
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

  function currentLang() {
    const l = document.documentElement.lang;
    return l === "en" ? "en" : "tr";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Same face motif as the hero/loading ZealCat placeholders (purple/cyan
  // eyes, circuit-friendly line art) so the assistant reads as the same
  // character everywhere on the site, not a separate icon.
  const ZEALCAT_FACE_SVG = `
    <svg class="zc-face-icon" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="url(#zc-chat-face-grad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <defs>
        <linearGradient id="zc-chat-face-grad" x1="0" y1="0" x2="120" y2="120">
          <stop offset="0%" stop-color="#22d3f5"/>
          <stop offset="100%" stop-color="#8b3ef0"/>
        </linearGradient>
      </defs>
      <path d="M35 50 28 22 48 38 M85 50 92 22 72 38"/>
      <path d="M30 52C30 30 45 18 60 18 75 18 90 30 90 52 90 78 75 96 60 96 45 96 30 78 30 52Z"/>
      <circle cx="47" cy="52" r="4.5" fill="#8b3ef0" stroke="none"/>
      <circle cx="73" cy="52" r="4.5" fill="#22d3f5" stroke="none"/>
      <path d="M52 68Q60 74 68 68"/>
    </svg>`;

  function buildWidget() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <button type="button" class="zc-chat-launcher zc-anim-hover" aria-expanded="false" aria-controls="zcChatPanel">
        <span class="zc-chat-icon-open zc-slot zc-slot--sm zc-anim-idle">
          <span class="zc-slot-grid"></span>
          <span class="zc-slot-glow"></span>
          ${ZEALCAT_FACE_SVG}
        </span>
        <svg class="zc-chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="#eceeff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="zc-chat-panel" id="zcChatPanel" role="dialog" aria-label="ZealCat">
        <div class="zc-chat-head">
          <span class="zc-chat-head-icon">${ZEALCAT_FACE_SVG}</span>
          <div>
            <div class="zc-chat-title" data-zc-title></div>
            <div class="zc-chat-subtitle" data-zc-subtitle></div>
          </div>
        </div>
        <div class="zc-chat-quick" id="zcChatQuick" role="navigation"></div>
        <div class="zc-chat-body" id="zcChatBody"></div>
        <form class="zc-chat-form" id="zcChatForm">
          <textarea class="zc-chat-input" id="zcChatInput" rows="1" data-zc-placeholder></textarea>
          <button type="submit" class="zc-chat-send" aria-label="send">
            <svg viewBox="0 0 24 24" fill="none" stroke="#08090f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(wrap);

    const launcher = wrap.querySelector(".zc-chat-launcher");
    const panel = wrap.querySelector("#zcChatPanel");
    const body = wrap.querySelector("#zcChatBody");
    const quick = wrap.querySelector("#zcChatQuick");
    const form = wrap.querySelector("#zcChatForm");
    const input = wrap.querySelector("#zcChatInput");
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

    let history = []; // [{role:'user'|'assistant', text}]
    let welcomed = false;
    let welcomeMsgEl = null;
    let sending = false;

    function addMessage(role, text) {
      const div = document.createElement("div");
      div.className = "zc-chat-msg " + (role === "user" ? "zc-from-user" : "zc-from-bot");
      div.innerHTML = escapeHtml(text);
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    }

    function showTyping() {
      const div = document.createElement("div");
      div.className = "zc-chat-typing";
      div.id = "zcChatTyping";
      div.innerHTML = "<span></span><span></span><span></span>";
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
      launcher.setAttribute("aria-label", panel.classList.contains("is-open") ? s.close : s.open);
      quick.setAttribute("aria-label", s.quickLabel);
      quick.querySelectorAll("[data-zc-quick]").forEach((el) => {
        el.textContent = s.quick[el.dataset.zcQuick];
      });
      // If the visitor hasn't actually said anything yet, the welcome
      // bubble isn't "history" — keep it in sync with the language
      // toggle instead of leaving it stuck in whatever language was
      // active the moment the panel was first opened.
      if (welcomeMsgEl && history.length === 0) {
        welcomeMsgEl.innerHTML = escapeHtml(s.welcome);
      }
    }

    function togglePanel(open) {
      const willOpen = typeof open === "boolean" ? open : !panel.classList.contains("is-open");
      panel.classList.toggle("is-open", willOpen);
      launcher.setAttribute("aria-expanded", String(willOpen));
      applyHeaderStrings();
      if (willOpen) {
        if (!welcomed) {
          welcomeMsgEl = addMessage("assistant", STRINGS[currentLang()].welcome);
          welcomed = true;
        }
        input.focus();
      }
    }

    launcher.addEventListener("click", () => togglePanel());

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
      addMessage("user", text);
      history.push({ role: "user", text });
      showTyping();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history, lang: currentLang() }),
        });
        const data = await res.json().catch(() => ({}));
        hideTyping();
        const reply = data && data.reply ? data.reply : STRINGS[currentLang()].error;
        addMessage("assistant", reply);
        history.push({ role: "assistant", text: reply });
      } catch (err) {
        hideTyping();
        addMessage("assistant", STRINGS[currentLang()].error);
      } finally {
        sending = false;
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();

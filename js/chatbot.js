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
      title: "zealcoder asistanı",
      subtitle: "Sorularınızı yanıtlar",
      placeholder: "Bir şeyler yazın…",
      welcome:
        "Merhaba! Gizem'in projeleri, yetenekleri ya da geçmişi hakkında soru sorabilir, ya da sadece sohbet edebilirsiniz.",
      send: "Gönder",
      open: "Sohbeti aç",
      close: "Sohbeti kapat",
      error: "Şu anda yanıt veremiyorum, birazdan tekrar deneyin.",
    },
    en: {
      title: "zealcoder assistant",
      subtitle: "Ask me anything",
      placeholder: "Type a message…",
      welcome:
        "Hi! Ask me about Gizem's projects, skills, or background — or just chat.",
      send: "Send",
      open: "Open chat",
      close: "Close chat",
      error: "I can't reply right now, please try again shortly.",
    },
  };

  function currentLang() {
    const l = document.documentElement.lang;
    return l === "en" ? "en" : "tr";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function buildWidget() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <button type="button" class="zc-chat-launcher" aria-expanded="false" aria-controls="zcChatPanel">
        <img class="zc-chat-icon-open" src="assets/zealcoder-logo.png" alt="">
        <svg class="zc-chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="#eceeff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="zc-chat-panel" id="zcChatPanel" role="dialog" aria-label="Chat">
        <div class="zc-chat-head">
          <img src="assets/zealcoder-logo.png" alt="">
          <div>
            <div class="zc-chat-title" data-zc-title></div>
            <div class="zc-chat-subtitle" data-zc-subtitle></div>
          </div>
        </div>
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
    const form = wrap.querySelector("#zcChatForm");
    const input = wrap.querySelector("#zcChatInput");
    const titleEl = wrap.querySelector("[data-zc-title]");
    const subtitleEl = wrap.querySelector("[data-zc-subtitle]");

    let history = []; // [{role:'user'|'assistant', text}]
    let welcomed = false;
    let sending = false;

    function addMessage(role, text) {
      const div = document.createElement("div");
      div.className = "zc-chat-msg " + (role === "user" ? "zc-from-user" : "zc-from-bot");
      div.innerHTML = escapeHtml(text);
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
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

    function applyStrings() {
      const s = STRINGS[currentLang()];
      titleEl.textContent = s.title;
      subtitleEl.textContent = s.subtitle;
      input.setAttribute("placeholder", s.placeholder);
      launcher.setAttribute("aria-label", panel.classList.contains("is-open") ? s.close : s.open);
      if (!welcomed) {
        addMessage("assistant", s.welcome);
        welcomed = true;
      }
    }

    function togglePanel(open) {
      const willOpen = typeof open === "boolean" ? open : !panel.classList.contains("is-open");
      panel.classList.toggle("is-open", willOpen);
      launcher.setAttribute("aria-expanded", String(willOpen));
      launcher.setAttribute("aria-label", STRINGS[currentLang()][willOpen ? "close" : "open"]);
      if (willOpen) {
        applyStrings();
        input.focus();
      }
    }

    launcher.addEventListener("click", () => togglePanel());

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

    document.addEventListener("zc:langchange", applyStrings);
    applyStrings();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();

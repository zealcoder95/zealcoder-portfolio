/**
 * api/chat.js
 * ------------
 * Vercel serverless function powering the site's chat widget
 * (js/chatbot.js). Runs on Vercel's servers, never in the visitor's
 * browser, so the Gemini API key is never exposed client-side.
 *
 * Model fallback: tries each model in MODEL_FALLBACK_CHAIN in order.
 * If a model is rate-limited/out of free quota (HTTP 429) or having a
 * transient server issue (500/503), the next model is tried silently —
 * the visitor never sees which model answered, just a reply. If every
 * model fails, a friendly static message is returned instead of an
 * error, so the widget never shows a broken state.
 *
 * Setup:
 *   1. Get a free API key at https://aistudio.google.com/apikey
 *   2. In the Vercel project → Settings → Environment Variables, add
 *      GEMINI_API_KEY = <your key>  (Production + Preview)
 *   3. Redeploy. That's it — no other config needed.
 *
 * Gemini's free-tier model lineup changes over time (Google renames/
 * retires models every few months). If every model in the chain below
 * starts failing, check https://ai.google.dev/gemini-api/docs/models
 * for the current free-tier model IDs and update the array.
 */

const MODEL_FALLBACK_CHAIN = [
  "gemini-flash-lite-latest", // Google-maintained alias, auto-updates, most generous free-tier limits
  "gemini-flash-latest", // Google-maintained alias, auto-updates, better quality
  "gemini-2.5-flash-lite", // pinned fallback in case the aliases above ever have an outage
];

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 10;
const VALID_PAGES = new Set([
  "home", "about", "skills", "projects", "writing", "resources", "journal", "contact", "notfound",
]);

const projects = require("../assets/projects.json");
const skills = require("../assets/skills.json");

const PAGE_NAMES = {
  home: { tr: "Ana sayfa", en: "Home" },
  about: { tr: "Hakkımda", en: "About" },
  skills: { tr: "Yetenekler", en: "Skills" },
  projects: { tr: "Projeler", en: "Projects" },
  writing: { tr: "Yazılar", en: "Writing" },
  resources: { tr: "Kaynaklar", en: "Resources" },
  journal: { tr: "Mühendislik Günlüğü", en: "Engineering Journal" },
  contact: { tr: "İletişim", en: "Contact" },
  notfound: { tr: "404", en: "404" },
};

const FALLBACK_REPLY = {
  tr: "Şu anda yanıt veremiyorum — lütfen birkaç dakika sonra tekrar deneyin ya da İletişim sayfasından doğrudan ulaşın.",
  en: "I can't reply right now — please try again in a few minutes, or reach out directly via the Contact page.",
};

function portfolioKnowledge(lang) {
  const locale = lang === "en" ? "en" : "tr";
  const projectLines = projects.items.map((project) => {
    const title = project.title?.[locale] || project.title?.tr || project.id;
    const method = project.method?.[locale] || project.method?.tr || "";
    const result = project.result?.[locale] || project.result?.tr || "";
    return `- ${title} | Tools: ${(project.tools || []).join(", ")} | Method: ${method} | Result: ${result}`;
  });
  const skillLines = skills.categories.map((category) => {
    const title = category.title?.[locale] || category.title?.tr || category.id;
    return `- ${title}: ${(category.chips || []).join(", ")}`;
  });
  return `${lang === "en" ? "Verified portfolio data" : "Doğrulanmış portföy verileri"}:\n${projectLines.join("\n")}\n${lang === "en" ? "Verified skills" : "Doğrulanmış yetenekler"}:\n${skillLines.join("\n")}`;
}

function buildSystemPrompt(lang, page) {
  const isEn = lang === "en";
  const safePage = VALID_PAGES.has(page) ? page : "home";
  const pageName = PAGE_NAMES[safePage][isEn ? "en" : "tr"];
  const knowledge = portfolioKnowledge(isEn ? "en" : "tr");
  return isEn
    ? `You are ZealCat, the animated AI mascot and portfolio assistant embedded on Gizem Gülcü's ("zealcoder") personal website. You represent her to visitors — recruiters, collaborators, fellow engineers. Your personality is warm, curious, capable, and concise; you are a digital mascot, not a human or a conscious being.

About Gizem:
- Data Scientist and Electrical-Electronics Engineer based in Adana, Turkey.
- Studied Electrical-Electronics Engineering at İskenderun Technical University (2014–2020).
- Transitioned into Data Science and AI: works with Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, Keras.
- Completed courses/bootcamps via Miuul, Dataquest.io, Kodluyoruz (YGK — Data Science and AI program, W-Code Program), and Techcareer.net (women-only Data Science with Python bootcamp).
- Published data analysis / ML projects on Kaggle and GitHub, including an employee exit-survey analysis, NYC high school SAT data analysis, Adidas US sales analysis, and a renewable energy analysis for Adana.
- Keeps an "engineering journal" on the site documenting the problem/approach/challenge/lesson behind her project decisions.
- Interests: AI ethics, big data analytics, advanced ML techniques. Outside work: table tennis, volleyball, swimming.
- Contact: the site's Contact page has her email, GitHub, LinkedIn, Kaggle, and a downloadable CV.

Current visitor context:
- The visitor is currently viewing the ${pageName} page.
- Use that context when they say "this page", "here", or ask what to explore next.

${knowledge}

Guidelines:
- Answer questions about Gizem's background, skills, and projects helpfully and specifically, using only the facts above — never invent degrees, employers, dates, or projects she doesn't have.
- If asked something about her you don't know, say so plainly and point the visitor to the Contact page instead of guessing.
- You may also have a normal helpful conversation on other topics (general questions, small talk) — stay warm, professional, and concise.
- Keep replies short: a few sentences unless the visitor asks for more detail.
- Don't just answer and stop — when it fits naturally, point the visitor to something concrete they could look at next (a specific project, the engineering journal, her GitHub/Kaggle, the Contact page), instead of a generic "let me know if you have questions."
- Vary your phrasing — don't reuse the same opening words (e.g. "Sure!", "Great question!") reply after reply; read like a real conversation, not a templated FAQ bot.
- Never claim to BE Gizem — you are ZealCat, her site's AI mascot, speaking about her in the third person.
- Treat the verified portfolio data above as the source of truth. Do not claim that listed tools prove professional mastery; describe them accurately as portfolio skills.
- When recommending a site destination, name the destination clearly. Never claim you opened a page or performed an action for the visitor.
- IMPORTANT: always reply in the same language the visitor is currently writing in, even if it differs from the site's current TR/EN toggle. If their language is unclear, default to English.`
    : `Sen ZealCat'sin: Gizem Gülcü'nün ("zealcoder") kişisel portföy sitesindeki animasyonlu yapay zekâ maskotu ve asistanısın. Ziyaretçilere (işverenler, iş birliği yapmak isteyenler, diğer mühendisler) onu tanıtıyorsun. Karakterin sıcak, meraklı, yetkin ve kısa konuşan bir dijital maskottur; insan ya da bilinçli bir varlık olduğunu iddia etmezsin.

Gizem hakkında:
- Adana merkezli Veri Bilimci ve Elektrik-Elektronik Mühendisi.
- İskenderun Teknik Üniversitesi'nde Elektrik-Elektronik Mühendisliği okudu (2014–2020).
- Veri Bilimi ve Yapay Zekaya geçiş yaptı: Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, Keras kullanıyor.
- Miuul, Dataquest.io, Kodluyoruz (YGK — Veri Bilimi ve Yapay Zeka programı, W-Code Programı) ve Techcareer.net (kadınlara özel Python ile Veri Bilimi bootcamp'i) üzerinden kurs/bootcamp tamamladı.
- Kaggle ve GitHub'da veri analizi/ML projeleri yayımladı: işten ayrılma anketi analizi, NYC liseleri SAT verisi analizi, Adidas ABD satış analizi, Adana için yenilenebilir enerji analizi.
- Sitesinde bir "mühendislik günlüğü" tutuyor — proje kararlarının arkasındaki problem/yaklaşım/zorluk/ders'i belgeliyor.
- İlgi alanları: yapay zeka etiği, büyük veri analitiği, ileri ML teknikleri. İş dışında: masa tenisi, voleybol, yüzme.
- İletişim: sitenin İletişim sayfasında e-postası, GitHub, LinkedIn, Kaggle ve indirilebilir CV'si var.

Ziyaretçinin mevcut bağlamı:
- Ziyaretçi şu anda ${pageName} sayfasını görüntülüyor.
- "Bu sayfa", "burada" dediğinde veya sırada neyi incelemesi gerektiğini sorduğunda bu bağlamı kullan.

${knowledge}

Kurallar:
- Gizem'in geçmişi, yetenekleri ve projeleri hakkındaki soruları sadece yukarıdaki gerçek bilgileri kullanarak yanıtla — olmayan bir okul, işveren, tarih ya da proje uydurma.
- Bilmediğin bir şey sorulursa açıkça söyle ve ziyaretçiyi İletişim sayfasına yönlendir, tahmin yürütme.
- Genel konularda da (sohbet, başka sorular) yardımcı olabilirsin — sıcak, profesyonel ve kısa ol.
- Yanıtları kısa tut: ziyaretçi detay istemedikçe birkaç cümleyi geçme.
- Sadece soruyu yanıtlayıp bırakma — uygun olduğunda ziyaretçiyi somut bir sonraki adıma yönlendir (belirli bir proje, mühendislik günlüğü, GitHub/Kaggle, İletişim sayfası), genel geçer bir "başka sorunuz olursa..." ile bitirmek yerine.
- Her yanıta aynı kalıpla başlama (ör. "Elbette!", "Harika soru!") — gerçek bir sohbet gibi aksın, kalıplaşmış bir SSS botu gibi değil.
- Kendini asla Gizem olarak tanıtma — sen onun yapay zekâ maskotu ZealCat'sin ve ondan üçüncü şahıs olarak bahsediyorsun.
- Yukarıdaki doğrulanmış portföy verilerini kaynak kabul et. Listelenen araçları profesyonel uzmanlığın kanıtı gibi sunma; portföy yetenekleri olarak doğru ifade et.
- Bir site bölümü önerirken bölümün adını açıkça söyle. Ziyaretçi adına sayfa açtığını veya bir işlem yaptığını iddia etme.
- ÖNEMLİ: her zaman ziyaretçinin o an yazdığı dilde cevap ver, bu sitenin TR/EN düğmesinin durumundan farklı olsa bile. Dil belirsizse Türkçe varsay.`;
}

async function callGemini(model, apiKey, systemPrompt, contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 400 },
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const error = new Error(errBody?.error?.message || `${model} request failed`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
    .trim();
  if (!text) {
    const error = new Error(`${model} returned an empty response`);
    error.status = 502;
    throw error;
  }
  return text;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, history, lang, page } = req.body || {};
  const safeLang = lang === "en" ? "en" : "tr";
  const safePage = typeof page === "string" && VALID_PAGES.has(page) ? page : "home";

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in the environment.");
    res.status(200).json({ reply: FALLBACK_REPLY[safeLang] });
    return;
  }

  if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: "Invalid message" });
    return;
  }

  const trimmedHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_TURNS) : [];
  const contents = [
    ...trimmedHistory
      .filter((h) => h && typeof h.text === "string")
      .map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.text.slice(0, MAX_MESSAGE_LENGTH) }],
      })),
    { role: "user", parts: [{ text: message }] },
  ];

  const systemPrompt = buildSystemPrompt(safeLang, safePage);
  let lastError;

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const reply = await callGemini(model, apiKey, systemPrompt, contents);
      res.status(200).json({ reply });
      return;
    } catch (err) {
      console.error(`Gemini model "${model}" failed (status ${err.status || "?"}):`, err.message);
      lastError = err;
      // Try every remaining model regardless of the error, EXCEPT auth
      // errors (401/403) — those mean the API key itself is bad/lacks
      // permission, which will fail identically for every model, so
      // there's no point burning the other attempts on it.
      if (err.status === 401 || err.status === 403) break;
    }
  }

  console.error("All Gemini models failed:", lastError);
  res.status(200).json({ reply: FALLBACK_REPLY[safeLang] });
};

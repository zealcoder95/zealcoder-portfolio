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
  "gemini-2.5-flash", // best quality/speed balance, tried first
  "gemini-2.5-flash-lite", // looser rate limits, used once flash is exhausted
  "gemini-2.0-flash", // older, kept as a last-resort third option
];

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 10;

const FALLBACK_REPLY = {
  tr: "Şu anda yanıt veremiyorum — lütfen birkaç dakika sonra tekrar deneyin ya da İletişim sayfasından doğrudan ulaşın.",
  en: "I can't reply right now — please try again in a few minutes, or reach out directly via the Contact page.",
};

function buildSystemPrompt(lang) {
  const isEn = lang === "en";
  return isEn
    ? `You are the chat assistant embedded on Gizem Gülcü's ("zealcoder") personal portfolio website. You represent her to visitors — recruiters, collaborators, fellow engineers.

About Gizem:
- Data Scientist and Electrical-Electronics Engineer based in Adana, Turkey.
- Studied Electrical-Electronics Engineering at İskenderun Technical University (2014–2020).
- Transitioned into Data Science and AI: works with Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, Keras.
- Completed courses/bootcamps via Miuul, Dataquest.io, Kodluyoruz (YGK — Data Science and AI program, W-Code Program), and Techcareer.net (women-only Data Science with Python bootcamp).
- Published data analysis / ML projects on Kaggle and GitHub, including an employee exit-survey analysis, NYC high school SAT data analysis, Adidas US sales analysis, and a renewable energy analysis for Adana.
- Keeps an "engineering journal" on the site documenting the problem/approach/challenge/lesson behind her project decisions.
- Interests: AI ethics, big data analytics, advanced ML techniques. Outside work: table tennis, volleyball, swimming.
- Contact: the site's Contact page has her email, GitHub, LinkedIn, Kaggle, and a downloadable CV.

Guidelines:
- Answer questions about Gizem's background, skills, and projects helpfully and specifically, using only the facts above — never invent degrees, employers, dates, or projects she doesn't have.
- If asked something about her you don't know, say so plainly and point the visitor to the Contact page instead of guessing.
- You may also have a normal helpful conversation on other topics (general questions, small talk) — stay warm, professional, and concise.
- Keep replies short: a few sentences unless the visitor asks for more detail.
- Never claim to BE Gizem — you are her site's assistant, speaking about her in the third person.`
    : `Gizem Gülcü'nün ("zealcoder") kişisel portföy sitesine gömülü sohbet asistanısın. Ziyaretçilere (işverenler, iş birliği yapmak isteyenler, diğer mühendisler) onu tanıtıyorsun.

Gizem hakkında:
- Adana merkezli Veri Bilimci ve Elektrik-Elektronik Mühendisi.
- İskenderun Teknik Üniversitesi'nde Elektrik-Elektronik Mühendisliği okudu (2014–2020).
- Veri Bilimi ve Yapay Zekaya geçiş yaptı: Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, Keras kullanıyor.
- Miuul, Dataquest.io, Kodluyoruz (YGK — Veri Bilimi ve Yapay Zeka programı, W-Code Programı) ve Techcareer.net (kadınlara özel Python ile Veri Bilimi bootcamp'i) üzerinden kurs/bootcamp tamamladı.
- Kaggle ve GitHub'da veri analizi/ML projeleri yayımladı: işten ayrılma anketi analizi, NYC liseleri SAT verisi analizi, Adidas ABD satış analizi, Adana için yenilenebilir enerji analizi.
- Sitesinde bir "mühendislik günlüğü" tutuyor — proje kararlarının arkasındaki problem/yaklaşım/zorluk/ders'i belgeliyor.
- İlgi alanları: yapay zeka etiği, büyük veri analitiği, ileri ML teknikleri. İş dışında: masa tenisi, voleybol, yüzme.
- İletişim: sitenin İletişim sayfasında e-postası, GitHub, LinkedIn, Kaggle ve indirilebilir CV'si var.

Kurallar:
- Gizem'in geçmişi, yetenekleri ve projeleri hakkındaki soruları sadece yukarıdaki gerçek bilgileri kullanarak yanıtla — olmayan bir okul, işveren, tarih ya da proje uydurma.
- Bilmediğin bir şey sorulursa açıkça söyle ve ziyaretçiyi İletişim sayfasına yönlendir, tahmin yürütme.
- Genel konularda da (sohbet, başka sorular) yardımcı olabilirsin — sıcak, profesyonel ve kısa ol.
- Yanıtları kısa tut: ziyaretçi detay istemedikçe birkaç cümleyi geçme.
- Kendini asla Gizem olarak tanıtma — onun sitesinin asistanısın, ondan üçüncü şahıs olarak bahsediyorsun.`;
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in the environment.");
    res.status(200).json({ reply: FALLBACK_REPLY.tr });
    return;
  }

  const { message, history, lang } = req.body || {};
  const safeLang = lang === "en" ? "en" : "tr";

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

  const systemPrompt = buildSystemPrompt(safeLang);
  let lastError;

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const reply = await callGemini(model, apiKey, systemPrompt, contents);
      res.status(200).json({ reply });
      return;
    } catch (err) {
      lastError = err;
      // Only move to the next model for quota/rate-limit/transient server
      // errors. Anything else (e.g. a malformed request) won't be fixed
      // by switching models, so stop retrying and fall through below.
      const retryable = err.status === 429 || err.status === 500 || err.status === 503;
      if (!retryable) break;
    }
  }

  console.error("All Gemini models failed:", lastError);
  res.status(200).json({ reply: FALLBACK_REPLY[safeLang] });
};

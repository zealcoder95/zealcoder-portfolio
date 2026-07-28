# Sohbet asistanı — kurulum rehberi

Sitenin sağ alt köşesinde beliren sohbet balonu, ziyaretçilerin Gizem
hakkında soru sorabildiği (ya da sadece sohbet edebildiği) küçük bir
yapay zeka asistanıdır. Google'ın Gemini API'sinin **ücretsiz katmanını**
kullanır.

## Nasıl çalışır

- `js/chatbot.js` — sağ altta görünen sohbet balonu ve paneli. Statik
  sitenin geri kalanı gibi düz JS, hiçbir kurulum gerektirmez.
- `api/chat.js` — Vercel'in otomatik tanıdığı bir **serverless
  function**. Ziyaretçinin mesajını alır, Gemini'ye sizin adınıza
  gönderir, cevabı geri döner. API key'iniz her zaman sunucu
  tarafında kalır, tarayıcıda asla görünmez.
- **Sessiz model geçişi**: `api/chat.js` içinde bir model listesi var
  (`MODEL_FALLBACK_CHAIN`). İlk model (örn. `gemini-2.5-flash`) günlük
  ücretsiz kullanım kotasına ulaştığında, kod otomatik olarak
  listedeki bir sonraki modele geçer — ziyaretçi bunu hiç fark etmez,
  sadece normal bir cevap alır. Kotalar her gece sıfırlanır, ertesi
  gün ilk model yine kullanılabilir olur.

## Kurulum (tek seferlik)

1. **API key alın**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   adresine gidin, Google hesabınızla giriş yapın, "Create API key"
   butonuna basın. Kredi kartı istemez.
2. **Vercel'e ekleyin**: Vercel projenizde **Settings → Environment
   Variables** bölümüne gidin, şunu ekleyin:
   - Name: `GEMINI_API_KEY`
   - Value: (az önce aldığınız key)
   - Environment: Production + Preview işaretli olsun
3. **Deploy edin.** Bu dosyaları (bu rehberle birlikte) repo'nuza
   push ettiğinizde Vercel otomatik yeniden deploy eder ve `api/chat.js`
   fonksiyonu aktif olur.
4. Siteyi açıp sağ alttaki balona tıklayarak test edin.

## Modelleri güncel tutmak

Google, Gemini'nin ücretsiz katmanındaki model isimlerini zaman zaman
değiştiriyor (eski modelleri emekliye ayırıyor, yenilerini ekliyor).
Balon "şu anda yanıt veremiyorum" demeye başlarsa:

1. [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)
   adresinden güncel ücretsiz model isimlerine bakın.
2. `api/chat.js` dosyasının en üstündeki `MODEL_FALLBACK_CHAIN`
   dizisini güncelleyin.
3. Push edin.

## Asistanın "hafızası"

Asistanın Gizem hakkında bildiği her şey `api/chat.js` içindeki
`buildSystemPrompt()` fonksiyonunda düz metin olarak yazılı — CV'niz,
yetenekleriniz ya da projeleriniz değiştiğinde bu metni elle
güncellemeniz gerekir (otomatik değil, `skills.json`/`projects.json`
gibi dosyalardan canlı okumuyor — basit ve hızlı kalması için bilinçli
bir tercih).

## Maliyet

Gemini'nin Flash ve Flash-Lite modelleri, makul kullanım sınırları
içinde (dakikada birkaç istek, günde yüzlerce istek) tamamen ücretsizdir.
Bir kişisel portföy sitesi için normal ziyaretçi trafiği bu sınırların
fazlasıyla altında kalır.

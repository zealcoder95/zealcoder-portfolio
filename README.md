# zealcoder — Gizem Gülcü | Portfolio

Statik, framework'süz, iki dilli (TR/EN) mühendislik portföyü. Build adımı yok — dosyalar doğrudan servis edilir.

## Yapı

```
index.html         Anasayfa (hero + site haritası + canlı akış özeti)
hakkimda.html       Hakkımda / geçiş hikâyesi
yetenekler.html     Yetenek şeması
projeler.html       Kaggle/GitHub projeleri (assets/projects.json'dan) + canlı repo akışı
yazilar.html        Medium yazıları (tamamen canlı akış)
kaynaklar.html      Kitaplar (assets/books.json), kurslar/sertifikalar (assets/courses.json) — ikisi de JSON'dan besleniyor
iletisim.html       İletişim + canlı LinkedIn profil kartı
gunluk.html         Mühendislik Günlüğü (Problem/Yaklaşım/Zorluk/Ders formatlı) — 4 arşiv girişi + Medium'dan canlı akış
404.html            Özel 404 sayfası
css/style.css       Ortak tasarım sistemi
css/zealcoder-feeds.css  Canlı akış bileşenlerinin stili
js/site.js          Mobil menü, scroll spine, arka plan devre animasyonu
js/i18n.js          TR/EN sözlük + dil değiştirme mantığı
js/zealcoder-feeds.js   GitHub REST API + Medium RSS + assets/*.json'dan içerik render eden katman
js/zealcoder-comments.js   Kitap/proje/yazı yorumları (Supabase)
assets/projects.json, courses.json, books.json, skills.json, kaggle-feed.json   Tüm "kendi kendini besleyen" içerik burada
sitemap.xml, robots.txt, site.webmanifest, favicon.ico, assets/  SEO ve simge dosyaları
```

Sayfa numaralandırması (eyebrow'lardaki 01–07) site haritasındaki sırayla eşleşir: 01 Hakkımda, 02 Yetenekler, 03 Projeler, 04 Yazılar, 05 Kaynaklar, 06 Günlük, 07 İletişim.

## "Kendi kendini besleme" nasıl çalışıyor

- **GitHub**: anasayfa ve Projeler sayfası, `api.github.com/users/zealcoder95/events` ve `.../repos` uçlarını doğrudan tarayıcıdan, anahtarsız olarak çağırır. GitHub'da yeni bir commit/repo/PR olduğunda site bir sonraki ziyarette otomatik günceller.
- **Medium**: Yazılar sayfası ve anasayfa, `medium.com/feed/@zealcoder` RSS akışını `rss2json.com` üzerinden JSON'a çevirip gösterir. Medium'da yayımladığınız her yeni yazı otomatik görünür.
- **LinkedIn**: LinkedIn üçüncü taraf sitelere canlı bir "son paylaşımlar" API'si açmıyor. Bunun yerine İletişim sayfasında LinkedIn'in resmi profil rozeti (`platform.linkedin.com/badges`) gömülü — fotoğrafınız ve unvanınız LinkedIn'de değiştikçe orada da güncellenir. Gönderi düzeyinde bir akış istiyorsanız gerçekçi yol bir arka uç (ör. Zapier/Make + LinkedIn API onaylı erişim) kurmaktır; bu, statik bir siteyle yapılamaz.
- Her iki canlı akış da API ulaşılamazsa sessizce statik bir yedek karta düşer, hiçbir zaman boş/kırık görünmez.
- **Önbellek (cache) katmanı**: her iki akış da son başarılı sonucunu `localStorage`'a 15 dakikalık bir TTL ile yazar. Sayfa her açıldığında önce bu önbellekten anında render edilir (iskelet/skeleton görünmeden), ardından — önbellek 15 dakikadan eskiyse — arka planda tazelenir. Bunun iki somut faydası var: (1) GitHub'ın kimliksiz istemciler için uyguladığı saatlik istek sınırına ya da rss2json'un ücretsiz kotasına aynı anda birçok ziyaretçi (ör. bir işverenin ekibi) geldiğinde takılmaz; (2) bir önceki başarılı veri her zaman elde tutulur, yani bir API çağrısı başarısız olsa bile ekranda hâlâ gerçek (sadece birkaç dakika eski) içerik görünür, statik yedek karta sadece hiç veri yoksa düşülür.
- **Kaggle**: Kaggle'ın public API'si kimlik doğrulama (API token) gerektiriyor ve tarayıcıdan anonim/CORS istekleri kabul etmiyor — bu yüzden GitHub/Medium'daki gibi anahtarsız bir canlı çağrı teknik olarak mümkün değil. Bunun yerine bir GitHub Action her gün sunucu tarafında (repo secret ile) Kaggle'a bağlanıp sonucu `assets/kaggle-feed.json`'a yazıyor; Projeler sayfası bu dosyayı okuyor. Yani gerçek zamanlı değil ama günlük otomatik senkron — elle dokunmaya gerek yok.
- **Projeler ve Kaynaklar (kitap/kurs)**: bunlar dış bir platformdan değil, repodaki `assets/projects.json`, `assets/books.json` ve `assets/courses.json` dosyalarından besleniyor. Yeni bir proje/kitap/kurs eklemek o dosyalardan birine bir obje eklemek kadar basit — adımlar için `docs/icerik-ekleme-rehberi.md`'ye bakın.

## Diğer notlar

- `favicon.ico` (kök dizinde) — eski tarayıcı/araçların otomatik aradığı klasik favicon formatı.
- Tüm sayfalarda script'ler `defer` ile yükleniyor ve `api.github.com` / `api.rss2json.com` için `preconnect` ipuçları eklendi — ilk yükleme biraz daha hızlı.
- Aktif nav bağlantılarına `aria-current="page"` eklendi (ekran okuyucular artık hangi sayfada olunduğunu `class="active"`'ten bağımsız olarak da anlıyor).
- `og:image:width` / `og:image:height` meta etiketleri eklendi, böylece paylaşım kartları önizlemeyi doğru en-boy oranıyla render ediyor.

## İçerik ekleme

Projeler, Kitaplar, Kurslar/Sertifikalar ve Yetenekler artık `assets/*.json` dosyalarından besleniyor — HTML veya i18n dosyasına dokunmadan, sadece ilgili JSON dosyasına bir obje ekleyerek büyütülüyor. Adım adım örnekler için `docs/icerik-ekleme-rehberi.md`'ye bakın.

Günlük girişleri için iki yol var: Medium'da "gunluk" etiketiyle yazı yayınlamak (otomatik görünür) veya `gunluk.html`'deki 4 arşiv girişindeki `.journal-entry` desenini (Problem/Yaklaşım/Zorluk/Ders) elle kopyalamak — ikincisi hâlâ manuel, çünkü bu format Medium'un RSS'inde birebir karşılığı olmayan, siteye özel bir yapı.

## Yayına almadan önce yapılacaklar

1. **Domain**: Tüm `<link rel="canonical">`, Open Graph/Twitter meta etiketleri, `sitemap.xml` ve `robots.txt` artık gerçek yayın adresi olan `https://zealcoder-portfolio.vercel.app/` üzerinden ayarlı. Özel bir alan adı bağlarsanız bu dosyalardaki URL'leri güncelleyin (`grep -rl "zealcoder-portfolio.vercel.app" .` ile hepsini bulabilirsiniz).
2. **Vercel**: Site zaten Vercel'de yayında (bu depoyu Vercel'e bağlayınca her `main` push'unda otomatik deploy olur). Özel bir alan adı bağlamak isterseniz Vercel proje ayarlarından *Domains* kısmından ekleyebilirsiniz.
3. **Google Search Console**: Yayınlandıktan sonra domaini doğrulayıp `sitemap.xml`'i gönderin, böylece arama sonuçlarına daha hızlı girer.
4. **og:image**: `assets/og-image.png` (1200×630, site paletiyle üretilmiş özel bir paylaşım görseli) tüm sayfalarda tanımlı — ayrıca bir görsel hazırlamana gerek yok. Marka veya vurgu rengini değiştirirsen `assets/og-image.png`'yi de yeniden üretmen gerekir.

## Yeni bir sayfa/bölüm eklerken

- Yeni HTML dosyasını mevcut sayfalardan biri gibi başlatın (nav + skip-link + `<main id="main-content">` + footer + üç script etiketi).
- Görünür her metni `js/i18n.js` içine hem `tr` hem `en` anahtarı olarak ekleyin, elemente `data-i18n="anahtar"` (ya da HTML içeriyorsa `data-i18n-html`) verin.
- Sayfayı `sitemap.xml`'e ekleyin.

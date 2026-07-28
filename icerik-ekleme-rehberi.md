# İçerik ekleme rehberi

Site artık şu kaynaklardan **kendi kendini besliyor**:

| Bölüm | Kaynak | Siz ne yaparsınız |
|---|---|---|
| Projeler (kart grid) | `assets/projects.json` | O dosyayı GitHub'da düzenleyin |
| Projeler (alt akış) | GitHub API | Hiçbir şey — repo attıkça otomatik görünür |
| Yazılar | Medium RSS | Medium'da yazı yayınlayın, otomatik görünür (6'dan fazlası "profili gör" linkiyle Medium'a yönlenir) |
| Kaggle akışı | `assets/kaggle-feed.json` | Hiçbir şey — GitHub Action günlük günceller |
| **Yetenekler → Diller** | GitHub API (repo dilleri) | Hiçbir şey — yeni dilde repo açtıkça otomatik görünür |
| **Yetenekler → diğer kategoriler** | `assets/skills.json` | O dosyayı GitHub'da düzenleyin |
| **Kitaplar** | `assets/books.json` | O dosyayı GitHub'da düzenleyin |
| **Kurslar & Sertifikalar** | `assets/courses.json` | O dosyayı GitHub'da düzenleyin |
| **Günlük** | Medium RSS (`gunluk` etiketli yazılar) | Medium'da yazıp "gunluk" etiketini ekleyin (6'dan fazlası "profili gör" linkiyle Medium'a yönlenir) |
| **Yorumlar** | Supabase | Hiçbir şey — her kart zaten kaydırılabilir, gönderi başına yorum sayısı sınırsız |

Hiçbirinde artık HTML veya i18n dosyasına dokunmanız gerekmiyor.

## 1. Yeni kitap eklemek

`assets/books.json` dosyasını GitHub'da açın (repo → `assets/books.json` → kalem/edit ikonu), `items` listesinin sonuna şunu ekleyin:

```json
{
  "id": "b16",
  "category": "makine-ogrenmesi",
  "link": "https://kitabin-linki.com",
  "cover": "https://covers.openlibrary.org/b/isbn/<ISBN>-L.jpg",
  "tag": { "tr": "Yazar · Kategori", "en": "Author · Category" },
  "title": { "tr": "Kitap Adı", "en": "Book Title" },
  "desc": {
    "tr": "1-2 cümlelik Türkçe açıklama.",
    "en": "1-2 sentence English description."
  }
}
```

`cover` opsiyonel — kitabın ISBN'ini biliyorsanız yukarıdaki gibi Open Library linkini
kullanın (ücretsiz, hesap gerekmez); bilmiyorsanız satırı tamamen silin, kart kapaksız
ama hatasız görünür.

`category` şu değerlerden biri olmalı (filtre butonlarıyla eşleşir):
`python`, `istatistik`, `makine-ogrenmesi`, `derin-ogrenme`, `zaman-serisi`, `ml-ops`, `veri-analizi`

Kaydedin (commit), Vercel otomatik deploy eder — kitap Kaynaklar sayfasında görünür.

## 2. Yeni proje eklemek

`assets/projects.json` dosyasını GitHub'da açın, `items` listesinin sonuna şunu ekleyin:

```json
{
  "id": "p5",
  "icon": "bars",
  "link": "https://kaggle-veya-github-linki.com",
  "tag": { "tr": "Kaggle · Kategori", "en": "Kaggle · Category" },
  "title": { "tr": "Proje Adı", "en": "Project Title" },
  "desc": {
    "tr": "1-2 cümlelik Türkçe açıklama.",
    "en": "1-2 sentence English description."
  },
  "chart": {
    "img": "assets/projects/gorsel-adi.png",
    "alt": { "tr": "Görselin Türkçe açıklaması", "en": "Image description in English" }
  }
}
```

- `icon`, şu hazır ikonlardan biri olabilir: `survey`, `network`, `leaf`, `bars`, `code`. Belirtmezseniz veya listede olmayan bir şey yazarsanız otomatik olarak `code` ikonu kullanılır.
- `link` alanına Kaggle veya GitHub linki koyarsanız buton metni ("Kaggle'da incele →" / "GitHub'da incele →") otomatik seçilir; başka bir site ise genel "İncele →" metni kullanılır.
- `chart` isteğe bağlıdır — görsel/grafik eklemek istemiyorsanız bu alanı tamamen çıkarabilirsiniz; görseli önce `assets/projects/` klasörüne yükleyin.
- 6'dan fazla proje olduğunda otomatik olarak "Daha fazla göster" butonu çıkar, kalan sayıyı kendisi hesaplar.

Kaydedin (commit), Vercel otomatik deploy eder — proje Projeler sayfasında görünür.

## 3. Yeni kurs/sertifika eklemek

`assets/courses.json` dosyasını GitHub'da açın, `items` listesinin sonuna şunu ekleyin:

```json
{
  "id": "c5",
  "provider": "Kurum/Platform Adı",
  "desc": {
    "tr": "Alınan eğitimlerin Türkçe listesi/açıklaması.",
    "en": "English list/description of the trainings taken."
  }
}
```

Kaydedin (commit), Vercel otomatik deploy eder — Kaynaklar sayfasındaki "Kurslar & Sertifikalar" bölümünde görünür.

## 4. Yeni yetenek/araç eklemek

- **Programlama dili** ise: hiçbir şey yapmanıza gerek yok, o dilde bir repo GitHub'da göründüğü an otomatik çıkar.
- **Kütüphane/araç** (örn. Tableau, Power BI, yeni bir kütüphane) ise: `assets/skills.json`'ı açın, ilgili kategorinin `chips` listesine ekleyin, ya da tamamen yeni bir kategori isterseniz `categories` listesine yeni bir obje ekleyin:

```json
{
  "id": "mlops",
  "title": { "tr": "MLOps", "en": "MLOps" },
  "desc": { "tr": "Kısa açıklama.", "en": "Short description." },
  "chips": ["Docker", "MLflow"]
}
```

## 5. Yeni günlük girişi eklemek

Medium'da her zamanki gibi yazın, yayınlarken etiketlere (tags) **"gunluk"** kelimesini ekleyin (Türkçe karakter yazsanız da olur, ikisi de tanınıyor).

- "gunluk" etiketli yazılar → otomatik olarak **Günlük** sayfasına düşer
- Etiketsiz yazılar → **Yazılar** sayfasında kalır (ikisine birden düşmez)

Mevcut 4 elle yazılmış Problem/Yaklaşım/Zorluk/Ders formatındaki girişler olduğu gibi arşivde kalıyor; Medium'dan gelenler bunların üstünde, en yeni önce sırayla listelenir.

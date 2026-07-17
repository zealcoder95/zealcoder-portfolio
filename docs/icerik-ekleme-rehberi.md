# İçerik ekleme rehberi

Bu değişiklikten sonra site artık şu 7 kaynaktan **kendi kendini besliyor**:

| Bölüm | Kaynak | Siz ne yaparsınız |
|---|---|---|
| Projeler (alt akış) | GitHub API | Hiçbir şey — repo attıkça otomatik görünür |
| Yazılar | Medium RSS | Medium'da yazı yayınlayın, otomatik görünür |
| Kaggle akışı | `assets/kaggle-feed.json` | Hiçbir şey — GitHub Action günlük günceller |
| **Yetenekler → Diller** | GitHub API (repo dilleri) | Hiçbir şey — yeni dilde repo açtıkça otomatik görünür |
| **Yetenekler → diğer kategoriler** | `assets/skills.json` | O dosyayı GitHub'da düzenleyin |
| **Kitaplar** | `assets/books.json` | O dosyayı GitHub'da düzenleyin |
| **Günlük** | Medium RSS (`gunluk` etiketli yazılar) | Medium'da yazıp "gunluk" etiketini ekleyin |

Hiçbirinde artık HTML veya i18n dosyasına dokunmanız gerekmiyor.

## 1. Yeni kitap eklemek

`assets/books.json` dosyasını GitHub'da açın (repo → `assets/books.json` → kalem/edit ikonu), `items` listesinin sonuna şunu ekleyin:

```json
{
  "id": "b16",
  "category": "makine-ogrenmesi",
  "link": "https://kitabin-linki.com",
  "tag": { "tr": "Yazar · Kategori", "en": "Author · Category" },
  "title": { "tr": "Kitap Adı", "en": "Book Title" },
  "desc": {
    "tr": "1-2 cümlelik Türkçe açıklama.",
    "en": "1-2 sentence English description."
  }
}
```

`category` şu değerlerden biri olmalı (filtre butonlarıyla eşleşir):
`python`, `istatistik`, `makine-ogrenmesi`, `derin-ogrenme`, `zaman-serisi`, `ml-ops`, `veri-analizi`

Kaydedin (commit), Vercel otomatik deploy eder — kitap Kaynaklar sayfasında görünür.

## 2. Yeni yetenek/araç eklemek

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

## 3. Yeni günlük girişi eklemek

Medium'da her zamanki gibi yazın, yayınlarken etiketlere (tags) **"gunluk"** kelimesini ekleyin (Türkçe karakter yazsanız da olur, ikisi de tanınıyor).

- "gunluk" etiketli yazılar → otomatik olarak **Günlük** sayfasına düşer
- Etiketsiz yazılar → **Yazılar** sayfasında kalır (ikisine birden düşmez)

Mevcut 4 elle yazılmış Problem/Yaklaşım/Zorluk/Ders formatındaki girişler olduğu gibi arşivde kalıyor; Medium'dan gelenler bunların üstünde, en yeni önce sırayla listelenir.

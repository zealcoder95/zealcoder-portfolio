# Yorumlar rehberi

Kitaplar, projeler ve yazılar/günlük artık ziyaretçilerin yorum bırakabildiği
küçük bir bölüme sahip. Veri Supabase'te (`zealcoder-platform` projesi,
`public.comments` tablosu) tutuluyor — sitenin geri kalanı gibi statik
kalmaya devam ediyor, ekstra bir sunucu yok.

## Nasıl çalışıyor

- Her kart/yazının altında **"💬 Yorumlar"** butonu var, tıklanınca yorumlar
  ve bir "yorum yap" formu açılıyor.
- Kim olursa olsun (hesap gerekmez) isim + yorum yazıp gönderebilir.
- Gönderilen her yorum veritabanı tarafında otomatik olarak taranıyor
  (bkz. "Otomatik filtre" bölümü). **Temiz** görünen yorumlar anında
  yayınlanıyor. **Şüpheli** görünenler (link, e-posta, telefon numarası,
  bilinen spam/kumar/reklam kelimeleri, aşırı tekrarlanan karakter)
  onaysız kalıyor ve siz onaylamadan sitede görünmüyor.

## Otomatik filtre

`comments_moderate` adlı bir veritabanı trigger'ı, her yeni yorumda
`is_approved` alanını kendisi hesaplıyor — istemci tarafından gönderilen
değeri (varsa) tamamen görmezden geliyor, yani anon anahtarla biri
`is_approved: true` göndermeye çalışsa bile bu işe yaramıyor.

Şüpheli sayan durumlar:
- Herhangi bir link (`http(s)://`, `www.`, ya da `.com/.net/.xyz` gibi bir uzantı)
- E-posta adresi
- Uzun bir rakam dizisi (telefon numarası / promosyon kodu görünümü)
- Aynı karakterin art arda 6+ kez tekrarı (`aaaaaa`, `!!!!!!`)
- Bilinen spam/kumar/reklam kelimeleri (bahis, kripto kazan, takipçi satın al, vb. — liste `comments_moderate` fonksiyonunun içinde, ihtiyaç oldukça genişletilebilir)

Bu filtre yanılabilir — meşru bir yorum yanlışlıkla onaya düşebilir
(ör. birisi linkli bir kaynak paylaşırsa). O yüzden "Yeni yorumları
onaylama" adımı hâlâ geçerli, sadece artık çoğu temiz yorum için
gerekmiyor.

## Yeni yorumları onaylama

1. [supabase.com/dashboard](https://supabase.com/dashboard) → `zealcoder-platform` projesi → **Table Editor** → `comments` tablosu.
2. Yeni satırlarda `is_approved` sütunu `false` görünür. Yayınlamak
   istediğiniz yorum için bu değeri `true` yapıp kaydedin — birkaç dakika
   içinde (tarayıcı önbelleği nedeniyle) sitede görünür.
3. İstemediğiniz bir yorumu tamamen silmek için satırı seçip silebilirsiniz.

Şu an için ayrı bir onay ekranı/panel kurulmadı — Supabase'in kendi tablo
arayüzü bu iş için yeterli ve ekstra bakım gerektirmiyor. İleride onay
işini otomatikleştirmek (ör. bir e-posta bildirimi) isterseniz, bu da
üzerine kurulabilir.

## Hangi içerikler yorum alıyor

| İçerik | `item_type` | `item_id` |
|---|---|---|
| Kitaplar (`kaynaklar.html`) | `book` | `assets/books.json`'daki `id` (b1, b2, …) |
| Statik proje kartları (`projeler.html`) | `project` | p1–p4 |
| Statik günlük arşivi (`gunluk.html`) | `post` | e1–e4 |
| Medium'dan çekilen günlük/yazılar | `post` | yazının Medium linki |

GitHub/Kaggle akışı gibi tamamen otomatik/geçici listelerde yorum yok —
bunlar sürekli değişip yenilendiği için kalıcı bir yorum ipliği anlamlı
olmuyor.

## Teknik not

`js/zealcoder-comments.js` içindeki anahtar (`sb_publishable_...`) bilerek
herkese açık — Supabase'te güvenlik gizli anahtarla değil, tablonun
Row Level Security kurallarıyla sağlanıyor: herkes yorum **ekleyebilir**,
ama sadece `is_approved = true` olan yorumları **okuyabilir**, ve
`is_approved` alanını ziyaretçi tarafında değiştirmek mümkün değil.

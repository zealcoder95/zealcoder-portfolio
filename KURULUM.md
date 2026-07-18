# Kitaplar & Sertifikalar — Google Sheet'ten canlı besleme kurulumu

## Ne değişti
`js/zealcoder-feeds.js` güncellendi: Kitaplar ve Kurslar/Sertifikalar bölümleri artık
önce Google E-Tablonuzu (CSV olarak, anahtarsız) okumayı deniyor. Sheet'e ulaşamazsa,
boşsa ya da sekme adı yanlışsa **sessizce** repodaki `assets/books.json` /
`assets/courses.json` dosyasına düşüyor — yani bu bir tek nokta arıza değil, sitenin
GitHub/Medium akışlarında zaten kullandığı "önce canlı dene, olmazsa yedeğe düş" deseninin
aynısı.

## Sheet'te yapmanız gerekenler (tek seferlik)
1. Verdiğiniz tabloyu açın: https://docs.google.com/spreadsheets/d/1l3Ya1x8NLN4NpnRk8Nq-SonQt_k4Ag51tM480spN12U
2. Alttaki "Sheet1" sekmesine sağ tıklayıp **"Yeniden adlandır"** ile adını `Kitaplar` yapın.
3. `Dosya → İçe Aktar → Yükle` ile bu pakette gelen `kitaplar_template.csv` dosyasını seçin,
   "Geçerli sayfayı değiştir" seçeneğiyle içe aktarın. (Mevcut 15 kitabınız zaten bu dosyada,
   hazır geliyor — sıfırdan girmenize gerek yok.)
4. Alt sekmelerden `+` ile yeni bir sekme açın, adını `Sertifikalar` yapın, aynı şekilde
   `sertifikalar_template.csv`'yi içe aktarın.
5. Sağ üstteki **Paylaş** düğmesine basın → "Genel erişim" kısmını **"Bağlantıya sahip
   olan herkes"** + rol **"Görüntüleyici"** yapın. (Düzenleyici değil — sadece okuma
   yeterli ve daha güvenli.)

## Yeni kitap/kurs eklemek artık
Sheet'te ilgili sekmeye bir satır eklemek yeterli — kolonlar:
- **Kitaplar**: id, category, link, tag_tr, tag_en, title_tr, title_en, desc_tr, desc_en
- **Sertifikalar**: id, provider, desc_tr, desc_en

`category` alanı için mevcut değerler: ml-ops, istatistik, zaman-serisi, makine-ogrenmesi,
derin-ogrenme, veri-analizi, python (site bu değerlere göre filtre çipleri gösteriyor —
yeni bir kategori de eklerseniz filtre otomatik görünür, ekstra kod gerekmez).

Git commit yok, deploy yok — kaydettiğiniz an (Sheet'in kendi otomatik kaydı) site en
geç 15 dakika içinde (cache TTL) yeni satırı gösterir; sert yenilemeyle hemen de görebilirsiniz.

## Kod tarafında ne test ettim
- CSV parser'ı Node ile gerçek verinizle (virgüllü/tırnaklı açıklamalar dahil) test ettim,
  15 kitap + 4 kurum doğru parse oldu.
- Paylaşılmamış/özel bir sheet'in döndürdüğü HTML giriş sayfasını da ayrı bir hata durumu
  olarak yakalıyor (CSV sanıp bozuk göstermek yerine JSON yedeğine düşüyor).
- `node --check` ile tüm dosyanın söz dizimi doğrulandı.

## Yapmanız gereken
1. Bu pakette `js/zealcoder-feeds.js` dosyasını repo kökünüzdeki `js/` klasörünün üzerine kopyalayın.
2. Yukarıdaki Sheet kurulum adımlarını tamamlayın.
3. `git add -A && git commit -m "feat: kitap/sertifika Google Sheet'ten besleniyor" && git push`

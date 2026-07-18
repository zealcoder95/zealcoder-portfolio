# Site düzeltme paketi — ne kontrol edildi, ne değişti

## 1) Projeler sayfasındaki kırık görseller
- `assets/projects.json` içindeki 3 proje (Employee Exit Survey, NYC High School, Adidas)
  zaten doğru görsel yoluna işaret ediyor, ve `assets/projects/` klasöründe bu 3 PNG de
  mevcut ve sağlam (bozuk/boş dosya değil).
- Yani kod ve dosyalar yerelde/bu pakette %100 doğru. Siteyi canlıda kırık gösteren şey
  kod hatası değil — büyük ihtimalle bu dosyaların GitHub'a push edilmemiş ya da Vercel'in
  onları içeren son commit'i henüz deploy etmemiş olması. Aşağıdaki kontrol listesine bakın.

## 2) Kitaplar / Kurslar-Sertifikalar "yüklenemedi" hatası
- `assets/books.json` (15 kitap) ve `assets/courses.json` (4 kurum) zaten dolu ve geçerli JSON.
  Fetch kodu (`js/zealcoder-feeds.js`) da bu dosyalarla birebir uyumlu, bir kod hatası bulmadım.
- Yani buradaki veri de eksik değil — sorun büyük ihtimalle yine deploy senkron sorunu.
  Google Drive linklerini bu yüzden kullanmadım: sitenin zaten JSON'da tam veri var,
  Drive'dan yeniden çekmeye gerek yoktu.

## 3) Eklediğim şey: Adana proje kartındaki boşluk
- "Climate Change & Renewable Energy in Adana" kartının hiç grafiği yoktu, bu yüzden
  kart içinde diğerlerine göre tuhaf bir boşluk oluşuyordu. Zip'inizdeki gerçek Ember
  verisinden (emberChartData_1.xlsx) 2018-2022 Adana fosil vs yenilenebilir elektrik
  üretimi grafiğini oluşturdum: `assets/projects/adana-energy-trend.png`, ve
  `assets/projects.json`'a bu projenin "chart" alanını ekledim.

## Yapmanız gerekenler
1. Bu pakette `assets/` klasörünü indirip repo kökünüzdeki `assets/` klasörünün üzerine kopyalayın.
2. `git status` ile hangi dosyaların değiştiğini/yeni eklendiğini görün.
3. `git add -A && git commit -m "fix: proje görselleri ve Adana grafiği" && git push`
4. Vercel dashboard'da yeni deploy'un başladığını ve "Ready" olduğunu doğrulayın
   (bazen bir önceki deploy commit'i yakalamamış olabilir).
5. Siteyi sert yenileme (Cmd+Shift+R / Ctrl+Shift+R) ile açıp kontrol edin — tarayıcı
   önbelleği eski kırık halini tutuyor olabilir.
6. GitHub'da repo sayfasından `assets/projects/` klasörüne girip 4 PNG dosyasının da
   gerçekten orada ve 0 KB olmadığını gözle doğrulayın — bazen büyük ikili dosyalar
   push sırasında sessizce atlanabiliyor.

## Not: Writing / Medium sayfası
Ekran görüntüsündeki "New content is on the way" kutusu bir hata değil — Medium'da henüz
"gunluk"/yazı yayımlamadığınız için tasarımın kendisi bu yedek kartı gösteriyor
(README'de de bu davranış açıkça belgelenmiş). İlk Medium yazınızı yayımladığınızda
otomatik olarak gerçek içerikle değişecek.

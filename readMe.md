# Gariban – 2.5D Üstten Bakışlı Gerçek Zamanlı Orta Çağ Strateji Oyunu

## 🎮 Oyun Konsepti
Gariban, oyuncuların okçu, piyade ve atlı birliklerini yöneterek birbirlerine karşı savaşacakları, gerçek zamanlı, çok oyunculu bir strateji oyunudur. Oyuncular, harita üzerinde şehirler kurar, kaleler inşa eder ve düşmanlarını yenmeye çalışır. Oyunun amacı, rakip oyuncunun kalelerini ele geçirmek ve tüm düşman birimlerini yok etmektir.

## 🕹️ Oyun Nasıl Oynanır?
### 1. Başlangıç Ekranı
Oyun başladığında, aşağıdaki adımlar takip edilir:
- **Kullanıcı adı girin**: Ekranda bir kullanıcı adı girme kutusu olacak. Buraya bir isim yazmanız istenecektir.
- **Eşleşme başlatın**: Kullanıcı adı girdikten sonra "Eşleşmeye Başla" butonuna tıklayarak, oyun eşleşme ekranına geçer. Burada, başka bir oyuncuyla eşleşene kadar beklemeniz gerekecek.
- **Eşleşme**: Eşleşme sağlandıktan sonra, her iki oyuncu aynı harita üzerinde karşı karşıya gelir.

### 2. Oynanış ve Temel Etkileşimler
Oyun, gerçek zamanlı strateji ve taktiksel hamleler gerektirir. Kullanıcı, aşağıdaki etkileşimlerle birimleri yönetebilir:

#### Asker Seçimi ve Hareketi
- **Sol Tıklama ile Seçim**: Ekranda birliklerinizin bulunduğu alanda sol tıklama ile bir asker veya birim seçebilirsiniz. Birlikler, seçildiğinde etrafında bir çerçeve veya simge ile işaretlenecek.
- **Sağ Tıklama ile Hareket Ettirme**: Seçilen birliklerinizi hareket ettirmek için, sağ tıklama yaparak hedef noktayı belirleyebilirsiniz. Hedef nokta harita üzerinde işaretlenecek ve birimleriniz oraya hareket edecektir. Birimler, hedef noktaya ulaştıklarında duracak ve bekleyecek.

#### Düşmana Saldırma
- **Birimleri seçtikten sonra**, düşman birliğine sağ tıklayarak saldırı komutu verebilirsiniz. Seçilen birimler, düşman birliği ile karşılaştığında otomatik olarak savaşmaya başlayacak.

#### Savaş ve Birim Özellikleri
- **Okçular**: Uzak mesafeden düşman birimlerine ok fırlatarak hasar verir. Hedeflerine doğru ilerleyen okçular, onları etkili bir şekilde uzak tutar.
- **Piyadeler**: Daha dengeli ve savunma odaklı birimdir. Yakın dövüşte etkili olup, düşmanlarla yüzleştiğinde onlara büyük hasar verebilir.
- **Atlılar**: Hızlı hareket eder ve düşmanları çabucak geçebilir. Ancak savunma konusunda zayıftırlar.

### 3. Kaynak Yönetimi ve Şehir/Kale Kurma
#### Kaynaklar
Altın, Taş ve Odun gibi kaynaklar harita üzerinde belirli bölgelerde bulunur. Kaynakları toplamak için birimlerinizin bu bölgelere gitmesini sağlamak gereklidir.

#### Şehir ve Kale İnşası
- **Şehirler**: Kaynak üretimi sağlar ve oyuncuya ekonomik avantajlar sunar.
- **Kaleler**: Savunma amacı taşır ve düşman saldırılarından korunmanızı sağlar.

#### Kaleleri Ele Geçirme
Rakip kalelerini ele geçirmek için onları kuşatıp savunmalarını kırmalısınız. Kaleyi ele geçirdiğinizde, kalenin savunma gücü ve kaynak üretimi size ait olacaktır.

## 🧠 Yapay Zekaya Talimatlar (3 Fazda)
Oyunun geliştirilmesi üç fazda yapılacak ve her fazın ne yapması gerektiği net bir şekilde açıklanacaktır.

### 1. Faz 1: Eşleşme ve Harita Oluşumu
- **Eşleşme**: Kullanıcı adı alındıktan sonra, eşleşme için diğer oyuncular beklenir. Socket.io kullanarak iki oyuncu birbirine bağlanır. Eğer başka oyuncu yoksa, sistem oyuncu eşleşmesi için bekler.
- **Harita Oluşumu**: İki oyuncu eşleştirildikten sonra, her iki oyuncuya da aynı harita gösterilecektir. Harita üzerinde şehirler, kaleler ve kaynak bölgeleri yer alır.

### 2. Faz 2: Birlik Seçimi ve Savaş
- **Birim Seçimi ve Hareket**: Kullanıcı, sol tıklayarak birimleri seçebilir. Sağ tıklama ile birimleri hareket ettirebilir. Seçilen birimler, belirtilen hedefe doğru ilerleyecek ve yol üzerindeki düşman birimleriyle karşılaştığında otomatik olarak savaş başlatılacaktır.
- **Savaş Başlatma**: Kullanıcı bir düşman birliği üzerine tıklayarak saldırı komutu verir. Birimler, düşmanlarıyla savaşırken sağlıklı bir şekilde savaşı sürdürebilmek için kullanıcı, yeni birlikler oluşturmalı ve stratejik bir plan yapmalıdır.

### 3. Faz 3: Kaynaklar, Şehir Kurma ve Kaleleri Ele Geçirme
- **Kaynak Yönetimi**: Kullanıcı, harita üzerinde bulunan kaynak bölgelerine birlik göndererek kaynak toplamaya başlar. Kaynaklar, şehirler ve kaleler inşa etmek için kullanılacaktır.
- **Şehir ve Kale İnşası**: Kullanıcı, kaynakları biriktirerek şehirler ve kaleler inşa edebilir. Kaleler savunma sağlar, şehirler ise kaynak üretir.
- **Kaleleri Ele Geçirme**: Rakip oyuncunun kalelerini ele geçirmek için savaşlar yapılır. Kaleyi ele geçiren oyuncu, o kalenin savunma gücüne ve kaynaklarına sahip olur.

## 📜 Oyun Sonu ve Skor
Oyun, bir oyuncunun tüm birlikleri yok olduğunda veya rakip kaleyi ele geçirdiğinde sona erer. Sonuçlar, her iki oyuncu için skor tablosu şeklinde gösterilecektir. Kazanan oyuncu, elde ettiği puanlara göre bir ödül alacak, kaybeden oyuncu ise kayıp alacaktır.

## ⚙️ Teknolojiler
Bu oyunun geliştirilmesi için JavaScript, Vite ve birkaç temel oyun kütüphanesi kullanılacaktır. İşte detaylar:

### 1. JavaScript (ES6+)
Dil: Oyun, modern JavaScript özelliklerini (ES6+) kullanarak geliştirilecektir. Asenkron işlemler, Promises, async/await yapıları ve modern döngüler kullanılacak.

- **Vite**: Hızlı bir geliştirme ortamı sağlamak ve projeyi hızlı bir şekilde oluşturmak için Vite kullanılacak. Vite, modüler yapısı ve hızlı sıcak yeniden yükleme (HMR) ile geliştirme sürecini hızlandıracak.

### 2. Oyun Kütüphaneleri
#### a) Phaser.js (Ana Oyun Motoru)
- **Neden Phaser?**  
  Phaser, 2D oyun geliştirmek için oldukça popüler ve güçlü bir kütüphanedir. Oyun alanı (canvas), animasyonlar, fizik motoru, kullanıcı etkileşimleri (mouse, klavye) gibi özellikleri oldukça verimli bir şekilde destekler. Phaser, harita oluşturma, savaş sistemi ve diğer temel oyun mekaniği için gerekli olan her şeyi sağlar.

- **Kullanım**:  
  Oyun haritası, birim hareketleri, savaş animasyonları ve kaynak yönetimi Phaser ile yapılacaktır. Phaser'ın `Physics.Arcade` özelliği, birimler arası çarpışmalar ve hareket simülasyonları için kullanılacak.  
  **Grid System**: Oyuncuların harita üzerinde kolayca hareket etmelerini sağlamak için bir grid (ızgara) sistemi kurulacak.

#### b) Socket.IO (Çok Oyunculu Mod)
- **Neden Socket.IO?**  
  Gerçek zamanlı etkileşim ve çok oyunculu oyunlar için Socket.IO kullanılacaktır. Socket.IO, istemci ve sunucu arasında anlık veri iletimi sağlar ve oyuncular arasında eşzamanlı oyun deneyimi sunar.

- **Kullanım**:  
  Oyuncular arasında bağlantı kurmak, veri iletmek ve eşleşme sağlamak için kullanılacaktır. Socket.IO, oyun başladığında oyuncuların eşleşmesini sağlayacak ve her iki oyuncunun da oyun durumlarını gerçek zamanlı olarak senkronize edecektir.

#### c) Cannon.js (Fizik Motoru)
- **Neden Cannon.js?**  
  Oyun dünyasında fiziksel hesaplamalar, çarpışmalar ve yer çekimi simülasyonu için Cannon.js kullanılacak. Cannon.js, animasyonlar ve savaş sahnelerinde gerçekçi fiziksel etkileşimler sağlayacaktır.

- **Kullanım**:  
  Birimler arasındaki savaşlar sırasında, özellikle okçular ve atlı birliklerin hareketleri ve çarpışmaları gibi fiziksel etkileşimleri yönetmek için kullanılacak.

#### d) Tiled Map Editor (Harita Tasarımı)
- **Neden Tiled?**  
  Tiled Map Editor, harita tasarımı için oldukça kullanışlı bir araçtır. 2D haritalar oluşturmak için verimli bir çözüm sunar. Oyun için şehirler, kaleler ve kaynak bölgeleri gibi elementler bu araçla tasarlanacaktır.

- **Kullanım**:  
  Harita tasarımında, Tiled ile hazırlanan `.tmx` dosyaları Phaser'da yüklenip oyun haritası oluşturulacaktır.

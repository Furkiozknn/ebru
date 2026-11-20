# Değişiklik günlüğü

## v2.1 · Kasım 2026

Bakım güncellemesi. Oynanış, kayıt anahtarları (`arena.ebru.*`) ve adresler değişmedi; eski kayıtlar olduğu gibi açılır.

### Yenilikler
- **Yenilikler penceresi ve sürüm etiketi:** Ana ekranın altında `v2.1 · Kasım 2026` düğmesi sürüm notlarını açar. Esc ile kapanır, Türkçe ve İngilizce çalışır.
- **Rozetler:** 9 rozet (ilk kâğıt, üç bölüm ustalığı, 3 usta mührü, 5 sayfalık galeri, ciltleme, tek nefes duvarı, 3 günlük seri). Rozetler mevcut kayıttan hesaplanır; yeni bir kayıt anahtarı yoktur.
- **Diğer oyunlar bağlantısı:** Ana ekranda merkez sayfaya (https://furkiozknn.github.io/) bağlantı. Portal yapılarında gizlenir.

### Düzeltmeler
- Telefonda ustanın canlı notu, hazne üstündeki boya adı etiketinin üstüne biniyordu; artık etiketin üstünde duruyor.
- Sayfa bilgileri: `lang="tr"` olmasına rağmen açıklama ve paylaşım kartı İngilizceydi. Başlık, açıklama, Open Graph ve Twitter kartı Türkçeleştirildi; `og:locale`, `og:image:alt`, Twitter görseli, `theme-color` ve kanonik bağlantı eklendi.
- Simge (favicon) yoktu; tarayıcı her açılışta 404 alıyordu. SVG simge eklendi.
- `404.html` eklendi (oyuna ve merkez sayfaya dönüş bağlantılı).

### Test
- `test/duman.mjs`: masaüstü (1366x768) ve telefon (390x844) görünümünde sayfa açılışı, konsol hatası, oyun başlangıcı, bir fırça darbesi, duraklatma, taşma ve yenilikler penceresi kontrolü.

# 🏋️ BKİ Takip ve Sağlıklı Yaşam

DSÖ standartlarına uygun, offline-first BKİ (Beden Kitle İndeksi) takip uygulaması.

React Native • Expo • TypeScript • SQLite

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 📊 **BKİ Hesaplama** | DSÖ standartlarına göre 8 kategorili sınıflandırma |
| 🔥 **BMR & TDEE** | Mifflin-St Jeor formülü ile bazal metabolizma hesabı |
| 🚶 **Adım Hedefi** | Kalori açığına göre günlük adım önerisi |
| 🍽️ **Besin Karşılıkları** | 20 temel Türk besini ile kalori eşdeğeri gösterimi |
| 📈 **İnteraktif Grafikler** | Filtrelenebilir çizgi grafik (7G / 1A / 3A / Tümü) |
| 🌙 **Karanlık Mod** | Tam dark/light tema desteği |
| 🔐 **Biyometrik Kilit** | FaceID / Parmak izi ile güvenlik |
| 🔔 **Hatırlatıcılar** | Günlük ölçüm bildirimleri |
| 💾 **Offline-First** | Tüm veriler yerel SQLite veritabanında |

---

## 📱 Ekranlar

- **Ana Sayfa** — Son BKİ kartı, mini trend grafiği, hızlı ölçüm FAB butonu
- **Yeni Ölçüm** — Boy/kilo kontrolleri, anlık BKİ önizleme, günlük 5 ölçüm limiti
- **Sonuçlar** — Gauge kadranı, BMR/TDEE bilgisi, adım hedefi, besin kartları
- **Grafikler** — DSÖ referans çizgili tam ekran çizgi grafik
- **Ayarlar** — Profil yönetimi, tema, biyometrik kilit, hatırlatıcılar

---

## 🧮 Formüller

```
BKİ = Kilo / (Boy / 100)²

BMR (Erkek)  = 10 × Kilo + 6.25 × Boy - 5 × Yaş + 5
BMR (Kadın)  = 10 × Kilo + 6.25 × Boy - 5 × Yaş - 161

Adım Hedefi  = Kalori Açığı / (0.04 × (Kilo / 70))
```

---

## 🛠️ Teknoloji Yığını

- **Framework:** React Native + Expo (SDK 55)
- **Dil:** TypeScript
- **Veritabanı:** SQLite (`expo-sqlite`) — Offline-first
- **Grafikler:** `react-native-gifted-charts`
- **Navigasyon:** React Navigation (Bottom Tabs + Stack)
- **Güvenlik:** `expo-local-authentication` + `expo-secure-store` (AES-256)
- **Bildirimler:** `expo-notifications`

---

## 🚀 Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npx expo start
```

> Expo Go uygulaması ile QR kodu okutarak test edebilirsiniz.

---

## 📂 Proje Yapısı

```
src/
├── components/      # BMICard, FAB, GaugeChart, FoodCard, FilterChip
├── database/        # SQLite şema, CRUD servisi, seed verileri
├── navigation/      # Bottom tabs + stack navigator
├── screens/         # Dashboard, NewMeasurement, Results, Chart, Settings
├── theme/           # Dark/light tema sistemi
├── types/           # TypeScript arayüzleri
└── utils/           # Hesaplama, güvenlik, bildirim yardımcıları
```

---

## 📋 Veritabanı Tabloları

| Tablo | Açıklama |
|---|---|
| `users` | Kullanıcı profili (ad, boy, kilo, hedef, aktivite) |
| `measurements` | Ölçüm kayıtları (BKİ, kategori, tarih, not) |
| `foods` | 20 temel besin (kalori değerleri) |
| `settings` | Tema, biyometrik kilit, dil tercihi |

---

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Herkes bu yazılımı özgürce kullanabilir, kopyalayabilir, değiştirebilir ve dağıtabilir.

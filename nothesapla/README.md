#  Not Hesapla

Öğrencilerin vize ve final notlarını girerek ağırlıklı ortalamalarını hesaplayabileceği basit bir mobil uygulama. **React Native + Expo** ile geliştirilmiştir.

## Özellikler

- 2 vize ve 1 final notu girişi
- Ağırlıklı ortalama hesaplama: **Vize 1 (%20) + Vize 2 (%20) + Final (%60)**
- Ortalama **50 ve üzeri** → Geçti, **50'nin altı** → Kaldı
- Final notu **50'nin altındaysa**, ortalama yeterli olsa bile **Kaldı**
- Not aralığı kontrolü (0-100)
- Sade ve minimal tasarım

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npx expo start
```

## Çalıştırma

| Platform | Komut |
|----------|-------|
| Web | `npx expo start --web` |
| Android | `npx expo start --android` |
| iOS | `npx expo start --ios` |
| Expo Go | QR kodu telefondan tarayın |

> **Not:** Cache sorunlarında `npx expo start --clear` kullanın.

## Teknolojiler

- React Native
- Expo SDK 54
- TypeScript

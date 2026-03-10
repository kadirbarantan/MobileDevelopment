// Open-Meteo API - Ücretsiz, API anahtarı gerektirmez
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// WMO Hava Durumu Kodları → Türkçe açıklama ve ikon
const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Açık hava', icon: '☀️' },
  1: { description: 'Çoğunlukla açık', icon: '🌤️' },
  2: { description: 'Parçalı bulutlu', icon: '⛅' },
  3: { description: 'Bulutlu', icon: '☁️' },
  45: { description: 'Sisli', icon: '🌫️' },
  48: { description: 'Kırağılı sis', icon: '🌫️' },
  51: { description: 'Hafif çisenti', icon: '🌦️' },
  53: { description: 'Orta çisenti', icon: '🌦️' },
  55: { description: 'Yoğun çisenti', icon: '🌦️' },
  61: { description: 'Hafif yağmur', icon: '🌧️' },
  63: { description: 'Orta yağmur', icon: '🌧️' },
  65: { description: 'Şiddetli yağmur', icon: '🌧️' },
  66: { description: 'Dondurucu hafif yağmur', icon: '🌨️' },
  67: { description: 'Dondurucu yağmur', icon: '🌨️' },
  71: { description: 'Hafif kar', icon: '🌨️' },
  73: { description: 'Orta kar', icon: '❄️' },
  75: { description: 'Yoğun kar', icon: '❄️' },
  77: { description: 'Kar taneleri', icon: '❄️' },
  80: { description: 'Hafif sağanak', icon: '🌦️' },
  81: { description: 'Orta sağanak', icon: '🌧️' },
  82: { description: 'Şiddetli sağanak', icon: '🌧️' },
  85: { description: 'Hafif kar sağanağı', icon: '🌨️' },
  86: { description: 'Yoğun kar sağanağı', icon: '❄️' },
  95: { description: 'Gök gürültülü fırtına', icon: '⛈️' },
  96: { description: 'Dolu ile fırtına', icon: '⛈️' },
  99: { description: 'Şiddetli dolu ile fırtına', icon: '⛈️' },
};

export interface WeatherData {
  cityName: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
  description: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  lat: number;
  lon: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  description: string;
  icon: string;
}

interface GeocodingResult {
  name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

function getWeatherInfo(code: number) {
  return WEATHER_CODES[code] || { description: 'Bilinmiyor', icon: '❓' };
}

export async function getWeatherByCoords(lat: number, lon: number, cityName?: string): Promise<{
  current: WeatherData;
  daily: DailyForecast[];
}> {
  const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Hava durumu verileri alınamadı');
  }
  const data = await response.json();

  // Şehir adı yoksa geocoding ile bul
  let resolvedCity = cityName || 'Konumunuz';
  let country = '';
  if (!cityName) {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`;
      const geoResponse = await fetch(geoUrl);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.results && geoData.results.length > 0) {
          resolvedCity = geoData.results[0].name;
          country = geoData.results[0].country_code;
        }
      }
    } catch {
      // Geocoding başarısız olursa sadece koordinat kullan
    }
  }

  const weatherInfo = getWeatherInfo(data.current.weather_code);

  const current: WeatherData = {
    cityName: resolvedCity,
    country,
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    pressure: Math.round(data.current.surface_pressure),
    weatherCode: data.current.weather_code,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
    tempMin: data.daily.temperature_2m_min[0],
    tempMax: data.daily.temperature_2m_max[0],
    lat,
    lon,
  };

  const daily: DailyForecast[] = data.daily.time.slice(1).map((date: string, i: number) => {
    const info = getWeatherInfo(data.daily.weather_code[i + 1]);
    return {
      date,
      tempMax: data.daily.temperature_2m_max[i + 1],
      tempMin: data.daily.temperature_2m_min[i + 1],
      weatherCode: data.daily.weather_code[i + 1],
      description: info.description,
      icon: info.icon,
    };
  });

  return { current, daily };
}

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=tr`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Arama başarısız');
  }
  const data = await response.json();
  return data.results || [];
}

export async function getWeatherByCity(cityName: string): Promise<{
  current: WeatherData;
  daily: DailyForecast[];
}> {
  const cities = await searchCity(cityName);
  if (cities.length === 0) {
    throw new Error('Şehir bulunamadı');
  }
  const city = cities[0];
  const result = await getWeatherByCoords(city.latitude, city.longitude, city.name);
  result.current.country = city.country_code;
  return result;
}

export function formatDate(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

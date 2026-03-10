import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Droplets, Gauge, Thermometer, Wind } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  formatDate,
  formatShortDate,
  getWeatherByCoords,
  type DailyForecast,
  type WeatherData,
} from '@/services/weather-api';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Konum izni verilmedi. Ayarlardan izin verin.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const result = await getWeatherByCoords(latitude, longitude);
      setWeather(result.current);
      setForecast(result.daily);
    } catch (err) {
      setError('Hava durumu verileri alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWeather();
  }, [fetchWeather]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <ThemedText style={styles.loadingText}>Konum alınıyor...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  if (!weather) return null;

  const gradientColors = colorScheme === 'dark'
    ? ['#1A1A2E', '#16213E', '#0F3460'] as const
    : ['#E8F4FD', '#D6EAF8', '#AED6F1'] as const;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Üst Gradient Alan */}
      <LinearGradient colors={gradientColors} style={styles.header}>
        <ThemedText style={[styles.cityName, { color: colors.text }]}>
          {weather.cityName}{weather.country ? `, ${weather.country}` : ''}
        </ThemedText>
        <ThemedText style={[styles.date, { color: colors.secondaryText }]}>
          {formatDate()}
        </ThemedText>

        <Text style={styles.weatherEmoji}>{weather.icon}</Text>

        <ThemedText style={[styles.temperature, { color: colors.text }]}>
          {Math.round(weather.temperature)}°C
        </ThemedText>

        <ThemedText style={[styles.description, { color: colors.text }]}>
          {weather.description}
        </ThemedText>

        <View style={styles.minMaxRow}>
          <View style={[styles.minMaxBadge, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
            <ThemedText style={[styles.minMaxText, { color: colors.text }]}>
              ↑ {Math.round(weather.tempMax)}°
            </ThemedText>
          </View>
          <View style={[styles.minMaxBadge, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
            <ThemedText style={[styles.minMaxText, { color: colors.text }]}>
              ↓ {Math.round(weather.tempMin)}°
            </ThemedText>
          </View>
        </View>
      </LinearGradient>

      {/* Detay Kartları */}
      <View style={styles.detailsGrid}>
        <View style={[styles.detailCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Thermometer size={22} color={colors.accent} />
          <ThemedText style={[styles.detailLabel, { color: colors.secondaryText }]}>Hissedilen</ThemedText>
          <ThemedText style={[styles.detailValue, { color: colors.text }]}>
            {Math.round(weather.feelsLike)}°C
          </ThemedText>
        </View>
        <View style={[styles.detailCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Droplets size={22} color={colors.accent} />
          <ThemedText style={[styles.detailLabel, { color: colors.secondaryText }]}>Nem</ThemedText>
          <ThemedText style={[styles.detailValue, { color: colors.text }]}>
            %{weather.humidity}
          </ThemedText>
        </View>
        <View style={[styles.detailCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Wind size={22} color={colors.accent} />
          <ThemedText style={[styles.detailLabel, { color: colors.secondaryText }]}>Rüzgar</ThemedText>
          <ThemedText style={[styles.detailValue, { color: colors.text }]}>
            {weather.windSpeed} km/s
          </ThemedText>
        </View>
        <View style={[styles.detailCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Gauge size={22} color={colors.accent} />
          <ThemedText style={[styles.detailLabel, { color: colors.secondaryText }]}>Basınç</ThemedText>
          <ThemedText style={[styles.detailValue, { color: colors.text }]}>
            {weather.pressure} hPa
          </ThemedText>
        </View>
      </View>

      {/* 5 Günlük Tahmin */}
      {forecast.length > 0 && (
        <View style={styles.forecastSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            5 Günlük Tahmin
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forecast.map((item, index) => (
              <View
                key={index}
                style={[styles.forecastCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              >
                <ThemedText style={[styles.forecastDay, { color: colors.secondaryText }]}>
                  {formatShortDate(item.date)}
                </ThemedText>
                <Text style={styles.forecastEmoji}>{item.icon}</Text>
                <ThemedText style={[styles.forecastTemp, { color: colors.text }]}>
                  {Math.round(item.tempMax)}°
                </ThemedText>
                <ThemedText style={[styles.forecastTempMin, { color: colors.secondaryText }]}>
                  {Math.round(item.tempMin)}°
                </ThemedText>
                <ThemedText style={[styles.forecastDesc, { color: colors.secondaryText }]} numberOfLines={1}>
                  {item.description}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  weatherEmoji: {
    fontSize: 80,
    marginTop: 16,
    textAlign: 'center',
  },
  temperature: {
    fontSize: 64,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 80,
  },
  description: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  minMaxRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  minMaxBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  minMaxText: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  forecastSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  forecastCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 110,
    borderWidth: 1,
  },
  forecastDay: {
    fontSize: 12,
    fontWeight: '500',
  },
  forecastEmoji: {
    fontSize: 32,
    marginVertical: 4,
  },
  forecastTemp: {
    fontSize: 20,
    fontWeight: '600',
  },
  forecastTempMin: {
    fontSize: 14,
    marginTop: 2,
  },
  forecastDesc: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});

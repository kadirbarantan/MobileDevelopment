import { Droplets, MapPin, Search, Wind } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getWeatherByCity,
  type WeatherData,
} from '@/services/weather-api';

const POPULAR_CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Antalya',
  'Bursa',
  'Trabzon',
  'Konya',
  'Adana',
];

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (cityName?: string) => {
    const searchCity = cityName || query.trim();
    if (!searchCity) return;

    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getWeatherByCity(searchCity);
      setResult(data.current);
    } catch {
      setError('Şehir bulunamadı. Lütfen doğru bir şehir adı girin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Başlık */}
      <View style={styles.titleSection}>
        <ThemedText style={[styles.title, { color: colors.text }]}>Şehir Ara</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.secondaryText }]}>
          Dünyadaki herhangi bir şehrin hava durumunu öğrenin
        </ThemedText>
      </View>

      {/* Arama Kutusu */}
      <View style={[styles.searchBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Search size={20} color={colors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Şehir adı yazın..."
          placeholderTextColor={colors.secondaryText}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={() => handleSearch()}
          style={[styles.searchButton, { backgroundColor: colors.accent }]}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.searchButtonText}>Ara</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Yükleniyor */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}

      {/* Hata */}
      {error && (
        <View style={[styles.errorCard, { backgroundColor: colors.cardBackground, borderColor: '#E74C3C' }]}>
          <ThemedText style={[styles.errorText, { color: '#E74C3C' }]}>{error}</ThemedText>
        </View>
      )}

      {/* Sonuç */}
      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.resultHeader}>
            <MapPin size={18} color={colors.accent} />
            <ThemedText style={[styles.resultCity, { color: colors.text }]}>
              {result.cityName}{result.country ? `, ${result.country}` : ''}
            </ThemedText>
          </View>

          <View style={styles.resultMain}>
            <Text style={styles.resultEmoji}>{result.icon}</Text>
            <View style={styles.resultTempSection}>
              <ThemedText style={[styles.resultTemp, { color: colors.text }]}>
                {Math.round(result.temperature)}°C
              </ThemedText>
              <ThemedText style={[styles.resultDesc, { color: colors.secondaryText }]}>
                {result.description}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.resultDivider, { backgroundColor: colors.border }]} />

          <View style={styles.resultDetails}>
            <View style={styles.resultDetailItem}>
              <Droplets size={16} color={colors.accent} />
              <ThemedText style={[styles.resultDetailText, { color: colors.secondaryText }]}>
                Nem: %{result.humidity}
              </ThemedText>
            </View>
            <View style={styles.resultDetailItem}>
              <Wind size={16} color={colors.accent} />
              <ThemedText style={[styles.resultDetailText, { color: colors.secondaryText }]}>
                Rüzgar: {result.windSpeed} km/s
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Popüler Şehirler */}
      {!result && !loading && (
        <View style={styles.popularSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Popüler Şehirler
          </ThemedText>
          <View style={styles.citiesGrid}>
            {POPULAR_CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.cityChip, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                onPress={() => {
                  setQuery(city);
                  handleSearch(city);
                }}
                activeOpacity={0.7}
              >
                <MapPin size={14} color={colors.accent} />
                <ThemedText style={[styles.cityChipText, { color: colors.text }]}>{city}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  errorCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  resultCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultCity: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  resultEmoji: {
    fontSize: 56,
  },
  resultTempSection: {
    marginLeft: 12,
  },
  resultTemp: {
    fontSize: 48,
    fontWeight: '200',
  },
  resultDesc: {
    fontSize: 16,
  },
  resultDivider: {
    height: 1,
    marginVertical: 16,
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resultDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultDetailText: {
    fontSize: 14,
  },
  popularSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  cityChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

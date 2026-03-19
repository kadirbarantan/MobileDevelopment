// ==================== Food Calorie Card ====================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Food } from '../types';

interface FoodCardProps {
  food: Food;
  equivalentPortions: number;
}

export default function FoodCard({ food, equivalentPortions }: FoodCardProps) {
  const { theme } = useTheme();

  const foodEmojis: Record<string, string> = {
    'Beyaz Ekmek': '🍞',
    'Tam Buğday Ekmeği': '🥖',
    'Yumurta': '🥚',
    'Pilav': '🍚',
    'Makarna': '🍝',
    'Bulgur Pilavı': '🌾',
    'Mercimek Çorbası': '🍲',
    'Yoğurt': '🥛',
    'Süt': '🥛',
    'Beyaz Peynir': '🧀',
    'Tavuk Göğsü': '🍗',
    'Kıyma': '🥩',
    'Kuru Fasulye': '🫘',
    'Elma': '🍎',
    'Muz': '🍌',
    'Domates': '🍅',
    'Zeytinyağı': '🫒',
    'Bal': '🍯',
    'Ceviz': '🥜',
    'Kuru Kayısı': '🟠',
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
      <Text style={styles.emoji}>{foodEmojis[food.name] || '🍽️'}</Text>
      <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
        {food.name}
      </Text>
      <Text style={[styles.portions, { color: theme.colors.primary }]}>
        {equivalentPortions.toFixed(1)}
      </Text>
      <Text style={[styles.unit, { color: theme.colors.textTertiary }]}>
        {food.portion_unit}
      </Text>
      <Text style={[styles.cal, { color: theme.colors.textSecondary }]}>
        {food.calories_per_portion} kcal
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12,
    gap: 4,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  portions: {
    fontSize: 22,
    fontWeight: '800',
  },
  unit: {
    fontSize: 10,
    fontWeight: '500',
  },
  cal: {
    fontSize: 10,
  },
});

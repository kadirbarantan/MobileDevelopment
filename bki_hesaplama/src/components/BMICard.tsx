// ==================== BMI Summary Card ====================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getBMICategory } from '../utils/calculations';
import { Measurement } from '../types';

interface BMICardProps {
  measurement: Measurement | null;
}

export default function BMICard({ measurement }: BMICardProps) {
  const { theme } = useTheme();

  if (!measurement) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon]}>📏</Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Henüz ölçüm yok</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            İlk ölçümünüzü eklemek için + butonuna dokunun
          </Text>
        </View>
      </View>
    );
  }

  const category = getBMICategory(measurement.bmi_value);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textSecondary }]}>Son BKİ Değeriniz</Text>
        <View style={[styles.badge, { backgroundColor: category.color + '20' }]}>
          <Text style={[styles.badgeText, { color: category.color }]}>{category.labelTR}</Text>
        </View>
      </View>

      <View style={styles.bmiRow}>
        <Text style={[styles.bmiValue, { color: category.color }]}>
          {measurement.bmi_value.toFixed(1)}
        </Text>
        <View style={styles.bmiDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Boy</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{measurement.height_cm} cm</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Kilo</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{measurement.weight_kg} kg</Text>
          </View>
        </View>
      </View>

      <View style={[styles.categoryBar, { backgroundColor: theme.colors.surfaceElevated }]}>
        {['#228B22', '#DAA520', '#FF8C00', '#CD3700', '#7B241C'].map((color, i) => (
          <View key={i} style={[styles.categorySegment, { backgroundColor: color }]} />
        ))}
        <View style={[styles.indicator, { left: `${Math.min(Math.max((measurement.bmi_value - 15) / 30 * 100, 2), 98)}%` }]}>
          <View style={[styles.indicatorDot, { backgroundColor: '#FFFFFF' }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bmiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bmiValue: {
    fontSize: 56,
    fontWeight: '800',
    marginRight: 20,
  },
  bmiDetails: {
    flex: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBar: {
    height: 6,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  categorySegment: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    top: -5,
    transform: [{ translateX: -8 }],
  },
  indicatorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#6C63FF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

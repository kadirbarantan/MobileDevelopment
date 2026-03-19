// ==================== Chart Time Filter Chips ====================
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChartFilter } from '../types';

interface FilterChipProps {
  filters: { key: ChartFilter; label: string }[];
  selected: ChartFilter;
  onSelect: (filter: ChartFilter) => void;
}

export default function FilterChip({ filters, selected, onSelect }: FilterChipProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {filters.map((f) => {
        const isActive = selected === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceElevated,
                borderColor: isActive ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => onSelect(f.key)}
            accessibilityLabel={`Filtre: ${f.label}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? '#FFFFFF' : theme.colors.textSecondary },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

// ==================== BMI Gauge Chart ====================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { BMI_CATEGORIES, getBMICategory } from '../utils/calculations';

interface GaugeChartProps {
  bmiValue: number;
  size?: number;
}

export default function GaugeChart({ bmiValue, size = 260 }: GaugeChartProps) {
  const { theme } = useTheme();
  const category = getBMICategory(bmiValue);

  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = size / 2 - 30;
  const strokeWidth = 18;

  // Gauge goes from 180° (left) to 0° (right) = π to 0
  const startAngle = Math.PI;
  const endAngle = 0;

  // Map BMI ranges to arc segments
  const minBMI = 12;
  const maxBMI = 45;

  const bmiToAngle = (bmi: number) => {
    const ratio = Math.min(Math.max((bmi - minBMI) / (maxBMI - minBMI), 0), 1);
    return startAngle - ratio * (startAngle - endAngle);
  };

  // Draw arc segments for each category
  const getArcPath = (startBMI: number, endBMI: number) => {
    const a1 = bmiToAngle(startBMI);
    const a2 = bmiToAngle(endBMI);

    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy - radius * Math.sin(a1);
    const x2 = cx + radius * Math.cos(a2);
    const y2 = cy - radius * Math.sin(a2);

    const largeArc = Math.abs(a1 - a2) > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`;
  };

  // Needle position
  const needleAngle = bmiToAngle(bmiValue);
  const needleLength = radius - 15;
  const needleX = cx + needleLength * Math.cos(needleAngle);
  const needleY = cy - needleLength * Math.sin(needleAngle);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2 + 50} viewBox={`0 0 ${size} ${size / 2 + 50}`}>
        {/* Category arcs */}
        {BMI_CATEGORIES.map((cat, i) => {
          const segStart = Math.max(cat.min, minBMI);
          const segEnd = Math.min(cat.max, maxBMI);
          if (segStart >= maxBMI || segEnd <= minBMI) return null;

          return (
            <Path
              key={i}
              d={getArcPath(segStart, segEnd)}
              stroke={cat.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle */}
        <G>
          <Path
            d={`M ${cx} ${cy} L ${needleX} ${needleY}`}
            stroke={theme.colors.text}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Circle cx={cx} cy={cy} r={8} fill={theme.colors.primary} />
          <Circle cx={cx} cy={cy} r={4} fill={theme.colors.text} />
        </G>

        {/* Labels */}
        <SvgText
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          fill={category.color}
          fontSize={16}
          fontWeight="700"
        >
          {category.labelTR}
        </SvgText>
      </Svg>

      <Text style={[styles.bmiText, { color: category.color }]}>
        {bmiValue.toFixed(1)}
      </Text>
      <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>
        kg/m²
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  bmiText: {
    fontSize: 42,
    fontWeight: '800',
    marginTop: -8,
  },
  unitText: {
    fontSize: 14,
    marginTop: 2,
  },
});

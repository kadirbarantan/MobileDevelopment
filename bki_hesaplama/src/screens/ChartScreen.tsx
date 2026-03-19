// ==================== Chart Panel Screen ====================
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../theme/ThemeContext';
import FilterChip from '../components/FilterChip';
import { getMeasurements, getFirstUser } from '../database/Database';
import { getBMICategory, getFilterDateRange, BMI_CATEGORIES } from '../utils/calculations';
import { Measurement, ChartFilter } from '../types';

const { width: SW } = Dimensions.get('window');
const CW = SW - 70;

const FILTERS: { key: ChartFilter; label: string }[] = [
  { key: '7G', label: '7 Gün' },
  { key: '1A', label: '1 Ay' },
  { key: '3A', label: '3 Ay' },
  { key: 'ALL', label: 'Tümü' },
];

export default function ChartScreen() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<ChartFilter>('1A');
  const [data, setData] = useState<Measurement[]>([]);

  const load = async () => {
    const user = await getFirstUser();
    if (!user?.id) return;
    const all = await getMeasurements(user.id);
    const { start } = getFilterDateRange(filter);
    const f = filter === 'ALL' ? all.reverse() : all.filter(m => new Date(m.measured_at) >= start).reverse();
    setData(f);
  };

  useFocusEffect(useCallback(() => { load(); }, [filter]));

  const cd = data.map(m => ({ value: m.bmi_value, dataPointColor: getBMICategory(m.bmi_value).color, label: m.measured_at.slice(5, 10) }));
  const vals = cd.map(d => d.value);
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';

  return (
    <View style={[s.c, { backgroundColor: theme.colors.background }]}>
      <View style={s.h}>
        <Text style={[s.t, { color: theme.colors.text }]}>📈 BKİ Grafiği</Text>
        <Text style={[s.st, { color: theme.colors.textSecondary }]}>Zaman içindeki değişiminiz</Text>
      </View>
      <FilterChip filters={FILTERS} selected={filter} onSelect={setFilter} />
      <View style={s.sr}>
        {[{ l: 'Ort.', v: avg, c: theme.colors.primary }, { l: 'Min', v: vals.length ? Math.min(...vals).toFixed(1) : '—', c: theme.colors.success }, { l: 'Max', v: vals.length ? Math.max(...vals).toFixed(1) : '—', c: theme.colors.error }, { l: 'Toplam', v: String(data.length), c: theme.colors.text }].map(s2 => (
          <View key={s2.l} style={[s.sc, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[s.sl, { color: theme.colors.textTertiary }]}>{s2.l}</Text>
            <Text style={[s.sv, { color: s2.c }]}>{s2.v}</Text>
          </View>
        ))}
      </View>
      {cd.length > 0 ? (
        <View style={[s.cc, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <LineChart data={cd} width={CW} height={280} spacing={cd.length > 1 ? CW / Math.max(cd.length - 1, 1) : CW / 2} color={theme.colors.primary} thickness={3} startFillColor={theme.colors.primary + '30'} endFillColor={theme.colors.primary + '05'} areaChart curved hideDataPoints={false} dataPointsRadius={5} dataPointsColor={theme.colors.primary} xAxisColor={theme.colors.border} yAxisColor={theme.colors.border} yAxisTextStyle={{ color: theme.colors.textTertiary, fontSize: 10 }} xAxisLabelTextStyle={{ color: theme.colors.textTertiary, fontSize: 8 }} noOfSections={5} rulesColor={theme.colors.border + '40'} rulesType="dashed" showReferenceLine1 referenceLine1Position={25} referenceLine1Config={{ color: '#228B22', dashWidth: 8, dashGap: 4, thickness: 1 }} showReferenceLine2 referenceLine2Position={30} referenceLine2Config={{ color: '#FF8C00', dashWidth: 8, dashGap: 4, thickness: 1 }} animateOnDataChange animationDuration={600} />
          <View style={s.lg}>
            {[{ c: '#228B22', l: 'Normal (25)' }, { c: '#FF8C00', l: 'Obez I (30)' }].map(b => (
              <View key={b.l} style={s.li}><View style={[s.ld, { backgroundColor: b.c }]} /><Text style={[s.lt, { color: theme.colors.textTertiary }]}>{b.l}</Text></View>
            ))}
          </View>
        </View>
      ) : (
        <View style={[s.ec, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={{ fontSize: 48 }}>📊</Text>
          <Text style={[s.et, { color: theme.colors.textSecondary }]}>Bu dönemde ölçüm bulunamadı</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1 }, h: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 4 },
  t: { fontSize: 28, fontWeight: '800' }, st: { fontSize: 14, marginTop: 4 },
  sr: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  sc: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  sl: { fontSize: 10, fontWeight: '500' }, sv: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  cc: { marginHorizontal: 16, padding: 16, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  lg: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2A315530' },
  li: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ld: { width: 8, height: 8, borderRadius: 4 }, lt: { fontSize: 10 },
  ec: { margin: 16, padding: 48, borderRadius: 20, alignItems: 'center', borderWidth: 1 },
  et: { fontSize: 14, textAlign: 'center', marginTop: 12 },
});

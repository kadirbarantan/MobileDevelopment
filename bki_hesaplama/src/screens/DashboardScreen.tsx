// ==================== Dashboard Screen ====================
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../theme/ThemeContext';
import BMICard from '../components/BMICard';
import FAB from '../components/FAB';
import { getLatestMeasurement, getMeasurements, getFirstUser } from '../database/Database';
import { Measurement, User } from '../types';
import { getBMICategory, formatDateTimeTR } from '../utils/calculations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [latestMeasurement, setLatestMeasurement] = useState<Measurement | null>(null);
  const [recentMeasurements, setRecentMeasurements] = useState<Measurement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const currentUser = await getFirstUser();
      setUser(currentUser);
      if (currentUser?.id) {
        const latest = await getLatestMeasurement(currentUser.id);
        setLatestMeasurement(latest);
        const recent = await getMeasurements(currentUser.id, 7);
        setRecentMeasurements(recent.reverse());
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const chartData = recentMeasurements.map((m) => ({
    value: m.bmi_value,
    dataPointColor: getBMICategory(m.bmi_value).color,
    label: m.measured_at.slice(5, 10),
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>Hoş Geldiniz 👋</Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.full_name || 'BKİ Takip'}
            </Text>
          </View>
          <View style={[styles.dateChip, { backgroundColor: theme.colors.surfaceElevated }]}>
            <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
              {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </Text>
          </View>
        </View>

        {/* BMI Card */}
        <BMICard measurement={latestMeasurement} />

        {/* Mini Chart */}
        {chartData.length > 1 && (
          <View style={[styles.chartContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📊 Son 7 Ölçüm Trendi</Text>
            <LineChart
              data={chartData}
              width={SCREEN_WIDTH - 100}
              height={150}
              spacing={(SCREEN_WIDTH - 120) / Math.max(chartData.length - 1, 1)}
              color={theme.colors.primary}
              thickness={3}
              startFillColor={theme.colors.primary + '40'}
              endFillColor={theme.colors.primary + '05'}
              areaChart
              curved
              hideDataPoints={false}
              dataPointsRadius={5}
              dataPointsColor={theme.colors.primary}
              xAxisColor={theme.colors.border}
              yAxisColor={theme.colors.border}
              yAxisTextStyle={{ color: theme.colors.textTertiary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.colors.textTertiary, fontSize: 9 }}
              hideRules
              noOfSections={4}
              animateOnDataChange
              animationDuration={500}
              pointerConfig={{
                pointerStripColor: theme.colors.primary,
                pointerStripWidth: 2,
                pointerColor: theme.colors.primary,
                radius: 6,
                pointerLabelWidth: 100,
                pointerLabelHeight: 30,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View style={[styles.tooltip, { backgroundColor: theme.colors.surfaceElevated }]}>
                      <Text style={[styles.tooltipText, { color: theme.colors.text }]}>
                        {items[0]?.value?.toFixed(1)} BKİ
                      </Text>
                    </View>
                  );
                },
              }}
            />
          </View>
        )}

        {/* Recent Measurements */}
        {recentMeasurements.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, paddingHorizontal: 16 }]}>
              📋 Son Ölçümler
            </Text>
            {recentMeasurements.slice(-3).reverse().map((m, i) => {
              const cat = getBMICategory(m.bmi_value);
              return (
                <View key={m.id || i} style={[styles.measurementRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <View style={styles.measurementInfo}>
                    <Text style={[styles.measurementBMI, { color: theme.colors.text }]}>
                      BKİ: {m.bmi_value.toFixed(1)}
                    </Text>
                    <Text style={[styles.measurementDetail, { color: theme.colors.textSecondary }]}>
                      {m.weight_kg}kg • {m.height_cm}cm
                    </Text>
                  </View>
                  <View style={styles.measurementRight}>
                    <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.labelTR}</Text>
                    <Text style={[styles.measurementDate, { color: theme.colors.textTertiary }]}>
                      {formatDateTimeTR(m.measured_at)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB onPress={() => navigation.navigate('NewMeasurement')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  greeting: { fontSize: 14, fontWeight: '400' },
  userName: { fontSize: 24, fontWeight: '700', marginTop: 2 },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  dateText: { fontSize: 12, fontWeight: '500' },
  chartContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  tooltip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tooltipText: { fontSize: 12, fontWeight: '600' },
  recentSection: {
    marginTop: 16,
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  measurementInfo: { flex: 1 },
  measurementBMI: { fontSize: 15, fontWeight: '700' },
  measurementDetail: { fontSize: 12, marginTop: 2 },
  measurementRight: { alignItems: 'flex-end' },
  categoryLabel: { fontSize: 11, fontWeight: '700' },
  measurementDate: { fontSize: 10, marginTop: 2 },
});

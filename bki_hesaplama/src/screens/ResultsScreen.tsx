// ==================== Results & Recommendations Screen ====================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import GaugeChart from '../components/GaugeChart';
import FoodCard from '../components/FoodCard';
import {
  calculateBMR, calculateTDEE, calculateStepGoal, calculateAge,
  calculateFoodEquivalent, getBMICategory,
} from '../utils/calculations';
import { getFirstUser, getAllFoods } from '../database/Database';
import { User, Food } from '../types';

export default function ResultsScreen() {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { bmi, weight, height } = route.params;
  const category = getBMICategory(bmi);

  const [user, setUser] = useState<User | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [calorieGap, setCalorieGap] = useState(0);
  const [stepGoal, setStepGoal] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const u = await getFirstUser();
      setUser(u);
      const allFoods = await getAllFoods();
      setFoods(allFoods);

      if (u) {
        const age = calculateAge(u.birth_date);
        const bmrVal = calculateBMR(weight, height, age, u.gender);
        const tdeeVal = calculateTDEE(bmrVal, u.activity_level);
        setBmr(bmrVal);
        setTdee(tdeeVal);

        // Calculate calorie deficit/surplus based on target
        const targetBMI = 22; // middle of normal range
        const heightM = height / 100;
        const idealWeight = targetBMI * heightM * heightM;
        const weightDiff = weight - idealWeight;

        // 500 kcal deficit per day = ~0.5kg/week loss
        const dailyCalGap = weightDiff > 0
          ? Math.min(Math.round(weightDiff * 30), 750) // deficit
          : Math.max(Math.round(weightDiff * 30), -750); // surplus

        setCalorieGap(dailyCalGap);

        if (dailyCalGap > 0) {
          setStepGoal(calculateStepGoal(dailyCalGap, weight));
        }
      }
    } catch (error) {
      console.error('Error loading results data:', error);
    }
  };

  const getRecommendation = (): string => {
    if (bmi < 18.5) return '💡 Sağlıklı kilo almak için protein ve karbonhidrat açısından zengin, dengeli beslenmeye özen gösterin. Düzenli egzersiz kas kütlenizi artırmaya yardımcı olacaktır.';
    if (bmi < 25) return '🎉 Tebrikler! Sağlıklı BKİ aralığındasınız. Mevcut yaşam tarzınızı korumaya devam edin. Düzenli egzersiz ve dengeli beslenme ile formunuzu sürdürün.';
    if (bmi < 30) return '⚠️ Fazla kilonuz bulunuyor. Günlük kalori alımınızı azaltarak ve fiziksel aktivitenizi artırarak sağlıklı kilonuza dönebilirsiniz.';
    return '🔴 Obezite kategorisinde yer alıyorsunuz. Bir sağlık uzmanına danışmanız önerilir. Adım adım kalori kontrolü ve düzenli yürüyüşler iyi bir başlangıç olabilir.';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.colors.primary }]}>← Geri</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Sonuçlar</Text>
      </View>

      {/* Gauge Chart */}
      <View style={[styles.gaugeCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <GaugeChart bmiValue={bmi} />
      </View>

      {/* Recommendation */}
      <View style={[styles.recommendCard, { backgroundColor: category.color + '12', borderColor: category.color + '30' }]}>
        <Text style={[styles.recommendText, { color: theme.colors.text }]}>
          {getRecommendation()}
        </Text>
      </View>

      {/* Calorie & BMR Info */}
      <View style={styles.infoGrid}>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={styles.infoIcon}>🔥</Text>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>BMR</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>{bmr}</Text>
          <Text style={[styles.infoUnit, { color: theme.colors.textTertiary }]}>kcal/gün</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={styles.infoIcon}>⚡</Text>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>TDEE</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>{tdee}</Text>
          <Text style={[styles.infoUnit, { color: theme.colors.textTertiary }]}>kcal/gün</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={styles.infoIcon}>{calorieGap > 0 ? '📉' : '📈'}</Text>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
            {calorieGap > 0 ? 'Kalori Açığı' : 'Kalori Fazlası'}
          </Text>
          <Text style={[styles.infoValue, { color: calorieGap > 0 ? theme.colors.warning : theme.colors.success }]}>
            {Math.abs(calorieGap)}
          </Text>
          <Text style={[styles.infoUnit, { color: theme.colors.textTertiary }]}>kcal/gün</Text>
        </View>

        {stepGoal > 0 && (
          <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={styles.infoIcon}>🚶</Text>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Adım Hedefi</Text>
            <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
              {stepGoal.toLocaleString('tr-TR')}
            </Text>
            <Text style={[styles.infoUnit, { color: theme.colors.textTertiary }]}>adım/gün</Text>
          </View>
        )}
      </View>

      {/* Food Equivalents */}
      {calorieGap !== 0 && foods.length > 0 && (
        <View style={styles.foodSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🍽️ {calorieGap > 0 ? 'Azaltmanız Gereken Besin Karşılıkları' : 'Eklemeniz Gereken Besin Karşılıkları'}
          </Text>
          <Text style={[styles.foodSubtitle, { color: theme.colors.textSecondary }]}>
            {Math.abs(calorieGap)} kcal = aşağıdaki besinlerin eşdeğeri
          </Text>
          <FlatList
            data={foods.slice(0, 10)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodList}
            keyExtractor={(item) => item.id?.toString() || item.name}
            renderItem={({ item }) => (
              <FoodCard
                food={item}
                equivalentPortions={calculateFoodEquivalent(Math.abs(calorieGap), item.calories_per_portion)}
              />
            )}
          />
        </View>
      )}

      {/* Back to Dashboard */}
      <TouchableOpacity
        style={[styles.doneBtn, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('DashboardTab')}
        accessibilityLabel="Ana sayfaya dön"
        accessibilityRole="button"
      >
        <Text style={styles.doneBtnText}>🏠 Ana Sayfaya Dön</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 15, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800' },
  gaugeCard: {
    margin: 16,
    paddingTop: 24,
    paddingBottom: 8,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  recommendCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  recommendText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 16,
    gap: 8,
  },
  infoCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: '1.5%',
  },
  infoIcon: { fontSize: 24, marginBottom: 6 },
  infoLabel: { fontSize: 11, fontWeight: '500', marginBottom: 4 },
  infoValue: { fontSize: 28, fontWeight: '800' },
  infoUnit: { fontSize: 11, marginTop: 2 },
  foodSection: {
    marginTop: 20,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  foodSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  foodList: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  doneBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

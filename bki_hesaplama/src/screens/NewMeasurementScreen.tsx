// ==================== New Measurement Screen ====================
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { calculateBMI, getBMICategory, validateHeight, validateWeight } from '../utils/calculations';
import { addMeasurement, getFirstUser, getTodayMeasurementCount } from '../database/Database';
import { User } from '../types';

export default function NewMeasurementScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const [user, setUser] = useState<User | null>(null);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const bmi = calculateBMI(weight, height);
  const category = getBMICategory(bmi);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const u = await getFirstUser();
    if (u) {
      setUser(u);
      setHeight(u.height_cm);
      setWeight(u.initial_weight_kg);
    }
  };

  const handleSave = async () => {
    if (!validateHeight(height)) {
      Alert.alert('Hata', 'Boy 50-250 cm arasında olmalıdır.');
      return;
    }
    if (!validateWeight(weight)) {
      Alert.alert('Hata', 'Kilo 10-300 kg arasında olmalıdır.');
      return;
    }
    if (!user?.id) {
      Alert.alert('Hata', 'Kullanıcı bulunamadı. Lütfen ayarlardan profil oluşturun.');
      return;
    }

    // Check daily limit
    const todayCount = await getTodayMeasurementCount(user.id);
    if (todayCount >= 5) {
      Alert.alert('Günlük Limit', 'Bir günde en fazla 5 ölçüm kaydedebilirsiniz.');
      return;
    }

    setSaving(true);
    try {
      const bmiValue = calculateBMI(weight, height);
      const bmiCat = getBMICategory(bmiValue);

      await addMeasurement({
        user_id: user.id,
        measured_at: new Date().toISOString(),
        height_cm: height,
        weight_kg: weight,
        bmi_value: bmiValue,
        bmi_category: bmiCat.label,
        note: note || undefined,
      });

      navigation.navigate('Results', {
        bmi: bmiValue,
        category: bmiCat.labelTR,
        weight,
        height,
      });
    } catch (error) {
      Alert.alert('Hata', 'Ölçüm kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const SliderControl = ({
    label, value, min, max, unit, step, onDecrease, onIncrease, onValueChange,
  }: {
    label: string; value: number; min: number; max: number;
    unit: string; step: number;
    onDecrease: () => void; onIncrease: () => void;
    onValueChange: (v: number) => void;
  }) => {
    const progress = ((value - min) / (max - min)) * 100;

    return (
      <View style={[styles.sliderCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
          <View style={styles.valueRow}>
            <Text style={[styles.sliderValue, { color: theme.colors.text }]}>{value.toFixed(1)}</Text>
            <Text style={[styles.sliderUnit, { color: theme.colors.textTertiary }]}> {unit}</Text>
          </View>
        </View>

        <View style={styles.sliderControls}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.colors.surfaceElevated }]}
            onPress={onDecrease}
            accessibilityLabel={`${label} azalt`}
          >
            <Text style={[styles.controlBtnText, { color: theme.colors.text }]}>−</Text>
          </TouchableOpacity>

          <View style={styles.sliderTrack}>
            <View style={[styles.sliderTrackBg, { backgroundColor: theme.colors.surfaceElevated }]}>
              <View
                style={[
                  styles.sliderFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.colors.surfaceElevated }]}
            onPress={onIncrease}
            accessibilityLabel={`${label} artır`}
          >
            <Text style={[styles.controlBtnText, { color: theme.colors.text }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.colors.primary }]}>← Geri</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Yeni Ölçüm</Text>
        </View>

        {/* Real-time BMI Preview */}
        <View style={[styles.previewCard, { backgroundColor: category.color + '15', borderColor: category.color + '40' }]}>
          <Text style={[styles.previewLabel, { color: theme.colors.textSecondary }]}>Anlık BKİ</Text>
          <Text style={[styles.previewBMI, { color: category.color }]}>{bmi.toFixed(1)}</Text>
          <View style={[styles.previewBadge, { backgroundColor: category.color + '25' }]}>
            <Text style={[styles.previewCategory, { color: category.color }]}>{category.labelTR}</Text>
          </View>
        </View>

        {/* Height Slider */}
        <SliderControl
          label="📏 Boy"
          value={height}
          min={50}
          max={250}
          unit="cm"
          step={0.5}
          onDecrease={() => setHeight(Math.max(50, height - 0.5))}
          onIncrease={() => setHeight(Math.min(250, height + 0.5))}
          onValueChange={setHeight}
        />

        {/* Weight Slider */}
        <SliderControl
          label="⚖️ Kilo"
          value={weight}
          min={10}
          max={300}
          unit="kg"
          step={0.1}
          onDecrease={() => setWeight(Math.max(10, +(weight - 0.1).toFixed(1)))}
          onIncrease={() => setWeight(Math.min(300, +(weight + 0.1).toFixed(1)))}
          onValueChange={setWeight}
        />

        {/* Note Input */}
        <View style={[styles.noteCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>📝 Not (Opsiyonel)</Text>
          <TextInput
            style={[styles.noteInput, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text, borderColor: theme.colors.border }]}
            value={note}
            onChangeText={setNote}
            placeholder="Ölçümle ilgili not ekleyin..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            maxLength={200}
            accessibilityLabel="Ölçüm notu"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.colors.primary, opacity: saving ? 0.6 : 1 }]}
          onPress={handleSave}
          disabled={saving}
          accessibilityLabel="Ölçümü kaydet"
          accessibilityRole="button"
        >
          <Text style={styles.saveBtnText}>{saving ? 'Kaydediliyor...' : '💾 Ölçümü Kaydet'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  previewCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  previewLabel: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  previewBMI: { fontSize: 52, fontWeight: '800' },
  previewBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 8,
  },
  previewCategory: { fontSize: 14, fontWeight: '700' },
  sliderCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderLabel: { fontSize: 14, fontWeight: '600' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  sliderValue: { fontSize: 28, fontWeight: '800' },
  sliderUnit: { fontSize: 14, fontWeight: '500' },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnText: { fontSize: 22, fontWeight: '500' },
  sliderTrack: { flex: 1 },
  sliderTrackBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  noteCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  noteInput: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

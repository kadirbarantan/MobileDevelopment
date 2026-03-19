// ==================== Settings Screen ====================
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity,
  TextInput, Alert, Platform
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getSettings, updateSettings, getFirstUser, createUser, updateUser } from '../database/Database';
import { checkBiometricAvailability } from '../utils/security';
import { scheduleDailyReminder, cancelAllReminders } from '../utils/notifications';
import { User } from '../types';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [biometricLock, setBiometricLock] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Profile form
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [targetWt, setTargetWt] = useState('65');
  const [activity, setActivity] = useState('moderate');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    if (settings) {
      setBiometricLock(!!settings.biometric_lock);
    }
    const bioAvail = await checkBiometricAvailability();
    setBiometricAvailable(bioAvail);
    const u = await getFirstUser();
    setUser(u);
    if (u) {
      setName(u.full_name);
      setBirthDate(u.birth_date);
      setGender(u.gender);
      setHeightCm(String(u.height_cm));
      setWeightKg(String(u.initial_weight_kg));
      setTargetWt(String(u.target_weight_kg));
      setActivity(u.activity_level);
    } else {
      setShowProfile(true);
    }
  };

  const handleBiometricToggle = async (val: boolean) => {
    setBiometricLock(val);
    await updateSettings({ biometric_lock: val });
  };

  const handleReminderToggle = async (val: boolean) => {
    setReminders(val);
    if (val) {
      await scheduleDailyReminder(9, 0);
      Alert.alert('Hatırlatıcı', 'Her gün saat 09:00\'da hatırlatma alacaksınız.');
    } else {
      await cancelAllReminders();
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) { Alert.alert('Hata', 'İsim giriniz.'); return; }
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    const tw = parseFloat(targetWt);
    if (isNaN(h) || h < 50 || h > 250) { Alert.alert('Hata', 'Boy 50-250 cm arası olmalı.'); return; }
    if (isNaN(w) || w < 10 || w > 300) { Alert.alert('Hata', 'Kilo 10-300 kg arası olmalı.'); return; }

    const userData = {
      full_name: name.trim(), birth_date: birthDate, gender,
      height_cm: h, initial_weight_kg: w, target_weight_kg: tw || w,
      activity_level: activity as any,
    };

    if (user?.id) {
      await updateUser(user.id, userData);
    } else {
      await createUser(userData);
    }
    const updated = await getFirstUser();
    setUser(updated);
    setShowProfile(false);
    Alert.alert('Başarılı', 'Profil kaydedildi.');
  };

  const activities = [
    { key: 'sedentary', label: 'Hareketsiz' },
    { key: 'light', label: 'Hafif Aktif' },
    { key: 'moderate', label: 'Orta Aktif' },
    { key: 'active', label: 'Aktif' },
    { key: 'very_active', label: 'Çok Aktif' },
  ];

  const Row = ({ icon, label, right }: { icon: string; label: string; right: React.ReactNode }) => (
    <View style={[st.row, { borderBottomColor: theme.colors.border }]}>
      <Text style={st.rowIcon}>{icon}</Text>
      <Text style={[st.rowLabel, { color: theme.colors.text }]}>{label}</Text>
      {right}
    </View>
  );

  return (
    <ScrollView style={[st.c, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={st.h}>
        <Text style={[st.t, { color: theme.colors.text }]}>⚙️ Ayarlar</Text>
      </View>

      {/* Profile Card */}
      <TouchableOpacity style={[st.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => setShowProfile(!showProfile)}>
        <Text style={st.cardIcon}>👤</Text>
        <View style={{ flex: 1 }}>
          <Text style={[st.cardTitle, { color: theme.colors.text }]}>{user?.full_name || 'Profil Oluştur'}</Text>
          <Text style={[st.cardSub, { color: theme.colors.textSecondary }]}>{user ? 'Düzenlemek için dokunun' : 'Başlamak için profil oluşturun'}</Text>
        </View>
        <Text style={{ color: theme.colors.textTertiary }}>{showProfile ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Profile Form */}
      {showProfile && (
        <View style={[st.form, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <TextInput style={[st.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text, borderColor: theme.colors.border }]} value={name} onChangeText={setName} placeholder="Ad Soyad" placeholderTextColor={theme.colors.textTertiary} />
          <TextInput style={[st.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text, borderColor: theme.colors.border }]} value={birthDate} onChangeText={setBirthDate} placeholder="Doğum Tarihi (YYYY-MM-DD)" placeholderTextColor={theme.colors.textTertiary} />
          <View style={st.genderRow}>
            {['male', 'female'].map(g => (
              <TouchableOpacity key={g} style={[st.genderBtn, { backgroundColor: gender === g ? theme.colors.primary : theme.colors.surfaceElevated }]} onPress={() => setGender(g as any)}>
                <Text style={[st.genderText, { color: gender === g ? '#FFF' : theme.colors.text }]}>{g === 'male' ? '♂ Erkek' : '♀ Kadın'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={st.inputRow}>
            <TextInput style={[st.input, { flex: 1, backgroundColor: theme.colors.inputBackground, color: theme.colors.text, borderColor: theme.colors.border }]} value={heightCm} onChangeText={setHeightCm} placeholder="Boy (cm)" keyboardType="numeric" placeholderTextColor={theme.colors.textTertiary} />
            <TextInput style={[st.input, { flex: 1, backgroundColor: theme.colors.inputBackground, color: theme.colors.text, borderColor: theme.colors.border }]} value={weightKg} onChangeText={setWeightKg} placeholder="Kilo (kg)" keyboardType="numeric" placeholderTextColor={theme.colors.textTertiary} />
          </View>
          <TextInput style={[st.input, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text, borderColor: theme.colors.border }]} value={targetWt} onChangeText={setTargetWt} placeholder="Hedef Kilo (kg)" keyboardType="numeric" placeholderTextColor={theme.colors.textTertiary} />
          <Text style={[st.actLabel, { color: theme.colors.textSecondary }]}>Aktivite Seviyesi</Text>
          <View style={st.actRow}>
            {activities.map(a => (
              <TouchableOpacity key={a.key} style={[st.actBtn, { backgroundColor: activity === a.key ? theme.colors.primary : theme.colors.surfaceElevated }]} onPress={() => setActivity(a.key)}>
                <Text style={[st.actText, { color: activity === a.key ? '#FFF' : theme.colors.textSecondary }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[st.saveBtn, { backgroundColor: theme.colors.primary }]} onPress={saveProfile}>
            <Text style={st.saveBtnText}>💾 Kaydet</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Settings Rows */}
      <View style={[st.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Row icon="🌙" label="Karanlık Mod" right={<Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: theme.colors.primary, false: theme.colors.disabled }} />} />
        <Row icon="🔐" label="Biyometrik Kilit" right={<Switch value={biometricLock} onValueChange={handleBiometricToggle} disabled={!biometricAvailable} trackColor={{ true: theme.colors.primary, false: theme.colors.disabled }} />} />
        <Row icon="🔔" label="Günlük Hatırlatıcı" right={<Switch value={reminders} onValueChange={handleReminderToggle} trackColor={{ true: theme.colors.primary, false: theme.colors.disabled }} />} />
      </View>

      <View style={[st.about, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[st.aboutTitle, { color: theme.colors.text }]}>BKİ Takip v1.0</Text>
        <Text style={[st.aboutSub, { color: theme.colors.textTertiary }]}>Sağlıklı yaşam için yanınızda</Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  c: { flex: 1 }, h: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 },
  t: { fontSize: 28, fontWeight: '800' },
  card: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  cardIcon: { fontSize: 32 }, cardTitle: { fontSize: 16, fontWeight: '700' }, cardSub: { fontSize: 12, marginTop: 2 },
  form: { marginHorizontal: 16, marginTop: 8, padding: 16, borderRadius: 16, borderWidth: 1, gap: 10 },
  input: { padding: 12, borderRadius: 12, borderWidth: 1, fontSize: 14 },
  inputRow: { flexDirection: 'row', gap: 10 },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  genderText: { fontWeight: '600', fontSize: 14 },
  actLabel: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  actRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  actText: { fontSize: 12, fontWeight: '600' },
  saveBtn: { padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  section: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  rowIcon: { fontSize: 20, marginRight: 12 }, rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  about: { marginHorizontal: 16, marginTop: 16, padding: 20, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  aboutTitle: { fontSize: 16, fontWeight: '700' }, aboutSub: { fontSize: 12, marginTop: 4 },
});

import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function GradeCalculatorScreen() {
  const [vize1, setVize1] = useState('');
  const [vize2, setVize2] = useState('');
  const [final_, setFinal] = useState('');
  const [result, setResult] = useState<{
    average: number;
    passed: boolean;
    failReason?: string;
  } | null>(null);
  const [error, setError] = useState('');

  const calculateGrade = () => {
    Keyboard.dismiss();
    setError('');
    setResult(null);

    const v1 = parseFloat(vize1);
    const v2 = parseFloat(vize2);
    const f = parseFloat(final_);

    if (isNaN(v1) || isNaN(v2) || isNaN(f)) {
      setError('Lütfen tüm notları doğru giriniz.');
      return;
    }

    if (v1 < 0 || v1 > 100 || v2 < 0 || v2 > 100 || f < 0 || f > 100) {
      setError('Notlar 0 ile 100 arasında olmalıdır.');
      return;
    }

    const average = v1 * 0.2 + v2 * 0.2 + f * 0.6;
    const passed = average >= 50 && f >= 50;
    setResult({
      average: Math.round(average * 100) / 100,
      passed,
      failReason: f < 50 && average >= 50 ? 'Final notu 50\'nin altında olduğu için kaldınız.' : undefined,
    });
  };

  const resetForm = () => {
    setVize1('');
    setVize2('');
    setFinal('');
    setResult(null);
    setError('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerIcon}>📊</Text>
              <Text style={styles.headerTitle}>Not Hesapla</Text>
              <Text style={styles.headerSubtitle}>
                Vize ve final notlarınızı girerek ortalamanızı öğrenin
              </Text>
            </View>

            {/* Weight Info */}
            <View style={styles.weightCard}>
              <View style={styles.weightRow}>
                <View style={styles.weightItem}>
                  <Text style={styles.weightLabel}>1. Vize</Text>
                  <Text style={styles.weightValue}>%20</Text>
                </View>
                <View style={styles.weightDivider} />
                <View style={styles.weightItem}>
                  <Text style={styles.weightLabel}>2. Vize</Text>
                  <Text style={styles.weightValue}>%20</Text>
                </View>
                <View style={styles.weightDivider} />
                <View style={styles.weightItem}>
                  <Text style={styles.weightLabel}>Final</Text>
                  <Text style={styles.weightValue}>%60</Text>
                </View>
              </View>
            </View>

            {/* Inputs */}
            <View style={styles.inputSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>1. Vize Notu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0 - 100"
                  placeholderTextColor="#b0b0b0"
                  keyboardType="numeric"
                  value={vize1}
                  onChangeText={setVize1}
                  maxLength={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>2. Vize Notu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0 - 100"
                  placeholderTextColor="#b0b0b0"
                  keyboardType="numeric"
                  value={vize2}
                  onChangeText={setVize2}
                  maxLength={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Final Notu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0 - 100"
                  placeholderTextColor="#b0b0b0"
                  keyboardType="numeric"
                  value={final_}
                  onChangeText={setFinal}
                  maxLength={3}
                />
              </View>
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={calculateGrade}
                activeOpacity={0.8}
              >
                <Text style={styles.calculateButtonText}>Hesapla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetForm}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>Temizle</Text>
              </TouchableOpacity>
            </View>

            {/* Result */}
            {result && (
              <View
                style={[
                  styles.resultCard,
                  result.passed ? styles.resultCardPass : styles.resultCardFail,
                ]}
              >
                <Text
                  style={[
                    styles.resultStatus,
                    result.passed
                      ? styles.resultStatusPass
                      : styles.resultStatusFail,
                  ]}
                >
                  {result.passed ? 'GEÇTİ' : 'KALDI'}
                </Text>
                <Text style={styles.resultAverage}>
                  Ortalama: {result.average}
                </Text>
                <Text style={styles.resultNote}>
                  {result.failReason
                    ? result.failReason
                    : result.passed
                      ? 'Tebrikler! Dersi başarıyla geçtiniz.'
                      : 'Maalesef dersi geçemediniz.'}
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 6,
    textAlign: 'center',
  },

  // Weight card
  weightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  weightItem: {
    alignItems: 'center',
    flex: 1,
  },
  weightLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  weightDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e9ecef',
  },

  // Input section
  inputSection: {
    gap: 14,
    marginBottom: 20,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a2e',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
  },

  // Error
  errorContainer: {
    backgroundColor: '#fff3f3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
    textAlign: 'center',
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  calculateButton: {
    flex: 2,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#dee2e6',
  },
  resetButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },

  // Result
  resultCard: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  resultCardPass: {
    backgroundColor: '#f0faf0',
    borderColor: '#c8e6c9',
  },
  resultCardFail: {
    backgroundColor: '#fef5f5',
    borderColor: '#ffcdd2',
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  resultStatus: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  resultStatusPass: {
    color: '#2e7d32',
  },
  resultStatusFail: {
    color: '#c62828',
  },
  resultAverage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginTop: 8,
  },
  resultNote: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
});

// ==================== Security Utilities ====================
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// ─── Biometric Authentication ───────────────────────────
export async function checkBiometricAvailability(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'BKİ Takip uygulamasına erişmek için kimliğinizi doğrulayın',
      cancelLabel: 'İptal',
      disableDeviceFallback: false,
      fallbackLabel: 'Şifre Kullan',
    });
    return result.success;
  } catch {
    return false;
  }
}

// ─── Secure Storage (AES-256 via expo-secure-store) ─────
export async function secureStore(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function secureRetrieve(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

export async function secureDelete(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

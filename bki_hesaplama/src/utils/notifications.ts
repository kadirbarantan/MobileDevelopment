// ==================== Notification Utilities ====================
import * as Notifications from 'expo-notifications';

// ─── Configure Notification Handler ─────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
    shouldShowBanner: true,
  }),
});

// ─── Request Permission ─────────────────────────────────
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// ─── Schedule Daily Reminder ────────────────────────────
export async function scheduleDailyReminder(hour: number = 9, minute: number = 0): Promise<string | null> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  await cancelAllReminders();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏋️ BKİ Takip Hatırlatması',
      body: 'Bugünkü ölçümünüzü yapmayı unutmayın! Sağlıklı bir yaşam düzenli takipten geçer.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  return id;
}

// ─── Cancel All Reminders ───────────────────────────────
export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

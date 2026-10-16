import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { addPushToken, removePushToken } from '@/services/api/authApi';

const PUSH_TOKEN_KEY = 'disaster-warning-push-token';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getProjectId(): string | undefined {
  return Constants.expoConfig?.extra?.eas?.projectId
    ?? Constants.easConfig?.projectId
    ?? process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
}

export async function syncPushToken(authToken: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const projectId = getProjectId();
  // Avoid prompting for notification permission until an EAS project is configured.
  if (!projectId) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Disaster alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1877B9',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  const permission = current.status === 'granted' ? current : await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') return;

  const pushToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await addPushToken(authToken, pushToken);
  await SecureStore.setItemAsync(PUSH_TOKEN_KEY, pushToken);
}

export async function unregisterPushToken(authToken: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const pushToken = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
  if (!pushToken) return;
  try {
    await removePushToken(authToken, pushToken);
  } finally {
    await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
  }
}

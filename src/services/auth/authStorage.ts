import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthResponse } from '@/types/user';

const AUTH_KEY = 'disaster-warning-auth';

export async function getStoredAuth(): Promise<AuthResponse | null> {
  const value = Platform.OS === 'web'
    ? globalThis.localStorage.getItem(AUTH_KEY)
    : await SecureStore.getItemAsync(AUTH_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as AuthResponse;
  } catch {
    return null;
  }
}

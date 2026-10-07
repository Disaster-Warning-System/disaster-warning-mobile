import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { login as loginRequest, register as registerRequest } from '@/services/api/authApi';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/user';

const AUTH_KEY = 'disaster-warning-auth';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function getStoredValue(): Promise<string | null> {
  if (Platform.OS === 'web') return globalThis.localStorage.getItem(AUTH_KEY);
  return SecureStore.getItemAsync(AUTH_KEY);
}

async function setStoredValue(value: string) {
  if (Platform.OS === 'web') {
    globalThis.localStorage.setItem(AUTH_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(AUTH_KEY, value);
}

async function clearStoredValue() {
  if (Platform.OS === 'web') {
    globalThis.localStorage.removeItem(AUTH_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(AUTH_KEY);
}

async function readStoredAuth(): Promise<AuthResponse | null> {
  const value = await getStoredValue();
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthResponse;
  } catch {
    await clearStoredValue();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readStoredAuth()
      .then(setAuth)
      .finally(() => setIsLoading(false));
  }, []);

  const saveAuth = async (nextAuth: AuthResponse) => {
    await setStoredValue(JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      isLoading,
      login: async (input) => saveAuth(await loginRequest(input)),
      register: async (input) => saveAuth(await registerRequest(input)),
      logout: async () => {
        await clearStoredValue();
        setAuth(null);
      },
    }),
    [auth, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

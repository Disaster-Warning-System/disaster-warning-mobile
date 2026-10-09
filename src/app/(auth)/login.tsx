import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import { AppColors, Radius, Shadows, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/services/api/apiClient';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)/home');
    } catch (requestError) {
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>!</Text></View>
          <Text style={styles.eyebrow}>SMART DISASTER</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to stay informed and help keep your community safe.</Text>

          <View style={styles.card}>
            {error ? <ErrorMessage message={error} /> : null}
            <Text style={styles.label}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={AppColors.muted}
              style={styles.input}
              value={email}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={AppColors.muted}
              secureTextEntry
              style={styles.input}
              value={password}
            />
            <Button loading={loading} onPress={submit} title="Sign in" style={styles.button} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable><Text style={styles.link}>Create one</Text></Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  brandMark: { alignItems: 'center', backgroundColor: AppColors.primary, borderRadius: 18, height: 52, justifyContent: 'center', marginBottom: 14, width: 52 },
  brandMarkText: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  eyebrow: { ...Typography.label, color: AppColors.muted, letterSpacing: 1 },
  title: { ...Typography.title, color: AppColors.text, marginTop: 7 },
  subtitle: { ...Typography.body, color: AppColors.muted, marginTop: 8 },
  card: { backgroundColor: AppColors.surface, borderColor: AppColors.border, borderRadius: Radius.medium, borderWidth: 1, marginTop: 28, padding: 20, ...Shadows.card },
  label: { ...Typography.label, color: AppColors.text, marginBottom: 7, marginTop: 16 },
  input: { ...Typography.body, borderColor: AppColors.border, borderRadius: Radius.small, borderWidth: 1, color: AppColors.text, minHeight: 50, paddingHorizontal: 14 },
  button: { marginTop: 24 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { ...Typography.secondary, color: AppColors.muted },
  link: { ...Typography.secondary, color: AppColors.primary, fontWeight: '700' },
});
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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, district: district.trim() });
      router.replace('/(tabs)/home');
    } catch (requestError) {
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>SMART DISASTER</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join your community safety network.</Text>
          <View style={styles.card}>
            {error ? <ErrorMessage message={error} /> : null}
            <Text style={styles.label}>Full name</Text>
            <TextInput autoComplete="name" onChangeText={setName} placeholder="Your name" placeholderTextColor={AppColors.muted} style={styles.input} value={name} />
            <Text style={styles.label}>Email address</Text>
            <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={AppColors.muted} style={styles.input} value={email} />
            <Text style={styles.label}>District <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput onChangeText={setDistrict} placeholder="Your district" placeholderTextColor={AppColors.muted} style={styles.input} value={district} />
            <Text style={styles.label}>Password</Text>
            <TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={setPassword} placeholder="At least 6 characters" placeholderTextColor={AppColors.muted} secureTextEntry style={styles.input} value={password} />
            <Text style={styles.label}>Confirm password</Text>
            <TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={setConfirmPassword} placeholder="Enter password again" placeholderTextColor={AppColors.muted} secureTextEntry style={styles.input} value={confirmPassword} />
            <Button loading={loading} onPress={submit} title="Create account" style={styles.button} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild><Pressable><Text style={styles.link}>Sign in</Text></Pressable></Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  flex: { flex: 1 },
  content: { padding: 24 },
  eyebrow: { ...Typography.label, color: AppColors.muted, letterSpacing: 1, marginTop: 18 },
  title: { ...Typography.title, color: AppColors.text, marginTop: 7 },
  subtitle: { ...Typography.body, color: AppColors.muted, marginTop: 8 },
  card: { backgroundColor: AppColors.surface, borderColor: AppColors.border, borderRadius: Radius.medium, borderWidth: 1, marginTop: 24, padding: 20, ...Shadows.card },
  label: { ...Typography.label, color: AppColors.text, marginBottom: 7, marginTop: 14 },
  optional: { color: AppColors.muted, fontFamily: Typography.secondary.fontFamily, fontSize: 12, fontWeight: '400' },
  input: { ...Typography.body, borderColor: AppColors.border, borderRadius: Radius.small, borderWidth: 1, color: AppColors.text, minHeight: 50, paddingHorizontal: 14 },
  button: { marginTop: 24 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 24, paddingBottom: 18 },
  footerText: { ...Typography.secondary, color: AppColors.muted },
  link: { ...Typography.secondary, color: AppColors.primary, fontWeight: '700' },
});
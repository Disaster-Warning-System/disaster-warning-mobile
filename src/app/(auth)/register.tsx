import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
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
import { DISTRICTS, RIVER_BASINS } from '@/constants/areas';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/services/api/apiClient';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [riverBasins, setRiverBasins] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [districtPickerOpen, setDistrictPickerOpen] = useState(false);
  const [role, setRole] = useState<'Citizen' | 'Volunteer'>('Citizen');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !district || !password) {
      setError('Name, email, district, and password are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (phoneNumber.trim() && !/^\+[1-9]\d{7,14}$/.test(phoneNumber.trim())) {
      setError('Use an international phone format, for example +94771234567.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim().toLowerCase(), password, district, riverBasins, phoneNumber: phoneNumber.trim(), role });
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
            <Text style={styles.label}>District</Text>
            <Pressable accessibilityRole="button" onPress={() => setDistrictPickerOpen(true)} style={[styles.input, styles.selectInput]}>
              <Text style={[Typography.body, { color: district ? AppColors.text : AppColors.muted }]}>{district || 'Choose your district'}</Text>
              <Text style={styles.selectChevron}>⌄</Text>
            </Pressable>
            <Text style={styles.label}>River basin <Text style={styles.optional}>(optional)</Text></Text>
            <View style={styles.roleOptions}>
              {RIVER_BASINS.map((basin) => {
                const selected = riverBasins.includes(basin);
                return <Pressable key={basin} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => setRiverBasins(selected ? riverBasins.filter((item) => item !== basin) : [...riverBasins, basin])} style={[styles.roleOption, selected && styles.roleOptionSelected]}><Text style={[styles.roleOptionText, selected && styles.roleOptionTextSelected]}>{basin}</Text></Pressable>;
              })}
            </View>
            <Text style={styles.label}>Phone number <Text style={styles.optional}>(optional for SMS alerts)</Text></Text>
            <TextInput autoCapitalize="none" keyboardType="phone-pad" onChangeText={setPhoneNumber} placeholder="+94771234567" placeholderTextColor={AppColors.muted} style={styles.input} value={phoneNumber} />
            <Text style={styles.label}>Account type</Text>
            <View style={styles.roleOptions}>
              {(['Citizen', 'Volunteer'] as const).map((option) => (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: role === option }}
                  key={option}
                  onPress={() => setRole(option)}
                  style={[styles.roleOption, role === option && styles.roleOptionSelected]}
                >
                  <Text style={[styles.roleOptionText, role === option && styles.roleOptionTextSelected]}>{option}</Text>
                </Pressable>
              ))}
            </View>
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
        <Modal visible={districtPickerOpen} animationType="slide" onRequestClose={() => setDistrictPickerOpen(false)}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose your district</Text>
              <Pressable accessibilityRole="button" onPress={() => setDistrictPickerOpen(false)}><Text style={styles.link}>Close</Text></Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.districtList}>
              {DISTRICTS.map((item) => <Pressable key={item} accessibilityRole="button" onPress={() => { setDistrict(item); setDistrictPickerOpen(false); }} style={styles.districtItem}><Text style={styles.districtItemText}>{item}</Text></Pressable>)}
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  roleOptions: { flexDirection: 'row', gap: 10 },
  selectInput: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  selectChevron: { color: AppColors.muted, fontSize: 20 },
  modalSafeArea: { backgroundColor: AppColors.background, flex: 1 },
  modalHeader: { alignItems: 'center', borderBottomColor: AppColors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  modalTitle: { ...Typography.sectionTitle, color: AppColors.text },
  districtList: { padding: 16 },
  districtItem: { borderBottomColor: AppColors.border, borderBottomWidth: 1, paddingHorizontal: 8, paddingVertical: 15 },
  districtItemText: { ...Typography.body, color: AppColors.text },
  roleOption: { alignItems: 'center', borderColor: AppColors.border, borderRadius: Radius.small, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 46 },
  roleOptionSelected: { backgroundColor: '#E8F2FC', borderColor: AppColors.primary },
  roleOptionText: { ...Typography.secondary, color: AppColors.muted },
  roleOptionTextSelected: { color: AppColors.primary, fontWeight: '700' },
  input: { ...Typography.body, borderColor: AppColors.border, borderRadius: Radius.small, borderWidth: 1, color: AppColors.text, minHeight: 50, paddingHorizontal: 14 },
  button: { marginTop: 24 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 24, paddingBottom: 18 },
  footerText: { ...Typography.secondary, color: AppColors.muted },
  link: { ...Typography.secondary, color: AppColors.primary, fontWeight: '700' },
});

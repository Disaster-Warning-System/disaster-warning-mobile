import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import Card from '@/components/common/Card';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppColors, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import { useRouter } from 'expo-router';
import { DISTRICTS, RIVER_BASINS } from '@/constants/areas';
import { useState } from 'react';
import { ApiRequestError } from '@/services/api/apiClient';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [district, setDistrict] = useState(user?.district ?? '');
  const [riverBasins, setRiverBasins] = useState(user?.riverBasins ?? []);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');
  const [districtPickerOpen, setDistrictPickerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const saveProfile = async () => {
    if (!district || (phoneNumber.trim() && !/^\+[1-9]\d{7,14}$/.test(phoneNumber.trim()))) {
      setMessage('Choose your district and use an international phone format, for example +94771234567.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ district, riverBasins, phoneNumber: phoneNumber.trim() });
      setMessage('Alert area and contact settings saved.');
    } catch (error) {
      setMessage(error instanceof ApiRequestError ? error.message : 'Unable to save your settings.');
    } finally { setSaving(false); }
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <ScreenHeader title="Profile" subtitle="Your community safety space." />
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={25} color={AppColors.primary} />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>{user?.name ?? 'User Profile'}</Text>
            <Text style={styles.profileDescription}>{user?.email ?? 'Profile details will appear here.'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={AppColors.muted} />
        </Card>
        <Card style={styles.preferenceCard}>
          <Text style={styles.profileTitle}>Alert delivery settings</Text>
          <Text style={styles.profileDescription}>Set your area and phone so matching alerts can reach you.</Text>
          <Pressable accessibilityRole="button" onPress={() => setDistrictPickerOpen(true)} style={[styles.input, styles.selectInput]}><Text style={{ color: district ? AppColors.text : AppColors.muted }}>{district || 'Choose your district'}</Text><Ionicons name="chevron-down" size={18} color={AppColors.muted} /></Pressable>
          <Text style={styles.label}>River basin subscriptions</Text>
          <View style={styles.basinList}>{RIVER_BASINS.map((basin) => { const selected = riverBasins.includes(basin); return <Pressable key={basin} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => setRiverBasins(selected ? riverBasins.filter((item) => item !== basin) : [...riverBasins, basin])} style={[styles.basinOption, selected && styles.basinSelected]}><Text style={{ color: selected ? AppColors.primary : AppColors.text }}>{selected ? '✓ ' : ''}{basin}</Text></Pressable>; })}</View>
          <Text style={styles.label}>SMS phone number (optional)</Text>
          <TextInput keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+94771234567" placeholderTextColor={AppColors.muted} style={styles.input} />
          {message ? <Text accessibilityRole="alert" style={styles.profileDescription}>{message}</Text> : null}
          <Button title={saving ? 'Saving...' : 'Save alert settings'} loading={saving} onPress={saveProfile} style={{ marginTop: 14 }} />
        </Card>
        <Button title="Sign out" onPress={async () => { await logout(); router.replace('/(auth)/login'); }} style={styles.logout} />
        <Card style={styles.preferenceCard}>
          <View style={styles.preferenceIcon}>
            <Ionicons name="shield-checkmark-outline" size={22} color={AppColors.primary} />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>Safety first</Text>
            <Text style={styles.profileDescription}>
              Keep your information up to date for a safer community.
            </Text>
          </View>
        </Card>
        <Modal visible={districtPickerOpen} animationType="slide" onRequestClose={() => setDistrictPickerOpen(false)}><SafeAreaView style={styles.modalSafeArea}><View style={styles.modalHeader}><Text style={styles.profileTitle}>Choose your district</Text><Pressable onPress={() => setDistrictPickerOpen(false)}><Text style={{ color: AppColors.primary }}>Close</Text></Pressable></View><ScrollView>{DISTRICTS.map((item) => <Pressable key={item} onPress={() => { setDistrict(item); setDistrictPickerOpen(false); }} style={styles.districtItem}><Text style={styles.profileDescription}>{item}</Text></Pressable>)}</ScrollView></SafeAreaView></Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 28 },
  profileCard: { alignItems: 'center', flexDirection: 'row', marginTop: 26 },
  avatar: {
    alignItems: 'center',
    backgroundColor: AppColors.primarySoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginRight: 14,
    width: 56,
  },
  profileCopy: { flex: 1 },
  profileTitle: { ...Typography.sectionTitle, color: AppColors.text, fontSize: 18 },
  profileDescription: { ...Typography.secondary, color: AppColors.muted, marginTop: 5 },
  preferenceCard: { alignItems: 'center', flexDirection: 'row', marginTop: 14 },
  logout: { marginTop: 24 },
  preferenceIcon: {
    alignItems: 'center',
    backgroundColor: AppColors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  input: { borderColor: AppColors.border, borderRadius: 8, borderWidth: 1, color: AppColors.text, minHeight: 48, paddingHorizontal: 12, paddingVertical: 12, marginTop: 12 },
  selectInput: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...Typography.label, color: AppColors.text, marginTop: 14 },
  basinList: { gap: 8, marginTop: 8 },
  basinOption: { borderColor: AppColors.border, borderRadius: 8, borderWidth: 1, padding: 11 },
  basinSelected: { backgroundColor: '#E8F2FC', borderColor: AppColors.primary },
  modalSafeArea: { backgroundColor: AppColors.background, flex: 1 },
  modalHeader: { alignItems: 'center', borderBottomColor: AppColors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  districtItem: { borderBottomColor: AppColors.border, borderBottomWidth: 1, padding: 16 },
});

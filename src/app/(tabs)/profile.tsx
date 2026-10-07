import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppColors, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
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
});

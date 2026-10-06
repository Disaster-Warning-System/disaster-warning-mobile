import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppColors, Radius } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          eyebrow="SRI LANKA • COMMUNITY SAFETY"
          title="Disaster Warning System"
          subtitle="Stay informed. Stay safe."
        />
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Current warnings</Text>
            <View style={styles.safeBadge}>
              <Ionicons name="shield-checkmark" size={14} color={AppColors.success} />
              <Text style={styles.safeBadgeText}>All clear</Text>
            </View>
          </View>
          <Card style={styles.warningCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="shield-checkmark-outline" size={28} color={AppColors.success} />
            </View>
            <View style={styles.warningCopy}>
              <Text style={styles.warningTitle}>No active warnings</Text>
              <Text style={styles.warningDescription}>
                There are currently no active disaster warnings in your area.
              </Text>
            </View>
          </Card>
        </View>
        <Button
          title="Report a Hazard"
          onPress={() => router.navigate('/(tabs)/report')}
          style={styles.reportButton}
        />
        <Card style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="megaphone-outline" size={22} color={AppColors.primary} />
          </View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>Emergency reporting</Text>
            <Text style={styles.infoDescription}>
              Report hazards you see so authorities can respond faster.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  content: { flexGrow: 1, paddingBottom: 32, paddingHorizontal: 24, paddingTop: 28 },
  section: { marginTop: 34 },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: AppColors.text, fontSize: 18, fontWeight: '800' },
  safeBadge: {
    alignItems: 'center',
    backgroundColor: '#E5F4ED',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  safeBadgeText: { color: AppColors.success, fontSize: 12, fontWeight: '800' },
  warningCard: { alignItems: 'center', flexDirection: 'row' },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: '#E5F4ED',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    marginRight: 12,
    width: 52,
  },
  warningCopy: { flex: 1 },
  warningTitle: { color: AppColors.text, fontSize: 16, fontWeight: '800' },
  warningDescription: { color: AppColors.muted, fontSize: 14, lineHeight: 20, marginTop: 5 },
  reportButton: { marginTop: 20 },
  infoCard: { alignItems: 'center', flexDirection: 'row', marginTop: 14 },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: AppColors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  infoCopy: { flex: 1 },
  infoTitle: { color: AppColors.text, fontSize: 15, fontWeight: '800' },
  infoDescription: { color: AppColors.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/common/Card';
import PendingReportsStatus from '@/components/hazard-report/PendingReportsStatus';
import { AppColors, Radius, Shadows, Typography } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>SMART DISASTER</Text>
            <Text style={styles.title}>Good morning 👋</Text>
            <Text style={styles.subtitle}>Stay informed. Stay safe.</Text>
          </View>
          <View style={styles.bell}><Ionicons name="notifications-outline" size={19} color={AppColors.text} /></View>
        </View>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Report a Hazard</Text>
            <Text style={styles.heroText}>Help protect your community by reporting hazards immediately.</Text>
            <Text style={styles.heroButton} onPress={() => router.navigate('/(tabs)/report')}>Report Now  →</Text>
          </View>
          <Ionicons name="warning" size={62} color="#86C4EE" style={styles.heroIcon} />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Current warnings</Text>
            <View style={styles.safeBadge}>
              <Ionicons name="warning" size={14} color={AppColors.accent} />
              <Text style={styles.safeBadgeText}>All clear</Text>
            </View>
          </View>
          <Card style={styles.warningCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="warning" size={20} color={AppColors.accent} />
            </View>
            <View style={styles.warningCopy}>
              <Text style={styles.warningTitle}>Emergency services are available 24/7</Text>
              <Text style={styles.warningDescription}>Stay alert and report hazards when you see them.</Text>
            </View>
          </Card>
        </View>
        <Text style={styles.quickTitle}>Quick Access</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoIcon}><Ionicons name="warning" size={18} color={AppColors.accent} /></View>
          <View style={styles.infoCopy}><Text style={styles.infoTitle}>Active Warnings</Text><Text style={styles.infoDescription}>Check current disasters</Text></View>
          <Ionicons name="chevron-forward" size={17} color={AppColors.muted} />
        </Card>
        <Card style={styles.infoCard}>
          <View style={[styles.infoIcon, { backgroundColor: AppColors.primarySoft }]}><Ionicons name="information" size={18} color={AppColors.primary} /></View>
          <View style={styles.infoCopy}><Text style={styles.infoTitle}>Emergency Information</Text><Text style={styles.infoDescription}>Safety guidance and emergency contacts</Text></View>
          <Ionicons name="chevron-forward" size={17} color={AppColors.muted} />
        </Card>
        <PendingReportsStatus />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24, paddingHorizontal: 20, paddingTop: 22 },
  topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { ...Typography.label, color: AppColors.muted, letterSpacing: 1 },
  title: { ...Typography.title, color: AppColors.text, fontSize: 24, marginTop: 4 },
  subtitle: { ...Typography.secondary, color: AppColors.muted, fontSize: 13, marginTop: 3 },
  bell: { alignItems: 'center', backgroundColor: AppColors.surface, borderRadius: 20, height: 40, justifyContent: 'center', width: 40, ...Shadows.card },
  hero: { backgroundColor: AppColors.primary, borderRadius: Radius.medium, flexDirection: 'row', marginTop: 22, minHeight: 142, overflow: 'hidden', padding: 18 },
  heroCopy: { flex: 1, zIndex: 1 },
  heroTitle: { ...Typography.sectionTitle, color: '#FFFFFF', marginBottom: 2 },
  heroText: { ...Typography.secondary, color: '#D9EDFA', fontSize: 13, marginTop: 7, maxWidth: 205 },
  heroButton: { ...Typography.button, backgroundColor: '#FFFFFF', borderRadius: 7, color: AppColors.primaryDark, fontSize: 15, marginTop: 14, paddingHorizontal: 11, paddingVertical: 8, overflow: 'hidden', alignSelf: 'flex-start' },
  heroIcon: { alignSelf: 'center', opacity: 0.9 },
  section: { marginTop: 20 },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  sectionTitle: { ...Typography.sectionTitle, color: AppColors.text, fontSize: 18 },
  safeBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF0E9',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  safeBadgeText: { ...Typography.label, color: AppColors.accent, fontSize: 12 },
  warningCard: { alignItems: 'center', flexDirection: 'row' },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF0E9',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  warningCopy: { flex: 1 },
  warningTitle: { ...Typography.label, color: AppColors.text, fontSize: 13 },
  warningDescription: { ...Typography.secondary, color: AppColors.muted, fontSize: 13, marginTop: 4 },
  quickTitle: { ...Typography.sectionTitle, color: AppColors.text, marginTop: 22, marginBottom: 10 },
  infoCard: { alignItems: 'center', flexDirection: 'row', marginTop: 9, padding: 13 },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: AppColors.primarySoft,
    borderRadius: 22,
    height: 34,
    justifyContent: 'center',
    marginRight: 12,
    width: 34,
  },
  infoCopy: { flex: 1 },
  infoTitle: { ...Typography.label, color: AppColors.text, fontSize: 13 },
  infoDescription: { ...Typography.secondary, color: AppColors.muted, fontSize: 13, marginTop: 3 },
});

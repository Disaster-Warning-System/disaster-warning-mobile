import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/common/Card';
import ErrorMessage from '@/components/common/ErrorMessage';
import ReportStatusBadge from '@/components/reports/ReportStatusBadge';
import { AppColors, Typography } from '@/constants/theme';
import { ApiRequestError, getApiUrl } from '@/services/api/apiClient';
import { getHazardReports } from '@/services/api/hazardReportApi';
import type { HazardReport } from '@/types/hazardReport';

function formatDate(value?: string) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

function locationLabel(report: HazardReport) {
  return [report.location.address, report.location.district].filter(Boolean).join(', ') || 'Location unavailable';
}

export default function ReportDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<HazardReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getHazardReports()
      .then((reports) => {
        const match = reports.find((item) => item.id === id || item.reportId === id);
        if (!match) setError('Report not found.');
        else setReport(match);
      })
      .catch((requestError) => setError(requestError instanceof ApiRequestError ? requestError.message : 'Unable to load this report.'));
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ title: 'Report Details', headerShown: true, headerBackTitle: 'Reports' }} />
      <ScrollView contentContainerStyle={styles.content}>
        {!report && !error ? <View style={styles.state}><ActivityIndicator color={AppColors.primary} size="large" /></View> : null}
        {error ? <View style={styles.state}><ErrorMessage message={error} /></View> : null}
        {report ? (
          <>
            <View style={styles.heading}><Text style={styles.reportId}>{report.reportId}</Text><ReportStatusBadge status={report.status} /></View>
            <Card style={styles.card}>
              <Text style={styles.label}>Hazard type</Text><Text style={styles.value}>{report.hazardType}</Text>
              <Text style={styles.label}>Description</Text><Text style={styles.value}>{report.description}</Text>
              <Text style={styles.label}>Location</Text><Text style={styles.value}>{locationLabel(report)}</Text>
              <Text style={styles.label}>Submitted</Text><Text style={styles.value}>{formatDate(report.createdAt)}</Text>
              <Text style={styles.label}>Verification status</Text><ReportStatusBadge status={report.status} />
            </Card>
            <Card style={styles.photoCard}>
              <Text style={styles.label}>Photo evidence</Text>
              {report.photoFileId ? (
                <Image resizeMode="cover" source={{ uri: getApiUrl(`/api/uploads/hazard-photo/${report.photoFileId}`) }} style={styles.photo} />
              ) : report.evidence[0]?.url ? (
                <Image resizeMode="cover" source={{ uri: report.evidence[0].url }} style={styles.photo} />
              ) : (
                <View style={styles.noPhoto}><Ionicons color={AppColors.muted} name="image-outline" size={26} /><Text style={styles.noPhotoText}>No photo attached</Text></View>
              )}
            </Card>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  content: { flexGrow: 1, padding: 20, paddingBottom: 28 },
  heading: { alignItems: 'flex-start', gap: 12 },
  reportId: { ...Typography.sectionTitle, color: AppColors.primary },
  card: { marginTop: 18 },
  photoCard: { marginTop: 14 },
  label: { ...Typography.label, color: AppColors.muted, marginTop: 14 },
  value: { ...Typography.body, color: AppColors.text, marginTop: 4 },
  photo: { borderRadius: 10, height: 220, marginTop: 10, width: '100%' },
  noPhoto: { alignItems: 'center', backgroundColor: AppColors.backgroundElement, borderRadius: 10, justifyContent: 'center', marginTop: 10, minHeight: 130 },
  noPhotoText: { ...Typography.secondary, color: AppColors.muted, marginTop: 8 },
  state: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 400 },
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ErrorMessage from '@/components/common/ErrorMessage';
import ReportStatusBadge from '@/components/reports/ReportStatusBadge';
import { AppColors, Typography } from '@/constants/theme';
import { ApiRequestError } from '@/services/api/apiClient';
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

export default function ReportHistory({ onSubmitNew }: { onSubmitNew: () => void }) {
  const router = useRouter();
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      setReports(await getHazardReports());
    } catch (requestError) {
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Unable to load your reports.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadReports(true)} tintColor={AppColors.primary} />}
    >
      <Text style={styles.title}>Report Hazard</Text>
      <Text style={styles.subtitle}>Submit a hazard or check your report history.</Text>
      <Text style={styles.sectionTitle}>My Reports</Text>
      {loading ? (
        <View style={styles.state}><ActivityIndicator color={AppColors.primary} size="large" /><Text style={styles.stateText}>Loading reports...</Text></View>
      ) : error ? (
        <View style={styles.state}><ErrorMessage message={error} /><Pressable onPress={() => void loadReports()} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable></View>
      ) : reports.length === 0 ? (
        <View style={styles.state}><Ionicons color={AppColors.muted} name="document-text-outline" size={42} /><Text style={styles.emptyTitle}>No hazard reports submitted yet.</Text></View>
      ) : (
        reports.map((report) => (
          <Pressable key={report.id ?? report.reportId} onPress={() => router.push({ pathname: '/report-details/[id]', params: { id: report.id ?? report.reportId } })}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}><Text style={styles.reportId}>{report.reportId}</Text><Ionicons color={AppColors.muted} name="chevron-forward" size={18} /></View>
              <Text style={styles.hazardType}>{report.hazardType}</Text>
              <Text numberOfLines={1} style={styles.location}><Ionicons color={AppColors.muted} name="location-outline" size={14} /> {locationLabel(report)}</Text>
              <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
              <ReportStatusBadge status={report.status} />
            </Card>
          </Pressable>
        ))
      )}
      <Button onPress={onSubmitNew} title="+ Submit New Report" style={styles.submitButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 20, paddingBottom: 32 },
  title: { ...Typography.title, color: AppColors.text },
  subtitle: { ...Typography.secondary, color: AppColors.muted, marginTop: 5 },
  sectionTitle: { ...Typography.sectionTitle, color: AppColors.text, marginTop: 26, marginBottom: 2 },
  card: { marginTop: 12, padding: 16 },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  reportId: { ...Typography.label, color: AppColors.primary },
  hazardType: { ...Typography.sectionTitle, color: AppColors.text, marginTop: 10 },
  location: { ...Typography.secondary, color: AppColors.muted, marginTop: 8 },
  date: { ...Typography.secondary, color: AppColors.muted, fontSize: 12, marginTop: 5, marginBottom: 11 },
  state: { alignItems: 'center', justifyContent: 'center', minHeight: 210, paddingHorizontal: 18 },
  stateText: { ...Typography.secondary, color: AppColors.muted, marginTop: 10 },
  emptyTitle: { ...Typography.secondary, color: AppColors.muted, marginTop: 10, textAlign: 'center' },
  retry: { backgroundColor: AppColors.primary, borderRadius: 8, marginTop: 16, paddingHorizontal: 20, paddingVertical: 11 },
  retryText: { ...Typography.button, color: '#FFFFFF', fontSize: 14 },
  submitButton: { marginTop: 20 },
});

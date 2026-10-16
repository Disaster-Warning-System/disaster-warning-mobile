import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ErrorMessage from '@/components/common/ErrorMessage';
import ReportStatusBadge from '@/components/reports/ReportStatusBadge';
import { AppColors, Typography } from '@/constants/theme';
import { ApiRequestError } from '@/services/api/apiClient';
import { getHazardReports } from '@/services/api/hazardReportApi';
import { getPendingReports } from '@/services/storage/offlineStorage';
import { syncPendingReports } from '@/services/sync/reportSyncService';
import { useAuth } from '@/context/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import type { HazardReport, LocalPendingHazardReport, ReportSyncStatus } from '@/types/hazardReport';

function formatDate(value?: string) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

function locationLabel(report: HazardReport) {
  return [report.location.address, report.location.district].filter(Boolean).join(', ') || 'Location unavailable';
}

function pendingLocationLabel(report: LocalPendingHazardReport) {
  return [report.location.address, report.location.district].filter(Boolean).join(', ') || 'Location unavailable';
}

function formatSyncStatus(status: ReportSyncStatus) {
  return status === 'Syncing' ? 'Syncing...' : status;
}

export default function ReportHistory({ onSubmitNew }: { onSubmitNew: () => void }) {
  const router = useRouter();
  const { token, user } = useAuth();
  const { isConnected } = useNetworkStatus();
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [pendingReports, setPendingReports] = useState<LocalPendingHazardReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState('');

  const loadReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    const [remoteResult, localResult] = await Promise.allSettled([
      getHazardReports(token),
      user ? getPendingReports({ userId: user._id }) : Promise.resolve([]),
    ]);

    if (remoteResult.status === 'fulfilled') {
      setReports(remoteResult.value);
    } else {
      setError(
        remoteResult.reason instanceof ApiRequestError
          ? remoteResult.reason.message
          : 'Unable to load your reports.',
      );
    }
    if (localResult.status === 'fulfilled') {
      setPendingReports(localResult.value);
    } else {
      console.error('Could not load saved hazard reports.', localResult.reason);
    }
    setLoading(false);
    setRefreshing(false);
  }, [token, user]);

  useFocusEffect(
    useCallback(() => {
      void loadReports();
    }, [loadReports]),
  );

  const retryPendingReports = async () => {
    if (!isConnected || retrying) return;
    setRetrying(true);
    try {
      await syncPendingReports({ token, userId: user?._id });
      await loadReports();
    } catch (syncError) {
      console.error('Could not retry saved hazard reports.', syncError);
      setError('Unable to retry saved reports. Please try again.');
    } finally {
      setRetrying(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadReports(true)} tintColor={AppColors.primary} />}
    >
      <Text style={styles.title}>Report Hazard</Text>
      <Text style={styles.subtitle}>Submit a hazard or check your report history.</Text>
      {pendingReports.length > 0 ? (
        <View style={styles.pendingSection}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.pendingSectionTitle}>Saved Reports</Text>
            <Text style={styles.pendingCount}>{pendingReports.length} pending</Text>
          </View>
          <Text style={styles.pendingHelper}>
            These reports are saved on this device and will not be lost.
          </Text>
          {pendingReports.map((report) => (
            <Card key={report.localId} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.reportId}>Offline report</Text>
                <Ionicons color={AppColors.muted} name="cloud-upload-outline" size={18} />
              </View>
              <Text style={styles.hazardType}>{report.hazardType}</Text>
              <Text numberOfLines={1} style={styles.location}>
                <Ionicons color={AppColors.muted} name="location-outline" size={14} />{' '}
                {pendingLocationLabel(report)}
              </Text>
              <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
              <View style={styles.syncBadge}>
                <Text style={styles.syncBadgeText}>{formatSyncStatus(report.syncStatus)}</Text>
              </View>
            </Card>
          ))}
          <Button
            title={retrying ? 'Retrying saved reports...' : 'Retry Saved Reports'}
            onPress={() => void retryPendingReports()}
            disabled={!isConnected || retrying}
            loading={retrying}
            style={styles.retryButton}
          />
          {!isConnected ? (
            <Text style={styles.offlineMessage}>
              Retry will be available when an internet connection is restored.
            </Text>
          ) : null}
        </View>
      ) : null}
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
  content: { flexGrow: 1, padding: 20, paddingBottom: 128 },
  title: { ...Typography.title, color: AppColors.text },
  subtitle: { ...Typography.secondary, color: AppColors.muted, marginTop: 5 },
  pendingSection: { marginTop: 26 },
  sectionHeadingRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  pendingSectionTitle: { ...Typography.sectionTitle, color: AppColors.text, marginBottom: 2 },
  sectionTitle: { ...Typography.sectionTitle, color: AppColors.text, marginTop: 26, marginBottom: 2 },
  pendingCount: { ...Typography.secondary, color: AppColors.primary, fontSize: 12, fontWeight: '600' },
  pendingHelper: { ...Typography.secondary, color: AppColors.muted, fontSize: 13, marginTop: 5 },
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
  syncBadge: { alignSelf: 'flex-start', backgroundColor: '#FFF5D9', borderRadius: 999, marginTop: 2, paddingHorizontal: 10, paddingVertical: 6 },
  syncBadgeText: { ...Typography.label, color: '#9A6A00', fontSize: 12 },
  retryButton: { marginTop: 16 },
  offlineMessage: { ...Typography.secondary, color: AppColors.muted, fontSize: 12, marginTop: 8, textAlign: 'center' },
  submitButton: { marginTop: 20 },
});

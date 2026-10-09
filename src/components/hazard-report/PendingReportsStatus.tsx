import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import Card from '@/components/common/Card';
import { AppColors, Typography } from '@/constants/theme';
import { getPendingReports } from '@/services/storage/offlineStorage';
import type { LocalPendingHazardReport } from '@/types/hazardReport';

const STATUS_LABELS = {
  'Pending Synchronization': 'Pending Synchronization',
  Syncing: 'Syncing...',
  'Sync Failed': 'Sync Failed',
  Synced: 'Synced',
} as const;

export default function PendingReportsStatus() {
  const [reports, setReports] = useState<LocalPendingHazardReport[]>([]);

  const loadReports = useCallback(() => {
    void getPendingReports()
      .then(setReports)
      .catch((error: unknown) => {
        console.error('Could not load saved hazard report statuses.', error);
      });
  }, []);

  useFocusEffect(loadReports);

  if (reports.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report synchronization</Text>
      {reports.map((report) => (
        <Card key={report.localId} style={styles.card}>
          <Text style={styles.reportTitle}>{report.hazardType} report</Text>
          <Text style={styles.status}>{STATUS_LABELS[report.syncStatus]}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 22 },
  title: { ...Typography.sectionTitle, color: AppColors.text, fontSize: 18, marginBottom: 10 },
  card: { marginTop: 8, padding: 14 },
  reportTitle: { ...Typography.label, color: AppColors.text },
  status: { ...Typography.secondary, color: AppColors.muted, marginTop: 4 },
});

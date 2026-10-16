import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useHazardReport } from '@/hooks/useHazardReport';
import { syncPendingReports } from '@/services/sync/reportSyncService';
import { useAuth } from '@/context/AuthContext';

export function ReportSyncManager() {
  const { isConnected } = useNetworkStatus();
  const { token, user } = useAuth();
  const { markReportSyncing, markReportSynced, markReportSyncFailed } = useHazardReport();

  useEffect(() => {
    if (Platform.OS === 'web' || !isConnected) {
      return;
    }

    syncPendingReports({ onStatusChange: markReportSyncing, token, userId: user?._id })
      .then(({ syncedReports, failedReports }) => {
        for (const { localId, report } of syncedReports) {
          markReportSynced(localId, report);
        }
        for (const localId of failedReports) {
          markReportSyncFailed(localId);
        }
      })
      .catch((error: unknown) => {
        console.error('Automatic hazard report sync could not be completed.', error);
      });
  }, [isConnected, markReportSyncFailed, markReportSynced, markReportSyncing, token, user?._id]);

  return null;
}

import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useHazardReport } from '@/hooks/useHazardReport';
import { syncPendingReports } from '@/services/sync/reportSyncService';

export function ReportSyncManager() {
  const { isConnected } = useNetworkStatus();
  const { markReportSynced } = useHazardReport();

  useEffect(() => {
    if (Platform.OS === 'web' || !isConnected) {
      return;
    }

    syncPendingReports()
      .then(({ syncedReports }) => {
        for (const { localId, report } of syncedReports) {
          markReportSynced(localId, report);
        }
      })
      .catch((error: unknown) => {
        console.error('Automatic hazard report sync could not be completed.', error);
      });
  }, [isConnected, markReportSynced]);

  return null;
}

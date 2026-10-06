import * as Network from 'expo-network';

import { createHazardReport } from '@/services/api/hazardReportApi';
import { getPendingReports, removePendingReport } from '@/services/storage/offlineStorage';
import type {
  CreateHazardReportRequest,
  HazardReport,
} from '@/types/hazardReport';

export type SyncSummary = {
  synced: number;
  remaining: number;
  syncedReports: Array<{ localId: string; report: HazardReport }>;
};

let activeSync: Promise<SyncSummary> | null = null;

async function performSync(): Promise<SyncSummary> {
  const networkState = await Network.getNetworkStateAsync();
  if (networkState.isConnected !== true || networkState.isInternetReachable === false) {
    return { synced: 0, remaining: 0, syncedReports: [] };
  }

  const pendingReports = await getPendingReports();
  let synced = 0;
  const syncedReports: SyncSummary['syncedReports'] = [];

  for (const pending of pendingReports) {
    const currentNetwork = await Network.getNetworkStateAsync();
    if (currentNetwork.isConnected !== true || currentNetwork.isInternetReachable === false) {
      break;
    }

    const request: CreateHazardReportRequest = {
      hazardType: pending.hazardType,
      description: pending.description,
      location: pending.location,
      photoUrl: null,
    };

    try {
      const report = await createHazardReport(request, pending.localId);
      await removePendingReport(pending.localId);
      synced += 1;
      syncedReports.push({ localId: pending.localId, report });
    } catch (error) {
      console.error(`Could not sync saved hazard report ${pending.localId}.`, error);
    }
  }

  const remaining = (await getPendingReports()).length;
  return { synced, remaining, syncedReports };
}

export function syncPendingReports(): Promise<SyncSummary> {
  if (activeSync) {
    return activeSync;
  }

  activeSync = performSync().finally(() => {
    activeSync = null;
  });
  return activeSync;
}

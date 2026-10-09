import * as Network from 'expo-network';

import { createHazardReport } from '@/services/api/hazardReportApi';
import { getApiUrl } from '@/services/api/apiClient';
import { deleteHazardPhoto, uploadHazardPhoto } from '@/services/api/hazardPhotoApi';
import {
  getPendingReports,
  removePendingReport,
  updatePendingReport,
} from '@/services/storage/offlineStorage';
import type {
  CreateHazardReportRequest,
  HazardReport,
} from '@/types/hazardReport';

export type SyncSummary = {
  synced: number;
  remaining: number;
  syncedReports: Array<{ localId: string; report: HazardReport }>;
  failedReports: string[];
};

let activeSync: Promise<SyncSummary> | null = null;

type SyncOptions = {
  onStatusChange?: (localId: string, status: 'Syncing') => void;
  token?: string | null;
};

async function performSync(options: SyncOptions = {}): Promise<SyncSummary> {
  const networkState = await Network.getNetworkStateAsync();
  if (networkState.isConnected !== true || networkState.isInternetReachable === false) {
    return { synced: 0, remaining: 0, syncedReports: [], failedReports: [] };
  }

  const pendingReports = (await getPendingReports()).filter(
    (pending) =>
      pending.syncStatus === 'Pending Synchronization' ||
      pending.syncStatus === 'Sync Failed',
  );
  let synced = 0;
  const syncedReports: SyncSummary['syncedReports'] = [];
  const failedReports: string[] = [];

  for (const pending of pendingReports) {
    const currentNetwork = await Network.getNetworkStateAsync();
    if (currentNetwork.isConnected !== true || currentNetwork.isInternetReachable === false) {
      break;
    }

    await updatePendingReport(pending.localId, {
      localStatus: 'Syncing',
      syncStatus: 'Syncing',
    });
    options.onStatusChange?.(pending.localId, 'Syncing');

    const request: CreateHazardReportRequest = {
      hazardType: pending.hazardType,
      description: pending.description,
      severity: pending.severity,
      location: pending.location,
      photoFileId: null,
      evidence: [],
    };

    try {
      if (pending.photoUri) {
        request.photoFileId = await uploadHazardPhoto(pending.photoUri);
        request.evidence = [{
          url: getApiUrl(`/api/uploads/hazard-photo/${encodeURIComponent(request.photoFileId)}`),
          type: 'image',
        }];
      }
      let report;
      try {
        report = await createHazardReport(request, pending.idempotencyKey, options.token);
      } catch (error) {
        if (request.photoFileId) {
          await deleteHazardPhoto(request.photoFileId);
        }
        throw error;
      }
      await updatePendingReport(pending.localId, {
        localStatus: 'Synced',
        syncStatus: 'Synced',
      });
      await removePendingReport(pending.localId);
      synced += 1;
      syncedReports.push({ localId: pending.localId, report });
    } catch (error) {
      await updatePendingReport(pending.localId, {
        localStatus: 'Sync Failed',
        syncStatus: 'Sync Failed',
      });
      failedReports.push(pending.localId);
      console.error(`Could not sync saved hazard report ${pending.localId}.`, error);
    }
  }

  const remaining = (await getPendingReports()).length;
  return { synced, remaining, syncedReports, failedReports };
}

export function syncPendingReports(options: SyncOptions = {}): Promise<SyncSummary> {
  if (activeSync) {
    return activeSync;
  }

  activeSync = performSync(options).finally(() => {
    activeSync = null;
  });
  return activeSync;
}

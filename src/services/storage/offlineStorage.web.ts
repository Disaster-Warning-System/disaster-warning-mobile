import { HAZARD_TYPES } from '@/constants/hazardTypes';
import type { LocalPendingHazardReport, ReportSyncStatus } from '@/types/hazardReport';

const STORAGE_KEY_PREFIX = 'disaster-warning-pending-hazard-reports';
const HAZARD_TYPE_SET: ReadonlySet<string> = new Set(HAZARD_TYPES);

function isLocalPendingHazardReport(value: unknown): value is LocalPendingHazardReport {
  if (typeof value !== 'object' || value === null || !('location' in value)) {
    return false;
  }

  const report = value as Partial<LocalPendingHazardReport>;
  const location = report.location;
  const localStatus = report.localStatus as string;
  if (!location || typeof location !== 'object') {
    return false;
  }

  return (
    typeof report.localId === 'string' &&
    typeof report.hazardType === 'string' &&
    HAZARD_TYPE_SET.has(report.hazardType) &&
    typeof report.description === 'string' &&
    (typeof report.photoUri === 'string' || report.photoUri === null) &&
    (localStatus === 'Pending Synchronization' ||
      localStatus === 'Syncing' ||
      localStatus === 'Synced' ||
      localStatus === 'Sync Failed' ||
      localStatus === 'Pending Sync') &&
    typeof report.createdAt === 'string' &&
    (typeof location.latitude === 'number' || location.latitude === null) &&
    (typeof location.longitude === 'number' || location.longitude === null) &&
    typeof location.address === 'string' &&
    (typeof report.syncStatus === 'string' || localStatus === 'Pending Sync') &&
    (typeof report.idempotencyKey === 'string' || localStatus === 'Pending Sync')
  );
}

function migrateReport(report: LocalPendingHazardReport): LocalPendingHazardReport {
  const legacyStatus = report.localStatus as string;
  const syncStatus: ReportSyncStatus =
    legacyStatus === 'Pending Sync' ? 'Pending Synchronization' : report.syncStatus;
  return {
    ...report,
    localStatus: syncStatus,
    syncStatus,
    idempotencyKey: report.idempotencyKey || report.localId,
  };
}

function storageKey(owner: { userId: string }): string {
  return `${STORAGE_KEY_PREFIX}:${owner.userId}`;
}

function readReports(owner: { userId: string }): LocalPendingHazardReport[] {
  if (typeof globalThis.localStorage === 'undefined') {
    return [];
  }

  const stored = globalThis.localStorage.getItem(storageKey(owner));
  if (!stored) {
    return [];
  }

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isLocalPendingHazardReport)) {
    throw new Error('Saved pending reports have an invalid format.');
  }
  return parsed.map(migrateReport);
}

function writeReports(owner: { userId: string }, reports: LocalPendingHazardReport[]): void {
  if (typeof globalThis.localStorage === 'undefined') {
    throw new Error('Browser local storage is unavailable.');
  }
  globalThis.localStorage.setItem(storageKey(owner), JSON.stringify(reports));
}

export async function savePendingReport(report: LocalPendingHazardReport, owner: { userId: string }): Promise<void> {
  const reports = readReports(owner);
  if (!reports.some((pending) => pending.localId === report.localId)) {
    writeReports(owner, [...reports, report]);
  }
}

export async function getPendingReports(owner: { userId: string }): Promise<LocalPendingHazardReport[]> {
  return readReports(owner);
}

export async function removePendingReport(localId: string, owner: { userId: string }): Promise<void> {
  writeReports(owner, readReports(owner).filter((report) => report.localId !== localId));
}

export async function updatePendingReport(
  localId: string,
  owner: { userId: string },
  update: Pick<LocalPendingHazardReport, 'localStatus' | 'syncStatus'>,
): Promise<void> {
  writeReports(
    owner,
    readReports(owner).map((report) =>
      report.localId === localId ? { ...report, ...update } : report,
    ),
  );
}

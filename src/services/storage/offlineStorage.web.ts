import { HAZARD_TYPES } from '@/constants/hazardTypes';
import type { LocalPendingHazardReport } from '@/types/hazardReport';

const STORAGE_KEY = 'disaster-warning-pending-hazard-reports';
const HAZARD_TYPE_SET: ReadonlySet<string> = new Set(HAZARD_TYPES);

function isLocalPendingHazardReport(value: unknown): value is LocalPendingHazardReport {
  if (typeof value !== 'object' || value === null || !('location' in value)) {
    return false;
  }

  const report = value as Partial<LocalPendingHazardReport>;
  const location = report.location;
  if (!location || typeof location !== 'object') {
    return false;
  }

  return (
    typeof report.localId === 'string' &&
    typeof report.hazardType === 'string' &&
    HAZARD_TYPE_SET.has(report.hazardType) &&
    typeof report.description === 'string' &&
    (typeof report.photoUri === 'string' || report.photoUri === null) &&
    report.photoUrl === null &&
    report.localStatus === 'Pending Sync' &&
    typeof report.createdAt === 'string' &&
    (typeof location.latitude === 'number' || location.latitude === null) &&
    (typeof location.longitude === 'number' || location.longitude === null) &&
    typeof location.address === 'string'
  );
}

function readReports(): LocalPendingHazardReport[] {
  if (typeof globalThis.localStorage === 'undefined') {
    return [];
  }

  const stored = globalThis.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isLocalPendingHazardReport)) {
    throw new Error('Saved pending reports have an invalid format.');
  }
  return parsed;
}

function writeReports(reports: LocalPendingHazardReport[]): void {
  if (typeof globalThis.localStorage === 'undefined') {
    throw new Error('Browser local storage is unavailable.');
  }
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export async function savePendingReport(report: LocalPendingHazardReport): Promise<void> {
  const reports = readReports();
  if (!reports.some((pending) => pending.localId === report.localId)) {
    writeReports([...reports, report]);
  }
}

export async function getPendingReports(): Promise<LocalPendingHazardReport[]> {
  return readReports();
}

export async function removePendingReport(localId: string): Promise<void> {
  writeReports(readReports().filter((report) => report.localId !== localId));
}

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

import { HAZARD_TYPES } from '@/constants/hazardTypes';
import type { LocalPendingHazardReport } from '@/types/hazardReport';

const DATABASE_NAME = 'hazard-reports.db';
const SECURE_KEY_NAME = 'hazard-reports-sqlcipher-key';
const HAZARD_TYPE_SET: ReadonlySet<string> = new Set(HAZARD_TYPES);

type PendingReportRow = {
  payload: string;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function isLocalPendingHazardReport(value: unknown): value is LocalPendingHazardReport {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('location' in value) || typeof value.location !== 'object' || value.location === null) {
    return false;
  }
  const report = value as Partial<LocalPendingHazardReport>;
  const location = report.location;
  if (!location) {
    return false;
  }
  return (
    typeof report.localId === 'string' &&
    typeof report.hazardType === 'string' &&
    HAZARD_TYPE_SET.has(report.hazardType) &&
    typeof report.description === 'string' &&
    (typeof report.photoUri === 'string' || report.photoUri === null) &&
    report.localStatus === 'Pending Sync' &&
    typeof report.createdAt === 'string' &&
    (typeof location.latitude === 'number' || location.latitude === null) &&
    (typeof location.longitude === 'number' || location.longitude === null) &&
    typeof location.address === 'string'
  );
}

async function openEncryptedDatabase(): Promise<SQLite.SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  try {
    let key = await SecureStore.getItemAsync(SECURE_KEY_NAME);
    if (!key) {
      key = `${Crypto.randomUUID()}${Crypto.randomUUID()}`;
      await SecureStore.setItemAsync(SECURE_KEY_NAME, key);
    }

    await database.execAsync(`PRAGMA key = '${key}';`);
    const cipher = await database.getFirstAsync<{ cipher_version: string }>(
      'PRAGMA cipher_version;',
    );
    if (!cipher?.cipher_version) {
      throw new Error('Encrypted local storage is unavailable in this app build.');
    }

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS pending_hazard_reports (
        local_id TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
    return database;
  } catch (error) {
    await database.closeAsync();
    throw error;
  }
}

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openEncryptedDatabase().catch((error: unknown) => {
      databasePromise = null;
      throw error;
    });
  }
  return databasePromise;
}

export async function savePendingReport(report: LocalPendingHazardReport): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT OR IGNORE INTO pending_hazard_reports (local_id, payload, created_at)
     VALUES (?, ?, ?)`,
    report.localId,
    JSON.stringify(report),
    report.createdAt,
  );
}

export async function getPendingReports(): Promise<LocalPendingHazardReport[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<PendingReportRow>(
    'SELECT payload FROM pending_hazard_reports ORDER BY created_at ASC',
  );

  return rows.map(({ payload }) => {
    const parsed: unknown = JSON.parse(payload);
    if (!isLocalPendingHazardReport(parsed)) {
      throw new Error('A saved pending report has an invalid format.');
    }
    return parsed;
  });
}

export async function removePendingReport(localId: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'DELETE FROM pending_hazard_reports WHERE local_id = ?',
    localId,
  );
}
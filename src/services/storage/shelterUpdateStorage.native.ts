import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import type { PendingShelterUpdate } from '@/types/shelter';
const DB = 'shelter-updates.db';
const KEY = 'shelter-updates-sqlcipher-key';
type Row = { local_id: string; payload: string };
let promise: Promise<SQLite.SQLiteDatabase> | null = null;
async function openDb() {
  const db = await SQLite.openDatabaseAsync(DB);
  try {
    let key = await SecureStore.getItemAsync(KEY);
    if (!key) {
      key = Crypto.randomUUID() + Crypto.randomUUID();
      await SecureStore.setItemAsync(KEY, key);
    }
    // Key SQLCipher before creating tables; fail if this build cannot provide encrypted storage.
    await db.execAsync("PRAGMA key = '" + key + "';");
    const cipher = await db.getFirstAsync<{ cipher_version: string }>(
      'PRAGMA cipher_version;',
    );
    if (!cipher?.cipher_version)
      throw new Error(
        'Encrypted shelter storage is unavailable in this app build.',
      );
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS pending_shelter_updates (local_id TEXT PRIMARY KEY NOT NULL,payload TEXT NOT NULL,created_at TEXT NOT NULL);',
    );
    return db;
  } catch (e) {
    await db.closeAsync();
    throw e;
  }
}
async function database() {
  if (!promise)
    promise = openDb().catch((e) => {
      promise = null;
      throw e;
    });
  return promise;
}
export async function savePendingShelterUpdate(v: PendingShelterUpdate) {
  const db = await database();
  await db.runAsync(
    'INSERT OR REPLACE INTO pending_shelter_updates (local_id,payload,created_at) VALUES (?,?,?)',
    v.localId,
    JSON.stringify(v),
    v.createdAt,
  );
}
export async function getPendingShelterUpdates() {
  const db = await database();
  const rows = await db.getAllAsync<{ payload: string }>(
    'SELECT payload FROM pending_shelter_updates ORDER BY created_at ASC',
  );
  return rows.map((r) => JSON.parse(r.payload) as PendingShelterUpdate);
}
export async function removePendingShelterUpdate(id: string) {
  const db = await database();
  await db.runAsync(
    'DELETE FROM pending_shelter_updates WHERE local_id = ?',
    id,
  );
}
export async function removePendingShelterUpdatesForShelter(shelterId: string) {
  const db = await database();
  const rows = await db.getAllAsync<Row>(
    'SELECT local_id,payload FROM pending_shelter_updates',
  );
  for (const row of rows) {
    const item = JSON.parse(row.payload) as PendingShelterUpdate;
    if (item.shelterId === shelterId)
      await db.runAsync(
        'DELETE FROM pending_shelter_updates WHERE local_id = ?',
        row.local_id,
      );
  }
}

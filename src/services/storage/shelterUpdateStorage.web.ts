import type { PendingShelterUpdate } from '@/types/shelter';
const KEY = 'disaster-warning-pending-shelter-updates';
function read(): PendingShelterUpdate[] {
  if (typeof globalThis.localStorage === 'undefined') return [];
  const raw = globalThis.localStorage.getItem(KEY);
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value))
    throw new Error('Saved shelter updates have an invalid format.');
  return value as PendingShelterUpdate[];
}
function write(items: PendingShelterUpdate[]) {
  if (typeof globalThis.localStorage === 'undefined')
    throw new Error('Browser storage is unavailable.');
  globalThis.localStorage.setItem(KEY, JSON.stringify(items));
}
export async function savePendingShelterUpdate(v: PendingShelterUpdate) {
  write([...read().filter((x) => x.localId !== v.localId), v]);
}
export async function getPendingShelterUpdates() {
  return read();
}
export async function removePendingShelterUpdate(id: string) {
  write(read().filter((x) => x.localId !== id));
}
export async function removePendingShelterUpdatesForShelter(shelterId: string) {
  write(read().filter((x) => x.shelterId !== shelterId));
}

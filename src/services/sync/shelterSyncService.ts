import * as Crypto from 'expo-crypto';
import * as Network from 'expo-network';
import { ApiRequestError } from '@/services/api/apiClient';
import { updateShelter } from '@/services/api/shelterApi';
import {
  getPendingShelterUpdates,
  removePendingShelterUpdate,
  removePendingShelterUpdatesForShelter,
  savePendingShelterUpdate,
} from '@/services/storage/shelterUpdateStorage';
import type { PendingShelterUpdate, UpdateShelterInput } from '@/types/shelter';
export type UpdateResult = { kind: 'synced' } | { kind: 'pending-sync' };
// Share an in-flight sync so reconnect events cannot replay the same queue item concurrently.
let active: Promise<number> | null = null;
export async function submitShelterUpdate(
  shelterId: string,
  changes: UpdateShelterInput,
): Promise<UpdateResult> {
  try {
    await updateShelter(shelterId, changes);
    return { kind: 'synced' };
  } catch (e) {
    // Retry transient failures; client errors need corrected input from the user.
    if (
      !(e instanceof ApiRequestError) ||
      (e.status !== null && e.status < 500)
    )
      throw e;
    const queued: PendingShelterUpdate = {
      localId: Crypto.randomUUID(),
      shelterId,
      changes,
      createdAt: new Date().toISOString(),
    };
    await savePendingShelterUpdate(queued);
    return { kind: 'pending-sync' };
  }
}
export async function discardPendingShelterUpdates(shelterId: string) {
  await removePendingShelterUpdatesForShelter(shelterId);
}
async function sync() {
  const state = await Network.getNetworkStateAsync();
  if (state.isConnected !== true || state.isInternetReachable === false)
    return 0;
  const items = await getPendingShelterUpdates();
  let count = 0;
  for (const item of items) {
    const current = await Network.getNetworkStateAsync();
    if (current.isConnected !== true || current.isInternetReachable === false)
      break;
    try {
      await updateShelter(item.shelterId, item.changes);
      await removePendingShelterUpdate(item.localId);
      count++;
    } catch (e) {
      // A deleted shelter makes its queued update obsolete; discard it and continue.
      if (e instanceof ApiRequestError && e.status === 404) {
        await removePendingShelterUpdate(item.localId);
        continue;
      }
      if (e instanceof ApiRequestError && e.status !== null && e.status < 500)
        console.error('A queued shelter update needs review.', e.message);
      break;
    }
  }
  return count;
}
export function syncPendingShelterUpdates() {
  if (!active)
    active = sync().finally(() => {
      active = null;
    });
  return active;
}

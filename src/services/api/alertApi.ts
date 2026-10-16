import { ApiRequestError, getApiUrl } from './apiClient.ts';

export type CitizenAlert = {
  _id?: string;
  alertId: string;
  severity: 'Advisory' | 'Watch' | 'Warning' | 'Evacuation Order';
  headline: string;
  instruction?: string;
  instructions?: string;
  issuedAt?: string;
  createdAt?: string;
};

export async function getCitizenAlertFeed(authToken: string, fetchImpl: typeof fetch = fetch): Promise<CitizenAlert[]> {
  if (!authToken) throw new ApiRequestError('Sign in to load your alert feed.', 401);
  let response: Response;
  try {
    response = await fetchImpl(getApiUrl('/api/alerts/feed'), {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch {
    throw new ApiRequestError('Unable to reach the alert service.');
  }
  if (!response.ok) {
    throw new ApiRequestError('The alert service could not load your feed.', response.status);
  }
  const payload = await response.json() as { alerts?: CitizenAlert[] };
  return Array.isArray(payload.alerts) ? payload.alerts : [];
}

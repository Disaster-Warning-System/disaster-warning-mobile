import { ApiRequestError, getApiUrl } from './apiClient.ts';
import type { AuthResponse, LoginInput, RegisterInput } from '../../types/user.ts';

async function request<T>(path: string, input: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(getApiUrl(path), {
      body: JSON.stringify(input),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  } catch {
    throw new ApiRequestError('Unable to reach the server. Check your connection and try again.');
  }

  let payload: { message?: string; data?: T };
  try {
    payload = (await response.json()) as { message?: string; data?: T };
  } catch {
    throw new ApiRequestError('The server returned an invalid response.', response.status);
  }

  if (!response.ok || !payload.data) {
    throw new ApiRequestError(
      payload.message ?? 'Something went wrong. Please try again.',
      response.status,
    );
  }

  return payload.data;
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', input);
}

export function register(input: RegisterInput): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/register', input);
}

export async function addPushToken(authToken: string, pushToken: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(getApiUrl('/api/auth/push-token'), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pushToken }),
    });
  } catch {
    throw new ApiRequestError('Unable to register push notifications with the server.');
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string };
    throw new ApiRequestError(payload.message ?? 'Unable to register push notifications.', response.status);
  }
}

export async function removePushToken(authToken: string, pushToken: string): Promise<void> {
  const response = await fetch(getApiUrl('/api/auth/push-token'), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pushToken }),
  });
  if (!response.ok) throw new ApiRequestError('Unable to unregister push notifications.', response.status);
}

export async function updateProfile(authToken: string, input: Pick<RegisterInput, 'district' | 'riverBasins' | 'phoneNumber'>): Promise<AuthResponse['user']> {
  const response = await fetch(getApiUrl('/api/auth/profile'), {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await response.json().catch(() => ({})) as { data?: { user?: AuthResponse['user'] }; message?: string };
  if (!response.ok || !payload.data?.user) throw new ApiRequestError(payload.message ?? 'Unable to update your area and contact settings.', response.status);
  return payload.data.user;
}

import { ApiRequestError, getApiUrl } from './apiClient';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types/user';

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
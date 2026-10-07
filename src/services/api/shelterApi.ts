import { ApiRequestError, getApiUrl } from '@/services/api/apiClient';
import type {
  CreateShelterInput,
  Shelter,
  UpdateShelterInput,
} from '@/types/shelter';
type Envelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(getApiUrl(path), {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiRequestError('Unable to reach the shelter service.');
  }
  let body: Envelope<T>;
  try {
    body = (await response.json()) as Envelope<T>;
  } catch {
    throw new ApiRequestError(
      'The shelter service returned an invalid response.',
      response.status,
    );
  }
  if (!response.ok || !body.success)
    throw new ApiRequestError(
      body.errors?.join(', ') || body.message || 'Shelter request failed.',
      response.status,
    );
  return body.data;
}
export const getShelters = () => request<Shelter[]>('/api/shelters');
export const getShelter = (id: string) =>
  request<Shelter>('/api/shelters/' + encodeURIComponent(id));
export const createShelter = (input: CreateShelterInput) =>
  request<Shelter>('/api/shelters', {
    method: 'POST',
    body: JSON.stringify(input),
  });
export const updateShelter = (id: string, input: UpdateShelterInput) =>
  request<Shelter>('/api/shelters/' + encodeURIComponent(id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
export const deleteShelter = (id: string) =>
  request<Shelter>('/api/shelters/' + encodeURIComponent(id), {
    method: 'DELETE',
  });

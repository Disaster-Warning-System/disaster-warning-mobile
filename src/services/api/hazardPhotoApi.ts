import { ApiRequestError, getApiUrl } from '@/services/api/apiClient';
import { Platform } from 'react-native';

function getPhotoName(uri: string): string {
  const extension = uri.split('?')[0].split('.').pop()?.toLowerCase();
  return extension && ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
    ? `hazard-photo.${extension}`
    : 'hazard-photo.jpg';
}

function getPhotoType(uri: string): string {
  const extension = getPhotoName(uri).split('.').pop();
  return extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
}

export async function uploadHazardPhoto(uri: string): Promise<string> {
  const body = new FormData();
  if (Platform.OS === 'web') {
    const fileResponse = await fetch(uri).catch(() => null);
    if (!fileResponse?.ok) {
      throw new ApiRequestError('Unable to read the selected photo.');
    }
    const blob = await fileResponse.blob();
    body.append('file', blob, getPhotoName(uri));
  } else {
    body.append('file', {
      uri,
      name: getPhotoName(uri),
      type: getPhotoType(uri),
    } as unknown as Blob);
  }

  const response = await fetch(getApiUrl('/api/uploads/hazard-photo'), {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body,
  }).catch(() => {
    throw new ApiRequestError('Unable to reach the photo upload service.');
  });

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new ApiRequestError('The photo upload service returned an invalid response.', response.status);
  }
  if (!response.ok || typeof responseBody !== 'object' || responseBody === null ||
      !('fileId' in responseBody) || typeof responseBody.fileId !== 'string') {
    throw new ApiRequestError(
      response.status === 413 ? 'Photo must be 5 MB or smaller.' : 'Unable to upload your photo.',
      response.status,
    );
  }
  return responseBody.fileId;
}

export async function deleteHazardPhoto(fileId: string): Promise<void> {
  await fetch(getApiUrl(`/api/uploads/hazard-photo/${encodeURIComponent(fileId)}`), {
    method: 'DELETE',
  }).catch(() => {});
}

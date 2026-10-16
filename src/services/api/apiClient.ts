export class ApiRequestError extends Error {
  public readonly status: number | null;

  constructor(
    message: string,
    status: number | null = null,
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export function getApiUrl(path: string): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!baseUrl) {
    throw new ApiRequestError('API base URL is not configured.');
  }

  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

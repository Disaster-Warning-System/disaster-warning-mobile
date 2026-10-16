import * as Location from 'expo-location';

import type { HazardReportLocation } from '@/types/hazardReport';

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

export type LocationErrorCode =
  | 'permission-denied'
  | 'services-disabled'
  | 'timeout'
  | 'unavailable';

export class LocationServiceError extends Error {
  constructor(public readonly code: LocationErrorCode) {
    super(code);
    this.name = 'LocationServiceError';
  }
}

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.granted;
  } catch {
    throw new LocationServiceError('unavailable');
  }
}

export async function getCurrentLocation(): Promise<CurrentLocation> {
  let servicesEnabled: boolean;
  try {
    servicesEnabled = await Location.hasServicesEnabledAsync();
  } catch {
    throw new LocationServiceError('unavailable');
  }

  if (!servicesEnabled) {
    throw new LocationServiceError('services-disabled');
  }

  if (!(await requestLocationPermission())) {
    throw new LocationServiceError('permission-denied');
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new LocationServiceError('timeout')), 15000);
      }),
    ]);

    if (
      !Number.isFinite(position.coords.latitude) ||
      !Number.isFinite(position.coords.longitude)
    ) {
      throw new LocationServiceError('unavailable');
    }

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      address: '',
    };
  } catch (error) {
    if (error instanceof LocationServiceError) {
      throw error;
    }
    throw new LocationServiceError('unavailable');
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export function toHazardReportLocation(location: CurrentLocation): HazardReportLocation {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    district: '',
  };
}
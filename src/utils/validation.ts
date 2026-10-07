import type { HazardType } from '@/constants/hazardTypes';
import type { HazardReportErrors, HazardReportLocation } from '@/types/hazardReport';

export function validateHazardReport(
  hazardType: HazardType | null,
  description: string,
  location: HazardReportLocation,
): HazardReportErrors {
  const errors: HazardReportErrors = {};

  if (!hazardType) {
    errors.hazardType = 'Please select a hazard type.';
  }

  if (!description.trim()) {
    errors.description = 'Please enter a description.';
  }

  const hasCoordinates =
    typeof location.latitude === 'number' &&
    Number.isFinite(location.latitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    typeof location.longitude === 'number' &&
    Number.isFinite(location.longitude) &&
    location.longitude >= -180 &&
    location.longitude <= 180;
  if (!hasCoordinates && !location.address.trim()) {
    errors.location = 'Please provide a location.';
  }

  return errors;
}
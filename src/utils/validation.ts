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

  const hasCoordinates = location.latitude !== null && location.longitude !== null;
  if (!hasCoordinates && !location.address.trim()) {
    errors.location = 'Please provide a location.';
  }

  return errors;
}
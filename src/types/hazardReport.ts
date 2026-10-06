import type { HazardType } from '@/constants/hazardTypes';

export type HazardReportLocation = {
  latitude: number | null;
  longitude: number | null;
  address: string;
};

export type HazardReportForm = {
  hazardType: HazardType | null;
  description: string;
  location: HazardReportLocation;
  photo: string | null;
};

export type HazardReportErrors = {
  hazardType?: string;
  description?: string;
  location?: string;
};
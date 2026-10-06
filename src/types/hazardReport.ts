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
  photoUri: string | null;
};

export type HazardReportErrors = {
  hazardType?: string;
  description?: string;
  location?: string;
};

export type ReportStatus =
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected'
  | 'Needs More Information';

export type CreateHazardReportRequest = {
  hazardType: HazardType;
  description: string;
  location: HazardReportLocation;
  photoUrl: string | null;
};

export type HazardReport = CreateHazardReportRequest & {
  id: string | null;
  status: ReportStatus;
};

export type LocalPendingHazardReport = Omit<HazardReportForm, 'hazardType'> & {
  hazardType: HazardType;
  localId: string;
  photoUrl: null;
  localStatus: 'Pending Sync';
  createdAt: string;
};

export type SubmissionResult =
  | { kind: 'submitted'; report: HazardReport }
  | { kind: 'pending-sync'; localId: string };
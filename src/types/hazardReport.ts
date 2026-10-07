import type { HazardType } from '@/constants/hazardTypes';

export type HazardReportLocation = {
  latitude: number | null;
  longitude: number | null;
  address: string;
  district: string;
};

export type HazardReportSeverity = 'Low' | 'Medium' | 'High';

export type HazardReportEvidence = {
  url: string;
  type: string;
};

export type HazardReportForm = {
  hazardType: HazardType | null;
  description: string;
  severity: HazardReportSeverity;
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
  severity: HazardReportSeverity;
  location: HazardReportLocation;
  photoFileId: string | null;
  evidence: HazardReportEvidence[];
};

export type HazardReport = CreateHazardReportRequest & {
  id: string | null;
  status: ReportStatus;
};

export type LocalPendingHazardReport = Omit<HazardReportForm, 'hazardType'> & {
  hazardType: HazardType;
  localId: string;
  localStatus: 'Pending Sync';
  createdAt: string;
};

export type SubmissionResult =
  | { kind: 'submitted'; report: HazardReport }
  | { kind: 'pending-sync'; localId: string };
import { ApiRequestError, getApiUrl } from '@/services/api/apiClient';
import type {
  CreateHazardReportRequest,
  HazardReport,
  ReportStatus,
} from '@/types/hazardReport';

const REPORT_STATUSES: ReportStatus[] = [
  'Pending Verification',
  'Verified',
  'Rejected',
  'Needs More Information',
];
const REPORT_STATUS_SET: ReadonlySet<string> = new Set(REPORT_STATUSES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isReportStatus(value: unknown): value is ReportStatus {
  return typeof value === 'string' && REPORT_STATUS_SET.has(value);
}

function parseReport(value: unknown, request: CreateHazardReportRequest): HazardReport {
  if (!isRecord(value)) {
    throw new ApiRequestError('The server returned an invalid report response.');
  }

  const idValue = value.id ?? value._id;
  const reportIdValue = value.reportId;
  const statusValue = value.status;

  if (typeof reportIdValue !== 'string' || !reportIdValue) {
    throw new ApiRequestError('The server returned a report without a Report ID.');
  }

  return {
    ...request,
    id: typeof idValue === 'string' ? idValue : null,
    reportId: reportIdValue,
    status: isReportStatus(statusValue) ? statusValue : 'Pending Verification',
  };
}

function parseFetchedReport(value: unknown): HazardReport {
  if (!isRecord(value)) {
    throw new ApiRequestError('The server returned an invalid report.');
  }

  const location = isRecord(value.location) ? value.location : {};
  const evidence = Array.isArray(value.evidence)
    ? value.evidence.filter(isRecord).map((item) => ({
        url: typeof item.url === 'string' ? item.url : '',
        type: typeof item.type === 'string' ? item.type : 'image',
      }))
    : [];
  const reportId = value.reportId;
  const hazardType = value.hazardType;
  const description = value.description;

  if (typeof reportId !== 'string' || typeof hazardType !== 'string' || typeof description !== 'string') {
    throw new ApiRequestError('The server returned an incomplete report.');
  }

  return {
    id: typeof value._id === 'string' ? value._id : null,
    reportId,
    hazardType: hazardType as HazardReport['hazardType'],
    description,
    severity: value.severity === 'Low' || value.severity === 'High' ? value.severity : 'Medium',
    location: {
      latitude: typeof location.latitude === 'number' ? location.latitude : null,
      longitude: typeof location.longitude === 'number' ? location.longitude : null,
      address: typeof location.address === 'string' ? location.address : '',
      district: typeof location.district === 'string' ? location.district : '',
    },
    photoFileId: typeof value.photoFileId === 'string' ? value.photoFileId : null,
    evidence,
    status: isReportStatus(value.status) ? value.status : 'Pending Verification',
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : undefined,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : undefined,
  };
}

export async function getHazardReports(): Promise<HazardReport[]> {
  const response = await fetch(getApiUrl('/api/hazard-reports'), {
    headers: { Accept: 'application/json' },
  }).catch(() => {
    throw new ApiRequestError('Unable to reach the report service.');
  });

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new ApiRequestError('The report service returned an invalid response.', response.status);
  }

  if (!response.ok || !isRecord(responseBody)) {
    const message = isRecord(responseBody) && typeof responseBody.message === 'string'
      ? responseBody.message
      : 'Unable to load your reports.';
    throw new ApiRequestError(message, response.status);
  }

  const data = Array.isArray(responseBody.data) ? responseBody.data : [];
  return data
    .map(parseFetchedReport)
    .sort((left, right) => (right.createdAt ?? '').localeCompare(left.createdAt ?? ''));
}

export async function createHazardReport(
  request: CreateHazardReportRequest,
  idempotencyKey: string,
): Promise<HazardReport> {
  const response = await fetch(getApiUrl('/api/hazard-reports'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      hazardType: request.hazardType,
      description: request.description.trim(),
      severity: request.severity,
      location: request.location,
      photoFileId: request.photoFileId,
      evidence: request.evidence,
    }),
  }).catch(() => {
    throw new ApiRequestError('Unable to reach the report service.');
  });

  if (!response.ok) {
    throw new ApiRequestError('Unable to submit your report.', response.status);
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new ApiRequestError('The server returned an invalid report response.', response.status);
  }

  if (!isRecord(responseBody)) {
    throw new ApiRequestError('The server returned an invalid report response.', response.status);
  }

  const data = isRecord(responseBody.data) ? responseBody.data : responseBody;
  const payload = isRecord(responseBody.report)
    ? responseBody.report
    : isRecord(data.report)
      ? data.report
      : data;

  return parseReport(payload, request);
}
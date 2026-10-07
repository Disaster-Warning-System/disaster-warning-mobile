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
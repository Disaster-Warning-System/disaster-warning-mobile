import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import * as Crypto from 'expo-crypto';
import * as Network from 'expo-network';

import type { HazardType } from '@/constants/hazardTypes';
import { ApiRequestError, getApiUrl } from '@/services/api/apiClient';
import { createHazardReport } from '@/services/api/hazardReportApi';
import { useAuth } from '@/context/AuthContext';
import { deleteHazardPhoto, uploadHazardPhoto } from '@/services/api/hazardPhotoApi';
import { savePendingReport } from '@/services/storage/offlineStorage';
import type {
  HazardReportErrors,
  HazardReportForm,
  HazardReportLocation,
  HazardReport,
  LocalPendingHazardReport,
  SubmissionResult,
} from '@/types/hazardReport';
import { validateHazardReport } from '@/utils/validation';

const EMPTY_FORM: HazardReportForm = {
  hazardType: null,
  description: '',
  severity: 'Medium',
  location: {
    latitude: null,
    longitude: null,
    address: '',
    district: '',
  },
  photoUri: null,
};

let submissionInProgress = false;

type HazardReportContextValue = {
  form: HazardReportForm;
  validationErrors: HazardReportErrors;
  isSubmitting: boolean;
  submitError: string;
  submitSuccess: SubmissionResult | null;
  setHazardType: (hazardType: HazardType | null) => void;
  setDescription: (description: string) => void;
  setSeverity: (severity: HazardReportForm['severity']) => void;
  setLocation: (location: HazardReportLocation) => void;
  setPhotoUri: (photoUri: string | null) => void;
  validateReport: () => boolean;
  submitReport: () => Promise<SubmissionResult | null>;
  markReportSyncing: (localId: string) => void;
  markReportSynced: (localId: string, report: HazardReport) => void;
  markReportSyncFailed: (localId: string) => void;
  resetReport: () => void;
};

const HazardReportContext = createContext<HazardReportContextValue | null>(null);

export function HazardReportProvider({ children }: PropsWithChildren) {
  const { token } = useAuth();
  const [form, setForm] = useState<HazardReportForm>(EMPTY_FORM);
  const [validationErrors, setValidationErrors] = useState<HazardReportErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<SubmissionResult | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const updateForm = useCallback((update: Partial<HazardReportForm>) => {
    setForm((current) => ({ ...current, ...update }));
    setSubmissionId(null);
    setSubmitError('');
    setSubmitSuccess(null);
  }, []);

  const setHazardType = useCallback(
    (hazardType: HazardType | null) => {
      updateForm({ hazardType });
      setValidationErrors((current) => ({ ...current, hazardType: undefined }));
    },
    [updateForm],
  );

  const setDescription = useCallback(
    (description: string) => {
      updateForm({ description });
      setValidationErrors((current) => ({ ...current, description: undefined }));
    },
    [updateForm],
  );

  const setSeverity = useCallback(
    (severity: HazardReportForm['severity']) => updateForm({ severity }),
    [updateForm],
  );

  const setLocation = useCallback(
    (location: HazardReportLocation) => {
      updateForm({ location });
      setValidationErrors((current) => ({ ...current, location: undefined }));
    },
    [updateForm],
  );

  const setPhotoUri = useCallback(
    (photoUri: string | null) => updateForm({ photoUri }),
    [updateForm],
  );

  const validateReport = useCallback(() => {
    const errors = validateHazardReport(form.hazardType, form.description, form.location);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const saveForSync = useCallback(
    async (localId: string): Promise<SubmissionResult> => {
      const hazardType = form.hazardType;
      if (!hazardType) {
        throw new Error('Cannot queue a report without a hazard type.');
      }

      const pendingReport: LocalPendingHazardReport = {
        ...form,
        hazardType,
        description: form.description.trim(),
        localId,
        localStatus: 'Pending Synchronization',
        syncStatus: 'Pending Synchronization',
        createdAt: new Date().toISOString(),
        idempotencyKey: localId,
      };
      await savePendingReport(pendingReport);
      const result: SubmissionResult = {
        kind: 'pending-sync',
        localId,
        status: 'Pending Synchronization',
      };
      setSubmitSuccess(result);
      return result;
    },
    [form],
  );

  const submitReport = useCallback(async () => {
    if (isSubmitting || submissionInProgress) {
      return null;
    }
    if (!validateReport() || !form.hazardType) {
      return null;
    }

    submissionInProgress = true;
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(null);
    const localId = submissionId ?? Crypto.randomUUID();
    setSubmissionId(localId);

    try {
      const network = await Network.getNetworkStateAsync();
      if (network.isConnected !== true || network.isInternetReachable === false) {
        return await saveForSync(localId);
      }

      try {
        let photoFileId: string | null = null;
        if (form.photoUri) {
          photoFileId = await uploadHazardPhoto(form.photoUri);
        }
        let report;
        try {
          report = await createHazardReport(
            {
              hazardType: form.hazardType,
              description: form.description.trim(),
              severity: form.severity,
              location: form.location,
              photoFileId,
              evidence: photoFileId
                ? [{ url: getApiUrl(`/api/uploads/hazard-photo/${encodeURIComponent(photoFileId)}`), type: 'image' }]
                : [],
            },
            localId,
            token,
          );
        } catch (error) {
          if (photoFileId) {
            await deleteHazardPhoto(photoFileId);
          }
          throw error;
        }
        const result: SubmissionResult = { kind: 'submitted', report };
        setSubmitSuccess(result);
        return result;
      } catch (error) {
        const currentNetwork = await Network.getNetworkStateAsync().catch((networkError: unknown) => {
          console.error('Could not check network after report submission failed.', networkError);
          return null;
        });

        if (
          currentNetwork &&
          (currentNetwork.isConnected !== true || currentNetwork.isInternetReachable === false)
        ) {
          return await saveForSync(localId);
        }

        setSubmitError(
          error instanceof ApiRequestError
            ? error.message
            : 'Unable to submit your report. Please try again.',
        );
        return null;
      }
    } catch (error) {
      console.error('Hazard report submission could not be completed.', error);
      setSubmitError(
        'We could not securely save or submit your report. Please try again.',
      );
      return null;
    } finally {
      submissionInProgress = false;
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, saveForSync, submissionId, token, validateReport]);

  const markReportSyncing = useCallback((localId: string) => {
    setSubmitSuccess((current) =>
      current?.kind === 'pending-sync' && current.localId === localId
        ? { ...current, status: 'Syncing' }
        : current,
    );
  }, []);

  const markReportSynced = useCallback((localId: string, report: HazardReport) => {
    setSubmitSuccess((current) =>
      current?.kind === 'pending-sync' && current.localId === localId
        ? { kind: 'submitted', report }
        : current,
    );
  }, []);

  const markReportSyncFailed = useCallback((localId: string) => {
    setSubmitSuccess((current) =>
      (current?.kind === 'pending-sync' || current?.kind === 'sync-failed') &&
      current.localId === localId
        ? { kind: 'sync-failed', localId, status: 'Sync Failed' }
        : current,
    );
  }, []);

  const resetReport = useCallback(() => {
    setForm(EMPTY_FORM);
    setSubmissionId(null);
    setValidationErrors({});
    setSubmitError('');
    setSubmitSuccess(null);
  }, []);

  const value = useMemo<HazardReportContextValue>(
    () => ({
      form,
      validationErrors,
      isSubmitting,
      submitError,
      submitSuccess,
      setHazardType,
      setDescription,
      setSeverity,
      setLocation,
      setPhotoUri,
      validateReport,
      submitReport,
      markReportSyncing,
      markReportSynced,
      markReportSyncFailed,
      resetReport,
    }),
    [
      form,
      validationErrors,
      isSubmitting,
      submitError,
      submitSuccess,
      setHazardType,
      setDescription,
      setLocation,
      setPhotoUri,
      validateReport,
      submitReport,
      markReportSyncing,
      markReportSynced,
      markReportSyncFailed,
      resetReport,
    ],
  );

  return createElement(HazardReportContext.Provider, { value }, children);
}

export function useHazardReport(): HazardReportContextValue {
  const context = useContext(HazardReportContext);
  if (!context) {
    throw new Error('useHazardReport must be used inside HazardReportProvider.');
  }
  return context;
}

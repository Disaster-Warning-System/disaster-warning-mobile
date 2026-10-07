import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ErrorMessage from '@/components/common/ErrorMessage';
import { AppColors, Radius, Typography } from '@/constants/theme';
import { useHazardReport } from '@/hooks/useHazardReport';

export default function HazardReportConfirmationScreen() {
  const router = useRouter();
  const { form, isSubmitting, submitError, submitSuccess, submitReport, resetReport } =
    useHazardReport();
  const [isCancelDialogVisible, setCancelDialogVisible] = useState(false);
  const hasCoordinates =
    form.location.latitude !== null && form.location.longitude !== null;
  const isOfflineSaved = submitSuccess?.kind === 'pending-sync';
  const isSyncFailed = submitSuccess?.kind === 'sync-failed';
  const isSyncing =
    submitSuccess?.kind === 'pending-sync' && submitSuccess.status === 'Syncing';

  const handleCancel = () => {
    setCancelDialogVisible(true);
  };

  const keepEditing = () => {
    setCancelDialogVisible(false);
  };

  const discardReport = () => {
    setCancelDialogVisible(false);
    resetReport();
    router.navigate('/(tabs)/home');
  };

  const goHome = () => {
    resetReport();
    router.navigate('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {submitSuccess ? (
          <Card style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons
                name={isOfflineSaved || isSyncFailed ? 'cloud-upload-outline' : 'checkmark'}
                size={38}
                color={isSyncFailed ? AppColors.accent : AppColors.success}
              />
            </View>
            <Text style={styles.successTitle}>
              {isSyncFailed
                ? 'Report Not Submitted'
                : isOfflineSaved
                  ? 'Report Saved'
                  : 'Report Submitted Successfully'}
            </Text>
            <Text style={styles.successDescription}>
              {isSyncFailed
                ? 'Unable to submit report. It will be retried when the connection is available.'
                : isOfflineSaved
                ? 'Report saved on this device and will be submitted when the connection is restored.'
                : 'Your report has been submitted and is pending verification.'}
            </Text>
            {!isOfflineSaved && !isSyncFailed ? (
              <View style={styles.reportIdBlock}>
                <Text style={styles.reportIdLabel}>Report ID</Text>
                <Text style={styles.reportId}>{submitSuccess.report.reportId}</Text>
              </View>
            ) : null}
            <View style={styles.statusBadge}>
              <Text style={styles.statusLabel}>STATUS</Text>
              <Text style={styles.statusValue}>
                {isSyncFailed
                  ? 'Sync Failed'
                  : isOfflineSaved
                  ? isSyncing
                    ? 'Syncing...'
                    : 'Pending Synchronization'
                  : submitSuccess.report.status}
              </Text>
            </View>
            <Button title="Back to Home" onPress={goHome} style={styles.primaryButton} />
          </Card>
        ) : (
          <>
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <Ionicons name="arrow-back" size={21} color={AppColors.text} onPress={handleCancel} />
                <View style={styles.headerCopy}><Text style={styles.title}>Review Report</Text><Text style={styles.description}>Check your details before submitting</Text></View>
              </View>
              <View style={styles.progressHeader}><Text style={styles.stepLabel}>Step 3 of 3</Text><Text style={styles.progressPercent}>100%</Text><View style={styles.progressTrack}><View style={styles.progressFill} /></View></View>
            </View>
            <Card style={styles.reviewCard}>
              <SummaryRow icon="warning-outline" label="Hazard type" value={form.hazardType ?? 'Not selected'} />
              <SummaryRow icon="alert-circle-outline" label="Severity" value={form.severity} />
              <SummaryRow icon="map-outline" label="District" value={form.location.district || 'Not provided'} />
              <SummaryRow
                icon="document-text-outline"
                label="Description"
                value={form.description.trim() || 'No description provided'}
              />
              <SummaryRow
                icon="location-outline"
                label={hasCoordinates ? 'GPS location' : 'Manual location'}
                value={
                  hasCoordinates
                    ? `${form.location.latitude}, ${form.location.longitude}`
                    : form.location.address.trim() || 'Location not selected'
                }
              />
              <View style={styles.photoSection}>
                <View style={styles.rowLabel}>
                  <Ionicons name="image-outline" size={18} color={AppColors.primary} />
                  <Text style={styles.label}>Photo evidence</Text>
                </View>
                {form.photoUri ? (
                  <Image
                    accessibilityLabel="Selected hazard report photo"
                    source={{ uri: form.photoUri }}
                    resizeMode="cover"
                    style={styles.photo}
                  />
                ) : (
                  <Text style={styles.mutedValue}>No photo selected</Text>
                )}
              </View>
            </Card>
            {submitError ? <ErrorMessage message={submitError} /> : null}
            <Button
              title={isSubmitting ? 'Submitting report...' : 'Submit Report  →'}
              onPress={() => void submitReport()}
              disabled={isSubmitting}
              loading={isSubmitting}
              style={styles.primaryButton}
            />
            <Button
              title="Back to Edit"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
            <Button
              title="Cancel Report"
              onPress={handleCancel}
              disabled={isSubmitting}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </>
        )}
      </ScrollView>
      <Modal
        visible={isCancelDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={keepEditing}>
        <View style={styles.modalOverlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Cancel report</Text>
            <Text style={styles.dialogMessage}>
              Unsaved report information will be discarded if you leave this report.
            </Text>
            <View style={styles.dialogActions}>
              <Button
                title="Keep Editing"
                onPress={keepEditing}
                style={styles.keepEditingButton}
                textStyle={styles.secondaryButtonText}
              />
              <Button
                title="Discard"
                onPress={discardReport}
                style={styles.discardButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.rowLabel}>
        <Ionicons name={icon} size={18} color={AppColors.primary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  content: { flexGrow: 1, padding: 20, paddingBottom: 36, paddingTop: 20 },
  header: { marginBottom: 20 },
  headerRow: { alignItems: 'center', flexDirection: 'row' },
  headerCopy: { marginLeft: 12 },
  title: { ...Typography.sectionTitle, color: AppColors.text },
  description: { ...Typography.secondary, color: AppColors.muted, fontSize: 13, marginTop: 3 },
  progressHeader: { marginTop: 24 },
  stepLabel: { ...Typography.label, color: AppColors.text, fontSize: 12 },
  progressPercent: { ...Typography.secondary, color: AppColors.muted, fontSize: 13, position: 'absolute', right: 0, top: 0 },
  progressTrack: { backgroundColor: AppColors.border, borderRadius: 4, height: 4, marginTop: 9 },
  progressFill: { backgroundColor: AppColors.primary, borderRadius: 4, height: 4, width: '100%' },
  reviewCard: { padding: 20 },
  summaryRow: { borderBottomColor: AppColors.border, borderBottomWidth: 1, paddingBottom: 16, paddingTop: 2 },
  rowLabel: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  label: { ...Typography.label, color: AppColors.muted, textTransform: 'none' },
  value: { ...Typography.body, color: AppColors.text, marginTop: 8 },
  mutedValue: { ...Typography.secondary, color: AppColors.muted, marginTop: 8 },
  photoSection: { paddingTop: 16 },
  photo: { borderRadius: Radius.small, height: 190, marginTop: 10, width: '100%' },
  primaryButton: { marginTop: 20, width: '100%' },
  secondaryButton: { backgroundColor: AppColors.surface, borderColor: AppColors.border, borderWidth: 1, marginTop: 12, width: '100%' },
  secondaryButtonText: { color: AppColors.text },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 31, 45, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.medium,
    maxWidth: 420,
    padding: 22,
    width: '100%',
  },
  dialogTitle: { ...Typography.sectionTitle, color: AppColors.text },
  dialogMessage: { ...Typography.body, color: AppColors.muted, lineHeight: 21, marginTop: 10 },
  dialogActions: { gap: 10, marginTop: 20 },
  keepEditingButton: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderWidth: 1,
  },
  discardButton: { backgroundColor: '#B42318' },
  successCard: { alignItems: 'center', marginTop: 36, paddingHorizontal: 22, paddingVertical: 30 },
  successIcon: { alignItems: 'center', backgroundColor: '#E5F4ED', borderRadius: 38, height: 76, justifyContent: 'center', width: 76 },
  successTitle: { ...Typography.title, color: AppColors.text, marginTop: 18 },
  successDescription: { ...Typography.body, color: AppColors.muted, marginTop: 10, textAlign: 'center' },
  statusBadge: { alignItems: 'center', backgroundColor: AppColors.primarySoft, borderRadius: Radius.small, marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, width: '100%' },
  statusLabel: { ...Typography.label, color: AppColors.primaryDark, fontSize: 12, letterSpacing: 0.4 },
  statusValue: { ...Typography.label, color: AppColors.primaryDark, fontSize: 13, marginTop: 4 },
  reportIdBlock: {
    alignItems: 'center',
    backgroundColor: AppColors.primarySoft,
    borderRadius: Radius.small,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  reportIdLabel: { ...Typography.label, color: AppColors.muted, fontSize: 12 },
  reportId: { ...Typography.sectionTitle, color: AppColors.primaryDark, fontSize: 18, marginTop: 5 },
});

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useHazardReport } from '@/hooks/useHazardReport';

export default function HazardReportConfirmationScreen() {
  const router = useRouter();
  const {
    form,
    isSubmitting,
    submitError,
    submitSuccess,
    submitReport,
    resetReport,
  } = useHazardReport();
  const hasCoordinates =
    form.location.latitude !== null && form.location.longitude !== null;
  const isOfflineSaved = submitSuccess?.kind === 'pending-sync';

  const goHome = () => {
    resetReport();
    router.navigate('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {submitSuccess ? (
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>
              {isOfflineSaved ? 'Report Saved' : 'Report Submitted'}
            </Text>
            {isOfflineSaved ? (
              <>
                <Text style={styles.successDescription}>No internet connection.</Text>
                <Text style={styles.successDescription}>
                  Your report has been saved and will be submitted automatically when the
                  connection is restored.
                </Text>
                <Text style={styles.status}>Status: Pending Sync</Text>
              </>
            ) : (
              <>
                <Text style={styles.successDescription}>
                  Your hazard report has been submitted successfully.
                </Text>
                <Text style={styles.status}>Status: {submitSuccess.report.status}</Text>
                {submitSuccess.report.id ? (
                  <Text style={styles.reportId}>Report ID: {submitSuccess.report.id}</Text>
                ) : null}
              </>
            )}
            <Button title="Back to Home" onPress={goHome} style={styles.primaryButton} />
          </View>
        ) : (
          <>
            <Text style={styles.title}>Review Report</Text>
            <Text style={styles.description}>
              Check the information before submitting your report.
            </Text>

            <View style={styles.reviewCard}>
              <Text style={styles.label}>Hazard Type</Text>
              <Text style={styles.value}>{form.hazardType ?? 'Not selected'}</Text>

              <Text style={styles.label}>Description</Text>
              <Text style={styles.value}>{form.description.trim()}</Text>

              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>
                {hasCoordinates
                  ? `${form.location.latitude}, ${form.location.longitude}`
                  : form.location.address.trim()}
              </Text>

              <Text style={styles.label}>Photo</Text>
              {form.photoUri ? (
                <Image
                  accessibilityLabel="Selected hazard report photo"
                  source={{ uri: form.photoUri }}
                  resizeMode="cover"
                  style={styles.photo}
                />
              ) : (
                <Text style={styles.value}>No photo selected</Text>
              )}
            </View>

            {submitError ? <ErrorMessage message={submitError} /> : null}
            <Button
              title={isSubmitting ? 'Submitting report...' : 'Submit Report'}
              onPress={() => {
                void submitReport();
              }}
              disabled={isSubmitting}
              loading={isSubmitting}
              style={styles.primaryButton}
            />
            <Button
              title="Edit Report"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F8F7',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#17332D',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
  },
  description: {
    color: '#52645F',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE6E2',
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 24,
    padding: 18,
  },
  label: {
    color: '#52645F',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
  },
  value: {
    color: '#203B33',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  photo: {
    borderRadius: 8,
    height: 190,
    marginTop: 8,
    width: '100%',
  },
  primaryButton: {
    marginTop: 16,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C9D5D0',
    borderWidth: 1,
    marginTop: 12,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#334941',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE6E2',
    borderRadius: 14,
    borderWidth: 1,
    padding: 22,
  },
  successTitle: {
    color: '#176B5B',
    fontSize: 26,
    fontWeight: '700',
  },
  successDescription: {
    color: '#52645F',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  status: {
    color: '#203B33',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 18,
  },
  reportId: {
    color: '#65756F',
    fontSize: 13,
    marginTop: 6,
  },
});
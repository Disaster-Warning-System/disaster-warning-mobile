import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import Button from '@/components/common/Button';
import DescriptionInput from '@/components/hazard-report/DescriptionInput';
import HazardTypeSelector from '@/components/hazard-report/HazardTypeSelector';
import LocationPicker from '@/components/hazard-report/LocationPicker';
import PhotoPicker from '@/components/hazard-report/PhotoPicker';
import { useHazardReport } from '@/hooks/useHazardReport';
import { AppColors, Typography } from '@/constants/theme';

export default function ReportScreen() {
  const router = useRouter();
  const {
    form,
    validationErrors,
    setHazardType,
    setDescription,
    setSeverity,
    setLocation,
    setPhotoUri,
    validateReport,
    resetReport,
  } = useHazardReport();
  const [isCancelDialogVisible, setCancelDialogVisible] = useState(false);

  const handleReview = () => {
    if (validateReport()) {
      router.push('/hazard-report/confirmation');
    }
  };

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={21} color={AppColors.text} onPress={handleCancel} />
          <View style={styles.headerCopy}><Text style={styles.title}>Report a Hazard</Text><Text style={styles.subtitle}>Tell us what happened</Text></View>
        </View>
        <View style={styles.progressHeader}>
          <Text style={styles.stepLabel}>Step 1 of 3</Text><Text style={styles.progressPercent}>33%</Text>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hazard Details</Text>
          <Text style={styles.helper}>Provide clear information about the hazard.</Text>
          <Text style={styles.fieldLabel}>Hazard Type</Text>
          <HazardTypeSelector
            value={form.hazardType}
            onChange={setHazardType}
            error={validationErrors.hazardType}
          />
          <Text style={styles.fieldLabel}>Severity</Text>
          <View style={styles.severityOptions}>
            {(['Low', 'Medium', 'High'] as const).map((severity) => (
              <Pressable
                key={severity}
                accessibilityRole="radio"
                accessibilityState={{ selected: form.severity === severity }}
                onPress={() => setSeverity(severity)}
                style={[styles.severityOption, form.severity === severity && styles.selectedSeverityOption]}>
                <Text style={[styles.severityText, form.severity === severity && styles.selectedSeverityText]}>
                  {severity}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Description</Text>
          <DescriptionInput
            value={form.description}
            onChangeText={setDescription}
            error={validationErrors.description}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Evidence</Text>
          <Text style={styles.helper}>Add location and supporting evidence.</Text>
          <Text style={styles.fieldLabel}>Your Location</Text>
          <LocationPicker
            location={form.location}
            onLocationChange={setLocation}
            error={validationErrors.location}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Photo Evidence <Text style={styles.optional}>(optional)</Text></Text>
          <PhotoPicker photoUri={form.photoUri} onPhotoChange={setPhotoUri} />
        </View>

        <View style={styles.actions}>
          <Button title="Continue  →" onPress={handleReview} style={styles.submitButton} />
          <Button
            title="Cancel"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
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
                textStyle={styles.keepEditingButtonText}
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

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F7FA',
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: '#16283D',
    fontSize: 15,
    fontWeight: '800',
  },
  optional: {
    color: '#62727D',
    fontSize: 13,
    fontWeight: '500',
  },
  headerRow: { alignItems: 'center', flexDirection: 'row' },
  headerCopy: { marginLeft: 12 },
  title: { ...Typography.sectionTitle, color: '#16283D' },
  subtitle: { ...Typography.secondary, color: '#6B7C8F', fontSize: 13, marginTop: 3 },
  progressHeader: { marginTop: 24 },
  stepLabel: { ...Typography.label, color: '#16283D', fontSize: 12 },
  progressPercent: { ...Typography.secondary, color: '#6B7C8F', fontSize: 13, position: 'absolute', right: 0, top: 0 },
  progressTrack: { backgroundColor: '#DDE5EE', borderRadius: 4, height: 4, marginTop: 9 },
  progressFill: { backgroundColor: '#1877B9', borderRadius: 4, height: 4, width: '33%' },
  helper: { ...Typography.secondary, color: '#6B7C8F', fontSize: 14, marginTop: 4 },
  fieldLabel: { ...Typography.label, color: '#16283D', fontSize: 13, marginTop: 18 },
  severityOptions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  severityOption: {
    alignItems: 'center',
    borderColor: '#C9D5D0',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
  },
  selectedSeverityOption: { backgroundColor: '#1877B9', borderColor: '#1877B9' },
  severityText: { color: '#334941', fontSize: 13, fontWeight: '600' },
  selectedSeverityText: { color: '#FFFFFF' },
  actions: {
    marginTop: 28,
  },
  submitButton: {
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C9D5D0',
    borderWidth: 1,
    marginTop: 12,
    width: '100%',
  },
  cancelButtonText: {
    color: '#334941',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 31, 45, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxWidth: 420,
    padding: 22,
    width: '100%',
  },
  dialogTitle: {
    color: '#16283D',
    fontSize: 18,
    fontWeight: '800',
  },
  dialogMessage: {
    color: '#6B7C8F',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  dialogActions: {
    gap: 10,
    marginTop: 20,
  },
  keepEditingButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C9D5D0',
    borderWidth: 1,
  },
  keepEditingButtonText: {
    color: '#334941',
  },
  discardButton: {
    backgroundColor: '#B42318',
  },
});

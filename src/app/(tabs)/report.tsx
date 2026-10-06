import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import DescriptionInput from '@/components/hazard-report/DescriptionInput';
import HazardTypeSelector from '@/components/hazard-report/HazardTypeSelector';
import LocationPicker from '@/components/hazard-report/LocationPicker';
import PhotoPicker from '@/components/hazard-report/PhotoPicker';
import { useHazardReport } from '@/hooks/useHazardReport';

export default function ReportScreen() {
  const router = useRouter();
  const {
    form,
    validationErrors,
    setHazardType,
    setDescription,
    setLocation,
    setPhotoUri,
    validateReport,
    resetReport,
  } = useHazardReport();

  const handleReview = () => {
    if (validateReport()) {
      router.push('/hazard-report/confirmation');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel report',
      'Are you sure you want to cancel? Your unsaved report will be discarded.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            resetReport();
            router.navigate('/(tabs)/home');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Report a Hazard</Text>
        <Text style={styles.description}>
          Provide information about the hazard you observed.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hazard Type</Text>
          <HazardTypeSelector
            value={form.hazardType}
            onChange={setHazardType}
            error={validationErrors.hazardType}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <DescriptionInput
            value={form.description}
            onChangeText={setDescription}
            error={validationErrors.description}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <LocationPicker
            location={form.location}
            onLocationChange={setLocation}
            error={validationErrors.location}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo (Optional)</Text>
          <PhotoPicker photoUri={form.photoUri} onPhotoChange={setPhotoUri} />
        </View>

        <View style={styles.actions}>
          <Button title="Review Report" onPress={handleReview} style={styles.submitButton} />
          <Button
            title="Cancel"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
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
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#263D37',
    fontSize: 17,
    fontWeight: '700',
  },
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
});

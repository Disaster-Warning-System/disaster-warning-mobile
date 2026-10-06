import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import ScreenHeader from '@/components/common/ScreenHeader';
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
        <ScreenHeader
          title="Report a Hazard"
          subtitle="Help authorities respond quickly by reporting hazards in your area."
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What happened?</Text>
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
          <Text style={styles.sectionTitle}>Photo evidence <Text style={styles.optional}>(optional)</Text></Text>
          <PhotoPicker photoUri={form.photoUri} onPhotoChange={setPhotoUri} />
        </View>

        <View style={styles.actions}>
          <Button title="Continue to Review" onPress={handleReview} style={styles.submitButton} />
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
    backgroundColor: '#F5F8FA',
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: '#172B3A',
    fontSize: 17,
    fontWeight: '800',
  },
  optional: {
    color: '#62727D',
    fontSize: 13,
    fontWeight: '500',
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

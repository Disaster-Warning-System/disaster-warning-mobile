import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import DescriptionInput from '@/components/hazard-report/DescriptionInput';
import HazardTypeSelector from '@/components/hazard-report/HazardTypeSelector';
import LocationPicker from '@/components/hazard-report/LocationPicker';
import PhotoPicker from '@/components/hazard-report/PhotoPicker';
import type { HazardType } from '@/constants/hazardTypes';
import type {
  HazardReportErrors,
  HazardReportForm,
  HazardReportLocation,
} from '@/types/hazardReport';
import { validateHazardReport } from '@/utils/validation';

const EMPTY_LOCATION: HazardReportLocation = {
  latitude: null,
  longitude: null,
  address: '',
};

const EMPTY_FORM: HazardReportForm = {
  hazardType: null,
  description: '',
  location: EMPTY_LOCATION,
  photo: null,
};

export default function ReportScreen() {
  const router = useRouter();
  const [hazardType, setHazardType] = useState<HazardType | null>(EMPTY_FORM.hazardType);
  const [description, setDescription] = useState(EMPTY_FORM.description);
  const [location, setLocation] = useState<HazardReportLocation>(EMPTY_LOCATION);
  const [photo, setPhoto] = useState<string | null>(EMPTY_FORM.photo);
  const [errors, setErrors] = useState<HazardReportErrors>({});
  const [confirmation, setConfirmation] = useState('');

  const clearFieldError = (field: keyof HazardReportErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setConfirmation('');
  };

  const handleSubmit = () => {
    const validationErrors = validateHazardReport(hazardType, description, location);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setConfirmation('Form is valid. Ready to submit.');
    } else {
      setConfirmation('');
    }
  };

  const clearForm = () => {
    setHazardType(EMPTY_FORM.hazardType);
    setDescription(EMPTY_FORM.description);
    setLocation({ ...EMPTY_LOCATION });
    setPhoto(EMPTY_FORM.photo);
    setErrors({});
    setConfirmation('');
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
            clearForm();
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
            value={hazardType}
            onChange={(value) => {
              setHazardType(value);
              clearFieldError('hazardType');
            }}
            error={errors.hazardType}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <DescriptionInput
            value={description}
            onChangeText={(value) => {
              setDescription(value);
              clearFieldError('description');
            }}
            error={errors.description}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <LocationPicker location={location} error={errors.location} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo (Optional)</Text>
          <PhotoPicker photo={photo} />
        </View>

        <View style={styles.actions}>
          {confirmation ? <Text style={styles.confirmation}>{confirmation}</Text> : null}
          <Button title="Submit Report" onPress={handleSubmit} style={styles.submitButton} />
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
  confirmation: {
    color: '#176B5B',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
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

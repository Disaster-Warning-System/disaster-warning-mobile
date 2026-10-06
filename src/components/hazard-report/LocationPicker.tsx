import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import { AppColors, Radius } from '@/constants/theme';
import { getCurrentLocation, LocationServiceError } from '@/services/location/locationService';
import type { HazardReportLocation } from '@/types/hazardReport';

type LocationPickerProps = {
  location: HazardReportLocation;
  onLocationChange: (location: HazardReportLocation) => void;
  error?: string;
};

export default function LocationPicker({
  location,
  onLocationChange,
  error,
}: LocationPickerProps) {
  const [manualMode, setManualMode] = useState(Boolean(location.address));
  const [isLoading, setIsLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const hasCoordinates = location.latitude !== null && location.longitude !== null;
  const hasLocation = hasCoordinates || Boolean(location.address.trim());

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    setLocationMessage('');
    setManualMode(false);
    try {
      const current = await getCurrentLocation();
      onLocationChange(current);
      setLocationMessage('');
    } catch (error) {
      setManualMode(true);
      const message =
        error instanceof LocationServiceError && error.code === 'permission-denied'
          ? 'Location permission was denied. You can enter your location manually.'
          : 'Unable to get your current location. You can enter your location manually.';
      setLocationMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLocation = () => {
    setManualMode(true);
    setLocationMessage('');
    onLocationChange({ latitude: null, longitude: null, address: location.address });
  };

  return (
    <View>
      <View style={styles.locationCard}>
        {hasCoordinates ? (
          <>
            <Text style={styles.locationSuccess}>Location captured</Text>
            <Text style={styles.locationText}>Latitude: {location.latitude?.toFixed(6)}</Text>
            <Text style={styles.locationText}>Longitude: {location.longitude?.toFixed(6)}</Text>
          </>
        ) : (
          <Text style={styles.locationText}>
            {hasLocation ? location.address : 'Location unavailable'}
          </Text>
        )}
      </View>
      {error ? <ErrorMessage message={error} /> : null}
      {locationMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          style={
            locationMessage.startsWith('Current location')
              ? styles.locationSuccess
              : styles.locationError
          }>
          {locationMessage}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Button
          title="Use Current Location"
          onPress={handleGetCurrentLocation}
          loading={isLoading}
          disabled={isLoading}
          style={styles.actionButton}
        />
        <Button
          title="Enter Location Manually"
          onPress={handleManualLocation}
          disabled={isLoading}
          style={[styles.actionButton, styles.secondaryActionButton]}
          textStyle={styles.secondaryActionText}
        />
      </View>
      {manualMode ? (
        <TextInput
          accessibilityLabel="Manual location"
          onChangeText={(address) => {
            setLocationMessage('');
            onLocationChange({ latitude: null, longitude: null, address });
          }}
          placeholder="Enter your location"
          placeholderTextColor="#87958F"
          value={location.address}
          style={styles.input}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderRadius: Radius.small,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  locationText: {
    color: AppColors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  locationSuccess: {
    color: AppColors.success,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  locationError: {
    color: AppColors.danger,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  actions: {
    marginTop: 8,
  },
  actionButton: {
    marginTop: 8,
    minHeight: 46,
  },
  secondaryActionText: {
    color: AppColors.text,
  },
  secondaryActionButton: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderWidth: 1,
  },
  input: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderRadius: Radius.small,
    borderWidth: 1,
    color: AppColors.text,
    fontSize: 15,
    marginTop: 10,
    minHeight: 50,
    paddingHorizontal: 14,
  },
});
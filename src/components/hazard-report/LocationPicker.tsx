import { StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { HazardReportLocation } from '@/types/hazardReport';

type LocationPickerProps = {
  location: HazardReportLocation;
  error?: string;
};

export default function LocationPicker({ location, error }: LocationPickerProps) {
  const hasLocation =
    (location.latitude !== null && location.longitude !== null) || Boolean(location.address.trim());

  return (
    <View>
      <View style={styles.locationCard}>
        <Text style={styles.locationText}>
          {hasLocation ? location.address || 'Coordinates selected' : 'Location not selected'}
        </Text>
      </View>
      {error ? <ErrorMessage message={error} /> : null}
      <View style={styles.actions}>
        <Button
          title="Use Current Location"
          onPress={() => {}}
          disabled
          style={styles.actionButton}
          textStyle={styles.actionText}
        />
        <Button
          title="Enter Location Manually"
          onPress={() => {}}
          disabled
          style={styles.actionButton}
          textStyle={styles.actionText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE6E2',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  locationText: {
    color: '#65756F',
    fontSize: 14,
  },
  actions: {
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#E8EEEB',
    marginTop: 8,
    minHeight: 46,
  },
  actionText: {
    color: '#52645F',
    fontSize: 14,
  },
});
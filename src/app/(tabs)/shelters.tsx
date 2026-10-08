import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import EmptyState from '@/components/common/EmptyState';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import ShelterCard from '@/components/shelters/ShelterCard';
import { LocationServiceError, getCurrentLocation } from '@/services/location/locationService';
import type { CurrentLocation } from '@/services/location/locationService';
import type { Shelter } from '@/types/shelter';
import { distanceBetweenCoordinatesKm } from '@/utils/geo';
import { useShelters } from '@/hooks/useShelters';
export default function SheltersScreen() {
  const router = useRouter();
  const { shelters, loading, error, refresh } = useShelters();
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
  const [search, setSearch] = useState('');
  const [nearbyLocation, setNearbyLocation] = useState<CurrentLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const shown = useMemo(
    (): { shelter: Shelter; distanceKm?: number }[] => {
      const matchingShelters = shelters.filter((shelter) =>
        [
          shelter.name,
          shelter.location,
          shelter.operationalStatus,
          shelter.availabilityStatus,
        ]
          .join(' ')
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      );

      if (!nearbyLocation) {
        return matchingShelters.map((shelter) => ({ shelter }));
      }

      return matchingShelters
        .filter((shelter) => shelter.locationPoint?.coordinates.length === 2)
        .map((shelter) => {
          const [longitude, latitude] = shelter.locationPoint!.coordinates;
          return {
            shelter,
            distanceKm: distanceBetweenCoordinatesKm(
              nearbyLocation.latitude,
              nearbyLocation.longitude,
              latitude,
              longitude,
            ),
          };
        })
        .filter(
          ({ shelter }) =>
            !onlyAvailable ||
            (shelter.operationalStatus === 'Open' && shelter.availableSpaces > 0),
        )
        .sort((first, second) => first.distanceKm! - second.distanceKm!);
    },
    [shelters, search, nearbyLocation, onlyAvailable],
  );

  const findNearbyShelters = async () => {
    setLocationLoading(true);
    setLocationError('');
    try {
      setNearbyLocation(await getCurrentLocation());
    } catch (reason) {
      if (reason instanceof LocationServiceError) {
        const messages = {
          'permission-denied': 'Location access is off. Allow it in Settings to find nearby shelters.',
          'services-disabled': 'Turn on device location services to find nearby shelters.',
          timeout: 'Could not get your location in time. Move to an open area and try again.',
          unavailable: 'Your current location is unavailable. Try again or search by name or location.',
        };
        setLocationError(messages[reason.code]);
      } else {
        setLocationError('Could not get your location. Try again or search by name or location.');
      }
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        contentContainerStyle={styles.content}
        data={shown}
        keyExtractor={(item) => item.shelter.id}
        renderItem={({ item }) => (
          <ShelterCard
            shelter={item.shelter}
            distanceKm={item.distanceKm}
            onPress={() =>
              router.push({
                pathname: '/shelters/[id]',
                params: { id: item.shelter.id },
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void refresh()}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>DISTRICT RESPONSE</Text>
            <Text style={styles.title}>Shelter dashboard</Text>
            <Text style={styles.subtitle}>
              Review capacity and coordinate availability.
            </Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search shelters"
              style={styles.search}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: locationLoading }}
              disabled={locationLoading}
              onPress={() => void findNearbyShelters()}
              style={[styles.nearbyButton, locationLoading && styles.disabledButton]}
            >
              <Text style={styles.nearbyButtonText}>
                {locationLoading
                  ? 'Finding your location...'
                  : nearbyLocation
                    ? 'Refresh nearby shelters'
                    : 'Find shelters near me'}
              </Text>
            </Pressable>
            {nearbyLocation ? (
              <View style={styles.nearbyTools}>
                <Text style={styles.nearbyNote}>Straight-line distance · nearest first</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: onlyAvailable }}
                  onPress={() => setOnlyAvailable((current) => !current)}
                  style={[styles.filterButton, onlyAvailable && styles.activeFilterButton]}
                >
                  <Text style={[styles.filterText, onlyAvailable && styles.activeFilterText]}>
                    {onlyAvailable ? 'Showing with spaces' : 'Only with spaces'}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setNearbyLocation(null);
                    setOnlyAvailable(false);
                  }}
                  style={styles.clearNearbyButton}
                >
                  <Text style={styles.clearNearbyText}>Show all</Text>
                </Pressable>
              </View>
            ) : null}
            {locationError ? <ErrorMessage message={locationError} /> : null}
            {error ? <ErrorMessage message={error} /> : null}
            {loading && shelters.length === 0 ? <Loading /> : null}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <EmptyState
              icon="business-outline"
              title={nearbyLocation ? 'No nearby shelters found' : 'No shelters found'}
              description={
                nearbyLocation && onlyAvailable
                  ? 'No nearby open shelters currently have available spaces. Turn off the filter to see all nearby shelters.'
                  : nearbyLocation
                    ? 'No shelters with a saved map location match your search.'
                    : search
                  ? 'Try another name or location.'
                  : 'Registered shelters will appear here.'
              }
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { backgroundColor: '#f4f7f9', flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  header: { gap: 12, marginBottom: 18 },
  eyebrow: {
    color: '#687c88',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  title: { color: '#183447', fontSize: 25, fontWeight: '700' },
  subtitle: { color: '#71818b', fontSize: 14, lineHeight: 20 },
  search: {
    backgroundColor: '#fff',
    borderColor: '#dce6ea',
    borderRadius: 10,
    borderWidth: 1,
    height: 46,
    paddingHorizontal: 14,
  },
  nearbyButton: {
    alignItems: 'center',
    backgroundColor: '#1877B9',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  disabledButton: { opacity: 0.65 },
  nearbyButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  nearbyTools: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nearbyNote: { color: '#6B7C8F', flexGrow: 1, fontSize: 12 },
  filterButton: {
    borderColor: '#DDE5EE',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeFilterButton: { backgroundColor: '#E8F2FC', borderColor: '#1877B9' },
  filterText: { color: '#1877B9', fontSize: 12, fontWeight: '600' },
  activeFilterText: { color: '#075B94' },
  clearNearbyButton: { paddingHorizontal: 8, paddingVertical: 8 },
  clearNearbyText: { color: '#1877B9', fontSize: 12, fontWeight: '700' },
});

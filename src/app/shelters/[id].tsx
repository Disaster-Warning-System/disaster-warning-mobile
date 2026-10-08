import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import ShelterStatusBadge from '@/components/shelters/ShelterStatusBadge';
import { getCurrentLocation, LocationServiceError } from '@/services/location/locationService';
import { getShelter } from '@/services/api/shelterApi';
import type { Shelter } from '@/types/shelter';

export default function ShelterDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [error, setError] = useState('');
  const [mapError, setMapError] = useState('');
  const [directionsError, setDirectionsError] = useState('');
  const [gettingDirections, setGettingDirections] = useState(false);

  async function openDirections() {
    if (!shelter?.locationPoint) return;

    setDirectionsError('');
    setGettingDirections(true);
    try {
      const currentLocation = await getCurrentLocation();
      const [longitude, latitude] = shelter.locationPoint.coordinates;
      const origin = encodeURIComponent(
        `${currentLocation.latitude},${currentLocation.longitude}`,
      );
      const destination = encodeURIComponent(`${latitude},${longitude}`);
      const directionsUrl =
        `https://www.google.com/maps/dir/?api=1&origin=${origin}` +
        `&destination=${destination}`;

      // Google Maps provides turn-by-turn road routing and opens its app or web fallback.
      await Linking.openURL(directionsUrl);
    } catch (reason) {
      setDirectionsError(getDirectionsError(reason));
    } finally {
      setGettingDirections(false);
    }
  }

  useEffect(() => {
    let active = true;
    if (typeof id !== 'string') return;
    getShelter(id)
      .then((value) => {
        if (active) setShelter(value);
      })
      .catch((reason) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'Could not load shelter.');
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorMessage message={error} />
      </SafeAreaView>
    );
  }
  if (!shelter) {
    return (
      <SafeAreaView style={styles.safe}>
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Link href="/(tabs)/shelters" style={styles.back}>
          ‹ Back to shelters
        </Link>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.title}>{shelter.name}</Text>
              <Text style={styles.sub}>{shelter.location}</Text>
            </View>
            <ShelterStatusBadge shelter={shelter} />
          </View>
          <Metric label="Capacity" value={shelter.capacity} />
          <Metric label="Occupancy" value={shelter.occupancy} />
          <Metric label="Available spaces" value={shelter.availableSpaces} />
          <Text style={styles.label}>Operational status</Text>
          <Text style={styles.value}>{shelter.operationalStatus}</Text>
          {shelter.remarks ? <Text style={styles.sub}>{shelter.remarks}</Text> : null}
          {shelter.locationPoint ? (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: gettingDirections }}
                disabled={gettingDirections}
                onPress={() => void openDirections()}
                style={[styles.directionButton, gettingDirections && styles.disabledButton]}
              >
                <Text style={styles.directionButtonText}>
                  {gettingDirections ? 'Getting your route...' : 'Get directions from my location'}
                </Text>
              </Pressable>
              {directionsError ? <ErrorMessage message={directionsError} /> : null}
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  const [longitude, latitude] = shelter.locationPoint!.coordinates;
                  const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
                  void Linking.openURL(url).catch(() =>
                    setMapError('Could not open OpenStreetMap. Copy the coordinates and try again.'),
                  );
                }}
                style={styles.mapButton}
              >
                <Text style={styles.mapButtonText}>View location on OpenStreetMap</Text>
              </Pressable>
              {mapError ? <ErrorMessage message={mapError} /> : null}
            </>
          ) : (
            <Text style={styles.sub}>A map location has not been added yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function getDirectionsError(reason: unknown): string {
  if (reason instanceof LocationServiceError) {
    switch (reason.code) {
      case 'permission-denied':
        return 'Location access is off. Allow it in Settings to get directions from your location.';
      case 'services-disabled':
        return 'Turn on device location services to get directions.';
      case 'timeout':
        return 'Could not get your location in time. Move to an open area and try again.';
      case 'unavailable':
        return 'Your current location is unavailable. Try again or open the shelter location on the map.';
    }
  }
  return 'Could not open directions. Check your internet connection and try again.';
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#f4f7f9', flex: 1 },
  content: { gap: 16, padding: 20 },
  back: { color: '#176fa8', fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderColor: '#dce6ea',
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  flex: { flex: 1 },
  title: { color: '#183447', fontSize: 22, fontWeight: '700' },
  sub: { color: '#71818b', marginTop: 5 },
  metric: {
    borderBottomColor: '#e8eef1',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  label: { color: '#71818b', fontSize: 13 },
  value: { color: '#183447', fontSize: 15, fontWeight: '700' },
  mapButton: { alignItems: 'center', backgroundColor: '#1877b9', borderRadius: 10, padding: 13 },
  mapButtonText: { color: '#fff', fontWeight: '700' },
  directionButton: {
    alignItems: 'center',
    backgroundColor: '#1877B9',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  disabledButton: { opacity: 0.65 },
  directionButtonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});


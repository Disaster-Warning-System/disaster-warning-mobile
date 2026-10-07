import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import ShelterStatusBadge from '@/components/shelters/ShelterStatusBadge';
import { deleteShelter, getShelter } from '@/services/api/shelterApi';
import type { Shelter } from '@/types/shelter';
import { discardPendingShelterUpdates } from '@/services/sync/shelterSyncService';
export default function ShelterDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    let active = true;
    if (typeof id !== 'string') return;
    getShelter(id)
      .then((v) => {
        if (active) setShelter(v);
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : 'Could not load shelter.');
      });
    return () => {
      active = false;
    };
  }, [id]);
  async function remove() {
    if (typeof id !== 'string') return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteShelter(id);
      // Drop offline edits for this record so they cannot be retried after deletion.

      await discardPendingShelterUpdates(id).catch((e) =>
        console.error('Could not clear queued updates for deleted shelter.', e),
      );
      router.replace('/(tabs)/shelters');
    } catch (e) {
      setDeleteError(
        e instanceof Error ? e.message : 'Could not delete shelter.',
      );
    } finally {
      setDeleting(false);
    }
  }
  function confirmDelete() {
    if (!shelter) return;
    Alert.alert('Delete shelter?', `Permanently delete ${shelter.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void remove() },
    ]);
  }
  if (error)
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorMessage message={error} />
      </SafeAreaView>
    );
  if (!shelter)
    return (
      <SafeAreaView style={styles.safe}>
        <Loading />
      </SafeAreaView>
    );
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
          {shelter.remarks ? (
            <Text style={styles.sub}>{shelter.remarks}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/shelters/update/[id]',
                params: { id: shelter.id },
              })
            }
            style={styles.updateButton}
          >
            <Text style={styles.updateText}>Update shelter</Text>
          </Pressable>
          {deleteError ? <ErrorMessage message={deleteError} /> : null}
          <Pressable
            accessibilityRole="button"
            onPress={confirmDelete}
            disabled={deleting}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>
              {deleting ? 'Deleting...' : 'Delete shelter'}
            </Text>
          </Pressable>
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
  updateButton: {
    alignItems: 'center',
    backgroundColor: '#1877b9',
    borderRadius: 9,
    padding: 13,
  },
  updateText: { color: '#fff', fontWeight: '700' },
  deleteButton: {
    alignItems: 'center',
    borderColor: '#b42318',
    borderRadius: 9,
    borderWidth: 1,
    padding: 13,
  },
  deleteText: { color: '#b42318', fontWeight: '700' },
});

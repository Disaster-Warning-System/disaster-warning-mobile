import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import ShelterForm from '@/components/shelters/ShelterForm';
import { getShelter } from '@/services/api/shelterApi';
import { submitShelterUpdate } from '@/services/sync/shelterSyncService';
import type { Shelter, UpdateShelterInput } from '@/types/shelter';
export default function UpdateShelterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState<UpdateShelterInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<'synced' | 'pending-sync' | null>(null);
  const [draft, setDraft] = useState<UpdateShelterInput | undefined>(undefined);
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
  async function save() {
    if (!review || typeof id !== 'string') return;
    setSaving(true);
    setError('');
    try {
      setResult((await submitShelterUpdate(id, review)).kind);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update shelter.');
    } finally {
      setSaving(false);
    }
  }
  if (error && !shelter)
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
        <Link
          href={{ pathname: '/shelters/[id]', params: { id: shelter.id } }}
          style={styles.back}
        >
          ‹ Back to shelter
        </Link>
        <Text style={styles.title}>
          {result
            ? result === 'synced'
              ? 'Shelter updated'
              : 'Update saved'
            : review
              ? 'Review shelter update'
              : 'Update shelter'}
        </Text>
        {result ? (
          <View style={styles.card}>
            <Text style={styles.heading}>
              {result === 'synced'
                ? 'Update complete'
                : 'Saved for synchronization'}
            </Text>
            <Text style={styles.copy}>
              {result === 'synced'
                ? 'Shelter information has been updated.'
                : 'This update is stored on this device and will be sent when connection returns.'}
            </Text>
            <Button
              title="Back to shelter"
              onPress={() =>
                router.replace({
                  pathname: '/shelters/[id]',
                  params: { id: shelter.id },
                })
              }
            />
          </View>
        ) : review ? (
          <View style={styles.card}>
            <Text style={styles.heading}>Review update</Text>
            <Text style={styles.copy}>Shelter: {shelter.name}</Text>
            <Text style={styles.copy}>
              Occupancy: {review.occupancy} / {shelter.capacity}
            </Text>
            <Text style={styles.copy}>
              Available spaces:{' '}
              {Math.max(shelter.capacity - review.occupancy, 0)}
            </Text>
            <Text style={styles.copy}>
              Operational status: {review.operationalStatus}
            </Text>
            {review.remarks ? (
              <Text style={styles.copy}>Remarks: {review.remarks}</Text>
            ) : null}
            {error ? <ErrorMessage message={error} /> : null}
            <Button
              title={saving ? 'Saving...' : 'Confirm and save'}
              onPress={() => void save()}
              disabled={saving}
            />
            <Button
              title="Edit update"
              onPress={() => setReview(null)}
              style={styles.secondary}
            />
          </View>
        ) : (
          <ShelterForm
            mode="update"
            shelter={shelter}
            initialUpdate={draft}
            onSubmit={async (v) => {
              setDraft(v);
              setReview(v);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { backgroundColor: '#f4f7f9', flex: 1 },
  content: { gap: 14, padding: 20 },
  back: { color: '#176fa8', fontWeight: '700' },
  title: { color: '#183447', fontSize: 24, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderColor: '#dce6ea',
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  heading: { color: '#183447', fontSize: 19, fontWeight: '700' },
  copy: { color: '#536874', lineHeight: 21 },
  secondary: { backgroundColor: '#687c88' },
});

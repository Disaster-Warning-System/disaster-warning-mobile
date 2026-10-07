import { Link, router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import ShelterForm from '@/components/shelters/ShelterForm';
import { createShelter } from '@/services/api/shelterApi';
import type { CreateShelterInput } from '@/types/shelter';
export default function CreateShelterScreen() {
  async function submit(v: CreateShelterInput) {
    const s = await createShelter(v);
    router.replace({ pathname: '/shelters/[id]', params: { id: s.id } });
  }
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Link href="/(tabs)/shelters" style={styles.back}>
          ‹ Back to shelters
        </Link>
        <Text style={styles.title}>Register a shelter</Text>
        <Text style={styles.sub}>
          Add a shelter and its current availability.
        </Text>
        <ShelterForm mode="create" onSubmit={submit} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { backgroundColor: '#f4f7f9', flex: 1 },
  content: { gap: 14, padding: 20 },
  back: { color: '#176fa8', fontWeight: '700' },
  title: { color: '#183447', fontSize: 24, fontWeight: '700' },
  sub: { color: '#71818b', lineHeight: 20 },
});

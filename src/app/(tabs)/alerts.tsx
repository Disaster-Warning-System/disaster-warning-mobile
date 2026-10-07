import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

type Alert = {
  _id: string;
  alertId: string;
  headline: string;
  instruction: string;
  severity: 'Advisory' | 'Watch' | 'Warning' | 'Evacuation Order';
  districts: string[];
  createdAt?: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const severityColors: Record<Alert['severity'], string> = {
  Advisory: '#2563eb',
  Watch: '#ca8a04',
  Warning: '#ea580c',
  'Evacuation Order': '#dc2626',
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/alerts`);
      if (!response.ok) throw new Error('Unable to load alerts');
      setAlerts(await response.json());
      setError(null);
    } catch {
      setError('Alerts are unavailable. We will retry automatically.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = setTimeout(loadAlerts, 0);
    const interval = setInterval(loadAlerts, 30000);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, [loadAlerts]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hazard Alerts</Text>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id || item.alertId}
        ListEmptyComponent={!loading ? <Text>No dispatched alerts yet.</Text> : null}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: severityColors[item.severity] }]}>
            <Text style={[styles.severity, { color: severityColors[item.severity] }]}>
              {item.severity}
            </Text>
            <Text style={styles.headline}>{item.headline}</Text>
            <Text style={styles.instruction}>{item.instruction}</Text>
            <Text style={styles.districts}>{item.districts.join(' • ')}</Text>
          </View>
        )}
      />
    </View>
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/common/EmptyState';
import ScreenHeader from '@/components/common/ScreenHeader';
import { AppColors } from '@/constants/theme';

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Alerts" subtitle="Official warnings and important safety updates." />
        <EmptyState
          icon="notifications-off-outline"
          title="No active alerts"
          description="You'll see important disaster warnings here when they are issued."
          style={styles.emptyCard}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  severity: { fontWeight: '700', textTransform: 'uppercase', fontSize: 12 },
  headline: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  instruction: { fontSize: 15, marginTop: 8, lineHeight: 21 },
  districts: { color: '#64748b', marginTop: 10 },
  error: { color: '#b91c1c', marginBottom: 12 },
});
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 28 },
  emptyCard: { marginTop: 26 },
});

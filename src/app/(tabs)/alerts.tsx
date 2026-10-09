import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiUrl } from '@/services/api/apiClient';

type Severity = 'Advisory' | 'Watch' | 'Warning' | 'Evacuation Order';

type Alert = {
  _id?: string;
  alertId: string;
  severity: Severity;
  headline: string;
  instruction: string;
  issuedAt?: string;
  createdAt?: string;
};

const ALERTS_URL = getApiUrl('/api/alerts');
const POLL_INTERVAL_MS = 5000;

const severityColors: Record<Severity, string> = {
  Advisory: '#2563eb',
  Watch: '#ca8a04',
  Warning: '#dc2626',
  'Evacuation Order': '#dc2626',
};

function formatAlertTime(alert: Alert): string {
  const timestamp = alert.issuedAt ?? alert.createdAt;
  if (!timestamp) return 'Time unavailable';

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Time unavailable';

  return date.toLocaleString();
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await axios.get<Alert[]>(ALERTS_URL);
      setAlerts(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch {
      setError('Alerts are unavailable. We will retry automatically.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initialFetch = setTimeout(() => {
      void fetchAlerts();
    }, 0);
    const interval = setInterval(() => {
      void fetchAlerts();
    }, POLL_INTERVAL_MS);

    return () => {
      clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [fetchAlerts]);

  const handleRefresh = () => {
    setRefreshing(true);
    void fetchAlerts();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Hazard Alerts</Text>
        <Text style={styles.subtitle}>Live updates every 5 seconds</Text>

        {loading ? <ActivityIndicator size="large" color="#2563eb" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={alerts}
          keyExtractor={(item) => item._id ?? item.alertId}
          contentContainerStyle={alerts.length === 0 ? styles.emptyList : styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>No dispatched alerts yet.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  borderColor: severityColors[item.severity],
                  borderLeftColor: severityColors[item.severity],
                },
              ]}
            >
              <Text
                style={[
                  styles.severity,
                  { color: severityColors[item.severity] },
                ]}
              >
                {item.severity}
              </Text>
              <Text style={styles.time}>{formatAlertTime(item)}</Text>
              <Text style={styles.headline}>{item.headline}</Text>
              <Text style={styles.instruction}>{item.instruction}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 16,
    marginTop: 4,
  },
  list: {
    paddingBottom: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#ca8a04',
    borderWidth: 1,
    borderLeftWidth: 5,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  severity: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  time: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  headline: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  instruction: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  error: {
    color: '#b91c1c',
    marginBottom: 12,
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
  },
});

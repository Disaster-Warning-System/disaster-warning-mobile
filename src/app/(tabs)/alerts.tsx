import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Alerts</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No alerts available</Text>
          <Text style={styles.emptyDescription}>
            Official disaster warnings will appear here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F8F7',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    color: '#17332D',
    fontSize: 30,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3EBE8',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  emptyTitle: {
    color: '#263D37',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDescription: {
    color: '#66756F',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
});

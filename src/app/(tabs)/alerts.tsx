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
  safeArea: { backgroundColor: AppColors.background, flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 28 },
  emptyCard: { marginTop: 26 },
});

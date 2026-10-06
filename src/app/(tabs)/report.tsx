import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ReportScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Report a Hazard</Text>
        <Text style={styles.description}>
          This feature will allow you to submit a disaster or hazard report.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>Start Hazard Report</Text>
        </Pressable>
        <Text style={styles.comingSoon}>Coming soon</Text>
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
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#17332D',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
  },
  description: {
    color: '#52645F',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#DDE8E4',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 54,
    paddingHorizontal: 20,
  },
  disabledButtonText: {
    color: '#52645F',
    fontSize: 16,
    fontWeight: '700',
  },
  comingSoon: {
    color: '#78858C',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
});

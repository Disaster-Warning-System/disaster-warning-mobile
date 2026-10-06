import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>SRI LANKA • COMMUNITY SAFETY</Text>
        <Text style={styles.title}>Disaster Warning System</Text>
        <Text style={styles.welcome}>Stay informed. Stay safe.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Warnings</Text>
          <View style={styles.warningCard}>
            <View style={styles.statusDot} />
            <View style={styles.warningCopy}>
              <Text style={styles.warningTitle}>No active warnings</Text>
            </View>
          </View>
        </View>

        <Button
          title="Report a Hazard"
          onPress={() => router.navigate('/(tabs)/report')}
          style={styles.reportButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8F7',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
  },
  eyebrow: {
    color: '#176B5B',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
  },
  title: {
    color: '#17332D',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 39,
    maxWidth: 340,
  },
  welcome: {
    color: '#52645F',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 8,
  },
  section: {
    marginTop: 44,
  },
  sectionTitle: {
    color: '#263D37',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  warningCard: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3EBE8',
    borderLeftColor: '#176B5B',
    borderLeftWidth: 4,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 18,
  },
  statusDot: {
    backgroundColor: '#2B9A72',
    borderRadius: 5,
    height: 10,
    marginRight: 12,
    marginTop: 5,
    width: 10,
  },
  warningCopy: {
    flex: 1,
  },
  warningTitle: {
    color: '#203B33',
    fontSize: 16,
    fontWeight: '700',
  },
  reportButton: {
    marginTop: 32,
  },
});

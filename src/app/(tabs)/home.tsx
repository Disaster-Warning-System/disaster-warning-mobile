import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>SRI LANKA • COMMUNITY SAFETY</Text>
        <Text style={styles.title}>Disaster Warning System</Text>
        <Text style={styles.welcome}>Stay informed. Stay safe.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current disaster warnings</Text>
          <View style={styles.warningCard}>
            <View style={styles.statusDot} />
            <View style={styles.warningCopy}>
              <Text style={styles.warningTitle}>No active warnings</Text>
              <Text style={styles.warningDescription}>
                There are no current warnings for your area.
              </Text>
            </View>
          </View>
        </View>

        <Link href="/(tabs)/report" asChild>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.reportButton, pressed && styles.buttonPressed]}>
            <Text style={styles.reportButtonText}>Report a Hazard</Text>
          </Pressable>
        </Link>
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
  warningDescription: {
    color: '#66756F',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  reportButton: {
    alignItems: 'center',
    backgroundColor: '#176B5B',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 32,
    minHeight: 54,
    paddingHorizontal: 20,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

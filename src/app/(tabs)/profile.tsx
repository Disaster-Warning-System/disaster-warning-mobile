import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View>
            <Text style={styles.profileTitle}>User Profile</Text>
            <Text style={styles.profileDescription}>Profile details will appear here.</Text>
          </View>
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
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3EBE8',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 24,
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E1F0EB',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginRight: 14,
    width: 48,
  },
  avatarText: {
    color: '#176B5B',
    fontSize: 20,
    fontWeight: '700',
  },
  profileTitle: {
    color: '#263D37',
    fontSize: 16,
    fontWeight: '700',
  },
  profileDescription: {
    color: '#66756F',
    fontSize: 14,
    marginTop: 5,
  },
});

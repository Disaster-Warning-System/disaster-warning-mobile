import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function IndexRoute() {
  const { isLoading, user } = useAuth();
  if (isLoading) {
    return <View style={styles.loading}><ActivityIndicator color={AppColors.primary} /></View>;
  }
  return <Redirect href={user ? '/(tabs)/home' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', backgroundColor: AppColors.background, flex: 1, justifyContent: 'center' },
});

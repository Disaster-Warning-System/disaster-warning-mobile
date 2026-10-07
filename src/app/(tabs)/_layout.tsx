import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Fonts } from '@/constants/theme';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AppColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const ACTIVE_COLOR = '#1877B9';
const INACTIVE_COLOR = '#7A8992';

export default function TabLayout() {
  const { isLoading, user } = useAuth();
  if (isLoading) return <View style={{ alignItems: 'center', backgroundColor: AppColors.background, flex: 1, justifyContent: 'center' }}><ActivityIndicator color={AppColors.primary} /></View>;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: Fonts.inter.semiBold,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DCE6EA',
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarItemStyle: { minHeight: 52 },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'warning' : 'warning-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Fonts } from '@/constants/theme';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View, type ColorValue } from 'react-native';
import type { ComponentProps } from 'react';
import { AppColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const ACTIVE_COLOR = '#1877B9';
const INACTIVE_COLOR = '#7A8992';

function TabIcon({
  color,
  size,
  focused,
  name,
  outlineName,
}: {
  color: ColorValue;
  size: number;
  focused: boolean;
  name: ComponentProps<typeof Ionicons>['name'];
  outlineName: ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons name={focused ? name : outlineName} size={focused ? size - 1 : size} color={color} />
    </View>
  );
}

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
          borderColor: '#DCE6EA',
          borderRadius: 24,
          borderTopWidth: 1,
          bottom: 10,
          height: 72,
          left: 12,
          paddingBottom: 9,
          paddingHorizontal: 6,
          paddingTop: 7,
          position: 'absolute',
          right: 12,
          shadowColor: '#16324D',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.12,
          shadowRadius: 14,
          elevation: 8,
        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 2,
          minHeight: 54,
          paddingTop: 1,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon color={color} focused={focused} name="home" outlineName="home-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon color={color} focused={focused} name="warning" outlineName="warning-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon color={color} focused={focused} name="notifications" outlineName="notifications-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen name="shelters" options={{ title: "Shelters", tabBarIcon: ({ color, size, focused }) => <TabIcon color={color} focused={focused} name="business" outlineName="business-outline" size={size} /> }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon color={color} focused={focused} name="person" outlineName="person-outline" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    borderRadius: 16,
    height: 30,
    justifyContent: 'center',
    width: 52,
  },
  activeIconContainer: {
    backgroundColor: '#E8F2FC',
  },
});

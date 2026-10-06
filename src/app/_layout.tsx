import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { HazardReportProvider } from '@/hooks/useHazardReport';
import { ReportSyncManager } from '@/components/hazard-report/ReportSyncManager';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <HazardReportProvider>
        <ReportSyncManager />
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </HazardReportProvider>
    </ThemeProvider>
  );
}

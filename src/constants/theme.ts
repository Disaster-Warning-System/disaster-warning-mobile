/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#172B3A',
    background: '#F5F8FA',
    surface: '#FFFFFF',
    primary: '#0B6E69',
    primaryDark: '#07534F',
    primarySoft: '#E2F2EF',
    accent: '#E76F51',
    border: '#DCE6EA',
    muted: '#62727D',
    success: '#167C5A',
    danger: '#B93832',
    backgroundElement: '#EEF3F5',
    backgroundSelected: '#E2F2EF',
    textSecondary: '#62727D',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    surface: '#212225',
    primary: '#53C7B5',
    primaryDark: '#8FE0D1',
    primarySoft: '#213C38',
    accent: '#FF9B83',
    border: '#3B4146',
    muted: '#B0B4BA',
    success: '#65D5A8',
    danger: '#FF9B96',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const AppColors = Colors.light;

export const Radius = {
  small: 10,
  medium: 16,
  large: 22,
  pill: 999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#17323D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

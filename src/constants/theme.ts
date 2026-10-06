/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#16283D',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    primary: '#1877B9',
    primaryDark: '#075B94',
    primarySoft: '#E8F2FC',
    accent: '#F26B3A',
    border: '#DDE5EE',
    muted: '#6B7C8F',
    success: '#08A05C',
    danger: '#C94A3D',
    backgroundElement: '#EEF3F8',
    backgroundSelected: '#E8F2FC',
    textSecondary: '#6B7C8F',
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

export const Fonts = {
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  sinhala: {
    regular: 'NotoSansSinhala_400Regular',
    medium: 'NotoSansSinhala_500Medium',
    semiBold: 'NotoSansSinhala_600SemiBold',
    bold: 'NotoSansSinhala_700Bold',
  },
  ...Platform.select({
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
    sans: 'Inter_400Regular, NotoSansSinhala_400Regular, sans-serif',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
  }),
} as const;

export const Typography = {
  title: { fontFamily: Fonts.inter.bold, fontSize: 26, fontWeight: '700' as const, lineHeight: 32, letterSpacing: -0.2 },
  sectionTitle: { fontFamily: Fonts.inter.semiBold, fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontFamily: Fonts.inter.regular, fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  secondary: { fontFamily: Fonts.inter.regular, fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  button: { fontFamily: Fonts.inter.semiBold, fontSize: 16, fontWeight: '600' as const, lineHeight: 20 },
  label: { fontFamily: Fonts.inter.bold, fontSize: 13, fontWeight: '700' as const, lineHeight: 18 },
} as const;

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
  medium: 14,
  large: 20,
  pill: 999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#16324D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

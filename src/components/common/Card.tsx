import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { AppColors, Radius, Shadows } from '@/constants/theme';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderRadius: Radius.medium,
    borderWidth: 1,
    padding: 18,
    ...Shadows.card,
  },
});

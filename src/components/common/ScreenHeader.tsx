import { StyleSheet, Text, View } from 'react-native';

import { AppColors, Fonts, Typography } from '@/constants/theme';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ eyebrow, title, subtitle }: ScreenHeaderProps) {
  return (
    <View>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...Typography.label,
    fontFamily: Fonts.inter.semiBold,
    color: AppColors.muted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    ...Typography.title,
    color: AppColors.text,
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  subtitle: {
    ...Typography.secondary,
    color: AppColors.muted,
    marginTop: 8,
  },
});

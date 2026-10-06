import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

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
    color: AppColors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    color: AppColors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  subtitle: {
    color: AppColors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
});

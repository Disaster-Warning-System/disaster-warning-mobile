import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import { AppColors, Typography } from '@/constants/theme';

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  style?: object;
};

export default function EmptyState({ icon, title, description, style }: EmptyStateProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={AppColors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: AppColors.primarySoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 14,
    width: 56,
  },
  title: {
    ...Typography.sectionTitle,
    color: AppColors.text,
  },
  description: {
    ...Typography.secondary,
    color: AppColors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { Typography } from '@/constants/theme';

type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View accessibilityRole="alert" style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDECEC',
    borderColor: '#F2B8B5',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  message: {
    ...Typography.secondary,
    color: '#9B2520',
  },
});
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadingProps = {
  size?: 'small' | 'large';
  color?: string;
};

export default function Loading({ size = 'large', color = '#176B5B' }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator accessibilityLabel="Loading" size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
import { StyleSheet, TextInput, View } from 'react-native';

import ErrorMessage from '@/components/common/ErrorMessage';
import { AppColors, Radius, Typography } from '@/constants/theme';

type DescriptionInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
};

export default function DescriptionInput({
  value,
  onChangeText,
  error,
}: DescriptionInputProps) {
  return (
    <View>
      <TextInput
        accessibilityLabel="Hazard description"
        multiline
        onChangeText={onChangeText}
        placeholder="Describe what you observed, including the exact area..."
        placeholderTextColor="#87958F"
        textAlignVertical="top"
        value={value}
        style={styles.input}
      />
      {error ? <ErrorMessage message={error} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    ...Typography.body,
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderRadius: Radius.small,
    borderWidth: 1,
    color: AppColors.text,
    marginTop: 12,
    minHeight: 104,
    padding: 14,
  },
});
import { StyleSheet, TextInput, View } from 'react-native';

import ErrorMessage from '@/components/common/ErrorMessage';

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
        placeholder="Describe what you observed..."
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
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE6E2',
    borderRadius: 10,
    borderWidth: 1,
    color: '#203B33',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    minHeight: 120,
    padding: 14,
  },
});
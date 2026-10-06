import { StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';

type PhotoPickerProps = {
  photo: string | null;
};

export default function PhotoPicker({ photo }: PhotoPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.photoStatus}>{photo ? 'Photo selected' : 'No photo selected'}</Text>
      <Button
        title="Add Photo"
        onPress={() => {}}
        disabled
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE6E2',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    padding: 14,
  },
  photoStatus: {
    color: '#65756F',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#E8EEEB',
    marginTop: 12,
    minHeight: 44,
  },
  buttonText: {
    color: '#52645F',
    fontSize: 14,
  },
});
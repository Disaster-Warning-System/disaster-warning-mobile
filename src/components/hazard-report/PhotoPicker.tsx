import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';

type PhotoPickerProps = {
  photoUri: string | null;
  onPhotoChange: (photoUri: string | null) => void;
};

export default function PhotoPicker({ photoUri, onPhotoChange }: PhotoPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddPhoto = async () => {
    setIsLoading(true);
    setError('');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Photo library permission was denied. You can continue without a photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });
      if (!result.canceled && result.assets[0]) {
        onPhotoChange(result.assets[0].uri);
      }
    } catch {
      setError('Unable to select that photo. Please try again or continue without one.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.photoStatus}>{photoUri ? 'Photo selected' : 'No photo selected'}</Text>
      {photoUri ? (
        <Image
          accessibilityLabel="Selected hazard report photo"
          source={{ uri: photoUri }}
          resizeMode="cover"
          style={styles.preview}
        />
      ) : null}
      {error ? <ErrorMessage message={error} /> : null}
      <Button
        title="Add Photo"
        onPress={handleAddPhoto}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      />
      {photoUri ? (
        <Button
          title="Remove Photo"
          onPress={() => {
            onPhotoChange(null);
            setError('');
          }}
          style={styles.removeButton}
          textStyle={styles.removeButtonText}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  preview: {
    borderRadius: 8,
    height: 180,
    marginTop: 12,
    width: '100%',
  },
  button: {
    marginTop: 12,
    minHeight: 44,
  },
  removeButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C9D5D0',
    borderWidth: 1,
    marginTop: 8,
    minHeight: 44,
  },
  removeButtonText: {
    color: '#334941',
  },
});
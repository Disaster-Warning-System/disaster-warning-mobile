import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import { AppColors, Radius, Typography } from '@/constants/theme';

type PhotoPickerProps = {
  photoUri: string | null;
  onPhotoChange: (photoUri: string | null) => void;
};

export default function PhotoPicker({ photoUri, onPhotoChange }: PhotoPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPhoto = async () => {
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

  const handleTakePhoto = async () => {
    setIsLoading(true);
    setError('');
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError('Camera permission was denied. You can continue without a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });
      if (!result.canceled && result.assets[0]) {
        onPhotoChange(result.assets[0].uri);
      }
    } catch {
      setError('Unable to take that photo. Please try again or choose one from your gallery.');
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
        title="Take Photo"
        onPress={() => void handleTakePhoto()}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      />
      {!photoUri ? (
        <Button
          title="Choose from Gallery"
          onPress={() => void handleSelectPhoto()}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        />
      ) : null}
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
    backgroundColor: '#F9FBFE',
    borderColor: AppColors.border,
    borderRadius: Radius.small,
    borderWidth: 1,
    marginTop: 10,
    padding: 12,
  },
  photoStatus: {
    ...Typography.secondary,
    color: AppColors.muted,
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
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderWidth: 1,
    marginTop: 8,
    minHeight: 44,
  },
  removeButtonText: {
    color: AppColors.text,
  },
});
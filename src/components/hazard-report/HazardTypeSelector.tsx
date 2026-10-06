import { Pressable, StyleSheet, Text, View } from 'react-native';

import ErrorMessage from '@/components/common/ErrorMessage';
import { HAZARD_TYPES, type HazardType } from '@/constants/hazardTypes';
import { AppColors, Radius } from '@/constants/theme';

type HazardTypeSelectorProps = {
  value: HazardType | null;
  onChange: (value: HazardType) => void;
  error?: string;
};

export default function HazardTypeSelector({
  value,
  onChange,
  error,
}: HazardTypeSelectorProps) {
  return (
    <View>
      <View style={styles.options}>
        {HAZARD_TYPES.map((hazardType) => {
          const selected = value === hazardType;

          return (
            <Pressable
              key={hazardType}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(hazardType)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.selectedOption,
                pressed && styles.pressed,
              ]}>
              <View style={[styles.radio, selected && styles.selectedRadio]}>
                {selected && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
                {hazardType}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <ErrorMessage message={error} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginTop: 12,
  },
  option: {
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
    borderRadius: Radius.small,
    borderWidth: 1,
    flexDirection: 'row',
    margin: 5,
    minHeight: 54,
    paddingHorizontal: 12,
    width: '47%',
  },
  selectedOption: {
    backgroundColor: AppColors.primarySoft,
    borderColor: AppColors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  radio: {
    alignItems: 'center',
    borderColor: '#93A2AA',
    borderRadius: 9,
    borderWidth: 1.5,
    height: 18,
    justifyContent: 'center',
    marginRight: 9,
    width: 18,
  },
  selectedRadio: {
    borderColor: AppColors.primary,
  },
  radioDot: {
    backgroundColor: AppColors.primary,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  optionText: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  selectedOptionText: {
    color: AppColors.primaryDark,
  },
});

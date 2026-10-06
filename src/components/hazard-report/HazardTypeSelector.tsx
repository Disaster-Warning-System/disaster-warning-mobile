import { Pressable, StyleSheet, Text, View } from 'react-native';

import ErrorMessage from '@/components/common/ErrorMessage';
import { HAZARD_TYPES, type HazardType } from '@/constants/hazardTypes';

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
    marginTop: 10,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE6E2',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    margin: 5,
    minHeight: 48,
    paddingHorizontal: 12,
    width: '47%',
  },
  selectedOption: {
    backgroundColor: '#E8F3EF',
    borderColor: '#176B5B',
  },
  pressed: {
    opacity: 0.8,
  },
  radio: {
    alignItems: 'center',
    borderColor: '#899A94',
    borderRadius: 9,
    borderWidth: 1.5,
    height: 18,
    justifyContent: 'center',
    marginRight: 9,
    width: 18,
  },
  selectedRadio: {
    borderColor: '#176B5B',
  },
  radioDot: {
    backgroundColor: '#176B5B',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  optionText: {
    color: '#334941',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#145B4E',
  },
});

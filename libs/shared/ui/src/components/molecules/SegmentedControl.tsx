import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { radii, spacing, typography } from '../../tokens';
import { useThemeColors } from '../../hooks/useThemeColors';

export interface SegmentedControlOption<T extends string = string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.input }]}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[
              styles.segment,
              isActive && { backgroundColor: colors.surface, ...styles.activeSegment },
            ]}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.textPrimary : colors.textMuted },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radii.sm,
    padding: spacing.xxs,
    gap: spacing.xxs,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  activeSegment: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    ...typography.label,
  },
});

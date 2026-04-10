import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radii, spacing, typography } from '../../tokens';
import { useThemeColors, ColorPalette } from '../../hooks/useThemeColors';

interface StepperFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

export function StepperField({
  label,
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  formatValue,
}: StepperFieldProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const display = formatValue ? formatValue(value) : String(value);
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={styles.row}>
        <Text style={styles.display}>{display}</Text>
        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              atMin && styles.btnDisabled,
              pressed && !atMin && styles.btnPressed,
            ]}
            onPress={() => !atMin && onChange(value - step)}
            disabled={atMin}
            accessibilityRole="button"
            accessibilityLabel={`Decrease ${label}`}
            accessibilityState={{ disabled: atMin }}
            hitSlop={8}
          >
            <Text style={[styles.btnText, atMin && styles.btnTextDisabled]}>–</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              atMax && styles.btnDisabled,
              pressed && !atMax && styles.btnPressed,
            ]}
            onPress={() => !atMax && onChange(value + step)}
            disabled={atMax}
            accessibilityRole="button"
            accessibilityLabel={`Increase ${label}`}
            accessibilityState={{ disabled: atMax }}
            hitSlop={8}
          >
            <Text style={[styles.btnText, atMax && styles.btnTextDisabled]}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    wrapper: {
      gap: spacing.xxs,
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
      letterSpacing: 0.6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.input,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 48,
    },
    display: {
      ...typography.inputText,
      color: colors.textPrimary,
    },
    controls: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    btn: {
      backgroundColor: colors.border,
      width: 32,
      height: 32,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnPressed: { opacity: 0.7 },
    btnDisabled: { opacity: 0.3 },
    btnText: {
      ...typography.button,
      color: colors.textPrimary,
    },
    btnTextDisabled: { color: colors.textMuted },
  });
}

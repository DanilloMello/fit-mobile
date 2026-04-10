import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  radii,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';

interface AddItemRowProps {
  label: string;
  onPress: () => void;
  variant?: 'inline' | 'card';
}

export function AddItemRow({ label, onPress, variant = 'card' }: AddItemRowProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'inline' ? styles.inline : styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    base: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      borderRadius: radii.sm,
      paddingVertical: spacing.md,
      minHeight: 52,
    },
    inline: {
      paddingVertical: spacing.sm,
      minHeight: 44,
      borderTopWidth: 0,
      borderRadius: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomLeftRadius: radii.sm,
      borderBottomRightRadius: radii.sm,
    },
    pressed: { opacity: 0.7 },
    label: {
      ...typography.label,
      color: colors.textMuted,
    },
  });
}

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { radii, shadows, spacing, typography } from '../../tokens';
import { useThemeColors } from '../../hooks/useThemeColors';

interface FABProps {
  label?: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export function FAB({ label, onPress, accessibilityLabel }: FABProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: colors.brand },
        shadows.brandGlow,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.icon}>+</Text>
      {label ? (
        <Text style={[styles.label, { color: '#fff' }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    minWidth: 56,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    fontSize: 24,
    lineHeight: 28,
    color: '#fff',
    fontWeight: '400',
  },
  label: {
    ...typography.button,
  },
});

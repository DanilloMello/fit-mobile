import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radii, spacing, typography } from '../../tokens';
import { useThemeColors, ColorPalette } from '../../hooks/useThemeColors';

export type StatusBadgeVariant = 'done' | 'done_warning' | 'in_progress' | 'not_started';

const STATUS_CONFIG: Record<
  StatusBadgeVariant,
  { label: string; bg: string; text: string }
> = {
  done:        { label: 'done',        bg: 'rgba(34,197,94,0.15)',  text: '#22C55E' },
  done_warning:{ label: 'done',        bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  in_progress: { label: 'in progress', bg: 'rgba(43,186,237,0.15)', text: '#2BBAED' },
  not_started: { label: 'not started', bg: 'transparent',           text: '#94A3B8' },
};

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
}

export function StatusBadge({ variant }: StatusBadgeProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const cfg = STATUS_CONFIG[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variant === 'not_started' ? colors.input : cfg.bg,
          borderColor: variant === 'not_started' ? colors.border : 'transparent',
          borderWidth: variant === 'not_started' ? 0.5 : 0,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={cfg.label}
    >
      <Text style={[styles.label, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    badge: {
      borderRadius: radii.sm,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
    },
    label: {
      ...typography.caption,
    },
  });
}

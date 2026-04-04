import React from 'react';
import { StyleSheet, View } from 'react-native';

export type StatusDotVariant =
  | 'draft'
  | 'active'
  | 'paused'
  | 'canceled'
  | 'completed'
  | 'pending'
  | 'in_progress'
  | 'done';

const STATUS_COLORS: Record<StatusDotVariant, string> = {
  draft: '#94A3B8',
  active: '#22C55E',
  paused: '#F59E0B',
  canceled: '#EF4444',
  completed: '#2BBAED',
  pending: '#94A3B8',
  in_progress: '#F59E0B',
  done: '#22C55E',
};

interface StatusDotProps {
  variant: StatusDotVariant;
  size?: number;
}

export function StatusDot({ variant, size = 8 }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: STATUS_COLORS[variant],
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={variant}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    flexShrink: 0,
  },
});

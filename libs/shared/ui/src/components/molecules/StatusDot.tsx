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
  | 'done'
  | 'done_warning'
  | 'not_started';

const STATUS_COLORS: Record<Exclude<StatusDotVariant, 'not_started'>, string> = {
  draft: '#94A3B8',
  active: '#22C55E',
  paused: '#F59E0B',
  canceled: '#EF4444',
  completed: '#2BBAED',
  pending: '#94A3B8',
  in_progress: '#22C55E',
  done: '#94A3B8',
  done_warning: '#F59E0B',
};

interface StatusDotProps {
  variant: StatusDotVariant;
  size?: number;
}

export function StatusDot({ variant, size = 8 }: StatusDotProps) {
  const isNotStarted = variant === 'not_started';

  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        isNotStarted
          ? {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: '#94A3B8',
            }
          : {
              backgroundColor: STATUS_COLORS[variant as Exclude<StatusDotVariant, 'not_started'>],
            },
      ]}
      accessibilityRole="image"
      accessibilityLabel={variant.replace('_', ' ')}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    flexShrink: 0,
  },
});

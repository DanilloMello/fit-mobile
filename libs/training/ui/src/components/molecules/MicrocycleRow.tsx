import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  StatusDot,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';
import { PlanBuilderStatus } from '../../__mocks__/planBuilderMock';

const STATUS_DOT_MAP: Record<PlanBuilderStatus, React.ComponentProps<typeof StatusDot>['variant']> = {
  done:         'done',
  done_warning: 'done_warning',
  in_progress:  'in_progress',
  not_started:  'not_started',
};

interface MicrocycleRowProps {
  name: string;
  workoutCount: number;
  status: PlanBuilderStatus;
  onPress: () => void;
}

export function MicrocycleRow({ name, workoutCount, status, onPress }: MicrocycleRowProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const isDone = status === 'done' || status === 'done_warning';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${workoutCount} workouts`}
    >
      <StatusDot variant={STATUS_DOT_MAP[status]} size={8} />
      <Text
        style={[styles.name, isDone && styles.nameDone]}
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text style={[styles.workouts, isDone && styles.workoutsDone]}>
        {workoutCount > 0 ? `${workoutCount} workout${workoutCount !== 1 ? 's' : ''}` : 'empty'}
      </Text>
      <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 44,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    pressed: { opacity: 0.7 },
    name: {
      ...typography.label,
      color: colors.textPrimary,
      flex: 1,
    },
    nameDone: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    workouts: {
      ...typography.caption,
      color: colors.brand,
    },
    workoutsDone: {
      color: colors.textMuted,
    },
  });
}

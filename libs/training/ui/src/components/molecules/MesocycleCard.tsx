import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  radii,
  spacing,
  typography,
  StatusDot,
  StatusDotVariant,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';
import { MesocycleStatus } from '@connecthealth/training/domain';
import { MesocycleDto } from '@connecthealth/training/infrastructure';

const STATUS_DOT_MAP: Record<MesocycleStatus, StatusDotVariant> = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

const STATUS_LABEL: Record<MesocycleStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

interface MesocycleCardProps {
  mesocycle: MesocycleDto;
  onPress?: (mesocycle: MesocycleDto) => void;
  onDelete?: (mesocycle: MesocycleDto) => void;
}

export function MesocycleCard({
  mesocycle,
  onPress,
  onDelete,
}: MesocycleCardProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const weekCount = mesocycle.endWeek - mesocycle.startWeek + 1;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && onPress && styles.pressed,
      ]}
      onPress={onPress ? () => onPress(mesocycle) : undefined}
      accessibilityRole="button"
      accessibilityLabel={`${mesocycle.name}, weeks ${mesocycle.startWeek} to ${mesocycle.endWeek}`}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.titleRow}>
            <StatusDot
              variant={STATUS_DOT_MAP[mesocycle.status]}
              size={8}
            />
            <Text style={styles.name} numberOfLines={1}>
              {mesocycle.name}
            </Text>
          </View>
          <Text style={styles.meta}>
            Weeks {mesocycle.startWeek}–{mesocycle.endWeek} · {weekCount}w ·{' '}
            {STATUS_LABEL[mesocycle.status]}
          </Text>
          {mesocycle.goal ? (
            <Text style={styles.goal}>{mesocycle.goal}</Text>
          ) : null}
        </View>

        {onDelete ? (
          <Pressable
            style={styles.deleteBtn}
            onPress={() => onDelete(mesocycle)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${mesocycle.name}`}
          >
            <Text style={styles.deleteIcon}>✕</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.sm,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: {
      opacity: 0.8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    left: {
      flex: 1,
      gap: spacing.xxs,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    name: {
      ...typography.label,
      color: colors.textPrimary,
      flex: 1,
    },
    meta: {
      ...typography.caption,
      color: colors.textMuted,
    },
    goal: {
      ...typography.caption,
      color: colors.brand,
    },
    deleteBtn: {
      padding: spacing.xxs,
    },
    deleteIcon: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
}

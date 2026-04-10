import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  radii,
  shadows,
  spacing,
  typography,
  StatusDot,
  StatusDotVariant,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';
import { PlanStatus } from '@connecthealth/training/domain';
import { PlanSummaryDto } from '@connecthealth/training/infrastructure';

const STATUS_DOT_MAP: Record<PlanStatus, StatusDotVariant> = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
};

interface PlanCardProps {
  plan: PlanSummaryDto;
  onPress: (plan: PlanSummaryDto) => void;
}

export function PlanCard({ plan, onPress }: PlanCardProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const progressPercent =
    plan.workoutsTotal > 0
      ? Math.round((plan.workoutsDone / plan.workoutsTotal) * 100)
      : 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(plan)}
      accessibilityRole="button"
      accessibilityLabel={plan.name}
      accessibilityHint="Double tap to open plan builder"
    >
      <View style={styles.header}>
        <StatusDot variant={STATUS_DOT_MAP[plan.status]} size={10} />
        <Text style={styles.name} numberOfLines={1}>{plan.name}</Text>
      </View>

      {plan.clientName ? (
        <Text style={styles.client} numberOfLines={1}>
          {plan.clientName}
        </Text>
      ) : null}

      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {plan.mesocycleCount} mesocycle{plan.mesocycleCount !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{plan.totalWeeks}w</Text>
      </View>

      {plan.workoutsTotal > 0 ? (
        <View style={styles.progressSection}>
          <View style={[styles.progressTrack, { backgroundColor: colors.input }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.brand,
                  width: `${progressPercent}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {plan.workoutsDone}/{plan.workoutsTotal} sessions
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.card,
      padding: spacing.lg,
      ...shadows.card,
    },
    pressed: {
      opacity: 0.85,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.xxs,
    },
    name: {
      ...typography.button,
      color: colors.textPrimary,
      flex: 1,
    },
    client: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xxs,
    },
    metaText: {
      ...typography.caption,
      color: colors.textMuted,
    },
    metaDot: {
      ...typography.caption,
      color: colors.textMuted,
    },
    progressSection: {
      marginTop: spacing.sm,
      gap: spacing.xxs,
    },
    progressTrack: {
      height: 4,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressLabel: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
}

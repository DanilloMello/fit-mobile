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

const STATUS_LABEL: Record<PlanStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  CANCELED: 'Canceled',
  COMPLETED: 'Completed',
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
      accessibilityLabel={`${plan.name}, ${STATUS_LABEL[plan.status]}`}
      accessibilityHint="Double tap to open plan builder"
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <StatusDot variant={STATUS_DOT_MAP[plan.status]} size={10} />
          <Text style={styles.name} numberOfLines={1}>{plan.name}</Text>
        </View>
        <Text style={styles.status}>{STATUS_LABEL[plan.status]}</Text>
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
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginBottom: spacing.xxs,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      flex: 1,
    },
    name: {
      ...typography.button,
      color: colors.textPrimary,
      flex: 1,
    },
    status: {
      ...typography.caption,
      color: colors.textMuted,
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

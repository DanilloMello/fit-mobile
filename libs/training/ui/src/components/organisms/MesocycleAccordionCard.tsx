import React from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  StatusDot,
  StatusBadge,
  radii,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';
import { MockMesocycleDto, PlanBuilderStatus } from '../../__mocks__/planBuilderMock';
import { MicrocycleRow } from '../molecules/MicrocycleRow';
import { AddItemRow } from '../molecules/AddItemRow';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STATUS_DOT_MAP: Record<PlanBuilderStatus, React.ComponentProps<typeof StatusDot>['variant']> = {
  done:         'done',
  done_warning: 'done_warning',
  in_progress:  'in_progress',
  not_started:  'not_started',
};

interface MesocycleAccordionCardProps {
  mesocycle: MockMesocycleDto;
  expanded: boolean;
  onToggle: () => void;
  onMicrocyclePress: (microcycleId: string) => void;
  onAddMicrocycle: () => void;
}

export function MesocycleAccordionCard({
  mesocycle,
  expanded,
  onToggle,
  onMicrocyclePress,
  onAddMicrocycle,
}: MesocycleAccordionCardProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const { displayStatus } = mesocycle;
  const isDone = displayStatus === 'done' || displayStatus === 'done_warning';
  const microRange = mesocycle.microcycles.length > 0
    ? `Microcycles ${mesocycle.microcycles[0].weekNumber} – ${mesocycle.microcycles[mesocycle.microcycles.length - 1].weekNumber}`
    : `Wks ${mesocycle.startWeek}–${mesocycle.endWeek}`;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={[styles.card, expanded && styles.cardExpanded]}>
      {/* ── Header row ───────────────────────────── */}
      <Pressable
        style={({ pressed }) => [styles.headerRow, pressed && styles.pressed]}
        onPress={handleToggle}
        accessibilityRole="button"
        accessibilityLabel={`${mesocycle.name}, ${microRange}`}
        accessibilityHint="Tap to expand or collapse"
        accessibilityState={{ expanded }}
      >
        <StatusDot variant={STATUS_DOT_MAP[displayStatus]} size={10} />

        <View style={styles.info}>
          <Text
            style={[styles.name, isDone && styles.nameDone]}
            numberOfLines={1}
          >
            {mesocycle.name}
          </Text>
          <Text style={styles.meta}>{microRange}</Text>
        </View>

        {displayStatus === 'not_started' ? (
          <StatusBadge variant="not_started" />
        ) : null}

        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-forward'}
          size={16}
          color={colors.textMuted}
        />
      </Pressable>

      {/* ── Expanded: microcycle rows ─────────────── */}
      {expanded ? (
        <>
          {mesocycle.microcycles.map((micro) => (
            <MicrocycleRow
              key={micro.id}
              name={micro.name}
              workoutCount={micro.workoutCount}
              status={micro.status}
              onPress={() => onMicrocyclePress(micro.id)}
            />
          ))}
          <AddItemRow
            label="+ Add microcycle"
            onPress={onAddMicrocycle}
            variant="inline"
          />
        </>
      ) : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    cardExpanded: {
      borderWidth: 1.5,
      borderColor: colors.brand + '55',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      gap: spacing.sm,
      minHeight: 56,
    },
    pressed: { opacity: 0.8 },
    info: {
      flex: 1,
      gap: 2,
    },
    name: {
      ...typography.label,
      color: colors.textPrimary,
    },
    nameDone: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    meta: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
}

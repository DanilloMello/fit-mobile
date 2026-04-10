import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import {
  LoadingSpinner,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
  radii,
} from '@connecthealth/shared/ui';
import { usePlanDetail } from '@connecthealth/training/ui';
import { DayOfWeek } from '@connecthealth/training/domain';
import {
  workoutDayApi,
  CreateWorkoutDayDto,
  WorkoutDayExerciseDto,
} from '@connecthealth/training/infrastructure';

const DAY_ABBREV: Record<DayOfWeek, string> = {
  MONDAY: 'MON', TUESDAY: 'TUE', WEDNESDAY: 'WED', THURSDAY: 'THU',
  FRIDAY: 'FRI', SATURDAY: 'SAT', SUNDAY: 'SUN',
};

const DAY_OPTIONS: DayOfWeek[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
];

const MAX_EXERCISES_PREVIEW = 3;

function formatLoad(ex: WorkoutDayExerciseDto): string {
  const base = `${ex.sets}×${ex.reps}`;
  return ex.load ? `${base} @${ex.load}` : base;
}

export default function WorkoutWeekScreen() {
  const { id: planId, weekId } = useLocalSearchParams<{ id: string; weekId: string }>();
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const { data: plan, isLoading, error, refetch } = usePlanDetail(planId);

  const [expandedDayId, setExpandedDayId] = useState<string | null>(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [isSavingDay, setIsSavingDay] = useState(false);

  // Derive microcycle and its parent mesocycle from plan data
  const mesocycle = plan?.mesocycles.find(m =>
    m.microcycles.some(mc => mc.id === weekId)
  );
  const microcycle = mesocycle?.microcycles.find(mc => mc.id === weekId);

  const handleAddWorkoutDay = async (dayOfWeek: DayOfWeek) => {
    if (!microcycle) return;
    setIsSavingDay(true);
    try {
      const dto: CreateWorkoutDayDto = { dayOfWeek };
      await workoutDayApi.create(microcycle.id, dto);
      await refetch();
      setShowDayPicker(false);
    } catch {
      Alert.alert('Error', 'Could not add workout day. Please try again.');
    } finally {
      setIsSavingDay(false);
    }
  };

  const navigateToDayEdit = (dayId: string) => {
    router.push(`/(app)/plans/${planId}/workout-day/${dayId}`);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !plan || !mesocycle || !microcycle) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load week</Text>
        </View>
      </SafeAreaView>
    );
  }

  const microIndex  = mesocycle.microcycles.findIndex(mc => mc.id === weekId);
  const microTotal  = mesocycle.microcycles.length;

  // Days already added this week
  const addedDayNames = new Set(microcycle.workoutDays.map(d => d.dayOfWeek));
  const availableDays = DAY_OPTIONS.filter(d => !addedDayNames.has(d));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

      {/* ── Header ─────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.breadcrumb}>
          {mesocycle.name}
          <Text style={styles.breadcrumbSep}> / </Text>
          Week {microcycle.weekNumber}
        </Text>
      </View>

      {/* ── Week title ─────────────────────────── */}
      <View style={styles.titleSection}>
        <Text style={styles.weekTitle}>Week {microcycle.weekNumber}</Text>
        <Text style={styles.weekSubtitle}>
          Microcycle {microIndex + 1} of {microTotal} · {mesocycle.name}
        </Text>

        {/* Progress segments */}
        <View style={styles.progressBar}>
          {Array.from({ length: microTotal }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                i < microIndex + 1 ? styles.progressSegmentFilled : styles.progressSegmentEmpty,
                i < microTotal - 1 && { marginRight: spacing.xxs },
              ]}
            />
          ))}
        </View>
      </View>

      {/* ── Workout day list ───────────────────── */}
      <FlatList
        data={microcycle.workoutDays}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          availableDays.length > 0 ? (
            <View style={styles.listFooter}>
              <Pressable
                style={styles.addDayBtn}
                onPress={() => setShowDayPicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Add workout day"
              >
                <Text style={styles.addDayBtnText}>+ Add workout day</Text>
              </Pressable>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyDays}>
            <Text style={styles.emptyText}>No workout days yet</Text>
            <Text style={styles.emptyBody}>Tap "Add workout day" to fill this week</Text>
          </View>
        }
        renderItem={({ item: day }) => {
          const isExpanded     = expandedDayId === day.id;
          const abbrev         = DAY_ABBREV[day.dayOfWeek as DayOfWeek] ?? day.dayOfWeek.slice(0, 3);
          const exerciseCount  = day.exercises?.length ?? day.exerciseCount ?? 0;
          const previewList    = day.exercises?.slice(0, MAX_EXERCISES_PREVIEW) ?? [];
          const hasMore        = exerciseCount > MAX_EXERCISES_PREVIEW;

          return (
            <View style={[styles.dayCard, isExpanded && styles.dayCardExpanded]}>
              {/* Day header row */}
              <Pressable
                style={styles.dayRow}
                onPress={() => setExpandedDayId(isExpanded ? null : day.id)}
                accessibilityRole="button"
                accessibilityLabel={`${abbrev}, ${day.isRestDay ? 'Rest day' : day.label ?? `${exerciseCount} exercises`}`}
                accessibilityState={{ expanded: isExpanded }}
              >
                <View style={[styles.dayBadge, day.isRestDay && styles.dayBadgeRest]}>
                  <Text style={[styles.dayBadgeText, day.isRestDay && styles.dayBadgeTextRest]}>
                    {abbrev}
                  </Text>
                </View>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayLabel}>
                    {day.isRestDay ? 'Rest day' : (day.label ?? 'Workout')}
                  </Text>
                  {!day.isRestDay && exerciseCount > 0 ? (
                    <Text style={styles.dayMeta}>{exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}</Text>
                  ) : null}
                </View>
                <Pressable
                  style={styles.editBtn}
                  onPress={() => navigateToDayEdit(day.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${abbrev} workout`}
                  hitSlop={8}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>
              </Pressable>

              {/* Expanded exercise preview */}
              {isExpanded && previewList.length > 0 ? (
                <View style={styles.exerciseList}>
                  {previewList.map((ex) => (
                    <View key={ex.id} style={styles.exerciseRow}>
                      <Text style={styles.exerciseName} numberOfLines={1}>{ex.exerciseName}</Text>
                      <Text style={styles.exerciseLoad}>{formatLoad(ex)}</Text>
                    </View>
                  ))}
                  {hasMore ? (
                    <Pressable
                      onPress={() => navigateToDayEdit(day.id)}
                      accessibilityRole="button"
                      accessibilityLabel="See all exercises"
                    >
                      <Text style={styles.seeAll}>see all</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        }}
      />

      {/* ── Done button ────────────────────────── */}
      <View style={styles.doneContainer}>
        <Pressable
          style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Done"
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </Pressable>
      </View>

      {/* ── Day picker bottom sheet ────────────── */}
      <Modal
        visible={showDayPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDayPicker(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add workout day</Text>
            {availableDays.map((day) => (
              <Pressable
                key={day}
                style={styles.dayOption}
                onPress={() => handleAddWorkoutDay(day)}
                disabled={isSavingDay}
                accessibilityRole="button"
                accessibilityLabel={day.charAt(0) + day.slice(1).toLowerCase()}
              >
                <View style={styles.dayOptionBadge}>
                  <Text style={styles.dayOptionBadgeText}>{DAY_ABBREV[day]}</Text>
                </View>
                <Text style={styles.dayOptionLabel}>
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.sheetCancelBtn, { backgroundColor: colors.input }]}
              onPress={() => setShowDayPicker(false)}
            >
              <Text style={[styles.sheetCancelText, { color: colors.textPrimary }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },

    // ── Header ──
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
    },
    backBtn: { padding: spacing.xxs },
    backIcon: { ...typography.body, color: colors.brand, fontSize: 20 },
    breadcrumb: { ...typography.caption, color: colors.brand },
    breadcrumbSep: { color: colors.textMuted },

    // ── Title section ──
    titleSection: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      gap: spacing.xxs,
    },
    weekTitle: { ...typography.display, color: colors.textPrimary },
    weekSubtitle: { ...typography.caption, color: colors.textMuted },

    // ── Progress bar ──
    progressBar: {
      flexDirection: 'row',
      marginTop: spacing.sm,
      height: 4,
    },
    progressSegment: {
      flex: 1,
      borderRadius: 2,
      height: 4,
    },
    progressSegmentFilled: { backgroundColor: colors.brand },
    progressSegmentEmpty: { backgroundColor: colors.border },

    // ── List ──
    list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xs },
    separator: { height: spacing.xs },
    listFooter: { paddingTop: spacing.xs },

    // ── Day card ──
    dayCard: {
      backgroundColor: colors.surface,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    dayCardExpanded: {
      borderColor: colors.brand,
      borderWidth: 1.5,
    },
    dayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      gap: spacing.sm,
      minHeight: 60,
    },
    dayBadge: {
      backgroundColor: colors.input,
      borderRadius: 6,
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayBadgeRest: { backgroundColor: colors.background },
    dayBadgeText: { ...typography.label, color: colors.textPrimary, fontSize: 12 },
    dayBadgeTextRest: { color: colors.textMuted },
    dayInfo: { flex: 1, gap: 2 },
    dayLabel: { ...typography.label, color: colors.textPrimary },
    dayMeta: { ...typography.caption, color: colors.textMuted },
    editBtn: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      minHeight: 32,
      justifyContent: 'center',
    },
    editBtnText: { ...typography.link, color: colors.brand },

    // ── Exercise preview ──
    exerciseList: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
      gap: spacing.xxs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.xs,
    },
    exerciseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 32,
    },
    exerciseName: { ...typography.caption, color: colors.textSecondary, flex: 1 },
    exerciseLoad: { ...typography.caption, color: colors.textMuted },
    seeAll: { ...typography.caption, color: colors.brand, marginTop: spacing.xxs },

    // ── Add day button ──
    addDayBtn: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.border,
      borderRadius: radii.sm,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    addDayBtnText: { ...typography.label, color: colors.textMuted },

    // ── Empty ──
    emptyDays: { paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.xs },
    emptyText: { ...typography.label, color: colors.textPrimary },
    emptyBody: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    errorText: { ...typography.body, color: colors.error },

    // ── Done button ──
    doneContainer: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    doneBtn: {
      backgroundColor: colors.brand,
      borderRadius: radii.sm,
      paddingVertical: spacing.md,
      alignItems: 'center',
      minHeight: 52,
      justifyContent: 'center',
    },
    doneBtnPressed: { opacity: 0.85 },
    doneBtnText: { ...typography.button, color: '#fff' },

    // ── Bottom sheet ──
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: {
      borderTopLeftRadius: radii.card,
      borderTopRightRadius: radii.card,
      padding: spacing.xl,
      gap: spacing.sm,
    },
    sheetHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: spacing.xs,
    },
    sheetTitle: { ...typography.display, color: colors.textPrimary, marginBottom: spacing.xxs },
    dayOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      minHeight: 48,
    },
    dayOptionBadge: {
      backgroundColor: colors.brand + '22',
      borderRadius: 6,
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayOptionBadgeText: { ...typography.label, color: colors.brand, fontSize: 12 },
    dayOptionLabel: { ...typography.body, color: colors.textPrimary },
    sheetCancelBtn: {
      borderRadius: radii.sm,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      minHeight: 48,
      justifyContent: 'center',
      marginTop: spacing.xxs,
    },
    sheetCancelText: { ...typography.button },
  });
}

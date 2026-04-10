import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  LoadingSpinner,
  ProgressBar,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
  radii,
  shadows,
} from '@connecthealth/shared/ui';
import {
  usePlanDetail,
  useAddMesocycle,
  useUpdatePlan,
  MesocycleAccordionCard,
  PlanSettingsSheet,
  MesocycleFormSheet,
  MicrocycleFormSheet,
  AddItemRow,
  MOCK_PLAN,
  MockPlanDetailDto,
} from '@connecthealth/training/ui';
import { Goal } from '@connecthealth/training/domain';
import { UpdatePlanDto } from '@connecthealth/training/infrastructure';

// ─── Toggle this to use mock data for wireframe visualization ─────────────────
const USE_MOCK = true;

const GOAL_LABELS: Record<Goal, string> = {
  HYPERTROPHY:  'Hypertrophy',
  STRENGTH:     'Strength',
  WEIGHT_LOSS:  'Weight loss',
  CONDITIONING: 'Conditioning',
  HEALTH:       'Health',
};

export default function PlanBuilderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const { data: apiPlan, isLoading, error } = usePlanDetail(USE_MOCK ? '' : id);
  const addMesocycle = useAddMesocycle(id);
  const updatePlan   = useUpdatePlan();

  // Use mock or API data
  const plan: MockPlanDetailDto | null = USE_MOCK
    ? MOCK_PLAN
    : (apiPlan as unknown as MockPlanDetailDto | null) ?? null;

  // Accordion state
  const [expandedMesoId, setExpandedMesoId] = useState<string | null>(null);

  // Plan settings sheet
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editDuration, setEditDuration] = useState(360);

  // Mesocycle form sheet
  const [mesoFormVisible, setMesoFormVisible] = useState(false);
  const [mesoName, setMesoName] = useState('');
  const [mesoGoal, setMesoGoal] = useState('');
  const [mesoDuration, setMesoDuration] = useState(28);

  // Microcycle form sheet
  const [microFormVisible, setMicroFormVisible] = useState(false);
  const [microName, setMicroName] = useState('');
  const [microGoal, setMicroGoal] = useState('');
  const [microDuration, setMicroDuration] = useState(7);

  const openSettings = () => {
    if (plan) {
      setEditName(plan.name);
      setEditGoal(plan.goal ? GOAL_LABELS[plan.goal as Goal] ?? plan.goal : '');
      setEditDuration(plan.durationDays ?? plan.totalWeeks * 7);
    }
    setSettingsVisible(true);
  };

  const handleSaveSettings = async () => {
    if (USE_MOCK) { setSettingsVisible(false); return; }
    const dto: UpdatePlanDto = {};
    const trimmed = editName.trim();
    if (trimmed) dto.name = trimmed;
    dto.totalWeeks = Math.max(1, Math.round(editDuration / 7));
    try {
      await updatePlan.mutateAsync({ id, dto });
      setSettingsVisible(false);
    } catch {
      Alert.alert('Error', 'Could not update plan. Please try again.');
    }
  };

  const handleAddMesocycle = async () => {
    if (USE_MOCK) {
      setMesoFormVisible(false);
      setMesoName(''); setMesoGoal(''); setMesoDuration(28);
      return;
    }
    if (!mesoName.trim()) {
      Alert.alert('Name required', 'Please enter a mesocycle name.');
      return;
    }
    const weeks = Math.max(1, Math.round(mesoDuration / 7));
    const lastMeso = plan?.mesocycles[plan.mesocycles.length - 1];
    const startWeek = lastMeso ? lastMeso.endWeek + 1 : 1;
    const endWeek   = startWeek + weeks - 1;
    try {
      await addMesocycle.mutateAsync({ name: mesoName.trim(), startWeek, endWeek });
      setMesoFormVisible(false);
      setMesoName(''); setMesoGoal(''); setMesoDuration(28);
    } catch {
      Alert.alert('Error', 'Could not add mesocycle. Please try again.');
    }
  };

  const handleAddMicrocycle = () => {
    // TODO: wire up useAddMicrocycle hook when API endpoint is ready
    setMicroFormVisible(false);
    setMicroName(''); setMicroGoal(''); setMicroDuration(7);
  };

  if (!USE_MOCK && isLoading) return <LoadingSpinner />;

  if (!USE_MOCK && (error || !plan)) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load plan</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plan) return null;

  const goalLabel = plan.goal ? (GOAL_LABELS[plan.goal as Goal] ?? plan.goal) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

      {/* ── Header ─────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerMid}>
          <Text style={styles.planName} numberOfLines={1}>{plan.name}</Text>
          <View style={styles.tagsRow}>
            {goalLabel ? (
              <View style={styles.goalPill}>
                <Text style={styles.goalPillText}>{goalLabel}</Text>
              </View>
            ) : null}
            <Text style={styles.durationText}>
              {plan.durationDays ?? plan.totalWeeks * 7} days
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.gearBtn}
          onPress={openSettings}
          accessibilityRole="button"
          accessibilityLabel="Plan settings"
          hitSlop={8}
        >
          <Ionicons name="settings-outline" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* ── Progress ───────────────────────────── */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>WORKOUTS</Text>
          <Text style={styles.progressCount}>
            {plan.workoutsDone} / {plan.workoutsTotal}
          </Text>
        </View>
        <ProgressBar current={plan.workoutsDone} total={plan.workoutsTotal} height={3} />
      </View>

      {/* ── Mesocycle list ─────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {plan.mesocycles.map((meso) => (
          <MesocycleAccordionCard
            key={meso.id}
            mesocycle={meso}
            expanded={expandedMesoId === meso.id}
            onToggle={() =>
              setExpandedMesoId(expandedMesoId === meso.id ? null : meso.id)
            }
            onMicrocyclePress={(microcycleId) =>
              router.push(`/(app)/plans/${id}/week/${microcycleId}`)
            }
            onAddMicrocycle={() => {
              setMicroName('');
              setMicroGoal('');
              setMicroDuration(7);
              setMicroFormVisible(true);
            }}
          />
        ))}

        <AddItemRow
          label="+ Add mesocycle"
          onPress={() => {
            setMesoName('');
            setMesoGoal('');
            setMesoDuration(28);
            setMesoFormVisible(true);
          }}
          variant="card"
        />

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* ── Save plan sticky button ────────────── */}
      <View style={styles.saveContainer}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
          onPress={() =>
            Alert.alert(
              'Plan saved',
              USE_MOCK ? 'Mock — no API call in preview mode.' : 'Your plan has been saved.'
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Save plan"
        >
          <Text style={styles.saveBtnText}>Save plan</Text>
        </Pressable>
      </View>

      {/* ── Sheets ─────────────────────────────── */}
      <PlanSettingsSheet
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        planName={editName}
        onPlanNameChange={setEditName}
        goal={editGoal}
        onGoalChange={setEditGoal}
        totalDuration={editDuration}
        onTotalDurationChange={setEditDuration}
        onDone={handleSaveSettings}
        isPending={updatePlan.isPending}
      />

      <MesocycleFormSheet
        visible={mesoFormVisible}
        onClose={() => setMesoFormVisible(false)}
        name={mesoName}
        onNameChange={setMesoName}
        goal={mesoGoal}
        onGoalChange={setMesoGoal}
        totalDuration={mesoDuration}
        onTotalDurationChange={setMesoDuration}
        onDone={handleAddMesocycle}
        isPending={addMesocycle.isPending}
      />

      <MicrocycleFormSheet
        visible={microFormVisible}
        onClose={() => setMicroFormVisible(false)}
        name={microName}
        onNameChange={setMicroName}
        goal={microGoal}
        onGoalChange={setMicroGoal}
        totalDuration={microDuration}
        onTotalDurationChange={setMicroDuration}
        onDone={handleAddMicrocycle}
      />

    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },

    // ── Header ──
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xs,
      gap: spacing.xs,
    },
    backBtn: { padding: spacing.xxs, marginTop: 2 },
    headerMid: { flex: 1 },
    planName: {
      ...typography.display,
      color: colors.textPrimary,
      marginBottom: spacing.xxs,
    },
    tagsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      flexWrap: 'wrap',
    },
    goalPill: {
      backgroundColor: colors.brand + '22',
      borderRadius: radii.sm,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
    },
    goalPillText: { ...typography.caption, color: colors.brand },
    durationText:  { ...typography.caption, color: colors.textMuted },
    gearBtn: { padding: spacing.xxs, marginTop: 4 },

    // ── Progress ──
    progressSection: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      gap: spacing.xs,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressLabel: {
      ...typography.caption,
      color: colors.textMuted,
      letterSpacing: 0.8,
    },
    progressCount: { ...typography.caption, color: colors.brand },

    // ── Scroll ──
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: spacing.md,
      gap: spacing.xs,
    },

    // ── Save button ──
    saveContainer: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    saveBtn: {
      backgroundColor: colors.brand,
      borderRadius: radii.sm,
      paddingVertical: spacing.md,
      alignItems: 'center',
      minHeight: 52,
      justifyContent: 'center',
      ...shadows.brandGlow,
    },
    saveBtnPressed: { opacity: 0.85 },
    saveBtnText: { ...typography.button, color: '#fff' },

    // ── Error ──
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    errorText: { ...typography.body, color: colors.error },
  });
}

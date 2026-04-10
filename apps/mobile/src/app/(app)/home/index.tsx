import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  FAB,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
  radii,
  SegmentedControl,
} from '@connecthealth/shared/ui';
import {
  PlanList,
  usePlans,
  useCreatePlan,
} from '@connecthealth/training/ui';
import { PlanSummaryDto } from '@connecthealth/training/infrastructure';

type HomeTab = 'workouts' | 'clients';
type PlanFilter = 'my' | 'active' | 'inactive' | 'drafts';

const TABS: { label: string; value: HomeTab }[] = [
  { label: 'Workout', value: 'workouts' },
  { label: 'Clients', value: 'clients' },
];

const FILTERS: { label: string; value: PlanFilter }[] = [
  { label: 'my', value: 'my' },
  { label: 'active', value: 'active' },
  { label: 'inactive', value: 'inactive' },
  { label: 'drafts', value: 'drafts' },
];

export default function HomeScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [activeTab, setActiveTab] = useState<HomeTab>('workouts');

  const { data: plans, isLoading, error, refetch } = usePlans();
  const createPlan = useCreatePlan();

  const handlePlanPress = (plan: PlanSummaryDto) => {
    router.push(`/(app)/plans/${plan.id}`);
  };

  const handleNewPlan = async () => {
    try {
      const newPlan = await createPlan.mutateAsync({
        name: 'Untitled Plan',
        totalWeeks: 12,
      });
      router.push(`/(app)/plans/${newPlan.id}`);
    } catch {
      Alert.alert('Error', 'Could not create plan. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ── Segment tabs ─────────────────────── */}
      <View style={styles.tabsRow}>
        <SegmentedControl
          options={TABS}
          value={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {activeTab === 'workouts' ? (
        <View style={styles.listContainer}>
          {/* ── Search row ───────────────────── */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={colors.textPlaceholder}
                editable={false}
                accessibilityLabel="Search plans"
                accessibilityHint="Search coming soon"
              />
            </View>
            <View
              style={styles.filterBtn}
              accessibilityRole="button"
              accessibilityLabel="Filter"
            >
              <Ionicons name="options-outline" size={18} color={colors.textMuted} />
            </View>
          </View>

          {/* ── Filter chips ─────────────────── */}
          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipActive]}>
              <Text style={[styles.chipText, styles.chipTextActive]}>my</Text>
            </View>
          </View>

          {/* ── Section title ────────────────── */}
          <Text style={styles.sectionTitle}>My workout plans</Text>

          {/* ── Plan list ────────────────────── */}
          <PlanList
            plans={plans}
            isLoading={isLoading}
            error={error}
            onPlanPress={handlePlanPress}
            onRetry={refetch}
            contentContainerStyle={styles.planListContent}
          />

          {/* ── FAB ──────────────────────────── */}
          <FAB
            onPress={handleNewPlan}
            accessibilityLabel="Create new training plan"
          />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Client management coming in Sprint 4
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    tabsRow: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    // Workouts content
    listContainer: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    // FAB is minHeight:56 at bottom:spacing.xl — ensure last card is never hidden
    planListContent: {
      paddingBottom: spacing.xl + 56 + spacing.xl,
    },

    // ── Search ──
    searchRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.input,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.sm,
      height: 40,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      ...typography.bodySmall,
      color: colors.textPrimary,
    },
    filterBtn: {
      width: 40,
      height: 40,
      backgroundColor: colors.input,
      borderRadius: radii.sm,
      borderWidth: 0.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Chips ──
    chipsRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    chip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    chipActive: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    chipText: {
      ...typography.caption,
      color: colors.textMuted,
    },
    chipTextActive: {
      color: '#fff',
      fontWeight: '500' as const,
    },

    // ── Section ──
    sectionTitle: {
      ...typography.label,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },

    // ── Placeholder ──
    placeholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    placeholderText: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
}

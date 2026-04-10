import React, { useState } from 'react';
import {
  Alert,
  Modal,
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
  const [activeFilter, setActiveFilter] = useState<PlanFilter>('my');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planWeeks, setPlanWeeks] = useState('12');

  const { data: plans, isLoading, error, refetch } = usePlans();
  const createPlan = useCreatePlan();

  const handlePlanPress = (plan: PlanSummaryDto) => {
    router.push(`/(app)/plans/${plan.id}`);
  };

  const handleCreatePlan = async () => {
    if (!planName.trim()) {
      Alert.alert('Name required', 'Please enter a plan name.');
      return;
    }
    const totalWeeks = parseInt(planWeeks, 10);
    if (isNaN(totalWeeks) || totalWeeks < 1) {
      Alert.alert('Invalid weeks', 'Enter a valid number of weeks.');
      return;
    }
    try {
      const newPlan = await createPlan.mutateAsync({
        name: planName.trim(),
        totalWeeks,
      });
      setShowCreateModal(false);
      setPlanName('');
      setPlanWeeks('12');
      router.push(`/(app)/plans/${newPlan.id}`);
    } catch {
      Alert.alert('Error', 'Could not create plan. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Inline tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <Pressable
              key={tab.value}
              style={styles.tab}
              onPress={() => setActiveTab(tab.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'workouts' ? (
        <View style={styles.listContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Search row */}
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons
                  name="search-outline"
                  size={14}
                  color={colors.textPlaceholder}
                />
                <Text style={styles.searchPlaceholder}>Search...</Text>
              </View>
              <View style={styles.filterBtn}>
                <Ionicons
                  name="options-outline"
                  size={16}
                  color={colors.textSecondary}
                />
              </View>
            </View>

            {/* Filter chips */}
            <View style={styles.chips}>
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.value;
                return (
                  <Pressable
                    key={f.value}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => setActiveFilter(f.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.chipTextActive,
                      ]}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Section title */}
            <Text style={styles.sectionTitle}>My workout plans</Text>

            {/* Plan list */}
            <PlanList
              plans={plans}
              isLoading={isLoading}
              error={error}
              onPlanPress={handlePlanPress}
              onRetry={refetch}
            />
          </ScrollView>

          <FAB
            label="New Plan"
            onPress={() => setShowCreateModal(true)}
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

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={styles.modalTitle}>New Training Plan</Text>

            <TextInput
              style={styles.input}
              placeholder="Plan name"
              placeholderTextColor={colors.textPlaceholder}
              value={planName}
              onChangeText={setPlanName}
              autoFocus
              accessibilityLabel="Plan name"
            />
            <View style={styles.weeksRow}>
              <Text style={styles.weeksLabel}>Total weeks</Text>
              <TextInput
                style={[styles.input, styles.weeksInput]}
                value={planWeeks}
                onChangeText={setPlanWeeks}
                keyboardType="number-pad"
                accessibilityLabel="Total weeks"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.input }]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.textPrimary }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.brand },
                  createPlan.isPending && styles.disabledBtn,
                ]}
                onPress={handleCreatePlan}
                disabled={createPlan.isPending}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>
                  {createPlan.isPending ? 'Creating…' : 'Create'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Inline tab bar
    tabBar: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm,
      position: 'relative',
    },
    tabText: {
      ...typography.label,
      color: colors.textMuted,
      fontWeight: '400',
    },
    tabTextActive: {
      color: colors.textPrimary,
      fontWeight: '600',
    },
    tabIndicator: {
      position: 'absolute',
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: colors.brand,
    },

    // Workouts content
    listContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.sm,
      // FAB is minHeight:56 at bottom:spacing.xl — ensure content doesn't scroll under it
      paddingBottom: spacing.xl + 56 + spacing.xl,
    },

    // Search row
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
      borderWidth: 0.5,
      borderColor: colors.border,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      minHeight: 40,
    },
    searchPlaceholder: {
      ...typography.bodySmall,
      color: colors.textPlaceholder,
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

    // Filter chips
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    chip: {
      paddingVertical: 6,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: colors.border,
      backgroundColor: 'transparent',
    },
    chipActive: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    chipText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    chipTextActive: {
      color: colors.textPrimary,
      fontWeight: '500',
    },

    // Section title
    sectionTitle: {
      ...typography.label,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },

    // Clients placeholder
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

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      borderTopLeftRadius: radii.card,
      borderTopRightRadius: radii.card,
      padding: spacing.xl,
      gap: spacing.md,
    },
    modalTitle: { ...typography.display, color: colors.textPrimary },
    input: {
      backgroundColor: colors.input,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...typography.inputText,
      color: colors.textPrimary,
      minHeight: 48,
    },
    weeksRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    weeksLabel: { ...typography.label, color: colors.textSecondary, flex: 1 },
    weeksInput: { width: 80, textAlign: 'center' },
    modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    modalBtn: {
      flex: 1,
      borderRadius: radii.sm,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      minHeight: 48,
      justifyContent: 'center',
    },
    disabledBtn: { opacity: 0.5 },
    modalBtnText: { ...typography.button },
  });
}

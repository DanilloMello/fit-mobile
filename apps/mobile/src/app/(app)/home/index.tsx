import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import {
  FAB,
  SegmentedControl,
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

const TABS = [
  { label: 'Workouts', value: 'workouts' as HomeTab },
  { label: 'Clients', value: 'clients' as HomeTab },
];

export default function HomeScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [activeTab, setActiveTab] = useState<HomeTab>('workouts');
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
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <SegmentedControl
          options={TABS}
          value={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {activeTab === 'workouts' ? (
        <View style={styles.listContainer}>
          <PlanList
            plans={plans}
            isLoading={isLoading}
            error={error}
            onPlanPress={handlePlanPress}
            onRetry={refetch}
          />
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
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      gap: spacing.md,
      backgroundColor: colors.background,
    },
    title: {
      ...typography.display,
      color: colors.textPrimary,
    },
    listContainer: {
      flex: 1,
    },
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

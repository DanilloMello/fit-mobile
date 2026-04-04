import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import {
  FAB,
  LoadingSpinner,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
  radii,
} from '@connecthealth/shared/ui';
import { MesocycleCard } from '@connecthealth/training/ui';
import {
  usePlanDetail,
  useAddMesocycle,
  useDeleteMesocycle,
} from '@connecthealth/training/ui';
import { MesocycleDto } from '@connecthealth/training/infrastructure';

export default function PlanBuilderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const { data: plan, isLoading, error } = usePlanDetail(id);
  const addMesocycle = useAddMesocycle(id);
  const deleteMesocycle = useDeleteMesocycle(id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [mesoName, setMesoName] = useState('');
  const [mesoStart, setMesoStart] = useState('');
  const [mesoEnd, setMesoEnd] = useState('');

  const handleAddMesocycle = async () => {
    const startWeek = parseInt(mesoStart, 10);
    const endWeek = parseInt(mesoEnd, 10);

    if (!mesoName.trim() || isNaN(startWeek) || isNaN(endWeek)) {
      Alert.alert('Invalid input', 'Please fill in all fields correctly.');
      return;
    }
    if (startWeek >= endWeek) {
      Alert.alert('Invalid weeks', 'End week must be greater than start week.');
      return;
    }

    try {
      await addMesocycle.mutateAsync({
        name: mesoName.trim(),
        startWeek,
        endWeek,
      });
      setShowAddModal(false);
      setMesoName('');
      setMesoStart('');
      setMesoEnd('');
    } catch {
      Alert.alert('Error', 'Could not add mesocycle. Please try again.');
    }
  };

  const handleDeleteMesocycle = (meso: MesocycleDto) => {
    Alert.alert(
      'Delete Mesocycle',
      `Delete "${meso.name}"? This will remove all workout days inside it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMesocycle.mutate(meso.id),
        },
      ]
    );
  };

  const handleWorkoutDayPress = (dayId: string) => {
    router.push(`/(app)/plans/${id}/workout-day/${dayId}`);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !plan) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load plan</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
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
        <View style={styles.headerText}>
          <Text style={styles.planName} numberOfLines={1}>
            {plan.name}
          </Text>
          <Text style={styles.planMeta}>
            {plan.totalWeeks}w · {plan.status}
          </Text>
        </View>
      </View>

      {/* Mesocycles */}
      <FlatList
        data={plan.mesocycles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View>
            <MesocycleCard
              mesocycle={item}
              onDelete={handleDeleteMesocycle}
            />
            {/* Workout days within this mesocycle */}
            {item.microcycles.flatMap((micro) =>
              micro.workoutDays.map((day) => (
                <Pressable
                  key={day.id}
                  style={styles.dayRow}
                  onPress={() => handleWorkoutDayPress(day.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.label ?? day.dayOfWeek}, ${day.exerciseCount ?? 0} exercises`}
                >
                  <Text style={styles.dayLabel}>
                    {day.label ?? day.dayOfWeek}
                  </Text>
                  <Text style={styles.dayMeta}>
                    Week {micro.weekNumber} · {day.exerciseCount ?? 0} exercises
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No mesocycles yet</Text>
            <Text style={styles.emptyBody}>
              Tap + to add your first training block
            </Text>
          </View>
        }
      />

      <FAB
        label="Add Block"
        onPress={() => setShowAddModal(true)}
        accessibilityLabel="Add mesocycle"
      />

      {/* Add Mesocycle Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={styles.modalTitle}>New Mesocycle</Text>

            <TextInput
              style={styles.input}
              placeholder="Name (e.g. Hypertrophy)"
              placeholderTextColor={colors.textPlaceholder}
              value={mesoName}
              onChangeText={setMesoName}
              accessibilityLabel="Mesocycle name"
            />
            <View style={styles.weekRow}>
              <TextInput
                style={[styles.input, styles.weekInput]}
                placeholder="Start week"
                placeholderTextColor={colors.textPlaceholder}
                value={mesoStart}
                onChangeText={setMesoStart}
                keyboardType="number-pad"
                accessibilityLabel="Start week"
              />
              <TextInput
                style={[styles.input, styles.weekInput]}
                placeholder="End week"
                placeholderTextColor={colors.textPlaceholder}
                value={mesoEnd}
                onChangeText={setMesoEnd}
                keyboardType="number-pad"
                accessibilityLabel="End week"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.input }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.textPrimary }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.brand }]}
                onPress={handleAddMesocycle}
                disabled={addMesocycle.isPending}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>
                  {addMesocycle.isPending ? 'Adding…' : 'Add'}
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
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backBtn: { padding: spacing.xxs },
    backIcon: { ...typography.body, color: colors.brand, fontSize: 20 },
    headerText: { flex: 1 },
    planName: {
      ...typography.display,
      color: colors.textPrimary,
    },
    planMeta: { ...typography.caption, color: colors.textMuted },
    list: { padding: spacing.md, paddingBottom: spacing.xxxl },
    separator: { height: spacing.sm },
    dayRow: {
      marginTop: spacing.xxs,
      marginLeft: spacing.md,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderLeftWidth: 2,
      borderLeftColor: colors.border,
    },
    dayLabel: { ...typography.label, color: colors.textPrimary },
    dayMeta: { ...typography.caption, color: colors.textMuted },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.xs,
    },
    emptyText: { ...typography.display, color: colors.textPrimary },
    emptyBody: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
    errorText: { ...typography.body, color: colors.error },
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
    weekRow: { flexDirection: 'row', gap: spacing.sm },
    weekInput: { flex: 1 },
    modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    modalBtn: {
      flex: 1,
      borderRadius: radii.sm,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      minHeight: 48,
      justifyContent: 'center',
    },
    modalBtnText: { ...typography.button },
  });
}

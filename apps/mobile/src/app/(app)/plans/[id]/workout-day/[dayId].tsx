import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
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
import { useExercises } from '@connecthealth/training/ui';
import { ExerciseDto, workoutDayExerciseApi } from '@connecthealth/training/infrastructure';

export default function WorkoutFillerScreen() {
  const { id: planId, dayId } = useLocalSearchParams<{
    id: string;
    dayId: string;
  }>();
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const { data: exercises = [], isLoading: exercisesLoading } = useExercises();

  const [showPicker, setShowPicker] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(null);
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [load, setLoad] = useState('');
  const [restSeconds, setRestSeconds] = useState('90');
  const [isSaving, setIsSaving] = useState(false);
  const [addedExercises, setAddedExercises] = useState<ExerciseDto[]>([]);

  const handleAddExercise = async () => {
    if (!selectedExercise) {
      Alert.alert('No exercise selected', 'Please pick an exercise first.');
      return;
    }
    const parsedSets = parseInt(sets, 10);
    const parsedRest = parseInt(restSeconds, 10);
    if (isNaN(parsedSets) || parsedSets < 1) {
      Alert.alert('Invalid sets', 'Enter a valid number of sets.');
      return;
    }

    setIsSaving(true);
    try {
      await workoutDayExerciseApi.add(dayId, {
        exerciseId: selectedExercise.id,
        sets: parsedSets,
        reps: reps.trim() || '10',
        load: load.trim() || undefined,
        restSeconds: isNaN(parsedRest) ? undefined : parsedRest,
      });
      setAddedExercises((prev) => [...prev, selectedExercise]);
      setSelectedExercise(null);
      setSets('3');
      setReps('10');
      setLoad('');
      setRestSeconds('90');
      setShowPicker(false);
    } catch {
      Alert.alert('Error', 'Could not add exercise. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
        <Text style={styles.headerTitle}>Workout Day</Text>
      </View>

      {/* Added exercises list */}
      <FlatList
        data={addedExercises}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <View style={styles.exerciseRow}>
            <Text style={styles.exerciseIndex}>{index + 1}</Text>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseMeta}>
                {item.muscleGroup} · {item.equipment}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No exercises yet</Text>
            <Text style={styles.emptyBody}>Tap + to add exercises to this day</Text>
          </View>
        }
      />

      <FAB
        label="Add Exercise"
        onPress={() => setShowPicker(true)}
        accessibilityLabel="Add exercise to workout day"
      />

      {/* Exercise picker modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={styles.modalTitle}>Add Exercise</Text>

            {/* Exercise selector */}
            {selectedExercise ? (
              <Pressable
                style={styles.selectedExercise}
                onPress={() => setSelectedExercise(null)}
                accessibilityRole="button"
                accessibilityLabel="Change selected exercise"
              >
                <Text style={styles.selectedName}>{selectedExercise.name}</Text>
                <Text style={styles.selectedMeta}>
                  {selectedExercise.muscleGroup} · tap to change
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.exercisePicker, { backgroundColor: colors.input }]}>
                {exercisesLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    style={styles.exercisePickerList}
                    renderItem={({ item }) => (
                      <Pressable
                        style={styles.pickerItem}
                        onPress={() => setSelectedExercise(item)}
                        accessibilityRole="button"
                        accessibilityLabel={item.name}
                      >
                        <Text style={styles.pickerItemName}>{item.name}</Text>
                        <Text style={styles.pickerItemMeta}>
                          {item.muscleGroup}
                        </Text>
                      </Pressable>
                    )}
                    ItemSeparatorComponent={() => (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.border },
                        ]}
                      />
                    )}
                  />
                )}
              </View>
            )}

            {/* Sets / Reps / Load / Rest */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Sets</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="number-pad"
                  accessibilityLabel="Sets"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Reps</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={reps}
                  onChangeText={setReps}
                  accessibilityLabel="Reps"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Load</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={load}
                  onChangeText={setLoad}
                  placeholder="@80%"
                  placeholderTextColor={colors.textPlaceholder}
                  accessibilityLabel="Load"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Rest (s)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={restSeconds}
                  onChangeText={setRestSeconds}
                  keyboardType="number-pad"
                  accessibilityLabel="Rest seconds"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.input }]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.textPrimary }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.brand },
                  (!selectedExercise || isSaving) && styles.disabledBtn,
                ]}
                onPress={handleAddExercise}
                disabled={!selectedExercise || isSaving}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>
                  {isSaving ? 'Saving…' : 'Add'}
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
    },
    backBtn: { padding: spacing.xxs },
    backIcon: { ...typography.body, color: colors.brand, fontSize: 20 },
    headerTitle: { ...typography.display, color: colors.textPrimary },
    list: { padding: spacing.md, paddingBottom: spacing.xxxl },
    separator: { height: spacing.xs },
    exerciseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radii.sm,
    },
    exerciseIndex: {
      ...typography.label,
      color: colors.textMuted,
      width: 24,
      textAlign: 'center',
    },
    exerciseInfo: { flex: 1 },
    exerciseName: { ...typography.label, color: colors.textPrimary },
    exerciseMeta: { ...typography.caption, color: colors.textMuted },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.xs,
    },
    emptyText: { ...typography.display, color: colors.textPrimary },
    emptyBody: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
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
      maxHeight: '85%',
    },
    modalTitle: { ...typography.display, color: colors.textPrimary },
    selectedExercise: {
      backgroundColor: colors.input,
      borderRadius: radii.sm,
      padding: spacing.md,
    },
    selectedName: { ...typography.label, color: colors.textPrimary },
    selectedMeta: { ...typography.caption, color: colors.brand },
    exercisePicker: {
      borderRadius: radii.sm,
      maxHeight: 200,
    },
    exercisePickerList: { maxHeight: 200 },
    pickerItem: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 48,
      justifyContent: 'center',
    },
    pickerItemName: { ...typography.label, color: colors.textPrimary },
    pickerItemMeta: { ...typography.caption, color: colors.textMuted },
    divider: { height: 1 },
    fieldRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    fieldGroup: { flex: 1, gap: spacing.xxs },
    fieldLabel: { ...typography.caption, color: colors.textMuted },
    fieldInput: {
      backgroundColor: colors.input,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      ...typography.inputText,
      color: colors.textPrimary,
      minHeight: 40,
      textAlign: 'center',
    },
    modalActions: { flexDirection: 'row', gap: spacing.sm },
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

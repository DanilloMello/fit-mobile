import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  InputField,
  StepperField,
  radii,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';

interface MicrocycleFormSheetProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (name: string) => void;
  goal: string;
  onGoalChange: (goal: string) => void;
  totalDuration: number;
  onTotalDurationChange: (days: number) => void;
  onDone: () => void;
}

export function MicrocycleFormSheet({
  visible,
  onClose,
  name,
  onNameChange,
  goal,
  onGoalChange,
  totalDuration,
  onTotalDurationChange,
  onDone,
}: MicrocycleFormSheetProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New microcycle</Text>
            <Pressable
              onPress={onDone}
              accessibilityRole="button"
              accessibilityLabel="Done"
              hitSlop={8}
            >
              <Text style={styles.doneBtn}>Done</Text>
            </Pressable>
          </View>

          {/* Fields */}
          <InputField
            label="NAME"
            value={name}
            onChangeText={onNameChange}
            placeholder="e.g. Accumulation"
          />
          <InputField
            label="GOAL"
            value={goal}
            onChangeText={onGoalChange}
            placeholder="e.g. Build work capacity"
          />
          <StepperField
            label="TOTAL DURATION"
            value={totalDuration}
            onChange={onTotalDurationChange}
            min={1}
            max={28}
            formatValue={(v) => `${v} days`}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      borderTopLeftRadius: radii.card,
      borderTopRightRadius: radii.card,
      padding: spacing.xl,
      gap: spacing.md,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: spacing.xs,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      ...typography.display,
      color: colors.textPrimary,
    },
    doneBtn: {
      ...typography.link,
      color: colors.brand,
    },
  });
}

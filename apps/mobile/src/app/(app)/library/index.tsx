import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing, typography, useThemeColors, ColorPalette } from '@connecthealth/shared/ui';

export default function LibraryScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.placeholder}>Exercise library coming in Sprint 3</Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      gap: spacing.xs,
    },
    title: {
      ...typography.display,
      color: colors.textPrimary,
    },
    placeholder: {
      ...typography.body,
      color: colors.textMuted,
    },
  });
}

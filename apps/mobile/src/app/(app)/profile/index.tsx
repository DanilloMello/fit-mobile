import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useThemeColors, ColorPalette } from '@connecthealth/shared/ui';

export default function ProfileScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        Your account settings
      </Text>
      <Text style={styles.placeholder}>
        Placeholder - Profile screen to be implemented
      </Text>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: spacing.lg,
    },
    title: {
      ...typography.display,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      marginBottom: spacing.xxs,
    },
    placeholder: {
      ...typography.bodySmall,
      color: colors.textMuted,
    },
  });
}

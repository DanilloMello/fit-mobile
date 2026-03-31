import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useThemeColors, ColorPalette } from '@connecthealth/shared/ui';

export default function ClientsScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clients</Text>
      <Text style={styles.subtitle}>
        Manage your clients
      </Text>
      <Text style={styles.placeholder}>
        Placeholder - Client list to be implemented in Sprint 2
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

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { useAuth } from '@connecthealth/identity/ui';
import { spacing, typography, useThemeColors, ColorPalette } from '@connecthealth/shared/ui';

export default function MagicLinkVerifyScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { verifyMagicLink, error, isAuthenticated } = useAuth();
  const colors = useThemeColors();
  const styles = createStyles(colors);

  useEffect(() => {
    if (token) {
      verifyMagicLink(token);
    }
  }, [token]);

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  if (error) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brand} />
      <Text style={styles.message}>Verificando link...</Text>
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
      gap: spacing.md,
    },
    message: {
      ...typography.body,
      color: colors.textPrimary,
    },
  });
}

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { useAuth } from '@connecthealth/identity/ui';

export default function MagicLinkVerifyScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { verifyMagicLink, error, isAuthenticated } = useAuth();

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
      <ActivityIndicator size="large" color="#6C47FF" />
      <Text style={styles.message}>Verificando link...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    gap: 16,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

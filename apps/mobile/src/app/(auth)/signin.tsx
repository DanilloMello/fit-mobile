import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { useAuth, SignInForm } from '@connecthealth/identity/ui';
import { colors } from '@connecthealth/shared/ui';

export default function SignInScreen() {
  const { signIn, isLoading } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await signIn(email.trim(), password);
      router.replace('/(app)/home');
    } catch {
      Alert.alert('Sign In Failed', 'Invalid email or password. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <SignInForm
        isLoading={isLoading}
        onSignIn={handleSignIn}
        onSignUp={() => router.push('/(auth)/signup')}
        onForgotPassword={() => {
          // TODO: implement forgot password screen
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});

import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth, AuthForm } from '@connecthealth/identity/ui';
import { useThemeColors } from '@connecthealth/shared/ui';

export default function SignInScreen() {
  const { sendMagicLink, signInWithGoogle, isLoading } = useAuth();
  const colors = useThemeColors();

  const handleSendMagicLink = async (email: string, name?: string) => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    await sendMagicLink(email.trim(), name?.trim());
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthForm
            isLoading={isLoading}
            onSendMagicLink={handleSendMagicLink}
            onGoogleSignIn={signInWithGoogle}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

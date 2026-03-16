import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  InputField,
  spacing,
  typography,
  radii,
  shadows,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';

export interface SignUpFormProps {
  isLoading: boolean;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onSignIn: () => void;
}

export function SignUpForm({ isLoading, onSignUp, onSignIn }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handleSignUp = () => {
    onSignUp(name.trim(), email.trim(), password);
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <View style={styles.heading}>
        <Text style={styles.brandText}>
          <Text style={styles.brandConnect}>Connect</Text>
          <Text style={styles.brandHealth}>health</Text>
        </Text>
        <Text style={styles.subtitle}>Create your account to get started.</Text>
      </View>

      {/* Form fields */}
      <View style={styles.form}>
        <InputField
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          autoCapitalize="words"
          accessibilityLabel="Full name"
        />

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address"
        />

        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry={!showPassword}
          showSecureToggle
          onToggleSecure={() => setShowPassword((prev) => !prev)}
          accessibilityLabel="Password"
        />

        {/* Sign Up CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Sign up"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.ctaButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Sign-in link */}
      <View style={styles.signInRow}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={onSignIn}
          accessibilityRole="link"
          accessibilityLabel="Go to sign in"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.signInLink}>Sign in!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.xxl,
      justifyContent: 'center',
    },
    heading: {
      alignItems: 'center',
      marginBottom: spacing.xxxl,
    },
    brandText: {
      ...typography.display,
      textAlign: 'center',
    },
    brandConnect: {
      color: colors.textPrimary,
    },
    brandHealth: {
      color: colors.brand,
    },
    subtitle: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    form: {
      gap: spacing.lg,
    },
    ctaButton: {
      backgroundColor: colors.brand,
      borderRadius: radii.sm,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.brandGlow,
    },
    ctaButtonDisabled: {
      opacity: 0.6,
    },
    ctaButtonText: {
      ...typography.button,
      color: colors.textSecondary,
    },
    signInRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    signInText: {
      ...typography.bodySmall,
      color: colors.textPlaceholder,
    },
    signInLink: {
      ...typography.link,
      color: colors.textPrimary,
    },
  });
}

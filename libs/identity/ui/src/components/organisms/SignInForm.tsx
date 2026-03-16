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

export interface SignInFormProps {
  isLoading: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp: () => void;
  onSocialSignIn?: (provider: 'google' | 'apple') => void;
}

export function SignInForm({
  isLoading,
  onSignIn,
  onForgotPassword,
  onSignUp,
  onSocialSignIn,
}: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handleSignIn = () => {
    onSignIn(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <View style={styles.heading}>
        <Text style={styles.brandText}>
          <Text style={styles.brandConnect}>Connect</Text>
          <Text style={styles.brandHealth}>health</Text>
        </Text>
        <Text style={styles.subtitle}>Sign in to access your health hub.</Text>
      </View>

      {/* Form fields */}
      <View style={styles.form}>
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
          rightLabel={
            onForgotPassword
              ? { text: 'Forgot password?', onPress: onForgotPassword }
              : undefined
          }
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          showSecureToggle
          onToggleSecure={() => setShowPassword((prev) => !prev)}
          accessibilityLabel="Password"
        />

        {/* Sign In CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.ctaButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => onSocialSignIn?.('google')}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
        >
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => onSocialSignIn?.('apple')}
          accessibilityRole="button"
          accessibilityLabel="Continue with Apple"
        >
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Sign-up link */}
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>New here? </Text>
        <TouchableOpacity
          onPress={onSignUp}
          accessibilityRole="link"
          accessibilityLabel="Go to sign up"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.signUpLink}>Sign up!</Text>
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    ...typography.caption,
    color: colors.textPlaceholder,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  socialButton: {
    flex: 1,
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    ...typography.buttonSecondary,
    color: colors.textPrimary,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signUpText: {
    ...typography.bodySmall,
    color: colors.textPlaceholder,
  },
  signUpLink: {
    ...typography.link,
    color: colors.textPrimary,
  },
  });
}

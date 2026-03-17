import React, { useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  InputField,
  spacing,
  typography,
  radii,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AuthMode = 'signin' | 'signup';
type AuthStep = 'form' | 'sent';

export interface AuthFormProps {
  isLoading: boolean;
  onSendMagicLink: (email: string, name?: string) => Promise<void>;
  onGoogleSignIn?: () => void;
  googleDisabled?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address.';
  return undefined;
}

export function AuthForm({ isLoading, onSendMagicLink, onGoogleSignIn, googleDisabled }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [step, setStep] = useState<AuthStep>('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const colors = useThemeColors();
  const styles = createStyles(colors);

  const switchMode = (newMode: AuthMode) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMode(newMode);
    setEmailError(undefined);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(validateEmail(text));
  };

  const handleSubmit = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    try {
      await onSendMagicLink(email.trim(), mode === 'signup' ? name.trim() : undefined);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setStep('sent');
    } catch {
      // Error surfaced via hook
    }
  };

  // — Sent confirmation —
  if (step === 'sent') {
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.brandText}>
            <Text style={styles.brandConnect}>Connect</Text>
            <Text style={styles.brandHealth}>health</Text>
          </Text>
          <Text style={styles.subtitle}>Check your email.</Text>
        </View>

        <View style={styles.sentCard}>
          <Text style={styles.sentTitle}>Magic link sent!</Text>
          <Text style={styles.sentBody}>
            We sent a link to{'\n'}
            <Text style={styles.sentEmail}>{email}</Text>
          </Text>
          <Text style={styles.sentHelper}>
            Tap the link in the email to sign in instantly.{'\n'}No password needed.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.magicLinkButton}
          onPress={() => onSendMagicLink(email.trim(), mode === 'signup' ? name.trim() : undefined)}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Resend magic link"
          accessibilityState={{ busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textSecondary} />
          ) : (
            <Text style={styles.magicLinkButtonText}>Resend link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStep('form')}
          accessibilityRole="button"
          accessibilityLabel="Change email"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.footerText}>
            Wrong email?{' '}
            <Text style={styles.footerLink}>Change it</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // — Form —
  return (
    <View style={styles.container}>
      {/* Brand */}
      <View style={styles.heading}>
        <Text style={styles.brandText}>
          <Text style={styles.brandConnect}>Connect</Text>
          <Text style={styles.brandHealth}>health</Text>
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'signin'
            ? 'Sign in to access your health hub.'
            : 'Create your account to get started.'}
        </Text>
      </View>

      {/* Google button */}
      <TouchableOpacity
        style={[styles.googleButton, googleDisabled && styles.buttonDisabled]}
        onPress={onGoogleSignIn}
        disabled={googleDisabled}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
        accessibilityState={{ disabled: googleDisabled }}
      >
        <Ionicons name="logo-google" size={20} color={colors.textPrimary} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>
          {mode === 'signin' ? 'or continue with email' : 'or sign up with email'}
        </Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email form */}
      <View style={styles.form}>
        {mode === 'signup' && (
          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
            accessibilityLabel="Full name"
          />
        )}

        <InputField
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address"
          error={emailError}
        />

        <TouchableOpacity
          style={[styles.magicLinkButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Send Magic Link"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textSecondary} />
          ) : (
            <Text style={styles.magicLinkButtonText}>Send Magic Link</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer mode switch */}
      <View style={styles.footerRow}>
        {mode === 'signin' ? (
          <>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity
              onPress={() => switchMode('signup')}
              accessibilityRole="button"
              accessibilityLabel="Go to sign up"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLink}>Sign up!</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => switchMode('signin')}
              accessibilityRole="button"
              accessibilityLabel="Go to sign in"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLink}>Sign in!</Text>
            </TouchableOpacity>
          </>
        )}
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
      marginBottom: spacing.xxl,
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
    // Google button — primary CTA
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand,
      borderRadius: radii.sm,
      height: 56,
      marginBottom: spacing.lg,
    },
    googleIcon: {
      marginRight: spacing.sm,
    },
    googleButtonText: {
      ...typography.button,
      color: colors.textPrimary,
    },
    // Divider
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
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
    // Email form
    form: {
      gap: spacing.lg,
    },
    // Send Magic Link button — secondary
    magicLinkButton: {
      height: 56,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.input,
    },
    magicLinkButtonText: {
      ...typography.button,
      color: colors.textSecondary,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    // Footer
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    footerText: {
      ...typography.bodySmall,
      color: colors.textPlaceholder,
    },
    footerLink: {
      ...typography.link,
      color: colors.textPrimary,
    },
    // Sent state
    sentCard: {
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      gap: spacing.sm,
    },
    sentTitle: {
      ...typography.button,
      color: colors.textPrimary,
    },
    sentBody: {
      ...typography.body,
      color: colors.textMuted,
    },
    sentEmail: {
      ...typography.button,
      color: colors.brand,
    },
    sentHelper: {
      ...typography.bodySmall,
      color: colors.textPlaceholder,
    },
  });
}

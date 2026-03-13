import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../tokens/colors';
import { radii } from '../../tokens/radii';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export interface InputFieldProps {
  label: string;
  rightLabel?: { text: string; onPress: () => void };
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  showSecureToggle?: boolean;
  onToggleSecure?: () => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  accessibilityLabel?: string;
}

export function InputField({
  label,
  rightLabel,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showSecureToggle = false,
  onToggleSecure,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  accessibilityLabel,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {rightLabel && (
          <TouchableOpacity
            onPress={rightLabel.onPress}
            accessibilityRole="button"
            accessibilityLabel={rightLabel.text}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.rightLabel}>{rightLabel.text}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          accessibilityLabel={accessibilityLabel ?? label}
        />

        {showSecureToggle && onToggleSecure && (
          <TouchableOpacity
            onPress={onToggleSecure}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
            accessibilityState={{ expanded: !secureTextEntry }}
          >
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textPlaceholder}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxs,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  rightLabel: {
    ...typography.label,
    color: colors.textPlaceholder,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    height: 56,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.inputText,
    color: colors.textSecondary,
  },
  eyeButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

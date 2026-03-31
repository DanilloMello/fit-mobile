import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
}) => {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color ?? colors.brand} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

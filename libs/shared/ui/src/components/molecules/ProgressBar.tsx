import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemeColors, ColorPalette } from '../../hooks/useThemeColors';

interface ProgressBarProps {
  current: number;
  total: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
}

export function ProgressBar({
  current,
  total,
  height = 3,
  trackColor,
  fillColor,
}: ProgressBarProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors, height);

  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <View
      style={[styles.track, trackColor ? { backgroundColor: trackColor } : null]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current }}
      accessibilityLabel={`${current} of ${total}`}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${pct}%`,
            backgroundColor: fillColor ?? colors.brand,
          },
        ]}
      />
    </View>
  );
}

function createStyles(colors: ColorPalette, height: number) {
  return StyleSheet.create({
    track: {
      width: '100%',
      height,
      borderRadius: height / 2,
      backgroundColor: colors.input,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: height / 2,
    },
  });
}

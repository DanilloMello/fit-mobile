import { useColorScheme } from 'react-native';

import { darkColors, lightColors, ColorPalette } from '../tokens/colors';

export function useThemeColors(): ColorPalette {
  const scheme = useColorScheme();
  return scheme === 'light' ? lightColors : darkColors;
}

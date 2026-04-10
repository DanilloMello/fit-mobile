import { useColorScheme } from 'react-native';
export type { ColorPalette } from '../tokens/colors';
import { darkColors, lightColors, ColorPalette } from '../tokens/colors';

export function useThemeColors(): ColorPalette {
  const scheme = useColorScheme();
  return scheme === 'light' ? lightColors : darkColors;
}


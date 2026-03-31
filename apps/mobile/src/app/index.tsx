import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useThemeColors, ColorPalette } from '@connecthealth/shared/ui';

export default function Page() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: spacing.xl,
    },
    main: {
      flex: 1,
      justifyContent: 'center',
      maxWidth: 960,
      marginHorizontal: 'auto',
    },
    title: {
      ...typography.display,
      fontSize: 64,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.body,
      fontSize: 36,
      color: colors.textMuted,
    },
  });
}

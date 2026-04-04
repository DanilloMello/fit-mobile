import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  LoadingSpinner,
  spacing,
  typography,
  useThemeColors,
  ColorPalette,
} from '@connecthealth/shared/ui';
import { PlanSummaryDto } from '@connecthealth/training/infrastructure';

import { PlanCard } from '../molecules/PlanCard';

interface PlanListProps {
  plans: PlanSummaryDto[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onPlanPress: (plan: PlanSummaryDto) => void;
  onRetry: () => void;
  ListHeaderComponent?: React.ReactElement;
}

export function PlanList({
  plans,
  isLoading,
  error,
  onPlanPress,
  onRetry,
  ListHeaderComponent,
}: PlanListProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load plans</Text>
        <Text style={styles.retryText} onPress={onRetry}>
          Try again
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={plans ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PlanCard plan={item} onPress={onPlanPress} />
      )}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No plans yet</Text>
          <Text style={styles.emptyBody}>
            Tap + to create your first training plan
          </Text>
        </View>
      }
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    separator: {
      height: spacing.sm,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.xs,
    },
    emptyTitle: {
      ...typography.display,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    emptyBody: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: 'center',
    },
    errorText: {
      ...typography.body,
      color: colors.error,
      textAlign: 'center',
    },
    retryText: {
      ...typography.link,
      color: colors.brand,
    },
  });
}

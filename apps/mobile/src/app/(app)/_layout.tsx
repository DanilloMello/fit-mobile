import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColors } from '@connecthealth/shared/ui';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  color,
  size,
}: {
  name: IoniconsName;
  color: string;
  size: number;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function AppLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.select({ ios: 80, android: 60 }),
          paddingBottom: Platform.select({ ios: 20, android: 8 }),
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="financial/index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="wallet-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="barbell-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      {/* Non-tab screens — navigable but hidden from tab bar */}
      <Tabs.Screen name="clients/index" options={{ href: null }} />
      <Tabs.Screen name="plans/index" options={{ href: null }} />
      <Tabs.Screen name="plans/[id]" options={{ href: null, headerShown: true }} />
      <Tabs.Screen
        name="plans/[id]/workout-day/[dayId]"
        options={{ href: null, headerShown: true }}
      />
    </Tabs>
  );
}

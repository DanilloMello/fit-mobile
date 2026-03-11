import React from 'react';
import { Redirect, Slot, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@connecthealth/identity/application';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();

  const inAuthGroup = segments[0] === '(auth)';

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auth)/signin" />;
  }

  if (isAuthenticated && inAuthGroup) {
    return <Redirect href="/(app)/home" />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <AuthGuard />
    </QueryClientProvider>
  );
}

# Patterns

> Code patterns for entities, API clients, stores, hooks, auth guard, screens, and the shared API client.

---

## 1. Entity (`libs/{module}/domain/src/entities/`)

```typescript
import { Entity, EntityProps } from '@connecthealth/shared/domain';

export interface ClientProps extends EntityProps {
  name: string;
  email: string;
  phone?: string;
  personalId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Client extends Entity<ClientProps> {
  get name(): string { return this.props.name; }
  get isActive(): boolean { return this.props.isActive; }
}
```

---

## 2. API Client (`libs/{module}/infrastructure/src/api/`)

```typescript
import { apiClient } from '@connecthealth/shared/utils';
import { ClientProps } from '@connecthealth/client/domain';

export const clientApi = {
  getAll: async (): Promise<ClientProps[]> => {
    const response = await apiClient.get<ClientProps[]>('/clients');
    return response.data;
  },
  create: async (data: Omit<ClientProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientProps> => {
    const response = await apiClient.post<ClientProps>('/clients', data);
    return response.data;
  },
};
```

> **Auth API envelope**: backend wraps auth responses in `{ data: T }`, so unwrap with `response.data.data` for auth endpoints only.

---

## 3. Store (`libs/{module}/application/src/store/`) — Zustand, no persist

```typescript
import { create } from 'zustand';
import { setAuthToken } from '@connecthealth/shared/utils';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, accessToken: null, refreshToken: null, isAuthenticated: false,
  setAuth: (user, accessToken, refreshToken) => {
    setAuthToken(accessToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },
  clearAuth: () => {
    setAuthToken(null);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
```

---

## 4. Hook (`libs/{module}/ui/src/hooks/`)

```typescript
import { useState } from 'react';
import { authApi } from '@connecthealth/identity/infrastructure';
import { useAuthStore } from '@connecthealth/identity/application';

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: authUser, tokens } = await authApi.signIn({ email, password });
      setAuth(authUser, tokens.accessToken, tokens.refreshToken);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to sign in');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isAuthenticated, isLoading, error, signIn };
}
```

---

## 5. Root Layout Auth Guard (`apps/mobile/src/app/_layout.tsx`)

```typescript
// Expo Router 4: use declarative <Redirect>, NOT useEffect + useRouter
// useRouter().replace() inside useEffect causes race conditions in Expo Router 4
import { Redirect, Slot, useSegments } from 'expo-router';
import { useAuthStore } from '@connecthealth/identity/application';

function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auth)';

  if (!isAuthenticated && !inAuthGroup) return <Redirect href="/(auth)/signin" />;
  if (isAuthenticated && inAuthGroup) return <Redirect href="/(app)/home" />;

  return <Slot />;
}
```

---

## 6. Screen (`apps/mobile/src/app/(app)/{feature}/index.tsx`)

```typescript
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@connecthealth/identity/ui';

export default function SignInScreen() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await signIn(email.trim(), password);
      router.replace('/(app)/home');
    } catch {
      Alert.alert('Sign In Failed', 'Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email input"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ /* always use StyleSheet.create, no inline styles */ });
```

---

## 7. Shared API Client (`libs/shared/utils/src/api-client.ts`)

```typescript
// Base URL from EXPO_PUBLIC_API_URL env var
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Called by identity store after login/logout
export function setAuthToken(token: string | null) {
  if (token) apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete apiClient.defaults.headers.common['Authorization'];
}
```

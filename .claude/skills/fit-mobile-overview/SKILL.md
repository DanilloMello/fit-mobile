---
name: fit-mobile-overview
description: Frontend skill for fit-mobile. React Native/NX patterns and conventions.
---

# fit-mobile Skill

> **Prereq**: Use `fit-mobile-docs` MCP to read `DOMAIN_SPEC.md` and `API_REGISTRY.md` first

---

## 1. Stack

| Tool | Version |
|------|---------|
| React Native | 0.73.4 |
| Expo | ~50.0.0 |
| Expo Router | ~3.4.0 |
| TypeScript | ~5.3.3 |
| TanStack Query | ^5.17.0 |
| Zustand | ^4.5.0 |
| Axios | ^1.6.5 |
| NX | 18.0.0 |

---

## 2. Project Structure

```
fit-mobile/
├── apps/mobile/src/app/
│   ├── _layout.tsx              # Root layout (auth guard)
│   ├── (auth)/                  # Unauthenticated screens
│   │   ├── _layout.tsx
│   │   ├── signin.tsx
│   │   └── signup.tsx
│   └── (app)/                   # Authenticated screens (tabs)
│       ├── _layout.tsx
│       ├── home/index.tsx
│       ├── clients/index.tsx
│       ├── plans/index.tsx
│       └── profile/index.tsx
├── libs/
│   ├── identity/
│   │   ├── domain/src/entities/user.entity.ts
│   │   ├── application/src/store/auth.store.ts
│   │   ├── infrastructure/src/api/auth.api.ts
│   │   └── ui/src/hooks/useAuth.ts
│   ├── client/
│   │   ├── domain/src/entities/client.entity.ts
│   │   ├── application/src/ports/client.repository.ts
│   │   ├── infrastructure/src/api/client.api.ts
│   │   └── ui/src/hooks/useClients.ts
│   ├── training/
│   │   ├── domain/src/entities/{plan,exercise}.entity.ts
│   │   ├── infrastructure/src/api/plan.api.ts
│   │   └── ui/src/hooks/usePlans.ts
│   └── shared/
│       ├── domain/src/entity.base.ts
│       ├── ui/src/components/LoadingSpinner.tsx
│       └── utils/src/api-client.ts
└── apps/mobile/eas.json         # EAS Build config
```

---

## 3. File Locations

| Creating | Path |
|----------|------|
| Entity | `libs/{module}/domain/src/entities/{Name}.entity.ts` |
| Repository Port | `libs/{module}/application/src/ports/{name}.repository.ts` |
| Store | `libs/{module}/application/src/store/{name}.store.ts` |
| API Client | `libs/{module}/infrastructure/src/api/{name}.api.ts` |
| Hook | `libs/{module}/ui/src/hooks/use{Name}.ts` |
| Component | `libs/{module}/ui/src/components/{Name}.tsx` |
| Screen | `apps/mobile/src/app/(app)/{feature}/index.tsx` |

---

## 4. Module Imports

Paths defined in `tsconfig.base.json` — always use these, never relative cross-module imports:

```typescript
import { ... } from '@connecthealth/identity/domain';
import { ... } from '@connecthealth/identity/application';
import { ... } from '@connecthealth/identity/infrastructure';
import { ... } from '@connecthealth/identity/ui';

import { ... } from '@connecthealth/client/domain';
import { ... } from '@connecthealth/client/application';
import { ... } from '@connecthealth/client/infrastructure';
import { ... } from '@connecthealth/client/ui';

import { ... } from '@connecthealth/training/domain';
import { ... } from '@connecthealth/training/infrastructure';
import { ... } from '@connecthealth/training/ui';

import { ... } from '@connecthealth/shared/domain';
import { ... } from '@connecthealth/shared/ui';
import { ... } from '@connecthealth/shared/utils';
```

---

## 5. Patterns

### Entity (`libs/{module}/domain/src/entities/`)
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

### API Client (`libs/{module}/infrastructure/src/api/`)
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

### Store (`libs/{module}/application/src/store/`) — Zustand, no persist
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

### Hook (`libs/{module}/ui/src/hooks/`)
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

### Screen (`apps/mobile/src/app/(app)/{feature}/index.tsx`)
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

### Shared API Client (`libs/shared/utils/src/api-client.ts`)
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

---

## 6. Navigation (Expo Router)

```
/                   → _layout.tsx     (auth guard — redirects to (auth) or (app))
/(auth)/signin      → SignInScreen
/(auth)/signup      → SignUpScreen
/(app)/home         → HomeScreen
/(app)/clients      → ClientsScreen
/(app)/plans        → PlansScreen
/(app)/profile      → ProfileScreen
```

- `router.replace('/(app)/home')` after login (clears back history)
- `router.push('/(auth)/signup')` for forward navigation

---

## 7. EAS Build & Local Dev

### Local dev on USB device (preferred for daily dev — no cloud needed)
```bash
# One-time: build dev client APK on your machine
cd apps/mobile
eas build --local --platform android --profile development
adb install build-*.apk           # install on USB-connected device

# Every day: just start Metro — changes hot-reload on device
npx expo start --dev-client
```
The dev client APK only needs to be rebuilt when native dependencies change.

### EAS Cloud Builds (run from `apps/mobile/`)
```bash
eas build --platform android --profile preview     # APK — QA / testers
eas build --platform android --profile production  # AAB — Play Store
```

| Profile | Build | Output | Use |
|---------|-------|--------|-----|
| `development` | local or cloud | dev client APK | daily dev with USB hot-reload |
| `preview` | cloud | APK | internal QA distribution |
| `production` | cloud | AAB | Play Store submission |

### Local bundle validation (before pushing to EAS)
```bash
cd apps/mobile
npx expo export --platform android --output-dir /tmp/bundle-test
```

---

## 8. Rules

- **Server state**: TanStack Query (`useQuery`, `useMutation`, `useQueryClient`)
- **Client state**: Zustand — no `persist` middleware unless explicitly required
- **Styles**: always `StyleSheet.create` — no inline style objects
- **Env vars**: prefix with `EXPO_PUBLIC_` for client-exposed values
- **Endpoints**: always read `API_REGISTRY.md` via `fit-mobile-docs` MCP — never guess URLs
- **Imports**: use `@connecthealth/*` paths — never relative imports across modules
- **Error handling**: catch `unknown`, narrow with `instanceof Error`

---

## 9. Checklist: New Feature

- [ ] Read `API_REGISTRY.md` via `fit-mobile-docs` MCP for endpoint contract
- [ ] Entity in `libs/{module}/domain/src/entities/`
- [ ] API client in `libs/{module}/infrastructure/src/api/`
- [ ] Hook in `libs/{module}/ui/src/hooks/`
- [ ] Components in `libs/{module}/ui/src/components/` (if needed)
- [ ] Screen in `apps/mobile/src/app/(app)/{feature}/index.tsx`
- [ ] Export from each `libs/{module}/{layer}/src/index.ts`

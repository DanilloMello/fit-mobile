# Sprint 1: Identity — fit-mobile

> **Generated:** 2026-02-17
> **Sprint:** 1
> **Project:** fit-mobile
> **Status:** In Progress

---

## Sprint Overview

Implement the full Identity feature on mobile: connect the auth API, implement a Zustand auth store with token persistence, and build functional Login and Register screens. This sprint delivers the authentication gate that protects all other screens.

---

## Progress

| Task | Status | Priority |
|------|--------|----------|
| Task 1: Fix auth API client (`auth.api.ts`) | ⬜ Not started | High |
| Task 2: Auth Zustand store | ⬜ Not started | High |
| Task 3: `useAuth` hook (real implementation) | ⬜ Not started | High |
| Task 4: Sign In screen | ⬜ Not started | High |
| Task 5: Sign Up screen | ⬜ Not started | High |
| Task 6: Auth navigation guard (`_layout.tsx`) | ⬜ Not started | High |
| Task 7: Token persistence (`SecureStore`) | ⬜ Not started | High |
| Task 8: Axios interceptors (token injection + refresh) | ⬜ Not started | High |
| Task 9: Tests | ⬜ Not started | Medium |

---

## Tasks

---

### Task 1: Fix auth API client

**Priority:** High
**Size:** S
**Depends on:** fit-api Sprint 1 Tasks 7+8 running

> The current `auth.api.ts` has stubs with TODOs and uses wrong endpoint names (`/signin`, `/signup`). Fix to match `API_REGISTRY.md`.

#### Subtasks

- [ ] **1.1** — Open `libs/identity/infrastructure/src/api/auth.api.ts`
  - Change endpoint `/auth/signin` → `/auth/login` (matches API_REGISTRY)
  - Change endpoint `/auth/signup` → `/auth/register` (matches API_REGISTRY)
  - Remove all `_` prefixes from parameters (they were TODO placeholders)

- [ ] **1.2** — Update `SignUpRequest` interface to match `POST /auth/register` spec:
  ```ts
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
  }
  ```
  - Rename `SignUpRequest` → `RegisterRequest` for consistency with backend naming

- [ ] **1.3** — Update `AuthResponse` to match the actual API_REGISTRY response shape:
  ```ts
  export interface AuthResponse {
    data: {
      user: { id: string; name: string; email?: string };
      tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
    };
  }
  ```
  - The API wraps in `{ "data": { ... } }` per `DOMAIN_SPEC.md` standards

- [ ] **1.4** — Add `logout` method (calls no endpoint for MVP — just clears local state):
  ```ts
  logout: async (): Promise<void> => {
    // Token revocation not implemented server-side in Sprint 1
    // Client clears tokens locally via auth store
  }
  ```

- [ ] **1.5** — Add `refreshToken` method:
  ```ts
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response.data;
  }
  ```

- [ ] **1.6** — Update barrel export in `libs/identity/infrastructure/src/index.ts`
  - Export `RegisterRequest`, `LoginRequest`, `AuthResponse`, `authApi`

#### Acceptance Criteria

- [ ] Endpoint paths match API_REGISTRY exactly (`/auth/login`, `/auth/register`, `/auth/refresh`)
- [ ] Types match the backend response structure (wrapped in `data`)
- [ ] No `_` prefix parameters (no TODOs remaining)
- [ ] All exports in `index.ts`

---

### Task 2: Auth Zustand store

**Priority:** High
**Size:** M
**Depends on:** Task 1

> Central auth state: tokens, user info, loading, error. Persisted to SecureStore.

#### Subtasks

- [ ] **2.1** — Create `libs/identity/application/src/store/auth.store.ts`
  - Use Zustand: `import { create } from 'zustand'`
  - State shape:
    ```ts
    interface AuthState {
      user: User | null;
      accessToken: string | null;
      refreshToken: string | null;
      isAuthenticated: boolean;
      isLoading: boolean;
      error: string | null;
    }
    ```

- [ ] **2.2** — Add actions to the store:
  ```ts
  interface AuthActions {
    setTokens: (accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearAuth: () => void; // used by signOut
  }
  ```
  - `setTokens` also sets `isAuthenticated: true`
  - `clearAuth` resets all state to initial values and sets `isAuthenticated: false`

- [ ] **2.3** — Create `libs/identity/application/src/store/index.ts` exporting the store

- [ ] **2.4** — Create `libs/identity/application/src/ports/auth.repository.ts` (port interface)
  ```ts
  export interface AuthRepository {
    saveTokens(accessToken: string, refreshToken: string): Promise<void>;
    getAccessToken(): Promise<string | null>;
    getRefreshToken(): Promise<string | null>;
    clearTokens(): Promise<void>;
  }
  ```
  - This is the port — implemented by SecureStore in Task 7

- [ ] **2.5** — Update `libs/identity/application/src/index.ts` to export store + port

#### Acceptance Criteria

- [ ] Store is typed with TypeScript strict (no `any`)
- [ ] `clearAuth` resets all fields to initial state
- [ ] `isAuthenticated` is derived from token presence
- [ ] Store is exported from `application/src/index.ts`

---

### Task 3: `useAuth` hook (real implementation)

**Priority:** High
**Size:** M
**Depends on:** Task 1, Task 2, Task 7

> Replace the placeholder `useAuth` with a real implementation that calls the API and manages auth store.

#### Subtasks

- [ ] **3.1** — Rewrite `libs/identity/ui/src/hooks/useAuth.ts`
  - Import `authStore` from application layer
  - Import `authApi` from infrastructure layer
  - Import `AuthRepository` impl (SecureStore) from Task 7

- [ ] **3.2** — Implement `signIn(email, password)`:
  ```ts
  const signIn = async (email: string, password: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const res = await authApi.signIn({ email, password });
      const { tokens, user } = res.data;
      await authRepository.saveTokens(tokens.accessToken, tokens.refreshToken);
      store.setTokens(tokens.accessToken, tokens.refreshToken);
      store.setUser(mapUser(user));
    } catch (err) {
      store.setError('Invalid email or password');
      throw err; // re-throw so screen can handle
    } finally {
      store.setLoading(false);
    }
  };
  ```

- [ ] **3.3** — Implement `signUp(name, email, password)` with same pattern calling `authApi.register`

- [ ] **3.4** — Implement `signOut()`:
  1. Call `authRepository.clearTokens()`
  2. Call `store.clearAuth()`
  3. Navigation reset handled by auth guard (Task 6) reacting to `isAuthenticated: false`

- [ ] **3.5** — Implement `initialize()` — call on app startup:
  1. `getAccessToken()` from SecureStore
  2. If found: validate expiry (decode JWT locally, check `exp` claim)
  3. If valid: set in store → `isAuthenticated: true`
  4. If expired: attempt silent refresh via `authApi.refreshToken(refreshToken)` → update tokens
  5. If refresh fails: `clearAuth()`

- [ ] **3.6** — Return from hook:
  ```ts
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    signIn,
    signUp,
    signOut,
    initialize,
  };
  ```

#### Acceptance Criteria

- [ ] `signIn` with valid credentials sets `isAuthenticated: true` in store
- [ ] `signIn` with wrong credentials sets `error` in store
- [ ] `signOut` clears all auth state and persisted tokens
- [ ] `initialize` restores session on app restart if token is still valid
- [ ] No `any` types
- [ ] `isLoading` is true during async operations

---

### Task 4: Sign In screen

**Priority:** High
**Size:** M
**Depends on:** Task 3

> Replace the current placeholder `signin.tsx` with a functional form using React Hook Form.

#### Subtasks

- [ ] **4.1** — Rewrite `apps/mobile/src/app/(auth)/signin.tsx`
  - Import `useAuth` from identity lib
  - Import `useForm`, `Controller` from `react-hook-form`
  - Import form components from design system or shared UI

- [ ] **4.2** — Build the form structure:
  ```tsx
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
  });
  ```
  - `LoginFormData` type: `{ email: string; password: string }`

- [ ] **4.3** — Form fields:
  - Email field: `Controller` wrapping a `TextInput` or design system `Input`
    - Validation: `required: 'Email is required'`, `pattern: { value: /email-regex/, message: 'Invalid email' }`
    - `keyboardType="email-address"`, `autoCapitalize="none"`, `autoCorrect={false}`
    - `accessibilityLabel="Email input"`
  - Password field: `Controller` wrapping `TextInput`
    - Validation: `required: 'Password is required'`, `minLength: { value: 8, message: 'Min 8 characters' }`
    - `secureTextEntry`, `accessibilityLabel="Password input"`

- [ ] **4.4** — Submit button:
  - Calls `handleSubmit(onSubmit)`
  - `onSubmit` calls `signIn(data.email, data.password)`
  - Shows `ActivityIndicator` when `isLoading === true`
  - Disabled when loading
  - `accessibilityLabel="Sign in button"`

- [ ] **4.5** — Error display:
  - Show `auth.error` from `useAuth` below the form if not null
  - Use `Text` with red color — do NOT use `alert()`

- [ ] **4.6** — Navigation link to Register:
  - `<Link href="/(auth)/signup">Don't have an account? Sign Up</Link>`

- [ ] **4.7** — On successful `signIn`, navigation is handled by auth guard (Task 6) — no manual `router.push()` needed in this screen

#### Acceptance Criteria

- [ ] Form validates required fields before calling API
- [ ] Loading indicator shown during API call
- [ ] Error message visible below form on failed login
- [ ] Keyboard type and autocomplete attributes are correct
- [ ] `accessibilityLabel` on all interactive elements
- [ ] No `console.log` or debug code
- [ ] TypeScript strict — no `any`

---

### Task 5: Sign Up screen

**Priority:** High
**Size:** M
**Depends on:** Task 3

> Replace placeholder `signup.tsx` with a functional registration form.

#### Subtasks

- [ ] **5.1** — Rewrite `apps/mobile/src/app/(auth)/signup.tsx`
  - Same structure as Task 4 but with 3 fields: name, email, password
  - `RegisterFormData` type: `{ name: string; email: string; password: string }`

- [ ] **5.2** — Form fields:
  - Name field: required, minLength 2
    - `autoCapitalize="words"`, `accessibilityLabel="Full name input"`
  - Email field: same as Sign In
  - Password field: required, minLength 8
    - Add a confirm password field: validate that it matches `password` using `validate` option
    - `accessibilityLabel="Confirm password input"`

- [ ] **5.3** — `onSubmit` calls `signUp(data.name, data.email, data.password)`
  - On success: navigation handled by auth guard
  - On error: display `auth.error`

- [ ] **5.4** — Navigation link back to Sign In:
  - `<Link href="/(auth)/signin">Already have an account? Sign In</Link>`

- [ ] **5.5** — Password strength indicator (optional for Sprint 1 — mark as `// TODO: Sprint enhancement`)

#### Acceptance Criteria

- [ ] All 3 fields validated before submit
- [ ] Confirm password mismatch shows inline error
- [ ] Loading state shown during API call
- [ ] API error displayed below form
- [ ] Accessibility labels on all inputs

---

### Task 6: Auth navigation guard

**Priority:** High
**Size:** S
**Depends on:** Task 2, Task 3

> The root `_layout.tsx` must redirect unauthenticated users to `(auth)/signin` and authenticated users away from auth screens.

#### Subtasks

- [ ] **6.1** — Open `apps/mobile/src/app/_layout.tsx`
  - Call `useAuth().initialize()` inside a `useEffect` on mount (once)
  - Show a `SplashScreen` or loading indicator while `isLoading` is true during initialization

- [ ] **6.2** — Add redirect logic using Expo Router `<Redirect>`:
  ```tsx
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/signin');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/home');
    }
  }, [isAuthenticated, isLoading, segments]);
  ```

- [ ] **6.3** — Ensure `(auth)/_layout.tsx` uses `Stack` navigator and `(app)/_layout.tsx` uses `Tabs` navigator
  - Check current contents and update if needed

- [ ] **6.4** — Handle splash screen:
  - Keep splash screen visible until `initialize()` resolves
  - Use `expo-splash-screen`: `SplashScreen.preventAutoHideAsync()` on app load, `SplashScreen.hideAsync()` after initialization

#### Acceptance Criteria

- [ ] Unauthenticated user navigating to `/(app)/home` is redirected to `/(auth)/signin`
- [ ] Authenticated user navigating to `/(auth)/signin` is redirected to `/(app)/home`
- [ ] App shows splash screen while restoring session, not a blank screen

---

### Task 7: Token persistence with SecureStore

**Priority:** High
**Size:** S
**Depends on:** Task 2

> Implement the `AuthRepository` port using `expo-secure-store` for encrypted local storage of JWT tokens.

#### Subtasks

- [ ] **7.1** — Verify `expo-secure-store` is in `package.json` dependencies
  - If missing: `npx expo install expo-secure-store`

- [ ] **7.2** — Create `libs/identity/infrastructure/src/storage/secure-auth.repository.ts`
  - Implements `AuthRepository` from application layer
  - Constants for keys:
    ```ts
    const ACCESS_TOKEN_KEY = 'auth.access_token';
    const REFRESH_TOKEN_KEY = 'auth.refresh_token';
    ```

- [ ] **7.3** — Implement methods:
  ```ts
  async saveTokens(access: string, refresh: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
  }

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
  ```

- [ ] **7.4** — Export from `libs/identity/infrastructure/src/index.ts`

#### Acceptance Criteria

- [ ] Tokens survive app restart (persisted in SecureStore)
- [ ] `clearTokens` removes both keys
- [ ] No tokens stored in `AsyncStorage` (use SecureStore only — encrypted)

---

### Task 8: Axios interceptors

**Priority:** High
**Size:** M
**Depends on:** Task 2, Task 7

> Configure the shared `apiClient` to automatically attach JWT to requests and handle 401 by refreshing the token silently.

#### Subtasks

- [ ] **8.1** — Open `libs/shared/utils/src/api-client.ts`
  - Check its current contents and understand the existing setup

- [ ] **8.2** — Add request interceptor to inject access token:
  ```ts
  apiClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('auth.access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```
  - Import SecureStore directly here, or read from `authStore` (prefer store for in-memory speed)

- [ ] **8.3** — Add response interceptor to handle 401 (token refresh):
  ```ts
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = await SecureStore.getItemAsync('auth.refresh_token');
          const res = await authApi.refreshToken(refreshToken);
          const { tokens } = res.data;
          await saveTokens(tokens.accessToken, tokens.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          // Refresh failed — clear auth and redirect
          clearAuth();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
  ```
  - `_retry` flag prevents infinite retry loops

- [ ] **8.4** — Ensure `clearAuth` from Zustand store triggers navigation to sign in (via Task 6 auth guard reacting to `isAuthenticated` change)

#### Acceptance Criteria

- [ ] Every authenticated request has `Authorization: Bearer <token>` header
- [ ] 401 response triggers silent token refresh and retries the original request
- [ ] After refresh failure, user is redirected to sign in (not stuck on blank screen)
- [ ] No infinite retry loop (guarded by `_retry`)

---

### Task 9: Tests

**Priority:** Medium
**Size:** M
**Depends on:** Tasks 1–8

> Unit tests for hook, store, and API client. Integration flow test for login.

#### Subtasks

- [ ] **9.1** — Unit test `authStore` in `libs/identity/application/src/store/auth.store.test.ts`
  - `initial state is unauthenticated`
  - `setTokens sets isAuthenticated to true`
  - `clearAuth resets all state`

- [ ] **9.2** — Unit test `useAuth` hook in `libs/identity/ui/src/hooks/useAuth.test.ts`
  - Mock `authApi` and `SecureStore`
  - `signIn with valid credentials updates store and persists tokens`
  - `signIn with invalid credentials sets error state`
  - `signOut clears store and SecureStore`

- [ ] **9.3** — Unit test `SecureAuthRepository` in `libs/identity/infrastructure/src/storage/secure-auth.repository.test.ts`
  - Mock `expo-secure-store`
  - `saveTokens stores both tokens`
  - `clearTokens deletes both keys`

- [ ] **9.4** — Component test for `SignInScreen` in `apps/mobile/src/app/(auth)/signin.test.tsx`
  - Use `@testing-library/react-native`
  - Mock `useAuth`
  - `renders email and password inputs`
  - `shows error message when auth.error is set`
  - `calls signIn on submit with correct values`
  - `shows loading indicator when isLoading is true`

- [ ] **9.5** — Run `npx nx test identity` and fix any failures before closing sprint

#### Acceptance Criteria

- [ ] All tests pass: `npx nx test`
- [ ] TypeScript check passes: `npx tsc --noEmit`
- [ ] Lint passes: `npx nx lint`
- [ ] No `console.log` in production code

---

## Dependencies on Other Projects

| This task | Depends on | Project |
|-----------|-----------|---------|
| Task 1 (fix API client) | `POST /auth/login` and `POST /auth/register` endpoints deployed | fit-api Sprint 1 Tasks 7+8 |
| Task 3 (useAuth - refresh) | `POST /auth/refresh` endpoint working | fit-api Sprint 1 Task 6+7 |
| Task 8 (interceptors) | Token refresh endpoint available | fit-api Sprint 1 Task 6 |

---

## Notes

- **Endpoint naming mismatch**: The existing `auth.api.ts` scaffold uses `/signin` and `/signup`. The backend (and API_REGISTRY) uses `/login` and `/register`. **Fix in Task 1** — backend wins.
- **State management**: Zustand for auth state (global, client-side). No TanStack Query for auth — login/logout are not "queries".
- **SecureStore vs AsyncStorage**: Always `SecureStore` for tokens. `AsyncStorage` is unencrypted.
- **Navigation pattern**: Use the `useEffect` guard in `_layout.tsx` — do NOT call `router.push` inside `signIn` — decouples navigation from business logic.
- **Branch**: `feature/identity` on fit-mobile.
- **Coordinate with fit-api**: Run `docker compose up -d && ./gradlew bootRun` in fit-api before testing end-to-end.

# Sprint 1: Identity — fit-mobile

> **Generated:** 2026-02-17
> **Sprint:** 1
> **Project:** fit-mobile
> **Status:** Completed

---

## Sprint Overview

Implement the full Identity feature on mobile: auth API client with magic link + Google Sign-In, Zustand auth store, functional auth screens, and navigation guard. This sprint delivers the authentication gate that protects all other screens.

---

## Progress

| Task | Status | Priority |
|------|--------|----------|
| Task 1: Auth API client (`auth.api.ts`) | ✅ Completed | High |
| Task 2: Auth Zustand store | ✅ Completed | High |
| Task 3: `useAuth` hook | ✅ Completed | High |
| Task 4: `useGoogleSignIn` hook | ✅ Completed | High |
| Task 5: Auth screen (magic link + Google) | ✅ Completed | High |
| Task 6: Auth navigation guard (`_layout.tsx`) | ✅ Completed | High |
| Task 7: Token persistence (`SecureStore`) | ⬜ Planned (Sprint 1.5) | High |
| Task 8: Axios interceptors (token injection + refresh) | ⬜ Planned (Sprint 1.5) | High |
| Task 9: Tests | ⬜ Planned (Sprint 1.5) | Medium |

---

## Tasks

---

### Task 1: Auth API client

**Priority:** High
**Size:** S
**Status:** ✅ Completed

> API client aligned with API_REGISTRY.md endpoints, including magic link and Google OAuth.

#### Subtasks

- [x] **1.1** — `libs/identity/infrastructure/src/api/auth.api.ts` with correct endpoints:
  - `signIn()` → `POST /auth/login`
  - `signUp()` → `POST /auth/register`
  - `refreshToken()` → `POST /auth/refresh`
  - `sendMagicLink()` → `POST /auth/magic-link`
  - `verifyMagicLink()` → `POST /auth/magic-link/verify`
  - `signInWithGoogle()` → `POST /auth/google`

- [x] **1.2** — Types: `SignInRequest`, `SignUpRequest`, `MagicLinkRequest`, `GoogleSignInRequest`, `AuthUser`, `AuthTokens`, `AuthResponse`, `ApiAuthResponse`

- [x] **1.3** — Response unwrapping: API returns `{ data: { user, tokens } }` — client unwraps to `{ user, tokens }`

- [x] **1.4** — Barrel export in `libs/identity/infrastructure/src/index.ts`

#### Acceptance Criteria

- [x] Endpoint paths match API_REGISTRY exactly
- [x] Types match the backend response structure
- [x] All methods exported

---

### Task 2: Auth Zustand store

**Priority:** High
**Size:** S
**Status:** ✅ Completed

> Central auth state: tokens, user info, authenticated flag.

#### Subtasks

- [x] **2.1** — `libs/identity/application/src/store/auth.store.ts`
  - State: `user` (AuthUser | null), `accessToken`, `refreshToken`, `isAuthenticated`
  - Actions: `setAuth(user, accessToken, refreshToken)`, `clearAuth()`
  - Integrates with `setAuthToken()` from shared utils for Axios header injection

- [x] **2.2** — Barrel export in `libs/identity/application/src/index.ts`

#### Acceptance Criteria

- [x] Store typed with TypeScript strict (no `any`)
- [x] `setAuth` sets `isAuthenticated: true` and injects token into Axios
- [x] `clearAuth` resets all state and removes Axios token

---

### Task 3: `useAuth` hook

**Priority:** High
**Size:** M
**Status:** ✅ Completed

> Full auth hook supporting email/password, magic link, Google, and sign out.

#### Subtasks

- [x] **3.1** — `libs/identity/ui/src/hooks/useAuth.ts`
  - Methods: `signIn`, `signUp`, `sendMagicLink`, `verifyMagicLink`, `signInWithGoogle`, `signOut`
  - State: `user`, `isAuthenticated`, `isLoading`, `error`
  - Error handling: catches API errors, sets error state, re-throws for screen handling

- [x] **3.2** — Each async method follows pattern: `setLoading(true)` → `setError(null)` → try/catch/finally

- [x] **3.3** — `signOut()` calls `clearAuth()` — navigation handled by auth guard

#### Acceptance Criteria

- [x] `signIn` with valid credentials sets `isAuthenticated: true`
- [x] `signIn` with wrong credentials sets `error`
- [x] `signOut` clears all auth state
- [x] No `any` types
- [x] `isLoading` is true during async operations

---

### Task 4: `useGoogleSignIn` hook

**Priority:** High
**Size:** S
**Status:** ✅ Completed

> Google Sign-In integration using `expo-auth-session`.

#### Subtasks

- [x] **4.1** — `libs/identity/ui/src/hooks/useGoogleSignIn.ts`
  - Uses `Google.useIdTokenAuthRequest()` from `expo-auth-session/providers/google`
  - Client IDs from env vars: `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
  - Graceful fallback: `isConfigured` guards against missing env vars

- [x] **4.2** — On `response.type === 'success'`, extracts `id_token` and calls `signInWithGoogle()`

- [x] **4.3** — Returns `{ promptAsync, isLoading, error, disabled }`

#### Acceptance Criteria

- [x] Google button disabled when env vars not configured
- [x] Successful auth triggers `signInWithGoogle` with id_token
- [x] `WebBrowser.maybeCompleteAuthSession()` called at module level

---

### Task 5: Auth screen (AuthForm — magic link + Google)

**Priority:** High
**Size:** M
**Status:** ✅ Completed

> Single unified auth screen with Google as primary CTA and magic link as secondary.

#### Subtasks

- [x] **5.1** — `libs/identity/ui/src/components/organisms/AuthForm.tsx`
  - Two modes: `signin` / `signup` with animated toggle
  - Two steps: `form` → `sent` (magic link confirmation)
  - Google button as primary CTA
  - Magic link email form as secondary option
  - Name field visible only in signup mode

- [x] **5.2** — `apps/mobile/src/app/(auth)/signin.tsx`
  - Uses `useAuth()` and `useGoogleSignIn()` hooks
  - Renders `AuthForm` with `SafeAreaView`, `KeyboardAvoidingView`, `ScrollView`

- [x] **5.3** — Email validation with inline errors
- [x] **5.4** — Loading states and disabled button handling
- [x] **5.5** — Accessibility labels on all interactive elements
- [x] **5.6** — Design system tokens from `@connecthealth/shared/ui`

#### Acceptance Criteria

- [x] Google Sign-In button visible and functional
- [x] Magic link flow: enter email → submit → "Magic link sent!" confirmation
- [x] Resend and change email options on confirmation screen
- [x] Mode toggle between signin/signup
- [x] No `console.log` or debug code

---

### Task 6: Auth navigation guard

**Priority:** High
**Size:** S
**Status:** ✅ Completed

> Root layout redirects unauthenticated users to auth screens and vice-versa.

#### Subtasks

- [x] **6.1** — `apps/mobile/src/app/_layout.tsx`
  - `AuthGuard` component using `useAuthStore` and `useSegments()`
  - Redirects unauthenticated users to `/(auth)/signin`
  - Redirects authenticated users away from `/(auth)` to `/(app)/home`
  - Uses `<Redirect>` from Expo Router (declarative)

- [x] **6.2** — Font loading with `@expo-google-fonts/inter`, splash screen management
- [x] **6.3** — `QueryClientProvider` wrapping the app

#### Acceptance Criteria

- [x] Unauthenticated user → `/(auth)/signin`
- [x] Authenticated user → `/(app)/home`
- [x] Splash screen visible while fonts load

---

### Task 7: Token persistence with SecureStore (Planned — Sprint 1.5)

**Priority:** High
**Size:** S
**Depends on:** Task 2
**Status:** ⬜ Planned

> Persist JWT tokens to encrypted local storage so sessions survive app restart.

#### Subtasks

- [ ] **7.1** — Install `expo-secure-store`
- [ ] **7.2** — Create `libs/identity/infrastructure/src/storage/secure-auth.repository.ts`
  - `saveTokens(accessToken, refreshToken)` / `getAccessToken()` / `getRefreshToken()` / `clearTokens()`
- [ ] **7.3** — Integrate with `useAuth` → persist on sign-in, restore on app launch
- [ ] **7.4** — Add `initialize()` method to `useAuth` — restore session from SecureStore on mount

#### Notes

- Currently tokens are in-memory only (Zustand store) — lost on app restart
- Must use SecureStore (encrypted), NOT AsyncStorage (plaintext)

---

### Task 8: Axios interceptors (Planned — Sprint 1.5)

**Priority:** High
**Size:** M
**Depends on:** Task 2, Task 7
**Status:** ⬜ Planned

> Auto-inject Bearer token and handle 401 with silent refresh.

#### Subtasks

- [ ] **8.1** — Request interceptor: read token from store/SecureStore → inject `Authorization: Bearer <token>`
- [ ] **8.2** — Response interceptor: on 401, attempt refresh → retry original request
- [ ] **8.3** — `_retry` flag to prevent infinite loops
- [ ] **8.4** — On refresh failure → `clearAuth()` → auth guard redirects to signin

#### Notes

- Currently `setAuthToken()` is called manually via `useAuthStore.setAuth()` — works but doesn't handle refresh

---

### Task 9: Tests (Planned — Sprint 1.5)

**Priority:** Medium
**Size:** M
**Depends on:** Tasks 1–8
**Status:** ⬜ Planned

#### Subtasks

- [ ] **9.1** — Unit test `authStore` — initial state, setAuth, clearAuth
- [ ] **9.2** — Unit test `useAuth` hook — signIn, signUp, signOut, error handling
- [ ] **9.3** — Unit test `SecureAuthRepository` — save, get, clear tokens
- [ ] **9.4** — Component test `SignInScreen` — renders, validates, submits
- [ ] **9.5** — Run `npx nx test` and fix failures

---

## Dependencies on Other Projects

| This task | Depends on | Project |
|-----------|-----------|---------|
| Task 1 (API client - magic link) | `POST /auth/magic-link` and `POST /auth/magic-link/verify` endpoints | fit-api Sprint 1.5 |
| Task 1 (API client - auth) | `POST /auth/login`, `/register`, `/refresh`, `/google` | fit-api Sprint 1 ✅ |

---

## Notes

- **Auth flow**: Primary = Google Sign-In, Secondary = Magic Link (passwordless). No password-based signin/signup screen used (SignInForm and SignUpForm exist but are not wired into navigation).
- **Magic link backend**: fit-mobile calls `/auth/magic-link` and `/auth/magic-link/verify` but fit-api hasn't implemented these yet — planned for Sprint 1.5.
- **Google OAuth**: Fully functional end-to-end (mobile → backend → Google tokeninfo → JWT).
- **Token persistence**: In-memory only for now — SecureStore integration planned for Sprint 1.5.
- **Axios interceptors**: Manual token injection works — automatic refresh planned for Sprint 1.5.

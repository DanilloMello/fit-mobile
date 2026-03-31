# Production Migration — Technical Debt Registry

> **Purpose:** Track every change required to move fit-mobile from development to production.
> **Owner:** fit-mobile team
> **Last updated:** 2026-03-31
> **Sprint reference:** Items are tagged with the sprint where work is planned.

---

## How to use this document

- Each section is a debt item with a status badge: `[ ]` open · `[x]` done
- Items are ordered by priority: **P0** (blocking launch) → **P1** (high risk) → **P2** (important)
- When you close an item, mark it `[x]`, add the PR number, and update the date
- Add new items at the bottom of the relevant priority section

---

## P0 — Blocking Launch

These items will cause the app to fail or be rejected if not resolved before production build.

---

### [P0-1] Token persistence — no SecureStore integration

**Sprint:** 1.5
**Status:** `[ ]` open

**Problem:**
`auth.store.ts` holds `accessToken` and `refreshToken` only in Zustand memory. On app restart, the store resets and the user is logged out. There is no persistence to device storage.

**Files:**
- `libs/identity/application/src/store/auth.store.ts` — `setAuth` / `clearAuth` only set in-memory state
- `libs/shared/utils/src/api-client.ts` — `setAuthToken` sets axios header but not persisted

**What needs to change:**
- Install `expo-secure-store`
- On `setAuth`: persist `accessToken` + `refreshToken` to SecureStore
- On app start (`_layout.tsx`): rehydrate auth state from SecureStore before rendering the auth guard
- On `clearAuth`: delete SecureStore entries

---

### [P0-2] Axios interceptor — no automatic token injection or refresh

**Sprint:** 1.5
**Status:** `[ ]` open

**Problem:**
`api-client.ts` exposes `setAuthToken` which sets a default header, but there is no request interceptor to inject tokens dynamically, and no response interceptor to handle 401s with automatic token refresh.
`authApi.refreshToken` exists in `auth.api.ts` (line 47) but is never called anywhere.

**Files:**
- `libs/shared/utils/src/api-client.ts`
- `libs/identity/infrastructure/src/api/auth.api.ts` — `refreshToken` method unused

**What needs to change:**
- Add request interceptor: reads token from store/SecureStore and injects `Authorization: Bearer <token>` header
- Add response interceptor: on 401, call `authApi.refreshToken`, update store and SecureStore, retry original request. On refresh failure, call `clearAuth` and redirect to sign-in.

---

### [P0-3] EAS build — missing signing configuration

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
`eas.json` production profile has only `autoIncrement: true`. No signing certificate is configured for iOS or Android. Without signing, production builds cannot be submitted to app stores.

**File:** `apps/mobile/eas.json`

```json
"production": {
  "autoIncrement": true   // ← nothing else
}
```

**What needs to change:**

**Android:**
- Generate a keystore: `eas credentials` → Android → production keystore
- Either let EAS manage the keystore (recommended) or upload your own
- Confirm `android.package` in `app.json` matches Play Console (`com.connecthealth.mobile`)

**iOS:**
- Provision a distribution certificate and provisioning profile via `eas credentials`
- Confirm `ios.bundleIdentifier` in `app.json` matches App Store Connect (`com.connecthealth.mobile`)

---

### [P0-4] Production API URL — localhost fallback

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
`api-client.ts` line 7 falls back to `http://localhost:8080/api/v1` if `EXPO_PUBLIC_API_URL` is not set. In a production build without the variable set, every API call will fail silently.

**File:** `libs/shared/utils/src/api-client.ts:7`

```typescript
const API_URL =
  process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:8080/api/v1';
```

**What needs to change:**
- Add `EXPO_PUBLIC_API_URL` to the `production` profile in `eas.json` under `env`:

```json
"production": {
  "autoIncrement": true,
  "env": {
    "EXPO_PUBLIC_API_URL": "https://api.connecthealth.app/api/v1"
  }
}
```

- Optionally throw an error at startup if the variable is missing, so misconfigured builds fail fast.

---

### [P0-5] Deep linking — custom scheme (`connecthealth://`) must migrate to App Links / Universal Links

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
Magic link emails currently redirect to `connecthealth://auth/magic-link/verify?token=...` via a custom URI scheme. This works in development but has production risks:

- Chrome on Android increasingly blocks custom-scheme redirects from meta-refresh in emails
- Custom schemes are not verified by the OS — any app can register `connecthealth://`
- No graceful browser fallback if the app is not installed

The production-grade solution is **Android App Links** (HTTPS intent filters with `autoVerify`) and **iOS Universal Links** (AASA file on domain).

**Files:**
- `apps/mobile/app.json` — `android.intentFilters` currently uses `scheme: "connecthealth"` (line 34)
- `libs/identity/ui/src/hooks/useAuth.ts:30` — `Linking.createURL('/auth/magic-link/verify')` generates the scheme-based URL
- `fit-api` — needs `.well-known` endpoints

**What needs to change:**

**Backend (fit-api):**
- Expose `GET /.well-known/assetlinks.json` with the app's SHA-256 fingerprint (Android)
- Expose `GET /.well-known/apple-app-site-association` (iOS)

Example `assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.connecthealth.mobile",
    "sha256_cert_fingerprints": ["<YOUR_KEYSTORE_SHA256>"]
  }
}]
```

**Mobile (`app.json`):**
```json
"intentFilters": [
  {
    "action": "VIEW",
    "autoVerify": true,
    "data": [
      {
        "scheme": "https",
        "host": "api.connecthealth.app",
        "pathPrefix": "/api/v1/auth/magic-link"
      }
    ],
    "category": ["BROWSABLE", "DEFAULT"]
  }
]
```

**Mobile (`useAuth.ts`):**
- Replace `Linking.createURL('/auth/magic-link/verify')` with the production HTTPS URL:
```typescript
const redirectUrl = __DEV__
  ? Linking.createURL('/auth/magic-link/verify')
  : 'https://api.connecthealth.app/api/v1/auth/magic-link/callback';
```

> **Note:** Requires a real domain with HTTPS and the `.well-known` files served at the domain root. This is why it is deferred to Sprint 6 / deploy stage.

---

## P1 — High Risk

These items will not block the initial build submission but create poor user experience or security exposure in production.

---

### [P1-1] Console statements in production code

**Sprint:** 1.5 / before any production build
**Status:** `[ ]` open

**Problem:**
`useGoogleSignIn.ts` contains `console.log` and `console.error` calls that will appear in production logs and may leak user information.

**Files:**
- `libs/identity/ui/src/hooks/useGoogleSignIn.ts` — lines 55, 57, 59, 61

**What needs to change:**
- Wrap with `if (__DEV__)` guard or remove entirely
- For real error reporting in production, integrate a crash reporting service (e.g. Sentry) — this is a Sprint 6 concern

---

### [P1-2] Google Sign-In — missing `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB`

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
`useGoogleSignIn.ts` reads `process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` with no fallback and no runtime check. If the variable is missing from the EAS build profile, Google Sign-In will fail silently at runtime.

**What needs to change:**
- Add to `eas.json` production `env` block:
```json
"EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB": "<your-web-client-id>"
```
- Add a startup assertion or a visible error message if the variable is absent

---

### [P1-3] Magic link verification — no user-facing error messaging

**Sprint:** 1.5
**Status:** `[ ]` open

**Problem:**
The magic link verify screen redirects to `/(auth)/signin` on error without showing the user why the link failed (expired, already used, invalid token). This creates a confusing loop.

**File:** `apps/mobile/src/app/auth/magic-link/verify.tsx`

**What needs to change:**
- Pass an error query param on redirect, e.g. `/(auth)/signin?error=link_expired`
- Display the error message on the sign-in screen

---

### [P1-4] Deep link intent filter — no path restriction

**Sprint:** 6 (same PR as P0-5)
**Status:** `[ ]` open

**Problem:**
`app.json` `intentFilters` accepts all `connecthealth://` URIs without path restriction. Any URL using the scheme can trigger deep link handling in the app.

**File:** `apps/mobile/app.json:28-39`

**What needs to change:**
- Restrict the intent filter to specific paths once migrated to App Links (resolved by P0-5)
- Until then, validate the incoming URL path in the Expo Router handler before processing

---

### [P1-5] No `.env.production` template

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
There is no documented list of environment variables required for a production build. New developers or CI pipelines have no reference.

**What needs to change:**
- Create `.env.example` (committed to repo, no values):

```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=
```

- Document in `QUICKSTART.md` that production values go in EAS build profile `env` block, not in `.env` files

---

## P2 — Important Before Store Release

These items reduce quality or create long-term maintenance risk but do not directly block a first production build.

---

### [P2-1] Placeholder screens must be hidden or implemented before release

**Sprint:** 2–5
**Status:** `[ ]` open

**Problem:**
The following screens are placeholders that show "TODO" or empty states. They are reachable from the main tab navigation:

| Screen | File | Sprint |
|--------|------|--------|
| Home / Dashboard | `apps/mobile/src/app/(app)/home/index.tsx` | Sprint 2 |
| Clients list | `apps/mobile/src/app/(app)/clients/index.tsx` | Sprint 2 |
| Training plans | `apps/mobile/src/app/(app)/plans/index.tsx` | Sprint 4 |
| Profile | `apps/mobile/src/app/(app)/profile/index.tsx` | Sprint 6 |

**What needs to change:**
- Implement per sprint plan OR hide tab items behind a feature flag until implemented
- Remove all `"Placeholder — X to be implemented"` text before production submission

---

### [P2-2] `useClients` and `usePlans` hooks — stub implementations

**Sprint:** 2–4
**Status:** `[ ]` open

**Problem:**
Both hooks return hardcoded empty arrays. The Client and Training modules have API method skeletons but no real implementation.

**Files:**
- `libs/client/ui/src/hooks/useClients.ts`
- `libs/client/infrastructure/src/api/client.api.ts`
- `libs/training/ui/src/hooks/usePlans.ts`
- `libs/training/infrastructure/src/api/plan.api.ts`

**What needs to change:** Complete per Sprint 2–4 roadmap.

---

### [P2-3] Password-based sign-in method still wired in `useAuth`

**Sprint:** before 1.0
**Status:** `[ ]` open

**Problem:**
`useAuth.ts` exposes a `signIn(email, password)` method (line 11) which calls `POST /auth/login`. The password-based auth flow was removed from the UI (`#46`), but the hook method and API remain. This is dead code that could accidentally be re-exposed.

**File:** `libs/identity/ui/src/hooks/useAuth.ts:11-24`

**What needs to change:**
- Remove `signIn` from `useAuth` if password auth is permanently dropped
- Remove `signIn` from `authApi` in `auth.api.ts`
- Confirm with backend that `POST /auth/login` is also removed or restricted

---

### [P2-4] `app.json` `version` still at `0.0.1`

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
`apps/mobile/app.json` has `"version": "0.0.1"`. Both app stores require the version to follow semantic versioning and increment on each release.

**What needs to change:**
- Set `version` to `1.0.0` before the first production submission
- `eas.json` has `autoIncrement: true` which handles build numbers automatically — confirm this is sufficient or add explicit versioning strategy

---

### [P2-5] EAS submit configuration is empty

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
`eas.json` `submit.production` block is `{}`. Automated store submission will not work without store credentials.

**File:** `apps/mobile/eas.json:22-24`

**What needs to change:**
- **Android:** Add `serviceAccountKeyPath` pointing to a Google Play service account JSON
- **iOS:** Add `appleId`, `ascAppId` (App Store Connect app ID), and `appleTeamId`

---

### [P2-6] Browser polyfills — bundle size not optimised

**Sprint:** 6
**Status:** `[ ]` open

**Problem:**
`package.json` includes 7 Node.js polyfills (assert, buffer, https-browserify, os-browserify, path-browserify, stream-browserify, stream-http) required by axios in the Metro bundler. These increase bundle size and are a maintenance burden.

**What needs to change:**
- Audit which polyfills are actually needed at runtime
- Consider switching to `axios` v1.7+ with native fetch adapter or using `ky` which has no Node.js dependencies — defer decision to Sprint 6

---

## Appendix — Environment Variables Reference

| Variable | Required | Used in | Notes |
|----------|----------|---------|-------|
| `EXPO_PUBLIC_API_URL` | **Yes (production)** | `libs/shared/utils/src/api-client.ts:7` | Falls back to `localhost:8080` if missing |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` | Yes (if Google Sign-In enabled) | `libs/identity/ui/src/hooks/useGoogleSignIn.ts` | Silently breaks Google Sign-In if missing |

---

## Appendix — Sprint 6 Deploy Checklist

Pre-flight before submitting to stores:

- [ ] P0-1: Token persistence via SecureStore
- [ ] P0-2: Axios interceptor with token refresh
- [ ] P0-3: EAS signing configured (iOS cert + Android keystore)
- [ ] P0-4: `EXPO_PUBLIC_API_URL` set in EAS production profile
- [ ] P0-5: App Links / Universal Links migration
- [ ] P1-1: Console statements removed or guarded
- [ ] P1-2: `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` set in EAS production profile
- [ ] P1-3: Magic link error messaging
- [ ] P1-5: `.env.example` committed
- [ ] P2-1: No placeholder text visible to users
- [ ] P2-3: Dead `signIn` method removed
- [ ] P2-4: `version` bumped to `1.0.0`
- [ ] P2-5: EAS submit config populated
- [ ] All pre-push hooks passing on `master`

import type { AuthSessionResult } from 'expo-auth-session';

/**
 * Web / default stub — Google OAuth is not supported on web.
 * Metro picks useGooglePrompt.native.ts on Android/iOS at runtime.
 * TypeScript uses this file for type inference on all platforms.
 * The app is native-only (Expo Go); this stub is never called in production.
 */
export function useGooglePrompt(): () => Promise<AuthSessionResult> {
  return async (): Promise<AuthSessionResult> => ({ type: 'dismiss' });
}

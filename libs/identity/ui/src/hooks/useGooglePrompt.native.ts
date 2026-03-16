import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import type { AuthSessionResult } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export function useGooglePrompt(): () => Promise<AuthSessionResult> {
  const [, , promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
  });

  return promptAsync;
}

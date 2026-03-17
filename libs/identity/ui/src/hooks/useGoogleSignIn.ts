import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from './useAuth';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const { signInWithGoogle, isLoading, error } = useAuth();

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const isConfigured = !!webClientId;

  // expo-auth-session throws an invariant if clientId is undefined.
  // Pass a placeholder so the hook mounts safely; isConfigured gates actual use.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId ?? 'not-configured',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      signInWithGoogle(id_token);
    }
  }, [response]);

  return {
    promptAsync,
    isLoading,
    error,
    disabled: !isConfigured || !request,
  };
}

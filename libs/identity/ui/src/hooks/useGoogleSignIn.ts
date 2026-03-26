import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from './useAuth';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const { signInWithGoogle, isLoading, error } = useAuth();

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;
  const isConfigured = !!webClientId;

  // expo-auth-session throws an invariant if clientId is undefined.
  // Pass a placeholder so the hook mounts safely; isConfigured gates actual use.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId ?? 'not-configured',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
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

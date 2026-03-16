import { useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { authApi } from '@connecthealth/identity/infrastructure';
import { useAuthStore } from '@connecthealth/identity/application';

WebBrowser.maybeCompleteAuthSession();

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, , promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
  });

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: authUser, tokens } = await authApi.signIn({ email, password });
      setAuth(authUser, tokens.accessToken, tokens.refreshToken);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to sign in';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: authUser, tokens } = await authApi.signUp({ name, email, password });
      setAuth(authUser, tokens.accessToken, tokens.refreshToken);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to sign up';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMagicLink = async (email: string, name?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.sendMagicLink({ email, name });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to send magic link';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMagicLink = async (token: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: authUser, tokens } = await authApi.verifyMagicLink(token);
      setAuth(authUser, tokens.accessToken, tokens.refreshToken);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Invalid or expired magic link';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await promptAsync();
      if (result.type !== 'success') return;
      const idToken = result.params.id_token;
      const { user: authUser, tokens } = await authApi.googleSignIn({ idToken });
      setAuth(authUser, tokens.accessToken, tokens.refreshToken);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Google sign in failed';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = (): void => {
    clearAuth();
  };

  return { user, isAuthenticated, isLoading, error, signIn, signUp, sendMagicLink, verifyMagicLink, signInWithGoogle, signOut };
}

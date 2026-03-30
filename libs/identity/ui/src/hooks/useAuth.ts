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
      const message = e instanceof Error ? e.message : 'Failed to sign in';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMagicLink = async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const redirectUrl = process.env.EXPO_PUBLIC_MAGIC_LINK_REDIRECT_URL;
      await authApi.sendMagicLink({ email, redirectUrl });
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

  const signInWithGoogle = async (idToken: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: authUser, tokens } = await authApi.signInWithGoogle({ idToken });
      setAuth(authUser, tokens.accessToken, tokens.refreshToken);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to sign in with Google';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = (): void => {
    clearAuth();
  };

  return { user, isAuthenticated, isLoading, error, signIn, sendMagicLink, verifyMagicLink, signInWithGoogle, signOut };
}

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

  const signOut = (): void => {
    clearAuth();
  };

  return { user, isAuthenticated, isLoading, error, signIn, signUp, signOut };
}

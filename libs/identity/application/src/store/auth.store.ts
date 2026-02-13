// TODO: Implement auth store with Zustand in Sprint 1
// This store will manage authentication state including:
// - Current user
// - Auth tokens
// - Login/logout actions
// - Token refresh logic

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  // user: User | null; // Uncomment when implementing
}

export const AUTH_STORE_PLACEHOLDER = 'auth.store';

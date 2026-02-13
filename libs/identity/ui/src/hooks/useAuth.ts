// TODO: Implement useAuth hook in Sprint 1
// This hook will provide:
// - Current auth state
// - signIn function
// - signUp function
// - signOut function
// - isLoading state

export function useAuth() {
  // Placeholder implementation
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    signIn: async (_email: string, _password: string) => {
      // TODO: Implement
    },
    signUp: async (_name: string, _email: string, _password: string) => {
      // TODO: Implement
    },
    signOut: async () => {
      // TODO: Implement
    },
  };
}

import { apiClient } from '@connecthealth/shared/utils';

export interface MagicLinkRequest {
  email: string;
  redirectUrl?: string;
}

export interface GoogleSignInRequest {
  idToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

interface ApiAuthResponse {
  data: AuthResponse;
}

export const authApi = {
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiAuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  },

  sendMagicLink: async (data: MagicLinkRequest): Promise<void> => {
    await apiClient.post('/auth/magic-link', data);
  },

  verifyMagicLink: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiAuthResponse>('/auth/magic-link/verify', { token });
    return response.data.data;
  },

  signInWithGoogle: async (data: GoogleSignInRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiAuthResponse>('/auth/google', data);
    return response.data.data;
  },
};

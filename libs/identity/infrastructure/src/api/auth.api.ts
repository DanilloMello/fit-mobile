// TODO: Implement auth API client in Sprint 1
// This module will handle:
// - POST /auth/signin
// - POST /auth/signup
// - POST /auth/refresh
// - POST /auth/logout

import { apiClient } from '@connecthealth/shared/utils';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  signIn: async (_data: SignInRequest): Promise<AuthResponse> => {
    // TODO: Implement
    const response = await apiClient.post<AuthResponse>('/auth/signin', _data);
    return response.data;
  },

  signUp: async (_data: SignUpRequest): Promise<AuthResponse> => {
    // TODO: Implement
    const response = await apiClient.post<AuthResponse>('/auth/signup', _data);
    return response.data;
  },

  refreshToken: async (_refreshToken: string): Promise<AuthResponse> => {
    // TODO: Implement
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken: _refreshToken,
    });
    return response.data;
  },
};

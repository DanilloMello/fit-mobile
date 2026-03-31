import { apiClient } from '@connecthealth/shared/utils';

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  photoUrl?: string;
}

interface ApiProfileResponse {
  data: ProfileResponse;
}

export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ApiProfileResponse>('/profile');
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await apiClient.patch<ApiProfileResponse>('/profile', data);
    return response.data.data;
  },
};

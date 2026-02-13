// TODO: Implement client API in Sprint 2
// This module will handle:
// - GET /clients
// - GET /clients/:id
// - POST /clients
// - PUT /clients/:id
// - DELETE /clients/:id

import { apiClient } from '@connecthealth/shared/utils';
import { ClientProps } from '@connecthealth/client/domain';

export const clientApi = {
  getAll: async (): Promise<ClientProps[]> => {
    const response = await apiClient.get<ClientProps[]>('/clients');
    return response.data;
  },

  getById: async (id: string): Promise<ClientProps> => {
    const response = await apiClient.get<ClientProps>(`/clients/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<ClientProps, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ClientProps> => {
    const response = await apiClient.post<ClientProps>('/clients', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<ClientProps>
  ): Promise<ClientProps> => {
    const response = await apiClient.put<ClientProps>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};

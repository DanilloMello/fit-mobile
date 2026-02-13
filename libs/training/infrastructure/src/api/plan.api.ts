// TODO: Implement plan API in Sprint 3
// This module will handle:
// - GET /plans
// - GET /plans/:id
// - POST /plans
// - PUT /plans/:id
// - DELETE /plans/:id
// - GET /plans/:id/exercises
// - POST /plans/:id/exercises

import { apiClient } from '@connecthealth/shared/utils';
import { PlanProps } from '@connecthealth/training/domain';

export const planApi = {
  getAll: async (): Promise<PlanProps[]> => {
    const response = await apiClient.get<PlanProps[]>('/plans');
    return response.data;
  },

  getById: async (id: string): Promise<PlanProps> => {
    const response = await apiClient.get<PlanProps>(`/plans/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<PlanProps, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PlanProps> => {
    const response = await apiClient.post<PlanProps>('/plans', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<PlanProps>
  ): Promise<PlanProps> => {
    const response = await apiClient.put<PlanProps>(`/plans/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/plans/${id}`);
  },
};

import { apiClient } from '@connecthealth/shared/utils';

import { Goal, MesocycleStatus } from '@connecthealth/training/domain';

import { MesocycleDto } from './plan.api';

export interface CreateMesocycleDto {
  name: string;
  goal?: Goal;
  startWeek: number;
  endWeek: number;
}

export interface UpdateMesocycleDto {
  name?: string;
  goal?: Goal;
  startWeek?: number;
  endWeek?: number;
  status?: MesocycleStatus;
}

export const mesocycleApi = {
  create: async (
    planId: string,
    dto: CreateMesocycleDto
  ): Promise<MesocycleDto> => {
    const response = await apiClient.post<{ data: MesocycleDto }>(
      `/plans/${planId}/mesocycles`,
      dto
    );
    return response.data.data;
  },

  update: async (
    planId: string,
    id: string,
    dto: UpdateMesocycleDto
  ): Promise<MesocycleDto> => {
    const response = await apiClient.patch<{ data: MesocycleDto }>(
      `/plans/${planId}/mesocycles/${id}`,
      dto
    );
    return response.data.data;
  },

  delete: async (planId: string, id: string): Promise<void> => {
    await apiClient.delete(`/plans/${planId}/mesocycles/${id}`);
  },
};

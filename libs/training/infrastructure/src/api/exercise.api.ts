import { apiClient } from '@connecthealth/shared/utils';

import { Equipment, MuscleGroup } from '@connecthealth/training/domain';

export interface ExerciseDto {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  description: string | null;
}

export const exerciseApi = {
  list: async (params?: {
    muscleGroup?: MuscleGroup;
    equipment?: Equipment;
  }): Promise<ExerciseDto[]> => {
    const response = await apiClient.get<{ data: ExerciseDto[] }>(
      '/exercises',
      { params }
    );
    return response.data.data;
  },

  search: async (q: string, limit?: number): Promise<ExerciseDto[]> => {
    const response = await apiClient.get<{ data: ExerciseDto[] }>(
      '/exercises/search',
      { params: { q, limit } }
    );
    return response.data.data;
  },
};

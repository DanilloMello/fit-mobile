import { apiClient } from '@connecthealth/shared/utils';

import { DayOfWeek } from '@connecthealth/training/domain';

import { WorkoutDayDto } from './plan.api';

export interface CreateWorkoutDayDto {
  dayOfWeek: DayOfWeek;
  label?: string;
  isRestDay?: boolean;
}

export interface UpdateWorkoutDayDto {
  dayOfWeek?: DayOfWeek;
  label?: string;
  isRestDay?: boolean;
}

export const workoutDayApi = {
  create: async (
    microcycleId: string,
    dto: CreateWorkoutDayDto
  ): Promise<WorkoutDayDto> => {
    const response = await apiClient.post<{ data: WorkoutDayDto }>(
      `/microcycles/${microcycleId}/workout-days`,
      dto
    );
    return response.data.data;
  },

  update: async (
    id: string,
    dto: UpdateWorkoutDayDto
  ): Promise<WorkoutDayDto> => {
    const response = await apiClient.patch<{ data: WorkoutDayDto }>(
      `/workout-days/${id}`,
      dto
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workout-days/${id}`);
  },
};

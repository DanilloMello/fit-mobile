import { apiClient } from '@connecthealth/shared/utils';

import { WorkoutDayExerciseDto } from './plan.api';

export interface AddExerciseToWorkoutDayDto {
  exerciseId: string;
  sets: number;
  reps: string;
  load?: string;
  restSeconds?: number;
  notes?: string;
}

export interface UpdateWorkoutDayExerciseDto {
  sets?: number;
  reps?: string;
  load?: string;
  restSeconds?: number;
  notes?: string;
}

export const workoutDayExerciseApi = {
  add: async (
    dayId: string,
    dto: AddExerciseToWorkoutDayDto
  ): Promise<WorkoutDayExerciseDto> => {
    const response = await apiClient.post<{ data: WorkoutDayExerciseDto }>(
      `/workout-days/${dayId}/exercises`,
      dto
    );
    return response.data.data;
  },

  update: async (
    id: string,
    dto: UpdateWorkoutDayExerciseDto
  ): Promise<WorkoutDayExerciseDto> => {
    const response = await apiClient.patch<{ data: WorkoutDayExerciseDto }>(
      `/workout-day-exercises/${id}`,
      dto
    );
    return response.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/workout-day-exercises/${id}`);
  },

  reorder: async (dayId: string, exerciseIds: string[]): Promise<void> => {
    await apiClient.put(`/workout-days/${dayId}/exercises/reorder`, {
      exerciseIds,
    });
  },
};

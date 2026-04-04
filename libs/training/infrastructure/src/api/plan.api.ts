import { apiClient } from '@connecthealth/shared/utils';

import {
  Goal,
  MesocycleStatus,
  PeriodizationType,
  PlanStatus,
} from '@connecthealth/training/domain';

// --- API DTO types (mirror fit-api response shapes) ---

export interface PlanSummaryDto {
  id: string;
  name: string;
  goal: Goal | null;
  periodizationType: PeriodizationType | null;
  status: PlanStatus;
  statusNote: string | null;
  totalWeeks: number;
  mesocycleCount: number;
  workoutsDone: number;
  workoutsTotal: number;
  clientName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutDayExerciseDto {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  load: string | null;
  restSeconds: number | null;
  orderIndex: number;
}

export interface WorkoutDayDto {
  id: string;
  dayOfWeek: string;
  label: string | null;
  isRestDay: boolean;
  orderIndex: number;
  exerciseCount: number;
  exercises: WorkoutDayExerciseDto[];
}

export interface MicrocycleDto {
  id: string;
  weekNumber: number;
  orderIndex: number;
  workoutDays: WorkoutDayDto[];
}

export interface MesocycleDto {
  id: string;
  name: string;
  goal: Goal | null;
  orderIndex: number;
  startWeek: number;
  endWeek: number;
  status: MesocycleStatus;
  microcycles: MicrocycleDto[];
}

export interface PlanDetailDto {
  id: string;
  name: string;
  goal: Goal | null;
  periodizationType: PeriodizationType | null;
  description: string | null;
  status: PlanStatus;
  statusNote: string | null;
  totalWeeks: number;
  createdAt: string;
  updatedAt: string;
  mesocycles: MesocycleDto[];
}

export interface PlanListMeta {
  page: number;
  size: number;
  totalElements: number;
}

export interface CreatePlanDto {
  name: string;
  goal?: Goal;
  periodizationType?: PeriodizationType;
  description?: string;
  totalWeeks: number;
}

export interface UpdatePlanDto {
  name?: string;
  goal?: Goal;
  periodizationType?: PeriodizationType;
  description?: string;
  status?: PlanStatus;
  totalWeeks?: number;
}

// --- API client ---

export const planApi = {
  list: async (params?: {
    status?: PlanStatus;
    page?: number;
    size?: number;
  }): Promise<{ data: PlanSummaryDto[]; meta: PlanListMeta }> => {
    const response = await apiClient.get<{
      data: PlanSummaryDto[];
      meta: PlanListMeta;
    }>('/plans', { params });
    return response.data;
  },

  getById: async (id: string): Promise<PlanDetailDto> => {
    const response = await apiClient.get<{ data: PlanDetailDto }>(
      `/plans/${id}`
    );
    return response.data.data;
  },

  create: async (dto: CreatePlanDto): Promise<PlanDetailDto> => {
    const response = await apiClient.post<{ data: PlanDetailDto }>(
      '/plans',
      dto
    );
    return response.data.data;
  },

  update: async (id: string, dto: UpdatePlanDto): Promise<PlanDetailDto> => {
    const response = await apiClient.patch<{ data: PlanDetailDto }>(
      `/plans/${id}`,
      dto
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/plans/${id}`);
  },
};

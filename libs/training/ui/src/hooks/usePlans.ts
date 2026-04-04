import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreatePlanDto,
  UpdatePlanDto,
  planApi,
  PlanSummaryDto,
} from '@connecthealth/training/infrastructure';
import { PlanStatus } from '@connecthealth/training/domain';

export const planKeys = {
  all: ['plans'] as const,
  list: (filters?: { status?: PlanStatus }) =>
    [...planKeys.all, 'list', filters] as const,
  detail: (id: string) => [...planKeys.all, 'detail', id] as const,
};

export function usePlans(filters?: { status?: PlanStatus }) {
  return useQuery({
    queryKey: planKeys.list(filters),
    queryFn: () => planApi.list(filters),
    select: (res) => res.data,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePlanDto) => planApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePlanDto }) =>
      planApi.update(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: planKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: planKeys.list() });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => planApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
}

export type { PlanSummaryDto };

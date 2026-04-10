import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreatePlanDto,
  UpdatePlanDto,
  planApi,
  PlanSummaryDto,
} from '@connecthealth/training/infrastructure';

export const planKeys = {
  all: ['plans'] as const,
  list: () => [...planKeys.all, 'list'] as const,
  detail: (id: string) => [...planKeys.all, 'detail', id] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: planKeys.list(),
    queryFn: () => planApi.list(),
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

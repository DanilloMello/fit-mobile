import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreateMesocycleDto,
  UpdateMesocycleDto,
  mesocycleApi,
  planApi,
  PlanDetailDto,
} from '@connecthealth/training/infrastructure';

import { planKeys } from './usePlans';

export function usePlanDetail(id: string) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => planApi.getById(id),
    enabled: !!id,
  });
}

export function useAddMesocycle(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMesocycleDto) =>
      mesocycleApi.create(planId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.detail(planId) });
    },
  });
}

export function useUpdateMesocycle(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      mesocycleId,
      dto,
    }: {
      mesocycleId: string;
      dto: UpdateMesocycleDto;
    }) => mesocycleApi.update(planId, mesocycleId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.detail(planId) });
    },
  });
}

export function useDeleteMesocycle(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mesocycleId: string) =>
      mesocycleApi.delete(planId, mesocycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.detail(planId) });
    },
  });
}

export type { PlanDetailDto };

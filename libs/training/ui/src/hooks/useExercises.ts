import { useQuery } from '@tanstack/react-query';

import { exerciseApi, ExerciseDto } from '@connecthealth/training/infrastructure';
import { Equipment, MuscleGroup } from '@connecthealth/training/domain';

const exerciseKeys = {
  all: ['exercises'] as const,
  list: (filters?: { muscleGroup?: MuscleGroup; equipment?: Equipment }) =>
    [...exerciseKeys.all, 'list', filters] as const,
  search: (q: string) => [...exerciseKeys.all, 'search', q] as const,
};

export function useExercises(filters?: {
  muscleGroup?: MuscleGroup;
  equipment?: Equipment;
}) {
  return useQuery({
    queryKey: exerciseKeys.list(filters),
    queryFn: () => exerciseApi.list(filters),
  });
}

export function useExerciseSearch(q: string) {
  return useQuery({
    queryKey: exerciseKeys.search(q),
    queryFn: () => exerciseApi.search(q),
    enabled: q.length >= 2,
  });
}

export type { ExerciseDto };

import { create } from 'zustand';

import { PlanStatus } from '@connecthealth/training/domain';

interface TrainingState {
  selectedPlanId: string | null;
  statusFilter: PlanStatus | null;
}

interface TrainingActions {
  setSelectedPlanId: (id: string | null) => void;
  setStatusFilter: (status: PlanStatus | null) => void;
}

export const useTrainingStore = create<TrainingState & TrainingActions>((set) => ({
  selectedPlanId: null,
  statusFilter: null,
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));

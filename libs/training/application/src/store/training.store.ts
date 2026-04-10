import { create } from 'zustand';

interface TrainingState {
  selectedPlanId: string | null;
}

interface TrainingActions {
  setSelectedPlanId: (id: string | null) => void;
}

export const useTrainingStore = create<TrainingState & TrainingActions>((set) => ({
  selectedPlanId: null,
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
}));

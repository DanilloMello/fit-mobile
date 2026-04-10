import { MesocycleDto, MicrocycleDto, PlanDetailDto } from '@connecthealth/training/infrastructure';

// ─── Extended types for wireframe visualization ───────────────────────────────
// These augment the API DTOs with fields the wireframe shows but the API
// does not yet provide. When the API adds these fields, remove the extensions
// and update the map functions.

export type PlanBuilderStatus = 'done' | 'done_warning' | 'in_progress' | 'not_started';

export interface MockMicrocycleDto extends MicrocycleDto {
  name: string;
  goal: string | null;
  status: PlanBuilderStatus;
  workoutCount: number;
}

export interface MockMesocycleDto extends Omit<MesocycleDto, 'microcycles'> {
  microcycles: MockMicrocycleDto[];
  displayStatus: PlanBuilderStatus;
}

export interface MockPlanDetailDto extends Omit<PlanDetailDto, 'mesocycles'> {
  mesocycles: MockMesocycleDto[];
  workoutsDone: number;
  workoutsTotal: number;
  durationDays: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_PLAN: MockPlanDetailDto = {
  id: 'mock-plan-1',
  name: 'Hypertrophy Plan 1',
  goal: 'STRENGTH',
  periodizationType: 'LINEAR',
  description: null,
  status: 'ACTIVE',
  statusNote: null,
  totalWeeks: 16,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-04-01T00:00:00Z',
  workoutsDone: 10,
  workoutsTotal: 33,
  durationDays: 360,
  mesocycles: [
    {
      id: 'meso-1',
      name: 'Hypertrophy Phase',
      goal: 'HYPERTROPHY',
      orderIndex: 0,
      startWeek: 1,
      endWeek: 4,
      status: 'DONE',
      displayStatus: 'done',
      microcycles: [
        {
          id: 'micro-1-1',
          weekNumber: 1,
          orderIndex: 0,
          name: 'Adapting',
          goal: 'Base volume',
          status: 'done',
          workoutCount: 3,
          workoutDays: [],
        },
        {
          id: 'micro-1-2',
          weekNumber: 2,
          orderIndex: 1,
          name: 'Increasing',
          goal: 'Add load',
          status: 'done',
          workoutCount: 3,
          workoutDays: [],
        },
        {
          id: 'micro-1-3',
          weekNumber: 3,
          orderIndex: 2,
          name: 'Peaking',
          goal: 'Max effort',
          status: 'done',
          workoutCount: 3,
          workoutDays: [],
        },
        {
          id: 'micro-1-4',
          weekNumber: 4,
          orderIndex: 3,
          name: 'Deload',
          goal: 'Recovery',
          status: 'done',
          workoutCount: 2,
          workoutDays: [],
        },
      ],
    },
    {
      id: 'meso-2',
      name: 'Strength Phase',
      goal: 'STRENGTH',
      orderIndex: 1,
      startWeek: 5,
      endWeek: 8,
      status: 'DONE',
      displayStatus: 'done_warning',
      microcycles: [
        {
          id: 'micro-2-1',
          weekNumber: 5,
          orderIndex: 0,
          name: 'Adapting',
          goal: 'Base strength',
          status: 'done',
          workoutCount: 3,
          workoutDays: [],
        },
        {
          id: 'micro-2-2',
          weekNumber: 6,
          orderIndex: 1,
          name: 'Increasing',
          goal: 'Progressive overload',
          status: 'done_warning',
          workoutCount: 2,
          workoutDays: [],
        },
        {
          id: 'micro-2-3',
          weekNumber: 7,
          orderIndex: 2,
          name: 'Peaking',
          goal: 'Heavy singles',
          status: 'done',
          workoutCount: 3,
          workoutDays: [],
        },
        {
          id: 'micro-2-4',
          weekNumber: 8,
          orderIndex: 3,
          name: 'Deload',
          goal: 'Active recovery',
          status: 'done',
          workoutCount: 2,
          workoutDays: [],
        },
      ],
    },
    {
      id: 'meso-3',
      name: 'Peaking Phase',
      goal: 'STRENGTH',
      orderIndex: 2,
      startWeek: 9,
      endWeek: 14,
      status: 'IN_PROGRESS',
      displayStatus: 'in_progress',
      microcycles: [
        {
          id: 'micro-3-1',
          weekNumber: 9,
          orderIndex: 0,
          name: 'Accumulation',
          goal: 'Build work capacity',
          status: 'done',
          workoutCount: 4,
          workoutDays: [],
        },
        {
          id: 'micro-3-2',
          weekNumber: 10,
          orderIndex: 1,
          name: 'Intensification',
          goal: 'Push intensity',
          status: 'in_progress',
          workoutCount: 2,
          workoutDays: [],
        },
        {
          id: 'micro-3-3',
          weekNumber: 11,
          orderIndex: 2,
          name: 'Realization',
          goal: 'Express strength',
          status: 'not_started',
          workoutCount: 0,
          workoutDays: [],
        },
        {
          id: 'micro-3-4',
          weekNumber: 12,
          orderIndex: 3,
          name: 'Deload',
          goal: 'Full recovery',
          status: 'not_started',
          workoutCount: 0,
          workoutDays: [],
        },
      ],
    },
    {
      id: 'meso-4',
      name: 'Deload Phase',
      goal: 'HEALTH',
      orderIndex: 3,
      startWeek: 15,
      endWeek: 16,
      status: 'PENDING',
      displayStatus: 'not_started',
      microcycles: [
        {
          id: 'micro-4-1',
          weekNumber: 15,
          orderIndex: 0,
          name: 'Recovery',
          goal: 'Light movement',
          status: 'not_started',
          workoutCount: 0,
          workoutDays: [],
        },
      ],
    },
  ],
};

export type Goal =
  | 'HYPERTROPHY'
  | 'WEIGHT_LOSS'
  | 'STRENGTH'
  | 'CONDITIONING'
  | 'HEALTH';

export type PeriodizationType = 'LINEAR' | 'UNDULATING' | 'BLOCK';

export type PlanStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CANCELED'
  | 'COMPLETED';

export type MesocycleStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export type MuscleGroup =
  | 'CHEST'
  | 'BACK'
  | 'SHOULDERS'
  | 'BICEPS'
  | 'TRICEPS'
  | 'FOREARMS'
  | 'CORE'
  | 'QUADRICEPS'
  | 'HAMSTRINGS'
  | 'GLUTES'
  | 'CALVES'
  | 'FULL_BODY';

export type Equipment =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'CABLE'
  | 'MACHINE'
  | 'BODYWEIGHT'
  | 'KETTLEBELL'
  | 'BAND'
  | 'OTHER';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

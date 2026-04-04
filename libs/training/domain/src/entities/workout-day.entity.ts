import { Entity, EntityProps } from '@connecthealth/shared/domain';

import { DayOfWeek } from '../enums';

export interface WorkoutDayProps extends EntityProps {
  microcycleId: string;
  dayOfWeek: DayOfWeek;
  label?: string;
  isRestDay: boolean;
  orderIndex: number;
  exerciseCount?: number;
  createdAt: string;
}

export class WorkoutDay extends Entity<WorkoutDayProps> {
  get microcycleId(): string { return this.props.microcycleId; }
  get dayOfWeek(): DayOfWeek { return this.props.dayOfWeek; }
  get label(): string | undefined { return this.props.label; }
  get isRestDay(): boolean { return this.props.isRestDay; }
  get orderIndex(): number { return this.props.orderIndex; }
  get exerciseCount(): number | undefined { return this.props.exerciseCount; }
}

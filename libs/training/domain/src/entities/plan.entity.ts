import { Entity, EntityProps } from '@connecthealth/shared/domain';

import { Goal, PeriodizationType, PlanStatus } from '../enums';

export interface PlanProps extends EntityProps {
  ownerId: string;
  clientId?: string;
  name: string;
  goal?: Goal;
  periodizationType?: PeriodizationType;
  description?: string;
  status: PlanStatus;
  statusNote?: string;
  totalWeeks: number;
  // Summary fields present on list response
  mesocycleCount?: number;
  workoutsDone?: number;
  workoutsTotal?: number;
  clientName?: string;
  createdAt: string;
  updatedAt: string;
}

export class Plan extends Entity<PlanProps> {
  get name(): string { return this.props.name; }
  get status(): PlanStatus { return this.props.status; }
  get goal(): Goal | undefined { return this.props.goal; }
  get periodizationType(): PeriodizationType | undefined { return this.props.periodizationType; }
  get description(): string | undefined { return this.props.description; }
  get totalWeeks(): number { return this.props.totalWeeks; }
  get statusNote(): string | undefined { return this.props.statusNote; }
  get clientId(): string | undefined { return this.props.clientId; }
  get clientName(): string | undefined { return this.props.clientName; }
  get mesocycleCount(): number | undefined { return this.props.mesocycleCount; }
  get workoutsDone(): number | undefined { return this.props.workoutsDone; }
  get workoutsTotal(): number | undefined { return this.props.workoutsTotal; }
}

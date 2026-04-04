import { Entity, EntityProps } from '@connecthealth/shared/domain';

import { Goal, MesocycleStatus } from '../enums';

export interface MesocycleProps extends EntityProps {
  planId: string;
  name: string;
  goal?: Goal;
  orderIndex: number;
  startWeek: number;
  endWeek: number;
  status: MesocycleStatus;
  createdAt: string;
}

export class Mesocycle extends Entity<MesocycleProps> {
  get name(): string { return this.props.name; }
  get planId(): string { return this.props.planId; }
  get goal(): Goal | undefined { return this.props.goal; }
  get orderIndex(): number { return this.props.orderIndex; }
  get startWeek(): number { return this.props.startWeek; }
  get endWeek(): number { return this.props.endWeek; }
  get status(): MesocycleStatus { return this.props.status; }
}

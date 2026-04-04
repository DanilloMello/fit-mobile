import { Entity, EntityProps } from '@connecthealth/shared/domain';

export interface MicrocycleProps extends EntityProps {
  mesocycleId: string;
  weekNumber: number;
  orderIndex: number;
  createdAt: string;
}

export class Microcycle extends Entity<MicrocycleProps> {
  get mesocycleId(): string { return this.props.mesocycleId; }
  get weekNumber(): number { return this.props.weekNumber; }
  get orderIndex(): number { return this.props.orderIndex; }
}

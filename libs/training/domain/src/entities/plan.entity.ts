import { Entity, EntityProps } from '@connecthealth/shared/domain';

export interface PlanProps extends EntityProps {
  name: string;
  description?: string;
  clientId: string;
  personalId: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  exerciseIds: string[];
  createdAt: string;
  updatedAt: string;
}

export class Plan extends Entity<PlanProps> {
  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get personalId(): string {
    return this.props.personalId;
  }

  get startDate(): string {
    return this.props.startDate;
  }

  get endDate(): string | undefined {
    return this.props.endDate;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get exerciseIds(): string[] {
    return this.props.exerciseIds;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }
}

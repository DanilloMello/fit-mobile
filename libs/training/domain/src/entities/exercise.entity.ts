import { Entity, EntityProps } from '@connecthealth/shared/domain';

export interface ExerciseProps extends EntityProps {
  name: string;
  description?: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  restSeconds: number;
  weight?: number;
  notes?: string;
  order: number;
  planId: string;
  createdAt: string;
  updatedAt: string;
}

export class Exercise extends Entity<ExerciseProps> {
  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get muscleGroup(): string {
    return this.props.muscleGroup;
  }

  get sets(): number {
    return this.props.sets;
  }

  get reps(): number {
    return this.props.reps;
  }

  get restSeconds(): number {
    return this.props.restSeconds;
  }

  get weight(): number | undefined {
    return this.props.weight;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get order(): number {
    return this.props.order;
  }

  get planId(): string {
    return this.props.planId;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }
}

import { Entity, EntityProps } from '@connecthealth/shared/domain';

import { Equipment, MuscleGroup } from '../enums';

export interface ExerciseProps extends EntityProps {
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  description?: string;
  createdAt: string;
}

export class Exercise extends Entity<ExerciseProps> {
  get name(): string { return this.props.name; }
  get muscleGroup(): MuscleGroup { return this.props.muscleGroup; }
  get equipment(): Equipment { return this.props.equipment; }
  get description(): string | undefined { return this.props.description; }
}

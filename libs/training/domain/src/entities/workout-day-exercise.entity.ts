import { Entity, EntityProps } from '@connecthealth/shared/domain';

export interface WorkoutDayExerciseProps extends EntityProps {
  workoutDayId: string;
  exerciseId: string;
  exerciseName?: string;
  orderIndex: number;
  sets: number;
  reps: string;
  load?: string;
  restSeconds?: number;
  notes?: string;
  createdAt: string;
}

export class WorkoutDayExercise extends Entity<WorkoutDayExerciseProps> {
  get exerciseId(): string { return this.props.exerciseId; }
  get exerciseName(): string | undefined { return this.props.exerciseName; }
  get sets(): number { return this.props.sets; }
  get reps(): string { return this.props.reps; }
  get load(): string | undefined { return this.props.load; }
  get restSeconds(): number | undefined { return this.props.restSeconds; }
  get orderIndex(): number { return this.props.orderIndex; }
  get notes(): string | undefined { return this.props.notes; }
}

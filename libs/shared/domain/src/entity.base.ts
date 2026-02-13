export interface EntityProps {
  id: string;
}

export abstract class Entity<T extends EntityProps> {
  constructor(public readonly props: T) {}

  get id(): string {
    return this.props.id;
  }

  equals(other: Entity<T>): boolean {
    return this.id === other.id;
  }
}

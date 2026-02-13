import { Entity, EntityProps } from '@connecthealth/shared/domain';

export interface UserProps extends EntityProps {
  email: string;
  name: string;
  role: 'PERSONAL' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export class User extends Entity<UserProps> {
  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get role(): 'PERSONAL' | 'ADMIN' {
    return this.props.role;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }
}

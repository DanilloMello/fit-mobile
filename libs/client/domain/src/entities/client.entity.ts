import { Entity, EntityProps } from '@connecthealth/shared/domain';

export interface ClientProfile {
  height?: number; // cm
  weight?: number; // kg
  birthDate?: string;
  goals?: string;
  healthNotes?: string;
}

export interface ClientProps extends EntityProps {
  name: string;
  email: string;
  phone?: string;
  profile: ClientProfile;
  personalId: string; // ID of the personal trainer
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Client extends Entity<ClientProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get profile(): ClientProfile {
    return this.props.profile;
  }

  get personalId(): string {
    return this.props.personalId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }
}

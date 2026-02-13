import { Client, ClientProps } from '@connecthealth/client/domain';

/**
 * Port (interface) for client repository.
 * Infrastructure layer will provide the concrete implementation.
 */
export interface ClientRepository {
  findAll(): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  create(data: Omit<ClientProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client>;
  update(id: string, data: Partial<ClientProps>): Promise<Client>;
  delete(id: string): Promise<void>;
}

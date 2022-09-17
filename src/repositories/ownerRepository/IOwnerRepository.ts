import { Owner } from '@prisma/client'

export interface IOwnerRepository {
  create(
    owner: Omit<Owner, 'id' | 'CreatedAt' | 'UpdatedAt' | 'email'> & {
      email?: string
    }
  ): Promise<Owner>
}

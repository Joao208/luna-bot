import { Owner } from '@prisma/client'
import { IOwnerRepository } from '@src/repositories/ownerRepository/IOwnerRepository'
import { prisma } from '@src/shared'

export class OwnerRepository implements IOwnerRepository {
  async create(
    owner: Omit<Owner, 'id' | 'CreatedAt' | 'UpdatedAt' | 'email'> & {
      email?: string
    }
  ): Promise<Owner> {
    return prisma.owner.create({
      data: owner,
    })
  }
}

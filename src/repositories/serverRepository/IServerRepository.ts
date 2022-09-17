import { Server } from '@prisma/client'

export interface IServerRepository {
  create(
    server: Omit<Server, 'id' | 'CreatedAt' | 'UpdatedAt' | 'email'>
  ): Promise<Server>
  isTheServerOwner(GuildId: string, OwnerId: string): Promise<boolean>
  findById(GuildId: string): Promise<Server | null>
}

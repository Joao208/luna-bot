import { Server } from '@prisma/client'
import { IServerRepository } from '@src/repositories/serverRepository/IServerRepository'
import { prisma } from '@src/shared'

export class ServerRepository implements IServerRepository {
  async create(
    server: Omit<Server, 'id' | 'CreatedAt' | 'UpdatedAt' | 'email'>
  ): Promise<Server> {
    return prisma.server.create({
      data: server,
    })
  }

  async isTheServerOwner(GuildId: string, OwnerId: string): Promise<boolean> {
    return !!(await prisma.server.findFirst({
      where: {
        GuildId,
        OwnerId,
      },
      select: {},
    }))
  }

  async findById(GuildId: string): Promise<Server | null> {
    return prisma.server.findUnique({
      where: {
        GuildId,
      },
    })
  }
}

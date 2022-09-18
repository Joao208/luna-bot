import { MessageComponent } from '@prisma/client'
import { IMessageComponentRepository } from '@src/repositories/messageComponentRepository/IMessageComponentRepository'
import { prisma } from '@src/shared'

export class MessageComponentRepository implements IMessageComponentRepository {
  async create(messageComponents: MessageComponent[]) {
    await prisma.messageComponent.createMany({
      data: messageComponents,
      skipDuplicates: true,
    })
  }
}

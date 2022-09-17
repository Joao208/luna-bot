import { MessageComponents } from '@prisma/client'
import { IMessageComponentRepository } from '@src/repositories/messageComponentRepository/IMessageComponentRepository'
import { prisma } from '@src/shared'

export class MessageComponentRepository implements IMessageComponentRepository {
  async create(messageComponents: MessageComponents[]) {
    await prisma.messageComponents.createMany({
      data: messageComponents,
      skipDuplicates: true,
    })
  }
}

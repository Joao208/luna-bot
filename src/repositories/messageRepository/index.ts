import { Message } from '@prisma/client'
import { IMessageRepository } from '@src/repositories/messageRepository/IMessageRepository'
import { prisma } from '@src/shared'

export class MessageRepository implements IMessageRepository {
  async create(message: Message) {
    return prisma.message.create({
      data: message,
    })
  }
}

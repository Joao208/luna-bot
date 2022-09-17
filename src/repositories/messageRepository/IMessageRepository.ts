import { Message } from '@prisma/client'

export interface IMessageRepository {
  create(message: Message): Promise<Message>
}

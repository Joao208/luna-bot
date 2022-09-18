import { MessageComponent } from '@prisma/client'

export interface IMessageComponentRepository {
  create(messageComponents: MessageComponent[]): Promise<void>
}

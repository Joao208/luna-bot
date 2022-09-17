import { MessageComponents } from '@prisma/client'

export interface IMessageComponentRepository {
  create(messageComponents: MessageComponents[]): Promise<void>
}

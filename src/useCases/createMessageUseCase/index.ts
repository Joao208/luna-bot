import { Message, MessageComponent } from '@prisma/client'
import { IMessageComponentRepository } from '@src/repositories/messageComponentRepository/IMessageComponentRepository'
import { IMessageRepository } from '@src/repositories/messageRepository/IMessageRepository'
import {
  CreateMessageProps,
  ICreateMessageUseCase,
} from '@src/useCases/createMessageUseCase/ICreateMessageUseCase'

export class CreateMessageUseCase implements ICreateMessageUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private messageComponentRepository: IMessageComponentRepository
  ) {}

  async handle({
    message,
    ChannelId,
    ServerId,
    components,
    name,
    type,
  }: CreateMessageProps) {
    const messageFormatted = {
      name,
      type,
      text: message,
      ServerId,
      ChannelId,
    } as Message

    const messageResponse = await this.messageRepository.create(
      messageFormatted
    )

    const formattedComponents = components.map((component) => ({
      CustomId: component.CustomId,
      label: component.label,
      style: component.style,
      emoji: component.emoji,
      disabled: component.disabled,
      MessageId: messageResponse.id,
    })) as MessageComponent[]

    await this.messageComponentRepository.create(formattedComponents)
  }
}

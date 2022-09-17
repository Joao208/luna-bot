import { Message, MessageComponents } from '@prisma/client'
import { IMessageComponentRepository } from '@src/repositories/messageComponentRepository/IMessageComponentRepository'
import { IMessageRepository } from '@src/repositories/messageRepository/IMessageRepository'
import { IServerRepository } from '@src/repositories/serverRepository/IServerRepository'
import {
  CreateMessageProps,
  ICreateMessageUseCase,
} from '@src/useCases/createMessageUseCase/ICreateMessageUseCase'

export class CreateMessageUseCase implements ICreateMessageUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private messageComponentRepository: IMessageComponentRepository,
    private serverRepository: IServerRepository
  ) {}

  async handle({
    message,
    ChannelId,
    ServerId,
    components,
    name,
    type,
    UserId,
  }: CreateMessageProps) {
    const foundServer = await this.serverRepository.findById(ServerId)

    if (!foundServer) throw new Error('Server not found')

    const isServerOwner = await this.serverRepository.isTheServerOwner(
      ServerId,
      UserId
    )

    if (!isServerOwner) throw new Error('You are not the server owner')

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
    })) as MessageComponents[]

    await this.messageComponentRepository.create(formattedComponents)
  }
}

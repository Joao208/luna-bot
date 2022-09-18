import { MessageComponent_style, Message_type } from '@prisma/client'

interface Component {
  CustomId: string
  label: string
  style: MessageComponent_style
  emoji: string
  disabled: boolean
}

export interface CreateMessageProps {
  message: string
  components: Component[]
  ChannelId: string
  name: string
  type: Message_type
  ServerId: string
  OwnerId: string
}

export interface ICreateMessageUseCase {
  handle: (message: CreateMessageProps) => Promise<void>
}

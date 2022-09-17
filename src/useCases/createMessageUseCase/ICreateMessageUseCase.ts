import { MessageComponents_style, Message_type } from '@prisma/client'

interface Component {
  CustomId: string
  label: string
  style: MessageComponents_style
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
  UserId: string
}

export interface ICreateMessageUseCase {
  handle: (message: CreateMessageProps) => Promise<void>
}

import { MessageComponents_style, Message_type } from '@prisma/client'
import Joi from 'joi'

const messageCreateSchema = Joi.object({
  body: {
    ChannelId: Joi.string().required(),
    components: Joi.array().items({
      CustomId: Joi.string().required(),
      label: Joi.string().required(),
      style: Joi.string()
        .valid(...Object.values(MessageComponents_style))
        .required(),
      emoji: Joi.string().required(),
      disabled: Joi.boolean().required(),
    }),
    message: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(Message_type))
      .required(),
    ServerId: Joi.string().required(),
  },
}).unknown(true)

export { messageCreateSchema }

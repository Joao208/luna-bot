import Joi from 'joi'

const loginSchema = Joi.object({
  query: {
    code: Joi.string().required(),
  },
}).unknown(true)

export { loginSchema }

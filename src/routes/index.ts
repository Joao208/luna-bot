import { Application, Router } from 'express'
import { CreateMessageUseCase, LoginUseCase } from '@src/useCases'
import { LoginController } from '@src/controllers'
import { EncryptionProvider, FetchClientProvider } from '@src/providers'
import { CreateMessageController } from '@src/controllers/createMessageController'
import { RequestBody } from '@src/middlewares'
import { loginSchema, messageCreateSchema } from '@src/schemas'
import {
  MessageComponentRepository,
  MessageRepository,
} from '@src/repositories'

export class Routes {
  constructor(private app: Application, private requestBody: RequestBody) {}

  public() {
    const router = Router()

    router.get('/login', this.requestBody.handle(loginSchema), (req, res) => {
      return new LoginController(
        new LoginUseCase(new FetchClientProvider(), new EncryptionProvider())
      ).handle(req, res)
    })

    this.app.use(router)
  }

  private() {
    const router = Router()

    router.post(
      '/message',
      this.requestBody.handle(messageCreateSchema),
      async (req, res) => {
        return new CreateMessageController(
          new CreateMessageUseCase(
            new MessageRepository(),
            new MessageComponentRepository()
          )
        ).handle(req, res)
      }
    )

    this.app.use(router)
  }
}

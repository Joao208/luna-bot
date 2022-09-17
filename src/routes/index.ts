import { Application, Router } from 'express'
import { CreateMessageUseCase, LoginUseCase } from '@src/useCases'
import { LoginController } from '@src/controllers'
import { FetchClientProvider } from '@src/providers'
import { CreateMessageController } from '@src/controllers/createMessageController'
import { RequestBody } from '@src/middlewares'
import { messageCreateSchema } from '@src/schemas'
import {
  MessageComponentRepository,
  MessageRepository,
  ServerRepository,
} from '@src/repositories'

export class Routes {
  constructor(app: Application, private requestBody: RequestBody) {
    const router = Router()

    router.get('/', (req, res) => {
      return new LoginController(
        new LoginUseCase(new FetchClientProvider())
      ).handle(req, res)
    })

    router.post(
      '/message',
      this.requestBody.handle(messageCreateSchema),
      async (req, res) => {
        return new CreateMessageController(
          new CreateMessageUseCase(
            new MessageRepository(),
            new MessageComponentRepository(),
            new ServerRepository()
          )
        ).handle(req, res)
      }
    )

    app.use(router)
  }
}

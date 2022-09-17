import { Application, Router } from 'express'
import { LoginUseCase } from '@src/useCases'
import { LoginController } from '@src/controllers'
import { FetchClientProvider } from '@src/providers'

export class Routes {
  constructor(app: Application) {
    const router = Router()

    router.use('/', async (req, res) => {
      return new LoginController(
        new LoginUseCase(new FetchClientProvider())
      ).handle(req, res)
    })

    app.use(router)
  }
}

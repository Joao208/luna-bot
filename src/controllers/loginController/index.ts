import { Request, Response } from 'express'
import { ILoginUseCase } from '@src/useCases/loginUseCase/ILoginUseCase'

export class LoginController {
  constructor(private loginUseCase: ILoginUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { code } = req.query as {
      code: string
    }

    const response = await this.loginUseCase.handle(code)

    return res.status(200).json(response)
  }
}

import { Request, Response } from 'express'
import { ILoginUseCase } from '@src/useCases/loginUseCase/ILoginUseCase'

export class LoginController {
  constructor(private loginUseCase: ILoginUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { code } = req.query as {
      code: string
    }

    const { refreshToken, token } = await this.loginUseCase.handle(code)

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })

    return res.status(301).redirect(`${process.env.APP_URL}/?token=${token}`)
  }
}

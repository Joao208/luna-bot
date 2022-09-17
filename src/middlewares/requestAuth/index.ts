import { IEncryptionProvider } from '@src/providers/encryptionProvider/IEncryptionProvider'
import { NextFunction, Request, Response } from 'express'

export class RequestAuth {
  constructor(private encryptionProvider: IEncryptionProvider) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers

      if (!authorization) return res.status(401).send('Token not provided')

      const [, token] = authorization.split(' ')

      if (!token) return res.status(401).send('Token not provided')

      const { UserId } = this.encryptionProvider.decrypt(token)

      if (!UserId) return res.status(401).send('Invalid token')

      req.body.UserId = UserId

      return next()
    } catch (error) {
      return res.status(401).send('Invalid token')
    }
  }
}

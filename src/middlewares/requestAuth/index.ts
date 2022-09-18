import { IEncryptionProvider } from '@src/providers/encryptionProvider/IEncryptionProvider'
import { IServerRepository } from '@src/repositories/serverRepository/IServerRepository'
import { NextFunction, Request, Response } from 'express'

export class RequestAuth {
  constructor(
    private encryptionProvider: IEncryptionProvider,
    private serverRepository: IServerRepository
  ) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers

      if (!authorization) return res.status(401).send('Token not provided')

      const [, token] = authorization.split(' ')

      if (!token) return res.status(401).send('Token not provided')

      const { OwnerId } = this.encryptionProvider.decrypt(token)

      if (!OwnerId) return res.status(401).send('Invalid token')

      req.body.OwnerId = OwnerId

      const ServerId =
        req.params.ServerId || req.body.ServerId || req.query.ServerId

      const foundServer = await this.serverRepository.findById(ServerId)

      if (!foundServer) return res.status(404).send('Server not found')

      const isServerOwner = await this.serverRepository.isTheServerOwner(
        ServerId,
        OwnerId
      )

      if (!isServerOwner) return res.status(401).send('Unauthorized')

      return next()
    } catch (error) {
      return res.status(401).send('Invalid token')
    }
  }
}

import { ICreateMessageUseCase } from '@src/useCases/createMessageUseCase/ICreateMessageUseCase'
import { Request, Response } from 'express'

export class CreateMessageController {
  constructor(private createMessageUseCase: ICreateMessageUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { ChannelId, components, message, name, type, ServerId, OwnerId } =
        req.body

      await this.createMessageUseCase.handle({
        ChannelId,
        components,
        message,
        name,
        ServerId,
        type,
        OwnerId,
      })

      return res.status(201).send()
    } catch (error) {
      return res.status(400).send((error as Error).message)
    }
  }
}

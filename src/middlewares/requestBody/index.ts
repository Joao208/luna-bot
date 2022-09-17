import loggerProvider from '@src/providers/loggerProvider'
import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export class RequestBody {
  handle(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const error = schema.validate(req)

      if (error.error) {
        loggerProvider.log({
          type: 'error',
          message: `Request body validation error: ${JSON.stringify(
            error.error?.details
          )}`,
        })

        return res.status(400).send('Invalid Request')
      }

      return next()
    }
  }
}

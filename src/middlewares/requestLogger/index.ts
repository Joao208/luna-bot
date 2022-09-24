import loggerProvider from '@src/providers/loggerProvider'
import { NextFunction, Request, Response } from 'express'

export class RequestLogger {
  handle(req: Request, _res: Response, next: NextFunction) {
    const { body, query, params, method, url } = req

    if (url === '/health') return next()

    loggerProvider.log({
      type: 'info',
      message: `Request received: ${method} ${url}, body: ${JSON.stringify({
        body,
        query,
        params,
      })}`,
    })

    return next()
  }
}

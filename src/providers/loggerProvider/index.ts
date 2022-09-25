import winston, { Logger } from 'winston'
import {
  ILoggerProvider,
  ILogProps,
} from '@src/providers/loggerProvider/ILoggerProvider'

class LoggerProvider implements ILoggerProvider {
  private logger: Logger

  constructor() {
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console({})],
    })
  }

  log({ type, message, ...rest }: ILogProps) {
    this.logger[type]({ level: type, message, ...rest })

    if (Object.values(rest).length) {
      this.logger[type]({ level: type, message, ...rest })
    }
  }
}

export default new LoggerProvider()

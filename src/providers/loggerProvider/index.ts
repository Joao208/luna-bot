import {
  ILoggerProvider,
  ILogProps,
} from '@src/providers/loggerProvider/ILoggerProvider'

class LoggerProvider implements ILoggerProvider {
  private logger: Console

  constructor() {
    this.logger = console
  }

  log({ type, message, ...rest }: ILogProps) {
    this.logger[type](message)

    if (Object.values(rest).length) {
      this.logger[type](rest)
    }
  }
}

export default new LoggerProvider()
